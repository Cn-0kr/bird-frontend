<template>
    <view class="encyclopedia-container">
      <!-- 自定义导航栏 -->
      <view class="custom-navbar">
        <view class="navbar-left" @click="goBack">
          <image :src="getOSSUrl('static/icons/back.png', 'icon')" class="back-icon" @error="onIconError"></image>
        </view>
        <text class="navbar-title">鸟类图鉴</text>
        <view class="navbar-right">
          <view 
            class="mode-switch" 
            @click="toggleMode"
            :class="{ 'mode-switch-active': currentMode === 'general' }"
          >
            <image 
              :src="getOSSUrl(currentMode === 'search' ? 'static/icons/book.png' : 'static/icons/search.png', 'icon')" 
              class="mode-icon"
              @error="onIconError"
            ></image>
          </view>
        </view>
      </view>
  
      <!-- 搜索模式 -->
      <view v-if="currentMode === 'search'" class="search-mode">
        <!-- 搜索栏 -->
        <view class="search-section">
          <view class="search-input-wrapper">
            <image :src="getOSSUrl('static/icons/search.png', 'icon')" class="search-icon" @error="onIconError"></image>
            <input 
              type="text" 
              placeholder="搜索鸟类名称或特征..."
              v-model="searchKeyword"
              @input="onSearchInput"
              @confirm="handleSearchConfirm"
              class="search-input"
              confirm-type="search"
            />
            <view 
              v-if="searchKeyword" 
              class="clear-btn" 
              @click="clearSearch"
            >
              <image :src="getOSSUrl('static/icons/close.png', 'small-icon')" class="clear-icon" @error="onIconError"></image>
            </view>
          </view>
        </view>
  
        <!-- 搜索结果 -->
        <view class="search-results">
          <view v-if="isSearching" class="loading-container">
            <view class="loading-spinner"></view>
            <text class="loading-text">搜索中...</text>
          </view>
  
          <view v-else-if="searchResults.length > 0" class="results-grid">
            <view 
              v-for="(bird, index) in searchResults" 
              :key="bird.id"
              class="result-card"
              @click="selectBird(bird)"
              :style="{ 'animation-delay': `${index * 0.1}s` }"
            >
              <image :src="getOSSUrl(bird.imageUrl, 'medium')" class="result-image" mode="aspectFill" @error="onImageError"></image>
              <view class="result-content">
                <text class="result-name">{{ bird.name }}</text>
                <text class="result-scientific">{{ bird.scientificName }}</text>
                <view class="result-tags">
                  <text v-for="tag in bird.tags" :key="tag" class="result-tag">{{ tag }}</text>
                </view>
              </view>
            </view>
          </view>
  
          <view v-else-if="searchKeyword && !isSearching" class="no-results">
            <image :src="getOSSUrl('static/icons/no-search-results.png', 'large')" class="no-results-icon" @error="onIconError"></image>
            <text class="no-results-text">未找到相关鸟类</text>
            <text class="no-results-subtitle">尝试搜索其他关键词</text>
          </view>
  
          <view v-else class="search-placeholder">
            <image :src="getOSSUrl('static/icons/search-placeholder.png', 'large')" class="placeholder-icon" @error="onIconError"></image>
            <text class="placeholder-text">输入鸟类名称开始搜索</text>
            <text class="placeholder-subtitle">支持中文名、英文名或特征描述</text>
          </view>
        </view>
      </view>
  
      <!-- 通识模式 - 卡片翻阅 -->
      <view v-else class="general-mode">
        <!-- 进度指示器 -->
        <view class="progress-indicator">
          <text class="progress-text">{{ currentDisplayPage }} / {{ safeTotalCards }}</text>
          <view class="progress-bar">
            <view 
              class="progress-fill" 
              :style="{ width: `${safeTotalCards > 0 ? (currentDisplayPage / safeTotalCards) * 100 : 0}%` }"
            ></view>
          </view>
        </view>
  
        <!-- 卡片容器 - 重新设计的翻页效果 -->
        <view class="card-stack-container">
          <view 
            class="card-stack"
            @touchstart="onTouchStart"
            @touchmove="onTouchMove"
            @touchend="onTouchEnd"
          >
            <!-- 背景卡片（下一张的预览） -->
            <view 
              v-if="safeCurrentIndex < safeTotalCards - 1 && safeTotalCards > 1"
              class="card-item background-card"
              :style="backgroundCardStyle"
            >
              <bird-knowledge-card 
                :bird-data="birdCards[safeCurrentIndex + 1]"
                :is-active="false"
                @like="onCardLike"
                @share="onCardShare"
              ></bird-knowledge-card>
            </view>
            
            <!-- 当前卡片 -->
            <view 
              v-if="safeTotalCards > 0 && birdCards[safeCurrentIndex]"
              class="card-item current-card"
              :style="currentCardStyle"
              :class="{ 'card-flipping': isFlipping }"
            >
              <bird-knowledge-card 
                :bird-data="birdCards[safeCurrentIndex]"
                :is-active="true"
                @like="onCardLike"
                @share="onCardShare"
              ></bird-knowledge-card>
            </view>
          </view>
        </view>
  
        <!-- 操作提示 -->
        <view class="operation-tips" :class="{ 'tips-hidden': isFlipping }">
          <view class="tip-item">
            <image :src="getOSSUrl('static/icons/swipe-up.png', 'small-icon')" class="tip-icon" @error="onIconError"></image>
            <text class="tip-text">上滑查看下一张</text>
          </view>
          <view class="tip-item">
            <image :src="getOSSUrl('static/icons/tap.png', 'small-icon')" class="tip-icon" @error="onIconError"></image>
            <text class="tip-text">点击卡片查看详情</text>
          </view>
        </view>
  
        <!-- 底部导航按钮 -->
        <view class="bottom-actions">
          <view 
            class="action-button prev-btn"
            :class="{ 'btn-disabled': !canGoPrevious }"
            @click="previousCard"
          >
            <image :src="getOSSUrl('static/icons/prev.png', 'small-icon')" class="action-icon" @error="onIconError"></image>
            <text class="action-text">上一张</text>
          </view>
  
          <view class="card-counter">
            <text class="counter-text">{{ currentDisplayPage }}</text>
            <view class="counter-divider"></view>
            <text class="counter-total">{{ safeTotalCards }}</text>
          </view>
  
          <view 
            class="action-button next-btn"
            :class="{ 'btn-disabled': !canGoNext }"
            @click="nextCard"
          >
            <text class="action-text">下一张</text>
            <image :src="getOSSUrl('static/icons/next.png', 'small-icon')" class="action-icon" @error="onIconError"></image>
          </view>
        </view>
      </view>
    </view>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, nextTick, watch } from 'vue';
  import BirdKnowledgeCard from '@/components/BirdKnowledgeCard.vue';
  
  // ========== 响应式数据 ==========
  const currentMode = ref('search'); // 'search' | 'general'
  const searchKeyword = ref('');
  const isSearching = ref(false);
  const searchResults = ref([]);
  const currentCardIndex = ref(0); // 确保始终为数字类型
  const birdCards = ref([]);
  
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
      case 'medium':
        params = '?x-oss-process=image/resize,m_lfit,w_200,h_200/quality,q_85';
        break;
      case 'large':
        params = '?x-oss-process=image/resize,m_lfit,w_120,h_120/quality,q_90';
        break;
      case 'bird-image':
        params = '?x-oss-process=image/resize,m_lfit,w_600,h_400/quality,q_85';
        break;
      default:
        params = '?x-oss-process=image/resize,m_lfit,w_48,h_48/quality,q_90';
    }
    
    return `${ossConfig.baseUrl}/${cleanFilename}${params}`;
  };
  
  // ========== 卡片翻页动画相关状态 ==========
  const isFlipping = ref(false);
  const touchStartY = ref(0);
  const touchCurrentY = ref(0);
  const cardTranslateY = ref(0);
  const cardOpacity = ref(1);
  const cardScale = ref(1);
  const backgroundCardScale = ref(0.95);
  const backgroundCardOpacity = ref(0.7);
  
  // ========== 模拟鸟类数据 ==========
  const mockBirdData = [
    {
      id: 1,
      name: '巨嘴鸟',
      scientificName: 'Ramphastos sulfuratus',
      imageUrl: 'static/birds/toucan.jpg',
      tags: ['热带鸟类', '彩色', '大型'],
      habitat: '热带雨林',
      size: '体长50-65cm',
      weight: '500-860克',
      wingspan: '109-152cm',
      diet: '主要以果实为食，偶尔捕食小型动物',
      behavior: '群居性鸟类，善于飞行和攀爬',
      distribution: '中美洲和南美洲的热带雨林',
      conservationStatus: '无危',
      characteristics: [
        '拥有巨大而彩色的喙',
        '羽毛色彩鲜艳',
        '飞行能力强',
        '社交性强'
      ],
      funFacts: [
        '巨嘴鸟的大喙实际上很轻，内部充满了气囊',
        '它们的喙可以占到身体长度的1/3',
        '巨嘴鸟睡觉时会将喙折叠到背上'
      ],
      callDescription: '发出低沉的咕咕声和尖锐的叫声',
      nestingHabits: '在树洞中筑巢，每次产卵2-4枚',
      lifespan: '野外约15-20年'
    },
    {
      id: 2,
      name: '蜂鸟',
      scientificName: 'Trochilidae',
      imageUrl: 'static/birds/hummingbird.jpg',
      tags: ['小型鸟类', '快速', '悬停'],
      habitat: '花园、森林边缘',
      size: '体长5-25cm',
      weight: '2-20克',
      wingspan: '5-25cm',
      diet: '花蜜、小昆虫',
      behavior: '能够悬停飞行，翅膀拍打频率极高',
      distribution: '南北美洲',
      conservationStatus: '大多数种类稳定',
      characteristics: [
        '世界上最小的鸟类',
        '能够悬停和倒飞',
        '心跳频率极快',
        '新陈代谢旺盛'
      ],
      funFacts: [
        '蜂鸟的翅膀每秒可拍打80次',
        '它们的心跳每分钟可达1260次',
        '蜂鸟可以倒着飞行',
        '它们的舌头比喙还要长'
      ],
      callDescription: '发出细小的吱吱声',
      nestingHabits: '建造精巧的杯状巢，每次产卵1-3枚',
      lifespan: '野外约3-5年'
    },
    {
      id: 3,
      name: '孔雀',
      scientificName: 'Pavo cristatus',
      imageUrl: 'static/birds/peacock.jpg',
      tags: ['大型鸟类', '华丽', '地栖'],
      habitat: '森林、公园、农田',
      size: '体长100-115cm',
      weight: '4-6公斤',
      wingspan: '120-160cm',
      diet: '种子、昆虫、小型爬行动物',
      behavior: '雄鸟会展开尾羽进行求偶炫耀',
      distribution: '南亚、东南亚',
      conservationStatus: '无危',
      characteristics: [
        '雄鸟有华丽的尾羽',
        '能够短距离飞行',
        '叫声洪亮',
        '具有强烈的领域性'
      ],
      funFacts: [
        '孔雀的尾羽可以长达1.5米',
        '尾羽上的眼斑叫做"眼状斑"',
        '孔雀实际上可以飞行，但不擅长长距离飞行',
        '雌孔雀被称为"孔雀雌"'
      ],
      callDescription: '发出尖锐的叫声，特别是在求偶季节',
      nestingHabits: '在地面筑巢，每次产卵3-5枚',
      lifespan: '野外约15-20年'
    },
    {
      id: 4,
      name: '老鹰',
      scientificName: 'Aquila chrysaetos',
      imageUrl: 'static/birds/eagle.jpg',
      tags: ['猛禽', '大型', '捕食者'],
      habitat: '山地、草原、森林',
      size: '体长75-100cm',
      weight: '3-7公斤',
      wingspan: '180-280cm',
      diet: '小型哺乳动物、鸟类、鱼类',
      behavior: '优秀的猎手，视力极佳',
      distribution: '全球各大洲（除南极洲）',
      conservationStatus: '部分种类濒危',
      characteristics: [
        '视力是人类的8倍',
        '强有力的爪子和喙',
        '飞行能力极强',
        '领域性强'
      ],
      funFacts: [
        '老鹰可以从3公里外发现猎物',
        '它们的俯冲速度可达每小时300公里',
        '老鹰可以活到30岁以上',
        '许多文化将老鹰视为力量和自由的象征'
      ],
      callDescription: '发出尖锐的啸叫声',
      nestingHabits: '在高处筑大型巢穴，每次产卵1-3枚',
      lifespan: '野外约20-30年'
    }
  ];
  
  // ========== 计算属性 ==========
  
  /**
   * 安全的当前页码（确保为数字且在有效范围内）
   */
  const safeCurrentIndex = computed(() => {
    const index = parseInt(currentCardIndex.value) || 0;
    const totalCards = parseInt(birdCards.value.length) || 0;
    if (totalCards === 0) return 0;
    return Math.max(0, Math.min(index, totalCards - 1));
  });
  
  /**
   * 安全的总页数
   */
  const safeTotalCards = computed(() => {
    return parseInt(birdCards.value.length) || 0;
  });
  
  /**
   * 当前显示页码（从1开始）
   */
  const currentDisplayPage = computed(() => {
    return safeCurrentIndex.value + 1;
  });
  
  /**
   * 是否可以向前翻页
   */
  const canGoPrevious = computed(() => {
    return safeCurrentIndex.value > 0 && !isFlipping.value && safeTotalCards.value > 0;
  });
  
  /**
   * 是否可以向后翻页
   */
  const canGoNext = computed(() => {
    return safeCurrentIndex.value < safeTotalCards.value - 1 && !isFlipping.value && safeTotalCards.value > 0;
  });
  
  /**
   * 当前卡片的样式
   */
  const currentCardStyle = computed(() => ({
    transform: `translateY(${cardTranslateY.value}px) scale(${cardScale.value})`,
    opacity: cardOpacity.value,
    zIndex: 10
  }));
  
  /**
   * 背景卡片的样式
   */
  const backgroundCardStyle = computed(() => ({
    transform: `scale(${backgroundCardScale.value})`,
    opacity: backgroundCardOpacity.value,
    zIndex: 5
  }));
  
  // ========== 触摸事件处理 ==========
  
  /**
   * 触摸开始
   * @param {Object} event - 触摸事件
   */
  const onTouchStart = (event) => {
    if (isFlipping.value) return;
    touchStartY.value = event.touches[0].clientY;
    touchCurrentY.value = event.touches[0].clientY;
  };
  
  /**
   * 触摸移动
   * @param {Object} event - 触摸事件
   */
  const onTouchMove = (event) => {
    if (isFlipping.value || birdCards.value.length === 0) return;
    
    touchCurrentY.value = event.touches[0].clientY;
    const deltaY = touchCurrentY.value - touchStartY.value;
    
    // 只处理向上滑动，并确保不是最后一张卡片
    const currentIndex = parseInt(currentCardIndex.value) || 0;
    const totalCards = parseInt(birdCards.value.length) || 0;
    
    if (deltaY < 0 && currentIndex < totalCards - 1) {
      const progress = Math.min(Math.abs(deltaY) / 200, 1);
      
      // 当前卡片渐变效果
      cardTranslateY.value = deltaY;
      cardOpacity.value = 1 - progress * 0.7;
      cardScale.value = 1 - progress * 0.1;
      
      // 背景卡片渐变效果
      backgroundCardScale.value = 0.95 + progress * 0.05;
      backgroundCardOpacity.value = 0.7 + progress * 0.3;
    }
  };
  
  /**
   * 触摸结束
   * @param {Object} event - 触摸事件
   */
  const onTouchEnd = (event) => {
    if (isFlipping.value || birdCards.value.length === 0) return;
    
    const deltaY = touchCurrentY.value - touchStartY.value;
    
    // 判断是否触发翻页（向上滑动超过100px）
    if (deltaY < -100 && currentCardIndex.value < birdCards.value.length - 1) {
      nextCard();
    } else {
      // 恢复原位
      resetCardPosition();
    }
  };
  
  /**
   * 重置卡片位置
   */
  const resetCardPosition = () => {
    cardTranslateY.value = 0;
    cardOpacity.value = 1;
    cardScale.value = 1;
    backgroundCardScale.value = 0.95;
    backgroundCardOpacity.value = 0.7;
  };
  
  // ========== 事件处理函数 ==========
  
  /**
   * 返回上一页
   */
  const goBack = () => {
    uni.navigateBack();
  };
  
  /**
   * 切换模式
   */
  const toggleMode = () => {
    currentMode.value = currentMode.value === 'search' ? 'general' : 'search';
    
    // 模式切换时的反馈
    uni.vibrateShort();
    
    // 如果切换到通识模式，确保有数据
    if (currentMode.value === 'general' && birdCards.value.length === 0) {
      initGeneralMode();
    }
  };
  
  /**
   * 搜索输入处理
   */
  const onSearchInput = () => {
    if (searchKeyword.value.trim()) {
      performSearch();
    } else {
      searchResults.value = [];
    }
  };
  
  /**
   * 搜索确认处理
   */
  const handleSearchConfirm = () => {
    if (searchKeyword.value.trim()) {
      performSearch();
    }
  };
  
  /**
   * 清除搜索
   */
  const clearSearch = () => {
    searchKeyword.value = '';
    searchResults.value = [];
  };
  
  /**
   * 选择鸟类（从搜索结果）
   * @param {Object} bird - 鸟类数据
   */
  const selectBird = (bird) => {
    // 切换到通识模式并定位到选中的鸟类
    currentMode.value = 'general';
    const index = birdCards.value.findIndex(card => card.id === bird.id);
    if (index !== -1) {
      // 确保索引是数字类型
      currentCardIndex.value = parseInt(index);
    }
    
    // 清除搜索状态
    searchKeyword.value = '';
    searchResults.value = [];
    
    // 重置卡片状态
    resetCardPosition();
  };
  
  /**
   * 上一张卡片
   */
  const previousCard = () => {
    // 严格的边界检查和类型检查
    const currentIndex = parseInt(currentCardIndex.value) || 0;
    const totalCards = parseInt(birdCards.value.length) || 0;
    
    if (currentIndex > 0 && !isFlipping.value && totalCards > 0) {
      isFlipping.value = true;
      
      // 翻页动画
      cardTranslateY.value = 50;
      cardOpacity.value = 0;
      
      setTimeout(() => {
        // 确保索引是有效的数字
        const newIndex = Math.max(0, currentIndex - 1);
        currentCardIndex.value = newIndex;
        resetCardPosition();
        isFlipping.value = false;
      }, 300);
    }
  };
  
  /**
   * 下一张卡片
   */
  const nextCard = () => {
    // 严格的边界检查和类型检查
    const currentIndex = parseInt(currentCardIndex.value) || 0;
    const totalCards = parseInt(birdCards.value.length) || 0;
    
    if (currentIndex < totalCards - 1 && !isFlipping.value && totalCards > 0) {
      isFlipping.value = true;
      
      // 翻页动画
      cardTranslateY.value = -200;
      cardOpacity.value = 0;
      cardScale.value = 0.8;
      
      setTimeout(() => {
        // 确保索引是有效的数字
        const newIndex = Math.min(totalCards - 1, currentIndex + 1);
        currentCardIndex.value = newIndex;
        resetCardPosition();
        isFlipping.value = false;
      }, 300);
      
      // 震动反馈
      uni.vibrateShort();
    }
  };
  
  /**
   * 卡片点赞
   * @param {Object} bird - 鸟类数据
   */
  const onCardLike = (bird) => {
    uni.showToast({
      title: '已收藏',
      icon: 'success'
    });
  };
  
  /**
   * 卡片分享
   * @param {Object} bird - 鸟类数据
   */
  const onCardShare = (bird) => {
    uni.showShareMenu({
      title: `分享鸟类：${bird.name}`,
      path: `/pages/BirdEncyclopedia/BirdEncyclopedia?birdId=${bird.id}`
    });
  };
  
  // ========== 业务逻辑函数 ==========
  
  /**
   * 执行搜索
   */
  const performSearch = async () => {
    try {
      isSearching.value = true;
      
      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // 模拟搜索逻辑
      const keyword = searchKeyword.value.toLowerCase();
      const results = mockBirdData.filter(bird => 
        bird.name.toLowerCase().includes(keyword) ||
        bird.scientificName.toLowerCase().includes(keyword) ||
        bird.tags.some(tag => tag.includes(keyword)) ||
        bird.habitat.includes(keyword)
      );
      
      searchResults.value = results;
      
    } catch (error) {
      console.error('搜索失败:', error);
      uni.showToast({
        title: '搜索失败',
        icon: 'error'
      });
    } finally {
      isSearching.value = false;
    }
  };
  
  /**
   * 初始化通识模式
   */
  const initGeneralMode = () => {
    birdCards.value = [...mockBirdData];
    // 确保索引重置为0且为数字类型
    currentCardIndex.value = 0;
    resetCardPosition();
  };
  
  /**
   * 加载鸟类数据
   */
  const loadBirdData = async () => {
    try {
      // TODO: 调用实际API
      // const response = await birdAPI.getEncyclopedia();
      
      // 使用模拟数据
      birdCards.value = [...mockBirdData];
      
    } catch (error) {
      console.error('加载数据失败:', error);
      uni.showToast({
        title: '加载失败',
        icon: 'error'
      });
    }
  };
  
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
  
  // ========== 监听器 ==========
  
  /**
   * 监听数据变化，确保索引始终有效
   */
  watch([birdCards, currentCardIndex], ([newBirdCards, newIndex]) => {
    const totalCards = parseInt(newBirdCards.length) || 0;
    const currentIndex = parseInt(newIndex) || 0;
    
    if (totalCards > 0) {
      // 确保索引在有效范围内
      const validIndex = Math.max(0, Math.min(currentIndex, totalCards - 1));
      if (validIndex !== currentIndex) {
        currentCardIndex.value = validIndex;
      }
    } else {
      // 如果没有数据，重置为0
      currentCardIndex.value = 0;
    }
  }, { deep: true });
  
  // ========== 生命周期 ==========
  onMounted(async () => {
    // 检查是否有传入的鸟类ID参数
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const options = currentPage.options || {};
    
    if (options.birdId) {
      // 如果有指定鸟类ID，切换到通识模式并定位
      currentMode.value = 'general';
      await loadBirdData();
      const targetId = parseInt(options.birdId);
      const index = birdCards.value.findIndex(bird => bird.id === targetId);
      if (index !== -1) {
        // 确保索引是数字类型且在有效范围内
        currentCardIndex.value = Math.max(0, Math.min(index, birdCards.value.length - 1));
      }
    } else {
      // 默认加载数据
      await loadBirdData();
    }
    
    // 初始化卡片状态
    resetCardPosition();
    
    // 确保索引在有效范围内
    if (birdCards.value.length > 0) {
      currentCardIndex.value = Math.max(0, Math.min(currentCardIndex.value, birdCards.value.length - 1));
    }
  });
  </script>
  
  <style lang="scss" scoped>
  // ========== 主容器样式 ==========
  .encyclopedia-container {
    min-height: 100vh;
    background: linear-gradient(180deg, #f8fffe 0%, #ffffff 100%);
    position: relative;
  }
  
  // ========== 自定义导航栏样式 ==========
  .custom-navbar {
    height: 88rpx;
    background: linear-gradient(135deg, #4caf50 0%, #43a047 100%);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32rpx;
    padding-top: var(--status-bar-height, 0);
    position: sticky;
    top: 0;
    z-index: 1000;
    box-shadow: 0 2rpx 16rpx rgba(76, 175, 80, 0.2);
  }
  
  .navbar-left, .navbar-right {
    width: 80rpx;
    height: 60rpx;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .back-icon {
    width: 36rpx;
    height: 36rpx;
  }
  
  .navbar-title {
    font-size: 32rpx;
    font-weight: 600;
    color: white;
    text-align: center;
  }
  
  .mode-switch {
    width: 60rpx;
    height: 60rpx;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 30rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    
    &:active {
      transform: scale(0.9);
    }
    
    &.mode-switch-active {
      background: rgba(255, 255, 255, 0.3);
    }
  }
  
  .mode-icon {
    width: 32rpx;
    height: 32rpx;
  }
  
  // ========== 搜索模式样式 ==========
  .search-mode {
    flex: 1;
    padding: 24rpx 32rpx;
  }
  
  .search-section {
    margin-bottom: 32rpx;
  }
  
  .search-input-wrapper {
    position: relative;
    height: 88rpx;
    background: white;
    border-radius: 44rpx;
    display: flex;
    align-items: center;
    padding: 0 24rpx;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
    border: 2rpx solid #f0f0f0;
    transition: all 0.3s ease;
    
    &:focus-within {
      border-color: #4caf50;
      box-shadow: 0 4rpx 24rpx rgba(76, 175, 80, 0.15);
    }
  }
  
  .search-icon {
    width: 36rpx;
    height: 36rpx;
    margin-right: 16rpx;
    opacity: 0.6;
  }
  
  .search-input {
    flex: 1;
    font-size: 28rpx;
    color: #333;
    height: 100%;
  }
  
  .clear-btn {
    width: 48rpx;
    height: 48rpx;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 24rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:active {
      background: rgba(0, 0, 0, 0.1);
    }
  }
  
  .clear-icon {
    width: 24rpx;
    height: 24rpx;
  }
  
  .search-results {
    flex: 1;
    min-height: 60vh;
  }
  
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 0;
  }
  
  .loading-spinner {
    width: 60rpx;
    height: 60rpx;
    border: 4rpx solid #e0e0e0;
    border-top-color: #4caf50;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20rpx;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .loading-text {
    font-size: 28rpx;
    color: #666;
  }
  
  .results-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20rpx;
  }
  
  .result-card {
    background: white;
    border-radius: 24rpx;
    overflow: hidden;
    box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    animation: slideInUp 0.5s ease both;
    
    &:active {
      transform: scale(0.98);
    }
  }
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(30rpx);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .result-image {
    width: 100%;
    height: 200rpx;
    object-fit: cover;
  }
  
  .result-content {
    padding: 24rpx;
  }
  
  .result-name {
    font-size: 32rpx;
    font-weight: 600;
    color: #333;
    margin-bottom: 8rpx;
    display: block;
  }
  
  .result-scientific {
    font-size: 24rpx;
    color: #666;
    font-style: italic;
    margin-bottom: 16rpx;
    display: block;
  }
  
  .result-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8rpx;
  }
  
  .result-tag {
    background: rgba(76, 175, 80, 0.1);
    color: #4caf50;
    padding: 6rpx 12rpx;
    border-radius: 12rpx;
    font-size: 20rpx;
    font-weight: 500;
  }
  
  .no-results, .search-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 120rpx 40rpx;
    text-align: center;
  }
  
  .no-results-icon, .placeholder-icon {
    width: 120rpx;
    height: 120rpx;
    margin-bottom: 24rpx;
    opacity: 0.6;
  }
  
  .no-results-text, .placeholder-text {
    font-size: 28rpx;
    color: #666;
    font-weight: 500;
    margin-bottom: 8rpx;
  }
  
  .no-results-subtitle, .placeholder-subtitle {
    font-size: 24rpx;
    color: #999;
  }
  
  // ========== 通识模式样式 ==========
  .general-mode {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 88rpx);
  }
  
  .progress-indicator {
    padding: 20rpx 32rpx;
    background: white;
  }
  
  .progress-text {
    font-size: 24rpx;
    color: #666;
    text-align: center;
    margin-bottom: 12rpx;
    display: block;
  }
  
  .progress-bar {
    height: 6rpx;
    background: #f0f0f0;
    border-radius: 3rpx;
    overflow: hidden;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4caf50 0%, #66bb6a 100%);
    border-radius: 3rpx;
    transition: width 0.3s ease;
  }
  
  // ========== 卡片堆叠容器样式 ==========
  .card-stack-container {
    flex: 1;
    position: relative;
    padding: 20rpx 32rpx;
    margin-bottom: 20rpx;
  }
  
  .card-stack {
    position: relative;
    width: 100%;
    height: 100%;
    perspective: 1000px;
  }
  
  .card-item {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 32rpx;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    transform-origin: center center;
  }
  
  .current-card {
    z-index: 10;
    
    &.card-flipping {
      transition: all 0.3s ease;
    }
  }
  
  .background-card {
    z-index: 5;
    filter: blur(1px);
  }
  
  // ========== 操作提示样式 ==========
  .operation-tips {
    position: absolute;
    right: 32rpx;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    gap: 24rpx;
    z-index: 15;
    transition: opacity 0.3s ease;
    
    &.tips-hidden {
      opacity: 0;
    }
  }
  
  .tip-item {
    display: flex;
    align-items: center;
    gap: 8rpx;
    background: rgba(0, 0, 0, 0.6);
    padding: 12rpx 16rpx;
    border-radius: 20rpx;
    opacity: 0.7;
    backdrop-filter: blur(10rpx);
  }
  
  .tip-icon {
    width: 24rpx;
    height: 24rpx;
  }
  
  .tip-text {
    font-size: 20rpx;
    color: white;
  }
  
  // ========== 底部操作栏样式 ==========
  .bottom-actions {
    height: 120rpx;
    background: white;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40rpx;
    border-top: 1rpx solid #f0f0f0;
    box-shadow: 0 -2rpx 10rpx rgba(0, 0, 0, 0.05);
  }
  
  .action-button {
    display: flex;
    align-items: center;
    gap: 8rpx;
    padding: 16rpx 24rpx;
    background: rgba(76, 175, 80, 0.1);
    border-radius: 24rpx;
    transition: all 0.3s ease;
    
    &:active:not(.btn-disabled) {
      transform: scale(0.95);
      background: rgba(76, 175, 80, 0.2);
    }
    
    &.btn-disabled {
      opacity: 0.3;
      pointer-events: none;
    }
  }
  
  .action-icon {
    width: 24rpx;
    height: 24rpx;
  }
  
  .action-text {
    font-size: 24rpx;
    color: #4caf50;
    font-weight: 500;
  }
  
  .card-counter {
    display: flex;
    align-items: center;
    gap: 8rpx;
  }
  
  .counter-text, .counter-total {
    font-size: 28rpx;
    font-weight: 600;
    color: #333;
  }
  
  .counter-text {
    color: #4caf50;
  }
  
  .counter-divider {
    width: 2rpx;
    height: 24rpx;
    background: #ddd;
  }
  
  // ========== 响应式适配 ==========
  @media screen and (max-width: 750rpx) {
    .search-mode {
      padding: 20rpx 24rpx;
    }
    
    .card-stack-container {
      padding: 16rpx 24rpx;
    }
    
    .operation-tips {
      right: 24rpx;
    }
    
    .bottom-actions {
      padding: 0 32rpx;
    }
  }
  </style>