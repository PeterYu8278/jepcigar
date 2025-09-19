import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  Switch,
  Button,
  Row,
  Col,
  Card,
  Typography,
  Space,
  Divider,
  App,
} from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  UserOutlined,
  DollarOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { Event } from '@/types';
import { useEventStore } from '@/stores/eventStore';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface EventFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  event?: Event | null;
  mode: 'create' | 'edit';
}

interface EventFormData {
  title: string;
  description: string;
  eventType: 'tasting' | 'networking' | 'educational' | 'celebration';
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  timezone: string;
  location: string;
  address?: string;
  isVirtual: boolean;
  meetingLink?: string;
  maxAttendees: number;
  price: number;
  memberDiscount: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
}

const EventForm: React.FC<EventFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  event,
  mode,
}) => {
  const [form] = Form.useForm<EventFormData>();
  const [loading, setLoading] = useState(false);
  const [isVirtual, setIsVirtual] = useState(false);
  const { message } = App.useApp();
  
  const { createEvent, updateEvent, error, clearError } = useEventStore();

  // Initialize form values
  useEffect(() => {
    if (visible) {
      if (mode === 'edit' && event) {
        form.setFieldsValue({
          title: event.title,
          description: event.description,
          eventType: event.eventType,
          startDate: event.startDate && dayjs(event.startDate).isValid() ? dayjs(event.startDate) : undefined,
          endDate: event.endDate && dayjs(event.endDate).isValid() ? dayjs(event.endDate) : undefined,
          timezone: event.timezone,
          location: event.location,
          address: event.address,
          isVirtual: event.isVirtual,
          meetingLink: event.meetingLink,
          maxAttendees: event.maxAttendees,
          price: event.price,
          memberDiscount: event.memberDiscount,
          status: event.status,
        });
        setIsVirtual(event.isVirtual);
      } else {
        form.resetFields();
        setIsVirtual(false);
        // Set default values for new event
        form.setFieldsValue({
          eventType: 'tasting',
          timezone: 'Asia/Kuala_Lumpur',
          status: 'draft',
          isVirtual: false,
          price: 0,
          memberDiscount: 0,
          maxAttendees: 20,
        });
      }
    }
  }, [visible, mode, event, form]);

  const handleSubmit = async (values: EventFormData) => {
    setLoading(true);
    clearError();

    try {
      // Validate dates
      const startDate = values.startDate?.toDate();
      const endDate = values.endDate?.toDate();
      
      if (!startDate || isNaN(startDate.getTime())) {
        throw new Error('开始日期无效');
      }
      if (!endDate || isNaN(endDate.getTime())) {
        throw new Error('结束日期无效');
      }

      const eventData = {
        title: values.title,
        description: values.description,
        eventType: values.eventType,
        startDate: startDate,
        endDate: endDate,
        timezone: values.timezone,
        location: values.location,
        address: values.address || '',
        isVirtual: values.isVirtual,
        meetingLink: values.meetingLink || '',
        maxAttendees: values.maxAttendees,
        price: values.price,
        memberDiscount: values.memberDiscount,
        status: values.status,
        isActive: true,
        currentAttendees: 0,
      };

      if (mode === 'create') {
        await createEvent(eventData);
        message.success('活动创建成功！');
      } else if (mode === 'edit' && event) {
        await updateEvent(event.id, eventData);
        message.success('活动更新成功！');
      }

      onSuccess();
      form.resetFields();
    } catch (error) {
      console.error('Event form submission error:', error);
      message.error(error instanceof Error ? error.message : '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    clearError();
    onCancel();
  };

  const eventTypeOptions = [
    { value: 'tasting', label: '品鉴会', icon: '🍷' },
    { value: 'networking', label: '网络聚会', icon: '🤝' },
    { value: 'educational', label: '教育培训', icon: '📚' },
    { value: 'celebration', label: '庆祝活动', icon: '🎉' },
  ];

  const statusOptions = [
    { value: 'draft', label: '草稿', color: 'default' },
    { value: 'published', label: '已发布', color: 'success' },
    { value: 'cancelled', label: '已取消', color: 'error' },
    { value: 'completed', label: '已完成', color: 'processing' },
  ];

  return (
    <Modal
      title={
        <Space>
          <CalendarOutlined />
          {mode === 'create' ? '创建新活动' : '编辑活动'}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={800}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        className="event-form"
      >
        <Row gutter={16}>
          {/* Basic Information */}
          <Col span={24}>
            <Card size="small" className="mb-4">
              <Title level={5}>
                <CalendarOutlined className="mr-2" />
                基本信息
              </Title>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="title"
                    label="活动标题"
                    rules={[{ required: true, message: '请输入活动标题' }]}
                  >
                    <Input placeholder="例如：古巴雪茄品鉴会" />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="eventType"
                    label="活动类型"
                    rules={[{ required: true, message: '请选择活动类型' }]}
                  >
                    <Select placeholder="选择活动类型">
                      {eventTypeOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          <Space>
                            <span>{option.icon}</span>
                            <span>{option.label}</span>
                          </Space>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label="活动描述"
                rules={[{ required: true, message: '请输入活动描述' }]}
              >
                <TextArea
                  rows={4}
                  placeholder="详细描述活动内容、目标参与者、活动亮点等..."
                />
              </Form.Item>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="活动状态"
                    rules={[{ required: true, message: '请选择活动状态' }]}
                  >
                    <Select placeholder="选择活动状态">
                      {statusOptions.map(option => (
                        <Option key={option.value} value={option.value}>
                          <span className={`text-${option.color}`}>
                            {option.label}
                          </span>
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="timezone"
                    label="时区"
                    rules={[{ required: true, message: '请选择时区' }]}
                  >
                    <Select placeholder="选择时区">
                      <Option value="Asia/Kuala_Lumpur">马来西亚时间 (UTC+8)</Option>
                      <Option value="Asia/Singapore">新加坡时间 (UTC+8)</Option>
                      <Option value="Asia/Bangkok">曼谷时间 (UTC+7)</Option>
                      <Option value="Asia/Jakarta">雅加达时间 (UTC+7)</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Date & Time */}
          <Col span={24}>
            <Card size="small" className="mb-4">
              <Title level={5}>
                <CalendarOutlined className="mr-2" />
                时间安排
              </Title>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="startDate"
                    label="开始时间"
                    rules={[{ required: true, message: '请选择开始时间' }]}
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      style={{ width: '100%' }}
                      placeholder="选择开始时间"
                    />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="endDate"
                    label="结束时间"
                    rules={[{ required: true, message: '请选择结束时间' }]}
                  >
                    <DatePicker
                      showTime
                      format="YYYY-MM-DD HH:mm"
                      style={{ width: '100%' }}
                      placeholder="选择结束时间"
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Location */}
          <Col span={24}>
            <Card size="small" className="mb-4">
              <Title level={5}>
                <EnvironmentOutlined className="mr-2" />
                地点信息
              </Title>
              
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="location"
                    label="活动地点"
                    rules={[{ required: true, message: '请输入活动地点' }]}
                  >
                    <Input placeholder="例如：JEP雪茄会所" />
                  </Form.Item>
                </Col>
                
                <Col span={12}>
                  <Form.Item
                    name="address"
                    label="详细地址"
                  >
                    <Input placeholder="例如：上海市黄浦区南京东路123号" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="isVirtual"
                label="虚拟活动"
                valuePropName="checked"
              >
                <Switch
                  checkedChildren="是"
                  unCheckedChildren="否"
                  onChange={setIsVirtual}
                />
              </Form.Item>

              {isVirtual && (
                <Form.Item
                  name="meetingLink"
                  label="会议链接"
                  rules={[{ required: true, message: '请输入会议链接' }]}
                >
                  <Input
                    prefix={<LinkOutlined />}
                    placeholder="https://zoom.us/j/123456789"
                  />
                </Form.Item>
              )}
            </Card>
          </Col>

          {/* Capacity & Pricing */}
          <Col span={24}>
            <Card size="small" className="mb-4">
              <Title level={5}>
                <UserOutlined className="mr-2" />
                容量与定价
              </Title>
              
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="maxAttendees"
                    label="最大参与人数"
                    rules={[{ required: true, message: '请输入最大参与人数' }]}
                  >
                    <InputNumber
                      min={1}
                      max={1000}
                      style={{ width: '100%' }}
                      placeholder="20"
                    />
                  </Form.Item>
                </Col>
                
                <Col span={8}>
                  <Form.Item
                    name="price"
                    label="活动费用 (元)"
                    rules={[{ required: true, message: '请输入活动费用' }]}
                  >
                    <InputNumber
                      min={0}
                      precision={2}
                      style={{ width: '100%' }}
                      placeholder="0.00"
                      prefix={<DollarOutlined />}
                    />
                  </Form.Item>
                </Col>
                
                <Col span={8}>
                  <Form.Item
                    name="memberDiscount"
                    label="会员折扣 (元)"
                  >
                    <InputNumber
                      min={0}
                      precision={2}
                      style={{ width: '100%' }}
                      placeholder="0.00"
                      prefix={<DollarOutlined />}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Card>
          </Col>

          {/* Error Display */}
          {error && (
            <Col span={24}>
              <div className="text-red-500 text-sm mb-4 p-2 bg-red-50 rounded">
                {error}
              </div>
            </Col>
          )}

          {/* Form Actions */}
          <Col span={24}>
            <Divider />
            <div className="flex justify-end space-x-2">
              <Button onClick={handleCancel}>
                取消
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<CalendarOutlined />}
              >
                {mode === 'create' ? '创建活动' : '更新活动'}
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EventForm;
