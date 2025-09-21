import React from 'react';
import { TrendingUpOutlined, CaretDownOutlined } from '@ant-design/icons';

interface TrendIconProps {
  /** 趋势方向 */
  direction: 'up' | 'down' | 'neutral';
  /** 自定义类名 */
  className?: string;
  /** 图标大小 */
  size?: 'small' | 'medium' | 'large';
  /** 自定义颜色 */
  color?: string;
}

/**
 * 趋势图标组件
 * 用于显示数据的变化趋势
 */
const TrendIcon: React.FC<TrendIconProps> = ({
  direction,
  className = '',
  size = 'medium',
  color
}) => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  const defaultColors = {
    up: 'text-green-500',
    down: 'text-red-500',
    neutral: 'text-gray-500'
  };

  const iconClasses = `
    ${sizeClasses[size]}
    ${color ? '' : defaultColors[direction]}
    ${className}
  `.trim();

  const iconStyle = color ? { color } : {};

  switch (direction) {
    case 'up':
      return <TrendingUpOutlined className={iconClasses} style={iconStyle} />;
    case 'down':
      return <CaretDownOutlined className={iconClasses} style={iconStyle} />;
    case 'neutral':
      return <span className={iconClasses} style={iconStyle}>—</span>;
    default:
      return null;
  }
};

export default TrendIcon;
