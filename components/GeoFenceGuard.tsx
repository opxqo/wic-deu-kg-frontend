import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, AlertTriangle, CheckCircle, X, Navigation } from 'lucide-react';
import { geoLocationService, GeoCheckResult } from '../services/geoLocationService';

interface GeoFenceGuardProps {
  /**
   * 是否在应用启动时自动检查位置
   */
  autoCheck?: boolean;
  /**
   * 是否阻止非校园用户访问（显示遮罩）
   */
  blockAccess?: boolean;
  /**
   * 允许手动关闭提示
   */
  dismissible?: boolean;
  /**
   * 子组件
   */
  children?: React.ReactNode;
}

/**
 * 地理围栏守卫组件
 * 在应用启动时检查用户是否在校园范围内
 */
const GeoFenceGuard: React.FC<GeoFenceGuardProps> = ({
  autoCheck = true,
  blockAccess = false,
  dismissible = true,
  children,
}) => {
  const [checkResult, setCheckResult] = useState<GeoCheckResult | null>(
    geoLocationService.getCheckResult()
  );
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (autoCheck) {
      performCheck();
    }

    // 订阅校验结果变化
    const unsubscribe = geoLocationService.onCheckResultChange((result) => {
      setCheckResult(result);
      if (result && !result.allowed) {
        setShowBanner(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [autoCheck]);

  const performCheck = async () => {
    setIsChecking(true);
    setError(null);

    try {
      const result = await geoLocationService.autoCheckLocation();
      setCheckResult(result);
      
      // 如果不在范围内，显示提示
      if (!result.allowed) {
        setShowBanner(true);
      }
    } catch (e: any) {
      setError(e.message || '位置校验失败');
      setShowBanner(true);
    } finally {
      setIsChecking(false);
    }
  };

  const handleDismiss = () => {
    if (dismissible) {
      setIsDismissed(true);
      setShowBanner(false);
    }
  };

  const handleRetry = () => {
    performCheck();
  };

  const handleRequestLocation = async () => {
    setIsChecking(true);
    try {
      await geoLocationService.requestLocation();
      await performCheck();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsChecking(false);
    }
  };

  // 如果需要阻止访问且用户不在范围内
  if (blockAccess && checkResult && !checkResult.allowed && !isDismissed) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-4 bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl"
        >
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
              <MapPin className="w-10 h-10 text-amber-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              仅限校园内使用
            </h2>
            
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {checkResult.message}
            </p>
            
            {checkResult.distanceMeters !== undefined && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                您当前距离校园中心约 <span className="font-bold text-amber-500">{Math.round(checkResult.distanceMeters / 100) / 10} km</span>
              </p>
            )}
            
            <div className="flex gap-4">
              <button
                onClick={handleRequestLocation}
                disabled={isChecking}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {isChecking ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    检测中...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    重新定位
                  </span>
                )}
              </button>
              
              {dismissible && (
                <button
                  onClick={handleDismiss}
                  className="px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-medium transition-colors"
                >
                  继续浏览
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      {children}
      
      {/* 顶部提示横幅 */}
      <AnimatePresence>
        {showBanner && !isDismissed && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50"
          >
            <div className={`
              px-4 py-3 flex items-center justify-between
              ${checkResult?.allowed 
                ? 'bg-green-500 text-white' 
                : error 
                  ? 'bg-red-500 text-white'
                  : 'bg-amber-500 text-white'
              }
            `}>
              <div className="flex items-center gap-3">
                {isChecking ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : checkResult?.allowed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertTriangle className="w-5 h-5" />
                )}
                
                <span className="text-sm font-medium">
                  {isChecking 
                    ? '正在检测您的位置...'
                    : error 
                      ? error
                      : checkResult?.message || '位置校验中...'
                  }
                </span>
                
                {checkResult?.distanceMeters !== undefined && !checkResult.allowed && (
                  <span className="text-sm opacity-80">
                    (距校园 {Math.round(checkResult.distanceMeters / 100) / 10} km)
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {!checkResult?.allowed && !isChecking && (
                  <button
                    onClick={handleRetry}
                    className="text-sm underline hover:no-underline"
                  >
                    重试
                  </button>
                )}
                
                {dismissible && (
                  <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-white/20 rounded transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GeoFenceGuard;
