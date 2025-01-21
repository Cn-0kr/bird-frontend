<template>
  <view class="tab-bar">
    <view 
      v-for="(item, index) in tabList" 
      :key="index"
      class="tab-item"
      :class="{ active: currentPath === item.pagePath }"
      @click="switchTab(item.pagePath)"
    >
      <image :src="currentPath === item.pagePath ? item.selectedIconPath : item.iconPath" class="tab-icon"></image>
      <text class="tab-text">{{ item.text }}</text>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue';

const currentPath = ref('/pages/HomePage/HomePage');

const tabList = [
  {
    pagePath: '/pages/HomePage/HomePage',
    text: '首页',
    iconPath: '/static/icons/home.png',
    selectedIconPath: '/static/icons/home-active.png'
  },
  {
    pagePath: '/pages/MapPage/MapPage',
    text: '地图',
    iconPath: '/static/icons/map.png',
    selectedIconPath: '/static/icons/map-active.png'
  },
  {
    pagePath: '/pages/UploadPage/UploadPage',
    text: '上传',
    iconPath: '/static/icons/upload.png',
    selectedIconPath: '/static/icons/upload-active.png'
  },
  {
    pagePath: '/pages/ProfilePage/ProfilePage',
    text: '我的',
    iconPath: '/static/icons/profile.png',
    selectedIconPath: '/static/icons/profile-active.png'
  }
];

const switchTab = (path) => {
  currentPath.value = path;
  uni.switchTab({
    url: path
  });
};
</script>

<style scoped>
.tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  display: flex;
  background-color: #ffffff;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4px 0;
}

.tab-icon {
  width: 24px;
  height: 24px;
  margin-bottom: 2px;
}

.tab-text {
  font-size: 12px;
  color: #1D1D2B;
}

.active .tab-text {
  color: #2EA3B7;
}
</style>