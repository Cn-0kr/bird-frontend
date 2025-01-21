"use strict";
const common_vendor = require("../common/vendor.js");
const common_assets = require("../common/assets.js");
const _sfc_main = {
  name: "HomePoster",
  props: {
    posterData: {
      type: Object,
      required: true,
      default: () => ({
        imageUrl: "",
        imageHeight: 200,
        description: "",
        views: 0,
        likes: 0
      })
    }
  },
  methods: {
    formatNumber(num) {
      if (num >= 1e4) {
        return (num / 1e4).toFixed(1) + "w";
      }
      return num;
    },
    navigateToDetail() {
      try {
        const url = `/pages/PostDetail/PostDetail?id=${this.posterData.id}`;
        common_vendor.index.navigateTo({
          url,
          fail: (err) => {
            common_vendor.index.__f__("error", "at components/homeposter.vue:61", "Navigation failed:", err);
            common_vendor.index.showToast({
              title: "页面跳转失败",
              icon: "none"
            });
          }
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at components/homeposter.vue:69", "Navigation error:", error);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $props.posterData.imageUrl,
    b: $props.posterData.imageHeight + "px",
    c: common_vendor.t($props.posterData.description),
    d: common_assets._imports_0$2,
    e: common_vendor.t($options.formatNumber($props.posterData.views)),
    f: common_assets._imports_1$1,
    g: common_vendor.t($options.formatNumber($props.posterData.likes)),
    h: common_vendor.o((...args) => $options.navigateToDetail && $options.navigateToDetail(...args))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2db382c6"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/homeposter.js.map
