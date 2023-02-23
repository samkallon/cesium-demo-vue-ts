<template>
  <div class="l-p-container">
    <div class="btn-group">
      <a-button type="primary" @click="startDraw">开始绘制</a-button>
      <a-button type="primary" @click="startDig">相交检测</a-button>
      <a-button type="primary" @click="clear">清除</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Cesium from 'cesium'
import { message } from 'ant-design-vue';
import { useSysStore} from "@/store/sys";
import {Draw} from "@/core/draw";
let planeEntity:any
let plane:any
let intersectPoint:any
let drawObj:any
let inv = null // 变换矩阵
let transform = null // 回归向量
const sysStore = useSysStore()
const viewer = sysStore.cesiumViewer

if (viewer){
  const startDraw = () => {
    drawObj = new Draw({viewer:viewer,Cesium,type:'line'})
  }
  // 初始时 绘制几条管廊
  const init = () => {
    // addPolylineVolume(Cesium.Cartesian3.fromDegreesArrayHeights([
    //
    // ]))
  }
  /**
   * 添加垂直于地面的平面  线的两个端点
   * @param p1
   * @param p2
   */
  const addPlane = (p1:any,p2:any) => {
    const Cartesian3 = Cesium.Cartesian3
    const midPoint = Cesium.Cartesian3.midpoint(p1, p2, new Cesium.Cartesian3())
    const distance = Cesium.Cartesian3.distance(p1, p2)
    const planeY = Cesium.Ellipsoid.WGS84.geodeticSurfaceNormal(
        p1, new Cesium.Cartesian3())
    const vec2 = Cartesian3.subtract(p2, midPoint, new Cartesian3())
    let worldNormal = Cartesian3.cross(planeY, vec2, new Cartesian3())
    worldNormal = Cartesian3.add(midPoint, worldNormal, new Cartesian3())

    transform = Cesium.Transforms.eastNorthUpToFixedFrame(midPoint)
    inv = Cesium.Matrix4.inverseTransformation(transform, new Cesium.Matrix4())

    let localNormal = Cesium.Matrix4.multiplyByPoint(inv, worldNormal, new Cartesian3())
    localNormal = Cartesian3.normalize(localNormal.clone(), new Cartesian3())
    // 生成plane,炫酷效果
    const plane = new Cesium.Plane(localNormal, 0)
    const planeEntity = viewer.entities.add({
      id: 'hdmPlane',
      position: midPoint,
      plane: {
        plane,
        dimensions: new Cesium.Cartesian2(distance, distance),
        material: Cesium.Color.WHITE.withAlpha(0.4),
        outline: true,
        outlineColor: Cesium.Color.RED
      }
    })
    return {plane, planeEntity}
  }
  // 计算管线圆柱形
  const  computeCircle = (radius:any) => {
    const positions = [];
    for (let i = 0; i < 360; i++) {
      const radians = Cesium.Math.toRadians(i);
      positions.push(
          new Cesium.Cartesian2(
              radius * Math.cos(radians),
              radius * Math.sin(radians)
          )
      );
    }
    return positions;
  }
  /**
   * 添加管线
   */
  const addPolylineVolume = (positions:any) => {
    const blueStar = viewer.entities.add({
      name: "Blue star with mitered corners and outline",
      polylineVolume: {
        positions,
        shape: computeCircle(2000),
        cornerType: Cesium.CornerType.MITERED,
        material: Cesium.Color.BLUE,
      },
    });
  }
  const clear = () => {
    if (!planeEntity) return
    viewer.entities.remove(planeEntity)
  }

  init()


}




defineExpose({
  clear
})
</script>

<style scoped lang="scss">
.l-p-container {
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
