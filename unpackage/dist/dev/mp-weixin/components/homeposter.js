"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "HomePoster",
  props: {
    posterData: {
      type: Object,
      required: true,
      default: () => ({
        id: "",
        imageUrl: "",
        imageHeight: 200,
        description: "",
        views: 0,
        likes: 0,
        accuracy: "",
        date: ""
      })
    }
  },
  data() {
    return {
      imageLoading: true,
      imageError: false,
      // OSS配置
      ossConfig: {
        baseUrl: "https://birdfront-oss.oss-cn-shanghai.aliyuncs.com"
      }
    };
  },
  computed: {
    /**
     * 计算图片的OSS URL
     */
    imageUrl() {
      return this.getOSSUrl(this.posterData.imageUrl || this.posterData.src, "medium");
    }
  },
  methods: {
    /**
     * 获取OSS图片URL
     * @param {string} filename - 文件名
     * @param {string} size - 尺寸类型
     * @returns {string} 完整的OSS URL
     */
    getOSSUrl(filename, size = "medium") {
      if (!filename) {
        return `${this.ossConfig.baseUrl}/static/placeholder.png?x-oss-process=image/resize,m_lfit,w_300,h_300/quality,q_70`;
      }
      const cleanFilename = filename.startsWith("/") ? filename.slice(1) : filename;
      let params = "";
      switch (size) {
        case "thumbnail":
          params = "?x-oss-process=image/resize,m_lfit,w_150,h_150/quality,q_85";
          break;
        case "small":
          params = "?x-oss-process=image/resize,m_lfit,w_300,h_300/quality,q_85";
          break;
        case "medium":
          params = "?x-oss-process=image/resize,m_lfit,w_600,h_600/quality,q_80";
          break;
        case "large":
          params = "?x-oss-process=image/resize,m_lfit,w_1200,h_1200/quality,q_85";
          break;
        default:
          params = "?x-oss-process=image/resize,m_lfit,w_600,h_600/quality,q_80";
      }
      const fullUrl = `${this.ossConfig.baseUrl}/${cleanFilename}${params}`;
      common_vendor.index.__f__("log", "at components/homeposter.vue:128", "HomePoster getOSSUrl:", {
        originalFilename: filename,
        cleanFilename,
        size,
        params,
        fullUrl
      });
      return fullUrl;
    },
    /**
     * 处理图片加载完成
     */
    handleImageLoad() {
      this.imageLoading = false;
      this.imageError = false;
    },
    /**
     * 处理图片加载错误
     */
    handleImageError() {
      this.imageLoading = false;
      this.imageError = true;
      common_vendor.index.__f__("warn", "at components/homeposter.vue:153", "图片加载失败:", this.posterData.imageUrl);
    },
    /**
     * 处理点击事件
     */
    handleItemClick() {
      this.$emit("item-click", this.posterData);
      if (this.posterData.id) {
        common_vendor.index.navigateTo({
          url: `/pages/detail/detail?id=${this.posterData.id}`
        });
      }
    },
    /**
     * 格式化数字显示
     */
    formatNumber(num) {
      if (!num)
        return "0";
      if (num >= 1e4) {
        return (num / 1e4).toFixed(1) + "w";
      } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + "k";
      }
      return num.toString();
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $options.imageUrl,
    b: $props.posterData.imageHeight + "px",
    c: common_vendor.o((...args) => $options.handleImageError && $options.handleImageError(...args)),
    d: common_vendor.o((...args) => $options.handleImageLoad && $options.handleImageLoad(...args)),
    e: $data.imageLoading
  }, $data.imageLoading ? {} : {}, {
    f: common_vendor.t($props.posterData.description),
    g: $props.posterData.views
  }, $props.posterData.views ? {
    h: common_vendor.t($options.formatNumber($props.posterData.views))
  } : {}, {
    i: $props.posterData.likes
  }, $props.posterData.likes ? {
    j: common_vendor.t($options.formatNumber($props.posterData.likes))
  } : {}, {
    k: $props.posterData.accuracy
  }, $props.posterData.accuracy ? {
    l: common_vendor.t($props.posterData.accuracy)
  } : {}, {
    m: $props.posterData.date
  }, $props.posterData.date ? {
    n: common_vendor.t($props.posterData.date)
  } : {}, {
    o: common_vendor.o((...args) => $options.handleItemClick && $options.handleItemClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2db382c6"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/homeposter.js.map
