<template>
  <view class="container">
    <!-- 顶部导航 -->
    <view class="top-nav">
      <navigator url="/pages/RankingPage/RankingPage" class="nav-btn">
        <image src="/static/icons/ranking.png" class="btn-icon"></image>
        <text>排行榜</text>
      </navigator>

      <view class="search-bar">
        <input 
          type="text" 
          placeholder="搜索鸟类名称..." 
          v-model="searchText"
          @input="onSearch"
        />
      </view>

      <navigator url="/pages/NoobPage/NoobPage" class="nav-btn">
        <image src="/static/icons/guide.png" class="btn-icon"></image>
        <text>引导</text>
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
			@tap="navigateToPosterPage(poster.id)"
		  ></homeposter>
		</view>
		
		<view class="column">
		  <homeposter
			v-for="poster in rightColumn"
			:key="poster.id"
			:poster-data="poster"
			@tap="navigateToPosterPage(poster.id)"
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
import { useRouter } from 'vue-router';

const router = useRouter();
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

const navigateToPosterPage = (postId) => {
  uni.navigateTo({
    url: `/pages/PosterPage/PosterPage?postId=${postId}`
  });
};
</script>

<style scoped>
.container {
  min-height: 100vh;
  background-color: #FFF9E9;
  padding-bottom: 50px; /* 为底部tabbar留出空间 */
}

.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #FFF9E9;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  border-radius: 20px;
  border: 2px solid #2EA3B7;
  background: white;
}

.btn-icon {
  width: 16px;
  height: 16px;
}

.nav-btn text {
  font-size: 14px;
  color: #1D1D2B;
}

.search-bar {
  flex: 1;
  max-width: 150px;
  margin: 0 15px 0 -20px;
}

.search-bar input {
  width: 100%;
  height: 36px;
  padding: 0 16px;
  border-radius: 18px;
  border: 2px solid #FFB03B;
  background: white;
}

.content {
  padding: 12px;
}

.waterfall {
  display: flex;
  justify-content: space-between;
}

.column {
  width: 48%; /* 留出间距 */
}
</style>