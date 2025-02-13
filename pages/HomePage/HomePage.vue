<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="top-nav">
      <navigator url="/pages/RankingPage/RankingPage" class="nav-btn ranking-btn">
        <image src="/static/icons/ranking.png" class="btn-icon"></image>
        <text>排行榜</text>
      </navigator>

      <view class="search-container">
        <view class="search-bar">
          <image src="/static/icons/search.png" class="search-icon"></image>
          <input 
            type="text" 
            placeholder="搜索鸟类名称..." 
            placeholder-class="search-placeholder"
            v-model="searchText"
            @input="onSearch"
          />
        </view>
      </view>

      <navigator url="/pages/NoobPage/NoobPage" class="nav-btn guide-btn">
        <image src="/static/icons/guide.png" class="btn-icon"></image>
        <text class="guide-text">引导</text>
      </navigator>
    </view>

    <!-- 瀑布流内容区域 -->
	<view class="content">
	  <view class="waterfall">
		<view class="column">
		  <homeposter
			v-for="poster in leftColumn"
			:key="poster.id"
			:poster-data="poster"
		  ></homeposter>
		</view>
		
		<view class="column">
		  <homeposter
			v-for="poster in rightColumn"
			:key="poster.id"
			:poster-data="poster"
		  ></homeposter>
		</view>
	  </view>
	</view>

    <!-- 底部导航栏 -->
    <tab-bar></tab-bar>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import TabBar from '@/components/tabbar.vue';
import homeposter from '../../components/homeposter.vue'
const searchText = ref('');
const onSearch = () => {
  // 实现搜索逻辑
};

// 模拟数据
const posterList = ref([
  {
    id: 1,
    imageUrl: '/static/posts/bird1.jpg',
    imageHeight: 200,
    description: '今天在公园拍到的小鸟，真的太可爱了！',
    views: 1234,
    likes: 88
  },
  {
    id: 2,
    imageUrl: '/static/posts/bird2.jpg',
    imageHeight: 280,
    description: '清晨6点，记录到了珍贵的候鸟迁徙场景',
    views: 25678,
    likes: 1892
  },
  // ... 
]);

// 左右列数据
const leftColumn = ref([]);
const rightColumn = ref([]);

// 分配数据到两列
const distributePosters = () => {
  posterList.value.forEach((poster, index) => {
    if (index % 2 === 0) {
      leftColumn.value.push(poster);
    } else {
      rightColumn.value.push(poster);
    }
  });
};

onMounted(() => {
  distributePosters();
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #e6fae9;
  padding-bottom: 50px; /* 为底部tabbar留出空间 */
}
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 12px;  /* 增加了内边距，确保元素之间有更好的间距 */
  background-color: hsl(123, 42%, 28%);  /* 改变顶部导航栏的背景色 */
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  position: sticky;
  top: 0;
  z-index: 100;
  margin-bottom: 8px;  /* 添加底部间距 */
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);  /* 添加底部边框 */
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 5px;  /* 增加了按钮间距 */
  padding: 4px 4px;
  border-radius: 5px;
  background: linear-gradient(145deg, hsl(84, 45%, 68%), #508c38);
  transition: all 0.3s ease;
  min-width: 40px;  /* 调整按钮宽度，确保按钮不重叠 */
  justify-content: center;
}

.nav-btn:active {
  box-shadow: inset 2px 2px 5px rgba(46, 44, 44, 0.1),
              inset -2px -2px 5px rgba(38, 37, 37, 0.8);
  transform: scale(0.98);
}

.ranking-btn {
  border: 1px solid rgba(38, 83, 42, 0.3);
}

.guide-btn {
  border: 1px solid rgba(90, 186, 103, 0.3);
  margin: 0 0.1px 0 20px; 
  width: 55px;         /* 设置固定宽度 */
  height: 20px; 
         /* 设置固定高度 */
}

.btn-icon {
  width: 20px;
  height: 20px;
}

.nav-btn text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.search-container {
  flex: 1;
  max-width: 250px;  /* 增加最大宽度，给搜索框更多空间 */
  margin: 0 18px 0 5px;
}

.search-bar {
  position: relative;
  width: 100%;
  height: 32px;
  background: white;
  border-radius: 5px;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.05),
              inset -2px -2px 5px rgba(255, 255, 255, 0.5);
  display: flex;
  align-items: center;
  padding: 0 16px;
  border: 0.5px solid rgba(0, 0, 0, 0.08);
}
.search-icon {
  width: 18px;
  height: 18px;
  margin-right: 6px;
  opacity: 0.6;
}

.search-bar input {
  flex: 1;
  height: 100%;
  border: none;
  background: transparent;
  font-size: 14px;
  color: #333;
}

.search-placeholder {
  color: #999;
  font-size: 14px;
}

.content {
  padding: 12px;
  background-color: #fcfcfc;  /* 确保内容区域保持原来的背景色 */
}

.waterfall {
  display: flex;
  justify-content: space-between;
}

.column {
  width: 48%; /* 留出间距 */
}

.guide-text {
  font-weight: 900;
}
</style>
