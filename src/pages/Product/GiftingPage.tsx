import React from 'react';
import { Card, Typography, Button, Space, Tag, Row, Col, Table } from 'antd';
import { GiftOutlined, PlusOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const GiftingPage: React.FC = () => {
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
          <Button type="text" icon={<EyeOutlined />} size="small" />
          <Button type="text" icon={<EditOutlined />} size="small" />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={3} className="mb-0">礼品定制</Title>
          <Text type="secondary">为特殊场合定制专属雪茄礼品</Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />}>
          创建礼品订单
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
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
        </Col>

        <Col xs={24} lg={8}>
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
        </Col>

        <Col xs={24} lg={8}>
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
        </Col>
      </Row>

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

export default GiftingPage;
