import { ApiResult } from './authService';
import { API_BASE_URL as ConfigApiBase } from '../config/apiConfig';

// 使用相对路径以触发 Vite Proxy转发到 http://localhost:8080
// @ts-ignore
const API_BASE_URL = ConfigApiBase;

export interface UserCardVO {
    studentId: string;
    name: string; // 姓名
    email: string;
    avatar: string;
    department: string;
    major: string;
    bio: string | null;
    roleName: string;
    joinedAt: string; // "2025-12-26T19:51:45"
}

export const userService = {
    /**
     * 获取用户公开卡片信息
     * Endpoint: /api/public/users/card/{studentId}
     * @param userId 用户标识（学号或ID）
     */
    async getUserCard(userId: number | string): Promise<ApiResult<UserCardVO>> {
        // 根据 Swagger: /api/public/users/card/{studentId}
        const response = await fetch(`${API_BASE_URL}/api/public/users/card/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || '获取用户信息失败');
        }

        return result;
    }
};
