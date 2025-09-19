import React from 'react';
import { Card, Typography, Button, Switch, Input, Select, Form, Tabs, Row, Col } from 'antd';
import { SettingOutlined, UserOutlined, BellOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Option } = Select;
// Using items prop instead of TabPane

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={2} className="mb-0">系统设置</Title>
          <Text type="secondary">配置系统参数和个人偏好</Text>
        </div>
        <Button type="primary" icon={<SettingOutlined />}>
          保存设置
        </Button>
      </div>

      <Tabs 
        defaultActiveKey="general"
        items={[
          {
            key: 'general',
            label: '常规设置',
            children: (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="系统配置" className="hover-lift">
                <Form layout="vertical">
                  <Form.Item label="公司名称">
                    <Input defaultValue="JEP Cigar" />
                  </Form.Item>
                  
                  <Form.Item label="默认货币">
                    <Select defaultValue="CNY">
                      <Option value="CNY">人民币 (CNY)</Option>
                      <Option value="USD">美元 (USD)</Option>
                      <Option value="EUR">欧元 (EUR)</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item label="时区">
                    <Select defaultValue="Asia/Kuala_Lumpur">
                      <Option value="Asia/Kuala_Lumpur">马来西亚时间</Option>
                      <Option value="Asia/Singapore">新加坡时间</Option>
                      <Option value="Asia/Bangkok">曼谷时间</Option>
                      <Option value="UTC">协调世界时</Option>
                    </Select>
                  </Form.Item>
                  
                  <Form.Item label="税率">
                    <Input addonAfter="%" defaultValue="13" />
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="通知设置" className="hover-lift">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <Text strong>邮件通知</Text>
                      <div className="text-sm text-gray-500">接收邮件通知</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Text strong>库存警报</Text>
                      <div className="text-sm text-gray-500">库存不足时通知</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Text strong>新订单通知</Text>
                      <div className="text-sm text-gray-500">有新订单时通知</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div>
                      <Text strong>活动提醒</Text>
                      <div className="text-sm text-gray-500">活动开始前提醒</div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
            ),
          },
          {
            key: 'profile',
            label: '个人资料',
            children: (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="基本信息" className="hover-lift">
                <Form layout="vertical">
                  <Form.Item label="头像">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserOutlined className="text-2xl text-gray-400" />
                    </div>
                    <Button type="link" className="mt-2">更换头像</Button>
                  </Form.Item>
                  
                  <Form.Item label="姓名">
                    <Input defaultValue="管理员" />
                  </Form.Item>
                  
                  <Form.Item label="邮箱">
                    <Input defaultValue="admin@jepcigar.com" />
                  </Form.Item>
                  
                  <Form.Item label="电话">
                    <Input defaultValue="+86 138 0013 8000" />
                  </Form.Item>
                  
                  <Form.Item label="职位">
                    <Input defaultValue="系统管理员" />
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="安全设置" className="hover-lift">
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <LockOutlined className="text-blue-500" />
                      <Text strong>密码安全</Text>
                    </div>
                    <Text type="secondary" className="text-sm">
                      上次修改: 2024年1月1日
                    </Text>
                    <Button type="link" className="p-0 ml-2">修改密码</Button>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <BellOutlined className="text-green-500" />
                      <Text strong>登录通知</Text>
                    </div>
                    <Text type="secondary" className="text-sm">
                      启用新设备登录通知
                    </Text>
                    <Switch defaultChecked className="ml-2" />
                  </div>
                  
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-1">
                      <SettingOutlined className="text-orange-500" />
                      <Text strong>两步验证</Text>
                    </div>
                    <Text type="secondary" className="text-sm">
                      为账户添加额外安全保护
                    </Text>
                    <Button type="link" className="p-0 ml-2">设置</Button>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
            ),
          },
          {
            key: 'points',
            label: '积分设置',
            children: (
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={12}>
              <Card title="积分规则" className="hover-lift">
                <Form layout="vertical">
                  <Form.Item label="购买积分倍数">
                    <Input addonAfter="积分/元" defaultValue="1" />
                  </Form.Item>
                  
                  <Form.Item label="推荐奖励积分">
                    <Input addonAfter="积分" defaultValue="500" />
                  </Form.Item>
                  
                  <Form.Item label="活动参与积分">
                    <Input addonAfter="积分" defaultValue="100" />
                  </Form.Item>
                  
                  <Form.Item label="积分有效期">
                    <Input addonAfter="个月" defaultValue="12" />
                  </Form.Item>
                </Form>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card title="会员等级" className="hover-lift">
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🥈</span>
                        <Text strong>Silver</Text>
                      </div>
                      <Text type="secondary">消费满 ¥0</Text>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">🥇</span>
                        <Text strong>Gold</Text>
                      </div>
                      <Text type="secondary">消费满 ¥5,000</Text>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">💎</span>
                        <Text strong>Platinum</Text>
                      </div>
                      <Text type="secondary">消费满 ¥15,000</Text>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">👑</span>
                        <Text strong>Royal</Text>
                      </div>
                      <Text type="secondary">消费满 ¥30,000</Text>
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
            ),
          },
        ]}
      />
    </div>
  );
};

export default SettingsPage;
