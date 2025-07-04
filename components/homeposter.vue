<template>
  <view class="poster-item" @click="handleItemClick">
    <!-- 使用OSS URL显示图片 -->
    <image 
      :src="imageUrl" 
      :style="{ height: posterData.imageHeight + 'px' }"
      class="poster-image"
      mode="aspectFill"
      @error="handleImageError"
      @load="handleImageLoad"
    />
    
    <!-- 加载状态 -->
    <view v-if="imageLoading" class="image-loading">
      <view class="loading-spinner"></view>
    </view>
    
    <!-- 图片信息覆盖层 -->
    <view class="poster-info">
      <view class="poster-description">
        {{ posterData.description }}
      </view>
      
      <!-- 统计信息 -->
      <view class="poster-stats">
        <view class="stat-item" v-if="posterData.views">
          <text class="stat-icon">👁</text>
          <text class="stat-text">{{ formatNumber(posterData.views) }}</text>
        </view>
        
        <view class="stat-item" v-if="posterData.likes">
          <text class="stat-icon">❤️</text>
          <text class="stat-text">{{ formatNumber(posterData.likes) }}</text>
        </view>
        
        <!-- 识别记录特有的准确率 -->
        <view class="stat-item" v-if="posterData.accuracy">
          <text class="accuracy-text">{{ posterData.accuracy }}</text>
        </view>
        
        <!-- 识别记录特有的日期 -->
        <view class="stat-item" v-if="posterData.date">
          <text class="date-text">{{ posterData.date }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'HomePoster',
  
  props: {
    posterData: {
      type: Object,
      required: true,
      default: () => ({
        id: '',
        imageUrl: '',
        imageHeight: 200,
        description: '',
        views: 0,
        likes: 0,
        accuracy: '',
        date: ''
      })
    }
  },
  
  data() {
    return {
      imageLoading: true,
      imageError: false,
      // OSS配置
      ossConfig: {
        baseUrl: 'https://birdfront-oss.oss-cn-shanghai.aliyuncs.com',
      }
    }
  },
  
  computed: {
    /**
     * 计算图片的OSS URL
     */
    imageUrl() {
      return this.getOSSUrl(this.posterData.imageUrl || this.posterData.src, 'medium')
    }
  },
  
  methods: {
    /**
     * 获取OSS图片URL
     * @param {string} filename - 文件名
     * @param {string} size - 尺寸类型
     * @returns {string} 完整的OSS URL
     */
    getOSSUrl(filename, size = 'medium') {
      if (!filename) {
        return `${this.ossConfig.baseUrl}/static/placeholder.png?x-oss-process=image/resize,m_lfit,w_300,h_300/quality,q_70`
      }
      
      // 确保文件名不以斜杠开头
      const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename
      
      // 根据尺寸类型设置不同的处理参数
      let params = ''
      switch(size) {
        case 'thumbnail':
          params = '?x-oss-process=image/resize,m_lfit,w_150,h_150/quality,q_85'
          break
        case 'small':
          params = '?x-oss-process=image/resize,m_lfit,w_300,h_300/quality,q_85'
          break
        case 'medium':
          params = '?x-oss-process=image/resize,m_lfit,w_600,h_600/quality,q_80'
          break
        case 'large':
          params = '?x-oss-process=image/resize,m_lfit,w_1200,h_1200/quality,q_85'
          break
        default:
          params = '?x-oss-process=image/resize,m_lfit,w_600,h_600/quality,q_80'
      }
      
      const fullUrl = `${this.ossConfig.baseUrl}/${cleanFilename}${params}`
      
      // 调试信息
      console.log('HomePoster getOSSUrl:', {
        originalFilename: filename,
        cleanFilename,
        size,
        params,
        fullUrl
      })
      
      return fullUrl
    },
    
    /**
     * 处理图片加载完成
     */
    handleImageLoad() {
      this.imageLoading = false
      this.imageError = false
    },
    
    /**
     * 处理图片加载错误
     */
    handleImageError() {
      this.imageLoading = false
      this.imageError = true
      console.warn('图片加载失败:', this.posterData.imageUrl)
      
      // 可以尝试使用备用图片
      // this.$emit('image-error', this.posterData)
    },
    
    /**
     * 处理点击事件
     */
    handleItemClick() {
      this.$emit('item-click', this.posterData)
      
      // 如果有详情页面，可以跳转
      if (this.posterData.id) {
        uni.navigateTo({
          url: `/pages/detail/detail?id=${this.posterData.id}`
        })
      }
    },
    
    /**
     * 格式化数字显示
     */
    formatNumber(num) {
      if (!num) return '0'
      
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w'
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k'
      }
      
      return num.toString()
    }
  }
}
</script>

<style scoped>
.poster-item {
  position: relative;
  margin-bottom: 12px;
  border-radius: 12px;
  overflow: hidden;
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.poster-item:active {
  transform: scale(0.98);
}

.poster-image {
  width: 100%;
  display: block;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.poster-image:hover {
  transform: scale(1.02);
}

/* 加载状态 */
.image-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #2EA3B7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 信息覆盖层 */
.poster-info {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 16px 12px 12px;
  transition: all 0.3s ease;
}

.poster-item:hover .poster-info {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  padding: 20px 12px 16px;
}

.poster-description {
  font-size: 14px;
  line-height: 1.4;
  margin-bottom: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.poster-stats {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  padding: 4px 8px;
  border-radius: 12px;
  backdrop-filter: blur(4px);
}

.stat-icon {
  font-size: 12px;
  margin-right: 4px;
}

.stat-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

/* 识别记录特有样式 */
.accuracy-text {
  font-size: 12px;
  color: #4CAF50;
  font-weight: bold;
  background: rgba(76, 175, 80, 0.2);
  padding: 2px 6px;
  border-radius: 8px;
}

.date-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

/* 响应式适配 */
@media (max-width: 480px) {
  .poster-info {
    padding: 12px 8px 8px;
  }
  
  .poster-description {
    font-size: 13px;
  }
  
  .stat-text,
  .accuracy-text {
    font-size: 11px;
  }
  
  .date-text {
    font-size: 10px;
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .poster-item {
    background: #1a1a1a;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }
  
  .poster-image {
    background-color: #2a2a2a;
  }
}
</style>