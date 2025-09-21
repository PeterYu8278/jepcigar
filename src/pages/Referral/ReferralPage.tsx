import React from 'react';
import { Card, Typography, Button, Tag } from 'antd';
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

      <Card title="我的推荐" className="hover-lift">
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-4 gap-4">
          <div className="p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <UserOutlined className="text-blue-500" />
              <Text strong>推荐总数</Text>
            </div>
            <div className="text-2xl font-bold text-blue-600">23</div>
            <div className="text-sm text-gray-600">累计推荐人数</div>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrophyOutlined className="text-green-500" />
              <Text strong>成功转换</Text>
            </div>
            <div className="text-2xl font-bold text-green-600">18</div>
            <div className="text-sm text-gray-600">完成首次购买</div>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <GiftOutlined className="text-orange-500" />
              <Text strong>获得积分</Text>
            </div>
            <div className="text-2xl font-bold text-orange-600">9,000</div>
            <div className="text-sm text-gray-600">累计奖励积分</div>
          </div>
          
          <div className="p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrophyOutlined className="text-purple-500" />
              <Text strong>转换率</Text>
            </div>
            <div className="text-2xl font-bold text-purple-600">78.3%</div>
            <div className="text-sm text-gray-600">推荐成功率</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="我的推荐链接" className="hover-lift">
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <Text strong>推荐链接</Text>
              <Tag color="blue">活跃</Tag>
            </div>
            <Text code className="text-sm">
              https://jepcigar.com/ref/ABC123
            </Text>
            <div className="mt-2 text-sm text-gray-500">
              通过此链接注册: 23人 | 转换成功: 18人
            </div>
            <div className="mt-4 space-x-2">
              <Button size="small" type="primary">复制链接</Button>
              <Button size="small">分享</Button>
              <Button size="small">重新生成</Button>
            </div>
          </div>
        </Card>

        
          <Card title="推荐奖励规则" className="hover-lift">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg">
                <div>
                  <Text strong>成功推荐朋友</Text>
                  <div className="text-sm text-gray-600">朋友完成首次购买</div>
                  <Tag color="gold">500积分</Tag>
                </div>
                
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                <div>
                  <Text strong>推荐活动参与者</Text>
                  <div className="text-sm text-gray-600">朋友参加品鉴会</div>
                  <Tag color="purple">200积分</Tag>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
                <div>
                  <Text strong>连续推荐奖励</Text>
                  <div className="text-sm text-gray-600">每月推荐超过5人</div>
                  <Tag color="green">1000积分</Tag>
                </div>
              </div>
            </div>
          </Card>
      </div>
    </div>
  );
};

export default ReferralPage;
