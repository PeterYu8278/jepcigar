import React, { useState, useEffect } from 'react';
import { Card, Button, Space, Typography, Alert, Spin, message } from 'antd';
import { DownloadOutlined, ReloadOutlined, QrcodeOutlined, ShareAltOutlined } from '@ant-design/icons';
import { generateQRCodeData } from '@/utils';

const { Text, Title } = Typography;

interface QRCodeDisplayProps {
  /** 二维码数据内容 */
  data: string;
  /** 二维码标题 */
  title?: string;
  /** 二维码尺寸 */
  size?: number;
  /** 是否显示操作按钮 */
  showActions?: boolean;
  /** 是否自动生成二维码 */
  autoGenerate?: boolean;
  /** 自定义样式类名 */
  className?: string;
  /** 错误回调 */
  onError?: (error: Error) => void;
  /** 成功回调 */
  onSuccess?: (qrCodeDataUrl: string) => void;
}

/**
 * 二维码显示组件
 * 支持动态生成、下载、分享等功能
 */
const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  data,
  title = "二维码",
  size = 200,
  showActions = true,
  autoGenerate = true,
  className = "",
  onError,
  onSuccess
}) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 生成二维码
  const generateQRCode = async (qrData: string) => {
    if (!qrData) {
      setError('没有提供二维码数据');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const dataUrl = await generateQRCodeData(qrData);
      setQrCodeDataUrl(dataUrl);
      onSuccess?.(dataUrl);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '生成二维码失败';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsGenerating(false);
    }
  };

  // 下载二维码
  const handleDownload = () => {
    if (!qrCodeDataUrl) {
      message.warning('没有可下载的二维码');
      return;
    }

    try {
      const link = document.createElement('a');
      link.href = qrCodeDataUrl;
      link.download = `${title}-二维码.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      message.success('二维码已下载');
    } catch (err) {
      message.error('下载失败');
    }
  };

  // 分享二维码
  const handleShare = async () => {
    if (!data) {
      message.warning('没有可分享的数据');
      return;
    }

    try {
      if (navigator.share) {
        await navigator.share({
          title: title,
          text: `扫描二维码查看: ${title}`,
          url: data
        });
      } else {
        // 降级处理：复制到剪贴板
        await navigator.clipboard.writeText(data);
        message.success('数据已复制到剪贴板');
      }
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        message.error('分享失败');
      }
    }
  };

  // 重新生成二维码
  const handleRegenerate = () => {
    generateQRCode(data);
  };

  // 自动生成二维码
  useEffect(() => {
    if (autoGenerate && data) {
      generateQRCode(data);
    }
  }, [data, autoGenerate]);

  // 渲染二维码内容
  const renderQRCode = () => {
    if (isGenerating) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <Spin size="large" />
          <Text type="secondary" className="mt-4">正在生成二维码...</Text>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <QrcodeOutlined className="text-4xl text-red-300 mb-4" />
          <Alert
            message="生成二维码失败"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
          <Button 
            type="primary" 
            icon={<ReloadOutlined />}
            onClick={handleRegenerate}
          >
            重新生成
          </Button>
        </div>
      );
    }

    if (!qrCodeDataUrl) {
      return (
        <div className="flex flex-col items-center justify-center py-8">
          <QrcodeOutlined className="text-4xl text-gray-300 mb-4" />
          <Text type="secondary">暂无二维码</Text>
          {data && (
            <Button 
              type="primary" 
              icon={<QrcodeOutlined />}
              onClick={handleRegenerate}
              className="mt-4"
            >
              生成二维码
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        <img 
          src={qrCodeDataUrl} 
          alt={title}
          style={{ 
            width: size, 
            height: size,
            maxWidth: '100%',
            objectFit: 'contain'
          }}
          className="mb-4"
        />
        <Text type="secondary" className="text-center">
          扫描二维码查看内容
        </Text>
      </div>
    );
  };

  // 渲染操作按钮
  const renderActions = () => {
    if (!showActions || !qrCodeDataUrl) {
      return null;
    }

    return (
      <Space direction="vertical" className="w-full mt-4">
        <Button 
          type="primary" 
          icon={<ShareAltOutlined />}
          onClick={handleShare}
          className="w-full"
        >
          分享
        </Button>
        <Button 
          icon={<DownloadOutlined />}
          onClick={handleDownload}
          className="w-full"
        >
          下载二维码
        </Button>
        <Button 
          icon={<ReloadOutlined />}
          onClick={handleRegenerate}
          className="w-full"
        >
          重新生成
        </Button>
      </Space>
    );
  };

  return (
    <Card 
      title={title}
      className={`text-center ${className}`}
      bodyStyle={{ padding: '16px' }}
    >
      {renderQRCode()}
      {renderActions()}
    </Card>
  );
};

export default QRCodeDisplay;
