<template>
  <view class="tab-bar">
    <view 
      v-for="(item, index) in tabList" 
      :key="index"
      class="tab-item"
      :class="{ active: currentPath === item.pagePath }"
      @click="switchTab(item.pagePath)"
    >
      <!-- 使用字体图标作为后备方案 -->
      <view class="tab-icon-container">
        <image 
          v-if="!item.iconError"
          :src="getTabIconUrl(item, currentPath === item.pagePath)" 
          class="tab-icon"
          @error="onIconError(item)"
          @load="onIconLoad(item)"
        />
        <!-- 图标加载失败时显示的后备字体图标 -->
        <text 
          v-else
          class="tab-icon-fallback"
          :class="{ active: currentPath === item.pagePath }"
        >
          {{ item.fallbackIcon }}
        </text>
      </view>
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';

// ========== 响应式数据 ==========
const currentPath = ref('/pages/HomePage/HomePage');

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
      params = '?x-oss-process=image/resize,m_lfit,w_48,h_48/quality,q_90';
      break;
    case 'small-icon':
      params = '?x-oss-process=image/resize,m_lfit,w_32,h_32/quality,q_90';
      break;
    default:
      params = '?x-oss-process=image/resize,m_lfit,w_48,h_48/quality,q_90';
  }
  
  return `${ossConfig.baseUrl}/${cleanFilename}${params}`;
};

// ========== 标签配置 ==========
const tabList = reactive([
  {
    pagePath: '/pages/HomePage/HomePage',
    text: '首页',
    iconPath: 'static/icons/home.png',
    selectedIconPath: 'static/icons/home-active.png',
    fallbackIcon: '🏠', // 后备字体图标
    iconError: false // 图标是否加载失败
  },
  {
    pagePath: '/pages/MapPage/MapPage',
    text: '地图',
    iconPath: 'static/icons/map.png',
    selectedIconPath: 'static/icons/map-active.png',
    fallbackIcon: '🗺️',
    iconError: false
  },
  {
    pagePath: '/pages/UploadPage/UploadPage',
    text: '上传',
    iconPath: 'static/icons/upload.png',
    selectedIconPath: 'static/icons/upload-active.png',
    fallbackIcon: '📤',
    iconError: false
  },
  {
    pagePath: '/pages/ProfilePage/ProfilePage',
    text: '我的',
    iconPath: 'static/icons/profile.png',
    selectedIconPath: 'static/icons/profile-active.png',
    fallbackIcon: '👤',
    iconError: false
  }
]);

// ========== 计算属性和方法 ==========

/**
 * 获取标签图标的URL，优先使用本地路径作为后备
 * @param {Object} item - 标签项对象
 * @param {Boolean} isActive - 是否为激活状态
 * @returns {string} 图标的URL
 */
const getTabIconUrl = (item, isActive) => {
  const iconPath = isActive ? item.selectedIconPath : item.iconPath;
  
  // 优先尝试本地路径
  // const localPath = `/${iconPath}`;
  
  // 如果需要使用OSS，可以取消下面的注释
  return getOSSUrl(iconPath, 'small-icon');
  
  // return localPath;
};

// ========== 事件处理函数 ==========

/**
 * 切换标签页
 * @param {string} path - 页面路径
 */
const switchTab = (path) => {
  currentPath.value = path;
  
  // 添加触觉反馈
  try {
    uni.vibrateShort({
      type: 'light'
    });
  } catch (error) {
    console.warn('触觉反馈不支持:', error);
  }
  
  // 跳转页面
  uni.switchTab({
    url: path,
    success: () => {
      console.log('切换到:', path);
    },
    fail: (error) => {
      console.error('页面跳转失败:', error);
      // 可以尝试使用 navigateTo 作为降级方案
      uni.navigateTo({
        url: path,
        fail: (navError) => {
          console.error('导航失败:', navError);
          uni.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    }
  });
};

/**
 * 图标加载失败处理
 * @param {Object} item - 标签项对象
 */
const onIconError = (item) => {
  console.warn('标签栏图标加载失败:', item.text);
  item.iconError = true; // 设置图标加载失败标志
};

/**
 * 图标加载成功处理
 * @param {Object} item - 标签项对象
 */
const onIconLoad = (item) => {
  console.log('标签栏图标加载成功:', item.text);
  item.iconError = false; // 重置图标加载失败标志
};

/**
 * 初始化当前页面路径
 * 可以通过uni.getCurrentPages()获取当前页面路径
 */
const initCurrentPath = () => {
  try {
    // 在uni-app中获取当前页面栈
    const pages = getCurrentPages();
    if (pages && pages.length > 0) {
      const currentPage = pages[pages.length - 1];
      const route = currentPage.route;
      
      // 根据路由匹配标签
      const matchedTab = tabList.find(tab => {
        const tabRoute = tab.pagePath.replace(/^\//, '');
        return route === tabRoute;
      });
      
      if (matchedTab) {
        currentPath.value = matchedTab.pagePath;
      }
    }
  } catch (error) {
    console.warn('获取当前页面路径失败:', error);
    // 设置默认路径
    currentPath.value = '/pages/HomePage/HomePage';
  }
};

// ========== 生命周期 ==========
onMounted(() => {
  initCurrentPath();
  
  // 可以在这里添加页面变化监听（如果需要的话）
  console.log('TabBar组件已挂载，当前路径:', currentPath.value);
});
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 70rpx; /* 使用rpx单位 */
  display: flex;
  background-color: #ffffff;
  box-shadow: 0 -4rpx 16rpx rgba(0, 0, 0, 0.1);
  border-top: 1rpx solid rgba(0, 0, 0, 0.05);
  z-index: 1000;
  transition: all 0.3s ease;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8rpx 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  cursor: pointer;
}

.tab-item:active {
  transform: scale(0.95);
  background-color: rgba(46, 163, 183, 0.05);
}

.tab-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 4rpx;
  background: #2EA3B7;
  border-radius: 2rpx;
  transition: width 0.3s ease;
}

.tab-item.active::before {
  width: 40rpx;
}

.tab-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48rpx;
  height: 48rpx;
  margin-bottom: 4rpx;
}

.tab-icon {
  width: 48rpx;
  height: 48rpx;
  transition: all 0.3s ease;
  opacity: 0.7;
}

.tab-item.active .tab-icon {
  opacity: 1;
  transform: scale(1.1);
}

/* 后备字体图标样式 */
.tab-icon-fallback {
  font-size: 40rpx;
  line-height: 48rpx;
  transition: all 0.3s ease;
  opacity: 0.7;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-icon-fallback.active {
  opacity: 1;
  transform: scale(1.1);
}

.tab-text {
  font-size: 20rpx;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
  line-height: 1.2;
  text-align: center;
}

.tab-item.active .tab-text {
  color: #2EA3B7;
  font-weight: 600;
  transform: scale(1.05);
}

/* 悬停效果（主要针对H5端） */
@media (hover: hover) {
  .tab-item:hover {
    background-color: rgba(46, 163, 183, 0.03);
  }
  
  .tab-item:hover .tab-icon,
  .tab-item:hover .tab-icon-fallback {
    opacity: 0.9;
    transform: translateY(-2rpx);
  }
  
  .tab-item:hover .tab-text {
    color: #2EA3B7;
  }
}

/* 响应式适配 */
@media screen and (max-width: 750rpx) {
  .tab-bar {
    height: 96rpx;
  }
  
  .tab-icon-container {
    width: 44rpx;
    height: 44rpx;
  }
  
  .tab-icon {
    width: 44rpx;
    height: 44rpx;
  }
  
  .tab-icon-fallback {
    font-size: 36rpx;
    line-height: 44rpx;
  }
  
  .tab-text {
    font-size: 18rpx;
  }
}

/* 适配iphoneX等带有安全区域的设备 */
@supports (bottom: env(safe-area-inset-bottom)) {
  .tab-bar {
    padding-bottom: env(safe-area-inset-bottom);
    height: calc(100rpx + env(safe-area-inset-bottom));
  }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
  .tab-bar {
    background-color: #1a1a1a;
    border-top-color: rgba(255, 255, 255, 0.1);
  }
  
  .tab-text {
    color: #999;
  }
  
  .tab-item.active .tab-text {
    color: #4dd0e1;
  }
  
  .tab-item::before {
    background: #4dd0e1;
  }
}

/* 优化动画性能 */
.tab-item,
.tab-icon,
.tab-icon-fallback,
.tab-text {
  will-change: transform, opacity;
}

/* 防止文本选中 */
.tab-text {
  user-select: none;
  -webkit-user-select: none;
}
</style>