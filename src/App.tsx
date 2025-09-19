import React, { useEffect } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ConfigProvider, App as AntApp } from 'antd';

// Components
import AppLayout from '@/components/Layout/AppLayout';
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

// Hooks
import { useAuthStore, useAuthActions } from '@/stores/authStore';
import { checkFirebaseConfiguration, displayFirebaseStatus } from '@/utils/firebaseCheck';
import { setupTestEnvironment } from '@/utils/createTestUsers';
import { setupRegistrationTests } from '@/utils/testRegistration';
import { preloadCriticalModules, preloadUserModules } from '@/utils/dynamicImports';
import '@/utils/createTestDigitalCard';

// Styles
import './App.css';


const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const { initializeAuth } = useAuthActions();

  // Initialize app on mount
  useEffect(() => {
    // Check Firebase configuration
    const checkConfig = async () => {
      const results = await checkFirebaseConfiguration();
      displayFirebaseStatus(results);
      
      // If Firebase is working, offer to create test users and setup testing tools
      if (results.auth && results.firestore) {
        console.log('\n🛠️ Firebase is ready! Available development tools:');
        console.log('window.createTestUsers() - 创建测试用户');
        console.log('window.testDuplicateRegistration() - 测试重复注册');
        console.log('window.testRegistrationErrors() - 测试注册错误');
        console.log('window.createTestCustomerWithDigitalCard() - 创建带数字名片的测试客户');
        console.log('window.generateDigitalCardForExistingCustomer(customerId) - 为现有客户生成数字名片');
        console.log('window.listCustomersWithDigitalCards() - 列出所有客户及数字名片状态');
        
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
                <AppLayout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<DashboardPage />} />
                    
                    {/* Inventory Management */}
                    <Route path="/inventory" element={<InventoryPage />} />
                    <Route path="/inventory/:id" element={<InventoryPage />} />
                    
                    {/* Customer & CRM */}
                    <Route path="/customers" element={<CustomerPage />} />
                    <Route path="/customers/:id" element={<CustomerPage />} />
                    
                    {/* Events & Networking */}
                    <Route path="/events" element={<EventPage />} />
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
                    
                    {/* 404 */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </ConfigProvider>
    </AntApp>
  );
};

export default App;
