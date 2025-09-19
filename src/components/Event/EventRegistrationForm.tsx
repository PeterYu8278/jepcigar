import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Space,
  Alert,
  Tag,
  Avatar,
  App,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  CalendarOutlined,
  DollarOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Event as EventType, Customer } from '@/types';
import { useEventStore } from '@/stores/eventStore';
import { CustomerService } from '@/services/firebaseService';

const { Title, Text } = Typography;
const { Option } = Select;

interface EventRegistrationFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  event: EventType;
  mode: 'register' | 'invite';
}

interface RegistrationFormData {
  customerId?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  title?: string;
  notes?: string;
  paymentMethod: 'cash' | 'card' | 'points' | 'free';
}

const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  event,
  mode,
}) => {
  const [form] = Form.useForm<RegistrationFormData>();
  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);
  const { message } = App.useApp();

  const { registerForEvent, error, clearError } = useEventStore();

  useEffect(() => {
    if (visible) {
      loadCustomers();
      form.resetFields();
      setIsExistingCustomer(false);
      setSelectedCustomer(null);
    }
  }, [visible, form]);

  const loadCustomers = async () => {
    try {
      setCustomerSearchLoading(true);
      const allCustomers = await CustomerService.getAll('customers') as Customer[];
      setCustomers(allCustomers);
    } catch (error) {
      console.error('Failed to load customers:', error);
      message.error('加载客户列表失败');
    } finally {
      setCustomerSearchLoading(false);
    }
  };

  const handleCustomerSelect = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    if (customer) {
      setSelectedCustomer(customer);
      setIsExistingCustomer(true);
      form.setFieldsValue({
        customerId: customerId, // 设置customerId字段
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        phone: customer.phone,
        company: customer.company,
        title: customer.title,
      });
    }
  };

  const handleSubmit = async (values: RegistrationFormData) => {
    setLoading(true);
    clearError();

    try {
      let customerId = values.customerId;

      // If new customer, create customer first
      if (!isExistingCustomer) {
        console.log('Creating new customer with data:', {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          company: values.company,
          title: values.title,
        });
        
        const newCustomer = await CustomerService.create('customers', {
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          company: values.company,
          title: values.title,
          tastePreferences: [],
          budgetRange: { min: 0, max: 10000 },
          giftOccasions: [],
          relationshipNotes: '',
          isActive: true,
          tags: [],
        });
        customerId = newCustomer as string;
        console.log('New customer created with ID:', customerId);
      } else {
        console.log('Using existing customer ID:', customerId);
      }

      if (!customerId) {
        console.error('Customer ID is missing. Values:', values, 'isExistingCustomer:', isExistingCustomer);
        throw new Error('无法获取客户ID');
      }

      // Register for event
      console.log('Registering for event:', event?.id, 'with customer:', customerId);
      await registerForEvent(event?.id || '', customerId);

      message.success(mode === 'register' ? '报名成功！' : '邀请发送成功！');
      onSuccess();
      form.resetFields();
      setIsExistingCustomer(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error('Registration error:', error);
      message.error(error instanceof Error ? error.message : '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    clearError();
    setIsExistingCustomer(false);
    setSelectedCustomer(null);
    onCancel();
  };

  const calculatePrice = () => {
    if (!event) return 0;
    if (selectedCustomer && selectedCustomer.tags?.includes('VIP')) {
      return Math.max(0, event.price - event.memberDiscount);
    }
    return event.price;
  };

  const getEventTypeConfig = (type: string) => {
    const configs = {
      tasting: { label: '品鉴会', color: 'blue', icon: '🍷' },
      networking: { label: '网络聚会', color: 'green', icon: '🤝' },
      educational: { label: '教育培训', color: 'purple', icon: '📚' },
      celebration: { label: '庆祝活动', color: 'orange', icon: '🎉' },
    };
    return configs[type as keyof typeof configs] || { label: type, color: 'default', icon: '📅' };
  };

  const typeConfig = getEventTypeConfig(event?.eventType || '');

  // Early return if event is null
  if (!event) {
    return null;
  }

  return (
    <Modal
      title={
        <Space>
          <CalendarOutlined />
          {mode === 'register' ? '活动报名' : '邀请参与'}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={700}
      destroyOnHidden
    >
      <div className="event-registration-form">
        {/* Event Information */}
        <Card size="small" className="mb-4">
          <Title level={5}>活动信息</Title>
          <Row gutter={16}>
            <Col span={12}>
              <div className="mb-2">
                <Text strong>活动名称：</Text>
                <Text>{event?.title || '活动标题'}</Text>
              </div>
              <div className="mb-2">
                <Text strong>活动类型：</Text>
                <Tag color={typeConfig.color} icon={<span>{typeConfig.icon}</span>}>
                  {typeConfig.label}
                </Tag>
              </div>
            </Col>
            <Col span={12}>
              <div className="mb-2">
                <Text strong>活动时间：</Text>
                <Text>{event?.startDate ? (() => {
                  // Helper function to parse date with timezone support
                  const parseDate = (dateValue: any) => {
                    if (!dateValue) return null;
                    
                    if (dateValue instanceof Date) {
                      return dayjs(dateValue);
                    }
                    
                    if (typeof dateValue === 'string') {
                      // Check if it matches the specific format: "11 September 2025 at 00:00:00 UTC+8"
                      const customFormatMatch = dateValue.match(/^(\d{1,2}) (\w+) (\d{4}) at (\d{2}):(\d{2}):(\d{2}) UTC([+-]\d+)$/);
                      
                      if (customFormatMatch) {
                        const [, day, month, year, hour, minute, second] = customFormatMatch;
                        
                        // Convert month name to number
                        const monthNames: { [key: string]: string } = {
                          'January': '01', 'February': '02', 'March': '03', 'April': '04',
                          'May': '05', 'June': '06', 'July': '07', 'August': '08',
                          'September': '09', 'October': '10', 'November': '11', 'December': '12'
                        };
                        
                        const monthNum = monthNames[month];
                        if (monthNum) {
                          // Create ISO string and parse as UTC
                          const isoString = `${year}-${monthNum}-${day.padStart(2, '0')}T${hour}:${minute}:${second}.000Z`;
                          const parsed = dayjs.utc(isoString);
                          if (parsed.isValid()) return parsed;
                        }
                      }
                      
                      // Try parsing with custom format first
                      let parsed = dayjs(dateValue, 'DD MMMM YYYY [at] HH:mm:ss [UTC]Z', true);
                      if (parsed.isValid()) return parsed;
                      
                      // Try parsing as ISO string
                      parsed = dayjs(dateValue);
                      if (parsed.isValid()) return parsed;
                      
                      // Try parsing with timezone info
                      parsed = dayjs.tz(dateValue);
                      if (parsed.isValid()) return parsed;
                    }
                    
                    return null;
                  };
                  
                  const parsedDate = parseDate(event.startDate);
                  return parsedDate && parsedDate.isValid() 
                    ? parsedDate.format('DD-MMM-YYYY HH:mm') 
                    : '时间待定';
                })() : '时间待定'}</Text>
              </div>
              <div className="mb-2">
                <Text strong>活动地点：</Text>
                <Text>{event?.location || '地点待定'}</Text>
              </div>
            </Col>
          </Row>
          <Row gutter={16} className="mt-2">
            <Col span={12}>
              <div className="flex items-center">
                <DollarOutlined className="mr-1" />
                <Text strong>活动费用：</Text>
                <Text className="ml-1">
                  ¥{calculatePrice()}
                  {event?.memberDiscount && event.memberDiscount > 0 && (
                    <span className="text-green-600 text-sm ml-1">
                      (会员优惠 ¥{event.memberDiscount})
                    </span>
                  )}
                </Text>
              </div>
            </Col>
            <Col span={12}>
              <div className="flex items-center">
                <TeamOutlined className="mr-1" />
                <Text strong>剩余名额：</Text>
                <Text className="ml-1 text-blue-600">
                  {event ? (event.maxAttendees - event.currentAttendees) : 0}/{event?.maxAttendees || 0}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* Capacity Warning */}
        {event && event.currentAttendees >= event.maxAttendees && (
          <Alert
            message="活动已满员"
            description="此活动已达到最大参与人数限制。"
            type="warning"
            className="mb-4"
          />
        )}

        {/* Customer Information Form */}
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="registration-form"
        >
          {/* Customer Selection */}
          <Card size="small" className="mb-4">
            <Title level={5}>客户选择</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="customerId"
                  label="选择现有客户"
                >
                  <Select
                    placeholder="搜索客户..."
                    showSearch
                    allowClear
                    loading={customerSearchLoading}
                    onSelect={handleCustomerSelect}
                    onClear={() => {
                      setIsExistingCustomer(false);
                      setSelectedCustomer(null);
                      form.resetFields();
                    }}
                    filterOption={(input, option) => {
                      const customer = customers.find(c => c.id === option?.value);
                      if (!customer) return false;
                      const searchText = `${customer.firstName} ${customer.lastName} ${customer.email} ${customer.company || ''}`.toLowerCase();
                      return searchText.includes(input.toLowerCase());
                    }}
                  >
                    {customers.map(customer => (
                      <Option key={customer.id} value={customer.id}>
                        <div className="flex items-center space-x-2">
                          <Avatar size="small" src={customer.avatar} icon={<UserOutlined />} />
                          <div>
                            <div className="font-medium">
                              {customer.firstName} {customer.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {customer.email} {customer.company && `• ${customer.company}`}
                            </div>
                          </div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <div className="text-center">
                  <Text type="secondary">或者</Text>
                </div>
              </Col>
            </Row>
          </Card>
          <Card size="small" className="mb-4">
            <Title level={5}>
              {isExistingCustomer ? '客户信息' : '新客户信息'}
            </Title>
            
            {isExistingCustomer && selectedCustomer && (
              <Alert
                message={`已选择客户：${selectedCustomer.firstName} ${selectedCustomer.lastName}`}
                type="info"
                className="mb-4"
                showIcon
              />
            )}

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="firstName"
                  label="名字"
                  rules={[{ required: true, message: '请输入名字' }]}
                >
                  <Input 
                    prefix={<UserOutlined />}
                    placeholder="请输入名字"
                    disabled={isExistingCustomer}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="lastName"
                  label="姓氏"
                  rules={[{ required: true, message: '请输入姓氏' }]}
                >
                  <Input 
                    prefix={<UserOutlined />}
                    placeholder="请输入姓氏"
                    disabled={isExistingCustomer}
                  />
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
                    { type: 'email', message: '请输入有效的邮箱地址' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />}
                    placeholder="请输入邮箱"
                    disabled={isExistingCustomer}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="电话"
                >
                  <Input 
                    prefix={<PhoneOutlined />}
                    placeholder="请输入电话号码"
                    disabled={isExistingCustomer}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="company"
                  label="公司"
                >
                  <Input 
                    placeholder="请输入公司名称"
                    disabled={isExistingCustomer}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="title"
                  label="职位"
                >
                  <Input 
                    placeholder="请输入职位"
                    disabled={isExistingCustomer}
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="notes"
              label="备注"
            >
              <Input.TextArea
                rows={3}
                placeholder="请输入备注信息（可选）"
              />
            </Form.Item>
          </Card>

          {/* Payment Information */}
          <Card size="small" className="mb-4">
            <Title level={5}>支付信息</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="paymentMethod"
                  label="支付方式"
                  rules={[{ required: true, message: '请选择支付方式' }]}
                  initialValue="cash"
                >
                  <Select placeholder="选择支付方式">
                    <Option value="cash">
                      <Space>
                        <DollarOutlined />
                        <span>现金支付</span>
                      </Space>
                    </Option>
                    <Option value="card">
                      <Space>
                        <DollarOutlined />
                        <span>刷卡支付</span>
                      </Space>
                    </Option>
                    <Option value="points">
                      <Space>
                        <DollarOutlined />
                        <span>积分抵扣</span>
                      </Space>
                    </Option>
                    <Option value="free">
                      <Space>
                        <DollarOutlined />
                        <span>免费参与</span>
                      </Space>
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <div className="text-center pt-6">
                  <Text strong className="text-lg">
                    应付金额：¥{calculatePrice()}
                  </Text>
                </div>
              </Col>
            </Row>
          </Card>

          {/* Error Display */}
          {error && (
            <Alert
              message="错误"
              description={error}
              type="error"
              className="mb-4"
            />
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-2">
            <Button onClick={handleCancel}>
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={event ? event.currentAttendees >= event.maxAttendees : false}
              icon={<CalendarOutlined />}
            >
              {mode === 'register' ? '确认报名' : '发送邀请'}
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default EventRegistrationForm;
