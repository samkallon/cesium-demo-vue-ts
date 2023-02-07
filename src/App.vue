<template>
  <div class="common-layout">
    <MenuBar></MenuBar>
    <div ref="containerRef" id="cesiumContainer"></div>
    <div ref="unvisibleCreditRef" v-show="false"></div>
    <digTerrian ref="digTerrianRef"  v-if="activeMenuKey === 'digTerrian'" />
    <groundTransparent ref="groundTransparentRef" v-if="activeMenuKey === 'groundTransparent'"/>
    <addModel ref="addModelRef" v-if="activeMenuKey === 'addModel'"/>
    <current-camera v-if="viewerLoaded"></current-camera>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, markRaw, watch, watchEffect} from 'vue'
import { ArcGisMapServerImageryProvider, Camera, Viewer, Rectangle } from 'cesium'
import * as Cesium from 'cesium'
import { useSysStore } from '@/store/sys'
import MenuBar from '@/components/MenuBar.vue'
import digTerrian from "@/components/digTerrian.vue";
import groundTransparent from "@/components/groundTransparent.vue";
import currentCamera from '@/components/currentCamera.vue'
import AddModel from "@/components/addModel.vue";


const containerRef = ref<HTMLDivElement>()
const unvisibleCreditRef = ref<HTMLDivElement>()
let activeMenuKey = ref<String>('')
const sysStore = useSysStore()
// 组件ref注册
const digTerrianRef = ref(null)
const groundTransparentRef = ref(null)
const addModelRef = ref(null)
const refsObj = {
  digTerrianRef,groundTransparentRef,addModelRef
}
let viewerLoaded = false
let entity:any
// Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
//   75.0, // 东
//   0.0, // 南
//   140.0, // 西
//   60.0 // 北
// )

onMounted(() => {
  const viewer = new Viewer(containerRef.value as HTMLElement, {
    animation: true, // 动画组件
    timeline: true, // 时间轴组件
    geocoder: true, //右上角地理空间搜索
    homeButton: false, // 主页按钮
    scene3DOnly: true, // 仅3d模式
    baseLayerPicker: true, // 底图选择器 右上角
    navigationHelpButton: false, // 右上角用户帮助
    fullscreenButton: false, // 全屏按钮
    infoBox: true,
    creditContainer: unvisibleCreditRef.value,
    imageryProvider: new ArcGisMapServerImageryProvider({
      url: `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer`
    }),
    msaaSamples: 2,
    selectionIndicator: false,
    contextOptions: {
      requestWebgl2: true
    },
    terrainProvider: Cesium.createWorldTerrain(),
    resolutionScale: 0.85,//默认值为1.0 调整画面精细度 越低 帧率越高
    requestRenderMode: true, // 画面发生变化时 才渲染页面, 适合禁止页面内没有动画的情况
    maximumRenderTimeChange: Infinity, // 最大渲染时间间隔
  })
  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer.scene.debugShowFramesPerSecond = true;

  if (viewer) {
    const longitude = -3.82518;
    const latitude = 53.11728;
    const height = 72.8;
    const position = Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height
    );
    entity = viewer.entities.add({
      name: 'parcleadMine',
      position: position,
      model: {
        uri: 'ParcLeadMine.glb',
      },
    });
    viewer.scene.camera.setView({
      destination: new Cesium.Cartesian3(
          3826465.9884728403,
          -254831.02751468265,
          5081387.671561018
      ),
      orientation: new Cesium.HeadingPitchRoll(
          3.3889450556243754,
          -0.5276382514771969,
          6.282272566663295
      ),
      endTransform: Cesium.Matrix4.IDENTITY,
    });

    viewer.scene.camera.flyTo({
      destination: new Cesium.Cartesian3(
          3827270.552916987,
          -255123.18143177085,
          5079147.091351856
      ),
      orientation: new Cesium.HeadingPitchRoll(
          3.2624281242239963,
          -0.22213535190506972,
          6.282786783842843
      ),
      duration: 5.0,
    });
  }

  const rawViewer = markRaw(viewer)
  sysStore.setCesiumViewer(rawViewer)
  viewerLoaded = true
})

watch(
    () => sysStore.$state.currentComponentKey,
    (newCurrentComponentKey,oldCurrentComponentKey) => {
      if (oldCurrentComponentKey){
        refsObj[oldCurrentComponentKey + 'Ref'].value.clear()
      }
      activeMenuKey.value = newCurrentComponentKey
    }
)
sysStore.setCurrentComponentKey('digTerrian')


</script>

<style>
.common-layout{
  width: 100%;
  height: 100%;
  display: flex;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
}
.cesium-viewer-animationContainer{
  bottom: 40px!important;
}
.cesium-viewer-timelineContainer{
  bottom: 40px!important;
}
</style>
