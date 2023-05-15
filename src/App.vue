<template>
  <div class="common-layout">
    <MenuBar></MenuBar>
    <currentCamera v-if="viewerLoaded"></currentCamera>
    <div id="cesiumContainer" ref="containerRef"></div>
    <div id="ThreeContainer"></div>
    <component :is="changeComponents(activeMenuKey)"></component>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, markRaw, watch, defineAsyncComponent, nextTick} from 'vue'
import { Camera, Viewer, Rectangle} from 'cesium'
import {useSysStore} from '@/store/sys'
import {message} from 'ant-design-vue'
import MenuBar from '@/components/MenuBar.vue'
import initMap from "@/core/initMap";
import currentCamera from '@/components/currentCamera.vue'




let activeMenuKey = ref<String>('Terrian-DigTerrian')
const sysStore = useSysStore()
// 组件ref注册
let viewerLoaded = false
let entity: any

// 相机默认位置
Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
  75.0, // 东
  0.0, // 南
  140.0, // 西
  60.0 // 北
)
let layouts = ref<any>(null)
const modules = import.meta.glob('./components/*/*.vue');

const changeComponents = (e:string)=>{
  let link = modules[`./components/${e}/${e}.vue`]
  if (e.indexOf('-')> -1){
    link = modules[`./components/${e.split('-')[0]}/${e.split('-')[1]}.vue`]
  }
  return markRaw(defineAsyncComponent(link))
}
nextTick(()=>{
  initMap(document.getElementById('cesiumContainer'))
  viewerLoaded = true
})



watch(
  () => sysStore.$state.currentComponentKey,
  (newCurrentComponentKey, oldCurrentComponentKey) => {
    activeMenuKey.value = newCurrentComponentKey
    if(!newCurrentComponentKey){
      message.info('功能建设中,敬请期待')
    }else{

    }
  }
)


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
