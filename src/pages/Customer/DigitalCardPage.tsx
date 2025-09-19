import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Row, Col, Typography, Button, Tag, Avatar, Space, Divider, message } from 'antd';
import { 
  UserOutlined, 
  PhoneOutlined, 
  MailOutlined,
  ShareAltOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
  QrcodeOutlined
} from '@ant-design/icons';
import { Customer } from '@/types';
import { CustomerService } from '@/services/firebaseService';
import { SYSTEM_SETTINGS } from '@/config/constants';

const { Title, Text, Paragraph } = Typography;

const DigitalCardPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (customerId) {
      loadCustomer();
    }
  }, [customerId]);

  const loadCustomer = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('正在加载客户信息，ID:', customerId);
      
      const customerData = await CustomerService.getById<Customer>(
        CustomerService.COLLECTION, 
        customerId!
      );
      
      console.log('客户数据:', customerData);
      
      if (!customerData) {
        setError('客户信息不存在');
        return;
      }

      setCustomer(customerData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载客户信息失败';
      setError(errorMessage);
      console.error('加载客户信息失败:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share && customer?.digitalCard?.cardUrl) {
      try {
        await navigator.share({
          title: `${customer.firstName}${customer.lastName} - 数字名片`,
          text: `查看 ${customer.firstName}${customer.lastName} 的数字名片`,
          url: customer.digitalCard.cardUrl
        });
      } catch (err) {
        console.log('分享取消或失败');
      }
    } else {
      // 降级处理：复制链接到剪贴板
      try {
        await navigator.clipboard.writeText(customer?.digitalCard?.cardUrl || '');
        message.success('名片链接已复制到剪贴板');
      } catch (err) {
        message.error('复制失败，请手动复制链接');
      }
    }
  };

  const handleDownloadQR = () => {
    if (customer?.digitalCard?.qrCode) {
      const link = document.createElement('a');
      link.href = customer.digitalCard.qrCode;
      link.download = `${customer.firstName}${customer.lastName}-名片二维码.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success('二维码已下载');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <Text type="secondary">加载中...</Text>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="text-center max-w-md">
          <div className="py-8">
            <QrcodeOutlined className="text-6xl text-gray-300 mb-4" />
            <Title level={3} type="danger">无法加载数字名片</Title>
            <Text type="secondary" className="block mb-4">
              {error || '客户信息不存在'}
            </Text>
            <div className="text-left bg-gray-100 p-4 rounded mb-4">
              <Text strong className="block mb-2">调试信息:</Text>
              <Text code className="text-sm">
                客户ID: {customerId || '未提供'}
              </Text>
            </div>
            <Space direction="vertical" className="w-full">
              <Button type="primary" onClick={() => navigate('/customers')}>
                返回客户列表
              </Button>
              <Button onClick={() => window.location.reload()}>
                重新加载
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* 头部导航 */}
        <div className="mb-6">
          <Button 
            icon={<ArrowLeftOutlined />} 
            onClick={() => navigate('/customers')}
            className="mb-4"
          >
            返回客户列表
          </Button>
        </div>

        {/* 名片主体 */}
        <Row gutter={[24, 24]}>
          {/* 左侧：客户信息 */}
          <Col xs={24} lg={16}>
            <Card className="shadow-lg">
              <div className="text-center mb-8">
                <Avatar 
                  size={120} 
                  icon={<UserOutlined />}
                  className="mb-4"
                />
                <Title level={2} className="mb-2">
                  {customer.firstName}{customer.lastName}
                </Title>
                {customer.title && (
                  <Text type="secondary" className="text-lg">
                    {customer.title}
                  </Text>
                )}
                {customer.company && (
                  <div className="mt-2">
                    <Text strong>{customer.company}</Text>
                  </div>
                )}
              </div>

              <Divider />

              {/* 联系方式 */}
              <div className="space-y-4">
                <Title level={4}>联系方式</Title>
                
                <Space direction="vertical" size="middle" className="w-full">
                  {customer.email && (
                    <div className="flex items-center">
                      <MailOutlined className="text-blue-600 mr-3" />
                      <div>
                        <Text strong>邮箱</Text>
                        <div>
                          <Text code>{customer.email}</Text>
                        </div>
                      </div>
                    </div>
                  )}

                  {customer.phone && (
                    <div className="flex items-center">
                      <PhoneOutlined className="text-green-600 mr-3" />
                      <div>
                        <Text strong>电话</Text>
                        <div>
                          <Text code>{customer.phone}</Text>
                        </div>
                      </div>
                    </div>
                  )}
                </Space>
              </div>

              {/* 雪茄偏好 */}
              {customer.tastePreferences && customer.tastePreferences.length > 0 && (
                <>
                  <Divider />
                  <div className="space-y-4">
                    <Title level={4}>雪茄偏好</Title>
                    <div className="space-y-3">
                      {customer.tastePreferences.map((pref, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <Text>{pref.category}: {pref.value}</Text>
                          <Tag color={pref.importance === 'high' ? 'red' : pref.importance === 'medium' ? 'orange' : 'green'}>
                            {pref.importance === 'high' ? '重要' : pref.importance === 'medium' ? '一般' : '次要'}
                          </Tag>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* 预算范围 */}
              {customer.budgetRange && (
                <>
                  <Divider />
                  <div className="space-y-4">
                    <Title level={4}>预算范围</Title>
                    <Text>
                      ¥{customer.budgetRange.min.toLocaleString()} - ¥{customer.budgetRange.max.toLocaleString()}
                    </Text>
                  </div>
                </>
              )}

              {/* 标签 */}
              {customer.tags && customer.tags.length > 0 && (
                <>
                  <Divider />
                  <div className="space-y-4">
                    <Title level={4}>标签</Title>
                    <Space wrap>
                      {customer.tags.map((tag, index) => (
                        <Tag key={index} color="blue">{tag}</Tag>
                      ))}
                    </Space>
                  </div>
                </>
              )}

              {/* 关系备注 */}
              {customer.relationshipNotes && (
                <>
                  <Divider />
                  <div className="space-y-4">
                    <Title level={4}>备注</Title>
                    <Paragraph>{customer.relationshipNotes}</Paragraph>
                  </div>
                </>
              )}
            </Card>
          </Col>

          {/* 右侧：二维码和操作 */}
          <Col xs={24} lg={8}>
            <div className="space-y-6">
              {/* 二维码卡片 */}
              <Card title="数字名片二维码" className="text-center">
                {customer.digitalCard?.qrCode ? (
                  <div>
                    <img 
                      src={customer.digitalCard.qrCode} 
                      alt="数字名片二维码"
                      className="w-full max-w-48 mx-auto mb-4"
                    />
                    <Text type="secondary" className="block mb-4">
                      扫描二维码查看完整信息
                    </Text>
                    <Space direction="vertical" className="w-full">
                      <Button 
                        type="primary" 
                        icon={<ShareAltOutlined />}
                        onClick={handleShare}
                        className="w-full"
                      >
                        分享名片
                      </Button>
                      <Button 
                        icon={<DownloadOutlined />}
                        onClick={handleDownloadQR}
                        className="w-full"
                      >
                        下载二维码
                      </Button>
                    </Space>
                  </div>
                ) : (
                  <div className="py-8">
                    <QrcodeOutlined className="text-4xl text-gray-300 mb-4" />
                    <div>
                      <Text type="secondary">尚未生成数字名片</Text>
                    </div>
                  </div>
                )}
              </Card>

              {/* 名片信息 */}
              <Card title="名片信息" size="small">
                <div className="space-y-3">
                  <div>
                    <Text strong>名片链接:</Text>
                    <div className="mt-1">
                      <Text code className="text-xs break-all">
                        {customer.digitalCard?.cardUrl || '未生成'}
                      </Text>
                    </div>
                  </div>
                  <div>
                    <Text strong>状态:</Text>
                    <div className="mt-1">
                      <Tag color={customer.digitalCard?.isActive ? 'green' : 'red'}>
                        {customer.digitalCard?.isActive ? '已激活' : '未激活'}
                      </Tag>
                    </div>
                  </div>
                  <div>
                    <Text strong>最后更新:</Text>
                    <div className="mt-1">
                      <Text type="secondary">
                        {customer.updatedAt ? new Date(customer.updatedAt).toLocaleString() : '未知'}
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>

              {/* 公司信息 */}
              <Card title="关于我们" size="small">
                <div className="text-center">
                  <div className="mb-2">
                    <Text strong>{SYSTEM_SETTINGS.COMPANY_NAME}</Text>
                  </div>
                  <Text type="secondary" className="text-sm">
                    专业的雪茄业务管理系统
                  </Text>
                </div>
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default DigitalCardPage;
