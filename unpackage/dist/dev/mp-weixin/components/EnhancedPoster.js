"use strict";
const common_vendor = require("../common/vendor.js");
const common_assets = require("../common/assets.js");
const _sfc_main = {
  __name: "EnhancedPoster",
  props: {
    posterData: {
      type: Object,
      required: true,
      default: () => ({
        id: "",
        imageUrl: "",
        imageHeight: 200,
        description: "",
        views: 0,
        likes: 0,
        author: {
          name: "",
          avatar: ""
        },
        location: "",
        publishTime: ""
      })
    }
  },
  emits: ["like", "view", "share"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const imageLoading = common_vendor.ref(true);
    const isPressed = common_vendor.ref(false);
    const isTextExpanded = common_vendor.ref(false);
    const isLiked = common_vendor.ref(false);
    const showLikeAnimation = common_vendor.ref(false);
    const imageHeight = common_vendor.computed(() => {
      return props.posterData.imageHeight || 200;
    });
    const isTextTruncated = common_vendor.computed(() => {
      return props.posterData.description && props.posterData.description.length > 50;
    });
    const onImageLoad = () => {
      imageLoading.value = false;
    };
    const onImageError = () => {
      imageLoading.value = false;
      common_vendor.index.__f__("error", "at components/EnhancedPoster.vue:176", "图片加载失败:", props.posterData.imageUrl);
    };
    const onTouchStart = () => {
      isPressed.value = true;
    };
    const onTouchEnd = () => {
      isPressed.value = false;
    };
    const handlePosterClick = () => {
      emit("view", props.posterData);
      common_vendor.index.vibrateShort({
        type: "light"
      });
    };
    const toggleTextExpansion = () => {
      isTextExpanded.value = !isTextExpanded.value;
    };
    const handleLike = () => {
      if (isLiked.value)
        return;
      isLiked.value = true;
      showLikeAnimation.value = true;
      emit("like", props.posterData);
      common_vendor.index.vibrateShort({
        type: "medium"
      });
      setTimeout(() => {
        showLikeAnimation.value = false;
      }, 1e3);
    };
    const handleShare = () => {
      emit("share", props.posterData);
      common_vendor.index.showActionSheet({
        itemList: ["分享到微信", "分享到朋友圈", "复制链接"],
        success: (res) => {
          const actions = ["微信", "朋友圈", "复制链接"];
          const action = actions[res.tapIndex];
          common_vendor.index.showToast({
            title: `已${action}`,
            icon: "success",
            duration: 1500
          });
        }
      });
    };
    const formatNumber = (num) => {
      if (!num)
        return "0";
      if (num >= 1e4) {
        return (num / 1e4).toFixed(1) + "w";
      } else if (num >= 1e3) {
        return (num / 1e3).toFixed(1) + "k";
      }
      return num.toString();
    };
    common_vendor.onMounted(() => {
      const delay = Math.random() * 300;
      setTimeout(() => {
        imageLoading.value = false;
      }, delay);
    });
    return (_ctx, _cache) => {
      var _a, _b;
      return common_vendor.e({
        a: __props.posterData.imageUrl,
        b: common_vendor.o(onImageLoad),
        c: common_vendor.o(onImageError),
        d: imageHeight.value + "rpx",
        e: imageLoading.value
      }, imageLoading.value ? {} : {}, {
        f: __props.posterData.location
      }, __props.posterData.location ? {
        g: common_assets._imports_0$6,
        h: common_vendor.t(__props.posterData.location)
      } : {}, {
        i: ((_a = __props.posterData.author) == null ? void 0 : _a.avatar) || "/static/avatars/default.png",
        j: common_vendor.t(((_b = __props.posterData.author) == null ? void 0 : _b.name) || "匿名用户"),
        k: common_vendor.t(__props.posterData.publishTime || "刚刚"),
        l: common_vendor.t(__props.posterData.description),
        m: isTextExpanded.value ? 1 : "",
        n: isTextTruncated.value
      }, isTextTruncated.value ? {
        o: common_vendor.t(isTextExpanded.value ? "收起" : "全文"),
        p: common_vendor.o(toggleTextExpansion)
      } : {}, {
        q: common_assets._imports_1$4,
        r: common_vendor.t(formatNumber(__props.posterData.views)),
        s: isLiked.value ? "/static/icons/thumbs-up-filled.png" : "/static/icons/thumbs-up.png",
        t: common_vendor.t(formatNumber(__props.posterData.likes)),
        v: showLikeAnimation.value
      }, showLikeAnimation.value ? {} : {}, {
        w: isLiked.value ? 1 : "",
        x: common_vendor.o(handleLike),
        y: common_assets._imports_0$4,
        z: common_vendor.o(handleShare),
        A: common_vendor.o(handlePosterClick),
        B: isPressed.value ? 1 : "",
        C: common_vendor.o(onTouchStart),
        D: common_vendor.o(onTouchEnd)
      });
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-a176df61"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/EnhancedPoster.js.map
