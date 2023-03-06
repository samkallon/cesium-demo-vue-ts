<template>
  <div class="mm-container">

  </div>
</template>

<script lang="ts" setup>
import {useSysStore} from '@/store/sys'
import * as Cesium from 'cesium'


let sysStore = useSysStore()
const viewer = sysStore.$state.cesiumViewer
let Entity: any
let polylineVolumnList = []

//Set the random number seed for consistent results.
Cesium.Math.setRandomNumberSeed(3);

//Set bounds of our simulation time
const start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
const stop = Cesium.JulianDate.addSeconds(
    start,
    120,
    new Cesium.JulianDate()
);


const line2 = [
  {
    "longitude": 2.0733865065056376,
    "latitude": 0.5598539740748087,
    "height": 120
  },
  {
    "longitude": 2.0733839959244103,
    "latitude": 0.5597777547258658,
    "height": 300
  }
]


const viewModel = {
  emissionRate: 50, // 发射速率
  gravity: -50,// 重力
  minimumParticleLife: 1.5, //最小生命周期
  maximumParticleLife: 1.5, // 最大生命周期
  minimumSpeed: 30, //最小速度
  maximumSpeed: 50, // 最大速度
  startScale: 1.0, //开始比例
  endScale: 5.0, // 结束比例
  particleSize: 25.0, // 粒子大小
};

const emitterModelMatrix = new Cesium.Matrix4();
const translation = new Cesium.Cartesian3();
const rotation = new Cesium.Quaternion();
let hpr = new Cesium.HeadingPitchRoll();
const trs = new Cesium.TranslationRotationScale();

const gravityScratch = new Cesium.Cartesian3();

const computeEmitterModelMatrix = () => {
  hpr = Cesium.HeadingPitchRoll.fromDegrees(0.0, 0.0, 0.0, hpr);
  trs.translation = Cesium.Cartesian3.fromElements(
      -4.0,
      0.0,
      1.4,
      translation
  );
  trs.rotation = Cesium.Quaternion.fromHeadingPitchRoll(hpr, rotation);

  return Cesium.Matrix4.fromTranslationRotationScale(
      trs,
      emitterModelMatrix
  );
}

const applyGravity = (p, dt) => {
  // We need to compute a local up vector for each particle in geocentric space.
  const position = p.position;

  Cesium.Cartesian3.normalize(position, gravityScratch);
  Cesium.Cartesian3.multiplyByScalar(
      gravityScratch,
      viewModel.gravity * dt,
      gravityScratch
  );

  p.velocity = Cesium.Cartesian3.add(
      p.velocity,
      gravityScratch,
      p.velocity
  );
}

const clear = () => {
  if (!viewer) return
  viewer.scene.primitives.removeAll()
}

// 计算管线圆柱形
const computeCircle = (radius: any) => {
  const positions = [];
  for (let i = 0; i < 180; i++) {
    const radians = Cesium.Math.toRadians(i);
    positions.push(
        new Cesium.Cartesian2(
            radius * Math.cos(radians),
            radius * Math.sin(radians)
        )
    );
  }
  return positions;
}
/**
 * 添加管线
 */
const addPolylineVolume = (positions: any) => {
  if (!viewer) return
  const blueStar = viewer.entities.add({
    name: "Blue",
    polylineVolume: {
      positions,
      shape: computeCircle(5),
      cornerType: Cesium.CornerType.MITERED,
      material: Cesium.Color.fromCssColorString('rgb(255,0,0)'),
    },
  });
  polylineVolumnList.push(blueStar)
}


const init = async () => {
  if (!viewer) return
  clear()

  // addPolylineVolume(Cesium.Cartesian3.fromDegreesArrayHeights([
  //   Cesium.Math.toDegrees(line2[0].longitude),
  //   Cesium.Math.toDegrees(line2[0].latitude),
  //   line2[0].height,
  //   Cesium.Math.toDegrees(line2[1].longitude),
  //   Cesium.Math.toDegrees(line2[1].latitude),
  //   line2[1].height
  // ]))

//Make sure viewer is at the desired time.
  viewer.clock.startTime = start.clone();
  viewer.clock.stopTime = stop.clone();
  viewer.clock.currentTime = start.clone();
  viewer.clock.clockRange = Cesium.ClockRange.LOOP_STOP; //Loop at the end
  viewer.clock.multiplier = 1;
  viewer.clock.shouldAnimate = true;

// Set timeline to simulation bounds
  viewer.timeline.zoomTo(start, stop);
  const particleSystem = viewer.scene.primitives.add(
      new Cesium.ParticleSystem({
        image: "smoke.png",
        startColor: Cesium.Color.fromCssColorString('rgba(11,199,255,0.84)'),
        endColor: Cesium.Color.WHITE.withAlpha(0.0),
        startScale: viewModel.startScale,
        endScale: viewModel.endScale,
        minimumParticleLife: viewModel.minimumParticleLife,
        maximumParticleLife: viewModel.maximumParticleLife,
        minimumSpeed: viewModel.minimumSpeed,
        maximumSpeed: viewModel.maximumSpeed,
        imageSize: new Cesium.Cartesian2(
            viewModel.particleSize,
            viewModel.particleSize
        ),
        emissionRate: viewModel.emissionRate,
        lifetime: 16.0,
        emitter: new Cesium.ConeEmitter(Cesium.Math.toRadians(5.0)),
        emitterModelMatrix: computeEmitterModelMatrix(),
        updateCallback: applyGravity,
      })
  );

  viewer.scene.preUpdate.addEventListener(function (scene, time) {
    particleSystem.modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(120, 33, 10));

    // Account for any changes to the emitter model matrix.
    particleSystem.emitterModelMatrix = computeEmitterModelMatrix();
  });
  const param = {
    "longitude": 119.99894565,
    "latitude": 32.99929378,
    "height": 66.9584,
    "heading": 57.007,
    "pitch": -28.3078,
    "roll": 360,
    "cartersian": {"x": -2677217.8252257775, "y": 4637236.089027228, "z": 3453933.1816930654}
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
