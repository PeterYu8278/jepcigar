import React from 'react';
import { Card, Typography } from 'antd';

const { Title, Text } = Typography;

const PointsMarketplacePage: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card title="积分商城" className="hover-lift">
        <Text type="secondary">积分商城功能正在开发中...</Text>
      </Card>
    </div>
  );
};

export default PointsMarketplacePage;