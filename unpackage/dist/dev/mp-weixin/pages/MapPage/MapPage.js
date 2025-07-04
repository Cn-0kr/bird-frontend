"use strict";
const common_vendor = require("../../common/vendor.js");
if (!Math) {
  TabBar();
}
const TabBar = () => "../../components/tabbar.js";
const TENCENT_MAP_KEY = "2VEBZ-H2SW5-URJIL-I26ZE-2EB2E-BOF27";
const _sfc_main = {
  __name: "MapPage",
  setup(__props) {
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
          params = "?x-oss-process=image/resize,m_lfit,w_32,h_32/quality,q_90/format,webp";
          break;
        case "small":
          params = "?x-oss-process=image/resize,m_lfit,w_100,h_100/quality,q_90/format,webp";
          break;
        case "medium":
          params = "?x-oss-process=image/resize,m_lfit,w_200,h_150/quality,q_90/format,webp";
          break;
        case "large":
          params = "?x-oss-process=image/resize,m_lfit,w_400,h_250/quality,q_90/format,webp";
          break;
        case "marker":
          params = "?x-oss-process=image/resize,m_lfit,w_40,h_40/quality,q_90/format,webp";
          break;
        default:
          params = "?x-oss-process=image/resize,m_lfit,w_200,h_150/quality,q_90/format,webp";
      }
      return `${ossConfig.baseUrl}/${cleanFilename}${params}`;
    };
    const latitude = common_vendor.ref(31.2304);
    const longitude = common_vendor.ref(121.4737);
    const scale = common_vendor.ref(14);
    const searchText = common_vendor.ref("");
    const markers = common_vendor.ref([]);
    const polyline = common_vendor.ref([]);
    const showInfoCard = common_vendor.ref(false);
    const selectedLocation = common_vendor.ref({});
    const isLoading = common_vendor.ref(false);
    const loadingText = common_vendor.ref("加载中...");
    const showLegend = common_vendor.ref(false);
    const currentMapLayer = common_vendor.ref("standard");
    const birdLocations = common_vendor.ref([
      {
        id: 1,
        name: "嘉定紫藤园",
        category: "湿地公园",
        latitude: 31.2354,
        longitude: 121.4617,
        image: "static/images/locations/jiading-wisteria.jpg",
        description: "嘉定紫藤园是上海市著名的观鸟地点，拥有丰富的湿地生态系统。这里常年有20多种水鸟栖息，是观测候鸟迁徙的绝佳地点。园内有专门的观鸟平台，每年春秋两季是最佳观鸟时间。",
        birdStats: {
          species: 42,
          observations: 186,
          rareSpecies: 3
        },
        bestTime: "春秋两季（3-5月，9-11月）清晨5-8点，傍晚4-6点",
        commonBirds: [
          { id: 1, name: "白鹭" },
          { id: 2, name: "夜鹭" },
          { id: 3, name: "小䴙䴘" },
          { id: 4, name: "绿头鸭" }
        ],
        markerIcon: "static/icons/marker-wetland.png"
      },
      {
        id: 2,
        name: "新城公园",
        category: "城市公园",
        latitude: 31.2404,
        longitude: 121.4837,
        image: "static/images/locations/xincheng-park.jpg",
        description: "新城公园是市区内难得的鸟类栖息地，公园内有多种乔木和灌木，为小型鸟类提供了良好的栖息环境。这里常见麻雀、白头鹎、黑尾蜡嘴雀等鸟类，是城市中轻松观鸟的好去处。",
        birdStats: {
          species: 18,
          observations: 94,
          rareSpecies: 0
        },
        bestTime: "全年适宜，早晨6-9点最佳",
        commonBirds: [
          { id: 5, name: "白头鹎" },
          { id: 6, name: "麻雀" },
          { id: 7, name: "乌鸫" },
          { id: 8, name: "珠颈斑鸠" }
        ],
        markerIcon: "static/icons/marker-park.png"
      },
      {
        id: 3,
        name: "环城河绿带",
        category: "河道湿地",
        latitude: 31.2284,
        longitude: 121.4527,
        image: "static/images/locations/huancheng-river.jpg",
        description: "环城河绿带沿线栽种了大量水生植物，吸引了多种水鸟前来觅食和栖息。河边设有多个观鸟点，常见鸟类包括白鹭、夜鹭、绿头鸭等。这里环境幽静，是观鸟爱好者的秘密天堂。",
        birdStats: {
          species: 26,
          observations: 132,
          rareSpecies: 1
        },
        bestTime: "春夏季节（4-8月）早晚时分",
        commonBirds: [
          { id: 9, name: "白鹭" },
          { id: 10, name: "绿头鸭" },
          { id: 11, name: "翠鸟" },
          { id: 12, name: "黑水鸡" }
        ],
        markerIcon: "static/icons/marker-river.png"
      },
      {
        id: 4,
        name: "嘉宝花园别墅",
        category: "居民区",
        latitude: 31.2234,
        longitude: 121.4637,
        image: "static/images/locations/jiabao-garden.jpg",
        description: "嘉宝花园别墅区内绿化良好，种植了多种果树和花卉，吸引了很多小型鸟类前来筑巢。这里可以观察到柳莺、绣眼鸟等小型鸟类，是城市观鸟的好去处。此处为居民区，参观时请保持安静。",
        birdStats: {
          species: 13,
          observations: 67,
          rareSpecies: 0
        },
        bestTime: "春季（3-5月）清晨时分",
        commonBirds: [
          { id: 13, name: "柳莺" },
          { id: 14, name: "绣眼鸟" },
          { id: 15, name: "红嘴蓝鹊" },
          { id: 16, name: "白头鹎" }
        ],
        markerIcon: "static/icons/marker-residential.png"
      },
      {
        id: 5,
        name: "梦花湖",
        category: "湖泊湿地",
        latitude: 31.2454,
        longitude: 121.4557,
        image: "static/images/locations/menghua-lake.jpg",
        description: "梦花湖是一个人工湖泊，周围植被茂盛，湖面开阔，是多种水鸟和涉禽的栖息地。这里可以观察到白鹭、苍鹭、小䴙䴘等水鸟，以及多种雁鸭类。湖边有专门的观鸟屋和栈道，适合长时间观鸟。",
        birdStats: {
          species: 35,
          observations: 158,
          rareSpecies: 2
        },
        bestTime: "全年适宜，迁徙季节（春秋）最佳",
        commonBirds: [
          { id: 17, name: "苍鹭" },
          { id: 18, name: "小䴙䴘" },
          { id: 19, name: "赤膀鸭" },
          { id: 20, name: "白骨顶" }
        ],
        markerIcon: "static/icons/marker-wetland.png"
      },
      {
        id: 6,
        name: "垃圾填埋场湿地",
        category: "恢复性湿地",
        latitude: 31.2194,
        longitude: 121.4867,
        image: "static/images/locations/landfill-wetland.jpg",
        description: "这个区域原是垃圾填埋场，后经过生态修复，现已成为重要的鸟类栖息地。由于昆虫和小型动物丰富，吸引了大量猛禽和涉禽。这里常见猛禽包括红隼、普通鵟等，是观察猛禽的理想场所。",
        birdStats: {
          species: 22,
          observations: 76,
          rareSpecies: 2
        },
        bestTime: "秋冬季节（10-2月）中午时分",
        commonBirds: [
          { id: 21, name: "红隼" },
          { id: 22, name: "普通鵟" },
          { id: 23, name: "灰伯劳" },
          { id: 24, name: "田鹨" }
        ],
        markerIcon: "static/icons/marker-wetland.png"
      },
      {
        id: 7,
        name: "绿地嘉尚国际广场",
        category: "城市绿地",
        latitude: 31.2284,
        longitude: 121.4987,
        image: "static/images/locations/jiashang-plaza.jpg",
        description: "绿地嘉尚国际广场周边有精心设计的城市绿地，种植了多种乡土树种，为鸟类提供了良好的栖息环境。这里常见鸟类包括珠颈斑鸠、树麻雀、白头鹎等，适合早晨或傍晚前来观鸟。",
        birdStats: {
          species: 16,
          observations: 83,
          rareSpecies: 0
        },
        bestTime: "全年适宜，早晨和傍晚最佳",
        commonBirds: [
          { id: 25, name: "珠颈斑鸠" },
          { id: 26, name: "树麻雀" },
          { id: 27, name: "白头鹎" },
          { id: 28, name: "八哥" }
        ],
        markerIcon: "static/icons/marker-park.png"
      }
    ]);
    common_vendor.computed(() => {
      return birdLocations.value.reduce((total, location) => {
        return total + location.birdStats.species;
      }, 0);
    });
    common_vendor.computed(() => {
      return birdLocations.value.reduce((total, location) => {
        return total + location.birdStats.observations;
      }, 0);
    });
    const checkAndRequestLocationPermission = () => {
      return new Promise((resolve, reject) => {
        common_vendor.index.getSetting({
          success: (res) => {
            if (res.authSetting["scope.userLocation"] === false) {
              common_vendor.index.showModal({
                title: "需要位置权限",
                content: '为了提供准确的地图服务，需要获取您的位置信息。请在设置中允许"云雀解码"访问您的位置。',
                confirmText: "去设置",
                cancelText: "取消",
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    common_vendor.index.openSetting({
                      success: (settingRes) => {
                        if (settingRes.authSetting["scope.userLocation"]) {
                          resolve();
                        } else {
                          reject(new Error("未获得位置权限"));
                        }
                      }
                    });
                  } else {
                    reject(new Error("用户取消授权"));
                  }
                }
              });
            } else if (res.authSetting["scope.userLocation"] === true) {
              resolve();
            } else {
              common_vendor.index.authorize({
                scope: "scope.userLocation",
                success: () => {
                  resolve();
                },
                fail: (err) => {
                  reject(err);
                }
              });
            }
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    };
    const getCurrentLocation = () => {
      isLoading.value = true;
      loadingText.value = "定位中...";
      checkAndRequestLocationPermission().then(() => {
        common_vendor.index.getLocation({
          type: "gcj02",
          success: (res) => {
            latitude.value = res.latitude;
            longitude.value = res.longitude;
            scale.value = 16;
            common_vendor.index.showToast({
              title: "定位成功",
              icon: "success",
              duration: 1500
            });
            loadBirdLocations();
          },
          fail: (err) => {
            common_vendor.index.__f__("error", "at pages/MapPage/MapPage.vue:493", "获取位置失败：", err);
            common_vendor.index.showToast({
              title: "获取位置失败",
              icon: "none"
            });
            loadBirdLocations();
          },
          complete: () => {
            isLoading.value = false;
          }
        });
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/MapPage/MapPage.vue:508", "位置权限错误：", err);
        isLoading.value = false;
        loadBirdLocations();
      });
    };
    const moveToCurrentLocation = () => {
      try {
        common_vendor.index.vibrateShort({
          type: "light"
        });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/MapPage/MapPage.vue:526", "触觉反馈不支持:", error);
      }
      getCurrentLocation();
    };
    const searchLocation = (keyword) => {
      return new Promise((resolve, reject) => {
        common_vendor.index.request({
          url: `https://apis.map.qq.com/ws/place/v1/search`,
          method: "GET",
          data: {
            key: TENCENT_MAP_KEY,
            keyword,
            boundary: "nearby(" + latitude.value + "," + longitude.value + ",10000)",
            // 搜索范围10km
            page_size: 10,
            page_index: 1
          },
          success: (res) => {
            if (res.data && res.data.status === 0 && res.data.data.length > 0) {
              resolve(res.data.data);
            } else {
              reject(new Error("未找到相关地点"));
            }
          },
          fail: (err) => {
            reject(err);
          }
        });
      });
    };
    const handleSearch = async () => {
      if (!searchText.value.trim()) {
        common_vendor.index.showToast({
          title: "请输入搜索内容",
          icon: "none"
        });
        return;
      }
      isLoading.value = true;
      loadingText.value = "搜索中...";
      try {
        common_vendor.index.vibrateShort({
          type: "light"
        });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/MapPage/MapPage.vue:583", "触觉反馈不支持:", error);
      }
      try {
        const localResults = birdLocations.value.filter(
          (location) => location.name.includes(searchText.value) || location.category.includes(searchText.value) || location.description.includes(searchText.value) || location.commonBirds.some((bird) => bird.name.includes(searchText.value))
        );
        if (localResults.length > 0) {
          const firstResult = localResults[0];
          latitude.value = firstResult.latitude;
          longitude.value = firstResult.longitude;
          scale.value = 16;
          highlightSearchResults(localResults);
          common_vendor.index.showToast({
            title: `找到${localResults.length}个相关地点`,
            icon: "success"
          });
        } else {
          const result = await searchLocation(searchText.value);
          if (result && result.length > 0) {
            latitude.value = result[0].location.lat;
            longitude.value = result[0].location.lng;
            const searchMarker = {
              id: 999,
              latitude: result[0].location.lat,
              longitude: result[0].location.lng,
              title: result[0].title,
              iconPath: getOSSUrl("static/icons/marker-search.png", "marker"),
              width: 40,
              height: 40,
              callout: {
                content: result[0].title,
                color: "#000000",
                fontSize: 12,
                borderRadius: 5,
                bgColor: "#ffffff",
                padding: 5,
                display: "ALWAYS"
              }
            };
            const dbMarkers = markers.value.filter((marker) => marker.id !== 999);
            markers.value = [...dbMarkers, searchMarker];
            scale.value = 16;
            common_vendor.index.showToast({
              title: "搜索成功",
              icon: "success"
            });
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/MapPage/MapPage.vue:650", "搜索失败:", error);
        common_vendor.index.showToast({
          title: "搜索失败: " + error.message,
          icon: "none"
        });
      } finally {
        isLoading.value = false;
      }
    };
    const highlightSearchResults = (results) => {
      markers.value = birdLocations.value.map((location) => {
        const isHighlighted = results.some((result) => result.id === location.id);
        return {
          id: location.id,
          latitude: location.latitude,
          longitude: location.longitude,
          title: location.name,
          iconPath: getOSSUrl(
            isHighlighted ? "static/icons/marker-highlighted.png" : location.markerIcon,
            "marker"
          ),
          width: isHighlighted ? 50 : 40,
          height: isHighlighted ? 50 : 40,
          callout: {
            content: location.name,
            color: isHighlighted ? "#ff6b6b" : "#000000",
            fontSize: isHighlighted ? 14 : 12,
            borderRadius: 5,
            bgColor: isHighlighted ? "#fff5f5" : "#ffffff",
            padding: 5,
            display: "ALWAYS"
          }
        };
      });
    };
    const zoomIn = () => {
      if (scale.value < 20) {
        scale.value += 2;
        try {
          common_vendor.index.vibrateShort({
            type: "light"
          });
        } catch (error) {
          common_vendor.index.__f__("warn", "at pages/MapPage/MapPage.vue:705", "触觉反馈不支持:", error);
        }
      }
    };
    const zoomOut = () => {
      if (scale.value > 5) {
        scale.value -= 2;
        try {
          common_vendor.index.vibrateShort({
            type: "light"
          });
        } catch (error) {
          common_vendor.index.__f__("warn", "at pages/MapPage/MapPage.vue:723", "触觉反馈不支持:", error);
        }
      }
    };
    const switchMapLayer = () => {
      currentMapLayer.value = currentMapLayer.value === "standard" ? "satellite" : "standard";
      try {
        common_vendor.index.vibrateShort({
          type: "medium"
        });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/MapPage/MapPage.vue:740", "触觉反馈不支持:", error);
      }
      common_vendor.index.showToast({
        title: currentMapLayer.value === "standard" ? "标准地图" : "卫星地图",
        icon: "none",
        duration: 1e3
      });
    };
    const onRegionChange = (e) => {
      if (e.type === "end") {
        common_vendor.index.__f__("log", "at pages/MapPage/MapPage.vue:756", "地图区域变化:", e);
      }
    };
    const loadBirdLocations = () => {
      isLoading.value = true;
      loadingText.value = "加载观测点数据...";
      try {
        setTimeout(() => {
          const locationMarkers = birdLocations.value.map((loc) => ({
            id: loc.id,
            latitude: loc.latitude,
            longitude: loc.longitude,
            title: loc.name,
            iconPath: getOSSUrl(loc.markerIcon, "marker"),
            width: 40,
            height: 40,
            callout: {
              content: loc.name,
              color: "#000000",
              fontSize: 12,
              borderRadius: 5,
              bgColor: "#ffffff",
              padding: 5,
              display: "ALWAYS"
            }
          }));
          markers.value = locationMarkers;
          drawAreaBoundary(birdLocations.value);
          isLoading.value = false;
          common_vendor.index.showToast({
            title: `已加载${birdLocations.value.length}个观测点`,
            icon: "success",
            duration: 1500
          });
        }, 800);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/MapPage/MapPage.vue:805", "加载数据失败:", error);
        isLoading.value = false;
        common_vendor.index.showToast({
          title: "加载数据失败",
          icon: "none"
        });
      }
    };
    const drawAreaBoundary = (locations) => {
      if (locations.length < 3)
        return;
      const points = locations.map((loc) => ({
        latitude: loc.latitude,
        longitude: loc.longitude
      }));
      points.push(points[0]);
      polyline.value = [{
        points,
        color: "#1E90FF77",
        // 半透明蓝色
        width: 2,
        dottedLine: false,
        arrowLine: false
      }];
    };
    const onMarkerTap = (e) => {
      common_vendor.index.__f__("log", "at pages/MapPage/MapPage.vue:843", "Marker tapped:", e);
      const markerId = e.detail.markerId;
      try {
        common_vendor.index.vibrateShort({
          type: "medium"
        });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/MapPage/MapPage.vue:852", "触觉反馈不支持:", error);
      }
      const location = birdLocations.value.find((loc) => loc.id === markerId);
      if (location) {
        selectedLocation.value = location;
        showInfoCard.value = true;
        common_vendor.index.__f__("log", "at pages/MapPage/MapPage.vue:864", "显示地点信息:", location.name);
      } else {
        common_vendor.index.__f__("log", "at pages/MapPage/MapPage.vue:866", "未找到匹配的地点信息, ID:", markerId);
        common_vendor.index.showToast({
          title: "未找到该地点信息",
          icon: "none"
        });
      }
    };
    const closeInfoCard = () => {
      showInfoCard.value = false;
      selectedLocation.value = {};
      try {
        common_vendor.index.vibrateShort({
          type: "light"
        });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/MapPage/MapPage.vue:887", "触觉反馈不支持:", error);
      }
    };
    const viewDetails = () => {
      common_vendor.index.__f__("log", "at pages/MapPage/MapPage.vue:897", "查看详情:", selectedLocation.value.name);
      try {
        common_vendor.index.vibrateShort({
          type: "medium"
        });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/MapPage/MapPage.vue:905", "触觉反馈不支持:", error);
      }
      common_vendor.index.navigateTo({
        url: `/pages/LocationDetail/LocationDetail?id=${selectedLocation.value.id}`,
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/MapPage/MapPage.vue:912", "跳转失败:", error);
          common_vendor.index.showToast({
            title: "功能开发中",
            icon: "none"
          });
        }
      });
    };
    const navigateToLocation = () => {
      const location = selectedLocation.value;
      common_vendor.index.__f__("log", "at pages/MapPage/MapPage.vue:926", "导航到:", location.name);
      try {
        common_vendor.index.vibrateShort({
          type: "heavy"
        });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/MapPage/MapPage.vue:934", "触觉反馈不支持:", error);
      }
      common_vendor.index.openLocation({
        latitude: location.latitude,
        longitude: location.longitude,
        name: location.name,
        address: location.description,
        success: () => {
          common_vendor.index.__f__("log", "at pages/MapPage/MapPage.vue:944", "成功打开地图导航");
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/MapPage/MapPage.vue:947", "打开地图失败:", error);
          common_vendor.index.showToast({
            title: "无法打开导航",
            icon: "none"
          });
        }
      });
    };
    const shareLocation = () => {
      const location = selectedLocation.value;
      common_vendor.index.__f__("log", "at pages/MapPage/MapPage.vue:961", "分享地点:", location.name);
      try {
        common_vendor.index.vibrateShort({
          type: "medium"
        });
      } catch (error) {
        common_vendor.index.__f__("warn", "at pages/MapPage/MapPage.vue:969", "触觉反馈不支持:", error);
      }
      common_vendor.index.share({
        provider: "weixin",
        scene: "WXSceneSession",
        type: 0,
        href: `https://yourapp.com/location/${location.id}`,
        title: `${location.name} - 观鸟地点推荐`,
        summary: location.description,
        imageUrl: getOSSUrl(location.image, "medium"),
        success: () => {
          common_vendor.index.showToast({
            title: "分享成功",
            icon: "success"
          });
          closeInfoCard();
        },
        fail: (error) => {
          common_vendor.index.__f__("error", "at pages/MapPage/MapPage.vue:989", "分享失败:", error);
          common_vendor.index.showToast({
            title: "分享失败",
            icon: "none"
          });
        }
      });
    };
    const onIconError = (error) => {
      common_vendor.index.__f__("warn", "at pages/MapPage/MapPage.vue:1003", "图标加载失败:", error);
      if (error.target) {
        error.target.style.display = "none";
      }
    };
    const onImageError = (error) => {
      common_vendor.index.__f__("warn", "at pages/MapPage/MapPage.vue:1014", "地点图片加载失败:", error);
      if (error.target) {
        const defaultImageUrl = getOSSUrl("static/images/location-placeholder.jpg", "large");
        error.target.src = defaultImageUrl;
      }
    };
    common_vendor.onMounted(() => {
      common_vendor.index.__f__("log", "at pages/MapPage/MapPage.vue:1024", "地图页面已加载");
      getCurrentLocation();
      setTimeout(() => {
        showLegend.value = true;
        setTimeout(() => {
          showLegend.value = false;
        }, 5e3);
      }, 2e3);
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: searchText.value,
        c: common_vendor.o(($event) => searchText.value = $event.detail.value),
        d: searchText.value
      }, searchText.value ? {
        e: common_vendor.o(handleSearch)
      } : {}, {
        f: latitude.value,
        g: longitude.value,
        h: markers.value,
        i: polyline.value,
        j: scale.value,
        k: common_vendor.o(onMarkerTap),
        l: common_vendor.o(onRegionChange),
        m: common_vendor.o(moveToCurrentLocation),
        n: common_vendor.o(zoomIn),
        o: common_vendor.o(zoomOut),
        p: common_vendor.o(switchMapLayer),
        q: showInfoCard.value
      }, showInfoCard.value ? common_vendor.e({
        r: common_vendor.o(closeInfoCard),
        s: getOSSUrl(selectedLocation.value.image, "large"),
        t: common_vendor.o(onImageError),
        v: common_vendor.t(selectedLocation.value.category),
        w: common_vendor.t(selectedLocation.value.name),
        x: common_vendor.t(selectedLocation.value.description),
        y: selectedLocation.value.birdStats
      }, selectedLocation.value.birdStats ? {
        z: common_vendor.t(selectedLocation.value.birdStats.species),
        A: common_vendor.t(selectedLocation.value.birdStats.observations),
        B: common_vendor.t(selectedLocation.value.birdStats.rareSpecies)
      } : {}, {
        C: selectedLocation.value.bestTime
      }, selectedLocation.value.bestTime ? {
        D: common_vendor.t(selectedLocation.value.bestTime)
      } : {}, {
        E: selectedLocation.value.commonBirds
      }, selectedLocation.value.commonBirds ? {
        F: common_vendor.f(selectedLocation.value.commonBirds, (bird, k0, i0) => {
          return {
            a: common_vendor.t(bird.name),
            b: bird.id
          };
        })
      } : {}, {
        G: common_vendor.o(viewDetails),
        H: common_vendor.o(navigateToLocation),
        I: common_vendor.o(shareLocation),
        J: common_vendor.o(() => {
        }),
        K: common_vendor.o(closeInfoCard)
      }) : {}, {
        L: isLoading.value
      }, isLoading.value ? {
        M: common_vendor.t(loadingText.value)
      } : {}, {
        N: showLegend.value
      }, showLegend.value ? {
        O: common_vendor.o(($event) => showLegend.value = false),
        P: getOSSUrl("static/icons/marker-wetland.png", "icon"),
        Q: common_vendor.o(onIconError),
        R: getOSSUrl("static/icons/marker-park.png", "icon"),
        S: common_vendor.o(onIconError),
        T: getOSSUrl("static/icons/marker-river.png", "icon"),
        U: common_vendor.o(onIconError),
        V: getOSSUrl("static/icons/marker-residential.png", "icon"),
        W: common_vendor.o(onIconError)
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/MapPage/MapPage.js.map
