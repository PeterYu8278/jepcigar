#!/usr/bin/env node

// Firebase 设置验证脚本
// 用于验证 Firebase 配置是否正确

import { checkFirebaseConfiguration } from '../src/utils/firebaseCheck.js';

console.log('🔍 验证 Firebase 配置...\n');

try {
  const results = await checkFirebaseConfiguration();
  
  console.log('📊 Firebase 配置状态:');
  console.log('================================');
  console.log(`Authentication: ${results.auth ? '✅ Working' : '❌ Failed'}`);
  console.log(`Firestore: ${results.firestore ? '✅ Working' : '❌ Failed'}`);
  
  if (results.errors.length > 0) {
    console.log('\n🚨 发现的问题:');
    results.errors.forEach((error, index) => {
      console.log(`${index + 1}. ${error}`);
    });
    
    console.log('\n🔧 建议的修复步骤:');
    console.log('1. 确保 Firebase Authentication 已启用');
    console.log('2. 确保 Firestore Database 已启用');
    console.log('3. 部署开放安全规则进行测试');
    console.log('4. 检查 Firebase 项目配置');
    
    process.exit(1);
  } else {
    console.log('\n🎉 所有 Firebase 服务都正常工作！');
    console.log('\n📋 下一步:');
    console.log('1. 在浏览器中打开应用');
    console.log('2. 在控制台运行: window.createTestUsers()');
    console.log('3. 测试用户注册和登录功能');
    
    process.exit(0);
  }
} catch (error) {
  console.error('❌ 验证过程中发生错误:', error.message);
  process.exit(1);
}
