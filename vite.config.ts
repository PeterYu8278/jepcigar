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
                // 核心React库、React Router、Hooks、移动端组件、状态管理、QR码库、事件模块、通用组件、PWA功能、Ant Design、core-js、lib相关库和React相关库一起打包，确保它们使用同一个React实例和正确的初始化顺序
                if (id.includes('react') || id.includes('hooks') || id.includes('Mobile') || id.includes('mobile') || id.includes('zustand') || id.includes('stores') || id.includes('qrcode') || id.includes('html5-qrcode') || id.includes('Event/') || id.includes('eventStore') || id.includes('Common/') || id.includes('Layout/') || id.includes('pwa') || id.includes('notification') || id.includes('fileDownload') || id.includes('antd') || id.includes('core-js') || id.includes('__core-js_shared__') || id.includes('lib') || id.includes('util') || id.includes('helper') || id.includes('common') || id.includes('shared') || id.includes('@tanstack/react-query') || id.includes('framer-motion') || id.includes('react-hook-form') || id.includes('zod') || id.includes('lodash') || id.includes('uuid') || id.includes('react-chartjs-2') || id.includes('react-window') || id.includes('@hookform/resolvers') || id.includes('react-window-infinite-loader') || id.includes('unstable_now')) {
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
          
          
          // React Window Infinite Loader已合并到React核心chunk
          
          // 更多特定库的分离（React相关库已合并到核心chunk）
          if (id.includes('html5-qrcode')) {
            return 'vendor-html5-qrcode';
          }

          if (id.includes('html2canvas')) {
            return 'vendor-html2canvas';
          }

          if (id.includes('jspdf')) {
            return 'vendor-jspdf';
          }

          if (id.includes('chart.js')) {
            return 'vendor-chartjs';
          }

          if (id.includes('lucide-react')) {
            return 'vendor-lucide';
          }

          if (id.includes('qrcode')) {
            return 'vendor-qrcode';
          }

          if (id.includes('react-qr-code')) {
            return 'vendor-react-qr-code';
          }

          if (id.includes('react-pdf')) {
            return 'vendor-react-pdf';
          }

          if (id.includes('date-fns')) {
            return 'vendor-date-fns';
          }

          if (id.includes('dayjs')) {
            return 'vendor-dayjs';
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
          
          // 测试库
          if (id.includes('@testing-library') || id.includes('vitest')) {
            return 'vendor-testing';
          }
          
          // 开发工具库
          if (id.includes('eslint') || id.includes('@typescript-eslint')) {
            return 'vendor-linting';
          }
          
          // 构建工具库
          if (id.includes('vite') || id.includes('@vitejs')) {
            return 'vendor-build';
          }
          
          // CSS处理库
          if (id.includes('tailwindcss') || id.includes('postcss') || id.includes('autoprefixer')) {
            return 'vendor-css';
          }
          
          // TypeScript相关
          if (id.includes('typescript')) {
            return 'vendor-typescript';
          }
          
          // 压缩工具
          if (id.includes('terser')) {
            return 'vendor-minify';
          }
          
          // 所有工具库（util、helper、common、shared、core、base、lib、utils）已合并到React核心chunk，这里不再单独处理
          
          // 其他第三方库按更细的字母分组
          if (id.includes('node_modules') && id.match(/[a-c]/)) {
            return 'vendor-third-party-a-c';
          }
          
          if (id.includes('node_modules') && id.match(/[d-f]/)) {
            return 'vendor-third-party-d-f';
          }
          
          if (id.includes('node_modules') && id.match(/[g-i]/)) {
            return 'vendor-third-party-g-i';
          }
          
          if (id.includes('node_modules') && id.match(/[j-m]/)) {
            return 'vendor-third-party-j-m';
          }
          
          if (id.includes('node_modules') && id.match(/[n-p]/)) {
            return 'vendor-third-party-n-p';
          }
          
          if (id.includes('node_modules') && id.match(/[q-s]/)) {
            return 'vendor-third-party-q-s';
          }
          
          if (id.includes('node_modules') && id.match(/[t-v]/)) {
            return 'vendor-third-party-t-v';
          }
          
          if (id.includes('node_modules') && id.match(/[w-z]/)) {
            return 'vendor-third-party-w-z';
          }
          
          // 如果都不匹配，强制分组到特定chunk
          if (id.includes('node_modules')) {
            return 'vendor-remaining';
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
