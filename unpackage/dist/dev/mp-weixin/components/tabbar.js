"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "tabbar",
  setup(__props) {
    const currentPath = common_vendor.ref("/pages/HomePage/HomePage");
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
        default:
          params = "?x-oss-process=image/resize,m_lfit,w_48,h_48/quality,q_90";
      }
      return `${ossConfig.baseUrl}/${cleanFilename}${params}`;
    };
    const tabList = common_vendor.reactive([
      {
        pagePath: "/pages/HomePage/HomePage",
        text: "首页",
        iconPath: "static/icons/home.png",
        selectedIconPath: "static/icons/home-active.png",
        fallbackIcon: "🏠",
        // 后备字体图标
        iconError: false
        // 图标是否加载失败
      },
      {
        pagePath: "/pages/MapPage/MapPage",
        text: "地图",
        iconPath: "static/icons/map.png",
        selectedIconPath: "static/icons/map-active.png",
        fallbackIcon: "🗺️",
        iconError: false
      },
      {
        pagePath: "/pages/UploadPage/UploadPage",
        text: "上传",
        iconPath: "static/icons/upload.png",
        selectedIconPath: "static/icons/upload-active.png",
        fallbackIcon: "📤",
        iconError: false
      },
      {
        pagePath: "/pages/ProfilePage/ProfilePage",
        text: "我的",
        iconPath: "static/icons/profile.png",
        selectedIconPath: "static/icons/profile-active.png",
        fallbackIcon: "👤",
        iconError: false
      }
    ]);
    const getTabIconUrl = (item, isActive) => {
      const iconPath = isActive ? item.selectedIconPath : item.iconPath;
      return getOSSUrl(iconPath, "small-icon");
    };
    const switchTab = (path) => {
      currentPath.value = path;
      try {
        common_vendor.index.vibrateShort({
          type: "light"
        });
      } catch (error) {
        common_vendor.index.__f__("warn", "at components/tabbar.vue:144", "触觉反馈不支持:", error);
      }
      common_vendor.index.switchTab({
        url: path,
        success: () => {
          common_vendor.index.__f__("log", "at components/tabbar.vue:151", "切换到:", path);
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at components/tabbar.vue:154", "页面跳转失败:", error);
          common_vendor.index.navigateTo({
            url: path,
            fail: (navError) => {
              common_vendor.index.__f__("error", "at components/tabbar.vue:159", "导航失败:", navError);
              common_vendor.index.showToast({
                title: "页面跳转失败",
                icon: "none"
              });
            }
          });
        }
      });
    };
    const onIconError = (item) => {
      common_vendor.index.__f__("warn", "at components/tabbar.vue:175", "标签栏图标加载失败:", item.text);
      item.iconError = true;
    };
    const onIconLoad = (item) => {
      common_vendor.index.__f__("log", "at components/tabbar.vue:184", "标签栏图标加载成功:", item.text);
      item.iconError = false;
    };
    const initCurrentPath = () => {
      try {
        const pages = getCurrentPages();
        if (pages && pages.length > 0) {
          const currentPage = pages[pages.length - 1];
          const route = currentPage.route;
          const matchedTab = tabList.find((tab) => {
            const tabRoute = tab.pagePath.replace(/^\//, "");
            return route === tabRoute;
          });
          if (matchedTab) {
            currentPath.value = matchedTab.pagePath;
          }
        }
      } catch (error) {
        common_vendor.index.__f__("warn", "at components/tabbar.vue:211", "获取当前页面路径失败:", error);
        currentPath.value = "/pages/HomePage/HomePage";
      }
    };
    common_vendor.onMounted(() => {
      initCurrentPath();
      common_vendor.index.__f__("log", "at components/tabbar.vue:222", "TabBar组件已挂载，当前路径:", currentPath.value);
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.f(tabList, (item, index, i0) => {
          return common_vendor.e({
            a: !item.iconError
          }, !item.iconError ? {
            b: getTabIconUrl(item, currentPath.value === item.pagePath),
            c: common_vendor.o(($event) => onIconError(item), index),
            d: common_vendor.o(($event) => onIconLoad(item), index)
          } : {
            e: common_vendor.t(item.fallbackIcon),
            f: currentPath.value === item.pagePath ? 1 : ""
          }, {
            g: common_vendor.t(item.text),
            h: index,
            i: currentPath.value === item.pagePath ? 1 : "",
            j: common_vendor.o(($event) => switchTab(item.pagePath), index)
          });
        })
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-c6a4bdcf"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/tabbar.js.map
