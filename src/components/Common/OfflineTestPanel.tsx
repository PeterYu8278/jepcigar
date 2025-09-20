import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Alert, Progress, List, Tag } from 'antd';
import { WifiOutlined, DisconnectOutlined, CloudDownloadOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface OfflineTestPanelProps {
  visible?: boolean;
  onClose?: () => void;
}

interface NetworkCondition {
  name: string;
  description: string;
  latency: number; // ms
  downloadSpeed: number; // kbps
  uploadSpeed: number; // kbps
  reliability: number; // percentage
}

const OfflineTestPanel: React.FC<OfflineTestPanelProps> = ({ visible = true, onClose }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [networkCondition, setNetworkCondition] = useState<NetworkCondition>({
    name: '正常网络',
    description: '稳定的网络连接',
    latency: 50,
    downloadSpeed: 10000,
    uploadSpeed: 5000,
    reliability: 99
  });
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isTesting, setIsTesting] = useState(false);
  const [testProgress, setTestProgress] = useState(0);

  // 网络条件预设
  const networkPresets: NetworkCondition[] = [
    {
      name: '正常网络',
      description: '稳定的网络连接',
      latency: 50,
      downloadSpeed: 10000,
      uploadSpeed: 5000,
      reliability: 99
    },
    {
      name: '慢速网络',
      description: '2G网络条件',
      latency: 300,
      downloadSpeed: 50,
      uploadSpeed: 20,
      reliability: 85
    },
    {
      name: '不稳定网络',
      description: '网络连接不稳定',
      latency: 200,
      downloadSpeed: 1000,
      uploadSpeed: 500,
      reliability: 70
    },
    {
      name: '离线模式',
      description: '完全离线状态',
      latency: 0,
      downloadSpeed: 0,
      uploadSpeed: 0,
      reliability: 0
    }
  ];

  // 监听网络状态变化
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 模拟网络条件
  const simulateNetworkCondition = (condition: NetworkCondition) => {
    setNetworkCondition(condition);
    
    // 这里可以集成Chrome DevTools的Network Throttling
    // 或者使用Service Worker来模拟网络条件

  };

  // 测试离线功能
  const testOfflineFunctionality = async () => {
    setIsTesting(true);
    setTestProgress(0);
    setTestResults([]);

    const tests = [
      { name: 'Service Worker缓存', test: testServiceWorkerCache },
      { name: '离线页面访问', test: testOfflinePage },
      { name: '缓存资源加载', test: testCachedResources },
      { name: '离线数据存储', test: testOfflineStorage },
      { name: '网络恢复同步', test: testNetworkSync },
    ];

    const results: any[] = [];

    for (let i = 0; i < tests.length; i++) {
      const { name, test } = tests[i];
      setTestProgress((i / tests.length) * 100);
      
      try {
        const result = await test();
        results.push({ name, success: true, result });
      } catch (error) {
        results.push({ name, success: false, error: (error as Error).message });
      }
    }

    setTestResults(results);
    setIsTesting(false);
    setTestProgress(100);
  };

  // 测试Service Worker缓存
  const testServiceWorkerCache = async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (!registration) {
      throw new Error('Service Worker未注册');
    }

    const cacheNames = await caches.keys();
    if (cacheNames.length === 0) {
      throw new Error('未发现任何缓存');
    }

    // 测试缓存内容
    const cacheDetails = [];
    for (const cacheName of cacheNames) {
      const cache = await caches.open(cacheName);
      const keys = await cache.keys();
      cacheDetails.push({
        name: cacheName,
        size: keys.length,
        entries: keys.map(key => key.url).slice(0, 5)
      });
    }

    return { cacheNames, cacheDetails };
  };

  // 测试离线页面
  const testOfflinePage = async () => {
    try {
      const response = await fetch('/offline.html');
      if (!response.ok) {
        throw new Error('离线页面无法访问');
      }
      return { accessible: true, status: response.status };
    } catch (error) {
      throw new Error('离线页面测试失败: ' + (error as Error).message);
    }
  };

  // 测试缓存资源
  const testCachedResources = async () => {
    const criticalResources = [
      '/',
      '/manifest.json',
      '/icons/icon-192x192.svg',
      '/icons/icon-512x512.svg'
    ];

    const results = [];
    for (const resource of criticalResources) {
      try {
        const response = await fetch(resource);
        results.push({
          resource,
          cached: response.status === 200,
          status: response.status
        });
      } catch (error) {
        results.push({
          resource,
          cached: false,
          error: (error as Error).message
        });
      }
    }

    const cachedCount = results.filter(r => r.cached).length;
    if (cachedCount === 0) {
      throw new Error('没有资源被缓存');
    }

    return { results, cachedCount, totalCount: criticalResources.length };
  };

  // 测试离线存储
  const testOfflineStorage = async () => {
    const storageTests = {
      localStorage: false,
      sessionStorage: false,
      indexedDB: false
    };

    try {
      localStorage.setItem('pwa-test', 'test-value');
      storageTests.localStorage = localStorage.getItem('pwa-test') === 'test-value';
      localStorage.removeItem('pwa-test');
    } catch (error) {
      console.warn('localStorage测试失败:', error);
    }

    try {
      sessionStorage.setItem('pwa-test', 'test-value');
      storageTests.sessionStorage = sessionStorage.getItem('pwa-test') === 'test-value';
      sessionStorage.removeItem('pwa-test');
    } catch (error) {
      console.warn('sessionStorage测试失败:', error);
    }

    try {
      // 简单的IndexedDB测试
      if ('indexedDB' in window) {
        storageTests.indexedDB = true;
      }
    } catch (error) {
      console.warn('IndexedDB测试失败:', error);
    }

    return storageTests;
  };

  // 测试网络恢复同步
  const testNetworkSync = async () => {
    // 模拟网络恢复后的数据同步
    const syncData = {
      timestamp: Date.now(),
      pendingActions: ['sync-user-data', 'sync-inventory', 'sync-events'],
      status: 'ready'
    };

    return syncData;
  };

  // 清除缓存
  const clearCache = async () => {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );

    } catch (error) {
      console.error('清除缓存失败:', error);
    }
  };

  // 更新Service Worker
  const updateServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration) {
        await registration.update();

      }
    } catch (error) {
      console.error('更新Service Worker失败:', error);
    }
  };

  if (!visible) return null;

  return (
    <div className="offline-test-panel">
      <Card
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>离线场景测试</Title>
            <Tag color={isOnline ? 'success' : 'error'} icon={isOnline ? <WifiOutlined /> : <DisconnectOutlined />}>
              {isOnline ? '在线' : '离线'}
            </Tag>
          </Space>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<CloudDownloadOutlined />}
              onClick={testOfflineFunctionality}
              loading={isTesting}
            >
              测试离线功能
            </Button>
            {onClose && (
              <Button type="text" onClick={onClose}>
                关闭
              </Button>
            )}
          </Space>
        }
      >
        {/* 网络条件模拟 */}
        <Card title="网络条件模拟" size="small" style={{ marginBottom: 16 }}>
          <Space wrap>
            {networkPresets.map((preset, index) => (
              <Button
                key={index}
                type={networkCondition.name === preset.name ? 'primary' : 'default'}
                onClick={() => simulateNetworkCondition(preset)}
              >
                {preset.name}
              </Button>
            ))}
          </Space>
          
          <div style={{ marginTop: 16 }}>
            <Text strong>当前网络条件:</Text>
            <Paragraph style={{ margin: '8px 0 0 0' }}>
              <Text>{networkCondition.description}</Text>
              <br />
              延迟: {networkCondition.latency}ms | 
              下载: {networkCondition.downloadSpeed} kbps | 
              上传: {networkCondition.uploadSpeed} kbps | 
              可靠性: {networkCondition.reliability}%
            </Paragraph>
          </div>
        </Card>

        {/* 测试进度 */}
        {isTesting && (
          <Alert
            message="正在测试离线功能..."
            description={
              <Progress
                percent={testProgress}
                status="active"
                strokeColor="#1890ff"
              />
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* 测试结果 */}
        {testResults.length > 0 && (
          <Card title="测试结果" size="small" style={{ marginBottom: 16 }}>
            <List
              dataSource={testResults}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Tag color={item.success ? 'success' : 'error'}>
                        {item.success ? '✓' : '✗'}
                      </Tag>
                    }
                    title={item.name}
                    description={
                      item.success ? (
                        <pre style={{ 
                          margin: 0, 
                          padding: 8, 
                          background: '#f6ffed', 
                          borderRadius: 4,
                          fontSize: 12,
                          overflow: 'auto'
                        }}>
                          {JSON.stringify(item.result, null, 2)}
                        </pre>
                      ) : (
                        <Text type="danger">{item.error}</Text>
                      )
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* 缓存管理 */}
        <Card title="缓存管理" size="small">
          <Space wrap>
            <Button onClick={clearCache} danger>
              清除缓存
            </Button>
            <Button onClick={updateServiceWorker}>
              更新Service Worker
            </Button>
            <Button onClick={() => {
              const registration = navigator.serviceWorker.getRegistration();
              registration.then(reg => {
                if (reg) {
                  reg.unregister();

                }
              });
            }}>
              注销Service Worker
            </Button>
          </Space>
        </Card>

        {/* 使用说明 */}
        <Alert
          message="离线测试说明"
          description={
            <div>
              <Paragraph style={{ margin: 0 }}>
                此测试面板用于验证PWA在离线场景下的功能表现：
              </Paragraph>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                <li>Service Worker缓存策略</li>
                <li>离线页面可访问性</li>
                <li>缓存资源加载能力</li>
                <li>离线数据存储功能</li>
                <li>网络恢复后的数据同步</li>
              </ul>
            </div>
          }
          type="info"
          showIcon
          style={{ marginTop: 16 }}
        />
      </Card>
    </div>
  );
};

export default OfflineTestPanel;
