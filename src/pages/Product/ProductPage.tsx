import React, { useState } from 'react';
import { Card, Tabs, Typography, Button, Space, Tag, Table, Modal, Progress, Select } from 'antd';
import { 
  GiftOutlined, 
  BookOutlined, 
  ShoppingOutlined, 
  BulbOutlined,
  PlusOutlined,
  SearchOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;

const ProductPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('gifting');

  // 礼品定制内容 - 恢复原本UI
  const GiftingContent = () => {
    const giftOrders = [
      {
        id: '1',
        recipientName: '张先生',
        occasion: '生日庆祝',
        status: 'preparing',
        totalAmount: 2580,
        deliveryDate: '2024-01-15',
      },
      {
        id: '2',
        recipientName: '李女士',
        occasion: '商务礼品',
        status: 'shipped',
        totalAmount: 1850,
        deliveryDate: '2024-01-12',
      },
    ];

    const columns = [
      {
        title: '收件人',
        dataIndex: 'recipientName',
        key: 'recipientName',
      },
      {
        title: '礼品场合',
        dataIndex: 'occasion',
        key: 'occasion',
        render: (occasion: string) => <Tag color="blue">{occasion}</Tag>,
      },
      {
        title: '金额',
        dataIndex: 'totalAmount',
        key: 'totalAmount',
        render: (amount: number) => `¥${amount.toLocaleString()}`,
      },
      {
        title: '配送日期',
        dataIndex: 'deliveryDate',
        key: 'deliveryDate',
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (status: string) => {
          const statusMap = {
            pending: { color: 'orange', text: '待处理' },
            preparing: { color: 'blue', text: '准备中' },
            shipped: { color: 'green', text: '已发货' },
            delivered: { color: 'green', text: '已送达' },
            cancelled: { color: 'red', text: '已取消' },
          };
          const statusInfo = statusMap[status as keyof typeof statusMap];
          return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
        },
      },
      {
        title: '操作',
        key: 'action',
        render: () => (
          <Space size="small">
            <Button type="text" icon={<BulbOutlined />} size="small" />
            <Button type="text" icon={<PlusOutlined />} size="small" />
          </Space>
        ),
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Text type="secondary">为特殊场合定制专属雪茄礼品</Text>
          </div>
          <Button type="primary" icon={<PlusOutlined />}>
            创建礼品订单
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card title="包装选项" className="hover-lift">
            <div className="space-y-3">
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <Text strong>标准包装</Text>
                  <Tag color="green">免费</Tag>
                </div>
                <Text type="secondary" className="text-sm">
                  精美礼品盒包装，适合日常礼品
                </Text>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <Text strong>高级包装</Text>
                  <Tag color="blue">¥50</Tag>
                </div>
                <Text type="secondary" className="text-sm">
                  木质礼品盒配丝带，适合商务礼品
                </Text>
              </div>
              
              <div className="p-3 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <Text strong>奢华包装</Text>
                  <Tag color="purple">¥150</Tag>
                </div>
                <Text type="secondary" className="text-sm">
                  定制礼盒配证书，适合特殊场合
                </Text>
              </div>
            </div>
          </Card>

          <Card title="礼品推荐" className="hover-lift">
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <GiftOutlined className="text-blue-500" />
                  <Text strong>商务礼品推荐</Text>
                </div>
                <Text type="secondary" className="text-sm">
                  古巴雪茄套装 + 高级包装 + 商务贺卡
                </Text>
                <div className="text-xs text-gray-500 mt-1">
                  推荐价格: ¥1,500 - ¥3,000
                </div>
              </div>
              
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <GiftOutlined className="text-green-500" />
                  <Text strong>生日庆祝推荐</Text>
                </div>
                <Text type="secondary" className="text-sm">
                  多米尼加雪茄 + 生日贺卡 + 个性化包装
                </Text>
                <div className="text-xs text-gray-500 mt-1">
                  推荐价格: ¥800 - ¥1,500
                </div>
              </div>
              
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <GiftOutlined className="text-purple-500" />
                  <Text strong>节日礼品推荐</Text>
                </div>
                <Text type="secondary" className="text-sm">
                  节日限定套装 + 节日包装 + 祝福贺卡
                </Text>
                <div className="text-xs text-gray-500 mt-1">
                  推荐价格: ¥1,200 - ¥2,500
                </div>
              </div>
            </div>
          </Card>

          <Card title="快速操作" className="hover-lift">
            <div className="space-y-3">
              <Button block icon={<PlusOutlined />}>
                创建新订单
              </Button>
              <Button block icon={<GiftOutlined />}>
                查看推荐模板
              </Button>
              <Button block>
                批量处理订单
              </Button>
              <Button block>
                导出订单报告
              </Button>
            </div>
          </Card>
        </div>

        <Card title="礼品订单" className="hover-lift">
          <Table
            columns={columns}
            dataSource={giftOrders}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>

        <Card title="礼品定制功能说明">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <GiftOutlined className="text-blue-500" />
                <h4 className="font-medium">智能推荐</h4>
              </div>
              <Text type="secondary">
                基于收件人偏好和场合，智能推荐合适的雪茄和包装
              </Text>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <GiftOutlined className="text-green-500" />
                <h4 className="font-medium">个性化定制</h4>
              </div>
              <Text type="secondary">
                支持个性化贺卡、包装和配送时间的定制
              </Text>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <GiftOutlined className="text-purple-500" />
                <h4 className="font-medium">配送跟踪</h4>
              </div>
              <Text type="secondary">
                实时跟踪礼品配送状态，确保准时送达
              </Text>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // 雪茄学院内容 - 恢复原本UI
  const AcademyContent = () => {
    const courses = [
      {
        id: '1',
        title: '雪茄基础知识',
        category: 'etiquette',
        level: 'beginner',
        progress: 75,
        lessons: 8,
        completedLessons: 6,
        estimatedTime: 45,
        badges: 2,
      },
      {
        id: '2',
        title: '雪茄品鉴技巧',
        category: 'tasting',
        level: 'intermediate',
        progress: 30,
        lessons: 12,
        completedLessons: 4,
        estimatedTime: 90,
        badges: 1,
      },
      {
        id: '3',
        title: '雪茄搭配艺术',
        category: 'pairing',
        level: 'advanced',
        progress: 0,
        lessons: 15,
        completedLessons: 0,
        estimatedTime: 120,
        badges: 0,
      },
    ];

    const badges = [
      {
        id: '1',
        name: '初学者',
        description: '完成第一门课程',
        icon: '🎓',
        earned: true,
      },
      {
        id: '2',
        name: '品鉴师',
        description: '完成品鉴技巧课程',
        icon: '👃',
        earned: false,
      },
      {
        id: '3',
        name: '搭配专家',
        description: '掌握雪茄搭配艺术',
        icon: '🍽️',
        earned: false,
      },
    ];

    const getCategoryIcon = (category: string) => {
      switch (category) {
        case 'etiquette': return '🎩';
        case 'tasting': return '👃';
        case 'history': return '📚';
        case 'pairing': return '🍽️';
        default: return '📖';
      }
    };

    const getLevelColor = (level: string) => {
      switch (level) {
        case 'beginner': return 'green';
        case 'intermediate': return 'orange';
        case 'advanced': return 'red';
        default: return 'default';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Text type="secondary">学习雪茄知识，获得徽章和会员升级</Text>
          </div>
          <Button type="primary" icon={<BookOutlined />}>
            开始学习
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card title="我的课程" className="hover-lift">
              <div className="space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="text-3xl">{getCategoryIcon(course.category)}</div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <Title level={5} className="mb-0">{course.title}</Title>
                            <Tag color={getLevelColor(course.level)}>
                              {course.level === 'beginner' ? '初级' : 
                               course.level === 'intermediate' ? '中级' : '高级'}
                            </Tag>
                          </div>
                          <div className="text-sm text-gray-500">
                            {course.lessons} 课时 • 预计 {course.estimatedTime} 分钟
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500 mb-1">
                          {course.completedLessons}/{course.lessons} 已完成
                        </div>
                        <Progress 
                          percent={course.progress} 
                          size="small" 
                          status={course.progress === 100 ? 'success' : 'active'}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <GiftOutlined className="text-yellow-500" />
                          <span className="text-sm">{course.badges} 徽章</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <BookOutlined className="text-blue-500" />
                          <span className="text-sm">{course.completedLessons} 课时完成</span>
                        </div>
                      </div>
                      <Button type="primary" size="small">
                        {course.progress === 0 ? '开始学习' : course.progress === 100 ? '查看证书' : '继续学习'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="我的徽章" className="hover-lift">
              <div className="space-y-3">
                {badges.map(badge => (
                  <div key={badge.id} className={`p-3 rounded-lg ${badge.earned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
                    <div className="flex items-center space-x-3">
                      <div className={`text-2xl ${badge.earned ? '' : 'grayscale opacity-50'}`}>
                        {badge.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <Text strong className={badge.earned ? '' : 'text-gray-500'}>
                            {badge.name}
                          </Text>
                          {badge.earned && <GiftOutlined className="text-green-500" />}
                        </div>
                        <div className={`text-sm ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                          {badge.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="学习统计" className="hover-lift">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-500">3</div>
                  <div className="text-gray-600">已开始课程</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Text>总学习时长:</Text>
                    <Text strong>2小时15分钟</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>完成课程:</Text>
                    <Text strong>1门</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>获得徽章:</Text>
                    <Text strong>2个</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>积分奖励:</Text>
                    <Text strong>500分</Text>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <Card title="课程分类">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-4xl mb-2">🎩</div>
              <Title level={5} className="mb-2">雪茄礼仪</Title>
              <Text type="secondary" className="text-sm">
                学习正确的雪茄礼仪和社交场合的注意事项
              </Text>
              <div className="mt-3">
                <Tag color="blue">3门课程</Tag>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-4xl mb-2">👃</div>
              <Title level={5} className="mb-2">品鉴技巧</Title>
              <Text type="secondary" className="text-sm">
                掌握雪茄品鉴的专业技巧和感官体验
              </Text>
              <div className="mt-3">
                <Tag color="green">4门课程</Tag>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-4xl mb-2">📚</div>
              <Title level={5} className="mb-2">雪茄历史</Title>
              <Text type="secondary" className="text-sm">
                了解雪茄的历史文化和制作工艺
              </Text>
              <div className="mt-3">
                <Tag color="purple">2门课程</Tag>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
              <div className="text-4xl mb-2">🍽️</div>
              <Title level={5} className="mb-2">搭配艺术</Title>
              <Text type="secondary" className="text-sm">
                学习雪茄与饮品、食物的完美搭配
              </Text>
              <div className="mt-3">
                <Tag color="orange">3门课程</Tag>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  // 积分商城内容 - 恢复原本UI
  const MarketplaceContent = () => {
    const [isRedeemModalVisible, setIsRedeemModalVisible] = React.useState(false);
    const [selectedItem, setSelectedItem] = React.useState<any>(null);

    const marketplaceItems = [
      {
        id: '1',
        name: '雪茄剪',
        type: 'accessory',
        pointsCost: 500,
        cashValue: 150,
        description: '专业雪茄剪，精工制作',
        imageUrl: '/api/placeholder/200/150',
        stockQuantity: 10,
        isActive: true,
      },
      {
        id: '2',
        name: '雪茄保湿盒',
        type: 'accessory',
        pointsCost: 1200,
        cashValue: 380,
        description: '便携式雪茄保湿盒，保持湿度',
        imageUrl: '/api/placeholder/200/150',
        stockQuantity: 5,
        isActive: true,
      },
      {
        id: '3',
        name: '私人品鉴会体验',
        type: 'experience',
        pointsCost: 2000,
        cashValue: 800,
        description: '与雪茄大师一对一品鉴体验',
        imageUrl: '/api/placeholder/200/150',
        stockQuantity: 3,
        isActive: true,
      },
      {
        id: '4',
        name: '转盘机会',
        type: 'spin_chance',
        pointsCost: 50,
        cashValue: 10,
        description: '获得一次幸运转盘机会',
        imageUrl: '/api/placeholder/200/150',
        stockQuantity: 999,
        isActive: true,
      },
    ];

    const pointsTransactions = [
      {
        id: '1',
        type: 'earned',
        source: 'purchase',
        amount: 2580,
        balance: 1250,
        description: '购买古巴雪茄套装',
        date: '2024-01-15',
      },
      {
        id: '2',
        type: 'earned',
        source: 'referral',
        amount: 500,
        balance: 1730,
        description: '推荐朋友注册',
        date: '2024-01-14',
      },
      {
        id: '3',
        type: 'redeemed',
        source: 'marketplace',
        amount: -500,
        balance: 1230,
        description: '兑换雪茄剪',
        date: '2024-01-13',
      },
    ];

    const handleRedeem = (item: any) => {
      setSelectedItem(item);
      setIsRedeemModalVisible(true);
    };

    const handleConfirmRedeem = () => {
      setIsRedeemModalVisible(false);
    };

    const getItemTypeIcon = (type: string) => {
      switch (type) {
        case 'accessory': return '🎁';
        case 'experience': return '⭐';
        case 'spin_chance': return '🎰';
        case 'discount': return '🎫';
        default: return '🎁';
      }
    };

    const getTransactionTypeColor = (type: string) => {
      return type === 'earned' ? 'green' : type === 'redeemed' ? 'red' : 'blue';
    };

    const getTransactionTypeText = (type: string) => {
      switch (type) {
        case 'earned': return '获得';
        case 'redeemed': return '消费';
        case 'expired': return '过期';
        case 'bonus': return '奖励';
        default: return type;
      }
    };

    const getSourceText = (source: string) => {
      switch (source) {
        case 'purchase': return '购买';
        case 'referral': return '推荐';
        case 'event': return '活动';
        case 'spin': return '转盘';
        case 'marketplace': return '商城';
        case 'manual': return '手动';
        default: return source;
      }
    };

    const marketplaceColumns = [
      {
        title: '商品',
        key: 'item',
        width: 300,
        render: (_: any, record: any) => (
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">{getItemTypeIcon(record.type)}</span>
            </div>
            <div>
              <div className="font-medium">{record.name}</div>
              <div className="text-sm text-gray-500">{record.description}</div>
              <div className="text-xs text-gray-400">
                库存: {record.stockQuantity}件
              </div>
            </div>
          </div>
        ),
      },
      {
        title: '积分价格',
        dataIndex: 'pointsCost',
        key: 'pointsCost',
        width: 120,
        render: (points: number) => (
          <div className="text-center">
            <div className="text-lg font-bold text-primary-500">{points}</div>
            <div className="text-xs text-gray-500">积分</div>
          </div>
        ),
      },
      {
        title: '现金价值',
        dataIndex: 'cashValue',
        key: 'cashValue',
        width: 120,
        render: (value: number) => (
          <div className="text-center">
            <div className="text-sm text-gray-600">¥{value}</div>
            <div className="text-xs text-gray-500">等值</div>
          </div>
        ),
      },
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 100,
        render: (type: string) => {
          const typeMap = {
            accessory: { color: 'blue', text: '配件' },
            experience: { color: 'purple', text: '体验' },
            spin_chance: { color: 'orange', text: '转盘' },
            discount: { color: 'green', text: '折扣' },
          };
          const typeInfo = typeMap[type as keyof typeof typeMap];
          return <Tag color={typeInfo.color}>{typeInfo.text}</Tag>;
        },
      },
      {
        title: '操作',
        key: 'action',
        width: 120,
        render: (_: any, record: any) => (
          <Button
            type="primary"
            size="small"
            icon={<ShoppingOutlined />}
            onClick={() => handleRedeem(record)}
            disabled={!record.isActive || record.stockQuantity === 0}
          >
            兑换
          </Button>
        ),
      },
    ];

    const transactionColumns = [
      {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        width: 80,
        render: (type: string) => (
          <Tag color={getTransactionTypeColor(type)}>
            {getTransactionTypeText(type)}
          </Tag>
        ),
      },
      {
        title: '来源',
        dataIndex: 'source',
        key: 'source',
        width: 100,
        render: (source: string) => getSourceText(source),
      },
      {
        title: '描述',
        dataIndex: 'description',
        key: 'description',
      },
      {
        title: '积分变动',
        dataIndex: 'amount',
        key: 'amount',
        width: 120,
        render: (amount: number) => (
          <span className={amount > 0 ? 'text-green-600' : 'text-red-600'}>
            {amount > 0 ? '+' : ''}{amount}
          </span>
        ),
      },
      {
        title: '余额',
        dataIndex: 'balance',
        key: 'balance',
        width: 100,
        render: (balance: number) => (
          <span className="font-medium">{balance}</span>
        ),
      },
      {
        title: '日期',
        dataIndex: 'date',
        key: 'date',
        width: 120,
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <Text type="secondary">使用积分兑换精美礼品和专属体验</Text>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary-500">1,250</div>
            <div className="text-sm text-gray-500">可用积分</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card title="积分商城" className="hover-lift">
              <Table
                columns={marketplaceColumns}
                dataSource={marketplaceItems}
                rowKey="id"
                pagination={false}
                size="small"
              />
            </Card>
          </div>

          <div className="space-y-4">
            <Card title="积分统计" className="hover-lift">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-500">1,250</div>
                  <div className="text-gray-600">当前积分</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Text>本月获得:</Text>
                    <Text strong className="text-green-600">+3,080</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>本月消费:</Text>
                    <Text strong className="text-red-600">-500</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text>即将过期:</Text>
                    <Text strong className="text-orange-600">200</Text>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="快速兑换" className="hover-lift">
              <div className="space-y-3">
                <Button block icon={<GiftOutlined />}>
                  兑换配件
                </Button>
                <Button block icon={<GiftOutlined />}>
                  兑换体验
                </Button>
                <Button block icon={<GiftOutlined />}>
                  兑换转盘机会
                </Button>
              </div>
            </Card>
          </div>
        </div>

        <Card title="积分交易记录" className="hover-lift">
          <Table
            columns={transactionColumns}
            dataSource={pointsTransactions}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Card>

        <Card title="积分规则说明">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <GiftOutlined className="text-blue-500" />
                <h4 className="font-medium">获得积分</h4>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• 购买商品: 1元 = 1积分</div>
                <div>• 推荐朋友: +500积分</div>
                <div>• 参加活动: +100积分</div>
                <div>• 完成课程: +200积分</div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingOutlined className="text-green-500" />
                <h4 className="font-medium">使用积分</h4>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• 兑换配件和体验</div>
                <div>• 参与幸运转盘</div>
                <div>• 获得专属折扣</div>
                <div>• 升级会员等级</div>
              </div>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <GiftOutlined className="text-purple-500" />
                <h4 className="font-medium">积分规则</h4>
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <div>• 积分有效期: 12个月</div>
                <div>• 过期前30天提醒</div>
                <div>• 不可转让给他人</div>
                <div>• 不可兑换现金</div>
              </div>
            </div>
          </div>
        </Card>

        <Modal
          title="确认兑换"
          open={isRedeemModalVisible}
          onOk={handleConfirmRedeem}
          onCancel={() => setIsRedeemModalVisible(false)}
          okText="确认兑换"
          cancelText="取消"
        >
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">{getItemTypeIcon(selectedItem.type)}</span>
                </div>
                <div>
                  <div className="font-medium">{selectedItem.name}</div>
                  <div className="text-sm text-gray-500">{selectedItem.description}</div>
                </div>
              </div>
              
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <Text strong>需要积分:</Text>
                  <Text strong className="text-primary-500">{selectedItem.pointsCost} 积分</Text>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <Text>当前积分:</Text>
                  <Text>1,250 积分</Text>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <Text>兑换后余额:</Text>
                  <Text>{1250 - selectedItem.pointsCost} 积分</Text>
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                确认兑换此商品？兑换后将扣除相应积分，不可撤销。
              </div>
            </div>
          )}
        </Modal>
      </div>
    );
  };

  // AI推荐内容 - 恢复原本UI
  const RecommendationsContent = () => {
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
            <ShoppingOutlined className="text-2xl text-gray-400" />
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
                <Button size="small" icon={<GiftOutlined />}>
                  收藏
                </Button>
                <Button type="primary" size="small" icon={<ShoppingOutlined />}>
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
        <div className="flex justify-between items-center">
          <div>
            <Text type="secondary">基于您的偏好和历史记录，为您推荐最合适的雪茄</Text>
          </div>
          <Button type="primary" icon={<BulbOutlined />}>
            刷新推荐
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
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
              
              <Button type="primary" block>
                更新推荐
              </Button>
            </div>
          </Card>

          <div className="lg:col-span-3">
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

        <Card title="推荐历史" className="hover-lift">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <GiftOutlined className="text-yellow-500" />
                <Text strong>推荐准确率</Text>
              </div>
              <div className="text-2xl font-bold text-green-600">87%</div>
              <Text type="secondary" className="text-sm">基于用户反馈统计</Text>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <ShoppingOutlined className="text-blue-500" />
                <Text strong>推荐转化率</Text>
              </div>
              <div className="text-2xl font-bold text-blue-600">23%</div>
              <Text type="secondary" className="text-sm">推荐商品购买率</Text>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <BulbOutlined className="text-red-500" />
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

  const tabItems = [
    {
      key: 'gifting',
      label: (
        <span className="flex items-center space-x-2">
          <GiftOutlined />
          <span>礼品定制</span>
        </span>
      ),
      children: <GiftingContent />,
    },
    {
      key: 'academy',
      label: (
        <span className="flex items-center space-x-2">
          <BookOutlined />
          <span>雪茄学院</span>
        </span>
      ),
      children: <AcademyContent />,
    },
    {
      key: 'marketplace',
      label: (
        <span className="flex items-center space-x-2">
          <ShoppingOutlined />
          <span>积分商城</span>
        </span>
      ),
      children: <MarketplaceContent />,
    },
    {
      key: 'recommendations',
      label: (
        <span className="flex items-center space-x-2">
          <BulbOutlined />
          <span>AI推荐</span>
        </span>
      ),
      children: <RecommendationsContent />,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">产品中心</Title>
          <Text type="secondary">礼品定制、雪茄学院、积分商城、AI推荐</Text>
        </div>
        <Space>
          <Button icon={<SearchOutlined />}>搜索产品</Button>
          <Button type="primary" icon={<PlusOutlined />}>
            新增产品
          </Button>
        </Space>
      </div>

      <Card className="hover-lift">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
          tabBarStyle={{ marginBottom: '24px' }}
        />
      </Card>
    </div>
  );
};

export default ProductPage;
