class Book {
    name = 'json';
    attr: any = {};
    prop = {a: 1};

    test() {
        console.log('book:', this);

        let attr = this.attr;
        attr.a = 1;
        console.log('attr:', attr);
        console.log('book:', this);

        let {attr: attr2, prop:{a}} = this;
        attr2['b'] = 2;
        console.log('attr:', attr);
        console.log('attr2:', attr2);
        console.log('book:', this);

        console.log(attr === this.attr);
        console.log(attr2 === this.attr);
    }
}

let book = new Book();
book.test();

//tsc object.test.ts && node object.test.js
