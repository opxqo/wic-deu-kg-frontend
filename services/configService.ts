import apiClient, { ApiResult } from './apiClient';

export interface SysConfigVO {
    maintenanceMode: boolean;
    openRegistration: boolean;
}

export const configService = {
    /**
     * Get system configuration
     */
    getSystemConfig: async (): Promise<ApiResult<SysConfigVO>> => {
        return apiClient.get<SysConfigVO>('/api/admin/config');
    },

    /**
     * Update system configuration
     */
    updateSystemConfig: async (config: SysConfigVO): Promise<ApiResult<SysConfigVO>> => {
        return apiClient.put<SysConfigVO>('/api/admin/config', config);
    }
};
