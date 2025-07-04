<template>
    <view class="knowledge-card" :class="{ 'card-active': isActive }">
      <!-- 卡片主图 -->
      <view class="card-header">
        <image 
          :src="birdImageUrl" 
          class="bird-image" 
          mode="aspectFill"
          @load="onImageLoad"
          @error="onImageError"
        ></image>
        <view class="image-overlay">
          <view class="bird-title-section">
            <text class="bird-name">{{ birdData.name }}</text>
            <text class="scientific-name">{{ birdData.scientificName }}</text>
          </view>
          <view class="action-buttons">
            <view 
              class="action-btn like-btn" 
              @click="handleLike"
              :class="{ 'liked': isLiked }"
            >
              <image 
                :src="likeIconUrl" 
                class="action-icon"
              ></image>
            </view>
            <view class="action-btn share-btn" @click="handleShare">
              <image :src="shareIconUrl" class="action-icon"></image>
            </view>
          </view>
        </view>
      </view>
  
      <!-- 卡片内容 - 紧凑布局，一屏显示 -->
      <view class="card-content">
        <!-- 基本信息网格 -->
        <view class="basic-info-grid">
          <view class="info-card habitat">
            <image :src="habitatIconUrl" class="info-icon"></image>
            <view class="info-content">
              <text class="info-label">栖息地</text>
              <text class="info-value">{{ birdData.habitat }}</text>
            </view>
          </view>
          
          <view class="info-card size">
            <image :src="sizeIconUrl" class="info-icon"></image>
            <view class="info-content">
              <text class="info-label">体型</text>
              <text class="info-value">{{ birdData.size }}</text>
            </view>
          </view>
          
          <view class="info-card weight">
            <image :src="weightIconUrl" class="info-icon"></image>
            <view class="info-content">
              <text class="info-label">体重</text>
              <text class="info-value">{{ birdData.weight }}</text>
            </view>
          </view>
          
          <view class="info-card wingspan">
            <image :src="wingspanIconUrl" class="info-icon"></image>
            <view class="info-content">
              <text class="info-label">翼展</text>
              <text class="info-value">{{ birdData.wingspan }}</text>
            </view>
          </view>
        </view>
  
        <!-- 特征标签 -->
        <view class="characteristics-section">
          <text class="section-title">主要特征</text>
          <view class="characteristics-tags">
            <text 
              v-for="(characteristic, index) in birdData.characteristics.slice(0, 4)" 
              :key="index"
              class="characteristic-tag"
              :style="{ 'animation-delay': `${index * 0.1}s` }"
            >
              {{ characteristic }}
            </text>
          </view>
        </view>
  
        <!-- 生活习性 - 紧凑展示 -->
        <view class="habits-section">
          <view class="habit-item diet">
            <view class="habit-header">
              <image :src="dietIconUrl" class="habit-icon"></image>
              <text class="habit-title">饮食</text>
            </view>
            <text class="habit-desc">{{ birdData.diet }}</text>
          </view>
          
          <view class="habit-item behavior">
            <view class="habit-header">
              <image :src="behaviorIconUrl" class="habit-icon"></image>
              <text class="habit-title">行为</text>
            </view>
            <text class="habit-desc">{{ birdData.behavior }}</text>
          </view>
        </view>
  
        <!-- 趣味知识 - 精选显示 -->
        <view class="fun-facts-section">
          <text class="section-title">趣味知识</text>
          <view class="fun-facts-compact">
            <view 
              v-for="(fact, index) in birdData.funFacts.slice(0, 2)" 
              :key="index"
              class="fun-fact"
              :style="{ 'animation-delay': `${index * 0.15}s` }"
            >
              <view class="fact-bullet">{{ index + 1 }}</view>
              <text class="fact-text">{{ fact }}</text>
            </view>
          </view>
        </view>
  
        <!-- 保护状态与分布 -->
        <view class="status-section">
          <view class="distribution-info">
            <image :src="distributionIconUrl" class="distribution-icon"></image>
            <view class="distribution-content">
              <text class="distribution-label">分布区域</text>
              <text class="distribution-text">{{ birdData.distribution }}</text>
            </view>
          </view>
          
          <view class="conservation-status" :class="getConservationClass(birdData.conservationStatus)">
            <image :src="conservationIconUrl" class="conservation-icon"></image>
            <text class="conservation-text">{{ birdData.conservationStatus }}</text>
          </view>
        </view>
  
        <!-- 声音与寿命 -->
        <view class="bottom-info">
          <view class="sound-info">
            <image :src="soundIconUrl" class="sound-icon"></image>
            <text class="sound-text">{{ birdData.callDescription }}</text>
            <view class="play-sound-btn" @click="playBirdCall">
              <image :src="playIconUrl" class="play-icon"></image>
            </view>
          </view>
          
          <view class="lifespan-info">
            <image :src="lifespanIconUrl" class="lifespan-icon"></image>
            <text class="lifespan-text">{{ birdData.lifespan }}</text>
          </view>
        </view>
      </view>
    </view>
  </template>
  
  <script setup>
  import { ref, computed, defineProps, defineEmits } from 'vue';
  
  // ========== Props 定义 ==========
  const props = defineProps({
    birdData: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  });
  
  // ========== Emits 定义 ==========
  const emit = defineEmits(['like', 'share']);
  
  // ========== 响应式数据 ==========
  const isLiked = ref(false);
  const imageLoaded = ref(false);
  
  // OSS配置
  const ossConfig = {
    baseUrl: 'https://birdfront-oss.oss-cn-shanghai.aliyuncs.com'
  };

  // ========== OSS工具方法 ==========
  /**
   * 获取OSS图片URL
   * @param {string} filename - 文件名
   * @param {string} size - 尺寸类型
   * @returns {string} 完整的OSS URL
   */
  const getOSSUrl = (filename, size = 'icon') => {
    if (!filename) return '';
    
    // 确保文件名不以斜杠开头
    const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
    
    // 根据尺寸类型设置不同的处理参数
    let params = '';
    switch(size) {
      case 'icon':
        params = '?x-oss-process=image/resize,m_lfit,w_64,h_64/quality,q_90';
        break;
      case 'small':
        params = '?x-oss-process=image/resize,m_lfit,w_150,h_150/quality,q_90';
        break;
      case 'medium':
        params = '?x-oss-process=image/resize,m_lfit,w_300,h_300/quality,q_85';
        break;
      case 'large':
        params = '?x-oss-process=image/resize,m_lfit,w_600,h_600/quality,q_85';
        break;
      default:
        params = '?x-oss-process=image/resize,m_lfit,w_64,h_64/quality,q_90';
    }
    
    return `${ossConfig.baseUrl}/${cleanFilename}${params}`;
  };
  
  // ========== 计算属性 ==========
  
  // 主图片URL
  const birdImageUrl = computed(() => {
    return getOSSUrl(props.birdData.imageUrl, 'large');
  });
  
  // 所有图标的OSS URL
  const likeIconUrl = computed(() => {
    const iconPath = isLiked.value ? 'static/icons/heart-filled.png' : 'static/icons/heart.png';
    return getOSSUrl(iconPath, 'icon');
  });
  
  const shareIconUrl = computed(() => getOSSUrl('static/icons/share.png', 'icon'));
  const habitatIconUrl = computed(() => getOSSUrl('static/icons/habitat.png', 'icon'));
  const sizeIconUrl = computed(() => getOSSUrl('static/icons/size.png', 'icon'));
  const weightIconUrl = computed(() => getOSSUrl('static/icons/weight.png', 'icon'));
  const wingspanIconUrl = computed(() => getOSSUrl('static/icons/wingspan.png', 'icon'));
  const dietIconUrl = computed(() => getOSSUrl('static/icons/diet.png', 'icon'));
  const behaviorIconUrl = computed(() => getOSSUrl('static/icons/behavior.png', 'icon'));
  const distributionIconUrl = computed(() => getOSSUrl('static/icons/distribution.png', 'icon'));
  const conservationIconUrl = computed(() => getOSSUrl('static/icons/conservation.png', 'icon'));
  const soundIconUrl = computed(() => getOSSUrl('static/icons/sound.png', 'icon'));
  const playIconUrl = computed(() => getOSSUrl('static/icons/play.png', 'icon'));
  const lifespanIconUrl = computed(() => getOSSUrl('static/icons/lifespan.png', 'icon'));

  /**
   * 获取保护状态的样式类
   * @param {String} status - 保护状态
   * @returns {String} 样式类名
   */
  const getConservationClass = (status) => {
    const statusMap = {
      '无危': 'status-safe',
      '近危': 'status-near-threatened',
      '易危': 'status-vulnerable',
      '濒危': 'status-endangered',
      '极危': 'status-critical'
    };
    return statusMap[status] || 'status-unknown';
  };
  
  // ========== 事件处理函数 ==========
  
  /**
   * 图片加载完成
   */
  const onImageLoad = () => {
    imageLoaded.value = true;
  };
  
  /**
   * 图片加载失败
   */
  const onImageError = () => {
    console.error('鸟类图片加载失败');
  };
  
  /**
   * 处理点赞
   */
  const handleLike = () => {
    isLiked.value = !isLiked.value;
    emit('like', props.birdData);
    
    // 点赞动画反馈
    uni.vibrateShort();
  };
  
  /**
   * 处理分享
   */
  const handleShare = () => {
    emit('share', props.birdData);
  };
  
  /**
   * 播放鸟鸣声
   */
  const playBirdCall = () => {
    // TODO: 实现鸟鸣声播放功能
    uni.showToast({
      title: '播放鸟鸣声',
      icon: 'none'
    });
    
    // 模拟播放反馈
    uni.vibrateShort();
  };
  </script>
  
  <style lang="scss" scoped>
  // ========== 主卡片样式 ==========
  .knowledge-card {
    height: 100%;
    background: white;
    border-radius: 32rpx;
    overflow: hidden;
    box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.12);
    display: flex;
    flex-direction: column;
    transition: all 0.3s ease;
    
    &.card-active {
      transform: scale(1.02);
      box-shadow: 0 12rpx 48rpx rgba(0, 0, 0, 0.15);
    }
  }
  
  // ========== 卡片头部样式 ==========
  .card-header {
    position: relative;
    height: 240rpx; /* 减小头部高度，为内容腾出空间 */
    overflow: hidden;
  }
  
  .bird-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  .card-active .bird-image {
    transform: scale(1.05);
  }
  
  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      180deg, 
      rgba(0, 0, 0, 0.3) 0%, 
      rgba(0, 0, 0, 0.1) 50%,
      rgba(0, 0, 0, 0.6) 100%
    );
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20rpx;
  }
  
  .bird-title-section {
    align-self: flex-end;
    text-align: right;
  }
  
  .bird-name {
    display: block;
    font-size: 36rpx;
    font-weight: 700;
    color: white;
    text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.5);
    margin-bottom: 6rpx;
  }
  
  .scientific-name {
    display: block;
    font-size: 22rpx;
    color: rgba(255, 255, 255, 0.9);
    font-style: italic;
    text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.5);
  }
  
  .action-buttons {
    display: flex;
    gap: 12rpx;
    align-self: flex-start;
  }
  
  .action-btn {
    width: 64rpx;
    height: 64rpx;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(10rpx);
    border-radius: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    border: 2rpx solid rgba(255, 255, 255, 0.3);
    
    &:active {
      transform: scale(0.9);
    }
  }
  
  .like-btn.liked {
    background: rgba(255, 107, 107, 0.3);
    border-color: rgba(255, 107, 107, 0.5);
  }
  
  .action-icon {
    width: 28rpx;
    height: 28rpx;
  }
  
  // ========== 卡片内容样式 ==========
  .card-content {
    flex: 1;
    padding: 24rpx 20rpx;
    display: flex;
    flex-direction: column;
    gap: 20rpx;
  }
  
  // ========== 基本信息网格 ==========
  .basic-info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12rpx;
  }
  
  .info-card {
    background: #f8f9fa;
    border-radius: 12rpx;
    padding: 16rpx;
    display: flex;
    align-items: center;
    gap: 10rpx;
    transition: all 0.3s ease;
    
    &:hover {
      background: #f0f7f0;
      transform: translateY(-1rpx);
    }
  }
  
  .info-icon {
    width: 24rpx;
    height: 24rpx;
    opacity: 0.7;
    flex-shrink: 0;
  }
  
  .info-content {
    flex: 1;
    min-width: 0;
  }
  
  .info-label {
    font-size: 18rpx;
    color: #666;
    margin-bottom: 2rpx;
    display: block;
  }
  
  .info-value {
    font-size: 20rpx;
    color: #333;
    font-weight: 500;
    display: block;
    line-height: 1.3;
  }
  
  // ========== 特征标签样式 ==========
  .characteristics-section {
    .section-title {
      font-size: 24rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 12rpx;
      display: block;
      position: relative;
      padding-left: 12rpx;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4rpx;
        height: 18rpx;
        background: linear-gradient(180deg, #4caf50 0%, #66bb6a 100%);
        border-radius: 2rpx;
      }
    }
  }
  
  .characteristics-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx;
  }
  
  .characteristic-tag {
    background: linear-gradient(135deg, #e8f5e8 0%, #f0f7f0 100%);
    color: #4caf50;
    padding: 6rpx 12rpx;
    border-radius: 12rpx;
    font-size: 18rpx;
    font-weight: 500;
    border: 1rpx solid rgba(76, 175, 80, 0.2);
    animation: slideInLeft 0.5s ease both;
  }
  
  @keyframes slideInLeft {
    from {
      opacity: 0;
      transform: translateX(-10rpx);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  // ========== 生活习性样式 ==========
  .habits-section {
    display: flex;
    gap: 12rpx;
  }
  
  .habit-item {
    flex: 1;
    background: linear-gradient(135deg, #f8fff8 0%, #f0f9f0 100%);
    border-radius: 12rpx;
    padding: 16rpx;
    border: 1rpx solid rgba(76, 175, 80, 0.1);
  }
  
  .habit-header {
    display: flex;
    align-items: center;
    gap: 8rpx;
    margin-bottom: 8rpx;
  }
  
  .habit-icon {
    width: 20rpx;
    height: 20rpx;
  }
  
  .habit-title {
    font-size: 20rpx;
    font-weight: 600;
    color: #4caf50;
  }
  
  .habit-desc {
    font-size: 18rpx;
    color: #555;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  // ========== 趣味知识样式 ==========
  .fun-facts-section {
    .section-title {
      font-size: 24rpx;
      font-weight: 600;
      color: #333;
      margin-bottom: 12rpx;
      display: block;
      position: relative;
      padding-left: 12rpx;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4rpx;
        height: 18rpx;
        background: linear-gradient(180deg, #ff9800 0%, #ffb74d 100%);
        border-radius: 2rpx;
      }
    }
  }
  
  .fun-facts-compact {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
  }
  
  .fun-fact {
    display: flex;
    gap: 12rpx;
    background: linear-gradient(135deg, #fff3e0 0%, #ffeaa7 100%);
    border-radius: 12rpx;
    padding: 12rpx;
    animation: bounceIn 0.6s ease both;
  }
  
  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    50% {
      transform: scale(1.02);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  .fact-bullet {
    width: 32rpx;
    height: 32rpx;
    background: linear-gradient(135deg, #ff9800 0%, #ffb74d 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16rpx;
    font-weight: 600;
    color: white;
    flex-shrink: 0;
  }
  
  .fact-text {
    flex: 1;
    font-size: 18rpx;
    color: #555;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  // ========== 状态部分样式 ==========
  .status-section {
    display: flex;
    gap: 12rpx;
    align-items: center;
  }
  
  .distribution-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10rpx;
    background: #f8f9fa;
    border-radius: 12rpx;
    padding: 12rpx;
  }
  
  .distribution-icon {
    width: 24rpx;
    height: 24rpx;
    flex-shrink: 0;
  }
  
  .distribution-content {
    flex: 1;
    min-width: 0;
  }
  
  .distribution-label {
    font-size: 16rpx;
    color: #666;
    margin-bottom: 2rpx;
    display: block;
  }
  
  .distribution-text {
    font-size: 18rpx;
    color: #333;
    font-weight: 500;
    display: block;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .conservation-status {
    display: flex;
    align-items: center;
    gap: 6rpx;
    padding: 8rpx 12rpx;
    border-radius: 12rpx;
    border: 2rpx solid;
    flex-shrink: 0;
    
    &.status-safe {
      background: rgba(76, 175, 80, 0.1);
      border-color: rgba(76, 175, 80, 0.3);
      color: #4caf50;
    }
    
    &.status-near-threatened {
      background: rgba(255, 193, 7, 0.1);
      border-color: rgba(255, 193, 7, 0.3);
      color: #ffc107;
    }
    
    &.status-vulnerable {
      background: rgba(255, 152, 0, 0.1);
      border-color: rgba(255, 152, 0, 0.3);
      color: #ff9800;
    }
    
    &.status-endangered {
      background: rgba(244, 67, 54, 0.1);
      border-color: rgba(244, 67, 54, 0.3);
      color: #f44336;
    }
    
    &.status-critical {
      background: rgba(156, 39, 176, 0.1);
      border-color: rgba(156, 39, 176, 0.3);
      color: #9c27b0;
    }
  }
  
  .conservation-icon {
    width: 16rpx;
    height: 16rpx;
  }
  
  .conservation-text {
    font-size: 18rpx;
    font-weight: 500;
  }
  
  // ========== 底部信息样式 ==========
  .bottom-info {
    display: flex;
    gap: 12rpx;
  }
  
  .sound-info {
    flex: 2;
    display: flex;
    align-items: center;
    gap: 8rpx;
    background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
    border-radius: 12rpx;
    padding: 12rpx;
  }
  
  .sound-icon {
    width: 20rpx;
    height: 20rpx;
    flex-shrink: 0;
  }
  
  .sound-text {
    flex: 1;
    font-size: 16rpx;
    color: #555;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  
  .play-sound-btn {
    width: 32rpx;
    height: 32rpx;
    background: rgba(76, 175, 80, 0.2);
    border-radius: 16rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    flex-shrink: 0;
    
    &:active {
      transform: scale(0.9);
      background: rgba(76, 175, 80, 0.3);
    }
  }
  
  .play-icon {
    width: 16rpx;
    height: 16rpx;
  }
  
  .lifespan-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8rpx;
    background: linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%);
    border-radius: 12rpx;
    padding: 12rpx;
  }
  
  .lifespan-icon {
    width: 20rpx;
    height: 20rpx;
    flex-shrink: 0;
  }
  
  .lifespan-text {
    flex: 1;
    font-size: 16rpx;
    color: #555;
    font-weight: 500;
    line-height: 1.3;
  }
  
  // ========== 响应式适配 ==========
  @media screen and (max-width: 750rpx) {
    .card-content {
      padding: 20rpx 16rpx;
      gap: 16rpx;
    }
    
    .basic-info-grid {
      gap: 10rpx;
    }
    
    .info-card {
      padding: 12rpx;
    }
    
    .habit-item {
      padding: 12rpx;
    }
    
    .fun-fact {
      padding: 10rpx;
    }
  }
  </style>