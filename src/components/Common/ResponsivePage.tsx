import React from 'react';
import useMobile from '@/hooks/useMobile';

interface ResponsivePageProps {
  desktopComponent: React.ComponentType<any>;
  mobileComponent: React.ComponentType<any>;
  [key: string]: any; // 允许传递其他props
}

/**
 * 响应式页面组件
 * 根据设备类型自动切换桌面端和移动端组件
 */
const ResponsivePage: React.FC<ResponsivePageProps> = ({
  desktopComponent: DesktopComponent,
  mobileComponent: MobileComponent,
  ...props
}) => {
  const { isMobile } = useMobile();

  // 移动端优先，然后根据设备类型选择组件
  if (isMobile) {
    return <MobileComponent {...props} />;
  }

  return <DesktopComponent {...props} />;
};

export default ResponsivePage;
