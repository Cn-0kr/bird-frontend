/**
 * 鸟类相关API服务
 * 提供所有与鸟类数据相关的接口调用
 */

import { request } from '@/utils/request.js';
import { API_CONFIG } from '@/config/api.js';

/**
 * 鸟类API服务类
 */
class BirdService {
  
  /**
   * 获取首页海报列表
   * @param {Object} params - 查询参数
   * @param {Number} params.page - 页码
   * @param {Number} params.size - 每页数量
   * @param {String} params.type - 类型筛选
   * @returns {Promise<Object>} 海报列表数据
   */
  async getPosterList(params = {}) {
    try {
      const { page = 1, size = 20, type = 'all' } = params;
      
      const response = await request({
        url: `${API_CONFIG.BIRD_API}/posters`,
        method: 'GET',
        data: {
          page,
          size,
          type
        }
      });
      
      return {
        code: 200,
        data: response.data,
        message: '获取成功'
      };
      
    } catch (error) {
      console.error('获取海报列表失败:', error);
      throw new Error('获取海报列表失败');
    }
  }

  /**
   * 搜索鸟类海报
   * @param {Object} params - 搜索参数
   * @param {String} params.keyword - 搜索关键词
   * @param {Number} params.page - 页码
   * @param {Number} params.size - 每页数量
   * @returns {Promise<Object>} 搜索结果
   */
  async searchPosters(params) {
    try {
      const { keyword, page = 1, size = 20 } = params;
      
      if (!keyword || keyword.trim() === '') {
        throw new Error('搜索关键词不能为空');
      }
      
      const response = await request({
        url: `${API_CONFIG.BIRD_API}/posters/search`,
        method: 'GET',
        data: {
          keyword: keyword.trim(),
          page,
          size
        }
      });
      
      return {
        code: 200,
        data: response.data,
        message: '搜索成功'
      };
      
    } catch (error) {
      console.error('搜索海报失败:', error);
      throw new Error('搜索失败，请重试');
    }
  }

  /**
   * 获取海报详情
   * @param {String|Number} posterId - 海报ID
   * @returns {Promise<Object>} 海报详情数据
   */
  async getPosterDetail(posterId) {
    try {
      if (!posterId) {
        throw new Error('海报ID不能为空');
      }
      
      const response = await request({
        url: `${API_CONFIG.BIRD_API}/posters/${posterId}`,
        method: 'GET'
      });
      
      return {
        code: 200,
        data: response.data,
        message: '获取成功'
      };
      
    } catch (error) {
      console.error('获取海报详情失败:', error);
      throw new Error('获取海报详情失败');
    }
  }

  /**
   * 点赞海报
   * @param {String|Number} posterId - 海报ID
   * @returns {Promise<Object>} 点赞结果
   */
  async likePoster(posterId) {
    try {
      if (!posterId) {
        throw new Error('海报ID不能为空');
      }
      
      const response = await request({
        url: `${API_CONFIG.BIRD_API}/posters/${posterId}/like`,
        method: 'POST'
      });
      
      return {
        code: 200,
        data: response.data,
        message: '点赞成功'
      };
      
    } catch (error) {
      console.error('点赞失败:', error);
      throw new Error('点赞失败，请重试');
    }
  }

  /**
   * 取消点赞海报
   * @param {String|Number} posterId - 海报ID
   * @returns {Promise<Object>} 取消点赞结果
   */
  async unlikePoster(posterId) {
    try {
      if (!posterId) {
        throw new Error('海报ID不能为空');
      }
      
      const response = await request({
        url: `${API_CONFIG.BIRD_API}/posters/${posterId}/unlike`,
        method: 'POST'
      });
      
      return {
        code: 200,
        data: response.data,
        message: '取消点赞成功'
      };
      
    } catch (error) {
      console.error('取消点赞失败:', error);
      throw new Error('取消点赞失败，请重试');
    }
  }

  /**
   * 获取鸟类图鉴列表
   * @param {Object} params - 查询参数
   * @param {Number} params.page - 页码
   * @param {Number} params.size - 每页数量
   * @param {String} params.category - 分类筛选
   * @returns {Promise<Object>} 图鉴列表数据
   */
  async getEncyclopediaList(params = {}) {
    try {
      const { page = 1, size = 20, category = 'all' } = params;
      
      const response = await request({
        url: `${API_CONFIG.BIRD_API}/encyclopedia`,
        method: 'GET',
        data: {
          page,
          size,
          category
        }
      });
      
      return {
        code: 200,
        data: response.data,
        message: '获取成功'
      };
      
    } catch (error) {
      console.error('获取图鉴列表失败:', error);
      throw new Error('获取图鉴列表失败');
    }
  }

  /**
   * 搜索鸟类图鉴
   * @param {Object} params - 搜索参数
   * @param {String} params.keyword - 搜索关键词
   * @param {Number} params.page - 页码
   * @param {Number} params.size - 每页数量
   * @returns {Promise<Object>} 搜索结果
   */
  async searchEncyclopedia(params) {
    try {
      const { keyword, page = 1, size = 20 } = params;
      
      if (!keyword || keyword.trim() === '') {
        throw new Error('搜索关键词不能为空');
      }
      
      const response = await request({
        url: `${API_CONFIG.BIRD_API}/encyclopedia/search`,
        method: 'GET',
        data: {
          keyword: keyword.trim(),
          page,
          size
        }
      });
      
      return {
        code: 200,
        data: response.data,
        message: '搜索成功'
      };
      
    } catch (error) {
      console.error('搜索图鉴失败:', error);
      throw new Error('搜索失败，请重试');
    }
  }

  /**
   * 获取鸟类详细信息
   * @param {String|Number} birdId - 鸟类ID
   * @returns {Promise<Object>} 鸟类详细信息
   */
  async getBirdDetail(birdId) {
    try {
      if (!birdId) {
        throw new Error('鸟类ID不能为空');
      }
      
      const response = await request({
        url: `${API_CONFIG.BIRD_API}/encyclopedia/${birdId}`,
        method: 'GET'
      });
      
      return {
        code: 200,
        data: response.data,
        message: '获取成功'
      };
      
    } catch (error) {
      console.error('获取鸟类详情失败:', error);
      throw new Error('获取鸟类详情失败');
    }
  }

  /**
   * 获取鸟类分类列表
   * @returns {Promise<Object>} 分类列表数据
   */
  async getBirdCategories() {
    try {
      const response = await request({
        url: `${API_CONFIG.BIRD_API}/categories`,
        method: 'GET'
      });
      
      return {
        code: 200,
        data: response.data,
        message: '获取成功'
      };
      
    } catch (error) {
      console.error('获取分类列表失败:', error);
      throw new Error('获取分类列表失败');
    }
  }

  /**
   * 获取排行榜数据
   * @param {Object} params - 查询参数
   * @param {String} params.type - 排行榜类型 (views|likes|comments)
   * @param {String} params.period - 时间周期 (day|week|month|all)
   * @param {Number} params.limit - 数量限制
   * @returns {Promise<Object>} 排行榜数据
   */
  async getRankingList(params = {}) {
    try {
      const { type = 'views', period = 'week', limit = 50 } = params;
      
      const response = await request({
        url: `${API_CONFIG.BIRD_API}/ranking`,
        method: 'GET',
        data: {
          type,
          period,
          limit
        }
      });
      
      return {
        code: 200,
        data: response.data,
        message: '获取成功'
      };
      
    } catch (error) {
      console.error('获取排行榜失败:', error);
      throw new Error('获取排行榜失败');
    }
  }

  /**
   * 图片识别鸟类
   * @param {String} imagePath - 图片路径
   * @param {Object} options - 识别选项
   * @returns {Promise<Object>} 识别结果
   */
  async identifyBirdFromImage(imagePath, options = {}) {
    try {
      if (!imagePath) {
        throw new Error('图片路径不能为空');
      }
      
      // 上传图片并识别
      const response = await request({
        url: `${API_CONFIG.AI_API}/identify`,
        method: 'POST',
        filePath: imagePath,
        name: 'image',
        formData: {
          confidence_threshold: options.confidenceThreshold || 0.7,
          max_results: options.maxResults || 5
        }
      });
      
      return {
        code: 200,
        data: response.data,
        message: '识别成功'
      };
      
    } catch (error) {
      console.error('图片识别失败:', error);
      throw new Error('图片识别失败，请重试');
    }
  }

  /**
   * 上传用户拍摄的鸟类照片
   * @param {Object} params - 上传参数
   * @param {String} params.imagePath - 图片路径
   * @param {String} params.description - 描述
   * @param {String} params.location - 位置信息
   * @param {Array} params.tags - 标签
   * @returns {Promise<Object>} 上传结果
   */
  async uploadBirdPhoto(params) {
    try {
      const { imagePath, description = '', location = '', tags = [] } = params;
      
      if (!imagePath) {
        throw new Error('图片路径不能为空');
      }
      
      const response = await request({
        url: `${API_CONFIG.BIRD_API}/upload`,
        method: 'POST',
        filePath: imagePath,
        name: 'image',
        formData: {
          description,
          location,
          tags: JSON.stringify(tags)
        }
      });
      
      return {
        code: 200,
        data: response.data,
        message: '上传成功'
      };
      
    } catch (error) {
      console.error('上传照片失败:', error);
      throw new Error('上传失败，请重试');
    }
  }

  /**
   * 获取用户收藏的鸟类
   * @param {Object} params - 查询参数
   * @param {Number} params.page - 页码
   * @param {Number} params.size - 每页数量
   * @returns {Promise<Object>} 收藏列表
   */
  async getFavoritesBirds(params = {}) {
    try {
      const { page = 1, size = 20 } = params;
      
      const response = await request({
        url: `${API_CONFIG.USER_API}/favorites/birds`,
        method: 'GET',
        data: {
          page,
          size
        }
      });
      
      return {
        code: 200,
        data: response.data,
        message: '获取成功'
      };
      
    } catch (error) {
      console.error('获取收藏列表失败:', error);
      throw new Error('获取收藏列表失败');
    }
  }

  /**
   * 收藏/取消收藏鸟类
   * @param {String|Number} birdId - 鸟类ID
   * @param {Boolean} isFavorite - 是否收藏
   * @returns {Promise<Object>} 操作结果
   */
  async toggleFavoriteBird(birdId, isFavorite) {
    try {
      if (!birdId) {
        throw new Error('鸟类ID不能为空');
      }
      
      const url = isFavorite 
        ? `${API_CONFIG.USER_API}/favorites/birds/${birdId}`
        : `${API_CONFIG.USER_API}/favorites/birds/${birdId}`;
      
      const method = isFavorite ? 'POST' : 'DELETE';
      
      const response = await request({
        url,
        method
      });
      
      return {
        code: 200,
        data: response.data,
        message: isFavorite ? '收藏成功' : '取消收藏成功'
      };
      
    } catch (error) {
      console.error('收藏操作失败:', error);
      throw new Error('操作失败，请重试');
    }
  }

  /**
   * 获取鸟类相关统计数据
   * @returns {Promise<Object>} 统计数据
   */
  async getBirdStatistics() {
    try {
      const response = await request({
        url: `${API_CONFIG.BIRD_API}/statistics`,
        method: 'GET'
      });
      
      return {
        code: 200,
        data: response.data,
        message: '获取成功'
      };
      
    } catch (error) {
      console.error('获取统计数据失败:', error);
      throw new Error('获取统计数据失败');
    }
  }

  /**
   * 获取附近的鸟类观测点
   * @param {Object} params - 位置参数
   * @param {Number} params.latitude - 纬度
   * @param {Number} params.longitude - 经度
   * @param {Number} params.radius - 搜索半径(公里)
   * @returns {Promise<Object>} 观测点列表
   */
  async getNearbyBirdSpots(params) {
    try {
      const { latitude, longitude, radius = 10 } = params;
      
      if (!latitude || !longitude) {
        throw new Error('位置信息不能为空');
      }
      
      const response = await request({
        url: `${API_CONFIG.BIRD_API}/spots/nearby`,
        method: 'GET',
        data: {
          latitude,
          longitude,
          radius
        }
      });
      
      return {
        code: 200,
        data: response.data,
        message: '获取成功'
      };
      
    } catch (error) {
      console.error('获取附近观测点失败:', error);
      throw new Error('获取附近观测点失败');
    }
  }

  /**
   * 批量获取鸟类信息
   * @param {Array} birdIds - 鸟类ID数组
   * @returns {Promise<Object>} 鸟类信息列表
   */
  async getBirdsBatch(birdIds) {
    try {
      if (!Array.isArray(birdIds) || birdIds.length === 0) {
        throw new Error('鸟类ID列表不能为空');
      }
      
      const response = await request({
        url: `${API_CONFIG.BIRD_API}/batch`,
        method: 'POST',
        data: {
          bird_ids: birdIds
        }
      });
      
      return {
        code: 200,
        data: response.data,
        message: '获取成功'
      };
      
    } catch (error) {
      console.error('批量获取鸟类信息失败:', error);
      throw new Error('批量获取鸟类信息失败');
    }
  }
  
    // 获取鸟类图鉴列表
    async getEncyclopedia(params = {}) {
      return await request.get('/api/birds/encyclopedia', { params });
    },
    
    // 搜索鸟类
    async searchBirds(keyword) {
      return await request.get('/api/birds/search', { 
        params: { keyword } 
      });
    },
    
    // 获取单个鸟类详情
    async getBirdDetail(id) {
      return await request.get(`/api/birds/${id}`);
    },
    
    // 收藏鸟类
    async likeBird(id) {
      return await request.post(`/api/birds/${id}/like`);
    }
}

// 导出单例实例
export default new BirdService();