"use strict";
const common_vendor = require("../common/vendor.js");
const common_assets = require("../common/assets.js");
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
      common_vendor.index.__f__("error", "at components/BirdKnowledgeCard.vue:210", "鸟类图片加载失败");
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
        a: __props.birdData.imageUrl,
        b: common_vendor.o(onImageLoad),
        c: common_vendor.o(onImageError),
        d: common_vendor.t(__props.birdData.name),
        e: common_vendor.t(__props.birdData.scientificName),
        f: isLiked.value ? "/static/icons/heart-filled.png" : "/static/icons/heart.png",
        g: common_vendor.o(handleLike),
        h: isLiked.value ? 1 : "",
        i: common_assets._imports_0$4,
        j: common_vendor.o(handleShare),
        k: common_assets._imports_1$6,
        l: common_vendor.t(__props.birdData.habitat),
        m: common_assets._imports_2$4,
        n: common_vendor.t(__props.birdData.size),
        o: common_assets._imports_3$4,
        p: common_vendor.t(__props.birdData.weight),
        q: common_assets._imports_4$4,
        r: common_vendor.t(__props.birdData.wingspan),
        s: common_vendor.f(__props.birdData.characteristics.slice(0, 4), (characteristic, index, i0) => {
          return {
            a: common_vendor.t(characteristic),
            b: index,
            c: `${index * 0.1}s`
          };
        }),
        t: common_assets._imports_5$3,
        v: common_vendor.t(__props.birdData.diet),
        w: common_assets._imports_6$4,
        x: common_vendor.t(__props.birdData.behavior),
        y: common_vendor.f(__props.birdData.funFacts.slice(0, 2), (fact, index, i0) => {
          return {
            a: common_vendor.t(index + 1),
            b: common_vendor.t(fact),
            c: index,
            d: `${index * 0.15}s`
          };
        }),
        z: common_assets._imports_7$3,
        A: common_vendor.t(__props.birdData.distribution),
        B: common_assets._imports_8$2,
        C: common_vendor.t(__props.birdData.conservationStatus),
        D: common_vendor.n(getConservationClass(__props.birdData.conservationStatus)),
        E: common_assets._imports_9$1,
        F: common_vendor.t(__props.birdData.callDescription),
        G: common_assets._imports_10$1,
        H: common_vendor.o(playBirdCall),
        I: common_assets._imports_11,
        J: common_vendor.t(__props.birdData.lifespan),
        K: __props.isActive ? 1 : ""
      };
    };
  }
};
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-b5c70e1c"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/BirdKnowledgeCard.js.map
