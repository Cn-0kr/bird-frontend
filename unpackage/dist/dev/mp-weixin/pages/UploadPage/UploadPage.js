"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Math) {
  TabBar();
}
const TabBar = () => "../../components/tabbar.js";
const _sfc_main = {
  __name: "UploadPage",
  setup(__props) {
    const imageUrl = common_vendor.ref("");
    const handleUpload = () => {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          imageUrl.value = res.tempFilePaths[0];
        }
      });
    };
    const handleReset = () => {
      imageUrl.value = "";
    };
    const handleAnalyze = () => {
      common_vendor.index.__f__("log", "at pages/UploadPage/UploadPage.vue:76", "Analyzing image:", imageUrl.value);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: imageUrl.value
      }, imageUrl.value ? {
        b: imageUrl.value
      } : {}, {
        c: common_assets._imports_0$1,
        d: common_assets._imports_1$1,
        e: common_assets._imports_2$1,
        f: common_assets._imports_3,
        g: imageUrl.value
      }, imageUrl.value ? {
        h: common_vendor.o(handleReset),
        i: common_vendor.o(handleAnalyze)
      } : {
        j: common_assets._imports_4,
        k: common_vendor.o(handleUpload),
        l: common_assets._imports_5,
        m: common_vendor.o(handleUpload),
        n: common_assets._imports_6,
        o: common_vendor.o(handleUpload),
        p: common_assets._imports_7,
        q: common_vendor.o(handleUpload)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/UploadPage/UploadPage.js.map
