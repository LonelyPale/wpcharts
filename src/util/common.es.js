// svg 转 png
function downloadImage() {
    var serializer = new XMLSerializer();
    var source = serializer.serializeToString(svg.node());

    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
    var url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(source);
    //document.write('<img src="' + url + '"/>');//输出svg图像,会覆盖源html文档页面

    var root = document.getElementById("root");
    var img = document.getElementById("download_image");
    if(img) {
        img.src = url;//重复下载时刷新图片
    } else {
        img = document.createElement("img");
        img.style.display = "none";//不显示图片
        img.id = "download_image";
        img.src = url;
        root.appendChild(img);//可以重复添加
    }

    var canvas = document.createElement("canvas");
    canvas.width = canvasWidth;
    canvas.height = canvasHeight + 100;

    var context = canvas.getContext("2d");
    context.fillStyle="#FFFFFF";//必须先设置背景色
    context.fillRect(0, 0, canvas.width, canvas.height);//然后再设置背景大小

    loadImg(["http://39.104.181.232/wddhs_dv/image/wdd.png"]).then( ([img1]) => {
        context.drawImage(img1, 52, 20, 810, 450);//在画布上先绘制背景图
        let image = new Image;
        image.src = document.getElementsByTagName('img')[0].src;
        image.onload = function() {
            context.drawImage(image, 0, 0);//再绘制svg图
            var a = document.createElement("a");console.log(a);
            //a.target = "_blank";
            a.download = "wddhs_1.png";
            a.href = canvas.toDataURL("image/png");//获取图片合并后的data-URL,参数可选图片格式，图片质量，详自查API
            a.click();
            //canvas.style.display = "none";
        };
    });

    function loadImg(src) {
        let paths = Array.isArray(src) ? src : [src];
        let promise = paths.map((path) => {
            return new Promise((resolve, reject) => {
                let img = new Image();
                img.setAttribute("crossOrigin", "anonymous");
                img.src = path;
                //只是更新了DOM对象,图片数据信息还未加载完成，加载资源是异步执行的,需要监听load事件的,事件发生后,就能获取资源
                img.onload = () => {
                    resolve(img)
                };
                img.onerror = (err) => {
                    console.log("图片加载失败:", err);
                }
            })
        });
        return Promise.all(promise);
    }

}

