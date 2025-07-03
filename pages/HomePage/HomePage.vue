<template>
  <view class="homepage-container">
    <!-- 顶部轮播Banner区域 -->
    <view class="banner-section">
      <swiper 
        class="banner-swiper"
        :indicator-dots="true"
        :autoplay="true"
        :interval="4000"
        :duration="600"
        :circular="true"
        indicator-color="rgba(255,255,255,0.5)"
        indicator-active-color="#ffffff"
        @change="onSwiperChange"
      >
        <swiper-item 
          v-for="(banner, index) in bannerList" 
          :key="index"
          class="swiper-item"
        >
          <image 
            :src="banner.imageUrl" 
            class="banner-image"
            mode="aspectFill"
            @load="onBannerLoad"
          ></image>
          <view class="banner-overlay">
            <view class="banner-content">
              <text class="banner-title">{{ banner.title }}</text>
              <text class="banner-subtitle">{{ banner.subtitle }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>
    </view>

    <!-- 搜索和导航区域 -->
    <view class="search-nav-section">
      <view class="search-wrapper">
        <view class="search-input-container">
          <image src="/static/icons/search.png" class="search-icon"></image>
          <input 
            type="text" 
            placeholder="搜索鸟类名称..." 
            placeholder-class="search-placeholder"
            v-model="searchText"
            @input="onSearch"
            @focus="onSearchFocus"
            @blur="onSearchBlur"
            class="search-input"
          />
        </view>
        <view 
          class="search-btn"
          @click="handleSearch"
          :class="{ 'search-btn-active': isSearchFocused }"
        >
          <image src="/static/icons/search-white.png" class="search-btn-icon"></image>
        </view>
      </view>

      <!-- 功能导航网格 -->
      <view class="nav-actions">
        <navigator 
          url="/pages/RankingPage/RankingPage" 
          class="action-btn ranking-btn"
          hover-class="action-btn-hover"
        >
          <view class="action-icon-wrapper">
            <image src="/static/icons/ranking.png" class="action-icon"></image>
          </view>
          <text class="action-text">排行榜</text>
        </navigator>

        <navigator 
          url="/pages/NoobPage/NoobPage" 
          class="action-btn guide-btn"
          hover-class="action-btn-hover"
        >
          <view class="action-icon-wrapper">
            <image src="/static/icons/guide.png" class="action-icon"></image>
          </view>
          <text class="action-text">引导</text>
        </navigator>

        <navigator 
          url="/pages/BirdEncyclopedia/BirdEncyclopedia" 
          class="action-btn encyclopedia-btn"
          hover-class="action-btn-hover"
        >
          <view class="action-icon-wrapper">
            <image src="/static/icons/encyclopedia.png" class="action-icon"></image>
          </view>
          <text class="action-text">鸟类图鉴</text>
        </navigator>

        <navigator 
          url="/pages/AIChat/AIChat" 
          class="action-btn ai-chat-btn"
          hover-class="action-btn-hover"
        >
          <view class="action-icon-wrapper">
            <image src="/static/icons/ai-chat.png" class="action-icon"></image>
          </view>
          <text class="action-text">智能助手</text>
        </navigator>
      </view>
    </view>

    <!-- 内容区域 -->
    <view class="content-section">
      <!-- 加载状态 -->
      <view v-if="isLoading" class="loading-container">
        <view class="loading-spinner"></view>
        <text class="loading-text">加载中...</text>
      </view>

      <!-- 瀑布流内容 -->
      <view v-else class="waterfall-container">
        <view class="waterfall-column left-column">
          <view 
            v-for="(poster, index) in leftColumn" 
            :key="poster.id"
            class="poster-wrapper"
            :style="{ 'animation-delay': `${index * 0.1}s` }"
          >
            <enhanced-poster 
              :poster-data="poster"
              @like="onLike"
              @view="onView"
            ></enhanced-poster>
          </view>
        </view>
        
        <view class="waterfall-column right-column">
          <view 
            v-for="(poster, index) in rightColumn" 
            :key="poster.id"
            class="poster-wrapper"
            :style="{ 'animation-delay': `${(index + 1) * 0.1}s` }"
          >
            <enhanced-poster 
              :poster-data="poster"
              @like="onLike"
              @view="onView"
            ></enhanced-poster>
          </view>
        </view>
      </view>

      <!-- 无数据状态 -->
      <view v-if="!isLoading && posterList.length === 0" class="empty-state">
        <image src="/static/icons/empty-bird.png" class="empty-icon"></image>
        <text class="empty-text">暂无鸟类记录</text>
        <text class="empty-subtitle">快去记录你的第一次发现吧！</text>
      </view>
    </view>

    <!-- 底部导航栏 -->
    <tab-bar></tab-bar>
  </view>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import TabBar from '@/components/tabbar.vue';
import EnhancedPoster from '@/components/EnhancedPoster.vue';

// ========== 响应式数据 ==========
const searchText = ref('');
const isSearchFocused = ref(false);
const isLoading = ref(true);
const posterList = ref([]);
const leftColumn = ref([]);
const rightColumn = ref([]);
const currentBannerIndex = ref(0);

// ========== Banner轮播数据 ==========
const bannerList = ref([
  {
    imageUrl: '/static/banner/toucan-banner.jpg',
    title: '发现自然之美',
    subtitle: '记录每一次与鸟类的美妙邂逅'
  },
  {
    imageUrl: '/static/banner/eagle-banner.jpg',
    title: '翱翔天际',
    subtitle: '见证猛禽的威武与优雅'
  },
  {
    imageUrl: '/static/banner/peacock-banner.jpg',
    title: '绚烂羽翼',
    subtitle: '感受大自然的色彩魅力'
  },
  {
    imageUrl: '/static/banner/hummingbird-banner.jpg',
    title: '精灵悬停',
    subtitle: '捕捉蜂鸟的瞬间之美'
  }
]);

// ========== 模拟数据 ==========
const mockData = [
  {
    id: 1,
    imageUrl: '/static/posts/bird1.jpg',
    imageHeight: 200,
    description: '今天在公园拍到的小鸟，真的太可爱了！',
    views: 1223,
    likes: 12,
    author: {
      name: '鸟类爱好者',
      avatar: '/static/avatars/user1.png'
    },
    location: '北京·朝阳公园',
    publishTime: '2小时前'
  },
  {
    id: 2,
    imageUrl: '/static/posts/bird2.jpg',
    imageHeight: 280,
    description: '清晨6点，记录到了珍贵的候鸟迁徙场景',
    views: 25678,
    likes: 1892,
    author: {
      name: '自然摄影师',
      avatar: '/static/avatars/user2.png'
    },
    location: '上海·世纪公园',
    publishTime: '5小时前'
  },
  {
    id: 3,
    imageUrl: '/static/posts/bird3.jpg',
    imageHeight: 220,
    description: '蜂鸟悬停采蜜的瞬间，大自然的精灵',
    views: 5432,
    likes: 234,
    author: {
      name: '野生动物保护者',
      avatar: '/static/avatars/user3.png'
    },
    location: '云南·西双版纳',
    publishTime: '1天前'
  },
  {
    id: 4,
    imageUrl: '/static/posts/bird4.jpg',
    imageHeight: 300,
    description: '金刚鹦鹉的绚烂色彩，热带雨林的瑰宝',
    views: 8765,
    likes: 456,
    author: {
      name: '生态研究员',
      avatar: '/static/avatars/user4.jpg'
    },
    location: '海南·亚龙湾',
    publishTime: '2天前'
  }
];

// ========== 事件处理函数 ==========

/**
 * 轮播图切换事件
 * @param {Object} event - 切换事件对象
 */
const onSwiperChange = (event) => {
  currentBannerIndex.value = event.detail.current;
  console.log('当前Banner索引:', currentBannerIndex.value);
};

/**
 * 搜索输入处理
 */
const onSearch = () => {
  // TODO: 实现实时搜索逻辑
  console.log('搜索内容:', searchText.value);
  
  if (searchText.value.trim()) {
    // 模拟搜索API调用
    searchBirds(searchText.value);
  } else {
    // 重置为全部数据
    resetPosterList();
  }
};

/**
 * 搜索聚焦处理
 */
const onSearchFocus = () => {
  isSearchFocused.value = true;
};

/**
 * 搜索失焦处理
 */
const onSearchBlur = () => {
  isSearchFocused.value = false;
};

/**
 * 搜索按钮点击处理
 */
const handleSearch = () => {
  if (searchText.value.trim()) {
    // 执行搜索
    searchBirds(searchText.value);
    
    // 添加搜索按钮点击动画
    uni.vibrateShort();
  }
};

/**
 * Banner图片加载完成
 */
const onBannerLoad = () => {
  console.log('Banner加载完成');
};

/**
 * 点赞处理
 * @param {Object} posterData - 海报数据
 */
const onLike = (posterData) => {
  const poster = posterList.value.find(p => p.id === posterData.id);
  if (poster) {
    poster.likes += 1;
    
    // 重新分配到列
    redistributePosters();
    
    // 显示点赞动画提示
    uni.showToast({
      title: '点赞成功',
      icon: 'success',
      duration: 1000
    });
  }
};

/**
 * 查看处理
 * @param {Object} posterData - 海报数据
 */
const onView = (posterData) => {
  const poster = posterList.value.find(p => p.id === posterData.id);
  if (poster) {
    poster.views += 1;
  }
  
  // 跳转到详情页
  uni.navigateTo({
    url: `/pages/PosterDetail/PosterDetail?id=${posterData.id}`
  });
};

// ========== 业务逻辑函数 ==========

/**
 * 搜索鸟类
 * @param {String} keyword - 搜索关键词
 */
const searchBirds = async (keyword) => {
  try {
    isLoading.value = true;
    
    // TODO: 调用实际搜索API
    // const result = await birdAPI.search({ keyword, page: 1, size: 20 });
    
    // 模拟API延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟搜索结果
    const filteredData = mockData.filter(item => 
      item.description.includes(keyword) || 
      item.location.includes(keyword)
    );
    
    posterList.value = filteredData;
    redistributePosters();
    
  } catch (error) {
    console.error('搜索失败:', error);
    uni.showToast({
      title: '搜索失败，请重试',
      icon: 'error'
    });
  } finally {
    isLoading.value = false;
  }
};

/**
 * 重置海报列表
 */
const resetPosterList = () => {
  posterList.value = [...mockData];
  redistributePosters();
};

/**
 * 分配海报到两列（瀑布流算法优化）
 */
const redistributePosters = () => {
  leftColumn.value = [];
  rightColumn.value = [];
  
  let leftHeight = 0;
  let rightHeight = 0;
  
  posterList.value.forEach(poster => {
    // 计算预估高度（图片高度 + 固定内容高度）
    const estimatedHeight = poster.imageHeight + 120;
    
    if (leftHeight <= rightHeight) {
      leftColumn.value.push(poster);
      leftHeight += estimatedHeight;
    } else {
      rightColumn.value.push(poster);
      rightHeight += estimatedHeight;
    }
  });
};

/**
 * 加载更多数据
 */
const loadMoreData = async () => {
  try {
    // TODO: 实现分页加载
    console.log('加载更多数据');
  } catch (error) {
    console.error('加载更多失败:', error);
  }
};

// ========== 生命周期 ==========
onMounted(async () => {
  try {
    // 模拟API加载延迟
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 初始化数据
    posterList.value = [...mockData];
    redistributePosters();
    
  } catch (error) {
    console.error('页面初始化失败:', error);
    uni.showToast({
      title: '加载失败，请重试',
      icon: 'error'
    });
  } finally {
    isLoading.value = false;
  }
});
</script>

<style lang="scss" scoped>
// ========== 主容器样式 ==========
.homepage-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #f0f9f0 0%, #ffffff 100%);
  position: relative;
}

// ========== Banner轮播区域样式 ==========
.banner-section {
  position: relative;
  height: 240rpx;
  width: 100%;
  overflow: hidden;
  border-radius: 0 0 32rpx 32rpx;
  box-shadow: 0 8rpx 32rpx rgba(76, 175, 80, 0.15);
}

.banner-swiper {
  width: 100%;
  height: 100%;
}

.swiper-item {
  position: relative;
  width: 100%;
  height: 100%;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg, 
    rgba(76, 175, 80, 0.7) 0%, 
    rgba(67, 160, 71, 0.8) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.banner-content {
  text-align: center;
  color: white;
}

.banner-title {
  display: block;
  font-size: 36rpx;
  font-weight: 700;
  margin-bottom: 8rpx;
  text-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.3);
}

.banner-subtitle {
  display: block;
  font-size: 24rpx;
  opacity: 0.9;
  text-shadow: 0 1rpx 4rpx rgba(0, 0, 0, 0.3);
}

// ========== 搜索导航区域样式 ==========
.search-nav-section {
  padding: 24rpx 32rpx;
  background: white;
  border-radius: 32rpx 32rpx 0 0;
  margin-top: -16rpx;
  position: relative;
  z-index: 10;
  box-shadow: 0 -4rpx 20rpx rgba(0, 0, 0, 0.05);
}

.search-wrapper {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
  gap: 16rpx;
}

.search-input-container {
  flex: 1;
  position: relative;
  height: 80rpx;
  background: #f8f9fa;
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  border: 2rpx solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &:focus-within {
    border-color: #4caf50;
    background: white;
    box-shadow: 0 0 0 8rpx rgba(76, 175, 80, 0.1);
  }
}

.search-icon {
  width: 32rpx;
  height: 32rpx;
  margin-right: 16rpx;
  opacity: 0.6;
  transition: opacity 0.3s ease;
}

.search-input {
  flex: 1;
  height: 100%;
  font-size: 28rpx;
  color: #333;
  background: transparent;
  border: none;
  outline: none;
}

.search-placeholder {
  color: #999;
  font-size: 28rpx;
}

.search-btn {
  width: 80rpx;
  height: 80rpx;
  background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
  border-radius: 40rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4rpx 16rpx rgba(76, 175, 80, 0.3);
  
  &:active {
    transform: scale(0.95);
  }
  
  &.search-btn-active {
    background: linear-gradient(135deg, #43a047 0%, #388e3c 100%);
    box-shadow: 0 6rpx 20rpx rgba(76, 175, 80, 0.4);
  }
}

.search-btn-icon {
  width: 36rpx;
  height: 36rpx;
}

// ========== 功能导航网格样式 ==========
.nav-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16rpx;
}

.action-btn {
  height: 96rpx;
  background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
  border-radius: 24rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  border: 2rpx solid rgba(76, 175, 80, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &:active {
    transform: translateY(2rpx);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    transition: left 0.6s ease;
  }
  
  &:hover::before {
    left: 100%;
  }
}

.action-btn-hover {
  background: linear-gradient(135deg, #c8e6c9 0%, #dcedc8 100%);
  border-color: rgba(76, 175, 80, 0.2);
  transform: translateY(-2rpx);
  box-shadow: 0 8rpx 24rpx rgba(76, 175, 80, 0.15);
}

.action-icon-wrapper {
  width: 48rpx;
  height: 48rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 24rpx;
  transition: all 0.3s ease;
}

.action-btn:hover .action-icon-wrapper {
  background: rgba(76, 175, 80, 0.2);
  transform: scale(1.1);
}

.action-icon {
  width: 28rpx;
  height: 28rpx;
}

.action-text {
  font-size: 24rpx;
  color: #4caf50;
  font-weight: 600;
}

// ========== 特殊功能按钮样式 ==========
.encyclopedia-btn {
  background: linear-gradient(135deg, #e3f2fd 0%, #f0f8ff 100%);
  border-color: rgba(33, 150, 243, 0.1);
  
  .action-icon-wrapper {
    background: rgba(33, 150, 243, 0.1);
  }
  
  .action-text {
    color: #2196f3;
  }
  
  &:hover {
    background: linear-gradient(135deg, #bbdefb 0%, #e1f5fe 100%);
    border-color: rgba(33, 150, 243, 0.2);
    
    .action-icon-wrapper {
      background: rgba(33, 150, 243, 0.2);
    }
  }
}

.ai-chat-btn {
  background: linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%);
  border-color: rgba(156, 39, 176, 0.1);
  
  .action-icon-wrapper {
    background: rgba(156, 39, 176, 0.1);
  }
  
  .action-text {
    color: #9c27b0;
  }
  
  &:hover {
    background: linear-gradient(135deg, #e1bee7 0%, #f8bbd9 100%);
    border-color: rgba(156, 39, 176, 0.2);
    
    .action-icon-wrapper {
      background: rgba(156, 39, 176, 0.2);
    }
  }
}

// ========== 内容区域样式 ==========
.content-section {
  padding: 0 24rpx 120rpx;
  min-height: 60vh;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.loading-spinner {
  width: 80rpx;
  height: 80rpx;
  border: 6rpx solid #e0e0e0;
  border-top-color: #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 24rpx;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 28rpx;
  color: #666;
}

.waterfall-container {
  display: flex;
  gap: 16rpx;
  align-items: flex-start;
}

.waterfall-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.poster-wrapper {
  animation: slideInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(40rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// ========== 空状态样式 ==========
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 40rpx;
  text-align: center;
}

.empty-icon {
  width: 160rpx;
  height: 160rpx;
  margin-bottom: 32rpx;
  opacity: 0.6;
}

.empty-text {
  font-size: 32rpx;
  color: #666;
  font-weight: 600;
  margin-bottom: 12rpx;
}

.empty-subtitle {
  font-size: 26rpx;
  color: #999;
  line-height: 1.5;
}

// ========== 响应式适配 ==========
@media screen and (max-width: 750rpx) {
  .banner-section {
    height: 200rpx;
  }
  
  .banner-title {
    font-size: 32rpx;
  }
  
  .banner-subtitle {
    font-size: 22rpx;
  }
  
  .search-nav-section {
    padding: 20rpx 24rpx;
  }
  
  .content-section {
    padding: 0 16rpx 120rpx;
  }
  
  .action-btn {
    height: 88rpx;
  }
  
  .action-text {
    font-size: 22rpx;
  }
}
</style>