
import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { articleService } from "@/services/articleService";
import { Article } from "@/types/article";
import { Loader2, Plus, Pencil, Trash2, Search } from "lucide-react";


export default function ArticleManagement() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const { toast } = useToast();

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentArticle, setCurrentArticle] = useState<Partial<Article>>({});

    const fetchArticles = async () => {
        setLoading(true);
        try {
            const response = await articleService.getArticles(page, 10, keyword);
            // Handle both legacy and strict response formats
            if ((response as any).data?.records) {
                setArticles((response as any).data.records);
                setTotal((response as any).data.total);
                setTotalPages((response as any).data.pages);
            } else if (response.code === 0 && response.data) {
                setArticles(response.data.records);
                setTotal(response.data.total);
                setTotalPages(response.data.pages);
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch articles",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles();
    }, [page, keyword]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchArticles();
    };

    const handleOpenCreate = () => {
        setIsEditing(false);
        setCurrentArticle({
            author: "WIC 宣传部",
            publishDate: new Date().toISOString().split('T')[0],
            readTime: "3 min read",
            tags: []
        });
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (article: Article) => {
        setIsEditing(true);
        // Deep copy tags to avoid reference issues
        setCurrentArticle({ ...article, tags: [...article.tags] });
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this article?")) return;
        try {
            await articleService.deleteArticle(id);
            toast({ title: "Success", description: "Article deleted successfully" });
            fetchArticles();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete article", variant: "destructive" });
        }
    };

    const handleSubmit = async () => {
        try {
            // Basic Validation
            if (!currentArticle.title || !currentArticle.content) {
                toast({ title: "Error", description: "Title and Content are required", variant: "destructive" });
                return;
            }

            if (isEditing && currentArticle.id) {
                await articleService.updateArticle(currentArticle);
                toast({ title: "Success", description: "Article updated successfully" });
            } else {
                await articleService.createArticle(currentArticle);
                toast({ title: "Success", description: "Article created successfully" });
            }
            setIsDialogOpen(false);
            fetchArticles();
        } catch (error) {
            toast({ title: "Error", description: `Failed to ${isEditing ? 'update' : 'create'} article`, variant: "destructive" });
        }
    };

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tagsStr = e.target.value;
        // Split by comma, trim whitespace
        const tags = tagsStr.split(/[,，]/).map(t => t.trim()).filter(Boolean);
        setCurrentArticle({ ...currentArticle, tags });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">文章管理</h2>
                <Button onClick={handleOpenCreate}>
                    <Plus className="mr-2 h-4 w-4" /> 新建文章
                </Button>
            </div>

            <div className="flex items-center space-x-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="搜索文章标题..."
                        className="pl-8"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
            </div>

            <div className="rounded-md border bg-white dark:bg-slate-900">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>标题</TableHead>
                            <TableHead>作者</TableHead>
                            <TableHead>发布日期</TableHead>
                            <TableHead>标签</TableHead>
                            <TableHead className="text-right">操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                                </TableCell>
                            </TableRow>
                        ) : articles.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    暂无文章
                                </TableCell>
                            </TableRow>
                        ) : (
                            articles.map((article) => (
                                <TableRow key={article.id}>
                                    <TableCell className="font-medium max-w-[200px] truncate" title={article.title}>{article.title}</TableCell>
                                    <TableCell>{article.author}</TableCell>
                                    <TableCell>{article.publishDate || article.createdAt}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {article.tags?.map((tag, i) => (
                                                <span key={i} className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs">
                                                    {tag.replace(/[\[\]"]/g, '')}
                                                </span>
                                            ))}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(article)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(article.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls could go here */}

            {/* Create/Edit Valid Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{isEditing ? '编辑文章' : '新建文章'}</DialogTitle>
                        <DialogDescription>
                            填写文章详情信息。HTML内容请直接粘贴到内容框中。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">标题 *</Label>
                                <Input
                                    id="title"
                                    value={currentArticle.title || ''}
                                    onChange={(e) => setCurrentArticle({ ...currentArticle, title: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="subtitle">副标题</Label>
                                <Input
                                    id="subtitle"
                                    value={currentArticle.subtitle || ''}
                                    onChange={(e) => setCurrentArticle({ ...currentArticle, subtitle: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="author">作者</Label>
                                <Input
                                    id="author"
                                    value={currentArticle.author || ''}
                                    onChange={(e) => setCurrentArticle({ ...currentArticle, author: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="publishDate">发布日期</Label>
                                <Input
                                    id="publishDate"
                                    type="date"
                                    value={currentArticle.publishDate || ''}
                                    onChange={(e) => setCurrentArticle({ ...currentArticle, publishDate: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="readTime">阅读时间</Label>
                                <Input
                                    id="readTime"
                                    placeholder="e.g. 5 min read"
                                    value={currentArticle.readTime || ''}
                                    onChange={(e) => setCurrentArticle({ ...currentArticle, readTime: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="tags">标签 (逗号分隔)</Label>
                                <Input
                                    id="tags"
                                    placeholder="新闻, 活动, 获奖"
                                    value={currentArticle.tags ? currentArticle.tags.join(', ') : ''}
                                    onChange={handleTagChange}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="coverImage">封面图 URL</Label>
                            <Input
                                id="coverImage"
                                placeholder="https://..."
                                value={currentArticle.coverImage || ''}
                                onChange={(e) => setCurrentArticle({ ...currentArticle, coverImage: e.target.value })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="content">内容 (HTML) *</Label>
                            <Textarea
                                id="content"
                                className="min-h-[200px] font-mono text-sm"
                                placeholder="<p>文章内容...</p>"
                                value={currentArticle.content || ''}
                                onChange={(e) => setCurrentArticle({ ...currentArticle, content: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>取消</Button>
                        <Button onClick={handleSubmit}>{isEditing ? '保存修改' : '立即创建'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
