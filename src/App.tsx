import React, { useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';

// Components
import ResponsiveAppLayout from '@/components/Layout/ResponsiveAppLayout';
import ProtectedRoute from '@/components/Auth/ProtectedRoute';
import { Routes } from '@/components/RoutesWithFutureFlags';

// Lazy-loaded Pages
import {
  LoginPage,
  DashboardPage,
  InventoryPage,
  CustomerPage,
  DigitalCardPage,
  EventPage,
  ReferralPage,
  GamificationPage,
  GiftingPage,
  AcademyPage,
  AnalyticsPage,
  SettingsPage,
  PointsMarketplacePage,
  AIRecommendationsPage,
  DigitalCardTestPage,
  NotFoundPage
} from '@/components/LazyComponents';

// PWA Test Page (非懒加载，因为测试页面需要快速访问)
import PWATestPage from '@/pages/Test/PWATestPage';
import EnvironmentTestPage from '@/pages/Test/EnvironmentTestPage';
import CardUrlUpdatePage from '@/pages/Test/CardUrlUpdatePage';
import QRCodeTestPage from '@/pages/Test/QRCodeTestPage';
import MobileUITestPage from '@/pages/Test/MobileUITestPage';

// 移动端专用页面
import MobileDashboardPage from '@/pages/Dashboard/MobileDashboardPage';
import MobileEventPage from '@/pages/Event/MobileEventPage';

// 响应式页面组件
import ResponsivePage from '@/components/Common/ResponsivePage';

// Hooks
import { useAuthStore, useAuthActions } from '@/stores/authStore';
import { checkFirebaseConfiguration, displayFirebaseStatus } from '@/utils/firebaseCheck';
import { setupTestEnvironment } from '@/utils/createTestUsers';
import { setupRegistrationTests } from '@/utils/testRegistration';
import { preloadCriticalModules, preloadUserModules } from '@/utils/dynamicImports';
import { initializeErrorHandling } from '@/utils/errorHandler';
import { initializeGlobalAccess } from '@/utils/safeGlobalAccess';
import { initializeEnvValidation } from '@/utils/envValidator';
import { initializeBrowserAPIs } from '@/utils/safeBrowserAPIs';
// import { smartErrorPrevention } from '@/utils/smartErrorPrevention'; // 暂时注释，避免未使用警告
import { performanceOptimizer } from '@/utils/performanceOptimizer';
import '@/utils/createTestDigitalCard';
import '@/utils/testEnvironment';

// Styles
import './App.css';


const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { initializeAuth } = useAuthActions();

         // Initialize app on mount
         useEffect(() => {
           // Initialize global error handling first
           initializeErrorHandling();
           
           // Initialize global access safety
           initializeGlobalAccess();
           
           // Initialize environment validation
           const envResult = initializeEnvValidation();
           if (!envResult.isValid) {
             console.error('Environment validation failed:', envResult.errors);
           }
           
           // Initialize browser API safety checks
           const apiResults = initializeBrowserAPIs();
           console.log('Browser API availability:', apiResults);
           
           // Initialize smart error prevention system
           console.log('Smart Error Prevention System initialized');
           
           // Initialize performance optimizer
           console.log('Performance Optimizer initialized');
           
           // 获取性能报告（开发环境）
           if (import.meta.env.DEV) {
             setTimeout(() => {
               const report = performanceOptimizer.getPerformanceReport();
               console.log('Performance Report:', report);
             }, 5000);
           }
    
    // Check Firebase configuration
    const checkConfig = async () => {
      const results = await checkFirebaseConfiguration();
      displayFirebaseStatus(results);
      
      // If Firebase is working, offer to create test users and setup testing tools
      if (results.auth && results.firestore) {
        
        // Make the functions available globally for development
        (window as any).createTestUsers = setupTestEnvironment;
        setupRegistrationTests();
      }
    };
    
    checkConfig();
    
    // Initialize authentication state listener
    initializeAuth();
    
    // 预加载关键模块
    preloadCriticalModules();
    
    // 预加载用户模块（延迟执行）
    preloadUserModules();
  }, [initializeAuth]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <AntApp>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#f16d1f',
            borderRadius: 8,
          },
        }}
      >
        <Routes>
          {/* Public routes */}
          <Route 
            path="/login" 
            element={
              isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
            } 
          />
          
          {/* Digital Business Card - Public Access (No Auth Required) */}
          <Route path="/card/:customerId" element={<DigitalCardPage />} />
          
          {/* Protected routes */}
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <ResponsiveAppLayout>
                  <Routes>
                     <Route path="/" element={<Navigate to="/dashboard" replace />} />
                     <Route path="/dashboard" element={
                       <ResponsivePage 
                         desktopComponent={DashboardPage}
                         mobileComponent={MobileDashboardPage}
                       />
                     } />
                    
                    {/* Inventory Management */}
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/inventory/:id" element={<InventoryPage />} />
                    
                    {/* Customer & CRM */}
                    <Route path="/customers" element={<CustomerPage />} />
                    <Route path="/customers/:id" element={<CustomerPage />} />
                    
                     {/* Events & Networking */}
                     <Route path="/events" element={
                       <ResponsivePage 
                         desktopComponent={EventPage}
                         mobileComponent={MobileEventPage}
                       />
                     } />
                     <Route path="/events/:id" element={<EventPage />} />
                    
                    {/* Referral Program */}
                    <Route path="/referrals" element={<ReferralPage />} />
                    
                    {/* Gamification */}
                    <Route path="/gamification" element={<GamificationPage />} />
                    <Route path="/lucky-spin" element={<GamificationPage />} />
                    <Route path="/royal-program" element={<GamificationPage />} />
                    
                    {/* Gifting Module */}
                    <Route path="/gifting" element={<GiftingPage />} />
                    <Route path="/gifting/:id" element={<GiftingPage />} />
                    
                    {/* Academy */}
                    <Route path="/academy" element={<AcademyPage />} />
                    <Route path="/academy/:courseId" element={<AcademyPage />} />
                    
                    {/* Points Marketplace */}
                    <Route path="/marketplace" element={<PointsMarketplacePage />} />
                    <Route path="/points" element={<PointsMarketplacePage />} />
                    
                    {/* AI Recommendations */}
                    <Route path="/recommendations" element={<AIRecommendationsPage />} />
                    <Route path="/ai-recommendations" element={<AIRecommendationsPage />} />
                    
                    {/* Analytics & Finance */}
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/finance" element={<AnalyticsPage />} />
                    <Route path="/reports" element={<AnalyticsPage />} />
                    
                    {/* Settings */}
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/profile" element={<SettingsPage />} />
                    
                    {/* Test Pages */}
                    <Route path="/test/digital-card" element={<DigitalCardTestPage />} />
                    <Route path="/test/pwa" element={<PWATestPage />} />
                    <Route path="/test/environment" element={<EnvironmentTestPage />} />
                    <Route path="/test/card-url-update" element={<CardUrlUpdatePage />} />
                    <Route path="/test/qrcode" element={<QRCodeTestPage />} />
                    <Route path="/test/mobile-ui" element={<MobileUITestPage />} />
                    <Route path="/pwa-test" element={<PWATestPage />} />
                    
                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                      </ResponsiveAppLayout>
                    </ProtectedRoute>
                  }
                />
        </Routes>
      </ConfigProvider>
    </AntApp>
  );
};

export default App;
