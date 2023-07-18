<template>
  <div class="common-layout">
    <MenuBar></MenuBar>
    <currentCamera v-if="viewerLoaded"></currentCamera>
    <div id="cesiumContainer" ref="containerRef"></div>
    <div id="ThreeContainer"></div>
    <component :is="changeComponents(activeMenuKey)"></component>
  </div>
</template>

<script lang="ts">
import { markRaw, defineAsyncComponent} from 'vue'
import { Camera, Rectangle} from 'cesium'
import {message} from 'ant-design-vue'
import MenuBar from '@/components/MenuBar.vue'
import initMap from "@/core/initMap";
import currentCamera from '@/components/currentCamera.vue'
import {useSysStore} from '@/store/sys'

export default {
  components:{MenuBar,currentCamera},
  data() {
    return {
      activeMenuKey: 'Terrian-DigTerrian',
      viewerLoaded:false,
      store:useSysStore()
    }
  },
  mounted() {
    // 相机默认位置
    Camera.DEFAULT_VIEW_RECTANGLE = Rectangle.fromDegrees(
      75.0, // 东
      0.0, // 南
      140.0, // 西
      60.0 // 北
    )
    initMap(document.getElementById('cesiumContainer'))
    this.viewerLoaded = true
  },
  methods:{
    changeComponents(e:string){
      const modules = import.meta.glob('./components/*/*.vue');
      let link = modules[`./components/${e}/${e}.vue`]
      if (e.indexOf('-')> -1){
        link = modules[`./components/${e.split('-')[0]}/${e.split('-')[1]}.vue`]
      }
      return markRaw(defineAsyncComponent(link))
    }
  },
  watch:{
    'store.$state.currentComponentKey':{
      handler(n:string){
        if(!n){
          message.info('功能建设中,敬请期待')
        }else{
          this.activeMenuKey = n
        }
      }
    }
  }
}






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
