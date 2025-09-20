import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  Button,
  message,
  Row,
  Col,
  Card,
  Typography,
  Image,
} from 'antd';
import {
  CameraOutlined,
  CloseOutlined,
  RotateLeftOutlined,
} from '@ant-design/icons';
import useMobile from '@/hooks/useMobile';

const { Text } = Typography;

interface MobileCameraProps {
  visible: boolean;
  onCancel: () => void;
  onCapture?: (imageData: string) => void;
  title?: string;
  aspectRatio?: number;
  quality?: number;
}

interface CameraSettings {
  facingMode: 'user' | 'environment';
  width: number;
  height: number;
  quality: number;
}

const MobileCamera: React.FC<MobileCameraProps> = ({
  visible,
  onCancel,
  onCapture,
  title = '拍摄照片',
  aspectRatio = 4 / 3,
  quality = 0.8,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraSettings] = useState<CameraSettings>({
    facingMode: 'environment',
    width: 1280,
    height: 960,
    quality,
  });
  const [flashlightEnabled, setFlashlightEnabled] = useState(false);
  const [supportedCameras, setSupportedCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

  // 启动摄像头
  const startCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          facingMode: cameraSettings.facingMode,
          width: { ideal: cameraSettings.width },
          height: { ideal: cameraSettings.height },
        },
        audio: false,
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Failed to start camera:', err);
      message.error('无法访问摄像头，请检查权限设置');
    }
  };

  // 停止摄像头
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  // 拍照
  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsCapturing(true);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) {
      setIsCapturing(false);
      return;
    }

    // 设置画布尺寸
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // 绘制视频帧到画布
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // 转换为base64
    const imageData = canvas.toDataURL('image/jpeg', cameraSettings.quality);
    setCapturedImage(imageData);
    setIsCapturing(false);

    message.success('照片拍摄成功！');
  };

  // 切换摄像头
  const switchCamera = () => {
    const currentIndex = supportedCameras.findIndex(cam => cam.deviceId === selectedCamera);
    const nextIndex = (currentIndex + 1) % supportedCameras.length;
    setSelectedCamera(supportedCameras[nextIndex].deviceId);
    
    // 重新启动摄像头
    stopCamera();
    setTimeout(startCamera, 100);
  };

  // 切换手电筒
  const toggleFlashlight = async () => {
    try {
      if (stream) {
        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities();
        
        if ((capabilities as any).torch) {
          await track.applyConstraints({
            advanced: [{ torch: !flashlightEnabled } as any]
          });
          setFlashlightEnabled(!flashlightEnabled);
        } else {
          message.info('当前摄像头不支持手电筒功能');
        }
      }
    } catch (err) {
      console.error('Failed to toggle flashlight:', err);
      message.error('手电筒切换失败');
    }
  };

  // 旋转照片
  const rotateImage = () => {
    if (!capturedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const img = document.createElement('img');
    img.onload = () => {
      // 交换宽高
      canvas.width = img.height;
      canvas.height = img.width;

      // 旋转并绘制
      context.translate(canvas.width / 2, canvas.height / 2);
      context.rotate(Math.PI / 2);
      context.drawImage(img, -img.width / 2, -img.height / 2);

      const rotatedImageData = canvas.toDataURL('image/jpeg', cameraSettings.quality);
      setCapturedImage(rotatedImageData);
    };
    img.src = capturedImage;
  };

  // 确认使用照片
  const confirmCapture = () => {
    if (capturedImage) {
      onCapture?.(capturedImage);
      handleCancel();
    }
  };

  // 重新拍摄
  const retake = () => {
    setCapturedImage(null);
  };

  // 处理模态框关闭
  const handleCancel = () => {
    stopCamera();
    setCapturedImage(null);
    onCancel();
  };

  // 模态框打开时启动摄像头
  useEffect(() => {
    if (visible && selectedCamera) {
      startCamera();
    } else if (!visible) {
      stopCamera();
    }
  }, [visible, selectedCamera]);

  // 组件卸载时清理
  useEffect(() => {
    return () => {
      stopCamera();
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
      className="mobile-camera-modal"
      destroyOnClose
    >
      <div className="camera-container">
        {/* 头部 */}
        <div className="flex justify-between items-center mb-4">
          <Text strong className="text-lg">
            {title}
          </Text>
          <Button
            type="text"
            icon={<CloseOutlined />}
            onClick={handleCancel}
            className="text-gray-500"
          />
        </div>

        {/* 相机预览 */}
        <Card className="mb-4">
          <div className="camera-preview" style={{ aspectRatio, position: 'relative' }}>
            {!capturedImage ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-lg"
                style={{ transform: cameraSettings.facingMode === 'user' ? 'scaleX(-1)' : 'none' }}
              />
            ) : (
              <Image
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-cover rounded-lg"
                preview={false}
              />
            )}
            
            {/* 拍摄指示器 */}
            {isCapturing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div className="text-white text-lg">正在拍摄...</div>
              </div>
            )}
          </div>
        </Card>

        {/* 控制按钮 */}
        <Row gutter={8} className="mb-4">
          <Col span={6}>
            <Button
              block
              icon={<CameraOutlined />}
              onClick={capturedImage ? retake : capturePhoto}
              type={capturedImage ? 'default' : 'primary'}
              loading={isCapturing}
            >
              {capturedImage ? '重拍' : '拍照'}
            </Button>
          </Col>
          <Col span={6}>
            <Button
              block
              icon={<CameraOutlined />}
              onClick={switchCamera}
              disabled={supportedCameras.length <= 1}
            >
              切换
            </Button>
          </Col>
          <Col span={6}>
            <Button
              block
              onClick={toggleFlashlight}
              type={flashlightEnabled ? 'primary' : 'default'}
            >
              手电筒
            </Button>
          </Col>
          <Col span={6}>
            <Button
              block
              icon={<RotateLeftOutlined />}
              onClick={rotateImage}
              disabled={!capturedImage}
            >
              旋转
            </Button>
          </Col>
        </Row>

        {/* 确认按钮 */}
        {capturedImage && (
          <div className="flex space-x-2">
            <Button block onClick={retake}>
              重新拍摄
            </Button>
            <Button block type="primary" onClick={confirmCapture}>
              使用此照片
            </Button>
          </div>
        )}

        {/* 使用提示 */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <Text type="secondary" className="text-sm">
            <strong>使用提示：</strong>
            <br />
            • 确保光线充足，避免逆光拍摄
            <br />
            • 保持手机稳定，避免模糊
            <br />
            • 可以切换前后摄像头
            <br />
            • 支持手电筒补光（如果设备支持）
          </Text>
        </div>

        {/* 隐藏的画布用于图像处理 */}
        <canvas
          ref={canvasRef}
          style={{ display: 'none' }}
        />
      </div>
    </Modal>
  );
};

export default MobileCamera;
