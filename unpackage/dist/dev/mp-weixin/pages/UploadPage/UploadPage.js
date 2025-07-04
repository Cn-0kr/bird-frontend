"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  TabBar();
}
const TabBar = () => "../../components/tabbar.js";
const _sfc_main = {
  __name: "UploadPage",
  setup(__props) {
    const imageUrl = common_vendor.ref("");
    const ossConfig = {
      baseUrl: "https://birdfront-oss.oss-cn-shanghai.aliyuncs.com"
    };
    const getOSSUrl = (filename, size = "icon") => {
      if (!filename)
        return "";
      const cleanFilename = filename.startsWith("/") ? filename.slice(1) : filename;
      let params = "";
      switch (size) {
        case "icon":
          params = "?x-oss-process=image/resize,m_lfit,w_48,h_48/quality,q_90";
          break;
        case "small-icon":
          params = "?x-oss-process=image/resize,m_lfit,w_32,h_32/quality,q_90";
          break;
        case "tiny-icon":
          params = "?x-oss-process=image/resize,m_lfit,w_16,h_16/quality,q_90";
          break;
        case "avatar":
          params = "?x-oss-process=image/resize,m_lfit,w_80,h_80/quality,q_90";
          break;
        case "large":
          params = "?x-oss-process=image/resize,m_lfit,w_120,h_120/quality,q_90";
          break;
        case "medium":
          params = "?x-oss-process=image/resize,m_lfit,w_200,h_200/quality,q_85";
          break;
        case "banner":
          params = "?x-oss-process=image/resize,m_lfit,w_750,h_400/quality,q_85";
          break;
        case "post":
          params = "?x-oss-process=image/resize,m_lfit,w_400,h_600/quality,q_85";
          break;
        case "post-thumb":
          params = "?x-oss-process=image/resize,m_lfit,w_300,h_450/quality,q_80";
          break;
        case "upload-bg":
          params = "?x-oss-process=image/resize,m_lfit,w_300,h_60/quality,q_85";
          break;
        case "upload-text":
          params = "?x-oss-process=image/resize,m_lfit,w_150,h_30/quality,q_90";
          break;
        default:
          params = "?x-oss-process=image/resize,m_lfit,w_48,h_48/quality,q_90";
      }
      return `${ossConfig.baseUrl}/${cleanFilename}${params}`;
    };
    const handleUpload = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          imageUrl.value = res.tempFilePaths[0];
          common_vendor.index.showToast({
            title: "图片上传成功",
            icon: "success",
            duration: 1500
          });
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/UploadPage/UploadPage.vue:142", "图片选择失败:", error);
          common_vendor.index.showToast({
            title: "图片选择失败",
            icon: "error",
            duration: 2e3
          });
        }
      });
    };
    const handleReset = () => {
      common_vendor.index.showModal({
        title: "确认重新上传",
        content: "确定要重新选择图片吗？",
        success: (res) => {
          if (res.confirm) {
            imageUrl.value = "";
            common_vendor.index.showToast({
              title: "已重置",
              icon: "success",
              duration: 1e3
            });
          }
        }
      });
    };
    const handleAnalyze = () => {
      if (!imageUrl.value) {
        common_vendor.index.showToast({
          title: "请先上传图片",
          icon: "none",
          duration: 2e3
        });
        return;
      }
      common_vendor.index.showLoading({
        title: "正在分析图片..."
      });
      common_vendor.index.__f__("log", "at pages/UploadPage/UploadPage.vue:190", "Analyzing image:", imageUrl.value);
      setTimeout(() => {
        common_vendor.index.hideLoading();
        common_vendor.index.navigateTo({
          url: `/pages/AnalysisResult/AnalysisResult?imageUrl=${encodeURIComponent(imageUrl.value)}`
        });
      }, 2e3);
    };
    const onIconError = (error) => {
      common_vendor.index.__f__("warn", "at pages/UploadPage/UploadPage.vue:208", "图标加载失败:", error);
    };
    const onImageError = (error) => {
      common_vendor.index.__f__("warn", "at pages/UploadPage/UploadPage.vue:217", "图片加载失败:", error);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: imageUrl.value
      }, imageUrl.value ? {
        b: imageUrl.value,
        c: common_vendor.o(onImageError)
      } : {}, {
        d: getOSSUrl("static/icons/ellipse-48.png", "tiny-icon"),
        e: common_vendor.o(onIconError),
        f: getOSSUrl("static/icons/route-105.png", "small-icon"),
        g: common_vendor.o(onIconError),
        h: getOSSUrl("static/icons/route-106.png", "icon"),
        i: common_vendor.o(onIconError),
        j: getOSSUrl("static/icons/icon_interfaces_mail.png", "icon"),
        k: common_vendor.o(onIconError),
        l: imageUrl.value
      }, imageUrl.value ? {
        m: common_vendor.o(handleReset),
        n: common_vendor.o(handleAnalyze)
      } : {
        o: getOSSUrl("static/icons/圆形 4.png", "icon"),
        p: common_vendor.o(handleUpload),
        q: common_vendor.o(onIconError),
        r: getOSSUrl("static/icons/矩形 1.png", "upload-bg"),
        s: common_vendor.o(handleUpload),
        t: common_vendor.o(onIconError),
        v: getOSSUrl("static/icons/箭头 1.png", "small-icon"),
        w: common_vendor.o(handleUpload),
        x: common_vendor.o(onIconError),
        y: getOSSUrl("static/icons/点击上传图片.png", "upload-text"),
        z: common_vendor.o(handleUpload),
        A: common_vendor.o(onIconError)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/UploadPage/UploadPage.js.map
