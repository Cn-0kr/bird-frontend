/**
 * API配置文件
 * 统一管理所有API相关的配置
 */

// 环境配置
const ENV = {
    // 开发环境
    development: {
      BASE_URL: 'https://dev-api.birdapp.com',
      BIRD_API: 'https://dev-api.birdapp.com/api/v1/birds',
      USER_API: 'https://dev-api.birdapp.com/api/v1/users',
      UPLOAD_API: 'https://dev-api.birdapp.com/api/v1/upload',
      WEBSOCKET_URL: 'wss://dev-ws.birdapp.com'
    },
    // 测试环境
    testing: {
      BASE_URL: 'https://test-api.birdapp.com',
      BIRD_API: 'https://test-api.birdapp.com/api/v1/birds',
      USER_API: 'https://test-api.birdapp.com/api/v1/users',
      UPLOAD_API: 'https://test-api.birdapp.com/api/v1/upload',
      WEBSOCKET_URL: 'wss://test-ws.birdapp.com'
    },
    // 生产环境
    production: {
      BASE_URL: 'https://api.birdapp.com',
      BIRD_API: 'https://api.birdapp.com/api/v1/birds',
      USER_API: 'https://api.birdapp.com/api/v1/users',
      UPLOAD_API: 'https://api.birdapp.com/api/v1/upload',
      WEBSOCKET_URL: 'wss://ws.birdapp.com'
    }
  };
  
  // 当前环境 (可以通过构建工具动态设置)
  const CURRENT_ENV = process.env.NODE_ENV || 'development';
  
  // API基础配置
  export const API_CONFIG = {
    // 基础URL
    ...ENV[CURRENT_ENV],
    
    // 请求超时时间 (毫秒)
    TIMEOUT: 10000,
    
    // 重试次数
    RETRY_COUNT: 3,
    
    // 重试延迟 (毫秒)
    RETRY_DELAY: 1000,
    
    // 文件上传配置
    UPLOAD: {
      // 最大文件大小 (MB)
      MAX_FILE_SIZE: 50,
      // 支持的图片格式
      ALLOWED_IMAGE_TYPES: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      // 支持的音频格式
      ALLOWED_AUDIO_TYPES: ['mp3', 'wav', 'aac', 'm4a'],
      // 支持的视频格式
      ALLOWED_VIDEO_TYPES: ['mp4', 'mov', 'avi'],
      // 上传超时时间 (毫秒)
      UPLOAD_TIMEOUT: 30000
    },
    
    // 分页配置
    PAGINATION: {
      // 默认页码
      DEFAULT_PAGE: 1,
      // 默认每页数量
      DEFAULT_SIZE: 20,
      // 最大每页数量
      MAX_SIZE: 100
    },
    
    // 缓存配置
    CACHE: {
      // 缓存前缀
      PREFIX: 'bird_app_',
      // 默认缓存时间 (秒)
      DEFAULT_TTL: 300,
      // 图片缓存时间 (秒)
      IMAGE_TTL: 3600,
      // 用户信息缓存时间 (秒)
      USER_TTL: 1800
    },
    
    // API版本
    API_VERSION: 'v1',
    
    // 请求头配置
    HEADERS: {
      'Content-Type': 'application/json',
      'X-Client-Type': 'uniapp',
      'X-Client-Version': '1.0.0'
    }
  };
  
  // 状态码配置
  export const STATUS_CODES = {
    // 成功
    SUCCESS: 200,
    // 创建成功
    CREATED: 201,
    // 无内容
    NO_CONTENT: 204,
    // 请求错误
    BAD_REQUEST: 400,
    // 未授权
    UNAUTHORIZED: 401,
    // 禁止访问
    FORBIDDEN: 403,
    // 未找到
    NOT_FOUND: 404,
    // 方法不允许
    METHOD_NOT_ALLOWED: 405,
    // 请求超时
    REQUEST_TIMEOUT: 408,
    // 冲突
    CONFLICT: 409,
    // 请求实体过大
    PAYLOAD_TOO_LARGE: 413,
    // 请求频率过高
    TOO_MANY_REQUESTS: 429,
    // 服务器内部错误
    INTERNAL_SERVER_ERROR: 500,
    // 服务不可用
    SERVICE_UNAVAILABLE: 503,
    // 网关超时
    GATEWAY_TIMEOUT: 504
  };
  
  // 错误信息配置
  export const ERROR_MESSAGES = {
    [STATUS_CODES.BAD_REQUEST]: '请求参数错误',
    [STATUS_CODES.UNAUTHORIZED]: '请先登录',
    [STATUS_CODES.FORBIDDEN]: '没有访问权限',
    [STATUS_CODES.NOT_FOUND]: '请求的资源不存在',
    [STATUS_CODES.METHOD_NOT_ALLOWED]: '请求方法不允许',
    [STATUS_CODES.REQUEST_TIMEOUT]: '请求超时，请稍后重试',
    [STATUS_CODES.CONFLICT]: '请求冲突',
    [STATUS_CODES.PAYLOAD_TOO_LARGE]: '文件过大',
    [STATUS_CODES.TOO_MANY_REQUESTS]: '请求过于频繁，请稍后重试',
    [STATUS_CODES.INTERNAL_SERVER_ERROR]: '服务器内部错误',
    [STATUS_CODES.SERVICE_UNAVAILABLE]: '服务暂时不可用',
    [STATUS_CODES.GATEWAY_TIMEOUT]: '网关超时',
    
    // 网络错误
    NETWORK_ERROR: '网络连接失败，请检查网络设置',
    TIMEOUT_ERROR: '网络超时，请稍后重试',
    UPLOAD_ERROR: '文件上传失败，请重试',
    DOWNLOAD_ERROR: '文件下载失败，请重试',
    
    // 业务错误
    INVALID_TOKEN: '登录状态已过期，请重新登录',
    INVALID_PARAMS: '参数格式不正确',
    OPERATION_FAILED: '操作失败，请重试',
    DATA_NOT_FOUND: '数据不存在',
    DUPLICATE_DATA: '数据已存在',
    
    // 默认错误
    UNKNOWN_ERROR: '未知错误，请联系客服'
  };
  
  // API端点配置
  export const API_ENDPOINTS = {
    // 用户相关
    USER: {
      LOGIN: '/auth/login',
      LOGOUT: '/auth/logout',
      REGISTER: '/auth/register',
      PROFILE: '/users/profile',
      UPDATE_PROFILE: '/users/profile',
      CHANGE_PASSWORD: '/users/password',
      FAVORITES: '/users/favorites',
      UPLOADS: '/users/uploads',
      STATISTICS: '/users/statistics'
    },
    
    // 鸟类相关
    BIRD: {
      LIST: '/birds',
      DETAIL: '/birds/{id}',
      SEARCH: '/birds/search',
      CATEGORIES: '/birds/categories',
      ENCYCLOPEDIA: '/birds/encyclopedia',
      IDENTIFY: '/birds/identify',
      NEARBY: '/birds/nearby',
      STATISTICS: '/birds/statistics',
      LIKE: '/birds/{id}/like',
      UNLIKE: '/birds/{id}/unlike'
    },
    
    // 海报相关
    POSTER: {
      LIST: '/posters',
      DETAIL: '/posters/{id}',
      SEARCH: '/posters/search',
      UPLOAD: '/posters/upload',
      UPDATE: '/posters/{id}',
      DELETE: '/posters/{id}',
      LIKE: '/posters/{id}/like',
      COMMENTS: '/posters/{id}/comments'
    },
    
    // 排行榜
    RANKING: {
      VIEWS: '/ranking/views',
      LIKES: '/ranking/likes',
      UPLOADS: '/ranking/uploads',
      USERS: '/ranking/users'
    },
    
    // 文件上传
    UPLOAD: {
      IMAGE: '/upload/image',
      AUDIO: '/upload/audio',
      VIDEO: '/upload/video',
      AVATAR: '/upload/avatar'
    },
    
    // 系统相关
    SYSTEM: {
      CONFIG: '/system/config',
      VERSION: '/system/version',
      ANNOUNCEMENTS: '/system/announcements',
      FEEDBACK: '/system/feedback'
    }
  };
  
  // 请求方法常量
  export const HTTP_METHODS = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
    PATCH: 'PATCH'
  };
  
  // 内容类型常量
  export const CONTENT_TYPES = {
    JSON: 'application/json',
    FORM_DATA: 'multipart/form-data',
    URL_ENCODED: 'application/x-www-form-urlencoded',
    OCTET_STREAM: 'application/octet-stream'
  };
  
  // 缓存键前缀
  export const CACHE_KEYS = {
    USER_INFO: 'user_info_',
    BIRD_LIST: 'bird_list_',
    BIRD_DETAIL: 'bird_detail_',
    POSTER_LIST: 'poster_list_',
    CATEGORIES: 'categories_',
    RANKING: 'ranking_',
    SEARCH_HISTORY: 'search_history',
    UPLOAD_QUEUE: 'upload_queue'
  };
  
  // 本地存储键
  export const STORAGE_KEYS = {
    TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_INFO: 'user_info',
    SETTINGS: 'app_settings',
    SEARCH_HISTORY: 'search_history',
    FAVORITE_BIRDS: 'favorite_birds',
    UPLOAD_DRAFTS: 'upload_drafts',
    CHAT_HISTORY: 'chat_history'
  };
  
  // 事件名称常量
  export const EVENT_NAMES = {
    LOGIN_SUCCESS: 'loginSuccess',
    LOGOUT: 'logout',
    TOKEN_EXPIRED: 'tokenExpired',
    NETWORK_ERROR: 'networkError',
    UPLOAD_PROGRESS: 'uploadProgress',
    UPLOAD_SUCCESS: 'uploadSuccess',
    UPLOAD_FAILED: 'uploadFailed',
    CHAT_MESSAGE: 'chatMessage',
    BIRD_IDENTIFIED: 'birdIdentified'
  };
  
  // 权限配置
  export const PERMISSIONS = {
    // 读取权限
    READ: {
      BIRDS: 'read:birds',
      POSTERS: 'read:posters',
      USERS: 'read:users',
      COMMENTS: 'read:comments'
    },
    // 写入权限
    WRITE: {
      POSTERS: 'write:posters',
      COMMENTS: 'write:comments',
      LIKES: 'write:likes',
      UPLOADS: 'write:uploads'
    },
    // 管理权限
    ADMIN: {
      USERS: 'admin:users',
      CONTENT: 'admin:content',
      SYSTEM: 'admin:system'
    }
  };
  
  // 获取完整的API URL
  export function getApiUrl(endpoint, params = {}) {
    let url = API_CONFIG.BASE_URL + endpoint;
    
    // 替换路径参数
    Object.keys(params).forEach(key => {
      url = url.replace(`{${key}}`, params[key]);
    });
    
    return url;
  }
  
  // 获取上传URL
  export function getUploadUrl(type = 'image') {
    const uploadEndpoints = {
      image: API_ENDPOINTS.UPLOAD.IMAGE,
      audio: API_ENDPOINTS.UPLOAD.AUDIO,
      video: API_ENDPOINTS.UPLOAD.VIDEO,
      avatar: API_ENDPOINTS.UPLOAD.AVATAR
    };
    
    return getApiUrl(uploadEndpoints[type] || uploadEndpoints.image);
  }
  
  // 检查文件类型是否支持
  export function isSupportedFileType(filename, type = 'image') {
    const extension = filename.toLowerCase().split('.').pop();
    
    const typeMap = {
      image: API_CONFIG.UPLOAD.ALLOWED_IMAGE_TYPES,
      audio: API_CONFIG.UPLOAD.ALLOWED_AUDIO_TYPES,
      video: API_CONFIG.UPLOAD.ALLOWED_VIDEO_TYPES
    };
    
    return typeMap[type]?.includes(extension) || false;
  }
  
  // 检查文件大小是否符合要求
  export function isValidFileSize(fileSize) {
    const maxSize = API_CONFIG.UPLOAD.MAX_FILE_SIZE * 1024 * 1024; // 转换为字节
    return fileSize <= maxSize;
  }
  
  // 生成缓存键
  export function generateCacheKey(prefix, ...params) {
    return API_CONFIG.CACHE.PREFIX + prefix + params.join('_');
  }
  
  // 获取错误信息
  export function getErrorMessage(statusCode, defaultMessage = ERROR_MESSAGES.UNKNOWN_ERROR) {
    return ERROR_MESSAGES[statusCode] || defaultMessage;
  }
  
  // 导出默认配置
  export default API_CONFIG;