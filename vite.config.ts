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
        manualChunks: {
          // React 核心库
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          
          // Ant Design UI 库
          'vendor-antd': ['antd'],
          
          // Firebase 相关
          'vendor-firebase': [
            'firebase/app',
            'firebase/auth', 
            'firebase/firestore',
            'firebase/storage',
            'firebase/analytics'
          ],
          
          // 图表库
          'vendor-charts': ['chart.js', 'react-chartjs-2'],
          
          // 工具库
          'vendor-utils': [
            'date-fns',
            'lodash',
            'zustand',
            'qrcode',
            'html5-qrcode',
            'uuid'
          ],
          
          // 按功能模块分割 - 只包含存在的模块
          'event-module': [
            './src/pages/Event/EventPage',
            './src/components/Event/EventForm',
            './src/components/Event/EventList',
            './src/components/Event/EventParticipants',
            './src/components/Event/EventRegistrationForm',
            './src/components/Event/QRCodeGenerator',
            './src/components/Event/QRCodeScanner',
            './src/stores/eventStore'
          ],
          'customer-module': [
            './src/pages/Customer/CustomerPage',
            './src/stores/customerStore'
          ],
          'inventory-module': [
            './src/pages/Inventory/InventoryPage'
          ],
          'analytics-module': [
            './src/pages/Analytics/AnalyticsPage'
          ],
          'gamification-module': [
            './src/pages/Gamification/GamificationPage'
          ]
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
    include: ['react', 'react-dom', 'antd', 'firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage', 'firebase/analytics']
  }
})
