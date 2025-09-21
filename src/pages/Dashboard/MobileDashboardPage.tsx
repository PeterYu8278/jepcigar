import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Statistic, 
  Row, 
  Col, 
  Space, 
  Typography, 
  Button,
  List,
  Avatar,
  Tag,
  Progress,
  Divider
} from 'antd';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  CalendarOutlined,
  TrophyOutlined,
  GiftOutlined,
  BarChartOutlined,
  TrendingUpOutlined,
  TrendingDownOutlined,
  EyeOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useCustomers } from '@/stores/customerStore';
import { useEvents } from '@/stores/eventStore';
import { useInventory } from '@/stores/inventoryStore';
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

const { Title, Text } = Typography;

interface DashboardStats {
  totalCustomers: number;
  monthlySales: number;
  monthlyRevenue: number;
  activeEvents: number;
  lowStockItems: number;
  pendingOrders: number;
  customerGrowth: number;
  revenueGrowth: number;
  salesGrowth: number;
}

interface RecentActivity {
  id: string;
  type: 'sale' | 'customer' | 'event' | 'inventory';
  title: string;
  description: string;
  timestamp: Date;
  amount?: number;
  icon: React.ReactNode;
  color: string;
}

interface TopCustomer {
  id: string;
  name: string;
  tier: string;
  totalSpent: number;
  lastPurchase: Date;
  avatar?: string;
}

const MobileDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useMobile();
  const { customers } = useCustomers();
  const { events } = useEvents();
  const { inventoryItems } = useInventory();

  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    monthlySales: 0,
    monthlyRevenue: 0,
    activeEvents: 0,
    lowStockItems: 0,
    pendingOrders: 0,
    customerGrowth: 0,
    revenueGrowth: 0,
    salesGrowth: 0,
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [customers, events, inventoryItems]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // 模拟数据加载延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      // 计算统计数据
      const totalCustomers = customers.length;
      const activeEvents = events.filter(event => event.status === 'active').length;
      const lowStockItems = inventoryItems.filter(item => item.stockLevel === 'low').length;

      // 模拟销售和收入数据
      const monthlySales = Math.floor(Math.random() * 100) + 50;
      const monthlyRevenue = Math.floor(Math.random() * 100000) + 50000;
      const customerGrowth = Math.floor(Math.random() * 20) - 10;
      const revenueGrowth = Math.floor(Math.random() * 30) - 15;
      const salesGrowth = Math.floor(Math.random() * 25) - 12;

      setStats({
        totalCustomers,
        monthlySales,
        monthlyRevenue,
        activeEvents,
        lowStockItems,
        pendingOrders: Math.floor(Math.random() * 10),
        customerGrowth,
        revenueGrowth,
        salesGrowth,
      });

      // 生成最近活动数据
      const activities: RecentActivity[] = [
        {
          id: '1',
          type: 'sale',
          title: '新订单',
          description: '客户张三购买了古巴雪茄套装',
          timestamp: new Date(Date.now() - 1000 * 60 * 30),
          amount: 2500,
          icon: <ShoppingCartOutlined />,
          color: '#52c41a'
        },
        {
          id: '2',
          type: 'customer',
          title: '新客户',
          description: '李四注册成为新客户',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
          icon: <UserOutlined />,
          color: '#1890ff'
        },
        {
          id: '3',
          type: 'event',
          title: '活动更新',
          description: '雪茄品鉴会即将开始',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
          icon: <CalendarOutlined />,
          color: '#722ed1'
        },
        {
          id: '4',
          type: 'inventory',
          title: '库存提醒',
          description: '古巴雪茄库存不足',
          timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
          icon: <GiftOutlined />,
          color: '#fa8c16'
        }
      ];

      setRecentActivities(activities);

      // 生成顶级客户数据
      const topCustomersData: TopCustomer[] = customers.slice(0, 5).map((customer, index) => ({
        id: customer.id,
        name: `${customer.firstName}${customer.lastName}`,
        tier: ['银卡', '金卡', '白金卡', '钻石卡'][index % 4],
        totalSpent: Math.floor(Math.random() * 50000) + 10000,
        lastPurchase: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
        avatar: customer.avatar
      }));

      setTopCustomers(topCustomersData);

    } catch (error) {
      console.error('加载仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 统计卡片组件
  const StatCard: React.FC<{
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: string;
    growth?: number;
    prefix?: string;
    suffix?: string;
  }> = ({ title, value, icon, color, growth, prefix = '', suffix = '' }) => (
    <MobileCard 
      className="mobile-card-elevated text-center"
      onClick={() => navigate('/customers')}
    >
      <div className="mobile-spacing-sm">
        <div 
          className="mobile-flex-center mb-2"
          style={{ color }}
        >
          {icon}
        </div>
        <MobileTitle level={4} className="mobile-title-h4 mb-1">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </MobileTitle>
        <MobileText size="sm" color="secondary" className="block mb-2">
          {title}
        </MobileText>
        {growth !== undefined && (
          <div className="mobile-flex-center">
            {growth >= 0 ? (
              <Tag color="green" className="mobile-status-success">
                <ArrowUpOutlined /> +{growth}%
              </Tag>
            ) : (
              <Tag color="red" className="mobile-status-error">
                <ArrowDownOutlined /> {growth}%
              </Tag>
            )}
          </div>
        )}
      </div>
    </MobileCard>
  );

  // 活动项组件
  const ActivityItem: React.FC<{ activity: RecentActivity }> = ({ activity }) => (
    <List.Item className="mobile-flex-start py-3 border-b border-gray-100 last:border-b-0">
      <Avatar 
        icon={activity.icon} 
        className="mr-3"
        style={{ backgroundColor: activity.color }}
      />
      <div className="flex-1">
        <div className="mobile-flex-between mb-1">
          <MobileText size="sm" weight="medium">
            {activity.title}
          </MobileText>
          <MobileText size="xs" color="muted">
            {activity.timestamp.toLocaleTimeString('zh-CN', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </MobileText>
        </div>
        <MobileText size="xs" color="secondary" className="block">
          {activity.description}
        </MobileText>
        {activity.amount && (
          <MobileText size="sm" color="success" weight="medium">
            ¥{activity.amount.toLocaleString()}
          </MobileText>
        )}
      </div>
    </List.Item>
  );

  // 客户项组件
  const CustomerItem: React.FC<{ customer: TopCustomer }> = ({ customer }) => (
    <List.Item className="mobile-flex-start py-3">
      <Avatar 
        src={customer.avatar}
        icon={<UserOutlined />}
        className="mr-3 bg-primary-100 text-primary-600"
      />
      <div className="flex-1">
        <div className="mobile-flex-between mb-1">
          <MobileText size="sm" weight="medium">
            {customer.name}
          </MobileText>
          <MobileStatus status="success" size="small">
            {customer.tier}
          </MobileStatus>
        </div>
        <MobileText size="xs" color="secondary" className="block mb-1">
          消费: ¥{customer.totalSpent.toLocaleString()}
        </MobileText>
        <MobileText size="xs" color="muted">
          最近购买: {customer.lastPurchase.toLocaleDateString('zh-CN')}
        </MobileText>
      </div>
    </List.Item>
  );

  if (loading) {
    return (
      <MobileContainer>
        <div className="mobile-loading min-h-screen">
          <div className="mobile-loading-spinner" />
          <MobileText className="mobile-loading-text mt-3">
            加载仪表盘数据中...
          </MobileText>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <MobileSpacing size="lg">
        {/* 页面标题 */}
        <div className="mobile-flex-between mb-4">
          <MobileTitle level={2} className="mobile-title-h2 mb-0">
            仪表盘
          </MobileTitle>
          <MobileButton 
            type="primary" 
            icon={<PlusOutlined />}
            size="small"
            onClick={() => navigate('/customers')}
          >
            添加
          </MobileButton>
        </div>

        {/* 核心指标 - 1x4网格 */}
        <MobileCard title="核心指标" elevated>
          <MobileGrid columns={4} gap="sm">
            <StatCard
              title="总客户数"
              value={stats.totalCustomers}
              icon={<UserOutlined className="text-2xl" />}
              color="#1890ff"
              growth={stats.customerGrowth}
            />
            <StatCard
              title="本月销售"
              value={stats.monthlySales}
              icon={<ShoppingCartOutlined className="text-2xl" />}
              color="#52c41a"
              growth={stats.salesGrowth}
              suffix="单"
            />
            <StatCard
              title="本月收入"
              value={stats.monthlyRevenue}
              icon={<DollarOutlined className="text-2xl" />}
              color="#fa8c16"
              growth={stats.revenueGrowth}
              prefix="¥"
            />
            <StatCard
              title="活跃活动"
              value={stats.activeEvents}
              icon={<CalendarOutlined className="text-2xl" />}
              color="#722ed1"
              suffix="个"
            />
          </MobileGrid>
        </MobileCard>

        {/* 次要指标 */}
        <MobileGrid columns={2} gap="md">
          <MobileCard 
            title="库存状态" 
            elevated
            onClick={() => navigate('/inventory')}
          >
            <div className="mobile-spacing-sm">
              <div className="mobile-flex-between mb-2">
                <MobileText size="sm" color="secondary">
                  低库存商品
                </MobileText>
                <MobileText size="lg" weight="bold" color="warning">
                  {stats.lowStockItems}
                </MobileText>
              </div>
              <Progress 
                percent={Math.round((stats.lowStockItems / 50) * 100)} 
                strokeColor="#fa8c16"
                showInfo={false}
                size="small"
              />
              <MobileText size="xs" color="muted">
                需要补货
              </MobileText>
            </div>
          </MobileCard>

          <MobileCard 
            title="待处理订单" 
            elevated
            onClick={() => navigate('/orders')}
          >
            <div className="mobile-spacing-sm">
              <div className="mobile-flex-between mb-2">
                <MobileText size="sm" color="secondary">
                  待处理
                </MobileText>
                <MobileText size="lg" weight="bold" color="error">
                  {stats.pendingOrders}
                </MobileText>
              </div>
              <Progress 
                percent={Math.round((stats.pendingOrders / 20) * 100)} 
                strokeColor="#ff4d4f"
                showInfo={false}
                size="small"
              />
              <MobileText size="xs" color="muted">
                需要处理
              </MobileText>
            </div>
          </MobileCard>
        </MobileGrid>

        {/* 最近活动 */}
        <MobileCard title="最近活动" elevated>
          <List
            dataSource={recentActivities}
            renderItem={(activity) => <ActivityItem activity={activity} />}
            split={false}
          />
          <div className="mobile-flex-center mt-3">
            <MobileButton 
              variant="outline" 
              size="small"
              onClick={() => navigate('/analytics')}
            >
              查看全部活动
            </MobileButton>
          </div>
        </MobileCard>

        {/* 顶级客户 */}
        <MobileCard title="VIP客户" elevated>
          <List
            dataSource={topCustomers}
            renderItem={(customer) => <CustomerItem customer={customer} />}
            split={false}
          />
          <div className="mobile-flex-center mt-3">
            <MobileButton 
              variant="outline" 
              size="small"
              onClick={() => navigate('/customers')}
            >
              查看所有客户
            </MobileButton>
          </div>
        </MobileCard>

        {/* 快速操作 */}
        <MobileCard title="快速操作" elevated>
          <MobileGrid columns={2} gap="md">
            <MobileButton 
              variant="primary" 
              icon={<UserOutlined />}
              fullWidth
              onClick={() => navigate('/customers')}
            >
              客户管理
            </MobileButton>
            <MobileButton 
              variant="secondary" 
              icon={<GiftOutlined />}
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
          </MobileGrid>
        </MobileCard>

        {/* 底部安全区域 */}
        <div className="mobile-safe-bottom h-4" />
      </MobileSpacing>
    </MobileContainer>
  );
};

export default MobileDashboardPage;
