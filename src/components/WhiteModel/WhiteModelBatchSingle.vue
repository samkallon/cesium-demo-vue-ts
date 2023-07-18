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
const viewer = window.viewer
const czUtil = new CesiumUtils({viewer})
let Primitive: any


const clear = () => {
  if (!viewer) return
  viewer.scene.primitives.removeAll()
}
const init = async () => {
  if (!viewer) return
  clear()
  const shader2 = `
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        // 渐变效果
        vec4 position = czm_inverseModelView * vec4(fsInput.attributes.positionEC, 1); // 解算出模型坐标
        // vec4 position = vec4(fsInput.attributes.positionMC,1); // 解算出模型坐标
        float glowRange = 100.0; // 光环的移动范围(高度)，最高到200米
        material.diffuse = vec3(0.2, 1.0, 1.0); // 基础蓝色
        material.diffuse *= vec3(position.z / 100.0); // 按模型高度进行颜色变暗处理
        // // 扫描线
        float time = fract(czm_frameNumber / 180.0); // 计算当前着色器的时间，帧率/（6*60），即时间放慢6倍
        // clamp 将值限制在0到1之间
        float diff = step(0.005, abs(clamp(position.z / glowRange, 0.0, 1.0) - time)); // 根据时间来计算颜色差异，比例
        material.diffuse.rgb += material.diffuse.rgb * (1.0 - diff); // 原有颜色加上颜色差异值提高亮度
      }
    `
  const shader1 = `
                    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
                        float _baseHeight = 0.0; // 物体的基础高度，需要修改成一个合适的建筑基础高度
                        float _heightRange = 60.0; // 高亮的范围(_baseHeight ~ _baseHeight + _      heightRange) 默认是 0-60米
                        float _glowRange = 300.0; // 光环的移动范围(高度)
                        float vtxf_height = fsInput.attributes.positionMC.z-_baseHeight;
                        float vtxf_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
                        float vtxf_a12 = vtxf_height / _heightRange + sin(vtxf_a11) * 0.1;
                        material.diffuse*= vec3(vtxf_a12, vtxf_a12, vtxf_a12);
                        float vtxf_a13 = fract(czm_frameNumber / 360.0);
                        float vtxf_h = clamp(vtxf_height / _glowRange, 0.0, 1.0);
                        vtxf_a13 = abs(vtxf_a13 - 0.5) * 2.0;
                        float vtxf_diff = step(0.005, abs(vtxf_h - vtxf_a13));
                        material.diffuse += material.diffuse * (1.0 - vtxf_diff);
                    }
                    `

  const tileset = new Cesium.Cesium3DTileset({
    url: 'https://lab.earthsdk.com/model/702aa950d03c11e99f7ddd77cbe22fea/tileset.json',
    customShader: new Cesium.CustomShader({
      fragmentShaderText: shader1
    })
  });



  viewer.scene.primitives.add(tileset);
  tileset.style = new Cesium.Cesium3DTileStyle({
    color: {
      conditions: [["true", "color('rgb(51, 153, 255)',1)"]],
    },
  });

  tileset.tileLoad.addEventListener(tile=>{
    const content = tile.content

  })

  viewer.flyTo(tileset)


  window.nytileset = tileset


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
