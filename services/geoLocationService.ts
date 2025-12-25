/**
 * 地理位置服务
 * 负责获取用户位置、校验地理围栏、在请求中附加位置信息
 */

// @ts-ignore - Vite 环境变量
const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) || 'http://localhost:8080';

// 地理围栏配置
export interface GeoConfig {
  enabled: boolean;
  centerLat: number;
  centerLng: number;
  allowedRadiusMeters: number;
}

// 位置校验结果
export interface GeoCheckResult {
  allowed: boolean;
  message: string;
  geoFenceEnabled: boolean;
  locationAllowed: boolean;
  ipAllowed: boolean;
  distanceMeters?: number;
  centerLat?: number;
  centerLng?: number;
  allowedRadiusMeters?: number;
  clientIp?: string;
}

// 用户位置
export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

// 位置存储键名
const LOCATION_STORAGE_KEY = 'wic_user_location';
const GEO_CONFIG_STORAGE_KEY = 'wic_geo_config';
const GEO_CHECK_RESULT_KEY = 'wic_geo_check_result';

class GeoLocationService {
  private currentLocation: UserLocation | null = null;
  private geoConfig: GeoConfig | null = null;
  private checkResult: GeoCheckResult | null = null;
  private locationWatchId: number | null = null;
  private onLocationChangeCallbacks: ((location: UserLocation | null) => void)[] = [];
  private onCheckResultChangeCallbacks: ((result: GeoCheckResult | null) => void)[] = [];

  constructor() {
    // 从本地存储恢复状态
    this.loadFromStorage();
  }

  /**
   * 从本地存储加载位置信息
   */
  private loadFromStorage(): void {
    try {
      const locationStr = localStorage.getItem(LOCATION_STORAGE_KEY);
      if (locationStr) {
        const location = JSON.parse(locationStr) as UserLocation;
        // 检查位置是否过期（10分钟）
        if (Date.now() - location.timestamp < 10 * 60 * 1000) {
          this.currentLocation = location;
        }
      }

      const configStr = localStorage.getItem(GEO_CONFIG_STORAGE_KEY);
      if (configStr) {
        this.geoConfig = JSON.parse(configStr);
      }

      const resultStr = localStorage.getItem(GEO_CHECK_RESULT_KEY);
      if (resultStr) {
        this.checkResult = JSON.parse(resultStr);
      }
    } catch (e) {
      console.warn('加载位置信息失败:', e);
    }
  }

  /**
   * 保存位置到本地存储
   */
  private saveToStorage(): void {
    try {
      if (this.currentLocation) {
        localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(this.currentLocation));
      }
      if (this.geoConfig) {
        localStorage.setItem(GEO_CONFIG_STORAGE_KEY, JSON.stringify(this.geoConfig));
      }
      if (this.checkResult) {
        localStorage.setItem(GEO_CHECK_RESULT_KEY, JSON.stringify(this.checkResult));
      }
    } catch (e) {
      console.warn('保存位置信息失败:', e);
    }
  }

  /**
   * 获取当前位置
   */
  getCurrentLocation(): UserLocation | null {
    return this.currentLocation;
  }

  /**
   * 获取地理围栏配置
   */
  getGeoConfig(): GeoConfig | null {
    return this.geoConfig;
  }

  /**
   * 获取最近的校验结果
   */
  getCheckResult(): GeoCheckResult | null {
    return this.checkResult;
  }

  /**
   * 检查浏览器是否支持地理定位
   */
  isGeolocationSupported(): boolean {
    return 'geolocation' in navigator;
  }

  /**
   * 请求获取用户位置
   */
  async requestLocation(): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!this.isGeolocationSupported()) {
        reject(new Error('您的浏览器不支持地理定位功能'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: UserLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now(),
          };
          this.currentLocation = location;
          this.saveToStorage();
          this.notifyLocationChange(location);
          resolve(location);
        },
        (error) => {
          let message = '获取位置失败';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              message = '您已拒绝位置权限，部分功能可能受限';
              break;
            case error.POSITION_UNAVAILABLE:
              message = '无法获取位置信息';
              break;
            case error.TIMEOUT:
              message = '获取位置超时';
              break;
          }
          reject(new Error(message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000, // 1分钟内的缓存位置可以接受
        }
      );
    });
  }

  /**
   * 开始持续监听位置变化
   */
  startWatchingLocation(): void {
    if (this.locationWatchId !== null) {
      return; // 已经在监听
    }

    if (!this.isGeolocationSupported()) {
      return;
    }

    this.locationWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        };
        this.currentLocation = location;
        this.saveToStorage();
        this.notifyLocationChange(location);
      },
      (error) => {
        console.warn('位置监听错误:', error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 120000, // 2分钟
      }
    );
  }

  /**
   * 停止监听位置变化
   */
  stopWatchingLocation(): void {
    if (this.locationWatchId !== null) {
      navigator.geolocation.clearWatch(this.locationWatchId);
      this.locationWatchId = null;
    }
  }

  /**
   * 从后端获取地理围栏配置
   */
  async fetchGeoConfig(): Promise<GeoConfig> {
    const response = await fetch(`${API_BASE_URL}/api/geo/config`);
    const result = await response.json();
    
    if (result.code === 200) {
      this.geoConfig = result.data;
      this.saveToStorage();
      return result.data;
    }
    
    throw new Error(result.message || '获取配置失败');
  }

  /**
   * 向后端校验位置
   */
  async checkLocation(latitude?: number, longitude?: number): Promise<GeoCheckResult> {
    const location = latitude !== undefined && longitude !== undefined 
      ? { latitude, longitude }
      : this.currentLocation;

    const response = await fetch(`${API_BASE_URL}/api/geo/check`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        latitude: location?.latitude,
        longitude: location?.longitude,
      }),
    });

    const result = await response.json();
    
    if (result.code === 200) {
      this.checkResult = result.data;
      this.saveToStorage();
      this.notifyCheckResultChange(result.data);
      return result.data;
    }
    
    throw new Error(result.message || '位置校验失败');
  }

  /**
   * 自动获取位置并校验
   * 返回是否在允许范围内
   */
  async autoCheckLocation(): Promise<GeoCheckResult> {
    try {
      // 先获取配置
      await this.fetchGeoConfig();
      
      // 如果地理围栏未启用，直接返回允许
      if (!this.geoConfig?.enabled) {
        const result: GeoCheckResult = {
          allowed: true,
          message: '地理围栏未启用',
          geoFenceEnabled: false,
          locationAllowed: true,
          ipAllowed: true,
        };
        this.checkResult = result;
        return result;
      }

      // 尝试获取位置
      try {
        await this.requestLocation();
      } catch (e) {
        console.warn('获取位置失败，将使用IP校验:', e);
      }

      // 向后端校验
      return await this.checkLocation();
    } catch (e) {
      console.error('自动位置校验失败:', e);
      throw e;
    }
  }

  /**
   * 获取用于API请求的位置头信息
   */
  getLocationHeaders(): Record<string, string> {
    if (!this.currentLocation) {
      return {};
    }
    return {
      'X-Latitude': this.currentLocation.latitude.toString(),
      'X-Longitude': this.currentLocation.longitude.toString(),
    };
  }

  /**
   * 订阅位置变化
   */
  onLocationChange(callback: (location: UserLocation | null) => void): () => void {
    this.onLocationChangeCallbacks.push(callback);
    return () => {
      const index = this.onLocationChangeCallbacks.indexOf(callback);
      if (index > -1) {
        this.onLocationChangeCallbacks.splice(index, 1);
      }
    };
  }

  /**
   * 订阅校验结果变化
   */
  onCheckResultChange(callback: (result: GeoCheckResult | null) => void): () => void {
    this.onCheckResultChangeCallbacks.push(callback);
    return () => {
      const index = this.onCheckResultChangeCallbacks.indexOf(callback);
      if (index > -1) {
        this.onCheckResultChangeCallbacks.splice(index, 1);
      }
    };
  }

  private notifyLocationChange(location: UserLocation | null): void {
    this.onLocationChangeCallbacks.forEach((cb) => cb(location));
  }

  private notifyCheckResultChange(result: GeoCheckResult | null): void {
    this.onCheckResultChangeCallbacks.forEach((cb) => cb(result));
  }

  /**
   * 清除所有位置数据
   */
  clearLocation(): void {
    this.currentLocation = null;
    this.checkResult = null;
    localStorage.removeItem(LOCATION_STORAGE_KEY);
    localStorage.removeItem(GEO_CHECK_RESULT_KEY);
    this.notifyLocationChange(null);
    this.notifyCheckResultChange(null);
  }
}

// 导出单例
export const geoLocationService = new GeoLocationService();

export default geoLocationService;
