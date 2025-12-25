// Gallery API 服务
const API_BASE_URL = 'http://localhost:8080/api';

// 类型定义
export interface UserInfo {
  id: number;
  nickname: string;
  avatar?: string;
}

export interface GalleryImage {
  id: number;
  uploader: UserInfo;
  title: string;
  description?: string;
  location?: string;
  imageUrl: string;
  thumbnailUrl?: string;
  width: number;
  height: number;
  category: string;
  tags: string[];
  viewCount: number;
  likeCount: number;
  featured: boolean;
  liked: boolean;
  createdAt: string;
}

export interface CategoryInfo {
  code: string;
  nameZh: string;
  nameEn: string;
}

export interface PageResponse<T> {
  records: T[];
  total: number;
  pages: number;
  size: number;
  current: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

// 获取认证头
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// 获取图片列表（分页）
export const getGalleryImages = async (
  category?: string,
  page: number = 1,
  size: number = 20
): Promise<ApiResponse<PageResponse<GalleryImage>>> => {
  const params = new URLSearchParams();
  if (category && category !== 'all') {
    params.append('category', category);
  }
  params.append('page', page.toString());
  params.append('size', size.toString());

  const response = await fetch(
    `${API_BASE_URL}/gallery?${params.toString()}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    throw new Error('获取图片列表失败');
  }

  return response.json();
};

// 获取图片详情
export const getGalleryImageDetail = async (
  id: number
): Promise<ApiResponse<GalleryImage>> => {
  const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('获取图片详情失败');
  }

  return response.json();
};

// 获取精选图片
export const getFeaturedImages = async (): Promise<ApiResponse<GalleryImage[]>> => {
  const response = await fetch(`${API_BASE_URL}/gallery/featured`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('获取精选图片失败');
  }

  return response.json();
};

// 获取分类列表
export const getCategories = async (): Promise<ApiResponse<CategoryInfo[]>> => {
  const response = await fetch(`${API_BASE_URL}/gallery/categories`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('获取分类列表失败');
  }

  return response.json();
};

// 切换点赞状态
export const toggleLike = async (
  imageId: number
): Promise<ApiResponse<{ liked: boolean; likeCount: number }>> => {
  const response = await fetch(`${API_BASE_URL}/gallery/${imageId}/like`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('请先登录后再点赞');
    }
    throw new Error('点赞操作失败');
  }

  return response.json();
};

// 上传图片
export interface UploadImageParams {
  file: File;
  title: string;
  description?: string;
  location?: string;
  category?: string;
  tags?: string;
}

export const uploadImage = async (
  params: UploadImageParams
): Promise<ApiResponse<GalleryImage>> => {
  const token = localStorage.getItem('token');
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  // 不设置 Content-Type，让浏览器自动处理 multipart/form-data

  // 构建 query 参数
  const queryParams = new URLSearchParams();
  queryParams.append('title', params.title);
  if (params.description) {
    queryParams.append('description', params.description);
  }
  if (params.location) {
    queryParams.append('location', params.location);
  }
  if (params.category) {
    queryParams.append('category', params.category);
  }
  if (params.tags) {
    queryParams.append('tags', params.tags);
  }

  // 文件放在 FormData 中
  const formData = new FormData();
  formData.append('file', params.file);

  const response = await fetch(
    `${API_BASE_URL}/user/gallery/upload?${queryParams.toString()}`,
    {
      method: 'POST',
      headers,
      body: formData,
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('请先登录后再上传');
    }
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || '上传失败');
  }

  return response.json();
};

// 获取我的图片
export const getMyImages = async (
  page: number = 1,
  size: number = 20
): Promise<ApiResponse<PageResponse<GalleryImage>>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());

  const response = await fetch(
    `${API_BASE_URL}/user/gallery/my-images?${params.toString()}`,
    {
      method: 'GET',
      headers: getAuthHeaders(),
    }
  );

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('请先登录');
    }
    throw new Error('获取我的图片失败');
  }

  return response.json();
};

// 删除我的图片
export const deleteMyImage = async (
  imageId: number
): Promise<ApiResponse<null>> => {
  const response = await fetch(`${API_BASE_URL}/user/gallery/${imageId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('请先登录');
    }
    if (response.status === 403) {
      throw new Error('无权删除此图片');
    }
    throw new Error('删除失败');
  }

  return response.json();
};

export default {
  getGalleryImages,
  getGalleryImageDetail,
  getFeaturedImages,
  getCategories,
  toggleLike,
  uploadImage,
  getMyImages,
  deleteMyImage,
};
