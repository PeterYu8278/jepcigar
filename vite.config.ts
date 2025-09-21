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
          // 🎯 优化策略1: 核心React库 - 只包含最基础的React功能
          if (id.includes('react') && !id.includes('react-dom') && !id.includes('react-router')) {
            return 'vendor-react-core';
          }

          // 🎯 优化策略2: React DOM - 分离DOM相关功能
          if (id.includes('react-dom') || id.includes('react-reconciler')) {
            return 'vendor-react-dom';
          }

          // 🎯 优化策略3: React Router - 路由功能独立
          if (id.includes('react-router')) {
            return 'vendor-react-router';
          }

          // 🎯 优化策略4: 状态管理 - Zustand独立
          if (id.includes('zustand') || id.includes('stores')) {
            return 'vendor-state';
          }

          // 🎯 优化策略5: UI库 - Ant Design独立
          if (id.includes('antd')) {
            return 'vendor-ui';
          }

          // 🎯 优化策略6: 数据获取 - React Query独立
          if (id.includes('@tanstack/react-query') || id.includes('react-query')) {
            return 'vendor-data';
          }

          // 🎯 优化策略7: 动画库 - Framer Motion独立
          if (id.includes('framer-motion')) {
            return 'vendor-animation';
          }

          // 🎯 优化策略8: 表单处理 - React Hook Form独立
          if (id.includes('react-hook-form') || id.includes('@hookform/resolvers')) {
            return 'vendor-forms';
          }

          // 🎯 优化策略9: 图表库 - Chart.js独立
          if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
            return 'vendor-charts';
          }

          // 🎯 优化策略10: 日期处理 - 日期库独立
          if (id.includes('dayjs') || id.includes('date-fns')) {
            return 'vendor-dates';
          }

          // 🎯 优化策略11: 工具库 - 按功能分组
          if (id.includes('lodash') || id.includes('uuid')) {
            return 'vendor-utils';
          }

          // 🎯 优化策略12: 二维码库 - QR相关功能独立
          if (id.includes('qrcode') || id.includes('html5-qrcode') || id.includes('react-qr-code')) {
            return 'vendor-qr';
          }

          // 🎯 优化策略13: PDF处理 - PDF相关功能独立
          if (id.includes('react-pdf') || id.includes('jspdf') || id.includes('html2canvas')) {
            return 'vendor-pdf';
          }

          // 🎯 优化策略14: Firebase - 存储相关独立
          if (id.includes('firebase') || id.includes('localStorage') || id.includes('indexedDB') || id.includes('sessionStorage')) {
            return 'vendor-storage';
          }

          // 🎯 优化策略15: 业务模块 - 按功能分组
          if (id.includes('Customer/') || id.includes('customerStore')) {
            return 'module-customer';
          }

          if (id.includes('Inventory/') || id.includes('inventoryStore')) {
            return 'module-inventory';
          }

          if (id.includes('Event/') || id.includes('eventStore')) {
            return 'module-event';
          }

          if (id.includes('Analytics/')) {
            return 'module-analytics';
          }

          if (id.includes('Gamification/')) {
            return 'module-gamification';
          }

          if (id.includes('Gifting/')) {
            return 'module-gifting';
          }

          if (id.includes('Academy/')) {
            return 'module-academy';
          }

          if (id.includes('AIRecommendations/')) {
            return 'module-recommendations';
          }

          if (id.includes('Settings/')) {
            return 'module-settings';
          }

          if (id.includes('Dashboard/')) {
            return 'module-dashboard';
          }

          if (id.includes('Auth/') || id.includes('authStore')) {
            return 'module-auth';
          }

          // 🎯 优化策略16: 第三方库 - 按字母分组（减少chunk数量）
          if (id.includes('node_modules')) {
            // 按库名首字母分组，减少chunk数量
            const libName = id.split('node_modules/')[1]?.split('/')[0] || '';
            const firstChar = libName.charAt(0).toLowerCase();
            
            if (firstChar >= 'a' && firstChar <= 'f') {
              return 'vendor-third-party-a-f';
            } else if (firstChar >= 'g' && firstChar <= 'm') {
              return 'vendor-third-party-g-m';
            } else if (firstChar >= 'n' && firstChar <= 's') {
              return 'vendor-third-party-n-s';
            } else {
              return 'vendor-third-party-t-z';
            }
          }

          // 🎯 优化策略17: 应用代码 - 按功能分组
          if (id.includes('src/components')) {
            return 'app-components';
          }

          if (id.includes('src/utils') || id.includes('src/hooks')) {
            return 'app-utils';
          }

          if (id.includes('src/services')) {
            return 'app-services';
          }

          // 默认分组
          return 'app-remaining';
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
      // 核心React库
      'react',
      'react-dom',
      'react-router-dom',
      'react-router',
      
      // 状态管理
      'zustand',
      
      // UI库
      'antd',
      
      // 数据获取
      '@tanstack/react-query',
      
      // 表单处理
      'react-hook-form',
      '@hookform/resolvers',
      'zod',
      
      // 动画库
      'framer-motion',
      
      // 图表库
      'chart.js',
      'react-chartjs-2',
      
      // 日期处理
      'dayjs',
      'date-fns',
      
      // 工具库
      'lodash',
      'uuid',
      
      // 二维码库
      'qrcode',
      'html5-qrcode',
      'react-qr-code',
      
      // PDF处理
      'react-pdf',
      'jspdf',
      'html2canvas',
      
      // Firebase
      'firebase/app',
      'firebase/auth',
      'firebase/firestore',
      'firebase/storage',
      'firebase/analytics',
      
      // 其他
      'lucide-react',
      'react-window',
      'react-window-infinite-loader',
      
      // 开发工具
      '@testing-library/jest-dom',
      '@testing-library/react',
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      '@vitejs/plugin-react',
      'autoprefixer',
      'eslint',
      'eslint-plugin-react-hooks',
      'eslint-plugin-react-refresh',
      'postcss',
      'tailwindcss',
      'terser',
      'typescript',
      'vite',
      'vitest'
    ]
  }
})