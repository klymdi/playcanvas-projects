const Megogo = {
    init() {
        console.log('megogo init');
        window.addEventListener("message", (function (pEvent) {
            if (pEvent.data.method) {
                this.getMessage(pEvent.data);
            }
        }).bind(this), false);

        Megogo.sendMessage({method: 'landing:loaded', data: null});
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
                Megogo.sendMessage({method: 'landing:start', data: null});
                break;
            }
        }
    },

    quitMessage(){
        this.sendMessage({method: 'landing:back', data: null}); // -_-
        this.sendMessage({method: 'landing:close', data: null});
    }
}

Megogo.init();