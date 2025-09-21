import React from 'react';
import { MobileText, MobileStatus } from '@/components/Common/MobileComponents';
import TrendIcon from '@/components/Common/TrendIcon';

interface MobileStatCardProps {
  /** 统计项标题 */
  title: string;
  /** 统计值 */
  value: number | string;
  /** 图标 */
  icon?: React.ReactNode;
  /** 图标背景色 */
  iconBgColor?: string;
  /** 图标颜色 */
  iconColor?: string;
  /** 数值颜色 */
  valueColor?: string;
  /** 变化趋势 */
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  /** 是否显示分隔线 */
  showDivider?: boolean;
  /** 点击事件 */
  onClick?: () => void;
  /** 右侧操作按钮 */
  action?: React.ReactNode;
}

/**
 * 移动端优化的统计卡片组件
 * 专为移动端纵向布局设计，节省垂直空间
 */
const MobileStatCard: React.FC<MobileStatCardProps> = ({
  title,
  value,
  icon,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600',
  valueColor = 'text-blue-600',
  trend,
  showDivider = true,
  onClick,
  action
}) => {
  // 格式化数值
  const formatValue = (val: number | string): string => {
    if (typeof val === 'number') {
      return val.toLocaleString();
    }
    return val;
  };

  return (
    <div 
      className={`
        mobile-flex-between items-center py-3
        ${showDivider ? 'border-b border-gray-100' : ''}
        ${onClick ? 'cursor-pointer hover:bg-gray-50 transition-colors duration-200' : ''}
      `}
      onClick={onClick}
    >
      {/* 左侧：图标和内容 */}
      <div className="mobile-flex-start">
        {icon && (
          <div className={`w-10 h-10 ${iconBgColor} rounded-lg mobile-flex-center mr-3`}>
            <div className={`text-lg ${iconColor}`}>
              {icon}
            </div>
          </div>
        )}
        <div>
          <MobileText size="sm" color="secondary">
            {title}
          </MobileText>
          <MobileText 
            size="lg" 
            weight="bold" 
            className={`block ${valueColor}`}
          >
            {formatValue(value)}
          </MobileText>
        </div>
      </div>

      {/* 右侧：趋势和操作 */}
      <div className="mobile-flex-center space-x-2">
        {trend && (
          <div className="mobile-flex-center">
            <TrendIcon
              direction={trend.isPositive ? 'up' : 'down'}
              size={14}
              color={trend.isPositive ? '#52c41a' : '#ff4d4f'}
              className="mr-1"
            />
            <MobileStatus 
              status={trend.isPositive ? 'success' : 'error'} 
              size="small"
            >
              {trend.isPositive ? '+' : ''}{trend.value}%
            </MobileStatus>
          </div>
        )}
        
        {action && (
          <div onClick={(e) => e.stopPropagation()}>
            {action}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileStatCard;
