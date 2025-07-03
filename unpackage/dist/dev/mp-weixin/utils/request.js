"use strict";
const common_vendor = require("../common/vendor.js");
const config_api = require("../config/api.js");
class RequestManager {
  constructor() {
    this.requestQueue = /* @__PURE__ */ new Map();
    this.retryQueue = /* @__PURE__ */ new Map();
    this.requestInterceptors = [];
    this.responseInterceptors = [];
    this.errorHandlers = /* @__PURE__ */ new Map();
    this.loadingStates = /* @__PURE__ */ new Set();
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
      return common_vendor.index.getStorageSync(config_api.STORAGE_KEYS.TOKEN);
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/request.js:60", "获取Token失败:", error);
      return null;
    }
  }
  /**
   * 设置Token
   * @param {String} token - Token值
   */
  setToken(token) {
    try {
      common_vendor.index.setStorageSync(config_api.STORAGE_KEYS.TOKEN, token);
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/request.js:73", "设置Token失败:", error);
    }
  }
  /**
   * 清除Token
   */
  clearToken() {
    try {
      common_vendor.index.removeStorageSync(config_api.STORAGE_KEYS.TOKEN);
      common_vendor.index.removeStorageSync(config_api.STORAGE_KEYS.REFRESH_TOKEN);
      common_vendor.index.removeStorageSync(config_api.STORAGE_KEYS.USER_INFO);
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/request.js:86", "清除Token失败:", error);
    }
  }
  /**
   * 构建请求头
   * @param {Object} customHeaders - 自定义请求头
   * @returns {Object} 完整的请求头
   */
  buildHeaders(customHeaders = {}) {
    const headers = {
      ...config_api.API_CONFIG.HEADERS,
      ...customHeaders
    };
    const token = this.getToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const systemInfo = common_vendor.index.getSystemInfoSync();
    headers["X-Device-Type"] = systemInfo.platform;
    headers["X-Device-Model"] = systemInfo.model;
    headers["X-App-Version"] = systemInfo.version;
    return headers;
  }
  /**
   * 生成请求唯一标识
   * @param {Object} options - 请求配置
   * @returns {String} 请求标识
   */
  generateRequestId(options) {
    const { url, method, data } = options;
    const dataStr = data ? JSON.stringify(data) : "";
    return `${method}_${url}_${dataStr}`.replace(/[^a-zA-Z0-9]/g, "_");
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
      common_vendor.index.showLoading({
        title: loadingConfig.loadingText || "加载中...",
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
      if (this.loadingStates.size === 0) {
        common_vendor.index.hideLoading();
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
        common_vendor.index.__f__("error", "at utils/request.js:193", "请求拦截器执行失败:", error);
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
        common_vendor.index.__f__("error", "at utils/request.js:212", "响应拦截器执行失败:", error);
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
    if (this.errorHandlers.has(statusCode)) {
      try {
        const handler = this.errorHandlers.get(statusCode);
        const result = await handler(error, config);
        if (result)
          return result;
      } catch (handlerError) {
        common_vendor.index.__f__("error", "at utils/request.js:235", "错误处理器执行失败:", handlerError);
      }
    }
    switch (statusCode) {
      case config_api.STATUS_CODES.UNAUTHORIZED:
        return this.handleUnauthorized(error, config);
      case config_api.STATUS_CODES.FORBIDDEN:
        return this.handleForbidden(error, config);
      case config_api.STATUS_CODES.TOO_MANY_REQUESTS:
        return this.handleRateLimit(error, config);
      case config_api.STATUS_CODES.INTERNAL_SERVER_ERROR:
      case config_api.STATUS_CODES.SERVICE_UNAVAILABLE:
      case config_api.STATUS_CODES.GATEWAY_TIMEOUT:
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
    this.clearToken();
    common_vendor.index.reLaunch({
      url: "/pages/login/login"
    });
    common_vendor.index.$emit("tokenExpired");
    throw new Error(config_api.ERROR_MESSAGES.INVALID_TOKEN);
  }
  /**
   * 处理禁止访问错误
   * @param {Object} error - 错误对象
   * @param {Object} config - 请求配置
   */
  async handleForbidden(error, config) {
    common_vendor.index.showToast({
      title: config_api.ERROR_MESSAGES.FORBIDDEN,
      icon: "error"
    });
    throw new Error(config_api.ERROR_MESSAGES.FORBIDDEN);
  }
  /**
   * 处理频率限制错误
   * @param {Object} error - 错误对象
   * @param {Object} config - 请求配置
   */
  async handleRateLimit(error, config) {
    var _a;
    const retryAfter = ((_a = error.header) == null ? void 0 : _a["Retry-After"]) || 60;
    common_vendor.index.showToast({
      title: `请求过于频繁，请${retryAfter}秒后重试`,
      icon: "error",
      duration: 3e3
    });
    setTimeout(() => {
      this.request(config);
    }, retryAfter * 1e3);
    throw new Error(config_api.ERROR_MESSAGES.TOO_MANY_REQUESTS);
  }
  /**
   * 处理服务器错误
   * @param {Object} error - 错误对象
   * @param {Object} config - 请求配置
   */
  async handleServerError(error, config) {
    if (config.retryCount > 0) {
      config.retryCount--;
      await new Promise((resolve) => {
        setTimeout(resolve, config_api.API_CONFIG.RETRY_DELAY);
      });
      return this.request(config);
    }
    throw new Error(config_api.ERROR_MESSAGES.INTERNAL_SERVER_ERROR);
  }
  /**
   * 处理网络错误
   * @param {Object} error - 错误对象
   * @param {Object} config - 请求配置
   */
  async handleNetworkError(error, config) {
    const networkType = await this.getNetworkType();
    if (networkType === "none") {
      common_vendor.index.showToast({
        title: "网络连接不可用",
        icon: "error"
      });
      throw new Error(config_api.ERROR_MESSAGES.NETWORK_ERROR);
    }
    if (config.retryCount > 0) {
      config.retryCount--;
      await new Promise((resolve) => {
        setTimeout(resolve, config_api.API_CONFIG.RETRY_DELAY);
      });
      return this.request(config);
    }
    throw new Error(config_api.ERROR_MESSAGES.NETWORK_ERROR);
  }
  /**
   * 获取网络类型
   * @returns {Promise<String>} 网络类型
   */
  getNetworkType() {
    return new Promise((resolve) => {
      common_vendor.index.getNetworkType({
        success: (res) => {
          resolve(res.networkType);
        },
        fail: () => {
          resolve("unknown");
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
    const requestId = this.generateRequestId(options);
    try {
      if (this.isDuplicateRequest(requestId)) {
        return this.requestQueue.get(requestId);
      }
      const config = await this.executeRequestInterceptors({
        retryCount: config_api.API_CONFIG.RETRY_COUNT,
        timeout: config_api.API_CONFIG.TIMEOUT,
        ...options
      });
      this.showLoading(requestId, config);
      const requestOptions = {
        url: config.url,
        method: config.method || "GET",
        header: this.buildHeaders(config.header),
        timeout: config.timeout
      };
      if (config.data) {
        if (config.method === "GET") {
          requestOptions.url += this.buildQueryString(config.data);
        } else {
          requestOptions.data = config.data;
        }
      }
      if (config.filePath) {
        return this.uploadFile({
          ...requestOptions,
          filePath: config.filePath,
          name: config.name || "file",
          formData: config.formData
        }, requestId);
      }
      const requestPromise = this.sendRequest(requestOptions);
      this.addToQueue(requestId, requestPromise);
      const response = await requestPromise;
      const processedResponse = await this.executeResponseInterceptors(response);
      return processedResponse;
    } catch (error) {
      try {
        return await this.handleResponseError(error, options);
      } catch (handledError) {
        throw handledError;
      }
    } finally {
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
      common_vendor.index.request({
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
              message: (data == null ? void 0 : data.message) || config_api.ERROR_MESSAGES[statusCode] || config_api.ERROR_MESSAGES.UNKNOWN_ERROR
            });
          }
        },
        fail: (error) => {
          var _a;
          if ((_a = error.errMsg) == null ? void 0 : _a.includes("timeout")) {
            reject({
              statusCode: config_api.STATUS_CODES.REQUEST_TIMEOUT,
              message: config_api.ERROR_MESSAGES.TIMEOUT_ERROR,
              isTimeout: true
            });
          } else {
            reject({
              statusCode: 0,
              message: config_api.ERROR_MESSAGES.NETWORK_ERROR,
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
      const uploadTask = common_vendor.index.uploadFile({
        ...options,
        success: (response) => {
          const { statusCode, data } = response;
          if (statusCode >= 200 && statusCode < 300) {
            try {
              const responseData = typeof data === "string" ? JSON.parse(data) : data;
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
              message: config_api.ERROR_MESSAGES.UPLOAD_ERROR
            });
          }
        },
        fail: (error) => {
          reject({
            statusCode: 0,
            message: config_api.ERROR_MESSAGES.UPLOAD_ERROR,
            error
          });
        }
      });
      uploadTask.onProgressUpdate((progress) => {
        common_vendor.index.$emit("uploadProgress", {
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
    if (!params || typeof params !== "object") {
      return "";
    }
    const query = Object.keys(params).filter((key) => params[key] !== void 0 && params[key] !== null).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join("&");
    return query ? `?${query}` : "";
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
      method: "GET",
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
      method: "POST",
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
      method: "PUT",
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
      method: "DELETE",
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
      method: "POST",
      filePath,
      ...config
    });
  }
}
const requestManager = new RequestManager();
requestManager.addRequestInterceptor((config) => {
  common_vendor.index.__f__("log", "at utils/request.js:669", "请求发送:", {
    url: config.url,
    method: config.method,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
  return config;
});
requestManager.addResponseInterceptor((response) => {
  var _a;
  common_vendor.index.__f__("log", "at utils/request.js:681", "响应接收:", {
    url: (_a = response.config) == null ? void 0 : _a.url,
    statusCode: response.statusCode,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
  return response;
});
requestManager.request.bind(requestManager);
requestManager.get.bind(requestManager);
requestManager.post.bind(requestManager);
requestManager.put.bind(requestManager);
requestManager.delete.bind(requestManager);
requestManager.upload.bind(requestManager);
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/request.js.map
