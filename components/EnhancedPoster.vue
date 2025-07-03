<template>
  <view 
    class="enhanced-poster"
    @click="handlePosterClick"
    :class="{ 'poster-pressed': isPressed }"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <!-- 图片容器 -->
    <view class="image-container">
      <image 
        :src="posterData.imageUrl" 
        class="poster-image"
        mode="aspectFill"
        @load="onImageLoad"
        @error="onImageError"
        :style="{ height: imageHeight + 'rpx' }"
      />
      
      <!-- 图片加载状态 -->
      <view v-if="imageLoading" class="image-loading">
        <view class="loading-skeleton"></view>
      </view>
      
      <!-- 图片遮罩层 -->
      <view class="image-overlay">
        <!-- 位置信息 -->
        <view v-if="posterData.location" class="location-tag">
          <image src="/static/icons/location.png" class="location-icon"></image>
          <text class="location-text">{{ posterData.location }}</text>
        </view>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-container">
      <!-- 用户信息 -->
      <view class="author-info">
        <image 
          :src="posterData.author?.avatar || '/static/avatars/default.png'"
          class="author-avatar"
        />
        <view class="author-details">
          <text class="author-name">{{ posterData.author?.name || '匿名用户' }}</text>
          <text class="publish-time">{{ posterData.publishTime || '刚刚' }}</text>
        </view>
      </view>

      <!-- 描述文本 -->
      <view class="description-container">
        <text 
          class="description-text"
          :class="{ 'text-expanded': isTextExpanded }"
        >
          {{ posterData.description }}
        </text>
        
        <!-- 展开/收起按钮 -->
        <text 
          v-if="isTextTruncated"
          class="expand-btn"
          @click.stop="toggleTextExpansion"
        >
          {{ isTextExpanded ? '收起' : '全文' }}
        </text>
      </view>

      <!-- 互动区域 -->
      <view class="interaction-area">
        <view class="stats-container">
          <!-- 查看数 -->
          <view class="stat-item">
            <image src="/static/icons/view.png" class="stat-icon"></image>
            <text class="stat-text">{{ formatNumber(posterData.views) }}</text>
          </view>
        </view>

        <!-- 操作按钮 -->
        <view class="action-buttons">
          <!-- 点赞按钮 -->
          <view 
            class="action-btn like-btn"
            :class="{ 'like-active': isLiked }"
            @click.stop="handleLike"
          >
            <image 
              :src="isLiked ? '/static/icons/thumbs-up-filled.png' : '/static/icons/thumbs-up.png'"
              class="action-icon like-icon"
            />
            <text class="action-text">{{ formatNumber(posterData.likes) }}</text>
            
            <!-- 点赞动画 -->
            <view v-if="showLikeAnimation" class="like-animation">
              <text class="like-thumb">👍</text>
            </view>
          </view>

          <!-- 分享按钮 -->
          <view 
            class="action-btn share-btn"
            @click.stop="handleShare"
          >
            <image src="/static/icons/share.png" class="action-icon" />
          </view>
        </view>
      </view>
    </view>

    <!-- 卡片装饰元素 -->
    <view class="card-decoration">
      <view class="decoration-dot dot-1"></view>
      <view class="decoration-dot dot-2"></view>
      <view class="decoration-dot dot-3"></view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// ========== Props定义 ==========
const props = defineProps({
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
      author: {
        name: '',
        avatar: ''
      },
      location: '',
      publishTime: ''
    })
  }
});

// ========== Emits定义 ==========
const emit = defineEmits(['like', 'view', 'share']);

// ========== 响应式数据 ==========
const imageLoading = ref(true);
const isPressed = ref(false);
const isTextExpanded = ref(false);
const isLiked = ref(false);
const showLikeAnimation = ref(false);

// ========== 计算属性 ==========
const imageHeight = computed(() => {
  return props.posterData.imageHeight || 200;
});

const isTextTruncated = computed(() => {
  return props.posterData.description && props.posterData.description.length > 50;
});

// ========== 事件处理函数 ==========

/**
 * 图片加载完成
 */
const onImageLoad = () => {
  imageLoading.value = false;
};

/**
 * 图片加载失败
 */
const onImageError = () => {
  imageLoading.value = false;
  console.error('图片加载失败:', props.posterData.imageUrl);
};

/**
 * 触摸开始
 */
const onTouchStart = () => {
  isPressed.value = true;
};

/**
 * 触摸结束
 */
const onTouchEnd = () => {
  isPressed.value = false;
};

/**
 * 海报点击处理
 */
const handlePosterClick = () => {
  // 触发查看事件
  emit('view', props.posterData);
  
  // 添加触觉反馈
  uni.vibrateShort({
    type: 'light'
  });
};

/**
 * 切换文本展开状态
 */
const toggleTextExpansion = () => {
  isTextExpanded.value = !isTextExpanded.value;
};

/**
 * 点赞处理
 */
const handleLike = () => {
  if (isLiked.value) return;
  
  isLiked.value = true;
  showLikeAnimation.value = true;
  
  // 触发点赞事件
  emit('like', props.posterData);
  
  // 添加触觉反馈
  uni.vibrateShort({
    type: 'medium'
  });
  
  // 隐藏动画
  setTimeout(() => {
    showLikeAnimation.value = false;
  }, 1000);
};

/**
 * 分享处理
 */
const handleShare = () => {
  emit('share', props.posterData);
  
  uni.showActionSheet({
    itemList: ['分享到微信', '分享到朋友圈', '复制链接'],
    success: (res) => {
      const actions = ['微信', '朋友圈', '复制链接'];
      const action = actions[res.tapIndex];
      
      uni.showToast({
        title: `已${action}`,
        icon: 'success',
        duration: 1500
      });
    }
  });
};

// ========== 工具函数 ==========

/**
 * 格式化数字显示
 * @param {Number} num - 数字
 * @returns {String} 格式化后的字符串
 */
const formatNumber = (num) => {
  if (!num) return '0';
  
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  
  return num.toString();
};

// ========== 生命周期 ==========
onMounted(() => {
  // 随机延迟一些时间来创建更自然的加载效果
  const delay = Math.random() * 300;
  setTimeout(() => {
    imageLoading.value = false;
  }, delay);
});
</script>

<style lang="scss" scoped>
// ========== 主卡片样式 ==========
.enhanced-poster {
  background: white;
  border-radius: 24rpx;
  overflow: hidden;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.06);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  margin-bottom: 16rpx;
  
  &:hover {
    transform: translateY(-4rpx);
    box-shadow: 0 12rpx 48rpx rgba(0, 0, 0, 0.12);
  }
  
  &.poster-pressed {
    transform: scale(0.98);
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.08);
  }
}

// ========== 图片容器样式 ==========
.image-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  border-radius: 24rpx 24rpx 0 0;
}

.poster-image {
  width: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  .enhanced-poster:hover & {
    transform: scale(1.05);
  }
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-skeleton {
  width: 60rpx;
  height: 60rpx;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 50%;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    transparent 60%,
    rgba(0, 0, 0, 0.3) 100%
  );
  pointer-events: none;
}

.location-tag {
  position: absolute;
  top: 16rpx;
  left: 16rpx;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10rpx);
  border-radius: 20rpx;
  padding: 8rpx 16rpx;
  display: flex;
  align-items: center;
  gap: 8rpx;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
}

.location-icon {
  width: 24rpx;
  height: 24rpx;
}

.location-text {
  font-size: 20rpx;
  color: #666;
  font-weight: 500;
}

// ========== 内容容器样式 ==========
.content-container {
  padding: 24rpx;
}

.author-info {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  gap: 16rpx;
}

.author-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
  border: 4rpx solid #f0f0f0;
  object-fit: cover;
}

.author-details {
  flex: 1;
}

.author-name {
  display: block;
  font-size: 26rpx;
  color: #333;
  font-weight: 600;
  margin-bottom: 4rpx;
}

.publish-time {
  display: block;
  font-size: 22rpx;
  color: #999;
}

// ========== 描述区域样式 ==========
.description-container {
  margin-bottom: 20rpx;
  position: relative;
}

.description-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:not(.text-expanded) {
    -webkit-line-clamp: 3;
  }
  
  &.text-expanded {
    -webkit-line-clamp: unset;
  }
}

.expand-btn {
  color: #4caf50;
  font-size: 24rpx;
  font-weight: 600;
  margin-left: 8rpx;
  cursor: pointer;
  transition: opacity 0.3s ease;
  
  &:active {
    opacity: 0.7;
  }
}

// ========== 交互区域样式 ==========
.interaction-area {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.stats-container {
  display: flex;
  gap: 24rpx;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.stat-icon {
  width: 28rpx;
  height: 28rpx;
  opacity: 0.6;
}

.stat-text {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 16rpx;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8rpx;
  padding: 12rpx 16rpx;
  border-radius: 20rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &:active {
    transform: scale(0.95);
  }
}

.like-btn {
  background: linear-gradient(135deg, #fff3e0 0%, #fff8f0 100%);
  border: 2rpx solid #ffcc80;
  
  &.like-active {
    background: linear-gradient(135deg, #ffcc80 0%, #ffb74d 100%);
    border-color: #ff9800;
    
    .action-text {
      color: #e65100;
      font-weight: 600;
    }
    
    .like-icon {
      filter: brightness(1.1);
      transform: scale(1.1);
    }
  }
  
  &:hover {
    background: linear-gradient(135deg, #ffcc80 0%, #ffb74d 100%);
    transform: translateY(-2rpx);
    box-shadow: 0 6rpx 20rpx rgba(255, 152, 0, 0.25);
  }
}

.share-btn {
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%);
  border: 2rpx solid #bbdefb;
  padding: 12rpx;
  
  &:hover {
    background: linear-gradient(135deg, #bbdefb 0%, #e1f5fe 100%);
    transform: translateY(-2rpx);
  }
}

.like-icon {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  .like-active & {
    filter: brightness(1.1) contrast(1.1);
    transform: scale(1.1);
  }
}

.action-icon {
  width: 32rpx;
  height: 32rpx;
  transition: transform 0.3s ease;
}

.action-text {
  font-size: 24rpx;
  color: #666;
  font-weight: 500;
  transition: color 0.3s ease;
}

// ========== 点赞动画 ==========
.like-animation {
  position: absolute;
  top: -20rpx;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none;
  animation: likeFloatUp 1s ease-out forwards;
}

.like-thumb {
  font-size: 32rpx;
  display: block;
}

@keyframes likeFloatUp {
  0% {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(0.8) rotate(0deg);
  }
  30% {
    opacity: 1;
    transform: translateX(-50%) translateY(-10rpx) scale(1.2) rotate(-5deg);
  }
  60% {
    opacity: 0.8;
    transform: translateX(-50%) translateY(-25rpx) scale(1.1) rotate(5deg);
  }
  100% {
    opacity: 0;
    transform: translateX(-50%) translateY(-40rpx) scale(0.8) rotate(0deg);
  }
}

// ========== 装饰元素 ==========
.card-decoration {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
  pointer-events: none;
}

.decoration-dot {
  position: absolute;
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: rgba(76, 175, 80, 0.3);
  animation: dotFloat 3s ease-in-out infinite;
  
  &.dot-1 {
    top: 0;
    left: 0;
    animation-delay: 0s;
  }
  
  &.dot-2 {
    top: 16rpx;
    left: 8rpx;
    animation-delay: 1s;
  }
  
  &.dot-3 {
    top: 32rpx;
    left: 16rpx;
    animation-delay: 2s;
  }
}

@keyframes dotFloat {
  0%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  50% {
    opacity: 0.8;
    transform: translateY(-8rpx);
  }
}

// ========== 响应式适配 ==========
@media screen and (max-width: 750rpx) {
  .content-container {
    padding: 20rpx;
  }
  
  .author-avatar {
    width: 52rpx;
    height: 52rpx;
  }
  
  .author-name {
    font-size: 24rpx;
  }
  
  .description-text {
    font-size: 26rpx;
  }
  
  .action-btn {
    padding: 10rpx 14rpx;
  }
}
</style>