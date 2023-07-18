<template>
  <div class="mm-container">

  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue'
import {useSysStore} from '@/store/sys'
import {message} from "ant-design-vue";
import * as Cesium from 'cesium'
import {CesiumUtils} from "@/core/cesiumUtils"


let sysStore = useSysStore()
const czUtil = new CesiumUtils({viewer:window.viewer})
let Primitive: any


const clear = () => {
  if (!window.window.viewer) return
  window.viewer.scene.primitives.removeAll()
}
const init = async () => {
  if (!window.viewer) return
  clear()
  const tileset =new Cesium.Cesium3DTileset({
      url: 'http://124.70.11.35/fc-house/tileset.json'
    });
  window.viewer.scene.primitives.add(tileset);
  window.viewer.flyTo(tileset)


  // const shader1 = `
  //     // Color tiles by distance to the camera
  //     void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
  //     {
  //         material.diffuse = vec3(0.0, 0.0, 1.0);
  //         material.diffuse.g = -fsInput.attributes.positionEC.z / 1.0e4 * 2.;
  //     }
  //     `
  //
  // const tileset = new Cesium.Cesium3DTileset({
  //   url: Cesium.IonResource.fromAssetId(75343),
  //   customShader: new Cesium.CustomShader({
  //     lightingModel: Cesium.LightingModel.UNLIT,
  //     fragmentShaderText: shader1,
  //   }),
  // });
  //
  //
  //
  // window.viewer.scene.primitives.add(tileset);
  // const initialPosition = Cesium.Cartesian3.fromDegrees(
  //   -74.01881302800248,
  //   40.69114333714821,
  //   753
  // );
  // const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
  //   21.27879878293835,
  //   -21.34390550872461,
  //   0.0716951918898415
  // );
  // window.viewer.scene.camera.setView({
  //   destination: initialPosition,
  //   orientation: initialOrientation,
  //   endTransform: Cesium.Matrix4.IDENTITY,
  // });
  //
  // const rotationMtr = getMoveMatrix4(new Cesium.Cartesian3(0,0,0),new Cesium.Cartesian3(10,0,100))
  const rotationMtr = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(10)))

  let handler = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas);
  handler.setInputAction(function (movement) {
    let position = movement.position;
    var pickModel = window.viewer.scene.pick(position);
    let model = pickModel.content._model
    model.modelMatrix = Cesium.Matrix4.multiply(model.modelMatrix,rotationMtr,model.modelMatrix)
    // _this.judgeMmouseOnModelOrTerr(position, viewer);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  tileset.tileVisible.addEventListener(tile=>{
    var content = tile.content;
    var featuresLength = content.featuresLength;
    for (var i = 0; i < featuresLength; i += 1) {
      let feature = content.getFeature(i)
      const height = feature.getProperty('Height')
      let model = feature.content._model
      if (height > 300){
        model.modelMatrix = Cesium.Matrix4.multiply(model.modelMatrix,rotationMtr,model.modelMatrix)
        model._customShader.fragmentShaderText =  `
          // Color tiles by distance to the camera
          void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
          {
              material.diffuse = vec3(1.0, 0.0, 0.0);
              material.diffuse.g = -fsInput.attributes.positionEC.z / 1.0e4 * 2.;
          }
          `
        model._shouldRegenerateShaders = true
      }else{
        //model.modelMatrix = Cesium.Matrix4.multiply(model.modelMatrix,rotationNorMtr,model.modelMatrix)
      }
      // model.scale = 2
      // model._shouldRegenerateShaders = true
    }

  })


}
const getMoveMatrix4 = (position,offset) => {
  const frompoint_to_world_matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position); // Matrix4
  const local_translation = offset; // 向模型中心为原点，正北为y，正东为x，地心朝上为z分别平移 310、-140、10米
  const result = new Cesium.Cartesian3(0,0,0);
  Cesium.Matrix4.multiplyByPoint(frompoint_to_world_matrix, local_translation, result); // 转换矩阵左乘局部平移向量，结果存储在 result 中，结果是世界坐标下的平移终点向量
  return Cesium.Matrix4.fromTranslation(Cesium.Cartesian3.subtract(result,position,new Cesium.Cartesian3())); // 构造平移矩阵并赋值
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
  background: rgba(0, 255, 250, 0.98);
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
