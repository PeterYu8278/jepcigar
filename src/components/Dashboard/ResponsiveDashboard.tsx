import React from 'react';
import useMobile from '@/hooks/useMobile';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import MobileDashboardPage from '@/pages/Dashboard/MobileDashboardPage';

/**
 * 响应式仪表盘组件
 * 根据设备类型自动切换桌面端和移动端布局
 */
const ResponsiveDashboard: React.FC = () => {
  const { isMobile } = useMobile();

  if (isMobile) {
    return <MobileDashboardPage />;
  }

  return <DashboardPage />;
};

export default ResponsiveDashboard;
