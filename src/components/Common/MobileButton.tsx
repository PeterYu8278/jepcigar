import React from 'react';
import { Button, ButtonProps } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import useMobile from '@/hooks/useMobile';
import useTouchGestures from '@/hooks/useTouchGestures';

interface MobileButtonProps extends ButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  fullWidth?: boolean;
  hapticFeedback?: boolean;
  onTouchFeedback?: () => void;
}

const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  loading = false,
  fullWidth = false,
  hapticFeedback = true,
  onTouchFeedback,
  className = '',
  style = {},
  ...props
}) => {
  const { isMobile, isTouchDevice } = useMobile();

  // 触摸反馈
  const { bindTouchEvents } = useTouchGestures({
    onTap: () => {
      if (hapticFeedback && isTouchDevice) {
        // 触觉反馈（如果支持）
        if (navigator.vibrate) {
          navigator.vibrate(50);
        }
      }
      onTouchFeedback?.();
    },
  });

  // 移动端样式
  const mobileStyles: React.CSSProperties = {
    minHeight: isMobile ? '44px' : undefined,
    minWidth: isMobile ? '44px' : undefined,
    fontSize: isMobile ? '16px' : undefined, // 防止iOS缩放
    width: fullWidth ? '100%' : undefined,
    ...style,
  };

  // 移动端类名
  const mobileClassName = `
    ${className}
    ${isMobile ? 'touch-target touch-feedback' : ''}
    ${fullWidth ? 'w-full' : ''}
  `.trim();

  // 渲染加载图标
  const renderIcon = () => {
    if (loading) {
      return <LoadingOutlined />;
    }
    return props.icon;
  };

  return (
    <Button
      {...props}
      icon={renderIcon()}
      loading={loading}
      className={mobileClassName}
      style={mobileStyles}
      ref={(ref) => {
        if (ref && isTouchDevice) {
          bindTouchEvents(ref);
        }
      }}
    >
      {children}
    </Button>
  );
};

export default MobileButton;
