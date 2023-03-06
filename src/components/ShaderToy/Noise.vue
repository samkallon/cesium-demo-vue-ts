<template>
  <div class="mm-container">

  </div>
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue'
import {useSysStore} from '@/store/sys'
import {message} from "ant-design-vue";
import * as Cesium from 'cesium'


let sysStore = useSysStore()
const viewer = sysStore.$state.cesiumViewer
let Entity: any


const clear = () => {
  if (!viewer) return
  viewer.scene.primitives.removeAll()
}
const init = async () => {
  if (!viewer) return
  clear()

  // 自定义材质
  let customShader = new Cesium.CustomShader({
    uniforms: {
      u_time: {
        value: 0,
        type: Cesium.UniformType.FLOAT
      }
    },
    fragmentShaderText: `
      float random (in vec2 st) {
        return fract(sin(dot(st.xy,vec2(12.9898,78.233)))* 43758.5453123);
      }

      float noise (in vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);

        // Four corners in 2D of a tile
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));

        // Smooth Interpolation

        // Cubic Hermine Curve.  Same as SmoothStep()
        vec2 u = f*f*(3.0-2.0*f);
        // u = smoothstep(0.,1.,f);

        // Mix 4 coorners percentages
        return mix(a, b, u.x) +
                (c - a)* u.y * (1.0 - u.x) +
                (d - b) * u.x * u.y;
    }
    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
      vec2 st = fsInput.attributes.texCoord_0+(sin(u_time)*.1);
      // Scale the coordinate system to see
      // some noise in action
      vec2 pos = vec2(st*100.0);

      // Use the noise function
      float n = noise(pos);

      material.diffuse = vec3(n);
    }
                `,
  });
  let hpr = new Cesium.HeadingPitchRoll(0, 0, 0)
  let origin = Cesium.Cartesian3.fromDegrees(110, 40, 1400)
  const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin,hpr)



  const resource = await Cesium.IonResource.fromAssetId(1533514);
  const model = viewer.scene.primitives.add(
      Cesium.Model.fromGltf({
        url: resource,
        customShader,
        modelMatrix
      }))


  model.readyPromise.then(model=>{
    viewer.camera.flyToBoundingSphere(model.boundingSphere,{
      duration:0.5
    })
  })


  const startTime = performance.now();
  viewer.scene.postUpdate.addEventListener(function () {
    const elapsedTimeSeconds = (performance.now() - startTime) / 1000;
    customShader.setUniform("u_time", elapsedTimeSeconds);
  });

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
