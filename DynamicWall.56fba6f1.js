import{d as s,u as c,o as u,c as _,_ as p}from"./index.78dd451b.js";import{C as f}from"./cesiumUtils.efa84583.js";const C={class:"mm-container"},e=window.Cesium,d=s({__name:"DynamicWall",setup(v,{expose:n}){c();const a=window.viewer,o=new f({viewer:a}),r=()=>{!a||a.scene.primitives.removeAll()};return(async()=>{if(!a)return;r();let t=new e.Material({fabric:{uniforms:{},source:`
            czm_material czm_getMaterial(czm_materialInput materialInput)
            {
              czm_material material = czm_getDefaultMaterial(materialInput);
              material.diffuse = vec3(0.0,0.0,1.0);
              return material;
            }`}});window.customMaterial=t;let i=new e.MaterialAppearance({material:t,translucent:!0,fragmentShaderSource:`
    in vec3 v_positionEC;
    in vec3 v_normalEC;
    in vec2 v_st;

    void main()
    {
        vec3 positionToEyeEC = -v_positionEC;

        vec3 normalEC = normalize(v_normalEC);
    #ifdef FACE_FORWARD
        normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);
    #endif

        czm_materialInput materialInput;
        materialInput.normalEC = normalEC;
        materialInput.positionToEyeEC = positionToEyeEC;
        materialInput.st = v_st;
        czm_material material = czm_getMaterial(materialInput);
        // \u76F8\u673A\u79BB\u5F97\u8FDC,green\u8D8A\u5927 \u79BB\u5F97\u8FD1\u662F\u672C\u6765\u7684\u989C\u8272
        material.diffuse.g = positionToEyeEC.z / 1.0e6 * 1.5;

    #ifdef FLAT
        out_FragColor = vec4(material.diffuse + material.emission, material.alpha);
    #else
        out_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);
    #endif
    }
    `});window.apertest=i;var m=new e.GeometryInstance({geometry:e.WallGeometry.fromConstantHeights({positions:e.Cartesian3.fromDegreesArray([97,43,107,43,107,40,97,40,97,43]),maximumHeight:1e5,vertexFormat:e.VertexFormat.POSITION_NORMAL_AND_ST})});a.scene.primitives.add(new e.Primitive({geometryInstances:[m],appearance:i}));const l={longitude:103.42029045,latitude:34.42842248,height:999000.4552,heading:351.3406,pitch:-50.2169,roll:2e-4,cartersian:{x:-1.4373224822493163e6,y:5893451215586636e-9,z:4060476666974406e-9}};o.flyByParams(l)})(),n({clear:r}),(t,i)=>(u(),_("div",C))}});const w=p(d,[["__scopeId","data-v-b77e5693"]]);export{w as default};
