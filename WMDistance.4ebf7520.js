import{d as g,u as v,o as h,c as M,_ as x}from"./index.2ad12903.js";import{C}from"./cesiumUtils.efa84583.js";const I={class:"mm-container"},e=window.Cesium,y=g({__name:"WMDistance",setup(T,{expose:m}){v(),new C({viewer:window.viewer});const c=()=>{!window.window.viewer||window.viewer.scene.primitives.removeAll()},u=async()=>{if(!window.viewer)return;c();const t=`
      // Color tiles by distance to the camera
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
      {
          material.diffuse = vec3(0.0, 0.0, 1.0);
          material.diffuse.g = -fsInput.attributes.positionEC.z / 1.0e4 * 2.;
      }
      `,i=new e.Cesium3DTileset({url:e.IonResource.fromAssetId(75343),customShader:new e.CustomShader({lightingModel:e.LightingModel.UNLIT,fragmentShaderText:t})});window.viewer.scene.primitives.add(i);const r=e.Cartesian3.fromDegrees(-74.01881302800248,40.69114333714821,753),o=new e.HeadingPitchRoll.fromDegrees(21.27879878293835,-21.34390550872461,.0716951918898415);window.viewer.scene.camera.setView({destination:r,orientation:o,endTransform:e.Matrix4.IDENTITY});const a=f(new e.Cartesian3(0,0,0),new e.Cartesian3(100,0,500));i.tileVisible.addEventListener(w=>{for(var d=w.content,_=d.featuresLength,s=0;s<_;s+=1){let l=d.getFeature(s);const p=l.getProperty("Height");let n=l.content._model;p>300&&(n.modelMatrix=e.Matrix4.multiply(n.modelMatrix,a,n.modelMatrix),n._customShader.fragmentShaderText=`
          // Color tiles by distance to the camera
          void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
          {
              material.diffuse = vec3(1.0, 0.0, 0.0);
              material.diffuse.g = -fsInput.attributes.positionEC.z / 1.0e4 * 2.;
          }
          `,n._shouldRegenerateShaders=!0)}})},f=(t,i)=>{const r=e.Transforms.eastNorthUpToFixedFrame(t),o=i,a=new e.Cartesian3(0,0,0);return e.Matrix4.multiplyByPoint(r,o,a),e.Matrix4.fromTranslation(e.Cartesian3.subtract(a,t,new e.Cartesian3))};return u(),m({clear:c}),(t,i)=>(h(),M("div",I))}});const D=x(y,[["__scopeId","data-v-689ddbcc"]]);export{D as default};
