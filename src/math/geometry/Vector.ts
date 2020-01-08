import {Point} from "./Point";

export class Vector {

    start: Point;
    end: Point;

    x: number;
    y: number;

    cosx: number;
    cross: (that: Point) => number;

    /**
     * 平面向量对象
     * @param start 向量始点
     * @param end 向量终点
     * @constructor
     */
    constructor(start: Point, end: Point) {
        this.start = start;
        this.end = end;

        // 向量坐标
        this.x = this.end.x - this.start.x;
        this.y = this.end.y - this.start.y;

        // 向量与x轴正向的夹角余弦值
        // 零向量(0,0)与x轴正向的夹角余弦值定义为2,按余弦值降序排序时排在第一个位置
        this.cosx = (this.x === 0 && this.y === 0) ? 2
            : (this.x / Math.sqrt(this.x * this.x + this.y * this.y));

        // 向量叉积
        this.cross = function (that: Point) {
            return this.x * that.y - that.x * this.y;
        };
    }

}
