// 测试用户注册功能的工具
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/config/firebase';

export const testDuplicateRegistration = async () => {
  const testEmail = 'test-duplicate@example.com';
  const testPassword = 'test123456';
  

  
  try {
    // 第一次注册

    await createUserWithEmailAndPassword(auth, testEmail, testPassword);

    
    // 第二次注册（应该失败）

    try {
      await createUserWithEmailAndPassword(auth, testEmail, testPassword);

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {


        return true;
      } else {

        return false;
      }
    }
  } catch (error: any) {

    return false;
  }
  
  return false;
};

export const testRegistrationErrors = async () => {

  
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

    try {
      await createUserWithEmailAndPassword(auth, testCase.email, testCase.password);

      results.push({ ...testCase, success: false, error: '应该失败但成功了' });
    } catch (error: any) {
      if (error.code === testCase.expectedError) {

        results.push({ ...testCase, success: true, error: error.message });
      } else {

        results.push({ ...testCase, success: false, error: error.message });
      }
    }
  }
  

  results.forEach((_result, _index) => {

  });
  
  return results;
};

// 在浏览器控制台中可用的全局函数
export const setupRegistrationTests = () => {
  (window as any).testDuplicateRegistration = testDuplicateRegistration;
  (window as any).testRegistrationErrors = testRegistrationErrors;
  


  console.log('- testDuplicateRegistration() - 测试重复注册');
  console.log('- testRegistrationErrors() - 测试各种错误场景');
};
