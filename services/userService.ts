import { apiClient, ApiResult } from './apiClient';

export interface UserCardVO {
    studentId: string;
    name: string; // 姓名
    email: string;
    avatar: string;
    department: string;
    major: string;
    bio: string | null;
    roleName: string;
    createdAt: string; // "2025-12-26T19:51:45"
}

export const userService = {
    /**
     * 获取用户公开卡片信息 (V3)
     * Endpoint: GET /api/users/{studentId}
     * @param userId 用户标识（学号）
     */
    async getUserCard(userId: number | string): Promise<ApiResult<UserCardVO>> {
        // V3 接口地址: /api/users/public/{studentId}
        // 响应 200 OK 直接返回 UserCardVO (无 code) -> apiClient 会自动包装
        // 响应 404 返回 ApiResponseUserCardVO (有 code) -> apiClient 原样返回
        return apiClient.get<UserCardVO>(`/api/users/public/${userId}`);
    },

    /**
     * 获取带有头像的用户列表 (Footer展示)
     * Endpoint: GET /api/users/public/avatars
     */
    /**
     * 获取带有头像的用户列表 (Footer展示)
     * Endpoint: GET /api/users/public/avatars
     */
    async getUsersWithAvatar(): Promise<ApiResult<UserAvatarVO[]>> {
        return apiClient.get<UserAvatarVO[]>('/api/users/public/avatars');
    },

    // --- Admin APIs ---

    /**
     * 获取用户列表 (Admin)
     * Endpoint: GET /api/admin/users
     */
    async getUsers(params: { page?: number; size?: number; keyword?: string; role?: number; status?: number }): Promise<ApiResult<any>> {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.size) query.append('size', params.size.toString());
        if (params.keyword) query.append('keyword', params.keyword);
        if (params.role) query.append('role', params.role.toString());
        if (params.status !== undefined) query.append('status', params.status.toString());

        return apiClient.get<any>(`/api/admin/users?${query.toString()}`);
    },

    /**
     * 更新用户状态 (Admin)
     * Endpoint: PATCH /api/admin/users/{id}/status
     */
    async updateUserStatus(id: number | string, status: number): Promise<ApiResult<void>> {
        return apiClient.request<void>(`/api/admin/users/${id}/status?status=${status}`, {
            method: 'PATCH'
        });
    },

    /**
     * 更新用户角色 (Admin)
     * Endpoint: PATCH /api/admin/users/{id}/role
     */
    async updateUserRole(id: number | string, role: number): Promise<ApiResult<void>> {
        return apiClient.request<void>(`/api/admin/users/${id}/role?role=${role}`, {
            method: 'PATCH'
        });
    },

    /**
     * 更新用户信息 (Admin)
     * Endpoint: PATCH /api/admin/users/{id}
     */
    async updateUserDetails(id: number | string, data: { name?: string; department?: string; major?: string; email?: string }): Promise<ApiResult<void>> {
        return apiClient.request<void>(`/api/admin/users/${id}`, {
            method: 'PATCH',
            body: { ...data, userId: id }
        });
    },

    /**
     * 删除用户 (Admin)
     * Endpoint: DELETE /api/admin/users/{id}
     */
    async deleteUser(id: number | string): Promise<ApiResult<void>> {
        return apiClient.delete<void>(`/api/admin/users/${id}`);
    }
};

export interface UserAvatarVO {
    studentId: string;
    name?: string;
    avatar: string;
}

// User Management Types
export interface UserListVO {
    id: number;
    studentId: string;
    username: string;
    name: string;
    email: string;
    avatar: string;
    department: string;
    major: string;
    role: number; // 1=Organizer, 2=Admin, 3=User
    roleName: string;
    status: number; // 0=Inactive, 1=Active, 2=Banned
    createdAt: string;
}
