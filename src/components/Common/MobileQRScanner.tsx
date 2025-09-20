import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Button,
  Card,
  Typography,
  message,
  Alert,
  Row,
  Col,
  Spin,
} from 'antd';
import {
  CloseOutlined,
  CheckCircleOutlined,
  ReloadOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import useMobile from '@/hooks/useMobile';

const { Title, Text } = Typography;

interface MobileQRScannerProps {
  visible: boolean;
  onCancel: () => void;
  onScanSuccess?: (result: string) => void;
  onScanError?: (error: string) => void;
  title?: string;
  description?: string;
}

interface ScanResult {
  success: boolean;
  data: string;
  message: string;
  timestamp: Date;
}

const MobileQRScanner: React.FC<MobileQRScannerProps> = ({
  visible,
  onCancel,
  onScanSuccess,
  onScanError,
  title = '扫描二维码',
  description = '将二维码对准扫描框',
}) => {
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [flashlightEnabled, setFlashlightEnabled] = useState(false);
  const [supportedCameras, setSupportedCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const scannerRef = useRef<HTMLDivElement>(null);
  const { isMobile } = useMobile();

  // 获取可用摄像头
  useEffect(() => {
    const getCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const cameras = devices.filter(device => device.kind === 'videoinput');
        setSupportedCameras(cameras);
        
        if (cameras.length > 0) {
          // 优先选择后置摄像头
          const backCamera = cameras.find(camera => 
            camera.label.toLowerCase().includes('back') || 
            camera.label.toLowerCase().includes('rear') ||
            camera.label.toLowerCase().includes('environment')
          );
          setSelectedCamera(backCamera?.deviceId || cameras[0].deviceId);
        }
      } catch (err) {
        console.error('Failed to get cameras:', err);
      }
    };

    if (visible) {
      getCameras();
    }
  }, [visible]);

  // 初始化扫描器
  const initScanner = async () => {
    if (!scannerRef.current || !selectedCamera) return;

    try {
      setError(null);
      setIsScanning(true);

      const html5QrcodeScanner = new Html5QrcodeScanner(
        scannerRef.current.id,
        {
          fps: 10,
          qrbox: isMobile ? 200 : 250,
          aspectRatio: 1.0,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
          showTorchButtonIfSupported: true,
          showZoomSliderIfSupported: true,
          defaultZoomValueIfSupported: 2,
          useBarCodeDetectorIfSupported: true,
          experimentalFeatures: {
            useBarCodeDetectorIfSupported: true,
          },
          videoConstraints: {
            facingMode: selectedCamera.includes('back') || selectedCamera.includes('rear') 
              ? { exact: 'environment' } 
              : { exact: 'user' },
          },
        },
        false // verbose
      );

      await html5QrcodeScanner.render(
        (decodedText: string) => {
          handleScanSuccess(decodedText);
        },
        (errorMessage: string) => {
          // 忽略常见的错误消息
          if (!errorMessage.includes('No MultiFormat Readers') && 
              !errorMessage.includes('NotFoundException')) {

          }
        }
      );

      setScanner(html5QrcodeScanner);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to initialize scanner';
      setError(errorMsg);
      setIsScanning(false);
      onScanError?.(errorMsg);
    }
  };

  // 处理扫描成功
  const handleScanSuccess = (decodedText: string) => {
    const result: ScanResult = {
      success: true,
      data: decodedText,
      message: '扫描成功！',
      timestamp: new Date(),
    };

    setScanResult(result);
    setIsScanning(false);
    message.success('扫描成功！');
    onScanSuccess?.(decodedText);

    // 停止扫描器
    if (scanner) {
      scanner.clear().catch(console.error);
    }
  };

  // 清理扫描器
  const cleanupScanner = async () => {
    if (scanner) {
      try {
        await scanner.clear();
        setScanner(null);
      } catch (err) {
        console.error('Failed to cleanup scanner:', err);
      }
    }
    setIsScanning(false);
    setError(null);
    setScanResult(null);
  };

  // 切换摄像头
  const switchCamera = () => {
    if (supportedCameras.length > 1) {
      const currentIndex = supportedCameras.findIndex(cam => cam.deviceId === selectedCamera);
      const nextIndex = (currentIndex + 1) % supportedCameras.length;
      setSelectedCamera(supportedCameras[nextIndex].deviceId);
    }
  };

  // 切换手电筒
  const toggleFlashlight = async () => {
    try {
      // 这个功能需要浏览器支持，目前大多数浏览器还不支持
      setFlashlightEnabled(!flashlightEnabled);
      message.info('手电筒功能需要浏览器支持');
    } catch (err) {
      console.error('Failed to toggle flashlight:', err);
    }
  };

  // 重新扫描
  const rescan = () => {
    setScanResult(null);
    setError(null);
    initScanner();
  };

  // 处理模态框关闭
  const handleCancel = () => {
    cleanupScanner();
    onCancel();
  };

  // 模态框打开时初始化扫描器
  useEffect(() => {
    if (visible && selectedCamera) {
      // 延迟初始化，确保DOM已渲染
      const timer = setTimeout(() => {
        initScanner();
      }, 100);

      return () => clearTimeout(timer);
    } else if (!visible) {
      cleanupScanner();
    }
  }, [visible, selectedCamera]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      cleanupScanner();
    };
  }, []);

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={isMobile ? '100%' : 500}
      style={isMobile ? { margin: 0, top: 0 } : {}}
      className="qr-scanner-modal"
      destroyOnClose
    >
      <div className="qr-scanner-container">
        {/* 头部 */}
        <div className="flex justify-between items-center mb-4">
          <Title level={4} className="mb-0">
            {title}
          </Title>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={handleCancel}
            className="text-gray-500"
          />
        </div>

        {/* 描述 */}
        {description && (
          <Text type="secondary" className="block mb-4">
            {description}
          </Text>
        )}

        {/* 错误提示 */}
        {error && (
          <Alert
            message="扫描错误"
            description={error}
            type="error"
            showIcon
            className="mb-4"
            action={
              <Button size="small" onClick={rescan}>
                重试
              </Button>
            }
          />
        )}

        {/* 扫描结果 */}
        {scanResult && (
          <Card className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircleOutlined className="text-green-500" />
              <Text strong>扫描成功</Text>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <Text code className="break-all">
                {scanResult.data}
              </Text>
            </div>
            <div className="mt-2 text-right">
              <Text type="secondary" className="text-xs">
                {scanResult.timestamp.toLocaleString()}
              </Text>
            </div>
          </Card>
        )}

        {/* 扫描器容器 */}
        <div className="scanner-wrapper mb-4">
          {!scanResult && (
            <div
              ref={scannerRef}
              id="mobile-qr-scanner"
              className="w-full"
              style={{ minHeight: isMobile ? '300px' : '400px' }}
            />
          )}

          {isScanning && !scanner && (
            <div className="flex justify-center items-center" style={{ minHeight: '300px' }}>
              <Spin size="large" />
              <Text className="ml-2">正在初始化扫描器...</Text>
            </div>
          )}
        </div>

        {/* 控制按钮 */}
        <Row gutter={8} className="mb-4">
          <Col span={8}>
            <Button
              block
              icon={<ReloadOutlined />}
              onClick={rescan}
              disabled={isScanning}
            >
              重新扫描
            </Button>
          </Col>
          <Col span={8}>
            <Button
              block
              icon={<CameraOutlined />}
              onClick={switchCamera}
              disabled={supportedCameras.length <= 1}
            >
              切换摄像头
            </Button>
          </Col>
          <Col span={8}>
            <Button
              block
              icon={<CameraOutlined />}
              onClick={toggleFlashlight}
              type={flashlightEnabled ? 'primary' : 'default'}
            >
              手电筒
            </Button>
          </Col>
        </Row>

        {/* 使用提示 */}
        <Alert
          message="使用提示"
          description={
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>确保二维码在扫描框内清晰可见</li>
              <li>保持适当的距离，不要太近或太远</li>
              <li>确保光线充足，避免反光</li>
              <li>可以切换前后摄像头以获得最佳效果</li>
            </ul>
          }
          type="info"
          showIcon
        />
      </div>
    </Modal>
  );
};

export default MobileQRScanner;
