import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  ShoppingCartOutlined,
  TrophyOutlined,
  GiftOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PlusOutlined,
  EyeOutlined,
  TrendingUpOutlined,
  DollarOutlined,
  TeamOutlined
} from '@ant-design/icons';
import {
  MobileContainer,
  MobileSpacing,
  MobileCard,
  MobileTitle,
  MobileText,
  MobileButton,
  MobileGrid,
  MobileStatus
} from '@/components/Common/MobileComponents';
import useMobile from '@/hooks/useMobile';

interface DashboardStats {
  totalCustomers: number;
  totalSales: number;
  totalRevenue: number;
  activeEvents: number;
  lowStockItems: number;
  pendingOrders: number;
}

interface RecentActivity {
  id: string;
  type: 'sale' | 'customer' | 'event' | 'inventory';
  description: string;
  timestamp: Date;
  amount?: number;
}

interface TopCustomer {
  id: string;
  name: string;
  tier: string;
  totalSpent: number;
  lastPurchase: Date;
}

const MobileDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    totalSales: 0,
    totalRevenue: 0,
    activeEvents: 0,
    lowStockItems: 0,
    pendingOrders: 0,
  });
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // TODO: Load real data from Firebase
      // Mock data for now
      setStats({
        totalCustomers: 1247,
        totalSales: 89,
        totalRevenue: 125680,
        activeEvents: 3,
        lowStockItems: 12,
        pendingOrders: 8,
      });

      setRecentActivities([
        {
          id: '1',
          type: 'sale',
          description: '新客户购买古巴雪茄套装',
          timestamp: new Date(),
          amount: 2580,
        },
        {
          id: '2',
          type: 'customer',
          description: '客户升级为Gold会员',
          timestamp: new Date(Date.now() - 3600000),
        },
        {
          id: '3',
          type: 'event',
          description: '雪茄品鉴会报名人数已达上限',
          timestamp: new Date(Date.now() - 7200000),
        },
        {
          id: '4',
          type: 'inventory',
          description: '多米尼加雪茄库存不足',
          timestamp: new Date(Date.now() - 10800000),
        },
      ]);

      setTopCustomers([
        {
          id: '1',
          name: '张先生',
          tier: 'Royal',
          totalSpent: 45680,
          lastPurchase: new Date(),
        },
        {
          id: '2',
          name: '李女士',
          tier: 'Platinum',
          totalSpent: 32450,
          lastPurchase: new Date(Date.now() - 86400000),
        },
        {
          id: '3',
          name: '王总',
          tier: 'Gold',
          totalSpent: 28900,
          lastPurchase: new Date(Date.now() - 172800000),
        },
      ]);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Royal': return 'volcano';
      case 'Platinum': return 'blue';
      case 'Gold': return 'gold';
      case 'Silver': return 'default';
      default: return 'default';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale': return <ShoppingCartOutlined className="text-green-500" />;
      case 'customer': return <UserOutlined className="text-blue-500" />;
      case 'event': return <CalendarOutlined className="text-purple-500" />;
      case 'inventory': return <BarChartOutlined className="text-orange-500" />;
      default: return <BarChartOutlined />;
    }
  };

  // 统计卡片数据
  const statCards = [
    {
      title: '总客户数',
      value: stats.totalCustomers,
      icon: <UserOutlined className="text-blue-500" />,
      color: '#1890ff',
      trend: '+12%'
    },
    {
      title: '本月销售',
      value: stats.totalSales,
      icon: <ShoppingCartOutlined className="text-green-500" />,
      color: '#52c41a',
      trend: '+8%'
    },
    {
      title: '本月收入',
      value: `¥${stats.totalRevenue.toLocaleString()}`,
      icon: <DollarOutlined className="text-orange-500" />,
      color: '#f16d1f',
      trend: '+15%'
    },
    {
      title: '活跃活动',
      value: stats.activeEvents,
      icon: <CalendarOutlined className="text-purple-500" />,
      color: '#722ed1',
      trend: '+3'
    }
  ];

  return (
    <MobileContainer>
      <MobileSpacing size="lg">
        {/* 页面标题 */}
        <div className="mobile-flex-between mb-4">
          <div>
            <MobileTitle level={2}>仪表板</MobileTitle>
            <MobileText size="sm" color="secondary">
              欢迎回来！以下是您的业务概览
            </MobileText>
          </div>
          <MobileButton
            variant="primary"
            size="small"
            icon={<PlusOutlined />}
            onClick={() => navigate('/customers')}
          >
            添加
          </MobileButton>
        </div>

        {/* 统计卡片 - 呈列显示 */}
        <MobileSpacing size="md">
          <MobileTitle level={4}>业务概览</MobileTitle>
          <div className="space-y-3">
            {statCards.map((card, index) => (
              <MobileCard key={index} elevated onClick={() => {}}>
                <div className="mobile-flex-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">
                      {card.icon}
                    </div>
                    <div>
                      <MobileText size="sm" color="secondary">
                        {card.title}
                      </MobileText>
                      <div className="flex items-center space-x-2">
                        <MobileText size="xl" weight="bold" style={{ color: card.color }}>
                          {card.value}
                        </MobileText>
                        <MobileStatus status="success" size="small">
                          {card.trend}
                        </MobileStatus>
                      </div>
                    </div>
                  </div>
                  <TrendingUpOutlined className="text-gray-300 text-xl" />
                </div>
              </MobileCard>
            ))}
          </div>
        </MobileSpacing>

        {/* 快速操作 */}
        <MobileSpacing size="md">
          <MobileTitle level={4}>快速操作</MobileTitle>
          <MobileGrid columns={2} gap="md">
            <MobileButton
              variant="outline"
              icon={<UserOutlined />}
              className="mobile-btn-full h-16"
              onClick={() => navigate('/customers')}
            >
              <div className="text-center">
                <MobileText size="sm" weight="medium">客户管理</MobileText>
              </div>
            </MobileButton>
            
            <MobileButton
              variant="outline"
              icon={<ShoppingCartOutlined />}
              className="mobile-btn-full h-16"
              onClick={() => navigate('/inventory')}
            >
              <div className="text-center">
                <MobileText size="sm" weight="medium">库存管理</MobileText>
              </div>
            </MobileButton>
            
            <MobileButton
              variant="outline"
              icon={<CalendarOutlined />}
              className="mobile-btn-full h-16"
              onClick={() => navigate('/events')}
            >
              <div className="text-center">
                <MobileText size="sm" weight="medium">活动管理</MobileText>
              </div>
            </MobileButton>
            
            <MobileButton
              variant="outline"
              icon={<BarChartOutlined />}
              className="mobile-btn-full h-16"
              onClick={() => navigate('/analytics')}
            >
              <div className="text-center">
                <MobileText size="sm" weight="medium">数据分析</MobileText>
              </div>
            </MobileButton>
          </MobileGrid>
        </MobileSpacing>

        {/* 最近活动 */}
        <MobileSpacing size="md">
          <MobileTitle level={4}>最近活动</MobileTitle>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <MobileCard key={activity.id} size="small">
                <div className="mobile-flex-start">
                  <div className="text-lg mr-3">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <MobileText size="sm" weight="medium">
                      {activity.description}
                    </MobileText>
                    <div className="mobile-flex-between mt-1">
                      <MobileText size="xs" color="muted">
                        {activity.timestamp.toLocaleString('zh-CN')}
                      </MobileText>
                      {activity.amount && (
                        <MobileText size="xs" color="success" weight="medium">
                          ¥{activity.amount.toLocaleString()}
                        </MobileText>
                      )}
                    </div>
                  </div>
                </div>
              </MobileCard>
            ))}
          </div>
        </MobileSpacing>

        {/* 顶级客户 */}
        <MobileSpacing size="md">
          <MobileTitle level={4}>顶级客户</MobileTitle>
          <div className="space-y-3">
            {topCustomers.map((customer) => (
              <MobileCard key={customer.id} size="small" onClick={() => navigate(`/customers/${customer.id}`)}>
                <div className="mobile-flex-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <UserOutlined className="text-primary-600" />
                    </div>
                    <div>
                      <MobileText size="sm" weight="medium">
                        {customer.name}
                      </MobileText>
                      <div className="flex items-center space-x-2 mt-1">
                        <MobileStatus status="info" size="small">
                          {customer.tier}
                        </MobileStatus>
                        <MobileText size="xs" color="muted">
                          {customer.lastPurchase.toLocaleDateString('zh-CN')}
                        </MobileText>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <MobileText size="sm" weight="bold" color="success">
                      ¥{customer.totalSpent.toLocaleString()}
                    </MobileText>
                    <EyeOutlined className="text-gray-400 ml-2" />
                  </div>
                </div>
              </MobileCard>
            ))}
          </div>
        </MobileSpacing>

        {/* 查看更多 */}
        <MobileSpacing size="md">
          <MobileButton
            variant="secondary"
            className="mobile-btn-full"
            onClick={() => navigate('/analytics')}
          >
            查看详细报告
          </MobileButton>
        </MobileSpacing>
      </MobileSpacing>
    </MobileContainer>
  );
};

export default MobileDashboardPage;
