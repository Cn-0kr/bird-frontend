// 环境变量
export const ENV = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production'
} as const;

// 判断当前是否为开发环境
// #ifdef H5
export const isDev = process.env.NODE_ENV === ENV.DEVELOPMENT;
// #endif

// #ifdef MP-WEIXIN
// 小程序环境下根据条件判断
// 可以根据实际情况修改判断条件,如域名、特定配置等
export const isDev = true; // 开发阶段设为 true,发布时设为 false
// #endif

// 环境变量
export const NODE_ENV = isDev ? ENV.DEVELOPMENT : ENV.PRODUCTION;

// API 请求基础路径
export const API_BASE_URL = {
  [ENV.DEVELOPMENT]: 'http://localhost:3000',
  [ENV.PRODUCTION]: 'https://api.example.com'
}[NODE_ENV];

// 响应状态码
export const CODE = {
  SUCCESS: 1,
  ERROR: 0,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500
} as const;

// 缓存键
export const STORAGE_KEY = {
  TOKEN: 'token',
  USER_INFO: 'userInfo'
} as const;

// 业务常量
export const BUSINESS = {
  // 可以添加其他业务相关的常量  
  DEFAULT_AVATAR: '/static/default-avatar.png',
  DEFAULT_NICKNAME: '鸟类爱好者',
  DEFAULT_BIO: '点击添加个人介绍...'
} as const;

// 路由常量 
export const ROUTES = {
  HOME: '/pages/Home/Home',
  PROFILE: '/pages/Profile/Profile',
  EDIT_PROFILE: '/pages/EditProfile/EditProfile'
} as const;

// 常用正则表达式
export const REGEXP = {
  PHONE: /^1[3-9]\d{9}$/,
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
} as const;