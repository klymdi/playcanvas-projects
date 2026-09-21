const adsScript = document.createElement("script");

window.isFlutterWebView = location.search.indexOf('flutter') !== -1;

if(window.isFlutterWebView) adsScript.src = "https://megogo.games/utils/ads_flutter.js";
else adsScript.src = "https://megogo.games/utils/ads.js";

adsScript.type = "text/javascript";
document.head.appendChild(adsScript).addEventListener('load', event => {
    Ads.appName = 'Tower Defence';
    Ads.appBundle = 'null';
    Ads.appStoreUrl = 'null';

    Ads.init();
});