const Megogo = {
    init() {
        console.log('megogo init');
        window.addEventListener("message", (function (pEvent) {
            if (pEvent.data.method) {
                this.getMessage(pEvent.data);
            }
        }).bind(this), false);
    },

    sendMessage(data) {
        console.log('[->] Megogo game sendMessage', data);
        var target = window.parent !== null && window.parent !== window ? window.parent : window;
        target.postMessage(data, '*');
    },

    getMessage(data) {
        console.log('[<-] Megogo game getMessage', data);
        switch(data.method) {
            case 'landing:init': {
                // Handle initialization method
                break;
            }
            // Add more cases as needed
        }
    },

    quitMessage(){
        this.sendMessage({method: 'landing:back', data: null}); // -_-
        this.sendMessage({method: 'landing:close', data: null});
    }
}

Megogo.sendMessage({method: 'landing:loaded', data: null});
Megogo.sendMessage({method: 'landing:start', data: null});

window.addEventListener("load", ()=> {
    Megogo.init();
    const app = pc.Application.getApplication();
    //console.log('app', app);
    //app.once('preload:start', ()=>Megogo.sendMessage({method: 'landing:loaded', data: null}));ъ
    
    Megogo.sendMessage({method: 'landing:loaded', data: null});
    Megogo.sendMessage({method: 'landing:start', data: null});
    app.once('start', ()=>Megogo.sendMessage({method: 'landing:start', data: null}));
});