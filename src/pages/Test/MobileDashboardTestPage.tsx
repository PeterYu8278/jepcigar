import React, { useState } from 'react';
import { Switch, Select, Space, message } from 'antd';
import { MobileContainer, MobileCard, MobileTitle, MobileText, MobileButton, MobileSpacing } from '@/components/Common/MobileComponents';
import MobileStatCard from '@/components/Dashboard/MobileStatCard';
import useMobile from '@/hooks/useMobile';
import {
  UserOutlined,
  ShoppingCartOutlined,
  TrophyOutlined,
  GiftOutlined,
  CalendarOutlined,
  BarChartOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Option } = Select;

const MobileDashboardTestPage: React.FC = () => {
  const { isMobile, screenWidth, screenHeight } = useMobile();
  const [showTrends, setShowTrends] = useState(true);
  const [showActions, setShowActions] = useState(true);
  const [cardSize, setCardSize] = useState<'small' | 'medium' | 'large'>('medium');

  const handleStatCardClick = (title: string) => {
    message.success(`${title} 卡片被点击`);
  };

  const handleActionClick = (action: string) => {
    message.info(`执行操作: ${action}`);
  };

  return (
    <MobileContainer>
      <MobileSpacing size="lg">
        {/* 设备信息 */}
        <MobileCard title="设备信息" elevated>
          <MobileSpacing size="md">
            <MobileText size="sm" color="secondary">
              屏幕尺寸: {screenWidth} × {screenHeight}
            </MobileText>
            <MobileText size="sm" color="secondary">
              设备类型: {isMobile ? '移动设备' : '桌面设备'}
            </MobileText>
          </MobileSpacing>
        </MobileCard>

        {/* 控制面板 */}
        <MobileCard title="测试控制" elevated>
          <MobileSpacing size="md">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <MobileText size="sm" color="secondary">显示趋势</MobileText>
                <Switch checked={showTrends} onChange={setShowTrends} />
              </div>
              
              <div className="flex items-center justify-between">
                <MobileText size="sm" color="secondary">显示操作按钮</MobileText>
                <Switch checked={showActions} onChange={setShowActions} />
              </div>

              <div>
                <MobileText size="sm" color="secondary" className="block mb-2">
                  卡片尺寸:
                </MobileText>
                <Select
                  value={cardSize}
                  onChange={setCardSize}
                  className="w-full"
                >
                  <Option value="small">小 (Small)</Option>
                  <Option value="medium">中 (Medium)</Option>
                  <Option value="large">大 (Large)</Option>
                </Select>
              </div>
            </div>
          </MobileSpacing>
        </MobileCard>

        {/* 统计卡片测试 */}
        <MobileCard title="统计卡片测试" elevated>
          <MobileSpacing size="md">
            <MobileStatCard
              title="总客户数"
              value={1247}
              icon={<UserOutlined />}
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
              valueColor="text-blue-600"
              trend={showTrends ? { value: 12, isPositive: true } : undefined}
              showDivider={true}
              onClick={() => handleStatCardClick('总客户数')}
              action={showActions ? (
                <MobileButton
                  variant="outline"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick('查看客户');
                  }}
                >
                  查看
                </MobileButton>
              ) : undefined}
            />

            <MobileStatCard
              title="本月销售"
              value={89}
              icon={<ShoppingCartOutlined />}
              iconBgColor="bg-green-100"
              iconColor="text-green-600"
              valueColor="text-green-600"
              trend={showTrends ? { value: 8, isPositive: true } : undefined}
              showDivider={true}
              onClick={() => handleStatCardClick('本月销售')}
              action={showActions ? (
                <MobileButton
                  variant="outline"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick('查看销售');
                  }}
                >
                  查看
                </MobileButton>
              ) : undefined}
            />

            <MobileStatCard
              title="本月收入"
              value="¥125,680"
              icon={<BarChartOutlined />}
              iconBgColor="bg-orange-100"
              iconColor="text-orange-600"
              valueColor="text-orange-600"
              trend={showTrends ? { value: 15, isPositive: true } : undefined}
              showDivider={true}
              onClick={() => handleStatCardClick('本月收入')}
              action={showActions ? (
                <MobileButton
                  variant="outline"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick('查看收入');
                  }}
                >
                  查看
                </MobileButton>
              ) : undefined}
            />

            <MobileStatCard
              title="活跃活动"
              value={3}
              icon={<CalendarOutlined />}
              iconBgColor="bg-purple-100"
              iconColor="text-purple-600"
              valueColor="text-purple-600"
              trend={showTrends ? { value: -2, isPositive: false } : undefined}
              showDivider={false}
              onClick={() => handleStatCardClick('活跃活动')}
              action={showActions ? (
                <MobileButton
                  variant="outline"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleActionClick('查看活动');
                  }}
                >
                  查看
                </MobileButton>
              ) : undefined}
            />
          </MobileSpacing>
        </MobileCard>

        {/* 不同尺寸测试 */}
        <MobileCard title="不同尺寸测试" elevated>
          <MobileSpacing size="md">
            <MobileText size="sm" color="secondary" className="block mb-3">
              当前尺寸: {cardSize}
            </MobileText>

            <MobileStatCard
              title="小尺寸测试"
              value={42}
              icon={<TrophyOutlined />}
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
              valueColor="text-yellow-600"
              trend={{ value: 5, isPositive: true }}
              showDivider={true}
            />

            <MobileStatCard
              title="中等尺寸测试"
              value={128}
              icon={<GiftOutlined />}
              iconBgColor="bg-pink-100"
              iconColor="text-pink-600"
              valueColor="text-pink-600"
              trend={{ value: -3, isPositive: false }}
              showDivider={false}
            />
          </MobileSpacing>
        </MobileCard>

        {/* 交互测试 */}
        <MobileCard title="交互测试" elevated>
          <MobileSpacing size="md">
            <MobileText size="sm" color="secondary" className="block mb-3">
              点击统计卡片测试交互效果
            </MobileText>

            <Space direction="vertical" className="w-full">
              <MobileButton
                variant="primary"
                fullWidth
                onClick={() => message.success('主要操作按钮')}
              >
                主要操作
              </MobileButton>

              <MobileButton
                variant="outline"
                fullWidth
                onClick={() => message.info('次要操作按钮')}
              >
                次要操作
              </MobileButton>

              <MobileButton
                variant="ghost"
                fullWidth
                onClick={() => message.warning('幽灵按钮')}
              >
                幽灵按钮
              </MobileButton>
            </Space>
          </MobileSpacing>
        </MobileCard>

        {/* 使用说明 */}
        <MobileCard title="使用说明" elevated>
          <MobileSpacing size="md">
            <MobileSpacing size="sm">
              <MobileTitle level={4}>MobileStatCard 组件特性</MobileTitle>
              
              <MobileText size="sm" color="secondary" className="block">
                • 专为移动端纵向布局设计，节省垂直空间
              </MobileText>
              <MobileText size="sm" color="secondary" className="block">
                • 支持图标、数值、趋势指示器
              </MobileText>
              <MobileText size="sm" color="secondary" className="block">
                • 可配置的颜色主题和尺寸
              </MobileText>
              <MobileText size="sm" color="secondary" className="block">
                • 支持点击事件和右侧操作按钮
              </MobileText>
              <MobileText size="sm" color="secondary" className="block">
                • 触摸友好的交互设计
              </MobileText>
            </MobileSpacing>

            <MobileSpacing size="sm">
              <MobileTitle level={4}>API 属性</MobileTitle>
              
              <MobileText size="xs" color="muted" className="block font-mono">
                title: string - 统计项标题
              </MobileText>
              <MobileText size="xs" color="muted" className="block font-mono">
                value: number | string - 统计值
              </MobileText>
              <MobileText size="xs" color="muted" className="block font-mono">
                icon?: ReactNode - 图标
              </MobileText>
              <MobileText size="xs" color="muted" className="block font-mono">
                trend?: object - 变化趋势
              </MobileText>
              <MobileText size="xs" color="muted" className="block font-mono">
                onClick?: () =&gt; void - 点击事件
              </MobileText>
              <MobileText size="xs" color="muted" className="block font-mono">
                action?: ReactNode - 右侧操作按钮
              </MobileText>
            </MobileSpacing>
          </MobileSpacing>
        </MobileCard>
      </MobileSpacing>
    </MobileContainer>
  );
};

export default MobileDashboardTestPage;
