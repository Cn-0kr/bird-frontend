"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "RankingPage",
  data() {
    return {
      // OSS配置
      ossConfig: {
        baseUrl: "https://birdfront-oss.oss-cn-shanghai.aliyuncs.com"
      }
    };
  },
  methods: {
    // ========== OSS工具方法 ==========
    /**
     * 获取OSS图片URL
     * @param {string} filename - 文件名
     * @param {string} size - 尺寸类型
     * @returns {string} 完整的OSS URL
     */
    getOSSUrl(filename, size = "thumbnail") {
      if (!filename)
        return "";
      const cleanFilename = filename.startsWith("/") ? filename.slice(1) : filename;
      let params = "";
      switch (size) {
        case "large":
          params = "?x-oss-process=image/resize,m_lfit,w_300,h_300/quality,q_90";
          break;
        case "medium":
          params = "?x-oss-process=image/resize,m_lfit,w_250,h_250/quality,q_90";
          break;
        case "small":
          params = "?x-oss-process=image/resize,m_lfit,w_200,h_200/quality,q_90";
          break;
        case "thumbnail":
          params = "?x-oss-process=image/resize,m_lfit,w_150,h_150/quality,q_90";
          break;
        default:
          params = "?x-oss-process=image/resize,m_lfit,w_150,h_150/quality,q_90";
      }
      return `${this.ossConfig.baseUrl}/${cleanFilename}${params}`;
    },
    /**
     * 获取鸟类图片的OSS URL
     * @param {string} filename - 图片文件名
     * @param {string} size - 尺寸类型
     * @returns {string} 图片的OSS URL
     */
    getBirdImageUrl(filename, size) {
      const imagePath = `pages/assets/images/${filename}`;
      const url = this.getOSSUrl(imagePath, size);
      common_vendor.index.__f__("log", "at pages/RankingPage/RankingPage.vue:235", `生成图片URL: ${filename} -> ${url}`);
      return url;
    },
    /**
     * 图片加载失败处理
     * @param {Event} error - 错误事件
     */
    onImageError(error) {
      common_vendor.index.__f__("error", "at pages/RankingPage/RankingPage.vue:245", "鸟类图片加载失败:", {
        src: error.target.src,
        alt: error.target.alt
      });
      const placeholder = "data:image/svg+xml;base64," + btoa(`
        <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="150" height="150" fill="#F3F4F6"/>
          <circle cx="75" cy="60" r="25" fill="#D1D5DB"/>
          <path d="M50 90 Q75 70 100 90 Q85 110 75 105 Q65 110 50 90" fill="#9CA3AF"/>
          <text x="75" y="130" font-family="Arial" font-size="12" fill="#6B7280" text-anchor="middle">图片加载失败</text>
        </svg>
      `);
      error.target.src = placeholder;
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $options.getBirdImageUrl("stork.jpg", "large"),
    b: common_vendor.o((...args) => $options.onImageError && $options.onImageError(...args)),
    c: $options.getBirdImageUrl("ibis.jpg", "medium"),
    d: common_vendor.o((...args) => $options.onImageError && $options.onImageError(...args)),
    e: $options.getBirdImageUrl("crane.jpg", "small"),
    f: common_vendor.o((...args) => $options.onImageError && $options.onImageError(...args)),
    g: $options.getBirdImageUrl("oriole.jpg", "thumbnail"),
    h: common_vendor.o((...args) => $options.onImageError && $options.onImageError(...args)),
    i: $options.getBirdImageUrl("canary.jpg", "thumbnail"),
    j: common_vendor.o((...args) => $options.onImageError && $options.onImageError(...args)),
    k: $options.getBirdImageUrl("swallow.jpg", "thumbnail"),
    l: common_vendor.o((...args) => $options.onImageError && $options.onImageError(...args)),
    m: $options.getBirdImageUrl("parrot.jpg", "thumbnail"),
    n: common_vendor.o((...args) => $options.onImageError && $options.onImageError(...args)),
    o: $options.getBirdImageUrl("owl.jpg", "thumbnail"),
    p: common_vendor.o((...args) => $options.onImageError && $options.onImageError(...args)),
    q: $options.getBirdImageUrl("woodpecker.jpg", "thumbnail"),
    r: common_vendor.o((...args) => $options.onImageError && $options.onImageError(...args)),
    s: $options.getBirdImageUrl("kingfisher.jpg", "thumbnail"),
    t: common_vendor.o((...args) => $options.onImageError && $options.onImageError(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-97c3cf49"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/RankingPage/RankingPage.js.map
