import React from 'react';
import { Card, Typography, Button, Space, Tag, Statistic, Table } from 'antd';
import { BarChartOutlined, DownloadOutlined, PrinterOutlined, FileTextOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AnalyticsPage: React.FC = () => {
  const salesData = [
    {
      id: '1',
      customer: '张先生',
      items: '古巴雪茄套装',
      amount: 2580,
      date: '2024-01-15',
      status: 'paid',
    },
    {
      id: '2',
      customer: '李女士',
      items: '多米尼加雪茄',
      amount: 1850,
      date: '2024-01-14',
      status: 'paid',
    },
  ];

  const columns = [
    {
      title: '客户',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: '商品',
      dataIndex: 'items',
      key: 'items',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => `¥${amount.toLocaleString()}`,
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'paid' ? 'green' : status === 'pending' ? 'orange' : 'red'}>
          {status === 'paid' ? '已支付' : status === 'pending' ? '待支付' : '已取消'}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">分析报告</Title>
          <Text type="secondary">业务数据和财务分析</Text>
        </div>
        <Space>
          <Button icon={<DownloadOutlined />}>导出报告</Button>
          <Button icon={<PrinterOutlined />}>打印报告</Button>
        </Space>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-4 gap-4">
        <Card className="hover-lift">
          <Statistic
            title="本月销售"
            value={125680}
            prefix="¥"
            precision={0}
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
        <Card className="hover-lift">
          <Statistic
            title="本月订单"
            value={89}
            valueStyle={{ color: '#1890ff' }}
          />
        </Card>
        <Card className="hover-lift">
          <Statistic
            title="活跃客户"
            value={1247}
            valueStyle={{ color: '#722ed1' }}
          />
        </Card>
        <Card className="hover-lift">
          <Statistic
            title="平均订单价值"
            value={1412}
            prefix="¥"
            precision={0}
            valueStyle={{ color: '#f16d1f' }}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="销售趋势" className="hover-lift">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChartOutlined className="text-4xl text-gray-400 mb-2" />
              <Text type="secondary">销售趋势图表</Text>
              <div className="text-xs text-gray-400 mt-1">
                (集成Chart.js图表库)
              </div>
            </div>
          </div>
        </Card>

        <Card title="客户分布" className="hover-lift">
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChartOutlined className="text-4xl text-gray-400 mb-2" />
              <Text type="secondary">客户分布图表</Text>
              <div className="text-xs text-gray-400 mt-1">
                (集成Chart.js图表库)
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card title="最近销售" className="hover-lift">
            <Table
              columns={columns}
              dataSource={salesData}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </div>

        <Card title="财务报表" className="hover-lift">
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="flex justify-between items-center">
                <Text strong>本月收入</Text>
                <Text strong className="text-green-600">¥125,680</Text>
              </div>
            </div>
            
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="flex justify-between items-center">
                <Text strong>本月成本</Text>
                <Text strong className="text-red-600">¥75,408</Text>
              </div>
            </div>
            
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <Text strong>毛利润</Text>
                <Text strong className="text-blue-600">¥50,272</Text>
              </div>
            </div>
            
            <div className="p-3 bg-purple-50 rounded-lg">
              <div className="flex justify-between items-center">
                <Text strong>利润率</Text>
                <Text strong className="text-purple-600">40.0%</Text>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card title="发票管理" className="hover-lift">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <FileTextOutlined className="text-blue-500" />
              <h4 className="font-medium">发票生成</h4>
            </div>
            <Text type="secondary">
              自动生成专业发票，包含客户信息、商品详情和税务信息
            </Text>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <BarChartOutlined className="text-green-500" />
              <h4 className="font-medium">销售分析</h4>
            </div>
            <Text type="secondary">
              详细的销售数据分析，包括趋势、客户行为和产品表现
            </Text>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DownloadOutlined className="text-purple-500" />
              <h4 className="font-medium">报告导出</h4>
            </div>
            <Text type="secondary">
              支持多种格式导出财务报表和业务分析报告
            </Text>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
