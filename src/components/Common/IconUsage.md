# 图标使用指南

## 🎯 推荐使用方式

### 1. 使用统一图标组件（推荐）

```typescript
import Icon from '@/components/Common/Icon';

// 基础使用
<Icon name="user" size={24} color="#1890ff" />

// 带样式的图标
<Icon 
  name="settings" 
  size={20} 
  color="#f16d1f" 
  className="hover:opacity-80" 
  spin={true}
/>
```

### 2. 直接导入图标组件（高级用法）

```typescript
import { UserOutlined, SettingOutlined } from '@/components/Common/Icon';

// 直接使用
<UserOutlined style={{ fontSize: 24, color: '#1890ff' }} />
<SettingOutlined className="hover:opacity-80" />
```

## 📋 可用图标列表

### 常用图标
- `user` - 用户图标
- `settings` - 设置图标
- `home` - 首页图标
- `menu` - 菜单图标
- `search` - 搜索图标
- `plus` - 添加图标
- `edit` - 编辑图标
- `delete` - 删除图标
- `save` - 保存图标
- `close` - 关闭图标
- `check` - 检查图标

### 导航图标
- `dashboard` - 仪表板
- `inventory` - 库存管理
- `calendar` - 日历/活动
- `gift` - 礼品
- `trophy` - 奖杯/游戏化
- `book` - 书籍/学院
- `analytics` - 分析
- `bell` - 通知
- `logout` - 登出
- `crown` - 皇冠/会员
- `share` - 分享
- `bulb` - 灯泡/推荐

### 操作图标
- `eye` - 查看
- `more` - 更多
- `dollar` - 金钱
- `location` - 位置
- `play` - 播放
- `stop` - 停止
- `qrcode` - 二维码
- `reload` - 刷新
- `download` - 下载
- `upload` - 上传

### 状态图标
- `success` - 成功
- `error` - 错误
- `loading` - 加载中
- `warning` - 警告
- `info` - 信息

## 🚀 最佳实践

### 1. 图标尺寸规范
- 小图标：16px
- 中等图标：20px
- 大图标：24px
- 超大图标：32px

### 2. 颜色使用
- 主色调：`#f16d1f`
- 成功：`#52c41a`
- 警告：`#faad14`
- 错误：`#ff4d4f`
- 信息：`#1890ff`

### 3. 交互状态
```typescript
// 悬停效果
<Icon 
  name="settings" 
  className="hover:opacity-80 transition-opacity cursor-pointer" 
/>

// 加载状态
<Icon name="loading" spin={true} />

// 禁用状态
<Icon name="delete" color="#d9d9d9" />
```

## ⚠️ 避免的做法

### ❌ 不要使用CDN引用
```html
<!-- 错误做法 -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.css">
```

### ❌ 不要全量导入
```typescript
// 错误做法
import * as Icons from '@ant-design/icons';
```

### ✅ 正确的做法
```typescript
// 正确做法
import Icon from '@/components/Common/Icon';
// 或
import { UserOutlined } from '@/components/Common/Icon';
```

## 🔧 添加新图标

1. 在 `Icon.tsx` 中导入新图标
2. 添加到 `iconMap` 对象中
3. 更新类型定义
4. 更新使用指南

## 📊 性能优化

- 使用统一的图标组件减少bundle大小
- 按需导入避免全量加载
- 利用Tree Shaking优化构建
- 使用图标字体减少HTTP请求
