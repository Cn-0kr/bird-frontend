/**
 * 阿里云OSS配置文件
 * 用于管理OSS存储桶的相关配置信息
 * @author Frontend Developer
 * @date 2025-07-03
 */

// OSS配置常量
const OSS_CONFIG = {
  // OSS基础配置
  region: 'oss-cn-shanghai', // OSS区域
  bucket: 'birdfront-oss', // OSS存储桶名称
  
  // OSS访问域名配置
  // 建议使用自定义域名以提高访问速度和用户体验
  endpoint: 'https://birdfront-oss.oss-cn-shanghai.aliyuncs.com', // OSS外网访问域名
  // customDomain: 'https://cdn.yourdomain.com', // 自定义CDN域名（可选）
  
  // 图片处理配置
  imageProcess: {
    // 图片质量压缩参数
    quality: 80, // 图片质量 (1-100)
    // 常用图片尺寸预设
    sizes: {
      thumbnail: '150x150', // 缩略图尺寸
      small: '300x300',     // 小图尺寸
      medium: '600x600',    // 中图尺寸
      large: '1200x1200',   // 大图尺寸
      banner: '1920x600'    // 横幅图尺寸
    },
    // 图片格式转换
    format: 'webp', // 默认转换为webp格式以优化加载速度
    fallbackFormat: 'jpg' // 不支持webp时的回退格式
  },
  
  // 缓存配置
  cache: {
    // 图片缓存时间（秒）
    maxAge: 86400 * 30, // 30天
    // 是否启用浏览器缓存
    enableBrowserCache: true
  },
  
  // 安全配置
  security: {
    // 是否启用防盗链
    enableRefererProtection: true,
    // 允许的来源域名列表
    allowedReferers: [
      'https://yourdomain.com',
      'https://www.yourdomain.com',
      'http://localhost:3000', // 开发环境
      'http://127.0.0.1:3000'  // 开发环境
    ]
  },
  
  // 环境配置
  environment: {
    // 当前环境 (development | production | test)
    current: process.env.NODE_ENV || 'development',
    
    // 不同环境的配置
    development: {
      enableImageOptimization: false, // 开发环境关闭图片优化以提高调试效率
      enableCache: false,
      logLevel: 'debug'
    },
    
    production: {
      enableImageOptimization: true,  // 生产环境启用图片优化
      enableCache: true,
      logLevel: 'error'
    },
    
    test: {
      enableImageOptimization: false,
      enableCache: false,
      logLevel: 'warn'
    }
  }
}

/**
 * 获取当前环境的OSS配置
 * @returns {Object} 当前环境的OSS配置对象
 */
export const getOSSConfig = () => {
  const currentEnv = OSS_CONFIG.environment.current
  const envConfig = OSS_CONFIG.environment[currentEnv] || OSS_CONFIG.environment.development
  
  return {
    ...OSS_CONFIG,
    ...envConfig
  }
}

/**
 * 验证OSS配置是否完整
 * @returns {Object} 验证结果
 */
export const validateOSSConfig = () => {
  const config = getOSSConfig()
  const errors = []
  
  // 检查必需的配置项
  if (!config.bucket || config.bucket === 'your-bucket-name') {
    errors.push('OSS bucket name is not configured')
  }
  
  if (!config.endpoint || config.endpoint.includes('your-bucket-name')) {
    errors.push('OSS endpoint is not configured')
  }
  
  if (!config.region) {
    errors.push('OSS region is not configured')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    config
  }
}

// 导出配置对象
export default OSS_CONFIG

/**
 * 使用示例：
 * 
 * import OSS_CONFIG, { getOSSConfig, validateOSSConfig } from '@/config/oss.js'
 * 
 * // 获取配置
 * const config = getOSSConfig()
 * 
 * // 验证配置
 * const validation = validateOSSConfig()
 * if (!validation.isValid) {
 *   console.error('OSS配置错误:', validation.errors)
 * }
 */