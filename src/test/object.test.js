var Book = /** @class */ (function () {
    function Book() {
        this.name = 'json';
        this.attr = {};
        this.prop = { a: 1 };
    }
    Book.prototype.test = function () {
        console.log('book:', this);
        var attr = this.attr;
        attr.a = 1;
        console.log('attr:', attr);
        console.log('book:', this);
        var _a = this, attr2 = _a.attr, a = _a.prop.a;
        attr2['b'] = 2;
        console.log('attr:', attr);
        console.log('attr2:', attr2);
        console.log('book:', this);
        console.log(attr === this.attr);
        console.log(attr2 === this.attr);
    };
    return Book;
}());
var book = new Book();
book.test();
