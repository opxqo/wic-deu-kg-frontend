import { apiClient, ApiResult } from './apiClient';

export interface SeniorMessageVO {
    id: number;
    content: string;
    signature: string;
    cardColor: string;
    inkColor: string;
    font: {
        id: number;
        name: string;
        cssClass: string;
        fontFamily: string;
    };
    likeCount: number;
    liked: boolean;
    createdAt: string;
    status?: number; // 0-Pending, 1-Published, 2-Rejected
}

export interface MessageStats {
    pending: number;
    published: number;
    rejected: number;
    total: number;
}

export const messageService = {
    /**
     * 获取所有留言 (Admin)
     * Endpoint: GET /api/admin/messages
     */
    async getMessages(params: { page?: number; size?: number; keyword?: string; status?: number }): Promise<ApiResult<any>> {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.size) query.append('size', params.size.toString());
        if (params.keyword) query.append('keyword', params.keyword);
        if (params.status !== undefined) query.append('status', params.status.toString());

        return apiClient.get<any>(`/api/admin/messages?${query.toString()}`);
    },

    /**
     * 获取留言统计 (Admin)
     * Endpoint: GET /api/admin/messages/stats
     */
    async getMessageStats(): Promise<ApiResult<MessageStats>> {
        return apiClient.get<MessageStats>('/api/admin/messages/stats');
    },

    /**
     * 审核通过 (Admin)
     * Endpoint: PUT /api/admin/messages/{id}/approve
     */
    async approveMessage(id: number | string): Promise<ApiResult<void>> {
        return apiClient.put<void>(`/api/admin/messages/${id}/approve`);
    },

    /**
     * 审核拒绝 (Admin)
     * Endpoint: PUT /api/admin/messages/{id}/reject
     */
    async rejectMessage(id: number | string, reason?: string): Promise<ApiResult<void>> {
        const query = reason ? `?reason=${encodeURIComponent(reason)}` : '';
        return apiClient.put<void>(`/api/admin/messages/${id}/reject${query}`);
    },

    /**
     * 删除留言 (Admin)
     * Endpoint: DELETE /api/admin/messages/{id}
     */
    async deleteMessage(id: number | string): Promise<ApiResult<void>> {
        return apiClient.delete<void>(`/api/admin/messages/${id}`);
    },

    /**
     * 批量审核通过 (Admin)
     * Endpoint: PUT /api/admin/messages/batch/approve
     */
    async batchApprove(ids: number[]): Promise<ApiResult<void>> {
        return apiClient.put<void>('/api/admin/messages/batch/approve', ids);
    },

    /**
     * 批量审核拒绝 (Admin)
     * Endpoint: PUT /api/admin/messages/batch/reject
     */
    async batchReject(ids: number[], reason?: string): Promise<ApiResult<void>> {
        const query = reason ? `?reason=${encodeURIComponent(reason)}` : '';
        return apiClient.put<void>(`/api/admin/messages/batch/reject${query}`, ids);
    },

    /**
     * 批量删除 (Admin)
     * Endpoint: DELETE /api/admin/messages/batch
     */
    async batchDelete(ids: number[]): Promise<ApiResult<void>> {
        return apiClient.request<void>('/api/admin/messages/batch', {
            method: 'DELETE',
            body: ids
        });
    }
};
