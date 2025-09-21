import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MobileContainer,
  MobileCard,
  MobileTitle,
  MobileText,
  MobileButton,
  MobileSpacing,
  MobileGrid,
  MobileStatus
} from '@/components/Common/MobileComponents';
import MobileStatCard from '@/components/Dashboard/MobileStatCard';
import {
  UserOutlined,
  ShoppingCartOutlined,
  TrophyOutlined,
  GiftOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PlusOutlined,
  EyeOutlined,
  ArrowRightOutlined,
  TrendingUpOutlined
} from '@ant-design/icons';
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
  tier: 'Silver' | 'Gold' | 'Platinum' | 'Royal';
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
          totalSpent: 25800,
          lastPurchase: new Date(),
        },
        {
          id: '2',
          name: '李女士',
          tier: 'Platinum',
          totalSpent: 18900,
          lastPurchase: new Date(Date.now() - 86400000),
        },
        {
          id: '3',
          name: '王总',
          tier: 'Gold',
          totalSpent: 12500,
          lastPurchase: new Date(Date.now() - 172800000),
        },
      ]);
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取活动类型图标
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'sale':
        return <ShoppingCartOutlined className="text-green-500" />;
      case 'customer':
        return <UserOutlined className="text-blue-500" />;
      case 'event':
        return <CalendarOutlined className="text-purple-500" />;
      case 'inventory':
        return <GiftOutlined className="text-orange-500" />;
      default:
        return <BarChartOutlined className="text-gray-500" />;
    }
  };

  // 获取会员等级颜色
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Silver':
        return 'default';
      case 'Gold':
        return 'warning';
      case 'Platinum':
        return 'processing';
      case 'Royal':
        return 'error';
      default:
        return 'default';
    }
  };

  // 格式化时间
  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) {
      return `${minutes}分钟前`;
    } else if (hours < 24) {
      return `${hours}小时前`;
    } else {
      return `${days}天前`;
    }
  };

  return (
    <MobileContainer>
      <MobileSpacing size="lg">
        {/* 页面头部 */}
        <div className="mobile-flex-between items-center mb-4">
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
            添加客户
          </MobileButton>
        </div>

        {/* 统计卡片 - 纵向排列 */}
        <MobileCard title="业务概览" elevated>
          <MobileSpacing size="md">
            <MobileStatCard
              title="总客户数"
              value={stats.totalCustomers}
              icon={<UserOutlined />}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              valueColor="text-blue-600"
              trend={{ value: 12, isPositive: true }}
              showDivider={true}
            />

            <MobileStatCard
              title="本月销售"
              value={stats.totalSales}
              icon={<ShoppingCartOutlined />}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              valueColor="text-green-600"
              trend={{ value: 8, isPositive: true }}
              showDivider={true}
            />

            <MobileStatCard
              title="本月收入"
              value={`¥${stats.totalRevenue.toLocaleString()}`}
              icon={<BarChartOutlined />}
              iconBgColor="bg-orange-100"
              iconColor="text-orange-600"
              valueColor="text-orange-600"
              trend={{ value: 15, isPositive: true }}
              showDivider={true}
            />

            <MobileStatCard
              title="活跃活动"
              value={stats.activeEvents}
              icon={<CalendarOutlined />}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
              valueColor="text-purple-600"
              showDivider={false}
              action={
                <MobileButton
                  variant="outline"
                  size="small"
                  onClick={() => navigate('/events')}
                >
                  查看
                </MobileButton>
              }
            />
          </MobileSpacing>
        </MobileCard>

        {/* 快速操作 */}
        <MobileCard title="快速操作" elevated>
          <MobileGrid columns={2} gap="md">
            <MobileButton
              variant="outline"
              icon={<UserOutlined />}
              onClick={() => navigate('/customers')}
              className="mobile-btn-full"
            >
              客户管理
            </MobileButton>
            <MobileButton
              variant="outline"
              icon={<GiftOutlined />}
              onClick={() => navigate('/inventory')}
              className="mobile-btn-full"
            >
              库存管理
            </MobileButton>
            <MobileButton
              variant="outline"
              icon={<CalendarOutlined />}
              onClick={() => navigate('/events')}
              className="mobile-btn-full"
            >
              活动管理
            </MobileButton>
            <MobileButton
              variant="outline"
              icon={<BarChartOutlined />}
              onClick={() => navigate('/analytics')}
              className="mobile-btn-full"
            >
              数据分析
            </MobileButton>
          </MobileGrid>
        </MobileCard>

        {/* 最近活动 */}
        <MobileCard title="最近活动" elevated>
          <MobileSpacing size="md">
            {recentActivities.map((activity, index) => (
              <div key={activity.id} className="mobile-flex-start py-3">
                <div className="w-8 h-8 mobile-flex-center mr-3">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <MobileText size="base" className="block mb-1">
                    {activity.description}
                  </MobileText>
                  <div className="mobile-flex-between">
                    <MobileText size="sm" color="secondary">
                      {formatTime(activity.timestamp)}
                    </MobileText>
                    {activity.amount && (
                      <MobileText size="sm" weight="medium" className="text-green-600">
                        ¥{activity.amount.toLocaleString()}
                      </MobileText>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            <div className="pt-3 border-t border-gray-100">
              <MobileButton
                variant="ghost"
                icon={<ArrowRightOutlined />}
                onClick={() => navigate('/analytics')}
                className="mobile-btn-full"
              >
                查看所有活动
              </MobileButton>
            </div>
          </MobileSpacing>
        </MobileCard>

        {/* VIP客户 */}
        <MobileCard title="VIP客户" elevated>
          <MobileSpacing size="md">
            {topCustomers.map((customer) => (
              <div key={customer.id} className="mobile-flex-between items-center py-3 border-b border-gray-100 last:border-b-0">
                <div className="mobile-flex-start">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mobile-flex-center mr-3">
                    <MobileText size="sm" weight="bold" className="text-white">
                      {customer.name.charAt(0)}
                    </MobileText>
                  </div>
                  <div>
                    <MobileText size="base" weight="medium" className="block">
                      {customer.name}
                    </MobileText>
                    <MobileText size="sm" color="secondary">
                      ¥{customer.totalSpent.toLocaleString()}
                    </MobileText>
                  </div>
                </div>
                <div className="text-right">
                  <MobileStatus status={getTierColor(customer.tier)} size="small">
                    {customer.tier}
                  </MobileStatus>
                  <MobileText size="xs" color="secondary" className="block mt-1">
                    {formatTime(customer.lastPurchase)}
                  </MobileText>
                </div>
              </div>
            ))}
            
            <div className="pt-3 border-t border-gray-100">
              <MobileButton
                variant="ghost"
                icon={<EyeOutlined />}
                onClick={() => navigate('/customers')}
                className="mobile-btn-full"
              >
                查看所有客户
              </MobileButton>
            </div>
          </MobileSpacing>
        </MobileCard>

        {/* 系统状态 */}
        <MobileCard title="系统状态" elevated>
          <MobileSpacing size="md">
            <div className="mobile-flex-between items-center py-3 border-b border-gray-100">
              <div className="mobile-flex-start">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg mobile-flex-center mr-3">
                  <TrophyOutlined className="text-yellow-600" />
                </div>
                <div>
                  <MobileText size="sm" color="secondary">库存预警</MobileText>
                  <MobileText size="base" weight="medium">
                    {stats.lowStockItems} 个商品
                  </MobileText>
                </div>
              </div>
              <MobileButton
                variant="outline"
                size="small"
                onClick={() => navigate('/inventory')}
              >
                处理
              </MobileButton>
            </div>

            <div className="mobile-flex-between items-center py-3">
              <div className="mobile-flex-start">
                <div className="w-8 h-8 bg-blue-100 rounded-lg mobile-flex-center mr-3">
                  <ShoppingCartOutlined className="text-blue-600" />
                </div>
                <div>
                  <MobileText size="sm" color="secondary">待处理订单</MobileText>
                  <MobileText size="base" weight="medium">
                    {stats.pendingOrders} 个订单
                  </MobileText>
                </div>
              </div>
              <MobileButton
                variant="outline"
                size="small"
                onClick={() => navigate('/orders')}
              >
                查看
              </MobileButton>
            </div>
          </MobileSpacing>
        </MobileCard>
      </MobileSpacing>
    </MobileContainer>
  );
};

export default MobileDashboardPage;
