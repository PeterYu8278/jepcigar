// 创建基础PWA图标
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 基础图标尺寸
const iconSizes = [
  { size: 16, name: 'icon-16x16.svg' },
  { size: 32, name: 'icon-32x32.svg' },
  { size: 48, name: 'icon-48x48.svg' },
  { size: 72, name: 'icon-72x72.svg' },
  { size: 96, name: 'icon-96x96.svg' },
  { size: 128, name: 'icon-128x128.svg' },
  { size: 144, name: 'icon-144x144.svg' },
  { size: 152, name: 'icon-152x152.svg' },
  { size: 180, name: 'icon-180x180.svg' },
  { size: 192, name: 'icon-192x192.svg' },
  { size: 384, name: 'icon-384x384.svg' },
  { size: 512, name: 'icon-512x512.svg' },
];

// 生成SVG图标
const generateSVGIcon = (size) => {
  const center = size / 2;
  const strokeWidth = Math.max(1, size / 64);
  
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
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
</svg>`;
};

// 创建图标文件
const createIconFile = (size, name) => {
  const iconsDir = path.join(__dirname, '..', 'public', 'icons');
  
  if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
  }
  
  const svgContent = generateSVGIcon(size);
  const filePath = path.join(iconsDir, name);
  
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
  
  iconSizes.forEach(({ size, name }) => {
    createIconFile(size, name);
  });
  
  console.log('\n✨ PWA图标生成完成!');
  console.log('\n📋 说明:');
  console.log('1. 已生成SVG格式的占位符图标');
  console.log('2. 建议使用专业设计工具创建PNG格式图标');
  console.log('3. 图标已放置在 public/icons/ 目录下');
};

// 运行脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  generateAllIcons();
}

export { generateAllIcons };
