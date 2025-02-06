"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      posterData: null,
      comments: [],
      newComment: ""
    };
  },
  onLoad(options) {
    if (options.postId) {
      this.fetchPosterData(options.postId);
    }
  },
  methods: {
    fetchPosterData(postId) {
      this.posterData = {
        id: postId,
        imageUrl: "/static/posts/bird1.jpg",
        description: "今天在公园拍到的小鸟，真的太可爱了！",
        likes: 0,
        // 添加点赞数
        isLiked: false
        // 添加点赞状态
      };
      this.comments = [
        {
          id: 1,
          content: "这只鸟太漂亮了！"
        },
        {
          id: 2,
          content: "看起来是一只知更鸟呢"
        }
      ];
    },
    goBack() {
      common_vendor.index.navigateBack({
        delta: 1
      });
    },
    submitComment() {
      if (!this.newComment.trim()) {
        common_vendor.index.showToast({
          title: "请输入评论内容",
          icon: "none"
        });
        return;
      }
      this.comments.unshift({
        id: this.comments.length + 1,
        content: this.newComment.trim()
      });
      this.newComment = "";
      common_vendor.index.showToast({
        title: "评论成功",
        icon: "success"
      });
    },
    // 添加点赞处理方法
    handleLike() {
      if (this.posterData) {
        this.posterData.isLiked = !this.posterData.isLiked;
        this.posterData.likes += this.posterData.isLiked ? 1 : -1;
        common_vendor.index.showToast({
          title: this.posterData.isLiked ? "点赞成功" : "已取消点赞",
          icon: "none"
        });
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.goBack && $options.goBack(...args)),
    b: $data.posterData
  }, $data.posterData ? {
    c: $data.posterData.imageUrl,
    d: common_vendor.t($data.posterData.description),
    e: common_vendor.t($data.posterData.likes),
    f: $data.posterData.isLiked ? 1 : "",
    g: common_vendor.t($data.posterData.isLiked ? "已点赞" : "点赞"),
    h: $data.posterData.isLiked ? 1 : "",
    i: common_vendor.o((...args) => $options.handleLike && $options.handleLike(...args)),
    j: common_vendor.t($data.comments.length),
    k: common_vendor.f($data.comments, (comment, k0, i0) => {
      return {
        a: common_vendor.t(comment.content),
        b: comment.id
      };
    })
  } : {}, {
    l: $data.newComment,
    m: common_vendor.o(($event) => $data.newComment = $event.detail.value),
    n: common_vendor.o((...args) => $options.submitComment && $options.submitComment(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-48288800"]]);
wx.createPage(MiniProgramPage);
