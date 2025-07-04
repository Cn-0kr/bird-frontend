<template>
    <view class="container">
        <!-- Header Section -->
        <view class="header">
            <text class="title">像鸟儿一样</text><br/>
			<text class="title">记得家的方向</text><br/>
			<text class="title">认得人的模样</text><br/>
			<text class="title">却忘了飞不过时光</text>
        </view>

        <!-- Main Content -->
        <view class="main-content">
            <view v-if="imageUrl" class="image-preview">
                <image :src="imageUrl" mode="aspectFit" class="preview-image" @error="onImageError"></image>
            </view>
            <view v-else class="placeholder">
                <text class="placeholder-text">请选择可以清晰地观察到的鸟的照片喵~</text>
            </view>
        </view>
       
	    <!-- Static Images -->
	    <view class="static-images">
	        <image :src="getOSSUrl('static/icons/ellipse-48.png', 'tiny-icon')" mode="aspectFit" class="image-0" @error="onIconError"></image>
	        <image :src="getOSSUrl('static/icons/route-105.png', 'small-icon')" mode="aspectFit" class="image-1" @error="onIconError"></image>
	        <image :src="getOSSUrl('static/icons/route-106.png', 'icon')" mode="aspectFit" class="image-2" @error="onIconError"></image>
	    </view>
		
		<image :src="getOSSUrl('static/icons/icon_interfaces_mail.png', 'icon')" mode="aspectFit" class="envelope" @error="onIconError"></image>

        <!-- Action Buttons -->
        <view class="button-container">
            <view v-if="imageUrl" class="two-buttons">
                <button class="btn btn-secondary" @tap="handleReset">
                    重新上传
                </button>
                <button class="btn btn-primary" @tap="handleAnalyze">
                    分析图片
                </button>
            </view>
            <view v-else class="upload-buttons">
				<image :src="getOSSUrl('static/icons/圆形 4.png', 'icon')" mode="aspectFit" class="btn circle" @tap="handleUpload" @error="onIconError"></image>
				<image :src="getOSSUrl('static/icons/矩形 1.png', 'upload-bg')" mode="aspectFit" class="btn rectangle" @tap="handleUpload" @error="onIconError"></image>
				<image :src="getOSSUrl('static/icons/箭头 1.png', 'small-icon')" mode="aspectFit" class="btn arrow" @tap="handleUpload" @error="onIconError"></image>
				<image :src="getOSSUrl('static/icons/点击上传图片.png', 'upload-text')" mode="aspectFit" class="word" @tap="handleUpload" @error="onIconError"></image>
            </view>
        </view>
		
		<!-- 添加底部导航栏 -->
		<tab-bar></tab-bar>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import TabBar from '@/components/tabbar.vue';

// ========== 响应式数据 ==========
const imageUrl = ref('')

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
    case 'tiny-icon':
      params = '?x-oss-process=image/resize,m_lfit,w_16,h_16/quality,q_90';
      break;
    case 'avatar':
      params = '?x-oss-process=image/resize,m_lfit,w_80,h_80/quality,q_90';
      break;
    case 'large':
      params = '?x-oss-process=image/resize,m_lfit,w_120,h_120/quality,q_90';
      break;
    case 'medium':
      params = '?x-oss-process=image/resize,m_lfit,w_200,h_200/quality,q_85';
      break;
    case 'banner':
      params = '?x-oss-process=image/resize,m_lfit,w_750,h_400/quality,q_85';
      break;
    case 'post':
      params = '?x-oss-process=image/resize,m_lfit,w_400,h_600/quality,q_85';
      break;
    case 'post-thumb':
      params = '?x-oss-process=image/resize,m_lfit,w_300,h_450/quality,q_80';
      break;
    case 'upload-bg':
      params = '?x-oss-process=image/resize,m_lfit,w_300,h_60/quality,q_85';
      break;
    case 'upload-text':
      params = '?x-oss-process=image/resize,m_lfit,w_150,h_30/quality,q_90';
      break;
    default:
      params = '?x-oss-process=image/resize,m_lfit,w_48,h_48/quality,q_90';
  }
  
  return `${ossConfig.baseUrl}/${cleanFilename}${params}`;
};

// ========== 事件处理函数 ==========

/**
 * 图片上传处理
 */
const handleUpload = () => {
    uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            imageUrl.value = res.tempFilePaths[0]
            
            // 添加上传成功提示
            uni.showToast({
                title: '图片上传成功',
                icon: 'success',
                duration: 1500
            });
        },
        fail: (error) => {
            console.error('图片选择失败:', error);
            uni.showToast({
                title: '图片选择失败',
                icon: 'error',
                duration: 2000
            });
        }
    })
}

/**
 * 重置图片
 */
const handleReset = () => {
    uni.showModal({
        title: '确认重新上传',
        content: '确定要重新选择图片吗？',
        success: (res) => {
            if (res.confirm) {
                imageUrl.value = '';
                uni.showToast({
                    title: '已重置',
                    icon: 'success',
                    duration: 1000
                });
            }
        }
    });
}

/**
 * 分析图片处理
 */
const handleAnalyze = () => {
    if (!imageUrl.value) {
        uni.showToast({
            title: '请先上传图片',
            icon: 'none',
            duration: 2000
        });
        return;
    }
    
    uni.showLoading({
        title: '正在分析图片...'
    });
    
    // TODO: 实现图片分析功能
    console.log('Analyzing image:', imageUrl.value);
    
    // 模拟分析过程
    setTimeout(() => {
        uni.hideLoading();
        
        // 跳转到结果页面或显示分析结果
        uni.navigateTo({
            url: `/pages/AnalysisResult/AnalysisResult?imageUrl=${encodeURIComponent(imageUrl.value)}`
        });
    }, 2000);
}

/**
 * 图标加载失败处理
 * @param {Event} error - 错误事件
 */
const onIconError = (error) => {
  console.warn('图标加载失败:', error);
  // 可以设置默认图标或其他降级处理
};

/**
 * 图片加载失败处理
 * @param {Event} error - 错误事件
 */
const onImageError = (error) => {
  console.warn('图片加载失败:', error);
  // 可以设置默认图片或其他降级处理
};
</script>

<style>
.container {
    padding: 40rpx;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #e6fae9;
    position: relative;
}

.header {
    text-align: left;
    margin-bottom: 60rpx;
    position: absolute;
	left: 137px;
	top: 149px;
	width: 168px;
	height: 81px;
	opacity: 1;
}

.title {
    text-align: left;
    line-height: 2;
    color: #1e873c;
    font-size: 28rpx;
    font-weight: 400;
    display: block;
}

.main-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60rpx;
}

.image-preview {
    width: 100%;
    display: flex;
    justify-content: center;
}

.preview-image {
	position: absolute;
	top: 250px;
    width: 600rpx;
    height: 600rpx;
    border-radius: 20rpx;
    box-shadow: 0 8rpx 32rpx rgba(30, 135, 60, 0.15);
    border: 4rpx solid rgba(30, 135, 60, 0.1);
}

.placeholder {
    padding: 40rpx;
    text-align: center;
	position: absolute;
	left: 51px;
	top: 484px;
	width: 180px;
	height: 36px;
	opacity: 1;
}

.placeholder-text {
    color: #1e873c;
    font-size: 28rpx;
	white-space: nowrap;
    font-weight: 400;
    letter-spacing: 0px;
    line-height: 26.06px;
}

.static-images {
    position: absolute;
	left: 14px;
	top: 185px;
    width: 50.33px;
    height: 41.99px;
	z-index: 10;
}

.image-0 {
	position: absolute;
	left: 35.17px;
	top: 26.41px;
    width: 4px;
    height: 4px;
}

.image-1 {
	position: absolute;
	left: 20.17px;
	top: 0px;
    width: 15.96px;
    height: 21px;
}

.image-2 {
	position: absolute;
	left: 0px;
	top: 4px;
    width: 50.33px;
    height: 37.99px;
}

.envelope {
	position: absolute;
	left: 44px;
	top: 205px;
	width: 46.25px;
	height: 41.49px;
	opacity: 1;
	transform: rotate(19.88deg);
    transition: all 0.3s ease;
}

.envelope:hover {
    transform: rotate(19.88deg) scale(1.1);
}

.button-container {
	position: absolute;
	left: 0px;
	top: 549.59px;
    width: 100%;
    justify-content: center;
    padding: 20rpx;
}

.two-buttons {
    display: flex;
    gap: 30rpx;
    justify-content: center;
    align-items: center;
}

.upload-buttons {
    position: relative;
    width: 100%;
    height: 60px;
}

.btn {
    padding: 20rpx 40rpx;
    border-radius: 100rpx;
    font-size: 28rpx;
    transition: all 0.3s ease;
    border: none;
    outline: none;
}

.btn:active {
    transform: scale(0.95);
}

.btn-primary {
	position: absolute;
	left: 60px;
	top: 10px;
    background-color: #059669;
    color: white;
    box-shadow: 0 4rpx 16rpx rgba(5, 150, 105, 0.3);
}

.btn-primary:active {
    background-color: #047857;
    box-shadow: 0 2rpx 8rpx rgba(5, 150, 105, 0.4);
}

.btn-secondary {
	position: absolute;
	left: 230px;
	top: 10px;
    background-color: #f3f4f6;
    color: #1f2937;
    border: 2rpx solid #e5e7eb;
}

.btn-secondary:active {
    background-color: #e5e7eb;
    border-color: #d1d5db;
}

.rectangle {
	position: absolute;
	left: 40px;
	top: 0px;
	width: 265px;
	height: 57px;
	z-index: 1;
    transition: all 0.3s ease;
}

.circle {
	position: absolute;
	left: 55px;
	top: 12px;
	width: 36px;
	height: 36px;
	opacity: 1;
	z-index: 2;
    transition: all 0.3s ease;
}

.arrow {
	position: absolute;
	left: 60.5px;
	top: 0px;
	width: 26.02px;
	height: 60px;
	opacity: 1;
	z-index: 3;
    transition: all 0.3s ease;
}

.word {
	position: absolute;
	left: 133px;
	top: 25px;
	width: 124px;
	height: 25px;
	opacity: 1;
	z-index: 4;
    transition: all 0.3s ease;
}

/* 上传按钮组合的悬停效果 */
.upload-buttons:active .rectangle {
    transform: scale(0.98);
    opacity: 0.9;
}

.upload-buttons:active .circle {
    transform: scale(0.95);
}

.upload-buttons:active .arrow {
    transform: translateX(5px);
}

.upload-buttons:active .word {
    transform: scale(0.98);
    opacity: 0.8;
}

/* 响应式适配 */
@media screen and (max-width: 750rpx) {
    .header {
        left: 100px;
        top: 120px;
        width: 150px;
    }
    
    .title {
        font-size: 26rpx;
        line-height: 1.8;
    }
    
    .preview-image {
        top: 200px;
        width: 500rpx;
        height: 500rpx;
    }
    
    .placeholder {
        left: 30px;
        top: 400px;
        width: 200px;
    }
    
    .placeholder-text {
        font-size: 26rpx;
    }
    
    .static-images {
        left: 10px;
        top: 160px;
    }
    
    .envelope {
        left: 35px;
        top: 180px;
        width: 40px;
        height: 35px;
    }
    
    .button-container {
        top: 480px;
    }
    
    .rectangle {
        left: 30px;
        width: 240px;
        height: 50px;
    }
    
    .circle {
        left: 45px;
        top: 10px;
        width: 32px;
        height: 32px;
    }
    
    .arrow {
        left: 50px;
        top: -2px;
        width: 24px;
        height: 55px;
    }
    
    .word {
        left: 120px;
        top: 22px;
        width: 110px;
        height: 22px;
    }
    
    .btn-primary {
        left: 40px;
        top: 8px;
        padding: 16rpx 32rpx;
        font-size: 26rpx;
    }
    
    .btn-secondary {
        left: 200px;
        top: 8px;
        padding: 16rpx 32rpx;
        font-size: 26rpx;
    }
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
    .container {
        background-color: #064e3b;
    }
    
    .title {
        color: #a7f3d0;
    }
    
    .placeholder-text {
        color: #a7f3d0;
    }
    
    .btn-primary {
        background-color: #047857;
    }
    
    .btn-secondary {
        background-color: #374151;
        color: #f9fafb;
        border-color: #4b5563;
    }
    
    .preview-image {
        border-color: rgba(167, 243, 208, 0.2);
        box-shadow: 0 8rpx 32rpx rgba(6, 78, 59, 0.3);
    }
}

/* 动画效果 */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30rpx);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.image-preview {
    animation: fadeInUp 0.6s ease-out;
}

.two-buttons {
    animation: fadeInUp 0.6s ease-out 0.2s both;
}

/* 提升用户体验的加载效果 */
.preview-image {
    opacity: 0;
    transition: opacity 0.3s ease;
}

.preview-image[src] {
    opacity: 1;
}
</style>