<template>
  <div class="mm-container">
  </div>
</template>

<script lang="ts" setup>
import tesla_cybertruck from '/model/tesla_cybertruck/scene.gltf'
import {ref, watch} from 'vue'
import {useSysStore} from '@/store/sys'
import {message} from "ant-design-vue";
import * as Cesium from 'cesium'
import {Cartesian3} from "cesium";


let sysStore = useSysStore()
const viewer = sysStore.$state.cesiumViewer
let sourceModelMatrix: any
let Entity: any
let DebuggerEntity: any
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
  const position = Cesium.Cartesian3.fromDegrees(120.675895, 31.319111, 25)
  const matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position)
  sourceModelMatrix = Cesium.clone(matrix)
  Entity = viewer.scene.primitives.add(
      Cesium.Model.fromGltf({
        id: 'tesla_cybertruck',
        url: '/model/tesla_cybertruck/scene.gltf',
        scale: 0.05,
        modelMatrix: matrix,
      })
  )

  DebuggerEntity = viewer.scene.primitives.add(
      new Cesium.DebugModelMatrixPrimitive({
        modelMatrix: matrix,
        length: 30.0,
        width: 5.0,
      })
  );
  const param = {
    "longitude": 120.67670449,
    "latitude": 31.31843263,
    "height": 91.1473,
    "heading": 314.0836,
    "pitch": -33.2043,
    "roll": 0.0001,
    "cartersian": {"x": -2782514.421639133, "y": 4690607.389665246, "z": 3296147.371471408}
  }

  viewer.camera.setView({
    destination: new Cesium.Cartesian3(param.cartersian.x, param.cartersian.y, param.cartersian.z),
    orientation: {
      heading: Cesium.Math.toRadians(param.heading),
      pitch: Cesium.Math.toRadians(param.pitch),
      roll: Cesium.Math.toRadians(param.roll)
    }
  })
  // 添加拖动移动模型位置
  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
  handler.setInputAction((event: any) => {
    // 选取模型
    const pickObj = viewer.scene.pick(event.position)
    if (!pickObj) return
    MoveEntity = pickObj.primitive
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

  handler.setInputAction((event: any) => {
    if (MoveEntity) {
      viewer.scene.screenSpaceCameraController.enableRotate = false
      const startPosition = viewer.scene.globe.pick(viewer.camera.getPickRay(event.startPosition), viewer.scene)
      // const startPosition = Cesium.Matrix4.getTranslation(MoveEntity.modelMatrix,new Cartesian3())
      const endPosition = viewer.scene.globe.pick(viewer.camera.getPickRay(event.endPosition), viewer.scene)
      // const startRay = viewer.camera.getPickRay(event.startPosition)
      // const startPosition = viewer.scene.globe.pick(startRay, viewer.scene)
      //
      // const endRay = viewer.camera.getPickRay(event.endPosition)
      // const endPosition = viewer.scene.globe.pick(endRay, viewer.scene)
      console.log('startPosition :%o', startPosition)
      console.log('endPosition :%o', endPosition)
      const rotateXMatrix = Cesium.Matrix4.fromRotation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(-50)))
      const rotateYMatriy = Cesium.Matrix4.fromRotation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(-28)))
      const rotateYMatriz = Cesium.Matrix4.fromRotation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(200)))
      const rotateMatrixTemp = Cesium.Matrix4.multiply(rotateXMatrix, rotateYMatriy, new Cesium.Matrix4())
      const rotateMatrix = Cesium.Matrix4.multiply(rotateMatrixTemp, rotateYMatriz, new Cesium.Matrix4())
      const zAddMatrix = Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, 4), new Cesium.Matrix4())
      const rotateTransMatrix = Cesium.Matrix4.multiply(rotateMatrix, zAddMatrix, new Cesium.Matrix4())
      Cesium.Matrix4.multiply(Cesium.Matrix4.fromTranslation(endPosition), rotateTransMatrix, MoveEntity.modelMatrix)
      Cesium.Matrix4.multiply(Cesium.Matrix4.fromTranslation(endPosition), rotateTransMatrix, DebuggerEntity.modelMatrix)
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE)

  handler.setInputAction((event: any) => {
    MoveEntity = null
    viewer.scene.screenSpaceCameraController.enableRotate = true
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK)
}
init()


defineExpose({
  clear
})

</script>

<style lang="scss" scoped>
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
