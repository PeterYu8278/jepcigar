import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Button, 
  Input, 
  Space, 
  Typography, 
  Avatar,
  Tag,
  Drawer,
  List,
  Empty,
  Spin,
  message,
  App
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  EyeOutlined,
  QrcodeOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined
} from '@ant-design/icons';
import { useCustomers, useCustomerActions } from '@/stores/customerStore';
import { Customer } from '@/types';
import useMobile from '@/hooks/useMobile';

const { Title, Text } = Typography;
const { Search } = Input;

const MobileCustomerPage: React.FC = () => {
  const { message: messageApi } = App.useApp();
  const { isMobile } = useMobile();
  const { 
    customers, 
    isLoading, 
    error 
  } = useCustomers();
  
  const { 
    loadCustomers,
    generateDigitalCard,
    setSelectedCustomer 
  } = useCustomerActions();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomerLocal] = useState<Customer | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, [loadCustomers]);

  // 过滤客户
  const filteredCustomers = customers.filter(customer => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.company?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchTerm)
    );
  });

  // 处理客户选择
  const handleCustomerSelect = (customer: Customer) => {
    setSelectedCustomerLocal(customer);
    setSelectedCustomer(customer);
    setDrawerVisible(true);
  };

  // 生成数字名片
  const handleGenerateDigitalCard = async (customerId: string) => {
    try {
      setIsGeneratingCard(true);
      await generateDigitalCard(customerId);
      messageApi.success('数字名片生成成功');
      setDrawerVisible(false);
    } catch (error) {
      messageApi.error('生成数字名片失败');
    } finally {
      setIsGeneratingCard(false);
    }
  };

  // 客户卡片渲染
  const renderCustomerCard = (customer: Customer) => (
    <Card 
      key={customer.id}
      className="mobile-card mobile-card-elevated mb-3"
      onClick={() => handleCustomerSelect(customer)}
    >
      <div className="mobile-flex-start">
        <Avatar 
          size={48} 
          icon={<UserOutlined />}
          className="bg-primary-100 text-primary-600 mr-3"
        />
        <div className="flex-1 min-w-0">
          <div className="mobile-flex-between mb-1">
            <Title level={5} className="mobile-title-h4 mb-0 truncate">
              {customer.firstName}{customer.lastName}
            </Title>
            <Tag 
              color={customer.digitalCard?.isActive ? 'green' : 'orange'}
              className="mobile-status"
            >
              {customer.digitalCard?.isActive ? '已生成' : '未生成'}
            </Tag>
          </div>
          
          {customer.title && (
            <Text className="mobile-text-sm text-gray-600 block mb-1">
              {customer.title}
            </Text>
          )}
          
          {customer.company && (
            <Text className="mobile-text-sm text-gray-500 block mb-2">
              {customer.company}
            </Text>
          )}
          
          <div className="mobile-flex-start space-x-4">
            {customer.email && (
              <div className="mobile-flex-start">
                <MailOutlined className="text-blue-500 mr-1 text-xs" />
                <Text className="mobile-text-xs text-gray-500 truncate">
                  {customer.email}
                </Text>
              </div>
            )}
            
            {customer.phone && (
              <div className="mobile-flex-start">
                <PhoneOutlined className="text-green-500 mr-1 text-xs" />
                <Text className="mobile-text-xs text-gray-500">
                  {customer.phone}
                </Text>
              </div>
            )}
          </div>
        </div>
        
        <Button 
          type="text" 
          icon={<EyeOutlined />}
          className="mobile-touch-target ml-2"
          onClick={(e) => {
            e.stopPropagation();
            handleCustomerSelect(customer);
          }}
        />
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="mobile-container mobile-flex-center min-h-screen">
        <div className="mobile-loading">
          <Spin size="large" />
          <div className="mobile-loading-text">加载中...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mobile-container min-h-screen mobile-flex-center">
        <Card className="mobile-card mobile-card-lg w-full max-w-sm">
          <div className="mobile-empty">
            <UserOutlined className="mobile-empty-icon" />
            <Title level={3} className="mobile-empty-title">加载失败</Title>
            <Text className="mobile-empty-description">{error}</Text>
            <Button 
              type="primary" 
              className="mobile-btn mobile-btn-full"
              onClick={() => loadCustomers()}
            >
              重新加载
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mobile-container min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="mobile-safe-top bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-4">
          <div className="mobile-flex-between mb-4">
            <Title level={3} className="mobile-title-h3 mb-0">
              客户管理
            </Title>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              className="mobile-btn mobile-btn-primary"
              onClick={() => messageApi.info('添加客户功能开发中')}
            >
              添加
            </Button>
          </div>
          
          <Search
            placeholder="搜索客户..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mobile-input"
            prefix={<SearchOutlined />}
          />
        </div>
      </div>

      {/* 客户列表 */}
      <div className="mobile-spacing-md pt-4">
        {filteredCustomers.length === 0 ? (
          <Card className="mobile-card mobile-card-lg">
            <div className="mobile-empty">
              <UserOutlined className="mobile-empty-icon" />
              <Title level={4} className="mobile-empty-title">
                {searchTerm ? '未找到匹配的客户' : '暂无客户'}
              </Title>
              <Text className="mobile-empty-description">
                {searchTerm ? '尝试使用其他关键词搜索' : '点击上方添加按钮创建第一个客户'}
              </Text>
            </div>
          </Card>
        ) : (
          <div className="mobile-spacing-sm">
            {filteredCustomers.map(renderCustomerCard)}
          </div>
        )}
        
        {/* 底部安全区域 */}
        <div className="mobile-safe-bottom h-4" />
      </div>

      {/* 客户详情抽屉 */}
      <Drawer
        title="客户详情"
        placement="bottom"
        onClose={() => setDrawerVisible(false)}
        open={drawerVisible}
        height="80%"
        className="mobile-drawer"
        styles={{ 
          body: { padding: 0 },
          header: { padding: '16px 16px 0 16px' }
        }}
      >
        {selectedCustomer && (
          <div className="mobile-container">
            <div className="mobile-spacing-lg">
              {/* 客户基本信息 */}
              <Card className="mobile-card mobile-card-elevated mb-4">
                <div className="mobile-flex-center mobile-spacing-md">
                  <Avatar 
                    size={80} 
                    icon={<UserOutlined />}
                    className="bg-primary-100 text-primary-600"
                  />
                  <div className="text-center">
                    <Title level={3} className="mobile-title-h3 mb-1">
                      {selectedCustomer.firstName}{selectedCustomer.lastName}
                    </Title>
                    {selectedCustomer.title && (
                      <Text className="mobile-text-base text-gray-600 mb-1 block">
                        {selectedCustomer.title}
                      </Text>
                    )}
                    {selectedCustomer.company && (
                      <Text className="mobile-text-sm text-gray-500 block">
                        {selectedCustomer.company}
                      </Text>
                    )}
                  </div>
                </div>
              </Card>

              {/* 联系方式 */}
              <Card className="mobile-card mobile-card-elevated mb-4">
                <Title level={4} className="mobile-title-h4 mb-4">联系方式</Title>
                <div className="mobile-flex-col">
                  {selectedCustomer.email && (
                    <div className="mobile-flex-start mobile-touch-target py-3 border-b border-gray-100">
                      <MailOutlined className="text-blue-500 mr-3 text-lg" />
                      <div className="flex-1">
                        <Text className="mobile-text-sm text-gray-500 block">邮箱</Text>
                        <Text className="mobile-text-base font-medium break-all">
                          {selectedCustomer.email}
                        </Text>
                      </div>
                    </div>
                  )}

                  {selectedCustomer.phone && (
                    <div className="mobile-flex-start mobile-touch-target py-3">
                      <PhoneOutlined className="text-green-500 mr-3 text-lg" />
                      <div className="flex-1">
                        <Text className="mobile-text-sm text-gray-500 block">电话</Text>
                        <Text className="mobile-text-base font-medium">
                          {selectedCustomer.phone}
                        </Text>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* 数字名片 */}
              <Card className="mobile-card mobile-card-elevated mb-4">
                <Title level={4} className="mobile-title-h4 mb-4">数字名片</Title>
                {selectedCustomer.digitalCard?.isActive ? (
                  <div className="text-center">
                    <div className="mobile-spacing-md">
                      <Tag color="green" className="mobile-status-success mb-3">
                        已生成数字名片
                      </Tag>
                      <div className="mobile-flex-col">
                        <Button 
                          type="primary" 
                          icon={<EyeOutlined />}
                          className="mobile-btn mobile-btn-full mobile-btn-primary mb-2"
                          onClick={() => window.open(selectedCustomer.digitalCard?.cardUrl, '_blank')}
                        >
                          预览名片
                        </Button>
                        <Button 
                          icon={<QrcodeOutlined />}
                          className="mobile-btn mobile-btn-full mobile-btn-outline"
                          onClick={() => window.open(`/card/${selectedCustomer.id}`, '_blank')}
                        >
                          查看二维码
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <QrcodeOutlined className="text-4xl text-gray-300 mb-3" />
                    <Text className="mobile-text-base text-gray-500 block mb-4">
                      尚未生成数字名片
                    </Text>
                    <Button 
                      type="primary" 
                      icon={<QrcodeOutlined />}
                      className="mobile-btn mobile-btn-full mobile-btn-primary"
                      onClick={() => handleGenerateDigitalCard(selectedCustomer.id)}
                      loading={isGeneratingCard}
                    >
                      生成数字名片
                    </Button>
                  </div>
                )}
              </Card>

              {/* 操作按钮 */}
              <div className="mobile-flex-col">
                <Button 
                  icon={<EditOutlined />}
                  className="mobile-btn mobile-btn-full mobile-btn-secondary mb-3"
                  onClick={() => messageApi.info('编辑功能开发中')}
                >
                  编辑客户信息
                </Button>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default MobileCustomerPage;
