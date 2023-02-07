<template>
    <div class="btn-group">
      <a-button type="primary" @click="startDraw">开始绘制</a-button>
      <a-button type="primary" @click="startAna">分析</a-button>
      <a-button type="primary" @click="clear">清除</a-button>
    </div>
</template>

<script setup lang="ts">
import * as Cesium from 'cesium'
import {useSysStore} from '@/store/sys'
import { Draw } from "@/core/draw";
import { message } from 'ant-design-vue'
import { CesiumUils } from '@/core/cesiumUtils'

const sysStore = useSysStore()
let drawObj: any
let line1: any
let cutil = new CesiumUils(sysStore.cesiumViewer)
const viewer = sysStore.cesiumViewer


const startDraw = () => {
  message.info('右键停止绘制,请绘制线')
  drawObj = new Draw({viewer,Cesium,type:'line'})
}
const startAna = () => {
  // 将上一步绘制的线保存
  line1 = drawObj.tempShapePoints
  const pointHead = line1[0]
  const pointTail = line1[line1.length - 1]
  const pointRoatedHead =  cutil.rotatedPointByAngle(pointHead,pointTail,90)
  // 生成平面的法线
  let normal = new Cesium.Cartesian3()
  Cesium.Cartesian3.subtract(pointTail,pointRoatedHead,normal)
  // 生成plane
  const plane = new Cesium.Plane(normal, 0.0);
  // 计算交点
  Cesium.IntersectionTests.lineSegmentPlane(endPoint0, endPoint1, plane, result)
}
const clear = () => {
  drawObj.stopDraw()
}
const addPolylineVolumn = () => {
  if (viewer){
    const redTube = viewer.entities.add({
      name: "Red tube with rounded corners",
      polylineVolume: {
        positions: Cesium.Cartesian3.fromDegreesArray([
          -85.0,
          32.0,
          -85.0,
          36.0,
          -89.0,
          36.0,
        ]),
        shape: cutil.computeCircle(20.0),
        material: Cesium.Color.RED,
      },
    });
  }

}
// 默认添加两条管线
addPolylineVolumn()

</script>

<style scoped lang="scss">
.btn-group{

}
</style>
