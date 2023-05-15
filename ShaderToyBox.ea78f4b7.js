import{d as _,u as d,o as f,c as x,m as y,_ as C}from"./index.2ad12903.js";const w={class:"mm-container"},e=window.Cesium,g=_({__name:"ShaderToyBox",setup(T,{expose:s}){const r=d().$state.cesiumViewer,t=()=>{!r||r.scene.primitives.removeAll()};return(()=>{if(!r)return;t(),y.info("\u6570\u636E\u52A0\u8F7D\u4E2D!");var o=new e.BoxGeometry({vertexFormat:e.VertexFormat.POSITION_NORMAL_AND_ST,maximum:new e.Cartesian3(24e4,24e4,24e4),minimum:new e.Cartesian3(-24e4,-24e4,-24e4)}),a=new e.BoxGeometry({vertexFormat:e.VertexFormat.POSITION_NORMAL_AND_ST,maximum:new e.Cartesian3(24e4,24e4,24e4),minimum:new e.Cartesian3(-24e4,-24e4,-24e4)}),m=e.BoxGeometry.createGeometry(o),l=e.BoxGeometry.createGeometry(a);let v=new e.GeometryInstance({geometry:m}),p=new e.GeometryInstance({geometry:l}),n=new e.MaterialAppearance({material:new e.Material({fabric:{uniforms:{iTime:0},source:`
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
        `}}),translucent:!0,fragmentShaderSource:`
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
                `}),i=e.Transforms.eastNorthUpToFixedFrame(e.Cartesian3.fromDegrees(110,40,25e4));r.scene.primitives.add(new e.Primitive({geometryInstances:v,appearance:n,modelMatrix:i,asynchronous:!1})),r.scene.primitives.add(new e.Primitive({geometryInstances:p,appearance:new e.MaterialAppearance({material:new e.Material({fabric:{type:"color",uniforms:{color:new e.Color.fromCssColorString("#494444")}}})}),modelMatrix:i,translucent:!1,asynchronous:!1})),r.camera.flyToBoundingSphere(new e.BoundingSphere(e.Cartesian3.fromDegrees(110,40,10),95e4),{duration:.1});function c(u){n.material.uniforms.iTime=u/1e3,requestAnimationFrame(c)}c()})(),s({clear:t}),(o,a)=>(f(),x("div",w))}});const I=C(g,[["__scopeId","data-v-e7448e73"]]);export{I as default};
