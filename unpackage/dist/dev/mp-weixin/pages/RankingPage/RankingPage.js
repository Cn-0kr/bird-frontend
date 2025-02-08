"use strict";
const common_assets = require("../../common/assets.js");
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "RankingPage",
  data() {
    return {
      storkImg: common_assets.storkImg,
      ibisImg: common_assets.ibisImg,
      craneImg: common_assets.craneImg,
      orioleImg: common_assets.orioleImg,
      canaryImg: common_assets.canaryImg,
      swallowImg: common_assets.swallowImg,
      parrotImg: common_assets.parrotImg,
      owlImg: common_assets.owlImg,
      woodpeckerImg: common_assets.woodpeckerImg,
      kingfisherImg: common_assets.kingfisherImg
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: $data.storkImg,
    b: $data.ibisImg,
    c: $data.craneImg,
    d: $data.orioleImg,
    e: $data.canaryImg,
    f: $data.swallowImg,
    g: $data.parrotImg,
    h: $data.owlImg,
    i: $data.woodpeckerImg,
    j: $data.kingfisherImg
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-97c3cf49"]]);
wx.createPage(MiniProgramPage);
