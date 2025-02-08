"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "tabbar",
  setup(__props) {
    const currentPath = common_vendor.ref("/pages/HomePage/HomePage");
    const tabList = [
      {
        pagePath: "/pages/HomePage/HomePage",
        text: "首页",
        iconPath: "/static/icons/home.png",
        selectedIconPath: "/static/icons/home-active.png"
      },
      {
        pagePath: "/pages/MapPage/MapPage",
        text: "地图",
        iconPath: "/static/icons/map.png",
        selectedIconPath: "/static/icons/map-active.png"
      },
      {
        pagePath: "/pages/UploadPage/UploadPage",
        text: "上传",
        iconPath: "/static/icons/upload.png",
        selectedIconPath: "/static/icons/upload-active.png"
      },
      {
        pagePath: "/pages/ProfilePage/ProfilePage",
        text: "我的",
        iconPath: "/static/icons/profile.png",
        selectedIconPath: "/static/icons/profile-active.png"
      }
    ];
    const switchTab = (path) => {
      currentPath.value = path;
      common_vendor.index.switchTab({
        url: path
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabList, (item, index, i0) => {
          return {
            a: currentPath.value === item.pagePath ? item.selectedIconPath : item.iconPath,
            b: common_vendor.t(item.text),
            c: index,
            d: currentPath.value === item.pagePath ? 1 : "",
            e: common_vendor.o(($event) => switchTab(item.pagePath), index)
          };
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c6a4bdcf"]]);
wx.createComponent(Component);
