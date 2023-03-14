<template>
    <div class="czml-container">
        <fc-arrow-btn left @click="init('plane1')">飞机</fc-arrow-btn>
        <fc-arrow-btn right @click="init('car1')">小车</fc-arrow-btn>
    </div>
</template>

<script lang="ts" setup>
import {useSysStore} from '@/store/sys'
import {message} from "ant-design-vue";
import * as Cesium from 'cesium'
import czml from './czml'

const sysStore = useSysStore()
const viewer = sysStore.$state.cesiumViewer

let positionProperty: any
let Entity: any

const init = (type: any) => {
    clear()
    message.info('数据加载中!')
    if (!viewer) return
    // 添加3dtile
    window.tileset69380 = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
            url: Cesium.IonResource.fromAssetId(69380),
        })
    );
    // 添加光源
    viewer.scene.light = new Cesium.DirectionalLight({ //去除时间原因影响模型颜色
        direction: new Cesium.Cartesian3(0.35492591601301104, -0.8909182691839401, -0.2833588392420772)
    })
    // 设置相机位置
    viewer.zoomTo(window.tileset69380)
    addCzml(type === 'car1' ? czml.czmlCar : czml.czmlPlane, type)
    window.tileset69380.initialTilesLoaded.addEventListener(start)

}


const start = () => {
    message.info('数据加载完成!')
    if (!viewer) return
    viewer.clock.shouldAnimate = true;
    const objectsToExclude = [Entity];
    viewer.scene.postRender.addEventListener(function () {
        var position = positionProperty.getValue(viewer.clock.currentTime);
        Entity.position = viewer.scene.clampToHeight(position, objectsToExclude);
    });
}

const addCzml = (czmlData: any, id: any) => {
    if (!viewer) return
    Entity = viewer.dataSources.add(Cesium.CzmlDataSource.load(czmlData)).then(function (dataSource) {
        let entity = dataSource.entities.getById(id);
        if (entity) {
            viewer.zoomTo(entity)
            viewer.trackedEntity = entity
            positionProperty = entity.position;
            entity.orientation = new Cesium.VelocityOrientationProperty(entity.position);
        }
    })
}


const clear = () => {
  if (!viewer) return
  if (!Entity) return
  viewer.trackedEntity = undefined
  viewer.dataSources.remove(Entity)
  viewer.scene.primitives.remove(window.tileset69380)
  window.tileset69380 = null
}

defineExpose({
    clear
})

</script>

<style lang="scss" scoped>
.czml-container {
    margin: 0 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 15vw;
    height: 6vh;
    position: fixed;
    left: 15vw;
    top: 1vw;
    padding: 8px;
    background: rgba(255, 255, 255, 0.7);
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(5px);
    border-radius: 5px;
}

fc-arrow-btn {
    --color: rgb(20, 151, 243);
}
</style>
