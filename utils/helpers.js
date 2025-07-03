/**
 * 通用工具函数集合
 * 提供各种实用的工具方法
 */

/**
 * 防抖函数
 * @param {Function} func - 要防抖的函数
 * @param {Number} wait - 等待时间(毫秒)
 * @param {Boolean} immediate - 是否立即执行
 * @returns {Function} 防抖后的函数
 */
export function debounce(func, wait, immediate = false) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func.apply(this, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(this, args);
    };
  }
  
  /**
   * 节流函数
   * @param {Function} func - 要节流的函数
   * @param {Number} limit - 时间间隔(毫秒)
   * @returns {Function} 节流后的函数
   */
  export function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  /**
   * 深拷贝对象
   * @param {*} obj - 要拷贝的对象
   * @returns {*} 拷贝后的对象
   */
  export function deepClone(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    
    if (obj instanceof Array) {
      return obj.map(item => deepClone(item));
    }
    
    if (typeof obj === "object") {
      const clonedObj = {};
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          clonedObj[key] = deepClone(obj[key]);
        }
      }
      return clonedObj;
    }
  }
  
  /**
   * 格式化文件大小
   * @param {Number} bytes - 字节数
   * @param {Number} decimals - 小数位数
   * @returns {String} 格式化后的大小
   */
  export function formatFileSize(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
  
  /**
   * 格式化时间为相对时间
   * @param {Date|String|Number} timestamp - 时间戳
   * @returns {String} 相对时间字符串
   */
  export function formatRelativeTime(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now - date;
    
    const minute = 60 * 1000;
    const hour = 60 * minute;
    const day = 24 * hour;
    const week = 7 * day;
    const month = 30 * day;
    const year = 365 * day;
    
    if (diff < minute) {
      return '刚刚';
    } else if (diff < hour) {
      return `${Math.floor(diff / minute)}分钟前`;
    } else if (diff < day) {
      return `${Math.floor(diff / hour)}小时前`;
    } else if (diff < week) {
      return `${Math.floor(diff / day)}天前`;
    } else if (diff < month) {
      return `${Math.floor(diff / week)}周前`;
    } else if (diff < year) {
      return `${Math.floor(diff / month)}个月前`;
    } else {
      return `${Math.floor(diff / year)}年前`;
    }
  }
  
  /**
   * 格式化日期
   * @param {Date|String|Number} timestamp - 时间戳
   * @param {String} format - 格式化模板
   * @returns {String} 格式化后的日期
   */
  export function formatDate(timestamp, format = 'YYYY-MM-DD HH:mm:ss') {
    const date = new Date(timestamp);
    
    const formatMap = {
      YYYY: date.getFullYear(),
      MM: String(date.getMonth() + 1).padStart(2, '0'),
      DD: String(date.getDate()).padStart(2, '0'),
      HH: String(date.getHours()).padStart(2, '0'),
      mm: String(date.getMinutes()).padStart(2, '0'),
      ss: String(date.getSeconds()).padStart(2, '0')
    };
    
    return format.replace(/YYYY|MM|DD|HH|mm|ss/g, match => formatMap[match]);
  }
  
  /**
   * 生成随机字符串
   * @param {Number} length - 字符串长度
   * @param {String} chars - 字符集
   * @returns {String} 随机字符串
   */
  export function randomString(length = 8, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  /**
   * 生成UUID
   * @returns {String} UUID字符串
   */
  export function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  
  /**
   * 验证邮箱格式
   * @param {String} email - 邮箱地址
   * @returns {Boolean} 是否有效
   */
  export function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  /**
   * 验证手机号格式
   * @param {String} phone - 手机号
   * @returns {Boolean} 是否有效
   */
  export function validatePhone(phone) {
    const re = /^1[3-9]\d{9}$/;
    return re.test(phone);
  }
  
  /**
   * 验证身份证号格式
   * @param {String} idCard - 身份证号
   * @returns {Boolean} 是否有效
   */
  export function validateIdCard(idCard) {
    const re = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    return re.test(idCard);
  }
  
  /**
   * 获取URL参数
   * @param {String} name - 参数名
   * @param {String} url - URL字符串
   * @returns {String|null} 参数值
   */
  export function getUrlParam(name, url = window.location.href) {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get(name);
  }
  
  /**
   * 设置URL参数
   * @param {String} name - 参数名
   * @param {String} value - 参数值
   * @param {String} url - URL字符串
   * @returns {String} 新的URL
   */
  export function setUrlParam(name, value, url = window.location.href) {
    const urlObj = new URL(url);
    urlObj.searchParams.set(name, value);
    return urlObj.toString();
  }
  
  /**
   * 移除URL参数
   * @param {String} name - 参数名
   * @param {String} url - URL字符串
   * @returns {String} 新的URL
   */
  export function removeUrlParam(name, url = window.location.href) {
    const urlObj = new URL(url);
    urlObj.searchParams.delete(name);
    return urlObj.toString();
  }
  
  /**
   * 数组去重
   * @param {Array} arr - 原数组
   * @param {String} key - 去重依据的键名(对象数组使用)
   * @returns {Array} 去重后的数组
   */
  export function uniqueArray(arr, key = null) {
    if (!key) {
      return [...new Set(arr)];
    }
    
    const seen = new Set();
    return arr.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }
  
  /**
   * 数组分组
   * @param {Array} arr - 原数组
   * @param {String|Function} key - 分组依据
   * @returns {Object} 分组后的对象
   */
  export function groupBy(arr, key) {
    return arr.reduce((groups, item) => {
      const group = typeof key === 'function' ? key(item) : item[key];
      groups[group] = groups[group] || [];
      groups[group].push(item);
      return groups;
    }, {});
  }
  
  /**
   * 数组分页
   * @param {Array} arr - 原数组
   * @param {Number} page - 页码(从1开始)
   * @param {Number} size - 每页数量
   * @returns {Object} 分页结果
   */
  export function paginate(arr, page = 1, size = 10) {
    const startIndex = (page - 1) * size;
    const endIndex = startIndex + size;
    
    return {
      data: arr.slice(startIndex, endIndex),
      total: arr.length,
      page,
      size,
      totalPages: Math.ceil(arr.length / size),
      hasNext: endIndex < arr.length,
      hasPrev: page > 1
    };
  }
  
  /**
   * 对象转查询字符串
   * @param {Object} obj - 对象
   * @returns {String} 查询字符串
   */
  export function objectToQueryString(obj) {
    return Object.keys(obj)
      .filter(key => obj[key] !== undefined && obj[key] !== null)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
      .join('&');
  }
  
  /**
   * 金额格式化
   * @param {Number} amount - 金额
   * @param {String} currency - 货币符号
   * @param {Number} decimals - 小数位数
   * @returns {String} 格式化后的金额
   */
  export function formatCurrency(amount, currency = '¥', decimals = 2) {
    return currency + Number(amount).toFixed(decimals).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
  
  /**
   * 数字格式化(添加千分符)
   * @param {Number} num - 数字
   * @returns {String} 格式化后的数字
   */
  export function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  /**
   * 获取设备信息
   * @returns {Object} 设备信息
   */
  export function getDeviceInfo() {
    try {
      const systemInfo = uni.getSystemInfoSync();
      return {
        platform: systemInfo.platform,
        system: systemInfo.system,
        model: systemInfo.model,
        brand: systemInfo.brand,
        version: systemInfo.version,
        screenWidth: systemInfo.screenWidth,
        screenHeight: systemInfo.screenHeight,
        pixelRatio: systemInfo.pixelRatio,
        statusBarHeight: systemInfo.statusBarHeight,
        safeArea: systemInfo.safeArea,
        safeAreaInsets: systemInfo.safeAreaInsets
      };
    } catch (error) {
      console.error('获取设备信息失败:', error);
      return {};
    }
  }
  
  /**
   * 获取网络状态
   * @returns {Promise<Object>} 网络信息
   */
  export function getNetworkInfo() {
    return new Promise((resolve, reject) => {
      uni.getNetworkType({
        success: (res) => {
          resolve({
            networkType: res.networkType,
            isConnected: res.networkType !== 'none'
          });
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }
  
  /**
   * 图片压缩
   * @param {String} src - 图片路径
   * @param {Object} options - 压缩选项
   * @returns {Promise<String>} 压缩后的图片路径
   */
  export function compressImage(src, options = {}) {
    const {
      quality = 0.8,
      width = 800,
      height = 600,
      compressHeight = height,
      rotate = 0
    } = options;
    
    return new Promise((resolve, reject) => {
      uni.compressImage({
        src,
        quality,
        width,
        height,
        compressHeight,
        rotate,
        success: (res) => {
          resolve(res.tempFilePath);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }
  
  /**
   * 获取图片信息
   * @param {String} src - 图片路径
   * @returns {Promise<Object>} 图片信息
   */
  export function getImageInfo(src) {
    return new Promise((resolve, reject) => {
      uni.getImageInfo({
        src,
        success: (res) => {
          resolve({
            width: res.width,
            height: res.height,
            path: res.path,
            orientation: res.orientation,
            type: res.type
          });
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }
  
  /**
   * 选择图片
   * @param {Object} options - 选择选项
   * @returns {Promise<Array>} 图片路径数组
   */
  export function chooseImages(options = {}) {
    const {
      count = 1,
      sizeType = ['original', 'compressed'],
      sourceType = ['album', 'camera']
    } = options;
    
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count,
        sizeType,
        sourceType,
        success: (res) => {
          resolve(res.tempFilePaths);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }
  
  /**
   * 预览图片
   * @param {String|Array} urls - 图片路径或路径数组
   * @param {Number} current - 当前显示的图片索引
   */
  export function previewImages(urls, current = 0) {
    const urlArray = Array.isArray(urls) ? urls : [urls];
    const currentUrl = typeof current === 'number' ? urlArray[current] : current;
    
    uni.previewImage({
      urls: urlArray,
      current: currentUrl
    });
  }
  
  /**
   * 保存图片到相册
   * @param {String} filePath - 图片路径
   * @returns {Promise<void>}
   */
  export function saveImageToAlbum(filePath) {
    return new Promise((resolve, reject) => {
      uni.saveImageToPhotosAlbum({
        filePath,
        success: () => {
          uni.showToast({
            title: '保存成功',
            icon: 'success'
          });
          resolve();
        },
        fail: (error) => {
          if (error.errMsg?.includes('auth')) {
            uni.showModal({
              title: '提示',
              content: '需要授权访问相册',
              success: (res) => {
                if (res.confirm) {
                  uni.openSetting();
                }
              }
            });
          } else {
            uni.showToast({
              title: '保存失败',
              icon: 'error'
            });
          }
          reject(error);
        }
      });
    });
  }
  
  /**
   * 获取地理位置
   * @param {Object} options - 位置选项
   * @returns {Promise<Object>} 位置信息
   */
  export function getCurrentLocation(options = {}) {
    const {
      type = 'gcj02',
      altitude = false,
      geocode = false,
      timeout = 10000
    } = options;
    
    return new Promise((resolve, reject) => {
      uni.getLocation({
        type,
        altitude,
        geocode,
        timeout,
        success: (res) => {
          resolve({
            latitude: res.latitude,
            longitude: res.longitude,
            speed: res.speed,
            accuracy: res.accuracy,
            altitude: res.altitude,
            verticalAccuracy: res.verticalAccuracy,
            horizontalAccuracy: res.horizontalAccuracy,
            address: res.address
          });
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }
  
  /**
   * 显示Toast消息
   * @param {String} title - 消息内容
   * @param {String} icon - 图标类型
   * @param {Number} duration - 显示时长
   */
  export function showToast(title, icon = 'none', duration = 2000) {
    uni.showToast({
      title,
      icon,
      duration
    });
  }
  
  /**
   * 显示确认对话框
   * @param {String} title - 标题
   * @param {String} content - 内容
   * @returns {Promise<Boolean>} 用户选择结果
   */
  export function showConfirm(title, content) {
    return new Promise((resolve) => {
      uni.showModal({
        title,
        content,
        success: (res) => {
          resolve(res.confirm);
        },
        fail: () => {
          resolve(false);
        }
      });
    });
  }
  
  /**
   * 振动反馈
   * @param {String} type - 振动类型 (short|long)
   */
  export function vibrate(type = 'short') {
    if (type === 'short') {
      uni.vibrateShort();
    } else {
      uni.vibrateLong();
    }
  }
  
  /**
   * 复制到剪贴板
   * @param {String} data - 要复制的内容
   * @returns {Promise<void>}
   */
  export function copyToClipboard(data) {
    return new Promise((resolve, reject) => {
      uni.setClipboardData({
        data,
        success: () => {
          showToast('复制成功');
          resolve();
        },
        fail: (error) => {
          showToast('复制失败', 'error');
          reject(error);
        }
      });
    });
  }
  
  /**
   * 从剪贴板获取内容
   * @returns {Promise<String>} 剪贴板内容
   */
  export function getClipboardData() {
    return new Promise((resolve, reject) => {
      uni.getClipboardData({
        success: (res) => {
          resolve(res.data);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }
  
  /**
   * 页面跳转封装
   * @param {String} url - 页面路径
   * @param {Object} params - 参数对象
   * @param {String} type - 跳转类型
   */
  export function navigateTo(url, params = {}, type = 'navigateTo') {
    let targetUrl = url;
    
    // 添加参数
    if (Object.keys(params).length > 0) {
      const queryString = objectToQueryString(params);
      targetUrl += (url.includes('?') ? '&' : '?') + queryString;
    }
    
    const navigationMethods = {
      navigateTo: uni.navigateTo,
      redirectTo: uni.redirectTo,
      reLaunch: uni.reLaunch,
      switchTab: uni.switchTab,
      navigateBack: uni.navigateBack
    };
    
    const method = navigationMethods[type] || uni.navigateTo;
    
    method({
      url: targetUrl,
      fail: (error) => {
        console.error('页面跳转失败:', error);
        showToast('页面跳转失败', 'error');
      }
    });
  }
  
  // 导出所有工具函数
  export default {
    debounce,
    throttle,
    deepClone,
    formatFileSize,
    formatRelativeTime,
    formatDate,
    randomString,
    generateUUID,
    validateEmail,
    validatePhone,
    validateIdCard,
    getUrlParam,
    setUrlParam,
    removeUrlParam,
    uniqueArray,
    groupBy,
    paginate,
    objectToQueryString,
    queryStringToObject,
    formatCurrency,
    formatNumber,
    getDeviceInfo,
    getNetworkInfo,
    compressImage,
    getImageInfo,
    chooseImages,
    previewImages,
    saveImageToAlbum,
    getCurrentLocation,
    showToast,
    showConfirm,
    vibrate,
    copyToClipboard,
    getClipboardData,
    navigateTo
  };