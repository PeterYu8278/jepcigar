// PWA图标生成脚本
// 用于生成不同尺寸的PWA图标

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 图标尺寸配置
const iconSizes = [
  { size: 16, name: 'icon-16x16.png' },
  { size: 32, name: 'icon-32x32.png' },
  { size: 48, name: 'icon-48x48.png' },
  { size: 72, name: 'icon-72x72.png' },
  { size: 96, name: 'icon-96x96.png' },
  { size: 128, name: 'icon-128x128.png' },
  { size: 144, name: 'icon-144x144.png' },
  { size: 152, name: 'icon-152x152.png' },
  { size: 180, name: 'icon-180x180.png' },
  { size: 192, name: 'icon-192x192.png' },
  { size: 384, name: 'icon-384x384.png' },
  { size: 512, name: 'icon-512x512.png' },
];

// 快捷方式图标配置
const shortcutIcons = [
  { size: 96, name: 'shortcut-dashboard.png', description: 'Dashboard shortcut icon' },
  { size: 96, name: 'shortcut-customers.png', description: 'Customers shortcut icon' },
  { size: 96, name: 'shortcut-inventory.png', description: 'Inventory shortcut icon' },
  { size: 96, name: 'shortcut-scanner.png', description: 'QR Scanner shortcut icon' },
];

// 操作图标配置
const actionIcons = [
  { size: 96, name: 'action-explore.png', description: 'Explore action icon' },
  { size: 96, name: 'action-close.png', description: 'Close action icon' },
  { size: 96, name: 'action-inventory.png', description: 'Inventory action icon' },
  { size: 96, name: 'action-event.png', description: 'Event action icon' },
  { size: 96, name: 'action-customer.png', description: 'Customer action icon' },
  { size: 96, name: 'action-order.png', description: 'Order action icon' },
  { size: 96, name: 'action-gift.png', description: 'Gift action icon' },
  { size: 96, name: 'action-update.png', description: 'Update action icon' },
];

// SVG模板 - 雪茄主题图标
const generateSVGIcon = (size, type = 'default') => {
  const center = size / 2;
  const strokeWidth = Math.max(1, size / 64);
  
  let svgContent = '';
  
  switch (type) {
    case 'default':
      svgContent = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="cigarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#8B4513;stop-opacity:1" />
              <stop offset="50%" style="stop-color:#DAA520;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#F5E6D3;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <!-- 背景圆形 -->
          <circle cx="${center}" cy="${center}" r="${center - strokeWidth}" fill="url(#cigarGradient)" stroke="#8B4513" stroke-width="${strokeWidth}"/>
          
          <!-- 雪茄图标 -->
          <rect x="${center - size * 0.2}" y="${center - size * 0.15}" width="${size * 0.4}" height="${size * 0.3}" rx="${size * 0.05}" fill="#8B4513"/>
          
          <!-- 烟雾效果 -->
          <path d="M ${center + size * 0.25} ${center - size * 0.1} Q ${center + size * 0.35} ${center - size * 0.2} ${center + size * 0.3} ${center - size * 0.3}" 
                stroke="#F5E6D3" stroke-width="${strokeWidth * 2}" fill="none" opacity="0.7"/>
          <path d="M ${center + size * 0.25} ${center} Q ${center + size * 0.35} ${center - size * 0.05} ${center + size * 0.3} ${center - size * 0.15}" 
                stroke="#F5E6D3" stroke-width="${strokeWidth * 2}" fill="none" opacity="0.5"/>
          <path d="M ${center + size * 0.25} ${center + size * 0.1} Q ${center + size * 0.35} ${center + size * 0.05} ${center + size * 0.3} ${center - size * 0.05}" 
                stroke="#F5E6D3" stroke-width="${strokeWidth * 2}" fill="none" opacity="0.3"/>
          
          <!-- 品牌文字 -->
          <text x="${center}" y="${center + size * 0.35}" text-anchor="middle" font-family="serif" font-size="${size * 0.12}" font-weight="bold" fill="#8B4513">JEP</text>
        </svg>
      `;
      break;
      
    case 'dashboard':
      svgContent = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dashboardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#f16d1f;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#e25115;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <circle cx="${center}" cy="${center}" r="${center - strokeWidth}" fill="url(#dashboardGradient)"/>
          
          <!-- 仪表板图标 -->
          <rect x="${center - size * 0.25}" y="${center - size * 0.25}" width="${size * 0.5}" height="${size * 0.5}" rx="${size * 0.05}" fill="white" opacity="0.9"/>
          <circle cx="${center}" cy="${center}" r="${size * 0.15}" fill="none" stroke="#f16d1f" stroke-width="${strokeWidth * 2}"/>
          <path d="M ${center} ${center} L ${center + size * 0.1} ${center - size * 0.1}" stroke="#f16d1f" stroke-width="${strokeWidth * 3}" stroke-linecap="round"/>
        </svg>
      `;
      break;
      
    case 'customers':
      svgContent = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="customersGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#1890ff;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#096dd9;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <circle cx="${center}" cy="${center}" r="${center - strokeWidth}" fill="url(#customersGradient)"/>
          
          <!-- 用户图标 -->
          <circle cx="${center}" cy="${center - size * 0.1}" r="${size * 0.12}" fill="white"/>
          <path d="M ${center - size * 0.2} ${center + size * 0.1} A ${size * 0.2} ${size * 0.15} 0 0 1 ${center + size * 0.2} ${center + size * 0.1} Z" fill="white"/>
        </svg>
      `;
      break;
      
    case 'inventory':
      svgContent = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="inventoryGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#52c41a;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#389e0d;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <circle cx="${center}" cy="${center}" r="${center - strokeWidth}" fill="url(#inventoryGradient)"/>
          
          <!-- 库存图标 -->
          <rect x="${center - size * 0.25}" y="${center - size * 0.15}" width="${size * 0.5}" height="${size * 0.3}" rx="${size * 0.03}" fill="white"/>
          <rect x="${center - size * 0.2}" y="${center - size * 0.1}" width="${size * 0.4}" height="${size * 0.2}" fill="url(#inventoryGradient)" opacity="0.3"/>
        </svg>
      `;
      break;
      
    case 'scanner':
      svgContent = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="scannerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#722ed1;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#531dab;stop-opacity:1" />
            </linearGradient>
          </defs>
          
          <circle cx="${center}" cy="${center}" r="${center - strokeWidth}" fill="url(#scannerGradient)"/>
          
          <!-- QR码扫描图标 -->
          <rect x="${center - size * 0.2}" y="${center - size * 0.2}" width="${size * 0.4}" height="${size * 0.4}" fill="none" stroke="white" stroke-width="${strokeWidth * 2}"/>
          <rect x="${center - size * 0.15}" y="${center - size * 0.15}" width="${size * 0.3}" height="${size * 0.3}" fill="white" opacity="0.2"/>
          <circle cx="${center}" cy="${center}" r="${size * 0.05}" fill="white"/>
        </svg>
      `;
      break;
      
    default:
      svgContent = generateSVGIcon(size, 'default');
  }
  
  return svgContent.trim();
};

// 生成占位符PNG图标（Base64编码）
const generatePlaceholderPNG = (size) => {
  // 这里应该使用图像处理库如sharp或canvas来生成PNG
  // 为了简化，我们创建一个SVG占位符
  const svg = generateSVGIcon(size);
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
};

// 创建图标文件
const createIconFile = (size, name, type = 'default') => {
  const iconsDir = path.join(__dirname, '..', 'public', 'icons');
  
  // 确保icons目录存在
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  const svgContent = generateSVGIcon(size, type);
  const filePath = path.join(iconsDir, name.replace('.png', '.svg'));
  
  try {
    fs.writeFileSync(filePath, svgContent);
    console.log(`✅ 生成图标: ${name} (${size}x${size})`);
  } catch (error) {
    console.error(`❌ 生成图标失败: ${name}`, error.message);
  }
};

// 生成所有图标
const generateAllIcons = () => {
  console.log('🎨 开始生成PWA图标...\n');
  
  // 生成主要图标
  console.log('📱 生成主要图标:');
  iconSizes.forEach(({ size, name }) => {
    createIconFile(size, name, 'default');
  });
  
  console.log('\n🚀 生成快捷方式图标:');
  shortcutIcons.forEach(({ size, name }) => {
    const type = name.split('-')[1].split('.')[0];
    createIconFile(size, name, type);
  });
  
  console.log('\n⚡ 生成操作图标:');
  actionIcons.forEach(({ size, name }) => {
    const type = name.split('-')[1].split('.')[0];
    createIconFile(size, name, type);
  });
  
  console.log('\n✨ PWA图标生成完成!');
  console.log('\n📋 使用说明:');
  console.log('1. 这些是SVG格式的占位符图标');
  console.log('2. 请使用专业设计工具创建PNG格式的图标');
  console.log('3. 建议使用雪茄主题的设计元素');
  console.log('4. 确保图标在不同背景下都清晰可见');
  console.log('5. 遵循PWA图标设计最佳实践');
  
  console.log('\n🎯 下一步:');
  console.log('1. 将SVG图标转换为PNG格式');
  console.log('2. 使用图像编辑软件优化图标');
  console.log('3. 确保图标符合您的品牌设计');
  console.log('4. 测试图标在不同设备上的显示效果');
};

// 生成图标使用指南
const generateIconGuide = () => {
  const guide = `
# PWA图标使用指南

## 图标尺寸要求

### 主要图标
- 16x16px - 浏览器标签页图标
- 32x32px - Windows桌面图标
- 48x48px - Android启动器图标
- 72x72px - Android启动器图标
- 96x96px - Android启动器图标
- 128x128px - Android启动器图标
- 144x144px - Windows磁贴图标
- 152x152px - iOS Safari图标
- 180x180px - iOS主屏幕图标
- 192x192px - Android Chrome图标（推荐）
- 384x384px - Android Chrome图标
- 512x512px - Android Chrome图标（推荐）

### 快捷方式图标
- 96x96px - 应用快捷方式图标

### 操作图标
- 96x96px - 通知操作图标

## 设计建议

### 视觉风格
- 使用雪茄主题的设计元素
- 保持简洁明了的设计
- 确保在小尺寸下也能清晰识别
- 使用品牌色彩方案

### 技术规范
- 格式：PNG（推荐）或SVG
- 背景：透明或纯色
- 圆角：可选的圆角设计
- 阴影：避免复杂的阴影效果

### 测试要求
- 在不同背景下测试可见性
- 在多种设备上测试显示效果
- 确保图标不会模糊或失真
- 验证不同尺寸下的清晰度

## 工具推荐

### 在线工具
- [PWA Icon Generator](https://tools.crawlink.com/tools/pwa-icon-generator/)
- [Favicon Generator](https://realfavicongenerator.net/)
- [App Icon Generator](https://appicon.co/)

### 设计软件
- Adobe Illustrator
- Figma
- Sketch
- Canva

## 部署说明

1. 将生成的PNG图标放置在 \`public/icons/\` 目录下
2. 确保文件名与manifest.json中的配置一致
3. 更新Service Worker中的缓存策略
4. 测试图标的加载和显示效果
`;

  const guidePath = path.join(__dirname, '..', 'PWA_ICON_GUIDE.md');
  fs.writeFileSync(guidePath, guide);
  console.log('\n📖 已生成图标使用指南: PWA_ICON_GUIDE.md');
};

// 主函数
const main = () => {
  try {
    generateAllIcons();
    generateIconGuide();
  } catch (error) {
    console.error('❌ 图标生成失败:', error.message);
    process.exit(1);
  }
};

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export {
  generateAllIcons,
  generateIconGuide,
  generateSVGIcon,
};
