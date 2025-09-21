import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, List, Typography, Tag, Progress, message } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { updateAllCardUrls, checkEnvironmentConfig, getCustomersNeedingUpdate, validateCustomerCardUrl } from '@/utils/updateCardUrls';
// import { CustomerService } from '@/services/firebaseService';
import { Customer } from '@/types';

const { Title, Text } = Typography;

interface UpdateStatus {
  isRunning: boolean;
  result: any;
  customersNeedingUpdate: Customer[];
}

const CardUrlUpdatePage: React.FC = () => {
  const [status, setStatus] = useState<UpdateStatus>({
    isRunning: false,
    result: null,
    customersNeedingUpdate: []
  });

  const [environmentConfig, setEnvironmentConfig] = useState<any>(null);

  useEffect(() => {
    // 检查环境配置
    const config = checkEnvironmentConfig();
    setEnvironmentConfig(config);

    // 获取需要更新的客户列表
    loadCustomersNeedingUpdate();
  }, []);

  const loadCustomersNeedingUpdate = async () => {
    try {
      const customers = await getCustomersNeedingUpdate();
      setStatus(prev => ({
        ...prev,
        customersNeedingUpdate: customers
      }));
    } catch (error) {
      console.error('获取需要更新的客户失败:', error);
    }
  };

  const handleUpdateAll = async () => {
    setStatus(prev => ({ ...prev, isRunning: true }));
    
    try {
      const result = await updateAllCardUrls();
      
      setStatus(prev => ({
        ...prev,
        isRunning: false,
        result
      }));

      if (result.success) {
        message.success(`成功更新 ${result.updated} 个客户的数字名片URL`);
      } else {
        message.warning(`更新完成，但有 ${result.failed} 个客户更新失败`);
      }

      // 重新加载需要更新的客户列表
      await loadCustomersNeedingUpdate();
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        isRunning: false,
        result: { success: false, errors: [String(error)] }
      }));
      message.error('更新失败');
    }
  };

  const handleRefresh = () => {
    const config = checkEnvironmentConfig();
    setEnvironmentConfig(config);
    loadCustomersNeedingUpdate();
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Title level={2}>数字名片URL更新工具</Title>
      
      {/* 环境配置信息 */}
      <Card title="当前环境配置" className="mb-6">
        {environmentConfig && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Text strong>开发环境:</Text> 
                <Tag color={environmentConfig.isDevelopment ? 'green' : 'default'}>
                  {environmentConfig.isDevelopment ? '是' : '否'}
                </Tag>
              </div>
              <div>
                <Text strong>生产环境:</Text> 
                <Tag color={environmentConfig.isProduction ? 'green' : 'default'}>
                  {environmentConfig.isProduction ? '是' : '否'}
                </Tag>
              </div>
              <div>
                <Text strong>配置域名:</Text> 
                <Text code>{environmentConfig.baseUrl}</Text>
              </div>
              <div>
                <Text strong>当前域名:</Text> 
                <Text code>{environmentConfig.windowOrigin}</Text>
              </div>
            </div>
            
            <Alert
              message={environmentConfig.baseUrl === environmentConfig.windowOrigin ? '✅ 域名配置正确' : '⚠️ 域名配置不匹配'}
              description={
                environmentConfig.baseUrl === environmentConfig.windowOrigin 
                  ? '当前环境配置与访问域名一致'
                  : '当前环境配置与访问域名不一致，可能需要更新客户数据中的URL'
              }
              type={environmentConfig.baseUrl === environmentConfig.windowOrigin ? 'success' : 'warning'}
              showIcon
            />
          </div>
        )}
      </Card>

      {/* 更新操作 */}
      <Card title="批量更新操作" className="mb-6">
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={handleUpdateAll}
              loading={status.isRunning}
              disabled={status.customersNeedingUpdate.length === 0}
            >
              更新所有数字名片URL
            </Button>
            <Button onClick={handleRefresh}>
              刷新列表
            </Button>
          </div>

          {status.isRunning && (
            <div>
              <Text>正在更新数字名片URL...</Text>
              <Progress percent={50} status="active" />
            </div>
          )}

          {status.result && (
            <Alert
              message={status.result.success ? '更新成功' : '更新完成（部分失败）'}
              description={
                <div>
                  <div>成功更新: {status.result.updated} 个客户</div>
                  <div>更新失败: {status.result.failed} 个客户</div>
                  {status.result.errors.length > 0 && (
                    <div className="mt-2">
                      <Text strong>错误详情:</Text>
                      <ul className="mt-1">
                        {status.result.errors.map((error: string, index: number) => (
                          <li key={index} className="text-red-600">{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              }
              type={status.result.success ? 'success' : 'warning'}
              showIcon
            />
          )}
        </div>
      </Card>

      {/* 需要更新的客户列表 */}
      <Card title={`需要更新的客户 (${status.customersNeedingUpdate.length})`}>
        {status.customersNeedingUpdate.length === 0 ? (
          <Alert
            message="所有客户的数字名片URL都是最新的"
            description="没有客户需要更新数字名片URL"
            type="success"
            showIcon
          />
        ) : (
          <List
            dataSource={status.customersNeedingUpdate}
            renderItem={(customer) => {
              const validation = validateCustomerCardUrl(customer);
              return (
                <List.Item
                  actions={[
                    <Tag color="orange">需要更新</Tag>
                  ]}
                >
                  <List.Item.Meta
                    title={`${customer.firstName}${customer.lastName}`}
                    description={
                      <div className="space-y-2">
                        <div>
                          <Text strong>当前URL:</Text>
                          <br />
                          <Text code className="text-sm break-all">
                            {validation.currentUrl}
                          </Text>
                        </div>
                        <div>
                          <Text strong>期望URL:</Text>
                          <br />
                          <Text code className="text-sm break-all text-green-600">
                            {validation.expectedUrl}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        )}
      </Card>
    </div>
  );
};

export default CardUrlUpdatePage;
