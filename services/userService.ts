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
    }
};
