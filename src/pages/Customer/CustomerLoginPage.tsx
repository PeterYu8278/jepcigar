import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Divider, Row, Col, message } from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined,
  PhoneOutlined,
  GiftOutlined,
  CrownOutlined,
  StarOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { customerColors, customerClasses } from '@/config/customerTheme';
import './CustomerLoginPage.css';

const { Title, Text } = Typography;

const CustomerLoginPage: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const navigate = useNavigate();
  const { login, register } = useAuthStore();

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      await login(values.email, values.password);
      message.success('登录成功！');
      navigate('/customer');
    } catch (error) {
      message.error('登录失败，请检查邮箱和密码');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: { email: string; password: string; displayName: string }) => {
    setLoading(true);
    try {
      await register({
        email: values.email,
        password: values.password,
        displayName: values.displayName
      });
      message.success('注册成功！欢迎加入JEP雪茄俱乐部！');
      navigate('/customer');
    } catch (error) {
      message.error('注册失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (values: any) => {
    if (isRegisterMode) {
      handleRegister(values);
    } else {
      handleLogin(values);
    }
  };

  return (
    <div className={`${customerClasses.container} customer-login-page`}>
      <div className="login-container">
        {/* 左侧品牌展示 */}
        <div className="brand-section">
          <div className="brand-content">
            <div className="brand-logo">
              <span className="logo-icon">🚬</span>
              <Title level={1} className="brand-title">JEP CIGAR</Title>
            </div>
            <Title level={3} className="brand-subtitle">
              高端雪茄俱乐部
            </Title>
            <Text className="brand-description">
              加入我们的雪茄爱好者社区，享受专业品鉴、高端活动、积分奖励和个性化服务
            </Text>
            
            <div className="features-list">
              <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <div className="feature-item">
                  <CalendarOutlined className="feature-icon" />
                  <div>
                    <Text strong>专业品鉴活动</Text>
                    <br />
                    <Text type="secondary">参与顶级雪茄品鉴会和专家讲座</Text>
                  </div>
                </div>
                <div className="feature-item">
                  <GiftOutlined className="feature-icon" />
                  <div>
                    <Text strong>积分奖励系统</Text>
                    <br />
                    <Text type="secondary">消费积分，兑换精美礼品和专属服务</Text>
                  </div>
                </div>
                <div className="feature-item">
                  <CrownOutlined className="feature-icon" />
                  <div>
                    <Text strong>VIP会员特权</Text>
                    <br />
                    <Text type="secondary">享受专属活动和个性化推荐服务</Text>
                  </div>
                </div>
              </Space>
            </div>
          </div>
        </div>

        {/* 右侧登录表单 */}
        <div className="form-section">
          <Card className={`${customerClasses.card} login-card`}>
            <div className="form-header">
              <Title level={2} className="form-title">
                {isRegisterMode ? '加入我们' : '欢迎回来'}
              </Title>
              <Text type="secondary" className="form-subtitle">
                {isRegisterMode 
                  ? '创建账户，开始您的雪茄之旅' 
                  : '登录您的账户，继续享受服务'
                }
              </Text>
            </div>

            <Form
              form={form}
              name={isRegisterMode ? 'register' : 'login'}
              onFinish={handleSubmit}
              autoComplete="off"
              size="large"
              layout="vertical"
            >
              {isRegisterMode && (
                <Form.Item
                  name="displayName"
                  label="姓名"
                  rules={[
                    { required: true, message: '请输入您的姓名' },
                    { min: 2, message: '姓名至少2个字符' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="请输入您的姓名"
                    className={customerClasses.input}
                  />
                </Form.Item>
              )}

              <Form.Item
                name="email"
                label="邮箱"
                rules={[
                  { required: true, message: '请输入邮箱地址' },
                  { type: 'email', message: '请输入有效的邮箱地址' }
                ]}
              >
                <Input 
                  prefix={<MailOutlined />} 
                  placeholder="请输入邮箱地址"
                  className={customerClasses.input}
                />
              </Form.Item>

              <Form.Item
                name="password"
                label="密码"
                rules={[
                  { required: true, message: '请输入密码' },
                  { min: 6, message: '密码至少6个字符' }
                ]}
              >
                <Input.Password 
                  prefix={<LockOutlined />} 
                  placeholder="请输入密码"
                  className={customerClasses.input}
                />
              </Form.Item>

              {isRegisterMode && (
                <Form.Item
                  name="confirmPassword"
                  label="确认密码"
                  dependencies={['password']}
                  rules={[
                    { required: true, message: '请确认密码' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致'));
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    prefix={<LockOutlined />} 
                    placeholder="请再次输入密码"
                    className={customerClasses.input}
                  />
                </Form.Item>
              )}

              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  className={`${customerClasses.button} submit-button`}
                  block
                >
                  {isRegisterMode ? '立即注册' : '登录'}
                </Button>
              </Form.Item>
            </Form>

            <Divider>或者</Divider>

            <div className="social-login">
              <Button 
                className="social-button"
                icon={<PhoneOutlined />}
                block
              >
                手机号登录
              </Button>
            </div>

            <div className="form-footer">
              <Text type="secondary">
                {isRegisterMode ? '已有账户？' : '还没有账户？'}
                <Button 
                  type="link" 
                  onClick={() => setIsRegisterMode(!isRegisterMode)}
                  className="toggle-button"
                >
                  {isRegisterMode ? '立即登录' : '立即注册'}
                </Button>
              </Text>
            </div>

            <div className="guest-access">
              <Text type="secondary">
                想要先体验一下？
                <Link to="/customer" className="guest-link">
                  游客浏览
                </Link>
              </Text>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CustomerLoginPage;
