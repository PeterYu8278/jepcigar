import React from 'react';
import DashboardPage from '@/pages/Dashboard/DashboardPage';
import MobileDashboardPage from '@/pages/Dashboard/MobileDashboardPage';
import useMobile from '@/hooks/useMobile';

interface ResponsiveDashboardProps {
  // 可以添加其他props如果需要
}

/**
 * 响应式仪表盘组件
 * 根据设备类型自动切换桌面端和移动端布局
 */
const ResponsiveDashboard: React.FC<ResponsiveDashboardProps> = () => {
  const { isMobile } = useMobile();

  // 根据设备类型选择对应的仪表盘组件
  if (isMobile) {
    return <MobileDashboardPage />;
  }

  return <DashboardPage />;
};

export default ResponsiveDashboard;
