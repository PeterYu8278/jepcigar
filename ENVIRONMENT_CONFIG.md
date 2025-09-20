# 环境配置说明

## 环境变量配置

### 开发环境 (.env.development)
```bash
VITE_APP_BASE_URL=http://localhost:3000
VITE_APP_API_URL=http://localhost:3000/api
VITE_APP_ENV=development
```

### 测试环境 (.env.staging)
```bash
VITE_APP_BASE_URL=https://staging.jepcigar.com
VITE_APP_API_URL=https://staging.jepcigar.com/api
VITE_APP_ENV=staging
```

### 生产环境 (.env.production)
```bash
VITE_APP_=https://jepcigar.netlify.app/
VITE_APP_API_URL=https://jepcigar.netlify.app/api
VITE_APP_ENV=production
```

## 自动域名检测

系统会根据以下优先级自动检测域名：

1. **环境变量** - `VITE_APP_BASE_URL`
2. **浏览器环境** - `window.location.origin`
3. **默认配置** - 根据环境类型设置默认值

## 使用方法

```typescript
import { getCurrentOrigin, generateCardUrl, envConfig } from '@/config/environment';

// 获取当前域名
const origin = getCurrentOrigin();

// 生成卡片URL
const cardUrl = generateCardUrl('customer123');

// 获取环境配置
const config = envConfig;
```

## 部署配置

### Netlify
在 Netlify 的环境变量中设置：
- `VITE_APP_BASE_URL` = `https://jepcigar.netlify.app`

### Vercel
在 Vercel 的环境变量中设置：
- `VITE_APP_BASE_URL` = `https://your-site.vercel.app`

### 自定义域名
- `VITE_APP_BASE_URL` = `https://jepcigar.netlify.app`

## 当前配置

项目已配置使用 Netlify 域名：
```bash
VITE_APP_BASE_URL=https://jepcigar.netlify.app
```

此配置已保存到 `.env.local` 文件中，将在开发和生产环境中生效。
