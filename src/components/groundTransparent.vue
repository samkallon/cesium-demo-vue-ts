<template>
  <div class="transparent-contain">
    <a-form
        :model="formState"
        v-bind="layout"
        name="nest-messages"
    >
      <a-form-item :name="['transparent']" label="透明度" :rules="[{ required: true }]">
        <a-slider v-model:value="formState.transparent" :max="1" :step="0.1"/>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import {reactive, watch} from 'vue';
import * as Cesium from 'cesium'
import {useSysStore} from '@/store/sys'

const sysStore = useSysStore()
const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};
const viewer = sysStore.$state.cesiumViewer
let entity: any
const formState = reactive({
  transparent: 1,
});

// 切换到其他组件,移除透明
const clear = () => {
  if (viewer) {
    viewer.entities.remove(entity)
    viewer.scene.globe.translucency.enabled = false
  }
}
const update = (nTransparent: number) => {
  if (viewer) {
    const globe = viewer.scene.globe
    globe.translucency.enabled = true
    // globe.translucency.frontFaceAlphaByDistance.nearValue = nTransparent;
    // globe.translucency.frontFaceAlphaByDistance.farValue = nTransparent
    globe.translucency.frontFaceAlpha = nTransparent
    globe.translucency.backFaceAlpha = nTransparent
  }
}

watch(
    () => formState.transparent,
    (nTransparent, oTransparent) => {
      if (nTransparent) {
        update(nTransparent)
      }
    }
)

defineExpose({
  clear
})


</script>


<style scoped lang="scss">
.transparent-contain {
  width: 15vw;
  height: 6vh;
  position: fixed;
  left: 15vw;
  top: 1vw;
  padding: 8px;
  // 毛玻璃效果
  background: rgba(255, 255, 255, .7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(5px);
  border-radius: 5px;
  .btn-group{
    margin: 0 20px;
    display: flex;
    justify-content: space-between;
  }
}

</style>
