<template>
  <div class="czml-container">
    <fc-arrow-btn right @click="start">移动</fc-arrow-btn>
  </div>
</template>

<script setup lang="ts">
import { useSysStore } from '@/store/sys'
import * as Cesium from 'cesium'
import czml from './czml'

const sysStore = useSysStore()
const viewer = sysStore.$state.cesiumViewer

let positionProperty:any
let carEntity:any
let tileset:any

const init = () => {
  if (!viewer) return
  // 添加3dtile
  tileset = viewer.scene.primitives.add(
      new Cesium.Cesium3DTileset({
        url: Cesium.IonResource.fromAssetId(69380),
      })
  );
  // 设置相机位置
  viewer.zoomTo(tileset)
  carEntity = viewer.dataSources.add(Cesium.CzmlDataSource.load(czml)).then(function(dataSource) {
    let entity = dataSource.entities.getById("car1");
    if (entity) {
      viewer.zoomTo(entity)
      viewer.trackedEntity = entity
      positionProperty = entity.position;
      entity.orientation = new Cesium.VelocityOrientationProperty(entity.position);
    }
  })
}
init()

const start = () => {
  if (!viewer) return
  viewer.clock.shouldAnimate = true;
  const objectsToExclude = [carEntity];
  viewer.scene.postRender.addEventListener(function () {
    var position = positionProperty.getValue(viewer.clock.currentTime);
    carEntity.position = viewer.scene.clampToHeight(position, objectsToExclude);
  });
}

tileset.initialTilesLoaded.addEventListener(start)


const clear = () => {
  if (!viewer) return
  if (!carEntity) return
  viewer.trackedEntity = undefined
  viewer.entities.remove(carEntity)
}

defineExpose({
  clear
})

</script>

<style scoped lang="scss">
.czml-container{
  margin: 0 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 7vw;
  height: 5vh;
  position: fixed;
  left: 15vw;
  top: 1vw;
  padding: 8px;
  background: rgba(255, 255, 255, 0.7);
  -webkit-backdrop-filter: blur(10px);
  backdrop-filter: blur(5px);
  border-radius: 5px;
}
fc-arrow-btn{
  --color: rgb(30, 29, 21);
}
</style>
