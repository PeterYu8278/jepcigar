import React, { useEffect, useState } from 'react';
import { Card, Statistic, Table, Tag, Button, Space, Typography, Row, Col } from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  TrophyOutlined,
  GiftOutlined,
  CalendarOutlined,
  BarChartOutlined,
  PlusOutlined,
  EyeOutlined,
  DollarOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useMobile from '@/hooks/useMobile';
import { MobileContainer, MobileSpacing, MobileCard, MobileTitle, MobileText, MobileButton } from '@/components/Common/MobileComponents';

const { Title, Text } = Typography;

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
        totalCustomers: 12348,
        totalSales: 2131,
        totalRevenue: 1312,
        activeEvents: 23,
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
          name: '张总',
          tier: 'Royal',
          totalSpent: 15680,
          lastPurchase: new Date(),
        },
        {
          id: '2',
          name: '李经理',
          tier: 'Platinum',
          totalSpent: 8920,
          lastPurchase: new Date(Date.now() - 86400000),
        },
        {
          id: '3',
          name: '王先生',
          tier: 'Gold',
          totalSpent: 4560,
          lastPurchase: new Date(Date.now() - 172800000),
        },
      ]);
    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
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

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}万`;
    }
    return num.toLocaleString();
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
          >
            添加
          </MobileButton>
        </div>

        {/* 关键指标 - 行显示布局 */}
        <MobileCard title="关键指标" elevated className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 第一行：总客户数 | 本月销售 */}
            <div className="mobile-flex-center mobile-spacing-sm">
              <div className="text-center flex-1">
                <UserOutlined className="text-blue-500 text-2xl mb-2" />
                <div className="mobile-text-xl font-bold text-blue-500">
                  {formatNumber(stats.totalCustomers)}
                </div>
                <MobileText size="xs" color="secondary">总客户数</MobileText>
              </div>
            </div>

            <div className="mobile-flex-center mobile-spacing-sm">
              <div className="text-center flex-1">
                <ShoppingCartOutlined className="text-green-500 text-2xl mb-2" />
                <div className="mobile-text-xl font-bold text-green-500">
                  {formatNumber(stats.totalSales)}
                </div>
                <MobileText size="xs" color="secondary">本月销售</MobileText>
              </div>
            </div>

            {/* 第二行：本月收入 | 活跃活动 */}
            <div className="mobile-flex-center mobile-spacing-sm">
              <div className="text-center flex-1">
                <DollarOutlined className="text-orange-500 text-2xl mb-2" />
                <div className="mobile-text-xl font-bold text-orange-500">
                  ¥{formatNumber(stats.totalRevenue)}
                </div>
                <MobileText size="xs" color="secondary">本月收入</MobileText>
              </div>
            </div>

            <div className="mobile-flex-center mobile-spacing-sm">
              <div className="text-center flex-1">
                <CalendarOutlined className="text-purple-500 text-2xl mb-2" />
                <div className="mobile-text-xl font-bold text-purple-500">
                  {stats.activeEvents}
                </div>
                <MobileText size="xs" color="secondary">活跃活动</MobileText>
              </div>
            </div>
          </div>
        </MobileCard>

        {/* 快捷操作 */}
        <MobileCard title="快捷操作" elevated className="mb-4">
          <div className="grid grid-cols-2 gap-3">
            <MobileButton
              variant="outline"
              icon={<UserOutlined />}
              fullWidth
              onClick={() => navigate('/customers')}
            >
              客户管理
            </MobileButton>
            <MobileButton
              variant="outline"
              icon={<ShoppingCartOutlined />}
              fullWidth
              onClick={() => navigate('/inventory')}
            >
              库存管理
            </MobileButton>
            <MobileButton
              variant="outline"
              icon={<CalendarOutlined />}
              fullWidth
              onClick={() => navigate('/events')}
            >
              活动管理
            </MobileButton>
            <MobileButton
              variant="outline"
              icon={<BarChartOutlined />}
              fullWidth
              onClick={() => navigate('/analytics')}
            >
              数据分析
            </MobileButton>
          </div>
        </MobileCard>

        {/* 最近活动 */}
        <MobileCard title="最近活动" elevated className="mb-4">
          <MobileSpacing size="sm">
            {recentActivities.slice(0, 4).map((activity) => (
              <div
                key={activity.id}
                className="mobile-flex-start py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="mr-3 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <MobileText size="sm" className="block mb-1">
                    {activity.description}
                  </MobileText>
                  <div className="mobile-flex-between">
                    <MobileText size="xs" color="secondary">
                      {activity.timestamp.toLocaleString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </MobileText>
                    {activity.amount && (
                      <MobileText size="xs" color="success" weight="medium">
                        ¥{activity.amount.toLocaleString()}
                      </MobileText>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </MobileSpacing>
        </MobileCard>

        {/* 顶级客户 */}
        <MobileCard title="顶级客户" elevated className="mb-4">
          <MobileSpacing size="sm">
            {topCustomers.map((customer) => (
              <div
                key={customer.id}
                className="mobile-flex-between py-3 border-b border-gray-100 last:border-b-0"
              >
                <div className="flex-1">
                  <div className="mobile-flex-between mb-1">
                    <MobileText weight="medium">{customer.name}</MobileText>
                    <Tag color={getTierColor(customer.tier)} size="small">
                      {customer.tier}
                    </Tag>
                  </div>
                  <div className="mobile-flex-between">
                    <MobileText size="xs" color="secondary">
                      消费: ¥{customer.totalSpent.toLocaleString()}
                    </MobileText>
                    <MobileButton
                      type="text"
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => navigate(`/customers/${customer.id}`)}
                    >
                      查看
                    </MobileButton>
                  </div>
                </div>
              </div>
            ))}
          </MobileSpacing>
        </MobileCard>

        {/* 业务概览图表 */}
        <MobileCard title="业务概览" elevated className="mb-4">
          <div className="space-y-4">
            {/* 销售趋势 */}
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <BarChartOutlined className="text-3xl text-gray-400 mb-2" />
              <MobileText size="sm" color="secondary">销售趋势图表</MobileText>
              <MobileText size="xs" color="muted">(集成Chart.js图表库)</MobileText>
            </div>

            {/* 会员分布 */}
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <TrophyOutlined className="text-3xl text-gray-400 mb-2" />
              <MobileText size="sm" color="secondary">会员等级分布</MobileText>
              <MobileText size="xs" color="muted">(集成Chart.js图表库)</MobileText>
            </div>
          </div>
        </MobileCard>

        {/* 底部安全区域 */}
        <div className="h-4" />
      </MobileSpacing>
    </MobileContainer>
  );
};

export default MobileDashboardPage;
