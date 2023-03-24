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

  // 自定义材质
  let customMaterial = new Cesium.Material({
    fabric: {
      uniforms: {

      },
      source: `
            czm_material czm_getMaterial(czm_materialInput materialInput)
            {
              czm_material material = czm_getDefaultMaterial(materialInput);
              material.diffuse = vec3(0.0,0.0,1.0);
              return material;
            }`,
    },
  });
  window.customMaterial = customMaterial

  let aper = new Cesium.MaterialAppearance({
    material: customMaterial,
    translucent: true,
    fragmentShaderSource:`
    in vec3 v_positionEC;
    in vec3 v_normalEC;
    in vec2 v_st;

    void main()
    {
        vec3 positionToEyeEC = -v_positionEC;

        vec3 normalEC = normalize(v_normalEC);
    #ifdef FACE_FORWARD
        normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);
    #endif

        czm_materialInput materialInput;
        materialInput.normalEC = normalEC;
        materialInput.positionToEyeEC = positionToEyeEC;
        materialInput.st = v_st;
        czm_material material = czm_getMaterial(materialInput);
        // 相机离得远,green越大 离得近是本来的颜色
        material.diffuse.g = positionToEyeEC.z / 1.0e6 * 1.5;

    #ifdef FLAT
        out_FragColor = vec4(material.diffuse + material.emission, material.alpha);
    #else
        out_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
    #endif
    }
    `
  })

  window.apertest = aper


  var wallInstance = new Cesium.GeometryInstance({
    geometry: Cesium.WallGeometry.fromConstantHeights({
      positions: Cesium.Cartesian3.fromDegreesArray([
        97.0,
        43.0,
        107.0,
        43.0,
        107.0,
        40.0,
        97.0,
        40.0,
        97.0,
        43.0,
      ]),
      maximumHeight: 100000.0,
      vertexFormat: Cesium.VertexFormat.POSITION_NORMAL_AND_ST,
    }),
  })

  Primitive = viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: [wallInstance],
      appearance: aper
    })
  )

  const cameraParam = {
    "longitude": 103.42029045,
    "latitude": 34.42842248,
    "height": 999000.4552,
    "heading": 351.3406,
    "pitch": -50.2169,
    "roll": 0.0002,
    "cartersian": {"x": -1437322.4822493163, "y": 5893451.215586636, "z": 4060476.666974406}
  }
  czUtil.flyByParams(cameraParam)

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
