
export class Draw {
  private tempShapePoints: any[];
  private viewer: any;
  private Cesium: any;
  private type: any;
  private drawStatus: any;
  private entityList: any[];
  constructor(options: any) {
    const { type, color, viewer, Cesium } = options;
    this.tempShapePoints = []
    this.entityList = []
    this.viewer = viewer
    this.Cesium = Cesium
    this.drawStatus = 'stop'
    this.type = type
    this._init(options);
  }

  _init(options: any){
    this.drawStatus = 'start'
    // 更改鼠标样式
    document.body.style.cursor = 'crosshair'
    const {viewer,Cesium} = options
    if (!viewer.scene.pickPositionSupported) {
      window.alert("This browser does not support pickPosition.");
    }

    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    );
    function createPoint(worldPosition: any,that:any) {
      const point = viewer.entities.add({
        position: worldPosition,
        point: {
          color: Cesium.Color.WHITE,
          pixelSize: 5,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        },
      });
      that.entityList.push(point)
      return point;
    }
    let drawingMode = this.type;
    function drawShape(positionData: any) {
      let shape;
      if (drawingMode === "line") {
        shape = viewer.entities.add({
          polyline: {
            positions: positionData,
            clampToGround: true,
            width: 3,
          },
        });
      } else if (drawingMode === "polygon") {
        shape = viewer.entities.add({
          polygon: {
            hierarchy: positionData,
            material: new Cesium.ColorMaterialProperty(
              Cesium.Color.WHITE.withAlpha(0.5)
            ),
          },
        });
      }
      return shape;
    }
    let activeShapePoints: any = [];
    let activeShape: any;
    let floatingPoint: any;

// Redraw the shape so it's not dynamic and remove the dynamic shape.
    function terminateShape(that:any) {
      // 更改鼠标样式
      document.body.style.cursor = 'auto'
      activeShapePoints.pop();
      that.entityList.push(drawShape(activeShapePoints))
      viewer.entities.remove(floatingPoint);
      viewer.entities.remove(activeShape);
      floatingPoint = undefined;
      activeShape = undefined;
      activeShapePoints = [];
    }

    const handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
    handler.setInputAction( (event: any) => {
      if (this.drawStatus === 'stop'){
        return
      }
      // We use `viewer.scene.pickPosition` here instead of `viewer.camera.pickEllipsoid` so that
      // we get the correct point when mousing over terrain.
      const earthPosition = viewer.scene.pickPosition(event.position);
      // `earthPosition` will be undefined if our mouse is not over the globe.
      if (Cesium.defined(earthPosition)) {
        if (activeShapePoints.length === 0) {
          floatingPoint = createPoint(earthPosition,this);
          activeShapePoints.push(earthPosition);
          const dynamicPositions = new Cesium.CallbackProperty(function () {
            if (drawingMode === "polygon") {
              return new Cesium.PolygonHierarchy(activeShapePoints);
            }
            return activeShapePoints;
          }, false);
          activeShape = drawShape(dynamicPositions);
        }
        activeShapePoints.push(earthPosition);
        createPoint(earthPosition,this);
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    handler.setInputAction((event: any) => {
      if (this.drawStatus === 'stop'){
        return
      }
      if (Cesium.defined(floatingPoint)) {
        const newPosition = viewer.scene.pickPosition(event.endPosition);
        if (Cesium.defined(newPosition)) {
          floatingPoint.position.setValue(newPosition);
          activeShapePoints.pop();
          activeShapePoints.push(newPosition);
        }
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    handler.setInputAction( (event: any) => {
      if (this.drawStatus === 'stop'){
        return
      }
      let actualPoints = JSON.parse(JSON.stringify(activeShapePoints))
      actualPoints.pop()
      this.tempShapePoints = actualPoints
      terminateShape(this);
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  stopDraw(){
    this.drawStatus = 'stop'
    this.entityList.forEach(e=>{
      this.viewer.entities.remove(e);
    })
  }
}



