"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
if (!Math) {
  BirdKnowledgeCard();
}
const BirdKnowledgeCard = () => "../../components/BirdKnowledgeCard.js";
const _sfc_main = {
  __name: "BirdEncyclopedia",
  setup(__props) {
    const currentMode = common_vendor.ref("search");
    const searchKeyword = common_vendor.ref("");
    const isSearching = common_vendor.ref(false);
    const searchResults = common_vendor.ref([]);
    const currentCardIndex = common_vendor.ref(0);
    const birdCards = common_vendor.ref([]);
    const isFlipping = common_vendor.ref(false);
    const touchStartY = common_vendor.ref(0);
    const touchCurrentY = common_vendor.ref(0);
    const cardTranslateY = common_vendor.ref(0);
    const cardOpacity = common_vendor.ref(1);
    const cardScale = common_vendor.ref(1);
    const backgroundCardScale = common_vendor.ref(0.95);
    const backgroundCardOpacity = common_vendor.ref(0.7);
    const mockBirdData = [
      {
        id: 1,
        name: "巨嘴鸟",
        scientificName: "Ramphastos sulfuratus",
        imageUrl: "/static/birds/toucan.jpg",
        tags: ["热带鸟类", "彩色", "大型"],
        habitat: "热带雨林",
        size: "体长50-65cm",
        weight: "500-860克",
        wingspan: "109-152cm",
        diet: "主要以果实为食，偶尔捕食小型动物",
        behavior: "群居性鸟类，善于飞行和攀爬",
        distribution: "中美洲和南美洲的热带雨林",
        conservationStatus: "无危",
        characteristics: [
          "拥有巨大而彩色的喙",
          "羽毛色彩鲜艳",
          "飞行能力强",
          "社交性强"
        ],
        funFacts: [
          "巨嘴鸟的大喙实际上很轻，内部充满了气囊",
          "它们的喙可以占到身体长度的1/3",
          "巨嘴鸟睡觉时会将喙折叠到背上"
        ],
        callDescription: "发出低沉的咕咕声和尖锐的叫声",
        nestingHabits: "在树洞中筑巢，每次产卵2-4枚",
        lifespan: "野外约15-20年"
      },
      {
        id: 2,
        name: "蜂鸟",
        scientificName: "Trochilidae",
        imageUrl: "/static/birds/hummingbird.jpg",
        tags: ["小型鸟类", "快速", "悬停"],
        habitat: "花园、森林边缘",
        size: "体长5-25cm",
        weight: "2-20克",
        wingspan: "5-25cm",
        diet: "花蜜、小昆虫",
        behavior: "能够悬停飞行，翅膀拍打频率极高",
        distribution: "南北美洲",
        conservationStatus: "大多数种类稳定",
        characteristics: [
          "世界上最小的鸟类",
          "能够悬停和倒飞",
          "心跳频率极快",
          "新陈代谢旺盛"
        ],
        funFacts: [
          "蜂鸟的翅膀每秒可拍打80次",
          "它们的心跳每分钟可达1260次",
          "蜂鸟可以倒着飞行",
          "它们的舌头比喙还要长"
        ],
        callDescription: "发出细小的吱吱声",
        nestingHabits: "建造精巧的杯状巢，每次产卵1-3枚",
        lifespan: "野外约3-5年"
      },
      {
        id: 3,
        name: "孔雀",
        scientificName: "Pavo cristatus",
        imageUrl: "/static/birds/peacock.jpg",
        tags: ["大型鸟类", "华丽", "地栖"],
        habitat: "森林、公园、农田",
        size: "体长100-115cm",
        weight: "4-6公斤",
        wingspan: "120-160cm",
        diet: "种子、昆虫、小型爬行动物",
        behavior: "雄鸟会展开尾羽进行求偶炫耀",
        distribution: "南亚、东南亚",
        conservationStatus: "无危",
        characteristics: [
          "雄鸟有华丽的尾羽",
          "能够短距离飞行",
          "叫声洪亮",
          "具有强烈的领域性"
        ],
        funFacts: [
          "孔雀的尾羽可以长达1.5米",
          '尾羽上的眼斑叫做"眼状斑"',
          "孔雀实际上可以飞行，但不擅长长距离飞行",
          '雌孔雀被称为"孔雀雌"'
        ],
        callDescription: "发出尖锐的叫声，特别是在求偶季节",
        nestingHabits: "在地面筑巢，每次产卵3-5枚",
        lifespan: "野外约15-20年"
      },
      {
        id: 4,
        name: "老鹰",
        scientificName: "Aquila chrysaetos",
        imageUrl: "/static/birds/eagle.jpg",
        tags: ["猛禽", "大型", "捕食者"],
        habitat: "山地、草原、森林",
        size: "体长75-100cm",
        weight: "3-7公斤",
        wingspan: "180-280cm",
        diet: "小型哺乳动物、鸟类、鱼类",
        behavior: "优秀的猎手，视力极佳",
        distribution: "全球各大洲（除南极洲）",
        conservationStatus: "部分种类濒危",
        characteristics: [
          "视力是人类的8倍",
          "强有力的爪子和喙",
          "飞行能力极强",
          "领域性强"
        ],
        funFacts: [
          "老鹰可以从3公里外发现猎物",
          "它们的俯冲速度可达每小时300公里",
          "老鹰可以活到30岁以上",
          "许多文化将老鹰视为力量和自由的象征"
        ],
        callDescription: "发出尖锐的啸叫声",
        nestingHabits: "在高处筑大型巢穴，每次产卵1-3枚",
        lifespan: "野外约20-30年"
      }
    ];
    const safeCurrentIndex = common_vendor.computed(() => {
      const index = parseInt(currentCardIndex.value) || 0;
      const totalCards = parseInt(birdCards.value.length) || 0;
      if (totalCards === 0)
        return 0;
      return Math.max(0, Math.min(index, totalCards - 1));
    });
    const safeTotalCards = common_vendor.computed(() => {
      return parseInt(birdCards.value.length) || 0;
    });
    const currentDisplayPage = common_vendor.computed(() => {
      return safeCurrentIndex.value + 1;
    });
    const canGoPrevious = common_vendor.computed(() => {
      return safeCurrentIndex.value > 0 && !isFlipping.value && safeTotalCards.value > 0;
    });
    const canGoNext = common_vendor.computed(() => {
      return safeCurrentIndex.value < safeTotalCards.value - 1 && !isFlipping.value && safeTotalCards.value > 0;
    });
    const currentCardStyle = common_vendor.computed(() => ({
      transform: `translateY(${cardTranslateY.value}px) scale(${cardScale.value})`,
      opacity: cardOpacity.value,
      zIndex: 10
    }));
    const backgroundCardStyle = common_vendor.computed(() => ({
      transform: `scale(${backgroundCardScale.value})`,
      opacity: backgroundCardOpacity.value,
      zIndex: 5
    }));
    const onTouchStart = (event) => {
      if (isFlipping.value)
        return;
      touchStartY.value = event.touches[0].clientY;
      touchCurrentY.value = event.touches[0].clientY;
    };
    const onTouchMove = (event) => {
      if (isFlipping.value || birdCards.value.length === 0)
        return;
      touchCurrentY.value = event.touches[0].clientY;
      const deltaY = touchCurrentY.value - touchStartY.value;
      const currentIndex = parseInt(currentCardIndex.value) || 0;
      const totalCards = parseInt(birdCards.value.length) || 0;
      if (deltaY < 0 && currentIndex < totalCards - 1) {
        const progress = Math.min(Math.abs(deltaY) / 200, 1);
        cardTranslateY.value = deltaY;
        cardOpacity.value = 1 - progress * 0.7;
        cardScale.value = 1 - progress * 0.1;
        backgroundCardScale.value = 0.95 + progress * 0.05;
        backgroundCardOpacity.value = 0.7 + progress * 0.3;
      }
    };
    const onTouchEnd = (event) => {
      if (isFlipping.value || birdCards.value.length === 0)
        return;
      const deltaY = touchCurrentY.value - touchStartY.value;
      if (deltaY < -100 && currentCardIndex.value < birdCards.value.length - 1) {
        nextCard();
      } else {
        resetCardPosition();
      }
    };
    const resetCardPosition = () => {
      cardTranslateY.value = 0;
      cardOpacity.value = 1;
      cardScale.value = 1;
      backgroundCardScale.value = 0.95;
      backgroundCardOpacity.value = 0.7;
    };
    const goBack = () => {
      common_vendor.index.navigateBack();
    };
    const toggleMode = () => {
      currentMode.value = currentMode.value === "search" ? "general" : "search";
      common_vendor.index.vibrateShort();
      if (currentMode.value === "general" && birdCards.value.length === 0) {
        initGeneralMode();
      }
    };
    const onSearchInput = () => {
      if (searchKeyword.value.trim()) {
        performSearch();
      } else {
        searchResults.value = [];
      }
    };
    const handleSearchConfirm = () => {
      if (searchKeyword.value.trim()) {
        performSearch();
      }
    };
    const clearSearch = () => {
      searchKeyword.value = "";
      searchResults.value = [];
    };
    const selectBird = (bird) => {
      currentMode.value = "general";
      const index = birdCards.value.findIndex((card) => card.id === bird.id);
      if (index !== -1) {
        currentCardIndex.value = parseInt(index);
      }
      searchKeyword.value = "";
      searchResults.value = [];
      resetCardPosition();
    };
    const previousCard = () => {
      const currentIndex = parseInt(currentCardIndex.value) || 0;
      const totalCards = parseInt(birdCards.value.length) || 0;
      if (currentIndex > 0 && !isFlipping.value && totalCards > 0) {
        isFlipping.value = true;
        cardTranslateY.value = 50;
        cardOpacity.value = 0;
        setTimeout(() => {
          const newIndex = Math.max(0, currentIndex - 1);
          currentCardIndex.value = newIndex;
          resetCardPosition();
          isFlipping.value = false;
        }, 300);
      }
    };
    const nextCard = () => {
      const currentIndex = parseInt(currentCardIndex.value) || 0;
      const totalCards = parseInt(birdCards.value.length) || 0;
      if (currentIndex < totalCards - 1 && !isFlipping.value && totalCards > 0) {
        isFlipping.value = true;
        cardTranslateY.value = -200;
        cardOpacity.value = 0;
        cardScale.value = 0.8;
        setTimeout(() => {
          const newIndex = Math.min(totalCards - 1, currentIndex + 1);
          currentCardIndex.value = newIndex;
          resetCardPosition();
          isFlipping.value = false;
        }, 300);
        common_vendor.index.vibrateShort();
      }
    };
    const onCardLike = (bird) => {
      common_vendor.index.showToast({
        title: "已收藏",
        icon: "success"
      });
    };
    const onCardShare = (bird) => {
      common_vendor.index.showShareMenu({
        title: `分享鸟类：${bird.name}`,
        path: `/pages/BirdEncyclopedia/BirdEncyclopedia?birdId=${bird.id}`
      });
    };
    const performSearch = async () => {
      try {
        isSearching.value = true;
        await new Promise((resolve) => setTimeout(resolve, 300));
        const keyword = searchKeyword.value.toLowerCase();
        const results = mockBirdData.filter(
          (bird) => bird.name.toLowerCase().includes(keyword) || bird.scientificName.toLowerCase().includes(keyword) || bird.tags.some((tag) => tag.includes(keyword)) || bird.habitat.includes(keyword)
        );
        searchResults.value = results;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/BirdEncyclopedia/BirdEncyclopedia.vue:627", "搜索失败:", error);
        common_vendor.index.showToast({
          title: "搜索失败",
          icon: "error"
        });
      } finally {
        isSearching.value = false;
      }
    };
    const initGeneralMode = () => {
      birdCards.value = [...mockBirdData];
      currentCardIndex.value = 0;
      resetCardPosition();
    };
    const loadBirdData = async () => {
      try {
        birdCards.value = [...mockBirdData];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/BirdEncyclopedia/BirdEncyclopedia.vue:659", "加载数据失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "error"
        });
      }
    };
    common_vendor.watch([birdCards, currentCardIndex], ([newBirdCards, newIndex]) => {
      const totalCards = parseInt(newBirdCards.length) || 0;
      const currentIndex = parseInt(newIndex) || 0;
      if (totalCards > 0) {
        const validIndex = Math.max(0, Math.min(currentIndex, totalCards - 1));
        if (validIndex !== currentIndex) {
          currentCardIndex.value = validIndex;
        }
      } else {
        currentCardIndex.value = 0;
      }
    }, { deep: true });
    common_vendor.onMounted(async () => {
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const options = currentPage.options || {};
      if (options.birdId) {
        currentMode.value = "general";
        await loadBirdData();
        const targetId = parseInt(options.birdId);
        const index = birdCards.value.findIndex((bird) => bird.id === targetId);
        if (index !== -1) {
          currentCardIndex.value = Math.max(0, Math.min(index, birdCards.value.length - 1));
        }
      } else {
        await loadBirdData();
      }
      resetCardPosition();
      if (birdCards.value.length > 0) {
        currentCardIndex.value = Math.max(0, Math.min(currentCardIndex.value, birdCards.value.length - 1));
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_assets._imports_0$5,
        b: common_vendor.o(goBack),
        c: currentMode.value === "search" ? "/static/icons/book.png" : "/static/icons/search.png",
        d: common_vendor.o(toggleMode),
        e: currentMode.value === "general" ? 1 : "",
        f: currentMode.value === "search"
      }, currentMode.value === "search" ? common_vendor.e({
        g: common_assets._imports_1$3,
        h: common_vendor.o([($event) => searchKeyword.value = $event.detail.value, onSearchInput]),
        i: common_vendor.o(handleSearchConfirm),
        j: searchKeyword.value,
        k: searchKeyword.value
      }, searchKeyword.value ? {
        l: common_assets._imports_2$3,
        m: common_vendor.o(clearSearch)
      } : {}, {
        n: isSearching.value
      }, isSearching.value ? {} : searchResults.value.length > 0 ? {
        p: common_vendor.f(searchResults.value, (bird, index, i0) => {
          return {
            a: bird.imageUrl,
            b: common_vendor.t(bird.name),
            c: common_vendor.t(bird.scientificName),
            d: common_vendor.f(bird.tags, (tag, k1, i1) => {
              return {
                a: common_vendor.t(tag),
                b: tag
              };
            }),
            e: bird.id,
            f: common_vendor.o(($event) => selectBird(bird), bird.id),
            g: `${index * 0.1}s`
          };
        })
      } : searchKeyword.value && !isSearching.value ? {
        r: common_assets._imports_3$3
      } : {
        s: common_assets._imports_4$3
      }, {
        o: searchResults.value.length > 0,
        q: searchKeyword.value && !isSearching.value
      }) : common_vendor.e({
        t: common_vendor.t(currentDisplayPage.value),
        v: common_vendor.t(safeTotalCards.value),
        w: `${safeTotalCards.value > 0 ? currentDisplayPage.value / safeTotalCards.value * 100 : 0}%`,
        x: safeCurrentIndex.value < safeTotalCards.value - 1 && safeTotalCards.value > 1
      }, safeCurrentIndex.value < safeTotalCards.value - 1 && safeTotalCards.value > 1 ? {
        y: common_vendor.o(onCardLike),
        z: common_vendor.o(onCardShare),
        A: common_vendor.p({
          ["bird-data"]: birdCards.value[safeCurrentIndex.value + 1],
          ["is-active"]: false
        }),
        B: common_vendor.s(backgroundCardStyle.value)
      } : {}, {
        C: safeTotalCards.value > 0 && birdCards.value[safeCurrentIndex.value]
      }, safeTotalCards.value > 0 && birdCards.value[safeCurrentIndex.value] ? {
        D: common_vendor.o(onCardLike),
        E: common_vendor.o(onCardShare),
        F: common_vendor.p({
          ["bird-data"]: birdCards.value[safeCurrentIndex.value],
          ["is-active"]: true
        }),
        G: common_vendor.s(currentCardStyle.value),
        H: isFlipping.value ? 1 : ""
      } : {}, {
        I: common_vendor.o(onTouchStart),
        J: common_vendor.o(onTouchMove),
        K: common_vendor.o(onTouchEnd),
        L: common_assets._imports_5$2,
        M: common_assets._imports_6$3,
        N: isFlipping.value ? 1 : "",
        O: common_assets._imports_7$2,
        P: !canGoPrevious.value ? 1 : "",
        Q: common_vendor.o(previousCard),
        R: common_vendor.t(currentDisplayPage.value),
        S: common_vendor.t(safeTotalCards.value),
        T: common_assets._imports_8$1,
        U: !canGoNext.value ? 1 : "",
        V: common_vendor.o(nextCard)
      }));
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-ab46afbd"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/BirdEncyclopedia/BirdEncyclopedia.js.map
