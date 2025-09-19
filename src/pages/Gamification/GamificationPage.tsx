import React from 'react';
import { Card, Typography, Button, Tag, Row, Col, Progress } from 'antd';
import { RotateLeftOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const GamificationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">游戏化系统</Title>
          <Text type="secondary">幸运转盘、会员等级和积分奖励</Text>
        </div>
        <Button type="primary" icon={<RotateLeftOutlined />}>
          开始转盘
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card title="幸运转盘" className="hover-lift">
            <div className="text-center">
              <div className="w-48 h-48 mx-auto mb-4 bg-gradient-to-br from-yellow-100 to-orange-200 rounded-full flex items-center justify-center">
                <div className="text-6xl">🎰</div>
              </div>
              <div className="space-y-2 mb-4">
                <Text strong>今日剩余次数: 3/5</Text>
                <Progress percent={60} size="small" />
              </div>
              <Button type="primary" size="large" icon={<RotateLeftOutlined />}>
                消耗50积分转盘
              </Button>
              <div className="mt-4 text-sm text-gray-500">
                奖品包括: 折扣券、积分、高端雪茄、配件
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="会员等级" className="hover-lift">
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-2xl">🥈</span>
                  <Text strong>Silver 会员</Text>
                </div>
                <div className="text-sm text-gray-600">当前等级</div>
                <Progress percent={65} size="small" />
                <div className="text-xs text-gray-500 mt-1">
                  还需消费 ¥2,500 升级至 Gold
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg">🥇</span>
                  <Text>Gold 会员</Text>
                  <Tag color="orange">未达成</Tag>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">💎</span>
                  <Text>Platinum 会员</Text>
                  <Tag color="blue">未达成</Tag>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg">👑</span>
                  <Text>Royal 会员</Text>
                  <Tag color="purple">未达成</Tag>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="积分统计" className="hover-lift">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-500">1,250</div>
                <div className="text-gray-600">可用积分</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text>本月获得:</Text>
                  <Text strong className="text-green-600">+850</Text>
                </div>
                <div className="flex justify-between">
                  <Text>本月消费:</Text>
                  <Text strong className="text-red-600">-200</Text>
                </div>
                <div className="flex justify-between">
                  <Text>推荐奖励:</Text>
                  <Text strong className="text-blue-600">+500</Text>
                </div>
                <div className="flex justify-between">
                  <Text>活动参与:</Text>
                  <Text strong className="text-purple-600">+100</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="等级权益" className="hover-lift">
            <div className="space-y-3">
              <div className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">🥈</span>
                  <Text strong>Silver 会员权益</Text>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• 基础折扣 5%</div>
                  <div>• 生日礼品</div>
                  <div>• 新品尝鲜</div>
                </div>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">🥇</span>
                  <Text strong>Gold 会员权益</Text>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• 高级折扣 10%</div>
                  <div>• 专属活动邀请</div>
                  <div>• 优先客服</div>
                  <div>• 礼品包装</div>
                </div>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">💎</span>
                  <Text strong>Platinum 会员权益</Text>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• VIP折扣 15%</div>
                  <div>• 私人品鉴会</div>
                  <div>• 限量版优先购买</div>
                  <div>• 专属礼品</div>
                </div>
              </div>
              
              <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-lg">👑</span>
                  <Text strong>Royal 会员权益</Text>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• 最高折扣 20%</div>
                  <div>• 私人定制服务</div>
                  <div>• 全球限量版</div>
                  <div>• 专属顾问</div>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="转盘奖品" className="hover-lift">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-2xl mb-1">🎫</div>
                <Text strong className="text-sm">5%折扣券</Text>
                <div className="text-xs text-gray-500">概率: 30%</div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-2xl mb-1">🎫</div>
                <Text strong className="text-sm">10%折扣券</Text>
                <div className="text-xs text-gray-500">概率: 20%</div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-2xl mb-1">🎫</div>
                <Text strong className="text-sm">20%折扣券</Text>
                <div className="text-xs text-gray-500">概率: 10%</div>
              </div>
              
              <div className="p-3 bg-orange-50 rounded-lg text-center">
                <div className="text-2xl mb-1">⭐</div>
                <Text strong className="text-sm">100积分</Text>
                <div className="text-xs text-gray-500">概率: 25%</div>
              </div>
              
              <div className="p-3 bg-red-50 rounded-lg text-center">
                <div className="text-2xl mb-1">⭐</div>
                <Text strong className="text-sm">200积分</Text>
                <div className="text-xs text-gray-500">概率: 10%</div>
              </div>
              
              <div className="p-3 bg-yellow-50 rounded-lg text-center">
                <div className="text-2xl mb-1">🚬</div>
                <Text strong className="text-sm">高端雪茄</Text>
                <div className="text-xs text-gray-500">概率: 4%</div>
              </div>
              
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-2xl mb-1">🎁</div>
                <Text strong className="text-sm">雪茄配件</Text>
                <div className="text-xs text-gray-500">概率: 1%</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GamificationPage;
