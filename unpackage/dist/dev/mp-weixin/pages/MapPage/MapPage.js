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
      common_vendor.index.getLocation({
        type: "gcj02",
        success: (res) => {
          latitude.value = res.latitude;
          longitude.value = res.longitude;
        },
        fail: () => {
          common_vendor.index.showToast({
            title: "无法获取位置",
            icon: "none"
          });
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
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/MapPage/MapPage.js.map
