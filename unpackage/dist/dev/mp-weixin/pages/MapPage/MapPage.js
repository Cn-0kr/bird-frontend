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
    const latitude = common_vendor.ref(31.2304);
    const longitude = common_vendor.ref(121.4737);
    const scale = common_vendor.ref(14);
    const searchText = common_vendor.ref("");
    const markers = common_vendor.ref([]);
    const polyline = common_vendor.ref([]);
    const showInfoCard = common_vendor.ref(false);
    const selectedLocation = common_vendor.ref({});
    const birdLocations = [
      {
        id: 1,
        name: "嘉定紫藤园",
        category: "湿地公园",
        latitude: 31.2354,
        longitude: 121.4617,
        image: "/static/images/location_1.png",
        // 需要准备对应的图片
        description: "嘉定紫藤园是上海市著名的观鸟地点，拥有丰富的湿地生态系统。这里常年有20多种水鸟栖息，是观测候鸟迁徙的绝佳地点。园内有专门的观鸟平台，每年春秋两季是最佳观鸟时间。",
        birdStats: {
          species: 42,
          observations: 186,
          rareSpecies: 3
        }
      },
      {
        id: 2,
        name: "新城公园",
        category: "城市公园",
        latitude: 31.2404,
        longitude: 121.4837,
        image: "/static/images/location2.jpg",
        description: "新城公园是市区内难得的鸟类栖息地，公园内有多种乔木和灌木，为小型鸟类提供了良好的栖息环境。这里常见麻雀、白头鹎、黑尾蜡嘴雀等鸟类，是城市中轻松观鸟的好去处。",
        birdStats: {
          species: 18,
          observations: 94,
          rareSpecies: 0
        }
      },
      {
        id: 3,
        name: "环城河绿带",
        category: "河道湿地",
        latitude: 31.2284,
        longitude: 121.4527,
        image: "/static/images/location3.jpg",
        description: "环城河绿带沿线栽种了大量水生植物，吸引了多种水鸟前来觅食和栖息。河边设有多个观鸟点，常见鸟类包括白鹭、夜鹭、绿头鸭等。这里环境幽静，是观鸟爱好者的秘密天堂。",
        birdStats: {
          species: 26,
          observations: 132,
          rareSpecies: 1
        }
      },
      {
        id: 4,
        name: "嘉宝花园别墅",
        category: "居民区",
        latitude: 31.2234,
        longitude: 121.4637,
        image: "/static/images/location4.jpg",
        description: "嘉宝花园别墅区内绿化良好，种植了多种果树和花卉，吸引了很多小型鸟类前来筑巢。这里可以观察到柳莺、绣眼鸟等小型鸟类，是城市观鸟的好去处。此处为居民区，参观时请保持安静。",
        birdStats: {
          species: 13,
          observations: 67,
          rareSpecies: 0
        }
      },
      {
        id: 5,
        name: "梦花湖",
        category: "湖泊湿地",
        latitude: 31.2454,
        longitude: 121.4557,
        image: "/static/images/location5.jpg",
        description: "梦花湖是一个人工湖泊，周围植被茂盛，湖面开阔，是多种水鸟和涉禽的栖息地。这里可以观察到白鹭、苍鹭、小䴙䴘等水鸟，以及多种雁鸭类。湖边有专门的观鸟屋和栈道，适合长时间观鸟。",
        birdStats: {
          species: 35,
          observations: 158,
          rareSpecies: 2
        }
      },
      {
        id: 6,
        name: "垃圾填埋场湿地",
        category: "恢复性湿地",
        latitude: 31.2194,
        longitude: 121.4867,
        image: "/static/images/location6.jpg",
        description: "这个区域原是垃圾填埋场，后经过生态修复，现已成为重要的鸟类栖息地。由于昆虫和小型动物丰富，吸引了大量猛禽和涉禽。这里常见猛禽包括红隼、普通鵟等，是观察猛禽的理想场所。",
        birdStats: {
          species: 22,
          observations: 76,
          rareSpecies: 2
        }
      },
      {
        id: 7,
        name: "绿地嘉尚国际广场",
        category: "城市绿地",
        latitude: 31.2284,
        longitude: 121.4987,
        image: "/static/images/location7.jpg",
        description: "绿地嘉尚国际广场周边有精心设计的城市绿地，种植了多种乡土树种，为鸟类提供了良好的栖息环境。这里常见鸟类包括珠颈斑鸠、树麻雀、白头鹎等，适合早晨或傍晚前来观鸟。",
        birdStats: {
          species: 16,
          observations: 83,
          rareSpecies: 0
        }
      }
    ];
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
      common_vendor.index.showLoading({
        title: "定位中..."
      });
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
            common_vendor.index.__f__("error", "at pages/MapPage/MapPage.vue:288", "获取位置失败：", err);
            common_vendor.index.showToast({
              title: "获取位置失败",
              icon: "none"
            });
            loadBirdLocations();
          },
          complete: () => {
            common_vendor.index.hideLoading();
          }
        });
      }).catch((err) => {
        common_vendor.index.__f__("error", "at pages/MapPage/MapPage.vue:303", "位置权限错误：", err);
        common_vendor.index.hideLoading();
        loadBirdLocations();
      });
    };
    const moveToCurrentLocation = () => {
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
      if (!searchText.value)
        return;
      common_vendor.index.showLoading({ title: "搜索中..." });
      try {
        const result = await searchLocation(searchText.value);
        if (result && result.length > 0) {
          latitude.value = result[0].location.lat;
          longitude.value = result[0].location.lng;
          const searchMarker = {
            id: 999,
            latitude: result[0].location.lat,
            longitude: result[0].location.lng,
            title: result[0].title,
            iconPath: "/static/images/location-pin-solid.svg",
            // 红色标记图标
            width: 30,
            height: 30,
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
        }
      } catch (error) {
        common_vendor.index.showToast({
          title: "搜索失败: " + error.message,
          icon: "none"
        });
      } finally {
        common_vendor.index.hideLoading();
      }
    };
    const loadBirdLocations = () => {
      const locationMarkers = birdLocations.map((loc) => ({
        id: loc.id,
        latitude: loc.latitude,
        longitude: loc.longitude,
        title: loc.name,
        iconPath: "/static/images/location-pin-solid.svg",
        // 绿色标记图标
        width: 30,
        height: 30,
        callout: {
          content: loc.name,
          color: "#000000",
          fontSize: 12,
          borderRadius: 5,
          bgColor: "#ffffff",
          padding: 5,
          display: "AlWAYS"
        }
      }));
      markers.value = locationMarkers;
      drawAreaBoundary(birdLocations);
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
      common_vendor.index.__f__("log", "at pages/MapPage/MapPage.vue:445", "Marker tapped:", e);
      const markerId = e.detail.markerId;
      common_vendor.index.__f__("log", "at pages/MapPage/MapPage.vue:448", "Looking for location with ID:", markerId);
      const location = birdLocations.find((loc) => loc.id === markerId);
      if (location) {
        common_vendor.index.__f__("log", "at pages/MapPage/MapPage.vue:453", "Found location:", location);
        selectedLocation.value = location;
        showInfoCard.value = true;
      } else {
        common_vendor.index.__f__("log", "at pages/MapPage/MapPage.vue:459", "No matching location found for ID:", markerId);
        common_vendor.index.showToast({
          title: "未找到该地点信息",
          icon: "none"
        });
      }
    };
    common_vendor.onMounted(() => {
      getCurrentLocation();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(handleSearch),
        b: searchText.value,
        c: common_vendor.o(($event) => searchText.value = $event.detail.value),
        d: latitude.value,
        e: longitude.value,
        f: markers.value,
        g: polyline.value,
        h: scale.value,
        i: common_vendor.o(onMarkerTap),
        j: common_vendor.o(moveToCurrentLocation),
        k: showInfoCard.value
      }, showInfoCard.value ? common_vendor.e({
        l: common_vendor.o(($event) => showInfoCard.value = false),
        m: selectedLocation.value.image,
        n: common_vendor.t(selectedLocation.value.name),
        o: common_vendor.t(selectedLocation.value.category),
        p: common_vendor.t(selectedLocation.value.description),
        q: selectedLocation.value.birdStats
      }, selectedLocation.value.birdStats ? {
        r: common_vendor.t(selectedLocation.value.birdStats.species),
        s: common_vendor.t(selectedLocation.value.birdStats.observations),
        t: common_vendor.t(selectedLocation.value.birdStats.rareSpecies)
      } : {}, {
        v: common_vendor.o(($event) => showInfoCard.value = false)
      }) : {}, {
        w: showInfoCard.value
      }, showInfoCard.value ? {
        x: common_vendor.o(($event) => showInfoCard.value = false)
      } : {}, {
        y: showInfoCard.value
      }, showInfoCard.value ? {
        z: common_vendor.t(selectedLocation.value.id),
        A: common_vendor.o((...args) => _ctx.closeInfoCard && _ctx.closeInfoCard(...args))
      } : {});
    };
  }
};
wx.createPage(_sfc_main);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/MapPage/MapPage.js.map
