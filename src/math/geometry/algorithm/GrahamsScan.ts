import {Point} from "../Point";
import {Vector} from "../Vector";

// 凸包最常用的凸包算法是Graham扫描法和Jarvis步进法
// Graham's Scan法
export class GrahamsScan {

    /**
     * 凸包（Convex Hull）是一个计算几何（图形学）中的概念。
     * 在一个实数向量空间V中，对于给定集合X，所有包含X的凸集的交集S被称为X的凸包。X的凸包可以用X内所有点(X1，...Xn)的凸组合来构造.
     * 在二维欧几里得空间中，凸包可想象为一条刚好包著所有点的橡皮圈。
     * 用不严谨的话来讲，给定二维平面上的点集，凸包就是将最外层的点连接起来构成的凸多边形，它能包含点集中所有的点。
     * @param discretePointArray  输入的点集合数组
     * @returns {Array} 凸包的点集合数组
     */
    getConvexHull(discretePointArray: Point[]): Point[] {
        //获取基点
        let basePoint = this.getBasePoint(discretePointArray);

        //余弦值从大到小排序，基点会直接排在第一个
        discretePointArray = this.quickSort(<Point>basePoint, discretePointArray, 0, discretePointArray.length - 1);

        //获取离散点集凸多边形顶点
        let polygonVertexSet = this.getPolygonVertexSet(discretePointArray);

        return polygonVertexSet;
    }

    /**
     * 获取离散点集凸包
     * @param cosArr 排序后的离散点集
     * @returns {Array}
     */
    getPolygonVertexSet(cosArr: Point[]): Point[] {
        //凸包点集数组
        let polygonArr = [];
        //开始获取（按逆时针扫描，如果排序时升序则需要顺时针扫描）
        if (cosArr != null && cosArr.length > 0) {
            polygonArr.push(cosArr[0]); //基点肯定是多边形顶点
            if (cosArr.length > 1) {
                polygonArr.push(cosArr[1]); //第一个夹角最小的点肯定是多边形顶点
            }
            if (cosArr.length > 2) {
                polygonArr.push(cosArr[2]); //无论是否是多边形顶点直接放入（回溯中可能会被删除）
            }
            for (let i = 3; i < cosArr.length; i++) {
                let len = polygonArr.length;
                let leftVector = new Vector(polygonArr[len - 2], polygonArr[len - 1]);
                let rightVector = new Vector(polygonArr[len - 1], cosArr[i]);
                while (leftVector.cross(rightVector) < 0) {//向量叉积小于0时回溯
                    polygonArr.splice(len - 1, 1);//删除最后一个元素
                    len = polygonArr.length;    //删除后，len有变化，需要重新设置
                    leftVector = new Vector(polygonArr[len - 2], polygonArr[len - 1]);
                    rightVector = new Vector(polygonArr[len - 1], cosArr[i]);
                }
                polygonArr.push(cosArr[i]);
            }
        }

        return polygonArr;
    }

    /**
     * 获取基点：在离散点集中选取y坐标最小的点，当作开始点
     * 如果存在多个点的y坐标都为最小值，则选取x坐标最小的一点
     * @param vertexSet 离散点集
     * @returns {*}
     */
    getBasePoint(vertexSet: Point[]): Point | null {
        if (vertexSet != null && vertexSet.length > 0) {
            let point = vertexSet[0];
            for (let i = 1; i < vertexSet.length; i++) {
                //最小y（多个y相同时，选择x最小的点）
                if (vertexSet[i].y < point.y ||
                    ((vertexSet[i].y === point.y) && (vertexSet[i].x < point.x))) {
                    point = vertexSet[i];
                }
            }

            return point;
        }

        return null;
    }

    /**
     * 对离散点排序：按照其与基点构成的向量与x轴正方向夹角余弦值快速降序
     * @param basePoint 基点
     * @param discretePointArray 需要排序的离散点集
     * @param left 左指示变量
     * @param right 右指示变量
     * @returns {*}
     */
    quickSort(basePoint: Point, discretePointArray: Point[], left: number, right: number): Point[] {
        let i = left;
        let j = right;
        let temp = discretePointArray[left];
        let tempV = new Vector(basePoint, temp);
        while (i < j) {
            while (i < j && tempV.cosx > new Vector(basePoint, discretePointArray[j]).cosx) {
                j--;
            }
            if (i < j) {
                discretePointArray[i++] = discretePointArray[j];
            }
            while (i < j && tempV.cosx < new Vector(basePoint, discretePointArray[i]).cosx) {
                i++;
            }
            if (i < j) {
                discretePointArray[j--] = discretePointArray[i];
            }
        }
        discretePointArray[i] = temp;
        if (left < i) {
            this.quickSort(basePoint, discretePointArray, left, i - 1);
        }
        if (right > i) {
            this.quickSort(basePoint, discretePointArray, i + 1, right);
        }

        return discretePointArray;
    }

}
