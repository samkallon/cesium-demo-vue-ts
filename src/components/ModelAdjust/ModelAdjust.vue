<template>
  <div class="mm-container">
  </div>
</template>

<script setup lang="ts">
import tesla_cybertruck from '/model/tesla_cybertruck/scene.gltf'
import {ref, watch} from 'vue'
import {useSysStore} from '@/store/sys'
import {message} from "ant-design-vue";
import * as Cesium from 'cesium'
import {Cartesian3} from "cesium";


let moveX = ref<any>(0);
let moveY = ref<any>(0);
let moveZ = ref<any>(0);
let rotateX = ref<any>(0);
let rotateY = ref<any>(0);
let rotateZ = ref<any>(0);
let resizeX = ref<any>(1);
let resizeY = ref<any>(1);
let resizeZ = ref<any>(1);
let sysStore = useSysStore()
const viewer = sysStore.$state.cesiumViewer
let sourceModelMatrix:any
let Entity: any
let ArrowX: any
let ArrowY: any
let ArrowZ: any
let MoveEntity: any

const clear = () => {
  if (!viewer) return
  if (!Entity) return
  viewer.scene.primitives.remove(Entity)
}
const init = () => {
  clear()
  message.info('数据加载中!')
  // 加载模型
  if (!viewer) return
  const position = Cesium.Cartesian3.fromDegrees(120.675895, 31.319111,25)
  const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position)
  sourceModelMatrix = Cesium.clone(matrix)
  Entity = viewer.scene.primitives.add(
    Cesium.Model.fromGltf({
      id:'tesla_cybertruck',
      url:'/model/tesla_cybertruck/scene.gltf',
      scale:0.05,
      modelMatrix:matrix
    })
  )
  const centerPoint = Cesium.Cartographic.fromCartesian(position)
  // 添加模型本地坐标系箭头
  const instanceXline = new Cesium.GeometryInstance({
    geometry: new Cesium.PolylineGeometry({
      positions:Cesium.Cartesian3.fromDegreesArrayHeights([
        Cesium.Math.toDegrees(centerPoint.longitude),
        Cesium.Math.toDegrees(centerPoint.latitude),
        centerPoint.height,
        Cesium.Math.toDegrees(centerPoint.longitude)+0.0002,
        Cesium.Math.toDegrees(centerPoint.latitude),
        centerPoint.height]),
      width:25,
      arcType:Cesium.ArcType.NONE,
      vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
    }),
    attributes:{
      color:new Cesium.ColorGeometryInstanceAttribute(1.0, 0.0, 0.0, 0.8)
    }
  })
  const instanceYline = new Cesium.GeometryInstance({
    geometry: new Cesium.PolylineGeometry({
      positions:Cesium.Cartesian3.fromDegreesArrayHeights([
        Cesium.Math.toDegrees(centerPoint.longitude),
        Cesium.Math.toDegrees(centerPoint.latitude),
        centerPoint.height,
        Cesium.Math.toDegrees(centerPoint.longitude),
        Cesium.Math.toDegrees(centerPoint.latitude)+0.0002,
        centerPoint.height]),
      width:25,
      arcType:Cesium.ArcType.NONE,
      vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
    }),
    attributes:{
      color:new Cesium.ColorGeometryInstanceAttribute(0.0, 1.0, 0.0, 0.8)
    }
  })
  const instanceZline = new Cesium.GeometryInstance({
    geometry: new Cesium.PolylineGeometry({
      positions:Cesium.Cartesian3.fromDegreesArrayHeights([
        Cesium.Math.toDegrees(centerPoint.longitude),
        Cesium.Math.toDegrees(centerPoint.latitude),
        centerPoint.height,
        Cesium.Math.toDegrees(centerPoint.longitude),
        Cesium.Math.toDegrees(centerPoint.latitude),
        centerPoint.height + 10]),
      width:25,
      arcType:Cesium.ArcType.NONE,
      vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
    }),
    attributes:{
      color:new Cesium.ColorGeometryInstanceAttribute(0.0, 0.0, 1.0, 0.8)
    }
  })

  viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances:[instanceXline,instanceYline,instanceZline],
    appearance:new Cesium.PolylineMaterialAppearance({
      material: Cesium.Material.fromType(Cesium.Material.PolylineArrowType,{
        color:Cesium.Color.BLUE
      })
    }),
    // appearance:new Cesium.PerInstanceColorAppearance()
  }));

  viewer.camera.flyTo({
    destination:Cesium.Cartesian3.fromDegrees(120.675895, 31.319111,500),
    orientation:{
      heading:Cesium.Math.toRadians(90),
      pitch:Cesium.Math.toRadians(-90),
      roll:0
    }
  })
  // 添加拖动移动模型位置
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
  handler.setInputAction((event:any)=>{
    // 选取模型
    const pickObj = viewer.scene.pick(event.position)
    if (!pickObj) return
    MoveEntity = pickObj.primitive
  },Cesium.ScreenSpaceEventType.LEFT_CLICK)

  handler.setInputAction((event:any)=>{
    if (MoveEntity){
      viewer.scene.screenSpaceCameraController.enableRotate = false
      const startPosition = viewer.scene.globe.pick(viewer.camera.getPickRay(event.startPosition),viewer.scene)
      // const startPosition = Cesium.Matrix4.getTranslation(MoveEntity.modelMatrix,new Cartesian3())
      const endPosition = viewer.scene.globe.pick(viewer.camera.getPickRay(event.endPosition),viewer.scene)
      // const startRay = viewer.camera.getPickRay(event.startPosition)
      // const startPosition = viewer.scene.globe.pick(startRay, viewer.scene)
      //
      // const endRay = viewer.camera.getPickRay(event.endPosition)
      // const endPosition = viewer.scene.globe.pick(endRay, viewer.scene)
      console.log('startPosition :%o',startPosition)
      console.log('endPosition :%o',endPosition)
      const moveCartesian = Cesium.Cartesian3.subtract(startPosition,endPosition,new Cartesian3())
      MoveEntity.modelMatrix = Cesium.Matrix4.multiply(MoveEntity.modelMatrix,
          Cesium.Matrix4.fromTranslation(moveCartesian)
          ,MoveEntity.modelMatrix)
    }
  },Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  handler.setInputAction((event:any)=>{
    MoveEntity = null
    viewer.scene.screenSpaceCameraController.enableRotate = true
  },Cesium.ScreenSpaceEventType.RIGHT_CLICK)
}
init()


watch(
    [moveX,moveY,moveZ,rotateX,rotateY,rotateZ,resizeX,resizeY,resizeZ],
    ([nMoveX,nMoveY,nMoveZ,nRotateX,nRotateY,nRotateZ,nResizeX,nResizeY,nResizeZ],[oMoveX,oMoveY,oMoveZ,oRotateX,oRotateY,oRotateZ,oResizeX,oResizeY,oResizeZ]) =>{
      if(nMoveX !== oMoveX){
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix,Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(nMoveX-oMoveX,0,0)),Entity.modelMatrix)
      }
      if(nMoveY !== oMoveY){
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix,Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0,nMoveY-oMoveY,0)),Entity.modelMatrix)
      }
      if(nMoveZ !== oMoveZ){
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix,Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0,0,nMoveZ-oMoveZ)),Entity.modelMatrix)
      }
      if(nRotateX !== oRotateX){
        Entity.modelMatrix = Cesium.Matrix4.multiply(
            Entity.modelMatrix,
            Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(nRotateX-oRotateX))),
            Entity.modelMatrix)
      }
      if(nRotateY !== oRotateY){
        Entity.modelMatrix = Cesium.Matrix4.multiply(
            Entity.modelMatrix,
            Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(nRotateY-oRotateY))),
            Entity.modelMatrix)
      }
      if(nRotateZ !== oRotateZ){
        Entity.modelMatrix = Cesium.Matrix4.multiply(
            Entity.modelMatrix,
            Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(nRotateZ-oRotateZ))),
            Entity.modelMatrix)
      }

      if (nResizeX !== oResizeX && nResizeX !== 0){
        // 在x方向先还原
        const reduction = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1/oResizeX,1,1))
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix,reduction,new Cesium.Matrix4)
        const scale =  Cesium.Matrix4.fromScale(new Cesium.Cartesian3(nResizeX,1,1),new Cesium.Matrix4)
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix,scale,Entity.modelMatrix)
      }
      if (nResizeY !== oResizeY && nResizeY !== 0){
        const reduction = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1,1/oResizeY,1))
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix,reduction,new Cesium.Matrix4)
        const scale =  Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1,nResizeY,1),new Cesium.Matrix4)
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix,scale,Entity.modelMatrix)
      }
      if (nResizeZ !== oResizeZ && nResizeZ !== 0){
        const reduction = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1,1,1/oResizeZ))
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix,reduction,new Cesium.Matrix4)
        const scale =  Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1,1,nResizeZ),new Cesium.Matrix4)
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix,scale,Entity.modelMatrix)
      }
    }
)



defineExpose({
  clear
})

</script>

<style scoped lang="scss">
.mm-container {
  margin: 0 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 18vw;
  height: 10vh;
  position: fixed;
  left: 15vw;
  top: 1vw;
  padding: 8px;
  background: rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(5px);
  border-radius: 5px;
}

</style>
