import type { BaseResponse } from '@/api/types/response';

// 处理HTTP错误
function handleHttpError(error: WechatMiniprogram.GeneralCallbackResult) {
  let message = '请求失败';
  
  // 处理小程序错误码
  if (typeof error === 'object' && error !== null) {
    switch (error.errMsg) {
      case 'request:fail timeout':
        message = '请求超时';
        break;
      case 'request:fail socket error':
        message = '网络异常';
        break;
      case 'request:fail fail':
        message = '服务器错误';
        break;
      default:
        if (error.errMsg) {
          message = error.errMsg;
        }
    }
  }

  // 显示错误提示
  uni.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  });
}

// 处理业务错误码
function handleErrorCode(code: number, msg: string) {
  switch (code) {
    case 401:
      uni.showToast({
        title: '请先登录',
        icon: 'none'
      });
      // 可以在这里处理登录失效的逻辑
      break;
    case 403:
      uni.showToast({
        title: '没有权限',
        icon: 'none'
      });
      break;
    default:
      uni.showToast({
        title: msg || '操作失败',
        icon: 'none'
      });
  }
}

// 创建请求实例
const request = <T = any>(options: WechatMiniprogram.RequestOption): Promise<T> => {
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      success: (response) => {
        const res = response.data as BaseResponse;
        
        // 统一处理成功情况
        if (res.code === 1) {
          resolve(res.data);
          return;
        }
        
        // 统一处理错误情况
        handleErrorCode(res.code, res.msg);
        reject(new Error(res.msg));
      },
      fail: (error) => {
        handleHttpError(error);
        reject(error);
      }
    });
  });
};

export { request };