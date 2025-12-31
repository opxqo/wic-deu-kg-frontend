/**
 * 仪表盘 API 服务
 * 获取管理面板仪表盘的统计数据
 */

import apiClient, { ApiResult } from './apiClient';

// ============ 类型定义 ============

/** 每日统计 */
export interface DailyCount {
    /** 日期 (yyyy-MM-dd) */
    date: string;
    /** 数量 */
    count: number;
}

/** 统计卡片数据 */
export interface StatCard {
    /** 用户总数 */
    totalUsers: number;
    /** 今日新增用户 */
    newUsersToday: number;
    /** 文章总数 */
    totalArticles: number;
    /** 已发布文章数 */
    publishedArticles: number;
    /** 图片总数 */
    totalGalleryImages: number;
    /** 留言总数 */
    totalMessages: number;
}

/** 待处理项 */
export interface PendingItems {
    /** 待审核留言数 */
    pendingMessages: number;
    /** 待审核图片数 */
    pendingImages: number;
    /** 禁用用户数 */
    disabledUsers: number;
    /** 草稿文章数 */
    draftArticles: number;
}

/** 趋势数据 */
export interface TrendData {
    /** 最近7天用户增长趋势 */
    userTrend: DailyCount[];
    /** 最近7天文章增长趋势 */
    articleTrend: DailyCount[];
}

/** 系统状态 */
export interface SystemStatus {
    /** 服务器时间 */
    serverTime: string;
    /** JVM已用内存(MB) */
    jvmMemoryUsed: number;
    /** JVM最大内存(MB) */
    jvmMemoryMax: number;
    /** CPU核心数 */
    cpuCores: number;
    /** 操作系统 */
    osName: string;
    /** Java版本 */
    javaVersion: string;
}

/** 仪表盘完整数据 */
export interface DashboardVO {
    statCard: StatCard;
    pendingItems: PendingItems;
    trendData: TrendData;
    systemStatus: SystemStatus;
}

// ============ API 调用 ============

/**
 * 获取仪表盘数据
 */
export async function getDashboardData(): Promise<ApiResult<DashboardVO>> {
    return apiClient.get<DashboardVO>('/api/admin/dashboard');
}

export default {
    getDashboardData,
};
