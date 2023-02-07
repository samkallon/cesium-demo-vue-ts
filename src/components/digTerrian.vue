<template>
  <div class="dig-contain">
    <a-form
        :model="formState"
        v-bind="layout"
        name="nest-messages"
        @finish="onFinish"
    >
      <a-form-item :name="['depth']" label="开挖深度" :rules="[{ required: true }]">
        <a-input v-model:value="formState.depth"/>
      </a-form-item>
      <div class="btn-group">
        <a-button type="primary" @click="startDraw">开始绘制</a-button>
        <a-button type="primary" @click="startDig">开挖</a-button>
        <a-button type="primary" @click="clear">清除</a-button>
      </div>
    </a-form>
  </div>
</template>

<script lang="ts">
import {defineComponent, reactive, watch} from 'vue';
import * as Cesium from 'cesium'
import { Draw } from "@/core/draw";
import TerrainClipPlan from "@/core/TerrainClipPlan";
import { useSysStore } from '@/store/sys'

export default defineComponent({
  setup() {
    const sysStore = useSysStore()
    let terrainClipPlan:any
    let drawObj:any
    let entity:any
    let viewer:any
    viewer = sysStore.cesiumViewer
    const layout = {
      labelCol: {span: 8},
      wrapperCol: {span: 16},
    };
    const formState = reactive({
      depth:100,
    });
    const onFinish = (values: any) => {
      console.log('Success:', values);
    };
    const startDraw = () => {
      drawObj = new Draw({viewer:sysStore.cesiumViewer,Cesium,type:'polygon'})
    }
    const startDig = () => {
      const points =  drawObj.tempShapePoints
      if (!terrainClipPlan){
        terrainClipPlan = new TerrainClipPlan(sysStore.cesiumViewer,{
          height: formState.depth,
          splitNum: 1000,
          bottomImg: 'bottom.jpg',
          wallImg: 'wall.jpg'
        })
      }else{
        terrainClipPlan.height = formState.depth
      }
      terrainClipPlan.updateData(points)
    }
    // 切换到其他组件,移除绘制状态,开挖内容
    const clear = () => {
      if (drawObj){
        drawObj.stopDraw()
      }
      if (terrainClipPlan){
        terrainClipPlan.clear()
      }
      viewer.entities.remove(entity)
    }
    return {
      formState,
      onFinish,
      layout,
      startDraw,
      startDig,
      clear
    };
  },
});
</script>


<style scoped lang="scss">
.dig-contain {
  width: 15vw;
  height: 12vh;
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
