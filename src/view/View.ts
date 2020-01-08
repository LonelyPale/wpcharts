import {SvgObject} from "../svg/SvgObject";

type BoxOrientValue = 'horizontal' | 'vertical' | 'free' | 'default'; //在水平行中从左向右排列子元素。在垂直行中从上向下垂直排列子元素。

type PositionValue = 'TopLeft' | 'TopRight' | 'BottomLeft' | 'BottomRight' | 'Free';

export type ViewOption = { x?: number, y?: number, width?: number, height?: number, top?: number, right?: number, bottom?: number, left?: number, boxOrient?: BoxOrientValue };

//# 屏幕坐标系: 当前只支持从左上角输出 TopLeft
export class View {

    //作用于父元素
    x: number;
    y: number;

    //作用于自身
    width: number;
    height: number;

    //作用于子元素
    top: number;
    right: number;
    bottom: number;
    left: number;

    //记录当前自身的偏移值，translate: x, y
    tx: number = 0;
    ty: number = 0;

    //记录子元素叠加的偏移值，用于追加元素，children: x, y
    cx: number = 0;
    cy: number = 0;

    //记录子元素当前行、列最大宽高
    cw: number = 0;
    ch: number = 0;

    boxOrient: BoxOrientValue;
    position!: PositionValue;//暂未使用 todo

    protected parent?: View;
    protected children: Record<string, View> = {};

    protected context: SvgObject;

    constructor(option: ViewOption, context: SvgObject) {
        let {x, y, width, height, top, right, bottom, left, boxOrient} = option;
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
        this.top = top || 0;
        this.right = right || 0;
        this.bottom = bottom || 0;
        this.left = left || 0;
        this.boxOrient = boxOrient || 'default';
        this.cx = this.left;
        this.cy = this.top;
        this.context = context;
    }

    public append(view: View) {
        this.children[this.context.id()] = view;
        view.parent = this;
        view.transform();
    }

    public remove() {
        if (!this.parent) return;
        delete this.parent.children[this.context.id()];
        this.parent.refresh();
    }

    protected refresh() {
        this.reset();
        for (let view of Object.values(this.children)) {
            view.transform();
        }
    }

    protected reset() {
        this.cx = this.left;
        this.cy = this.top;
        this.cw = 0;
        this.ch = 0;
    }

    protected translate() {
        if (!this.parent) {
            this.tx = this.x;
            this.ty = this.y;
            return;
        }

        //# todo: right bottom 未纳入计算
        let {top: ptop, right: pright, bottom: pbottom, left: pleft} = this.parent;
        let {width: pwidth, height: pheight, cx: pcx, cy: pcy, cw: pcw, ch: pch, boxOrient: pboxOrient} = this.parent;
        let {x, y, width, height} = this;

        if (pboxOrient === 'horizontal') {//水平模式 horizontal
            if (pcx + x + width <= pwidth) {
                this.tx = pcx + x;
                this.ty = pcy + y;
                this.parent.cx = this.tx + width;
                this.parent.ch = pch > y + height ? pch : y + height;
            } else {
                this.tx = pleft + x;
                this.ty = pcy + pch + y;
                this.parent.cx = this.tx + width;
                this.parent.cy = pcy + pch;
                this.parent.ch = y + height;
            }
        } else if (pboxOrient === 'vertical') {//垂直模式 vertical
            if (pcy + y + height <= pheight) {
                this.tx = pcx + x;
                this.ty = pcy + y;
                this.parent.cy = this.ty + height;
                this.parent.cw = pcw > x + width ? pcw : x + width;
            } else {
                this.tx = pcx + pcw + x;
                this.ty = ptop + y;
                this.parent.cx = pcx + pcw;
                this.parent.cy = this.ty + height;
                this.parent.cw = x + width;
            }
        } else if (pboxOrient === 'free') {//自由模式 free
            this.tx = x;
            this.ty = y;
        } else {//默认 default
            this.tx = pleft + x;
            this.ty = ptop + y;
        }
    }

    public transform() {
        this.translate();

        let {tx, ty} = this;
        if (tx !== 0 && ty === 0) {
            let translate = `translate(${this.tx})`;
            this.context.attr('transform', translate);

            /*
            //# todo: 为translate时覆盖，其他则追加
            let transform = this.context.attr('transform');
            if (transform) {
                this.context.attr('transform', transform + translate);
            } else {
                this.context.attr('transform', translate);
            }
            */
        } else if (tx !== 0 || ty !== 0) {
            let translate = `translate(${this.tx}, ${this.ty})`;
            this.context.attr('transform', translate);
        }
    }

}
