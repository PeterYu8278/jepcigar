import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Button,
  Input,
  Card,
  Typography,
  Row,
  Col,
  Space,
  message,
  Select,
} from 'antd';
import {
  QrcodeOutlined,
  DownloadOutlined,
  PrinterOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import QRCode from 'qrcode';
import { Event as EventType } from '@/types';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface QRCodeGeneratorProps {
  visible: boolean;
  onCancel: () => void;
  event?: EventType | null;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  visible,
  onCancel,
  event,
}) => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [customData, setCustomData] = useState('');
  const [qrType, setQrType] = useState<'checkin' | 'event' | 'custom'>('checkin');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (visible && event) {
      generateEventQRCode();
    }
  }, [visible, event, qrType]);

  const generateEventQRCode = async () => {
    if (!event) return;

    setLoading(true);
    try {
      let data = '';
      
      switch (qrType) {
        case 'checkin':
          data = JSON.stringify({
            type: 'event_checkin',
            eventId: event.id,
            eventTitle: event.title,
            timestamp: new Date().toISOString(),
            action: 'checkin'
          });
          break;
        case 'event':
          data = JSON.stringify({
            type: 'event_info',
            eventId: event.id,
            eventTitle: event.title,
            eventDate: event.startDate,
            location: event.location,
            url: `${window.location.origin}/events/${event.id}`
          });
          break;
        case 'custom':
          data = customData;
          break;
      }

      setQrCodeData(data);
      
      // Generate QR code
      const canvas = canvasRef.current;
      if (canvas) {
        const qrCodeImageUrl = await QRCode.toDataURL(canvas, data, {
          width: 256,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M'
        });
        setQrCodeUrl(qrCodeImageUrl);
      }
    } catch (error) {
      console.error('QR Code generation error:', error);
      message.error('二维码生成失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrCodeUrl) return;

    const link = document.createElement('a');
    link.download = `qrcode-${event?.title || 'event'}-${Date.now()}.png`;
    link.href = qrCodeUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    message.success('二维码已下载');
  };

  const handlePrint = () => {
    if (!qrCodeUrl) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>活动二维码 - ${event?.title}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
              }
              .qr-container { 
                margin: 20px auto; 
                max-width: 400px;
              }
              .qr-code { 
                max-width: 256px; 
                margin: 20px auto; 
                display: block;
              }
              .event-info { 
                margin: 20px 0; 
                text-align: center;
              }
              .event-title { 
                font-size: 18px; 
                font-weight: bold; 
                margin-bottom: 10px;
              }
              .event-details { 
                font-size: 14px; 
                color: #666; 
                margin: 5px 0;
              }
              @media print {
                body { margin: 0; padding: 10px; }
              }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <div class="event-info">
                <div class="event-title">${event?.title}</div>
                <div class="event-details">时间: ${new Date(event?.startDate || '').toLocaleString('zh-CN')}</div>
                <div class="event-details">地点: ${event?.location}</div>
                <div class="event-details">类型: ${qrType === 'checkin' ? '签到码' : '活动信息码'}</div>
              </div>
              <img src="${qrCodeUrl}" alt="QR Code" class="qr-code" />
              <div class="event-details">扫描二维码进行签到或查看活动信息</div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleCopyData = () => {
    navigator.clipboard.writeText(qrCodeData).then(() => {
      message.success('二维码数据已复制到剪贴板');
    }).catch(() => {
      message.error('复制失败');
    });
  };

  const qrTypeOptions = [
    { value: 'checkin', label: '签到码', description: '用于活动签到和签退' },
    { value: 'event', label: '活动信息码', description: '包含活动详细信息' },
    { value: 'custom', label: '自定义数据', description: '用户自定义二维码内容' },
  ];

  return (
    <Modal
      title={
        <Space>
          <QrcodeOutlined />
          生成二维码
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={600}
      footer={null}
      destroyOnHidden
    >
      <div className="qr-generator">
        {/* Event Info */}
        {event && (
          <Card size="small" className="mb-4">
            <Title level={5}>活动信息</Title>
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>活动名称：</Text>
                <Text>{event.title}</Text>
              </Col>
              <Col span={12}>
                <Text strong>活动时间：</Text>
                <Text>{new Date(event.startDate).toLocaleString('zh-CN')}</Text>
              </Col>
            </Row>
            <Row gutter={16} className="mt-2">
              <Col span={12}>
                <Text strong>活动地点：</Text>
                <Text>{event.location}</Text>
              </Col>
              <Col span={12}>
                <Text strong>参与人数：</Text>
                <Text>{event.currentAttendees}/{event.maxAttendees}</Text>
              </Col>
            </Row>
          </Card>
        )}

        {/* QR Code Type Selection */}
        <Card size="small" className="mb-4">
          <Title level={5}>二维码类型</Title>
          <Select
            value={qrType}
            onChange={setQrType}
            style={{ width: '100%' }}
            placeholder="选择二维码类型"
          >
            {qrTypeOptions.map(option => (
              <Option key={option.value} value={option.value}>
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-gray-500">{option.description}</div>
                </div>
              </Option>
            ))}
          </Select>
        </Card>

        {/* Custom Data Input */}
        {qrType === 'custom' && (
          <Card size="small" className="mb-4">
            <Title level={5}>自定义数据</Title>
            <TextArea
              value={customData}
              onChange={(e) => setCustomData(e.target.value)}
              placeholder="输入自定义二维码内容..."
              rows={4}
            />
            <Button
              type="primary"
              onClick={generateEventQRCode}
              loading={loading}
              className="mt-2"
            >
              生成二维码
            </Button>
          </Card>
        )}

        {/* QR Code Display */}
        <Card size="small" className="mb-4">
          <div className="text-center">
            <Title level={5}>二维码预览</Title>
            {qrCodeUrl ? (
              <div className="space-y-4">
                <canvas
                  ref={canvasRef}
                  style={{ display: 'none' }}
                />
                <img
                  src={qrCodeUrl}
                  alt="QR Code"
                  style={{
                    maxWidth: '256px',
                    border: '1px solid #d9d9d9',
                    borderRadius: '8px',
                  }}
                />
                <div>
                  <Text type="secondary" className="text-sm">
                    扫描此二维码进行{qrType === 'checkin' ? '签到' : '查看活动信息'}
                  </Text>
                </div>
              </div>
            ) : (
              <div className="py-8">
                <QrcodeOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                <div className="text-gray-500 mt-2">暂无二维码</div>
              </div>
            )}
          </div>
        </Card>

        {/* QR Code Data */}
        {qrCodeData && (
          <Card size="small" className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <Title level={5} className="mb-0">二维码数据</Title>
              <Button
                type="text"
                icon={<CopyOutlined />}
                onClick={handleCopyData}
                size="small"
              >
                复制
              </Button>
            </div>
            <TextArea
              value={qrCodeData}
              readOnly
              rows={4}
              style={{ fontSize: '12px', fontFamily: 'monospace' }}
            />
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-center space-x-2">
          <Button
            icon={<DownloadOutlined />}
            onClick={handleDownload}
            disabled={!qrCodeUrl}
          >
            下载
          </Button>
          <Button
            icon={<PrinterOutlined />}
            onClick={handlePrint}
            disabled={!qrCodeUrl}
          >
            打印
          </Button>
          <Button onClick={onCancel}>
            关闭
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QRCodeGenerator;
