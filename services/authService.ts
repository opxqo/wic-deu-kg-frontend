// API 基础配置
// @ts-ignore
const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) || '';

// 登录请求参数
export interface LoginRequest {
  studentId: string;
  password: string;
}

// 注册请求参数
export interface RegisterRequest {
  studentId: string;    // 学号（必填）
  username: string;     // 用户名（必填）
  password: string;     // 密码（必填）
  name: string;         // 真实姓名（必填）
  email?: string;       // 邮箱（可选）
  department?: string;  // 院系（可选）
  major?: string;       // 专业（可选）
}

// 用户信息 VO
export interface UserVO {
  id: number;
  studentId: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  department: string;
  major: string;
  bio: string;
  status: number;      // 0-未激活, 1-正常, 2-禁用
  role: number;        // 1-组织者, 2-管理员, 3-普通用户
  roleName: string;
  createdAt: string;
}

// 登录响应
export interface LoginResponse {
  token: string;
  tokenType: string;
  expiresIn: number;
  user: UserVO;
}

// API 响应包装
export interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}

// 登录 API
export const authService = {
  /**
   * 用户登录
   * @param data 登录请求参数（学号和密码）
   * @returns 登录响应（JWT令牌和用户信息）
   */
  async login(data: LoginRequest): Promise<ApiResult<LoginResponse>> {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // 处理不同的响应状态码
    if (!response.ok) {
      // 401: 学号或密码错误
      // 403: 账号未激活或已被禁用
      throw new Error(result.message || '登录失败');
    }

    return result;
  },

  /**
   * 保存登录凭证到本地存储
   * @param token JWT令牌
   * @param user 用户信息
   */
  saveAuth(token: string, user: UserVO): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  /**
   * 从本地存储获取令牌
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  },

  /**
   * 从本地存储获取用户信息
   */
  getUser(): UserVO | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  /**
   * 清除登录凭证
   */
  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  /**
   * 用户登出
   * 调用后端接口注销登录状态，并清除本地存储
   */
  async logout(): Promise<void> {
    const token = this.getToken();

    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      // 即使后端请求失败，也要清除本地存储
      console.error('登出请求失败:', error);
    } finally {
      // 无论如何都清除本地存储
      this.clearAuth();
    }
  },

  /**
   * 检查是否已登录
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  /**
   * 用户注册
   * @param data 注册请求参数
   * @returns 注册成功后返回用户信息
   */
  async register(data: RegisterRequest): Promise<ApiResult<UserVO>> {
    const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      // 400: 学号/用户名/邮箱已被使用
      throw new Error(result.message || '注册失败');
    }

    return result;
  },

  /**
   * 激活账号
   * @param email 邮箱
   * @param code 6位验证码
   */
  async activateAccount(email: string, code: string): Promise<ApiResult<string>> {
    const response = await fetch(`${API_BASE_URL}/api/auth/activate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, code }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || '激活失败');
    }

    return result;
  },

  /**
   * 重新发送激活验证码
   * @param email 邮箱
   */
  async resendActivationCode(email: string): Promise<ApiResult<string>> {
    const response = await fetch(`${API_BASE_URL}/api/auth/send-activation-code?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || '发送失败');
    }

    return result;
  },

  /**
   * 更新个人资料
   * @param data 更新的字段（name, email, department, major, bio, avatar）
   * @returns 更新后的用户信息
   */
  async updateProfile(data: {
    name?: string;
    email?: string;
    department?: string;
    major?: string;
    bio?: string;
    avatar?: string;
  }): Promise<ApiResult<UserVO>> {
    const token = this.getToken();
    if (!token) {
      throw new Error('未登录');
    }

    const response = await fetch(`${API_BASE_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || result.code !== 200) {
      throw new Error(result.message || '更新失败');
    }

    // 更新本地存储的用户信息
    if (result.data) {
      localStorage.setItem('user', JSON.stringify(result.data));
    }

    return result;
  },

  /**
   * 上传用户头像
   * @param file 头像文件
   * @returns 更新后的用户信息
   */
  async uploadAvatar(file: File): Promise<ApiResult<UserVO>> {
    const token = this.getToken();
    if (!token) {
      throw new Error('未登录');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/api/auth/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();

    if (!response.ok || result.code !== 200) {
      throw new Error(result.message || '上传失败');
    }

    // 更新本地存储的用户信息
    if (result.data) {
      localStorage.setItem('user', JSON.stringify(result.data));
    }

    return result;
  },
};

export default authService;
