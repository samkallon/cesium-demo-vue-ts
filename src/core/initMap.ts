import Cesium, {ArcGisMapServerImageryProvider, Viewer} from "cesium";
import {message} from "ant-design-vue";

const initMap = (id)=>{
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3YzBkMDU4Zi00NjVhLTQ2YzgtODgxMS00ZDAzNzVmYjQyYTgiLCJpZCI6NDEzMTIsImlhdCI6MTYwOTk4ODQ2OX0.qtLMhWmf2R-psUzK2Piqh-qXtibvXhcX-vR1tjWGF6E'
  const options = {
    animation: true, // 动画组件
    timeline: true, // 时间轴组件
    geocoder: true, //右上角地理空间搜索
    homeButton: true, // 主页按钮
    scene3DOnly: true, // 仅3d模式
    baseLayerPicker: true, // 底图选择器 右上角
    navigationHelpButton: false, // 右上角用户帮助
    fullscreenButton: false, // 全屏按钮
    infoBox: true,
    imageryProvider: new ArcGisMapServerImageryProvider({
      url: `https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer`
    }),
    msaaSamples: 2,
    selectionIndicator: false,
    // terrainProvider: Cesium.createWorldTerrain({
    //   requestWaterMask: true,
    //   requestVertexNormals: true,
    // }),
    resolutionScale: 0.8,//默认值为1.0 调整画面精细度 越低 帧率越高
    useDefaultRenderLoop: true, //关掉自动渲染 为了和three js 融合
  }
  const viewer = new Viewer(id || 'cesiumContainer', options)
  viewer.scene.globe.depthTestAgainstTerrain = true;
  viewer.scene.debugShowFramesPerSecond = true;

  window.viewer = viewer

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
  window.pickPointArray = []
  window.pickEntityList = []
  handler.setInputAction((event: any) => {
    // 按下了ctrl健 右键拾取点并添加到数组中,window下的全局变量
    message.info('拾取成功')
    const earthPosition = viewer.scene.pickPosition(event.position);
    window.pickPointArray.push(Cesium.Cartographic.fromCartesian(earthPosition))
    window.pickEntityList.push(
      viewer.entities.add({
        position: earthPosition,
        point: {
          pixelSize: 20,
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        }
      }))
  }, Cesium.ScreenSpaceEventType.RIGHT_CLICK, Cesium.KeyboardEventModifier.CTRL)
  handler.setInputAction(() => {
    // ctrl + 中键点击清空,window下的全局变量
    message.info('清空成功')
    window.pickPointArray = []
    window.pickEntityList.forEach(e => {
      viewer.entities.remove(e)
    })
  }, Cesium.ScreenSpaceEventType.MIDDLE_CLICK, Cesium.KeyboardEventModifier.CTRL)


  // 添加剪影效果
  const stages = viewer.scene.postProcessStages;
  const silhouette = stages.add(
    Cesium.PostProcessStageLibrary.createSilhouetteStage()
  );
  silhouette.uniforms.color = Cesium.Color.LIME;
  silhouette.enabled = true
  let handlerSilhouette = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
  handlerSilhouette.setInputAction(function (movement) {
    const pickedObject = viewer.scene.pick(movement.endPosition);
    if (Cesium.defined(pickedObject)) {
      silhouette.selected = [pickedObject.primitive];
    } else {
      silhouette.selected = [];
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

export default initMap
