"use strict";
const ENV = {
  // 开发环境
  development: {
    BASE_URL: "https://dev-api.birdapp.com",
    BIRD_API: "https://dev-api.birdapp.com/api/v1/birds",
    USER_API: "https://dev-api.birdapp.com/api/v1/users",
    UPLOAD_API: "https://dev-api.birdapp.com/api/v1/upload",
    WEBSOCKET_URL: "wss://dev-ws.birdapp.com"
  },
  // 测试环境
  testing: {
    BASE_URL: "https://test-api.birdapp.com",
    BIRD_API: "https://test-api.birdapp.com/api/v1/birds",
    USER_API: "https://test-api.birdapp.com/api/v1/users",
    UPLOAD_API: "https://test-api.birdapp.com/api/v1/upload",
    WEBSOCKET_URL: "wss://test-ws.birdapp.com"
  },
  // 生产环境
  production: {
    BASE_URL: "https://api.birdapp.com",
    BIRD_API: "https://api.birdapp.com/api/v1/birds",
    USER_API: "https://api.birdapp.com/api/v1/users",
    UPLOAD_API: "https://api.birdapp.com/api/v1/upload",
    WEBSOCKET_URL: "wss://ws.birdapp.com"
  }
};
const CURRENT_ENV = "development";
const API_CONFIG = {
  // 基础URL
  ...ENV[CURRENT_ENV],
  // 请求超时时间 (毫秒)
  TIMEOUT: 1e4,
  // 重试次数
  RETRY_COUNT: 3,
  // 重试延迟 (毫秒)
  RETRY_DELAY: 1e3,
  // 文件上传配置
  UPLOAD: {
    // 最大文件大小 (MB)
    MAX_FILE_SIZE: 50,
    // 支持的图片格式
    ALLOWED_IMAGE_TYPES: ["jpg", "jpeg", "png", "webp", "gif"],
    // 支持的音频格式
    ALLOWED_AUDIO_TYPES: ["mp3", "wav", "aac", "m4a"],
    // 支持的视频格式
    ALLOWED_VIDEO_TYPES: ["mp4", "mov", "avi"],
    // 上传超时时间 (毫秒)
    UPLOAD_TIMEOUT: 3e4
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
    PREFIX: "bird_app_",
    // 默认缓存时间 (秒)
    DEFAULT_TTL: 300,
    // 图片缓存时间 (秒)
    IMAGE_TTL: 3600,
    // 用户信息缓存时间 (秒)
    USER_TTL: 1800
  },
  // API版本
  API_VERSION: "v1",
  // 请求头配置
  HEADERS: {
    "Content-Type": "application/json",
    "X-Client-Type": "uniapp",
    "X-Client-Version": "1.0.0"
  }
};
const STATUS_CODES = {
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
const ERROR_MESSAGES = {
  [STATUS_CODES.BAD_REQUEST]: "请求参数错误",
  [STATUS_CODES.UNAUTHORIZED]: "请先登录",
  [STATUS_CODES.FORBIDDEN]: "没有访问权限",
  [STATUS_CODES.NOT_FOUND]: "请求的资源不存在",
  [STATUS_CODES.METHOD_NOT_ALLOWED]: "请求方法不允许",
  [STATUS_CODES.REQUEST_TIMEOUT]: "请求超时，请稍后重试",
  [STATUS_CODES.CONFLICT]: "请求冲突",
  [STATUS_CODES.PAYLOAD_TOO_LARGE]: "文件过大",
  [STATUS_CODES.TOO_MANY_REQUESTS]: "请求过于频繁，请稍后重试",
  [STATUS_CODES.INTERNAL_SERVER_ERROR]: "服务器内部错误",
  [STATUS_CODES.SERVICE_UNAVAILABLE]: "服务暂时不可用",
  [STATUS_CODES.GATEWAY_TIMEOUT]: "网关超时",
  // 网络错误
  NETWORK_ERROR: "网络连接失败，请检查网络设置",
  TIMEOUT_ERROR: "网络超时，请稍后重试",
  UPLOAD_ERROR: "文件上传失败，请重试",
  DOWNLOAD_ERROR: "文件下载失败，请重试",
  // 业务错误
  INVALID_TOKEN: "登录状态已过期，请重新登录",
  INVALID_PARAMS: "参数格式不正确",
  OPERATION_FAILED: "操作失败，请重试",
  DATA_NOT_FOUND: "数据不存在",
  DUPLICATE_DATA: "数据已存在",
  // 默认错误
  UNKNOWN_ERROR: "未知错误，请联系客服"
};
const STORAGE_KEYS = {
  TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_INFO: "user_info",
  SETTINGS: "app_settings",
  SEARCH_HISTORY: "search_history",
  FAVORITE_BIRDS: "favorite_birds",
  UPLOAD_DRAFTS: "upload_drafts",
  CHAT_HISTORY: "chat_history"
};
exports.API_CONFIG = API_CONFIG;
exports.ERROR_MESSAGES = ERROR_MESSAGES;
exports.STATUS_CODES = STATUS_CODES;
exports.STORAGE_KEYS = STORAGE_KEYS;
//# sourceMappingURL=../../.sourcemap/mp-weixin/config/api.js.map
