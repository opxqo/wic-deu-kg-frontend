// 学部服务 - 对接后端 API
// @ts-ignore
const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL as string) || '';

// 辅导员信息
export interface CounselorInfo {
  id: number;
  name: string;
  avatar: string;
  title: string;
}

// 学部 VO
export interface DepartmentVO {
  id: number;
  code: string;
  nameZh: string;
  nameEn: string;
  icon: string;
  descriptionZh: string;
  descriptionEn: string;
  location: string;
  hotMajorZh: string;
  hotMajorEn: string;
  onlineCount: number;
  sortOrder: number;
  counselors: CounselorInfo[];
}

// API 响应包装
export interface ApiResult<T> {
  code: number;
  message: string;
  data: T;
}

const departmentService = {
  /**
   * 获取所有启用的学部列表
   * @returns 学部列表
   */
  async getAllDepartments(): Promise<ApiResult<DepartmentVO[]>> {
    const response = await fetch(`${API_BASE_URL}/api/departments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok || result.code !== 200) {
      throw new Error(result.message || '获取学部列表失败');
    }

    return result;
  },

  /**
   * 获取单个学部详情
   * @param id 学部ID
   * @returns 学部详情
   */
  async getDepartmentById(id: number): Promise<ApiResult<DepartmentVO>> {
    const response = await fetch(`${API_BASE_URL}/api/departments/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok || result.code !== 200) {
      throw new Error(result.message || '获取学部详情失败');
    }

    return result;
  },
};

export default departmentService;
