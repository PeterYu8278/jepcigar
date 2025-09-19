import React from 'react';
import { Spin } from 'antd';

interface VirtualListProps<T> {
  items: T[];
  height: number;
  itemHeight: number;
  renderItem: (props: { index: number; style: React.CSSProperties; item: T }) => React.ReactNode;
  loading?: boolean;
  onScroll?: (scrollTop: number) => void;
  overscanCount?: number;
  className?: string;
}

function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  loading = false,
  onScroll: _onScroll,
  overscanCount: _overscanCount = 5,
  className = ''
}: VirtualListProps<T>) {

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={`virtual-list ${className}`} style={{ height }}>
      {/* 暂时使用简单的滚动列表，等待 react-window 安装 */}
      <div style={{ height: '100%', overflow: 'auto' }}>
        {items.map((item, index) => (
          <div key={index} style={{ height: itemHeight }}>
            {renderItem({ index, style: {}, item })}
          </div>
        ))}
      </div>
    </div>
  );
}

// 用于表格的虚拟滚动
interface VirtualTableProps<T> {
  items: T[];
  height: number;
  rowHeight: number;
  columns: Array<{
    key: string;
    title: string;
    width: number;
    render: (item: T, index: number) => React.ReactNode;
  }>;
  loading?: boolean;
  className?: string;
}

export function VirtualTable<T>({
  items,
  height,
  rowHeight,
  columns,
  loading = false,
  className = ''
}: VirtualTableProps<T>) {
  const totalWidth = columns.reduce((sum, col) => sum + col.width, 0);

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ height }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className={`virtual-table ${className}`} style={{ height }}>
      {/* 表头 */}
      <div 
        className="sticky top-0 bg-white border-b border-gray-200 z-10"
        style={{ 
          display: 'flex', 
          height: rowHeight,
          width: totalWidth 
        }}
      >
        {columns.map((column) => (
          <div
            key={column.key}
            className="flex items-center px-4 border-r border-gray-200 last:border-r-0"
            style={{ 
              width: column.width,
              fontSize: '14px',
              fontWeight: '600',
              color: '#374151'
            }}
          >
            {column.title}
          </div>
        ))}
      </div>

      {/* 虚拟列表 */}
      <div style={{ height: height - rowHeight, overflow: 'auto' }}>
        {items.map((item, index) => (
          <div
            key={index}
            style={{ height: rowHeight }}
            className="border-b border-gray-100 hover:bg-gray-50"
          >
            <div 
              className="flex"
              style={{ width: totalWidth }}
            >
              {columns.map((column) => (
                <div
                  key={column.key}
                  className="flex items-center px-4 border-r border-gray-100 last:border-r-0"
                  style={{ 
                    width: column.width,
                    fontSize: '14px'
                  }}
                >
                  {column.render(item, index)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VirtualList;
