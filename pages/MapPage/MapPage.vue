<template>
    <view class="container">
        <!-- Search Bar -->
        <view class="search-container">
            <view class="search-box">
                <text class="icon-search">🔍</text>
                <input
                    type="text"
                    class="search-input"
                    placeholder="搜索目的地/鸟类名称"
                    v-model="searchText"
                    @confirm="handleSearch"
                />
            </view>
        </view>

        <!-- Map Container -->
        <view class="map-container">
            <map
                class="map"
                :latitude="latitude"
                :longitude="longitude"
                :markers="markers"
                :scale="scale"
                show-location
            ></map>

            <!-- My Location Button -->
            <view class="location-btn" @tap="moveToCurrentLocation">
                <text class="icon-location">📍</text>
            </view>
        </view>
		<!-- 添加底部导航栏 -->
		<tab-bar></tab-bar>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TabBar from '@/components/tabbar.vue';
// 响应式状态
const latitude = ref(31.2304)  // 默认纬度（上海）
const longitude = ref(121.4737)  // 默认经度（上海）
const scale = ref(14)  // 默认缩放级别
const searchText = ref('')
const markers = ref([])

// 获取当前位置
const getCurrentLocation = () => {
    uni.getLocation({
        type: 'gcj02',
        success: (res) => {
            latitude.value = res.latitude
            longitude.value = res.longitude
        },
        fail: () => {
            uni.showToast({
                title: '无法获取位置',
                icon: 'none'
            })
        }
    })
}

// 移动到当前位置
const moveToCurrentLocation = () => {
    getCurrentLocation()
}

// 处理搜索
const handleSearch = async (e) => {
    if (!searchText.value) return
    
    // 这里需要接入腾讯地图搜索API
    // 示例代码：
    /*
    try {
        const result = await searchLocation(searchText.value)
        if (result && result.length > 0) {
            latitude.value = result[0].latitude
            longitude.value = result[0].longitude
            markers.value = [{
                id: 1,
                latitude: result[0].latitude,
                longitude: result[0].longitude,
                title: result[0].name
            }]
        }
    } catch (error) {
        uni.showToast({
            title: '搜索失败',
            icon: 'none'
        })
    }
    */
}

// 页面加载时获取位置
onMounted(() => {
    getCurrentLocation()
})
</script>

<style>
.container {
    position: relative;
    height: 100vh;
    background-color: #fffbeb;
}

.search-container {
    position: fixed;
    top: var(--status-bar-height);
    left: 0;
    right: 0;
    z-index: 100;
    padding: 20rpx;
}

.search-box {
    display: flex;
    align-items: center;
    background-color: #ffffff;
    border-radius: 100rpx;
    padding: 16rpx 30rpx;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.icon-search {
    margin-right: 16rpx;
    font-size: 32rpx;
    color: #666;
}

.search-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
}

.map-container {
    position: relative;
    height: 100%;
    width: 100%;
}

.map {
    width: 100%;
    height: 100%;
}

.location-btn {
    position: fixed;
    right: 30rpx;
    bottom: 120rpx;
    background-color: #ffffff;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.1);
}

.icon-location {
    font-size: 40rpx;
}
</style>