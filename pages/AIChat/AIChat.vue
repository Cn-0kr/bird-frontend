<template>
    <view class="ai-chat-container">
      <!-- 自定义导航栏 -->
      <view class="custom-navbar">
        <view class="navbar-left" @click="goBack">
          <image src="/static/icons/back.png" class="back-icon"></image>
        </view>
        <view class="navbar-center">
          <view class="ai-avatar-wrapper">
            <image src="/static/icons/ai-avatar.png" class="ai-avatar"></image>
            <view 
              class="status-indicator" 
              :class="{ 'status-online': isAIOnline, 'status-typing': isAITyping }"
            ></view>
          </view>
          <view class="ai-info">
            <text class="ai-name">鸟类智能助手</text>
            <text class="ai-status">{{ getAIStatus() }}</text>
          </view>
        </view>
        <view class="navbar-right">
          <view class="menu-btn" @click="showMenu">
            <image src="/static/icons/menu.png" class="menu-icon"></image>
          </view>
        </view>
      </view>
  
      <!-- 消息列表 -->
      <scroll-view 
        class="message-list"
        scroll-y
        :scroll-top="scrollTop"
        :enable-back-to-top="true"
        :scroll-with-animation="true"
        @scrolltoupper="onScrollToUpper"
      >
        <!-- 欢迎消息 -->
        <view v-if="messageList.length === 0" class="welcome-section">
          <view class="welcome-card">
            <image src="/static/icons/ai-welcome.png" class="welcome-icon"></image>
            <text class="welcome-title">欢迎来到鸟类智能助手！</text>
            <text class="welcome-subtitle">我可以帮助您解答关于鸟类的任何问题</text>
            <view class="suggestion-buttons">
              <view 
                v-for="suggestion in quickSuggestions" 
                :key="suggestion.id"
                class="suggestion-btn"
                @click="sendSuggestion(suggestion)"
              >
                <image :src="suggestion.icon" class="suggestion-icon"></image>
                <text class="suggestion-text">{{ suggestion.text }}</text>
              </view>
            </view>
          </view>
        </view>
  
        <!-- 消息项 -->
        <view 
          v-for="(message, index) in messageList" 
          :key="message.id"
          class="message-item"
          :class="{ 'message-user': message.type === 'user', 'message-ai': message.type === 'ai' }"
          :style="{ 'animation-delay': `${index * 0.1}s` }"
        >
          <!-- AI消息 -->
          <view v-if="message.type === 'ai'" class="ai-message-wrapper">
            <image src="/static/icons/ai-avatar.png" class="message-avatar"></image>
            <view class="message-content">
              <view class="message-bubble ai-bubble">
                <!-- 打字动画 -->
                <view v-if="message.isTyping" class="typing-indicator">
                  <view class="typing-dot"></view>
                  <view class="typing-dot"></view>
                  <view class="typing-dot"></view>
                </view>
                <!-- 文本内容 -->
                <rich-text 
                  v-else 
                  :nodes="formatMessageContent(message.content)"
                  class="message-text"
                ></rich-text>
                <!-- 消息工具栏 -->
                <view v-if="!message.isTyping" class="message-toolbar">
                  <view class="toolbar-btn" @click="copyMessage(message)">
                    <image src="/static/icons/copy.png" class="toolbar-icon"></image>
                  </view>
                  <view class="toolbar-btn" @click="likeMessage(message)">
                    <image 
                      :src="message.isLiked ? '/static/icons/like-filled.png' : '/static/icons/like.png'" 
                      class="toolbar-icon"
                    ></image>
                  </view>
                  <view class="toolbar-btn" @click="shareMessage(message)">
                    <image src="/static/icons/share.png" class="toolbar-icon"></image>
                  </view>
                </view>
              </view>
              <text class="message-time">{{ formatTime(message.timestamp) }}</text>
            </view>
          </view>
  
          <!-- 用户消息 -->
          <view v-else class="user-message-wrapper">
            <view class="message-content">
              <view class="message-bubble user-bubble">
                <text class="message-text">{{ message.content }}</text>
              </view>
              <text class="message-time">{{ formatTime(message.timestamp) }}</text>
            </view>
            <image src="/static/icons/user-avatar.png" class="message-avatar"></image>
          </view>
        </view>
  
        <!-- 加载更多消息 -->
        <view v-if="hasMoreMessages" class="load-more-section">
          <view class="load-more-btn" @click="loadMoreMessages">
            <image src="/static/icons/loading.png" class="load-more-icon"></image>
            <text class="load-more-text">加载更多消息</text>
          </view>
        </view>
      </scroll-view>
  
      <!-- 输入区域 -->
      <view class="input-section">
        <!-- 快速回复 -->
        <view v-if="quickReplies.length > 0" class="quick-replies">
          <scroll-view class="quick-reply-scroll" scroll-x>
            <view class="quick-reply-container">
              <view 
                v-for="reply in quickReplies" 
                :key="reply.id"
                class="quick-reply-item"
                @click="sendQuickReply(reply)"
              >
                <text class="quick-reply-text">{{ reply.text }}</text>
              </view>
            </view>
          </scroll-view>
        </view>
  
        <!-- 输入框区域 -->
        <view class="input-wrapper">
          <view class="input-container">
            <view class="extra-actions">
              <view class="action-btn voice-btn" @click="startVoiceInput">
                <image src="/static/icons/voice.png" class="action-icon"></image>
              </view>
              <view class="action-btn image-btn" @click="selectImage">
                <image src="/static/icons/image.png" class="action-icon"></image>
              </view>
            </view>
            
            <textarea 
              v-model="inputText"
              placeholder="输入您想了解的鸟类问题..."
              placeholder-class="input-placeholder"
              class="text-input"
              :auto-height="true"
              :maxlength="500"
              @input="onInputChange"
              @focus="onInputFocus"
              @blur="onInputBlur"
              @confirm="sendMessage"
            ></textarea>
            
            <view 
              class="send-btn"
              :class="{ 'send-btn-active': canSend }"
              @click="sendMessage"
            >
              <image 
                :src="canSend ? '/static/icons/send-active.png' : '/static/icons/send.png'" 
                class="send-icon"
              ></image>
            </view>
          </view>
          
          <!-- 字数统计 -->
          <view v-if="inputText.length > 0" class="char-count">
            <text class="char-count-text">{{ inputText.length }}/500</text>
          </view>
        </view>
      </view>
  
      <!-- 语音输入遮罩 -->
      <view v-if="isVoiceRecording" class="voice-modal">
        <view class="voice-content">
          <view class="voice-animation">
            <view class="voice-circle" :class="{ 'voice-active': isRecording }"></view>
            <image src="/static/icons/microphone.png" class="voice-icon"></image>
          </view>
          <text class="voice-text">{{ voiceText }}</text>
          <view class="voice-actions">
            <view class="voice-cancel" @click="cancelVoiceInput">取消</view>
            <view class="voice-confirm" @click="confirmVoiceInput">确认</view>
          </view>
        </view>
      </view>
    </view>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, nextTick, watch } from 'vue';
  
  // ========== 响应式数据 ==========
  const inputText = ref('');
  const messageList = ref([]);
  const isAIOnline = ref(true);
  const isAITyping = ref(false);
  const scrollTop = ref(0);
  const hasMoreMessages = ref(false);
  const isInputFocused = ref(false);
  const isVoiceRecording = ref(false);
  const isRecording = ref(false);
  const voiceText = ref('正在录音...');
  const quickReplies = ref([]);
  
  // ========== 快速建议数据 ==========
  const quickSuggestions = ref([
    {
      id: 1,
      text: '鸟类识别',
      icon: '/static/icons/identify.png'
    },
    {
      id: 2,
      text: '鸟类习性',
      icon: '/static/icons/behavior.png'
    },
    {
      id: 3,
      text: '观鸟指南',
      icon: '/static/icons/guide.png'
    },
    {
      id: 4,
      text: '保护知识',
      icon: '/static/icons/protection.png'
    }
  ]);
  
  // ========== 计算属性 ==========
  
  /**
   * 是否可以发送消息
   */
  const canSend = computed(() => {
    return inputText.value.trim().length > 0 && !isAITyping.value;
  });
  
  // ========== 事件处理函数 ==========
  
  /**
   * 返回上一页
   */
  const goBack = () => {
    uni.navigateBack();
  };
  
  /**
   * 显示菜单
   */
  const showMenu = () => {
    uni.showActionSheet({
      itemList: ['清空聊天记录', '导出聊天记录', '设置'],
      success: (res) => {
        switch (res.tapIndex) {
          case 0:
            clearChatHistory();
            break;
          case 1:
            exportChatHistory();
            break;
          case 2:
            openSettings();
            break;
        }
      }
    });
  };
  
  /**
   * 获取AI状态文本
   */
  const getAIStatus = () => {
    if (isAITyping.value) return '正在输入...';
    if (isAIOnline.value) return '在线';
    return '离线';
  };
  
  /**
   * 输入变化处理
   */
  const onInputChange = () => {
    // 可以在这里实现实时搜索建议等功能
  };
  
  /**
   * 输入框聚焦
   */
  const onInputFocus = () => {
    isInputFocused.value = true;
    scrollToBottom();
  };
  
  /**
   * 输入框失焦
   */
  const onInputBlur = () => {
    isInputFocused.value = false;
  };
  
  /**
   * 滚动到顶部加载更多
   */
  const onScrollToUpper = () => {
    if (hasMoreMessages.value) {
      loadMoreMessages();
    }
  };
  
  /**
   * 发送消息
   */
  const sendMessage = async () => {
    if (!canSend.value) return;
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputText.value.trim(),
      timestamp: new Date()
    };
    
    // 添加用户消息
    messageList.value.push(userMessage);
    
    // 清空输入框
    const currentInput = inputText.value.trim();
    inputText.value = '';
    
    // 滚动到底部
    await nextTick();
    scrollToBottom();
    
    // 发送到AI
    await sendToAI(currentInput);
  };
  
  /**
   * 发送快速建议
   */
  const sendSuggestion = (suggestion) => {
    inputText.value = suggestion.text;
    sendMessage();
  };
  
  /**
   * 发送快速回复
   */
  const sendQuickReply = (reply) => {
    inputText.value = reply.text;
    sendMessage();
  };
  
  /**
   * 开始语音输入
   */
  const startVoiceInput = () => {
    isVoiceRecording.value = true;
    isRecording.value = true;
    voiceText.value = '正在录音...';
    
    // TODO: 实现语音录音功能
    // uni.startRecord({
    //   success: (res) => {
    //     // 处理录音结果
    //   }
    // });
  };
  
  /**
   * 取消语音输入
   */
  const cancelVoiceInput = () => {
    isVoiceRecording.value = false;
    isRecording.value = false;
  };
  
  /**
   * 确认语音输入
   */
  const confirmVoiceInput = () => {
    isVoiceRecording.value = false;
    isRecording.value = false;
    
    // TODO: 处理语音识别结果
    // inputText.value = voiceResult;
  };
  
  /**
   * 选择图片
   */
  const selectImage = () => {
    uni.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // TODO: 处理图片识别
        handleImageRecognition(res.tempFilePaths[0]);
      }
    });
  };
  
  /**
   * 复制消息
   */
  const copyMessage = (message) => {
    uni.setClipboardData({
      data: message.content,
      success: () => {
        uni.showToast({
          title: '已复制',
          icon: 'success'
        });
      }
    });
  };
  
  /**
   * 点赞消息
   */
  const likeMessage = (message) => {
    message.isLiked = !message.isLiked;
    uni.vibrateShort();
  };
  
  /**
   * 分享消息
   */
  const shareMessage = (message) => {
    uni.showShareMenu({
      title: '分享AI回答',
      path: '/pages/AIChat/AIChat'
    });
  };
  
  // ========== 业务逻辑函数 ==========
  
  /**
   * 发送消息给AI
   * @param {String} message - 用户消息
   */
  const sendToAI = async (message) => {
    try {
      // 添加AI打字状态
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: '',
        timestamp: new Date(),
        isTyping: true
      };
      
      messageList.value.push(aiMessage);
      isAITyping.value = true;
      
      await nextTick();
      scrollToBottom();
      
      // TODO: 调用实际的AI API
      // const response = await aiAPI.chat({
      //   message: message,
      //   context: getConversationContext()
      // });
      
      // 模拟AI响应延迟
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // 模拟AI回复
      const aiResponse = await generateAIResponse(message);
      
      // 更新AI消息
      const aiMessageIndex = messageList.value.findIndex(msg => msg.id === aiMessage.id);
      if (aiMessageIndex !== -1) {
        messageList.value[aiMessageIndex].content = aiResponse;
        messageList.value[aiMessageIndex].isTyping = false;
        isAITyping.value = false;
      }
      
      // 生成快速回复建议
      generateQuickReplies(aiResponse);
      
      await nextTick();
      scrollToBottom();
      
    } catch (error) {
      console.error('AI响应失败:', error);
      
      // 移除打字状态的消息
      const aiMessageIndex = messageList.value.findIndex(msg => msg.id === aiMessage.id);
      if (aiMessageIndex !== -1) {
        messageList.value.splice(aiMessageIndex, 1);
      }
      
      isAITyping.value = false;
      
      uni.showToast({
        title: 'AI响应失败，请重试',
        icon: 'error'
      });
    }
  };
  
  /**
   * 生成AI回复（模拟）
   * @param {String} userMessage - 用户消息
   * @returns {String} AI回复
   */
  const generateAIResponse = async (userMessage) => {
    // 简单的关键词匹配回复（实际项目中应该调用真实的AI API）
    const responses = {
      '鸟类识别': '我可以帮您识别鸟类！请描述一下鸟的特征，比如大小、颜色、叫声等，或者您可以上传照片让我来识别。',
      '鸟类习性': '不同鸟类有着各自独特的习性。您想了解哪种鸟类的习性呢？比如觅食习惯、繁殖行为、迁徙路线等。',
      '观鸟指南': '观鸟是一项很有趣的活动！建议选择清晨或傍晚时间，准备好双筒望远镜，选择公园、湿地等鸟类活动频繁的地方。保持安静，避免惊扰鸟类。',
      '保护知识': '鸟类保护非常重要。我们可以通过保护栖息地、减少污染、不干扰繁殖等方式来保护鸟类。您想了解具体哪个方面的保护知识呢？'
    };
    
    // 查找匹配的关键词
    for (const [keyword, response] of Object.entries(responses)) {
      if (userMessage.includes(keyword)) {
        return response;
      }
    }
    
    // 默认回复
    return '这是一个很好的问题！作为鸟类专家，我很乐意为您解答。您能提供更多具体信息吗？这样我可以给出更准确的回答。';
  };
  
  /**
   * 生成快速回复建议
   * @param {String} aiResponse - AI回复内容
   */
  const generateQuickReplies = (aiResponse) => {
    const defaultReplies = [
      { id: 1, text: '告诉我更多' },
      { id: 2, text: '有相关图片吗？' },
      { id: 3, text: '谢谢' }
    ];
    
    // 根据AI回复内容生成个性化建议（简化版）
    if (aiResponse.includes('识别')) {
      quickReplies.value = [
        { id: 1, text: '上传照片识别' },
        { id: 2, text: '描述特征识别' },
        { id: 3, text: '常见鸟类有哪些？' }
      ];
    } else if (aiResponse.includes('保护')) {
      quickReplies.value = [
        { id: 1, text: '如何参与保护？' },
        { id: 2, text: '濒危鸟类有哪些？' },
        { id: 3, text: '保护法律法规' }
      ];
    } else {
      quickReplies.value = defaultReplies;
    }
    
    // 3秒后自动隐藏快速回复
    setTimeout(() => {
      quickReplies.value = [];
    }, 3000);
  };
  
  /**
   * 处理图片识别
   * @param {String} imagePath - 图片路径
   */
  const handleImageRecognition = async (imagePath) => {
    try {
      uni.showLoading({ title: '识别中...' });
      
      // TODO: 调用图片识别API
      // const result = await imageRecognitionAPI.identify(imagePath);
      
      // 模拟识别延迟
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      uni.hideLoading();
      
      // 模拟识别结果
      const recognitionResult = '根据图片分析，这可能是一只麻雀。麻雀是常见的小型鸟类，体长约14-15厘米...';
      
      // 发送识别结果消息
      const aiMessage = {
        id: Date.now(),
        type: 'ai',
        content: `图片识别结果：\n\n${recognitionResult}`,
        timestamp: new Date(),
        isTyping: false
      };
      
      messageList.value.push(aiMessage);
      await nextTick();
      scrollToBottom();
      
    } catch (error) {
      uni.hideLoading();
      console.error('图片识别失败:', error);
      uni.showToast({
        title: '识别失败，请重试',
        icon: 'error'
      });
    }
  };
  
  /**
   * 滚动到底部
   */
  const scrollToBottom = () => {
    setTimeout(() => {
      scrollTop.value = 99999;
    }, 100);
  };
  
  /**
   * 格式化消息内容
   * @param {String} content - 消息内容
   * @returns {Array} 富文本节点数组
   */
  const formatMessageContent = (content) => {
    // 简单的富文本格式化（可以扩展支持更多格式）
    return content.split('\n').map(line => ({
      name: 'div',
      children: [{ type: 'text', text: line }]
    }));
  };
  
  /**
   * 格式化时间
   * @param {Date} timestamp - 时间戳
   * @returns {String} 格式化的时间字符串
   */
  const formatTime = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diff = now - date;
    
    if (diff < 60000) { // 1分钟内
      return '刚刚';
    } else if (diff < 3600000) { // 1小时内
      return `${Math.floor(diff / 60000)}分钟前`;
    } else if (diff < 86400000) { // 1天内
      return `${Math.floor(diff / 3600000)}小时前`;
    } else {
      return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
  };
  
  /**
   * 加载更多消息
   */
  const loadMoreMessages = async () => {
    try {
      // TODO: 实现历史消息加载
      console.log('加载更多消息');
    } catch (error) {
      console.error('加载更多消息失败:', error);
    }
  };
  
  /**
   * 清空聊天记录
   */
  const clearChatHistory = () => {
    uni.showModal({
      title: '确认清空',
      content: '确定要清空所有聊天记录吗？',
      success: (res) => {
        if (res.confirm) {
          messageList.value = [];
          uni.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  };
  
  /**
   * 导出聊天记录
   */
  const exportChatHistory = () => {
    // TODO: 实现聊天记录导出功能
    uni.showToast({
      title: '导出功能开发中',
      icon: 'none'
    });
  };
  
  /**
   * 打开设置
   */
  const openSettings = () => {
    // TODO: 跳转到设置页面
    uni.navigateTo({
      url: '/pages/ChatSettings/ChatSettings'
    });
  };
  
  /**
   * 获取会话上下文
   */
  const getConversationContext = () => {
    // 返回最近的几条消息作为上下文
    return messageList.value.slice(-10).map(msg => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));
  };
  
  // ========== 生命周期 ==========
  onMounted(() => {
    // 初始化聊天界面
    console.log('AI聊天页面初始化');
    
    // 设置AI在线状态
    isAIOnline.value = true;
  });
  
  // ========== 监听器 ==========
  watch(messageList, () => {
    // 消息列表变化时自动滚动到底部
    nextTick(() => {
      scrollToBottom();
    });
  }, { deep: true });
  </script>
  
  <style lang="scss" scoped>
  // ========== 主容器样式 ==========
  .ai-chat-container {
    height: 100vh;
    display: flex;
    flex-direction: column;
    background: linear-gradient(180deg, #f8fffe 0%, #ffffff 100%);
  }
  
  // ========== 自定义导航栏样式 ==========
  .custom-navbar {
    height: 88rpx;
    background: linear-gradient(135deg, #9c27b0 0%, #ab47bc 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32rpx;
    padding-top: var(--status-bar-height, 0);
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2rpx 16rpx rgba(156, 39, 176, 0.2);
  }
  
  .navbar-left, .navbar-right {
    width: 80rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .back-icon, .menu-icon {
    width: 36rpx;
    height: 36rpx;
  }
  
  .navbar-center {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 16rpx;
  }
  
  .ai-avatar-wrapper {
    position: relative;
  }
  
  .ai-avatar {
    width: 60rpx;
    height: 60rpx;
    border-radius: 30rpx;
    border: 3rpx solid rgba(255, 255, 255, 0.3);
  }
  
  .status-indicator {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20rpx;
    height: 20rpx;
    border-radius: 50%;
    border: 3rpx solid white;
    background: #666;
    
    &.status-online {
      background: #4caf50;
    }
    
    &.status-typing {
      background: #ff9800;
      animation: pulse 1.5s infinite;
    }
  }
  
  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  
  .ai-info {
    flex: 1;
  }
  
  .ai-name {
    display: block;
    font-size: 28rpx;
    font-weight: 600;
    color: white;
    margin-bottom: 4rpx;
  }
  
  .ai-status {
    display: block;
    font-size: 20rpx;
    color: rgba(255, 255, 255, 0.8);
  }
  
  // ========== 消息列表样式 ==========
  .message-list {
    flex: 1;
    padding: 24rpx 32rpx;
    overflow-y: auto;
  }
  
  .welcome-section {
    display: flex;
    justify-content: center;
    padding: 80rpx 0;
  }
  
  .welcome-card {
    background: white;
    border-radius: 32rpx;
    padding: 48rpx 32rpx;
    text-align: center;
    box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08);
    max-width: 500rpx;
  }
  
  .welcome-icon {
    width: 120rpx;
    height: 120rpx;
    margin-bottom: 24rpx;
  }
  
  .welcome-title {
    display: block;
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 12rpx;
  }
  
  .welcome-subtitle {
    display: block;
    font-size: 26rpx;
    color: #666;
    margin-bottom: 32rpx;
    line-height: 1.5;
  }
  
  .suggestion-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16rpx;
  }
  
  .suggestion-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8rpx;
    padding: 20rpx 16rpx;
    background: linear-gradient(135deg, #f3e5f5 0%, #fce4ec 100%);
    border-radius: 20rpx;
    border: 2rpx solid rgba(156, 39, 176, 0.1);
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.95);
      background: linear-gradient(135deg, #e1bee7 0%, #f8bbd9 100%);
    }
  }
  
  .suggestion-icon {
    width: 32rpx;
    height: 32rpx;
  }
  
  .suggestion-text {
    font-size: 22rpx;
    color: #9c27b0;
    font-weight: 500;
  }
  
  .message-item {
    margin-bottom: 32rpx;
    animation: fadeInUp 0.5s ease both;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20rpx);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .ai-message-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 16rpx;
  }
  
  .user-message-wrapper {
    display: flex;
    align-items: flex-start;
    gap: 16rpx;
    flex-direction: row-reverse;
  }
  
  .message-avatar {
    width: 64rpx;
    height: 64rpx;
    border-radius: 32rpx;
    flex-shrink: 0;
  }
  
  .message-content {
    flex: 1;
    max-width: calc(100% - 80rpx);
  }
  
  .message-bubble {
    padding: 20rpx 24rpx;
    border-radius: 24rpx;
    margin-bottom: 8rpx;
    position: relative;
    word-wrap: break-word;
  }
  
  .ai-bubble {
    background: white;
    border: 2rpx solid rgba(156, 39, 176, 0.1);
    border-bottom-left-radius: 8rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
  }
  
  .user-bubble {
    background: linear-gradient(135deg, #9c27b0 0%, #ab47bc 100%);
    color: white;
    border-bottom-right-radius: 8rpx;
    align-self: flex-end;
  }
  
  .message-text {
    font-size: 28rpx;
    line-height: 1.6;
    color: #333;
  }
  
  .user-bubble .message-text {
    color: white;
  }
  
  .message-time {
    font-size: 20rpx;
    color: #999;
    margin-left: 24rpx;
  }
  
  .user-message-wrapper .message-time {
    text-align: right;
    margin-left: 0;
    margin-right: 24rpx;
  }
  
  // ========== 打字动画样式 ==========
  .typing-indicator {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 8rpx 0;
  }
  
  .typing-dot {
    width: 12rpx;
    height: 12rpx;
    background: #9c27b0;
    border-radius: 50%;
    animation: typingDot 1.4s infinite ease-in-out;
    
    &:nth-child(1) { animation-delay: -0.32s; }
    &:nth-child(2) { animation-delay: -0.16s; }
    &:nth-child(3) { animation-delay: 0s; }
  }
  
  @keyframes typingDot {
    0%, 80%, 100% {
      transform: scale(0.8);
      opacity: 0.5;
    }
    40% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  // ========== 消息工具栏样式 ==========
  .message-toolbar {
    display: flex;
    gap: 8rpx;
    margin-top: 12rpx;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }
  
  .ai-bubble:hover .message-toolbar {
    opacity: 1;
  }
  
  .toolbar-btn {
    width: 48rpx;
    height: 48rpx;
    background: rgba(156, 39, 176, 0.1);
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.9);
      background: rgba(156, 39, 176, 0.2);
    }
  }
  
  .toolbar-icon {
    width: 24rpx;
    height: 24rpx;
  }
  
  // ========== 快速回复样式 ==========
  .quick-replies {
    padding: 16rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
  }
  
  .quick-reply-scroll {
    white-space: nowrap;
  }
  
  .quick-reply-container {
    display: inline-flex;
    gap: 12rpx;
    padding: 0 32rpx;
  }
  
  .quick-reply-item {
    display: inline-block;
    padding: 12rpx 20rpx;
    background: rgba(156, 39, 176, 0.1);
    border: 2rpx solid rgba(156, 39, 176, 0.2);
    border-radius: 20rpx;
    white-space: nowrap;
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.95);
      background: rgba(156, 39, 176, 0.2);
    }
  }
  
  .quick-reply-text {
    font-size: 24rpx;
    color: #9c27b0;
    font-weight: 500;
  }
  
  // ========== 输入区域样式 ==========
  .input-section {
    background: white;
    border-top: 1rpx solid #f0f0f0;
    padding: 16rpx 32rpx;
    padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  }
  
  .input-wrapper {
    position: relative;
  }
  
  .input-container {
    display: flex;
    align-items: flex-end;
    gap: 16rpx;
    background: #f8f9fa;
    border-radius: 28rpx;
    padding: 12rpx 16rpx;
    border: 2rpx solid transparent;
    transition: all 0.3s ease;
    
    &:focus-within {
      border-color: #9c27b0;
      background: white;
      box-shadow: 0 0 0 8rpx rgba(156, 39, 176, 0.1);
    }
  }
  
  .extra-actions {
    display: flex;
    gap: 8rpx;
  }
  
  .action-btn {
    width: 56rpx;
    height: 56rpx;
    background: rgba(156, 39, 176, 0.1);
    border-radius: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.9);
      background: rgba(156, 39, 176, 0.2);
    }
  }
  
  .action-icon {
    width: 28rpx;
    height: 28rpx;
  }
  
  .text-input {
    flex: 1;
    min-height: 56rpx;
    max-height: 200rpx;
    font-size: 28rpx;
    color: #333;
    padding: 16rpx 12rpx;
    background: transparent;
    border: none;
    outline: none;
    line-height: 1.4;
  }
  
  .input-placeholder {
    color: #999;
  }
  
  .send-btn {
    width: 56rpx;
    height: 56rpx;
    background: rgba(156, 39, 176, 0.3);
    border-radius: 28rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &.send-btn-active {
      background: linear-gradient(135deg, #9c27b0 0%, #ab47bc 100%);
      box-shadow: 0 4rpx 16rpx rgba(156, 39, 176, 0.3);
      
      &:active {
        transform: scale(0.9);
      }
    }
  }
  
  .send-icon {
    width: 28rpx;
    height: 28rpx;
  }
  
  .char-count {
    text-align: right;
    margin-top: 8rpx;
  }
  
  .char-count-text {
    font-size: 20rpx;
    color: #999;
  }
  
  // ========== 语音输入模态框样式 ==========
  .voice-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  
  .voice-content {
    background: white;
    border-radius: 32rpx;
    padding: 64rpx 48rpx;
    text-align: center;
    min-width: 500rpx;
  }
  
  .voice-animation {
    position: relative;
    width: 160rpx;
    height: 160rpx;
    margin: 0 auto 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .voice-circle {
    position: absolute;
    width: 100%;
    height: 100%;
    border: 4rpx solid rgba(156, 39, 176, 0.3);
    border-radius: 50%;
    transition: all 0.3s ease;
    
    &.voice-active {
      animation: voicePulse 1.5s infinite;
    }
  }
  
  @keyframes voicePulse {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    100% {
      transform: scale(1.3);
      opacity: 0;
    }
  }
  
  .voice-icon {
    width: 80rpx;
    height: 80rpx;
    z-index: 1;
  }
  
  .voice-text {
    font-size: 28rpx;
    color: #333;
    margin-bottom: 48rpx;
    display: block;
  }
  
  .voice-actions {
    display: flex;
    gap: 24rpx;
    justify-content: center;
  }
  
  .voice-cancel, .voice-confirm {
    padding: 16rpx 32rpx;
    border-radius: 24rpx;
    font-size: 28rpx;
    font-weight: 500;
    transition: all 0.3s ease;
  }
  
  .voice-cancel {
    background: #f0f0f0;
    color: #666;
    
    &:active {
      background: #e0e0e0;
    }
  }
  
  .voice-confirm {
    background: linear-gradient(135deg, #9c27b0 0%, #ab47bc 100%);
    color: white;
    
    &:active {
      transform: scale(0.95);
    }
  }
  
  // ========== 加载更多样式 ==========
  .load-more-section {
    display: flex;
    justify-content: center;
    padding: 32rpx 0;
  }
  
  .load-more-btn {
    display: flex;
    align-items: center;
    gap: 12rpx;
    padding: 16rpx 24rpx;
    background: rgba(156, 39, 176, 0.1);
    border-radius: 24rpx;
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.95);
      background: rgba(156, 39, 176, 0.2);
    }
  }
  
  .load-more-icon {
    width: 24rpx;
    height: 24rpx;
    animation: spin 1s linear infinite;
  }
  
  .load-more-text {
    font-size: 24rpx;
    color: #9c27b0;
    font-weight: 500;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  </style>