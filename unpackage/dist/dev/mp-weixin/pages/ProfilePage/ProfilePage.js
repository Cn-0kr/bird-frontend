"use strict";
const common_vendor = require("../../common/vendor.js");
const api_services_user = require("../../api/services/user.js");
const common_assets = require("../../common/assets.js");
const TabBar = () => "../../components/tabbar.js";
const HomePoster = () => "../../components/homeposter.js";
const userService = new api_services_user.UserService();
const _sfc_main = {
  components: {
    HomePoster,
    TabBar
  },
  data() {
    return {
      isLoading: false,
      activeTab: "posts",
      userInfo: {
        avatar: "/static/default-avatar.png",
        nickname: "鸟类爱好者",
        bio: "",
        // 添加默认提示
        postsCount: 0,
        likesCount: 0,
        level: 1
      },
      achievements: [
        {
          id: 1,
          name: "初级观鸟员",
          icon: "/static/icons/achievements/beginner.png"
        },
        {
          id: 2,
          name: "摄影新手",
          icon: "/static/icons/achievements/photographer.png"
        }
      ],
      posts: [],
      likes: [],
      records: [],
      leftColumn: [],
      rightColumn: []
    };
  },
  computed: {
    currentContent() {
      switch (this.activeTab) {
        case "posts":
          return this.posts;
        case "likes":
          return this.likes;
        case "records":
          return this.records;
        default:
          return [];
      }
    }
  },
  async onLoad() {
    await this.loadUserInfo();
    this.loadContent();
  },
  methods: {
    async loadUserInfo() {
      try {
        const intro = await userService.getIntro();
        this.userInfo.bio = intro || "点击添加个人介绍...";
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/ProfilePage/ProfilePage.vue:189", "Failed to load user info:", error);
        common_vendor.index.showToast({
          title: "加载个人信息失败",
          icon: "none"
        });
      }
    },
    handleAvatarClick() {
      common_vendor.index.chooseImage({
        count: 1,
        success: (res) => {
          this.userInfo.avatar = res.tempFilePaths[0];
        }
      });
    },
    handleEditProfile() {
      common_vendor.index.navigateTo({
        url: "/pages/EditProfile/EditProfile"
      });
    },
    handleEditBio() {
      common_vendor.index.showModal({
        title: "编辑个人介绍",
        editable: true,
        content: this.userInfo.bio,
        success: (res) => {
          if (res.confirm) {
            this.updateBio(res.content);
          }
        }
      });
    },
    async updateBio(newBio) {
      try {
        this.userInfo.bio = newBio;
        common_vendor.index.showToast({
          title: "更新成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/ProfilePage/ProfilePage.vue:235", "Failed to update bio:", error);
        common_vendor.index.showToast({
          title: "更新失败",
          icon: "none"
        });
      }
    },
    switchTab(tab) {
      if (this.activeTab !== tab) {
        this.activeTab = tab;
        this.loadContent();
      }
    },
    async loadContent() {
      this.isLoading = true;
      try {
        setTimeout(() => {
          let data;
          switch (this.activeTab) {
            case "posts":
              data = [
                {
                  id: 1,
                  imageUrl: "/static/posts/bird1.jpg",
                  imageHeight: 200,
                  description: "今天拍到的小鸟",
                  views: 1234,
                  likes: 88
                }
              ];
              this.posts = data;
              break;
            case "likes":
              data = [
                {
                  id: 2,
                  imageUrl: "/static/posts/bird2.jpg",
                  imageHeight: 280,
                  description: "好漂亮的鸟儿！",
                  views: 2567,
                  likes: 189
                }
              ];
              this.likes = data;
              break;
            case "records":
              data = [
                {
                  id: 3,
                  imageUrl: "/static/recognition/bird1.jpg",
                  imageHeight: 240,
                  description: "识别结果：红头长尾山雀",
                  accuracy: "98%",
                  date: "2024-03-20"
                },
                {
                  id: 5,
                  imageUrl: "/static/recognition/bird2.jpg",
                  imageHeight: 220,
                  description: "识别结果：白头硬尾鹎",
                  accuracy: "97%",
                  date: "2024-03-18"
                }
              ];
              this.records = data;
              break;
          }
          this.distributeContent();
          this.isLoading = false;
        }, 500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/ProfilePage/ProfilePage.vue:310", "Load content error:", error);
        this.isLoading = false;
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      }
    },
    distributeContent() {
      this.leftColumn = [];
      this.rightColumn = [];
      this.currentContent.forEach((item, index) => {
        if (index % 2 === 0) {
          this.leftColumn.push(item);
        } else {
          this.rightColumn.push(item);
        }
      });
    }
  }
};
if (!Array) {
  const _component_home_poster = common_vendor.resolveComponent("home-poster");
  const _component_tab_bar = common_vendor.resolveComponent("tab-bar");
  (_component_home_poster + _component_tab_bar)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.userInfo.avatar || "/static/default-avatar.png",
    b: common_vendor.o((...args) => $options.handleAvatarClick && $options.handleAvatarClick(...args)),
    c: common_vendor.t($data.userInfo.nickname),
    d: common_assets._imports_0$1,
    e: common_vendor.o((...args) => $options.handleEditProfile && $options.handleEditProfile(...args)),
    f: common_vendor.t($data.userInfo.bio || "点击添加个人介绍..."),
    g: common_vendor.o((...args) => $options.handleEditBio && $options.handleEditBio(...args)),
    h: common_vendor.t($data.userInfo.postsCount),
    i: common_vendor.t($data.userInfo.likesCount),
    j: common_vendor.t($data.userInfo.level),
    k: common_vendor.f($data.achievements, (achievement, k0, i0) => {
      return {
        a: achievement.icon,
        b: common_vendor.t(achievement.name),
        c: achievement.id
      };
    }),
    l: $data.activeTab === "posts" ? 1 : "",
    m: common_vendor.o(($event) => $options.switchTab("posts")),
    n: $data.activeTab === "likes" ? 1 : "",
    o: common_vendor.o(($event) => $options.switchTab("likes")),
    p: $data.activeTab === "records" ? 1 : "",
    q: common_vendor.o(($event) => $options.switchTab("records")),
    r: $data.isLoading
  }, $data.isLoading ? {} : $options.currentContent.length === 0 ? {
    t: common_vendor.t($data.activeTab === "posts" ? "还没有发布过内容~" : $data.activeTab === "likes" ? "还没有点赞过内容~" : "还没有识别过哦~")
  } : {
    v: common_vendor.f($data.leftColumn, (poster, k0, i0) => {
      return {
        a: poster.id,
        b: "7b4c7c70-0-" + i0,
        c: common_vendor.p({
          ["poster-data"]: poster
        })
      };
    }),
    w: common_vendor.f($data.rightColumn, (poster, k0, i0) => {
      return {
        a: poster.id,
        b: "7b4c7c70-1-" + i0,
        c: common_vendor.p({
          ["poster-data"]: poster
        })
      };
    })
  }, {
    s: $options.currentContent.length === 0
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7b4c7c70"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ProfilePage/ProfilePage.js.map
