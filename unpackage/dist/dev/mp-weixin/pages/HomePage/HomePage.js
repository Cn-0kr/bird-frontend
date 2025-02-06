"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Math) {
  (homeposter + TabBar)();
}
const TabBar = () => "../../components/tabbar.js";
const homeposter = () => "../../components/homeposter.js";
const _sfc_main = {
  __name: "HomePage",
  setup(__props) {
    common_vendor.useRouter();
    const searchText = common_vendor.ref("");
    const onSearch = () => {
    };
    const posterList = common_vendor.ref([
      {
        id: 1,
        imageUrl: "/static/posts/bird1.jpg",
        imageHeight: 200,
        description: "今天在公园拍到的小鸟，真的太可爱了！",
        views: 1234,
        likes: 88
      },
      {
        id: 2,
        imageUrl: "/static/posts/bird2.jpg",
        imageHeight: 280,
        description: "清晨6点，记录到了珍贵的候鸟迁徙场景",
        views: 25678,
        likes: 1892
      }
      // ... 
    ]);
    const leftColumn = common_vendor.ref([]);
    const rightColumn = common_vendor.ref([]);
    const distributePosters = () => {
      posterList.value.forEach((poster, index) => {
        if (index % 2 === 0) {
          leftColumn.value.push(poster);
        } else {
          rightColumn.value.push(poster);
        }
      });
    };
    common_vendor.onMounted(() => {
      distributePosters();
    });
    const navigateToPosterPage = (postId) => {
      common_vendor.index.navigateTo({
        url: `/pages/PosterPage/PosterPage?postId=${postId}`
      });
    };
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: common_vendor.o([($event) => searchText.value = $event.detail.value, onSearch]),
        c: searchText.value,
        d: common_assets._imports_1,
        e: common_vendor.f(leftColumn.value, (poster, k0, i0) => {
          return {
            a: poster.id,
            b: common_vendor.o(($event) => navigateToPosterPage(poster.id), poster.id),
            c: "5ab68f47-0-" + i0,
            d: common_vendor.p({
              ["poster-data"]: poster
            })
          };
        }),
        f: common_vendor.f(rightColumn.value, (poster, k0, i0) => {
          return {
            a: poster.id,
            b: common_vendor.o(($event) => navigateToPosterPage(poster.id), poster.id),
            c: "5ab68f47-1-" + i0,
            d: common_vendor.p({
              ["poster-data"]: poster
            })
          };
        })
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5ab68f47"]]);
wx.createPage(MiniProgramPage);
