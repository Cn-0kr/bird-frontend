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
      common_vendor.index.__f__("log", "at pages/UploadPage/UploadPage.vue:63", "Analyzing image:", imageUrl.value);
    };
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: imageUrl.value
      }, imageUrl.value ? {
        b: imageUrl.value
      } : {}, {
        c: imageUrl.value
      }, imageUrl.value ? {
        d: common_vendor.o(handleReset),
        e: common_vendor.o(handleAnalyze)
      } : {
        f: common_vendor.o(handleUpload)
      });
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/UploadPage/UploadPage.js.map
