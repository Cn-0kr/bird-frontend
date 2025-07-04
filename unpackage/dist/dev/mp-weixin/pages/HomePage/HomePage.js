"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  (EnhancedPoster + TabBar)();
}
const TabBar = () => "../../components/tabbar.js";
const EnhancedPoster = () => "../../components/EnhancedPoster.js";
const _sfc_main = {
  __name: "HomePage",
  setup(__props) {
    const searchText = common_vendor.ref("");
    const isSearchFocused = common_vendor.ref(false);
    const isLoading = common_vendor.ref(true);
    const posterList = common_vendor.ref([]);
    const leftColumn = common_vendor.ref([]);
    const rightColumn = common_vendor.ref([]);
    const currentBannerIndex = common_vendor.ref(0);
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
        case "avatar":
          params = "?x-oss-process=image/resize,m_lfit,w_80,h_80/quality,q_90";
          break;
        case "large":
          params = "?x-oss-process=image/resize,m_lfit,w_120,h_120/quality,q_90";
          break;
        case "medium":
          params = "?x-oss-process=image/resize,m_lfit,w_200,h_200/quality,q_85";
          break;
        case "banner":
          params = "?x-oss-process=image/resize,m_lfit,w_750,h_400/quality,q_85";
          break;
        case "post":
          params = "?x-oss-process=image/resize,m_lfit,w_400,h_600/quality,q_85";
          break;
        case "post-thumb":
          params = "?x-oss-process=image/resize,m_lfit,w_300,h_450/quality,q_80";
          break;
        default:
          params = "?x-oss-process=image/resize,m_lfit,w_48,h_48/quality,q_90";
      }
      return `${ossConfig.baseUrl}/${cleanFilename}${params}`;
    };
    const bannerList = common_vendor.ref([
      {
        imageUrl: "static/banner/toucan-banner.jpg",
        title: "发现自然之美",
        subtitle: "记录每一次与鸟类的美妙邂逅"
      },
      {
        imageUrl: "static/banner/eagle-banner.jpg",
        title: "翱翔天际",
        subtitle: "见证猛禽的威武与优雅"
      },
      {
        imageUrl: "static/banner/peacock-banner.jpg",
        title: "绚烂羽翼",
        subtitle: "感受大自然的色彩魅力"
      },
      {
        imageUrl: "static/banner/hummingbird-banner.jpg",
        title: "精灵悬停",
        subtitle: "捕捉蜂鸟的瞬间之美"
      }
    ]);
    const mockData = [
      {
        id: 1,
        imageUrl: "static/posts/bird1.jpg",
        imageHeight: 200,
        description: "今天在公园拍到的小鸟，真的太可爱了！",
        views: 1223,
        likes: 12,
        author: {
          name: "鸟类爱好者",
          avatar: "static/avatars/user1.png"
        },
        location: "北京·朝阳公园",
        publishTime: "2小时前"
      },
      {
        id: 2,
        imageUrl: "static/posts/bird2.jpg",
        imageHeight: 280,
        description: "清晨6点，记录到了珍贵的候鸟迁徙场景",
        views: 25678,
        likes: 1892,
        author: {
          name: "自然摄影师",
          avatar: "static/avatars/user2.png"
        },
        location: "上海·世纪公园",
        publishTime: "5小时前"
      },
      {
        id: 3,
        imageUrl: "static/posts/bird3.jpg",
        imageHeight: 220,
        description: "蜂鸟悬停采蜜的瞬间，大自然的精灵",
        views: 5432,
        likes: 234,
        author: {
          name: "野生动物保护者",
          avatar: "static/avatars/user3.png"
        },
        location: "云南·西双版纳",
        publishTime: "1天前"
      },
      {
        id: 4,
        imageUrl: "static/posts/bird4.jpg",
        imageHeight: 300,
        description: "金刚鹦鹉的绚烂色彩，热带雨林的瑰宝",
        views: 8765,
        likes: 456,
        author: {
          name: "生态研究员",
          avatar: "static/avatars/user4.jpg"
        },
        location: "海南·亚龙湾",
        publishTime: "2天前"
      }
    ];
    const onSwiperChange = (event) => {
      currentBannerIndex.value = event.detail.current;
      common_vendor.index.__f__("log", "at pages/HomePage/HomePage.vue:323", "当前Banner索引:", currentBannerIndex.value);
    };
    const onSearch = () => {
      common_vendor.index.__f__("log", "at pages/HomePage/HomePage.vue:331", "搜索内容:", searchText.value);
      if (searchText.value.trim()) {
        searchBirds(searchText.value);
      } else {
        resetPosterList();
      }
    };
    const onSearchFocus = () => {
      isSearchFocused.value = true;
    };
    const onSearchBlur = () => {
      isSearchFocused.value = false;
    };
    const handleSearch = () => {
      if (searchText.value.trim()) {
        searchBirds(searchText.value);
        common_vendor.index.vibrateShort();
      }
    };
    const onBannerLoad = () => {
      common_vendor.index.__f__("log", "at pages/HomePage/HomePage.vue:373", "Banner加载完成");
    };
    const onLike = (posterData) => {
      const poster = posterList.value.find((p) => p.id === posterData.id);
      if (poster) {
        poster.likes += 1;
        redistributePosters();
        common_vendor.index.showToast({
          title: "点赞成功",
          icon: "success",
          duration: 1e3
        });
      }
    };
    const onView = (posterData) => {
      const poster = posterList.value.find((p) => p.id === posterData.id);
      if (poster) {
        poster.views += 1;
      }
      common_vendor.index.navigateTo({
        url: `/pages/PosterDetail/PosterDetail?id=${posterData.id}`
      });
    };
    const searchBirds = async (keyword) => {
      try {
        isLoading.value = true;
        await new Promise((resolve) => setTimeout(resolve, 500));
        const filteredData = mockData.filter(
          (item) => item.description.includes(keyword) || item.location.includes(keyword)
        );
        posterList.value = filteredData;
        redistributePosters();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/HomePage/HomePage.vue:439", "搜索失败:", error);
        common_vendor.index.showToast({
          title: "搜索失败，请重试",
          icon: "error"
        });
      } finally {
        isLoading.value = false;
      }
    };
    const resetPosterList = () => {
      posterList.value = [...mockData];
      redistributePosters();
    };
    const redistributePosters = () => {
      leftColumn.value = [];
      rightColumn.value = [];
      let leftHeight = 0;
      let rightHeight = 0;
      posterList.value.forEach((poster) => {
        const estimatedHeight = poster.imageHeight + 120;
        if (leftHeight <= rightHeight) {
          leftColumn.value.push(poster);
          leftHeight += estimatedHeight;
        } else {
          rightColumn.value.push(poster);
          rightHeight += estimatedHeight;
        }
      });
    };
    const onIconError = (error) => {
      common_vendor.index.__f__("warn", "at pages/HomePage/HomePage.vue:498", "图标加载失败:", error);
    };
    const onImageError = (error) => {
      common_vendor.index.__f__("warn", "at pages/HomePage/HomePage.vue:507", "图片加载失败:", error);
    };
    common_vendor.onMounted(async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        const processedData = mockData.map((item) => ({
          ...item,
          imageUrl: getOSSUrl(item.imageUrl, "post-thumb"),
          author: {
            ...item.author,
            avatar: getOSSUrl(item.author.avatar, "avatar")
          }
        }));
        posterList.value = processedData;
        redistributePosters();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/HomePage/HomePage.vue:531", "页面初始化失败:", error);
        common_vendor.index.showToast({
          title: "加载失败，请重试",
          icon: "error"
        });
      } finally {
        isLoading.value = false;
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(bannerList.value, (banner, index, i0) => {
          return {
            a: getOSSUrl(banner.imageUrl, "banner"),
            b: common_vendor.o(onBannerLoad, index),
            c: common_vendor.o(onImageError, index),
            d: common_vendor.t(banner.title),
            e: common_vendor.t(banner.subtitle),
            f: index
          };
        }),
        b: common_vendor.o(onSwiperChange),
        c: getOSSUrl("static/icons/search.png", "icon"),
        d: common_vendor.o(onIconError),
        e: common_vendor.o([($event) => searchText.value = $event.detail.value, onSearch]),
        f: common_vendor.o(onSearchFocus),
        g: common_vendor.o(onSearchBlur),
        h: searchText.value,
        i: getOSSUrl("static/icons/search-white.png", "icon"),
        j: common_vendor.o(onIconError),
        k: common_vendor.o(handleSearch),
        l: isSearchFocused.value ? 1 : "",
        m: getOSSUrl("static/icons/ranking.png", "icon"),
        n: common_vendor.o(onIconError),
        o: getOSSUrl("static/icons/guide.png", "icon"),
        p: common_vendor.o(onIconError),
        q: getOSSUrl("static/icons/encyclopedia.png", "icon"),
        r: common_vendor.o(onIconError),
        s: getOSSUrl("static/icons/ai-chat.png", "icon"),
        t: common_vendor.o(onIconError),
        v: isLoading.value
      }, isLoading.value ? {} : {
        w: common_vendor.f(leftColumn.value, (poster, index, i0) => {
          return {
            a: common_vendor.o(onLike, poster.id),
            b: common_vendor.o(onView, poster.id),
            c: "5ab68f47-0-" + i0,
            d: common_vendor.p({
              ["poster-data"]: poster
            }),
            e: poster.id,
            f: `${index * 0.1}s`
          };
        }),
        x: common_vendor.f(rightColumn.value, (poster, index, i0) => {
          return {
            a: common_vendor.o(onLike, poster.id),
            b: common_vendor.o(onView, poster.id),
            c: "5ab68f47-1-" + i0,
            d: common_vendor.p({
              ["poster-data"]: poster
            }),
            e: poster.id,
            f: `${(index + 1) * 0.1}s`
          };
        })
      }, {
        y: !isLoading.value && posterList.value.length === 0
      }, !isLoading.value && posterList.value.length === 0 ? {
        z: getOSSUrl("static/icons/empty-bird.png", "large"),
        A: common_vendor.o(onIconError)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-5ab68f47"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/HomePage/HomePage.js.map
