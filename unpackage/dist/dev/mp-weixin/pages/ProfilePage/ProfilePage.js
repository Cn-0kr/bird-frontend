"use strict";
const common_vendor = require("../../common/vendor.js");
const api_services_user = require("../../api/services/user.js");
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
      // OSS配置
      ossConfig: {
        baseUrl: "https://birdfront-oss.oss-cn-shanghai.aliyuncs.com",
        defaultParams: "?x-oss-process=image/resize,m_lfit,w_300,h_300/quality,q_80"
      },
      userInfo: {
        avatar: "static/default-avatar.png",
        // 不要以斜杠开头
        nickname: "鸟类爱好者",
        bio: "",
        postsCount: 0,
        likesCount: 0,
        level: 1
      },
      achievements: [
        {
          id: 1,
          name: "初级观鸟员",
          icon: "static/icons/achievements/beginner.png"
        },
        {
          id: 2,
          name: "摄影新手",
          icon: "static/icons/achievements/photographer.png"
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
    },
    // 用户头像URL
    userAvatarUrl() {
      return this.getOSSUrl(this.userInfo.avatar, "small");
    },
    // 编辑图标URL
    editIconUrl() {
      return this.getOSSUrl("static/icons/edit.png", "icon");
    }
  },
  async onLoad() {
    await this.loadUserInfo();
    this.loadContent();
  },
  methods: {
    /**
     * 获取OSS图片URL - 简化版本
     * @param {string} filename - 文件名
     * @param {string} size - 尺寸类型
     * @returns {string} 完整的OSS URL
     */
    getOSSUrl(filename, size = "medium") {
      if (!filename) {
        return `${this.ossConfig.baseUrl}/static/default-avatar.png${this.ossConfig.defaultParams}`;
      }
      const cleanFilename = filename.startsWith("/") ? filename.slice(1) : filename;
      let params = "";
      switch (size) {
        case "icon":
          params = "?x-oss-process=image/resize,m_lfit,w_50,h_50/quality,q_90";
          break;
        case "small":
          params = "?x-oss-process=image/resize,m_lfit,w_150,h_150/quality,q_90";
          break;
        case "medium":
          params = "?x-oss-process=image/resize,m_lfit,w_300,h_300/quality,q_80";
          break;
        case "large":
          params = "?x-oss-process=image/resize,m_lfit,w_600,h_600/quality,q_85";
          break;
      }
      return `${this.ossConfig.baseUrl}/${cleanFilename}${params}`;
    },
    /**
     * 加载用户信息
     */
    async loadUserInfo() {
      try {
        const intro = await userService.getIntro();
        this.userInfo.bio = intro || "点击添加个人介绍...";
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/ProfilePage/ProfilePage.vue:247", "Failed to load user info:", error);
        common_vendor.index.showToast({
          title: "加载个人信息失败",
          icon: "none"
        });
      }
    },
    /**
     * 处理头像点击事件
     */
    handleAvatarClick() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: async (res) => {
          try {
            this.userInfo.avatar = `avatars/user_${Date.now()}.jpg`;
            common_vendor.index.showToast({
              title: "头像更新成功",
              icon: "success"
            });
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/ProfilePage/ProfilePage.vue:277", "头像上传失败:", error);
            common_vendor.index.showToast({
              title: "头像上传失败",
              icon: "none"
            });
          }
        }
      });
    },
    /**
     * 处理头像加载错误
     */
    handleAvatarError() {
      common_vendor.index.__f__("warn", "at pages/ProfilePage/ProfilePage.vue:291", "头像加载失败，使用默认头像");
      this.userInfo.avatar = "static/default-avatar.png";
    },
    /**
     * 编辑个人资料
     */
    handleEditProfile() {
      common_vendor.index.navigateTo({
        url: "/pages/EditProfile/EditProfile"
      });
    },
    /**
     * 编辑个人介绍
     */
    handleEditBio() {
      common_vendor.index.showModal({
        title: "编辑个人介绍",
        editable: true,
        content: this.userInfo.bio === "点击添加个人介绍..." ? "" : this.userInfo.bio,
        success: (res) => {
          if (res.confirm) {
            this.updateBio(res.content);
          }
        }
      });
    },
    /**
     * 更新个人介绍
     */
    async updateBio(newBio) {
      try {
        this.userInfo.bio = newBio || "点击添加个人介绍...";
        common_vendor.index.showToast({
          title: "更新成功",
          icon: "success"
        });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/ProfilePage/ProfilePage.vue:334", "Failed to update bio:", error);
        common_vendor.index.showToast({
          title: "更新失败",
          icon: "none"
        });
      }
    },
    /**
     * 切换标签页
     */
    switchTab(tab) {
      if (this.activeTab !== tab) {
        this.activeTab = tab;
        this.loadContent();
      }
    },
    /**
     * 加载内容数据
     */
    async loadContent() {
      this.isLoading = true;
      try {
        await new Promise((resolve) => setTimeout(resolve, 500));
        let data;
        switch (this.activeTab) {
          case "posts":
            data = [
              {
                id: 1,
                imageUrl: "static/posts/bird1.jpg",
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
                imageUrl: "static/posts/bird2.jpg",
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
                imageUrl: "static/recognition/bird1.jpg",
                imageHeight: 240,
                description: "识别结果：红头长尾山雀",
                accuracy: "98%",
                date: "2024-03-20"
              },
              {
                id: 5,
                imageUrl: "static/recognition/bird2.jpg",
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
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/ProfilePage/ProfilePage.vue:417", "Load content error:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.isLoading = false;
      }
    },
    /**
     * 分发内容到左右列（瀑布流布局）
     */
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
    a: $options.userAvatarUrl,
    b: common_vendor.o((...args) => $options.handleAvatarError && $options.handleAvatarError(...args)),
    c: common_vendor.o((...args) => $options.handleAvatarClick && $options.handleAvatarClick(...args)),
    d: common_vendor.t($data.userInfo.nickname),
    e: $options.editIconUrl,
    f: common_vendor.o((...args) => $options.handleEditProfile && $options.handleEditProfile(...args)),
    g: common_vendor.t($data.userInfo.bio || "点击添加个人介绍..."),
    h: common_vendor.o((...args) => $options.handleEditBio && $options.handleEditBio(...args)),
    i: common_vendor.t($data.userInfo.postsCount),
    j: common_vendor.t($data.userInfo.likesCount),
    k: common_vendor.t($data.userInfo.level),
    l: common_vendor.f($data.achievements, (achievement, k0, i0) => {
      return {
        a: $options.getOSSUrl(achievement.icon),
        b: common_vendor.t(achievement.name),
        c: achievement.id
      };
    }),
    m: $data.activeTab === "posts" ? 1 : "",
    n: common_vendor.o(($event) => $options.switchTab("posts")),
    o: $data.activeTab === "likes" ? 1 : "",
    p: common_vendor.o(($event) => $options.switchTab("likes")),
    q: $data.activeTab === "records" ? 1 : "",
    r: common_vendor.o(($event) => $options.switchTab("records")),
    s: $data.isLoading
  }, $data.isLoading ? {} : $options.currentContent.length === 0 ? {
    v: common_vendor.t($data.activeTab === "posts" ? "还没有发布过内容~" : $data.activeTab === "likes" ? "还没有点赞过内容~" : "还没有识别过哦~")
  } : {
    w: common_vendor.f($data.leftColumn, (poster, k0, i0) => {
      return {
        a: poster.id,
        b: "7b4c7c70-0-" + i0,
        c: common_vendor.p({
          ["poster-data"]: poster
        })
      };
    }),
    x: common_vendor.f($data.rightColumn, (poster, k0, i0) => {
      return {
        a: poster.id,
        b: "7b4c7c70-1-" + i0,
        c: common_vendor.p({
          ["poster-data"]: poster
        })
      };
    })
  }, {
    t: $options.currentContent.length === 0
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7b4c7c70"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/ProfilePage/ProfilePage.js.map
