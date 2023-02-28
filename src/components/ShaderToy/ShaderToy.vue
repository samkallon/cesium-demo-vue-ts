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
}
const init = () => {
  if (!viewer) return
  clear()
  message.info('数据加载中!')
  const pointList = [
    {
      "longitude": 2.1062620701276042,
      "latitude": 0.546721644563287,
      "height": 7.995518221652699
    },
    {
      "longitude": 2.1062490076441174,
      "latitude": 0.546706115011185,
      "height": 8.001359856988994
    },
    {
      "longitude": 2.1062434828642616,
      "latitude": 0.546684978685106,
      "height": 7.995644627565386
    },
    {
      "longitude": 2.106250521714073,
      "latitude": 0.5466547848477626,
      "height": 8.00310781276061
    },
    {
      "longitude": 2.106230423786619,
      "latitude": 0.5466465878971495,
      "height": 8.002182259574052
    },
    {
      "longitude": 2.1062319327849757,
      "latitude": 0.5466349417316715,
      "height": 8.003818925223515
    },
    {
      "longitude": 2.1062374637095953,
      "latitude": 0.5466163943582998,
      "height": 8.03622025419552
    },
    {
      "longitude": 2.1062872358115556,
      "latitude": 0.5465974202485588,
      "height": 8.838584640408591
    },
    {
      "longitude": 2.1062642324769163,
      "latitude": 0.5465702707488097,
      "height": 11.343846009574232
    },
    {
      "longitude": 2.106277177559484,
      "latitude": 0.5465236666954383,
      "height": 8.373569884180709
    },
    {
      "longitude": 2.106277726724487,
      "latitude": 0.5464472076753544,
      "height": 7.543681825361595
    },
    {
      "longitude": 2.1062826518690754,
      "latitude": 0.5464206627020793,
      "height": 7.53801450286331
    },
    {
      "longitude": 2.1062580233987847,
      "latitude": 0.5464173685100093,
      "height": 17.822017931263193
    },
    {
      "longitude": 2.1062598461095945,
      "latitude": 0.5464017675670739,
      "height": 7.550978639457115
    },
    {
      "longitude": 2.1062421144288184,
      "latitude": 0.5463840639295755,
      "height": 9.987836242972373
    },
    {
      "longitude": 2.1062496757694684,
      "latitude": 0.5463690599135143,
      "height": 7.073108350921812
    },
    {
      "longitude": 2.1062934373514155,
      "latitude": 0.5463674084265577,
      "height": 7.56011214018234
    },
    {
      "longitude": 2.10631684509339,
      "latitude": 0.5463753175777318,
      "height": 7.5610873990568095
    },
    {
      "longitude": 2.1063598966596047,
      "latitude": 0.5463729244509468,
      "height": 7.582717292639772
    },
    {
      "longitude": 2.106403797977494,
      "latitude": 0.5463725860529461,
      "height": 7.584523321214339
    },
    {
      "longitude": 2.106429057319793,
      "latitude": 0.5463809202208978,
      "height": 7.579116699016599
    },
    {
      "longitude": 2.106454968117248,
      "latitude": 0.546369429932468,
      "height": 7.592128086947539
    },
    {
      "longitude": 2.1065025063413207,
      "latitude": 0.5463760965848969,
      "height": 7.607323467944809
    },
    {
      "longitude": 2.10653775181678,
      "latitude": 0.5464026378669868,
      "height": 7.624874024661941
    },
    {
      "longitude": 2.1065764702910443,
      "latitude": 0.5463980620392106,
      "height": 7.641191261894836
    },
    {
      "longitude": 2.106594354649676,
      "latitude": 0.5463795562360878,
      "height": 7.637728170977547
    },
    {
      "longitude": 2.1065866657400996,
      "latitude": 0.5463509316795951,
      "height": 7.646588005769031
    },
    {
      "longitude": 2.106617253145736,
      "latitude": 0.5463336438277276,
      "height": 7.955285600151329
    },
    {
      "longitude": 2.106669502191231,
      "latitude": 0.5463240843441537,
      "height": 7.664317405963897
    },
    {
      "longitude": 2.1067084291106184,
      "latitude": 0.5463132971082825,
      "height": 9.158310425142249
    },
    {
      "longitude": 2.1067762295802606,
      "latitude": 0.5463213663620893,
      "height": 12.842765682443746
    },
    {
      "longitude": 2.1067956658561453,
      "latitude": 0.5463215759277888,
      "height": 14.929496950416418
    },
    {
      "longitude": 2.106823593748781,
      "latitude": 0.5463551038458163,
      "height": 8.574602944478142
    },
    {
      "longitude": 2.1068191975540196,
      "latitude": 0.5463764062902823,
      "height": 9.768464599462162
    },
    {
      "longitude": 2.1068007748489355,
      "latitude": 0.5463826079115675,
      "height": 7.707642823372926
    },
    {
      "longitude": 2.106802279462026,
      "latitude": 0.5464094994908457,
      "height": 12.159453366842508
    },
    {
      "longitude": 2.10679155720928,
      "latitude": 0.5464630922982245,
      "height": 8.648055837110745
    },
    {
      "longitude": 2.1067905812809116,
      "latitude": 0.5465157125284849,
      "height": 7.656844269262984
    },
    {
      "longitude": 2.106819282248326,
      "latitude": 0.5465270633262507,
      "height": 7.68994951814912
    },
    {
      "longitude": 2.1068768006294425,
      "latitude": 0.5465231532556114,
      "height": 13.036261593602719
    },
    {
      "longitude": 2.1068686843553683,
      "latitude": 0.5465367610328031,
      "height": 16.3629366169265
    },
    {
      "longitude": 2.1068132291945454,
      "latitude": 0.5465539307205138,
      "height": 9.518716447042769
    },
    {
      "longitude": 2.1067562184113955,
      "latitude": 0.5465754060148078,
      "height": 7.991731570499541
    },
    {
      "longitude": 2.106692926461611,
      "latitude": 0.5466313381718763,
      "height": 13.625187857682398
    },
    {
      "longitude": 2.1066667720665797,
      "latitude": 0.5466761708966694,
      "height": 13.436594971445242
    },
    {
      "longitude": 2.106612755919966,
      "latitude": 0.5466801931847152,
      "height": 11.851013996906332
    },
    {
      "longitude": 2.1065524346555797,
      "latitude": 0.5466679618214583,
      "height": 7.6038203866436715
    },
    {
      "longitude": 2.106548307281476,
      "latitude": 0.5467168395813848,
      "height": 17.83160328288637
    },
    {
      "longitude": 2.106472978376953,
      "latitude": 0.5467479916309212,
      "height": 18.811393914000384
    },
    {
      "longitude": 2.10639416280127,
      "latitude": 0.5467516711842298,
      "height": 7.69610165086814
    },
    {
      "longitude": 2.1063683521265784,
      "latitude": 0.5467567638243167,
      "height": 7.662227762788265
    },
    {
      "longitude": 2.106362036767062,
      "latitude": 0.5467802772392484,
      "height": 14.327750808005511
    },
    {
      "longitude": 2.1063345973396705,
      "latitude": 0.5467913615562383,
      "height": 9.147668603887828
    },
    {
      "longitude": 2.1063078839383733,
      "latitude": 0.5467934200418613,
      "height": 12.360767344032329
    },
    {
      "longitude": 2.1062873475213437,
      "latitude": 0.546765898367516,
      "height": 17.919455656290346
    },
    {
      "longitude": 2.1062879238490724,
      "latitude": 0.5467400577718533,
      "height": 7.52727417503945
    }
  ]

  const PolygonHierarchy = []
  pointList.map(e=>{
    PolygonHierarchy.push(Cesium.Math.toDegrees(e.longitude))
    PolygonHierarchy.push(Cesium.Math.toDegrees(e.latitude))
    PolygonHierarchy.push(e.height + 1000)
  })
  var box = new Cesium.PolygonGeometry({
    vertexFormat : Cesium.VertexFormat.POSITION_NORMAL_AND_ST,
    polygonHierarchy:new Cesium.PolygonHierarchy(
        Cesium.Cartesian3.fromDegreesArrayHeights(PolygonHierarchy)
    ),
    height:10
  });
  const geometry = Cesium.PolygonGeometry.createGeometry(box);

  let inst = new Cesium.GeometryInstance({
    geometry: geometry,
  });

  // 自定义材质
  let aper = new Cesium.MaterialAppearance({
    material: new Cesium.Material({
      fabric: {
        uniforms: {
          iTime: 0,
        },
        source:`
        const int NUM_STEPS = 8;
      const float PI     = 3.141592;
      const float EPSILON  = 1e-3;
      //#define EPSILON_NRM (0.1 / iResolution.x)
      #define EPSILON_NRM (0.1 / 200.0)
      // sea
      const int ITER_GEOMETRY = 3;
      const int ITER_FRAGMENT = 5;
      const float SEA_HEIGHT = 0.6;
      const float SEA_CHOPPY = 4.0;
      const float SEA_SPEED = 1.8;
      const float SEA_FREQ = 0.16;
      const vec3 SEA_BASE = vec3(0.1,0.19,0.22);
      const vec3 SEA_WATER_COLOR = vec3(0.8,0.9,0.6);
      //#define SEA_TIME (1.0 + iTime * SEA_SPEED)
      const mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);
      // math
      mat3 fromEuler(vec3 ang) {
        vec2 a1 = vec2(sin(ang.x),cos(ang.x));
        vec2 a2 = vec2(sin(ang.y),cos(ang.y));
        vec2 a3 = vec2(sin(ang.z),cos(ang.z));
        mat3 m;
        m[0] = vec3(a1.y*a3.y+a1.x*a2.x*a3.x,a1.y*a2.x*a3.x+a3.y*a1.x,-a2.y*a3.x);
        m[1] = vec3(-a2.y*a1.x,a1.y*a2.y,a2.x);
        m[2] = vec3(a3.y*a1.x*a2.x+a1.y*a3.x,a1.x*a3.x-a1.y*a3.y*a2.x,a2.y*a3.y);
        return m;
      }
      float hash( vec2 p ) {
        float h = dot(p,vec2(127.1,311.7));
        return fract(sin(h)*43758.5453123);
      }
      float noise( in vec2 p ) {
        vec2 i = floor( p );
        vec2 f = fract( p );
        vec2 u = f*f*(3.0-2.0*f);
        return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ),
                 hash( i + vec2(1.0,0.0) ), u.x),
              mix( hash( i + vec2(0.0,1.0) ),
                 hash( i + vec2(1.0,1.0) ), u.x), u.y);
      }
      // lighting
      float diffuse(vec3 n,vec3 l,float p) {
        return pow(dot(n,l) * 0.4 + 0.6,p);
      }
      float specular(vec3 n,vec3 l,vec3 e,float s) {
        float nrm = (s + 8.0) / (PI * 8.0);
        return pow(max(dot(reflect(e,n),l),0.0),s) * nrm;
      }
      // sky
      vec3 getSkyColor(vec3 e) {
        e.y = max(e.y,0.0);
        return vec3(pow(1.0-e.y,2.0), 1.0-e.y, 0.6+(1.0-e.y)*0.4);
      }
      // sea
      float sea_octave(vec2 uv, float choppy) {
        uv += noise(uv);
        vec2 wv = 1.0-abs(sin(uv));
        vec2 swv = abs(cos(uv));
        wv = mix(wv,swv,wv);
        return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
      }
      float map(vec3 p) {
        float freq = SEA_FREQ;
        float amp = SEA_HEIGHT;
        float choppy = SEA_CHOPPY;
        vec2 uv = p.xz; uv.x *= 0.75;
        float d, h = 0.0;
        float SEA_TIME = 1.0 + iTime * SEA_SPEED;
        for(int i = 0; i < ITER_GEOMETRY; i++) {
          d = sea_octave((uv+SEA_TIME)*freq,choppy);
          d += sea_octave((uv-SEA_TIME)*freq,choppy);
          h += d * amp;
          uv *= octave_m; freq *= 1.9; amp *= 0.22;
          choppy = mix(choppy,1.0,0.2);
        }
        return p.y - h;
      }
      float map_detailed(vec3 p) {
        float freq = SEA_FREQ;
        float amp = SEA_HEIGHT;
        float choppy = SEA_CHOPPY;
        vec2 uv = p.xz; uv.x *= 0.75;
        float SEA_TIME = 1.0 + iTime * SEA_SPEED;
        float d, h = 0.0;
        for(int i = 0; i < ITER_FRAGMENT; i++) {
          d = sea_octave((uv+SEA_TIME)*freq,choppy);
          d += sea_octave((uv-SEA_TIME)*freq,choppy);
          h += d * amp;
          uv *= octave_m; freq *= 1.9; amp *= 0.22;
          choppy = mix(choppy,1.0,0.2);
        }
        return p.y - h;
      }
      vec3 getSeaColor(vec3 p, vec3 n, vec3 l, vec3 eye, vec3 dist) {
        float fresnel = clamp(1.0 - dot(n,-eye), 0.0, 1.0);
        fresnel = pow(fresnel,3.0) * 0.65;
        vec3 reflected = getSkyColor(reflect(eye,n));
        vec3 refracted = SEA_BASE + diffuse(n,l,80.0) * SEA_WATER_COLOR * 0.12;
        vec3 color = mix(refracted,reflected,fresnel);
        float atten = max(1.0 - dot(dist,dist) * 0.001, 0.0);
        color += SEA_WATER_COLOR * (p.y - SEA_HEIGHT) * 0.18 * atten;
        color += vec3(specular(n,l,eye,60.0));
        return color;
      }
      // tracing
      vec3 getNormal(vec3 p, float eps) {
        vec3 n;
        n.y = map_detailed(p);
        n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
        n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
        n.y = eps;
        return normalize(n);
      }
      float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {
        float tm = 0.0;
        float tx = 1000.0;
        float hx = map(ori + dir * tx);
        if(hx > 0.0) return tx;
        float hm = map(ori + dir * tm);
        float tmid = 0.0;
        for(int i = 0; i < NUM_STEPS; i++) {
          tmid = mix(tm,tx, hm/(hm-hx));
          p = ori + dir * tmid;
          float hmid = map(p);
          if(hmid < 0.0) {
            tx = tmid;
            hx = hmid;
          } else {
            tm = tmid;
            hm = hmid;
          }
        }
        return tmid;
      }
           vec4 czm_getMaterial(vec2 vUv)
           {
            vec2 uv = vUv;
            uv = vUv * 2.0 - 1.0;
            float time = iTime * 0.3 + 0.0*0.01;
            // ray
            vec3 ang = vec3(0, 1.2, 0.0);
              vec3 ori = vec3(0.0,3.5,0);
            vec3 dir = normalize(vec3(uv.xy,-2.0)); dir.z += length(uv) * 0.15;
            dir = normalize(dir) * fromEuler(ang);
            // tracing
            vec3 p;
            heightMapTracing(ori,dir,p);
            vec3 dist = p - ori;
            vec3 n = getNormal(p, dot(dist,dist) * EPSILON_NRM);
            vec3 light = normalize(vec3(0.0,1.0,0.8));
            // color
            vec3 color = mix(
              getSkyColor(dir),
              getSeaColor(p,n,light,dir,dist),
              pow(smoothstep(0.0,-0.05,dir.y),0.3));
               return vec4( pow(color,vec3(0.75)), 1.0 );
           }
        `,
      }
    }),
    translucent: true,
    vertexShaderSource: `
        attribute vec3 position3DHigh;
        attribute vec3 position3DLow;
        attribute float batchId;
        attribute vec2 st;
        attribute vec3 normal;
        varying vec2 v_st;
        varying vec3 v_positionEC;
        varying vec3 v_normalEC;
        void main() {
            v_st = st;
            vec4 p = czm_computePosition();
            v_positionEC = (czm_modelViewRelativeToEye * p).xyz;      // position in eye coordinates
            v_normalEC = czm_normal * normal;                         // normal in eye coordinates
            gl_Position = czm_modelViewProjectionRelativeToEye * p;
        }
                    `,
    fragmentShaderSource: `
      varying vec2 v_st;
      varying vec3 v_positionEC;
      varying vec3 v_normalEC;
      void main()  {
        vec3 positionToEyeEC = -v_positionEC;
        vec3 normalEC = normalize(v_normalEC);
        czm_materialInput materialInput;
        materialInput.normalEC = normalEC;
        materialInput.positionToEyeEC = positionToEyeEC;
        materialInput.st = v_st;
        vec4 color = czm_getMaterial(v_st);
        gl_FragColor = color;
      }
                `,
  });
  viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances: inst,
    appearance: aper,
    asynchronous : false
  }));

  viewer.camera.flyTo({destination:Cesium.Cartesian3.fromDegrees(120.69272763, 31.30999739,7000)})

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
