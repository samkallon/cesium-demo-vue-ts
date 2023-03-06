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
const init = () => {
  if (!viewer) return
  clear()
  message.info('数据加载中!')
  var box = new Cesium.BoxGeometry({
    vertexFormat : Cesium.VertexFormat.POSITION_NORMAL_AND_ST,
    maximum : new Cesium.Cartesian3(240000.0, 240000.0, 240000.0),
    minimum : new Cesium.Cartesian3(-240000.0, -240000.0, -240000.0)
  });
  var boxMin = new Cesium.BoxGeometry({
    vertexFormat : Cesium.VertexFormat.POSITION_NORMAL_AND_ST,
    maximum : new Cesium.Cartesian3(240000.0, 240000.0, 240000.0),
    minimum : new Cesium.Cartesian3(-240000.0, -240000.0, -240000.0)
  });
  var geometry = Cesium.BoxGeometry.createGeometry(box);
  var geometryMin = Cesium.BoxGeometry.createGeometry(boxMin);

  let inst = new Cesium.GeometryInstance({
    geometry: geometry
  });
  let instMin = new Cesium.GeometryInstance({
    geometry: geometryMin
  });
  // 自定义材质
  let aper = new Cesium.MaterialAppearance({
    material: new Cesium.Material({
      fabric: {
        uniforms: {
          iTime: 0,
        },
        source:`
        vec3 palette(float d){
          return mix(vec3(0.2,0.7,0.9),vec3(1.,0.,1.),d);
        }

        vec2 rotate(vec2 p,float a){
          float c = cos(a);
            float s = sin(a);
            return p*mat2(c,s,-s,c);
        }

        float map(vec3 p){
            for( int i = 0; i<8; ++i){
                float t = iTime*0.1;
                p.xz =rotate(p.xz,t);
                p.xy =rotate(p.xy,t*1.89);
                p.xz = abs(p.xz);
                p.xz-=.5;
          }
          return dot(sign(p),p)/5.;
        }

        vec4 rm (vec3 ro, vec3 rd){
            float t = 0.;
            vec3 col = vec3(0.);
            float d;
            for(float i =0.; i<64.; i++){
            vec3 p = ro + rd*t;
                d = map(p)*.5;
                if(d<0.02){
                    break;
                }
                if(d>100.){
                  break;
                }
                //col+=vec3(0.6,0.8,0.8)/(400.*(d));
                col+=palette(length(p)*.1)/(abs(sin(iTime))*100.*(d));
                t+=d;
            }
            return vec4(col,1./(d*100.));
        }
         vec4 czm_getMaterial(vec2 vUv)
         {
          vec2 uv = vUv - vec2(0.5,0.5);
          vec3 ro = vec3(0.,0.,-50.);
          ro.xz = rotate(ro.xz,iTime);
          vec3 cf = normalize(-ro);
          vec3 cs = normalize(cross(cf,vec3(0.,1.,0.)));
          vec3 cu = normalize(cross(cf,cs));

          vec3 uuv = ro+cf*5. + uv.x*cs + uv.y*cu;

          vec3 rd = normalize(uuv-ro);

          vec4 col = rm(ro,rd);
          return col;
         }
        `,
      }
    }),
    translucent: true,
    fragmentShaderSource: `
      in vec2 v_st;
      in vec3 v_positionEC;
      in vec3 v_normalEC;
      void main()  {
        vec3 positionToEyeEC = -v_positionEC;
        vec3 normalEC = normalize(v_normalEC);
        czm_materialInput materialInput;
        materialInput.normalEC = normalEC;
        materialInput.positionToEyeEC = positionToEyeEC;
        materialInput.st = v_st;
        vec4 color = czm_getMaterial(v_st);
        out_FragColor = color;
      }
                `,
  });
  // let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
  //     Cesium.Cartesian3.fromDegrees(110, 40, 250000)
  // );
  let hpr = new Cesium.HeadingPitchRoll(0,0,0)
  let origin = Cesium.Cartesian3.fromDegrees(110, 40, 250000)
  const modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(origin,hpr)

  viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances: inst,
    appearance: aper,
    modelMatrix: modelMatrix,
    asynchronous : false
  }));

  viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances: instMin,
    appearance: new Cesium.MaterialAppearance({
      material:new Cesium.Material({
        fabric:{
          type:'color',
          uniforms:{
            color: new Cesium.Color.fromCssColorString('#494444')
          }
        }
      })
    }),
    modelMatrix: modelMatrix,
    translucent:false,
    asynchronous : false
  }));


  viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(
      Cesium.Cartesian3.fromDegrees(110, 40, 10), 950000,
  ),{
    duration: 0.1,
  });

  function renderLoop(timestamp:any){
    aper.material.uniforms.iTime = timestamp/1000;
    requestAnimationFrame(renderLoop);
  }

  renderLoop();

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
