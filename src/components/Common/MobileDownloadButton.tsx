import React, { useState } from 'react';
import { Button, Dropdown, Modal, Progress, Space, Typography, message } from 'antd';
import {
  DownloadOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  FileTextOutlined,
  FileExcelOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import { fileDownloadService } from '@/services/fileDownloadService';
import useMobile from '@/hooks/useMobile';
import MobileButton from './MobileButton';

const { Text } = Typography;

interface DownloadOption {
  key: string;
  label: string;
  icon: React.ReactNode;
  format: string;
  handler: () => Promise<void>;
}

interface MobileDownloadButtonProps {
  data: any;
  type: 'customer' | 'inventory' | 'event' | 'report' | 'digital-card';
  element?: HTMLElement | null;
  filename?: string;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  block?: boolean;
}

const MobileDownloadButton: React.FC<MobileDownloadButtonProps> = ({
  data,
  type,
  element,
  filename,
  disabled = false,
  size = 'middle',
  block = false,
}) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [showProgress, setShowProgress] = useState(false);
  const { isMobile } = useMobile();

  // 获取下载选项
  const getDownloadOptions = (): DownloadOption[] => {
    const options: DownloadOption[] = [];

    switch (type) {
      case 'customer':
        options.push(
          {
            key: 'pdf',
            label: 'PDF报告',
            icon: <FilePdfOutlined />,
            format: 'PDF',
            handler: async () => {
              await fileDownloadService.downloadCustomerReport(data, filename);
            },
          },
          {
            key: 'json',
            label: 'JSON数据',
            icon: <FileTextOutlined />,
            format: 'JSON',
            handler: async () => {
              await fileDownloadService.downloadJSON(data, filename || `customer-${data.id}.json`);
            },
          }
        );
        break;

      case 'inventory':
        options.push(
          {
            key: 'pdf',
            label: 'PDF报告',
            icon: <FilePdfOutlined />,
            format: 'PDF',
            handler: async () => {
              await fileDownloadService.downloadInventoryReport(data, filename);
            },
          },
          {
            key: 'csv',
            label: 'CSV表格',
            icon: <FileExcelOutlined />,
            format: 'CSV',
            handler: async () => {
              const headers = ['品牌', '名称', '产地', '当前库存', '最低库存', '零售价', '状态'];
              await fileDownloadService.downloadCSV(data, filename || `inventory-${Date.now()}.csv`, headers);
            },
          },
          {
            key: 'json',
            label: 'JSON数据',
            icon: <FileTextOutlined />,
            format: 'JSON',
            handler: async () => {
              await fileDownloadService.downloadJSON(data, filename || `inventory-${Date.now()}.json`);
            },
          }
        );
        break;

      case 'digital-card':
        if (element) {
          options.push(
            {
              key: 'png',
              label: 'PNG图片',
              icon: <FileImageOutlined />,
              format: 'PNG',
              handler: async () => {
                await fileDownloadService.downloadDigitalCard(data, element, filename);
              },
            }
          );
        }
        break;

      case 'report':
        options.push(
          {
            key: 'pdf',
            label: 'PDF报告',
            icon: <FilePdfOutlined />,
            format: 'PDF',
            handler: async () => {
              if (element) {
                await fileDownloadService.downloadPDF(element, filename || `report-${Date.now()}.pdf`);
              } else {
                await fileDownloadService.downloadText(JSON.stringify(data, null, 2), filename || `report-${Date.now()}.txt`);
              }
            },
          },
          {
            key: 'json',
            label: 'JSON数据',
            icon: <FileTextOutlined />,
            format: 'JSON',
            handler: async () => {
              await fileDownloadService.downloadJSON(data, filename || `report-${Date.now()}.json`);
            },
          }
        );
        break;

      default:
        options.push(
          {
            key: 'json',
            label: 'JSON数据',
            icon: <FileTextOutlined />,
            format: 'JSON',
            handler: async () => {
              await fileDownloadService.downloadJSON(data, filename || `data-${Date.now()}.json`);
            },
          }
        );
    }

    return options;
  };

  const downloadOptions = getDownloadOptions();

  // 处理下载
  const handleDownload = async (option: DownloadOption) => {
    if (disabled) return;

    try {
      setLoading(option.key);
      setProgress(0);
      setShowProgress(true);

      // 模拟进度更新
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + Math.random() * 20;
        });
      }, 200);

      await option.handler();

      clearInterval(progressInterval);
      setProgress(100);

      setTimeout(() => {
        setShowProgress(false);
        setProgress(0);
        message.success(`${option.format}文件下载成功！`);
      }, 500);

    } catch (error) {
      setShowProgress(false);
      setProgress(0);
      console.error('Download failed:', error);
      message.error('文件下载失败，请重试');
    } finally {
      setLoading(null);
    }
  };

  // 如果没有下载选项，返回空
  if (downloadOptions.length === 0) {
    return null;
  }

  // 移动端显示方式
  if (isMobile) {
    return (
      <>
        <MobileButton
          icon={<DownloadOutlined />}
          onClick={() => {
            // 在移动端直接下载第一个选项
            if (downloadOptions.length === 1) {
              handleDownload(downloadOptions[0]);
            } else {
              // 显示选择菜单
              Modal.confirm({
                title: '选择下载格式',
                content: (
                  <div className="space-y-2">
                    {downloadOptions.map(option => (
                      <Button
                        key={option.key}
                        block
                        icon={option.icon}
                        loading={loading === option.key}
                        onClick={() => {
                          Modal.destroyAll();
                          handleDownload(option);
                        }}
                        className="mb-2"
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                ),
                footer: null,
                width: 300,
              });
            }
          }}
          loading={loading !== null}
          disabled={disabled}
          size={size}
          block={block}
        >
          {downloadOptions.length === 1 ? '下载' : '下载文件'}
        </MobileButton>

        {/* 下载进度模态框 */}
        <Modal
          title="正在下载"
          open={showProgress}
          footer={null}
          closable={false}
          width={300}
        >
          <div className="text-center">
            <Progress
              percent={Math.round(progress)}
              status={progress === 100 ? 'success' : 'active'}
              strokeColor={{
                '0%': '#f16d1f',
                '100%': '#f16d1f',
              }}
            />
            <Text type="secondary" className="mt-2 block">
              {progress === 100 ? '下载完成' : '正在准备文件...'}
            </Text>
          </div>
        </Modal>
      </>
    );
  }

  // 桌面端显示方式
  if (downloadOptions.length === 1) {
    return (
      <Button
        icon={<DownloadOutlined />}
        onClick={() => handleDownload(downloadOptions[0])}
        loading={loading !== null}
        disabled={disabled}
        size={size}
        block={block}
      >
        下载{downloadOptions[0].format}
      </Button>
    );
  }

  return (
    <>
      <Dropdown
        menu={{
          items: downloadOptions.map(option => ({
            key: option.key,
            label: (
              <Space>
                {option.icon}
                {option.label}
              </Space>
            ),
            onClick: () => handleDownload(option),
            disabled: loading !== null,
          })),
        }}
        trigger={['click']}
        disabled={disabled}
      >
        <Button
          icon={loading ? <LoadingOutlined /> : <DownloadOutlined />}
          loading={loading !== null}
          disabled={disabled}
          size={size}
          block={block}
        >
          下载文件
        </Button>
      </Dropdown>

      {/* 下载进度模态框 */}
      <Modal
        title="正在下载"
        open={showProgress}
        footer={null}
        closable={false}
        width={400}
      >
        <div className="text-center">
          <Progress
            percent={Math.round(progress)}
            status={progress === 100 ? 'success' : 'active'}
            strokeColor={{
              '0%': '#f16d1f',
              '100%': '#f16d1f',
            }}
          />
          <Text type="secondary" className="mt-2 block">
            {progress === 100 ? '下载完成' : '正在准备文件...'}
          </Text>
        </div>
      </Modal>
    </>
  );
};

export default MobileDownloadButton;
