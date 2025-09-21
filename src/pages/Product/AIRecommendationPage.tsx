import React, { useState } from 'react';
import { Card, Typography, Button, Space, Tag, Select, Tabs, Progress } from 'antd';
import { BulbOutlined, ShoppingCartOutlined, StarOutlined, HeartOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const AIRecommendationPage: React.FC = () => {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('business');
  const [selectedBudget, setSelectedBudget] = useState<number>(2000);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);

  const businessRecommendations = [
    {
      id: '1',
      name: '古巴蒙特克里斯托 No.2',
      brand: 'Montecristo',
      origin: '古巴',
      price: 2800,
      confidence: 95,
      reason: '适合商务场合的高端雪茄，包装精美，品质卓越',
      imageUrl: '/api/placeholder/200/150',
      tags: ['商务', '高端', '古巴'],
    },
    {
      id: '2',
      name: '多米尼加帕德龙 1964',
      brand: 'Padrón',
      origin: '多米尼加',
      price: 2200,
      confidence: 88,
      reason: '经典商务雪茄，口感平衡，适合各种商务场合',
      imageUrl: '/api/placeholder/200/150',
      tags: ['商务', '经典', '平衡'],
    },
  ];

  const personalRecommendations = [
    {
      id: '3',
      name: '尼加拉瓜阿图罗·富恩特',
      brand: 'Arturo Fuente',
      origin: '尼加拉瓜',
      price: 1500,
      confidence: 92,
      reason: '基于您的口味偏好推荐，口感丰富，适合个人享受',
      imageUrl: '/api/placeholder/200/150',
      tags: ['个人', '丰富', '享受'],
    },
    {
      id: '4',
      name: '洪都拉斯卡马乔',
      brand: 'Camacho',
      origin: '洪都拉斯',
      price: 1200,
      confidence: 85,
      reason: '符合您的预算范围，品质优良，性价比高',
      imageUrl: '/api/placeholder/200/150',
      tags: ['性价比', '优良', '预算'],
    },
  ];

  const giftRecommendations = [
    {
      id: '5',
      name: '生日庆祝雪茄套装',
      brand: '精选套装',
      origin: '多国',
      price: 1800,
      confidence: 90,
      reason: '专为生日庆祝设计，包含多种口味，包装精美',
      imageUrl: '/api/placeholder/200/150',
      tags: ['生日', '套装', '庆祝'],
    },
    {
      id: '6',
      name: '节日限定雪茄礼盒',
      brand: '节日限定',
      origin: '古巴',
      price: 2500,
      confidence: 87,
      reason: '节日限定款，具有收藏价值，适合特殊场合',
      imageUrl: '/api/placeholder/200/150',
      tags: ['节日', '限定', '收藏'],
    },
  ];

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'green';
    if (confidence >= 80) return 'orange';
    return 'red';
  };

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 90) return '高';
    if (confidence >= 80) return '中';
    return '低';
  };

  const RecommendationCard = ({ recommendation }: { recommendation: any }) => (
    <Card className="hover-lift">
      <div className="flex space-x-4">
        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
          <ShoppingCartOutlined className="text-2xl text-gray-400" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <Title level={5} className="mb-1">{recommendation.name}</Title>
              <Text type="secondary">{recommendation.brand} • {recommendation.origin}</Text>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-primary-500">¥{recommendation.price}</div>
              <div className="flex items-center space-x-1">
                <Progress 
                  percent={recommendation.confidence} 
                  size="small" 
                  showInfo={false}
                  strokeColor={getConfidenceColor(recommendation.confidence)}
                />
                <Text className="text-xs" style={{ color: getConfidenceColor(recommendation.confidence) }}>
                  {getConfidenceText(recommendation.confidence)}匹配
                </Text>
              </div>
            </div>
          </div>
          
          <div className="mb-3">
            <Text className="text-sm">{recommendation.reason}</Text>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex space-x-1">
              {recommendation.tags.map((tag: string, index: number) => (
                <Tag key={index}>{tag}</Tag>
              ))}
            </div>
            <Space>
              <Button size="small" icon={<HeartOutlined />}>
                收藏
              </Button>
              <Button type="primary" size="small" icon={<ShoppingCartOutlined />}>
                购买
              </Button>
            </Space>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* AI推荐设置和结果 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="推荐设置" className="hover-lift">
          <div className="space-y-4">
            <div>
              <Text strong className="block mb-2">使用场合</Text>
              <Select
                value={selectedOccasion}
                onChange={setSelectedOccasion}
                className="w-full"
              >
                <Option value="business">商务礼品</Option>
                <Option value="personal">个人享受</Option>
                <Option value="celebration">庆祝活动</Option>
                <Option value="collection">收藏投资</Option>
              </Select>
            </div>
            
            <div>
              <Text strong className="block mb-2">预算范围</Text>
              <Select
                value={selectedBudget}
                onChange={setSelectedBudget}
                className="w-full"
              >
                <Option value={500}>¥500 - ¥1000</Option>
                <Option value={1500}>¥1000 - ¥2000</Option>
                <Option value={2500}>¥2000 - ¥3000</Option>
                <Option value={5000}>¥3000+</Option>
              </Select>
            </div>
            
            <div>
              <Text strong className="block mb-2">口味偏好</Text>
              <Select
                mode="multiple"
                value={selectedPreferences}
                onChange={setSelectedPreferences}
                className="w-full"
                placeholder="选择您的口味偏好"
              >
                <Option value="mild">轻度</Option>
                <Option value="medium">中度</Option>
                <Option value="full">强度</Option>
                <Option value="woody">木香</Option>
                <Option value="fruity">果香</Option>
                <Option value="spicy">香料</Option>
                <Option value="chocolate">巧克力</Option>
                <Option value="coffee">咖啡</Option>
              </Select>
            </div>
            
            <Button type="primary" block icon={<BulbOutlined />}>
              更新推荐
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2">
          <Tabs 
            defaultActiveKey="business"
            items={[
              {
                key: 'business',
                label: '商务推荐',
                children: (
                  <div className="space-y-4">
                    {businessRecommendations.map((recommendation) => (
                      <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                    ))}
                  </div>
                ),
              },
              {
                key: 'personal',
                label: '个人享受',
                children: (
                  <div className="space-y-4">
                    {personalRecommendations.map((recommendation) => (
                      <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                    ))}
                  </div>
                ),
              },
              {
                key: 'gift',
                label: '礼品推荐',
                children: (
                  <div className="space-y-4">
                    {giftRecommendations.map((recommendation) => (
                      <RecommendationCard key={recommendation.id} recommendation={recommendation} />
                    ))}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* 推荐统计 */}
      <Card title="推荐效果统计" className="hover-lift">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <StarOutlined className="text-green-500" />
              <Text strong>推荐准确率</Text>
            </div>
            <div className="text-2xl font-bold text-green-600">87%</div>
            <Text type="secondary" className="text-sm">基于用户反馈统计</Text>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <ShoppingCartOutlined className="text-blue-500" />
              <Text strong>推荐转化率</Text>
            </div>
            <div className="text-2xl font-bold text-blue-600">23%</div>
            <Text type="secondary" className="text-sm">推荐商品购买率</Text>
          </div>
          
          <div className="p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <HeartOutlined className="text-red-500" />
              <Text strong>用户满意度</Text>
            </div>
            <div className="text-2xl font-bold text-red-600">4.6/5</div>
            <Text type="secondary" className="text-sm">推荐满意度评分</Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AIRecommendationPage;
