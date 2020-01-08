const liveServer = require("live-server");
const Mock = require('mockjs');

let params = {
    port: 8080, // Set the server port. Defaults to 8080.
    host: "0.0.0.0", // Set the address to bind to. Defaults to 0.0.0.0 or process.env.IP.
    root: ".", // Set root directory that's being served. Defaults to cwd.
    open: false, // When false, it won't load your browser by default.
    ignore: 'scss,my/templates', // comma-separated string for paths to ignore
    file: "index.html", // When set, serve this file for every 404 (useful for single-page applications)
    wait: 1000, // Waits for all changes, before reloading. Defaults to 0 sec.
    mount: [['/components', './node_modules']], // Mount a directory to a route.
    logLevel: 2, // 0 = errors only, 1 = some, 2 = lots
    middleware: [function (req, res, next) {
        let {pathname, query} = req._parsedUrl;
        if (pathname === '/mock' && query) {
            let items = query.split('&');
            let [key, type] = items[0].split('=');
            if (key && type && key === 'type') {
                return res.end(mock(type));
            }
        }
        next();
    }] // Takes an array of Connect-compatible middleware that are injected into the server middleware stack
};

liveServer.start(params);

function mock(type) {
    console.log(type);
    let data = Mock.mock({
        'list|1-10': [{
            'id|+1': 1
        }]
    });
    let result = JSON.stringify(data, null, 4);
    return result;
}
