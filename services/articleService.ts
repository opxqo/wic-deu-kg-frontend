import { ArticleResponse, PageArticleResponse } from "@/types/article";

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
    }
};
