
export interface ArticleTag {
    id: string;
    name: string;
}

export interface Article {
    id: string;
    title: string;
    subtitle?: string; // 副标题，可选
    author: string;
    publishDate: string; // ISO 8601 format: YYYY-MM-DD
    createdAt?: string;
    readTime: string; // e.g. "5 min read"
    coverImage?: string; // 顶部大图 URL
    tags: string[]; // 标签列表
    content: string; // HTML 格式的内容 string

    // SEO related (Optional)
    metaDescription?: string;
    keywords?: string[];
}

export interface ArticleResponse {
    code: number; // 0 for success
    msg: string;
    data: Article;
}

export interface PageArticleResponse {
    code: number;
    msg: string;
    data: {
        records: Article[];
        total: number;
        size: number;
        current: number;
        pages: number;
    };
}
