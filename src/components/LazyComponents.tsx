import React, { Suspense } from 'react';
import { Spin } from 'antd';
// import { createSafeLazyComponent } from '@/utils/safeDynamicImport';
import ErrorBoundary from '@/components/Common/ErrorBoundary';

// 加载组件
const LoadingComponent = () => (
  <div className="min-h-screen flex items-center justify-center">
    <Spin size="large" />
  </div>
);

// 高阶组件：为懒加载组件添加 Suspense 和错误边界
const withSuspense = (Component: React.LazyExoticComponent<any>) => {
  return (props: any) => (
    <ErrorBoundary>
      <Suspense fallback={<LoadingComponent />}>
        <Component {...props} />
      </Suspense>
    </ErrorBoundary>
  );
};

// ===== 路由级别懒加载 =====

// 认证页面
export const LoginPage = withSuspense(
  React.lazy(() => import('@/pages/Auth/LoginPage'))
);

// 主要功能页面
export const DashboardPage = withSuspense(
  React.lazy(() => import('@/pages/Dashboard/DashboardPage'))
);

export const InventoryPage = withSuspense(
  React.lazy(() => import('@/pages/Inventory/InventoryPage'))
);

export const StockTransactionsPage = withSuspense(
  React.lazy(() => import('@/pages/Inventory/StockTransactionsPage'))
);

export const PriceHistoryPage = withSuspense(
  React.lazy(() => import('@/pages/Inventory/PriceHistoryPage'))
);

export const CustomerPage = withSuspense(
  React.lazy(() => import('@/pages/Customer/CustomerPage'))
);

export const DigitalCardPage = withSuspense(
  React.lazy(() => import('@/pages/Customer/DigitalCardPage'))
);

export const EventPage = withSuspense(
  React.lazy(() => import('@/pages/Event/EventPage'))
);

export const NetworkingPage = withSuspense(
  React.lazy(() => import('@/pages/Event/NetworkingPage'))
);

export const ReferralPage = withSuspense(
  React.lazy(() => import('@/pages/Referral/ReferralPage'))
);

export const GamificationPage = withSuspense(
  React.lazy(() => import('@/pages/Gamification/GamificationPage'))
);

// New Product page that includes all product-related services
export const ProductPage = withSuspense(
  React.lazy(() => import('@/pages/Product/ProductPage'))
);

// Legacy pages - kept for backward compatibility
export const GiftingPage = withSuspense(
  React.lazy(() => import('@/pages/Product/GiftingPage'))
);

export const AcademyPage = withSuspense(
  React.lazy(() => import('@/pages/Product/AcademyPage'))
);

export const AnalyticsPage = withSuspense(
  React.lazy(() => import('@/pages/Analytics/AnalyticsPage'))
);

export const SettingsPage = withSuspense(
  React.lazy(() => import('@/pages/Settings/SettingsPage'))
);

export const PointsMarketplacePage = withSuspense(
  React.lazy(() => import('@/pages/Product/PointsMarketplacePage'))
);

export const AIRecommendationsPage = withSuspense(
  React.lazy(() => import('@/pages/AIRecommendations/AIRecommendationsPage'))
);

export const DigitalCardTestPage = withSuspense(
  React.lazy(() => import('@/pages/Test/DigitalCardTestPage'))
);

export const NotFoundPage = withSuspense(
  React.lazy(() => import('@/pages/NotFound/NotFoundPage'))
);

// ===== 组件级别懒加载 =====

// Event 相关组件
export const EventList = withSuspense(
  React.lazy(() => import('@/components/Event/EventList'))
);

export const EventForm = withSuspense(
  React.lazy(() => import('@/components/Event/EventForm'))
);

export const EventParticipants = withSuspense(
  React.lazy(() => import('@/components/Event/EventParticipants'))
);

export const EventRegistrationForm = withSuspense(
  React.lazy(() => import('@/components/Event/EventRegistrationForm'))
);

export const QRCodeGenerator = withSuspense(
  React.lazy(() => import('@/components/Event/QRCodeGenerator'))
);

export const QRCodeScanner = withSuspense(
  React.lazy(() => import('@/components/Event/QRCodeScanner'))
);

// Customer 相关组件 - 暂时注释掉不存在的组件
// export const CustomerList = withSuspense(
//   React.lazy(() => import('@/components/Customer/CustomerList'))
// );

// export const CustomerForm = withSuspense(
//   React.lazy(() => import('@/components/Customer/CustomerForm'))
// );

// export const CustomerProfile = withSuspense(
//   React.lazy(() => import('@/components/Customer/CustomerProfile'))
// );

// export const DigitalCard = withSuspense(
//   React.lazy(() => import('@/components/Customer/DigitalCard'))
// );

// Inventory 相关组件 - 暂时注释掉不存在的组件
// export const CigarList = withSuspense(
//   React.lazy(() => import('@/components/Inventory/CigarList'))
// );

// export const CigarForm = withSuspense(
//   React.lazy(() => import('@/components/Inventory/CigarForm'))
// );

// export const InventoryDashboard = withSuspense(
//   React.lazy(() => import('@/components/Inventory/InventoryDashboard'))
// );

// Analytics 相关组件 - 暂时注释掉不存在的组件
// export const AnalyticsDashboard = withSuspense(
//   React.lazy(() => import('@/components/Analytics/AnalyticsDashboard'))
// );

// export const SalesChart = withSuspense(
//   React.lazy(() => import('@/components/Analytics/SalesChart'))
// );

// export const CustomerAnalytics = withSuspense(
//   React.lazy(() => import('@/components/Analytics/CustomerAnalytics'))
// );

// Gamification 相关组件 - 暂时注释掉不存在的组件
// export const LuckySpin = withSuspense(
//   React.lazy(() => import('@/components/Gamification/LuckySpin'))
// );

// export const PointsHistory = withSuspense(
//   React.lazy(() => import('@/components/Gamification/PointsHistory'))
// );

// export const RoyalProgram = withSuspense(
//   React.lazy(() => import('@/components/Gamification/RoyalProgram'))
// );

// 导出加载组件
export { LoadingComponent };
