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

  // 在移动设备上使用移动端优化的仪表盘
  if (isMobile) {
    return <MobileDashboardPage />;
  }

  // 在桌面设备上使用标准仪表盘
  return <DashboardPage />;
};

export default ResponsiveDashboard;
