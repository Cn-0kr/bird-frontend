<template>
    <view class="container">
        <!-- Header Section -->
        <view class="header">
            <text class="title">Bird Species Identifier</text>
            <text class="subtitle">Upload a photo of any bird and our AI will help identify its species</text>
        </view>

        <!-- Main Content -->
        <view class="main-content">
            <view v-if="imageUrl" class="image-preview">
                <image :src="imageUrl" mode="aspectFit" class="preview-image"></image>
            </view>
            <view v-else class="placeholder">
                <text class="placeholder-text">Select a clear photo where the bird is easily visible</text>
            </view>
        </view>

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
            <view v-else>
                <button class="btn btn-primary" @tap="handleUpload">
                    点击上传图片
                </button>
            </view>
        </view>
		
		<!-- 添加底部导航栏 -->
		<tab-bar></tab-bar>
    </view>
</template>

<script setup>
import { ref } from 'vue'
import TabBar from '@/components/tabbar.vue';
const imageUrl = ref('')

const handleUpload = () => {
    uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: (res) => {
            imageUrl.value = res.tempFilePaths[0]
        }
    })
}

const handleReset = () => {
    imageUrl.value = ''
}

const handleAnalyze = () => {
    // TODO: Implement image analysis functionality
    console.log('Analyzing image:', imageUrl.value)
}
</script>

<style>
.container {
    padding: 40rpx;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fffbeb;
}

.header {
    text-align: center;
    margin-bottom: 60rpx;
}

.title {
    font-size: 36rpx;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 20rpx;
}

.subtitle {
    font-size: 28rpx;
    color: #4b5563;
    max-width: 600rpx;
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
    width: 600rpx;
    height: 600rpx;
    border-radius: 20rpx;
}

.placeholder {
    padding: 40rpx;
    text-align: center;
}

.placeholder-text {
    color: #4b5563;
    font-size: 28rpx;
}

.button-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 20rpx;
}

.two-buttons {
    display: flex;
    gap: 30rpx;
}

.btn {
    padding: 20rpx 40rpx;
    border-radius: 100rpx;
    font-size: 28rpx;
}

.btn-primary {
    background-color: #059669;
    color: white;
}

.btn-secondary {
    background-color: #f3f4f6;
    color: #1f2937;
}
</style>