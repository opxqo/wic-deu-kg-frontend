
export interface Department {
  id: string;
  name: string;
  icon: string; // Emoji or icon name
  description: string;
  lastMessage?: string;
  lastTime?: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: string;
  isSelf: boolean;
  type?: 'text' | 'sticker';
}

export interface FoodComment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  rating: number;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  likes: number;
  rating: number;
  reviews: number;
  description?: string;
  isLiked: boolean;
  comments: FoodComment[];
  // New fields for Review System
  category?: string;
  tags?: string[];
  specs?: string[];
  spiciness?: number; // 0-3
  topReview?: {
    user: string;
    avatar: string;
    content: string;
  };
}

export interface FoodItem {
  id: string;
  name: string;
  location: 'Big Canteen 1F' | 'Big Canteen 2F' | 'Small Canteen' | 'Front Street' | 'Back Street' | 'Side Street';
  rating: number; // 1-5
  price: number;
  image: string;
  tags: string[];
  reviews: number;
  likes: number;
  isLiked: boolean;
  products: Product[]; // List of dishes
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  cover: string;
  studentComment: string;
  studentName: string;
}

export interface NavItem {
  label: string;
  path: string;
}

export interface UserProfile {
  name: string;
  id: string;
  email: string;
  department: string;
  major: string;
  bio: string;
  avatar: string;
  joinDate: string;
}
