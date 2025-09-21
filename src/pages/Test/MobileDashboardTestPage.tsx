import React from 'react';
import { Card, Space, Button, Switch, message } from 'antd';
import { MobileContainer, MobileSpacing, MobileCard, MobileTitle, MobileText, MobileButton } from '@/components/Common/MobileComponents';
import MobileDashboardPage from '@/pages/Dashboard/MobileDashboardPage';
import useMobile from '@/hooks/useMobile';
import {
  UserOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  CalendarOutlined,
  EyeOutlined,
  SettingOutlined
} from '@ant-design/icons';

const MobileDashboardTestPage: React.FC = () => {
  const { isMobile, screenWidth, screenHeight } = useMobile();

  const handleTestAction = (action: string) => {
    message.success(`${action} 功能测试成功`);
  };

  return (
    <MobileContainer>
      <MobileSpacing size="lg">
        {/* 页面标题 */}
        <div className="text-center mb-6">
          <MobileTitle level={2}>移动端仪表盘测试</MobileTitle>
          <MobileText size="sm" color="secondary">
            测试移动端仪表盘的行显示布局和交互效果
          </MobileText>
        </div>

        {/* 设备信息 */}
        <MobileCard title="设备信息" elevated className="mb-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <MobileText size="sm" color="secondary" className="block mb-1">
                屏幕尺寸
              </MobileText>
              <MobileText weight="medium">
                {screenWidth} × {screenHeight}
              </MobileText>
            </div>
            <div className="text-center">
              <MobileText size="sm" color="secondary" className="block mb-1">
                设备类型
              </MobileText>
              <MobileText weight="medium">
                {isMobile ? '移动设备' : '桌面设备'}
              </MobileText>
            </div>
          </div>
        </MobileCard>

        {/* 关键指标行显示布局测试 */}
        <MobileCard title="关键指标 - 行显示布局" elevated className="mb-4">
          <div className="space-y-4">
            {/* 模拟数据说明 */}
            <div className="text-center py-2 bg-blue-50 rounded-lg">
              <MobileText size="xs" color="info">
                按照要求：总客户数 | 本月销售 | 本月收入 | 活跃活动
              </MobileText>
            </div>

            {/* 第一行：总客户数 | 本月销售 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="mobile-flex-center mobile-spacing-sm">
                <div className="text-center flex-1">
                  <UserOutlined className="text-blue-500 text-2xl mb-2" />
                  <div className="mobile-text-xl font-bold text-blue-500">
                    12,348
                  </div>
                  <MobileText size="xs" color="secondary">总客户数</MobileText>
                </div>
              </div>

              <div className="mobile-flex-center mobile-spacing-sm">
                <div className="text-center flex-1">
                  <ShoppingCartOutlined className="text-green-500 text-2xl mb-2" />
                  <div className="mobile-text-xl font-bold text-green-500">
                    2,131
                  </div>
                  <MobileText size="xs" color="secondary">本月销售</MobileText>
                </div>
              </div>
            </div>

            {/* 第二行：本月收入 | 活跃活动 */}
            <div className="grid grid-cols-2 gap-4">
              <div className="mobile-flex-center mobile-spacing-sm">
                <div className="text-center flex-1">
                  <DollarOutlined className="text-orange-500 text-2xl mb-2" />
                  <div className="mobile-text-xl font-bold text-orange-500">
                    ¥1,312
                  </div>
                  <MobileText size="xs" color="secondary">本月收入</MobileText>
                </div>
              </div>

              <div className="mobile-flex-center mobile-spacing-sm">
                <div className="text-center flex-1">
                  <CalendarOutlined className="text-purple-500 text-2xl mb-2" />
                  <div className="mobile-text-xl font-bold text-purple-500">
                    23
                  </div>
                  <MobileText size="xs" color="secondary">活跃活动</MobileText>
                </div>
              </div>
            </div>

            {/* 交互测试按钮 */}
            <div className="pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2">
                <MobileButton
                  variant="outline"
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => handleTestAction('查看详情')}
                >
                  查看详情
                </MobileButton>
                <MobileButton
                  variant="outline"
                  size="small"
                  icon={<SettingOutlined />}
                  onClick={() => handleTestAction('设置')}
                >
                  设置
                </MobileButton>
              </div>
            </div>
          </div>
        </MobileCard>

        {/* 布局对比测试 */}
        <MobileCard title="布局对比测试" elevated className="mb-4">
          <div className="space-y-4">
            <MobileText size="sm" color="secondary" className="block">
              桌面端 vs 移动端布局对比：
            </MobileText>

            {/* 桌面端样式模拟 */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <MobileText size="xs" color="muted" className="block mb-2">
                桌面端 (4列网格布局):
              </MobileText>
              <div className="grid grid-cols-4 gap-2 text-center">
                <div className="p-2 bg-white rounded border">
                  <MobileText size="xs">总客户数</MobileText>
                  <div className="text-sm font-bold text-blue-500">12,348</div>
                </div>
                <div className="p-2 bg-white rounded border">
                  <MobileText size="xs">本月销售</MobileText>
                  <div className="text-sm font-bold text-green-500">2,131</div>
                </div>
                <div className="p-2 bg-white rounded border">
                  <MobileText size="xs">本月收入</MobileText>
                  <div className="text-sm font-bold text-orange-500">¥1,312</div>
                </div>
                <div className="p-2 bg-white rounded border">
                  <MobileText size="xs">活跃活动</MobileText>
                  <div className="text-sm font-bold text-purple-500">23</div>
                </div>
              </div>
            </div>

            {/* 移动端样式 */}
            <div className="p-4 bg-blue-50 rounded-lg">
              <MobileText size="xs" color="muted" className="block mb-2">
                移动端 (2×2网格布局):
              </MobileText>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-white rounded border">
                  <UserOutlined className="text-blue-500 text-lg mb-1" />
                  <div className="text-sm font-bold text-blue-500">12,348</div>
                  <MobileText size="xs" color="secondary">总客户数</MobileText>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <ShoppingCartOutlined className="text-green-500 text-lg mb-1" />
                  <div className="text-sm font-bold text-green-500">2,131</div>
                  <MobileText size="xs" color="secondary">本月销售</MobileText>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <DollarOutlined className="text-orange-500 text-lg mb-1" />
                  <div className="text-sm font-bold text-orange-500">¥1,312</div>
                  <MobileText size="xs" color="secondary">本月收入</MobileText>
                </div>
                <div className="text-center p-3 bg-white rounded border">
                  <CalendarOutlined className="text-purple-500 text-lg mb-1" />
                  <div className="text-sm font-bold text-purple-500">23</div>
                  <MobileText size="xs" color="secondary">活跃活动</MobileText>
                </div>
              </div>
            </div>
          </div>
        </MobileCard>

        {/* 功能测试 */}
        <MobileCard title="功能测试" elevated className="mb-4">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <MobileButton
                variant="primary"
                onClick={() => handleTestAction('数据刷新')}
              >
                数据刷新
              </MobileButton>
              <MobileButton
                variant="secondary"
                onClick={() => handleTestAction('导出报告')}
              >
                导出报告
              </MobileButton>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <MobileButton
                variant="outline"
                size="small"
                onClick={() => handleTestAction('客户')}
              >
                客户
              </MobileButton>
              <MobileButton
                variant="outline"
                size="small"
                onClick={() => handleTestAction('销售')}
              >
                销售
              </MobileButton>
              <MobileButton
                variant="outline"
                size="small"
                onClick={() => handleTestAction('活动')}
              >
                活动
              </MobileButton>
            </div>
          </div>
        </MobileCard>

        {/* 完整仪表盘预览 */}
        <MobileCard title="完整仪表盘预览" elevated className="mb-4">
          <div className="space-y-4">
            <MobileText size="sm" color="secondary">
              点击下方按钮查看完整的移动端仪表盘页面：
            </MobileText>
            
            <MobileButton
              variant="primary"
              fullWidth
              onClick={() => {
                // 这里可以导航到实际的仪表盘页面
                message.info('导航到完整仪表盘页面');
              }}
            >
              查看完整仪表盘
            </MobileButton>

            <div className="text-center py-4 bg-gray-50 rounded-lg">
              <MobileText size="xs" color="muted">
                完整仪表盘包含：关键指标、快捷操作、最近活动、顶级客户、业务概览图表
              </MobileText>
            </div>
          </div>
        </MobileCard>

        {/* 底部安全区域 */}
        <div className="h-4" />
      </MobileSpacing>
    </MobileContainer>
  );
};

export default MobileDashboardTestPage;
