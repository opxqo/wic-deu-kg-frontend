
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, MapPin, Star, StarHalf, Heart, MessageCircle, X, Send, Utensils, PenLine, ThumbsUp } from 'lucide-react';
import { initialFoodData, filterMap, StarRating } from './Food';
import { useLanguage } from '../LanguageContext';
import { FoodItem, Product, FoodComment } from '../types';

const InteractiveStarRating = ({ value, onChange, size = 24 }: { value: number, onChange: (v: number) => void, size?: number }) => {
    const [hover, setHover] = useState<number | null>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const isLeft = e.clientX - rect.left < rect.width / 2;
        setHover(starIndex + (isLeft ? 0.5 : 1));
    };

    const handleClick = () => {
        if (hover !== null) onChange(hover);
    };

    return (
        <div className="flex gap-1" onMouseLeave={() => setHover(null)}>
            {[0, 1, 2, 3, 4].map((i) => {
                const starValue = i + 1;
                const currentDisplay = hover !== null ? hover : value;
                
                let Icon = Star;
                let className = "text-gray-300";

                if (currentDisplay >= starValue) {
                    className = "text-yellow-400 fill-yellow-400";
                } else if (currentDisplay >= starValue - 0.5) {
                    Icon = StarHalf;
                    className = "text-yellow-400 fill-yellow-400";
                }

                return (
                    <div 
                        key={i} 
                        className="cursor-pointer"
                        onMouseMove={(e) => handleMouseMove(e, i)}
                        onClick={handleClick}
                    >
                        <Icon size={size} className={className} />
                    </div>
                );
            })}
        </div>
    );
};

const FoodDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [shop, setShop] = useState<FoodItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('');

  useEffect(() => {
    // In a real app, fetch from API. Here we find from mock data.
    const found = initialFoodData.find(item => item.id === id);
    if (found) {
      setShop(found);
      // Determine unique categories
      const categories = Array.from(new Set(found.products.map(p => p.category || 'Other')));
      if (categories.length > 0) setActiveCategory(categories[0]);
    } else {
      // Handle not found
      navigate('/food');
    }
  }, [id, navigate]);

  if (!shop) return null;

  // Derive unique categories from products
  const categories = Array.from(new Set(shop.products.map(p => p.category || 'Other')));

  const handleProductLike = (productId: string, e: React.MouseEvent) => {
      e.stopPropagation();
      setShop(prev => {
          if (!prev) return null;
          return {
              ...prev,
              products: prev.products.map(p => {
                  if (p.id === productId) {
                      return {
                          ...p,
                          isLiked: !p.isLiked,
                          likes: p.isLiked ? p.likes - 1 : p.likes + 1
                      };
                  }
                  return p;
              })
          };
      });
  };

  const handleAddComment = (productId: string, text: string, rating: number) => {
    const newComment: FoodComment = {
         id: Date.now().toString(),
         user: 'Student User', // Mock user
         avatar: 'https://picsum.photos/seed/me/40/40',
         content: text,
         rating: rating,
         date: 'Just now'
     };

     setShop(prev => {
         if(!prev) return null;
         return {
             ...prev,
             products: prev.products.map(p => {
                 if(p.id === productId) {
                     return { 
                         ...p, 
                         comments: [newComment, ...p.comments], 
                         reviews: p.reviews + 1 
                     };
                 }
                 return p;
             })
         };
     });
     
     // Update selected product view as well
     setSelectedProduct(prev => prev ? { ...prev, comments: [newComment, ...prev.comments], reviews: prev.reviews + 1 } : null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
      
      {/* 1. New Shop Header (Review System Style) */}
      <div className="relative bg-white dark:bg-gray-900 shadow-sm z-20">
         {/* Top Image Banner */}
         <div className="h-48 md:h-64 w-full relative overflow-hidden">
             <img src={shop.image} alt={shop.name} className="w-full h-full object-cover" />
             <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
             <div className="absolute top-4 left-4">
                 <button onClick={() => navigate('/food')} className="flex items-center gap-2 px-4 py-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white text-sm font-bold transition-all">
                     <ChevronLeft size={16} />
                     {t('food.back')}
                 </button>
             </div>
         </div>
         
         {/* Shop Info Card (Overlapping) */}
         <div className="max-w-7xl mx-auto px-4 -mt-16 relative">
             <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div>
                     <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">{shop.name}</h1>
                     <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                         <StarRating rating={shop.rating} />
                         <span>{shop.reviews} {t('food.reviews')}</span>
                         <span className="text-gray-300">|</span>
                         <span>¥{shop.price}/{t('food.avg')}</span>
                         <span className="text-gray-300">|</span>
                         <span className="flex items-center gap-1">
                             <MapPin size={14} className="text-wic-primary" />
                             {t(filterMap[shop.location as keyof typeof filterMap])}
                         </span>
                     </div>
                 </div>

                 {/* Reputation Scores */}
                 <div className="flex gap-6 divide-x divide-gray-100 dark:divide-gray-700">
                     <div className="text-center px-2">
                         <div className="text-2xl font-bold text-yellow-500">4.9</div>
                         <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Taste</div>
                     </div>
                     <div className="text-center px-4">
                         <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">4.5</div>
                         <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Env</div>
                     </div>
                     <div className="text-center px-4">
                         <div className="text-2xl font-bold text-gray-700 dark:text-gray-200">4.7</div>
                         <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">Service</div>
                     </div>
                 </div>
             </div>
         </div>
      </div>

      {/* 2. Main Content Layout (Sticky Sidebar) */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-8">
          
          {/* Left: Sticky Categories */}
          <div className="hidden md:block w-48 shrink-0">
              <div className="sticky top-24 space-y-1">
                  {categories.map(cat => (
                      <button
                          key={cat}
                          onClick={() => {
                              setActiveCategory(cat);
                              document.getElementById(`cat-${cat}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          }}
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                              activeCategory === cat 
                              ? 'bg-white dark:bg-gray-800 text-wic-primary shadow-sm border-l-4 border-wic-primary' 
                              : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400'
                          }`}
                      >
                          {cat}
                      </button>
                  ))}
              </div>
          </div>

          {/* Right: Review Lists */}
          <div className="flex-1 space-y-8 min-w-0">
              {categories.map(cat => (
                  <div key={cat} id={`cat-${cat}`} className="scroll-mt-24">
                      <div className="flex items-center gap-2 mb-4">
                         <h3 className="text-lg font-bold text-gray-900 dark:text-white">{cat}</h3>
                         <div className="h-[1px] flex-1 bg-gray-100 dark:bg-gray-800"></div>
                      </div>
                      
                      <div className="space-y-4">
                          {shop.products.filter(p => (p.category || 'Other') === cat).map(product => (
                              <motion.div
                                layout
                                key={product.id}
                                className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all cursor-pointer group"
                                onClick={() => setSelectedProduct(product)}
                              >
                                  <div className="flex gap-4">
                                      {/* Image */}
                                      <div className="shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-lg overflow-hidden relative bg-gray-100">
                                          <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                          {/* Ranking Badge (Mockup) */}
                                          {product.reviews > 40 && (
                                              <div className="absolute top-0 left-0 bg-yellow-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-br-lg z-10">
                                                  TOP 1
                                              </div>
                                          )}
                                      </div>

                                      {/* Content */}
                                      <div className="flex-1 min-w-0 flex flex-col">
                                          <div className="flex justify-between items-start">
                                              <div>
                                                  <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate pr-2">{product.name}</h4>
                                                  <div className="flex items-center gap-2 mt-1 mb-2">
                                                      <StarRating rating={product.rating} size={12} />
                                                      <span className="text-xs text-gray-400">({product.reviews} reviews)</span>
                                                  </div>
                                              </div>
                                              <div className="text-lg font-bold text-wic-primary dark:text-wic-accent shrink-0">
                                                  ¥{product.price}
                                              </div>
                                          </div>

                                          {/* Tags */}
                                          <div className="flex flex-wrap gap-1.5 mb-3">
                                              {product.tags?.map(tag => (
                                                  <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded border border-gray-100 dark:border-gray-700">
                                                      {tag}
                                                  </span>
                                              ))}
                                          </div>

                                          {/* Micro-Review Bubble */}
                                          {product.topReview && (
                                              <div className="mt-auto hidden sm:flex items-start gap-2 bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg rounded-tl-none relative">
                                                   <div className="w-5 h-5 rounded-full bg-gray-200 overflow-hidden shrink-0">
                                                       <img src={product.topReview.avatar} alt="User" />
                                                   </div>
                                                   <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 italic">
                                                       "{product.topReview.content}"
                                                   </p>
                                              </div>
                                          )}
                                          
                                          {/* Mobile Description fallback */}
                                          {!product.topReview && (
                                              <p className="mt-auto text-xs text-gray-500 line-clamp-1">{product.description}</p>
                                          )}
                                      </div>

                                      {/* Action Column */}
                                      <div className="flex flex-col justify-between items-end pl-2 border-l border-gray-50 dark:border-gray-800 ml-2">
                                          <button 
                                              onClick={(e) => handleProductLike(product.id, e)}
                                              className={`flex flex-col items-center gap-0.5 p-1 rounded-lg transition-all ${
                                                  product.isLiked ? 'text-red-500' : 'text-gray-300 hover:text-gray-500'
                                              }`}
                                          >
                                              <ThumbsUp size={20} fill={product.isLiked ? "currentColor" : "none"} />
                                              <span className="text-[10px] font-bold">{product.likes}</span>
                                          </button>
                                          
                                          <button 
                                              onClick={(e) => {
                                                  e.stopPropagation();
                                                  setSelectedProduct(product);
                                              }}
                                              className="p-2 text-wic-primary bg-wic-primary/5 hover:bg-wic-primary/10 rounded-full transition-colors mt-2"
                                          >
                                              <PenLine size={18} />
                                          </button>
                                      </div>
                                  </div>
                              </motion.div>
                          ))}
                      </div>
                  </div>
              ))}
          </div>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
             <ProductDetailModal 
                item={selectedProduct} 
                onClose={() => setSelectedProduct(null)} 
                onComment={(text, rating) => handleAddComment(selectedProduct.id, text, rating)}
             />
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductDetailModal: React.FC<{
    item: Product; 
    onClose: () => void; 
    onComment: (text: string, rating: number) => void;
}> = ({ item, onClose, onComment }) => {
    const { t } = useLanguage();
    const [commentText, setCommentText] = useState('');
    const [rating, setRating] = useState(5);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (commentText.trim()) {
            onComment(commentText, rating);
            setCommentText('');
            setRating(5);
        }
    };

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 sm:p-6">
             <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
             />

             <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-4xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row ring-1 ring-gray-200 dark:ring-gray-800"
             >
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 p-2 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black text-gray-800 dark:text-white rounded-full transition-colors shadow-sm backdrop-blur-sm"
                >
                    <X size={20} />
                </button>

                {/* Left: Image */}
                <div className="w-full md:w-5/12 h-56 md:h-auto relative bg-gray-100 shrink-0">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:hidden" />
                    <div className="absolute bottom-4 left-4 md:hidden text-white pr-12">
                        <h2 className="text-xl font-bold line-clamp-1">{item.name}</h2>
                         <div className="flex items-center gap-2 text-sm text-gray-200 mt-1 font-bold">
                                ¥{item.price}
                         </div>
                    </div>
                </div>

                {/* Right: Content */}
                <div className="flex-1 flex flex-col min-h-0 w-full md:w-7/12 relative">
                    {/* Header (Fixed) */}
                    <div className="p-6 pb-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10 hidden md:block">
                        <div className="flex justify-between items-start mb-2">
                             <div>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">{item.name}</h2>
                                <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">{item.description}</p>
                             </div>
                             <div className="text-xl font-bold text-wic-primary dark:text-wic-accent">
                                ¥{item.price}
                             </div>
                        </div>

                        <div className="flex items-center gap-4 mt-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700">
                                <StarRating rating={item.rating} size={16} />
                                <span className="text-xs font-bold ml-1">{item.reviews} reviews</span>
                            </div>
                            {item.tags?.map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded border border-blue-100 dark:border-blue-900">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Scrollable Comments */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                        <div className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-2 md:hidden">
                            <span className="text-lg">¥{item.price}</span>
                             <StarRating rating={item.rating} />
                        </div>
                        
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 md:hidden">{item.description}</p>

                        <div>
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider opacity-80">
                                <MessageCircle size={16} />
                                {t('food.product_reviews')} ({item.comments.length})
                            </h3>
                            <div className="space-y-4">
                                {item.comments.length > 0 ? (
                                    item.comments.map(comment => (
                                        <div key={comment.id} className="group flex gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                            <img src={comment.avatar} alt={comment.user} className="w-10 h-10 rounded-full bg-gray-200 object-cover ring-2 ring-white dark:ring-gray-800" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white">{comment.user}</span>
                                                    <span className="text-xs text-gray-400">{comment.date}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{comment.content}</p>
                                                <div className="mt-1">
                                                    <StarRating rating={comment.rating} size={10} />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
                                            <MessageCircle size={20} />
                                        </div>
                                        <p className="text-sm text-gray-400">{t('food.no_comments') || '暂无评论'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Input Footer (Fixed) */}
                    <div className="p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shrink-0">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <div className="flex items-center justify-between px-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">Rate this dish:</span>
                                <InteractiveStarRating value={rating} onChange={setRating} size={20} />
                            </div>
                            <div className="flex gap-2 items-center bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full border border-transparent focus-within:border-wic-primary/30 focus-within:bg-white dark:focus-within:bg-gray-950 focus-within:ring-2 focus-within:ring-wic-primary/10 transition-all">
                                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden shrink-0 ml-1">
                                    <img src="https://picsum.photos/seed/me/40/40" alt="Me" className="w-full h-full object-cover" />
                                </div>
                                <input 
                                    type="text" 
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder={t('food.write_review')}
                                    className="flex-1 bg-transparent border-none focus:outline-none text-sm px-2 py-1 text-gray-800 dark:text-gray-200 placeholder:text-gray-400"
                                />
                                <button 
                                    type="submit"
                                    disabled={!commentText.trim()}
                                    className="p-2 rounded-full bg-wic-primary text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-wic-secondary transition-colors shadow-sm"
                                >
                                    <Send size={16} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
             </motion.div>
        </div>
    );
};

export default FoodDetail;
