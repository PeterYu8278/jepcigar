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
                 // 🎯 超级核心策略: 将所有chunk合并到vendor-react-core
                 // 这确保了所有模块使用同一个实例，完全消除初始化冲突
                 
                 // 合并所有React相关库
                 if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                   return 'vendor-react-core';
                 }

                 // 合并所有状态管理
                 if (id.includes('zustand') || id.includes('stores')) {
                   return 'vendor-react-core';
                 }

                 // 合并所有UI库
                 if (id.includes('antd')) {
                   return 'vendor-react-core';
                 }

                 // 合并所有数据获取库
                 if (id.includes('@tanstack/react-query') || id.includes('react-query')) {
                   return 'vendor-react-core';
                 }

                 // 合并所有动画库
                 if (id.includes('framer-motion')) {
                   return 'vendor-react-core';
                 }

                 // 合并所有表单处理库
                 if (id.includes('react-hook-form') || id.includes('@hookform/resolvers')) {
                   return 'vendor-react-core';
                 }

                 // 合并所有图表库
                 if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
                   return 'vendor-react-core';
                 }

                 // 合并所有日期处理库
                 if (id.includes('dayjs') || id.includes('date-fns')) {
                   return 'vendor-react-core';
                 }

                 // 合并所有工具库
                 if (id.includes('lodash') || id.includes('uuid')) {
                   return 'vendor-react-core';
                 }

                 // 合并所有二维码库
                 if (id.includes('qrcode') || id.includes('html5-qrcode') || id.includes('react-qr-code')) {
                   return 'vendor-react-core';
                 }

                 // 合并所有PDF处理库
                 if (id.includes('react-pdf') || id.includes('jspdf') || id.includes('html2canvas')) {
                   return 'vendor-react-core';
                 }

                 // 合并所有Firebase和存储库
                 if (id.includes('firebase') || id.includes('localStorage') || id.includes('indexedDB') || id.includes('sessionStorage')) {
                   return 'vendor-react-core';
                 }

                 // 合并所有第三方库
                 if (id.includes('node_modules')) {
                   return 'vendor-react-core';
                 }

                 // 合并所有业务模块
                 if (id.includes('Customer/') || id.includes('customerStore') ||
                     id.includes('Inventory/') || id.includes('inventoryStore') ||
                     id.includes('Event/') || id.includes('eventStore') ||
                     id.includes('Analytics/') ||
                     id.includes('Gamification/') ||
                     id.includes('Gifting/') ||
                     id.includes('Academy/') ||
                     id.includes('AIRecommendations/') ||
                     id.includes('Settings/') ||
                     id.includes('Dashboard/') ||
                     id.includes('Auth/') || id.includes('authStore')) {
                   return 'vendor-react-core';
                 }

                 // 合并所有应用代码
                 if (id.includes('src/components') ||
                     id.includes('src/utils') || id.includes('src/hooks') ||
                     id.includes('src/services')) {
                   return 'vendor-react-core';
                 }

                 // 默认也合并到核心chunk
                 return 'vendor-react-core';
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
      // 核心React库 - 确保React和React DOM使用同一个实例
      'react',
      'react-dom',
      'react-dom/client',
      'react-dom/server',
      'react-reconciler',
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
      
       // 其他React生态库
       'lucide-react',
       'react-window',
       'react-window-infinite-loader',
       
       // React内部相关库
       'scheduler',
       'scheduler/tracing',
       'react-is',
       'prop-types',
       'create-react-context',
       'hoist-non-react-statics',
       'invariant',
       'warning',
       'object-assign',
       'loose-envify',
       'js-tokens',
       
       // Core-js相关
       'core-js',
       '__core-js_shared__',
       
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