const adsScript = document.createElement("script");

window.isFlutterWebView = location.search.indexOf('flutter') !== -1;

if(window.isFlutterWebView) adsScript.src = "https://megogo.games/utils/ads_flutter.js";
else adsScript.src = "https://megogo.games/utils/ads.js";

adsScript.src = "https://megogo.games/utils/ads.js"; // force vast !!!

adsScript.type = "text/javascript";
adsScript.addEventListener('load', event => {
    Ads.appName = 'Core Chain';
    Ads.appBundle = 'null';
    Ads.appStoreUrl = 'null';
    // Ads.enabled = false;

    Ads.init();
});
document.head.appendChild(adsScript);