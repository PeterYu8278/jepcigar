import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Typography, Statistic, Spin, Alert, Space, Button } from 'antd';
import {
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  ReloadOutlined,
  EyeOutlined
} from '@ant-design/icons';
import {
  MobileContainer,
  MobileSpacing,
  MobileCard,
  MobileTitle,
  MobileText,
  MobileButton,
  MobileGrid,
  MobileLoading
} from '@/components/Common/MobileComponents';
import TrendIcon from '@/components/Common/TrendIcon';
import useMobile from '@/hooks/useMobile';
import { useCustomers } from '@/stores/customerStore';

const { Title, Text } = Typography;

interface DashboardStats {
  totalCustomers: number;
  monthlySales: number;
  monthlyRevenue: number;
  activeEvents: number;
  loading: boolean;
  error: string | null;
}

const MobileDashboardPage: React.FC = () => {
  const { isMobile } = useMobile();
  const { customers, isLoading: customersLoading } = useCustomers();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    monthlySales: 0,
    monthlyRevenue: 0,
    activeEvents: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    loadDashboardStats();
  }, [customers]);

  const loadDashboardStats = async () => {
    try {
      setStats(prev => ({ ...prev, loading: true, error: null }));

      // 模拟数据加载延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 计算统计数据
      const totalCustomers = customers.length;
      const monthlySales = Math.floor(Math.random() * 50) + 20; // 模拟本月销售
      const monthlyRevenue = monthlySales * (Math.random() * 1000 + 500); // 模拟本月收入
      const activeEvents = Math.floor(Math.random() * 10) + 3; // 模拟活跃活动

      setStats({
        totalCustomers,
        monthlySales,
        monthlyRevenue,
        activeEvents,
        loading: false,
        error: null
      });
    } catch (error) {
      setStats(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : '加载数据失败'
      }));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('zh-CN', {
      style: 'currency',
      currency: 'CNY',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) {
      return <TrendIcon direction="up" />;
    }
    return <TrendIcon direction="down" />;
  };

  const getTrendColor = (value: number, threshold: number = 0) => {
    return value > threshold ? '#52c41a' : '#ff4d4f';
  };

  if (stats.loading) {
    return (
      <MobileContainer>
        <MobileLoading size="large" text="加载仪表盘数据..." />
      </MobileContainer>
    );
  }

  if (stats.error) {
    return (
      <MobileContainer>
        <Alert
          message="加载失败"
          description={stats.error}
          type="error"
          showIcon
          action={
            <MobileButton
              size="small"
              variant="primary"
              icon={<ReloadOutlined />}
              onClick={loadDashboardStats}
            >
              重新加载
            </MobileButton>
          }
        />
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <MobileSpacing size="lg">
        {/* 页面标题 */}
        <div className="mobile-flex-between items-center mb-4">
          <MobileTitle level={2}>仪表盘</MobileTitle>
          <MobileButton
            variant="ghost"
            icon={<ReloadOutlined />}
            onClick={loadDashboardStats}
            className="mobile-touch-target"
          />
        </div>

        {/* 关键指标网格 - 4x1布局 */}
        <MobileGrid columns={2} gap="md" className="mb-6">
          {/* 总客户数 */}
          <MobileCard
            size="small"
            elevated
            className="text-center"
            onClick={() => console.log('查看客户详情')}
          >
            <div className="mobile-flex-center mobile-spacing-sm">
              <div className="bg-blue-100 rounded-full p-3 mb-2">
                <UserOutlined className="text-2xl text-blue-600" />
              </div>
              <div>
                <MobileText size="xs" color="secondary" className="block mb-1">
                  总客户数
                </MobileText>
                <MobileText size="lg" weight="bold" className="block mb-1">
                  {stats.totalCustomers}
                </MobileText>
                <div className="mobile-flex-center">
                  {getTrendIcon(stats.totalCustomers, 0)}
                  <MobileText size="xs" color="success" className="ml-1">
                    +{Math.floor(Math.random() * 5) + 1}%
                  </MobileText>
                </div>
              </div>
            </div>
          </MobileCard>

          {/* 本月销售 */}
          <MobileCard
            size="small"
            elevated
            className="text-center"
            onClick={() => console.log('查看销售详情')}
          >
            <div className="mobile-flex-center mobile-spacing-sm">
              <div className="bg-green-100 rounded-full p-3 mb-2">
                <ShoppingCartOutlined className="text-2xl text-green-600" />
              </div>
              <div>
                <MobileText size="xs" color="secondary" className="block mb-1">
                  本月销售
                </MobileText>
                <MobileText size="lg" weight="bold" className="block mb-1">
                  {stats.monthlySales}
                </MobileText>
                <div className="mobile-flex-center">
                  {getTrendIcon(stats.monthlySales, 30)}
                  <MobileText size="xs" color="success" className="ml-1">
                    +{Math.floor(Math.random() * 15) + 5}%
                  </MobileText>
                </div>
              </div>
            </div>
          </MobileCard>

          {/* 本月收入 */}
          <MobileCard
            size="small"
            elevated
            className="text-center"
            onClick={() => console.log('查看收入详情')}
          >
            <div className="mobile-flex-center mobile-spacing-sm">
              <div className="bg-yellow-100 rounded-full p-3 mb-2">
                <DollarOutlined className="text-2xl text-yellow-600" />
              </div>
              <div>
                <MobileText size="xs" color="secondary" className="block mb-1">
                  本月收入
                </MobileText>
                <MobileText size="lg" weight="bold" className="block mb-1">
                  {formatCurrency(stats.monthlyRevenue).replace('¥', '¥')}
                </MobileText>
                <div className="mobile-flex-center">
                  {getTrendIcon(stats.monthlyRevenue, 50000)}
                  <MobileText size="xs" color="success" className="ml-1">
                    +{Math.floor(Math.random() * 20) + 8}%
                  </MobileText>
                </div>
              </div>
            </div>
          </MobileCard>

          {/* 活跃活动 */}
          <MobileCard
            size="small"
            elevated
            className="text-center"
            onClick={() => console.log('查看活动详情')}
          >
            <div className="mobile-flex-center mobile-spacing-sm">
              <div className="bg-purple-100 rounded-full p-3 mb-2">
                <CalendarOutlined className="text-2xl text-purple-600" />
              </div>
              <div>
                <MobileText size="xs" color="secondary" className="block mb-1">
                  活跃活动
                </MobileText>
                <MobileText size="lg" weight="bold" className="block mb-1">
                  {stats.activeEvents}
                </MobileText>
                <div className="mobile-flex-center">
                  {getTrendIcon(stats.activeEvents, 5)}
                  <MobileText size="xs" color="success" className="ml-1">
                    +{Math.floor(Math.random() * 3) + 1}%
                  </MobileText>
                </div>
              </div>
            </div>
          </MobileCard>
        </MobileGrid>

        {/* 快速操作 */}
        <MobileCard title="快速操作" elevated>
          <MobileSpacing size="md">
            <MobileGrid columns={2} gap="sm">
              <MobileButton
                variant="primary"
                icon={<UserOutlined />}
                fullWidth
                onClick={() => console.log('添加客户')}
              >
                添加客户
              </MobileButton>
              <MobileButton
                variant="secondary"
                icon={<ShoppingCartOutlined />}
                fullWidth
                onClick={() => console.log('查看库存')}
              >
                查看库存
              </MobileButton>
              <MobileButton
                variant="outline"
                icon={<CalendarOutlined />}
                fullWidth
                onClick={() => console.log('创建活动')}
              >
                创建活动
              </MobileButton>
              <MobileButton
                variant="ghost"
                icon={<EyeOutlined />}
                fullWidth
                onClick={() => console.log('查看报告')}
              >
                查看报告
              </MobileButton>
            </MobileGrid>
          </MobileSpacing>
        </MobileCard>

        {/* 最近活动 */}
        <MobileCard title="最近活动" elevated>
          <MobileSpacing size="md">
            {[
              { id: 1, action: '新增客户', user: '张三', time: '2分钟前', type: 'customer' },
              { id: 2, action: '完成销售', user: '李四', time: '15分钟前', type: 'sale' },
              { id: 3, action: '创建活动', user: '王五', time: '1小时前', type: 'event' },
              { id: 4, action: '更新库存', user: '赵六', time: '2小时前', type: 'inventory' }
            ].map((activity) => (
              <div key={activity.id} className="mobile-flex-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <MobileText size="sm" weight="medium" className="block">
                    {activity.action}
                  </MobileText>
                  <MobileText size="xs" color="secondary">
                    {activity.user} • {activity.time}
                  </MobileText>
                </div>
                <div className={`w-2 h-2 rounded-full ${
                  activity.type === 'customer' ? 'bg-blue-500' :
                  activity.type === 'sale' ? 'bg-green-500' :
                  activity.type === 'event' ? 'bg-purple-500' :
                  'bg-yellow-500'
                }`} />
              </div>
            ))}
          </MobileSpacing>
        </MobileCard>

        {/* 数据刷新提示 */}
        <MobileCard size="small" className="text-center">
          <MobileText size="xs" color="muted">
            数据每5分钟自动刷新 • 最后更新: {new Date().toLocaleTimeString()}
          </MobileText>
        </MobileCard>

        {/* 底部安全区域 */}
        <div className="mobile-safe-bottom h-4" />
      </MobileSpacing>
    </MobileContainer>
  );
};

export default MobileDashboardPage;
