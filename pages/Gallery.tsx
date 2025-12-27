import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Image as ImageIcon, MapPin, Heart, Eye, Upload, Search,
  X, Camera, Grid3X3, LayoutGrid, SlidersHorizontal,
  Clock, TrendingUp, Star, ChevronDown, Calendar, Tag, Loader2,
  User, Trash2, AlertCircle
} from 'lucide-react';
import { useLanguage } from '../LanguageContext';
import { useUser } from '../UserContext';
import {
  getGalleryImages,
  getCategories,
  toggleLike,
  uploadImage,
  getMyImages,
  deleteMyImage,
  GalleryImage,
  CategoryInfo,
} from '../services/galleryService';

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

// 默认分类数据（API 加载失败时使用）
const defaultCategories: CategoryInfo[] = [
  { code: 'all', nameZh: '全部', nameEn: 'All' },
  { code: 'campus', nameZh: '校园风光', nameEn: 'Campus' },
  { code: 'activity', nameZh: '活动记录', nameEn: 'Activities' },
  { code: 'graduation', nameZh: '毕业季', nameEn: 'Graduation' },
  { code: 'library', nameZh: '图书馆', nameEn: 'Library' },
  { code: 'sports', nameZh: '运动场', nameEn: 'Sports' },
  { code: 'night', nameZh: '夜景', nameEn: 'Night View' },
  { code: 'other', nameZh: '其他', nameEn: 'Other' },
];

// 转换 API 响应数据格式
const transformImage = (img: GalleryImage) => ({
  id: img.id,
  imageUrl: img.imageUrl,
  thumbnailUrl: img.thumbnailUrl || img.imageUrl,
  title: img.title,
  description: img.description || '',
  location: img.location || '校园',
  category: img.category,
  tags: img.tags || [],
  viewCount: img.viewCount || 0,
  likeCount: img.likeCount || 0,
  liked: img.liked || false,
  featured: img.featured || false,
  uploader: {
    id: img.uploader?.id || 0,
    nickname: img.uploader?.nickname || '匿名用户',
    avatar: img.uploader?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${img.id}`
  },
  createdAt: img.createdAt || new Date().toISOString()
});

type TransformedImage = ReturnType<typeof transformImage>;

// 图片详情模态框组件
const ImageModal: React.FC<{
  image: TransformedImage | null;
  onClose: () => void;
  onLike: (id: number) => void;
  categories: CategoryInfo[];
  isLiking?: boolean;
}> = ({ image, onClose, onLike, categories, isLiking }) => {
  const { language } = useLanguage();

  if (!image) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={!!image} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-gray-950 border-gray-800 flex flex-col lg:flex-row gap-0">
        <div className="lg:w-2/3 relative bg-black flex items-center justify-center min-h-[300px] lg:min-h-0 h-full">
          <img
            src={image.imageUrl}
            alt={image.title}
            className="w-full h-full object-contain"
          />
          {image.featured && (
            <Badge className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 border-none text-white gap-1.5 shadow-lg px-3 py-1.5">
              <Star size={12} fill="white" />
              精选
            </Badge>
          )}
        </div>

        {/* 信息区域 */}
        <div className="lg:w-1/3 flex flex-col h-full bg-gray-950 border-l border-gray-800">
          <ScrollArea className="flex-1">
            <div className="p-6 lg:p-8 space-y-6">
              <div>
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-white mb-2">{image.title}</DialogTitle>
                  <DialogDescription className="text-gray-400 text-base leading-relaxed">
                    {image.description}
                  </DialogDescription>
                </DialogHeader>
              </div>

              {/* 上传者信息 */}
              <div
                className="flex items-center gap-3 p-3 bg-gray-900 rounded-xl border border-gray-800 cursor-pointer hover:bg-gray-800 transition-colors group"
                onClick={() => onClose()}
              >
                {/* 暂时只是关闭 Dialog，外层应该用 Link 包裹或者使用 navigate。但 Dialog 里面放 Link 导航有时会有问题，这里直接用 onClick 触发外部导航 */}
                <a href={`#/user/${image.uploader.id}`} className="flex items-center gap-3 flex-1">
                  <Avatar className="group-hover:ring-2 ring-wic-primary transition-all">
                    <AvatarImage src={image.uploader.avatar} alt={image.uploader.nickname} />
                    <AvatarFallback>{image.uploader.nickname[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-white font-medium group-hover:text-wic-primary transition-colors flex items-center gap-1">
                      {image.uploader.nickname}
                      <span className="text-xs text-gray-500 font-normal ml-1">(查看主页)</span>
                    </p>
                    <p className="text-gray-500 text-sm flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(image.createdAt)}
                    </p>
                  </div>
                </a>
              </div>

              {/* 位置和分类 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={16} className="text-wic-primary" />
                  <span>{image.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Tag size={16} className="text-wic-accent" />
                  <Badge variant="secondary" className="bg-gray-800 text-gray-300 hover:bg-gray-700">
                    {categories.find(c => c.code === image.category)?.nameZh || image.category}
                  </Badge>
                </div>
              </div>

              {/* 标签 */}
              <div className="flex flex-wrap gap-2">
                {image.tags.map((tag, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-gray-400 border-gray-700 hover:text-wic-primary hover:border-wic-primary/50 transition-colors cursor-pointer"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          </ScrollArea>

          {/* 统计和操作 */}
          <div className="p-6 border-t border-gray-800 bg-gray-900/50 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onLike(image.id)}
                  disabled={isLiking}
                  className={cn(
                    "flex items-center gap-2 px-0 hover:bg-transparent",
                    image.liked ? 'text-red-500 hover:text-red-600' : 'text-gray-400 hover:text-red-500'
                  )}
                >
                  {isLiking ? (
                    <Loader2 size={24} className="animate-spin" />
                  ) : (
                    <Heart size={24} fill={image.liked ? 'currentColor' : 'none'} />
                  )}
                  <span className="font-medium text-lg">{image.likeCount}</span>
                </Button>
                <div className="flex items-center gap-2 text-gray-400">
                  <Eye size={24} />
                  <span className="text-lg">{image.viewCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// 上传模态框组件
const UploadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: () => void;
  categories: CategoryInfo[];
}> = ({ isOpen, onClose, onUploadSuccess, categories }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('other');
  const [tags, setTags] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setSelectedFile(file);
      setError(null);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title) return;

    setUploading(true);
    setError(null);

    try {
      // 准备标签字符串（逗号分隔）
      let tagsString = '';
      if (tags) {
        tagsString = tags.split(/[,，]/).map(t => t.trim()).filter(Boolean).join(',');
      }

      await uploadImage({
        file: selectedFile,
        title,
        description: description || undefined,
        location: location || undefined,
        category,
        tags: tagsString || undefined,
      });
      onUploadSuccess();
      onClose();

      // 重置表单
      setSelectedFile(null);
      setPreviewUrl(null);
      setTitle('');
      setDescription('');
      setLocation('');
      setCategory('other');
      setTags('');
    } catch (err: any) {
      setError(err.message || '上传失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-gray-950 border-gray-800 p-0 overflow-hidden flex flex-col max-h-[90vh]">
        <DialogHeader className="p-6 border-b border-gray-800 bg-gray-900/50">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Upload className="text-wic-primary" size={24} />
            上传图片
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            分享你的校园精彩瞬间
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 图片上传区 */}
            <div
              className={`relative border-2 border-dashed rounded-2xl transition-all overflow-hidden h-64 flex flex-col items-center justify-center cursor-pointer ${dragActive
                ? 'border-wic-primary bg-wic-primary/10'
                : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-900'
                }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => !previewUrl && fileInputRef.current?.click()}
            >
              {previewUrl ? (
                <div className="relative w-full h-full group">
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain bg-black/50"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(null); }}
                      className="gap-2"
                    >
                      <Trash2 size={16} />
                      移除图片
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 mb-4 rounded-full bg-gray-800 flex items-center justify-center">
                    <Camera className="text-gray-400" size={28} />
                  </div>
                  <p className="text-gray-300 font-medium mb-1">拖拽图片到这里</p>
                  <p className="text-gray-500 text-sm">或点击选择文件</p>
                  <p className="text-gray-600 text-xs mt-2">支持 JPG、PNG、GIF，最大 10MB</p>
                </>
              )}
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 标题 */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-gray-300">标题 <span className="text-red-500">*</span></Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="给图片起个名字"
                  className="bg-gray-900 border-gray-800 focus:ring-wic-primary"
                  required
                />
              </div>

              {/* 拍摄地点 */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-300">拍摄地点</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-2.5 text-gray-500" size={16} />
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="如：图书馆、操场..."
                    className="pl-9 bg-gray-900 border-gray-800 focus:ring-wic-primary"
                  />
                </div>
              </div>
            </div>

            {/* 描述 */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">描述</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="描述一下这张图片..."
                className="bg-gray-900 border-gray-800 focus:ring-wic-primary resize-none min-h-[80px]"
              />
            </div>

            {/* 分类 */}
            <div className="space-y-2">
              <Label className="text-gray-300">分类</Label>
              <div className="flex flex-wrap gap-2">
                {categories.filter(c => c.code !== 'all').map((cat) => (
                  <Badge
                    key={cat.code}
                    variant={category === cat.code ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer px-3 py-1.5 transition-all text-sm",
                      category === cat.code
                        ? "bg-wic-primary hover:bg-wic-primary/90 border-transparent"
                        : "text-gray-400 border-gray-800 hover:border-gray-600 hover:text-white"
                    )}
                    onClick={() => setCategory(cat.code)}
                  >
                    {cat.nameZh}
                  </Badge>
                ))}
              </div>
            </div>

            {/* 标签 */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-gray-300">标签</Label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="用逗号分隔，如：秋天,校园,风景"
                className="bg-gray-900 border-gray-800 focus:ring-wic-primary"
              />
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="p-6 border-t border-gray-800 bg-gray-900/50">
          {error && (
            <div className="mr-auto text-red-500 text-sm flex items-center gap-1">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
          <Button
            variant="outline"
            onClick={onClose}
            className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          >
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!selectedFile || !title || uploading}
            className="bg-gradient-to-r from-wic-primary to-wic-secondary hover:from-wic-secondary hover:to-wic-primary text-white border-0"
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                上传中...
              </>
            ) : (
              '确认上传'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// 我的图片模态框组件
const MyImagesModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  categories: CategoryInfo[];
}> = ({ isOpen, onClose, categories }) => {
  const { language } = useLanguage();
  const [myImages, setMyImages] = useState<TransformedImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  // 加载我的图片
  const loadMyImages = useCallback(async (resetPage = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = resetPage ? 1 : page;
      const response = await getMyImages(currentPage, 12);

      if (response.code === 200 && response.data) {
        const transformedImages = response.data.records.map(transformImage);

        if (resetPage) {
          setMyImages(transformedImages);
          setPage(1);
        } else {
          setMyImages(prev => currentPage === 1 ? transformedImages : [...prev, ...transformedImages]);
        }

        setHasMore(currentPage < response.data.pages);
      }
    } catch (err: any) {
      setError(err.message || '加载图片失败');
    } finally {
      setLoading(false);
    }
  }, [page]);

  // 删除图片
  const handleDelete = async (imageId: number) => {
    try {
      setDeletingId(imageId);
      await deleteMyImage(imageId);
      setMyImages(prev => prev.filter(img => img.id !== imageId));
      setConfirmDeleteId(null);
    } catch (err: any) {
      setError(err.message || '删除失败');
    } finally {
      setDeletingId(null);
    }
  };

  // 加载更多
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (page > 1) {
      loadMyImages(false);
    }
  }, [page]);

  useEffect(() => {
    if (isOpen) {
      loadMyImages(true);
    }
  }, [isOpen]);

  // 获取状态标签
  const getStatusLabel = (image: any) => {
    // 根据 API 返回的状态判断：0-待审核, 1-已通过, 2-已拒绝
    // 这里需要根据实际 API 返回的字段调整
    return null; // 暂时不显示状态，因为转换后的数据没有状态字段
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[85vh] bg-gray-950 border-gray-800 p-0 flex flex-col">
        <DialogHeader className="p-6 border-b border-gray-800 bg-gray-900/50">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <User size={24} className="text-wic-primary" />
            我的图片
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            管理您上传的所有图片
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center flex items-center justify-center gap-2">
              <AlertCircle size={18} />
              {error}
            </div>
          )}

          {loading && myImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <Loader2 size={40} className="text-wic-primary animate-spin mb-4" />
              <p className="text-gray-400">加载中...</p>
            </div>
          ) : myImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="p-4 bg-gray-800/50 rounded-full mb-4">
                <ImageIcon size={40} className="text-gray-600" />
              </div>
              <p className="text-gray-400 mb-2">暂无上传的图片</p>
              <p className="text-gray-500 text-sm">快去上传您的第一张作品吧！</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {myImages.map((image) => (
                  <Card key={image.id} className="bg-gray-900 border-gray-800 overflow-hidden group">
                    <div className="relative aspect-square">
                      <img
                        src={image.thumbnailUrl || image.imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover"
                      />
                      {/* 悬浮操作层 */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                        <p className="text-white font-medium text-sm truncate mb-2">{image.title}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-xs text-gray-300">
                            <span className="flex items-center gap-1">
                              <Eye size={12} />
                              {image.viewCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart size={12} />
                              {image.likeCount}
                            </span>
                          </div>

                          {/* 删除按钮 */}
                          <AlertDialog open={confirmDeleteId === image.id} onOpenChange={(open) => !open && setConfirmDeleteId(null)}>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                className="h-7 w-7"
                                onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(image.id); }}
                              >
                                <Trash2 size={14} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-gray-950 border-gray-800 text-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle>确认删除？</AlertDialogTitle>
                                <AlertDialogDescription className="text-gray-400">
                                  此操作无法撤销。这将永久删除您的图片"{image.title}"。
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 hover:text-white">取消</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(image.id)}
                                  className="bg-red-500 hover:bg-red-600"
                                  disabled={deletingId === image.id}
                                >
                                  {deletingId === image.id ? '删除中...' : '确认删除'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>

                      {/* 精选标识 */}
                      {image.featured && (
                        <Badge className="absolute top-2 left-2 bg-amber-500/90 text-white gap-1 px-2 py-0.5 text-xs">
                          <Star size={10} />
                          精选
                        </Badge>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* 加载更多 */}
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <Button
                    variant="outline"
                    onClick={loadMore}
                    disabled={loading}
                    className="border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin mr-2" />
                        加载中...
                      </>
                    ) : (
                      '加载更多'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

const Gallery: React.FC = () => {
  const { language } = useLanguage();
  const { user } = useUser();
  const [categories, setCategories] = useState<CategoryInfo[]>(defaultCategories);
  const [images, setImages] = useState<TransformedImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState<TransformedImage | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showMyImagesModal, setShowMyImagesModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'masonry'>('masonry');
  const [sortBy, setSortBy] = useState<'latest' | 'popular' | 'featured'>('latest');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalImages, setTotalImages] = useState(0);
  const [likingId, setLikingId] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.8]);

  // 加载分类列表
  const loadCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      if (response.code === 200 && response.data) {
        // 过滤掉 API 可能返回的 'all'，防止重复
        const apiCategories = response.data.filter(c => c.code !== 'all');
        // 添加 "全部" 选项
        setCategories([
          { code: 'all', nameZh: '全部', nameEn: 'All' },
          ...apiCategories
        ]);
      }
    } catch (err) {
      console.error('加载分类失败:', err);
      // 使用默认分类
    }
  }, []);

  // 加载图片列表
  const loadImages = useCallback(async (resetPage = false) => {
    try {
      setLoading(true);
      setError(null);

      const currentPage = resetPage ? 1 : page;
      const response = await getGalleryImages(
        selectedCategory === 'all' ? undefined : selectedCategory,
        currentPage,
        20
      );

      if (response.code === 200 && response.data) {
        const transformedImages = response.data.records.map(transformImage);

        if (resetPage) {
          setImages(transformedImages);
          setPage(1);
        } else {
          setImages(prev => currentPage === 1 ? transformedImages : [...prev, ...transformedImages]);
        }

        setTotalImages(response.data.total);
        setHasMore(currentPage < response.data.pages);
      }
    } catch (err: any) {
      setError(err.message || '加载图片失败');
      console.error('加载图片失败:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, page]);

  // 初始加载
  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // 分类变化时重新加载
  useEffect(() => {
    setPage(1);
    loadImages(true);
  }, [selectedCategory]);

  // 加载更多
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (page > 0) {
      loadImages(false);
    }
  }, [page]);

  // 筛选和排序图片
  const filteredImages = images
    .filter(img => {
      const matchCategory = selectedCategory === 'all' || img.category === selectedCategory;
      const matchSearch = !searchQuery ||
        img.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCategory && matchSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') return b.likeCount - a.likeCount;
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  // 点赞处理
  const handleLike = async (id: number) => {
    if (!user) {
      alert('请先登录后再点赞');
      return;
    }

    if (likingId !== null) return; // 防止重复点击

    setLikingId(id);

    try {
      const response = await toggleLike(id);

      if (response.code === 200) {
        const { liked, likeCount } = response.data;

        // 更新图片列表
        setImages(prev => prev.map(img =>
          img.id === id
            ? { ...img, liked, likeCount }
            : img
        ));

        // 更新选中的图片详情
        if (selectedImage?.id === id) {
          setSelectedImage(prev => prev ? {
            ...prev,
            liked,
            likeCount
          } : null);
        }
      }
    } catch (err: any) {
      console.error('点赞失败:', err);
      alert(err.message || '点赞失败，请稍后重试');
    } finally {
      setLikingId(null);
    }
  };

  // 上传成功后刷新列表
  const handleUploadSuccess = () => {
    setPage(0);
    loadImages(true);
  };

  // 统计数据
  const stats = {
    total: totalImages,
    featured: images.filter(i => i.featured).length,
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gradient-to-b dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-foreground dark:text-white transition-colors duration-300">
      {/* 头部区域 */}
      <motion.div
        ref={headerRef}
        style={{ opacity: headerOpacity }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-background/80 dark:bg-gray-950/80 border-b border-border/40 dark:border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* 标题和操作 */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-wic-primary/20 to-wic-accent/20 flex items-center justify-center border border-border/50">
                <Camera className="text-wic-primary" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 dark:from-white dark:to-gray-400">
                  光影城院
                </h1>
                <p className="text-muted-foreground dark:text-gray-500 text-sm mt-1">
                  用镜头记录校园的每一个精彩瞬间
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* 统计信息 */}
              <div className="hidden md:flex items-center gap-6 mr-4 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                  <ImageIcon size={16} className="text-wic-primary" />
                  <span>{stats.total} 张图片</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
                  <Star size={16} className="text-amber-500" />
                  <span>{stats.featured} 个精选</span>
                </div>
              </div>

              {/* 用户操作按钮 */}
              {user && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowMyImagesModal(true)}
                    className="text-muted-foreground hover:text-foreground dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800"
                  >
                    <User size={18} className="mr-2" />
                    <span className="hidden sm:inline">我的图片</span>
                  </Button>

                  <Button
                    onClick={() => setShowUploadModal(true)}
                    className="bg-gradient-to-r from-wic-primary to-wic-secondary hover:from-wic-secondary hover:to-wic-primary text-white border-0 shadow-lg shadow-wic-primary/20"
                  >
                    <Upload size={18} className="mr-2" />
                    <span className="hidden sm:inline">上传作品</span>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* 搜索和筛选栏 */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索图片、标签、地点..."
                className="pl-10 bg-secondary/50 dark:bg-gray-800/50 border-input dark:border-gray-700/50 text-foreground dark:text-white placeholder:text-muted-foreground focus:ring-wic-primary/30 focus:border-wic-primary/50"
              />
            </div>

            {/* 筛选按钮组 */}
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={(val: any) => setSortBy(val)}>
                <SelectTrigger className="w-[140px] bg-secondary/50 dark:bg-gray-800/50 border-input dark:border-gray-700/50 text-foreground dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal size={16} />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-popover dark:bg-gray-800 border-border dark:border-gray-700">
                  <SelectItem value="latest">
                    <div className="flex items-center gap-2"><Clock size={14} /> 最新上传</div>
                  </SelectItem>
                  <SelectItem value="popular">
                    <div className="flex items-center gap-2"><TrendingUp size={14} /> 最受欢迎</div>
                  </SelectItem>
                  <SelectItem value="featured">
                    <div className="flex items-center gap-2"><Star size={14} /> 精选推荐</div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="flex bg-secondary/50 dark:bg-gray-800/50 border border-input dark:border-gray-700/50 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('masonry')}
                  className={cn(
                    "h-8 w-8 rounded-md transition-all",
                    viewMode === 'masonry' ? 'bg-wic-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
                  )}
                >
                  <LayoutGrid size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "h-8 w-8 rounded-md transition-all",
                    viewMode === 'grid' ? 'bg-wic-primary text-white shadow-sm' : 'text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700'
                  )}
                >
                  <Grid3X3 size={16} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 分类标签栏 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex items-center gap-2 px-1">
            {categories.map((cat) => (
              <Button
                key={cat.code}
                variant={selectedCategory === cat.code ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.code)}
                className={cn(
                  "rounded-full px-5 h-9 font-medium transition-all hover:scale-105 active:scale-95",
                  selectedCategory === cat.code
                    ? "bg-wic-primary text-white hover:bg-wic-primary/90 shadow-md shadow-wic-primary/20 border-transparent"
                    : "bg-background/50 backdrop-blur-sm text-muted-foreground hover:text-foreground hover:bg-accent border-border/50"
                )}
              >
                {cat.code === 'all' && <LayoutGrid size={14} className="mr-2" />}
                {language === 'zh' ? cat.nameZh : cat.nameEn}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* 图片网格 */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        {filteredImages.length > 0 ? (
          <div className={viewMode === 'masonry'
            ? "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
            : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          }>
            {filteredImages.map((img, idx) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.03 }}
                className={cn(
                  "group relative overflow-hidden rounded-2xl cursor-pointer border transition-all",
                  "bg-card/50 dark:bg-gray-800/30 border-transparent hover:border-border dark:hover:border-gray-700/50 hover:shadow-lg dark:hover:shadow-none",
                  viewMode === 'masonry' ? 'break-inside-avoid' : 'aspect-square'
                )}
                onClick={() => setSelectedImage(img)}
              >
                <img
                  src={img.thumbnailUrl}
                  alt={img.title}
                  className={cn(
                    "w-full object-cover transform group-hover:scale-105 transition-transform duration-500",
                    viewMode === 'grid' ? 'h-full' : 'h-auto'
                  )}
                  loading="lazy"
                />

                {/* 精选标识 */}
                {img.featured && (
                  <Badge className="absolute top-3 left-3 bg-gradient-to-br from-amber-500 to-orange-500 text-white border-none shadow-lg px-2 py-0.5">
                    <Star size={10} fill="white" className="mr-1" />
                    精选
                  </Badge>
                )}

                {/* 悬浮信息 */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{img.title}</h3>
                  <div className="flex items-center gap-2 text-gray-300 text-sm mb-3">
                    <MapPin size={12} className="text-wic-primary" />
                    <span className="line-clamp-1">{img.location}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleLike(img.id); }}
                        className={cn(
                          "flex items-center gap-1 transition-colors",
                          img.liked ? 'text-red-500' : 'text-white/80 hover:text-red-500'
                        )}
                      >
                        <Heart size={16} fill={img.liked ? 'currentColor' : 'none'} />
                        <span className="text-sm">{img.likeCount}</span>
                      </button>
                      <div className="flex items-center gap-1 text-white/60">
                        <Eye size={16} />
                        <span className="text-sm">{img.viewCount}</span>
                      </div>
                    </div>
                    <Avatar className="w-7 h-7 ring-2 ring-white/30">
                      <AvatarImage src={img.uploader.avatar} />
                      <AvatarFallback>{img.uploader.nickname[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-wic-primary animate-spin mb-4" />
            <p className="text-gray-400">加载中...</p>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
              <X className="text-red-500" size={40} />
            </div>
            <h3 className="text-xl font-medium text-gray-400 mb-2">加载失败</h3>
            <p className="text-gray-500 text-center max-w-md mb-4">{error}</p>
            <Button
              onClick={() => loadImages(true)}
              className="bg-wic-primary text-white hover:bg-wic-primary/80"
            >
              重试
            </Button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-24 h-24 rounded-full bg-gray-800/50 flex items-center justify-center mb-6">
              <ImageIcon className="text-gray-600" size={40} />
            </div>
            <h3 className="text-xl font-medium text-gray-400 mb-2">暂无图片</h3>
            <p className="text-gray-500 text-center max-w-md">
              {searchQuery
                ? `没有找到与"${searchQuery}"相关的图片`
                : '当前分类下还没有图片，快来上传第一张吧！'
              }
            </p>
            {user && (
              <Button
                onClick={() => setShowUploadModal(true)}
                className="mt-6 bg-gradient-to-r from-wic-primary to-wic-secondary text-white border-0"
              >
                <Upload size={18} className="mr-2" />
                上传作品
              </Button>
            )}
          </motion.div>
        )}

        {/* 加载更多按钮 */}
        {!loading && hasMore && filteredImages.length > 0 && (
          <div className="flex justify-center mt-8">
            <Button
              variant="secondary"
              onClick={loadMore}
              className="px-8 bg-gray-800 text-white hover:bg-gray-700"
            >
              加载更多
              <ChevronDown size={18} className="ml-2" />
            </Button>
          </div>
        )}
      </div>

      {/* 图片详情模态框 */}
      <AnimatePresence>
        {selectedImage && (
          <ImageModal
            image={selectedImage}
            onClose={() => setSelectedImage(null)}
            onLike={handleLike}
            categories={categories}
            isLiking={likingId === (selectedImage?.id ?? -1)}
          />
        )}
      </AnimatePresence>

      {/* 上传模态框 */}
      <AnimatePresence>
        {showUploadModal && (
          <UploadModal
            isOpen={showUploadModal}
            onClose={() => setShowUploadModal(false)}
            onUploadSuccess={handleUploadSuccess}
            categories={categories}
          />
        )}
      </AnimatePresence>

      {/* 我的图片模态框 */}
      <AnimatePresence>
        {showMyImagesModal && (
          <MyImagesModal
            isOpen={showMyImagesModal}
            onClose={() => setShowMyImagesModal(false)}
            categories={categories}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;