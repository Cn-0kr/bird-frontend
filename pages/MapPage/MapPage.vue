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
                :polyline="polyline"
                :scale="scale"
                show-location
                @markertap="onMarkerTap"
            ></map>

            <!-- My Location Button -->
            <view class="location-btn" @tap="moveToCurrentLocation">
                <text class="icon-location">📍</text>
            </view>
            
            <!-- Info Card (显示点击后的地点信息) -->
            <view class="info-card" v-if="showInfoCard" @tap.stop="showInfoCard = false">
                <view class="info-card-inner">
                    <view class="info-card-close" @tap.stop="showInfoCard = false">×</view>
                    <image class="info-card-image" :src="selectedLocation.image" mode="aspectFill"></image>
                    <view class="info-card-content">
                        <view class="info-card-title">{{selectedLocation.name}}</view>
                        <view class="info-card-subtitle">{{selectedLocation.category}}</view>
                        <view class="info-card-description">{{selectedLocation.description}}</view>
                        
                        <!-- 鸟类观测统计 -->
                        <view class="bird-stats" v-if="selectedLocation.birdStats">
                            <view class="stats-title">观测统计</view>
                            <view class="stats-row">
                                <view class="stat-item">
                                    <text class="stat-value">{{selectedLocation.birdStats.species}}</text>
                                    <text class="stat-label">鸟种数量</text>
                                </view>
                                <view class="stat-item">
                                    <text class="stat-value">{{selectedLocation.birdStats.observations}}</text>
                                    <text class="stat-label">观测次数</text>
                                </view>
                                <view class="stat-item">
                                    <text class="stat-value">{{selectedLocation.birdStats.rareSpecies}}</text>
                                    <text class="stat-label">珍稀鸟种</text>
                                </view>
                            </view>
                        </view>
                        
                        <!-- 操作按钮 -->
                        <view class="action-buttons">
                            <button class="action-btn details-btn">查看详情</button>
                            <button class="action-btn navigate-btn">导航前往</button>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        
        <!-- 遮罩层 - 当信息卡片显示时 -->
        <view class="overlay" v-if="showInfoCard" @tap="showInfoCard = false"></view>
        
		<view class="info-card" v-if="showInfoCard" style="background-color: white; padding: 20px; border: 1px solid black;">
		  <text>Test InfoCard - ID: {{selectedLocation.id}}</text>
		  <button @tap="closeInfoCard">Close</button>
		</view>
		
        <!-- 添加底部导航栏 -->
        <tab-bar></tab-bar>
    </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import TabBar from '@/components/tabbar.vue';

// 腾讯地图API密钥
const TENCENT_MAP_KEY = '2VEBZ-H2SW5-URJIL-I26ZE-2EB2E-BOF27';

// 响应式状态
const latitude = ref(31.2304)  // 默认纬度（上海）
const longitude = ref(121.4737)  // 默认经度（上海）
const scale = ref(14)  // 默认缩放级别
const searchText = ref('')
const markers = ref([])
const polyline = ref([]) // 用于显示区域边界

// 信息卡片相关状态
const showInfoCard = ref(false)
const selectedLocation = ref({})

// Mock数据 - 鸟类观测点
const birdLocations = [
    {
        id: 1,
        name: '嘉定紫藤园',
        category: '湿地公园',
        latitude: 31.2354,
        longitude: 121.4617,
        image: '/static/images/location_1.png', // 需要准备对应的图片
        description: '嘉定紫藤园是上海市著名的观鸟地点，拥有丰富的湿地生态系统。这里常年有20多种水鸟栖息，是观测候鸟迁徙的绝佳地点。园内有专门的观鸟平台，每年春秋两季是最佳观鸟时间。',
        birdStats: {
            species: 42,
            observations: 186,
            rareSpecies: 3
        }
    },
    {
        id: 2,
        name: '新城公园',
        category: '城市公园',
        latitude: 31.2404,
        longitude: 121.4837,
        image: '/static/images/location2.jpg',
        description: '新城公园是市区内难得的鸟类栖息地，公园内有多种乔木和灌木，为小型鸟类提供了良好的栖息环境。这里常见麻雀、白头鹎、黑尾蜡嘴雀等鸟类，是城市中轻松观鸟的好去处。',
        birdStats: {
            species: 18,
            observations: 94,
            rareSpecies: 0
        }
    },
    {
        id: 3,
        name: '环城河绿带',
        category: '河道湿地',
        latitude: 31.2284,
        longitude: 121.4527,
        image: '/static/images/location3.jpg',
        description: '环城河绿带沿线栽种了大量水生植物，吸引了多种水鸟前来觅食和栖息。河边设有多个观鸟点，常见鸟类包括白鹭、夜鹭、绿头鸭等。这里环境幽静，是观鸟爱好者的秘密天堂。',
        birdStats: {
            species: 26,
            observations: 132,
            rareSpecies: 1
        }
    },
    {
        id: 4,
        name: '嘉宝花园别墅',
        category: '居民区',
        latitude: 31.2234,
        longitude: 121.4637,
        image: '/static/images/location4.jpg',
        description: '嘉宝花园别墅区内绿化良好，种植了多种果树和花卉，吸引了很多小型鸟类前来筑巢。这里可以观察到柳莺、绣眼鸟等小型鸟类，是城市观鸟的好去处。此处为居民区，参观时请保持安静。',
        birdStats: {
            species: 13,
            observations: 67,
            rareSpecies: 0
        }
    },
    {
        id: 5,
        name: '梦花湖',
        category: '湖泊湿地',
        latitude: 31.2454,
        longitude: 121.4557,
        image: '/static/images/location5.jpg',
        description: '梦花湖是一个人工湖泊，周围植被茂盛，湖面开阔，是多种水鸟和涉禽的栖息地。这里可以观察到白鹭、苍鹭、小䴙䴘等水鸟，以及多种雁鸭类。湖边有专门的观鸟屋和栈道，适合长时间观鸟。',
        birdStats: {
            species: 35,
            observations: 158,
            rareSpecies: 2
        }
    },
    {
        id: 6,
        name: '垃圾填埋场湿地',
        category: '恢复性湿地',
        latitude: 31.2194,
        longitude: 121.4867,
        image: '/static/images/location6.jpg',
        description: '这个区域原是垃圾填埋场，后经过生态修复，现已成为重要的鸟类栖息地。由于昆虫和小型动物丰富，吸引了大量猛禽和涉禽。这里常见猛禽包括红隼、普通鵟等，是观察猛禽的理想场所。',
        birdStats: {
            species: 22,
            observations: 76,
            rareSpecies: 2
        }
    },
    {
        id: 7,
        name: '绿地嘉尚国际广场',
        category: '城市绿地',
        latitude: 31.2284,
        longitude: 121.4987,
        image: '/static/images/location7.jpg',
        description: '绿地嘉尚国际广场周边有精心设计的城市绿地，种植了多种乡土树种，为鸟类提供了良好的栖息环境。这里常见鸟类包括珠颈斑鸠、树麻雀、白头鹎等，适合早晨或傍晚前来观鸟。',
        birdStats: {
            species: 16,
            observations: 83,
            rareSpecies: 0
        }
    }
];

// 检查并获取位置权限
const checkAndRequestLocationPermission = () => {
    return new Promise((resolve, reject) => {
        uni.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userLocation'] === false) {
                    // 用户已拒绝过授权，显示引导弹窗
                    uni.showModal({
                        title: '需要位置权限',
                        content: '为了提供准确的地图服务，需要获取您的位置信息。请在设置中允许"云雀解码"访问您的位置。',
                        confirmText: '去设置',
                        cancelText: '取消',
                        success: (modalRes) => {
                            if (modalRes.confirm) {
                                // 打开设置页面
                                uni.openSetting({
                                    success: (settingRes) => {
                                        if (settingRes.authSetting['scope.userLocation']) {
                                            resolve();
                                        } else {
                                            reject(new Error('未获得位置权限'));
                                        }
                                    }
                                });
                            } else {
                                reject(new Error('用户取消授权'));
                            }
                        }
                    });
                } else if (res.authSetting['scope.userLocation'] === true) {
                    // 用户已授权
                    resolve();
                } else {
                    // 首次请求授权
                    uni.authorize({
                        scope: 'scope.userLocation',
                        success: () => {
                            resolve();
                        },
                        fail: (err) => {
                            reject(err);
                        }
                    });
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};

// 获取当前位置
const getCurrentLocation = () => {
    // 显示加载提示
    uni.showLoading({
        title: '定位中...'
    });

    // 先检查权限
    checkAndRequestLocationPermission()
        .then(() => {
            // 获取位置
            uni.getLocation({
                type: 'gcj02',
                success: (res) => {
                    latitude.value = res.latitude;
                    longitude.value = res.longitude;
                    scale.value = 16; // 放大地图以更清晰地显示位置

                    uni.showToast({
                        title: '定位成功',
                        icon: 'success',
                        duration: 1500
                    });

                    // 加载鸟类观测点数据
                    loadBirdLocations();
                },
                fail: (err) => {
                    console.error('获取位置失败：', err);
                    uni.showToast({
                        title: '获取位置失败',
                        icon: 'none'
                    });
                    
                    // 即使获取位置失败，也加载鸟类观测点数据
                    loadBirdLocations();
                },
                complete: () => {
                    uni.hideLoading();
                }
            });
        })
        .catch((err) => {
            console.error('位置权限错误：', err);
            uni.hideLoading();
            
            // 使用默认位置加载数据
            loadBirdLocations();
        });
};

// 移动到当前位置
const moveToCurrentLocation = () => {
    getCurrentLocation();
};

// 使用腾讯地图API进行地点搜索
const searchLocation = (keyword) => {
    return new Promise((resolve, reject) => {
        uni.request({
            url: `https://apis.map.qq.com/ws/place/v1/search`,
            method: 'GET',
            data: {
                key: TENCENT_MAP_KEY,
                keyword: keyword,
                boundary: 'nearby(' + latitude.value + ',' + longitude.value + ',10000)', // 搜索范围10km
                page_size: 10,
                page_index: 1
            },
            success: (res) => {
                if (res.data && res.data.status === 0 && res.data.data.length > 0) {
                    resolve(res.data.data);
                } else {
                    reject(new Error('未找到相关地点'));
                }
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};

// 处理搜索
const handleSearch = async () => {
    if (!searchText.value) return;
    
    uni.showLoading({ title: '搜索中...' });
    
    try {
        const result = await searchLocation(searchText.value);
        if (result && result.length > 0) {
            // 更新地图中心点
            latitude.value = result[0].location.lat;
            longitude.value = result[0].location.lng;
            
            // 添加搜索结果标记，使用不同颜色区分搜索结果和数据库地点
            const searchMarker = {
                id: 999,
                latitude: result[0].location.lat,
                longitude: result[0].location.lng,
                title: result[0].title,
                iconPath: '/static/images/location-pin-solid.svg', // 红色标记图标
                width: 30,
                height: 30,
                callout: {
                    content: result[0].title,
                    color: '#000000',
                    fontSize: 12,
                    borderRadius: 5,
                    bgColor: '#ffffff',
                    padding: 5,
                    display: 'ALWAYS'
                }
            };
            
            // 保留数据库地点标记并添加搜索结果标记
            const dbMarkers = markers.value.filter(marker => marker.id !== 999);
            markers.value = [...dbMarkers, searchMarker];
            
            scale.value = 16; // 放大地图以更清晰地显示位置
        }
    } catch (error) {
        uni.showToast({
            title: '搜索失败: ' + error.message,
            icon: 'none'
        });
    } finally {
        uni.hideLoading();
    }
};

// 加载鸟类观测点数据
const loadBirdLocations = () => {
    // 这里使用Mock数据，实际应用中应该从API获取
    const locationMarkers = birdLocations.map(loc => ({
        id: loc.id,
        latitude: loc.latitude,
        longitude: loc.longitude,
        title: loc.name,
        iconPath: '/static/images/location-pin-solid.svg', // 绿色标记图标
        width: 30,
        height: 30,
        callout: {
            content: loc.name,
            color: '#000000',
            fontSize: 12,
            borderRadius: 5,
            bgColor: '#ffffff',
            padding: 5,
            display: 'AlWAYS'
        }
    }));
    
    // 更新标记
    markers.value = locationMarkers;
    
    // 绘制区域边界
    drawAreaBoundary(birdLocations);
};

// 绘制区域边界
const drawAreaBoundary = (locations) => {
    if (locations.length < 3) return; // 至少需要3个点才能形成一个区域
    
    // 使用所有点构建一个多边形
    const points = locations.map(loc => ({
        latitude: loc.latitude,
        longitude: loc.longitude
    }));
    
    // 添加第一个点作为结束点，形成闭环
    points.push(points[0]);
    
    polyline.value = [{
        points: points,
        color: '#1E90FF77', // 半透明蓝色
        width: 2,
        dottedLine: false,
        arrowLine: false
    }];
};

// 处理标记点击事件
const onMarkerTap = (e) => {
    console.log('Marker tapped:', e); // 添加日志以便调试
    const markerId = e.detail.markerId; // 注意：使用 e.detail.markerId 而不是 e.markerId
    
    console.log('Looking for location with ID:', markerId);
    // 查找被点击的位置信息
    const location = birdLocations.find(loc => loc.id === markerId);
    
    if (location) {
        console.log('Found location:', location);
        // 设置选中的位置信息
        selectedLocation.value = location;
        // 显示信息卡片
        showInfoCard.value = true;
    } else {
        console.log('No matching location found for ID:', markerId);
        // 可以添加一个提示，如果需要
        uni.showToast({
            title: '未找到该地点信息',
            icon: 'none'
        });
    }
};
// 页面加载时获取位置和加载数据
onMounted(() => {
    getCurrentLocation();
});
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
    z-index: 100;
}

.icon-location {
    font-size: 40rpx;
}

/* 添加点击效果 */
.location-btn:active {
    opacity: 0.8;
    transform: scale(0.95);
}

/* 遮罩层 */
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 200;
}

/* 信息卡片样式 */
.info-card {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 300;
    padding: 30rpx;
    padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
}

.info-card-inner {
    background-color: #ffffff;
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 30rpx rgba(0, 0, 0, 0.15);
    position: relative;
    max-height: 80vh;
    overflow-y: auto;
}

.info-card-close {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    width: 60rpx;
    height: 60rpx;
    background-color: rgba(0, 0, 0, 0.5);
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    z-index: 10;
}

.info-card-image {
    width: 100%;
    height: 320rpx;
    object-fit: cover;
}

.info-card-content {
    padding: 30rpx;
}

.info-card-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 10rpx;
}

.info-card-subtitle {
    font-size: 24rpx;
    color: #666;
    margin-bottom: 20rpx;
}

.info-card-description {
    font-size: 28rpx;
    color: #333;
    line-height: 1.6;
    margin-bottom: 30rpx;
}

/* 鸟类统计样式 */
.bird-stats {
    background-color: #f8f8f8;
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 30rpx;
}

.stats-title {
    font-size: 28rpx;
    font-weight: bold;
    color: #333;
    margin-bottom: 20rpx;
}

.stats-row {
    display: flex;
    justify-content: space-between;
}

.stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
}

.stat-value {
    font-size: 32rpx;
    font-weight: bold;
    color: #07c160;
}

.stat-label {
    font-size: 24rpx;
    color: #666;
    margin-top: 10rpx;
}

/* 操作按钮 */
.action-buttons {
    display: flex;
    gap: 20rpx;
}

.action-btn {
    flex: 1;
    height: 80rpx;
    border-radius: 40rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28rpx;
    border: none;
}

.details-btn {
    background-color: #f0f0f0;
    color: #333;
}

.navigate-btn {
    background-color: #07c160;
    color: #ffffff;
}
</style>