import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Calendar, User, Clock, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { articleService } from "@/services/articleService";
import { Article as ArticleType } from "@/types/article";

const Article: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [article, setArticle] = useState<ArticleType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) return;

            try {
                setLoading(true);
                // During development/demo if backend is not ready, we can still use mock data fallback
                // provided by the service or handled here if API fails.
                // For now, we assume strict API integration as requested.
                const response = await articleService.getArticleById(id);
                if (response.code === 0 && response.data) {
                    setArticle(response.data);
                } else {
                    setError(response.msg || "Failed to load article");
                }
            } catch (err) {
                console.error(err);
                setError("Network error or article not found");
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4 text-slate-500">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <p>正在加载文章...</p>
                </div>
            </div>
        );
    }

    if (error || !article) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center max-w-md px-4">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">无法加载文章</h2>
                    <p className="text-slate-500 mb-8">{error || "The requested article could not be found."}</p>
                    <Link to="/">
                        <Button>返回首页</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pb-12">
            {/* Hero Header with Background */}
            <div className="relative w-full h-[500px] mb-12">
                <div className="absolute inset-0">
                    <img
                        src={article.coverImage || "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2070&auto=format&fit=crop"}
                        alt="Article Background"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/30" />
                </div>

                <div className="relative h-full max-w-3xl mx-auto px-4 md:px-8 flex flex-col justify-end pb-12">
                    {/* Navigation */}
                    <Link to="/" className="inline-flex items-center text-sm text-slate-300 hover:text-white mb-6 transition-colors w-fit">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        返回首页
                    </Link>

                    {article.tags && article.tags.length > 0 && (
                        <div className="flex gap-2 mb-6">
                            {article.tags.map(tag => (
                                <span key={tag} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-500/20 text-blue-100 border-blue-400/30 backdrop-blur-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-white mb-4 shadow-sm">
                        {article.title}
                    </h1>
                    <p className="text-xl text-slate-200 mb-6 max-w-2xl">
                        {article.subtitle}
                    </p>

                    <div className="flex items-center gap-6 text-sm text-slate-300">
                        <div className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            {article.author}
                        </div>
                        <div className="flex items-center">
                            <Calendar className="mr-2 h-4 w-4" />
                            {article.publishDate}
                        </div>
                        <div className="flex items-center">
                            <Clock className="mr-2 h-4 w-4" />
                            {article.readTime}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-3xl mx-auto px-4 md:px-8">
                {/* Content - Shadcn Typography Styles - Wrapped in Card for cleanliness */}
                <div className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800">
                    {/* Using dangerouslySetInnerHTML to render HTML content from backend */}
                    <article
                        className="prose prose-slate dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: article.content }}
                    />
                </div>

                {/* Footer */}
                <div className="mt-12 flex justify-between items-center px-4">
                    <div className="text-slate-500 text-sm">
                        © 2025 武汉城市学院
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" size="sm">分享</Button>
                        <Button size="sm">收藏本文</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Article;
