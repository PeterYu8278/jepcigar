import React, { useState, useEffect } from 'react';
import {
  Card,
  Row,
  Col,
  Statistic,
  Progress,
  Typography,
  Button,
  Space,
  Tag,
  Table,
  Select,
  Alert,
} from 'antd';
import {
  TeamOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  BarChartOutlined,
  DownloadOutlined,
  ReloadOutlined,
  CalendarOutlined,
  UserOutlined,
  TrophyOutlined,
  FireOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Event as EventType, EventRegistration, Customer } from '@/types';
import { useEventStore } from '@/stores/eventStore';
import { CustomerService } from '@/services/firebaseService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { Option } = Select;

interface CheckInDashboardProps {
  event: EventType | null;
  onRefresh?: () => void;
}

interface CheckInStats {
  total: number;
  registered: number;
  checkedIn: number;
  checkedOut: number;
  noShow: number;
  cancelled: number;
  checkInRate: number;
  checkOutRate: number;
  attendanceRate: number;
}

interface TimeStats {
  hourlyCheckIns: Array<{
    hour: string;
    count: number;
    percentage: number;
  }>;
  peakHour: string;
  averageCheckInTime: string;
}

interface TopParticipants {
  customer: Customer;
  registration: EventRegistration;
  checkInTime?: Date;
  checkOutTime?: Date;
  duration?: number;
}

const CheckInDashboard: React.FC<CheckInDashboardProps> = ({
  event,
}) => {
  // 如果event为null，返回null
  if (!event) {
    return null;
  }

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<CheckInStats>({
    total: 0,
    registered: 0,
    checkedIn: 0,
    checkedOut: 0,
    noShow: 0,
    cancelled: 0,
    checkInRate: 0,
    checkOutRate: 0,
    attendanceRate: 0,
  });
  const [timeStats, setTimeStats] = useState<TimeStats>({
    hourlyCheckIns: [],
    peakHour: '',
    averageCheckInTime: '',
  });
  const [topParticipants, setTopParticipants] = useState<TopParticipants[]>([]);
  const [dateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');
  
  const {
    registrations,
    fetchEventRegistrations,
  } = useEventStore();

  useEffect(() => {
    if (event?.id) {
      loadData();
    }
  }, [event?.id, dateRange, timeFilter]);

  useEffect(() => {
    if (registrations.length > 0) {
      calculateStats();
      calculateTimeStats();
      loadTopParticipants();
    }
  }, [registrations]);

  const loadData = async () => {
    if (!event?.id) return;
    
    setLoading(true);
    try {
      await fetchEventRegistrations(event.id);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = () => {
    const total = registrations.length;
    const registered = registrations.filter(r => r.status === 'registered').length;
    const checkedIn = registrations.filter(r => r.status === 'checked-in').length;
    const checkedOut = registrations.filter(r => r.status === 'checked-out').length;
    const noShow = registrations.filter(r => r.status === 'no-show').length;
    const cancelled = registrations.filter(r => r.status === 'cancelled').length;
    
    const checkInRate = total > 0 ? Math.round((checkedIn / total) * 100) : 0;
    const checkOutRate = checkedIn > 0 ? Math.round((checkedOut / checkedIn) * 100) : 0;
    const attendanceRate = total > 0 ? Math.round(((checkedIn + checkedOut) / total) * 100) : 0;

    setStats({
      total,
      registered,
      checkedIn,
      checkedOut,
      noShow,
      cancelled,
      checkInRate,
      checkOutRate,
      attendanceRate,
    });
  };

  const calculateTimeStats = () => {
    const checkInTimes = registrations
      .filter(r => r.checkInTime)
      .map(r => ({
        hour: dayjs(r.checkInTime).format('HH'),
        timestamp: dayjs(r.checkInTime),
      }));

    // 按小时统计签到数量
    const hourlyMap = new Map<string, number>();
    checkInTimes.forEach(({ hour }) => {
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
    });

    const hourlyCheckIns = Array.from(hourlyMap.entries())
      .map(([hour, count]) => ({
        hour: `${hour}:00`,
        count,
        percentage: Math.round((count / checkInTimes.length) * 100),
      }))
      .sort((a, b) => a.hour.localeCompare(b.hour));

    // 找出高峰时段
    const peakHourData = hourlyCheckIns.reduce((max, current) => 
      current.count > max.count ? current : max, 
      { hour: '', count: 0, percentage: 0 }
    );

    // 计算平均签到时间
    const averageTimestamp = checkInTimes.length > 0 
      ? checkInTimes.reduce((sum, { timestamp }) => sum + timestamp.valueOf(), 0) / checkInTimes.length
      : 0;
    
    const averageCheckInTime = averageTimestamp > 0 
      ? dayjs(averageTimestamp).format('HH:mm')
      : '';

    setTimeStats({
      hourlyCheckIns,
      peakHour: peakHourData.hour,
      averageCheckInTime,
    });
  };

  const loadTopParticipants = async () => {
    const checkedInRegistrations = registrations.filter(r => r.status === 'checked-in' || r.status === 'checked-out');
    
    const topParticipantsPromises = checkedInRegistrations.map(async (registration) => {
      try {
        const customer = await CustomerService.getById('customers', registration.customerId) as Customer;
        const duration = registration.checkOutTime && registration.checkInTime
          ? dayjs(registration.checkOutTime).diff(dayjs(registration.checkInTime), 'minutes')
          : undefined;
        
        return {
          customer,
          registration,
          checkInTime: registration.checkInTime,
          checkOutTime: registration.checkOutTime,
          duration,
        };
      } catch (error) {
        console.error('Load customer error:', error);
        return null;
      }
    });

    const results = await Promise.all(topParticipantsPromises);
    const validResults = results.filter((result): result is NonNullable<typeof result> => result !== null);
    
    // 按签到时间排序，取前10名
    const sorted = validResults
      .sort((a, b) => {
        if (!a.checkInTime || !b.checkInTime) return 0;
        return dayjs(a.checkInTime).valueOf() - dayjs(b.checkInTime).valueOf();
      })
      .slice(0, 10);

    setTopParticipants(sorted);
  };

  const exportStats = () => {
    const csvContent = [
      ['统计项目', '数值', '百分比'].join(','),
      ['总报名数', stats.total, '100%'].join(','),
      ['已报名', stats.registered, `${Math.round((stats.registered / stats.total) * 100)}%`].join(','),
      ['已签到', stats.checkedIn, `${stats.checkInRate}%`].join(','),
      ['已签退', stats.checkedOut, `${stats.checkOutRate}%`].join(','),
      ['未到场', stats.noShow, `${Math.round((stats.noShow / stats.total) * 100)}%`].join(','),
      ['已取消', stats.cancelled, `${Math.round((stats.cancelled / stats.total) * 100)}%`].join(','),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `签到统计_${event.title}_${dayjs().format('YYYY-MM-DD')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const topParticipantsColumns: ColumnsType<TopParticipants> = [
    {
      title: '排名',
      key: 'rank',
      width: 60,
      render: (_, __, index) => (
        <div className="text-center">
          {index < 3 ? (
            <TrophyOutlined style={{ color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : '#cd7f32' }} />
          ) : (
            <span className="font-medium">{index + 1}</span>
          )}
        </div>
      ),
    },
    {
      title: '客户姓名',
      key: 'name',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.customer ? `${record.customer.firstName} ${record.customer.lastName}` : '未知用户'}</div>
          <div className="text-sm text-gray-500">{record.customer.phone}</div>
        </div>
      ),
    },
    {
      title: '签到时间',
      key: 'checkInTime',
      render: (_, record) => record.checkInTime ? dayjs(record.checkInTime).format('HH:mm:ss') : '-',
    },
    {
      title: '签退时间',
      key: 'checkOutTime',
      render: (_, record) => record.checkOutTime ? dayjs(record.checkOutTime).format('HH:mm:ss') : '-',
    },
    {
      title: '停留时长',
      key: 'duration',
      render: (_, record) => {
        if (record.duration) {
          const hours = Math.floor(record.duration / 60);
          const minutes = record.duration % 60;
          return `${hours}小时${minutes}分钟`;
        }
        return '-';
      },
    },
    {
      title: '状态',
      key: 'status',
      render: (_, record) => {
        const statusMap = {
          'checked-in': { color: 'green', text: '已签到' },
          'checked-out': { color: 'blue', text: '已签退' },
        };
        const statusInfo = statusMap[record.registration.status as keyof typeof statusMap];
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
  ];

  return (
    <div className="space-y-4">
      {/* 头部控制 */}
      <Card size="small">
        <Row gutter={16} align="middle">
          <Col span={12}>
            <Title level={4} className="mb-0">
              <BarChartOutlined className="mr-2" />
              签到统计面板
            </Title>
            <Text type="secondary">{event.title}</Text>
          </Col>
          <Col span={12} className="text-right">
            <Space>
              <Select
                value={timeFilter}
                onChange={setTimeFilter}
                style={{ width: 120 }}
              >
                <Option value="all">全部时间</Option>
                <Option value="today">今天</Option>
                <Option value="week">本周</Option>
                <Option value="month">本月</Option>
              </Select>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadData}
                loading={loading}
              >
                刷新
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={exportStats}
              >
                导出统计
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 核心统计指标 */}
      <Row gutter={16}>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="总报名数"
              value={stats.total}
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="已签到"
              value={stats.checkedIn}
              suffix={`/ ${stats.total}`}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
            <Progress
              percent={stats.checkInRate}
              size="small"
              strokeColor="#52c41a"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="已签退"
              value={stats.checkedOut}
              suffix={`/ ${stats.checkedIn}`}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
            <Progress
              percent={stats.checkOutRate}
              size="small"
              strokeColor="#1890ff"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card size="small">
            <Statistic
              title="未到场"
              value={stats.noShow}
              suffix={`/ ${stats.total}`}
              prefix={<ExclamationCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
            <Progress
              percent={Math.round((stats.noShow / stats.total) * 100)}
              size="small"
              strokeColor="#ff4d4f"
            />
          </Card>
        </Col>
      </Row>

      {/* 详细统计 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card size="small" title="状态分布">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>已报名</span>
                <div className="flex items-center space-x-2">
                  <Progress
                    percent={Math.round((stats.registered / stats.total) * 100)}
                    size="small"
                    strokeColor="#1890ff"
                    style={{ width: 100 }}
                  />
                  <span>{stats.registered}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>已签到</span>
                <div className="flex items-center space-x-2">
                  <Progress
                    percent={stats.checkInRate}
                    size="small"
                    strokeColor="#52c41a"
                    style={{ width: 100 }}
                  />
                  <span>{stats.checkedIn}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>已签退</span>
                <div className="flex items-center space-x-2">
                  <Progress
                    percent={stats.checkOutRate}
                    size="small"
                    strokeColor="#1890ff"
                    style={{ width: 100 }}
                  />
                  <span>{stats.checkedOut}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>未到场</span>
                <div className="flex items-center space-x-2">
                  <Progress
                    percent={Math.round((stats.noShow / stats.total) * 100)}
                    size="small"
                    strokeColor="#ff4d4f"
                    style={{ width: 100 }}
                  />
                  <span>{stats.noShow}</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card size="small" title="时间分析">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>高峰时段</span>
                <Tag color="orange">
                  <FireOutlined />
                  {timeStats.peakHour}
                </Tag>
              </div>
              <div className="flex items-center justify-between">
                <span>平均签到时间</span>
                <Tag color="blue">
                  <CalendarOutlined />
                  {timeStats.averageCheckInTime}
                </Tag>
              </div>
              <div className="flex items-center justify-between">
                <span>签到率</span>
                <Tag color="green">
                  <CheckCircleOutlined />
                  {stats.checkInRate}%
                </Tag>
              </div>
              <div className="flex items-center justify-between">
                <span>到场率</span>
                <Tag color="purple">
                  <UserOutlined />
                  {stats.attendanceRate}%
                </Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 小时统计图表 */}
      {timeStats.hourlyCheckIns.length > 0 && (
        <Card size="small" title="小时签到分布">
          <Row gutter={8}>
            {timeStats.hourlyCheckIns.map(({ hour, count, percentage }) => (
              <Col span={3} key={hour}>
                <div className="text-center">
                  <div className="text-sm font-medium">{hour}</div>
                  <Progress
                    type="circle"
                    percent={percentage}
                    size={60}
                    format={() => count}
                    strokeColor="#1890ff"
                  />
                </div>
              </Col>
            ))}
          </Row>
        </Card>
      )}

      {/* 最早签到排行榜 */}
      {topParticipants.length > 0 && (
        <Card size="small" title="最早签到排行榜">
          <Table
            columns={topParticipantsColumns}
            dataSource={topParticipants}
            rowKey={(record) => record.registration.id}
            pagination={false}
            size="small"
          />
        </Card>
      )}

      {/* 数据更新提示 */}
      <Alert
        message="数据实时更新"
        description="统计数据会根据最新的签到记录自动更新，点击刷新按钮可手动更新数据。"
        type="info"
        showIcon
      />
    </div>
  );
};

export default CheckInDashboard;
