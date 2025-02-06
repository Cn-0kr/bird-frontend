"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
if (!Math) {
  "./pages/HomePage/HomePage.js";
  "./pages/UploadPage/UploadPage.js";
  "./pages/MapPage/MapPage.js";
  "./pages/ProfilePage/ProfilePage.js";
  "./pages/RankingPage/RankingPage.js";
  "./pages/NoobPage/NoobPage.js";
  "./pages/PosterPage/PosterPage.js";
  "./pages/AnalyzeResultPage/AnalyzeResultPage.js";
  "./pages/AnalyzeWaitingPage/AnalyzeWaitingPage.js";
}
const _sfc_main = {
  onLaunch: function() {
    console.log("App Launch");
  },
  onShow: function() {
    console.log("App Show");
  },
  onHide: function() {
    console.log("App Hide");
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
