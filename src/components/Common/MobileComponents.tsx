import React from 'react';
import { Button, Input, Card, Typography, Tag, Spin } from 'antd';
import { ButtonProps, InputProps } from 'antd';
import useMobile from '@/hooks/useMobile';

const { Text, Title } = Typography;

// 移动端优化的按钮组件
interface MobileButtonProps extends Omit<ButtonProps, 'variant' | 'size'> {
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  fullWidth = false,
  size = 'medium',
  variant = 'primary',
  className = '',
  children,
  ...props
}) => {
  const { isMobile } = useMobile();

  const sizeClasses = {
    small: 'mobile-btn-sm',
    medium: 'mobile-btn',
    large: 'mobile-btn-lg'
  };

  const variantClasses = {
    primary: 'mobile-btn-primary',
    secondary: 'mobile-btn-secondary',
    outline: 'mobile-btn-outline',
    ghost: 'bg-transparent text-gray-700 hover:bg-gray-100'
  };

  const classes = `
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${fullWidth ? 'mobile-btn-full' : ''}
    ${isMobile ? 'mobile-touch-feedback mobile-touch-target' : ''}
    ${className}
  `.trim();

  return (
    <Button
      {...props}
      size={size === 'medium' ? undefined : size}
      className={classes}
    >
      {children}
    </Button>
  );
};

// 移动端优化的输入框组件
interface MobileInputProps extends Omit<InputProps, 'size'> {
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const MobileInput: React.FC<MobileInputProps> = ({
  fullWidth = false,
  size = 'medium',
  className = '',
  ...props
}) => {
  const { isMobile } = useMobile();

  const sizeClasses = {
    small: 'mobile-input-sm',
    medium: 'mobile-input',
    large: 'mobile-input-lg'
  };

  const classes = `
    ${sizeClasses[size]}
    ${fullWidth ? 'w-full' : ''}
    ${isMobile ? 'mobile-touch-target' : ''}
    ${className}
  `.trim();

  return (
    <Input
      {...props}
      size={size === 'medium' ? undefined : size}
      className={classes}
    />
  );
};

// 移动端优化的卡片组件
interface MobileCardProps {
  children: React.ReactNode;
  title?: string;
  size?: 'small' | 'medium' | 'large';
  elevated?: boolean;
  className?: string;
  onClick?: () => void;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  title,
  size = 'medium',
  elevated = false,
  className = '',
  onClick
}) => {
  const { isMobile } = useMobile();

  const sizeClasses = {
    small: 'mobile-card-sm',
    medium: 'mobile-card',
    large: 'mobile-card-lg'
  };

  const classes = `
    ${sizeClasses[size]}
    ${elevated ? 'mobile-card-elevated' : ''}
    ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-200' : ''}
    ${isMobile ? 'mobile-touch-feedback' : ''}
    ${className}
  `.trim();

  return (
    <Card
      title={title}
      className={classes}
      onClick={onClick}
    >
      {children}
    </Card>
  );
};

// 移动端优化的标题组件
interface MobileTitleProps {
  level?: 1 | 2 | 3 | 4 | 5;
  children: React.ReactNode;
  className?: string;
  responsive?: boolean;
}

export const MobileTitle: React.FC<MobileTitleProps> = ({
  level = 3,
  children,
  className = '',
  responsive = true
}) => {
  const levelClasses = {
    1: 'mobile-title-h1',
    2: 'mobile-title-h2',
    3: 'mobile-title-h3',
    4: 'mobile-title-h4',
    5: 'mobile-title-h4'
  };

  const classes = `
    ${levelClasses[level]}
    ${responsive ? 'mobile-text-responsive' : ''}
    ${className}
  `.trim();

  return (
    <Title level={level} className={classes}>
      {children}
    </Title>
  );
};

// 移动端优化的文本组件
interface MobileTextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'muted' | 'success' | 'warning' | 'error';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  className?: string;
}

export const MobileText: React.FC<MobileTextProps> = ({
  children,
  size = 'base',
  color = 'primary',
  weight = 'normal',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'mobile-text-xs',
    sm: 'mobile-text-sm',
    base: 'mobile-text-base',
    lg: 'mobile-text-lg',
    xl: 'mobile-text-xl'
  };

  const colorClasses = {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    muted: 'text-gray-500',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  const classes = `
    ${sizeClasses[size]}
    ${colorClasses[color]}
    ${weightClasses[weight]}
    ${className}
  `.trim();

  return (
    <Text className={classes}>
      {children}
    </Text>
  );
};

// 移动端优化的加载组件
interface MobileLoadingProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  fullScreen?: boolean;
}

export const MobileLoading: React.FC<MobileLoadingProps> = ({
  size = 'medium',
  text = '加载中...',
  fullScreen = false
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const containerClasses = `
    ${fullScreen ? 'min-h-screen' : ''}
    mobile-flex-center mobile-loading
  `.trim();

  return (
    <div className={containerClasses}>
      <Spin size={size === 'medium' ? 'default' : size} className={sizeClasses[size]} />
      {text && (
        <Text className="mobile-loading-text mt-3">
          {text}
        </Text>
      )}
    </div>
  );
};

// 移动端优化的空状态组件
interface MobileEmptyProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const MobileEmpty: React.FC<MobileEmptyProps> = ({
  icon,
  title = '暂无数据',
  description,
  action,
  size = 'medium'
}) => {
  const iconSizeClasses = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  return (
    <div className="mobile-empty">
      {icon && (
        <div className={`mobile-empty-icon ${iconSizeClasses[size]} text-gray-300 mb-4`}>
          {icon}
        </div>
      )}
      <Title level={4} className="mobile-empty-title">
        {title}
      </Title>
      {description && (
        <Text className="mobile-empty-description">
          {description}
        </Text>
      )}
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
};

// 移动端优化的状态标签组件
interface MobileStatusProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'default';
  children: React.ReactNode;
  size?: 'small' | 'medium';
  className?: string;
}

export const MobileStatus: React.FC<MobileStatusProps> = ({
  status,
  children,
  size = 'medium',
  className = ''
}) => {
  const statusClasses = {
    success: 'mobile-status-success',
    warning: 'mobile-status-warning',
    error: 'mobile-status-error',
    info: 'mobile-status-info',
    default: 'bg-gray-100 text-gray-800'
  };

  const sizeClasses = {
    small: 'text-xs px-2 py-0.5',
    medium: 'text-sm px-2.5 py-1'
  };

  const classes = `
    mobile-status
    ${statusClasses[status]}
    ${sizeClasses[size]}
    ${className}
  `.trim();

  return (
    <Tag className={classes}>
      {children}
    </Tag>
  );
};

// 移动端优化的容器组件
interface MobileContainerProps {
  children: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
  className?: string;
  safeArea?: boolean;
}

export const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  size = 'medium',
  className = '',
  safeArea = true
}) => {
  const sizeClasses = {
    small: 'mobile-container-sm',
    medium: 'mobile-container',
    large: 'mobile-container-lg'
  };

  const classes = `
    ${sizeClasses[size]}
    ${safeArea ? 'mobile-safe-top mobile-safe-bottom' : ''}
    ${className}
  `.trim();

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

// 移动端优化的间距组件
interface MobileSpacingProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  direction?: 'vertical' | 'horizontal';
  className?: string;
}

export const MobileSpacing: React.FC<MobileSpacingProps> = ({
  children,
  size = 'md',
  direction = 'vertical',
  className = ''
}) => {
  const sizeClasses = {
    xs: 'mobile-spacing-xs',
    sm: 'mobile-spacing-sm',
    md: 'mobile-spacing-md',
    lg: 'mobile-spacing-lg'
  };

  const directionClasses = {
    vertical: 'flex-col',
    horizontal: 'flex-row'
  };

  const classes = `
    ${sizeClasses[size]}
    ${directionClasses[direction]}
    ${className}
  `.trim();

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

// 移动端优化的网格组件
interface MobileGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  responsive?: boolean;
  className?: string;
}

export const MobileGrid: React.FC<MobileGridProps> = ({
  children,
  columns = 1,
  gap = 'md',
  responsive = true,
  className = ''
}) => {
  const gapClasses = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6'
  };

  const gridClasses = responsive 
    ? 'mobile-grid-responsive'
    : `grid grid-cols-${columns}`;

  const classes = `
    ${gridClasses}
    ${gapClasses[gap]}
    ${className}
  `.trim();

  return (
    <div className={classes}>
      {children}
    </div>
  );
};
