import { apiClient, ApiResult } from './apiClient';

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

// 获取图片列表（分页）
export const getGalleryImages = async (
  category?: string,
  page: number = 1,
  size: number = 20
): Promise<ApiResult<PageResponse<GalleryImage>>> => {
  const params = new URLSearchParams();
  if (category && category !== 'all') {
    params.append('category', category);
  }
  params.append('page', page.toString());
  params.append('size', size.toString());

  // V3: GET /api/images
  return apiClient.get<PageResponse<GalleryImage>>(`/api/images?${params.toString()}`);
};

/**
 * 获取图片详情
 * V3: GET /api/images/{id}
 */
export const getGalleryImageDetail = async (id: number): Promise<ApiResult<GalleryImage>> => {
  return apiClient.get<GalleryImage>(`/api/images/${id}`);
};

/**
 * 获取精选图片
 * V3: GET /api/images?featured=true
 */
export const getFeaturedImages = async (): Promise<ApiResult<GalleryImage[]>> => {
  // 复用列表接口，筛选 featured=true
  // 注意：后端分页接口返回的是 PageResponse，前端这里期望 GalleryImage[]
  // 我们需要提取 records
  const result = await apiClient.get<PageResponse<GalleryImage>>('/api/images?featured=true&size=10');

  if (result.code === 0 && result.data) {
    return {
      code: 0,
      message: 'Success',
      data: result.data.records
    };
  }

  // 如果失败，返回空数组或透传
  return {
    code: result.code,
    message: result.message,
    data: [] as any
  };
};

/**
 * 获取分类列表
 * V3 文档中暂未找到 explicit endpoint。
 * 使用 Mock 数据或尝试 /api/images/categories
 */
export const getCategories = async (): Promise<ApiResult<CategoryInfo[]>> => {
  // 临时硬编码，防止页面报错
  const mockCategories: CategoryInfo[] = [
    { code: 'campus', nameZh: '校园风光', nameEn: 'Campus' },
    { code: 'activity', nameZh: '学生活动', nameEn: 'Activities' },
    { code: 'food', nameZh: '美食', nameEn: 'Food' },
    { code: 'other', nameZh: '其他', nameEn: 'Other' }
  ];

  return {
    code: 0,
    message: 'Success',
    data: mockCategories
  };
};

/**
 * 切换点赞状态
 * V3 추测: POST /api/images/{id}/likes (类似 products)
 * 或者 PUT /api/images/{id}/like
 */
export const toggleLike = async (
  imageId: number
): Promise<ApiResult<{ liked: boolean; likeCount: number }>> => {
  // 假设 POST /api/images/{id}/likes
  return apiClient.post<{ liked: boolean; likeCount: number }>(`/api/images/${imageId}/likes`);
};

// 上传图片参数
export interface UploadImageParams {
  file: File;
  title: string;
  description?: string;
  location?: string;
  category?: string;
  tags?: string; // 逗号分隔
}

/**
 * 上传图片
 * V3: POST /api/images
 */
export const uploadImage = async (
  params: UploadImageParams
): Promise<ApiResult<GalleryImage>> => {
  // 使用 apiClient.upload
  // 额外字段需传 title, description 等
  const extraData: Record<string, string> = {
    title: params.title,
  };
  if (params.description) extraData.description = params.description;
  if (params.location) extraData.location = params.location;
  if (params.category) extraData.category = params.category;
  if (params.tags) extraData.tags = params.tags;

  return apiClient.upload<GalleryImage>('/api/images', params.file, 'file', extraData);
};

/**
 * 获取我的图片
 * V3: GET /api/images?uploader=me ???
 * 或者 GET /api/users/me/images (暂未找到)
 * 尝试 filter by uploaderId if we knew it, but standard usually /users/me/images.
 * 
 * 临时使用 /api/images?my=true 如果后端支持，或者假设后端有 /api/users/me/images
 */
export const getMyImages = async (
  page: number = 1,
  size: number = 20
): Promise<ApiResult<PageResponse<GalleryImage>>> => {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  params.append('size', size.toString());

  // 尝试 V3 可能的路径
  return apiClient.get<PageResponse<GalleryImage>>(`/api/users/me/images?${params.toString()}`);
};

/**
 * 删除我的图片
 * V3: DELETE /api/images/{id}
 */
export const deleteMyImage = async (
  imageId: number
): Promise<ApiResult<null>> => {
  return apiClient.delete<null>(`/api/images/${imageId}`);
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
