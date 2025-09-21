import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Card,
  Typography,
  Space,
  message,
  Row,
  Col,
  Tag,
  Table,
  Checkbox,
  Input,
  Select,
  Progress,
  Statistic,
} from 'antd';
import {
  TeamOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Event as EventType, EventRegistration, Customer } from '@/types';
import { useEventStore } from '@/stores/eventStore';
import { CustomerService } from '@/services/firebaseService';
import dayjs from 'dayjs';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface BatchCheckInProps {
  visible: boolean;
  onCancel: () => void;
  event: EventType | null;
  onBatchComplete?: (results: BatchResult[]) => void;
}

interface BatchResult {
  registrationId: string;
  customerId: string;
  customerName: string;
  success: boolean;
  message: string;
  action: 'checkin' | 'checkout' | 'no-show';
  timestamp: Date;
}

interface ParticipantWithDetails extends EventRegistration {
  customer?: Customer;
  selected?: boolean;
}

const BatchCheckIn: React.FC<BatchCheckInProps> = ({
  visible,
  onCancel,
  event,
  onBatchComplete,
}) => {
  const [participants, setParticipants] = useState<ParticipantWithDetails[]>([]);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [batchProcessing, setBatchProcessing] = useState(false);
  const [batchResults, setBatchResults] = useState<BatchResult[]>([]);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'checkin' | 'checkout' | 'no-show'>('checkin');
  const [progress, setProgress] = useState(0);
  
  const {
    registrations,
    fetchEventRegistrations,
    checkIn,
    checkOut,
  } = useEventStore();

  useEffect(() => {
    if (visible && event?.id) {
      loadParticipants();
    }
  }, [visible, event?.id]);

  useEffect(() => {
    // 合并报名数据和客户详情
    const enrichedParticipants = registrations.map(registration => ({
      ...registration,
      customer: undefined,
      selected: false,
    }));
    setParticipants(enrichedParticipants);
    
    // 加载客户详情
    loadCustomerDetails(enrichedParticipants);
  }, [registrations]);

  const loadParticipants = async () => {
    if (!event?.id) return;
    
    setLoading(true);
    try {
      await fetchEventRegistrations(event.id);
    } catch (error) {
      message.error('加载参与者失败');
      console.error('Load participants error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCustomerDetails = async (participants: ParticipantWithDetails[]) => {
    const customerPromises = participants.map(async (participant) => {
      try {
        const customer = await CustomerService.getById('customers', participant.customerId) as Customer;
        return { ...participant, customer };
      } catch (error) {
        console.error('Load customer error:', error);
        return participant;
      }
    });

    const participantsWithCustomers = await Promise.all(customerPromises);
    setParticipants(participantsWithCustomers);
  };

  // 筛选参与者
  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = !searchText || 
      `${participant.customer?.firstName || ''} ${participant.customer?.lastName || ''}`.toLowerCase().includes(searchText.toLowerCase()) ||
      participant.customer?.phone?.includes(searchText) ||
      participant.customer?.email?.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = !statusFilter || participant.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // 处理批量操作
  const handleBatchAction = async () => {
    if (selectedParticipants.length === 0) {
      message.warning('请选择要操作的参与者');
      return;
    }

    setBatchProcessing(true);
    setProgress(0);
    setBatchResults([]);

    const results: BatchResult[] = [];
    const total = selectedParticipants.length;

    for (let i = 0; i < selectedParticipants.length; i++) {
      const registrationId = selectedParticipants[i];
      const participant = participants.find(p => p.id === registrationId);
      
      if (!participant || !participant.customer) {
        results.push({
          registrationId,
          customerId: participant?.customerId || '',
          customerName: participant?.customer ? `${participant.customer.firstName} ${participant.customer.lastName}` : '未知用户',
          success: false,
          message: '未找到参与者信息',
          action: actionType,
          timestamp: new Date(),
        });
        continue;
      }

      try {
        let success = false;
        let message = '';

        switch (actionType) {
          case 'checkin':
            if (participant.status === 'registered') {
              await checkIn(registrationId);
              success = true;
              message = '签到成功';
            } else {
              message = '当前状态不支持签到';
            }
            break;
          
          case 'checkout':
            if (participant.status === 'checked-in') {
              await checkOut(registrationId);
              success = true;
              message = '签退成功';
            } else {
              message = '当前状态不支持签退';
            }
            break;
          
          case 'no-show':
            // TODO: 实现标记未到场功能
            success = true;
            message = '标记为未到场';
            break;
        }

        results.push({
          registrationId,
          customerId: participant.customerId,
          customerName: `${participant.customer.firstName} ${participant.customer.lastName}`,
          success,
          message,
          action: actionType,
          timestamp: new Date(),
        });

      } catch (error) {
        results.push({
          registrationId,
          customerId: participant.customerId,
          customerName: `${participant.customer.firstName} ${participant.customer.lastName}`,
          success: false,
          message: error instanceof Error ? error.message : '操作失败',
          action: actionType,
          timestamp: new Date(),
        });
      }

      // 更新进度
      setProgress(Math.round(((i + 1) / total) * 100));
    }

    setBatchResults(results);
    setBatchProcessing(false);
    
    const successCount = results.filter(r => r.success).length;
    const failCount = results.length - successCount;
    
    message.success(`批量操作完成！成功: ${successCount}, 失败: ${failCount}`);
    onBatchComplete?.(results);
  };

  // 选择所有符合条件的参与者
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = filteredParticipants.map(p => p.id);
      setSelectedParticipants(allIds);
    } else {
      setSelectedParticipants([]);
    }
  };

  // 导出结果
  const exportResults = () => {
    if (batchResults.length === 0) {
      message.warning('没有可导出的结果');
      return;
    }

    const csvContent = [
      ['客户ID', '客户姓名', '操作类型', '状态', '消息', '时间'].join(','),
      ...batchResults.map(result => [
        result.customerId,
        result.customerName,
        result.action === 'checkin' ? '签到' : result.action === 'checkout' ? '签退' : '未到场',
        result.success ? '成功' : '失败',
        result.message,
        dayjs(result.timestamp).format('YYYY-MM-DD HH:mm:ss'),
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `批量签到结果_${dayjs().format('YYYY-MM-DD_HH-mm-ss')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const columns: ColumnsType<ParticipantWithDetails> = [
    {
      title: (
        <Checkbox
          indeterminate={selectedParticipants.length > 0 && selectedParticipants.length < filteredParticipants.length}
          checked={selectedParticipants.length === filteredParticipants.length && filteredParticipants.length > 0}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      dataIndex: 'selected',
      width: 50,
      render: (_, record) => (
        <Checkbox
          checked={selectedParticipants.includes(record.id)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedParticipants([...selectedParticipants, record.id]);
            } else {
              setSelectedParticipants(selectedParticipants.filter(id => id !== record.id));
            }
          }}
        />
      ),
    },
    {
      title: '客户信息',
      key: 'customer',
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.customer ? `${record.customer.firstName} ${record.customer.lastName}` : '未知用户'}</div>
          <div className="text-sm text-gray-500">{record.customer?.phone || '无电话'}</div>
        </div>
      ),
    },
    {
      title: '报名状态',
      dataIndex: 'status',
      render: (status) => {
        const statusMap = {
          'registered': { color: 'blue', text: '已报名' },
          'checked-in': { color: 'green', text: '已签到' },
          'checked-out': { color: 'orange', text: '已签退' },
          'no-show': { color: 'red', text: '未到场' },
          'cancelled': { color: 'gray', text: '已取消' },
        };
        const statusInfo = statusMap[status as keyof typeof statusMap] || { color: 'default', text: status };
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>;
      },
    },
    {
      title: '报名时间',
      dataIndex: 'createdAt',
      render: (date) => dayjs(date).format('MM-DD HH:mm'),
    },
  ];

  // 如果event为null，返回null
  if (!event) {
    return null;
  }

  return (
    <Modal
      title={
        <Space>
          <TeamOutlined />
          批量签到管理
        </Space>
      }
      open={visible}
      onCancel={onCancel}
      width={1200}
      footer={null}
      destroyOnHidden
    >
      <div className="space-y-4">
        {/* 活动信息 */}
        <Card size="small">
          <Row gutter={16}>
            <Col span={12}>
              <Text strong>活动名称：</Text>
              <Text>{event.title}</Text>
            </Col>
            <Col span={12}>
              <Text strong>活动时间：</Text>
              <Text>{dayjs(event.startDate).format('YYYY-MM-DD HH:mm')}</Text>
            </Col>
          </Row>
        </Card>

        {/* 操作控制 */}
        <Card size="small">
          <Row gutter={16} align="middle">
            <Col span={6}>
              <Search
                placeholder="搜索客户姓名、电话、邮箱"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
            </Col>
            <Col span={4}>
              <Select
                placeholder="筛选状态"
                value={statusFilter}
                onChange={setStatusFilter}
                allowClear
                style={{ width: '100%' }}
              >
                <Option value="registered">已报名</Option>
                <Option value="checked-in">已签到</Option>
                <Option value="checked-out">已签退</Option>
                <Option value="no-show">未到场</Option>
              </Select>
            </Col>
            <Col span={4}>
              <Select
                value={actionType}
                onChange={setActionType}
                style={{ width: '100%' }}
              >
                <Option value="checkin">批量签到</Option>
                <Option value="checkout">批量签退</Option>
                <Option value="no-show">标记未到场</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Space>
                <Button
                  type="primary"
                  onClick={handleBatchAction}
                  loading={batchProcessing}
                  disabled={selectedParticipants.length === 0}
                >
                  执行批量操作 ({selectedParticipants.length})
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadParticipants}
                  loading={loading}
                >
                  刷新
                </Button>
              </Space>
            </Col>
            <Col span={4}>
              <div className="text-right">
                <Text type="secondary">
                  已选择 {selectedParticipants.length} / {filteredParticipants.length}
                </Text>
              </div>
            </Col>
          </Row>
        </Card>

        {/* 进度显示 */}
        {batchProcessing && (
          <Card size="small">
            <div className="text-center">
              <Title level={5}>批量处理中...</Title>
              <Progress percent={progress} status="active" />
            </div>
          </Card>
        )}

        {/* 参与者列表 */}
        <Card size="small">
          <Table
            columns={columns}
            dataSource={filteredParticipants}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            }}
            scroll={{ y: 400 }}
          />
        </Card>

        {/* 批量结果 */}
        {batchResults.length > 0 && (
          <Card size="small">
            <div className="flex items-center justify-between mb-4">
              <Title level={5}>批量操作结果</Title>
              <Space>
                <Button
                  icon={<DownloadOutlined />}
                  onClick={exportResults}
                >
                  导出结果
                </Button>
                <Button
                  onClick={() => setBatchResults([])}
                >
                  清空结果
                </Button>
              </Space>
            </div>

            <Row gutter={16} className="mb-4">
              <Col span={8}>
                <Statistic
                  title="总操作数"
                  value={batchResults.length}
                  prefix={<TeamOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="成功数"
                  value={batchResults.filter(r => r.success).length}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="失败数"
                  value={batchResults.filter(r => !r.success).length}
                  valueStyle={{ color: '#cf1322' }}
                  prefix={<ExclamationCircleOutlined />}
                />
              </Col>
            </Row>

            <Table
              size="small"
              dataSource={batchResults}
              rowKey="registrationId"
              pagination={{ pageSize: 5 }}
              columns={[
                {
                  title: '客户姓名',
                  dataIndex: 'customerName',
                },
                {
                  title: '操作类型',
                  dataIndex: 'action',
                  render: (action) => {
                    const actionMap = {
                      'checkin': { color: 'green', text: '签到' },
                      'checkout': { color: 'blue', text: '签退' },
                      'no-show': { color: 'red', text: '未到场' },
                    };
                    const info = actionMap[action as keyof typeof actionMap];
                    return <Tag color={info.color}>{info.text}</Tag>;
                  },
                },
                {
                  title: '状态',
                  dataIndex: 'success',
                  render: (success) => (
                    <Tag color={success ? 'success' : 'error'}>
                      {success ? '成功' : '失败'}
                    </Tag>
                  ),
                },
                {
                  title: '消息',
                  dataIndex: 'message',
                },
                {
                  title: '时间',
                  dataIndex: 'timestamp',
                  render: (timestamp) => dayjs(timestamp).format('HH:mm:ss'),
                },
              ]}
            />
          </Card>
        )}

        {/* 操作按钮 */}
        <div className="flex justify-end space-x-2">
          <Button onClick={onCancel}>
            关闭
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BatchCheckIn;
