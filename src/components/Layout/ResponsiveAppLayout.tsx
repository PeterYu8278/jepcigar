import React from 'react';
import { useLocation } from 'react-router-dom';
import AppLayout from './AppLayout';
import MobileAppLayout from './MobileAppLayout';
import useMobile from '@/hooks/useMobile';

interface ResponsiveAppLayoutProps {
  children: React.ReactNode;
}

/**
 * 响应式应用布局组件
 * 根据设备类型自动切换桌面端和移动端布局
 */
const ResponsiveAppLayout: React.FC<ResponsiveAppLayoutProps> = ({ children }) => {
  const { isMobile } = useMobile();
  const location = useLocation();

  // 对于某些页面，强制使用移动端布局
  const forceMobilePages = [
    '/card/',  // 数字名片页面
  ];

  const shouldUseMobileLayout = isMobile || forceMobilePages.some(path => 
    location.pathname.includes(path)
  );

  if (shouldUseMobileLayout) {
    return (
      <MobileAppLayout>
        {children}
      </MobileAppLayout>
    );
  }

  return (
    <AppLayout>
      {children}
    </AppLayout>
  );
};

export default ResponsiveAppLayout;
