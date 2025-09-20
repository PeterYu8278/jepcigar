import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Space, Divider, App, Tabs } from 'antd';
import { UserOutlined, LockOutlined, CrownOutlined, MailOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthActions, useAuthStore } from '@/stores/authStore';

const { Title, Text, Link } = Typography;

interface LoginFormData {
  email: string;
  password: string;
  remember?: boolean;
}

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  displayName: string;
}

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuthActions();
  const { error: authError, clearError } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [loginStatus, setLoginStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [registerStatus, setRegisterStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [registerError, setRegisterError] = useState<string>('');
  const [activeTab, setActiveTab] = useState('login');
  const [prefilledEmail, setPrefilledEmail] = useState<string>('');
  const { message } = App.useApp();
  
  const [loginForm] = Form.useForm();
  const [registerForm] = Form.useForm();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Handle login status messages
  useEffect(() => {
    if (loginStatus === 'success') {
      message.success('登录成功！');
      navigate(from, { replace: true });
    } else if (loginStatus === 'error') {
      message.error('登录失败，请检查您的邮箱和密码');
    }
  }, [loginStatus, message, navigate, from]);

  // Handle register status messages
  useEffect(() => {
    if (registerStatus === 'success') {
      message.success('注册成功！欢迎使用JEP雪茄管理系统');
      setRegisterError('');
      clearError();
      navigate(from, { replace: true });
    } else if (registerStatus === 'error') {
      const errorMsg = authError || '注册失败，请检查输入信息';
      message.error(errorMsg);
      setRegisterError(errorMsg);
    }
  }, [registerStatus, message, navigate, from, authError, clearError]);

  // Clear errors when switching tabs
  useEffect(() => {
    if (activeTab === 'login') {
      setRegisterError('');
      clearError();
    }
  }, [activeTab, clearError]);

  // Handle prefilled email when switching to login
  useEffect(() => {
    if (activeTab === 'login' && prefilledEmail) {
      loginForm.setFieldsValue({ email: prefilledEmail });
      setPrefilledEmail('');
    }
  }, [activeTab, prefilledEmail, loginForm]);

  const handleLogin = async (values: LoginFormData) => {
    setLoading(true);
    setLoginStatus('idle');
    try {
      await login(values.email, values.password);
      setLoginStatus('success');
    } catch (error) {
      setLoginStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: RegisterFormData) => {
    setLoading(true);
    setRegisterStatus('idle');
    setRegisterError('');
    clearError();
    
    try {
      await register({
        email: values.email,
        password: values.password,
        displayName: values.displayName
      });
      setRegisterStatus('success');
    } catch (error: any) {
      console.error('Registration error:', error);
      setRegisterStatus('error');
      
      // Handle specific registration errors
      if (error.code === 'auth/email-already-in-use') {
        setRegisterError('该邮箱已被注册，请使用其他邮箱或直接登录');
        // Prefill email for login
        setPrefilledEmail(values.email);
      } else if (error.code === 'auth/invalid-email') {
        setRegisterError('邮箱格式不正确，请检查邮箱地址');
      } else if (error.code === 'auth/weak-password') {
        setRegisterError('密码强度不够，请使用至少6位字符的密码');
      } else if (error.code === 'auth/operation-not-allowed') {
        setRegisterError('邮箱注册功能未启用，请联系管理员');
      } else {
        setRegisterError(error.message || '注册失败，请稍后重试');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cigar-brown via-cigar-gold to-cigar-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <CrownOutlined className="text-6xl text-white" />
          </div>
          <Title level={2} className="text-white mb-2">JEP Cigar</Title>
          <Text className="text-white/80 text-lg">雪茄商业管理系统</Text>
        </div>

        {/* Auth Card */}
        <Card className="shadow-2xl border-0 rounded-2xl">
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            centered
            size="large"
            items={[
              {
                key: 'login',
                label: (
                  <span>
                    <UserOutlined />
                    登录
                  </span>
                ),
                children: (
                  <div>
                    <div className="text-center mb-6">
                      <Title level={3} className="mb-2">欢迎回来</Title>
                      <Text type="secondary">请登录您的账户以继续</Text>
                    </div>

                           <Form
                             form={loginForm}
                             name="login"
                             onFinish={handleLogin}
                             autoComplete="off"
                             size="large"
                             layout="vertical"
                           >
                      <Form.Item
                        name="email"
                        label="邮箱地址"
                        rules={[
                          { required: true, message: '请输入邮箱地址' },
                          { type: 'email', message: '请输入有效的邮箱地址' },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined />}
                          placeholder="请输入邮箱地址"
                          className="rounded-lg"
                        />
                      </Form.Item>

                      <Form.Item
                        name="password"
                        label="密码"
                        rules={[
                          { required: true, message: '请输入密码' },
                          { min: 6, message: '密码至少6位字符' },
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined />}
                          placeholder="请输入密码"
                          className="rounded-lg"
                        />
                      </Form.Item>

                      <Form.Item name="remember" valuePropName="checked">
                        <div className="flex justify-between items-center">
                          <label className="text-sm text-gray-600">
                            <input type="checkbox" className="mr-2" />
                            记住我
                          </label>
                          <Link href="#" className="text-sm">忘记密码？</Link>
                        </div>
                      </Form.Item>

                      <Form.Item className="mb-4">
                        <Button
                          type="primary"
                          htmlType="submit"
                          block
                          loading={loading}
                          className="h-12 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 border-0 hover:from-primary-600 hover:to-primary-700"
                        >
                          登录
                        </Button>
                      </Form.Item>
                    </Form>

                    <Divider className="my-6">
                      <Text type="secondary" className="text-sm">或者</Text>
                    </Divider>

                    {/* Demo Accounts */}
                    <div className="space-y-3">
                      <Text type="secondary" className="text-sm block text-center mb-3">
                        演示账户
                      </Text>
                      
                      <Space direction="vertical" className="w-full">
                        <Button
                          block
                          size="large"
                          onClick={() => handleLogin({ email: 'admin@jepcigar.com', password: 'admin123' })}
                          loading={loading}
                          className="h-10"
                        >
                          <UserOutlined className="mr-2" />
                          管理员账户
                        </Button>
                        
                        <Button
                          block
                          size="large"
                          onClick={() => handleLogin({ email: 'manager@jepcigar.com', password: 'manager123' })}
                          loading={loading}
                          className="h-10"
                        >
                          <UserOutlined className="mr-2" />
                          经理账户
                        </Button>
                      </Space>
                    </div>
                  </div>
                )
              },
              {
                key: 'register',
                label: (
                  <span>
                    <UserAddOutlined />
                    注册
                  </span>
                ),
                children: (
                  <div>
                    <div className="text-center mb-6">
                      <Title level={3} className="mb-2">创建账户</Title>
                      <Text type="secondary">注册您的账户以开始使用系统</Text>
                    </div>

                           {registerError && (
                             <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                               <div className="flex items-center">
                                 <span className="text-red-600 text-sm">⚠️ {registerError}</span>
                               </div>
                               {registerError.includes('该邮箱已被注册') && (
                                 <div className="mt-2 space-y-2">
                                   <div className="text-sm text-gray-600">
                                     该邮箱已存在，您可以直接登录或使用其他邮箱注册
                                   </div>
                                   <div className="flex space-x-3">
                                     <button
                                       type="button"
                                       onClick={() => {
                                         setActiveTab('login');
                                         setPrefilledEmail(registerForm.getFieldValue('email') || '');
                                       }}
                                       className="text-blue-600 hover:text-blue-800 text-sm underline"
                                     >
                                       使用此邮箱登录
                                     </button>
                                     <button
                                       type="button"
                                       onClick={() => {
                                         setRegisterError('');
                                         clearError();
                                         registerForm.resetFields();
                                       }}
                                       className="text-gray-600 hover:text-gray-800 text-sm underline"
                                     >
                                       重新注册
                                     </button>
                                   </div>
                                 </div>
                               )}
                             </div>
                           )}

                           <Form
                             form={registerForm}
                             name="register"
                             onFinish={handleRegister}
                             autoComplete="off"
                             size="large"
                             layout="vertical"
                           >
                      <Form.Item
                        name="displayName"
                        label="姓名"
                        rules={[
                          { required: true, message: '请输入您的姓名' },
                          { min: 2, message: '姓名至少2个字符' },
                        ]}
                      >
                        <Input
                          prefix={<UserOutlined />}
                          placeholder="请输入您的姓名"
                          className="rounded-lg"
                        />
                      </Form.Item>

                      <Form.Item
                        name="email"
                        label="邮箱地址"
                        rules={[
                          { required: true, message: '请输入邮箱地址' },
                          { type: 'email', message: '请输入有效的邮箱地址' },
                        ]}
                      >
                        <Input
                          prefix={<MailOutlined />}
                          placeholder="请输入邮箱地址"
                          className="rounded-lg"
                        />
                      </Form.Item>

                      <Form.Item
                        name="password"
                        label="密码"
                        rules={[
                          { required: true, message: '请输入密码' },
                          { min: 6, message: '密码至少6位字符' },
                          { 
                            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                            message: '密码必须包含大小写字母和数字'
                          }
                        ]}
                      >
                        <Input.Password
                          prefix={<LockOutlined />}
                          placeholder="请输入密码"
                          className="rounded-lg"
                        />
                      </Form.Item>

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
                          className="rounded-lg"
                        />
                      </Form.Item>

                      <Form.Item className="mb-4">
                        <Button
                          type="primary"
                          htmlType="submit"
                          block
                          loading={loading}
                          className="h-12 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 border-0 hover:from-primary-600 hover:to-primary-700"
                        >
                          注册账户
                        </Button>
                      </Form.Item>
                    </Form>

                    <div className="text-center mt-4">
                      <Text type="secondary" className="text-sm">
                        注册即表示您同意我们的{' '}
                        <Link href="#" className="text-primary-500">服务条款</Link>
                        {' '}和{' '}
                        <Link href="#" className="text-primary-500">隐私政策</Link>
                      </Text>
                    </div>
                  </div>
                )
              }
            ]}
          />
        </Card>

        {/* System Info */}
        <div className="text-center mt-8">
          <Text className="text-white/60 text-sm">
            © 2024 JEP Cigar Business System. All rights reserved.
          </Text>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
