<template>
	<view class="poster-container">
		<!-- 顶部返回栏 -->
		<view class="top-bar">
			<view class="back-btn" @click="goBack">
				<text>返回</text>
			</view>
		</view>
		
		<!-- 帖子内容 -->
		<view class="poster-content" v-if="posterData">
			<image :src="posterData.imageUrl" mode="widthFix" class="poster-image"></image>
			
			<view class="info-section">
				<view class="description">
					{{ posterData.description }}
				</view>

				<!-- 添加点赞区域 -->
				<view class="interaction-bar">
					<view class="like-btn" @click="handleLike">
						<text class="like-count" :class="{ 'liked': posterData.isLiked }">
							{{ posterData.likes }}
						</text>
						<text class="like-text" :class="{ 'liked': posterData.isLiked }">
							{{ posterData.isLiked ? '已点赞' : '点赞' }}
						</text>
					</view>
				</view>

				<!-- 评论列表 -->
				<view class="comments-section">
					<text class="section-title">评论 ({{ comments.length }})</text>
					<view class="comments-list">
						<view v-for="comment in comments" :key="comment.id" class="comment-item">
							<text class="comment-text">{{ comment.content }}</text>
						</view>
					</view>
				</view>
			</view>
		</view>

		<!-- 底部评论输入框 -->
		<view class="comment-input-container">
			<input 
				type="text" 
				v-model="newComment"
				placeholder="写下你的评论..." 
				class="comment-input"
			/>
			<button class="send-btn" @click="submitComment">发送</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			posterData: null,
			comments: [],
			newComment: ''
		}
	},
	
	onLoad(options) {
		if (options.postId) {
			this.fetchPosterData(options.postId);
		}
	},
	
	methods: {
		fetchPosterData(postId) {
			this.posterData = {
				id: postId,
				imageUrl: '/static/posts/bird1.jpg',
				description: '今天在公园拍到的小鸟，真的太可爱了！',
				likes: 0,        // 添加点赞数
				isLiked: false   // 添加点赞状态
			};
			
			// 初始化评论数据
			this.comments = [
				{
					id: 1,
					content: '这只鸟太漂亮了！'
				},
				{
					id: 2,
					content: '看起来是一只知更鸟呢'
				}
			];
		},
		
		goBack() {
			uni.navigateBack({
				delta: 1
			});
		},
		
		submitComment() {
			if (!this.newComment.trim()) {
				uni.showToast({
					title: '请输入评论内容',
					icon: 'none'
				});
				return;
			}
			
			this.comments.unshift({
				id: this.comments.length + 1,
				content: this.newComment.trim()
			});
			
			this.newComment = '';
			
			uni.showToast({
				title: '评论成功',
				icon: 'success'
			});
		},

		// 添加点赞处理方法
		handleLike() {
			if (this.posterData) {
				this.posterData.isLiked = !this.posterData.isLiked;
				this.posterData.likes += this.posterData.isLiked ? 1 : -1;
				
				uni.showToast({
					title: this.posterData.isLiked ? '点赞成功' : '已取消点赞',
					icon: 'none'
				});
			}
		}
	}
}
</script>

<style scoped>
.poster-container {
	min-height: 100vh;
	background-color: #FFF9E9;
	padding-bottom: 60px;
}

.top-bar {
	padding: 16px;
	background-color: #FFF9E9;
	border-bottom: 1px solid #eee;
}

.back-btn {
	padding: 8px 12px;
	background: #fff;
	border-radius: 4px;
	width: fit-content;
}

.poster-content {
	padding: 16px;
}

.poster-image {
	width: 100%;
	border-radius: 12px;
}

.info-section {
	margin-top: 16px;
}

.description {
	margin: 12px 0;
	line-height: 1.5;
}

.comments-section {
	margin-top: 20px;
	border-top: 1px solid #eee;
	padding-top: 16px;
}

.section-title {
	font-size: 16px;
	font-weight: bold;
	margin-bottom: 16px;
}

.comment-item {
	padding: 12px 0;
	border-bottom: 1px solid #eee;
}

.comment-text {
	font-size: 14px;
	color: #333;
}

.comment-input-container {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	padding: 12px;
	background: white;
	border-top: 1px solid #eee;
}

.comment-input {
	flex: 1;
	height: 36px;
	padding: 0 12px;
	border-radius: 18px;
	background: #f5f5f5;
	margin-right: 8px;
}

.send-btn {
	padding: 0 16px;
	background: #2EA3B7;
	color: white;
	border-radius: 18px;
	font-size: 14px;
	line-height: 36px;
}

/* 添加点赞相关样式 */
.interaction-bar {
	display: flex;
	justify-content: flex-end;
	padding: 12px 0;
	border-bottom: 1px solid #eee;
}

.like-btn {
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 6px 12px;
	border-radius: 16px;
	background: #f5f5f5;
	cursor: pointer;
}

.like-count {
	font-size: 14px;
	color: #666;
}

.like-text {
	font-size: 14px;
	color: #666;
}

.liked {
	color: #ff6b6b;
}
</style>
