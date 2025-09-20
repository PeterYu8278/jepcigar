import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Alert, Progress, List, Tag, Divider, Row, Col } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { pwaTestUtils, PWATestResult } from '@/utils/pwaTestUtils';
import { pwaService } from '@/utils/pwaService';
import { performanceService } from '@/services/performanceService';

const { Title, Text, Paragraph } = Typography;

interface PWATestPanelProps {
  visible?: boolean;
  onClose?: () => void;
}

const PWATestPanel: React.FC<PWATestPanelProps> = ({ visible = true, onClose }) => {
  const [testResults, setTestResults] = useState<PWATestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTest, setCurrentTest] = useState('');
  const [summary, setSummary] = useState({ total: 0, passed: 0, failed: 0, passRate: 0 });
  const [isInstalled, setIsInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // 监听网络状态
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

  // 检查PWA安装状态
  useEffect(() => {
    setIsInstalled(pwaService.isInstalled());
  }, []);

  // 运行PWA测试
  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    setTestResults([]);

    try {
      const tests = [
        { name: 'Web App Manifest', progress: 10 },
        { name: 'Service Worker', progress: 20 },
        { name: '离线功能', progress: 30 },
        { name: '移动端功能', progress: 40 },
        { name: '触摸交互', progress: 50 },
        { name: '通知功能', progress: 60 },
        { name: '文件下载', progress: 70 },
        { name: '性能指标', progress: 80 },
        { name: '缓存策略', progress: 90 },
        { name: '完成测试', progress: 100 },
      ];

      for (const test of tests) {
        setCurrentTest(test.name);
        setProgress(test.progress);
        
        // 模拟测试延迟
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      const results = await pwaTestUtils.runAllTests();
      setTestResults(results);
      setSummary(pwaTestUtils.getSummary());
    } catch (error) {
      console.error('PWA测试失败:', error);
    } finally {
      setIsRunning(false);
      setProgress(100);
      setCurrentTest('');
    }
  };

  // 安装PWA
  const installPWA = () => {
    pwaService.showInstallPrompt();
  };

  // 测试通知
  const testNotification = async () => {
    try {
      await pwaService.requestNotificationPermission();
      // 这里可以触发一个测试通知

    } catch (error) {
      console.error('通知测试失败:', error);
    }
  };

  // 获取测试结果图标
  const getTestIcon = (passed: boolean) => {
    return passed ? (
      <CheckCircleOutlined style={{ color: '#52c41a' }} />
    ) : (
      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    );
  };

  // 获取测试结果标签
  const getTestTag = (passed: boolean) => {
    return (
      <Tag color={passed ? 'success' : 'error'}>
        {passed ? '通过' : '失败'}
      </Tag>
    );
  };

  if (!visible) return null;

  return (
    <div className="pwa-test-panel">
      <Card
        title={
          <Space>
            <Title level={4} style={{ margin: 0 }}>PWA功能测试</Title>
            <Tag color={isOnline ? 'success' : 'error'}>
              {isOnline ? '在线' : '离线'}
            </Tag>
            <Tag color={isInstalled ? 'success' : 'default'}>
              {isInstalled ? '已安装' : '未安装'}
            </Tag>
          </Space>
        }
        extra={
          <Space>
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={runTests}
              loading={isRunning}
            >
              运行测试
            </Button>
            {!isInstalled && (
              <Button type="default" onClick={installPWA}>
                安装PWA
              </Button>
            )}
            {onClose && (
              <Button type="text" onClick={onClose}>
                关闭
              </Button>
            )}
          </Space>
        }
      >
        {/* 测试进度 */}
        {isRunning && (
          <Alert
            message={`正在测试: ${currentTest}`}
            description={
              <Progress
                percent={progress}
                status="active"
                strokeColor="#1890ff"
              />
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* 测试摘要 */}
        {summary.total > 0 && (
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                    {summary.total}
                  </div>
                  <div>总测试数</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#52c41a' }}>
                    {summary.passed}
                  </div>
                  <div>通过测试</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#ff4d4f' }}>
                    {summary.failed}
                  </div>
                  <div>失败测试</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 'bold', color: '#1890ff' }}>
                    {summary.passRate.toFixed(1)}%
                  </div>
                  <div>通过率</div>
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {/* 测试结果 */}
        {testResults.length > 0 && (
          <Card title="测试结果详情" size="small">
            <List
              dataSource={testResults}
              renderItem={(result) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={getTestIcon(result.passed)}
                    title={
                      <Space>
                        <Text strong>{result.test}</Text>
                        {getTestTag(result.passed)}
                      </Space>
                    }
                    description={
                      <div>
                        <Paragraph style={{ margin: 0 }}>{result.message}</Paragraph>
                        {result.details && (
                          <details style={{ marginTop: 8 }}>
                            <summary style={{ cursor: 'pointer', color: '#1890ff' }}>
                              查看详情
                            </summary>
                            <pre style={{ 
                              marginTop: 8, 
                              padding: 8, 
                              background: '#f5f5f5', 
                              borderRadius: 4,
                              fontSize: 12,
                              overflow: 'auto'
                            }}>
                              {JSON.stringify(result.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* 快速测试按钮 */}
        <Divider />
        <Space wrap>
          <Button onClick={testNotification}>
            测试通知
          </Button>
          <Button onClick={() => {
            performanceService.getMetrics();

          }}>
            查看性能
          </Button>
          <Button onClick={() => {
            performanceService.checkPerformanceBudget();

          }}>
            性能预算
          </Button>
        </Space>

        {/* 使用说明 */}
        <Alert
          message="PWA测试说明"
          description={
            <div>
              <Paragraph style={{ margin: 0 }}>
                此测试面板用于验证PWA功能的完整性。测试包括：
              </Paragraph>
              <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
                <li>Web App Manifest配置</li>
                <li>Service Worker注册和缓存</li>
                <li>离线功能可用性</li>
                <li>移动端响应式设计</li>
                <li>触摸交互支持</li>
                <li>推送通知功能</li>
                <li>文件下载能力</li>
                <li>性能指标监控</li>
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

export default PWATestPanel;
