
function getUrlParameter(name, url) {
    name = name.replace(/[]/,"\[").replace(/[]/,"\[").replace(/[]/,"\\\]");
    let regexS = "[\\?&]"+name+"=([^&#]*)";
    let regex = new RegExp( regexS );
    let results = regex.exec(url || window.location.href);
    if( results == null ) {
        return "";
    } else {
        return results[1];
    }
}
