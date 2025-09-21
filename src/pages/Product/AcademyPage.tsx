import React from 'react';
import { Card, Typography, Button, Tag, Row, Col, Progress } from 'antd';
import { BookOutlined, TrophyOutlined, PlayCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const AcademyPage: React.FC = () => {
  const courses = [
    {
      id: '1',
      title: '雪茄基础知识',
      category: 'etiquette',
      level: 'beginner',
      progress: 75,
      lessons: 8,
      completedLessons: 6,
      estimatedTime: 45,
      badges: 2,
    },
    {
      id: '2',
      title: '雪茄品鉴技巧',
      category: 'tasting',
      level: 'intermediate',
      progress: 30,
      lessons: 12,
      completedLessons: 4,
      estimatedTime: 90,
      badges: 1,
    },
    {
      id: '3',
      title: '雪茄搭配艺术',
      category: 'pairing',
      level: 'advanced',
      progress: 0,
      lessons: 15,
      completedLessons: 0,
      estimatedTime: 120,
      badges: 0,
    },
  ];

  const badges = [
    {
      id: '1',
      name: '初学者',
      description: '完成第一门课程',
      icon: '🎓',
      earned: true,
    },
    {
      id: '2',
      name: '品鉴师',
      description: '完成品鉴技巧课程',
      icon: '👃',
      earned: false,
    },
    {
      id: '3',
      name: '搭配专家',
      description: '掌握雪茄搭配艺术',
      icon: '🍽️',
      earned: false,
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'etiquette': return '🎩';
      case 'tasting': return '👃';
      case 'history': return '📚';
      case 'pairing': return '🍽️';
      default: return '📖';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'green';
      case 'intermediate': return 'orange';
      case 'advanced': return 'red';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Title level={3} className="mb-0">雪茄学院</Title>
          <Text type="secondary">学习雪茄知识，获得徽章和会员升级</Text>
        </div>
        <Button type="primary" icon={<BookOutlined />}>
          开始学习
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="我的课程" className="hover-lift">
            <div className="space-y-4">
              {courses.map(course => (
                <div key={course.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{getCategoryIcon(course.category)}</div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Title level={5} className="mb-0">{course.title}</Title>
                          <Tag color={getLevelColor(course.level)}>
                            {course.level === 'beginner' ? '初级' : 
                             course.level === 'intermediate' ? '中级' : '高级'}
                          </Tag>
                        </div>
                        <div className="text-sm text-gray-500">
                          {course.lessons} 课时 • 预计 {course.estimatedTime} 分钟
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 mb-1">
                        {course.completedLessons}/{course.lessons} 已完成
                      </div>
                      <Progress 
                        percent={course.progress} 
                        size="small" 
                        status={course.progress === 100 ? 'success' : 'active'}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <TrophyOutlined className="text-yellow-500" />
                        <span className="text-sm">{course.badges} 徽章</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <PlayCircleOutlined className="text-blue-500" />
                        <span className="text-sm">{course.completedLessons} 课时完成</span>
                      </div>
                    </div>
                    <Button type="primary" size="small">
                      {course.progress === 0 ? '开始学习' : course.progress === 100 ? '查看证书' : '继续学习'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="我的徽章" className="hover-lift mb-4">
            <div className="space-y-3">
              {badges.map(badge => (
                <div key={badge.id} className={`p-3 rounded-lg ${badge.earned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="flex items-center space-x-3">
                    <div className={`text-2xl ${badge.earned ? '' : 'grayscale opacity-50'}`}>
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Text strong className={badge.earned ? '' : 'text-gray-500'}>
                          {badge.name}
                        </Text>
                        {badge.earned && <CheckCircleOutlined className="text-green-500" />}
                      </div>
                      <div className={`text-sm ${badge.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                        {badge.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="学习统计" className="hover-lift">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-500">3</div>
                <div className="text-gray-600">已开始课程</div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Text>总学习时长:</Text>
                  <Text strong>2小时15分钟</Text>
                </div>
                <div className="flex justify-between">
                  <Text>完成课程:</Text>
                  <Text strong>1门</Text>
                </div>
                <div className="flex justify-between">
                  <Text>获得徽章:</Text>
                  <Text strong>2个</Text>
                </div>
                <div className="flex justify-between">
                  <Text>积分奖励:</Text>
                  <Text strong>500分</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card title="课程分类">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-4xl mb-2">🎩</div>
            <Title level={5} className="mb-2">雪茄礼仪</Title>
            <Text type="secondary" className="text-sm">
              学习正确的雪茄礼仪和社交场合的注意事项
            </Text>
            <div className="mt-3">
              <Tag color="blue">3门课程</Tag>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-4xl mb-2">👃</div>
            <Title level={5} className="mb-2">品鉴技巧</Title>
            <Text type="secondary" className="text-sm">
              掌握雪茄品鉴的专业技巧和感官体验
            </Text>
            <div className="mt-3">
              <Tag color="green">4门课程</Tag>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-4xl mb-2">📚</div>
            <Title level={5} className="mb-2">雪茄历史</Title>
            <Text type="secondary" className="text-sm">
              了解雪茄的历史文化和制作工艺
            </Text>
            <div className="mt-3">
              <Tag color="purple">2门课程</Tag>
            </div>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg text-center hover:shadow-md transition-shadow cursor-pointer">
            <div className="text-4xl mb-2">🍽️</div>
            <Title level={5} className="mb-2">搭配艺术</Title>
            <Text type="secondary" className="text-sm">
              学习雪茄与饮品、食物的完美搭配
            </Text>
            <div className="mt-3">
              <Tag color="orange">3门课程</Tag>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AcademyPage;
