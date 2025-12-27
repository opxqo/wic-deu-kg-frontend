import { apiClient, ApiResult } from './apiClient';

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

// 登录响应 (V3: 包含 token 和用户信息的混合体)
export interface LoginResponse {
  token: string;
  user: UserVO;
}

// 激活结果 VO
export interface ActivationResultVO {
  success: boolean;
  message: string;
  username: string;
  studentId: string;
  email: string;
  activatedAt: string;
}

// 登录 API
export const authService = {
  /**
   * 用户登录 (V3)
   * ENDPOINT: POST /api/sessions
   */
  async login(data: LoginRequest): Promise<ApiResult<LoginResponse>> {
    // V3 登录接口直接返回 { token: "...", user: { ... } }
    // 状态码 201 Created
    const result = await apiClient.post<LoginResponse>('/api/sessions', data);

    // 如果成功，自动保存
    if (result.code === 0 && result.data) {
      // V3 接口可能直接返回 UserVO 在 data 里，或者 data 本身包含 token/user ??
      // 根据 apiClient 的智能兼容：
      // 如果后端返回 201 Created: { token: "...", user: {...} }
      // apiClient 会将其包装为 { code:0, data: { token, user } }
      // 所以 result.data 就是那个对象
      const responseData = result.data as any; // 临时断言，需确认结构
      if (responseData.token && responseData.user) {
        this.saveAuth(responseData.token, responseData.user);
      }
    }

    return result;
  },

  /**
   * 保存登录凭证到本地存储
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
   */
  async logout(): Promise<void> {
    try {
      await apiClient.delete('/api/sessions');
    } catch (error) {
      console.error('登出请求失败:', error);
    } finally {
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
   * 用户注册 (V3)
   * ENDPOINT: POST /api/users
   */
  async register(data: RegisterRequest): Promise<ApiResult<UserVO>> {
    // V3 注册接口直接返回 UserVO
    // 状态码 201 Created
    return apiClient.post<UserVO>('/api/users', data);
  },

  /**
   * 激活账号 (V3)
   * ENDPOINT: PATCH /api/users/me/status
   */
  async activateAccount(email: string, code: string): Promise<ApiResult<ActivationResultVO>> {
    // 根据文档 (全部接口.md:8015) 确认接口为 PATCH /api/users/me/status
    return apiClient.request<ActivationResultVO>('/api/users/me/status', {
      method: 'PATCH',
      body: { email, code }
    });
  },

  /**
   * 重新发送激活验证码
   */
  async resendActivationCode(email: string): Promise<ApiResult<string>> {
    return apiClient.post<string>(`/api/auth/send-activation-code?email=${encodeURIComponent(email)}`);
  },

  /**
   * 更新个人资料 (V3)
   * ENDPOINT: PATCH /api/users/me
   */
  async updateProfile(data: {
    username?: string; // V3 允许改用户名?
    name?: string;
    email?: string;
    department?: string;
    major?: string;
    bio?: string;
    avatar?: string;
  }): Promise<ApiResult<UserVO>> {
    // V3 使用 PATCH
    const result = await apiClient.request<UserVO>('/api/users/me', {
      method: 'PATCH',
      body: data
    });

    if (result.code === 0 && result.data) {
      localStorage.setItem('user', JSON.stringify(result.data));
    }
    return result;
  },

  /**
   * 上传用户头像 (V3)
   * 1. Upload to /api/images
   * 2. Update profile with avatar URL
   */
  async uploadAvatar(file: File): Promise<ApiResult<UserVO>> {
    // 1. 上传图片
    // FormData: file, title=avatar
    const uploadRes = await apiClient.upload<any>('/api/images', file, 'file', { title: 'avatar' });

    if (uploadRes.code !== 0 || !uploadRes.data) {
      throw new Error(uploadRes.message || '头像上传失败');
    }

    const imageUrl = uploadRes.data.imageUrl || uploadRes.data.url; // 需确认返回字段
    if (!imageUrl) {
      throw new Error('无法获取图片地址');
    }

    // 2. 更新资料
    return this.updateProfile({ avatar: imageUrl });
  },

  /** 
   * 获取当前用户信息 (V3)
   * ENDPOINT: GET /api/users/me
   */
  async fetchCurrentUser(): Promise<ApiResult<UserVO>> {
    const result = await apiClient.get<UserVO>('/api/users/me');
    if (result.code === 0 && result.data) {
      localStorage.setItem('user', JSON.stringify(result.data));
    }
    return result;
  }
};

export default authService;
