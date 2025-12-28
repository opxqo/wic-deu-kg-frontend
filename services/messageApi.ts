import { apiClient, ApiResult } from './apiClient';

// Types matching backend schema
export interface FontInfo {
    id: number;
    name: string;
    cssClass: string;
    fontFamily: string;
}

export interface SeniorMessageVO {
    id: number;
    content: string;
    signature: string;
    cardColor: string;
    inkColor: string;
    font: FontInfo;
    likeCount: number;
    liked: boolean;
    createdAt: string;
}

export interface PageSeniorMessageVO {
    records: SeniorMessageVO[];
    total: number;
    size: number;
    current: number;
    pages: number;
}

export interface CreateMessageRequest {
    content: string;
    signature?: string;
    cardColor?: string;
    inkColor?: string;
    fontId?: number;
}

export interface MessageFont {
    id: number;
    name: string;
    cssClass: string;
    fontFamily: string;
    status: number;
    sortOrder: number;
}

// API public functions
export const messageApi = {
    // Get messages list (public)
    // V3: GET /api/messages
    async getMessages(page: number = 1, size: number = 20, keyword?: string): Promise<ApiResult<PageSeniorMessageVO>> {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('size', size.toString());
        if (keyword) params.append('keyword', keyword.trim());

        return apiClient.get<PageSeniorMessageVO>(`/api/messages?${params.toString()}`);
    },

    // Get my messages (auth)
    // V3: GET /api/users/me/messages (猜测) or GET /api/messages?my=true
    // 暂定: /api/users/me/messages
    async getMyMessages(page: number = 1, size: number = 20): Promise<ApiResult<PageSeniorMessageVO>> {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('size', size.toString());

        // 尝试 /api/users/me/messages
        return apiClient.get<PageSeniorMessageVO>(`/api/users/me/messages?${params.toString()}`);
    },

    // Get user messages (public/admin depending on use case, but here likely public for testing)
    // Endpoint: GET /api/messages/user/{studentId}
    async getUserMessages(studentId: string, page: number = 1, size: number = 20): Promise<ApiResult<PageSeniorMessageVO>> {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('size', size.toString());
        return apiClient.get<PageSeniorMessageVO>(`/api/messages/user/${studentId}?${params.toString()}`);
    },

    // Create new message (auth)
    // V3: POST /api/messages
    async createMessage(data: CreateMessageRequest): Promise<ApiResult<SeniorMessageVO>> {
        return apiClient.post<SeniorMessageVO>('/api/messages', data);
    },

    // Toggle like (auth)
    // V3: POST /api/messages/{id}/likes
    async toggleLike(messageId: number): Promise<ApiResult<number>> {
        // Assume API returns count or object. The old code expected number.
        // Let's use generic any or check doc.
        // Assuming /api/messages/{id}/likes returns { liked: boolean, likeCount: number } usually.
        // But frontend expects number? Old code cast result as number.
        // Adapt return type if needed.
        const res = await apiClient.post<any>(`/api/messages/${messageId}/likes`);
        // If data is { likeCount: 123 }, return that.
        // If data is just number (unlikely in V3 standard object), return it.
        if (res.code === 0 && res.data && typeof res.data.likeCount === 'number') {
            return { ...res, data: res.data.likeCount };
        }
        return res;
    },

    // Delete message (auth)
    // V3: DELETE /api/messages/{id}
    async deleteMessage(messageId: number): Promise<void> {
        await apiClient.delete(`/api/messages/${messageId}`);
    },

    // Get available fonts
    // V3: GET /api/messages/fonts (public)
    async getFonts(): Promise<ApiResult<MessageFont[]>> {
        return apiClient.get<MessageFont[]>('/api/messages/fonts');
    }
};

export default messageApi;
