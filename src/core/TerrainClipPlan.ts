import Cesium from 'cesium'
// @ts-ignore
import * as turf from 'turf'
import * as booleanClockwise from '@turf/boolean-clockwise'
import {message} from 'ant-design-vue'

function TerrainClipPlan(t: any, i: any) {
    // @ts-ignore
    this.viewer = t, this.options = i || {}, this._positions = i.positions, this._height = this.options.height || 0,
        // @ts-ignore
        this.bottomImg = i.bottomImg, this.wallImg = i.wallImg, this.splitNum = Cesium.defaultValue(i.splitNum, 50),
        // @ts-ignore
    this._positions && this._positions.length > 0 && this.updateData(this._positions)
}

Object.defineProperties(TerrainClipPlan.prototype, {
    show: {
        get: function () {
            return this._show
        },
        set: function (e) {
            this._show = e, this.viewer.scene.globe.clippingPlanes && (this.viewer.scene.globe.clippingPlanes.enabled = e), this._switchExcavate(e)
        }
    },

    height: {
        get: function () {
            return this._height
        },
        set: function (e) {
            this._height = e
        }
    }
})


TerrainClipPlan.prototype.updateData = function (pointList: any) {
    this.clear();
    // 对点做处理,如果不是逆时针 变为逆时针
    if (this.ifAntiClockwise(pointList)) {
        pointList.reverse()
    }
    var t = [],
        pointLength = pointList.length,
        a = new Cesium.Cartesian3,
        n = Cesium.Cartesian3.subtract(pointList[0], pointList[1], a);
    if (n.x > 0) this.excavateMinHeight = 9999;
    for (let i = 0; i < pointLength; ++i) {
        var nextPointIndex = (i + 1) % pointLength,
            u = Cesium.Cartographic.fromCartesian(pointList[i]),
            c = this.viewer.scene.globe.getHeight(u) || u.height;
        c < this.excavateMinHeight && (this.excavateMinHeight = c);

        var midpoint = Cesium.Cartesian3.add(pointList[i], pointList[nextPointIndex], new Cesium.Cartesian3());
        midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);

        var up = Cesium.Cartesian3.normalize(midpoint, new Cesium.Cartesian3());
        var right = Cesium.Cartesian3.subtract(pointList[nextPointIndex], midpoint, new Cesium.Cartesian3());
        right = Cesium.Cartesian3.normalize(right, right);

        var normal = Cesium.Cartesian3.cross(right, up, new Cesium.Cartesian3());
        normal = Cesium.Cartesian3.normalize(normal, normal);

        var originCenteredPlane = new Cesium.Plane(normal, 0.0);
        var distance = Cesium.Plane.getPointDistance(originCenteredPlane, midpoint);

        t.push(new Cesium.ClippingPlane(normal, distance));
    }
    this.viewer.scene.globe.clippingPlanes = new Cesium.ClippingPlaneCollection({
        planes: t,
        edgeWidth: 0,
        edgeColor: Cesium.Color.WHITE,
        enabled: true
    })
    if (window.tileset69380) {
        const clipTileset = new Cesium.ClippingPlaneCollection({
            planes: t,
            edgeWidth: 1,
            edgeColor: Cesium.Color.WHITE,
            modelMatrix: Cesium.Matrix4.inverse(
                Cesium.Transforms.eastNorthUpToFixedFrame(window.tileset69380.boundingSphere.center),
                new Cesium.Matrix4()
            )
        })
        window.tileset69380.clippingPlanes = clipTileset
    }
    this._prepareWell(pointList), this._createWell(this.wellData)
}

TerrainClipPlan.prototype.clear = function () {

    if (this.viewer.scene.globe.clippingPlanes) {
        this.viewer.scene.globe.clippingPlanes.enabled = false
        if (!this.viewer.scene.globe.clippingPlanes.isDestroyed()) {
            this.viewer.scene.globe.clippingPlanes.removeAll()
            // this.viewer.scene.globe.clippingPlanes.destroy()
        }
    }
    if (window?.tileset69380?.clippingPlanes?.removeAll) {
        window.tileset69380.clippingPlanes.removeAll()
    }
    if (this.bottomSurface) {
        this.viewer.scene.primitives.remove(this.bottomSurface)
        delete this.bottomSurface
    }
    if (this.wellWall) {
        this.viewer.scene.primitives.remove(this.wellWall)
        delete this.wellWall
    }
    this.viewer.scene.render()
}

TerrainClipPlan.prototype._prepareWell = function (e: any) {
    // 一个边分割为多少个点
    var splitNum = this.splitNum,
        pointListLength = e.length;
    if (0 != pointListLength) {
        for (var a = this.excavateMinHeight - this.height, no_height_top = [], bottom_pos = [], lerp_pos = [], currentIndex = 0; currentIndex < pointListLength; currentIndex++) {
            var nextIndex = currentIndex == pointListLength - 1 ? 0 : currentIndex + 1,
                currentPoint = Cesium.Cartographic.fromCartesian(e[currentIndex]),
                nextPoint = Cesium.Cartographic.fromCartesian(e[nextIndex]),
                currentPointLatlng = [currentPoint.longitude, currentPoint.latitude],
                nextPointLatlng = [nextPoint.longitude, nextPoint.latitude];

            if(0 == currentIndex){
                lerp_pos.push(new Cesium.Cartographic(currentPointLatlng[0], currentPointLatlng[1]))
                bottom_pos.push(Cesium.Cartesian3.fromRadians(currentPointLatlng[0], currentPointLatlng[1], a))
                no_height_top.push(Cesium.Cartesian3.fromRadians(currentPointLatlng[0], currentPointLatlng[1], 0));
            }
            for (var p = 1; p <= splitNum; p++) {
                const lerpPointX = Cesium.Math.lerp(currentPointLatlng[0], nextPointLatlng[0], p / splitNum)
                const lerpPointY = Cesium.Math.lerp(currentPointLatlng[1], nextPointLatlng[1], p / splitNum);
                currentIndex == pointListLength - 1 && p == splitNum || (
                    lerp_pos.push(new Cesium.Cartographic(lerpPointX, lerpPointY)),
                    bottom_pos.push(Cesium.Cartesian3.fromRadians(lerpPointX, lerpPointY, a)),
                    no_height_top.push(Cesium.Cartesian3.fromRadians(lerpPointX, lerpPointY, 0)))
            }
        }
        this.wellData = {
            lerp_pos,
            bottom_pos,
            no_height_top
        }
    }
}

TerrainClipPlan.prototype._createWell = function (e: any) {
    if (Boolean(this.viewer.terrainProvider._layers)) {
        var t = this;
        this._createBottomSurface(e.bottom_pos);
        var i = Cesium.sampleTerrainMostDetailed(this.viewer.terrainProvider, e.lerp_pos);
        i.then(ies => {
            for (var a = ies.length, n = [], r = 0; r < a; r++) {
                var s = Cesium.Cartesian3.fromRadians(ies[r].longitude, ies[r].latitude, ies[r].height);
                n.push(s)
            }
            t._createWellWall(e.bottom_pos, n)
        })
    } else {
        this._createBottomSurface(e.bottom_pos);
        this._createWellWall(e.bottom_pos, e.no_height_top)
    }
}


TerrainClipPlan.prototype._getMinHeight = function (e: any) {
    let minHeight = 50000000;
    let minPoint = null;
    for (let i = 0; i < e.length; i++) {
        let height = e[i]['z'];
        if (height < minHeight) {
            minHeight = height;
            minPoint = this._ellipsoidToLonLat(e[i]);
        }
    }
    return minPoint.altitude;
}


TerrainClipPlan.prototype._ellipsoidToLonLat = function (c: any) {
    let ellipsoid = this.viewer.scene.globe.ellipsoid;
    let cartesian3 = new Cesium.Cartesian3(c.x, c.y, c.z);
    let cartographic = ellipsoid.cartesianToCartographic(cartesian3);
    let lat = Cesium.Math.toDegrees(cartographic.latitude);
    let lng = Cesium.Math.toDegrees(cartographic.longitude);
    let alt = cartographic.height;
    return {
        longitude: lng,
        latitude: lat,
        altitude: alt
    }
}
TerrainClipPlan.prototype._createBottomSurface = function (e: any) {
    if (e.length) {
        let minHeight = this._getMinHeight(e);
        let positions = [];
        for (let i = 0; i < e.length; i++) {
            let p = this._ellipsoidToLonLat(e[i]);
            positions.push(p.longitude);
            positions.push(p.latitude);
            positions.push(minHeight);
        }

        let polygon = new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(
                Cesium.Cartesian3.fromDegreesArrayHeights(positions)
            ),
            perPositionHeight: true,
            closeBottom: false
        });
        let geometry = Cesium.PolygonGeometry.createGeometry(polygon);


        var i = new Cesium.Material({
                fabric: {
                    type: "Image",
                    uniforms: {
                        image: this.bottomImg
                    }
                }
            }),
            a = new Cesium.MaterialAppearance({
                translucent: !1,
                flat: !0,
                material: i
            });
        this.bottomSurface = new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: geometry
            }),
            appearance: a,
            asynchronous: !1
        }), this.viewer.scene.primitives.add(this.bottomSurface)
    }
}

TerrainClipPlan.prototype._createWellWall = function (e: any, t: any) {
    let minHeight = this._getMinHeight(e);
    let maxHeights = [];
    let minHeights = [];
    for (let i = 0; i < t.length; i++) {
        maxHeights.push(this._ellipsoidToLonLat(t[i]).altitude);
        minHeights.push(minHeight);
    }
    let wall = new Cesium.WallGeometry({
        positions: t,
        maximumHeights: maxHeights,
        minimumHeights: minHeights,
    });
    let geometry = Cesium.WallGeometry.createGeometry(wall);
    var a = new Cesium.Material({
            fabric: {
                type: "Image",
                uniforms: {
                    image: this.wallImg
                }
            }
        }),
        n = new Cesium.MaterialAppearance({
            translucent: !1,
            flat: !0,
            material: a
        });
    this.wellWall = new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: geometry,
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREY)
            },
            id: "PitWall"
        }),
        appearance: n,
        asynchronous: !1
    }), this.viewer.scene.primitives.add(this.wellWall)
}
TerrainClipPlan.prototype._switchExcavate = function (e: any) {
    e ? (this.viewer.scene.globe.material = Cesium.Material.fromType("WaJue"), this.wellWall.show = !0, this.bottomSurface.show = !0) : (this.viewer.scene.globe.material = null, this.wellWall.show = !1, this.bottomSurface.show = !1)
}

TerrainClipPlan.prototype._updateExcavateDepth = function (e: any) {
    this.bottomSurface && this.viewer.scene.primitives.remove(this.bottomSurface), this.wellWall && this.viewer.scene.primitives.remove(this.wellWall);
    for (var t = this.wellData.lerp_pos, i = [], a = t.length, n = 0; n < a; n++) i.push(Cesium.Cartesian3.fromRadians(t[n].longitude, t[n].latitude, this.excavateMinHeight - e));
    this.wellData.bottom_pos = i, this._createWell(this.wellData), this.viewer.scene.primitives.add(this.bottomSurface), this.viewer.scene.primitives.add(this.wellWall)
}

// 判断坐标串是否为逆时针
TerrainClipPlan.prototype.ifAntiClockwise = function (e: any) {
    //找凸点
    let pointList = JSON.parse(JSON.stringify(e))
    pointList.push(pointList[0])
    let pointListGeo = turf.lineString(pointList.map((point: any, index: number) => {
        return this.getLatLngFromXZY(point)
    }))
    let dirRes = booleanClockwise.default(pointListGeo)
    if (dirRes) {
        message.info('当前绘制图形为顺时针!')
    } else {
        message.info('当前绘制图形为逆时针!')
    }
    return dirRes
}

// 世界坐标转经纬度
TerrainClipPlan.prototype.getLatLngFromXZY = function (e: any) {
    var ellipsoid = this.viewer.scene.globe.ellipsoid;
    var cartesian3 = new Cesium.Cartesian3(e.x, e.y, e.z);
    var cartographic = ellipsoid.cartesianToCartographic(cartesian3);
    var latitude = Cesium.Math.toDegrees(cartographic.latitude);
    var longitude = Cesium.Math.toDegrees(cartographic.longitude);
    var height = cartographic.height;
    return [longitude, latitude]
}


export default TerrainClipPlan
