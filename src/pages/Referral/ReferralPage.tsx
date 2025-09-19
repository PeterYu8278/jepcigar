import React from 'react';
import { Card, Typography, Button, Tag, Row, Col, Statistic } from 'antd';
import { ShareAltOutlined, TrophyOutlined, UserOutlined, GiftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const ReferralPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">推荐系统</Title>
          <Text type="secondary">通过推荐朋友获得积分奖励和会员升级</Text>
        </div>
        <Button type="primary" icon={<ShareAltOutlined />}>
          生成推荐链接
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={6}>
          <Card className="hover-lift">
            <Statistic
              title="推荐总数"
              value={23}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="hover-lift">
            <Statistic
              title="成功转换"
              value={18}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="hover-lift">
            <Statistic
              title="获得积分"
              value={9000}
              prefix={<GiftOutlined />}
              valueStyle={{ color: '#f16d1f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={6}>
          <Card className="hover-lift">
            <Statistic
              title="转换率"
              value={78.3}
              suffix="%"
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="我的推荐链接" className="hover-lift">
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Text strong>主推荐链接</Text>
                  <Tag color="blue">活跃</Tag>
                </div>
                <Text code className="text-sm">
                  https://jepcigar.com/ref/ABC123
                </Text>
                <div className="mt-2 text-sm text-gray-500">
                  通过此链接注册: 12人 | 转换成功: 9人
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Text strong>商务推荐链接</Text>
                  <Tag color="green">活跃</Tag>
                </div>
                <Text code className="text-sm">
                  https://jepcigar.com/business/XYZ789
                </Text>
                <div className="mt-2 text-sm text-gray-500">
                  通过此链接注册: 8人 | 转换成功: 6人
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="推荐奖励规则" className="hover-lift">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                <div>
                  <Text strong>成功推荐朋友</Text>
                  <div className="text-sm text-gray-600">朋友完成首次购买</div>
                </div>
                <Tag color="gold">500积分</Tag>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div>
                  <Text strong>推荐商务客户</Text>
                  <div className="text-sm text-gray-600">企业客户首次采购</div>
                </div>
                <Tag color="blue">1000积分</Tag>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <div>
                  <Text strong>推荐活动参与者</Text>
                  <div className="text-sm text-gray-600">朋友参加品鉴会</div>
                </div>
                <Tag color="purple">200积分</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="推荐功能说明">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <ShareAltOutlined className="text-blue-500" />
              <h4 className="font-medium">个性化推荐链接</h4>
            </div>
            <Text type="secondary">
              为不同场合生成专属推荐链接，便于跟踪和统计
            </Text>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrophyOutlined className="text-green-500" />
              <h4 className="font-medium">自动奖励系统</h4>
            </div>
            <Text type="secondary">
              推荐成功自动发放积分，支持会员等级升级
            </Text>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <UserOutlined className="text-purple-500" />
              <h4 className="font-medium">推荐关系追踪</h4>
            </div>
            <Text type="secondary">
              完整记录推荐关系链，建立长期客户关系
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReferralPage;
