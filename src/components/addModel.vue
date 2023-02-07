<template>
  <div class="btn-group">
    <a-button type="primary" @click="createModel(0)">Model X</a-button>
    <a-button type="primary" @click="createModel(1)">Model S</a-button>
    <a-button type="primary" @click="createModel(2)">Cybertruck</a-button>
  </div>
</template>

<script setup lang="ts">
import { useSysStore } from '@/store/sys'
import * as Cesium from 'cesium'
import {Cartesian3} from "cesium";
import {CesiumUtils} from "@/core/cesiumUtils";
const sysStore = useSysStore()
const viewer = sysStore.$state.cesiumViewer
const cesiumUtils = new CesiumUtils(viewer)
const DIC = [
  {
    url:'./model/tesla_model_x/scene.gltf',
    position:Cesium.Cartesian3.fromDegrees(
        -3.81612084,
        53.12392085,
        206.8
    ),
    scale:2
  },
  {
    url:'./model/tesla_model_s_plaid_2021/scene.gltf',
    position:Cesium.Cartesian3.fromDegrees(
        -3.81516510,
        53.12418585,
        206.8
    ),
    scale:0.020
  },
  {
    url:'./model/tesla_cybertruck__racing_free_model/scene.gltf',
    position:Cesium.Cartesian3.fromDegrees(
        -3.81732846,
        53.12397809,
        206.8
    ),
    scale:2.0
  }
]

const createModel = (type: number) => {
  const heading = Cesium.Math.toRadians(135);
  const pitch = 0;
  const roll = 0;
  const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
  let orientation
  Cesium.Transforms.headingPitchRollQuaternion(
      DIC[type].position,
      hpr,
      Cesium.Ellipsoid.WGS84,
      undefined,orientation
  );
  if (viewer){
    let position = DIC[type].position
    if (type === 1){
      let matrix = cesiumUtils.getMoveMatrix4(position,new Cartesian3(-50,-1,-2))
      position = Cesium.Matrix4.multiplyByPoint(matrix,position,new Cesium.Cartesian3)
    }
    if (type === 2){
      let matrix = cesiumUtils.getMoveMatrix4(position,new Cartesian3(80,10,0))
      position = Cesium.Matrix4.multiplyByPoint(matrix,position,new Cesium.Cartesian3)
    }
    const entity = viewer.entities.add({
      name: 'Model_'+type,
      id: 'Model_'+type,
      position,
      orientation,
      model: {
        uri: DIC[type].url,
        minimumPixelSize:30,
        scale:DIC[type].scale
      },
    });

    // viewer.flyTo(entity)
  }
}

const clear = () => {
  if (viewer){
    viewer.entities.removeById('Model_x')
    viewer.entities.removeById('Model_s')
    viewer.entities.removeById('Model_c')
  }
}

defineExpose({
  clear
})
</script>

<style scoped lang="scss">
.btn-group{
  margin: 0 20px;
  display: flex;
  justify-content: space-between;
  width: 15vw;
  height: 6vh;
  position: fixed;
  left: 15vw;
  top: 1vw;
  padding: 8px;
  background: rgba(255, 255, 255, .7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(5px);
  border-radius: 5px;
}
</style>
