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
  Statistic,
  Progress,
  Tabs,
  List,
  Avatar,
  Badge,
  Switch,
  Input,
} from 'antd';
import {
  QrcodeOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  UserOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  HistoryOutlined,
  WifiOutlined,
  WifiOutlined as WifiOffOutlined,
  UploadOutlined,
  ScanOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Html5QrcodeScanner, Html5QrcodeScanType } from 'html5-qrcode';
import { Event as EventType, EventRegistration, Customer } from '@/types';
import { useEventStore } from '@/stores/eventStore';
import { CustomerService } from '@/services/firebaseService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;

interface EnhancedQRCodeScannerProps {
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
  participant?: Customer;
  registration?: EventRegistration;
  action?: 'checkin' | 'checkout';
}

interface CheckInStats {
  total: number;
  checkedIn: number;
  checkedOut: number;
  noShow: number;
  checkInRate: number;
}

interface OfflineCheckIn {
  id: string;
  customerId: string;
  customerName: string;
  timestamp: Date;
  eventId: string;
  synced: boolean;
}

const EnhancedQRCodeScanner: React.FC<EnhancedQRCodeScannerProps> = ({
  visible,
  onCancel,
  event,
  onScanSuccess,
}) => {
  const [scanner, setScanner] = useState<Html5QrcodeScanner | null>(null);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('scanner');
  const [checkInStats, setCheckInStats] = useState<CheckInStats>({
    total: 0,
    checkedIn: 0,
    checkedOut: 0,
    noShow: 0,
    checkInRate: 0,
  });
  const [recentCheckIns, setRecentCheckIns] = useState<ScanResult[]>([]);
  const [offlineMode, setOfflineMode] = useState(false);
  const [offlineCheckIns, setOfflineCheckIns] = useState<OfflineCheckIn[]>([]);
  const [manualCustomerId, setManualCustomerId] = useState('');
  const scannerRef = useRef<HTMLDivElement>(null);
  
  const {
    registrations,
    checkIn,
    checkOut,
    fetchEventRegistrations,
  } = useEventStore();

  // 计算签到统计
  useEffect(() => {
    if (registrations.length > 0) {
      const total = registrations.length;
      const checkedIn = registrations.filter(r => r.status === 'checked-in').length;
      const checkedOut = registrations.filter(r => r.status === 'checked-out').length;
      const noShow = registrations.filter(r => r.status === 'no-show').length;
      const checkInRate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;

      setCheckInStats({
        total,
        checkedIn,
        checkedOut,
        noShow,
        checkInRate,
      });
    }
  }, [registrations]);

  // 加载离线签到记录
  useEffect(() => {
    if (offlineMode) {
      loadOfflineCheckIns();
    }
  }, [offlineMode, event?.id]);

  useEffect(() => {
    if (visible) {
      initializeScanner();
      if (event?.id) {
        fetchEventRegistrations(event.id);
      }
    } else {
      stopScanner();
    }

    return () => {
      stopScanner();
    };
  }, [visible, event?.id]);

  const initializeScanner = () => {
    if (!scannerRef.current) return;

    try {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        'enhanced-qr-scanner',
        {
          fps: 10,
          qrbox: { width: 280, height: 280 },
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
      // 解析二维码数据
      let qrData;
      try {
        qrData = JSON.parse(decodedText);
      } catch {
        // 如果不是JSON，当作简单文本处理
        qrData = { type: 'text', content: decodedText };
      }

      const result = await processScanResult(qrData);
      setScanResult(result);
      
      // 添加到最近签到记录
      if (result.success) {
        setRecentCheckIns(prev => [result, ...prev.slice(0, 9)]); // 保留最近10条
        message.success(result.message);
        onScanSuccess?.(result.data);
        
        // 成功后停止扫描2秒
        setTimeout(() => {
          if (activeTab === 'scanner') {
            stopScanner();
            setTimeout(() => {
              if (visible) initializeScanner();
            }, 2000);
          }
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
    // 忽略常见的非错误消息
    if (!error.includes('No QR code found') && !error.includes('NotFoundException')) {
      console.log('Scan failure:', error);
    }
  };

  const processScanResult = async (qrData: any): Promise<ScanResult> => {
    try {
      // 处理不同类型的二维码
      if (qrData.type === 'customer_card' && qrData.customerId) {
        return await handleCustomerCheckIn(qrData.customerId);
      } else if (qrData.type === 'event_checkin' && qrData.customerId) {
        return await handleCustomerCheckIn(qrData.customerId);
      } else if (qrData.customerId) {
        // 直接包含客户ID的二维码
        return await handleCustomerCheckIn(qrData.customerId);
      } else if (typeof qrData === 'string' && qrData.startsWith('CUST_')) {
        // 客户ID格式的二维码
        const customerId = qrData.replace('CUST_', '');
        return await handleCustomerCheckIn(customerId);
      } else {
        return {
          success: false,
          data: qrData,
          message: '无法识别的二维码格式',
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

  const handleCustomerCheckIn = async (customerId: string): Promise<ScanResult> => {
    if (!event?.id) {
      return {
        success: false,
        data: { customerId },
        message: '未选择活动',
        timestamp: new Date(),
      };
    }

    try {
      // 查找对应的报名记录
      const registration = registrations.find(
        reg => reg.eventId === event.id && reg.customerId === customerId
      );

      if (!registration) {
        return {
          success: false,
          data: { customerId },
          message: '未找到该客户的报名记录',
          timestamp: new Date(),
        };
      }

      // 获取客户信息
      const customer = await CustomerService.getById('customers', customerId) as Customer;

      // 根据当前状态执行相应操作
      if (registration.status === 'registered') {
        // 签到
        await checkIn(registration.id);
        const result = {
          success: true,
          data: { registration, action: 'checkin' },
          message: `${customer.firstName} ${customer.lastName} 签到成功！`,
          timestamp: new Date(),
          participant: customer,
          registration,
          action: 'checkin' as const,
        };

        // 离线模式下保存到本地
        if (offlineMode) {
          saveOfflineCheckIn(customerId, `${customer.firstName} ${customer.lastName}`);
        }

        return result;
      } else if (registration.status === 'checked-in') {
        // 签退
        await checkOut(registration.id);
        const result = {
          success: true,
          data: { registration, action: 'checkout' },
          message: `${customer.firstName} ${customer.lastName} 签退成功！`,
          timestamp: new Date(),
          participant: customer,
          registration,
          action: 'checkout' as const,
        };

        // 离线模式下保存到本地
        if (offlineMode) {
          saveOfflineCheckIn(customerId, `${customer.firstName} ${customer.lastName}`);
        }

        return result;
      } else {
        return {
          success: false,
          data: { customerId, registration },
          message: '当前状态不支持签到操作',
          timestamp: new Date(),
          participant: customer,
          registration,
        };
      }
    } catch (error) {
      return {
        success: false,
        data: { customerId },
        message: error instanceof Error ? error.message : '签到操作失败',
        timestamp: new Date(),
      };
    }
  };

  // 手动输入客户ID签到
  const handleManualCheckIn = async () => {
    if (!manualCustomerId.trim()) {
      message.error('请输入客户ID');
      return;
    }

    const result = await handleCustomerCheckIn(manualCustomerId.trim());
    setScanResult(result);
    
    if (result.success) {
      setRecentCheckIns(prev => [result, ...prev.slice(0, 9)]);
      message.success(result.message);
      setManualCustomerId('');
    } else {
      message.error(result.message);
    }
  };

  // 离线签到相关功能
  const loadOfflineCheckIns = () => {
    const saved = localStorage.getItem(`offline_checkins_${event?.id}`);
    if (saved) {
      const checkIns = JSON.parse(saved).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
      setOfflineCheckIns(checkIns);
    }
  };

  const saveOfflineCheckIn = (customerId: string, customerName: string) => {
    const checkIn: OfflineCheckIn = {
      id: `${Date.now()}_${customerId}`,
      customerId,
      customerName,
      timestamp: new Date(),
      eventId: event?.id || '',
      synced: false,
    };

    const updated = [...offlineCheckIns, checkIn];
    setOfflineCheckIns(updated);
    localStorage.setItem(`offline_checkins_${event?.id}`, JSON.stringify(updated));
  };

  const syncOfflineCheckIns = async () => {
    const unsynced = offlineCheckIns.filter(ci => !ci.synced);
    
    for (const checkIn of unsynced) {
      try {
        await handleCustomerCheckIn(checkIn.customerId);
        checkIn.synced = true;
      } catch (error) {
        console.error('Sync failed for:', checkIn.customerId, error);
      }
    }

    const updated = offlineCheckIns.map(ci => ({ ...ci, synced: true }));
    setOfflineCheckIns(updated);
    localStorage.setItem(`offline_checkins_${event?.id}`, JSON.stringify(updated));
    
    message.success(`已同步 ${unsynced.length} 条离线签到记录`);
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
    setActiveTab('scanner');
    onCancel();
  };

  // 渲染扫描器标签页
  const renderScannerTab = () => (
    <div className="space-y-4">
      {/* 活动信息 */}
      {event && (
        <Card size="small">
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>活动名称：</Text>
              <Text>{event.title}</Text>
            </Col>
            <Col span={12}>
              <Text strong>活动时间：</Text>
              <Text>{dayjs(event.startDate).format('YYYY-MM-DD HH:mm')}</Text>
            </Col>
          </Row>
        </Card>
      )}

      {/* 离线模式切换 */}
      <Card size="small">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Switch
              checked={offlineMode}
              onChange={setOfflineMode}
              checkedChildren={<WifiOutlined />}
              unCheckedChildren={<WifiOffOutlined />}
            />
            <Text>离线模式</Text>
            {offlineMode && (
              <Tag color="orange">离线</Tag>
            )}
          </div>
          {offlineMode && (
            <Button
              size="small"
              icon={<UploadOutlined />}
              onClick={syncOfflineCheckIns}
              disabled={offlineCheckIns.filter(ci => !ci.synced).length === 0}
            >
              同步离线数据
            </Button>
          )}
        </div>
      </Card>

      {/* 扫描器 */}
      <Card size="small">
        <div className="text-center">
          <Title level={5}>摄像头扫描</Title>
          <div 
            id="enhanced-qr-scanner"
            ref={scannerRef}
            style={{ minHeight: '320px' }}
          />
          {!isScanning && !error && (
            <div className="py-8">
              <QrcodeOutlined style={{ fontSize: '48px', color: '#d9d9d9' }} />
              <div className="text-gray-500 mt-2">准备扫描...</div>
            </div>
          )}
        </div>
      </Card>

      {/* 手动输入 */}
      <Card size="small">
        <Title level={5}>手动签到</Title>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="输入客户ID"
            value={manualCustomerId}
            onChange={(e) => setManualCustomerId(e.target.value)}
            onPressEnter={handleManualCheckIn}
          />
          <Button
            type="primary"
            onClick={handleManualCheckIn}
            disabled={!manualCustomerId.trim()}
          >
            签到
          </Button>
        </Space.Compact>
      </Card>

      {/* 错误显示 */}
      {error && (
        <Alert
          message="扫描器错误"
          description={error}
          type="error"
          icon={<ExclamationCircleOutlined />}
          action={
            <Button size="small" onClick={handleRestartScan}>
              重试
            </Button>
          }
        />
      )}

      {/* 扫描结果 */}
      {scanResult && (
        <Card size="small">
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

          {scanResult.participant && (
            <div className="bg-gray-50 p-3 rounded">
              <div className="flex items-center space-x-3">
                <Avatar icon={<UserOutlined />} />
                <div>
                  <Text strong>{scanResult.participant ? `${scanResult.participant.firstName} ${scanResult.participant.lastName}` : '未知用户'}</Text>
                  <br />
                  <Text type="secondary">{scanResult.participant.phone}</Text>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* 操作按钮 */}
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
  );

  // 渲染统计标签页
  const renderStatsTab = () => (
    <div className="space-y-4">
      {/* 签到统计 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="总报名数"
              value={checkInStats.total}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="已签到"
              value={checkInStats.checkedIn}
              valueStyle={{ color: '#3f8600' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="已签退"
              value={checkInStats.checkedOut}
              valueStyle={{ color: '#1890ff' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="未到场"
              value={checkInStats.noShow}
              valueStyle={{ color: '#cf1322' }}
              prefix={<ExclamationCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* 签到率 */}
      <Card size="small">
        <Title level={5}>签到率</Title>
        <Progress
          percent={checkInStats.checkInRate}
          status={checkInStats.checkInRate >= 80 ? 'success' : checkInStats.checkInRate >= 60 ? 'normal' : 'exception'}
          format={(percent) => `${percent}%`}
        />
      </Card>

      {/* 状态分布 */}
      <Card size="small">
        <Title level={5}>签到状态分布</Title>
        <Row gutter={16}>
          <Col span={8}>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{checkInStats.checkedIn}</div>
              <div className="text-sm text-gray-500">已签到</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{checkInStats.checkedOut}</div>
              <div className="text-sm text-gray-500">已签退</div>
            </div>
          </Col>
          <Col span={8}>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{checkInStats.noShow}</div>
              <div className="text-sm text-gray-500">未到场</div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );

  // 渲染历史标签页
  const renderHistoryTab = () => (
    <div className="space-y-4">
      <Card size="small">
        <Title level={5}>最近签到记录</Title>
        <List
          dataSource={recentCheckIns}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    icon={<UserOutlined />}
                    style={{
                      backgroundColor: item.success ? '#52c41a' : '#ff4d4f',
                    }}
                  />
                }
                title={
                  <div className="flex items-center space-x-2">
                    <Text strong>{item.participant ? `${item.participant.firstName} ${item.participant.lastName}` : '未知用户'}</Text>
                    <Tag color={item.success ? 'success' : 'error'}>
                      {item.action === 'checkin' ? '签到' : item.action === 'checkout' ? '签退' : '操作'}
                    </Tag>
                  </div>
                }
                description={
                  <div>
                    <Text type="secondary">{item.message}</Text>
                    <br />
                    <Text type="secondary" className="text-xs">
                      {dayjs(item.timestamp).fromNow()}
                    </Text>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 离线签到记录 */}
      {offlineMode && offlineCheckIns.length > 0 && (
        <Card size="small">
          <Title level={5}>离线签到记录</Title>
          <List
            dataSource={offlineCheckIns}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <Badge
                      dot={!item.synced}
                      color={item.synced ? 'green' : 'orange'}
                    >
                      <Avatar icon={<UserOutlined />} />
                    </Badge>
                  }
                  title={
                    <div className="flex items-center space-x-2">
                      <Text strong>{item.customerName}</Text>
                      <Tag color={item.synced ? 'green' : 'orange'}>
                        {item.synced ? '已同步' : '未同步'}
                      </Tag>
                    </div>
                  }
                  description={
                    <Text type="secondary" className="text-xs">
                      {dayjs(item.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                    </Text>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      )}
    </div>
  );

  return (
    <Modal
      title={
        <Space>
          <QrcodeOutlined />
          智能签到系统
        </Space>
      }
      open={visible}
      onCancel={handleClose}
      width={800}
      footer={null}
      destroyOnHidden
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'scanner',
            label: (
              <span>
                <ScanOutlined />
                扫描签到
              </span>
            ),
            children: renderScannerTab(),
          },
          {
            key: 'stats',
            label: (
              <span>
                <BarChartOutlined />
                签到统计
              </span>
            ),
            children: renderStatsTab(),
          },
          {
            key: 'history',
            label: (
              <span>
                <HistoryOutlined />
                签到历史
              </span>
            ),
            children: renderHistoryTab(),
          },
        ]}
      />
    </Modal>
  );
};

export default EnhancedQRCodeScanner;
