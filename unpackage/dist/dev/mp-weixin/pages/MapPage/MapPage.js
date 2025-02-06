"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  TabBar();
}
const TabBar = () => "../../components/tabbar.js";
const _sfc_main = {
  __name: "MapPage",
  setup(__props) {
    const latitude = common_vendor.ref(31.2304);
    const longitude = common_vendor.ref(121.4737);
    const scale = common_vendor.ref(14);
    const searchText = common_vendor.ref("");
    const markers = common_vendor.ref([]);
    const getCurrentLocation = () => {
      common_vendor.index.showLoading({
        title: "定位中..."
      });
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          latitude.value = res.latitude;
          longitude.value = res.longitude;
          scale.value = 16;
          common_vendor.index.showToast({
            title: "定位成功",
            icon: "success",
            duration: 1500
          });
        },
        fail: (err) => {
          console.error("定位失败：", err);
          common_vendor.index.showModal({
            title: "提示",
            content: "需要获取您的地理位置才能使用此功能",
            confirmText: "去设置",
            success: (res) => {
              if (res.confirm) {
                common_vendor.index.openSetting();
              }
            }
          });
        },
        complete: () => {
          common_vendor.index.hideLoading();
        }
      });
    };
    const moveToCurrentLocation = () => {
      getCurrentLocation();
    };
    const handleSearch = async (e) => {
      if (!searchText.value)
        return;
    };
    common_vendor.onMounted(() => {
      getCurrentLocation();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.o(handleSearch),
        b: searchText.value,
        c: common_vendor.o(($event) => searchText.value = $event.detail.value),
        d: latitude.value,
        e: longitude.value,
        f: markers.value,
        g: scale.value,
        h: common_vendor.o(moveToCurrentLocation)
      };
    };
  }
};
wx.createPage(_sfc_main);
