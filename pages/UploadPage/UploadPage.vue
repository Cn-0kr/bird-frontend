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
                <image :src="imageUrl" mode="aspectFit" class="preview-image"></image>
            </view>
            <view v-else class="placeholder">
                <text class="placeholder-text">请选择可以清晰地观察到的鸟的照片喵~</text>
            </view>
        </view>
       
	    <!-- Static Images -->
	    <view class="static-images">
	        <image src="@/static/icons/ellipse-48.png" mode="aspectFit" class="image-0"></image>
	        <image src="@/static/icons/route-105.png" mode="aspectFit" class="image-1"></image>
	        <image src="@/static/icons/route-106.png" mode="aspectFit" class="image-2"></image>
	    </view>
		
		<image src="@/static/icons/icon_interfaces_mail.png" mode="aspectFit" class="envelope"></image>

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
				<image src="@/static/icons/圆形 4.png" mode="aspectFit" class="btn circle" @tap="handleUpload"></image>
				<image src="@/static/icons/矩形 1.png" mode="aspectFit" class="btn rectangle" @tap="handleUpload"></image>
				<image src="@/static/icons/箭头 1.png" mode="aspectFit" class="btn arrow" @tap="handleUpload"></image>
				<image src="@/static/icons/点击上传图片.png" mode="aspectFit" class="word" @tap="handleUpload"></image>
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
    /* align-items: center; */
    background-color: #e6fae9;
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
    text-align: left; /* 设置文字左对齐 */
    line-height: 2; /* 设置行高以增加行间距 */
    color: #1e873c;
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
	/** 文本1 */
	font-size: 18px;
	font-weight: 400;
	letter-spacing: 0px;
	line-height: 26.06px;
	color: #1e873c;
	text-align: left;
	vertical-align: top;

}

.placeholder-text {
    color: #1e873c;
    font-size: 28rpx;
	white-space: nowrap;
}

.static-images {
    position: absolute;
	left: 14px;
	top: 185px;
    width: 50.33px;
    height: 41.99px; /* 根据需要调整高度 */
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

.envelope{
	position: absolute;
	left: 44px;
	top: 205px;
	width: 46.25px;
	height: 41.49px;
	opacity: 1;
	transform: rotate(19.88deg);
}

.button-container {
	position: absolute;
	left: 0px;
	top: 549.59px;
    width: 100%;
    /* display: flex; */
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
	position: absolute;
	left:60px;
	top: 10px;
    background-color: #059669;
    color: white;

}

.btn-secondary {
	position: absolute;
	left:230px;
	top: 10px;
    background-color: #f3f4f6;
    color: #1f2937;
}

.rectangle{
	position: absolute;
	left:40px;
	top: 0px;
	/* background-color: #059669; */
	color: white;
	width: 265px;
	height: 57px;
	z-index: 1;
}

.circle{
	position: absolute;
	left: 55px;
	top: 12px;
	width: 36px;
	height: 36px;
	opacity: 1;
	z-index: 2;
}

.arrow{
	position: absolute;
	left: 60.5px;
	top: 0px;
	width: 26.02px;
	height: 60px;
	opacity: 1;
	z-index: 3;

}

.word{
	position: absolute;
	left: 133px;
	top: 25px;
	width: 124px;
	height: 25px;
	opacity: 1;
	z-index: 4;
}


</style>