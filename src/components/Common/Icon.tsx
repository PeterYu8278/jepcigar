import React from 'react';
import {
  // 常用图标
  UserOutlined,
  SettingOutlined,
  HomeOutlined,
  MenuOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  // 导航图标
  DashboardOutlined,
  InboxOutlined,
  CalendarOutlined,
  GiftOutlined,
  TrophyOutlined,
  BookOutlined,
  BarChartOutlined,
  BellOutlined,
  LogoutOutlined,
  CrownOutlined,
  ShareAltOutlined,
  BulbOutlined,
  // 操作图标
  EyeOutlined,
  MoreOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  PlayCircleOutlined,
  StopOutlined,
  QrcodeOutlined,
  ReloadOutlined,
  DownloadOutlined,
  UploadOutlined,
  // 状态图标
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  // 其他常用图标
  FileOutlined,
  FolderOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  StarOutlined,
} from '@ant-design/icons';

// 图标映射表
const iconMap = {
  // 常用图标
  user: UserOutlined,
  settings: SettingOutlined,
  home: HomeOutlined,
  menu: MenuOutlined,
  search: SearchOutlined,
  plus: PlusOutlined,
  edit: EditOutlined,
  delete: DeleteOutlined,
  save: SaveOutlined,
  close: CloseOutlined,
  check: CheckOutlined,
  warning: ExclamationCircleOutlined,
  info: InfoCircleOutlined,
  alert: WarningOutlined,
  
  // 导航图标
  dashboard: DashboardOutlined,
  inventory: InboxOutlined,
  calendar: CalendarOutlined,
  gift: GiftOutlined,
  trophy: TrophyOutlined,
  book: BookOutlined,
  analytics: BarChartOutlined,
  bell: BellOutlined,
  logout: LogoutOutlined,
  crown: CrownOutlined,
  share: ShareAltOutlined,
  bulb: BulbOutlined,
  
  // 操作图标
  eye: EyeOutlined,
  more: MoreOutlined,
  dollar: DollarOutlined,
  location: EnvironmentOutlined,
  play: PlayCircleOutlined,
  stop: StopOutlined,
  qrcode: QrcodeOutlined,
  reload: ReloadOutlined,
  download: DownloadOutlined,
  upload: UploadOutlined,
  
  // 状态图标
  success: CheckCircleOutlined,
  error: CloseCircleOutlined,
  loading: LoadingOutlined,
  
  // 其他图标
  file: FileOutlined,
  folder: FolderOutlined,
  team: TeamOutlined,
  cart: ShoppingCartOutlined,
  heart: HeartOutlined,
  star: StarOutlined,
} as const;

export type IconName = keyof typeof iconMap;

interface IconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  spin?: boolean;
  rotate?: number;
}

/**
 * 统一的图标组件
 * 使用Ant Design图标系统，提供类型安全的图标使用方式
 */
const Icon: React.FC<IconProps> = ({
  name,
  size = 16,
  color,
  className,
  style,
  spin = false,
  rotate,
}) => {
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  return (
    <IconComponent
      style={{
        fontSize: size,
        color,
        ...style,
      }}
      className={className}
      spin={spin}
      rotate={rotate}
    />
  );
};

export default Icon;

// 导出所有图标组件，支持直接导入
export {
  UserOutlined,
  SettingOutlined,
  HomeOutlined,
  MenuOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  CheckOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  DashboardOutlined,
  InboxOutlined,
  CalendarOutlined,
  GiftOutlined,
  TrophyOutlined,
  BookOutlined,
  BarChartOutlined,
  BellOutlined,
  LogoutOutlined,
  CrownOutlined,
  ShareAltOutlined,
  BulbOutlined,
  EyeOutlined,
  MoreOutlined,
  DollarOutlined,
  EnvironmentOutlined,
  PlayCircleOutlined,
  StopOutlined,
  QrcodeOutlined,
  ReloadOutlined,
  DownloadOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  LoadingOutlined,
  FileOutlined,
  FolderOutlined,
  TeamOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  StarOutlined,
};
