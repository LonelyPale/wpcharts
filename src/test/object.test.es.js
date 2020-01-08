function test_1() {
    let object = {};

    let obj = {
        solid_circle: 0,
        hollow_circle: 0,
        solid_rect: 0,
        hollow_rect: 0,
        solid_triangle: 0,
        hollow_triangle: 0,
        solid_inverted_triangle: 0,
        hollow_inverted_triangle: 0,
        solid_rhombus: 0,
        hollow_rhombus: 0,
        solid_cross: 0,
        hollow_cross: 0,
    };
    let keys = Object.keys(obj);
    console.log(1, keys);

    delete obj.solid_circle;
    console.log(2, Object.keys(obj));

    obj.solid_circle = 0;
    console.log(3, Object.keys(obj));

    console.log(4, Object.keys(object));

    console.log(5, Object.values(obj));
}

function test_2() {
    let a = {name: 'a'};
    a.age = 1;
    let b = a;
    b.name = 'b';
    b.age = 2;
    console.log('a:', a);
    console.log('b:', b);
}

function test_3() {
    class Book {
        name = 'json';
        attr = {};
    }

    let book_0 = new Book();
    let book = book_0;
    console.log('book:', book);

    let attr = book.attr;
    attr.a = 1;
    console.log('attr:', attr);
    console.log('book:', book);

    let {attr: attr2} = book;
    attr2['b'] = 2;
    console.log('attr:', attr);
    console.log('attr2:', attr2);
    console.log('book:', book);

    console.log(attr === book.attr);
    console.log(attr2 === book.attr);
}

test_3();
