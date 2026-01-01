import apiClient, { ApiResult } from './apiClient';

export interface DatabaseTableInfo {
    tableName: string;
    tableComment: string;
    rowCount: number;
    dataSizeBytes: number;
    dataSizeFormatted: string;
    indexSizeBytes: number;
    createTime: string;
    updateTime: string | null;
}

export interface DatabaseBackupInfo {
    databaseName: string;
    databaseVersion: string;
    databaseSizeBytes: number;
    databaseSizeFormatted: string;
    tableCount: number;
    totalRecords: number;
    backupFileUrl: string | null;
    backupTime: string;
    tables: DatabaseTableInfo[];
}

export const databaseService = {
    /**
     * Get database backup information
     */
    getBackupInfo: async (): Promise<ApiResult<DatabaseBackupInfo>> => {
        return apiClient.get<DatabaseBackupInfo>('/api/admin/database/backup');
    },

    /**
     * Execute database backup
     */
    executeBackup: async (): Promise<ApiResult<DatabaseBackupInfo>> => {
        return apiClient.post<DatabaseBackupInfo>('/api/admin/database/backup');
    },
};
