"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const detect_browser_1 = require("detect-browser");
function detectEnv(userAgent) {
    return detect_browser_1.detect(userAgent);
}
exports.detectEnv = detectEnv;
function detectOS() {
    const env = detectEnv();
    return env && env.os ? env.os : undefined;
}
exports.detectOS = detectOS;
function isIOS() {
    const os = detectOS();
    return os ? os.toLowerCase().includes("ios") : false;
}
exports.isIOS = isIOS;
function isMobile() {
    const os = detectOS();
    return os ? os.toLowerCase().includes("android") || os.toLowerCase().includes("ios") : false;
}
exports.isMobile = isMobile;
function isNode() {
    const env = detectEnv();
    const result = env && env.name ? env.name.toLowerCase() === "node" : false;
    return result;
}
exports.isNode = isNode;
function isBrowser() {
    const result = !isNode() && !!getNavigatorUnsafe();
    return result;
}
exports.isBrowser = isBrowser;
function unsafeGetFromWindow(name) {
    let res = undefined;
    try {
        if (typeof window !== "undefined" && typeof window[name] !== "undefined") {
            res = window[name];
        }   
    } catch (error) {
        console.error(error)
    }
    return res;
}
exports.unsafeGetFromWindow = unsafeGetFromWindow;
function safeGetFromWindow(name) {
    const res = unsafeGetFromWindow(name);
    if (!res) {
        throw new Error(`${name} is not defined in Window`);
    }
    return res;
}
exports.safeGetFromWindow = safeGetFromWindow;
function getDocument() {
    return safeGetFromWindow("document");
}
exports.getDocument = getDocument;
function getDocumentUnsafe() {
    return unsafeGetFromWindow("document");
}
exports.getDocumentUnsafe = getDocumentUnsafe;
function getNavigator() {
    return safeGetFromWindow("navigator");
}
exports.getNavigator = getNavigator;
function getNavigatorUnsafe() {
    return unsafeGetFromWindow("navigator");
}
exports.getNavigatorUnsafe = getNavigatorUnsafe;
function getLocation() {
    return safeGetFromWindow("location");
}
exports.getLocation = getLocation;
function getLocationUnsafe() {
    return unsafeGetFromWindow("location");
}
exports.getLocationUnsafe = getLocationUnsafe;
function getCrypto() {
    return safeGetFromWindow("crypto");
}
exports.getCrypto = getCrypto;
function getCryptoUnsafe() {
    return unsafeGetFromWindow("crypto");
}
exports.getCryptoUnsafe = getCryptoUnsafe;
function getLocalStorage() {
    return safeGetFromWindow("localStorage");
}
exports.getLocalStorage = getLocalStorage;
function getLocalStorageUnsafe() {
    return unsafeGetFromWindow("localStorage");
}
exports.getLocalStorageUnsafe = getLocalStorageUnsafe;
function getMeta() {
    let doc;
    let loc;
    try {
        doc = getDocument();
        loc = getLocation();
    }
    catch (e) {
        return null;
    }
    function getIcons() {
        const links = doc.getElementsByTagName("link");
        const icons = [];
        for (let i = 0; i < links.length; i++) {
            const link = links[i];
            const rel = link.getAttribute("rel");
            if (rel) {
                if (rel.toLowerCase().indexOf("icon") > -1) {
                    const href = link.getAttribute("href");
                    if (href) {
                        if (href.toLowerCase().indexOf("https:") === -1 &&
                            href.toLowerCase().indexOf("http:") === -1 &&
                            href.indexOf("//") !== 0) {
                            let absoluteHref = loc.protocol + "//" + loc.host;
                            if (href.indexOf("/") === 0) {
                                absoluteHref += href;
                            }
                            else {
                                const path = loc.pathname.split("/");
                                path.pop();
                                const finalPath = path.join("/");
                                absoluteHref += finalPath + "/" + href;
                            }
                            icons.push(absoluteHref);
                        }
                        else if (href.indexOf("//") === 0) {
                            const absoluteUrl = loc.protocol + href;
                            icons.push(absoluteUrl);
                        }
                        else {
                            icons.push(href);
                        }
                    }
                }
            }
        }
        return icons;
    }
    function getMetaOfAny(...args) {
        const metaTags = doc.getElementsByTagName("meta");
        for (let i = 0; i < metaTags.length; i++) {
            const tag = metaTags[i];
            const attributes = ["itemprop", "property", "name"]
                .map(target => tag.getAttribute(target))
                .filter(attr => {
                if (attr) {
                    args.includes(attr);
                }
            });
            if (attributes.length && attributes) {
                const content = tag.getAttribute("content");
                if (content) {
                    return content;
                }
            }
        }
        return "";
    }
    function getName() {
        let name = getMetaOfAny("name", "og:site_name", "og:title", "twitter:title");
        if (!name) {
            name = doc.title;
        }
        return name;
    }
    function getDescription() {
        const description = getMetaOfAny("description", "og:description", "twitter:description", "keywords");
        return description;
    }
    const name = getName();
    const description = getDescription();
    const url = loc.origin;
    const icons = getIcons();
    const meta = {
        description,
        url,
        icons,
        name,
    };
    return meta;
}
exports.getMeta = getMeta;
//# sourceMappingURL=browser.js.map