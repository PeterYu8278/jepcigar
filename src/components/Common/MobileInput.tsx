import React, { forwardRef } from 'react';
import { Input, InputProps } from 'antd';
import useMobile from '@/hooks/useMobile';

interface MobileInputProps extends InputProps {
  fullWidth?: boolean;
  preventZoom?: boolean;
}

const MobileInput = forwardRef<any, MobileInputProps>(({
  fullWidth = false,
  preventZoom = true,
  className = '',
  style = {},
  ...props
}, ref) => {
  const { isMobile } = useMobile();

  // 移动端样式
  const mobileStyles: React.CSSProperties = {
    height: isMobile ? '44px' : undefined,
    fontSize: isMobile && preventZoom ? '16px' : undefined, // 防止iOS缩放
    width: fullWidth ? '100%' : undefined,
    ...style,
  };

  // 移动端类名
  const mobileClassName = `
    ${className}
    ${isMobile ? 'touch-target' : ''}
    ${fullWidth ? 'w-full' : ''}
  `.trim();

  return (
    <Input
      {...props}
      ref={ref}
      className={mobileClassName}
      style={mobileStyles}
    />
  );
});

MobileInput.displayName = 'MobileInput';

export default MobileInput;
