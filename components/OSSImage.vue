<!--
  OSS图片组件
  提供自动优化、懒加载、错误处理等功能的图片组件
  @author Frontend Developer
  @date 2025-07-03
-->

<template>
  <div 
    class="oss-image-container"
    :class="containerClasses"
    :style="containerStyles"
  >
    <!-- 加载占位符 -->
    <div 
      v-if="isLoading && showPlaceholder" 
      class="oss-image-placeholder"
      :style="placeholderStyles"
    >
      <div class="oss-image-placeholder-content">
        <div class="oss-image-loading-spinner" v-if="!customPlaceholder">
          <svg class="animate-spin" viewBox="0 0 24 24">
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              stroke-width="2" 
              fill="none" 
              stroke-dasharray="32" 
              stroke-dashoffset="32"
            >
              <animate 
                attributeName="stroke-dasharray" 
                dur="2s" 
                values="0 32;16 16;0 32;0 32" 
                repeatCount="indefinite"
              />
              <animate 
                attributeName="stroke-dashoffset" 
                dur="2s" 
                values="0;-16;-32;-32" 
                repeatCount="indefinite"
              />
            </circle>
          </svg>
        </div>
        <slot name="placeholder" v-else />
      </div>
    </div>

    <!-- 错误占位符 -->
    <div 
      v-if="hasError && showErrorPlaceholder" 
      class="oss-image-error"
      :style="errorStyles"
      @click="handleRetry"
    >
      <div class="oss-image-error-content">
        <div class="oss-image-error-icon" v-if="!customErrorPlaceholder">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
            <path d="M12 9v4"/>
            <circle cx="12" cy="17" r="1"/>
          </svg>
          <p class="oss-image-error-text">图片加载失败</p>
          <button class="oss-image-retry-btn" v-if="enableRetry">
            点击重试
          </button>
        </div>
        <slot name="error" v-else />
      </div>
    </div>

    <!-- 主图片 -->
    <picture v-if="!hasError" class="oss-image-picture">
      <!-- WebP源 -->
      <source
        v-if="enableWebP && webpSrcSet"
        :srcset="webpSrcSet"
        :sizes="sizes"
        type="image/webp"
      />
      
      <!-- 回退源 -->
      <img
        ref="imageRef"
        :src="currentSrc"
        :srcset="srcSet"
        :sizes="sizes"
        :alt="alt"
        :loading="nativeLazyLoad ? 'lazy' : 'eager'"
        :class="imageClasses"
        :style="imageStyles"
        @load="handleLoad"
        @error="handleError"
        @click="handleClick"
      />
    </picture>

    <!-- 图片遮罩效果 -->
    <div 
      v-if="overlay" 
      class="oss-image-overlay"
      :class="overlayClasses"
      :style="overlayStyles"
    >
      <slot name="overlay" />
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { getImageUrl, generateSrcSet, preloadImages } from '@/utils/oss.js'

export default {
  name: 'OSSImage',
  
  props: {
    // 图片源文件名（OSS中的路径）
    src: {
      type: String,
      required: true
    },
    
    // 图片alt属性
    alt: {
      type: String,
      default: ''
    },
    
    // 图片尺寸预设 (thumbnail|small|medium|large|banner)
    size: {
      type: String,
      default: 'medium'
    },
    
    // 自定义宽度
    width: {
      type: [Number, String],
      default: null
    },
    
    // 自定义高度
    height: {
      type: [Number, String],
      default: null
    },
    
    // 图片质量 (1-100)
    quality: {
      type: Number,
      default: 80,
      validator: (value) => value >= 1 && value <= 100
    },
    
    // 图片格式
    format: {
      type: String,
      default: 'webp',
      validator: (value) => ['jpg', 'png', 'webp', 'gif', 'original'].includes(value)
    },
    
    // 是否启用懒加载
    lazy: {
      type: Boolean,
      default: true
    },
    
    // 是否使用原生懒加载
    nativeLazyLoad: {
      type: Boolean,
      default: true
    },
    
    // 响应式图片尺寸
    responsive: {
      type: [Boolean, Array],
      default: false
    },
    
    // sizes属性
    sizes: {
      type: String,
      default: '100vw'
    },
    
    // 是否启用WebP格式
    enableWebP: {
      type: Boolean,
      default: true
    },
    
    // 是否显示加载占位符
    showPlaceholder: {
      type: Boolean,
      default: true
    },
    
    // 是否显示错误占位符
    showErrorPlaceholder: {
      type: Boolean,
      default: true
    },
    
    // 是否启用重试功能
    enableRetry: {
      type: Boolean,
      default: true
    },
    
    // 最大重试次数
    maxRetries: {
      type: Number,
      default: 3
    },
    
    // 是否预加载
    preload: {
      type: Boolean,
      default: false
    },
    
    // 圆角样式
    rounded: {
      type: [Boolean, String],
      default: false
    },
    
    // 阴影效果
    shadow: {
      type: [Boolean, String],
      default: false
    },
    
    // 悬停效果
    hover: {
      type: [Boolean, String],
      default: false
    },
    
    // 是否启用遮罩
    overlay: {
      type: Boolean,
      default: false
    },
    
    // 容器CSS类
    containerClass: {
      type: [String, Array, Object],
      default: ''
    },
    
    // 图片CSS类
    imageClass: {
      type: [String, Array, Object],
      default: ''
    },
    
    // 自定义样式
    customStyles: {
      type: Object,
      default: () => ({})
    }
  },
  
  emits: ['load', 'error', 'click', 'retry'],
  
  setup(props, { emit, slots }) {
    // 响应式数据
    const imageRef = ref(null)
    const isLoading = ref(true)
    const hasError = ref(false)
    const retryCount = ref(0)
    const intersectionObserver = ref(null)
    const isIntersecting = ref(false)
    
    // 计算属性
    const currentSrc = computed(() => {
      if (hasError.value) return ''
      
      // 如果启用懒加载且图片不在视窗内，返回空字符串
      if (props.lazy && !props.nativeLazyLoad && !isIntersecting.value) {
        return ''
      }
      
      return getImageUrl(props.src, {
        size: props.size,
        width: props.width,
        height: props.height,
        quality: props.quality,
        format: props.format
      })
    })
    
    const srcSet = computed(() => {
      if (hasError.value || !props.responsive) return ''
      
      const sizes = Array.isArray(props.responsive) 
        ? props.responsive 
        : ['small', 'medium', 'large']
      
      return generateSrcSet(props.src, 
        sizes.reduce((acc, size) => {
          acc[size] = `${size === 'small' ? 480 : size === 'medium' ? 768 : 1200}w`
          return acc
        }, {}),
        {
          quality: props.quality,
          format: props.format === 'webp' ? 'jpg' : props.format // srcSet回退格式
        }
      )
    })
    
    const webpSrcSet = computed(() => {
      if (hasError.value || !props.responsive || !props.enableWebP) return ''
      
      const sizes = Array.isArray(props.responsive) 
        ? props.responsive 
        : ['small', 'medium', 'large']
      
      return generateSrcSet(props.src, 
        sizes.reduce((acc, size) => {
          acc[size] = `${size === 'small' ? 480 : size === 'medium' ? 768 : 1200}w`
          return acc
        }, {}),
        {
          quality: props.quality,
          format: 'webp'
        }
      )
    })
    
    // 样式计算
    const containerClasses = computed(() => [
      'oss-image-container',
      {
        'oss-image-loading': isLoading.value,
        'oss-image-error-state': hasError.value,
        'oss-image-rounded': props.rounded,
        'oss-image-shadow': props.shadow,
        'oss-image-hover': props.hover
      },
      props.containerClass
    ])
    
    const imageClasses = computed(() => [
      'oss-image',
      {
        'oss-image-loaded': !isLoading.value && !hasError.value,
        [`oss-image-rounded-${props.rounded}`]: typeof props.rounded === 'string',
        [`oss-image-shadow-${props.shadow}`]: typeof props.shadow === 'string',
        [`oss-image-hover-${props.hover}`]: typeof props.hover === 'string'
      },
      props.imageClass
    ])
    
    const containerStyles = computed(() => ({
      width: props.width ? `${props.width}px` : undefined,
      height: props.height ? `${props.height}px` : undefined,
      ...props.customStyles
    }))
    
    const imageStyles = computed(() => ({
      objectFit: props.width && props.height ? 'cover' : 'contain'
    }))
    
    const placeholderStyles = computed(() => ({
      backgroundColor: '#f3f4f6',
      color: '#9ca3af'
    }))
    
    const errorStyles = computed(() => ({
      backgroundColor: '#fee2e2',
      color: '#dc2626'
    }))
    
    const overlayClasses = computed(() => [
      'oss-image-overlay',
      {
        'oss-image-overlay-visible': !isLoading.value && !hasError.value
      }
    ])
    
    const overlayStyles = computed(() => ({}))
    
    // 检查是否有自定义插槽
    const customPlaceholder = computed(() => !!slots.placeholder)
    const customErrorPlaceholder = computed(() => !!slots.error)
    
    // 方法
    const handleLoad = () => {
      isLoading.value = false
      hasError.value = false
      emit('load', imageRef.value)
    }
    
    const handleError = (event) => {
      isLoading.value = false
      hasError.value = true
      emit('error', event)
    }
    
    const handleClick = (event) => {
      emit('click', event)
    }
    
    const handleRetry = () => {
      if (retryCount.value < props.maxRetries) {
        retryCount.value++
        hasError.value = false
        isLoading.value = true
        
        // 强制重新加载图片
        nextTick(() => {
          if (imageRef.value) {
            imageRef.value.src = currentSrc.value
          }
        })
        
        emit('retry', retryCount.value)
      }
    }
    
    // 初始化交叉观察器（用于懒加载）
    const initIntersectionObserver = () => {
      if (!props.lazy || props.nativeLazyLoad || typeof window === 'undefined') return
      
      intersectionObserver.value = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              isIntersecting.value = true
              intersectionObserver.value?.disconnect()
            }
          })
        },
        {
          rootMargin: '50px' // 提前50px开始加载
        }
      )
    }
    
    // 生命周期
    onMounted(() => {
      initIntersectionObserver()
      
      if (intersectionObserver.value && imageRef.value?.parentElement) {
        intersectionObserver.value.observe(imageRef.value.parentElement)
      }
      
      // 如果启用预加载
      if (props.preload) {
        preloadImages([currentSrc.value])
      }
    })
    
    onUnmounted(() => {
      intersectionObserver.value?.disconnect()
    })
    
    // 监听src变化
    watch(() => props.src, () => {
      isLoading.value = true
      hasError.value = false
      retryCount.value = 0
    })
    
    return {
      // refs
      imageRef,
      
      // reactive data
      isLoading,
      hasError,
      
      // computed
      currentSrc,
      srcSet,
      webpSrcSet,
      containerClasses,
      imageClasses,
      containerStyles,
      imageStyles,
      placeholderStyles,
      errorStyles,
      overlayClasses,
      overlayStyles,
      customPlaceholder,
      customErrorPlaceholder,
      
      // methods
      handleLoad,
      handleError,
      handleClick,
      handleRetry
    }
  }
}
</script>

<style scoped>
/* OSS图片容器样式 */
.oss-image-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* 图片样式 */
.oss-image {
  width: 100%;
  height: 100%;
  display: block;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 0;
  transform: scale(1.05);
}

.oss-image-loaded {
  opacity: 1;
  transform: scale(1);
}

/* 占位符样式 */
.oss-image-placeholder,
.oss-image-error {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.3s ease;
}

.oss-image-placeholder-content,
.oss-image-error-content {
  text-align: center;
  padding: 1rem;
}

/* 加载动画 */
.oss-image-loading-spinner {
  width: 2rem;
  height: 2rem;
  margin: 0 auto 0.5rem;
  color: #6b7280;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 错误状态样式 */
.oss-image-error-icon svg {
  width: 2rem;
  height: 2rem;
  margin: 0 auto 0.5rem;
}

.oss-image-error-text {
  font-size: 0.875rem;
  margin: 0.5rem 0;
}

.oss-image-retry-btn {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.oss-image-retry-btn:hover {
  background: #b91c1c;
}

/* 圆角样式 */
.oss-image-rounded {
  border-radius: 0.5rem;
}

.oss-image-rounded-sm { border-radius: 0.25rem; }
.oss-image-rounded-md { border-radius: 0.375rem; }
.oss-image-rounded-lg { border-radius: 0.5rem; }
.oss-image-rounded-xl { border-radius: 0.75rem; }
.oss-image-rounded-full { border-radius: 9999px; }

/* 阴影样式 */
.oss-image-shadow {
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.oss-image-shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.oss-image-shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
.oss-image-shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
.oss-image-shadow-xl { box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }

/* 悬停效果 */
.oss-image-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.oss-image-hover-scale:hover .oss-image {
  transform: scale(1.05);
}

.oss-image-hover-zoom:hover {
  overflow: hidden;
}

.oss-image-hover-zoom:hover .oss-image {
  transform: scale(1.1);
}

/* 遮罩层 */
.oss-image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.oss-image-overlay-visible:hover {
  opacity: 1;
}

/* 响应式设计 */
@media (max-width: 640px) {
  .oss-image-container {
    width: 100%;
  }
}
</style>