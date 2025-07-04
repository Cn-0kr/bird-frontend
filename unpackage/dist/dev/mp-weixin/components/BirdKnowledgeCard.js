"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  __name: "BirdKnowledgeCard",
  props: {
    birdData: {
      type: Object,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  emits: ["like", "share"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const isLiked = common_vendor.ref(false);
    const imageLoaded = common_vendor.ref(false);
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
          params = "?x-oss-process=image/resize,m_lfit,w_64,h_64/quality,q_90";
          break;
        case "small":
          params = "?x-oss-process=image/resize,m_lfit,w_150,h_150/quality,q_90";
          break;
        case "medium":
          params = "?x-oss-process=image/resize,m_lfit,w_300,h_300/quality,q_85";
          break;
        case "large":
          params = "?x-oss-process=image/resize,m_lfit,w_600,h_600/quality,q_85";
          break;
        default:
          params = "?x-oss-process=image/resize,m_lfit,w_64,h_64/quality,q_90";
      }
      return `${ossConfig.baseUrl}/${cleanFilename}${params}`;
    };
    const birdImageUrl = common_vendor.computed(() => {
      return getOSSUrl(props.birdData.imageUrl, "large");
    });
    const likeIconUrl = common_vendor.computed(() => {
      const iconPath = isLiked.value ? "static/icons/heart-filled.png" : "static/icons/heart.png";
      return getOSSUrl(iconPath, "icon");
    });
    const shareIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/share.png", "icon"));
    const habitatIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/habitat.png", "icon"));
    const sizeIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/size.png", "icon"));
    const weightIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/weight.png", "icon"));
    const wingspanIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/wingspan.png", "icon"));
    const dietIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/diet.png", "icon"));
    const behaviorIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/behavior.png", "icon"));
    const distributionIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/distribution.png", "icon"));
    const conservationIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/conservation.png", "icon"));
    const soundIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/sound.png", "icon"));
    const playIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/play.png", "icon"));
    const lifespanIconUrl = common_vendor.computed(() => getOSSUrl("static/icons/lifespan.png", "icon"));
    const getConservationClass = (status) => {
      const statusMap = {
        "无危": "status-safe",
        "近危": "status-near-threatened",
        "易危": "status-vulnerable",
        "濒危": "status-endangered",
        "极危": "status-critical"
      };
      return statusMap[status] || "status-unknown";
    };
    const onImageLoad = () => {
      imageLoaded.value = true;
    };
    const onImageError = () => {
      common_vendor.index.__f__("error", "at components/BirdKnowledgeCard.vue:274", "鸟类图片加载失败");
    };
    const handleLike = () => {
      isLiked.value = !isLiked.value;
      emit("like", props.birdData);
      common_vendor.index.vibrateShort();
    };
    const handleShare = () => {
      emit("share", props.birdData);
    };
    const playBirdCall = () => {
      common_vendor.index.showToast({
        title: "播放鸟鸣声",
        icon: "none"
      });
      common_vendor.index.vibrateShort();
    };
    return (_ctx, _cache) => {
      return {
        a: birdImageUrl.value,
        b: common_vendor.o(onImageLoad),
        c: common_vendor.o(onImageError),
        d: common_vendor.t(__props.birdData.name),
        e: common_vendor.t(__props.birdData.scientificName),
        f: likeIconUrl.value,
        g: common_vendor.o(handleLike),
        h: isLiked.value ? 1 : "",
        i: shareIconUrl.value,
        j: common_vendor.o(handleShare),
        k: habitatIconUrl.value,
        l: common_vendor.t(__props.birdData.habitat),
        m: sizeIconUrl.value,
        n: common_vendor.t(__props.birdData.size),
        o: weightIconUrl.value,
        p: common_vendor.t(__props.birdData.weight),
        q: wingspanIconUrl.value,
        r: common_vendor.t(__props.birdData.wingspan),
        s: common_vendor.f(__props.birdData.characteristics.slice(0, 4), (characteristic, index, i0) => {
          return {
            a: common_vendor.t(characteristic),
            b: index,
            c: `${index * 0.1}s`
          };
        }),
        t: dietIconUrl.value,
        v: common_vendor.t(__props.birdData.diet),
        w: behaviorIconUrl.value,
        x: common_vendor.t(__props.birdData.behavior),
        y: common_vendor.f(__props.birdData.funFacts.slice(0, 2), (fact, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(fact),
            c: index,
            d: `${index * 0.15}s`
          };
        }),
        z: distributionIconUrl.value,
        A: common_vendor.t(__props.birdData.distribution),
        B: conservationIconUrl.value,
        C: common_vendor.t(__props.birdData.conservationStatus),
        D: common_vendor.n(getConservationClass(__props.birdData.conservationStatus)),
        E: soundIconUrl.value,
        F: common_vendor.t(__props.birdData.callDescription),
        G: playIconUrl.value,
        H: common_vendor.o(playBirdCall),
        I: lifespanIconUrl.value,
        J: common_vendor.t(__props.birdData.lifespan),
        K: __props.isActive ? 1 : ""
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b5c70e1c"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/BirdKnowledgeCard.js.map
