import { ArticleResponse, PageArticleResponse, Article } from "@/types/article";

const API_BASE_URL = '/api';

export const articleService = {
    /**
     * Get paginated list of articles
     */
    getArticles: async (page = 1, size = 10, keyword = ''): Promise<PageArticleResponse> => {
        const params = new URLSearchParams({
            page: page.toString(),
            size: size.toString(),
            keyword
        });
        try {
            const response = await fetch(`${API_BASE_URL}/article?${params.toString()}`);
            if (!response.ok) {
                throw new Error(`Error fetching articles: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch article list:", error);
            throw error;
        }
    },

    /**
     * Get article details by ID
     */
    getArticleById: async (id: string): Promise<ArticleResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/article/${id}`);
            if (!response.ok) {
                throw new Error(`Error fetching article: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to fetch article:", error);
            throw error;
        }
    },
    /**
     * Create a new article
     */
    createArticle: async (data: Partial<Article>): Promise<ArticleResponse> => {
        try {
            const response = await fetch(`${API_BASE_URL}/article`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${token}` // Assuming auth token is handled by interceptor or cookie
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`Error creating article: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to create article:", error);
            throw error;
        }
    },

    /**
     * Update an existing article
     */
    updateArticle: async (data: Partial<Article>): Promise<ArticleResponse> => {
        if (!data.id) throw new Error("Article ID is required for update");
        try {
            const response = await fetch(`${API_BASE_URL}/article`, { // Assuming PUT /api/article for update based on standard REST or common patterns
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`Error updating article: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Failed to update article:", error);
            throw error;
        }
    },

    /**
     * Delete an article
     */
    deleteArticle: async (id: string | number): Promise<any> => {
        try {
            const response = await fetch(`${API_BASE_URL}/article/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`Error deleting article: ${response.statusText}`);
            }
            return await response.json(); // Assuming returns standard response envelope
        } catch (error) {
            console.error("Failed to delete article:", error);
            throw error;
        }
    }
};

