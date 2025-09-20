import React, { useState } from 'react';
import { Card, Button, Space, Typography, message, List, Tag } from 'antd';
import { QrcodeOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { createTestCustomerWithDigitalCard, generateDigitalCardForExistingCustomer, listCustomersWithDigitalCards } from '@/utils/createTestDigitalCard';
import { generateCardUrl } from '@/config/environment';

const { Title, Text } = Typography;

const DigitalCardTestPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<any[]>([]);

  const handleCreateTestCustomer = async () => {
    try {
      setLoading(true);
      await createTestCustomerWithDigitalCard();
      message.success('测试客户创建成功！');

      await handleLoadCustomers();
    } catch (error) {
      message.error('创建测试客户失败');
      console.error('创建失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCustomers = async () => {
    try {
      setLoading(true);
      const customerList = await listCustomersWithDigitalCards();
      setCustomers(customerList);
      message.success(`加载了 ${customerList.length} 个客户`);
    } catch (error) {
      message.error('加载客户列表失败');
      console.error('加载失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateCard = async (customerId: string) => {
    try {
      setLoading(true);
      await generateDigitalCardForExistingCustomer(customerId);
      message.success('数字名片生成成功！');

      await handleLoadCustomers();
    } catch (error) {
      message.error('生成数字名片失败');
      console.error('生成失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewCard = (customerId: string) => {
    const cardUrl = generateCardUrl(customerId);
    window.open(cardUrl, '_blank');
  };

  return (
    <div className="p-6">
      <Title level={2}>数字名片测试页面</Title>
      
      <Space direction="vertical" size="large" className="w-full">
        {/* 操作按钮 */}
        <Card title="测试操作">
          <Space wrap>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={handleCreateTestCustomer}
              loading={loading}
            >
              创建测试客户
            </Button>
            <Button 
              icon={<QrcodeOutlined />}
              onClick={handleLoadCustomers}
              loading={loading}
            >
              加载客户列表
            </Button>
          </Space>
        </Card>

        {/* 客户列表 */}
        {customers.length > 0 && (
          <Card title="客户列表">
            <List
              dataSource={customers}
              renderItem={(customer) => (
                <List.Item
                  actions={[
                    customer.digitalCard?.isActive ? (
                      <Button 
                        type="link" 
                        icon={<EyeOutlined />}
                        onClick={() => handleViewCard(customer.id)}
                      >
                        查看名片
                      </Button>
                    ) : (
                      <Button 
                        type="link" 
                        icon={<QrcodeOutlined />}
                        onClick={() => handleGenerateCard(customer.id)}
                        loading={loading}
                      >
                        生成名片
                      </Button>
                    )
                  ]}
                >
                  <List.Item.Meta
                    title={`${customer.firstName}${customer.lastName}`}
                    description={
                      <div>
                        <div>{customer.email}</div>
                        <div className="mt-1">
                          <Tag color={customer.digitalCard?.isActive ? 'green' : 'orange'}>
                            {customer.digitalCard?.isActive ? '已生成数字名片' : '未生成数字名片'}
                          </Tag>
                        </div>
                        {customer.digitalCard?.cardUrl && (
                          <div className="mt-1">
                            <Text code className="text-xs">
                              {customer.digitalCard.cardUrl}
                            </Text>
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        )}

        {/* 使用说明 */}
        <Card title="使用说明">
          <div className="space-y-2">
            <Text>1. 点击"创建测试客户"按钮创建一个带有数字名片的测试客户</Text>
            <Text>2. 点击"加载客户列表"查看所有客户及其数字名片状态</Text>
            <Text>3. 对于没有数字名片的客户，可以点击"生成名片"按钮</Text>
            <Text>4. 对于已有数字名片的客户，可以点击"查看名片"按钮</Text>
            <Text>5. 数字名片页面将在新标签页中打开</Text>
          </div>
        </Card>
      </Space>
    </div>
  );
};

export default DigitalCardTestPage;
