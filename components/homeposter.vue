<template>
  <view class="poster" @click="navigateToDetail">
    <!-- 图片区域 -->
    <image 
      :src="posterData.imageUrl" 
      :style="{ height: posterData.imageHeight + 'px' }"
      class="poster-image"
      mode="aspectFill"
    ></image>
    
    <!-- 内容区域 -->
    <view class="poster-content">
      <text class="description">{{ posterData.description }}</text>
      
      <view class="interaction-info">
        <view class="info-item">
          <image src="/static/icons/eye.png" class="icon"></image>
          <text>{{ formatNumber(posterData.views) }}</text>
        </view>
        <view class="info-item">
          <image src="/static/icons/heart.png" class="icon"></image>
          <text>{{ formatNumber(posterData.likes) }}</text>
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
        imageUrl: '',
        imageHeight: 200,
        description: '',
        views: 0,
        likes: 0
      })
    }
  },

  methods: {
    formatNumber(num) {
      if (num >= 10000) {
        return (num / 10000).toFixed(1) + 'w';
      }
      return num;
    },

    navigateToDetail() {
      try {
        const url = `/pages/PostDetail/PostDetail?id=${this.posterData.id}`;
        uni.navigateTo({
          url,
          fail: (err) => {
            console.error('Navigation failed:', err);
            uni.showToast({
              title: '页面跳转失败',
              icon: 'none'
            });
          }
        });
      } catch (error) {
        console.error('Navigation error:', error);
      }
    }
  }
}
</script>

<style scoped>
.poster {
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.poster-image {
  width: 100%;
  border-radius: 8px 8px 0 0;
}

.poster-content {
  padding: 8px 12px;
}

.description {
  font-size: 14px;
  color: #333;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

.interaction-info {
  display: flex;
  align-items: center;
  margin-top: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  margin-right: 16px;
}

.icon {
  width: 16px;
  height: 16px;
  margin-right: 4px;
}

.info-item text {
  font-size: 12px;
  color: #999;
}
</style>