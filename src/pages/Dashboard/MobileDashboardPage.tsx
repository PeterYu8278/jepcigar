import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  TrophyOutlined,
  GiftOutlined,
  BarChartOutlined,
  PlusOutlined,
  EyeOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import {
  MobileContainer,
  MobileSpacing,
  MobileCard,
  MobileTitle,
  MobileText,
  MobileButton,
  MobileGrid
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

  const formatCurrency = (amount: number) => {
    return `¥${amount.toLocaleString()}`;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('zh-CN');
  };

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
            icon={<PlusOutlined />}
            onClick={() => navigate('/customers')}
            className="mobile-touch-target"
          >
            添加客户
          </MobileButton>
        </div>

        {/* 统计卡片 - 一行显示 */}
        <MobileCard title="业务概览" elevated>
          <MobileGrid columns={4} gap="sm">
            {/* 总客户数 */}
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <UserOutlined className="text-2xl text-blue-500 mb-2" />
              <div className="text-xl font-bold text-blue-600">
                {stats.totalCustomers.toLocaleString()}
              </div>
              <div className="text-xs text-blue-600">总客户数</div>
            </div>

            {/* 本月销售 */}
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <ShoppingCartOutlined className="text-2xl text-green-500 mb-2" />
              <div className="text-xl font-bold text-green-600">
                {stats.totalSales}
              </div>
              <div className="text-xs text-green-600">本月销售</div>
            </div>

            {/* 本月收入 */}
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-2xl text-orange-500 mb-2">¥</div>
              <div className="text-xl font-bold text-orange-600">
                {(stats.totalRevenue / 10000).toFixed(1)}万
              </div>
              <div className="text-xs text-orange-600">本月收入</div>
            </div>

            {/* 活跃活动 */}
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <CalendarOutlined className="text-2xl text-purple-500 mb-2" />
              <div className="text-xl font-bold text-purple-600">
                {stats.activeEvents}
              </div>
              <div className="text-xs text-purple-600">活跃活动</div>
            </div>
          </MobileGrid>
        </MobileCard>

        {/* 系统提醒 */}
        <MobileCard title="系统提醒" elevated>
          <MobileSpacing size="sm">
            <div className="mobile-flex-between p-3 bg-orange-50 rounded-lg">
              <div className="mobile-flex-start">
                <BarChartOutlined className="text-orange-500 mr-2" />
                <MobileText size="sm">
                  {stats.lowStockItems}个商品库存不足
                </MobileText>
              </div>
              <MobileButton
                type="text"
                size="small"
                onClick={() => navigate('/inventory')}
              >
                查看详情
              </MobileButton>
            </div>

            <div className="mobile-flex-between p-3 bg-blue-50 rounded-lg">
              <div className="mobile-flex-start">
                <GiftOutlined className="text-blue-500 mr-2" />
                <MobileText size="sm">
                  {stats.pendingOrders}个礼品订单待处理
                </MobileText>
              </div>
              <MobileButton
                type="text"
                size="small"
                onClick={() => navigate('/gifting')}
              >
                查看详情
              </MobileButton>
            </div>

            <div className="mobile-flex-between p-3 bg-green-50 rounded-lg">
              <div className="mobile-flex-start">
                <TrophyOutlined className="text-green-500 mr-2" />
                <MobileText size="sm">
                  3个客户即将升级会员等级
                </MobileText>
              </div>
              <MobileButton
                type="text"
                size="small"
                onClick={() => navigate('/royal-program')}
              >
                查看详情
              </MobileButton>
            </div>
          </MobileSpacing>
        </MobileCard>

        {/* 快速操作 */}
        <MobileCard title="快速操作" elevated>
          <MobileGrid columns={2} gap="sm">
            <MobileButton
              variant="outline"
              icon={<ShoppingCartOutlined />}
              onClick={() => navigate('/inventory')}
              className="h-20 flex-col"
            >
              <div className="text-lg mb-1">管理库存</div>
              <div className="text-xs text-gray-500">查看和更新库存</div>
            </MobileButton>

            <MobileButton
              variant="outline"
              icon={<CalendarOutlined />}
              onClick={() => navigate('/events')}
              className="h-20 flex-col"
            >
              <div className="text-lg mb-1">创建活动</div>
              <div className="text-xs text-gray-500">组织品鉴会</div>
            </MobileButton>

            <MobileButton
              variant="outline"
              icon={<UserOutlined />}
              onClick={() => navigate('/customers')}
              className="h-20 flex-col"
            >
              <div className="text-lg mb-1">客户管理</div>
              <div className="text-xs text-gray-500">查看客户信息</div>
            </MobileButton>

            <MobileButton
              variant="outline"
              icon={<BarChartOutlined />}
              onClick={() => navigate('/analytics')}
              className="h-20 flex-col"
            >
              <div className="text-lg mb-1">数据分析</div>
              <div className="text-xs text-gray-500">查看业务报告</div>
            </MobileButton>
          </MobileGrid>
        </MobileCard>

        {/* 最近活动 */}
        <MobileCard title="最近活动" elevated>
          <MobileSpacing size="sm">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="mobile-flex-start p-3 border-b border-gray-100 last:border-b-0">
                <div className="mr-3">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <MobileText size="sm" className="block mb-1">
                    {activity.description}
                  </MobileText>
                  <div className="mobile-flex-between">
                    <MobileText size="xs" color="secondary">
                      {activity.timestamp.toLocaleTimeString('zh-CN', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </MobileText>
                    {activity.amount && (
                      <MobileText size="xs" color="success" weight="medium">
                        {formatCurrency(activity.amount)}
                      </MobileText>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </MobileSpacing>
        </MobileCard>

        {/* 顶级客户 */}
        <MobileCard title="顶级客户" elevated>
          <MobileSpacing size="sm">
            {topCustomers.map((customer) => (
              <div key={customer.id} className="mobile-flex-between p-3 border-b border-gray-100 last:border-b-0">
                <div className="flex-1">
                  <div className="mobile-flex-between mb-1">
                    <MobileText size="base" weight="medium">
                      {customer.name}
                    </MobileText>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      customer.tier === 'Royal' ? 'bg-red-100 text-red-600' :
                      customer.tier === 'Platinum' ? 'bg-blue-100 text-blue-600' :
                      customer.tier === 'Gold' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {customer.tier}
                    </span>
                  </div>
                  <div className="mobile-flex-between">
                    <MobileText size="sm" color="secondary">
                      消费: {formatCurrency(customer.totalSpent)}
                    </MobileText>
                    <MobileText size="xs" color="muted">
                      {formatDate(customer.lastPurchase)}
                    </MobileText>
                  </div>
                </div>
                <MobileButton
                  type="text"
                  icon={<EyeOutlined />}
                  onClick={() => navigate(`/customers/${customer.id}`)}
                  className="ml-2"
                />
              </div>
            ))}
          </MobileSpacing>
        </MobileCard>

        {/* 图表占位符 */}
        <MobileCard title="销售趋势" elevated>
          <div className="h-48 mobile-flex-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChartOutlined className="text-4xl text-gray-400 mb-2" />
              <MobileText size="sm" color="secondary">
                销售趋势图表
              </MobileText>
              <MobileText size="xs" color="muted">
                (集成Chart.js图表库)
              </MobileText>
            </div>
          </div>
        </MobileCard>

        <MobileCard title="会员等级分布" elevated>
          <div className="h-48 mobile-flex-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChartOutlined className="text-4xl text-gray-400 mb-2" />
              <MobileText size="sm" color="secondary">
                会员等级分布图表
              </MobileText>
              <MobileText size="xs" color="muted">
                (集成Chart.js图表库)
              </MobileText>
            </div>
          </div>
        </MobileCard>

        {/* 底部安全区域 */}
        <div className="mobile-safe-bottom h-4" />
      </MobileSpacing>
    </MobileContainer>
  );
};

export default MobileDashboardPage;
