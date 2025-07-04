"use strict";
const common_vendor = require("../common/vendor.js");
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
    const ossConfig = {
      baseUrl: "https://birdfront-oss.oss-cn-shanghai.aliyuncs.com"
    };
    const getOSSUrl = (filename, size = "medium") => {
      if (!filename)
        return "";
      const cleanFilename = filename.startsWith("/") ? filename.slice(1) : filename;
      let params = "";
      switch (size) {
        case "icon":
          params = "?x-oss-process=image/resize,m_lfit,w_48,h_48/quality,q_90";
          break;
        case "avatar":
          params = "?x-oss-process=image/resize,m_lfit,w_120,h_120/quality,q_90";
          break;
        case "small":
          params = "?x-oss-process=image/resize,m_lfit,w_300,h_300/quality,q_85";
          break;
        case "medium":
          params = "?x-oss-process=image/resize,m_lfit,w_600,h_600/quality,q_80";
          break;
        case "large":
          params = "?x-oss-process=image/resize,m_lfit,w_1200,h_1200/quality,q_85";
          break;
        default:
          params = "?x-oss-process=image/resize,m_lfit,w_600,h_600/quality,q_80";
      }
      return `${ossConfig.baseUrl}/${cleanFilename}${params}`;
    };
    const imageHeight = common_vendor.computed(() => {
      return props.posterData.imageHeight || 200;
    });
    const isTextTruncated = common_vendor.computed(() => {
      return props.posterData.description && props.posterData.description.length > 50;
    });
    const posterImageUrl = common_vendor.computed(() => {
      return getOSSUrl(props.posterData.imageUrl, "medium");
    });
    const authorAvatarUrl = common_vendor.computed(() => {
      var _a;
      const avatarPath = ((_a = props.posterData.author) == null ? void 0 : _a.avatar) || "static/avatars/default.png";
      return getOSSUrl(avatarPath, "avatar");
    });
    const locationIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/location.png", "icon"));
    const viewIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/view.png", "icon"));
    const shareIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/share.png", "icon"));
    const likeIconUrl = common_vendor.computed(() => {
      const iconPath = isLiked.value ? "static/icons/thumbs-up-filled.png" : "static/icons/thumbs-up.png";
      return getOSSUrl(iconPath, "icon");
    });
    const onImageLoad = () => {
      imageLoading.value = false;
    };
    const onImageError = () => {
      imageLoading.value = false;
      common_vendor.index.__f__("error", "at components/EnhancedPoster.vue:238", "图片加载失败:", props.posterData.imageUrl);
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
      var _a;
      return common_vendor.e({
        a: posterImageUrl.value,
        b: common_vendor.o(onImageLoad),
        c: common_vendor.o(onImageError),
        d: imageHeight.value + "rpx",
        e: imageLoading.value
      }, imageLoading.value ? {} : {}, {
        f: __props.posterData.location
      }, __props.posterData.location ? {
        g: locationIconUrl.value,
        h: common_vendor.t(__props.posterData.location)
      } : {}, {
        i: authorAvatarUrl.value,
        j: common_vendor.t(((_a = __props.posterData.author) == null ? void 0 : _a.name) || "匿名用户"),
        k: common_vendor.t(__props.posterData.publishTime || "刚刚"),
        l: common_vendor.t(__props.posterData.description),
        m: isTextExpanded.value ? 1 : "",
        n: isTextTruncated.value
      }, isTextTruncated.value ? {
        o: common_vendor.t(isTextExpanded.value ? "收起" : "全文"),
        p: common_vendor.o(toggleTextExpansion)
      } : {}, {
        q: viewIconUrl.value,
        r: common_vendor.t(formatNumber(__props.posterData.views)),
        s: likeIconUrl.value,
        t: common_vendor.t(formatNumber(__props.posterData.likes)),
        v: showLikeAnimation.value
      }, showLikeAnimation.value ? {} : {}, {
        w: isLiked.value ? 1 : "",
        x: common_vendor.o(handleLike),
        y: shareIconUrl.value,
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
