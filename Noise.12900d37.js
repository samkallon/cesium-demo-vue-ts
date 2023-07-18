import{d as u,u as f,o as l,c as p,_}from"./index.78dd451b.js";const v={class:"mm-container"},e=window.Cesium,h=u({__name:"Noise",setup(x,{expose:i}){f();const o=window.viewer,s=()=>{!o||o.scene.primitives.removeAll()};return(async()=>{if(!o)return;s();let t=new e.CustomShader({uniforms:{u_time:{value:0,type:e.UniformType.FLOAT}},fragmentShaderText:`
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
                `}),r=new e.HeadingPitchRoll(0,0,0),a=e.Cartesian3.fromDegrees(110,40,1400);const c=e.Transforms.headingPitchRollToFixedFrame(a,r),m=await e.IonResource.fromAssetId(1533514);o.scene.primitives.add(e.Model.fromGltf({url:m,customShader:t,modelMatrix:c})).readyPromise.then(n=>{o.camera.flyToBoundingSphere(n.boundingSphere,{duration:.5})});const d=performance.now();o.scene.postUpdate.addEventListener(function(){const n=(performance.now()-d)/1e3;t.setUniform("u_time",n)})})(),i({clear:s}),(t,r)=>(l(),p("div",v))}});const w=_(h,[["__scopeId","data-v-8156f734"]]);export{w as default};
