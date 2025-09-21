import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, List, Typography, Space, Tag, message, Input, Row, Col } from 'antd';
import { ReloadOutlined, BugOutlined, CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { 
  checkCustomerQRCode, 
  regenerateCustomerQRCode, 
  testQRCodeGeneration,
  checkAllCustomersQRCode,
  fixAllInvalidQRCodes
} from '@/utils/debugQRCode';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const QRCodeDebugPage: React.FC = () => {
  const [customerId, setCustomerId] = useState('');
  const [customerQRStatus, setCustomerQRStatus] = useState<any>(null);
  const [allCustomersStatus, setAllCustomersStatus] = useState<any>(null);
  const [testResult, setTestResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCheckCustomer = async () => {
    if (!customerId.trim()) {
      message.warning('请输入客户ID');
      return;
    }

    setLoading(true);
    try {
      const status = await checkCustomerQRCode(customerId.trim());
      setCustomerQRStatus(status);
    } catch (error) {
      message.error('检查失败');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateQR = async () => {
    if (!customerId.trim()) {
      message.warning('请输入客户ID');
      return;
    }

    setLoading(true);
    try {
      const result = await regenerateCustomerQRCode(customerId.trim());
      if (result.success) {
        message.success('二维码重新生成成功');
        // 重新检查状态
        await handleCheckCustomer();
      } else {
        message.error(result.error || '重新生成失败');
      }
    } catch (error) {
      message.error('重新生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleTestGeneration = async () => {
    setLoading(true);
    try {
      const result = await testQRCodeGeneration();
      setTestResult(result);
      if (result.success) {
        message.success('二维码生成测试成功');
      } else {
        message.error(result.error || '二维码生成测试失败');
      }
    } catch (error) {
      message.error('测试失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAllCustomers = async () => {
    setLoading(true);
    try {
      const status = await checkAllCustomersQRCode();
      setAllCustomersStatus(status);
      message.success(`检查完成：共${status.total}个客户`);
    } catch (error) {
      message.error('检查所有客户失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFixAllInvalid = async () => {
    setLoading(true);
    try {
      const result = await fixAllInvalidQRCodes();
      if (result.success) {
        message.success(`修复完成：成功修复${result.fixed}个客户`);
      } else {
        message.warning(`修复完成：成功${result.fixed}个，失败${result.failed}个`);
      }
      // 重新检查状态
      await handleCheckAllCustomers();
    } catch (error) {
      message.error('批量修复失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title level={2}>二维码调试工具</Title>
      
      {/* 单个客户检查 */}
      <Card title="单个客户二维码检查" className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Search
              placeholder="输入客户ID"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              onSearch={handleCheckCustomer}
              style={{ width: 300 }}
            />
            <Button 
              type="primary" 
              onClick={handleCheckCustomer}
              loading={loading}
            >
              检查二维码
            </Button>
            <Button 
              onClick={handleRegenerateQR}
              loading={loading}
              disabled={!customerQRStatus?.hasQRCode}
            >
              重新生成
            </Button>
          </div>

          {customerQRStatus && (
            <Alert
              message={`客户二维码状态: ${customerQRStatus.hasQRCode ? '有二维码' : '无二维码'}`}
              description={
                <div className="space-y-2">
                  <div><Text strong>有二维码:</Text> {customerQRStatus.hasQRCode ? '✅ 是' : '❌ 否'}</div>
                  <div><Text strong>数据URL格式:</Text> {customerQRStatus.isDataURL ? '✅ 是' : '❌ 否'}</div>
                  <div><Text strong>有效图片:</Text> {customerQRStatus.isValidImage ? '✅ 是' : '❌ 否'}</div>
                  <div><Text strong>名片URL:</Text> <Text code>{customerQRStatus.cardUrl || '无'}</Text></div>
                  {customerQRStatus.qrCodeData && (
                    <div>
                      <Text strong>二维码数据:</Text>
                      <div className="mt-2">
                        <Text code className="text-xs break-all">
                          {customerQRStatus.qrCodeData.substring(0, 100)}...
                        </Text>
                      </div>
                    </div>
                  )}
                  {customerQRStatus.error && (
                    <div><Text strong className="text-red-600">错误:</Text> {customerQRStatus.error}</div>
                  )}
                </div>
              }
              type={
                customerQRStatus.hasQRCode && customerQRStatus.isValidImage 
                  ? 'success' 
                  : customerQRStatus.error 
                    ? 'error' 
                    : 'warning'
              }
              showIcon
            />
          )}
        </div>
      </Card>

      {/* 二维码生成测试 */}
      <Card title="二维码生成测试" className="mb-6">
        <div className="space-y-4">
          <Button 
            type="primary" 
            icon={<BugOutlined />}
            onClick={handleTestGeneration}
            loading={loading}
          >
            测试二维码生成
          </Button>

          {testResult && (
            <Alert
              message={`测试结果: ${testResult.success ? '成功' : '失败'}`}
              description={
                testResult.success ? (
                  <div>
                    <Text>二维码生成功能正常</Text>
                    {testResult.testData && (
                      <div className="mt-2">
                        <Text strong>测试数据:</Text>
                        <div className="mt-1">
                          <Text code className="text-xs break-all">
                            {testResult.testData.substring(0, 100)}...
                          </Text>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Text className="text-red-600">{testResult.error}</Text>
                )
              }
              type={testResult.success ? 'success' : 'error'}
              showIcon
            />
          )}
        </div>
      </Card>

      {/* 所有客户状态检查 */}
      <Card title="所有客户二维码状态" className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button 
              type="primary" 
              onClick={handleCheckAllCustomers}
              loading={loading}
            >
              检查所有客户
            </Button>
            <Button 
              onClick={handleFixAllInvalid}
              loading={loading}
              disabled={!allCustomersStatus?.invalidQRCode}
            >
              修复所有无效二维码
            </Button>
          </div>

          {allCustomersStatus && (
            <div className="space-y-4">
              <Row gutter={16}>
                <Col span={6}>
                  <Card size="small">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{allCustomersStatus.total}</div>
                      <div>总客户数</div>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{allCustomersStatus.withQRCode}</div>
                      <div>有二维码</div>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{allCustomersStatus.withoutQRCode}</div>
                      <div>无二维码</div>
                    </div>
                  </Card>
                </Col>
                <Col span={6}>
                  <Card size="small">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{allCustomersStatus.invalidQRCode}</div>
                      <div>无效二维码</div>
                    </div>
                  </Card>
                </Col>
              </Row>

              <List
                dataSource={allCustomersStatus.customers}
                renderItem={(customer: any) => (
                  <List.Item
                    actions={[
                      <Tag color={customer.hasQRCode ? (customer.isValidQRCode ? 'green' : 'red') : 'default'}>
                        {customer.hasQRCode ? (customer.isValidQRCode ? '有效' : '无效') : '无'}
                      </Tag>
                    ]}
                  >
                    <List.Item.Meta
                      title={customer.name}
                      description={
                        <div>
                          <div>ID: <Text code>{customer.id}</Text></div>
                          {customer.cardUrl && (
                            <div>URL: <Text code className="text-xs">{customer.cardUrl}</Text></div>
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QRCodeDebugPage;
