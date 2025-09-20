import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Divider, Alert } from 'antd';
import { testEnvironmentConfig } from '@/utils/testEnvironment';
import { generateCardUrl } from '@/config/environment';

const { Title, Text, Paragraph } = Typography;

const EnvironmentTestPage: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runTest = () => {
    setIsLoading(true);
    try {
      const results = testEnvironmentConfig();
      setTestResults(results);
    } catch (error) {
      console.error('测试失败:', error);
      setTestResults({ error: error instanceof Error ? error.message : '未知错误' });
    } finally {
      setIsLoading(false);
    }
  };

  const testCardUrl = () => {
    const testCustomerId = 'test-customer-123';
    const cardUrl = generateCardUrl(testCustomerId);
    console.log('测试卡片URL:', cardUrl);
    return cardUrl;
  };

  useEffect(() => {
    // 自动运行测试
    runTest();
  }, []);

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Title level={2}>环境配置测试</Title>
      
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        <Card>
          <Title level={3}>测试控制</Title>
          <Space>
            <Button type="primary" onClick={runTest} loading={isLoading}>
              重新运行测试
            </Button>
            <Button onClick={() => console.log('测试卡片URL:', testCardUrl())}>
              测试卡片URL生成
            </Button>
          </Space>
        </Card>

        <Card>
          <Title level={3}>环境变量信息</Title>
          <Paragraph>
            <Text strong>VITE_APP_BASE_URL:</Text> {import.meta.env.VITE_APP_BASE_URL || '未设置'}
          </Paragraph>
          <Paragraph>
            <Text strong>当前域名 (window.location.origin):</Text> {typeof window !== 'undefined' ? window.location.origin : 'N/A'}
          </Paragraph>
          <Paragraph>
            <Text strong>开发模式:</Text> {import.meta.env.DEV ? '是' : '否'}
          </Paragraph>
          <Paragraph>
            <Text strong>生产模式:</Text> {import.meta.env.PROD ? '是' : '否'}
          </Paragraph>
        </Card>

        <Card>
          <Title level={3}>配置结果</Title>
          {testResults && !testResults.error ? (
            <>
              <Paragraph>
                <Text strong>环境配置:</Text>
                <pre style={{ background: '#f5f5f5', padding: '8px', borderRadius: '4px' }}>
                  {JSON.stringify(testResults.config, null, 2)}
                </pre>
              </Paragraph>
              
              <Paragraph>
                <Text strong>当前域名:</Text> {testResults.origin}
              </Paragraph>
              
              <Paragraph>
                <Text strong>生成的卡片URL:</Text> {testResults.cardUrl}
              </Paragraph>
              
              <Alert
                message={
                  testResults.isDevelopment 
                    ? (testResults.isValidDevUrl ? '✅ 开发环境域名正确' : '❌ 开发环境域名错误')
                    : (testResults.isValidProdUrl ? '✅ 生产环境域名正确' : '❌ 生产环境域名错误')
                }
                description={
                  testResults.isDevelopment
                    ? (testResults.isValidDevUrl ? '正在使用localhost:3000域名' : '未使用localhost:3000域名')
                    : (testResults.isValidProdUrl ? '正在使用Netlify域名' : '未使用Netlify域名')
                }
                type={
                  (testResults.isDevelopment && testResults.isValidDevUrl) || 
                  (testResults.isProduction && testResults.isValidProdUrl)
                    ? 'success' 
                    : 'error'
                }
                showIcon
              />
            </>
          ) : testResults?.error ? (
            <Alert
              message="测试失败"
              description={testResults.error}
              type="error"
              showIcon
            />
          ) : (
            <Text>点击"重新运行测试"按钮开始测试</Text>
          )}
        </Card>

        <Card>
          <Title level={3}>手动测试</Title>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Button 
              type="dashed" 
              onClick={() => window.open(testCardUrl(), '_blank')}
              style={{ width: '100%' }}
            >
              打开测试卡片URL
            </Button>
            
            <Divider />
            
            <Title level={4}>测试不同的客户ID</Title>
            <Space wrap>
              {['customer-001', 'customer-002', 'customer-003'].map(id => (
                <Button 
                  key={id}
                  onClick={() => {
                    const url = generateCardUrl(id);
                    console.log(`客户 ${id} 的卡片URL:`, url);
                    window.open(url, '_blank');
                  }}
                >
                  测试 {id}
                </Button>
              ))}
            </Space>
          </Space>
        </Card>
      </Space>
    </div>
  );
};

export default EnvironmentTestPage;
