import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Button,
  Card,
  Typography,
  Space,
  message,
  Alert,
  Row,
  Col,
  Tag,
} from 'antd';
import {
  QrcodeOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Event as EventType } from '@/types';
import { useEventStore } from '@/stores/eventStore';

const { Title, Text } = Typography;

interface QRCodeScannerProps {
  visible: boolean;
  onCancel: () => void;
  event?: EventType | null;
  onScanSuccess?: (result: any) => void;
}

interface ScanResult {
  success: boolean;
  data: any;
  message: string;
  timestamp: Date;
}

const QRCodeScanner: React.FC<QRCodeScannerProps> = ({
  visible,
  onCancel,
  event,
  onScanSuccess,
}) => {
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scannerRef = useRef<HTMLDivElement>(null);
  
  const { checkIn, checkOut, registrations } = useEventStore();

  useEffect(() => {
    if (visible) {
      initializeScanner();
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [visible]);

  const initializeScanner = () => {
    if (!scannerRef.current) return;

    try {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        'qr-scanner',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
          useBarCodeDetectorIfSupported: true,
        },
        false
      );

      html5QrcodeScanner.render(
        onScanSuccessHandler,
        onScanFailureHandler
      );

      setScanner(html5QrcodeScanner);
      setIsScanning(true);
      setError(null);
    } catch (err) {
      console.error('Scanner initialization error:', err);
      setError('无法初始化摄像头扫描器');
    }
  };

  const stopScanner = () => {
    if (scanner) {
      try {
        scanner.clear();
        setScanner(null);
        setIsScanning(false);
      } catch (err) {
        console.error('Scanner cleanup error:', err);
      }
    }
  };

  const onScanSuccessHandler = async (decodedText: string) => {
    try {
      console.log('QR Code scanned:', decodedText);
      
      // Parse QR code data
      let qrData;
      try {
        qrData = JSON.parse(decodedText);
      } catch {
        // If not JSON, treat as simple text
        qrData = { type: 'text', content: decodedText };
      }

      const result = await processScanResult(qrData);
      setScanResult(result);

      if (result.success) {
        message.success(result.message);
        onScanSuccess?.(result.data);
        
        // Stop scanning after successful scan
        setTimeout(() => {
          stopScanner();
        }, 2000);
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error('Scan processing error:', error);
      setScanResult({
        success: false,
        data: null,
        message: '处理扫描结果时出错',
        timestamp: new Date(),
      });
      message.error('处理扫描结果时出错');
    }
  };

  const onScanFailureHandler = (error: string) => {
    // Ignore common non-error messages
    if (!error.includes('No QR code found') && !error.includes('NotFoundException')) {
      console.log('Scan failure:', error);
    }
  };

  const processScanResult = async (qrData: any): Promise<ScanResult> => {
    try {
      switch (qrData.type) {
        case 'event_checkin':
          return await handleEventCheckIn(qrData);
        case 'event_info':
          return await handleEventInfo(qrData);
        case 'customer_card':
          return await handleCustomerCard(qrData);
        default:
          return {
            success: false,
            data: qrData,
            message: '未知的二维码类型',
            timestamp: new Date(),
          };
      }
    } catch (error) {
      return {
        success: false,
        data: qrData,
        message: error instanceof Error ? error.message : '处理失败',
        timestamp: new Date(),
      };
    }
  };

  const handleEventCheckIn = async (qrData: any): Promise<ScanResult> => {
    if (!event || qrData.eventId !== event.id) {
      return {
        success: false,
        data: qrData,
        message: '二维码与当前活动不匹配',
        timestamp: new Date(),
      };
    }

    // Find registration for this event
    const registration = registrations.find(
      reg => reg.eventId === event.id && reg.status === 'registered'
    );

    if (!registration) {
      return {
        success: false,
        data: qrData,
        message: '未找到有效的报名记录',
        timestamp: new Date(),
      };
    }

    try {
      if (registration.status === 'registered') {
        await checkIn(registration.id);
        return {
          success: true,
          data: { registration, action: 'checkin' },
          message: '签到成功！',
          timestamp: new Date(),
        };
      } else if (registration.status === 'checked-in') {
        await checkOut(registration.id);
        return {
          success: true,
          data: { registration, action: 'checkout' },
          message: '签退成功！',
          timestamp: new Date(),
        };
      } else {
        return {
          success: false,
          data: qrData,
          message: '当前状态不支持签到操作',
          timestamp: new Date(),
        };
      }
    } catch (error) {
      return {
        success: false,
        data: qrData,
        message: error instanceof Error ? error.message : '签到操作失败',
        timestamp: new Date(),
      };
    }
  };

  const handleEventInfo = async (qrData: any): Promise<ScanResult> => {
    return {
      success: true,
      data: qrData,
      message: `活动信息：${qrData.eventTitle}`,
      timestamp: new Date(),
    };
  };

  const handleCustomerCard = async (qrData: any): Promise<ScanResult> => {
    return {
      success: true,
      data: qrData,
      message: `客户名片：${qrData.customerName || '未知客户'}`,
      timestamp: new Date(),
    };
  };

  const handleRestartScan = () => {
    setScanResult(null);
    setError(null);
    stopScanner();
    setTimeout(() => {
      initializeScanner();
    }, 100);
  };

  const handleClose = () => {
    stopScanner();
    setScanResult(null);
    setError(null);
    onCancel();
  };

  return (
    <Modal
      title={
        <Space>
          <QrcodeOutlined />
          二维码扫描
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      width={600}
      footer={null}
      destroyOnHidden
    >
      <div className="qr-scanner">
        {/* Event Info */}
        {event && (
          <Card size="small" className="mb-4">
            <Title level={5}>当前活动</Title>
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
          </Card>
        )}

        {/* Scanner */}
        <Card size="small" className="mb-4">
          <div className="text-center">
            <Title level={5}>摄像头扫描</Title>
            <div 
              id="qr-scanner"
              ref={scannerRef}
              style={{ minHeight: '300px' }}
            />
            {!isScanning && !error && (
              <div className="py-8">
                <QrcodeOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
                <div className="text-gray-500 mt-2">准备扫描...</div>
              </div>
            )}
          </div>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert
            message="扫描器错误"
            description={error}
            type="error"
            icon={<ExclamationCircleOutlined />}
            className="mb-4"
            action={
              <Button size="small" onClick={handleRestartScan}>
                重试
              </Button>
            }
          />
        )}

        {/* Scan Result */}
        {scanResult && (
          <Card size="small" className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <Title level={5} className="mb-0">扫描结果</Title>
              <Tag color={scanResult.success ? 'success' : 'error'}>
                {scanResult.success ? '成功' : '失败'}
              </Tag>
            </div>
            
            <Alert
              message={scanResult.message}
              type={scanResult.success ? 'success' : 'error'}
              icon={scanResult.success ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
              className="mb-3"
            />

            {scanResult.data && (
              <div>
                <Text strong>扫描数据：</Text>
                <pre className="bg-gray-50 p-2 rounded text-xs mt-1 overflow-auto">
                  {JSON.stringify(scanResult.data, null, 2)}
                </pre>
              </div>
            )}

            <div className="text-xs text-gray-500 mt-2">
              扫描时间: {scanResult.timestamp.toLocaleString('zh-CN')}
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex justify-center space-x-2">
          <Button
            icon={<ReloadOutlined />}
            onClick={handleRestartScan}
            disabled={isScanning}
          >
            重新扫描
          </Button>
          <Button
            icon={<CloseOutlined />}
            onClick={handleClose}
          >
            关闭
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default QRCodeScanner;
