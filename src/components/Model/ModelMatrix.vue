<template>
  <div class="mm-container">
    <div class="title">
      <div>平移</div>
    </div>
    <div class="content">
      <div>西</div>
      <a-slider v-model:value="moveX" :max="200" :min="-200"/>
      <div>东</div>
      <a-input-number v-model:value="moveX" :max="200" :min="-200" class="content-inputnum"/>
      <div>米</div>
    </div>
    <div class="content">
      <div>南</div>
      <a-slider v-model:value="moveY" :max="200" :min="-200"/>
      <div>北</div>
      <a-input-number v-model:value="moveY" :max="200" :min="-200" class="content-inputnum"/>
      <div>米</div>
    </div>
    <div class="content">
      <div>下</div>
      <a-slider v-model:value="moveZ" :max="200" :min="-200"/>
      <div>上</div>
      <a-input-number v-model:value="moveZ" :max="200" :min="-200" class="content-inputnum"/>
      <div>米</div>
    </div>
    <a-divider/>
    <div class="title">
      <div>旋转</div>
    </div>
    <div class="content">
      <div>x-</div>
      <a-slider v-model:value="rotateX" :max="180" :min="-180"/>
      <div>x+</div>
      <a-input-number v-model:value="rotateX" :max="180" :min="-180" class="content-inputnum"/>
      <div>度</div>
    </div>
    <div class="content">
      <div>y-</div>
      <a-slider v-model:value="rotateY" :max="180" :min="-180"/>
      <div>y+</div>
      <a-input-number v-model:value="rotateY" :max="180" :min="-180" class="content-inputnum"/>
      <div>度</div>
    </div>
    <div class="content">
      <div>z-</div>
      <a-slider v-model:value="rotateZ" :max="180" :min="-180"/>
      <div>z+</div>
      <a-input-number v-model:value="rotateZ" :max="180" :min="-180" class="content-inputnum"/>
      <div>度</div>
    </div>
    <a-divider/>
    <div class="title">
      <div>缩放</div>
    </div>
    <div class="content">
      <div>x-</div>
      <a-slider v-model:value="resizeX" :max="2" :min="0.1" :step="0.1"/>
      <div>x+</div>
      <a-input-number v-model:value="resizeX" :max="2" :min="0.1" class="content-inputnum"/>
      <div>倍</div>
    </div>
    <div class="content">
      <div>y-</div>
      <a-slider v-model:value="resizeY" :max="2" :min="0.1" :step="0.1"/>
      <div>y+</div>
      <a-input-number v-model:value="resizeY" :max="2" :min="0.1" class="content-inputnum"/>
      <div>倍</div>
    </div>
    <div class="content">
      <div>z-</div>
      <a-slider v-model:value="resizeZ" :max="2" :min="0.1" :step="0.1"/>
      <div>z+</div>
      <a-input-number v-model:value="resizeZ" :max="2" :min="0.1" class="content-inputnum"/>
      <div>倍</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import tesla_cybertruck from '/model/tesla_cybertruck/scene.gltf'
import {ref, watch} from 'vue'
import {useSysStore} from '@/store/sys'
import {message} from "ant-design-vue";
import * as Cesium from 'cesium'


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
const viewer = window.viewer
let sourceModelMatrix: any
let Entity: any

const clear = () => {
  if (!viewer) return
  if (!Entity) return
    viewer.scene.primitives.removeAll()
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
        modelMatrix: matrix
      })
  )
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
}
init()


watch(
    [moveX, moveY, moveZ, rotateX, rotateY, rotateZ, resizeX, resizeY, resizeZ],
    ([nMoveX, nMoveY, nMoveZ, nRotateX, nRotateY, nRotateZ, nResizeX, nResizeY, nResizeZ], [oMoveX, oMoveY, oMoveZ, oRotateX, oRotateY, oRotateZ, oResizeX, oResizeY, oResizeZ]) => {
      if (nMoveX !== oMoveX) {
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix, Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(nMoveX - oMoveX, 0, 0)), Entity.modelMatrix)
      }
      if (nMoveY !== oMoveY) {
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix, Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, nMoveY - oMoveY, 0)), Entity.modelMatrix)
      }
      if (nMoveZ !== oMoveZ) {
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix, Cesium.Matrix4.fromTranslation(new Cesium.Cartesian3(0, 0, nMoveZ - oMoveZ)), Entity.modelMatrix)
      }
      if (nRotateX !== oRotateX) {
        Entity.modelMatrix = Cesium.Matrix4.multiply(
            Entity.modelMatrix,
            Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(nRotateX - oRotateX))),
            Entity.modelMatrix)
      }
      if (nRotateY !== oRotateY) {
        Entity.modelMatrix = Cesium.Matrix4.multiply(
            Entity.modelMatrix,
            Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(nRotateY - oRotateY))),
            Entity.modelMatrix)
      }
      if (nRotateZ !== oRotateZ) {
        Entity.modelMatrix = Cesium.Matrix4.multiply(
            Entity.modelMatrix,
            Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(nRotateZ - oRotateZ))),
            Entity.modelMatrix)
      }

      if (nResizeX !== oResizeX && nResizeX !== 0) {
        // 在x方向先还原
        const reduction = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1 / oResizeX, 1, 1))
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix, reduction, new Cesium.Matrix4)
        const scale = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(nResizeX, 1, 1), new Cesium.Matrix4)
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix, scale, Entity.modelMatrix)
      }
      if (nResizeY !== oResizeY && nResizeY !== 0) {
        const reduction = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1, 1 / oResizeY, 1))
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix, reduction, new Cesium.Matrix4)
        const scale = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1, nResizeY, 1), new Cesium.Matrix4)
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix, scale, Entity.modelMatrix)
      }
      if (nResizeZ !== oResizeZ && nResizeZ !== 0) {
        const reduction = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1, 1, 1 / oResizeZ))
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix, reduction, new Cesium.Matrix4)
        const scale = Cesium.Matrix4.fromScale(new Cesium.Cartesian3(1, 1, nResizeZ), new Cesium.Matrix4)
        Entity.modelMatrix = Cesium.Matrix4.multiply(Entity.modelMatrix, scale, Entity.modelMatrix)
      }
    }
)


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
  height: 52vh;
  position: fixed;
  left: 15vw;
  top: 1vw;
  padding: 8px;
  background: rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(5px);
  border-radius: 5px;

  .title {
    width: 95%;
    display: flex;
    justify-content: space-between;
    font-weight: bold;
    align-items: center;
    margin: 8px;
  }

  .content {
    display: flex;
    margin: 2px 8px;
    align-items: center;
    width: 95%;

    .ant-slider {
      width: 200px;
    }

    &-inputnum {
      margin-left: 16px;
      width: 50px
    }
  }

  :deep(.ant-divider-horizontal) {
    margin: 4px 0;
  }
}

</style>
