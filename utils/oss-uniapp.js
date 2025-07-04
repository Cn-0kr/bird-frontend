/**
 * uni-app专用OSS工具类
 * 针对uni-app环境优化，去除不兼容的API
 * @author Frontend Developer
 * @date 2025-07-03
 */

// OSS配置 - 根据您的实际配置修改
const OSS_CONFIG = {
  region: 'oss-cn-shanghai',
  bucket: 'birdfront-oss',
  endpoint: 'https://birdfront-oss.oss-cn-shanghai.aliyuncs.com',
  customDomain: '', // 自定义CDN域名（可选）
  
  // 图片处理配置
  imageProcess: {
    quality: 80,
    sizes: {
      thumbnail: '150x150',
      small: '300x300',
      medium: '600x600', 
      large: '1200x1200',
      banner: '1920x600'
    },
    format: 'webp',
    fallbackFormat: 'jpg'
  },
  
  // 环境配置
  environment: {
    current: process.env.NODE_ENV || 'development',
    development: {
      enableImageOptimization: false,
      enableCache: false
    },
    production: {
      enableImageOptimization: true,
      enableCache: true
    }
  }
}

/**
 * 获取当前环境配置
 */
function getCurrentConfig() {
  const currentEnv = OSS_CONFIG.environment.current
  const envConfig = OSS_CONFIG.environment[currentEnv] || OSS_CONFIG.environment.development
  
  return {
    ...OSS_CONFIG,
    ...envConfig
  }
}

/**
 * 检查WebP支持
 */
function supportsWebP() {
  // #ifdef H5
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    try {
      const canvas = document.createElement('canvas')
      canvas.width = 1
      canvas.height = 1
      return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
    } catch (error) {
      return false
    }
  }
  // #endif
  
  // 小程序和App环境默认支持WebP
  return true
}

/**
 * 获取最优图片格式
 */
function getOptimalFormat() {
  const config = getCurrentConfig()
  return supportsWebP() ? config.imageProcess.format : config.imageProcess.fallbackFormat
}

/**
 * 构建图片处理参数
 * @param {Object} options - 处理选项
 * @returns {string} URL查询参数字符串
 */
function buildImageProcessParams(options) {
  const config = getCurrentConfig()
  const params = []
  
  // 如果当前环境禁用了图片优化，直接返回空字符串
  if (!config.enableImageOptimization) {
    return ''
  }

  // 图片尺寸处理
  if (options.size && config.imageProcess.sizes[options.size]) {
    const size = config.imageProcess.sizes[options.size]
    const [width, height] = size.split('x')
    params.push(`x-oss-process=image/resize,m_fill,w_${width},h_${height}`)
  } else if (options.width || options.height) {
    let resizeParam = 'x-oss-process=image/resize,m_lfit'
    if (options.width) resizeParam += `,w_${options.width}`
    if (options.height) resizeParam += `,h_${options.height}`
    params.push(resizeParam)
  }

  // 图片质量
  const quality = options.quality || config.imageProcess.quality
  if (quality && quality !== 100) {
    params.push(`x-oss-process=image/quality,q_${quality}`)
  }

  // 图片格式转换
  const format = options.format || getOptimalFormat()
  if (format && format !== 'original') {
    params.push(`x-oss-process=image/format,${format}`)
  }

  // 自定义处理参数
  if (options.customParams && typeof options.customParams === 'object') {
    Object.entries(options.customParams).forEach(([key, value]) => {
      params.push(`${key}=${value}`)
    })
  }

  // 组合多个处理参数
  if (params.length > 1) {
    const processParams = params.filter(p => p.startsWith('x-oss-process=')).map(p => p.replace('x-oss-process=', ''))
    const otherParams = params.filter(p => !p.startsWith('x-oss-process='))
    
    if (processParams.length > 0) {
      const combinedProcess = `x-oss-process=${processParams.join('/')}`
      return [combinedProcess, ...otherParams].join('&')
    }
  }

  return params.join('&')
}

/**
 * 获取OSS完整访问URL
 * @param {string} filename - 文件名（包含路径）
 * @param {Object} options - 可选参数
 * @returns {string} 完整的OSS访问URL
 */
export function getImageUrl(filename, options = {}) {
  try {
    // 参数验证
    if (!filename || typeof filename !== 'string') {
      console.warn('Filename is required and must be a string')
      return ''
    }

    const config = getCurrentConfig()
    
    // 确定使用的域名
    const baseUrl = options.useCustomDomain && config.customDomain 
      ? config.customDomain 
      : config.endpoint

    // 清理文件名（移除开头的斜杠）
    const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename

    // 构建基础URL
    let imageUrl = `${baseUrl}/${cleanFilename}`

    // 添加图片处理参数
    const processParams = buildImageProcessParams(options)
    if (processParams) {
      imageUrl += `?${processParams}`
    }

    return imageUrl

  } catch (error) {
    console.error('生成OSS图片URL失败:', error)
    return filename
  }
}

/**
 * 批量生成图片URL
 * @param {Array<string>} filenames - 文件名数组
 * @param {Object} options - 处理选项
 * @returns {Array<string>} URL数组
 */
export function batchGetImageUrls(filenames, options = {}) {
  if (!Array.isArray(filenames)) {
    console.warn('Filenames must be an array')
    return []
  }

  return filenames.map(filename => getImageUrl(filename, options))
}

/**
 * 预加载图片（uni-app兼容版本）
 * @param {string|Array<string>} urls - 图片URL或URL数组
 * @returns {Promise<Array>} 预加载结果Promise数组
 */
export function preloadImages(urls) {
  const urlArray = Array.isArray(urls) ? urls : [urls]
  
  return Promise.allSettled(
    urlArray.map(url => {
      return new Promise((resolve, reject) => {
        // #ifdef H5
        if (typeof Image !== 'undefined') {
          const img = new Image()
          img.onload = () => resolve(url)
          img.onerror = () => reject(new Error(`Failed to load image: ${url}`))
          img.src = url
        } else {
          resolve(url)
        }
        // #endif
        
        // #ifndef H5
        uni.getImageInfo({
          src: url,
          success: () => resolve(url),
          fail: (error) => reject(new Error(`Failed to load image: ${url}`))
        })
        // #endif
      })
    })
  )
}

/**
 * 获取响应式图片URL集合
 * @param {string} filename - 文件名
 * @param {Array<string>} sizes - 尺寸数组
 * @param {Object} options - 额外选项
 * @returns {Object} 响应式图片URL对象
 */
export function getResponsiveImageUrls(filename, sizes = ['small', 'medium', 'large'], options = {}) {
  const result = {}
  
  sizes.forEach(size => {
    result[size] = getImageUrl(filename, { ...options, size })
  })
  
  return result
}

/**
 * 生成图片srcset属性值
 * @param {string} filename - 文件名
 * @param {Object} sizeMapping - 尺寸映射
 * @param {Object} options - 额外选项
 * @returns {string} srcset属性值
 */
export function generateSrcSet(filename, sizeMapping = {
  small: '480w',
  medium: '768w', 
  large: '1200w'
}, options = {}) {
  return Object.entries(sizeMapping)
    .map(([size, descriptor]) => {
      const url = getImageUrl(filename, { ...options, size })
      return `${url} ${descriptor}`
    })
    .join(', ')
}

/**
 * 处理图片路径，确保符合OSS格式
 * @param {string} path - 原始路径
 * @returns {string} 处理后的路径
 */
export function normalizeImagePath(path) {
  if (!path) return ''
  
  // 移除开头的斜杠
  if (path.startsWith('/')) {
    path = path.slice(1)
  }
  
  // 如果是完整的URL，提取文件名部分
  if (path.includes('://')) {
    const urlParts = path.split('/')
    return urlParts.slice(3).join('/') // 移除协议和域名部分
  }
  
  return path
}

/**
 * 获取带降级方案的图片URL
 * @param {string} filename - 文件名
 * @param {string} fallbackUrl - 降级URL
 * @param {Object} options - OSS选项
 * @returns {string} 图片URL
 */
export function getImageUrlWithFallback(filename, fallbackUrl = '', options = {}) {
  try {
    if (!filename) return fallbackUrl
    return getImageUrl(filename, options) || fallbackUrl
  } catch (error) {
    console.warn('获取OSS URL失败，使用降级方案:', error)
    return fallbackUrl
  }
}

/**
 * 快捷方法：获取不同尺寸的图片URL
 */
export const getThumbnail = (filename) => getImageUrl(filename, { size: 'thumbnail', quality: 85 })
export const getSmallImage = (filename) => getImageUrl(filename, { size: 'small', quality: 85 })
export const getMediumImage = (filename) => getImageUrl(filename, { size: 'medium', quality: 80 })
export const getLargeImage = (filename) => getImageUrl(filename, { size: 'large', quality: 90 })
export const getBannerImage = (filename) => getImageUrl(filename, { size: 'banner', quality: 85 })

/**
 * 创建简化版的OSS工具对象
 */
const ossUtils = {
  getImageUrl,
  batchGetImageUrls,
  preloadImages,
  getResponsiveImageUrls,
  generateSrcSet,
  normalizeImagePath,
  getImageUrlWithFallback,
  getThumbnail,
  getSmallImage,
  getMediumImage,
  getLargeImage,
  getBannerImage
}

export default ossUtils

/**
 * 使用示例：
 * 
 * import { getImageUrl, getThumbnail, preloadImages } from '@/utils/oss-uniapp.js'
 * 
 * // 基础用法
 * const imageUrl = getImageUrl('images/avatar.jpg')
 * 
 * // 快捷方法
 * const thumbnailUrl = getThumbnail('images/avatar.jpg')
 * 
 * // 自定义参数
 * const customUrl = getImageUrl('images/banner.jpg', { 
 *   width: 800, 
 *   height: 400, 
 *   format: 'webp' 
 * })
 * 
 * // 预加载图片
 * preloadImages([imageUrl, thumbnailUrl]).then(results => {
 *   console.log('预加载完成', results)
 * })
 */