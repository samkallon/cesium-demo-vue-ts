import{d as u,u as w,o as p,c as _,_ as f}from"./index.78dd451b.js";import{C as v}from"./cesiumUtils.efa84583.js";const M={class:"mm-container"},e=window.Cesium,h=u({__name:"WMDistance",setup(x,{expose:d}){w(),new v({viewer:window.viewer});const c=()=>{!window.window.viewer||window.viewer.scene.primitives.removeAll()};return(async()=>{if(!window.viewer)return;c();const n=new e.Cesium3DTileset({url:"http://124.70.11.35/fc-house/tileset.json"});window.viewer.scene.primitives.add(n),window.viewer.flyTo(n);const a=e.Matrix4.fromRotationTranslation(e.Matrix3.fromRotationX(e.Math.toRadians(10)));new e.ScreenSpaceEventHandler(window.viewer.scene.canvas).setInputAction(function(r){let o=r.position;var s=window.viewer.scene.pick(o);let t=s.content._model;t.modelMatrix=e.Matrix4.multiply(t.modelMatrix,a,t.modelMatrix)},e.ScreenSpaceEventType.LEFT_CLICK),n.tileVisible.addEventListener(r=>{for(var o=r.content,s=o.featuresLength,t=0;t<s;t+=1){let l=o.getFeature(t);const m=l.getProperty("Height");let i=l.content._model;m>300&&(i.modelMatrix=e.Matrix4.multiply(i.modelMatrix,a,i.modelMatrix),i._customShader.fragmentShaderText=`
          // Color tiles by distance to the camera
          void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
          {
              material.diffuse = vec3(1.0, 0.0, 0.0);
              material.diffuse.g = -fsInput.attributes.positionEC.z / 1.0e4 * 2.;
          }
          `,i._shouldRegenerateShaders=!0)}})})(),d({clear:c}),(n,a)=>(p(),_("div",M))}});const E=f(h,[["__scopeId","data-v-6e6a8968"]]);export{E as default};
