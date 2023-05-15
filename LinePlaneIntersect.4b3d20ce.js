import{d as A,u as F,r as L,o as H,c as W,e as j,a as _,w as D,b as M,_ as z}from"./index.2ad12903.js";import{D as G}from"./draw.a0edba2a.js";const O={class:"l-p-container"},U={class:"btn-group"},e=window.Cesium,x=window.Cesium.Cartesian3,Y=A({__name:"LinePlaneIntersect",setup(q,{expose:S}){let C,E,d=[],P=[],c,h=null,y;const i=F().cesiumViewer,r=[{longitude:2.0733488649899,latitude:.559838656057063,height:130},{longitude:2.073360494187088,latitude:.559758202546264,height:130}],a=[{longitude:2.0733865065056376,latitude:.5598539740748087,height:120},{longitude:2.0733839959244103,latitude:.5597777547258658,height:300},{longitude:2.073301481678757,latitude:.5597909615778097,height:120}],B=[{sp:r[0],ep:r[1]},{sp:a[1],ep:a[2]},{sp:a[0],ep:a[1]}],b=()=>{!i||(c=new G({viewer:i,Cesium:e,type:"line"}))},I=()=>{let t=10,s=30,n=.05,o="add";function g(){return o==="add"&&(t=t+n),o==="minus"&&(t=t-n),t>=s&&(o="minus"),t<10&&(o="add"),new e.Cartesian3(t,t,t)}if(!i)return;const l=V(c.tempShapePoints[0],c.tempShapePoints[1]);C=l==null?void 0:l.planeEntity,E=l==null?void 0:l.plane,B.forEach(u=>{let p=e.Matrix4.multiplyByPoint(h,e.Cartesian3.fromRadians(u.sp.longitude,u.sp.latitude,u.sp.height),new x),m=e.Matrix4.multiplyByPoint(h,e.Cartesian3.fromRadians(u.ep.longitude,u.ep.latitude,u.ep.height),new x),f=e.IntersectionTests.lineSegmentPlane(p,m,E),w=e.Matrix4.multiplyByPoint(y,f,new x);const R=i.entities.add({position:w,ellipsoid:{radii:new e.CallbackProperty(g,!1),material:e.Color.fromCssColorString("#f60a0a")}});d.push(R)})},N=()=>{!i||(T(e.Cartesian3.fromDegreesArrayHeights([e.Math.toDegrees(a[0].longitude),e.Math.toDegrees(a[0].latitude),a[0].height,e.Math.toDegrees(a[1].longitude),e.Math.toDegrees(a[1].latitude),a[1].height,e.Math.toDegrees(a[2].longitude),e.Math.toDegrees(a[2].latitude),a[2].height])),T(e.Cartesian3.fromDegreesArrayHeights([e.Math.toDegrees(r[0].longitude),e.Math.toDegrees(r[0].latitude),r[0].height,e.Math.toDegrees(r[1].longitude),e.Math.toDegrees(r[1].latitude),r[1].height])),i.flyTo(P[0]))},V=(t,s)=>{if(!i)return;const n=e.Cartesian3,o=e.Cartesian3.midpoint(t,s,new e.Cartesian3),g=e.Cartesian3.distance(t,s),l=e.Ellipsoid.WGS84.geodeticSurfaceNormal(t,new e.Cartesian3),u=n.subtract(s,o,new n);let p=n.cross(l,u,new n);p=n.add(o,p,new n),y=e.Transforms.eastNorthUpToFixedFrame(o),h=e.Matrix4.inverseTransformation(y,new e.Matrix4);let m=e.Matrix4.multiplyByPoint(h,p,new n);m=n.normalize(m.clone(),new n);const f=new e.Plane(m,0),w=i.entities.add({id:"hdmPlane",position:o,plane:{plane:f,dimensions:new e.Cartesian2(g,g*2),material:e.Color.WHITE.withAlpha(.4),outline:!0,outlineColor:e.Color.RED}});return{plane:f,planeEntity:w}},k=t=>{const s=[];for(let n=0;n<360;n++){const o=e.Math.toRadians(n);s.push(new e.Cartesian2(t*Math.cos(o),t*Math.sin(o)))}return s},T=t=>{if(!i)return;const s=i.entities.add({name:"Blue star with mitered corners and outline",polylineVolume:{positions:t,shape:k(5),cornerType:e.CornerType.MITERED,material:e.Color.fromCssColorString("rgba(4,236,217,0.84)")}});P.push(s)},v=()=>{!i||(C&&i.entities.remove(C),d!=null&&d.length&&d.forEach(t=>{i.entities.remove(t)}),c&&c.stopDraw())};return N(),S({clear:v}),(t,s)=>{const n=L("a-button");return H(),W("div",O,[j("div",U,[_(n,{type:"primary",onClick:b},{default:D(()=>[M("\u5F00\u59CB\u7ED8\u5236")]),_:1}),_(n,{type:"primary",onClick:I},{default:D(()=>[M("\u76F8\u4EA4\u68C0\u6D4B")]),_:1}),_(n,{type:"primary",onClick:v},{default:D(()=>[M("\u6E05\u9664")]),_:1})])])}}});const X=z(Y,[["__scopeId","data-v-adf03ed5"]]);export{X as default};
