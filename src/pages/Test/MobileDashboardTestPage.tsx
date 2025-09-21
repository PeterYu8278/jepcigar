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
import useMobile from '@/hooks/useMobile';
import {
  UserOutlined,
  DollarOutlined,
  ShoppingCartOutlined,
  CalendarOutlined,
  EyeOutlined
} from '@ant-design/icons';

const { Option } = Select;

const MobileDashboardTestPage: React.FC = () => {
  const { isMobile, screenWidth, screenHeight } = useMobile();
  const [showDemo, setShowDemo] = useState(true);
  const [gridColumns, setGridColumns] = useState<1 | 2 | 3 | 4>(2);

  const handleButtonClick = (action: string) => {
    message.success(`${action} 功能演示`);
  };

  return (
    <MobileContainer>
      <MobileSpacing size="lg">
        {/* 页面标题 */}
        <MobileTitle level={2}>移动端仪表盘测试</MobileTitle>

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
              建议布局: {isMobile ? '2x2网格' : '4x1网格'}
            </MobileText>
          </MobileSpacing>
        </MobileCard>

        {/* 控制面板 */}
        <MobileCard title="测试控制" elevated>
          <MobileSpacing size="md">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <MobileText size="sm" color="secondary">
                  显示演示数据:
                </MobileText>
                <Switch
                  checked={showDemo}
                  onChange={setShowDemo}
                />
              </div>

              <div>
                <MobileText size="sm" color="secondary" className="block mb-2">
                  网格列数:
                </MobileText>
                <Select
                  value={gridColumns}
                  onChange={setGridColumns}
                  className="w-full"
                >
                  <Option value={1}>1列 (单列)</Option>
                  <Option value={2}>2列 (2x2网格)</Option>
                  <Option value={3}>3列 (3列)</Option>
                  <Option value={4}>4列 (4x1网格)</Option>
                </Select>
              </div>
            </div>
          </MobileSpacing>
        </MobileCard>

        {/* 仪表盘指标演示 */}
        <MobileCard title="仪表盘指标演示" elevated>
          <MobileSpacing size="md">
            <MobileGrid columns={gridColumns} gap="md">
              {/* 总客户数 */}
              <MobileCard
                size="small"
                elevated
                className="text-center cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleButtonClick('查看客户详情')}
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
                      {showDemo ? '156' : '--'}
                    </MobileText>
                    <div className="mobile-flex-center">
                      <span className="text-green-500">↗</span>
                      <MobileText size="xs" color="success" className="ml-1">
                        +12%
                      </MobileText>
                    </div>
                  </div>
                </div>
              </MobileCard>

              {/* 本月销售 */}
              <MobileCard
                size="small"
                elevated
                className="text-center cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleButtonClick('查看销售详情')}
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
                      {showDemo ? '42' : '--'}
                    </MobileText>
                    <div className="mobile-flex-center">
                      <span className="text-green-500">↗</span>
                      <MobileText size="xs" color="success" className="ml-1">
                        +8%
                      </MobileText>
                    </div>
                  </div>
                </div>
              </MobileCard>

              {/* 本月收入 */}
              <MobileCard
                size="small"
                elevated
                className="text-center cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleButtonClick('查看收入详情')}
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
                      {showDemo ? '¥68,420' : '--'}
                    </MobileText>
                    <div className="mobile-flex-center">
                      <span className="text-green-500">↗</span>
                      <MobileText size="xs" color="success" className="ml-1">
                        +15%
                      </MobileText>
                    </div>
                  </div>
                </div>
              </MobileCard>

              {/* 活跃活动 */}
              <MobileCard
                size="small"
                elevated
                className="text-center cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleButtonClick('查看活动详情')}
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
                      {showDemo ? '7' : '--'}
                    </MobileText>
                    <div className="mobile-flex-center">
                      <span className="text-green-500">↗</span>
                      <MobileText size="xs" color="success" className="ml-1">
                        +3%
                      </MobileText>
                    </div>
                  </div>
                </div>
              </MobileCard>
            </MobileGrid>
          </MobileSpacing>
        </MobileCard>

        {/* 快速操作演示 */}
        <MobileCard title="快速操作演示" elevated>
          <MobileSpacing size="md">
            <MobileGrid columns={2} gap="sm">
              <MobileButton
                variant="primary"
                icon={<UserOutlined />}
                fullWidth
                onClick={() => handleButtonClick('添加客户')}
              >
                添加客户
              </MobileButton>
              <MobileButton
                variant="secondary"
                icon={<ShoppingCartOutlined />}
                fullWidth
                onClick={() => handleButtonClick('查看库存')}
              >
                查看库存
              </MobileButton>
              <MobileButton
                variant="outline"
                icon={<CalendarOutlined />}
                fullWidth
                onClick={() => handleButtonClick('创建活动')}
              >
                创建活动
              </MobileButton>
              <MobileButton
                variant="ghost"
                icon={<EyeOutlined />}
                fullWidth
                onClick={() => handleButtonClick('查看报告')}
              >
                查看报告
              </MobileButton>
            </MobileGrid>
          </MobileSpacing>
        </MobileCard>

        {/* 布局建议 */}
        <MobileCard title="布局建议" elevated>
          <MobileSpacing size="md">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <MobileText size="sm" weight="medium" color="primary" className="block mb-1">
                  📱 移动端推荐 (≤768px)
                </MobileText>
                <MobileText size="xs" color="secondary">
                  使用2x2网格布局，每个指标卡片占据较大空间，便于触摸操作
                </MobileText>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <MobileText size="sm" weight="medium" color="success" className="block mb-1">
                  💻 桌面端推荐 (&gt;768px)
                </MobileText>
                <MobileText size="xs" color="secondary">
                  使用4x1网格布局，所有指标在一行显示，节省垂直空间
                </MobileText>
              </div>

              <div className="p-3 bg-yellow-50 rounded-lg">
                <MobileText size="sm" weight="medium" color="warning" className="block mb-1">
                  ⚠️ 注意事项
                </MobileText>
                <MobileText size="xs" color="secondary">
                  确保触摸目标最小44px，文字大小不小于16px，避免iOS缩放
                </MobileText>
              </div>
            </div>
          </MobileSpacing>
        </MobileCard>

        {/* 完整仪表盘预览 */}
        <MobileCard title="完整仪表盘预览" elevated>
          <MobileSpacing size="md">
            <MobileText size="sm" color="secondary" className="block mb-4">
              点击下方按钮查看完整的移动端仪表盘页面
            </MobileText>
            <MobileButton
              variant="primary"
              icon={<EyeOutlined />}
              fullWidth
              onClick={() => window.open('/dashboard', '_blank')}
            >
              查看完整仪表盘
            </MobileButton>
          </MobileSpacing>
        </MobileCard>

        {/* 底部安全区域 */}
        <div className="mobile-safe-bottom h-4" />
      </MobileSpacing>
    </MobileContainer>
  );
};

export default MobileDashboardTestPage;
