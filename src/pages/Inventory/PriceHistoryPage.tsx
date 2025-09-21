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
  Row,
  Col,
  Statistic,
  Tabs,
  Tooltip,
  DatePicker,
  Empty
} from 'antd';
import {
  SearchOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  HistoryOutlined,
  BarChartOutlined,
  FilterOutlined,
  ReloadOutlined
} from '@ant-design/icons';
// import { Line, Column, Area } from '@ant-design/plots'; // 暂时注释，等待图表库安装
import { useInventoryStore } from '@/stores/inventoryStore';
import { PriceHistory } from '@/types';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

const PriceHistoryPage: React.FC = () => {
  const { 
    priceHistory, 
    cigars,
    isLoading, 
    fetchPriceHistory, 
    fetchCigars,
  } = useInventoryStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCigar, setSelectedCigar] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [chartType, setChartType] = useState<'line' | 'column' | 'area'>('line');
  const [selectedTab, setSelectedTab] = useState('overview');

  useEffect(() => {
    fetchPriceHistory();
    fetchCigars();
  }, [fetchPriceHistory, fetchCigars]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    fetchPriceHistory({ 
      searchTerm: value,
      cigarId: selectedCigar,
      dateRange: dateRange ? [dateRange[0].toDate(), dateRange[1].toDate()] : undefined
    });
  };

  const handleCigarFilter = (value: string | undefined) => {
    setSelectedCigar(value);
    fetchPriceHistory({ 
      cigarId: value,
      searchTerm,
      dateRange: dateRange ? [dateRange[0].toDate(), dateRange[1].toDate()] : undefined
    });
  };

  const handleDateRangeChange = (dates: any) => {
    setDateRange(dates);
    fetchPriceHistory({
      dateRange: dates ? [dates[0].toDate(), dates[1].toDate()] : undefined,
      searchTerm,
      cigarId: selectedCigar
    });
  };

  const getPriceChangeConfig = (currentPrice: number, previousPrice: number) => {
    const change = currentPrice - previousPrice;
    const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0;
    
    if (change > 0) {
      return {
        color: '#cf1322',
        icon: <CaretUpOutlined />,
        text: `+¥${change.toFixed(2)} (+${changePercent.toFixed(1)}%)`
      };
    } else if (change < 0) {
      return {
        color: '#3f8600',
        icon: <CaretDownOutlined />,
        text: `¥${change.toFixed(2)} (${changePercent.toFixed(1)}%)`
      };
    } else {
      return {
        color: '#8c8c8c',
        icon: null,
        text: '无变化'
      };
    }
  };

  const columns = [
    {
      title: '记录时间',
      dataIndex: 'date',
      key: 'date',
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD HH:mm'),
      sorter: (a: PriceHistory, b: PriceHistory) => 
        new Date(a.date).getTime() - new Date(b.date).getTime(),
      defaultSortOrder: 'descend' as const,
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
      title: '价格类型',
      dataIndex: 'priceType',
      key: 'priceType',
      render: (type: string) => {
        const configs = {
          retail: { label: '零售价', color: 'blue' },
          wholesale: { label: '批发价', color: 'green' },
          cost: { label: '成本价', color: 'orange' },
          market: { label: '市场价', color: 'purple' }
        };
        const config = configs[type as keyof typeof configs] || { label: type, color: 'default' };
        return <Tag color={config.color}>{config.label}</Tag>;
      },
    },
    {
      title: '价格',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `¥${price.toLocaleString()}`,
      sorter: (a: PriceHistory, b: PriceHistory) => a.price - b.price,
    },
    {
      title: '价格变化',
      key: 'priceChange',
      render: (_: any, record: PriceHistory, index: number) => {
        if (index === 0) return '-';
        
        const currentPrice = record.price;
        const previousRecord = priceHistory.find(r => 
          r.cigarBrand === record.cigarBrand && 
          r.cigarModel === record.cigarModel &&
          r.priceType === record.priceType &&
          new Date(r.date) < new Date(record.date)
        );
        
        if (!previousRecord) return '-';
        
        const config = getPriceChangeConfig(currentPrice, previousRecord.price);
        return (
          <Text style={{ color: config.color }}>
            {config.icon} {config.text}
          </Text>
        );
      },
    },
    {
      title: '数据来源',
      dataIndex: 'source',
      key: 'source',
      render: (source: string) => source || '-',
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
  ];

  // 准备图表数据
  const prepareChartData = () => {
    const filteredData = priceHistory.filter(record => {
      if (selectedCigar && record.cigarId !== selectedCigar) return false;
      if (dateRange) {
        const recordDate = dayjs(record.date);
        if (!(recordDate.isAfter(dateRange[0]) || recordDate.isSame(dateRange[0])) || 
            !(recordDate.isBefore(dateRange[1]) || recordDate.isSame(dateRange[1]))) return false;
      }
      return true;
    });

    // 按雪茄型号和价格类型分组
    const groupedData = filteredData.reduce((acc, record) => {
      const key = `${record.cigarBrand} ${record.cigarModel} (${record.priceType})`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push({
        date: dayjs(record.date).format('MM-DD'),
        price: record.price,
        fullDate: record.date
      });
      return acc;
    }, {} as Record<string, any[]>);

    // 转换为图表数据格式
    const chartData = Object.entries(groupedData).map(([name, data]) => {
      return data.map(item => ({
        date: item.date,
        price: item.price,
        name,
        fullDate: item.fullDate
      }));
    }).flat().sort((a, b) => new Date(a.fullDate).getTime() - new Date(b.fullDate).getTime());

    return chartData;
  };

  const chartData = prepareChartData();

  // const chartConfig = {
  //   data: chartData,
  //   xField: 'date',
  //   yField: 'price',
  //   seriesField: 'name',
  //   smooth: true,
  //   animation: {
  //     appear: {
  //       animation: 'path-in',
  //       duration: 1000,
  //     },
  //   },
  //   tooltip: {
  //     formatter: (datum: any) => ({
  //       name: datum.name,
  //       value: `¥${datum.price.toLocaleString()}`,
  //     }),
  //   },
  //   legend: {
  //     position: 'top-right' as const,
  //   },
  // };

  // 计算统计数据
  const getStatistics = () => {
    const filteredData = priceHistory.filter(record => {
      if (selectedCigar && record.cigarId !== selectedCigar) return false;
      if (dateRange) {
        const recordDate = dayjs(record.date);
        if (!(recordDate.isAfter(dateRange[0]) || recordDate.isSame(dateRange[0])) || 
            !(recordDate.isBefore(dateRange[1]) || recordDate.isSame(dateRange[1]))) return false;
      }
      return true;
    });

    const currentMonth = dayjs().startOf('month');
    const lastMonth = dayjs().subtract(1, 'month').startOf('month');
    
    const currentMonthData = filteredData.filter(r => 
      dayjs(r.date).isSame(currentMonth, 'month')
    );
    
    const lastMonthData = filteredData.filter(r => 
      dayjs(r.date).isSame(lastMonth, 'month')
    );

    const avgPrice = filteredData.length > 0 
      ? filteredData.reduce((sum, r) => sum + r.price, 0) / filteredData.length 
      : 0;

    const maxPrice = filteredData.length > 0 
      ? Math.max(...filteredData.map(r => r.price)) 
      : 0;

    const minPrice = filteredData.length > 0 
      ? Math.min(...filteredData.map(r => r.price)) 
      : 0;

    return {
      totalRecords: filteredData.length,
      avgPrice,
      maxPrice,
      minPrice,
      currentMonthRecords: currentMonthData.length,
      lastMonthRecords: lastMonthData.length
    };
  };

  const statistics = getStatistics();

  const tabItems = [
    {
      key: 'overview',
      label: (
        <span>
          <BarChartOutlined />
          价格概览
        </span>
      ),
      children: (
        <div className="space-y-6">
          {/* 统计数据 */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="价格记录总数"
                  value={statistics.totalRecords}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="平均价格"
                  value={statistics.avgPrice}
                  prefix="¥"
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="最高价格"
                  value={statistics.maxPrice}
                  prefix="¥"
                  precision={0}
                  valueStyle={{ color: '#cf1322' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="最低价格"
                  value={statistics.minPrice}
                  prefix="¥"
                  precision={0}
                  valueStyle={{ color: '#722ed1' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 图表控制 */}
          <Card>
            <div className="flex justify-between items-center mb-4">
              <Title level={4} className="mb-0">价格趋势图表</Title>
              <Space>
                <Select
                  value={chartType}
                  onChange={setChartType}
                  style={{ width: 120 }}
                >
                  <Option value="line">折线图</Option>
                  <Option value="column">柱状图</Option>
                  <Option value="area">面积图</Option>
                </Select>
                <Button 
                  icon={<ReloadOutlined />}
                  onClick={() => fetchPriceHistory()}
                >
                  刷新数据
                </Button>
              </Space>
            </div>
            
            {chartData.length > 0 ? (
              <div style={{ height: 400 }} className="flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <BarChartOutlined className="text-4xl text-gray-400 mb-2" />
                  <Text type="secondary">价格趋势图表</Text>
                  <div className="text-xs text-gray-400 mt-1">
                    (集成图表库后显示 {chartType} 图表)
                  </div>
                </div>
              </div>
            ) : (
              <Empty 
                description="暂无价格数据" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </Card>
        </div>
      ),
    },
    {
      key: 'history',
      label: (
        <span>
          <HistoryOutlined />
          价格历史
        </span>
      ),
      children: (
        <Table
          columns={columns}
          dataSource={priceHistory}
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
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">价格历史</Title>
          <Text type="secondary">跟踪和分析雪茄价格变化趋势</Text>
        </div>
        <Button 
          icon={<ReloadOutlined />}
          onClick={() => fetchPriceHistory()}
        >
          刷新数据
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={8} lg={6}>
            <Input
              placeholder="搜索品牌、型号..."
              prefix={<SearchOutlined />}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={8} lg={4}>
            <Select
              placeholder="选择雪茄"
              value={selectedCigar}
              onChange={handleCigarFilter}
              style={{ width: '100%' }}
              allowClear
              showSearch
              optionFilterProp="children"
            >
              {cigars.map(cigar => (
                <Option key={cigar.id} value={cigar.id}>
                  {cigar.brand} {cigar.name}
                </Option>
              ))}
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
                setSelectedCigar(undefined);
                setDateRange(null);
                fetchPriceHistory();
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
          activeKey={selectedTab}
          onChange={setSelectedTab}
          items={tabItems}
          size="large"
        />
      </Card>
    </div>
  );
};

export default PriceHistoryPage;
