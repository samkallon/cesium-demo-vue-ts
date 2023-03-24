<template>
  <div class="common-layout">
    <MenuBar></MenuBar>
    <currentCamera v-if="viewerLoaded"></currentCamera>
    <div id="cesiumContainer" ref="containerRef"></div>
    <div id="ThreeContainer"></div>
    <div v-show="false" ref="unvisibleCreditRef"></div>
    <DigTerrian v-if="activeMenuKey === 'DigTerrian'" ref="DigTerrianRef"></DigTerrian>
    <groundTransparent v-if="activeMenuKey === 'GroundTransparent'" ref="GroundTransparentRef"/>
    <addModel v-if="activeMenuKey === 'AddModel'" ref="AddModelRef"/>
    <czmlPower v-if="activeMenuKey === 'CzmlPower'" ref="CzmlPowerRef"></czmlPower>
    <ModelMatrix v-if="activeMenuKey === 'ModelMatrix'" ref="ModelMatrixRef"></ModelMatrix>
    <ModelAdjust v-if="activeMenuKey === 'ModelAdjust'" ref="ModelAdjustRef"></ModelAdjust>
    <LinePlaneIntersect v-if="activeMenuKey === 'LinePlaneIntersect'"
                        ref="LinePlaneIntersectRef"></LinePlaneIntersect>
    <ShaderToyWater v-if="activeMenuKey === 'ShaderToyWater'" ref="ShaderToyWaterRef"></ShaderToyWater>
    <ShaderToyBox v-if="activeMenuKey === 'ShaderToyBox'" ref="ShaderToyBoxRef"></ShaderToyBox>
    <ShaderToyRadar v-if="activeMenuKey === 'ShaderToyRadar'" ref="ShaderToyRadarRef"></ShaderToyRadar>
    <Noise v-if="activeMenuKey === 'Noise'" ref="NoiseRef"></Noise>
    <ParticleWater v-if="activeMenuKey === 'ParticleWater'" ref="ParticleWaterRef"></ParticleWater>
    <DynamicWall v-if="activeMenuKey === 'DynamicWall'" ref="DynamicWallRef"></DynamicWall>
    <WhiteModel v-if="activeMenuKey === 'WhiteModel'" ref="WhiteModelRef"></WhiteModel>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, markRaw, watch, watchEffect} from 'vue'
import {ArcGisMapServerImageryProvider, Camera, Viewer, Rectangle} from 'cesium'
import * as Cesium from 'cesium'
import CesiumMeshVisualizer from 'cesiummeshvisualizer/Source/Main.js'
import {useSysStore} from '@/store/sys'
import {message} from 'ant-design-vue'

import MenuBar from '@/components/MenuBar.vue'
import DigTerrian from "@/components/Terrian/DigTerrian.vue";
import groundTransparent from "@/components/GroundTransparent.vue";
import currentCamera from '@/components/currentCamera.vue'
import AddModel from "@/components/AddModel/AddModel.vue";
import CzmlPower from '@/components/CzmlPower/CzmlPrower.vue'
import ModelMatrix from '@/components/ModelMatrix/ModelMatrix.vue'
import ModelAdjust from '@/components/ModelAdjust/ModelAdjust.vue'
import LinePlaneIntersect from '@/components/LinePlaneIntersect/LinePlaneIntersect.vue'
import ShaderToyWater from "@/components/ShaderToy/ShaderToyWater.vue";
import ShaderToyBox from "@/components/ShaderToy/ShaderToyBox.vue";
import ShaderToyRadar from '@/components/ShaderToy/ShaderToyRadar.vue'
import Noise from '@/components/ShaderToy/Noise.vue'
import ParticleWater from "@/components/ParticleSystem/ParticleWater.vue";
import DynamicWall from "@/components/ShaderToy/DynamicWall.vue";
import WhiteModel from '@/components/WhiteModel/WhiteModel.vue'


const containerRef = ref<HTMLDivElement>()
const unvisibleCreditRef = ref<HTMLDivElement>()
let activeMenuKey = ref<String>('')
const sysStore = useSysStore()
// 组件ref注册
const DigTerrianRef = ref(null)
const GroundTransparentRef = ref(null)
const AddModelRef = ref(null)
const CzmlPowerRef = ref(null)
const ModelAdjustRef = ref(null)
const ModelMatrixRef = ref(null)
const LinePlaneIntersectRef = ref(null)
const ShaderToyWaterRef = ref(null)
const ShaderToyBoxRef = ref(null)
const ShaderToyRadarRef = ref(null)
const NoiseRef = ref(null)
const ParticleWaterRef = ref(null)
const DynamicWallRef = ref(null)
const WhiteModelRef = ref(null)
const refsObj = {
  DigTerrianRef, GroundTransparentRef, AddModelRef, CzmlPowerRef, ModelAdjustRef, ModelMatrixRef,
  LinePlaneIntersectRef, ShaderToyWaterRef, ShaderToyBoxRef, ShaderToyRadarRef, NoiseRef, ParticleWaterRef,
  DynamicWallRef, WhiteModelRef
}
let viewerLoaded = false
let entity: any

// 相机默认位置
Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
  75.0, // 东
  0.0, // 南
  140.0, // 西
  60.0 // 北
)

onMounted(() => {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YzBkMDU4Zi00NjVhLTQ2YzgtODgxMS00ZDAzNzVmYjQyYTgiLCJpZCI6NDEzMTIsImlhdCI6MTYwOTk4ODQ2OX0.qtLMhWmf2R-psUzK2Piqh-qXtibvXhcX-vR1tjWGF6E'
  const viewer = new Viewer(containerRef.value as HTMLElement, {
    animation: true, // 动画组件
    timeline: true, // 时间轴组件
    geocoder: true, //右上角地理空间搜索
    homeButton: true, // 主页按钮
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
    terrainProvider: Cesium.createWorldTerrain({
      requestWaterMask: true,
      requestVertexNormals: true,
    }),
    resolutionScale: 0.8,//默认值为1.0 调整画面精细度 越低 帧率越高
    useDefaultRenderLoop: true, //关掉自动渲染 为了和three js 融合
  })
  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer.scene.debugShowFramesPerSecond = true;

  const rawViewer = markRaw(viewer)
  sysStore.setCesiumViewer(rawViewer)
  viewerLoaded = true
  window.viewer = viewer

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
  window.pickPointArray = []
  window.pickEntityList = []
  handler.setInputAction((event: any) => {
    // 按下了ctrl健 右键拾取点并添加到数组中,window下的全局变量
    message.info('拾取成功')
    const earthPosition = viewer.scene.pickPosition(event.position);
    window.pickPointArray.push(Cesium.Cartographic.fromCartesian(earthPosition))
    window.pickEntityList.push(
      viewer.entities.add({
        position: earthPosition,
        point: {
          pixelSize: 20,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        }
      }))
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK, Cesium.KeyboardEventModifier.CTRL)
  handler.setInputAction(() => {
    // ctrl + 中键点击清空,window下的全局变量
    message.info('清空成功')
    window.pickPointArray = []
    window.pickEntityList.forEach(e => {
      viewer.entities.remove(e)
    })
  }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK, Cesium.KeyboardEventModifier.CTRL)


  // 添加剪影效果
  const stages = viewer.scene.postProcessStages;
  const silhouette = stages.add(
    Cesium.PostProcessStageLibrary.createSilhouetteStage()
  );
  silhouette.uniforms.color = Cesium.Color.LIME;
  silhouette.enabled = true
  let handlerSilhouette = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handlerSilhouette.setInputAction(function (movement) {
    const pickedObject = viewer.scene.pick(movement.endPosition);
    if (Cesium.defined(pickedObject)) {
      silhouette.selected = [pickedObject.primitive];
    } else {
      silhouette.selected = [];
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
})


watch(
  () => sysStore.$state.currentComponentKey,
  (newCurrentComponentKey, oldCurrentComponentKey) => {
    if (oldCurrentComponentKey) {
      if (!refsObj[oldCurrentComponentKey + 'Ref'].value.clear) {
        console.log(oldCurrentComponentKey + '的clear不存在!')
      } else {
        refsObj[oldCurrentComponentKey + 'Ref'].value.clear()
      }
    }
    activeMenuKey.value = newCurrentComponentKey
    if(!newCurrentComponentKey){
      message.info('功能建设中,敬请期待')
    }
  }
)
sysStore.setCurrentComponentKey('DigTerrian')


</script>

<style>
.common-layout {
  width: 100%;
  height: 100%;
  display: flex;
}

#cesiumContainer {
  width: 100%;
  height: 100%;
}

.cesium-viewer-animationContainer {
  bottom: 40px !important;
}

.cesium-viewer-timelineContainer {
  bottom: 40px !important;
}
</style>
