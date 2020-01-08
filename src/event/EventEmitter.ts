function test() {
    // dom 自定义事件
    window.addEventListener("debug", function (e: Event) {
        console.log(arguments);
    });
    //let event = new Event("debug", {bubbles:true, cancelable: true, composed: true});event.detail = '123';
    let event = new CustomEvent("debug", {"detail": {'test': '123', "hazcheeseburger": true}});
    window.dispatchEvent(event);
}

export class EventEmitter implements EventTarget {

    dom: EventTarget;

    constructor(dom?: EventTarget) {
        this.dom = dom || window;
    }

    addEventListener(type: string, listener: EventListener | EventListenerObject | null, options?: boolean | AddEventListenerOptions): void {
        return this.dom.addEventListener(type, listener, options);
    }

    dispatchEvent(event: Event): boolean {
        return this.dom.dispatchEvent(event);
    }

    removeEventListener(type: string, callback: EventListener | EventListenerObject | null, options?: EventListenerOptions | boolean): void {
        return this.dom.removeEventListener(type, callback, options);
    }

}

export const events = new EventEmitter();

//events.addEventListener("test", (...args: any[]) => console.log(args));
//events.dispatchEvent(new CustomEvent("test"));
