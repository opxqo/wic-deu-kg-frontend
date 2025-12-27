import { apiClient, ApiResult } from './apiClient';

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

const departmentService = {
  /**
   * 获取所有启用的学部列表
   * V3: GET /api/departments
   */
  async getAllDepartments(): Promise<ApiResult<DepartmentVO[]>> {
    // 公共接口 /api/departments
    return apiClient.get<DepartmentVO[]>('/api/departments');
  },

  /**
   * 获取单个学部详情
   * V3: GET /api/departments/{id}
   */
  async getDepartmentById(id: number): Promise<ApiResult<DepartmentVO>> {
    return apiClient.get<DepartmentVO>(`/api/departments/${id}`);
  }
};

export default departmentService;
