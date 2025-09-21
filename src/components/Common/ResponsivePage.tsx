import React from 'react';
import { useLocation } from 'react-router-dom';
import useMobile from '@/hooks/useMobile';

interface ResponsivePageProps {
  desktopComponent: React.ComponentType;
  mobileComponent: React.ComponentType;
  forceMobile?: boolean;
}

/**
 * 响应式页面组件
 * 根据设备类型自动选择桌面端或移动端页面组件
 */
const ResponsivePage: React.FC<ResponsivePageProps> = ({
  desktopComponent: DesktopComponent,
  mobileComponent: MobileComponent,
  forceMobile = false
}) => {
  const { isMobile } = useMobile();
  const location = useLocation();

  // 对于某些页面，强制使用移动端布局
  const forceMobilePages = [
    '/card/',  // 数字名片页面
  ];

  const shouldUseMobileLayout = forceMobile || isMobile || forceMobilePages.some(path => 
    location.pathname.includes(path)
  );

  if (shouldUseMobileLayout) {
    return <MobileComponent />;
  }

  return <DesktopComponent />;
};

export default ResponsivePage;
