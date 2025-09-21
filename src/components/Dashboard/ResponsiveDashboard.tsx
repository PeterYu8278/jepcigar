import React from 'react';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import MobileDashboardPage from '@/pages/Dashboard/MobileDashboardPage';
import useMobile from '@/hooks/useMobile';

/**
 * 响应式仪表盘组件
 * 根据设备类型自动切换桌面端和移动端布局
 */
const ResponsiveDashboard: React.FC = () => {
  const { isMobile } = useMobile();

  // 移动端使用优化的行显示布局
  if (isMobile) {
    return <MobileDashboardPage />;
  }

  // 桌面端使用原有的网格布局
  return <DashboardPage />;
};

export default ResponsiveDashboard;
