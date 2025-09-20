import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@modules': path.resolve(__dirname, './src/modules'),
      '@services': path.resolve(__dirname, './src/services'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@types': path.resolve(__dirname, './src/types'),
      '@config': path.resolve(__dirname, './src/config'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@assets': path.resolve(__dirname, './src/assets')
    }
  },
  define: {
    global: 'globalThis',
  },
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // 生产环境关闭 sourcemap 减小体积
    minify: 'terser',
    // PWA 相关配置
    copyPublicDir: true,
    terserOptions: {
      compress: {
        drop_console: true, // 移除 console.log
        drop_debugger: true, // 移除 debugger
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // 移除特定函数
      },
      mangle: {
        safari10: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // 核心React库、React Router、Hooks、移动端组件、状态管理、QR码库、事件模块、通用组件、PWA功能和Ant Design一起打包，确保它们使用同一个React实例
          if (id.includes('react') || id.includes('hooks') || id.includes('Mobile') || id.includes('mobile') || id.includes('zustand') || id.includes('stores') || id.includes('qrcode') || id.includes('html5-qrcode') || id.includes('Event/') || id.includes('eventStore') || id.includes('Common/') || id.includes('Layout/') || id.includes('pwa') || id.includes('notification') || id.includes('fileDownload') || id.includes('antd')) {
            return 'vendor-react-core';
          }
          
          // Firebase和存储相关（包括IndexedDB、localStorage等）
          if (id.includes('firebase') || id.includes('localStorage') || id.includes('indexedDB') || id.includes('sessionStorage')) {
            return 'vendor-storage';
          }
          
          // 图表库
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
            return 'vendor-charts';
          }
          
          // PDF和图片处理
          if (id.includes('jspdf') || id.includes('html2canvas')) {
            return 'vendor-pdf';
          }
          
          // 动画库
          if (id.includes('framer-motion') || id.includes('react-spring')) {
            return 'vendor-animation';
          }
          
          // 表单处理
          if (id.includes('react-hook-form') || id.includes('@hookform')) {
            return 'vendor-forms';
          }
          
          // 数据验证
          if (id.includes('zod')) {
            return 'vendor-validation';
          }
          
          // 图表库
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
            return 'vendor-charts';
          }
          
          // 工具库（更细分的分组）
          if (id.includes('lodash')) {
            return 'vendor-utils-lodash';
          }
          
          if (id.includes('date-fns')) {
            return 'vendor-utils-date';
          }
          
          if (id.includes('uuid')) {
            return 'vendor-utils-uuid';
          }
          
          // 客户模块
          if (id.includes('Customer/') || id.includes('customerStore')) {
            return 'module-customer';
          }
          
          // 库存模块
          if (id.includes('Inventory/') || id.includes('inventoryStore')) {
            return 'module-inventory';
          }
          
          // 分析模块
          if (id.includes('Analytics/')) {
            return 'module-analytics';
          }
          
          // 游戏化模块
          if (id.includes('Gamification/')) {
            return 'module-gamification';
          }
          
          // 礼品模块
          if (id.includes('Gifting/')) {
            return 'module-gifting';
          }
          
          // 学院模块
          if (id.includes('Academy/')) {
            return 'module-academy';
          }
          
          // 推荐模块
          if (id.includes('AIRecommendations/')) {
            return 'module-recommendations';
          }
          
          // 设置模块
          if (id.includes('Settings/')) {
            return 'module-settings';
          }
          
          // 仪表板模块
          if (id.includes('Dashboard/')) {
            return 'module-dashboard';
          }
          
          // 认证模块
          if (id.includes('Auth/') || id.includes('authStore')) {
            return 'module-auth';
          }
          
          // 如果都不匹配，使用默认的chunk命名
          if (id.includes('node_modules')) {
            return 'vendor-misc';
          }
        },
        // 优化 chunk 文件名
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `js/[name]-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
            return `media/[name]-[hash].${ext}`;
          }
          if (/\.(png|jpe?g|gif|svg)(\?.*)?$/i.test(assetInfo.name)) {
            return `img/[name]-[hash].${ext}`;
          }
          if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash].${ext}`;
          }
          return `assets/[name]-[hash].${ext}`;
        }
      }
    },
    // 调整 chunk 大小警告限制
    chunkSizeWarningLimit: 1000,
    // CSS 代码分割
    cssCodeSplit: true,
    // 资源内联阈值
    assetsInlineLimit: 4096
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'react-router',
      'zustand',
      'qrcode',
      'html5-qrcode',
      'antd', 
      'firebase/app', 
      'firebase/auth', 
      'firebase/firestore', 
      'firebase/storage', 
      'firebase/analytics',
      'dayjs'
    ]
  }
})
