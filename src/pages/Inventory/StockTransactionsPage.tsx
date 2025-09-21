import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Input, 
  Select, 
  Space, 
  Tag, 
  Typography, 
  Modal, 
  Form, 
  InputNumber,
  DatePicker,
  Row,
  Col,
  Statistic,
  Tabs,
  App,
  Tooltip
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
  EditOutlined,
  HistoryOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  StockOutlined,
  SwapOutlined,
  ImportOutlined,
  ExportOutlined,
  FilterOutlined
} from '@ant-design/icons';
import { useInventoryStore } from '@/stores/inventoryStore';
import { StockTransaction, TransactionType } from '@/types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const StockTransactionsPage: React.FC = () => {
  const { message: messageApi } = App.useApp();
  const { stockTransactions, isLoading, fetchStockTransactions, createStockTransaction } = useInventoryStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [transactionType, setTransactionType] = useState<TransactionType | 'all'>('all');
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<StockTransaction | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStockTransactions();
  }, [fetchStockTransactions]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchStockTransactions({ searchTerm: value });
  };

  const handleTypeFilter = (value: TransactionType | 'all') => {
    setTransactionType(value);
    fetchStockTransactions({ 
      type: value === 'all' ? undefined : value 
    });
  };

  const handleDateRangeChange = (dates: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    setDateRange(dates);
    if (dates) {
      fetchStockTransactions({
        startDate: dates[0].toDate(),
        endDate: dates[1].toDate()
      });
    } else {
      fetchStockTransactions();
    }
  };

  const handleCreateTransaction = () => {
    setEditingTransaction(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditTransaction = (transaction: StockTransaction) => {
    setEditingTransaction(transaction);
    form.setFieldsValue({
      ...transaction,
      date: dayjs(transaction.date)
    });
    setIsModalVisible(true);
  };

  const handleModalSubmit = async (values: any) => {
    try {
      const transactionData = {
        ...values,
        date: values.date.toDate(),
        id: editingTransaction?.id || undefined
      };

      await createStockTransaction(transactionData);
      messageApi.success(editingTransaction ? '交易记录更新成功' : '交易记录创建成功');
      setIsModalVisible(false);
      fetchStockTransactions();
    } catch (error) {
      messageApi.error('操作失败，请重试');
    }
  };

  const getTransactionTypeConfig = (type: TransactionType) => {
    const configs = {
      purchase: { label: '采购入库', color: 'green', icon: <ImportOutlined /> },
      sale: { label: '销售出库', color: 'blue', icon: <ExportOutlined /> },
      transfer: { label: '库存调拨', color: 'orange', icon: <SwapOutlined /> },
      adjustment: { label: '库存调整', color: 'purple', icon: <EditOutlined /> },
      loss: { label: '损耗报损', color: 'red', icon: <CaretDownOutlined /> },
      return: { label: '退货入库', color: 'cyan', icon: <CaretUpOutlined /> }
    };
    return configs[type] || { label: type, color: 'default', icon: <StockOutlined /> };
  };

  const columns = [
    {
      title: '交易时间',
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      sorter: (a: StockTransaction, b: StockTransaction) => 
        new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: '交易类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: TransactionType) => {
        const config = getTransactionTypeConfig(type);
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.label}
          </Tag>
        );
      },
      filters: [
        { text: '采购入库', value: 'purchase' },
        { text: '销售出库', value: 'sale' },
        { text: '库存调拨', value: 'transfer' },
        { text: '库存调整', value: 'adjustment' },
        { text: '损耗报损', value: 'loss' },
        { text: '退货入库', value: 'return' },
      ],
      onFilter: (value: string, record: StockTransaction) => record.type === value,
    },
    {
      title: '雪茄品牌',
      dataIndex: 'cigarBrand',
      key: 'cigarBrand',
    },
    {
      title: '雪茄型号',
      dataIndex: 'cigarModel',
      key: 'cigarModel',
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number) => (
        <Text strong={quantity > 0 ? true : false} type={quantity > 0 ? 'success' : 'danger'}>
          {quantity > 0 ? '+' : ''}{quantity}
        </Text>
      ),
      sorter: (a: StockTransaction, b: StockTransaction) => a.quantity - b.quantity,
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price: number) => price ? `¥${price.toLocaleString()}` : '-',
      sorter: (a: StockTransaction, b: StockTransaction) => (a.unitPrice || 0) - (b.unitPrice || 0),
    },
    {
      title: '总金额',
      key: 'totalAmount',
      render: (record: StockTransaction) => {
        const total = (record.quantity || 0) * (record.unitPrice || 0);
        return total > 0 ? `¥${total.toLocaleString()}` : '-';
      },
      sorter: (a: StockTransaction, b: StockTransaction) => {
        const totalA = (a.quantity || 0) * (a.unitPrice || 0);
        const totalB = (b.quantity || 0) * (b.unitPrice || 0);
        return totalA - totalB;
      },
    },
    {
      title: '操作员',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '备注',
      dataIndex: 'notes',
      key: 'notes',
      ellipsis: true,
      render: (text: string) => (
        <Tooltip title={text}>
          {text || '-'}
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'actions',
      render: (record: StockTransaction) => (
        <Space>
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => handleEditTransaction(record)}
          />
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            onClick={() => handleEditTransaction(record)}
          />
        </Space>
      ),
    },
  ];

  // 计算统计数据
  const getStatistics = () => {
    const today = dayjs().startOf('day');
    const thisMonth = dayjs().startOf('month');
    
    const todayTransactions = stockTransactions.filter(t => 
      dayjs(t.date).isSame(today, 'day')
    );
    
    const monthTransactions = stockTransactions.filter(t => 
      dayjs(t.date).isSame(thisMonth, 'month')
    );

    const purchaseTransactions = monthTransactions.filter(t => t.type === 'purchase');
    const saleTransactions = monthTransactions.filter(t => t.type === 'sale');

    const todayTotal = todayTransactions.reduce((sum, t) => 
      sum + ((t.quantity || 0) * (t.unitPrice || 0)), 0
    );

    const monthPurchaseTotal = purchaseTransactions.reduce((sum, t) => 
      sum + ((t.quantity || 0) * (t.unitPrice || 0)), 0
    );

    const monthSaleTotal = saleTransactions.reduce((sum, t) => 
      sum + ((t.quantity || 0) * (t.unitPrice || 0)), 0
    );

    return {
      todayTotal,
      monthPurchaseTotal,
      monthSaleTotal,
      totalTransactions: stockTransactions.length
    };
  };

  const statistics = getStatistics();

  const tabItems = [
    {
      key: 'transactions',
      label: (
        <span>
          <HistoryOutlined />
          交易记录
        </span>
      ),
      children: (
        <Table
          columns={columns}
          dataSource={stockTransactions}
          rowKey="id"
          loading={isLoading}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条记录`,
          }}
          scroll={{ x: 1200 }}
        />
      ),
    },
    {
      key: 'analytics',
      label: (
        <span>
          <TrendingUpOutlined />
          交易分析
        </span>
      ),
      children: (
        <div className="space-y-6">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="今日交易总额"
                  value={statistics.todayTotal}
                  prefix="¥"
                  precision={0}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="本月采购总额"
                  value={statistics.monthPurchaseTotal}
                  prefix="¥"
                  precision={0}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="本月销售总额"
                  value={statistics.monthSaleTotal}
                  prefix="¥"
                  precision={0}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="总交易笔数"
                  value={statistics.totalTransactions}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>
          
          <Card title="交易类型分布">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {['purchase', 'sale', 'transfer', 'adjustment', 'loss', 'return'].map(type => {
                const count = stockTransactions.filter(t => t.type === type).length;
                const config = getTransactionTypeConfig(type as TransactionType);
                return (
                  <div key={type} className="text-center p-4 border rounded-lg">
                    <div className="text-2xl mb-2">{config.icon}</div>
                    <div className="font-medium">{config.label}</div>
                    <div className="text-lg font-bold">{count}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">库存交易</Title>
          <Text type="secondary">管理雪茄库存的采购、销售、调拨等交易记录</Text>
        </div>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleCreateTransaction}
        >
          新增交易
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} lg={6}>
            <Input
              placeholder="搜索品牌、型号、操作员..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="交易类型"
              value={transactionType}
              onChange={handleTypeFilter}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="all">全部类型</Option>
              <Option value="purchase">采购入库</Option>
              <Option value="sale">销售出库</Option>
              <Option value="transfer">库存调拨</Option>
              <Option value="adjustment">库存调整</Option>
              <Option value="loss">损耗报损</Option>
              <Option value="return">退货入库</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} lg={6}>
            <RangePicker
              value={dateRange}
              onChange={handleDateRangeChange}
              style={{ width: '100%' }}
              placeholder={['开始日期', '结束日期']}
            />
          </Col>
          <Col xs={24} sm={24} lg={8}>
            <Space>
              <Button icon={<FilterOutlined />}>
                高级筛选
              </Button>
              <Button onClick={() => {
                setSearchTerm('');
                setTransactionType('all');
                setDateRange(null);
                fetchStockTransactions();
              }}>
                重置筛选
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Content */}
      <Card>
        <Tabs
          defaultActiveKey="transactions"
          items={tabItems}
          size="large"
        />
      </Card>

      {/* Transaction Modal */}
      <Modal
        title={editingTransaction ? '编辑交易记录' : '新增交易记录'}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleModalSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="交易类型"
                rules={[{ required: true, message: '请选择交易类型' }]}
              >
                <Select placeholder="选择交易类型">
                  <Option value="purchase">采购入库</Option>
                  <Option value="sale">销售出库</Option>
                  <Option value="transfer">库存调拨</Option>
                  <Option value="adjustment">库存调整</Option>
                  <Option value="loss">损耗报损</Option>
                  <Option value="return">退货入库</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="date"
                label="交易时间"
                rules={[{ required: true, message: '请选择交易时间' }]}
              >
                <DatePicker 
                  showTime 
                  style={{ width: '100%' }}
                  placeholder="选择交易时间"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="cigarBrand"
                label="雪茄品牌"
                rules={[{ required: true, message: '请输入雪茄品牌' }]}
              >
                <Input placeholder="输入雪茄品牌" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="cigarModel"
                label="雪茄型号"
                rules={[{ required: true, message: '请输入雪茄型号' }]}
              >
                <Input placeholder="输入雪茄型号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="quantity"
                label="数量"
                rules={[{ required: true, message: '请输入数量' }]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="输入数量"
                  min={-9999}
                  max={9999}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="unitPrice"
                label="单价 (元)"
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="输入单价"
                  min={0}
                  precision={2}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="operator"
                label="操作员"
                rules={[{ required: true, message: '请输入操作员' }]}
              >
                <Input placeholder="输入操作员姓名" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="location"
                label="仓库位置"
              >
                <Input placeholder="输入仓库位置" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="notes"
            label="备注"
          >
            <Input.TextArea 
              rows={3} 
              placeholder="输入备注信息"
            />
          </Form.Item>

          <Form.Item className="mb-0">
            <Space className="w-full justify-end">
              <Button onClick={() => setIsModalVisible(false)}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingTransaction ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StockTransactionsPage;
