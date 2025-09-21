import React, { useState } from 'react';
import { Card, Space, Switch, Select, Input, Slider, message } from 'antd';
import {
  MobileButton,
  MobileInput,
  MobileCard,
  MobileTitle,
  MobileText,
  MobileLoading,
  MobileEmpty,
  MobileStatus,
  MobileContainer,
  MobileSpacing,
  MobileGrid
} from '@/components/Common/MobileComponents';
import useMobile from '@/hooks/useMobile';
import {
  UserOutlined,
  SettingOutlined,
  HeartOutlined,
  StarOutlined,
  DownloadOutlined,
  ShareAltOutlined
} from '@ant-design/icons';

const { Option } = Select;

const MobileUITestPage: React.FC = () => {
  const { isMobile, screenWidth, screenHeight, isTouchDevice } = useMobile();
  const [loading, setLoading] = useState(false);
  const [buttonSize, setButtonSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [buttonVariant, setButtonVariant] = useState<'primary' | 'secondary' | 'outline' | 'ghost'>('primary');
  const [inputSize, setInputSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [cardSize, setCardSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [showElevated, setShowElevated] = useState(true);

  const handleButtonClick = (variant: string) => {
    message.success(`${variant} 按钮被点击`);
  };

  const handleLoadingTest = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      message.success('加载完成');
    }, 2000);
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
            <MobileText size="sm" color="secondary">
              触摸设备: {isTouchDevice ? '是' : '否'}
            </MobileText>
          </MobileSpacing>
        </MobileCard>

        {/* 按钮测试 */}
        <MobileCard title="按钮组件测试" elevated>
          <MobileSpacing size="md">
            {/* 控制面板 */}
            <div className="space-y-4">
              <div>
                <MobileText size="sm" color="secondary" className="block mb-2">
                  按钮尺寸:
                </MobileText>
                <Select
                  value={buttonSize}
                  onChange={setButtonSize}
                  className="w-full"
                >
                  <Option value="small">小 (Small)</Option>
                  <Option value="medium">中 (Medium)</Option>
                  <Option value="large">大 (Large)</Option>
                </Select>
              </div>

              <div>
                <MobileText size="sm" color="secondary" className="block mb-2">
                  按钮样式:
                </MobileText>
                <Select
                  value={buttonVariant}
                  onChange={setButtonVariant}
                  className="w-full"
                >
                  <Option value="primary">主要 (Primary)</Option>
                  <Option value="secondary">次要 (Secondary)</Option>
                  <Option value="outline">轮廓 (Outline)</Option>
                  <Option value="ghost">幽灵 (Ghost)</Option>
                </Select>
              </div>
            </div>

            <Divider />

            {/* 按钮示例 */}
            <MobileSpacing size="md">
              <MobileButton
                size={buttonSize}
                variant={buttonVariant}
                fullWidth
                icon={<UserOutlined />}
                onClick={() => handleButtonClick(buttonVariant)}
              >
                全宽按钮
              </MobileButton>

              <MobileButton
                size={buttonSize}
                variant={buttonVariant}
                icon={<SettingOutlined />}
                onClick={() => handleButtonClick(buttonVariant)}
              >
                图标按钮
              </MobileButton>

              <MobileButton
                size={buttonSize}
                variant={buttonVariant}
                onClick={handleLoadingTest}
                loading={loading}
              >
                加载按钮
              </MobileButton>

              <div className="flex space-x-2">
                <MobileButton
                  size={buttonSize}
                  variant="primary"
                  icon={<HeartOutlined />}
                  onClick={() => handleButtonClick('primary')}
                >
                  喜欢
                </MobileButton>
                <MobileButton
                  size={buttonSize}
                  variant="secondary"
                  icon={<StarOutlined />}
                  onClick={() => handleButtonClick('secondary')}
                >
                  收藏
                </MobileButton>
              </div>
            </MobileSpacing>
          </MobileSpacing>
        </MobileCard>

        {/* 输入框测试 */}
        <MobileCard title="输入框组件测试" elevated>
          <MobileSpacing size="md">
            <div>
              <MobileText size="sm" color="secondary" className="block mb-2">
                输入框尺寸:
              </MobileText>
              <Select
                value={inputSize}
                onChange={setInputSize}
                className="w-full mb-4"
              >
                <Option value="small">小 (Small)</Option>
                <Option value="medium">中 (Medium)</Option>
                <Option value="large">大 (Large)</Option>
              </Select>
            </div>

            <MobileSpacing size="md">
              <MobileInput
                size={inputSize}
                placeholder="请输入内容"
                fullWidth
              />

              <MobileInput
                size={inputSize}
                placeholder="带图标的输入框"
                prefix={<UserOutlined />}
                fullWidth
              />

              <MobileInput
                size={inputSize}
                placeholder="密码输入框"
                type="password"
                fullWidth
              />

              <MobileInput
                size={inputSize}
                placeholder="多行文本"
                type="textarea"
                rows={3}
                fullWidth
              />
            </MobileSpacing>
          </MobileSpacing>
        </MobileCard>

        {/* 卡片测试 */}
        <MobileCard title="卡片组件测试" elevated>
          <MobileSpacing size="md">
            <div className="space-y-4">
              <div>
                <MobileText size="sm" color="secondary" className="block mb-2">
                  卡片尺寸:
                </MobileText>
                <Select
                  value={cardSize}
                  onChange={setCardSize}
                  className="w-full mb-2"
                >
                  <Option value="small">小 (Small)</Option>
                  <Option value="medium">中 (Medium)</Option>
                  <Option value="large">大 (Large)</Option>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={showElevated}
                  onChange={setShowElevated}
                />
                <MobileText size="sm" color="secondary">
                  阴影效果
                </MobileText>
              </div>
            </div>

            <Divider />

            <MobileSpacing size="md">
              <MobileCard
                title="示例卡片"
                size={cardSize}
                elevated={showElevated}
                onClick={() => message.info('卡片被点击')}
              >
                <MobileSpacing size="sm">
                  <MobileText>
                    这是一个示例卡片，点击会有反馈效果。
                  </MobileText>
                  <MobileText size="sm" color="secondary">
                    支持不同尺寸和阴影效果。
                  </MobileText>
                </MobileSpacing>
              </MobileCard>
            </MobileSpacing>
          </MobileSpacing>
        </MobileCard>

        {/* 状态标签测试 */}
        <MobileCard title="状态标签测试" elevated>
          <MobileSpacing size="md">
            <MobileSpacing size="sm">
              <MobileStatus status="success">成功状态</MobileStatus>
              <MobileStatus status="warning">警告状态</MobileStatus>
              <MobileStatus status="error">错误状态</MobileStatus>
              <MobileStatus status="info">信息状态</MobileStatus>
              <MobileStatus status="default">默认状态</MobileStatus>
            </MobileSpacing>

            <Divider />

            <MobileSpacing size="sm">
              <MobileText size="sm" color="secondary" className="block mb-2">
                小尺寸标签:
              </MobileText>
              <Space wrap>
                <MobileStatus status="success" size="small">小标签</MobileStatus>
                <MobileStatus status="warning" size="small">警告</MobileStatus>
                <MobileStatus status="error" size="small">错误</MobileStatus>
              </Space>
            </MobileSpacing>
          </MobileSpacing>
        </MobileCard>

        {/* 加载状态测试 */}
        <MobileCard title="加载状态测试" elevated>
          <MobileSpacing size="md">
            <MobileSpacing size="md">
              <MobileLoading size="small" text="小尺寸加载" />
            </MobileSpacing>

            <Divider />

            <MobileSpacing size="md">
              <MobileLoading size="medium" text="中等尺寸加载" />
            </MobileSpacing>

            <Divider />

            <MobileSpacing size="md">
              <MobileLoading size="large" text="大尺寸加载" />
            </MobileSpacing>
          </MobileSpacing>
        </MobileCard>

        {/* 空状态测试 */}
        <MobileCard title="空状态测试" elevated>
          <MobileSpacing size="md">
            <MobileEmpty
              icon={<UserOutlined />}
              title="暂无用户"
              description="还没有添加任何用户信息"
              action={
                <MobileButton variant="primary" icon={<UserOutlined />}>
                  添加用户
                </MobileButton>
              }
            />
          </MobileSpacing>
        </MobileCard>

        {/* 网格测试 */}
        <MobileCard title="网格布局测试" elevated>
          <MobileSpacing size="md">
            <MobileGrid columns={2} gap="md">
              <MobileCard size="small" elevated>
                <MobileText size="sm">网格项 1</MobileText>
              </MobileCard>
              <MobileCard size="small" elevated>
                <MobileText size="sm">网格项 2</MobileText>
              </MobileCard>
              <MobileCard size="small" elevated>
                <MobileText size="sm">网格项 3</MobileText>
              </MobileCard>
              <MobileCard size="small" elevated>
                <MobileText size="sm">网格项 4</MobileText>
              </MobileCard>
            </MobileGrid>
          </MobileSpacing>
        </MobileCard>

        {/* 文本样式测试 */}
        <MobileCard title="文本样式测试" elevated>
          <MobileSpacing size="md">
            <MobileSpacing size="sm">
              <MobileTitle level={1}>一级标题</MobileTitle>
              <MobileTitle level={2}>二级标题</MobileTitle>
              <MobileTitle level={3}>三级标题</MobileTitle>
              <MobileTitle level={4}>四级标题</MobileTitle>
            </MobileSpacing>

            <Divider />

            <MobileSpacing size="sm">
              <MobileText size="xs" color="muted">超小文本</MobileText>
              <MobileText size="sm" color="secondary">小文本</MobileText>
              <MobileText size="base">基础文本</MobileText>
              <MobileText size="lg" weight="medium">大文本</MobileText>
              <MobileText size="xl" weight="bold">超大文本</MobileText>
            </MobileSpacing>

            <Divider />

            <MobileSpacing size="sm">
              <MobileText color="success" weight="medium">成功文本</MobileText>
              <MobileText color="warning" weight="medium">警告文本</MobileText>
              <MobileText color="error" weight="medium">错误文本</MobileText>
              <MobileText color="info" weight="medium">信息文本</MobileText>
            </MobileSpacing>
          </MobileSpacing>
        </MobileCard>
      </MobileSpacing>
    </MobileContainer>
  );
};

export default MobileUITestPage;
