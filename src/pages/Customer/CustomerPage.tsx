import React, { useEffect, useState } from 'react';
import { 
  Row, 
  Col, 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Typography, 
  Modal, 
  Form, 
  App,
  Tooltip,
  Badge,
  Avatar,
  Tabs,
  QRCode
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  QrcodeOutlined,
  PhoneOutlined,
  MailOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useCustomers, useCustomerActions } from '@/stores/customerStore';
import { Customer } from '@/types';
import { LOYALTY_TIERS } from '@/config/constants';

const { Title, Text } = Typography;
const { Option } = Select;
// Using items prop instead of TabPane

const CustomerPage: React.FC = () => {
  const { message } = App.useApp();
  const { 
    customers, 
    selectedCustomer, 
    customerLoyalty, 
    referrals,
    isLoading, 
    error 
  } = useCustomers();
  const { 
    loadCustomers, 
    getCustomerById, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer,
    getCustomerLoyalty,
    generateDigitalCard,
    deactivateDigitalCard,
    clearError 
  } = useCustomerActions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState<string | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    if (error) {
      message.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    loadCustomers(1, { searchTerm: value });
  };

  const handleTierFilter = (value: string | undefined) => {
    setSelectedTier(value);
    loadCustomers(1, { tier: value });
  };

  const handleCreateCustomer = () => {
    setEditingCustomer(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCustomer = (customer: Customer) => {
    setEditingCustomer(customer);
    form.setFieldsValue({
      ...customer,
      createdAt: undefined,
      updatedAt: undefined,
    });
    setIsModalVisible(true);
  };

  const handleViewCustomer = async (customer: Customer) => {
    await getCustomerById(customer.id);
    await getCustomerLoyalty(customer.id);
    setActiveTab('detail');
  };

  const handleDeleteCustomer = (customer: Customer) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除客户 "${customer.firstName} ${customer.lastName}" 吗？此操作不可撤销。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteCustomer(customer.id);
          message.success('删除成功');
          loadCustomers();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleGenerateDigitalCard = async (customerId: string) => {
    try {
      setIsGeneratingCard(true);
      const cardUrl = await generateDigitalCard(customerId);
      message.success('数字名片生成成功');
      return cardUrl;
    } catch (error) {
      message.error('生成数字名片失败');
    } finally {
      setIsGeneratingCard(false);
    }
  };

  const handleDeactivateDigitalCard = async (customerId: string) => {
    try {
      await deactivateDigitalCard(customerId);
      message.success('数字名片已停用');
    } catch (error) {
      message.error('停用数字名片失败');
      console.error('Error deactivating digital card:', error);
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, values);
        message.success('更新成功');
      } else {
        await createCustomer({
          ...values,
          isActive: true,
          relationshipNotes: '',
          tags: [],
        });
        message.success('创建成功');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      loadCustomers();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const getTierInfo = (tierId: string) => {
    return Object.values(LOYALTY_TIERS).find(tier => tier.id === tierId) || LOYALTY_TIERS.SILVER;
  };

  const columns = [
    {
      title: '客户信息',
      key: 'info',
      width: 250,
      render: (_: any, record: Customer) => (
        <div className="flex items-center space-x-3">
          <Avatar 
            size={48}
            src={record.avatar}
            icon={<UserOutlined />}
            className="bg-primary-500"
          />
          <div>
            <div className="font-medium">{record.firstName} {record.lastName}</div>
            <div className="text-sm text-gray-500">{record.company}</div>
            <div className="text-xs text-gray-400">{record.title}</div>
          </div>
        </div>
      ),
    },
    {
      title: '联系方式',
      key: 'contact',
      width: 200,
      render: (_: any, record: Customer) => (
        <div className="text-sm">
          <div className="flex items-center space-x-1">
            <MailOutlined className="text-gray-400" />
            <span>{record.email}</span>
          </div>
          {record.phone && (
            <div className="flex items-center space-x-1 mt-1">
              <PhoneOutlined className="text-gray-400" />
              <span>{record.phone}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      title: '会员等级',
      key: 'tier',
      width: 120,
      render: (_: any, _record: Customer) => {
        const tierInfo = getTierInfo('gold'); // TODO: Get from loyalty data
        return (
          <div className="flex items-center space-x-2">
            <span className="text-lg">{tierInfo.icon}</span>
            <Tag color={tierInfo.color}>{tierInfo.name}</Tag>
          </div>
        );
      },
    },
    {
      title: '偏好设置',
      key: 'preferences',
      width: 150,
      render: (_: any, record: Customer) => (
        <div className="text-sm">
          <div>口味: {record.tastePreferences?.length || 0}项</div>
          <div>礼品场合: {record.giftOccasions?.length || 0}项</div>
          <div>预算: ¥{record.budgetRange?.min || 0} - ¥{record.budgetRange?.max || 0}</div>
        </div>
      ),
    },
    {
      title: '数字名片',
      key: 'digitalCard',
      width: 100,
      render: (_: any, record: Customer) => (
        <div className="flex items-center space-x-2">
          {record.digitalCard?.isActive ? (
            <Badge status="success" text="已生成" />
          ) : (
            <Button 
              type="link" 
              size="small"
              icon={<QrcodeOutlined />}
              onClick={() => handleGenerateDigitalCard(record.id)}
            >
              生成
            </Button>
          )}
        </div>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      render: (_: any, record: Customer) => (
        <Tag color={record.isActive ? 'green' : 'red'}>
          {record.isActive ? '活跃' : '非活跃'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Customer) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              size="small"
              onClick={() => handleViewCustomer(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditCustomer(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDeleteCustomer(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const CustomerDetail = () => {
    if (!selectedCustomer) return null;

    return (
      <div className="space-y-6">
        {/* Customer Header */}
        <Card>
          <div className="flex items-center space-x-4">
            <Avatar 
              size={80}
              src={selectedCustomer.avatar}
              icon={<UserOutlined />}
              className="bg-primary-500"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Title level={3} className="mb-0">
                  {selectedCustomer.firstName} {selectedCustomer.lastName}
                </Title>
                <Tag color="blue">{selectedCustomer.title}</Tag>
              </div>
              <Text type="secondary">{selectedCustomer.company}</Text>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <MailOutlined />
                  <span>{selectedCustomer.email}</span>
                </div>
                {selectedCustomer.phone && (
                  <div className="flex items-center space-x-1">
                    <PhoneOutlined />
                    <span>{selectedCustomer.phone}</span>
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              {customerLoyalty && (
                <div>
                  <div className="text-lg font-medium">
                    {getTierInfo(customerLoyalty.currentTier).icon} {getTierInfo(customerLoyalty.currentTier).name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {customerLoyalty.availablePoints} 积分
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Customer Details Tabs */}
        <Tabs 
          defaultActiveKey="preferences"
          items={[
            {
              key: 'preferences',
              label: '偏好设置',
              children: (
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="口味偏好" size="small">
                  <div className="space-y-2">
                    {selectedCustomer.tastePreferences?.map((pref, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{pref.category}: {pref.value}</span>
                        <Tag>{pref.importance}</Tag>
                      </div>
                    )) || <Text type="secondary">暂无偏好设置</Text>}
                  </div>
                </Card>
              </Col>
              <Col span={12}>
                <Card title="礼品场合" size="small">
                  <div className="space-y-2">
                    {selectedCustomer.giftOccasions?.map((occasion, index) => (
                      <div key={index} className="flex justify-between">
                        <span>{occasion.occasion}</span>
                        <Tag>{occasion.frequency}</Tag>
                      </div>
                    )) || <Text type="secondary">暂无礼品场合</Text>}
                  </div>
                </Card>
              </Col>
            </Row>
              ),
            },
            {
              key: 'digitalCard',
              label: '数字名片',
              children: (
                <>
                  <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card title="名片预览" size="small">
                  {selectedCustomer.digitalCard ? (
                    <div className="text-center">
                      <QRCode 
                        value={selectedCustomer.digitalCard.cardUrl}
                        size={200}
                      />
                      <div className="mt-4">
                        <Text type="secondary">扫描二维码查看数字名片</Text>
                      </div>
                      <div className="mt-4 space-x-2">
                        <Button 
                          type="primary" 
                          icon={<EyeOutlined />}
                          onClick={() => window.open(selectedCustomer.digitalCard?.cardUrl, '_blank')}
                        >
                          预览名片
                        </Button>
                        <Button 
                          icon={<TeamOutlined />}
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: `${selectedCustomer.firstName}${selectedCustomer.lastName} - 数字名片`,
                                text: `查看 ${selectedCustomer.firstName}${selectedCustomer.lastName} 的数字名片`,
                                url: selectedCustomer.digitalCard?.cardUrl
                              });
                            } else {
                              navigator.clipboard.writeText(selectedCustomer.digitalCard?.cardUrl || '');
                              message.success('名片链接已复制到剪贴板');
                            }
                          }}
                        >
                          分享名片
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <QrcodeOutlined className="text-4xl text-gray-300 mb-4" />
                      <div>
                        <Text type="secondary">尚未生成数字名片</Text>
                      </div>
                      <Button 
                        type="primary" 
                        className="mt-4"
                        onClick={() => handleGenerateDigitalCard(selectedCustomer.id)}
                        loading={isGeneratingCard}
                      >
                        生成数字名片
                      </Button>
                    </div>
                  )}
                </Card>
              </Col>
              <Col span={12}>
                <Card title="名片信息" size="small">
                  <div className="space-y-3">
                    <div>
                      <Text strong>名片链接:</Text>
                      <div className="mt-1">
                        <Text code className="break-all">{selectedCustomer.digitalCard?.cardUrl || '未生成'}</Text>
                      </div>
                    </div>
                    <div>
                      <Text strong>状态:</Text>
                      <div className="mt-1">
                        <Tag color={selectedCustomer.digitalCard?.isActive ? 'green' : 'red'}>
                          {selectedCustomer.digitalCard?.isActive ? '已激活' : '未激活'}
                        </Tag>
                      </div>
                    </div>
                    <div>
                      <Text strong>生成时间:</Text>
                      <div className="mt-1">
                        <Text type="secondary">
                          {selectedCustomer.digitalCard ? 
                            new Date(selectedCustomer.updatedAt).toLocaleString() : 
                            '未生成'
                          }
                        </Text>
                      </div>
                    </div>
                    <div>
                      <Text strong>操作:</Text>
                      <div className="mt-1 space-x-2">
                        {selectedCustomer.digitalCard ? (
                          <>
                            <Button 
                              size="small" 
                              onClick={() => handleGenerateDigitalCard(selectedCustomer.id)}
                              loading={isGeneratingCard}
                            >
                              重新生成
                            </Button>
                            <Button 
                              size="small" 
                              danger
                              onClick={() => handleDeactivateDigitalCard(selectedCustomer.id)}
                            >
                              停用名片
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="small" 
                            type="primary"
                            onClick={() => handleGenerateDigitalCard(selectedCustomer.id)}
                            loading={isGeneratingCard}
                          >
                            生成名片
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            
            {/* 名片使用说明 */}
            <Row className="mt-4">
              <Col span={24}>
                <Card title="使用说明" size="small">
                  <div className="space-y-2">
                    <Text>• 数字名片可以通过二维码快速分享客户信息</Text>
                    <Text>• 扫描二维码即可查看客户的完整联系方式和偏好信息</Text>
                    <Text>• 名片链接可以复制分享给其他商务伙伴</Text>
                    <Text>• 支持在商务活动、会议等场合快速交换联系方式</Text>
                  </div>
                </Card>
              </Col>
            </Row>
                </>
              ),
            },
            {
              key: 'referrals',
              label: '推荐记录',
              children: (
                <Card size="small">
              <Table
                dataSource={referrals}
                rowKey="id"
                columns={[
                  {
                    title: '推荐码',
                    dataIndex: 'referralCode',
                    key: 'referralCode',
                  },
                  {
                    title: '状态',
                    dataIndex: 'status',
                    key: 'status',
                    render: (status: string) => (
                      <Tag color={status === 'converted' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
                        {status === 'converted' ? '已转换' : status === 'pending' ? '待转换' : '已过期'}
                      </Tag>
                    ),
                  },
                  {
                    title: '奖励状态',
                    dataIndex: 'rewardStatus',
                    key: 'rewardStatus',
                    render: (status: string) => (
                      <Tag color={status === 'awarded' ? 'green' : status === 'pending' ? 'orange' : 'default'}>
                        {status === 'awarded' ? '已奖励' : status === 'pending' ? '待奖励' : '未奖励'}
                      </Tag>
                    ),
                  },
                  {
                    title: '积分奖励',
                    dataIndex: 'pointsAwarded',
                    key: 'pointsAwarded',
                    render: (points: number) => points ? `${points} 积分` : '-',
                  },
                ]}
                pagination={false}
                size="small"
              />
                </Card>
              ),
            },
          ]}
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">客户管理</Title>
          <Text type="secondary">管理您的客户信息和关系</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreateCustomer}
        >
          添加客户
        </Button>
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: 'list',
            label: '客户列表',
            children: (
              <>
                {/* Filters */}
                <Card className="mb-4">
            <Row gutter={[16, 16]} align="middle">
              <Col xs={24} sm={8} md={6}>
                <Input
                  placeholder="搜索客户..."
                  prefix={<SearchOutlined />}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  allowClear
                />
              </Col>
              <Col xs={24} sm={8} md={4}>
                <Select
                  placeholder="会员等级"
                  value={selectedTier}
                  onChange={handleTierFilter}
                  allowClear
                  className="w-full"
                >
                  {Object.values(LOYALTY_TIERS).map(tier => (
                    <Option key={tier.id} value={tier.id}>
                      {tier.icon} {tier.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={8} md={4}>
                <Space>
                  <Button icon={<QrcodeOutlined />}>批量生成名片</Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Customer Table */}
          <Card>
            <Table
              columns={columns}
              dataSource={customers}
              rowKey="id"
              loading={isLoading}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              }}
              scroll={{ x: 1200 }}
            />
          </Card>
              </>
            ),
          },
          {
            key: 'detail',
            label: '客户详情',
            children: selectedCustomer ? <CustomerDetail /> : (
              <Card>
                <div className="text-center py-12">
                  <UserOutlined className="text-6xl text-gray-300 mb-4" />
                  <div>
                    <Text type="secondary">请从客户列表中选择一个客户查看详情</Text>
                  </div>
                </div>
              </Card>
            ),
          },
        ]}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={editingCustomer ? '编辑客户' : '添加客户'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="firstName"
                label="名字"
                rules={[{ required: true, message: '请输入名字' }]}
              >
                <Input placeholder="请输入名字" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lastName"
                label="姓氏"
                rules={[{ required: true, message: '请输入姓氏' }]}
              >
                <Input placeholder="请输入姓氏" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input placeholder="请输入邮箱" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="电话"
              >
                <Input placeholder="请输入电话" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="company"
                label="公司"
              >
                <Input placeholder="请输入公司名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="title"
                label="职位"
              >
                <Input placeholder="请输入职位" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="relationshipNotes"
            label="关系备注"
          >
            <Input.TextArea 
              placeholder="请输入关系备注" 
              rows={3}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerPage;
