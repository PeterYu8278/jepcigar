// 环境变量验证工具
import { globalErrorHandler } from './errorHandler';

interface EnvValidationRule {
  key: string;
  required: boolean;
  type: 'string' | 'boolean' | 'number';
  defaultValue?: any;
  validator?: (value: any) => boolean;
  errorMessage?: string;
}

interface EnvValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  validatedEnv: Record<string, any>;
}

/**
 * 环境变量验证器
 */
export class EnvValidator {
  private rules: EnvValidationRule[] = [];

  /**
   * 添加验证规则
   */
  addRule(rule: EnvValidationRule): EnvValidator {
    this.rules.push(rule);
    return this;
  }

  /**
   * 验证所有环境变量
   */
  validate(): EnvValidationResult {
    const result: EnvValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      validatedEnv: {}
    };

    for (const rule of this.rules) {
      try {
        const value = this.getEnvValue(rule.key);
        const validatedValue = this.validateValue(value, rule);
        
        if (validatedValue === null) {
          result.isValid = false;
          result.errors.push(
            rule.errorMessage || `Environment variable ${rule.key} is invalid`
          );
        } else {
          result.validatedEnv[rule.key] = validatedValue;
        }
      } catch (error) {
        if (rule.required) {
          result.isValid = false;
          result.errors.push(
            `Required environment variable ${rule.key} is missing: ${error}`
          );
        } else {
          result.warnings.push(
            `Optional environment variable ${rule.key} has error: ${error}`
          );
          result.validatedEnv[rule.key] = rule.defaultValue;
        }
      }
    }

    return result;
  }

  /**
   * 获取环境变量值
   */
  private getEnvValue(key: string): any {
    try {
      return import.meta.env[key];
    } catch (error) {
      throw new Error(`Failed to access environment variable ${key}`);
    }
  }

  /**
   * 验证单个值
   */
  private validateValue(value: any, rule: EnvValidationRule): any {
    // 如果值为空且不是必需的，返回默认值
    if ((value === undefined || value === null || value === '') && !rule.required) {
      return rule.defaultValue;
    }

    // 如果值为空但是必需的，返回null表示验证失败
    if ((value === undefined || value === null || value === '') && rule.required) {
      return null;
    }

    // 类型转换
    let convertedValue: any;
    switch (rule.type) {
      case 'string':
        convertedValue = String(value);
        break;
      case 'boolean':
        convertedValue = value === 'true' || value === true;
        break;
      case 'number':
        convertedValue = Number(value);
        if (isNaN(convertedValue)) {
          return null;
        }
        break;
      default:
        convertedValue = value;
    }

    // 自定义验证
    if (rule.validator && !rule.validator(convertedValue)) {
      return null;
    }

    return convertedValue;
  }
}

/**
 * 创建环境变量验证器实例
 */
export function createEnvValidator(): EnvValidator {
  return new EnvValidator();
}

/**
 * 验证关键环境变量
 */
export function validateCriticalEnvVars(): EnvValidationResult {
  const validator = createEnvValidator()
    .addRule({
      key: 'VITE_APP_BASE_URL',
      required: false,
      type: 'string',
      defaultValue: '',
      validator: (value) => {
        if (!value) return true; // 允许为空
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      errorMessage: 'VITE_APP_BASE_URL must be a valid URL'
    })
    .addRule({
      key: 'VITE_APP_API_URL',
      required: false,
      type: 'string',
      defaultValue: '',
      validator: (value) => {
        if (!value) return true; // 允许为空
        try {
          new URL(value);
          return true;
        } catch {
          return false;
        }
      },
      errorMessage: 'VITE_APP_API_URL must be a valid URL'
    })
    .addRule({
      key: 'VITE_FIREBASE_API_KEY',
      required: true,
      type: 'string',
      validator: (value) => value && value.length > 0,
      errorMessage: 'VITE_FIREBASE_API_KEY is required'
    })
    .addRule({
      key: 'VITE_FIREBASE_AUTH_DOMAIN',
      required: true,
      type: 'string',
      validator: (value) => value && value.length > 0,
      errorMessage: 'VITE_FIREBASE_AUTH_DOMAIN is required'
    })
    .addRule({
      key: 'VITE_FIREBASE_PROJECT_ID',
      required: true,
      type: 'string',
      validator: (value) => value && value.length > 0,
      errorMessage: 'VITE_FIREBASE_PROJECT_ID is required'
    });

  return validator.validate();
}

/**
 * 初始化环境变量验证
 */
export function initializeEnvValidation(): EnvValidationResult {
  try {
    const result = validateCriticalEnvVars();
    
    if (!result.isValid) {
      globalErrorHandler.handleError(
        new Error('Environment validation failed'),
        'Environment Validation',
        { errors: result.errors }
      );
    }

    if (result.warnings.length > 0) {
      console.warn('Environment validation warnings:', result.warnings);
    }

    return result;
  } catch (error) {
    globalErrorHandler.handleError(
      error as Error,
      'Environment Validation Initialization'
    );
    
    return {
      isValid: false,
      errors: ['Failed to initialize environment validation'],
      warnings: [],
      validatedEnv: {}
    };
  }
}
