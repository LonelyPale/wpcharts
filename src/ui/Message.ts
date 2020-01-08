import LayerCallbackEnd = layui.LayerCallbackEnd;
import LayerOptions = layui.LayerOptions;

const MessageOption = {
    icon: 0,
    time: 1500,
    offset: 'rt',
};

//全局提示: 全局展示操作反馈信息
export class Message {

    static info(content: string, options?: LayerOptions, end?: LayerCallbackEnd) {
        options = options || {icon: 0, ...MessageOption};
        layui.layer.msg(content, options, end);
    }

    static success(content: string, options?: LayerOptions, end?: LayerCallbackEnd) {
        options = options || {icon: 1, ...MessageOption};
        layui.layer.msg(content, options, end);
    }

    static error(content: string, options?: LayerOptions, end?: LayerCallbackEnd) {
        options = options || {icon: 2, ...MessageOption};
        layui.layer.msg(content, options, end);
    }

    static warn(content: string, options?: LayerOptions, end?: LayerCallbackEnd) {
        options = options || {icon: 3, ...MessageOption};
        layui.layer.msg(content, options, end);
    }

    static msg(content: string, end?: LayerCallbackEnd): number;
    static msg(content: string, options?: LayerOptions, end?: LayerCallbackEnd): number;
    static msg(content: string, x?: LayerOptions | LayerCallbackEnd, y?: LayerCallbackEnd): number {
        if (x && typeof x === "object") {
            return layui.layer.msg(content, x, y);
        } else if (typeof x === "function") {
            return layui.layer.msg(content, x);
        } else {
            return layui.layer.msg(content);
        }
    }

}
