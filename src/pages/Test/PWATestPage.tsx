import React, { useState } from 'react';
import { Layout, Tabs, Typography, Space, Card, Button, Alert } from 'antd';
import { AppstoreOutlined, MobileOutlined, WifiOutlined, BarChartOutlined } from '@ant-design/icons';
import PWATestPanel from '@/components/Common/PWATestPanel';
import OfflineTestPanel from '@/components/Common/OfflineTestPanel';
import { performanceService } from '@/services/performanceService';

const { Header, Content } = Layout;
const { Title, Text } = Typography;

const PWATestPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('pwa-test');
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);

  // 获取性能指标
  const getPerformanceMetrics = () => {
    const metrics = performanceService.getMetrics();
    const userMetrics = performanceService.getUserMetrics();
    const budgetCheck = performanceService.checkPerformanceBudget();
    
    setPerformanceMetrics({
      metrics,
      userMetrics,
      budgetCheck
    });
  };

  // 性能监控面板
  const PerformancePanel = () => (
    <Card title="性能监控" extra={
      <Button onClick={getPerformanceMetrics}>刷新数据</Button>
    }>
      {performanceMetrics ? (
        <div>
          {/* Core Web Vitals */}
          <Card title="Core Web Vitals" size="small" style={{ marginBottom: 16 }}>
            <Space direction="vertical" style={{ width: '100%' }}>
              {performanceMetrics.metrics.fcp && (
                <div>
                  <Text strong>FCP (First Contentful Paint): </Text>
                  <Text>{performanceMetrics.metrics.fcp.toFixed(2)}ms</Text>
                  <Text type={performanceMetrics.metrics.fcp > 1800 ? 'danger' : 'success'} style={{ marginLeft: 8 }}>
                    {performanceMetrics.metrics.fcp > 1800 ? '⚠️ 超出预算' : '✅ 良好'}
                  </Text>
                </div>
              )}
              {performanceMetrics.metrics.lcp && (
                <div>
                  <Text strong>LCP (Largest Contentful Paint): </Text>
                  <Text>{performanceMetrics.metrics.lcp.toFixed(2)}ms</Text>
                  <Text type={performanceMetrics.metrics.lcp > 2500 ? 'danger' : 'success'} style={{ marginLeft: 8 }}>
                    {performanceMetrics.metrics.lcp > 2500 ? '⚠️ 超出预算' : '✅ 良好'}
                  </Text>
                </div>
              )}
              {performanceMetrics.metrics.fid && (
                <div>
                  <Text strong>FID (First Input Delay): </Text>
                  <Text>{performanceMetrics.metrics.fid.toFixed(2)}ms</Text>
                  <Text type={performanceMetrics.metrics.fid > 100 ? 'danger' : 'success'} style={{ marginLeft: 8 }}>
                    {performanceMetrics.metrics.fid > 100 ? '⚠️ 超出预算' : '✅ 良好'}
                  </Text>
                </div>
              )}
              {performanceMetrics.metrics.cls && (
                <div>
                  <Text strong>CLS (Cumulative Layout Shift): </Text>
                  <Text>{performanceMetrics.metrics.cls.toFixed(4)}</Text>
                  <Text type={performanceMetrics.metrics.cls > 0.1 ? 'danger' : 'success'} style={{ marginLeft: 8 }}>
                    {performanceMetrics.metrics.cls > 0.1 ? '⚠️ 超出预算' : '✅ 良好'}
                  </Text>
                </div>
              )}
            </Space>
          </Card>

          {/* 性能预算检查 */}
          <Card title="性能预算检查" size="small" style={{ marginBottom: 16 }}>
            {performanceMetrics.budgetCheck.passed ? (
              <Alert message="✅ 所有性能指标都在预算范围内" type="success" />
            ) : (
              <Alert 
                message="⚠️ 部分性能指标超出预算" 
                type="warning"
                description={
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                    {performanceMetrics.budgetCheck.violations.map((violation: string, index: number) => (
                      <li key={index}>{violation}</li>
                    ))}
                  </ul>
                }
              />
            )}
          </Card>

          {/* 用户设备信息 */}
          <Card title="设备信息" size="small">
            <Space direction="vertical" style={{ width: '100%' }}>
              <div>
                <Text strong>设备类型: </Text>
                <Text>{performanceMetrics.userMetrics.deviceType}</Text>
              </div>
              <div>
                <Text strong>连接类型: </Text>
                <Text>{performanceMetrics.userMetrics.connectionType || '未知'}</Text>
              </div>
              <div>
                <Text strong>应用加载时间: </Text>
                <Text>{performanceMetrics.metrics.appLoadTime?.toFixed(2)}ms</Text>
              </div>
            </Space>
          </Card>
        </div>
      ) : (
        <Alert message="点击'刷新数据'按钮获取性能指标" type="info" />
      )}
    </Card>
  );

  // 标签页配置
  const tabItems = [
    {
      key: 'pwa-test',
      label: (
        <Space>
          <AppstoreOutlined />
          PWA功能测试
        </Space>
      ),
      children: <PWATestPanel />
    },
    {
      key: 'offline-test',
      label: (
        <Space>
          <WifiOutlined />
          离线场景测试
        </Space>
      ),
      children: <OfflineTestPanel />
    },
    {
      key: 'performance',
      label: (
        <Space>
          <BarChartOutlined />
          性能监控
        </Space>
      ),
      children: <PerformancePanel />
    },
    {
      key: 'mobile-test',
      label: (
        <Space>
          <MobileOutlined />
          移动端测试
        </Space>
      ),
      children: (
        <Card title="移动端测试指南">
          <Alert
            message="移动端测试说明"
            description={
              <div>
                <p>为了全面测试PWA在移动设备上的表现，请按以下步骤操作：</p>
                <ol style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                  <li>在移动设备上打开浏览器，访问此应用</li>
                  <li>测试响应式布局在不同屏幕尺寸下的表现</li>
                  <li>验证触摸交互是否流畅</li>
                  <li>测试底部导航栏的显示和功能</li>
                  <li>检查相机和QR码扫描功能</li>
                  <li>测试推送通知功能</li>
                  <li>验证PWA安装提示和安装过程</li>
                  <li>测试离线功能的使用体验</li>
                </ol>
                <p style={{ marginTop: 16 }}>
                  <strong>测试设备建议：</strong>
                  <br />
                  • iOS Safari (iPhone/iPad)
                  <br />
                  • Android Chrome
                  <br />
                  • 不同屏幕尺寸的设备
                </p>
              </div>
            }
            type="info"
            showIcon
          />
        </Card>
      )
    }
  ];

  return (
    <Layout className="min-h-screen">
      <Header className="app-header px-4 flex items-center">
        <Space>
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            PWA测试中心
          </Title>
        </Space>
      </Header>
      
      <Content className="app-content" style={{ padding: '24px' }}>
        <div className="max-w-6xl mx-auto">
          <Alert
            message="PWA测试中心"
            description="此页面提供了完整的PWA功能测试工具，包括功能测试、离线场景测试、性能监控和移动端测试指南。"
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />
          
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={tabItems}
            size="large"
          />
        </div>
      </Content>
    </Layout>
  );
};

export default PWATestPage;
