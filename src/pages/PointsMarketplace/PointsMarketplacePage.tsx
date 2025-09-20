import React from 'react';
import { Card, Typography, Button, Tag, Row, Col, Table, Modal } from 'antd';
import { GiftOutlined, ShoppingCartOutlined, StarOutlined, TrophyOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const PointsMarketplacePage: React.FC = () => {
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
    // TODO: Implement redemption logic

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
          icon={<ShoppingCartOutlined />}
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
          <Title level={2} className="mb-0">积分商城</Title>
          <Text type="secondary">使用积分兑换精美礼品和专属体验</Text>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-500">1,250</div>
          <div className="text-sm text-gray-500">可用积分</div>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="积分商城" className="hover-lift">
            <Table
              columns={marketplaceColumns}
              dataSource={marketplaceItems}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="积分统计" className="hover-lift mb-4">
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
              <Button block icon={<StarOutlined />}>
                兑换体验
              </Button>
              <Button block icon={<TrophyOutlined />}>
                兑换转盘机会
              </Button>
            </div>
          </Card>
        </Col>
      </Row>

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
              <ShoppingCartOutlined className="text-green-500" />
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
              <TrophyOutlined className="text-purple-500" />
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

export default PointsMarketplacePage;
