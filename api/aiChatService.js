/**
 * AI聊天服务
 * 提供与大模型的对话接口
 */

import { request } from '@/utils/request.js';
import { AI_CONFIG } from '@/config/ai.js';

/**
 * AI聊天服务类
 */
class AIChatService {
  
  constructor() {
    // 对话上下文管理
    this.conversationContext = [];
    // 最大上下文长度
    this.maxContextLength = 10;
    // 当前会话ID
    this.sessionId = null;
  }

  /**
   * 初始化聊天会话
   * @returns {Promise<Object>} 会话信息
   */
  async initChatSession() {
    try {
      const response = await request({
        url: `${AI_CONFIG.BASE_URL}/chat/session/init`,
        method: 'POST',
        data: {
          model: AI_CONFIG.MODEL_NAME,
          system_prompt: AI_CONFIG.SYSTEM_PROMPT,
          temperature: AI_CONFIG.TEMPERATURE,
          max_tokens: AI_CONFIG.MAX_TOKENS
        }
      });
      
      this.sessionId = response.data.session_id;
      
      return {
        code: 200,
        data: response.data,
        message: '会话初始化成功'
      };
      
    } catch (error) {
      console.error('初始化聊天会话失败:', error);
      throw new Error('初始化聊天会话失败');
    }
  }

  /**
   * 发送消息给AI
   * @param {String} message - 用户消息
   * @param {Object} options - 发送选项
   * @param {Boolean} options.stream - 是否流式响应
   * @param {Array} options.context - 额外上下文
   * @returns {Promise<Object>} AI回复
   */
  async sendMessage(message, options = {}) {
    try {
      if (!message || message.trim() === '') {
        throw new Error('消息内容不能为空');
      }
      
      // 如果没有会话ID，先初始化
      if (!this.sessionId) {
        await this.initChatSession();
      }
      
      const { stream = false, context = [] } = options;
      
      // 构建请求消息
      const requestData = {
        session_id: this.sessionId,
        message: message.trim(),
        context: [...this.conversationContext, ...context],
        stream,
        model_config: {
          temperature: AI_CONFIG.TEMPERATURE,
          max_tokens: AI_CONFIG.MAX_TOKENS,
          top_p: AI_CONFIG.TOP_P,
          frequency_penalty: AI_CONFIG.FREQUENCY_PENALTY,
          presence_penalty: AI_CONFIG.PRESENCE_PENALTY
        }
      };
      
      // 发送请求
      const response = await request({
        url: `${AI_CONFIG.BASE_URL}/chat/completions`,
        method: 'POST',
        data: requestData,
        timeout: AI_CONFIG.REQUEST_TIMEOUT
      });
      
      // 更新对话上下文
      this.updateConversationContext(message, response.data.reply);
      
      return {
        code: 200,
        data: response.data,
        message: '发送成功'
      };
      
    } catch (error) {
      console.error('发送消息失败:', error);
      
      // 如果是会话过期，尝试重新初始化
      if (error.code === 'SESSION_EXPIRED') {
        this.sessionId = null;
        this.conversationContext = [];
        throw new Error('会话已过期，请重新开始对话');
      }
      
      throw new Error('发送消息失败，请重试');
    }
  }

  /**
   * 流式发送消息
   * @param {String} message - 用户消息
   * @param {Function} onChunk - 接收数据块的回调函数
   * @param {Object} options - 发送选项
   * @returns {Promise<Object>} 最终回复
   */
  async sendMessageStream(message, onChunk, options = {}) {
    try {
      if (!message || message.trim() === '') {
        throw new Error('消息内容不能为空');
      }
      
      if (typeof onChunk !== 'function') {
        throw new Error('onChunk必须是一个函数');
      }
      
      // 如果没有会话ID，先初始化
      if (!this.sessionId) {
        await this.initChatSession();
      }
      
      const { context = [] } = options;
      
      // 构建请求数据
      const requestData = {
        session_id: this.sessionId,
        message: message.trim(),
        context: [...this.conversationContext, ...context],
        stream: true,
        model_config: {
          temperature: AI_CONFIG.TEMPERATURE,
          max_tokens: AI_CONFIG.MAX_TOKENS,
          top_p: AI_CONFIG.TOP_P
        }
      };
      
      // 发送流式请求
      const response = await request({
        url: `${AI_CONFIG.BASE_URL}/chat/stream`,
        method: 'POST',
        data: requestData,
        responseType: 'stream',
        timeout: AI_CONFIG.STREAM_TIMEOUT
      });
      
      let fullReply = '';
      
      // 处理流式数据
      response.onData = (chunk) => {
        try {
          const data = JSON.parse(chunk);
          if (data.type === 'chunk') {
            fullReply += data.content;
            onChunk(data.content, false);
          } else if (data.type === 'done') {
            onChunk('', true);
          }
        } catch (e) {
          console.error('解析流式数据失败:', e);
        }
      };
      
      response.onEnd = () => {
        // 更新对话上下文
        this.updateConversationContext(message, fullReply);
      };
      
      response.onError = (error) => {
        console.error('流式响应错误:', error);
        throw new Error('接收流式响应失败');
      };
      
      return {
        code: 200,
        data: { reply: fullReply },
        message: '发送成功'
      };
      
    } catch (error) {
      console.error('流式发送消息失败:', error);
      throw new Error('流式发送消息失败，请重试');
    }
  }

  /**
   * 图片识别并获取AI解答
   * @param {String} imagePath - 图片路径
   * @param {String} question - 关于图片的问题
   * @returns {Promise<Object>} AI回复
   */
  async analyzeImageWithAI(imagePath, question = '请识别这张图片中的鸟类并介绍相关信息') {
    try {
      if (!imagePath) {
        throw new Error('图片路径不能为空');
      }
      
      // 如果没有会话ID，先初始化
      if (!this.sessionId) {
        await this.initChatSession();
      }
      
      // 上传图片并分析
      const response = await request({
        url: `${AI_CONFIG.BASE_URL}/vision/analyze`,
        method: 'POST',
        filePath: imagePath,
        name: 'image',
        formData: {
          session_id: this.sessionId,
          question: question,
          analysis_type: 'bird_identification',
          detail_level: 'high'
        },
        timeout: AI_CONFIG.VISION_TIMEOUT
      });
      
      // 更新对话上下文
      this.updateConversationContext(
        `[图片分析] ${question}`, 
        response.data.analysis
      );
      
      return {
        code: 200,
        data: response.data,
        message: '图片分析成功'
      };
      
    } catch (error) {
      console.error('图片分析失败:', error);
      throw new Error('图片分析失败，请重试');
    }
  }

  /**
   * 语音转文字
   * @param {String} audioPath - 音频文件路径
   * @returns {Promise<Object>} 转换结果
   */
  async speechToText(audioPath) {
    try {
      if (!audioPath) {
        throw new Error('音频路径不能为空');
      }
      
      const response = await request({
        url: `${AI_CONFIG.BASE_URL}/speech/recognize`,
        method: 'POST',
        filePath: audioPath,
        name: 'audio',
        formData: {
          language: 'zh-CN',
          model: 'whisper-1'
        },
        timeout: AI_CONFIG.SPEECH_TIMEOUT
      });
      
      return {
        code: 200,
        data: response.data,
        message: '语音识别成功'
      };
      
    } catch (error) {
      console.error('语音识别失败:', error);
      throw new Error('语音识别失败，请重试');
    }
  }

  /**
   * 文字转语音
   * @param {String} text - 要转换的文字
   * @param {Object} options - 转换选项
   * @returns {Promise<Object>} 音频文件信息
   */
  async textToSpeech(text, options = {}) {
    try {
      if (!text || text.trim() === '') {
        throw new Error('文字内容不能为空');
      }
      
      const {
        voice = 'zh-CN-XiaoxiaoNeural',
        speed = 1.0,
        pitch = 0
      } = options;
      
      const response = await request({
        url: `${AI_CONFIG.BASE_URL}/speech/synthesize`,
        method: 'POST',
        data: {
          text: text.trim(),
          voice,
          speed,
          pitch,
          format: 'mp3'
        },
        responseType: 'blob',
        timeout: AI_CONFIG.SPEECH_TIMEOUT
      });
      
      return {
        code: 200,
        data: response.data,
        message: '语音合成成功'
      };
      
    } catch (error) {
      console.error('语音合成失败:', error);
      throw new Error('语音合成失败，请重试');
    }
  }

  /**
   * 获取AI建议的快速回复
   * @param {String} lastMessage - 最后一条消息
   * @returns {Promise<Array>} 快速回复建议
   */
  async getQuickReplySuggestions(lastMessage) {
    try {
      if (!lastMessage) {
        return [];
      }
      
      const response = await request({
        url: `${AI_CONFIG.BASE_URL}/suggestions/quick-replies`,
        method: 'POST',
        data: {
          last_message: lastMessage,
          context: this.conversationContext.slice(-3), // 最近3条消息作为上下文
          domain: 'bird_watching'
        }
      });
      
      return response.data.suggestions || [];
      
    } catch (error) {
      console.error('获取快速回复建议失败:', error);
      return [];
    }
  }

  /**
   * 获取聊天历史记录
   * @param {Object} params - 查询参数
   * @param {Number} params.page - 页码
   * @param {Number} params.size - 每页数量
   * @returns {Promise<Object>} 聊天历史
   */
  async getChatHistory(params = {}) {
    try {
      const { page = 1, size = 50 } = params;
      
      if (!this.sessionId) {
        return {
          code: 200,
          data: { messages: [], total: 0 },
          message: '暂无聊天记录'
        };
      }
      
      const response = await request({
        url: `${AI_CONFIG.BASE_URL}/chat/history`,
        method: 'GET',
        data: {
          session_id: this.sessionId,
          page,
          size
        }
      });
      
      return {
        code: 200,
        data: response.data,
        message: '获取成功'
      };
      
    } catch (error) {
      console.error('获取聊天历史失败:', error);
      throw new Error('获取聊天历史失败');
    }
  }

  /**
   * 清除聊天历史
   * @returns {Promise<Object>} 清除结果
   */
  async clearChatHistory() {
    try {
      if (!this.sessionId) {
        return {
          code: 200,
          message: '聊天记录已清空'
        };
      }
      
      await request({
        url: `${AI_CONFIG.BASE_URL}/chat/history/clear`,
        method: 'DELETE',
        data: {
          session_id: this.sessionId
        }
      });
      
      // 清除本地上下文
      this.conversationContext = [];
      
      return {
        code: 200,
        message: '聊天记录已清空'
      };
      
    } catch (error) {
      console.error('清除聊天历史失败:', error);
      throw new Error('清除聊天历史失败');
    }
  }

  /**
   * 导出聊天记录
   * @param {String} format - 导出格式 (txt|json|pdf)
   * @returns {Promise<Object>} 导出结果
   */
  async exportChatHistory(format = 'txt') {
    try {
      if (!this.sessionId) {
        throw new Error('暂无聊天记录可导出');
      }
      
      const response = await request({
        url: `${AI_CONFIG.BASE_URL}/chat/export`,
        method: 'POST',
        data: {
          session_id: this.sessionId,
          format,
          include_metadata: true
        },
        responseType: 'blob'
      });
      
      return {
        code: 200,
        data: response.data,
        message: '导出成功'
      };
      
    } catch (error) {
      console.error('导出聊天记录失败:', error);
      throw new Error('导出聊天记录失败');
    }
  }

  /**
   * 评价AI回复质量
   * @param {String} messageId - 消息ID
   * @param {Number} rating - 评分 (1-5)
   * @param {String} feedback - 反馈内容
   * @returns {Promise<Object>} 评价结果
   */
  async rateAIResponse(messageId, rating, feedback = '') {
    try {
      if (!messageId) {
        throw new Error('消息ID不能为空');
      }
      
      if (rating < 1 || rating > 5) {
        throw new Error('评分必须在1-5之间');
      }
      
      const response = await request({
        url: `${AI_CONFIG.BASE_URL}/feedback/rate`,
        method: 'POST',
        data: {
          message_id: messageId,
          rating,
          feedback: feedback.trim(),
          session_id: this.sessionId
        }
      });
      
      return {
        code: 200,
        data: response.data,
        message: '感谢您的反馈'
      };
      
    } catch (error) {
      console.error('提交评价失败:', error);
      throw new Error('提交评价失败，请重试');
    }
  }

  /**
   * 更新对话上下文
   * @param {String} userMessage - 用户消息
   * @param {String} aiReply - AI回复
   * @private
   */
  updateConversationContext(userMessage, aiReply) {
    // 添加新的对话
    this.conversationContext.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: aiReply }
    );
    
    // 保持上下文长度在限制范围内
    if (this.conversationContext.length > this.maxContextLength * 2) {
      this.conversationContext = this.conversationContext.slice(-this.maxContextLength * 2);
    }
  }

  /**
   * 获取当前会话状态
   * @returns {Object} 会话状态信息
   */
  getSessionStatus() {
    return {
      sessionId: this.sessionId,
      contextLength: this.conversationContext.length,
      isActive: !!this.sessionId,
      lastActivity: new Date().toISOString()
    };
  }

  /**
   * 重置会话
   */
  resetSession() {
    this.sessionId = null;
    this.conversationContext = [];
  }

  /**
   * 设置系统提示词
   * @param {String} systemPrompt - 系统提示词
   */
  setSystemPrompt(systemPrompt) {
    // 这将在下次初始化会话时生效
    AI_CONFIG.SYSTEM_PROMPT = systemPrompt;
  }

  /**
   * 获取AI模型信息
   * @returns {Promise<Object>} 模型信息
   */
  async getModelInfo() {
    try {
      const response = await request({
        url: `${AI_CONFIG.BASE_URL}/models/info`,
        method: 'GET',
        data: {
          model: AI_CONFIG.MODEL_NAME
        }
      });
      
      return {
        code: 200,
        data: response.data,
        message: '获取成功'
      };
      
    } catch (error) {
      console.error('获取模型信息失败:', error);
      throw new Error('获取模型信息失败');
    }
  }
}

// 导出单例实例
export default new AIChatService();