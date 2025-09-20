import React, { useState } from 'react';
import { Table, TableProps, Button, Drawer, Card, Typography, Space } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import useMobile from '@/hooks/useMobile';

const { Text } = Typography;

interface MobileTableProps<T = any> extends TableProps<T> {
  mobileCardRender?: (record: T) => React.ReactNode;
  mobileCardTitle?: (record: T) => string;
  mobileCardDescription?: (record: T) => string;
  mobileCardActions?: (record: T) => React.ReactNode;
}

function MobileTable<T extends Record<string, any>>({
  mobileCardRender,
  mobileCardTitle,
  mobileCardDescription,
  mobileCardActions,
  ...tableProps
}: MobileTableProps<T>) {
  const { isMobile } = useMobile();
  const [selectedRecord, setSelectedRecord] = useState<T | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // 默认的移动端卡片渲染
  const defaultMobileCardRender = (record: T) => (
    <Card
      size="small"
      className="mb-3"
      actions={[
        <Button
          key="view"
          type="link"
          icon={<EyeOutlined />}
          onClick={() => {
            setSelectedRecord(record);
            setDrawerVisible(true);
          }}
        >
          查看详情
        </Button>,
        ...(mobileCardActions ? [mobileCardActions(record)] : [])
      ]}
    >
      <Card.Meta
        title={mobileCardTitle ? mobileCardTitle(record) : record.title || record.name || '未知'}
        description={
          <div>
            {mobileCardDescription ? mobileCardDescription(record) : (
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {Object.entries(record)
                  .filter(([key, value]) => 
                    !['id', 'key', 'title', 'name'].includes(key) && 
                    value !== null && 
                    value !== undefined
                  )
                  .slice(0, 3) // 只显示前3个字段
                  .map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <Text type="secondary" className="text-xs">
                        {key}:
                      </Text>
                      <Text className="text-xs">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </Text>
                    </div>
                  ))
                }
              </Space>
            )}
          </div>
        }
      />
    </Card>
  );

  // 移动端渲染
  if (isMobile) {
    return (
      <>
        <div className="mobile-table-container">
          {tableProps.dataSource?.map((record, index) => (
            <div key={record.key || record.id || index}>
              {mobileCardRender ? mobileCardRender(record) : defaultMobileCardRender(record)}
            </div>
          ))}
        </div>

        {/* 详情抽屉 */}
        <Drawer
          title="详细信息"
          placement="bottom"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          height="80%"
          styles={{ body: { padding: 0 } }}
        >
          {selectedRecord && (
            <div className="p-4">
              <div className="space-y-4">
                {Object.entries(selectedRecord).map(([key, value]) => (
                  <div key={key} className="flex justify-between items-start py-2 border-b border-gray-100">
                    <Text type="secondary" className="font-medium">
                      {key}:
                    </Text>
                    <Text className="text-right flex-1 ml-4">
                      {typeof value === 'object' && value !== null 
                        ? JSON.stringify(value, null, 2)
                        : String(value)
                      }
                    </Text>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Drawer>
      </>
    );
  }

  // 桌面端渲染
  return (
    <Table
      {...tableProps}
      className={`${tableProps.className || ''} desktop-table`}
      scroll={{ x: 'max-content' }}
    />
  );
}

export default MobileTable;
