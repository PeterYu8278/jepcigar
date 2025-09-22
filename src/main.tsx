import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import customParseFormat from 'dayjs/plugin/customParseFormat'

import App from './App.tsx'
import './index.css'
import { pwaService } from './utils/pwaService'
import { performanceService } from './services/performanceService'
import { customerTheme } from './config/customerTheme'

// Configure dayjs with plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)
dayjs.locale('zh-cn')

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

// Ant Design theme configuration
const theme = {
  token: {
    colorPrimary: '#f16d1f',
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#1890ff',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Layout: {
      headerBg: '#001529',
      siderBg: '#f0f2f5',
    },
    Menu: {
      itemBg: 'transparent',
      itemSelectedBg: '#fff2e8',
      itemHoverBg: '#fff7e6',
    },
    Card: {
      borderRadius: 12,
    },
    Button: {
      borderRadius: 8,
    },
    Input: {
      borderRadius: 8,
    },
    Table: {
      borderRadius: 8,
    },
  },
}

// 初始化性能监控
performanceService.initialize().then(() => {
}).catch((error) => {
  console.error('[PerformanceService] Initialization failed:', error);
});

// 注册PWA Service Worker
if (import.meta.env.PROD) {
  pwaService.register().then((registration) => {
    if (registration) {
      
      // 请求通知权限
      pwaService.requestNotificationPermission();
      
      // 检查是否已安装
      if (pwaService.isInstalled()) {
      }
    }
  }).catch((error) => {
    console.error('[PWA] Failed to register Service Worker:', error);
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider 
        locale={zhCN}
        theme={theme}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
