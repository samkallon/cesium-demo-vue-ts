import {Cartesian3, Entity, Viewer} from "cesium";
import * as Cesium from 'cesium'

export class CesiumUtils {
    private viewer: Viewer
    private Cesium: any

    constructor(options: any) {
        this.viewer = options.viewer
    }

    //position_A绕position_B逆时针旋转angle度（角度）得到新点
    rotatedPointByAngle(position_A:Cartesian3, position_B:Cartesian3, angle:number) {
        //以B点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
        var localToWorld_Matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position_B);
        //求世界坐标到局部坐标的变换矩阵
        var worldToLocal_Matrix = Cesium.Matrix4.inverse(localToWorld_Matrix, new Cesium.Matrix4());
        //B点在局部坐标的位置，其实就是局部坐标原点
        var localPosition_B = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, position_B, new Cesium.Cartesian3());
        //A点在以B点为原点的局部的坐标位置
        var localPosition_A = Cesium.Matrix4.multiplyByPoint(worldToLocal_Matrix, position_A, new Cesium.Cartesian3());
        //根据数学公式A点逆时针旋转angle度后在局部坐标系中的x,y,z位置
        var new_x = localPosition_A.x * Math.cos(Cesium.Math.toRadians(angle)) + localPosition_A.y *   Math.sin(Cesium.Math.toRadians(angle));
        var new_y = localPosition_A.y * Math.cos(Cesium.Math.toRadians(angle)) - localPosition_A.x * Math.sin(Cesium.Math.toRadians(angle));
        var new_z = localPosition_A.z;
        //最后应用局部坐标到世界坐标的转换矩阵求得旋转后的A点世界坐标
        return Cesium.Matrix4.multiplyByPoint(localToWorld_Matrix, new Cesium.Cartesian3(new_x, new_y, new_z), new Cesium.Cartesian3());
    }

    // 用于生成管道模型使用的工具函数,根据管径计算坐标
    computeCircle(radius:number) {
        const positions = [];
        for (let i = 0; i < 360; i++) {
            const radians = Cesium.Math.toRadians(i);
            positions.push(
                new Cesium.Cartesian2(
                    radius * Math.cos(radians),
                    radius * Math.sin(radians)
                )
            );
        }
        return positions;
    }

    /**
     * 获取平移矩阵
     * @param position 原点
     * @param offset 偏移量,东北上方向
     */
    getMoveMatrix4(position: Cartesian3,offset: Cartesian3){
        const frompoint_to_world_matrix = Cesium.Transforms.eastNorthUpToFixedFrame(position); // Matrix4
        const local_translation = offset; // 向模型中心为原点，正北为y，正东为x，地心朝上为z分别平移 310、-140、10米
        const result = new Cesium.Cartesian3(0,0,0);
        Cesium.Matrix4.multiplyByPoint(frompoint_to_world_matrix, local_translation, result); // 转换矩阵左乘局部平移向量，结果存储在 result 中，结果是世界坐标下的平移终点向量
        return Cesium.Matrix4.fromTranslation(Cesium.Cartesian3.subtract(result,position,new Cesium.Cartesian3())); // 构造平移矩阵并赋值
    }

    /**
     * 旋转xyz三个方向的角度,单位为degree
     * @param rotate
     */
    getRotateMatrix4({x,y,z}:any){
        if (x) return Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(x))
        if (y) return Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(y))
        if (z) return Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromRotationX(z))
    }

    /**
     * 修改模型缩放
     * @param entity
     * @param scale
     */
    setScale(entity:any,scale:number) {
        if (!entity.model?.scale) return
        entity.model.scale = scale
    }
    /**
     * 设置模型旋转
     * @param entity
     * @param x
     * @param y
     * @param z
     */
    // @ts-ignore
    setRotate(entity:any,{x,y,z}) {
        const origin = entity.position.getValue()
        const heading = Cesium.Math.toRadians(x)
        const pitch = Cesium.Math.toRadians(y)
        const roll = Cesium.Math.toRadians(z)

        const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
        const orientation = Cesium.Transforms.headingPitchRollQuaternion(origin, hpr)
        entity.orientation = orientation
    }

}
