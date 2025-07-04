<template>
  <view class="profile-container">
    <!-- 顶部个人信息区 -->
    <view class="profile-header">
      <view class="header-content">
        <view class="avatar-section" @click="handleAvatarClick">
          <!-- 直接使用拼接的OSS URL -->
          <image 
            :src="userAvatarUrl" 
            class="avatar"
            mode="aspectFill"
            @error="handleAvatarError"
          />
          <view class="edit-hint">点击修改</view>
        </view>
        
        <view class="user-info">
          <view class="nickname-row">
            <text class="nickname">{{ userInfo.nickname }}</text>
            <view class="edit-btn" @click="handleEditProfile">
              <!-- 直接使用拼接的OSS URL -->
              <image 
                :src="editIconUrl" 
                class="edit-icon"
                alt="编辑"
              />
            </view>
          </view>
          
          <view class="bio" @click="handleEditBio">
            {{ userInfo.bio || '点击添加个人介绍...' }}
          </view>

          <!-- 统计信息 -->
          <view class="stats">
            <view class="stat-item">
              <text class="stat-num">{{ userInfo.postsCount }}</text>
              <text class="stat-label">发布</text>
            </view>
            <view class="stat-item">
              <text class="stat-num">{{ userInfo.likesCount }}</text>
              <text class="stat-label">获赞</text>
            </view>
            <view class="stat-item">
              <text class="stat-num">{{ userInfo.level }}</text>
              <text class="stat-label">等级</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 成就展示 -->
      <scroll-view scroll-x class="achievements" :show-scrollbar="false">
        <view 
          v-for="achievement in achievements" 
          :key="achievement.id" 
          class="achievement-item"
        >
          <!-- 直接使用拼接的OSS URL -->
          <image 
            :src="getOSSUrl(achievement.icon)" 
            class="achievement-icon"
          />
          <text class="achievement-name">{{ achievement.name }}</text>
        </view>
      </scroll-view>
    </view>

    <!-- 内容分类标签页 -->
    <view class="content-tabs">
      <view 
        class="tab-item" 
        :class="{ active: activeTab === 'posts' }"
        @click="switchTab('posts')"
      >
        历史发布
      </view>
      <view 
        class="tab-item"
        :class="{ active: activeTab === 'likes' }"
        @click="switchTab('likes')"
      >
        我的点赞
      </view>
      <view 
        class="tab-item"
        :class="{ active: activeTab === 'records' }"
        @click="switchTab('records')"
      >
        识别记录
      </view>
    </view>

    <!-- 瀑布流内容区域 -->
    <view class="content-area">
      <view v-if="isLoading" class="loading">
        <view class="loading-spinner"></view>
        <text>加载中...</text>
      </view>
      <view v-else-if="currentContent.length === 0" class="empty-hint">
        <view class="empty-icon">📷</view>
        <text class="empty-text">
          {{ activeTab === 'posts' 
              ? '还没有发布过内容~' 
              : activeTab === 'likes' 
                ? '还没有点赞过内容~'
                : '还没有识别过哦~' }}
        </text>
      </view>
      <view v-else class="waterfall">
        <view class="column">
          <home-poster
            v-for="poster in leftColumn"
            :key="poster.id"
            :poster-data="poster"
          ></home-poster>
        </view>
        <view class="column">
          <home-poster
            v-for="poster in rightColumn"
            :key="poster.id"
            :poster-data="poster"
          ></home-poster>
        </view>
      </view>
    </view>
	
    <!-- 添加底部导航栏 -->
    <tab-bar></tab-bar>
  </view>
</template>

<script>
import TabBar from '@/components/tabbar.vue';
import HomePoster from '../../components/homeposter.vue';
import { UserService } from '@/api/services/user';

const userService = new UserService();

export default {
  components: {
    HomePoster,
    TabBar
  },

  data() {
    return {
      isLoading: false,
      activeTab: 'posts',
      // OSS配置
      ossConfig: {
        baseUrl: 'https://birdfront-oss.oss-cn-shanghai.aliyuncs.com',
        defaultParams: '?x-oss-process=image/resize,m_lfit,w_300,h_300/quality,q_80'
      },
      userInfo: {
        avatar: 'static/default-avatar.png', // 不要以斜杠开头
        nickname: '鸟类爱好者',
        bio: '',
        postsCount: 0,
        likesCount: 0, 
        level: 1
      },
      achievements: [
        {
          id: 1,
          name: '初级观鸟员',
          icon: 'static/icons/achievements/beginner.png'
        },
        {
          id: 2, 
          name: '摄影新手',
          icon: 'static/icons/achievements/photographer.png'
        }
      ],
      posts: [],
      likes: [],
      records: [],
      leftColumn: [],
      rightColumn: []
    }
  },

  computed: {
    currentContent() {
      switch(this.activeTab) {
        case 'posts':
          return this.posts;
        case 'likes':
          return this.likes;
        case 'records':
          return this.records;
        default:
          return [];
      }
    },
    
    // 用户头像URL
    userAvatarUrl() {
      return this.getOSSUrl(this.userInfo.avatar, 'small')
    },
    
    // 编辑图标URL
    editIconUrl() {
      return this.getOSSUrl('static/icons/edit.png', 'icon')
    }
  },

  async onLoad() {
    await this.loadUserInfo();
    this.loadContent();
  },

  methods: {
    /**
     * 获取OSS图片URL - 简化版本
     * @param {string} filename - 文件名
     * @param {string} size - 尺寸类型
     * @returns {string} 完整的OSS URL
     */
    getOSSUrl(filename, size = 'medium') {
      if (!filename) {
        return `${this.ossConfig.baseUrl}/static/default-avatar.png${this.ossConfig.defaultParams}`
      }
      
      // 确保文件名不以斜杠开头
      const cleanFilename = filename.startsWith('/') ? filename.slice(1) : filename
      
		let params = ''
		switch(size) {
		  case 'icon': params = '?x-oss-process=image/resize,m_lfit,w_50,h_50/quality,q_90'; break
		  case 'small': params = '?x-oss-process=image/resize,m_lfit,w_150,h_150/quality,q_90'; break
		  case 'medium': params = '?x-oss-process=image/resize,m_lfit,w_300,h_300/quality,q_80'; break
		  case 'large': params = '?x-oss-process=image/resize,m_lfit,w_600,h_600/quality,q_85'; break
		}
	  
      return `${this.ossConfig.baseUrl}/${cleanFilename}${params}`
    },

    /**
     * 加载用户信息
     */
    async loadUserInfo() {
      try {
        const intro = await userService.getIntro();
        this.userInfo.bio = intro || '点击添加个人介绍...';
      } catch (error) {
        console.error('Failed to load user info:', error);
        uni.showToast({
          title: '加载个人信息失败',
          icon: 'none'
        });
      }
    },

    /**
     * 处理头像点击事件
     */
    handleAvatarClick() {
      uni.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album', 'camera'],
        success: async (res) => {
          try {
            // 这里应该上传到OSS
            // const uploadResult = await this.uploadToOSS(res.tempFilePaths[0]);
            // this.userInfo.avatar = uploadResult.fileName;
            
            // 临时使用时间戳模拟上传
            this.userInfo.avatar = `avatars/user_${Date.now()}.jpg`;
            
            uni.showToast({
              title: '头像更新成功',
              icon: 'success'
            });
          } catch (error) {
            console.error('头像上传失败:', error);
            uni.showToast({
              title: '头像上传失败',
              icon: 'none'
            });
          }
        }
      });
    },

    /**
     * 处理头像加载错误
     */
    handleAvatarError() {
      console.warn('头像加载失败，使用默认头像');
      // 直接设置为默认头像的完整OSS URL
      this.userInfo.avatar = 'static/default-avatar.png';
    },

    /**
     * 编辑个人资料
     */
    handleEditProfile() {
      uni.navigateTo({
        url: '/pages/EditProfile/EditProfile'
      });
    },

    /**
     * 编辑个人介绍
     */
    handleEditBio() {
      uni.showModal({
        title: '编辑个人介绍',
        editable: true,
        content: this.userInfo.bio === '点击添加个人介绍...' ? '' : this.userInfo.bio,
        success: (res) => {
          if (res.confirm) {
            this.updateBio(res.content);
          }
        }
      });
    },

    /**
     * 更新个人介绍
     */
    async updateBio(newBio) {
      try {
        // await userService.updateIntro(newBio);
        this.userInfo.bio = newBio || '点击添加个人介绍...';
        
        uni.showToast({
          title: '更新成功',
          icon: 'success'
        });
      } catch (error) {
        console.error('Failed to update bio:', error);
        uni.showToast({
          title: '更新失败',
          icon: 'none'
        });
      }
    },

    /**
     * 切换标签页
     */
    switchTab(tab) {
      if (this.activeTab !== tab) {
        this.activeTab = tab;
        this.loadContent();
      }
    },

    /**
     * 加载内容数据
     */
    async loadContent() {
      this.isLoading = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let data;
        
        switch(this.activeTab) {
          case 'posts':
            data = [
              {
                id: 1,
                imageUrl: 'static/posts/bird1.jpg',
                imageHeight: 200,
                description: '今天拍到的小鸟',
                views: 1234,
                likes: 88
              }
            ];
            this.posts = data;
            break;
            
          case 'likes':
            data = [
              {
                id: 2,
                imageUrl: 'static/posts/bird2.jpg',
                imageHeight: 280,
                description: '好漂亮的鸟儿！',
                views: 2567,
                likes: 189
              }
            ];
            this.likes = data;
            break;
            
          case 'records':
            data = [
              {
                id: 3,
                imageUrl: 'static/recognition/bird1.jpg',
                imageHeight: 240,
                description: '识别结果：红头长尾山雀',
                accuracy: '98%',
                date: '2024-03-20'
              },
              {
                id: 5,
                imageUrl: 'static/recognition/bird2.jpg',
                imageHeight: 220,
                description: '识别结果：白头硬尾鹎',
                accuracy: '97%',
                date: '2024-03-18'
              }
            ];
            this.records = data;
            break;
        }
        
        this.distributeContent();
        
      } catch (error) {
        console.error('Load content error:', error);
        uni.showToast({
          title: '加载失败',
          icon: 'none'
        });
      } finally {
        this.isLoading = false;
      }
    },

    /**
     * 分发内容到左右列（瀑布流布局）
     */
    distributeContent() {
      this.leftColumn = [];
      this.rightColumn = [];
      
      this.currentContent.forEach((item, index) => {
        if (index % 2 === 0) {
          this.leftColumn.push(item);
        } else {
          this.rightColumn.push(item);
        }
      });
    }
  }
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background-color: #FFF9E9;
}

.profile-header {
  padding: 20px 16px;
  background: #FFFFFF;
  border-radius: 0 0 16px 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  align-items: flex-start;
}

.avatar-section {
  position: relative;
  margin-right: 16px;
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid #2EA3B7;
}

.edit-hint {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(46, 163, 183, 0.8);
  color: white;
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 8px;
}

.user-info {
  flex: 1;
}

.nickname-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.nickname {
  font-size: 20px;
  font-weight: bold;
  color: #1D1D2B;
  margin-right: 8px;
}

.edit-icon {
  width: 16px;
  height: 16px;
}

.bio {
  font-size: 14px;
  color: #666;
  margin-bottom: 12px;
  line-height: 1.4;
}

.stats {
  display: flex;
  margin-top: 12px;
}

.stat-item {
  margin-right: 24px;
  text-align: center;
}

.stat-num {
  font-size: 18px;
  font-weight: bold;
  color: #1D1D2B;
  display: block;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.achievements {
  margin-top: 16px;
  white-space: nowrap;
}

.achievement-item {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  margin-right: 16px;
}

.achievement-icon {
  width: 40px;
  height: 40px;
  margin-bottom: 4px;
}

.achievement-name {
  font-size: 12px;
  color: #666;
}

.content-tabs {
  display: flex;
  background: #FFFFFF;
  padding: 12px 16px;
  margin: 12px 0;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  color: #666;
  position: relative;
}

.tab-item.active {
  color: #2EA3B7;
  font-weight: bold;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: #2EA3B7;
  border-radius: 1px;
}

.content-area {
  padding: 12px;
}

.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 0;
  color: #999;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #2EA3B7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 12px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-hint {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.5;
}

.empty-text {
  font-size: 14px;
  line-height: 1.5;
}

.waterfall {
  display: flex;
  justify-content: space-between;
}

.column {
  width: 48%;
}

.achievement-item:nth-child(1) .achievement-name {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 13px;
  font-weight: 600;
  background: linear-gradient(45deg, #4A90E2, #9B59B6);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 1px;
}

.achievement-item:nth-child(2) .achievement-name {
  font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
  font-size: 13px;
  font-weight: 600;
  background: linear-gradient(45deg, #E74C3C, #F1C40F);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  letter-spacing: 1px;
}
</style>