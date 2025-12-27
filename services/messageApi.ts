import { API_BASE_URL } from '../src/config/apiConfig';
// API service for Senior Messages
const API_BASE = API_BASE_URL;

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

// Helper to get auth token
const getAuthToken = (): string | null => {
    return localStorage.getItem('token');
};

// Helper to create headers
const createHeaders = (includeAuth: boolean = false): HeadersInit => {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }
    return headers;
};

// API functions
export const messageApi = {
    // Get messages list (public, but auth optional for liked status)
    async getMessages(page: number = 1, size: number = 20, keyword?: string): Promise<{ data: PageSeniorMessageVO }> {
        const token = getAuthToken();
        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const queryParams = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
        });

        if (keyword && keyword.trim()) {
            queryParams.append('keyword', keyword.trim());
        }

        const response = await fetch(
            `${API_BASE}/api/public/messages?${queryParams.toString()}`,
            { headers }
        );

        const result = await response.json();

        if (!response.ok || result.code !== 0) {
            throw new Error(`Failed to fetch messages: ${response.statusText}`);
        }

        return result;
    },

    // Get my messages (requires auth)
    async getMyMessages(page: number = 1, size: number = 20): Promise<{ data: PageSeniorMessageVO }> {
        const response = await fetch(
            `${API_BASE}/api/messages/my?page=${page}&size=${size}`,
            { headers: createHeaders(true) }
        );

        const result = await response.json();

        if (!response.ok || result.code !== 0) {
            throw new Error(`Failed to fetch my messages: ${response.statusText}`);
        }

        return result;
    },

    // Create new message (requires auth)
    async createMessage(data: CreateMessageRequest): Promise<{ data: SeniorMessageVO }> {
        const response = await fetch(`${API_BASE}/api/messages`, {
            method: 'POST',
            headers: createHeaders(true),
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok || result.code !== 0) {
            const error = result;
            throw new Error(error.message || 'Failed to create message');
        }

        return result;
    },

    // Toggle like (requires auth)
    async toggleLike(messageId: number): Promise<{ data: number }> {
        const response = await fetch(`${API_BASE}/api/messages/${messageId}/like`, {
            method: 'POST',
            headers: createHeaders(true),
        });

        const result = await response.json();

        if (!response.ok || result.code !== 0) {
            throw new Error('Failed to toggle like');
        }

        return result;
    },

    // Delete message (requires auth, own message only)
    async deleteMessage(messageId: number): Promise<void> {
        const response = await fetch(`${API_BASE}/api/messages/${messageId}`, {
            method: 'DELETE',
            headers: createHeaders(true),
        });

        const result = await response.json() as { code: number };

        if (!response.ok || result.code !== 0) {
            throw new Error('Failed to delete message');
        }
    },

    // Get available fonts
    async getFonts(): Promise<{ data: MessageFont[] }> {
        const response = await fetch(`${API_BASE}/api/public/messages/fonts`);

        const result = await response.json();

        if (!response.ok || result.code !== 0) {
            throw new Error('Failed to fetch fonts');
        }

        return result;
    },
};

export default messageApi;
