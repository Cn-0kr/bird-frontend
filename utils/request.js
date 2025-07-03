/**
 * 网络请求工具函数
 * 统一处理API请求、错误处理、重试机制等
 */

import { API_CONFIG, STATUS_CODES, ERROR_MESSAGES, STORAGE_KEYS } from '@/config/api.js';

/**
 * 请求类
 */
class RequestManager {
  constructor() {
    // 请求队列
    this.requestQueue = new Map();
    // 重试队列
    this.retryQueue = new Map();
    // 请求拦截器
    this.requestInterceptors = [];
    // 响应拦截器
    this.responseInterceptors = [];
    // 错误处理器
    this.errorHandlers = new Map();
    // 加载状态管理
    this.loadingStates = new Set();
  }

  /**
   * 添加请求拦截器
   * @param {Function} interceptor - 拦截器函数
   */
  addRequestInterceptor(interceptor) {
    this.requestInterceptors.push(interceptor);
  }

  /**
   * 添加响应拦截器
   * @param {Function} interceptor - 拦截器函数
   */
  addResponseInterceptor(interceptor) {
    this.responseInterceptors.push(interceptor);
  }

  /**
   * 添加错误处理器
   * @param {Number} statusCode - HTTP状态码
   * @param {Function} handler - 处理函数
   */
  addErrorHandler(statusCode, handler) {
    this.errorHandlers.set(statusCode, handler);
  }

  /**
   * 获取存储的Token
   * @returns {String|null} Token
   */
  getToken() {
    try {
      return uni.getStorageSync(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('获取Token失败:', error);
      return null;
    }
  }

  /**
   * 设置Token
   * @param {String} token - Token值
   */
  setToken(token) {
    try {
      uni.setStorageSync(STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      console.error('设置Token失败:', error);
    }
  }

  /**
   * 清除Token
   */
  clearToken() {
    try {
      uni.removeStorageSync(STORAGE_KEYS.TOKEN);
      uni.removeStorageSync(STORAGE_KEYS.REFRESH_TOKEN);
      uni.removeStorageSync(STORAGE_KEYS.USER_INFO);
    } catch (error) {
      console.error('清除Token失败:', error);
    }
  }

  /**
   * 构建请求头
   * @param {Object} customHeaders - 自定义请求头
   * @returns {Object} 完整的请求头
   */
  buildHeaders(customHeaders = {}) {
    const headers = {
      ...API_CONFIG.HEADERS,
      ...customHeaders
    };

    // 添加授权头
    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // 添加设备信息
    const systemInfo = uni.getSystemInfoSync();
    headers['X-Device-Type'] = systemInfo.platform;
    headers['X-Device-Model'] = systemInfo.model;
    headers['X-App-Version'] = systemInfo.version;

    return headers;
  }

  /**
   * 生成请求唯一标识
   * @param {Object} options - 请求配置
   * @returns {String} 请求标识
   */
  generateRequestId(options) {
    const { url, method, data } = options;
    const dataStr = data ? JSON.stringify(data) : '';
    return `${method}_${url}_${dataStr}`.replace(/[^a-zA-Z0-9]/g, '_');
  }

  /**
   * 检查是否为重复请求
   * @param {String} requestId - 请求ID
   * @returns {Boolean} 是否重复
   */
  isDuplicateRequest(requestId) {
    return this.requestQueue.has(requestId);
  }

  /**
   * 添加到请求队列
   * @param {String} requestId - 请求ID
   * @param {Promise} promise - 请求Promise
   */
  addToQueue(requestId, promise) {
    this.requestQueue.set(requestId, promise);
    
    // 请求完成后从队列中移除
    promise.finally(() => {
      this.requestQueue.delete(requestId);
    });
  }

  /**
   * 显示加载状态
   * @param {String} requestId - 请求ID
   * @param {Object} loadingConfig - 加载配置
   */
  showLoading(requestId, loadingConfig = {}) {
    if (loadingConfig.showLoading !== false && !this.loadingStates.has(requestId)) {
      this.loadingStates.add(requestId);
      
      uni.showLoading({
        title: loadingConfig.loadingText || '加载中...',
        mask: loadingConfig.mask !== false
      });
    }
  }

  /**
   * 隐藏加载状态
   * @param {String} requestId - 请求ID
   */
  hideLoading(requestId) {
    if (this.loadingStates.has(requestId)) {
      this.loadingStates.delete(requestId);
      
      // 如果没有其他请求在加载，则隐藏loading
      if (this.loadingStates.size === 0) {
        uni.hideLoading();
      }
    }
  }

  /**
   * 执行请求拦截器
   * @param {Object} config - 请求配置
   * @returns {Object} 处理后的配置
   */
  async executeRequestInterceptors(config) {
    let processedConfig = { ...config };
    
    for (const interceptor of this.requestInterceptors) {
      try {
        processedConfig = await interceptor(processedConfig) || processedConfig;
      } catch (error) {
        console.error('请求拦截器执行失败:', error);
      }
    }
    
    return processedConfig;
  }

  /**
   * 执行响应拦截器
   * @param {Object} response - 响应数据
   * @returns {Object} 处理后的响应
   */
  async executeResponseInterceptors(response) {
    let processedResponse = { ...response };
    
    for (const interceptor of this.responseInterceptors) {
      try {
        processedResponse = await interceptor(processedResponse) || processedResponse;
      } catch (error) {
        console.error('响应拦截器执行失败:', error);
      }
    }
    
    return processedResponse;
  }

  /**
   * 处理响应错误
   * @param {Object} error - 错误对象
   * @param {Object} config - 请求配置
   * @returns {Promise} 处理结果
   */
  async handleResponseError(error, config) {
    const { statusCode } = error;
    
    // 执行自定义错误处理器
    if (this.errorHandlers.has(statusCode)) {
      try {
        const handler = this.errorHandlers.get(statusCode);
        const result = await handler(error, config);
        if (result) return result;
      } catch (handlerError) {
        console.error('错误处理器执行失败:', handlerError);
      }
    }
    
    // 处理特定错误
    switch (statusCode) {
      case STATUS_CODES.UNAUTHORIZED:
        return this.handleUnauthorized(error, config);
      
      case STATUS_CODES.FORBIDDEN:
        return this.handleForbidden(error, config);
      
      case STATUS_CODES.TOO_MANY_REQUESTS:
        return this.handleRateLimit(error, config);
      
      case STATUS_CODES.INTERNAL_SERVER_ERROR:
      case STATUS_CODES.SERVICE_UNAVAILABLE:
      case STATUS_CODES.GATEWAY_TIMEOUT:
        return this.handleServerError(error, config);
      
      default:
        throw error;
    }
  }

  /**
   * 处理未授权错误
   * @param {Object} error - 错误对象
   * @param {Object} config - 请求配置
   */
  async handleUnauthorized(error, config) {
    // 清除本地Token
    this.clearToken();
    
    // 跳转到登录页
    uni.reLaunch({
      url: '/pages/login/login'
    });
    
    // 发送全局事件
    uni.$emit('tokenExpired');
    
    throw new Error(ERROR_MESSAGES.INVALID_TOKEN);
  }

  /**
   * 处理禁止访问错误
   * @param {Object} error - 错误对象
   * @param {Object} config - 请求配置
   */
  async handleForbidden(error, config) {
    uni.showToast({
      title: ERROR_MESSAGES.FORBIDDEN,
      icon: 'error'
    });
    
    throw new Error(ERROR_MESSAGES.FORBIDDEN);
  }

  /**
   * 处理频率限制错误
   * @param {Object} error - 错误对象
   * @param {Object} config - 请求配置
   */
  async handleRateLimit(error, config) {
    const retryAfter = error.header?.['Retry-After'] || 60;
    
    uni.showToast({
      title: `请求过于频繁，请${retryAfter}秒后重试`,
      icon: 'error',
      duration: 3000
    });
    
    // 添加到重试队列
    setTimeout(() => {
      this.request(config);
    }, retryAfter * 1000);
    
    throw new Error(ERROR_MESSAGES.TOO_MANY_REQUESTS);
  }

  /**
   * 处理服务器错误
   * @param {Object} error - 错误对象
   * @param {Object} config - 请求配置
   */
  async handleServerError(error, config) {
    // 自动重试
    if (config.retryCount > 0) {
      config.retryCount--;
      
      // 延迟重试
      await new Promise(resolve => {
        setTimeout(resolve, API_CONFIG.RETRY_DELAY);
      });
      
      return this.request(config);
    }
    
    throw new Error(ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }

  /**
   * 处理网络错误
   * @param {Object} error - 错误对象
   * @param {Object} config - 请求配置
   */
  async handleNetworkError(error, config) {
    // 检查网络状态
    const networkType = await this.getNetworkType();
    
    if (networkType === 'none') {
      uni.showToast({
        title: '网络连接不可用',
        icon: 'error'
      });
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    
    // 网络重试
    if (config.retryCount > 0) {
      config.retryCount--;
      
      await new Promise(resolve => {
        setTimeout(resolve, API_CONFIG.RETRY_DELAY);
      });
      
      return this.request(config);
    }
    
    throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
  }

  /**
   * 获取网络类型
   * @returns {Promise<String>} 网络类型
   */
  getNetworkType() {
    return new Promise((resolve) => {
      uni.getNetworkType({
        success: (res) => {
          resolve(res.networkType);
        },
        fail: () => {
          resolve('unknown');
        }
      });
    });
  }

  /**
   * 主请求方法
   * @param {Object} options - 请求配置
   * @returns {Promise} 请求结果
   */
  async request(options) {
    // 生成请求ID
    const requestId = this.generateRequestId(options);
    
    try {
      // 检查重复请求
      if (this.isDuplicateRequest(requestId)) {
        return this.requestQueue.get(requestId);
      }
      
      // 执行请求拦截器
      const config = await this.executeRequestInterceptors({
        retryCount: API_CONFIG.RETRY_COUNT,
        timeout: API_CONFIG.TIMEOUT,
        ...options
      });
      
      // 显示加载状态
      this.showLoading(requestId, config);
      
      // 构建请求参数
      const requestOptions = {
        url: config.url,
        method: config.method || 'GET',
        header: this.buildHeaders(config.header),
        timeout: config.timeout
      };
      
      // 处理请求数据
      if (config.data) {
        if (config.method === 'GET') {
          requestOptions.url += this.buildQueryString(config.data);
        } else {
          requestOptions.data = config.data;
        }
      }
      
      // 处理文件上传
      if (config.filePath) {
        return this.uploadFile({
          ...requestOptions,
          filePath: config.filePath,
          name: config.name || 'file',
          formData: config.formData
        }, requestId);
      }
      
      // 发送请求
      const requestPromise = this.sendRequest(requestOptions);
      this.addToQueue(requestId, requestPromise);
      
      const response = await requestPromise;
      
      // 执行响应拦截器
      const processedResponse = await this.executeResponseInterceptors(response);
      
      return processedResponse;
      
    } catch (error) {
      // 错误处理
      try {
        return await this.handleResponseError(error, options);
      } catch (handledError) {
        throw handledError;
      }
    } finally {
      // 隐藏加载状态
      this.hideLoading(requestId);
    }
  }

  /**
   * 发送HTTP请求
   * @param {Object} options - 请求参数
   * @returns {Promise} 请求结果
   */
  sendRequest(options) {
    return new Promise((resolve, reject) => {
      uni.request({
        ...options,
        success: (response) => {
          const { statusCode, data, header } = response;
          
          if (statusCode >= 200 && statusCode < 300) {
            resolve({
              data,
              statusCode,
              header,
              success: true
            });
          } else {
            reject({
              statusCode,
              data,
              header,
              message: data?.message || ERROR_MESSAGES[statusCode] || ERROR_MESSAGES.UNKNOWN_ERROR
            });
          }
        },
        fail: (error) => {
          // 网络错误
          if (error.errMsg?.includes('timeout')) {
            reject({
              statusCode: STATUS_CODES.REQUEST_TIMEOUT,
              message: ERROR_MESSAGES.TIMEOUT_ERROR,
              isTimeout: true
            });
          } else {
            reject({
              statusCode: 0,
              message: ERROR_MESSAGES.NETWORK_ERROR,
              isNetworkError: true,
              error
            });
          }
        }
      });
    });
  }

  /**
   * 上传文件
   * @param {Object} options - 上传参数
   * @param {String} requestId - 请求ID
   * @returns {Promise} 上传结果
   */
  uploadFile(options, requestId) {
    return new Promise((resolve, reject) => {
      const uploadTask = uni.uploadFile({
        ...options,
        success: (response) => {
          const { statusCode, data } = response;
          
          if (statusCode >= 200 && statusCode < 300) {
            try {
              const responseData = typeof data === 'string' ? JSON.parse(data) : data;
              resolve({
                data: responseData,
                statusCode,
                success: true
              });
            } catch (parseError) {
              resolve({
                data,
                statusCode,
                success: true
              });
            }
          } else {
            reject({
              statusCode,
              message: ERROR_MESSAGES.UPLOAD_ERROR
            });
          }
        },
        fail: (error) => {
          reject({
            statusCode: 0,
            message: ERROR_MESSAGES.UPLOAD_ERROR,
            error
          });
        }
      });
      
      // 监听上传进度
      uploadTask.onProgressUpdate((progress) => {
        uni.$emit('uploadProgress', {
          requestId,
          progress: progress.progress,
          totalBytesSent: progress.totalBytesSent,
          totalBytesExpectedToSend: progress.totalBytesExpectedToSend
        });
      });
    });
  }

  /**
   * 构建查询字符串
   * @param {Object} params - 参数对象
   * @returns {String} 查询字符串
   */
  buildQueryString(params) {
    if (!params || typeof params !== 'object') {
      return '';
    }
    
    const query = Object.keys(params)
      .filter(key => params[key] !== undefined && params[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return query ? `?${query}` : '';
  }

  /**
   * GET请求
   * @param {String} url - 请求地址
   * @param {Object} params - 请求参数
   * @param {Object} config - 请求配置
   * @returns {Promise} 请求结果
   */
  get(url, params = {}, config = {}) {
    return this.request({
      url,
      method: 'GET',
      data: params,
      ...config
    });
  }

  /**
   * POST请求
   * @param {String} url - 请求地址
   * @param {Object} data - 请求数据
   * @param {Object} config - 请求配置
   * @returns {Promise} 请求结果
   */
  post(url, data = {}, config = {}) {
    return this.request({
      url,
      method: 'POST',
      data,
      ...config
    });
  }

  /**
   * PUT请求
   * @param {String} url - 请求地址
   * @param {Object} data - 请求数据
   * @param {Object} config - 请求配置
   * @returns {Promise} 请求结果
   */
  put(url, data = {}, config = {}) {
    return this.request({
      url,
      method: 'PUT',
      data,
      ...config
    });
  }

  /**
   * DELETE请求
   * @param {String} url - 请求地址
   * @param {Object} config - 请求配置
   * @returns {Promise} 请求结果
   */
  delete(url, config = {}) {
    return this.request({
      url,
      method: 'DELETE',
      ...config
    });
  }

  /**
   * 上传文件
   * @param {String} url - 上传地址
   * @param {String} filePath - 文件路径
   * @param {Object} config - 上传配置
   * @returns {Promise} 上传结果
   */
  upload(url, filePath, config = {}) {
    return this.request({
      url,
      method: 'POST',
      filePath,
      ...config
    });
  }
}

// 创建请求管理器实例
const requestManager = new RequestManager();

// 添加默认请求拦截器
requestManager.addRequestInterceptor((config) => {
  // 记录请求日志
  console.log('请求发送:', {
    url: config.url,
    method: config.method,
    timestamp: new Date().toISOString()
  });
  
  return config;
});

// 添加默认响应拦截器
requestManager.addResponseInterceptor((response) => {
  // 记录响应日志
  console.log('响应接收:', {
    url: response.config?.url,
    statusCode: response.statusCode,
    timestamp: new Date().toISOString()
  });
  
  return response;
});

// 导出请求函数
export const request = requestManager.request.bind(requestManager);
export const get = requestManager.get.bind(requestManager);
export const post = requestManager.post.bind(requestManager);
export const put = requestManager.put.bind(requestManager);
export const del = requestManager.delete.bind(requestManager);
export const upload = requestManager.upload.bind(requestManager);

// 导出请求管理器
export default requestManager;