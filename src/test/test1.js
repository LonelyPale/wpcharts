
//# test extends
class People {
    
    constructor(name, age) {
        this.name = name;
        this.age = age;
    }
    
    print() {
        console.log(this.name, this.age);
    }
    
}

class Father extends People {
    constructor(name, age) {
        super(name, age);
    }
}

class Son extends Father {
    constructor(name, age) {
        super(name, age);
    }
}

function main() {
    let son = new Son("test", 123);
    son.print();
}

main();
