// 动态导入工具函数

// 服务层动态导入
export const loadEventService = async () => {
  const { EventService } = await import('@/services/firebaseService');
  return EventService;
};

export const loadCustomerService = async () => {
  const { CustomerService } = await import('@/services/firebaseService');
  return CustomerService;
};

export const loadInventoryService = async () => {
  const { InventoryService } = await import('@/services/firebaseService');
  return InventoryService;
};

// export const loadAnalyticsService = async () => {
//   const { AnalyticsService } = await import('@/services/firebaseService');
//   return AnalyticsService;
// };

// Store 动态导入
export const loadEventStore = async () => {
  const { useEventStore } = await import('@/stores/eventStore');
  return useEventStore;
};

export const loadCustomerStore = async () => {
  const { useCustomerStore } = await import('@/stores/customerStore');
  return useCustomerStore;
};

export const loadInventoryStore = async () => {
  const { useInventoryStore } = await import('@/stores/inventoryStore');
  return useInventoryStore;
};

// 工具函数动态导入
// export const loadDateUtils = async () => {
//   const { formatDate, parseDate, getRelativeTime } = await import('@/utils/dateUtils');
//   return { formatDate, parseDate, getRelativeTime };
// };

// export const loadValidationUtils = async () => {
//   const { validateEmail, validatePhone, validateRequired } = await import('@/utils/validation');
//   return { validateEmail, validatePhone, validateRequired };
// };

// export const loadQRCodeUtils = async () => {
//   const { generateQRCode, scanQRCode } = await import('@/utils/qrCode');
//   return { generateQRCode, scanQRCode };
// };

// 组件动态导入
export const loadEventComponents = async () => {
  const [
    { EventList },
    { EventForm },
    { EventParticipants },
    { EventRegistrationForm }
  ] = await Promise.all([
    import('@/components/LazyComponents'),
    import('@/components/LazyComponents'),
    import('@/components/LazyComponents'),
    import('@/components/LazyComponents')
  ]);
  
  return {
    EventList,
    EventForm,
    EventParticipants,
    EventRegistrationForm
  };
};

// export const loadCustomerComponents = async () => {
//   const [
//     { CustomerList },
//     { CustomerForm },
//     { CustomerProfile },
//     { DigitalCard }
//   ] = await Promise.all([
//     import('@/components/LazyComponents'),
//     import('@/components/LazyComponents'),
//     import('@/components/LazyComponents'),
//     import('@/components/LazyComponents')
//   ]);
  
//   return {
//     CustomerList,
//     CustomerForm,
//     CustomerProfile,
//     DigitalCard
//   };
// };

// export const loadAnalyticsComponents = async () => {
//   const [
//     { AnalyticsDashboard },
//     { SalesChart },
//     { CustomerAnalytics }
//   ] = await Promise.all([
//     import('@/components/LazyComponents'),
//     import('@/components/LazyComponents'),
//     import('@/components/LazyComponents')
//   ]);
  
//   return {
//     AnalyticsDashboard,
//     SalesChart,
//     CustomerAnalytics
//   };
// };

// 预加载关键模块
export const preloadCriticalModules = async () => {
  const criticalModules = [
    import('@/stores/authStore'),
    import('@/services/firebaseService'),
    import('@/utils/index')
  ];
  
  await Promise.all(criticalModules);

};

// 预加载用户可能访问的页面
export const preloadUserModules = async () => {
  const userModules = [
    import('@/pages/Dashboard/DashboardPage'),
    import('@/pages/Customer/CustomerPage'),
    import('@/pages/Event/EventPage')
  ];
  
  // 延迟预加载，避免阻塞初始加载
  setTimeout(() => {
    Promise.all(userModules).then(() => {

    });
  }, 2000);
};

// 智能预加载 - 基于用户行为
export const smartPreload = (currentRoute: string) => {
  // 使用具体的import语句而不是变量，让Vite能够正确分析
  const preloadPromises: Promise<any>[] = [];
  
  switch (currentRoute) {
    case '/dashboard':
      preloadPromises.push(
        /* @vite-ignore */ import('@/pages/Analytics/AnalyticsPage').catch(() => {}),
        /* @vite-ignore */ import('@/pages/Customer/CustomerPage').catch(() => {})
      );
      break;
    case '/customers':
      preloadPromises.push(
        /* @vite-ignore */ import('@/pages/Event/EventPage').catch(() => {}),
        /* @vite-ignore */ import('@/pages/Analytics/AnalyticsPage').catch(() => {})
      );
      break;
    case '/events':
      preloadPromises.push(
        /* @vite-ignore */ import('@/pages/Customer/CustomerPage').catch(() => {}),
        /* @vite-ignore */ import('@/pages/Analytics/AnalyticsPage').catch(() => {})
      );
      break;
    case '/inventory':
      preloadPromises.push(
        /* @vite-ignore */ import('@/pages/Analytics/AnalyticsPage').catch(() => {}),
        /* @vite-ignore */ import('@/pages/Customer/CustomerPage').catch(() => {})
      );
      break;
  }
  
  // 异步执行预加载，不阻塞主线程
  Promise.all(preloadPromises);
};
