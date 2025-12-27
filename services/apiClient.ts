/**
 * API 客户端
 * 封装所有 API 请求，自动添加认证和地理位置信息
 */

import { geoLocationService } from './geoLocationService';

// @ts-ignore - Vite 环境变量
const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) || '';

// API 响应包装
export interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}

// 请求配置
interface RequestConfig extends Omit<RequestInit, 'body'> {
  skipAuth?: boolean;      // 是否跳过认证
  skipLocation?: boolean;  // 是否跳过位置信息
  body?: any;              // 请求体
}

/**
 * API 客户端类
 */
class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * 获取认证头
   */
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    if (token) {
      return { 'Authorization': `Bearer ${token}` };
    }
    return {};
  }

  /**
   * 获取位置头
   */
  private getLocationHeaders(): Record<string, string> {
    return geoLocationService.getLocationHeaders();
  }

  /**
   * 构建请求头
   */
  private buildHeaders(config: RequestConfig): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(config.headers as Record<string, string> || {}),
    };

    // 添加认证头
    if (!config.skipAuth) {
      Object.assign(headers, this.getAuthHeaders());
    }

    // 添加位置头
    if (!config.skipLocation) {
      Object.assign(headers, this.getLocationHeaders());
    }

    return headers;
  }

  /**
   * 发起请求
   */
  async request<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResult<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = this.buildHeaders(config);

    const fetchConfig: RequestInit = {
      ...config,
      headers,
    };

    // 处理请求体
    if (config.body !== undefined) {
      if (config.body instanceof FormData) {
        // FormData 不需要设置 Content-Type，浏览器会自动设置
        delete headers['Content-Type'];
        fetchConfig.body = config.body;
      } else {
        fetchConfig.body = JSON.stringify(config.body);
      }
    }

    try {
      const response = await fetch(url, fetchConfig);
      const result = await response.json();

      // 处理 403 地理围栏错误
      if (response.status === 403 && result.code === 403) {
        // 可以触发一个事件通知应用
        window.dispatchEvent(new CustomEvent('geo-fence-blocked', { detail: result }));
      }

      // 处理 401 未授权
      if (response.status === 401) {
        // 清除本地凭证
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // 触发事件
        window.dispatchEvent(new CustomEvent('auth-expired'));
      }

      return result;
    } catch (error: any) {
      // 网络错误
      return {
        code: -1,
        message: error.message || '网络请求失败',
        data: null as any,
      };
    }
  }

  /**
   * GET 请求
   */
  async get<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { ...config, method: 'GET' });
  }

  /**
   * POST 请求
   */
  async post<T>(endpoint: string, body?: any, config: RequestConfig = {}): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { ...config, method: 'POST', body });
  }

  /**
   * PUT 请求
   */
  async put<T>(endpoint: string, body?: any, config: RequestConfig = {}): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { ...config, method: 'PUT', body });
  }

  /**
   * DELETE 请求
   */
  async delete<T>(endpoint: string, config: RequestConfig = {}): Promise<ApiResult<T>> {
    return this.request<T>(endpoint, { ...config, method: 'DELETE' });
  }

  /**
   * 上传文件
   */
  async upload<T>(endpoint: string, file: File, fieldName: string = 'file', extraData?: Record<string, string>): Promise<ApiResult<T>> {
    const formData = new FormData();
    formData.append(fieldName, file);

    if (extraData) {
      Object.entries(extraData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    return this.request<T>(endpoint, {
      method: 'POST',
      body: formData,
    });
  }
}

// 导出单例
export const apiClient = new ApiClient();

export default apiClient;
