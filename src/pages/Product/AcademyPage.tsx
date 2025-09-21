import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

const AcademyPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card title="雪茄学院" className="hover-lift">
        <Text type="secondary">雪茄学院功能正在开发中...</Text>
      </Card>
    </div>
  );
};

export default AcademyPage;