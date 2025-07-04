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
                <view class="search-btn" @tap="handleSearch" v-if="searchText">
                    <text class="search-btn-text">搜索</text>
                </view>
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
                @regionchange="onRegionChange"
            ></map>

            <!-- Control Buttons -->
            <view class="control-buttons">
                <!-- My Location Button -->
                <view class="control-btn location-btn" @tap="moveToCurrentLocation">
                    <text class="icon-location">📍</text>
                </view>
                
                <!-- Zoom In Button -->
                <view class="control-btn zoom-btn" @tap="zoomIn">
                    <text class="zoom-icon">+</text>
                </view>
                
                <!-- Zoom Out Button -->
                <view class="control-btn zoom-btn" @tap="zoomOut">
                    <text class="zoom-icon">-</text>
                </view>
                
                <!-- Layer Switch Button -->
                <view class="control-btn layer-btn" @tap="switchMapLayer">
                    <text class="layer-icon">🗺️</text>
                </view>
            </view>
            
            <!-- Info Card (显示点击后的地点信息) -->
            <view class="info-card" v-if="showInfoCard" @tap.stop="closeInfoCard">
                <view class="info-card-inner" @tap.stop="">
                    <view class="info-card-header">
                        <view class="info-card-close" @tap="closeInfoCard">×</view>
                        <image 
                            class="info-card-image" 
                            :src="getOSSUrl(selectedLocation.image, 'large')" 
                            mode="aspectFill"
                            @error="onImageError"
                        ></image>
                        <view class="info-card-badge">{{selectedLocation.category}}</view>
                    </view>
                    
                    <view class="info-card-content">
                        <view class="info-card-title">{{selectedLocation.name}}</view>
                        <view class="info-card-description">{{selectedLocation.description}}</view>
                        
                        <!-- 鸟类观测统计 -->
                        <view class="bird-stats" v-if="selectedLocation.birdStats">
                            <view class="stats-title">📊 观测统计</view>
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
                        
                        <!-- 最佳观鸟时间 -->
                        <view class="best-time" v-if="selectedLocation.bestTime">
                            <view class="time-title">⏰ 最佳观鸟时间</view>
                            <view class="time-content">{{selectedLocation.bestTime}}</view>
                        </view>
                        
                        <!-- 常见鸟类预览 -->
                        <view class="common-birds" v-if="selectedLocation.commonBirds">
                            <view class="birds-title">🐦 常见鸟类</view>
                            <view class="birds-list">
                                <view 
                                    v-for="bird in selectedLocation.commonBirds" 
                                    :key="bird.id"
                                    class="bird-tag"
                                >
                                    {{bird.name}}
                                </view>
                            </view>
                        </view>
                        
                        <!-- 操作按钮 -->
                        <view class="action-buttons">
                            <button class="action-btn details-btn" @tap="viewDetails">
                                <text class="btn-icon">📖</text>
                                <text>查看详情</text>
                            </button>
                            <button class="action-btn navigate-btn" @tap="navigateToLocation">
                                <text class="btn-icon">🧭</text>
                                <text>导航前往</text>
                            </button>
                            <button class="action-btn share-btn" @tap="shareLocation">
                                <text class="btn-icon">📤</text>
                                <text>分享位置</text>
                            </button>
                        </view>
                    </view>
                </view>
            </view>
        </view>
        
        <!-- Loading Overlay -->
        <view class="loading-overlay" v-if="isLoading">
            <view class="loading-content">
                <view class="loading-spinner"></view>
                <text class="loading-text">{{loadingText}}</text>
            </view>
        </view>
        
        <!-- 地图图例 -->
        <view class="map-legend" v-if="showLegend">
            <view class="legend-header">
                <text class="legend-title">🗺️ 地图图例</text>
                <text class="legend-close" @tap="showLegend = false">×</text>
            </view>
            <view class="legend-items">
                <view class="legend-item">
                    <image :src="getOSSUrl('static/icons/marker-wetland.png', 'icon')" class="legend-icon" @error="onIconError"></image>
                    <text class="legend-text">湿地公园</text>
                </view>
                <view class="legend-item">
                    <image :src="getOSSUrl('static/icons/marker-park.png', 'icon')" class="legend-icon" @error="onIconError"></image>
                    <text class="legend-text">城市公园</text>
                </view>
                <view class="legend-item">
                    <image :src="getOSSUrl('static/icons/marker-river.png', 'icon')" class="legend-icon" @error="onIconError"></image>
                    <text class="legend-text">河道湿地</text>
                </view>
                <view class="legend-item">
                    <image :src="getOSSUrl('static/icons/marker-residential.png', 'icon')" class="legend-icon" @error="onIconError"></image>
                    <text class="legend-text">居民区</text>
                </view>
            </view>
        </view>
        
        <!-- 添加底部导航栏 -->
        <tab-bar></tab-bar>
    </view>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import TabBar from '@/components/tabbar.vue';

// ========== OSS配置 ==========
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
const getOSSUrl = (filename, size = 'medium') => {
  if (!filename) return '';
  
  // 确保文件名不以斜杠开头
  const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename;
  
  // 根据尺寸类型设置不同的处理参数
  let params = '';
  switch(size) {
    case 'icon':
      params = '?x-oss-process=image/resize,m_lfit,w_32,h_32/quality,q_90/format,webp';
      break;
    case 'small':
      params = '?x-oss-process=image/resize,m_lfit,w_100,h_100/quality,q_90/format,webp';
      break;
    case 'medium':
      params = '?x-oss-process=image/resize,m_lfit,w_200,h_150/quality,q_90/format,webp';
      break;
    case 'large':
      params = '?x-oss-process=image/resize,m_lfit,w_400,h_250/quality,q_90/format,webp';
      break;
    case 'marker':
      params = '?x-oss-process=image/resize,m_lfit,w_40,h_40/quality,q_90/format,webp';
      break;
    default:
      params = '?x-oss-process=image/resize,m_lfit,w_200,h_150/quality,q_90/format,webp';
  }
  
  return `${ossConfig.baseUrl}/${cleanFilename}${params}`;
};

// 腾讯地图API密钥
const TENCENT_MAP_KEY = '2VEBZ-H2SW5-URJIL-I26ZE-2EB2E-BOF27';

// ========== 响应式状态 ==========
const latitude = ref(31.2304)  // 默认纬度（上海）
const longitude = ref(121.4737)  // 默认经度（上海）
const scale = ref(14)  // 默认缩放级别
const searchText = ref('')
const markers = ref([])
const polyline = ref([]) // 用于显示区域边界

// UI状态
const showInfoCard = ref(false)
const selectedLocation = ref({})
const isLoading = ref(false)
const loadingText = ref('加载中...')
const showLegend = ref(false)
const currentMapLayer = ref('standard') // standard, satellite

// ========== Mock数据 - 鸟类观测点 ==========
const birdLocations = ref([
    {
        id: 1,
        name: '嘉定紫藤园',
        category: '湿地公园',
        latitude: 31.2354,
        longitude: 121.4617,
        image: 'static/images/locations/jiading-wisteria.jpg',
        description: '嘉定紫藤园是上海市著名的观鸟地点，拥有丰富的湿地生态系统。这里常年有20多种水鸟栖息，是观测候鸟迁徙的绝佳地点。园内有专门的观鸟平台，每年春秋两季是最佳观鸟时间。',
        birdStats: {
            species: 42,
            observations: 186,
            rareSpecies: 3
        },
        bestTime: '春秋两季（3-5月，9-11月）清晨5-8点，傍晚4-6点',
        commonBirds: [
            { id: 1, name: '白鹭' },
            { id: 2, name: '夜鹭' },
            { id: 3, name: '小䴙䴘' },
            { id: 4, name: '绿头鸭' }
        ],
        markerIcon: 'static/icons/marker-wetland.png'
    },
    {
        id: 2,
        name: '新城公园',
        category: '城市公园',
        latitude: 31.2404,
        longitude: 121.4837,
        image: 'static/images/locations/xincheng-park.jpg',
        description: '新城公园是市区内难得的鸟类栖息地，公园内有多种乔木和灌木，为小型鸟类提供了良好的栖息环境。这里常见麻雀、白头鹎、黑尾蜡嘴雀等鸟类，是城市中轻松观鸟的好去处。',
        birdStats: {
            species: 18,
            observations: 94,
            rareSpecies: 0
        },
        bestTime: '全年适宜，早晨6-9点最佳',
        commonBirds: [
            { id: 5, name: '白头鹎' },
            { id: 6, name: '麻雀' },
            { id: 7, name: '乌鸫' },
            { id: 8, name: '珠颈斑鸠' }
        ],
        markerIcon: 'static/icons/marker-park.png'
    },
    {
        id: 3,
        name: '环城河绿带',
        category: '河道湿地',
        latitude: 31.2284,
        longitude: 121.4527,
        image: 'static/images/locations/huancheng-river.jpg',
        description: '环城河绿带沿线栽种了大量水生植物，吸引了多种水鸟前来觅食和栖息。河边设有多个观鸟点，常见鸟类包括白鹭、夜鹭、绿头鸭等。这里环境幽静，是观鸟爱好者的秘密天堂。',
        birdStats: {
            species: 26,
            observations: 132,
            rareSpecies: 1
        },
        bestTime: '春夏季节（4-8月）早晚时分',
        commonBirds: [
            { id: 9, name: '白鹭' },
            { id: 10, name: '绿头鸭' },
            { id: 11, name: '翠鸟' },
            { id: 12, name: '黑水鸡' }
        ],
        markerIcon: 'static/icons/marker-river.png'
    },
    {
        id: 4,
        name: '嘉宝花园别墅',
        category: '居民区',
        latitude: 31.2234,
        longitude: 121.4637,
        image: 'static/images/locations/jiabao-garden.jpg',
        description: '嘉宝花园别墅区内绿化良好，种植了多种果树和花卉，吸引了很多小型鸟类前来筑巢。这里可以观察到柳莺、绣眼鸟等小型鸟类，是城市观鸟的好去处。此处为居民区，参观时请保持安静。',
        birdStats: {
            species: 13,
            observations: 67,
            rareSpecies: 0
        },
        bestTime: '春季（3-5月）清晨时分',
        commonBirds: [
            { id: 13, name: '柳莺' },
            { id: 14, name: '绣眼鸟' },
            { id: 15, name: '红嘴蓝鹊' },
            { id: 16, name: '白头鹎' }
        ],
        markerIcon: 'static/icons/marker-residential.png'
    },
    {
        id: 5,
        name: '梦花湖',
        category: '湖泊湿地',
        latitude: 31.2454,
        longitude: 121.4557,
        image: 'static/images/locations/menghua-lake.jpg',
        description: '梦花湖是一个人工湖泊，周围植被茂盛，湖面开阔，是多种水鸟和涉禽的栖息地。这里可以观察到白鹭、苍鹭、小䴙䴘等水鸟，以及多种雁鸭类。湖边有专门的观鸟屋和栈道，适合长时间观鸟。',
        birdStats: {
            species: 35,
            observations: 158,
            rareSpecies: 2
        },
        bestTime: '全年适宜，迁徙季节（春秋）最佳',
        commonBirds: [
            { id: 17, name: '苍鹭' },
            { id: 18, name: '小䴙䴘' },
            { id: 19, name: '赤膀鸭' },
            { id: 20, name: '白骨顶' }
        ],
        markerIcon: 'static/icons/marker-wetland.png'
    },
    {
        id: 6,
        name: '垃圾填埋场湿地',
        category: '恢复性湿地',
        latitude: 31.2194,
        longitude: 121.4867,
        image: 'static/images/locations/landfill-wetland.jpg',
        description: '这个区域原是垃圾填埋场，后经过生态修复，现已成为重要的鸟类栖息地。由于昆虫和小型动物丰富，吸引了大量猛禽和涉禽。这里常见猛禽包括红隼、普通鵟等，是观察猛禽的理想场所。',
        birdStats: {
            species: 22,
            observations: 76,
            rareSpecies: 2
        },
        bestTime: '秋冬季节（10-2月）中午时分',
        commonBirds: [
            { id: 21, name: '红隼' },
            { id: 22, name: '普通鵟' },
            { id: 23, name: '灰伯劳' },
            { id: 24, name: '田鹨' }
        ],
        markerIcon: 'static/icons/marker-wetland.png'
    },
    {
        id: 7,
        name: '绿地嘉尚国际广场',
        category: '城市绿地',
        latitude: 31.2284,
        longitude: 121.4987,
        image: 'static/images/locations/jiashang-plaza.jpg',
        description: '绿地嘉尚国际广场周边有精心设计的城市绿地，种植了多种乡土树种，为鸟类提供了良好的栖息环境。这里常见鸟类包括珠颈斑鸠、树麻雀、白头鹎等，适合早晨或傍晚前来观鸟。',
        birdStats: {
            species: 16,
            observations: 83,
            rareSpecies: 0
        },
        bestTime: '全年适宜，早晨和傍晚最佳',
        commonBirds: [
            { id: 25, name: '珠颈斑鸠' },
            { id: 26, name: '树麻雀' },
            { id: 27, name: '白头鹎' },
            { id: 28, name: '八哥' }
        ],
        markerIcon: 'static/icons/marker-park.png'
    }
]);

// ========== 计算属性 ==========
const totalSpecies = computed(() => {
    return birdLocations.value.reduce((total, location) => {
        return total + location.birdStats.species;
    }, 0);
});

const totalObservations = computed(() => {
    return birdLocations.value.reduce((total, location) => {
        return total + location.birdStats.observations;
    }, 0);
});

// ========== 权限和定位功能 ==========
/**
 * 检查并获取位置权限
 */
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

/**
 * 获取当前位置
 */
const getCurrentLocation = () => {
    isLoading.value = true;
    loadingText.value = '定位中...';

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
                    isLoading.value = false;
                }
            });
        })
        .catch((err) => {
            console.error('位置权限错误：', err);
            isLoading.value = false;
            
            // 使用默认位置加载数据
            loadBirdLocations();
        });
};

/**
 * 移动到当前位置
 */
const moveToCurrentLocation = () => {
    // 添加触觉反馈
    try {
        uni.vibrateShort({
            type: 'light'
        });
    } catch (error) {
        console.warn('触觉反馈不支持:', error);
    }
    
    getCurrentLocation();
};

// ========== 搜索功能 ==========
/**
 * 使用腾讯地图API进行地点搜索
 */
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

/**
 * 处理搜索
 */
const handleSearch = async () => {
    if (!searchText.value.trim()) {
        uni.showToast({
            title: '请输入搜索内容',
            icon: 'none'
        });
        return;
    }
    
    isLoading.value = true;
    loadingText.value = '搜索中...';
    
    // 添加触觉反馈
    try {
        uni.vibrateShort({
            type: 'light'
        });
    } catch (error) {
        console.warn('触觉反馈不支持:', error);
    }
    
    try {
        // 首先在本地数据中搜索
        const localResults = birdLocations.value.filter(location => 
            location.name.includes(searchText.value) || 
            location.category.includes(searchText.value) ||
            location.description.includes(searchText.value) ||
            location.commonBirds.some(bird => bird.name.includes(searchText.value))
        );
        
        if (localResults.length > 0) {
            // 如果找到本地结果，移动到第一个结果
            const firstResult = localResults[0];
            latitude.value = firstResult.latitude;
            longitude.value = firstResult.longitude;
            scale.value = 16;
            
            // 高亮搜索结果
            highlightSearchResults(localResults);
            
            uni.showToast({
                title: `找到${localResults.length}个相关地点`,
                icon: 'success'
            });
        } else {
            // 如果本地没有结果，使用腾讯地图API搜索
            const result = await searchLocation(searchText.value);
            if (result && result.length > 0) {
                // 更新地图中心点
                latitude.value = result[0].location.lat;
                longitude.value = result[0].location.lng;
                
                // 添加搜索结果标记
                const searchMarker = {
                    id: 999,
                    latitude: result[0].location.lat,
                    longitude: result[0].location.lng,
                    title: result[0].title,
                    iconPath: getOSSUrl('static/icons/marker-search.png', 'marker'),
                    width: 40,
                    height: 40,
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
                
                scale.value = 16;
                
                uni.showToast({
                    title: '搜索成功',
                    icon: 'success'
                });
            }
        }
    } catch (error) {
        console.error('搜索失败:', error);
        uni.showToast({
            title: '搜索失败: ' + error.message,
            icon: 'none'
        });
    } finally {
        isLoading.value = false;
    }
};

/**
 * 高亮搜索结果
 */
const highlightSearchResults = (results) => {
    // 更新标记，高亮搜索结果
    markers.value = birdLocations.value.map(location => {
        const isHighlighted = results.some(result => result.id === location.id);
        return {
            id: location.id,
            latitude: location.latitude,
            longitude: location.longitude,
            title: location.name,
            iconPath: getOSSUrl(
                isHighlighted ? 'static/icons/marker-highlighted.png' : location.markerIcon, 
                'marker'
            ),
            width: isHighlighted ? 50 : 40,
            height: isHighlighted ? 50 : 40,
            callout: {
                content: location.name,
                color: isHighlighted ? '#ff6b6b' : '#000000',
                fontSize: isHighlighted ? 14 : 12,
                borderRadius: 5,
                bgColor: isHighlighted ? '#fff5f5' : '#ffffff',
                padding: 5,
                display: 'ALWAYS'
            }
        };
    });
};

// ========== 地图控制功能 ==========
/**
 * 放大地图
 */
const zoomIn = () => {
    if (scale.value < 20) {
        scale.value += 2;
        
        // 添加触觉反馈
        try {
            uni.vibrateShort({
                type: 'light'
            });
        } catch (error) {
            console.warn('触觉反馈不支持:', error);
        }
    }
};

/**
 * 缩小地图
 */
const zoomOut = () => {
    if (scale.value > 5) {
        scale.value -= 2;
        
        // 添加触觉反馈
        try {
            uni.vibrateShort({
                type: 'light'
            });
        } catch (error) {
            console.warn('触觉反馈不支持:', error);
        }
    }
};

/**
 * 切换地图图层
 */
const switchMapLayer = () => {
    currentMapLayer.value = currentMapLayer.value === 'standard' ? 'satellite' : 'standard';
    
    // 添加触觉反馈
    try {
        uni.vibrateShort({
            type: 'medium'
        });
    } catch (error) {
        console.warn('触觉反馈不支持:', error);
    }
    
    uni.showToast({
        title: currentMapLayer.value === 'standard' ? '标准地图' : '卫星地图',
        icon: 'none',
        duration: 1000
    });
};

/**
 * 地图区域变化处理
 */
const onRegionChange = (e) => {
    if (e.type === 'end') {
        // 区域变化结束，可以在这里做一些处理
        console.log('地图区域变化:', e);
    }
};

// ========== 数据加载功能 ==========
/**
 * 加载鸟类观测点数据
 */
const loadBirdLocations = () => {
    isLoading.value = true;
    loadingText.value = '加载观测点数据...';
    
    try {
        // 模拟API延迟
        setTimeout(() => {
            const locationMarkers = birdLocations.value.map(loc => ({
                id: loc.id,
                latitude: loc.latitude,
                longitude: loc.longitude,
                title: loc.name,
                iconPath: getOSSUrl(loc.markerIcon, 'marker'),
                width: 40,
                height: 40,
                callout: {
                    content: loc.name,
                    color: '#000000',
                    fontSize: 12,
                    borderRadius: 5,
                    bgColor: '#ffffff',
                    padding: 5,
                    display: 'ALWAYS'
                }
            }));
            
            // 更新标记
            markers.value = locationMarkers;
            
            // 绘制区域边界
            drawAreaBoundary(birdLocations.value);
            
            isLoading.value = false;
            
            uni.showToast({
                title: `已加载${birdLocations.value.length}个观测点`,
                icon: 'success',
                duration: 1500
            });
        }, 800);
    } catch (error) {
        console.error('加载数据失败:', error);
        isLoading.value = false;
        uni.showToast({
            title: '加载数据失败',
            icon: 'none'
        });
    }
};

/**
 * 绘制区域边界
 */
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

// ========== 标记点击和信息卡片功能 ==========
/**
 * 处理标记点击事件
 */
const onMarkerTap = (e) => {
    console.log('Marker tapped:', e);
    const markerId = e.detail.markerId;
    
    // 添加触觉反馈
    try {
        uni.vibrateShort({
            type: 'medium'
        });
    } catch (error) {
        console.warn('触觉反馈不支持:', error);
    }
    
    // 查找被点击的位置信息
    const location = birdLocations.value.find(loc => loc.id === markerId);
    
    if (location) {
        // 设置选中的位置信息
        selectedLocation.value = location;
        // 显示信息卡片
        showInfoCard.value = true;
        
        console.log('显示地点信息:', location.name);
    } else {
        console.log('未找到匹配的地点信息, ID:', markerId);
        uni.showToast({
            title: '未找到该地点信息',
            icon: 'none'
        });
    }
};

/**
 * 关闭信息卡片
 */
const closeInfoCard = () => {
    showInfoCard.value = false;
    selectedLocation.value = {};
    
    // 添加触觉反馈
    try {
        uni.vibrateShort({
            type: 'light'
        });
    } catch (error) {
        console.warn('触觉反馈不支持:', error);
    }
};

// ========== 操作按钮功能 ==========
/**
 * 查看地点详情
 */
const viewDetails = () => {
    // TODO: 跳转到地点详情页面
    console.log('查看详情:', selectedLocation.value.name);
    
    // 添加触觉反馈
    try {
        uni.vibrateShort({
            type: 'medium'
        });
    } catch (error) {
        console.warn('触觉反馈不支持:', error);
    }
    
    // 示例跳转（需要根据实际路由配置调整）
    uni.navigateTo({
        url: `/pages/LocationDetail/LocationDetail?id=${selectedLocation.value.id}`,
        fail: (error) => {
            console.error('跳转失败:', error);
            uni.showToast({
                title: '功能开发中',
                icon: 'none'
            });
        }
    });
};

/**
 * 导航到地点
 */
const navigateToLocation = () => {
    const location = selectedLocation.value;
    console.log('导航到:', location.name);
    
    // 添加触觉反馈
    try {
        uni.vibrateShort({
            type: 'heavy'
        });
    } catch (error) {
        console.warn('触觉反馈不支持:', error);
    }
    
    // 打开系统地图应用进行导航
    uni.openLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
        address: location.description,
        success: () => {
            console.log('成功打开地图导航');
        },
        fail: (error) => {
            console.error('打开地图失败:', error);
            uni.showToast({
                title: '无法打开导航',
                icon: 'none'
            });
        }
    });
};

/**
 * 分享地点
 */
const shareLocation = () => {
    const location = selectedLocation.value;
    console.log('分享地点:', location.name);
    
    // 添加触觉反馈
    try {
        uni.vibrateShort({
            type: 'medium'
        });
    } catch (error) {
        console.warn('触觉反馈不支持:', error);
    }
    
    // TODO: 实现分享功能
    uni.share({
        provider: 'weixin',
        scene: 'WXSceneSession',
        type: 0,
        href: `https://yourapp.com/location/${location.id}`,
        title: `${location.name} - 观鸟地点推荐`,
        summary: location.description,
        imageUrl: getOSSUrl(location.image, 'medium'),
        success: () => {
            uni.showToast({
                title: '分享成功',
                icon: 'success'
            });
            closeInfoCard();
        },
        fail: (error) => {
            console.error('分享失败:', error);
            uni.showToast({
                title: '分享失败',
                icon: 'none'
            });
        }
    });
};

// ========== 错误处理 ==========
/**
 * 图标加载失败处理
 */
const onIconError = (error) => {
    console.warn('图标加载失败:', error);
    // 隐藏失败的图标
    if (error.target) {
        error.target.style.display = 'none';
    }
};

/**
 * 图片加载失败处理
 */
const onImageError = (error) => {
    console.warn('地点图片加载失败:', error);
    // 设置默认占位图
    if (error.target) {
        const defaultImageUrl = getOSSUrl('static/images/location-placeholder.jpg', 'large');
        error.target.src = defaultImageUrl;
    }
};

// ========== 生命周期 ==========
onMounted(() => {
    console.log('地图页面已加载');
    getCurrentLocation();
    
    // 2秒后显示图例
    setTimeout(() => {
        showLegend.value = true;
        setTimeout(() => {
            showLegend.value = false;
        }, 5000);
    }, 2000);
});
</script>

<style>
.container {
    position: relative;
    height: 100vh;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

/* 搜索栏样式 */
.search-container {
    position: fixed;
    top: var(--status-bar-height, 44px);
    left: 0;
    right: 0;
    z-index: 100;
    padding: 20rpx;
}

.search-box {
    display: flex;
    align-items: center;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 50rpx;
    padding: 16rpx 30rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.search-box:focus-within {
    box-shadow: 0 8rpx 30rpx rgba(59, 130, 246, 0.2);
    transform: translateY(-2rpx);
}

.icon-search {
    margin-right: 16rpx;
    font-size: 32rpx;
    color: #64748b;
}

.search-input {
    flex: 1;
    font-size: 28rpx;
    color: #1e293b;
    background: transparent;
    border: none;
    outline: none;
}

.search-btn {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    padding: 12rpx 20rpx;
    border-radius: 30rpx;
    margin-left: 10rpx;
    transition: all 0.3s ease;
}

.search-btn:active {
    transform: scale(0.95);
}

.search-btn-text {
    font-size: 24rpx;
    color: white;
}

/* 地图容器 */
.map-container {
    position: relative;
    height: 100%;
    width: 100%;
}

.map {
    width: 100%;
    height: 100%;
}

/* 控制按钮 */
.control-buttons {
    position: fixed;
    right: 30rpx;
    bottom: 200rpx;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 15rpx;
}

.control-btn {
    background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.1);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
}

.control-btn:active {
    transform: scale(0.9);
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.15);
}

.control-btn:hover {
    transform: translateY(-4rpx);
    box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.15);
}

.icon-location {
    font-size: 40rpx;
}

.zoom-icon {
    font-size: 48rpx;
    font-weight: bold;
    color: #374151;
}

.layer-icon {
    font-size: 36rpx;
}

/* 加载覆盖层 */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
    backdrop-filter: blur(5px);
}

.loading-content {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    padding: 40rpx;
    border-radius: 20rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.1);
}

.loading-spinner {
    width: 60rpx;
    height: 60rpx;
    border: 4rpx solid #e2e8f0;
    border-top: 4rpx solid #3b82f6;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20rpx;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.loading-text {
    color: #374151;
    font-size: 28rpx;
}

/* 地图图例 */
.map-legend {
    position: fixed;
    top: 200rpx;
    left: 30rpx;
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 16rpx;
    padding: 20rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
    z-index: 90;
    backdrop-filter: blur(10px);
    max-width: 300rpx;
}

.legend-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15rpx;
}

.legend-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #1e293b;
}

.legend-close {
    font-size: 36rpx;
    color: #64748b;
    cursor: pointer;
    padding: 5rpx;
}

.legend-items {
    display: flex;
    flex-direction: column;
    gap: 10rpx;
}

.legend-item {
    display: flex;
    align-items: center;
    gap: 12rpx;
}

.legend-icon {
    width: 32rpx;
    height: 32rpx;
}

.legend-text {
    font-size: 24rpx;
    color: #475569;
}

/* 信息卡片样式 */
.info-card {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 150;
    padding: 30rpx;
    padding-bottom: calc(30rpx + env(safe-area-inset-bottom));
}

.info-card-inner {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow: 0 8rpx 40rpx rgba(0, 0, 0, 0.15);
    position: relative;
    max-height: 80vh;
    overflow-y: auto;
    backdrop-filter: blur(20px);
}

.info-card-header {
    position: relative;
}

.info-card-close {
    position: absolute;
    top: 20rpx;
    right: 20rpx;
    width: 60rpx;
    height: 60rpx;
    background: rgba(0, 0, 0, 0.6);
    color: #ffffff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36rpx;
    z-index: 10;
    transition: all 0.3s ease;
}

.info-card-close:active {
    transform: scale(0.9);
    background: rgba(0, 0, 0, 0.8);
}

.info-card-image {
    width: 100%;
    height: 320rpx;
    object-fit: cover;
}

.info-card-badge {
    position: absolute;
    bottom: 20rpx;
    left: 20rpx;
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: white;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    font-size: 24rpx;
    backdrop-filter: blur(10px);
}

.info-card-content {
    padding: 30rpx;
}

.info-card-title {
    font-size: 36rpx;
    font-weight: bold;
    color: #1e293b;
    margin-bottom: 15rpx;
}

.info-card-description {
    font-size: 28rpx;
    color: #475569;
    line-height: 1.6;
    margin-bottom: 30rpx;
}

/* 鸟类统计样式 */
.bird-stats {
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border-radius: 16rpx;
    padding: 25rpx;
    margin-bottom: 25rpx;
    border: 1rpx solid rgba(59, 130, 246, 0.1);
}

.stats-title {
    font-size: 28rpx;
    font-weight: 600;
    color: #1e293b;
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
    color: #3b82f6;
}

.stat-label {
    font-size: 24rpx;
    color: #64748b;
    margin-top: 8rpx;
}

/* 最佳时间 */
.best-time {
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 25rpx;
    border: 1rpx solid rgba(245, 158, 11, 0.2);
}

.time-title {
    font-size: 26rpx;
    font-weight: 600;
    color: #92400e;
    margin-bottom: 10rpx;
}

.time-content {
    font-size: 24rpx;
    color: #a16207;
    line-height: 1.5;
}

/* 常见鸟类 */
.common-birds {
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
    border-radius: 16rpx;
    padding: 20rpx;
    margin-bottom: 30rpx;
    border: 1rpx solid rgba(34, 197, 94, 0.1);
}

.birds-title {
    font-size: 26rpx;
    font-weight: 600;
    color: #166534;
    margin-bottom: 15rpx;
}

.birds-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10rpx;
}

.bird-tag {
    background: rgba(34, 197, 94, 0.1);
    color: #166534;
    padding: 8rpx 16rpx;
    border-radius: 20rpx;
    font-size: 22rpx;
    border: 1rpx solid rgba(34, 197, 94, 0.2);
}

/* 操作按钮 */
.action-buttons {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 15rpx;
}

.action-btn {
    height: 80rpx;
    border-radius: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    font-size: 24rpx;
    border: none;
    transition: all 0.3s ease;
    gap: 5rpx;
}

.action-btn:active {
    transform: scale(0.95);
}

.btn-icon {
    font-size: 28rpx;
}

.details-btn {
    background: linear-gradient(135deg, #f1f5f9, #e2e8f0);
    color: #374151;
}

.details-btn:hover {
    background: linear-gradient(135deg, #e2e8f0, #cbd5e1);
}

.navigate-btn {
    background: linear-gradient(135deg, #22c55e, #16a34a);
    color: #ffffff;
}

.navigate-btn:hover {
    background: linear-gradient(135deg, #16a34a, #15803d);
}

.share-btn {
    background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    color: #ffffff;
}

.share-btn:hover {
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
}

/* 响应式设计 */
@media screen and (max-width: 750rpx) {
    .search-container {
        padding: 15rpx;
    }
    
    .control-buttons {
        right: 20rpx;
        bottom: 180rpx;
    }
    
    .control-btn {
        width: 70rpx;
        height: 70rpx;
    }
    
    .info-card {
        padding: 20rpx;
    }
    
    .info-card-content {
        padding: 25rpx;
    }
    
    .action-buttons {
        grid-template-columns: 1fr;
        gap: 10rpx;
    }
    
    .action-btn {
        flex-direction: row;
        justify-content: center;
        gap: 10rpx;
    }
    
    .map-legend {
        left: 20rpx;
        top: 180rpx;
        max-width: 250rpx;
    }
}

/* 暗色模式适配 */
@media (prefers-color-scheme: dark) {
    .container {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }
    
    .search-box {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    }
    
    .search-input {
        color: #f1f5f9;
    }
    
    .control-btn {
        background: linear-gradient(135deg, #334155 0%, #475569 100%);
    }
    
    .loading-content {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    }
    
    .loading-text {
        color: #f1f5f9;
    }
    
    .map-legend {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    }
    
    .legend-title {
        color: #f1f5f9;
    }
    
    .legend-text {
        color: #cbd5e1;
    }
    
    .info-card-inner {
        background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
    }
    
    .info-card-title {
        color: #f1f5f9;
    }
    
    .info-card-description {
        color: #cbd5e1;
    }
}

/* 动画效果 */
@keyframes slideUp {
    from {
        transform: translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.info-card {
    animation: slideUp 0.3s ease-out;
}

/* 性能优化 */
.control-btn, .action-btn, .search-box, .info-card-inner {
    will-change: transform, box-shadow;
}

/* 防止文本选中 */
.info-card-title, .stats-title, .legend-title {
    user-select: none;
    -webkit-user-select: none;
}
</style>