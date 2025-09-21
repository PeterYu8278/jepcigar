import React, { useState } from 'react';
import { Switch, Select, message } from 'antd';
import {
  MobileContainer,
  MobileSpacing,
  MobileCard,
  MobileTitle,
  MobileText,
  MobileButton,
  MobileGrid
} from '@/components/Common/MobileComponents';
import MobileDashboardPage from '@/pages/Dashboard/MobileDashboardPage';
import useMobile from '@/hooks/useMobile';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  CalendarOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Option } = Select;

const MobileDashboardTestPage: React.FC = () => {
  const { isMobile, screenWidth, screenHeight, isTouchDevice } = useMobile();
  const [showDemo, setShowDemo] = useState(false);
  const [testMode, setTestMode] = useState<'preview' | 'interactive'>('preview');

  const handleTestAction = (action: string) => {
    message.success(`${action} 测试成功`);
  };

  if (showDemo) {
    return <MobileDashboardPage />;
  }

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
            <MobileText size="sm" color="secondary">
              触摸设备: {isTouchDevice ? '是' : '否'}
            </MobileText>
          </MobileSpacing>
        </MobileCard>

        {/* 测试控制 */}
        <MobileCard title="测试控制" elevated>
          <MobileSpacing size="md">
            <div className="space-y-4">
              <div>
                <MobileText size="sm" color="secondary" className="block mb-2">
                  测试模式:
                </MobileText>
                <Select
                  value={testMode}
                  onChange={setTestMode}
                  className="w-full"
                >
                  <Option value="preview">预览模式</Option>
                  <Option value="interactive">交互模式</Option>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={showDemo}
                  onChange={setShowDemo}
                />
                <MobileText size="sm" color="secondary">
                  显示完整仪表盘
                </MobileText>
              </div>
            </div>

            <div className="mobile-flex-center mt-4">
              <MobileButton
                variant="primary"
                icon={<EyeOutlined />}
                onClick={() => setShowDemo(true)}
                fullWidth
              >
                查看完整仪表盘
              </MobileButton>
            </div>
          </MobileSpacing>
        </MobileCard>

        {/* 1x4网格测试 */}
        <MobileCard title="1x4网格布局测试" elevated>
          <MobileSpacing size="md">
            <MobileText size="sm" color="secondary" className="block mb-4">
              核心指标卡片 - 总客户数、本月销售、本月收入、活跃活动
            </MobileText>
            
            <MobileGrid columns={4} gap="sm">
              {/* 总客户数 */}
              <MobileCard 
                className="mobile-card-elevated text-center"
                onClick={() => handleTestAction('总客户数')}
              >
                <div className="mobile-spacing-sm">
                  <div className="mobile-flex-center mb-2 text-blue-500">
                    <UserOutlined className="text-2xl" />
                  </div>
                  <MobileTitle level={4} className="mobile-title-h4 mb-1">
                    1,234
                  </MobileTitle>
                  <MobileText size="sm" color="secondary" className="block mb-2">
                    总客户数
                  </MobileText>
                  <div className="mobile-flex-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      ↗ +12%
                    </span>
                  </div>
                </div>
              </MobileCard>

              {/* 本月销售 */}
              <MobileCard 
                className="mobile-card-elevated text-center"
                onClick={() => handleTestAction('本月销售')}
              >
                <div className="mobile-spacing-sm">
                  <div className="mobile-flex-center mb-2 text-green-500">
                    <ShoppingCartOutlined className="text-2xl" />
                  </div>
                  <MobileTitle level={4} className="mobile-title-h4 mb-1">
                    89
                  </MobileTitle>
                  <MobileText size="sm" color="secondary" className="block mb-2">
                    本月销售
                  </MobileText>
                  <div className="mobile-flex-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      ↗ +8%
                    </span>
                  </div>
                </div>
              </MobileCard>

              {/* 本月收入 */}
              <MobileCard 
                className="mobile-card-elevated text-center"
                onClick={() => handleTestAction('本月收入')}
              >
                <div className="mobile-spacing-sm">
                  <div className="mobile-flex-center mb-2 text-orange-500">
                    <DollarOutlined className="text-2xl" />
                  </div>
                  <MobileTitle level={4} className="mobile-title-h4 mb-1">
                    ¥156K
                  </MobileTitle>
                  <MobileText size="sm" color="secondary" className="block mb-2">
                    本月收入
                  </MobileText>
                  <div className="mobile-flex-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      ↗ +15%
                    </span>
                  </div>
                </div>
              </MobileCard>

              {/* 活跃活动 */}
              <MobileCard 
                className="mobile-card-elevated text-center"
                onClick={() => handleTestAction('活跃活动')}
              >
                <div className="mobile-spacing-sm">
                  <div className="mobile-flex-center mb-2 text-purple-500">
                    <CalendarOutlined className="text-2xl" />
                  </div>
                  <MobileTitle level={4} className="mobile-title-h4 mb-1">
                    12
                  </MobileTitle>
                  <MobileText size="sm" color="secondary" className="block mb-2">
                    活跃活动
                  </MobileText>
                  <div className="mobile-flex-center">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      ↗ +3
                    </span>
                  </div>
                </div>
              </MobileCard>
            </MobileGrid>
          </MobileSpacing>
        </MobileCard>

        {/* 网格响应式测试 */}
        <MobileCard title="响应式网格测试" elevated>
          <MobileSpacing size="md">
            <MobileText size="sm" color="secondary" className="block mb-4">
              测试不同列数的网格布局
            </MobileText>

            {/* 2列网格 */}
            <div className="mb-4">
              <MobileText size="xs" color="muted" className="block mb-2">
                2列网格:
              </MobileText>
              <MobileGrid columns={2} gap="sm">
                <MobileCard size="small" elevated>
                  <MobileText size="xs">卡片 1</MobileText>
                </MobileCard>
                <MobileCard size="small" elevated>
                  <MobileText size="xs">卡片 2</MobileText>
                </MobileCard>
              </MobileGrid>
            </div>

            {/* 3列网格 */}
            <div className="mb-4">
              <MobileText size="xs" color="muted" className="block mb-2">
                3列网格:
              </MobileText>
              <MobileGrid columns={3} gap="sm">
                <MobileCard size="small" elevated>
                  <MobileText size="xs">卡片 1</MobileText>
                </MobileCard>
                <MobileCard size="small" elevated>
                  <MobileText size="xs">卡片 2</MobileText>
                </MobileCard>
                <MobileCard size="small" elevated>
                  <MobileText size="xs">卡片 3</MobileText>
                </MobileCard>
              </MobileGrid>
            </div>

            {/* 4列网格 */}
            <div>
              <MobileText size="xs" color="muted" className="block mb-2">
                4列网格:
              </MobileText>
              <MobileGrid columns={4} gap="sm">
                <MobileCard size="small" elevated>
                  <MobileText size="xs">卡片 1</MobileText>
                </MobileCard>
                <MobileCard size="small" elevated>
                  <MobileText size="xs">卡片 2</MobileText>
                </MobileCard>
                <MobileCard size="small" elevated>
                  <MobileText size="xs">卡片 3</MobileText>
                </MobileCard>
                <MobileCard size="small" elevated>
                  <MobileText size="xs">卡片 4</MobileText>
                </MobileCard>
              </MobileGrid>
            </div>
          </MobileSpacing>
        </MobileCard>

        {/* 交互测试 */}
        <MobileCard title="交互测试" elevated>
          <MobileSpacing size="md">
            <MobileText size="sm" color="secondary" className="block mb-4">
              测试移动端交互效果
            </MobileText>

            <MobileSpacing size="sm">
              <MobileButton
                variant="primary"
                icon={<UserOutlined />}
                fullWidth
                onClick={() => handleTestAction('客户管理')}
              >
                客户管理
              </MobileButton>

              <MobileButton
                variant="secondary"
                icon={<ShoppingCartOutlined />}
                fullWidth
                onClick={() => handleTestAction('销售管理')}
              >
                销售管理
              </MobileButton>

              <MobileButton
                variant="outline"
                icon={<CalendarOutlined />}
                fullWidth
                onClick={() => handleTestAction('活动管理')}
              >
                活动管理
              </MobileButton>
            </MobileSpacing>
          </MobileSpacing>
        </MobileCard>

        {/* 使用说明 */}
        <MobileCard title="使用说明" elevated>
          <MobileSpacing size="md">
            <MobileText size="sm" color="secondary" className="block mb-3">
              移动端仪表盘特性:
            </MobileText>

            <MobileSpacing size="sm">
              <MobileText size="xs" color="muted">
                • 1x4网格显示核心指标
              </MobileText>
              <MobileText size="xs" color="muted">
                • 触摸友好的交互设计
              </MobileText>
              <MobileText size="xs" color="muted">
                • 响应式布局适配
              </MobileText>
              <MobileText size="xs" color="muted">
                • 实时数据更新
              </MobileText>
              <MobileText size="xs" color="muted">
                • 快速操作入口
              </MobileText>
              <MobileText size="xs" color="muted">
                • 最近活动展示
              </MobileText>
            </MobileSpacing>
          </MobileSpacing>
        </MobileCard>

        {/* 底部安全区域 */}
        <div className="mobile-safe-bottom h-4" />
      </MobileSpacing>
    </MobileContainer>
  );
};

export default MobileDashboardTestPage;
