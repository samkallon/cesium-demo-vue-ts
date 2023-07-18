import{d as n,u as f,o as _,c as r,_ as l}from"./index.78dd451b.js";import{C as c}from"./cesiumUtils.efa84583.js";const d={class:"mm-container"},a=window.Cesium,m=n({__name:"WhiteModelBatchSingle",setup(h,{expose:s}){f();const e=window.viewer;new c({viewer:e});const i=()=>{!e||e.scene.primitives.removeAll()};return(async()=>{if(!e)return;i();const u=`
                    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
                        float _baseHeight = 0.0; // \u7269\u4F53\u7684\u57FA\u7840\u9AD8\u5EA6\uFF0C\u9700\u8981\u4FEE\u6539\u6210\u4E00\u4E2A\u5408\u9002\u7684\u5EFA\u7B51\u57FA\u7840\u9AD8\u5EA6
                        float _heightRange = 60.0; // \u9AD8\u4EAE\u7684\u8303\u56F4(_baseHeight ~ _baseHeight + _      heightRange) \u9ED8\u8BA4\u662F 0-60\u7C73
                        float _glowRange = 300.0; // \u5149\u73AF\u7684\u79FB\u52A8\u8303\u56F4(\u9AD8\u5EA6)
                        float vtxf_height = fsInput.attributes.positionMC.z-_baseHeight;
                        float vtxf_a11 = fract(czm_frameNumber / 120.0) * 3.14159265 * 2.0;
                        float vtxf_a12 = vtxf_height / _heightRange + sin(vtxf_a11) * 0.1;
                        material.diffuse*= vec3(vtxf_a12, vtxf_a12, vtxf_a12);
                        float vtxf_a13 = fract(czm_frameNumber / 360.0);
                        float vtxf_h = clamp(vtxf_height / _glowRange, 0.0, 1.0);
                        vtxf_a13 = abs(vtxf_a13 - 0.5) * 2.0;
                        float vtxf_diff = step(0.005, abs(vtxf_h - vtxf_a13));
                        material.diffuse += material.diffuse * (1.0 - vtxf_diff);
                    }
                    `,t=new a.Cesium3DTileset({url:"https://lab.earthsdk.com/model/702aa950d03c11e99f7ddd77cbe22fea/tileset.json",customShader:new a.CustomShader({fragmentShaderText:u})});e.scene.primitives.add(t),t.style=new a.Cesium3DTileStyle({color:{conditions:[["true","color('rgb(51, 153, 255)',1)"]]}}),t.tileLoad.addEventListener(o=>{o.content}),e.flyTo(t),window.nytileset=t})(),s({clear:i}),(u,t)=>(_(),r("div",d))}});const p=l(m,[["__scopeId","data-v-71bf7a5f"]]);export{p as default};
