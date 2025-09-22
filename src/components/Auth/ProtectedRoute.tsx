import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: string[];
  requiredRole?: string;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermissions = [], 
  requiredRole,
  allowedRoles = []
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading, user } = useAuthStore();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role permissions
  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Result
          status="403"
          title="403"
          subTitle="抱歉，您没有权限访问此页面。"
          extra={
            <Button type="primary" onClick={() => window.history.back()}>
              返回上一页
            </Button>
          }
        />
      </div>
    );
  }

  // Check allowed roles (for multiple role access)
  if (allowedRoles.length > 0 && user?.role && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Result
          status="403"
          title="403"
          subTitle="抱歉，您没有权限访问此页面。"
          extra={
            <Button type="primary" onClick={() => {
              // 根据用户角色重定向到合适的页面
              if (user.role === 'customer') {
                window.location.href = '/customer';
              } else {
                window.location.href = '/dashboard';
              }
            }}>
              返回首页
            </Button>
          }
        />
      </div>
    );
  }

  // Check specific permissions
  if (requiredPermissions.length > 0 && user?.permissions) {
    const hasPermission = requiredPermissions.every(permission => 
      user.permissions?.includes(permission)
    );
    
    if (!hasPermission) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <Result
            status="403"
            title="403"
            subTitle="您没有执行此操作所需的权限。"
            extra={
              <Button type="primary" onClick={() => window.history.back()}>
                返回上一页
              </Button>
            }
          />
        </div>
      );
    }
  }

  // Check if user is active
  if (user && !user.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Result
          status="warning"
          title="账户已禁用"
          subTitle="您的账户已被禁用，请联系管理员。"
          extra={
            <Button type="primary" onClick={() => window.location.href = '/contact'}>
              联系管理员
            </Button>
          }
        />
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
