(() => {
    var scriptsUrls = [
        'https://megogo.games/utils/physics/p2.min.js',
    ];

    for(let scriptUrl of scriptsUrls){
        const script = document.createElement("script");
        script.src = scriptUrl;
        script.type = "text/javascript";
        document.head.appendChild(script)
            // .addEventListener('load', event => {
            //     console.log('script loaded', scriptUrl);
            // });
    }
})();