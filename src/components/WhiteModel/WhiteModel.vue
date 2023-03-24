<template>
  <div class="mm-container">

  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue'
import {useSysStore} from '@/store/sys'
import {message} from "ant-design-vue";
import * as Cesium from 'cesium'
import {CesiumUtils} from "@/core/cesiumUtils";


let sysStore = useSysStore()
const viewer = sysStore.$state.cesiumViewer
const czUtil = new CesiumUtils({viewer})
let Primitive: any


const clear = () => {
  if (!viewer) return
  viewer.scene.primitives.removeAll()
}
const init = async () => {
  if (!viewer) return
  clear()


  const shader1 = `
      // Color tiles by distance to the camera
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
      {
          material.diffuse = vec3(0.0, 0.0, 1.0);
          material.diffuse.g = -fsInput.attributes.positionEC.z / 1.0e4 * 2.;
      }
      `

  const shader2 = `
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        // 渐变效果
        vec4 position = czm_inverseModelView * vec4(fsInput.attributes.positionEC, 1); // 解算出模型坐标
        float glowRange = 200.0; // 光环的移动范围(高度)，最高到200米
        material.diffuse = vec3(0.2, 0.5, 1.0); // 基础蓝色
        material.diffuse *= vec3(position.z / 100.0); // 按模型高度进行颜色变暗处理
        // // 扫描线
        float time = fract(czm_frameNumber / 360.0); // 计算当前着色器的时间，帧率/（6*60），即时间放慢6倍
        // clamp 将值限制在0到1之间
        float diff = step(0.005, abs(clamp(position.z / glowRange, 0.0, 1.0) - time)); // 根据时间来计算颜色差异，比例
        material.diffuse.rgb += material.diffuse.rgb * (1.0 - diff); // 原有颜色加上颜色差异值提高亮度
      }
    `

  const tileset = new Cesium.Cesium3DTileset({
    url: Cesium.IonResource.fromAssetId(75343),
    customShader: new Cesium.CustomShader({
      lightingModel: Cesium.LightingModel.UNLIT,
      fragmentShaderText: shader2,
    }),
  });



  viewer.scene.primitives.add(tileset);
  const initialPosition = Cesium.Cartesian3.fromDegrees(
    -74.01881302800248,
    40.69114333714821,
    753
  );
  const initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
    21.27879878293835,
    -21.34390550872461,
    0.0716951918898415
  );
  viewer.scene.camera.setView({
    destination: initialPosition,
    orientation: initialOrientation,
    endTransform: Cesium.Matrix4.IDENTITY,
  });

  tileset.tileLoad.addEventListener(tile=>{
    let content = tile.content;
    content._model._customShader
  })

  // tileset.readyPromise.then(tile=>{
  //   const modelList = []
  //   const tileModelStack = []
  //   tileModelStack.push(tile._root)
  //   while (tileModelStack.length > 0){
  //     const top = tileModelStack.pop()
  //     if (top.children.length > 0){
  //       tileModelStack.push(...top.children)
  //       if (top._content){
  //         modelList.push(top)
  //       }
  //     }else{
  //       if (top._content){
  //         modelList.push(top)
  //       }
  //     }
  //   }
  //   console.log(modelList)
  // })



  //
  // function renderLoop(timestamp: any) {
  //   aper.material.uniforms.iTime = timestamp / 1000;
  //   requestAnimationFrame(renderLoop);
  // }
  //
  // renderLoop();
  //
  // const startTime = performance.now();
  // viewer.scene.postUpdate.addEventListener(function () {
  //   const elapsedTimeSeconds = (performance.now() - startTime) / 1000;
  //   customMaterial.uniforms.iTime = elapsedTimeSeconds;
  // });

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
