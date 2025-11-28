
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, StarHalf, MapPin, Heart, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FoodItem, FoodComment } from '../types';
import { useLanguage } from '../LanguageContext';

export const initialFoodData: FoodItem[] = [
  {
    id: '1',
    name: "Auntie Wang's Spicy Pot",
    location: 'Big Canteen 1F',
    rating: 4.8,
    price: 15,
    image: 'https://picsum.photos/seed/food1/400/300',
    tags: ['Spicy', 'Hot Pot', 'Popular'],
    reviews: 124,
    likes: 842,
    isLiked: false,
    products: [
        { 
            id: '1-1', name: 'Signature Beef Pot', price: 25, image: 'https://picsum.photos/seed/beef/200/200', rating: 4.9, reviews: 45, likes: 120, isLiked: false, description: 'Fresh beef slices with secret spicy sauce.',
            comments: [
                { id: '101', user: 'Li Ming', avatar: 'https://picsum.photos/seed/user1/40/40', content: 'Best spicy pot in campus! The beef is so fresh.', rating: 5, date: '2 days ago' },
                { id: '102', user: 'Sarah', avatar: 'https://picsum.photos/seed/user2/40/40', content: 'A bit too oily for me, but tasty.', rating: 4, date: '1 week ago' },
            ]
        },
        { 
            id: '1-2', name: 'Veggie Delight', price: 15, image: 'https://picsum.photos/seed/veg/200/200', rating: 4.5, reviews: 22, likes: 80, isLiked: false, description: 'Assorted seasonal vegetables.',
            comments: []
        },
        { 
            id: '1-3', name: 'Seafood Combo', price: 30, image: 'https://picsum.photos/seed/seafood/200/200', rating: 4.7, reviews: 30, likes: 95, isLiked: false, description: 'Shrimp, fish balls, and crab sticks.',
            comments: []
        }
    ]
  },
  {
    id: '2',
    name: "Morning Dew Coffee",
    location: 'Side Street',
    rating: 4.5,
    price: 12,
    image: 'https://picsum.photos/seed/food2/400/300',
    tags: ['Coffee', 'Study Spot', 'Cake'],
    reviews: 89,
    likes: 420,
    isLiked: false,
    products: [
        { 
            id: '2-1', name: 'Iced Americano', price: 12, image: 'https://picsum.photos/seed/coffee/200/200', rating: 4.8, reviews: 50, likes: 200, isLiked: false, description: 'Dark roast, very refreshing.',
            comments: []
        },
        { 
            id: '2-2', name: 'Matcha Latte', price: 18, image: 'https://picsum.photos/seed/matcha/200/200', rating: 4.6, reviews: 35, likes: 150, isLiked: false, description: 'Made with premium matcha powder.',
            comments: []
        },
         { 
            id: '2-3', name: 'Cheesecake', price: 22, image: 'https://picsum.photos/seed/cake/200/200', rating: 4.9, reviews: 60, likes: 180, isLiked: false, description: 'Rich and creamy.',
            comments: [
                { id: '201', user: 'CoffeeLover', avatar: 'https://picsum.photos/seed/user3/40/40', content: 'Goes perfect with the latte!', rating: 5, date: '3 days ago' }
            ]
        }
    ]
  },
  {
    id: '3',
    name: "Crispy Chicken Rice",
    location: 'Small Canteen',
    rating: 4.2,
    price: 10,
    image: 'https://picsum.photos/seed/food3/400/300',
    tags: ['Crispy', 'Fast', 'Budget'],
    reviews: 210,
    likes: 156,
    isLiked: false,
    products: [
        { id: '3-1', name: 'Original Crispy Chicken', price: 10, image: 'https://picsum.photos/seed/chk1/200/200', rating: 4.3, reviews: 100, likes: 80, isLiked: false, comments: [] },
        { id: '3-2', name: 'Spicy Chicken Rice', price: 12, image: 'https://picsum.photos/seed/chk2/200/200', rating: 4.1, reviews: 80, likes: 60, isLiked: false, comments: [] }
    ]
  },
  {
    id: '4',
    name: "Green Garden Salad",
    location: 'Big Canteen 2F',
    rating: 4.6,
    price: 18,
    image: 'https://picsum.photos/seed/food4/400/300',
    tags: ['Healthy', 'Vegan', 'Fresh'],
    reviews: 56,
    likes: 92,
    isLiked: false,
    products: [
        { id: '4-1', name: 'Chicken Caesar Salad', price: 18, image: 'https://picsum.photos/seed/salad1/200/200', rating: 4.7, reviews: 20, likes: 40, isLiked: false, comments: [] },
        { id: '4-2', name: 'Quinoa Power Bowl', price: 22, image: 'https://picsum.photos/seed/salad2/200/200', rating: 4.8, reviews: 15, likes: 35, isLiked: false, comments: [] }
    ]
  },
  {
    id: '5',
    name: "Late Night BBQ",
    location: 'Back Street',
    rating: 4.9,
    price: 30,
    image: 'https://picsum.photos/seed/food5/400/300',
    tags: ['BBQ', 'Friends', 'Beer'],
    reviews: 342,
    likes: 1024,
    isLiked: true,
    products: [
        { 
            id: '5-1', name: 'Lamb Skewers (5pcs)', price: 15, image: 'https://picsum.photos/seed/lamb/200/200', rating: 5.0, reviews: 200, likes: 500, isLiked: true, description: 'The legendary lamb skewers.',
            comments: [{ id: '501', user: 'PartyKing', avatar: 'https://picsum.photos/seed/user5/40/40', content: 'Must try!', rating: 5, date: 'Yesterday' }]
        },
        { id: '5-2', name: 'Grilled Eggplant', price: 12, image: 'https://picsum.photos/seed/eggplant/200/200', rating: 4.8, reviews: 150, likes: 300, isLiked: false, comments: [] },
        { id: '5-3', name: 'Chicken Wings', price: 10, image: 'https://picsum.photos/seed/wings/200/200', rating: 4.7, reviews: 120, likes: 250, isLiked: false, comments: [] }
    ]
  },
   {
    id: '6',
    name: "Front St. Noodle House",
    location: 'Front Street',
    rating: 4.3,
    price: 12,
    image: 'https://picsum.photos/seed/food6/400/300',
    tags: ['Noodles', 'Beef', 'Traditional'],
    reviews: 78,
    likes: 330,
    isLiked: false,
    products: [
         { id: '6-1', name: 'Beef Noodles', price: 14, image: 'https://picsum.photos/seed/noodle1/200/200', rating: 4.5, reviews: 40, likes: 100, isLiked: false, comments: [] },
         { id: '6-2', name: 'Tomato Egg Noodles', price: 10, image: 'https://picsum.photos/seed/noodle2/200/200', rating: 4.2, reviews: 30, likes: 80, isLiked: false, comments: [] }
    ]
  }
];

export const filterMap = {
    'All': 'food.filter.all',
    'Big Canteen 1F': 'food.filter.big_canteen_1f',
    'Big Canteen 2F': 'food.filter.big_canteen_2f',
    'Small Canteen': 'food.filter.small_canteen',
    'Front Street': 'food.filter.front_street',
    'Back Street': 'food.filter.back_street',
    'Side Street': 'food.filter.side_street'
};

export const StarRating = ({ rating, size = 14, className = "" }: { rating: number; size?: number; className?: string }) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => {
                // Check if we should render a full star, half star, or empty star
                // Example: rating 4.5
                // star 4: 4.5 >= 4 (True) -> Full
                // star 5: 4.5 >= 5 (False). 4.5 >= 4.5 (True) -> Half?
                
                // Logic:
                // Full Star: if rating >= star
                // Half Star: if rating >= star - 0.5 (and not full)
                // Empty: else
                
                if (rating >= star) {
                    return <Star key={star} size={size} className="text-yellow-400 fill-yellow-400" />;
                } else if (rating >= star - 0.5) {
                    return <StarHalf key={star} size={size} className="text-yellow-400 fill-yellow-400" />;
                } else {
                    return <Star key={star} size={size} className="text-gray-300 dark:text-gray-600" />;
                }
            })}
        </div>
        <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{rating}</span>
    </div>
  );
};

const Food: React.FC = () => {
  const [items, setItems] = useState<FoodItem[]>(initialFoodData);
  const [activeFilter, setActiveFilter] = useState('All');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems(prev => prev.map(item => {
        if (item.id === id) {
            return {
                ...item,
                isLiked: !item.isLiked,
                likes: item.isLiked ? item.likes - 1 : item.likes + 1
            };
        }
        return item;
    }));
  };

  const filteredFood = activeFilter === 'All' 
    ? items 
    : items.filter(item => item.location === activeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('food.title')}</h1>
            <p className="text-gray-500 dark:text-gray-400">{t('food.subtitle')}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-x-auto scrollbar-hide">
            {Object.keys(filterMap).map(filter => (
                <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                        activeFilter === filter 
                        ? 'bg-wic-primary text-white shadow-sm' 
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                >
                    {t(filterMap[filter as keyof typeof filterMap])}
                </button>
            ))}
        </div>
      </div>

      {/* Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
            {filteredFood.map((item) => (
                <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    key={item.id}
                    onClick={() => navigate(`/food/${item.id}`)}
                    className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 group cursor-pointer flex flex-col h-full"
                >
                    <div className="relative h-48 overflow-hidden shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-gray-900/90 backdrop-blur px-2 py-1 rounded-md text-xs font-bold text-gray-800 dark:text-gray-100 flex items-center gap-1 shadow-sm">
                            <MapPin size={12} className="text-wic-primary dark:text-wic-accent" /> {t(filterMap[item.location as keyof typeof filterMap])}
                        </div>
                        <button 
                            onClick={(e) => handleLike(item.id, e)}
                            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                                item.isLiked 
                                ? 'bg-red-500/90 text-white shadow-lg scale-110' 
                                : 'bg-white/50 text-white hover:bg-white/80'
                            }`}
                        >
                            <Heart size={18} fill={item.isLiked ? "currentColor" : "none"} />
                        </button>
                    </div>
                    
                    <div className="p-5 flex flex-col flex-grow">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">{item.name}</h3>
                            <StarRating rating={item.rating} />
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {item.tags.map(tag => (
                                <span key={tag} className="text-xs px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded border border-gray-100 dark:border-gray-700">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50 dark:border-gray-800">
                             <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 text-sm">
                                <div className="flex items-center gap-1">
                                    <MessageCircle size={14} />
                                    <span>{item.reviews}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Heart size={14} className={item.isLiked ? 'text-red-500' : ''} fill={item.isLiked ? 'currentColor' : 'none'}/>
                                    <span>{item.likes}</span>
                                </div>
                             </div>
                            <div className="font-bold text-gray-900 dark:text-white flex items-center">
                                <span className="text-xs text-gray-400 mr-1">{t('food.avg')}</span>
                                <span className="text-wic-primary dark:text-wic-accent">¥{item.price}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
      </motion.div>

      {filteredFood.length === 0 && (
          <div className="text-center py-20 text-gray-400">
              {t('food.no_results')}
          </div>
      )}
    </div>
  );
};

export default Food;
