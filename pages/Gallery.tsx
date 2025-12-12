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
  viewCount: img.viewCount,
  likeCount: img.likeCount,
  liked: img.liked,
  featured: img.featured,
  uploader: {
    id: img.uploader.id,
    nickname: img.uploader.nickname,
    avatar: img.uploader.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${img.uploader.id}`
  },
  createdAt: img.createdAt
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative w-full max-w-6xl max-h-[90vh] bg-gray-900/95 rounded-3xl overflow-hidden shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* 图片区域 */}
          <div className="lg:w-2/3 relative bg-black flex items-center justify-center min-h-[300px] lg:min-h-0">
            <img 
              src={image.imageUrl} 
              alt={image.title}
              className="w-full h-full object-contain max-h-[50vh] lg:max-h-[90vh]"
            />
            {image.featured && (
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <Star size={12} fill="white" />
                精选
              </div>
            )}
          </div>
          
          {/* 信息区域 */}
          <div className="lg:w-1/3 p-6 lg:p-8 flex flex-col overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950">
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/80 hover:bg-gray-700 transition-colors text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-2xl font-bold text-white mb-3">{image.title}</h2>
            <p className="text-gray-400 mb-6 leading-relaxed">{image.description}</p>
            
            {/* 上传者信息 */}
            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-800/50 rounded-xl">
              <img 
                src={image.uploader.avatar} 
                alt={image.uploader.nickname}
                className="w-10 h-10 rounded-full ring-2 ring-wic-primary/30"
              />
              <div>
                <p className="text-white font-medium">{image.uploader.nickname}</p>
                <p className="text-gray-500 text-sm flex items-center gap-1">
                  <Calendar size={12} />
                  {formatDate(image.createdAt)}
                </p>
              </div>
            </div>
            
            {/* 位置和分类 */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-gray-400">
                <MapPin size={16} className="text-wic-primary" />
                <span>{image.location}</span>
              </div>
                <div className="flex items-center gap-2 text-gray-400">
                <Tag size={16} className="text-wic-accent" />
                <span>{categories.find(c => c.code === image.category)?.nameZh || image.category}</span>
              </div>
            </div>
            
            {/* 标签 */}
            <div className="flex flex-wrap gap-2 mb-6">
              {image.tags.map((tag, idx) => (
                <span 
                  key={idx}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm hover:bg-wic-primary/20 hover:text-wic-primary transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* 统计和操作 */}
            <div className="mt-auto pt-6 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <button 
                    onClick={() => onLike(image.id)}
                    disabled={isLiking}
                    className={`flex items-center gap-2 transition-colors ${image.liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'} disabled:opacity-50`}
                  >
                    {isLiking ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <Heart size={20} fill={image.liked ? 'currentColor' : 'none'} />
                    )}
                    <span className="font-medium">{image.likeCount}</span>
                  </button>
                  <div className="flex items-center gap-2 text-gray-400">
                    <Eye size={20} />
                    <span>{image.viewCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
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

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950 rounded-3xl shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Upload className="text-wic-primary" size={24} />
            上传图片
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 图片上传区 */}
          <div
            className={`relative border-2 border-dashed rounded-2xl transition-all overflow-hidden ${
              dragActive 
                ? 'border-wic-primary bg-wic-primary/10' 
                : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            {previewUrl ? (
              <div className="relative">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-full h-64 object-cover"
                />
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                  className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <div 
                className="flex flex-col items-center justify-center py-12 cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-wic-primary/20 to-wic-accent/20 flex items-center justify-center">
                  <Camera className="text-wic-primary" size={28} />
                </div>
                <p className="text-gray-300 font-medium mb-1">拖拽图片到这里</p>
                <p className="text-gray-500 text-sm">或点击选择文件</p>
                <p className="text-gray-600 text-xs mt-2">支持 JPG、PNG、GIF，最大 10MB</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
          </div>
          
          {/* 标题 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">标题 *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给图片起个名字"
              required
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-wic-primary/30 focus:border-wic-primary outline-none transition-all"
            />
          </div>
          
          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="描述一下这张图片..."
              rows={3}
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-wic-primary/30 focus:border-wic-primary outline-none transition-all resize-none"
            />
          </div>
          
          {/* 拍摄地点 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">拍摄地点</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-3.5 text-gray-500" size={18} />
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="如：图书馆、操场、教学楼..."
                className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-wic-primary/30 focus:border-wic-primary outline-none transition-all"
              />
            </div>
          </div>
          
          {/* 分类 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">分类</label>
            <div className="grid grid-cols-4 gap-2">
              {categories.filter(c => c.code !== 'all').map((cat) => (
                <button
                  key={cat.code}
                  type="button"
                  onClick={() => setCategory(cat.code)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    category === cat.code
                      ? 'bg-wic-primary text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                  }`}
                >
                  {cat.nameZh}
                </button>
              ))}
            </div>
          </div>
          
          {/* 标签 */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">标签</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="用逗号分隔，如：秋天,校园,风景"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-wic-primary/30 focus:border-wic-primary outline-none transition-all"
            />
          </div>
          
          {/* 提交按钮 */}
          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={!selectedFile || !title || uploading}
            className="w-full py-4 bg-gradient-to-r from-wic-primary to-wic-secondary hover:from-wic-secondary hover:to-wic-primary text-white font-bold rounded-xl transition-all transform hover:shadow-lg hover:shadow-wic-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                上传中...
              </>
            ) : (
              '上传图片'
            )}
          </button>
          
          <p className="text-center text-gray-500 text-sm">
            上传后需要审核通过才会公开展示
          </p>
        </form>
      </motion.div>
    </motion.div>
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

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: "spring", damping: 25 }}
        className="relative w-full max-w-4xl max-h-[85vh] bg-gray-900/95 rounded-3xl overflow-hidden shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-wic-primary/20 to-wic-secondary/20 rounded-xl">
              <User size={24} className="text-wic-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">我的图片</h2>
              <p className="text-sm text-gray-400">管理您上传的所有图片</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-xl transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* 内容区 */}
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)]">
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
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative group rounded-xl overflow-hidden bg-gray-800/50 aspect-square"
                  >
                    <img
                      src={image.thumbnailUrl || image.imageUrl}
                      alt={image.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* 悬浮操作层 */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
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
                        {confirmDeleteId === image.id ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleDelete(image.id)}
                              disabled={deletingId === image.id}
                              className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded transition-colors disabled:opacity-50"
                            >
                              {deletingId === image.id ? '删除中...' : '确认'}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 bg-gray-600 hover:bg-gray-500 text-white text-xs rounded transition-colors"
                            >
                              取消
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(image.id)}
                            className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    
                    {/* 精选标识 */}
                    {image.featured && (
                      <div className="absolute top-2 left-2 px-2 py-1 bg-amber-500/90 text-white text-xs font-medium rounded-full flex items-center gap-1">
                        <Star size={10} />
                        精选
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* 加载更多 */}
              {hasMore && (
                <div className="flex justify-center mt-6">
                  <button
                    onClick={loadMore}
                    disabled={loading}
                    className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        加载中...
                      </>
                    ) : (
                      '加载更多'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
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
        // 添加 "全部" 选项
        setCategories([
          { code: 'all', nameZh: '全部', nameEn: 'All' },
          ...response.data
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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white">
      {/* 头部区域 */}
      <motion.div 
        ref={headerRef}
        style={{ opacity: headerOpacity }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-gray-950/80 border-b border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* 标题和操作 */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-wic-primary/20 to-wic-accent/20 flex items-center justify-center">
                <Camera className="text-wic-primary" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                  光影城院
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  用镜头记录校园的每一个精彩瞬间
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* 统计信息 */}
              <div className="hidden md:flex items-center gap-6 mr-4 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <ImageIcon size={16} className="text-wic-primary" />
                  <span>{stats.total} 张图片</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Star size={16} className="text-amber-500" />
                  <span>{stats.featured} 个精选</span>
                </div>
              </div>
              
              {/* 用户操作按钮 */}
              {user && (
                <div className="flex items-center gap-2">
                  {/* 我的图片按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowMyImagesModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-800/80 hover:bg-gray-700/80 text-gray-300 hover:text-white font-medium rounded-xl transition-all border border-gray-700/50"
                  >
                    <User size={18} />
                    <span className="hidden sm:inline">我的图片</span>
                  </motion.button>
                  
                  {/* 上传按钮 */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowUploadModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-wic-primary to-wic-secondary hover:from-wic-secondary hover:to-wic-primary text-white font-medium rounded-xl transition-all shadow-lg shadow-wic-primary/20"
                  >
                    <Upload size={18} />
                    <span className="hidden sm:inline">上传作品</span>
                  </motion.button>
                </div>
              )}
            </div>
          </div>
          
          {/* 搜索和筛选栏 */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* 搜索框 */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索图片、标签、地点..."
                className="w-full pl-11 pr-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder:text-gray-500 focus:ring-2 focus:ring-wic-primary/30 focus:border-wic-primary/50 outline-none transition-all"
              />
            </div>
            
            {/* 筛选按钮组 */}
            <div className="flex items-center gap-2">
              {/* 排序下拉 */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 hover:bg-gray-700/50 transition-colors"
                >
                  <SlidersHorizontal size={18} />
                  <span className="hidden sm:inline">
                    {sortBy === 'latest' ? '最新' : sortBy === 'popular' ? '最热' : '精选'}
                  </span>
                  <ChevronDown size={16} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-40 bg-gray-800 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-10"
                    >
                      {[
                        { value: 'latest', label: '最新上传', icon: Clock },
                        { value: 'popular', label: '最受欢迎', icon: TrendingUp },
                        { value: 'featured', label: '精选推荐', icon: Star },
                      ].map(({ value, label, icon: Icon }) => (
                        <button
                          key={value}
                          onClick={() => { setSortBy(value as typeof sortBy); setShowFilters(false); }}
                          className={`w-full flex items-center gap-2 px-4 py-3 text-sm transition-colors ${
                            sortBy === value 
                              ? 'bg-wic-primary/20 text-wic-primary' 
                              : 'text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <Icon size={16} />
                          {label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* 视图切换 */}
              <div className="flex bg-gray-800/50 border border-gray-700/50 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'masonry' ? 'bg-wic-primary text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <LayoutGrid size={18} />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-wic-primary text-white' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* 分类标签栏 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <motion.button
              key={cat.code}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(cat.code)}
              className={`flex-shrink-0 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.code
                  ? 'bg-gradient-to-r from-wic-primary to-wic-secondary text-white shadow-lg shadow-wic-primary/30'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700/50 hover:text-white border border-gray-700/50'
              }`}
            >
              {language === 'zh' ? cat.nameZh : cat.nameEn}
            </motion.button>
          ))}
        </div>
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
                className={`group relative overflow-hidden rounded-2xl bg-gray-800/30 cursor-pointer ${
                  viewMode === 'masonry' ? 'break-inside-avoid' : 'aspect-square'
                }`}
                onClick={() => setSelectedImage(img)}
              >
                <img 
                  src={img.thumbnailUrl}
                  alt={img.title}
                  className={`w-full object-cover transform group-hover:scale-105 transition-transform duration-500 ${
                    viewMode === 'grid' ? 'h-full' : 'h-auto'
                  }`}
                  loading="lazy"
                />
                
                {/* 精选标识 */}
                {img.featured && (
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
                    <Star size={14} fill="white" className="text-white" />
                  </div>
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
                        className={`flex items-center gap-1 ${img.liked ? 'text-red-500' : 'text-white/80 hover:text-red-500'} transition-colors`}
                      >
                        <Heart size={16} fill={img.liked ? 'currentColor' : 'none'} />
                        <span className="text-sm">{img.likeCount}</span>
                      </button>
                      <div className="flex items-center gap-1 text-white/60">
                        <Eye size={16} />
                        <span className="text-sm">{img.viewCount}</span>
                      </div>
                    </div>
                    <img 
                      src={img.uploader.avatar}
                      alt={img.uploader.nickname}
                      className="w-7 h-7 rounded-full ring-2 ring-white/30"
                    />
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
            <button
              onClick={() => loadImages(true)}
              className="px-6 py-3 bg-wic-primary text-white font-medium rounded-xl hover:bg-wic-primary/80 transition-all"
            >
              重试
            </button>
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
              <button
                onClick={() => setShowUploadModal(true)}
                className="mt-6 flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-wic-primary to-wic-secondary text-white font-medium rounded-xl hover:shadow-lg hover:shadow-wic-primary/30 transition-all"
              >
                <Upload size={18} />
                上传作品
              </button>
            )}
          </motion.div>
        )}
        
        {/* 加载更多按钮 */}
        {!loading && hasMore && filteredImages.length > 0 && (
          <div className="flex justify-center mt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={loadMore}
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white font-medium rounded-xl transition-all flex items-center gap-2"
            >
              加载更多
              <ChevronDown size={18} />
            </motion.button>
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
            isLiking={likingId === selectedImage.id}
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