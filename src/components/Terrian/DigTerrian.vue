<template>
  <div class="dig-contain">
    <a-form
        :model="formState"
        v-bind="layout"
        name="nest-messages"
        @finish="onFinish"
    >
      <a-form-item :name="['depth']" :rules="[{ required: true }]">
        <fc-typing-input style="margin: 0px 16px" v-model="formState.depth" placeholder="请输入开挖深度"/>
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
    viewer = window.viewer

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
            3827270.552916987,
            -255123.18143177085,
            5079147.091351856
        ),
        orientation: new Cesium.HeadingPitchRoll(
            3.2624281242239963,
            -0.22213535190506972,
            6.282786783842843
        )
      });
    }

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
      drawObj = new Draw({viewer:window.viewer,Cesium,type:'polygon'})
    }
    const startDig = () => {
      const points =  drawObj.tempShapePoints
      if (!terrainClipPlan){
        terrainClipPlan = new TerrainClipPlan(window.viewer,{
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
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  width: 15vw;
  height: 13vh;
  position: fixed;
  left: 15vw;
  top: 1vw;
  padding: 8px;
  // 毛玻璃效果
  background: rgba(255, 255, 255, 0.79);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(5px);
  border-radius: 5px;
  .btn-group{
    display: flex;
    justify-content: space-between;
  }
  fc-typing-input{
    --color: rgb(24, 143, 253);
  }
}

</style>
