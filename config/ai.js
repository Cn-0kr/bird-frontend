/**
 * AI配置文件
 * 统一管理AI相关的配置
 */

// AI服务提供商配置
const AI_PROVIDERS = {
    // OpenAI配置
    openai: {
      BASE_URL: 'https://api.openai.com/v1',
      MODEL_NAME: 'gpt-4o-mini',
      API_KEY: process.env.OPENAI_API_KEY || '',
      ORGANIZATION: process.env.OPENAI_ORGANIZATION || ''
    },
    
    // Claude配置 (Anthropic)
    claude: {
      BASE_URL: 'https://api.anthropic.com/v1',
      MODEL_NAME: 'claude-3-sonnet-20240229',
      API_KEY: process.env.ANTHROPIC_API_KEY || '',
      VERSION: '2023-06-01'
    },
    
    // 百度文心一言配置
    wenxin: {
      BASE_URL: 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/wenxinworkshop',
      MODEL_NAME: 'ernie-4.0-8k',
      API_KEY: process.env.WENXIN_API_KEY || '',
      SECRET_KEY: process.env.WENXIN_SECRET_KEY || ''
    },
    
    // 阿里通义千问配置
    qwen: {
      BASE_URL: 'https://dashscope.aliyuncs.com/api/v1',
      MODEL_NAME: 'qwen-turbo',
      API_KEY: process.env.DASHSCOPE_API_KEY || ''
    },
    
    // 腾讯混元配置
    hunyuan: {
      BASE_URL: 'https://hunyuan.tencentcloudapi.com',
      MODEL_NAME: 'hunyuan-lite',
      SECRET_ID: process.env.TENCENT_SECRET_ID || '',
      SECRET_KEY: process.env.TENCENT_SECRET_KEY || ''
    },
    
    // 自部署配置
    custom: {
      BASE_URL: process.env.CUSTOM_AI_BASE_URL || 'http://localhost:8000/v1',
      MODEL_NAME: process.env.CUSTOM_AI_MODEL || 'llama-3-8b-instruct',
      API_KEY: process.env.CUSTOM_AI_API_KEY || ''
    }
  };
  
  // 当前使用的AI提供商
  const CURRENT_PROVIDER = process.env.AI_PROVIDER || 'openai';
  
  // AI基础配置
  export const AI_CONFIG = {
    // 当前提供商配置
    ...AI_PROVIDERS[CURRENT_PROVIDER],
    
    // 模型参数配置
    MODEL_CONFIG: {
      // 温度参数 (0-2, 控制随机性)
      TEMPERATURE: 0.7,
      // 最大输出tokens
      MAX_TOKENS: 2048,
      // Top-p参数 (0-1, 核心采样)
      TOP_P: 0.9,
      // 频率惩罚 (-2 to 2)
      FREQUENCY_PENALTY: 0.1,
      // 存在惩罚 (-2 to 2)
      PRESENCE_PENALTY: 0.1,
      // 停止序列
      STOP_SEQUENCES: ['Human:', 'Assistant:', '用户:', '助手:']
    },
    
    // 系统提示词
    SYSTEM_PROMPT: `你是一个专业的鸟类专家和观鸟向导，名叫"小羽"。你的任务是帮助用户识别鸟类、了解鸟类知识、学习观鸟技巧。
  
  你的特点：
  1. 拥有丰富的鸟类学知识，熟悉全球各地的鸟类种类
  2. 善于用简单易懂的语言解释复杂的鸟类行为和生态知识
  3. 热情友好，对用户的每个问题都耐心回答
  4. 能够根据用户描述的特征准确识别鸟类
  5. 擅长给出实用的观鸟建议和保护意见
  
  回答要求：
  - 回答要准确、详细但不冗长
  - 使用温和友好的语气
  - 适当加入有趣的鸟类小知识
  - 如果不确定，请诚实说明并提供可能的选项
  - 鼓励用户保护鸟类和环境`,
  
    // 请求配置
    REQUEST_CONFIG: {
      // 标准请求超时 (毫秒)
      REQUEST_TIMEOUT: 30000,
      // 流式请求超时 (毫秒)
      STREAM_TIMEOUT: 60000,
      // 图像分析超时 (毫秒)
      VISION_TIMEOUT: 45000,
      // 语音处理超时 (毫秒)
      SPEECH_TIMEOUT: 30000,
      // 重试次数
      RETRY_COUNT: 3,
      // 重试延迟 (毫秒)
      RETRY_DELAY: 1000
    },
    
    // 图像识别配置
    VISION_CONFIG: {
      // 支持的图片格式
      SUPPORTED_FORMATS: ['jpg', 'jpeg', 'png', 'webp'],
      // 最大图片大小 (MB)
      MAX_IMAGE_SIZE: 20,
      // 图片质量压缩比例
      COMPRESSION_QUALITY: 0.8,
      // 最大分辨率
      MAX_RESOLUTION: 2048,
      // 识别置信度阈值
      CONFIDENCE_THRESHOLD: 0.7
    },
    
    // 语音配置
    SPEECH_CONFIG: {
      // 语音识别
      STT: {
        // 支持的音频格式
        SUPPORTED_FORMATS: ['mp3', 'wav', 'aac', 'm4a'],
        // 最大音频时长 (秒)
        MAX_DURATION: 300,
        // 最大文件大小 (MB)
        MAX_FILE_SIZE: 25,
        // 语言设置
        LANGUAGE: 'zh-CN',
        // 采样率
        SAMPLE_RATE: 16000
      },
      
      // 语音合成
      TTS: {
        // 默认语音
        DEFAULT_VOICE: 'zh-CN-XiaoxiaoNeural',
        // 语速 (0.5-2.0)
        SPEECH_RATE: 1.0,
        // 音调 (-50 to 50)
        PITCH: 0,
        // 音量 (0-100)
        VOLUME: 80,
        // 输出格式
        OUTPUT_FORMAT: 'mp3'
      }
    },
    
    // 对话管理配置
    CONVERSATION_CONFIG: {
      // 最大上下文长度 (消息对数)
      MAX_CONTEXT_LENGTH: 20,
      // 会话超时时间 (分钟)
      SESSION_TIMEOUT: 30,
      // 消息历史保存天数
      MESSAGE_HISTORY_DAYS: 30,
      // 是否启用上下文压缩
      ENABLE_CONTEXT_COMPRESSION: true,
      // 上下文压缩阈值
      COMPRESSION_THRESHOLD: 15
    },
    
    // 内容安全配置
    SAFETY_CONFIG: {
      // 内容过滤级别 (low|medium|high)
      CONTENT_FILTER_LEVEL: 'medium',
      // 是否启用敏感词检测
      ENABLE_SENSITIVE_WORD_DETECTION: true,
      // 敏感词处理方式 (block|replace|warn)
      SENSITIVE_WORD_ACTION: 'warn',
      // 用户输入长度限制
      MAX_INPUT_LENGTH: 2000,
      // 单次对话频率限制 (秒)
      RATE_LIMIT_INTERVAL: 1
    },
    
    // 功能开关配置
    FEATURE_FLAGS: {
      // 是否启用流式响应
      ENABLE_STREAMING: true,
      // 是否启用图像识别
      ENABLE_VISION: true,
      // 是否启用语音功能
      ENABLE_SPEECH: true,
      // 是否启用多模态对话
      ENABLE_MULTIMODAL: true,
      // 是否启用上下文学习
      ENABLE_CONTEXT_LEARNING: true,
      // 是否启用快速回复建议
      ENABLE_QUICK_REPLY: true,
      // 是否启用情感分析
      ENABLE_SENTIMENT_ANALYSIS: false,
      // 是否启用对话总结
      ENABLE_CONVERSATION_SUMMARY: true
    },
    
    // 缓存配置
    CACHE_CONFIG: {
      // 是否启用缓存
      ENABLE_CACHE: true,
      // 缓存TTL (秒)
      CACHE_TTL: 3600,
      // 缓存键前缀
      CACHE_PREFIX: 'ai_chat_',
      // 最大缓存条目数
      MAX_CACHE_ENTRIES: 1000
    },
    
    // 监控和日志配置
    MONITORING_CONFIG: {
      // 是否启用请求日志
      ENABLE_REQUEST_LOGGING: true,
      // 是否启用性能监控
      ENABLE_PERFORMANCE_MONITORING: true,
      // 是否启用错误追踪
      ENABLE_ERROR_TRACKING: true,
      // 日志级别 (debug|info|warn|error)
      LOG_LEVEL: 'info',
      // 是否记录用户反馈
      ENABLE_FEEDBACK_LOGGING: true
    }
  };
  
  // 预设的鸟类识别提示词模板
  export const BIRD_IDENTIFICATION_PROMPTS = {
    // 基础识别模板
    BASIC_IDENTIFICATION: `请根据以下信息识别鸟类：
  特征描述：{description}
  观察地点：{location}
  观察时间：{time}
  额外信息：{additional_info}
  
  请提供：
  1. 最可能的鸟类种类（中文名和学名）
  2. 识别的置信度
  3. 主要识别依据
  4. 相似物种的区别
  5. 该鸟类的基本信息`,
  
    // 图片识别模板
    IMAGE_IDENTIFICATION: `请分析这张鸟类图片：
  
  请提供：
  1. 鸟类种类识别（中文名、英文名、学名）
  2. 识别置信度评估
  3. 主要识别特征分析
  4. 该鸟类的生态习性
  5. 拍摄建议和观察要点`,
  
    // 声音识别模板
    SOUND_IDENTIFICATION: `请根据鸟类叫声特征进行识别：
  声音描述：{sound_description}
  叫声特点：{call_characteristics}
  环境背景：{environment}
  
  请提供：
  1. 可能的鸟类种类
  2. 声音特征匹配度
  3. 该鸟类的叫声含义
  4. 相似叫声的区别
  5. 录音观鸟技巧`,
  
    // 行为识别模板
    BEHAVIOR_IDENTIFICATION: `请根据观察到的鸟类行为进行识别：
  行为描述：{behavior_description}
  栖息环境：{habitat}
  群体情况：{group_info}
  活动时间：{activity_time}
  
  请提供：
  1. 基于行为的鸟类识别
  2. 行为分析和解释
  3. 该行为的生态意义
  4. 最佳观察时机和方法
  5. 相关的鸟类知识`
  };
  
  // 快速回复模板
  export const QUICK_REPLY_TEMPLATES = {
    GREETING: [
      '你好！我想了解鸟类知识',
      '帮我识别一下这只鸟',
      '推荐一些观鸟地点',
      '教我观鸟的基础知识'
    ],
    
    IDENTIFICATION: [
      '告诉我更多细节',
      '这种鸟有什么特别之处？',
      '它们通常在哪里出现？',
      '有相似的鸟类吗？'
    ],
    
    FOLLOW_UP: [
      '非常有用，谢谢！',
      '我想了解更多',
      '有相关的图片吗？',
      '还有其他问题'
    ],
    
    GUIDANCE: [
      '推荐观鸟设备',
      '观鸟的最佳时间',
      '如何拍摄鸟类照片',
      '鸟类保护知识'
    ]
  };
  
  // AI能力检测函数
  export function detectAICapabilities() {
    const capabilities = {
      textGeneration: true,
      imageAnalysis: AI_CONFIG.FEATURE_FLAGS.ENABLE_VISION,
      speechToText: AI_CONFIG.FEATURE_FLAGS.ENABLE_SPEECH,
      textToSpeech: AI_CONFIG.FEATURE_FLAGS.ENABLE_SPEECH,
      streaming: AI_CONFIG.FEATURE_FLAGS.ENABLE_STREAMING,
      multimodal: AI_CONFIG.FEATURE_FLAGS.ENABLE_MULTIMODAL
    };
    
    return capabilities;
  }
  
  // 获取模型配置
  export function getModelConfig(overrides = {}) {
    return {
      ...AI_CONFIG.MODEL_CONFIG,
      ...overrides
    };
  }
  
  // 获取系统提示词
  export function getSystemPrompt(customPrompt = '') {
    if (customPrompt) {
      return customPrompt;
    }
    return AI_CONFIG.SYSTEM_PROMPT;
  }
  
  // 获取识别提示词
  export function getIdentificationPrompt(type, variables = {}) {
    let template = BIRD_IDENTIFICATION_PROMPTS[type] || BIRD_IDENTIFICATION_PROMPTS.BASIC_IDENTIFICATION;
    
    // 替换变量
    Object.keys(variables).forEach(key => {
      template = template.replace(new RegExp(`{${key}}`, 'g'), variables[key] || '');
    });
    
    return template;
  }
  
  // 验证AI配置
  export function validateAIConfig() {
    const errors = [];
    
    if (!AI_CONFIG.API_KEY) {
      errors.push('AI API密钥未配置');
    }
    
    if (!AI_CONFIG.BASE_URL) {
      errors.push('AI服务地址未配置');
    }
    
    if (!AI_CONFIG.MODEL_NAME) {
      errors.push('AI模型名称未配置');
    }
    
    if (errors.length > 0) {
      console.warn('AI配置验证失败:', errors);
      return false;
    }
    
    return true;
  }
  
  // 获取提供商特定配置
  export function getProviderConfig(provider = CURRENT_PROVIDER) {
    return AI_PROVIDERS[provider] || AI_PROVIDERS.openai;
  }
  
  // 切换AI提供商
  export function switchAIProvider(provider) {
    if (!AI_PROVIDERS[provider]) {
      throw new Error(`不支持的AI提供商: ${provider}`);
    }
    
    Object.assign(AI_CONFIG, AI_PROVIDERS[provider]);
    return AI_CONFIG;
  }
  
  // 导出默认配置
  export default AI_CONFIG;