import{d,u as f,o as l,c as p,_}from"./index.2ad12903.js";const v={class:"mm-container"},e=window.Cesium,h=d({__name:"Noise",setup(x,{expose:i}){const t=f().$state.cesiumViewer,s=()=>{!t||t.scene.primitives.removeAll()};return(async()=>{if(!t)return;s();let o=new e.CustomShader({uniforms:{u_time:{value:0,type:e.UniformType.FLOAT}},fragmentShaderText:`
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
                `}),r=new e.HeadingPitchRoll(0,0,0),a=e.Cartesian3.fromDegrees(110,40,1400);const c=e.Transforms.headingPitchRollToFixedFrame(a,r),m=await e.IonResource.fromAssetId(1533514);t.scene.primitives.add(e.Model.fromGltf({url:m,customShader:o,modelMatrix:c})).readyPromise.then(n=>{t.camera.flyToBoundingSphere(n.boundingSphere,{duration:.5})});const u=performance.now();t.scene.postUpdate.addEventListener(function(){const n=(performance.now()-u)/1e3;o.setUniform("u_time",n)})})(),i({clear:s}),(o,r)=>(l(),p("div",v))}});const C=_(h,[["__scopeId","data-v-6194359e"]]);export{C as default};
