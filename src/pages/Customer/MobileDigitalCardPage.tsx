import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Card, 
  Button, 
  Space, 
  Typography, 
  Avatar, 
  Divider, 
  Tag, 
  Alert,
  Spin,
  message,
  ShareAltOutlined,
  DownloadOutlined,
  ArrowLeftOutlined,
  QrcodeOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined
} from 'antd';
import { Customer } from '@/types';
import { CustomerService } from '@/services/firebaseService';
import { SYSTEM_SETTINGS } from '@/config/constants';
import useMobile from '@/hooks/useMobile';
import QRCodeDisplay from '@/components/Common/QRCodeDisplay';

const { Title, Text, Paragraph } = Typography;

const MobileDigitalCardPage: React.FC = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const navigate = useNavigate();
  const { isMobile } = useMobile();
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
      
      const customerData = await CustomerService.getById<Customer>(
        CustomerService.COLLECTION, 
        customerId!
      );
      
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
        // 用户取消分享
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
      <div className="mobile-container mobile-flex-center min-h-screen">
        <div className="mobile-loading">
          <Spin size="large" />
          <div className="mobile-loading-text">加载中...</div>
        </div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="mobile-container min-h-screen mobile-flex-center">
        <Card className="mobile-card mobile-card-lg w-full max-w-sm">
          <div className="mobile-empty">
            <QrcodeOutlined className="mobile-empty-icon" />
            <Title level={3} className="mobile-empty-title">无法加载数字名片</Title>
            <Text className="mobile-empty-description">
              {error || '客户信息不存在'}
            </Text>
            <Space direction="vertical" className="w-full">
              <Button 
                type="primary" 
                className="mobile-btn mobile-btn-full"
                onClick={() => navigate('/customers')}
              >
                返回客户列表
              </Button>
              <Button 
                className="mobile-btn mobile-btn-full mobile-btn-secondary"
                onClick={() => window.location.reload()}
              >
                重新加载
              </Button>
            </Space>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mobile-container min-h-screen bg-gray-50">
      {/* 头部导航 */}
      <div className="mobile-safe-top bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="mobile-flex-between px-4 py-3">
          <Button 
            icon={<ArrowLeftOutlined />} 
            type="text"
            className="mobile-touch-target"
            onClick={() => navigate('/customers')}
          />
          <Title level={4} className="mobile-title-h4 mb-0">
            数字名片
          </Title>
          <div className="w-8" /> {/* 占位符保持居中 */}
        </div>
      </div>

      <div className="mobile-spacing-lg pt-4">
        {/* 客户信息卡片 */}
        <Card className="mobile-card mobile-card-elevated mb-4">
          <div className="mobile-flex-center mobile-spacing-md">
            <Avatar 
              size={80} 
              icon={<UserOutlined />}
              className="bg-primary-100 text-primary-600"
            />
            <div className="text-center">
              <Title level={3} className="mobile-title-h3 mb-1">
                {customer.firstName}{customer.lastName}
              </Title>
              {customer.title && (
                <Text className="mobile-text-base text-gray-600 mb-1 block">
                  {customer.title}
                </Text>
              )}
              {customer.company && (
                <Text className="mobile-text-sm text-gray-500 block">
                  {customer.company}
                </Text>
              )}
            </div>
          </div>
        </Card>

        {/* 联系方式 */}
        <Card className="mobile-card mobile-card-elevated mb-4">
          <Title level={4} className="mobile-title-h4 mb-4">联系方式</Title>
          <div className="mobile-flex-col">
            {customer.email && (
              <div className="mobile-flex-start mobile-touch-target py-3 border-b border-gray-100 last:border-b-0">
                <MailOutlined className="text-blue-500 mr-3 text-lg" />
                <div className="flex-1">
                  <Text className="mobile-text-sm text-gray-500 block">邮箱</Text>
                  <Text className="mobile-text-base font-medium break-all">
                    {customer.email}
                  </Text>
                </div>
              </div>
            )}

            {customer.phone && (
              <div className="mobile-flex-start mobile-touch-target py-3 border-b border-gray-100 last:border-b-0">
                <PhoneOutlined className="text-green-500 mr-3 text-lg" />
                <div className="flex-1">
                  <Text className="mobile-text-sm text-gray-500 block">电话</Text>
                  <Text className="mobile-text-base font-medium">
                    {customer.phone}
                  </Text>
                </div>
              </div>
            )}

            {customer.address && (
              <div className="mobile-flex-start mobile-touch-target py-3">
                <EnvironmentOutlined className="text-orange-500 mr-3 text-lg" />
                <div className="flex-1">
                  <Text className="mobile-text-sm text-gray-500 block">地址</Text>
                  <Text className="mobile-text-base font-medium">
                    {customer.address}
                  </Text>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* 雪茄偏好 */}
        {customer.tastePreferences && customer.tastePreferences.length > 0 && (
          <Card className="mobile-card mobile-card-elevated mb-4">
            <Title level={4} className="mobile-title-h4 mb-4">雪茄偏好</Title>
            <div className="mobile-flex-col">
              {customer.tastePreferences.map((pref, index) => (
                <div key={index} className="mobile-flex-between py-2">
                  <Text className="mobile-text-base">
                    {pref.category}: {pref.value}
                  </Text>
                  <Tag 
                    color={
                      pref.importance === 'high' ? 'red' : 
                      pref.importance === 'medium' ? 'orange' : 'green'
                    }
                    className="mobile-status"
                  >
                    {pref.importance === 'high' ? '重要' : 
                     pref.importance === 'medium' ? '一般' : '次要'}
                  </Tag>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 预算范围 */}
        {customer.budgetRange && (
          <Card className="mobile-card mobile-card-elevated mb-4">
            <Title level={4} className="mobile-title-h4 mb-4">预算范围</Title>
            <Text className="mobile-text-lg font-medium text-primary-600">
              ¥{customer.budgetRange.min.toLocaleString()} - ¥{customer.budgetRange.max.toLocaleString()}
            </Text>
          </Card>
        )}

        {/* 标签 */}
        {customer.tags && customer.tags.length > 0 && (
          <Card className="mobile-card mobile-card-elevated mb-4">
            <Title level={4} className="mobile-title-h4 mb-4">标签</Title>
            <div className="flex flex-wrap gap-2">
              {customer.tags.map((tag, index) => (
                <Tag key={index} color="blue" className="mobile-status">
                  {tag}
                </Tag>
              ))}
            </div>
          </Card>
        )}

        {/* 关系备注 */}
        {customer.relationshipNotes && (
          <Card className="mobile-card mobile-card-elevated mb-4">
            <Title level={4} className="mobile-title-h4 mb-4">备注</Title>
            <Paragraph className="mobile-text-base text-gray-700">
              {customer.relationshipNotes}
            </Paragraph>
          </Card>
        )}

        {/* 二维码卡片 */}
        {customer.digitalCard?.qrCode && (
          <Card className="mobile-card mobile-card-elevated mb-4">
            <Title level={4} className="mobile-title-h4 mb-4 text-center">数字名片二维码</Title>
            <QRCodeDisplay
              data={customer.digitalCard.cardUrl}
              title=""
              size={200}
              showActions={false}
              className="mobile-flex-center"
            />
            <Space direction="vertical" className="w-full mt-4">
              <Button 
                type="primary" 
                icon={<ShareAltOutlined />}
                onClick={handleShare}
                className="mobile-btn mobile-btn-full mobile-btn-primary"
              >
                分享名片
              </Button>
              <Button 
                icon={<DownloadOutlined />}
                onClick={handleDownloadQR}
                className="mobile-btn mobile-btn-full mobile-btn-outline"
              >
                下载二维码
              </Button>
            </Space>
          </Card>
        )}

        {/* 公司信息 */}
        <Card className="mobile-card mobile-card-elevated mb-4">
          <div className="text-center">
            <Title level={4} className="mobile-title-h4 mb-2">
              {SYSTEM_SETTINGS.COMPANY_NAME}
            </Title>
            <Text className="mobile-text-sm text-gray-600 block mb-2">
              {SYSTEM_SETTINGS.COMPANY_DESCRIPTION}
            </Text>
            <Text className="mobile-text-xs text-gray-500">
              专业的雪茄商业管理解决方案
            </Text>
          </div>
        </Card>

        {/* 底部安全区域 */}
        <div className="mobile-safe-bottom h-4" />
      </div>
    </div>
  );
};

export default MobileDigitalCardPage;
