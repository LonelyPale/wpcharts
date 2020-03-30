const liveServer = require("live-server");
const Mock = require('mockjs');

let params = {
    port: 8080, // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: ".", // Set root directory that's being served. Defaults to cwd.
    open: false, // When false, it won't load your browser by default.
    watch: ['data', 'dist', 'lib', './*.html'],
    ignore: '.idea', // comma-separated string for paths to ignore
    file: "index.html", // When set, serve this file for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    mount: [['/wpcharts', '.']], // Mount a directory to a route.
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    middleware: [apiImageConfigRoute, mockRoute, setEignoteByIds, getColor] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
};

liveServer.start(params);

function apiImageConfigRoute(req, res, next) {
    //http://192.168.1.25:8080/api/image/config
    let {pathname, query} = req._parsedUrl;
    if (pathname === '/api/image/config') {
        let result = {node: 'http://127.0.0.1:8888'};
        return res.end(JSON.stringify(result));
    }
    next();
}

function mockRoute(req, res, next) {
    //http://127.0.0.1:8080/mock?type=1
    let {pathname, query} = req._parsedUrl;
    if (pathname === '/mock' && query) {
        let items = query.split('&');
        let [key, type] = items[0].split('=');
        if (key && type && key === 'type') {
            return res.end(mock(type));
        }
    }
    next();
}

function mock(type) {
    console.log(type);
    let data = Mock.mock({
        'list|1-10': [{
            'id|+1': 1
        }]
    });
    return JSON.stringify(data, null, 4);
}

function setEignoteByIds(req, res, next) {
    let {pathname, query} = req._parsedUrl;
    if (pathname === '/business/basic/datamanage/setEignoteByIds') {
        console.log(req.body);
        return res.end('{"code":200,"message":"数据请求成功"}');
        //return res.end('{"code":500,"message":"数据参数不合理"}');
    }
    next();
}

function getColor(req, res, next) {
    let {pathname, query} = req._parsedUrl;
    if (pathname === '/business/graph/getColor') {
        console.log(req.body);
        let result = '{\n' +
            '    "cname": "",\n' +
            '    "code": "",\n' +
            '    "fieldMapName": null,\n' +
            '    "gratype": "",\n' +
            '    "id": "",\n' +
            '    "isvisible": "",\n' +
            '    "name": "",\n' +
            '    "orderBy": "",\n' +
            '    "orgid": "010000",\n' +
            '    "orgname": "中线局",\n' +
            '    "pkName": "id",\n' +
            '    "setjson": "{\\"type\\":\\"hydrograph\\",\\"lines\\":[{\\"color\\":\\"#FFCC33\\",\\"legend\\":\\"solid_circle\\",\\"id\\":1},{\\"color\\":\\"#996600\\",\\"legend\\":\\"hollow_circle\\",\\"id\\":2},{\\"color\\":\\"#FFCC33\\",\\"legend\\":\\"solid_rect\\",\\"id\\":3},{\\"color\\":\\"#6600FF\\",\\"legend\\":\\"hollow_rect\\",\\"id\\":4},{\\"color\\":\\"#FFCC33\\",\\"legend\\":\\"solid_triangle\\",\\"id\\":5},{\\"color\\":\\"#FFCC33\\",\\"legend\\":\\"hollow_triangle\\",\\"id\\":6},{\\"color\\":\\"#FFCC33\\",\\"legend\\":\\"solid_inverted_triangle\\",\\"id\\":7},{\\"color\\":\\"#9999FF\\",\\"legend\\":\\"hollow_inverted_triangle\\",\\"id\\":8},{\\"color\\":\\"#FFCC33\\",\\"legend\\":\\"solid_rhombus\\",\\"id\\":9},{\\"color\\":\\"#FFCC33\\",\\"legend\\":\\"hollow_rhombus\\",\\"id\\":10},{\\"color\\":\\"#FFCC33\\",\\"legend\\":\\"solid_cross\\",\\"id\\":11},{\\"color\\":\\"#FFCC33\\",\\"legend\\":\\"hollow_cross\\",\\"id\\":12}]}",\n' +
            '    "valMap": null\n' +
            '}';
        return res.end(result);
    }
    next();
}
