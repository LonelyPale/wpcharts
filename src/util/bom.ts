export function detect(this: any, ua: string, platform: string) {
    let os: any = this.os = {}, browser: any = this.browser = {},
        webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
        android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
        osx = !!ua.match(/\(Macintosh\; Intel /),
        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
        iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
        win = /Win\d{2}|Windows/.test(platform),
        wp = ua.match(/Windows Phone ([\d.]+)/),
        touchpad = webos && ua.match(/TouchPad/),
        kindle = ua.match(/Kindle\/([\d.]+)/),
        silk = ua.match(/Silk\/([\d._]+)/),
        blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
        bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
        rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
        playbook = ua.match(/PlayBook/),
        chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
        firefox = ua.match(/Firefox\/([\d.]+)/),
        firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
        ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
        webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
        safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/);

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    if (browser.webkit = !!webkit) browser.version = webkit[1];

    if (android) os.android = true, os.version = android[2];
    if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.');
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.');
    if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    if (wp) os.wp = true, os.version = wp[1];
    if (webos) os.webos = true, os.version = webos[2];
    if (touchpad) os.touchpad = true;
    if (blackberry) os.blackberry = true, os.version = blackberry[2];
    if (bb10) os.bb10 = true, os.version = bb10[2];
    if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2];
    if (playbook) browser.playbook = true;
    if (kindle) os.kindle = true, os.version = kindle[1];
    if (silk) browser.silk = true, browser.version = silk[1];
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true;
    if (chrome) browser.chrome = true, browser.version = chrome[1];
    if (firefox) browser.firefox = true, browser.version = firefox[1];
    if (firefoxos) os.firefoxos = true, os.version = firefoxos[1];
    if (ie) browser.ie = true, browser.version = ie[1];
    if (safari && (osx || os.ios || win)) {
        browser.safari = true;
        if (!os.ios) browser.version = safari[1];
    }
    if (webview) browser.webview = true;

    os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
        (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
    os.phone = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
        (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
        (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));
}

export function detectOS(this: any, ua: string, platform: string) {
    const OSData = [
        {name: 'Windows 2000', group: 'windows_server', identifier: 'Windows NT 5.0', version: '5.0'},
        {name: 'Windows XP', group: 'windows', identifier: 'Windows NT 5.1', version: '5.1'},
        {name: 'Windows 2003', group: 'windows_server', identifier: 'Windows NT 5.2', version: '5.2'},
        {name: 'Windows Vista', group: 'windows', identifier: 'Windows NT 6.0', version: '6.0'},
        {name: 'Windows 7', group: 'windows', identifier: 'Windows NT 6.1', version: '7.0'},
        {name: 'Windows 8', group: 'windows', identifier: 'Windows NT 6.2', version: '8.0'},
        {name: 'Windows 8.1', group: 'windows', identifier: 'Windows NT 6.3', version: '8.1'},
        {name: 'Windows 10', group: 'windows', identifier: 'Windows NT 10.0', version: '10.0'},
        {name: 'Windows 2008', group: 'windows_server', identifier: 'Windows NT 6.0; WOW64', version: '6.0'},
        {name: 'Windows 2008', group: 'windows_server', identifier: 'Windows NT 6.1; WOW64', version: '6.1'},
        {name: 'Windows 2012', group: 'windows_server', identifier: 'Windows NT 6.3; Win64', version: '6.3'},
        {name: 'Chrome OS', group: 'windows', identifier: 'CrOS'},
        {name: 'Mac OS X Capitan', group: 'mac', identifier: 'Mac OS X (10([_|\.])11([0-9_\.]*))', versionSeparator: '[_|\.]'},
        {name: 'Mac OS X Yosemite', group: 'mac', identifier: 'Mac OS X (10([_|\.])10([0-9_\.]*))', versionSeparator: '[_|\.]'},
        {name: 'Mac OS X Mavericks', group: 'mac', identifier: 'Mac OS X (10([_|\.])9([0-9_\.]*))', versionSeparator: '[_|\.]'},
        {name: 'Mac OS X Mountain Lion', group: 'mac', identifier: 'Mac OS X (10([_|\.])8([0-9_\.]*))', versionSeparator: '[_|\.]'},
        {name: 'Mac OS X Lion', group: 'mac', identifier: 'Mac OS X (10([_|\.])7([0-9_\.]*))', versionSeparator: '[_|\.]'},
        {name: 'Mac OS X Snow Leopard', group: 'mac', identifier: 'Mac OS X (10([_|\.])6([0-9_\.]*))', versionSeparator: '[_|\.]'},
        {name: 'Mac OS X Leopard', group: 'mac', identifier: 'Mac OS X (10([_|\.])5([0-9_\.]*))', versionSeparator: '[_|\.]'},
        {name: 'Mac OS X Tiger', group: 'mac', identifier: 'Mac OS X (10([_|\.])4([0-9_\.]*))', versionSeparator: '[_|\.]'},
        {name: 'Mac OS X Panther', group: 'mac', identifier: 'Mac OS X (10([_|\.])3([0-9_\.]*))', versionSeparator: '[_|\.]'},
        {name: 'Mac OS X Jaguar', group: 'mac', identifier: 'Mac OS X (10([_|\.])2([0-9_\.]*))', versionSeparator: '[_|\.]'},
        {name: 'Mac OS X Puma', group: 'mac', identifier: 'Mac OS X (10([_|\.])1([0-9_\.]*))', versionSeparator: '[_|\.]'},
        {name: 'Mac OS X Cheetah', group: 'mac', identifier: 'Mac OS X (10([_|\.])0([0-9_\.]*))', versionSeparator: '[_|\.]'},
        {name: 'Mac OS', group: 'mac', identifier: 'Mac OS'},
        {name: 'Ubuntu', group: 'linux_server', identifier: 'Ubuntu', versionIdentifier: 'Ubuntu/([0-9\.]*)'},
        {name: 'CentOs', group: 'linux_server', identifier: 'CentOs', versionIdentifier: 'CentOs/([0-9\.]*)'},
        {name: 'Debian', group: 'linux_server', identifier: 'Debian'},
        {name: 'Gentoo', group: 'linux_server', identifier: 'Gentoo'},
        {name: '国产系统', group: 'linux', identifier: 'Linux'}
    ];

    let setOSData = function (os: any) {
        let userAgent = navigator.userAgent.toLowerCase();
        // Check browser type
        for (let i = 0; i < OSData.length; i++) {
            let osRegExp = new RegExp(OSData[i].identifier.toLowerCase());
            let osRegExpResult = osRegExp.exec(userAgent);

            if (osRegExpResult != null) {
                os.name = OSData[i].name;
                os.group = OSData[i].group;
                break;
            }
        }

        return true;
    };

    let setOSVersion = function (os: any, version: any, separator: any) {
        let splitVersion;
        if (separator.substr(0, 1) == '[') {
            splitVersion = version.split(new RegExp(separator, 'g'), 2);
        } else {
            splitVersion = version.split(separator, 2);
        }

        if (separator != '.') {
            version = version.replace(new RegExp(separator, 'g'), '.');
        }

        os.fullVersion = version;

        // Major version
        if (splitVersion[0]) {
            os.majorVersion = parseInt(splitVersion[0]);
        }

        // Minor version
        if (splitVersion[1]) {
            os.minorVersion = parseInt(splitVersion[1]);
        }

        return true;
    };

    this.os = this.os || {};
    setOSData(this.os);
}
