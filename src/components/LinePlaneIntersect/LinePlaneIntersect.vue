<template>
  <div class="l-p-container">
    <div class="btn-group">
      <a-button type="primary" @click="startDraw">开始绘制</a-button>
      <a-button type="primary" @click="startAna">相交检测</a-button>
      <a-button type="primary" @click="clear">清除</a-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as Cesium from 'cesium'
import { message } from 'ant-design-vue';
import { useSysStore} from "@/store/sys";
import {Draw} from "@/core/draw";
import {Cartographic, Cartesian3, Matrix4} from "cesium";
let planeEntity:any
let plane:any
let intersectPoint = []
let intersectPointEntity = []
let polylineVolumnList = []
let drawObj:any
let inv = null // 变换矩阵
let transform:Matrix4 // 回归向量
const sysStore = useSysStore()
const viewer = window.viewer

const line1 = [
  {
    "longitude": 2.0733488649899,
    "latitude": 0.559838656057063,
    "height": 130
  },
  {
    "longitude": 2.073360494187088,
    "latitude": 0.559758202546264,
    "height": 130
  }
]

const line2 = [
  {
    "longitude": 2.0733865065056376,
    "latitude": 0.5598539740748087,
    "height": 120
  },
  {
    "longitude": 2.0733839959244103,
    "latitude": 0.5597777547258658,
    "height": 300
  },
  {
    "longitude": 2.073301481678757,
    "latitude": 0.5597909615778097,
    "height": 120
  }
]


// 将要检测的线
const lineToBeTest = [
  {
    sp:line1[0],
    ep:line1[1]
  },
  {
    sp:line2[1],
    ep:line2[2]
  },
  {
    sp:line2[0],
    ep:line2[1]
  }
]


const startDraw = () => {
  if (!viewer) return
  drawObj = new Draw({viewer:viewer,Cesium,type:'line'})
}
// 开始检测
const startAna = () => {
  let minR = 10
  let maxR = 30
  let addR = 0.05
  let status = 'add'
  function addRFunction() {
    if (status === 'add'){
      minR = minR + addR
    }
    if (status === 'minus'){
      minR = minR - addR
    }
    if (minR >= maxR){
      status = 'minus'
    }
    if (minR < 10){
      status = 'add'
    }
    return new Cesium.Cartesian3(minR,minR,minR)
  }
  if (!viewer) return
  // 添加平面
  const addPlaneRes = addPlane(drawObj.tempShapePoints[0],drawObj.tempShapePoints[1])
  planeEntity = addPlaneRes?.planeEntity
  plane = addPlaneRes?.plane
  // 获取相交点
  lineToBeTest.forEach(line=>{
    // 将世界坐标系的点,转换到plane的中心坐标系
    let startPoint = Cesium.Matrix4.multiplyByPoint(inv,Cesium.Cartesian3.fromRadians(line.sp.longitude,line.sp.latitude,line.sp.height) ,new Cartesian3())
    let endPoint = Cesium.Matrix4.multiplyByPoint(inv,Cesium.Cartesian3.fromRadians(line.ep.longitude,line.ep.latitude,line.ep.height),new Cartesian3())
    // 获取交点 此时交点在地球中心内部,需要转换到世界坐标
    let intersectTemp = Cesium.IntersectionTests.lineSegmentPlane(startPoint, endPoint, plane)
    let intersection = Cesium.Matrix4.multiplyByPoint(transform, intersectTemp, new Cartesian3());
    intersectPoint.push(intersection)
    const entity = viewer.entities.add({
      position:intersection,
      ellipsoid:{
        radii:new Cesium.CallbackProperty(addRFunction,false),
        material:Cesium.Color.fromCssColorString('#f60a0a'),
      }
    })
    intersectPointEntity.push(entity)
  })

}
// 初始时 绘制几条管廊
const init = () => {
  if (!viewer) return

  addPolylineVolume(Cesium.Cartesian3.fromDegreesArrayHeights([
    Cesium.Math.toDegrees(line2[0].longitude),
    Cesium.Math.toDegrees(line2[0].latitude),
    line2[0].height,
    Cesium.Math.toDegrees(line2[1].longitude),
    Cesium.Math.toDegrees(line2[1].latitude),
    line2[1].height,
    Cesium.Math.toDegrees(line2[2].longitude),
    Cesium.Math.toDegrees(line2[2].latitude),
    line2[2].height,
  ]))
  addPolylineVolume(Cesium.Cartesian3.fromDegreesArrayHeights([
    Cesium.Math.toDegrees(line1[0].longitude),
    Cesium.Math.toDegrees(line1[0].latitude),
    line1[0].height,
    Cesium.Math.toDegrees(line1[1].longitude),
    Cesium.Math.toDegrees(line1[1].latitude),
    line1[1].height,
  ]))
  viewer.flyTo(polylineVolumnList[0])
}
/**
 * 添加垂直于地面的平面  线的两个端点
 * @param p1
 * @param p2
 */
const addPlane = (p1:any,p2:any) => {
  if (!viewer) return
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
      dimensions: new Cesium.Cartesian2(distance, distance*2),
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
  if (!viewer) return
  const blueStar = viewer.entities.add({
    name: "Blue star with mitered corners and outline",
    polylineVolume: {
      positions,
      shape: computeCircle(5),
      cornerType: Cesium.CornerType.MITERED,
      material: Cesium.Color.fromCssColorString('rgba(4,236,217,0.84)'),
    },
  });
  polylineVolumnList.push(blueStar)

}
const clear = () => {
  if (!viewer) return
  if (planeEntity){
    viewer.entities.remove(planeEntity)
  }
  if (intersectPointEntity?.length){
    intersectPointEntity.forEach(e=>{
      viewer.entities.remove(e)
    })
  }
  if (drawObj){
    drawObj.stopDraw()
  }
}

init()



defineExpose({
  clear
})
</script>

<style scoped lang="scss">
.l-p-container {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 14vw;
  height: 6vh;
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
    width: 100%;
    display: flex;
    justify-content: space-between;
  }
}
</style>
