import React, { useEffect, useState } from 'react';
import { 
  Row, 
  Col, 
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
  Upload,
  App,
  Tooltip,
  Badge,
  Tabs
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  StockOutlined,
  HistoryOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { useInventory, useInventoryActions } from '@/stores/inventoryStore';
import { Cigar } from '@/types';
import { CIGAR_CATEGORIES } from '@/config/constants';
import PriceHistoryPage from './PriceHistoryPage';
import StockTransactionsPage from './StockTransactionsPage';

const { Title, Text } = Typography;
const { Option } = Select;

const InventoryPage: React.FC = () => {
  const { cigars, isLoading, error, pagination, filters } = useInventory();
  const { message } = App.useApp();
  const { 
    loadCigars, 
    createCigar, 
    updateCigar, 
    deleteCigar, 
    setFilters, 
    clearFilters,
    clearError 
  } = useInventoryActions();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBrand, setSelectedBrand] = useState<string | undefined>();
  const [selectedOrigin, setSelectedOrigin] = useState<string | undefined>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCigar, setEditingCigar] = useState<Cigar | null>(null);
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('cigars');

  useEffect(() => {
    loadCigars();
  }, []);

  useEffect(() => {
    if (error) {
      message.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ searchTerm: value });
    loadCigars(1, { searchTerm: value });
  };

  const handleBrandFilter = (value: string | undefined) => {
    setSelectedBrand(value);
    setFilters({ brand: value });
    loadCigars(1, { brand: value });
  };

  const handleOriginFilter = (value: string | undefined) => {
    setSelectedOrigin(value);
    setFilters({ origin: value });
    loadCigars(1, { origin: value });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedBrand(undefined);
    setSelectedOrigin(undefined);
    clearFilters();
    loadCigars();
  };

  const handleCreateCigar = () => {
    setEditingCigar(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEditCigar = (cigar: Cigar) => {
    setEditingCigar(cigar);
    form.setFieldsValue({
      ...cigar,
      createdAt: undefined,
      updatedAt: undefined,
    });
    setIsModalVisible(true);
  };

  const handleDeleteCigar = (cigar: Cigar) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除雪茄 "${cigar.name}" 吗？此操作不可撤销。`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteCigar(cigar.id);
          message.success('删除成功');
          loadCigars();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingCigar) {
        await updateCigar(editingCigar.id, values);
        message.success('更新成功');
      } else {
        await createCigar({
          ...values,
          currentStock: values.currentStock || 0,
          minStock: values.minStock || 5,
          isActive: true,
          tags: values.tags || [],
        });
        message.success('创建成功');
      }
      
      setIsModalVisible(false);
      form.resetFields();
      loadCigars();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const getStockStatus = (currentStock: number, minStock: number) => {
    if (currentStock === 0) {
      return { status: 'error', text: '缺货', color: 'red' };
    } else if (currentStock <= minStock) {
      return { status: 'warning', text: '库存不足', color: 'orange' };
    } else {
      return { status: 'success', text: '充足', color: 'green' };
    }
  };

  const columns = [
    {
      title: '雪茄信息',
      key: 'info',
      width: 300,
      render: (_: any, record: Cigar) => (
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
            {record.imageUrl ? (
              <img 
                src={record.imageUrl} 
                alt={record.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <StockOutlined className="text-2xl text-gray-400" />
            )}
          </div>
          <div>
            <div className="font-medium">{record.name}</div>
            <div className="text-sm text-gray-500">{record.brand}</div>
            <div className="text-xs text-gray-400">{record.origin}</div>
          </div>
        </div>
      ),
    },
    {
      title: '规格',
      key: 'specs',
      width: 120,
      render: (_: any, record: Cigar) => (
        <div className="text-sm">
          <div>{record.gaugeRing}环径</div>
          <div>{record.length}mm</div>
          <div>{record.size}</div>
        </div>
      ),
    },
    {
      title: '库存状态',
      key: 'stock',
      width: 120,
      render: (_: any, record: Cigar) => {
        const stockInfo = getStockStatus(record.currentStock, record.minStock);
        return (
          <div>
            <Badge 
              status={stockInfo.status as any}
              text={`${record.currentStock}支`}
            />
            <div className="text-xs text-gray-500">
              最低: {record.minStock}支
            </div>
          </div>
        );
      },
    },
    {
      title: '价格',
      key: 'price',
      width: 150,
      render: (_: any, record: Cigar) => (
        <div className="text-sm">
          <div className="font-medium">¥{record.retailPrice}</div>
          <div className="text-gray-500">成本: ¥{record.purchasePrice}</div>
          {record.giftPrice && (
            <div className="text-blue-500">礼品: ¥{record.giftPrice}</div>
          )}
        </div>
      ),
    },
    {
      title: '包装类型',
      key: 'packing',
      width: 100,
      render: (_: any, record: Cigar) => (
        <Tag color={record.packingType === 'box' ? 'blue' : record.packingType === 'tube' ? 'green' : 'orange'}>
          {record.packingType === 'box' ? '盒装' : record.packingType === 'tube' ? '管装' : '散装'}
        </Tag>
      ),
    },
    {
      title: '年份',
      key: 'year',
      width: 80,
      render: (_: any, record: Cigar) => (
        <Tag color="purple">{record.agingYear}</Tag>
      ),
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      render: (_: any, record: Cigar) => (
        <Tag color={record.isActive ? 'green' : 'red'}>
          {record.isActive ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: Cigar) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />}
              size="small"
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button 
              type="text" 
              icon={<EditOutlined />}
              size="small"
              onClick={() => handleEditCigar(record)}
            />
          </Tooltip>
          <Tooltip title="价格历史">
            <Button 
              type="text" 
              icon={<HistoryOutlined />}
              size="small"
            />
          </Tooltip>
          <Tooltip title="删除">
            <Button 
              type="text" 
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => handleDeleteCigar(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 雪茄库存标签内容
  const CigarInventoryContent = () => (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} md={6}>
            <Input
              placeholder="搜索雪茄名称..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="选择品牌"
              value={selectedBrand}
              onChange={handleBrandFilter}
              allowClear
              className="w-full"
            >
              <Option value="古巴">古巴</Option>
              <Option value="多米尼加">多米尼加</Option>
              <Option value="尼加拉瓜">尼加拉瓜</Option>
              <Option value="洪都拉斯">洪都拉斯</Option>
            </Select>
          </Col>
          <Col xs={24} sm={8} md={4}>
            <Select
              placeholder="选择产地"
              value={selectedOrigin}
              onChange={handleOriginFilter}
              allowClear
              className="w-full"
            >
              {CIGAR_CATEGORIES.ORIGINS.map(origin => (
                <Option key={origin} value={origin}>{origin}</Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} sm={24} md={4}>
            <Space>
              <Button onClick={handleClearFilters}>清除筛选</Button>
              <Button icon={<UploadOutlined />}>批量导入</Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* Inventory Table */}
      <Card>
        <Table
          columns={columns}
          dataSource={cigars}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: pagination.page,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => 
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, _pageSize) => {
              loadCigars(page, filters);
            },
          }}
          scroll={{ x: 1200 }}
        />
      </Card>
    </div>
  );

  // 标签配置
  const tabItems = [
    {
      key: 'cigars',
      label: (
        <span>
          <StockOutlined />
          雪茄库存
        </span>
      ),
      children: <CigarInventoryContent />,
    },
    {
      key: 'price-history',
      label: (
        <span>
          <HistoryOutlined />
          价格历史
        </span>
      ),
      children: <PriceHistoryPage />,
    },
    {
      key: 'stock-transactions',
      label: (
        <span>
          <SwapOutlined />
          库存交易
        </span>
      ),
      children: <StockTransactionsPage />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">库存管理</Title>
          <Text type="secondary">管理您的雪茄库存和价格信息</Text>
        </div>
        {activeTab === 'cigars' && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleCreateCigar}
          >
            添加雪茄
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Card>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          size="large"
        />
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        title={editingCigar ? '编辑雪茄' : '添加雪茄'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          className="mt-4"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="brand"
                label="品牌"
                rules={[{ required: true, message: '请输入品牌' }]}
              >
                <Input placeholder="请输入品牌" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="name"
                label="名称"
                rules={[{ required: true, message: '请输入名称' }]}
              >
                <Input placeholder="请输入名称" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="origin"
                label="产地"
                rules={[{ required: true, message: '请选择产地' }]}
              >
                <Select placeholder="请选择产地">
                  {CIGAR_CATEGORIES.ORIGINS.map(origin => (
                    <Option key={origin} value={origin}>{origin}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="agingYear"
                label="陈年"
                rules={[{ required: true, message: '请输入陈年年份' }]}
              >
                <Select placeholder="请选择年份">
                  {CIGAR_CATEGORIES.AGING_YEARS.map(year => (
                    <Option key={year} value={year}>{year}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="packingType"
                label="包装类型"
                rules={[{ required: true, message: '请选择包装类型' }]}
              >
                <Select placeholder="请选择包装类型">
                  <Option value="box">盒装</Option>
                  <Option value="tube">管装</Option>
                  <Option value="loose">散装</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="gaugeRing"
                label="环径"
                rules={[{ required: true, message: '请输入环径' }]}
              >
                <InputNumber 
                  placeholder="环径" 
                  min={30} 
                  max={70} 
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="length"
                label="长度 (mm)"
                rules={[{ required: true, message: '请输入长度' }]}
              >
                <InputNumber 
                  placeholder="长度" 
                  min={100} 
                  max={300} 
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="currentStock"
                label="当前库存"
                rules={[{ required: true, message: '请输入当前库存' }]}
              >
                <InputNumber 
                  placeholder="库存" 
                  min={0} 
                  className="w-full"
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="minStock"
                label="最低库存"
                rules={[{ required: true, message: '请输入最低库存' }]}
              >
                <InputNumber 
                  placeholder="最低库存" 
                  min={0} 
                  className="w-full"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="purchasePrice"
                label="采购价格"
                rules={[{ required: true, message: '请输入采购价格' }]}
              >
                <InputNumber 
                  placeholder="采购价格" 
                  min={0} 
                  precision={2}
                  className="w-full"
                  prefix="¥"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="retailPrice"
                label="零售价格"
                rules={[{ required: true, message: '请输入零售价格' }]}
              >
                <InputNumber 
                  placeholder="零售价格" 
                  min={0} 
                  precision={2}
                  className="w-full"
                  prefix="¥"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="giftPrice"
                label="礼品价格"
              >
                <InputNumber 
                  placeholder="礼品价格" 
                  min={0} 
                  precision={2}
                  className="w-full"
                  prefix="¥"
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea 
              placeholder="请输入雪茄描述" 
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="图片"
          >
            <Upload
              listType="picture-card"
              maxCount={1}
              beforeUpload={() => false}
            >
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>上传图片</div>
              </div>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InventoryPage;
