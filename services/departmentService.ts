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
  },

  // --- Admin APIs ---

  /**
   * 获取院系列表 (Admin)
   * Endpoint: GET /api/admin/departments
   */
  async getDepartmentsAdmin(params: { page?: number; size?: number; keyword?: string }): Promise<ApiResult<any>> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', params.page.toString());
    if (params.size) query.append('size', params.size.toString());
    if (params.keyword) query.append('keyword', params.keyword);

    return apiClient.get<any>(`/api/admin/departments?${query.toString()}`);
  },

  /**
   * 创建院系 (Admin)
   * Endpoint: POST /api/admin/departments
   */
  async createDepartment(data: Partial<DepartmentVO>): Promise<ApiResult<void>> {
    return apiClient.post<void>('/api/admin/departments', data);
  },

  /**
   * 更新院系 (Admin)
   * Endpoint: PUT /api/admin/departments/{id}
   */
  async updateDepartment(id: number | string, data: Partial<DepartmentVO>): Promise<ApiResult<void>> {
    return apiClient.put<void>(`/api/admin/departments/${id}`, data);
  },

  /**
   * 删除院系 (Admin)
   * Endpoint: DELETE /api/admin/departments/{id}
   */
  async deleteDepartment(id: number | string): Promise<ApiResult<void>> {
    return apiClient.delete<void>(`/api/admin/departments/${id}`);
  }
};

export default departmentService;
