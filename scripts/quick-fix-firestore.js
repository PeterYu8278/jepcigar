#!/usr/bin/env node

// Firestore 权限问题一键修复脚本
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

console.log('🔧 Firestore 权限问题一键修复脚本');
console.log('=====================================\n');

async function checkFirebaseCLI() {
  try {
    await execAsync('firebase --version');
    console.log('✅ Firebase CLI 已安装');
    return true;
  } catch (error) {
    console.log('❌ Firebase CLI 未安装');
    console.log('正在安装 Firebase CLI...');
    
    try {
      await execAsync('npm install -g firebase-tools');
      console.log('✅ Firebase CLI 安装成功');
      return true;
    } catch (installError) {
      console.log('❌ Firebase CLI 安装失败');
      console.log('请手动安装: npm install -g firebase-tools');
      return false;
    }
  }
}

async function checkFirebaseLogin() {
  try {
    const { stdout } = await execAsync('firebase projects:list');
    if (stdout.includes('cigar-56871')) {
      console.log('✅ 已登录 Firebase 并找到项目');
      return true;
    } else {
      console.log('⚠️  已登录但未找到项目 cigar-56871');
      return false;
    }
  } catch (error) {
    console.log('❌ 未登录 Firebase');
    console.log('请运行: firebase login');
    return false;
  }
}

async function deployOpenRules() {
  try {
    console.log('📋 部署开放安全规则...');
    
    // 创建临时开放规则文件
    const openRules = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`;
    
    const fs = await import('fs');
    fs.writeFileSync('temp-firestore-open.rules', openRules);
    
    // 部署规则
    await execAsync('firebase deploy --only firestore:rules:temp-firestore-open.rules --project cigar-56871');
    
    // 清理临时文件
    fs.unlinkSync('temp-firestore-open.rules');
    
    console.log('✅ 开放安全规则部署成功');
    return true;
  } catch (error) {
    console.log('❌ 规则部署失败:', error.message);
    return false;
  }
}

async function main() {
  console.log('1️⃣ 检查 Firebase CLI...');
  const cliInstalled = await checkFirebaseCLI();
  if (!cliInstalled) {
    console.log('\n❌ 修复失败：Firebase CLI 未安装');
    process.exit(1);
  }
  
  console.log('\n2️⃣ 检查 Firebase 登录状态...');
  const loggedIn = await checkFirebaseLogin();
  if (!loggedIn) {
    console.log('\n❌ 修复失败：请先登录 Firebase');
    console.log('运行: firebase login');
    process.exit(1);
  }
  
  console.log('\n3️⃣ 部署开放安全规则...');
  const rulesDeployed = await deployOpenRules();
  if (!rulesDeployed) {
    console.log('\n❌ 修复失败：规则部署失败');
    process.exit(1);
  }
  
  console.log('\n🎉 Firestore 权限问题修复完成！');
  console.log('\n📋 下一步：');
  console.log('1. 刷新浏览器页面');
  console.log('2. 查看控制台确认 Firestore 状态');
  console.log('3. 测试用户注册和登录功能');
  console.log('\n⚠️  提醒：开放规则仅用于开发测试，生产环境请使用安全规则');
}

main().catch(console.error);
