<template>
  <div class="camera-info">
    <div>经度 {{ state.longitude }}</div>
    <div>纬度 {{ state.latitude }}</div>
    <div>高度 {{ state.height }}</div>
    <div>heading {{ state.heading }}</div>
    <div>pitch {{ state.pitch }}</div>
    <div>roll {{ state.roll }}</div>
    <div>||鼠标</div>
    <div>经度 {{ state.mouseLongitude }}</div>
    <div>纬度 {{ state.mouseLatitude }}</div>
    <fc-underline-btn @click="copyCameraData">复制参数</fc-underline-btn>
  </div>
</template>

<script setup lang="ts">
import * as Cesium from 'cesium'
import { message } from 'ant-design-vue';
import { reactive } from 'vue'

const state = reactive(
    { longitude: 0,latitude: 0,height: 0,heading: 0,
      pitch:0,roll:0,mouseLongitude:0,mouseLatitude:0,
})
const viewer = window.viewer
let positionLatLng: any
let handler
if (viewer){
  handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
  handler.setInputAction((movement: any) => {
    const position = viewer.camera.pickEllipsoid(movement.endPosition,viewer.scene.globe.ellipsoid)
    let catographic
    if (position){
      catographic = Cesium.Cartographic.fromCartesian(position,Cesium.Ellipsoid.WGS84)
    }
    if (catographic){
      state.mouseLongitude = +Cesium.Math.toDegrees(catographic.longitude).toFixed(6)
      state.mouseLatitude = +Cesium.Math.toDegrees(catographic.latitude).toFixed(6)
    }
  },Cesium.ScreenSpaceEventType.MOUSE_MOVE)
  viewer.camera.changed.addEventListener(()=>{
    positionLatLng = Cesium.Cartographic.fromCartesian(viewer.camera.position)
    state.longitude = +Cesium.Math.toDegrees(positionLatLng.longitude).toFixed(8)
    state.latitude = +Cesium.Math.toDegrees(positionLatLng.latitude).toFixed(8)
    state.height = +positionLatLng.height.toFixed(4)
    state.heading = +Cesium.Math.toDegrees(viewer.camera.heading).toFixed(4)
    state.pitch = +Cesium.Math.toDegrees(viewer.camera.pitch).toFixed(4)
    state.roll = +Cesium.Math.toDegrees(viewer.camera.roll).toFixed(4)
  })
}

const copyCameraData = () => {
  if (navigator.clipboard) {
    if (viewer){
      const data = {
        longitude:state.longitude,
        latitude:state.latitude,
        height:state.height,
        heading:state.heading,
        pitch:state.pitch,
        roll:state.roll,
        cartersian:viewer.camera.position
      }
      navigator.clipboard.writeText(JSON.stringify(data));
      message.info('复制成功!')
    }
  }else{
    message.error('复制失败!')
  }
}


</script>

<style scoped lang="scss">
.camera-info {
  z-index: 9;
  width: 100%;
  height: 40px;
  background-color: rgba(0, 0, 0, 0.52);
  color: white;
  position: fixed;
  display: flex;
  justify-content: space-around;
  align-items: center;
  left: 0px;
  bottom: 0px;
  div:nth-child(-n + 2){
    width:120px;
  }
  div:nth-last-child(-n + 3){
    width:110px;
  }
  button{
  }
}
//============================
fc-underline-btn {
  padding: 2px;
  --color: #ffffff;
}
</style>
