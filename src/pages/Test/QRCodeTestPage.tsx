import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Typography, Row, Col, Alert, Select, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import QRCodeDisplay from '@/components/Common/QRCodeDisplay';
import { useCustomers } from '@/stores/customerStore';
import { generateCardUrl } from '@/config/environment';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

interface TestQRCode {
  id: string;
  title: string;
  data: string;
  type: 'text' | 'url' | 'card';
}

const QRCodeTestPage: React.FC = () => {
  const { customers } = useCustomers();
  const [customText, setCustomText] = useState('Hello, World!');
  const [customUrl, setCustomUrl] = useState('https://jepcigar.netlify.app');
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [testResults, setTestResults] = useState<{
    generationTime: number;
    success: boolean;
    error?: string;
  } | null>(null);

  // 测试数据
  const testQRCodes: TestQRCode[] = [
    {
      id: 'text',
      title: '文本内容',
      data: customText,
      type: 'text'
    },
    {
      id: 'url',
      title: '网址链接',
      data: customUrl,
      type: 'url'
    },
    {
      id: 'card',
      title: '数字名片',
      data: selectedCustomer ? generateCardUrl(selectedCustomer) : '',
      type: 'card'
    }
  ];

  // 性能测试
  const runPerformanceTest = async () => {
    const startTime = performance.now();
    
    try {
      // 生成多个二维码测试性能
      const testData = [
        'https://jepcigar.netlify.app',
        'https://jepcigar.netlify.app/card/test123',
        'Hello, World!',
        '这是一个测试文本内容，用于验证二维码生成性能。',
        'https://www.google.com'
      ];

      for (const data of testData) {
        const { generateQRCodeData } = await import('@/utils');
        await generateQRCodeData(data);
      }

      const endTime = performance.now();
      const generationTime = endTime - startTime;

      setTestResults({
        generationTime: Math.round(generationTime),
        success: true
      });

      message.success(`性能测试完成，耗时 ${Math.round(generationTime)}ms`);
    } catch (error) {
      setTestResults({
        generationTime: 0,
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      });
      message.error('性能测试失败');
    }
  };

  // 选择第一个有数字名片的客户作为默认值
  useEffect(() => {
    if (customers.length > 0 && !selectedCustomer) {
      const customerWithCard = customers.find(c => c.digitalCard?.isActive);
      if (customerWithCard) {
        setSelectedCustomer(customerWithCard.id);
      }
    }
  }, [customers, selectedCustomer]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title level={2}>二维码功能测试</Title>
      
      {/* 性能测试 */}
      <Card title="性能测试" className="mb-6">
        <div className="space-y-4">
          <Paragraph>
            测试二维码生成的性能表现，包括生成时间和成功率。
          </Paragraph>
          
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={runPerformanceTest}
          >
            运行性能测试
          </Button>

          {testResults && (
            <Alert
              message={testResults.success ? '性能测试成功' : '性能测试失败'}
              description={
                testResults.success ? (
                  <div>
                    <div>生成时间: {testResults.generationTime}ms</div>
                    <div>平均每个二维码: {Math.round(testResults.generationTime / 5)}ms</div>
                  </div>
                ) : (
                  <div>错误: {testResults.error}</div>
                )
              }
              type={testResults.success ? 'success' : 'error'}
              showIcon
            />
          )}
        </div>
      </Card>

      {/* 二维码生成测试 */}
      <Card title="二维码生成测试" className="mb-6">
        <Row gutter={[24, 24]}>
          {/* 文本内容测试 */}
          <Col xs={24} lg={12}>
            <Card title="文本内容" size="small">
              <div className="space-y-4">
                <TextArea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="输入要生成二维码的文本内容"
                  rows={3}
                />
                <QRCodeDisplay
                  data={customText}
                  title="文本二维码"
                  size={150}
                  showActions={true}
                />
              </div>
            </Card>
          </Col>

          {/* URL链接测试 */}
          <Col xs={24} lg={12}>
            <Card title="网址链接" size="small">
              <div className="space-y-4">
                <Input
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="输入要生成二维码的网址"
                />
                <QRCodeDisplay
                  data={customUrl}
                  title="网址二维码"
                  size={150}
                  showActions={true}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 数字名片测试 */}
      <Card title="数字名片二维码测试" className="mb-6">
        <div className="space-y-4">
          <div>
            <Text strong>选择客户:</Text>
            <Select
              value={selectedCustomer}
              onChange={setSelectedCustomer}
              placeholder="选择一个客户"
              className="w-full mt-2"
              showSearch
              filterOption={(input, option) =>
                option?.children?.toString().toLowerCase().includes(input.toLowerCase()) ?? false
              }
            >
              {customers.map(customer => (
                <Select.Option key={customer.id} value={customer.id}>
                  {customer.firstName}{customer.lastName} 
                  {customer.digitalCard?.isActive && (
                    <span className="text-green-600"> (已有数字名片)</span>
                  )}
                </Select.Option>
              ))}
            </Select>
          </div>

          {selectedCustomer && (
            <QRCodeDisplay
              data={generateCardUrl(selectedCustomer)}
              title="数字名片二维码"
              size={200}
              showActions={true}
              onSuccess={(qrCodeDataUrl) => {
                console.log('数字名片二维码生成成功:', qrCodeDataUrl);
              }}
              onError={(error) => {
                console.error('数字名片二维码生成失败:', error);
              }}
            />
          )}
        </div>
      </Card>

      {/* 功能对比 */}
      <Card title="功能对比">
        <Row gutter={[16, 16]}>
          {testQRCodes.map((qrCode) => (
            <Col xs={24} md={8} key={qrCode.id}>
              <Card title={qrCode.title} size="small">
                <QRCodeDisplay
                  data={qrCode.data}
                  title={qrCode.title}
                  size={120}
                  showActions={false}
                />
                <div className="mt-2">
                  <Text type="secondary" className="text-xs break-all">
                    {qrCode.data}
                  </Text>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      {/* 使用说明 */}
      <Card title="使用说明" className="mt-6">
        <div className="space-y-4">
          <Title level={4}>QRCodeDisplay 组件特性</Title>
          <ul className="list-disc list-inside space-y-2">
            <li><Text strong>自动生成:</Text> 支持自动生成二维码，无需手动调用</li>
            <li><Text strong>错误处理:</Text> 完善的错误处理和重试机制</li>
            <li><Text strong>下载功能:</Text> 支持下载二维码为PNG文件</li>
            <li><Text strong>分享功能:</Text> 支持原生分享API和剪贴板降级</li>
            <li><Text strong>响应式:</Text> 自适应不同屏幕尺寸</li>
            <li><Text strong>性能优化:</Text> 使用动态导入，避免阻塞主线程</li>
          </ul>

          <Title level={4}>使用示例</Title>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
{`import QRCodeDisplay from '@/components/Common/QRCodeDisplay';

<QRCodeDisplay
  data="https://example.com"
  title="示例二维码"
  size={200}
  showActions={true}
  onSuccess={(qrCodeDataUrl) => console.log('生成成功')}
  onError={(error) => console.error('生成失败', error)}
/>`}
          </pre>
        </div>
      </Card>
    </div>
  );
};

export default QRCodeTestPage;
