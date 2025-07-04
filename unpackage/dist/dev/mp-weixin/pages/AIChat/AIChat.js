"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  __name: "AIChat",
  setup(__props) {
    const inputText = common_vendor.ref("");
    const messageList = common_vendor.ref([]);
    const isAIOnline = common_vendor.ref(true);
    const isAITyping = common_vendor.ref(false);
    const scrollTop = common_vendor.ref(0);
    const hasMoreMessages = common_vendor.ref(false);
    const isInputFocused = common_vendor.ref(false);
    const isVoiceRecording = common_vendor.ref(false);
    const isRecording = common_vendor.ref(false);
    const voiceText = common_vendor.ref("正在录音...");
    const quickReplies = common_vendor.ref([]);
    const quickSuggestions = common_vendor.ref([
      {
        id: 1,
        text: "鸟类识别",
        icon: "/static/icons/identify.png"
      },
      {
        id: 2,
        text: "鸟类习性",
        icon: "/static/icons/behavior.png"
      },
      {
        id: 3,
        text: "观鸟指南",
        icon: "/static/icons/guide.png"
      },
      {
        id: 4,
        text: "保护知识",
        icon: "/static/icons/protection.png"
      }
    ]);
    const canSend = common_vendor.computed(() => {
      return inputText.value.trim().length > 0 && !isAITyping.value;
    });
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const showMenu = () => {
      common_vendor.index.showActionSheet({
        itemList: ["清空聊天记录", "导出聊天记录", "设置"],
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
    const getAIStatus = () => {
      if (isAITyping.value)
        return "正在输入...";
      if (isAIOnline.value)
        return "在线";
      return "离线";
    };
    const onInputChange = () => {
    };
    const onInputFocus = () => {
      isInputFocused.value = true;
      scrollToBottom();
    };
    const onInputBlur = () => {
      isInputFocused.value = false;
    };
    const onScrollToUpper = () => {
      if (hasMoreMessages.value) {
        loadMoreMessages();
      }
    };
    const sendMessage = async () => {
      if (!canSend.value)
        return;
      const userMessage = {
        id: Date.now(),
        type: "user",
        content: inputText.value.trim(),
        timestamp: /* @__PURE__ */ new Date()
      };
      messageList.value.push(userMessage);
      const currentInput = inputText.value.trim();
      inputText.value = "";
      await common_vendor.nextTick$1();
      scrollToBottom();
      await sendToAI(currentInput);
    };
    const sendSuggestion = (suggestion) => {
      inputText.value = suggestion.text;
      sendMessage();
    };
    const sendQuickReply = (reply) => {
      inputText.value = reply.text;
      sendMessage();
    };
    const startVoiceInput = () => {
      isVoiceRecording.value = true;
      isRecording.value = true;
      voiceText.value = "正在录音...";
    };
    const cancelVoiceInput = () => {
      isVoiceRecording.value = false;
      isRecording.value = false;
    };
    const confirmVoiceInput = () => {
      isVoiceRecording.value = false;
      isRecording.value = false;
    };
    const selectImage = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["original", "compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          handleImageRecognition(res.tempFilePaths[0]);
        }
      });
    };
    const copyMessage = (message) => {
      common_vendor.index.setClipboardData({
        data: message.content,
        success: () => {
          common_vendor.index.showToast({
            title: "已复制",
            icon: "success"
          });
        }
      });
    };
    const likeMessage = (message) => {
      message.isLiked = !message.isLiked;
      common_vendor.index.vibrateShort();
    };
    const shareMessage = (message) => {
      common_vendor.index.showShareMenu({
        title: "分享AI回答",
        path: "/pages/AIChat/AIChat"
      });
    };
    const sendToAI = async (message) => {
      try {
        const aiMessage2 = {
          id: Date.now() + 1,
          type: "ai",
          content: "",
          timestamp: /* @__PURE__ */ new Date(),
          isTyping: true
        };
        messageList.value.push(aiMessage2);
        isAITyping.value = true;
        await common_vendor.nextTick$1();
        scrollToBottom();
        await new Promise((resolve) => setTimeout(resolve, 1500));
        const aiResponse = await generateAIResponse(message);
        const aiMessageIndex = messageList.value.findIndex((msg) => msg.id === aiMessage2.id);
        if (aiMessageIndex !== -1) {
          messageList.value[aiMessageIndex].content = aiResponse;
          messageList.value[aiMessageIndex].isTyping = false;
          isAITyping.value = false;
        }
        generateQuickReplies(aiResponse);
        await common_vendor.nextTick$1();
        scrollToBottom();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/AIChat/AIChat.vue:499", "AI响应失败:", error);
        const aiMessageIndex = messageList.value.findIndex((msg) => msg.id === aiMessage.id);
        if (aiMessageIndex !== -1) {
          messageList.value.splice(aiMessageIndex, 1);
        }
        isAITyping.value = false;
        common_vendor.index.showToast({
          title: "AI响应失败，请重试",
          icon: "error"
        });
      }
    };
    const generateAIResponse = async (userMessage) => {
      const responses = {
        "鸟类识别": "我可以帮您识别鸟类！请描述一下鸟的特征，比如大小、颜色、叫声等，或者您可以上传照片让我来识别。",
        "鸟类习性": "不同鸟类有着各自独特的习性。您想了解哪种鸟类的习性呢？比如觅食习惯、繁殖行为、迁徙路线等。",
        "观鸟指南": "观鸟是一项很有趣的活动！建议选择清晨或傍晚时间，准备好双筒望远镜，选择公园、湿地等鸟类活动频繁的地方。保持安静，避免惊扰鸟类。",
        "保护知识": "鸟类保护非常重要。我们可以通过保护栖息地、减少污染、不干扰繁殖等方式来保护鸟类。您想了解具体哪个方面的保护知识呢？"
      };
      for (const [keyword, response] of Object.entries(responses)) {
        if (userMessage.includes(keyword)) {
          return response;
        }
      }
      return "这是一个很好的问题！作为鸟类专家，我很乐意为您解答。您能提供更多具体信息吗？这样我可以给出更准确的回答。";
    };
    const generateQuickReplies = (aiResponse) => {
      const defaultReplies = [
        { id: 1, text: "告诉我更多" },
        { id: 2, text: "有相关图片吗？" },
        { id: 3, text: "谢谢" }
      ];
      if (aiResponse.includes("识别")) {
        quickReplies.value = [
          { id: 1, text: "上传照片识别" },
          { id: 2, text: "描述特征识别" },
          { id: 3, text: "常见鸟类有哪些？" }
        ];
      } else if (aiResponse.includes("保护")) {
        quickReplies.value = [
          { id: 1, text: "如何参与保护？" },
          { id: 2, text: "濒危鸟类有哪些？" },
          { id: 3, text: "保护法律法规" }
        ];
      } else {
        quickReplies.value = defaultReplies;
      }
      setTimeout(() => {
        quickReplies.value = [];
      }, 3e3);
    };
    const handleImageRecognition = async (imagePath) => {
      try {
        common_vendor.index.showLoading({ title: "识别中..." });
        await new Promise((resolve) => setTimeout(resolve, 2e3));
        common_vendor.index.hideLoading();
        const recognitionResult = "根据图片分析，这可能是一只麻雀。麻雀是常见的小型鸟类，体长约14-15厘米...";
        const aiMessage2 = {
          id: Date.now(),
          type: "ai",
          content: `图片识别结果：

${recognitionResult}`,
          timestamp: /* @__PURE__ */ new Date(),
          isTyping: false
        };
        messageList.value.push(aiMessage2);
        await common_vendor.nextTick$1();
        scrollToBottom();
      } catch (error) {
        common_vendor.index.hideLoading();
        common_vendor.index.__f__("error", "at pages/AIChat/AIChat.vue:609", "图片识别失败:", error);
        common_vendor.index.showToast({
          title: "识别失败，请重试",
          icon: "error"
        });
      }
    };
    const scrollToBottom = () => {
      setTimeout(() => {
        scrollTop.value = 99999;
      }, 100);
    };
    const formatMessageContent = (content) => {
      return content.split("\n").map((line) => ({
        name: "div",
        children: [{ type: "text", text: line }]
      }));
    };
    const formatTime = (timestamp) => {
      const now = /* @__PURE__ */ new Date();
      const date = new Date(timestamp);
      const diff = now - date;
      if (diff < 6e4) {
        return "刚刚";
      } else if (diff < 36e5) {
        return `${Math.floor(diff / 6e4)}分钟前`;
      } else if (diff < 864e5) {
        return `${Math.floor(diff / 36e5)}小时前`;
      } else {
        return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes().toString().padStart(2, "0")}`;
      }
    };
    const loadMoreMessages = async () => {
      try {
        common_vendor.index.__f__("log", "at pages/AIChat/AIChat.vue:666", "加载更多消息");
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/AIChat/AIChat.vue:668", "加载更多消息失败:", error);
      }
    };
    const clearChatHistory = () => {
      common_vendor.index.showModal({
        title: "确认清空",
        content: "确定要清空所有聊天记录吗？",
        success: (res) => {
          if (res.confirm) {
            messageList.value = [];
            common_vendor.index.showToast({
              title: "已清空",
              icon: "success"
            });
          }
        }
      });
    };
    const exportChatHistory = () => {
      common_vendor.index.showToast({
        title: "导出功能开发中",
        icon: "none"
      });
    };
    const openSettings = () => {
      common_vendor.index.navigateTo({
        url: "/pages/ChatSettings/ChatSettings"
      });
    };
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/AIChat/AIChat.vue:726", "AI聊天页面初始化");
      isAIOnline.value = true;
    });
    common_vendor.watch(messageList, () => {
      common_vendor.nextTick$1(() => {
        scrollToBottom();
      });
    }, { deep: true });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$1,
        b: common_vendor.o(goBack),
        c: common_assets._imports_1$3,
        d: isAIOnline.value ? 1 : "",
        e: isAITyping.value ? 1 : "",
        f: common_vendor.t(getAIStatus()),
        g: common_assets._imports_2$2,
        h: common_vendor.o(showMenu),
        i: messageList.value.length === 0
      }, messageList.value.length === 0 ? {
        j: common_assets._imports_3$2,
        k: common_vendor.f(quickSuggestions.value, (suggestion, k0, i0) => {
          return {
            a: suggestion.icon,
            b: common_vendor.t(suggestion.text),
            c: suggestion.id,
            d: common_vendor.o(($event) => sendSuggestion(suggestion), suggestion.id)
          };
        })
      } : {}, {
        l: common_vendor.f(messageList.value, (message, index, i0) => {
          return common_vendor.e({
            a: message.type === "ai"
          }, message.type === "ai" ? common_vendor.e({
            b: common_assets._imports_1$3,
            c: message.isTyping
          }, message.isTyping ? {} : {
            d: formatMessageContent(message.content)
          }, {
            e: !message.isTyping
          }, !message.isTyping ? {
            f: common_assets._imports_4$2,
            g: common_vendor.o(($event) => copyMessage(message), message.id),
            h: message.isLiked ? "/static/icons/like-filled.png" : "/static/icons/like.png",
            i: common_vendor.o(($event) => likeMessage(message), message.id),
            j: common_assets._imports_5$2,
            k: common_vendor.o(($event) => shareMessage(), message.id)
          } : {}, {
            l: common_vendor.t(formatTime(message.timestamp))
          }) : {
            m: common_vendor.t(message.content),
            n: common_vendor.t(formatTime(message.timestamp)),
            o: common_assets._imports_6$2
          }, {
            p: message.id,
            q: message.type === "user" ? 1 : "",
            r: message.type === "ai" ? 1 : "",
            s: `${index * 0.1}s`
          });
        }),
        m: hasMoreMessages.value
      }, hasMoreMessages.value ? {
        n: common_assets._imports_7$1,
        o: common_vendor.o(loadMoreMessages)
      } : {}, {
        p: scrollTop.value,
        q: common_vendor.o(onScrollToUpper),
        r: quickReplies.value.length > 0
      }, quickReplies.value.length > 0 ? {
        s: common_vendor.f(quickReplies.value, (reply, k0, i0) => {
          return {
            a: common_vendor.t(reply.text),
            b: reply.id,
            c: common_vendor.o(($event) => sendQuickReply(reply), reply.id)
          };
        })
      } : {}, {
        t: common_assets._imports_8,
        v: common_vendor.o(startVoiceInput),
        w: common_assets._imports_9,
        x: common_vendor.o(selectImage),
        y: common_vendor.o([($event) => inputText.value = $event.detail.value, onInputChange]),
        z: common_vendor.o(onInputFocus),
        A: common_vendor.o(onInputBlur),
        B: common_vendor.o(sendMessage),
        C: inputText.value,
        D: canSend.value ? "/static/icons/send-active.png" : "/static/icons/send.png",
        E: canSend.value ? 1 : "",
        F: common_vendor.o(sendMessage),
        G: inputText.value.length > 0
      }, inputText.value.length > 0 ? {
        H: common_vendor.t(inputText.value.length)
      } : {}, {
        I: isVoiceRecording.value
      }, isVoiceRecording.value ? {
        J: isRecording.value ? 1 : "",
        K: common_assets._imports_10,
        L: common_vendor.t(voiceText.value),
        M: common_vendor.o(cancelVoiceInput),
        N: common_vendor.o(confirmVoiceInput)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-50ae6d1f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/AIChat/AIChat.js.map
