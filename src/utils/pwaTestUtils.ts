// PWA测试工具
// 用于测试PWA的各种功能和性能

import { fileDownloadService } from '@/services/fileDownloadService';
import { performanceService } from '@/services/performanceService';

interface PWATestResult {
  test: string;
  passed: boolean;
  message: string;
  details?: any;
}

class PWATestUtils {
  private testResults: PWATestResult[] = [];

  // 运行所有PWA测试
  async runAllTests(): Promise<PWATestResult[]> {
    this.testResults = [];
    
    console.log('[PWATestUtils] Starting PWA tests...');
    
    // 基础功能测试
    await this.testManifest();
    await this.testServiceWorker();
    await this.testOfflineFunctionality();
    
    // 移动端功能测试
    await this.testMobileFeatures();
    await this.testTouchInteractions();
    
    // 高级功能测试
    await this.testNotifications();
    await this.testFileDownload();
    await this.testPerformance();
    
    // 缓存测试
    await this.testCacheStrategy();
    
    console.log('[PWATestUtils] PWA tests completed');
    return this.testResults;
  }

  // 测试Web App Manifest
  async testManifest(): Promise<void> {
    try {
      const response = await fetch('/manifest.json');
      const manifest = await response.json();
      
      const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
      const missingFields = requiredFields.filter(field => !manifest[field]);
      
      if (missingFields.length === 0) {
        this.addTestResult('manifest', true, 'Web App Manifest配置正确', manifest);
      } else {
        this.addTestResult('manifest', false, `缺少必要字段: ${missingFields.join(', ')}`, manifest);
      }
    } catch (error) {
      this.addTestResult('manifest', false, '无法加载Web App Manifest', error);
    }
  }

  // 测试Service Worker
  async testServiceWorker(): Promise<void> {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration) {
          this.addTestResult('serviceWorker', true, 'Service Worker已注册', {
            scope: registration.scope,
            state: registration.active?.state,
          });
        } else {
          this.addTestResult('serviceWorker', false, 'Service Worker未注册');
        }
      } else {
        this.addTestResult('serviceWorker', false, '浏览器不支持Service Worker');
      }
    } catch (error) {
      this.addTestResult('serviceWorker', false, 'Service Worker测试失败', error);
    }
  }

  // 测试离线功能
  async testOfflineFunctionality(): Promise<void> {
    try {
      // 测试离线页面
      const offlineResponse = await fetch('/offline.html');
      if (offlineResponse.ok) {
        this.addTestResult('offlinePage', true, '离线页面可访问');
      } else {
        this.addTestResult('offlinePage', false, '离线页面无法访问');
      }

      // 测试缓存策略
      const cacheNames = await caches.keys();
      if (cacheNames.length > 0) {
        this.addTestResult('cacheStrategy', true, `发现${cacheNames.length}个缓存`, cacheNames);
      } else {
        this.addTestResult('cacheStrategy', false, '未发现任何缓存');
      }
    } catch (error) {
      this.addTestResult('offlineFunctionality', false, '离线功能测试失败', error);
    }
  }

  // 测试移动端功能
  async testMobileFeatures(): Promise<void> {
    try {
      const isMobile = window.innerWidth <= 768;
      const hasTouch = 'ontouchstart' in window;
      const hasOrientation = 'orientation' in window;
      
      const mobileFeatures = {
        isMobile,
        hasTouch,
        hasOrientation,
        userAgent: navigator.userAgent,
      };

      this.addTestResult('mobileFeatures', true, '移动端功能检测完成', mobileFeatures);
    } catch (error) {
      this.addTestResult('mobileFeatures', false, '移动端功能测试失败', error);
    }
  }

  // 测试触摸交互
  async testTouchInteractions(): Promise<void> {
    try {
      const touchEvents = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
      const supportedEvents = touchEvents.filter(event => `on${event}` in document);
      
      if (supportedEvents.length === touchEvents.length) {
        this.addTestResult('touchInteractions', true, '所有触摸事件都支持', supportedEvents);
      } else {
        this.addTestResult('touchInteractions', false, `部分触摸事件不支持: ${touchEvents.filter(e => !supportedEvents.includes(e)).join(', ')}`);
      }
    } catch (error) {
      this.addTestResult('touchInteractions', false, '触摸交互测试失败', error);
    }
  }

  // 测试通知功能
  async testNotifications(): Promise<void> {
    try {
      if ('Notification' in window) {
        const permission = Notification.permission;
        const permissionStatus = {
          permission,
          granted: permission === 'granted',
          denied: permission === 'denied',
          default: permission === 'default',
        };

        if (permission === 'granted') {
          this.addTestResult('notifications', true, '通知权限已授予', permissionStatus);
        } else if (permission === 'denied') {
          this.addTestResult('notifications', false, '通知权限被拒绝', permissionStatus);
        } else {
          this.addTestResult('notifications', true, '通知功能可用，需要用户授权', permissionStatus);
        }
      } else {
        this.addTestResult('notifications', false, '浏览器不支持通知功能');
      }
    } catch (error) {
      this.addTestResult('notifications', false, '通知功能测试失败', error);
    }
  }

  // 测试文件下载
  async testFileDownload(): Promise<void> {
    try {
      const isDownloadSupported = fileDownloadService.isDownloadSupported();
      
      if (isDownloadSupported) {
        this.addTestResult('fileDownload', true, '文件下载功能支持');
        
        // 测试文本文件下载
        try {
          await fileDownloadService.downloadText('测试内容', 'test.txt');
          this.addTestResult('fileDownloadText', true, '文本文件下载测试通过');
        } catch (error) {
          this.addTestResult('fileDownloadText', false, '文本文件下载测试失败', error);
        }
      } else {
        this.addTestResult('fileDownload', false, '文件下载功能不支持');
      }
    } catch (error) {
      this.addTestResult('fileDownload', false, '文件下载测试失败', error);
    }
  }

  // 测试性能指标
  async testPerformance(): Promise<void> {
    try {
      const metrics = performanceService.getMetrics();
      const userMetrics = performanceService.getUserMetrics();
      const budgetCheck = performanceService.checkPerformanceBudget();

      const performanceData = {
        metrics,
        userMetrics,
        budgetCheck,
      };

      if (budgetCheck.passed) {
        this.addTestResult('performance', true, '性能指标符合预算', performanceData);
      } else {
        this.addTestResult('performance', false, `性能指标超出预算: ${budgetCheck.violations.join(', ')}`, performanceData);
      }
    } catch (error) {
      this.addTestResult('performance', false, '性能测试失败', error);
    }
  }

  // 测试缓存策略
  async testCacheStrategy(): Promise<void> {
    try {
      const cacheNames = await caches.keys();
      const cacheDetails = [];

      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        cacheDetails.push({
          name: cacheName,
          size: keys.length,
          entries: keys.map(key => key.url).slice(0, 5), // 只显示前5个条目
        });
      }

      if (cacheDetails.length > 0) {
        this.addTestResult('cacheStrategy', true, `缓存策略配置正确，共${cacheDetails.length}个缓存`, cacheDetails);
      } else {
        this.addTestResult('cacheStrategy', false, '未发现任何缓存');
      }
    } catch (error) {
      this.addTestResult('cacheStrategy', false, '缓存策略测试失败', error);
    }
  }

  // 测试相机功能
  async testCamera(): Promise<void> {
    try {
      if (navigator.mediaDevices && typeof navigator.mediaDevices.getUserMedia === 'function') {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        
        this.addTestResult('camera', true, `发现${cameras.length}个摄像头`, cameras);
      } else {
        this.addTestResult('camera', false, '浏览器不支持相机功能');
      }
    } catch (error) {
      this.addTestResult('camera', false, '相机功能测试失败', error);
    }
  }

  // 测试地理位置
  async testGeolocation(): Promise<void> {
    try {
      if ('geolocation' in navigator) {
        this.addTestResult('geolocation', true, '地理位置功能支持');
      } else {
        this.addTestResult('geolocation', false, '浏览器不支持地理位置功能');
      }
    } catch (error) {
      this.addTestResult('geolocation', false, '地理位置测试失败', error);
    }
  }

  // 测试存储功能
  async testStorage(): Promise<void> {
    try {
      const storageTests = {
        localStorage: 'localStorage' in window,
        sessionStorage: 'sessionStorage' in window,
        indexedDB: 'indexedDB' in window,
        webSQL: 'openDatabase' in window,
      };

      const supportedStorage = Object.entries(storageTests)
        .filter(([_, supported]) => supported)
        .map(([name, _]) => name);

      this.addTestResult('storage', true, `支持的存储类型: ${supportedStorage.join(', ')}`, storageTests);
    } catch (error) {
      this.addTestResult('storage', false, '存储功能测试失败', error);
    }
  }

  // 添加测试结果
  private addTestResult(test: string, passed: boolean, message: string, details?: any): void {
    this.testResults.push({
      test,
      passed,
      message,
      details,
    });
  }

  // 生成测试报告
  generateReport(): string {
    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(result => result.passed).length;
    const failedTests = totalTests - passedTests;
    const passRate = totalTests > 0 ? (passedTests / totalTests * 100).toFixed(1) : '0';

    let report = `
# PWA测试报告

## 测试概览
- 总测试数: ${totalTests}
- 通过测试: ${passedTests}
- 失败测试: ${failedTests}
- 通过率: ${passRate}%

## 详细结果
`;

    this.testResults.forEach(result => {
      const status = result.passed ? '✅' : '❌';
      report += `
### ${status} ${result.test}
**状态**: ${result.passed ? '通过' : '失败'}
**消息**: ${result.message}
${result.details ? `**详情**: \`\`\`json\n${JSON.stringify(result.details, null, 2)}\n\`\`\`` : ''}
`;
    });

    return report;
  }

  // 获取测试结果摘要
  getSummary(): { total: number; passed: number; failed: number; passRate: number } {
    const total = this.testResults.length;
    const passed = this.testResults.filter(result => result.passed).length;
    const failed = total - passed;
    const passRate = total > 0 ? (passed / total * 100) : 0;

    return { total, passed, failed, passRate };
  }
}

// 创建全局实例
export const pwaTestUtils = new PWATestUtils();

// 导出类型
export type { PWATestResult };
export default PWATestUtils;
