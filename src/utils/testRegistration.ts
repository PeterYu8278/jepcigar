// 测试用户注册功能的工具
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';

export const testDuplicateRegistration = async () => {
  const testEmail = 'test-duplicate@example.com';
  const testPassword = 'test123456';
  
  console.log('🧪 测试重复注册功能...');
  
  try {
    // 第一次注册
    console.log('1️⃣ 第一次注册尝试...');
    const userCredential1 = await createUserWithEmailAndPassword(auth, testEmail, testPassword);
    console.log('✅ 第一次注册成功:', userCredential1.user.email);
    
    // 第二次注册（应该失败）
    console.log('2️⃣ 第二次注册尝试（应该失败）...');
    try {
      await createUserWithEmailAndPassword(auth, testEmail, testPassword);
      console.log('❌ 意外：第二次注册成功了，这不应该发生');
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log('✅ 正确：检测到重复注册错误:', error.message);
        console.log('✅ 错误代码:', error.code);
        return true;
      } else {
        console.log('❌ 意外的错误类型:', error.code, error.message);
        return false;
      }
    }
  } catch (error: any) {
    console.log('❌ 测试过程中发生错误:', error.code, error.message);
    return false;
  }
  
  return false;
};

export const testRegistrationErrors = async () => {
  console.log('🧪 测试各种注册错误场景...');
  
  const testCases = [
    {
      name: '无效邮箱格式',
      email: 'invalid-email',
      password: 'validpassword123',
      expectedError: 'auth/invalid-email'
    },
    {
      name: '弱密码',
      email: 'test@example.com',
      password: '123',
      expectedError: 'auth/weak-password'
    },
    {
      name: '空邮箱',
      email: '',
      password: 'validpassword123',
      expectedError: 'auth/invalid-email'
    }
  ];
  
  const results = [];
  
  for (const testCase of testCases) {
    console.log(`\n🔍 测试: ${testCase.name}`);
    try {
      await createUserWithEmailAndPassword(auth, testCase.email, testCase.password);
      console.log('❌ 意外成功，应该失败');
      results.push({ ...testCase, success: false, error: '应该失败但成功了' });
    } catch (error: any) {
      if (error.code === testCase.expectedError) {
        console.log('✅ 正确错误:', error.code);
        results.push({ ...testCase, success: true, error: error.message });
      } else {
        console.log('❌ 错误代码不匹配:', error.code, '期望:', testCase.expectedError);
        results.push({ ...testCase, success: false, error: error.message });
      }
    }
  }
  
  console.log('\n📊 测试结果总结:');
  results.forEach((result, index) => {
    console.log(`${index + 1}. ${result.name}: ${result.success ? '✅' : '❌'} ${result.error}`);
  });
  
  return results;
};

// 在浏览器控制台中可用的全局函数
export const setupRegistrationTests = () => {
  (window as any).testDuplicateRegistration = testDuplicateRegistration;
  (window as any).testRegistrationErrors = testRegistrationErrors;
  
  console.log('🧪 注册测试工具已加载');
  console.log('可用命令:');
  console.log('- testDuplicateRegistration() - 测试重复注册');
  console.log('- testRegistrationErrors() - 测试各种错误场景');
};
