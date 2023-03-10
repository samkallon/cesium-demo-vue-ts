<template>
  <div class="common-layout">
    <MenuBar></MenuBar>
    <currentCamera v-if="viewerLoaded"></currentCamera>
    <div ref="containerRef" id="cesiumContainer"></div>
    <div ref="unvisibleCreditRef" v-show="false"></div>
    <digTerrian ref="DigTerrianRef" v-if="activeMenuKey === 'DigTerrian'"/>
    <groundTransparent ref="GroundTransparentRef" v-if="activeMenuKey === 'GroundTransparent'"/>
    <addModel ref="AddModelRef" v-if="activeMenuKey === 'AddModel'"/>
    <czmlPower ref="CzmlPowerRef" v-if="activeMenuKey === 'CzmlPower'"></czmlPower>
    <ModelMatrix ref="ModelMatrixRef" v-if="activeMenuKey === 'ModelMatrix'"></ModelMatrix>
    <ModelAdjust ref="ModelAdjustRef" v-if="activeMenuKey === 'ModelAdjust'"></ModelAdjust>
    <LinePlaneIntersect ref="LinePlaneIntersectRef" v-if="activeMenuKey === 'LinePlaneIntersect'"></LinePlaneIntersect>
    <ShaderToyWater ref="ShaderToyWaterRef" v-if="activeMenuKey === 'ShaderToyWater'"></ShaderToyWater>
    <ShaderToyBox ref="ShaderToyBoxRef" v-if="activeMenuKey === 'ShaderToyBox'"></ShaderToyBox>
    <ShaderToyRadar ref="ShaderToyRadarRef" v-if="activeMenuKey === 'ShaderToyRadar'"></ShaderToyRadar>
    <Noise ref="NoiseRef" v-if="activeMenuKey === 'Noise'"></Noise>
    <ParticleWater ref="ParticleWaterRef" v-if="activeMenuKey === 'ParticleWater'"></ParticleWater>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, markRaw, watch, watchEffect} from 'vue'
import {ArcGisMapServerImageryProvider, Camera, Viewer, Rectangle} from 'cesium'
import * as Cesium from 'cesium'
import {useSysStore} from '@/store/sys'
import {message} from 'ant-design-vue'

import MenuBar from '@/components/MenuBar.vue'
import digTerrian from "@/components/DigTerrian.vue";
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


const containerRef = ref<HTMLDivElement>()
const unvisibleCreditRef = ref<HTMLDivElement>()
let activeMenuKey = ref<String>('')
const sysStore = useSysStore()
// ??????ref??????
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
const refsObj = {
  DigTerrianRef, GroundTransparentRef, AddModelRef, CzmlPowerRef, ModelAdjustRef, ModelMatrixRef,
  LinePlaneIntersectRef,ShaderToyWaterRef,ShaderToyBoxRef,ShaderToyRadarRef,NoiseRef,ParticleWaterRef
}
let viewerLoaded = false
let entity: any

Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
  75.0, // ???
  0.0, // ???
  140.0, // ???
  60.0 // ???
)

onMounted(() => {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YzBkMDU4Zi00NjVhLTQ2YzgtODgxMS00ZDAzNzVmYjQyYTgiLCJpZCI6NDEzMTIsImlhdCI6MTYwOTk4ODQ2OX0.qtLMhWmf2R-psUzK2Piqh-qXtibvXhcX-vR1tjWGF6E'
  const viewer = new Viewer(containerRef.value as HTMLElement, {
    animation: true, // ????????????
    timeline: true, // ???????????????
    geocoder: true, //???????????????????????????
    homeButton: true, // ????????????
    scene3DOnly: true, // ???3d??????
    baseLayerPicker: true, // ??????????????? ?????????
    navigationHelpButton: false, // ?????????????????????
    fullscreenButton: false, // ????????????
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
    resolutionScale: 0.8,//????????????1.0 ????????????????????? ?????? ????????????
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
    // ?????????ctrl??? ????????????????????????????????????,window??????????????????
    message.info('????????????')
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
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK,Cesium.KeyboardEventModifier.CTRL)
  handler.setInputAction(() => {
    // ctrl + ??????????????????,window??????????????????
    message.info('????????????')
    window.pickPointArray = []
    window.pickEntityList.forEach(e => {
      viewer.entities.remove(e)
    })
  }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK,Cesium.KeyboardEventModifier.CTRL)


  // ??????????????????
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
        if (!refsObj[oldCurrentComponentKey + 'Ref'].value.clear){
          console.log(oldCurrentComponentKey+ '???clear?????????!')
        }else{
          refsObj[oldCurrentComponentKey + 'Ref'].value.clear()
        }
      }
      activeMenuKey.value = newCurrentComponentKey
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
