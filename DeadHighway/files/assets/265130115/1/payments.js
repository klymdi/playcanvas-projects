window.isFlutterWebView = location.search.indexOf('flutter') !== -1;

const Payments = {
    enabled: true,
    gameName: 'Dead Highway',
    orders: [],
    /**@type {pc.AppBase} */
    app: null,
    timer: 0,
    checkDelay: 5,
    checkTimer: 10,
    paymentLink: '',
    qrCodeElement: null,
    qrCode: null,
    /**@type {pc.EventHandler} */
    checkEventHandler: null,
    baseOrderData: 
    {
        order: {
            order_id: "-",
            amount: 100,
            currency: "UAH",
            order_description: 'Game',
            order_metadata: {items:'itemsJson'},
            type: "auth",
            settle_interval: 0,
            google_pay_allowed_auth_methods: ["PAN_ONLY"],
            //traffic_source: "facebook",
            //transaction_source: "main_menu",
            language: "en",
            //website: "https://solidgate.com",
            //success_url: "http://merchant.example/success",
            //fail_url: "http://merchant.example/fail"
        },
        page_customization: {
            public_name: "Megogo Games",
            order_title: 'Game',
            //order_description: this.gameName,
            button_font_color: "#FFFFFF",
            button_color: "#00816A",
            font_name: "Open Sans",
            is_cardholder_visible: true,
            //terms_url: "https://solidgate.com/terms",
            //back_url: "https://solidgate.com"
        }
    },
    init(app) {
        this.app = app;
        this.baseOrderData.order.order_description = this.gameName;
        //this.baseOrderData.page_customization.order_description = this.gameName;
        this.orders = SaveTool.getItem('orders', []);
        //
        //qr
        this.qrCodeElement = document.createElement('canvas');
        this.qrCodeElement.id = "qrCode";
        this.qrCodeElement.style = "cursor: not-allowed; pointer-events: none;" +
            "top: 50%; left: 50%; transform: translate(-50%, -50%); -webkit-transform: translate(-50%, -50%);" + //center
            "position: absolute;" +
            "width:50vmin; height:50vmin; z-index:2;";

        this.qrCodeElement.style.display = 'none';
        
        document.body.appendChild(this.qrCodeElement);
        //
        this.qrCode = new QRious({
            element: this.qrCodeElement,
            padding: 32,
            size: 1024,
            value: ''
        });
    },
    async flutterCall(type, data = undefined) {
        if(!window.flutter_inappwebview) {
            console.error('window.flutter_inappwebview not set');
            return null;
        }
        return await window.flutter_inappwebview.callHandler('main', {
            type, data
        });
    },

    purchase(item, price){
        if(window.isFlutterWebView) {
            this.flutterCall('purchase', item);
        }
        else {
            this.baseOrderData.order.amount = Math.round(price * 100);
            this.baseOrderData.order.order_metadata.items = JSON.stringify([item]);
            this.getLink();
        }
    },

    async getProduct(productId){
        /**@type [] */
        var products = await this.getProducts();
        if(!products) return null
        const product = products.find(x=>x.id === productId);
        if(!product) return null
        return product;
    },

    async getProducts(){
        if(!window.isFlutterWebView) return null;
        if(this.products) return this.products;
        this.products = await this.flutterCall('getProducts');
        return this.products;
    },

    //4067429974719265
    getLink(){
        this.baseOrderData.order.amount = Math.round(this.baseOrderData.order.amount);
        if(this.checkEventHandler !== null){
            this.checkEventHandler.off();
        }
        this.timer = -this.checkDelay + this.checkTimer;
        this.checkEventHandler = this.app.on('update', this.timerTick, this);
        this.baseOrderData.order.order_id = 'order_' + Date.now().toString() + '_' + Math.round(Math.random() * 100000).toString();
        console.log('generate order_id', this.baseOrderData.order.order_id);
        //return;
        this.orders.push(this.baseOrderData.order.order_id);
        SaveTool.setItem('orders', this.orders);
        //
        const jsonString = JSON.stringify(this.baseOrderData);
        //console.log('jsonString\n', jsonString);
        //
        fetch('https://megogo.games/api/getLink', 
        {
            method: "POST",
            headers:
            {
                'Content-Type': 'application/json',
                //'link': 'https://payment-page.solidgate.com/api/v1/link/init' //payment link
                'link': 'https://payment-page.solidgate.com/api/v1/init' //payment page
            },
            body: jsonString
        })
        .then(response => {
            console.log('link response\n', response);
            response.json().then(responeData => {
                console.log('response data\n', responeData);
                console.log('payment url\n', responeData.url);
                console.log('guid\n', responeData.guid);
                this.paymentLink = responeData.url;
                this.qrCodeElement.style.display = 'block';
                this.qrCode.value = responeData.url;
                //window.location.href = responeData.url; //redirect
            })
        })
    },
    checkOrder(order_id){
        let orderData = order_id.split('_');
        let orderTime = Number(orderData[1]);
        let now = Date.now();
        let milisecondsAgo = now - orderTime;
        let hoursAgo = milisecondsAgo / 3600000;
        if(hoursAgo > 24) return;

        console.log('check order\n', order_id, hoursAgo, new Date(orderTime));
        fetch('https://megogo.games/api/getLink', 
        {
            method: "POST",
            headers:
            {
                'Content-Type': 'application/json',
                'link': 'https://pay.solidgate.com/api/v1/status' 
            },
            body: JSON.stringify({
                "order_id": order_id
            })
        }).then(response => {
            console.log('check response\n', response);
            response.json().then(responeData => {
                console.log('check response data\n', responeData);
                if(!responeData.order 
                || responeData.order === null
                || !responeData.order.status) return;
                switch(responeData.order.status){
                    case 'settle_pending':
                    case 'auth_ok':
                    //
                    case 'void_ok':
                    case 'approved':
                    case 'settle_ok':
                    case 'partial_settled':
                        console.log('success order', order_id);
                        const items = JSON.parse(responeData.order_metadata.items);
                        for(const item of items){
                            console.log('reward item', item);
                            this.app.fire('payment-reward', item);
                        }
                        //no break :)
                    case 'auth_failed':
                    case 'declined':
                    case 'refunded':
                        console.log('finished', order_id);
                        var index = this.orders.indexOf(order_id);
                        while(index !== -1){
                            this.orders.splice(index, 1);
                            index = this.orders.indexOf(order_id);
                        }
                        SaveTool.setItem('orders', this.orders);
                        if(order_id === this.baseOrderData.order.order_id){
                            //hide qr
                            console.log('end hide');
                            this.close();
                            this.stopChecking();
                        }
                        break;
                    //
                }
            })
        })
    },
    checkOrders(){
        for(const order_id of this.orders){
            this.checkOrder(order_id);
        }
    },
    timerTick(dt){
        this.timer += dt;
        if(this.timer > this.checkTimer){
            this.timer = 0;
            this.checkOrder(this.baseOrderData.order.order_id);
        }
    },
    stopChecking (){
        if(this.checkEventHandler !== null) 
            this.checkEventHandler.off();
    },
    close(){
        this.qrCodeElement.style.display = 'none';
        if(Main.instance.paymentPanel) Main.instance.paymentPanel.enabled = false;
    }
}


window.addEventListener("load", ()=> {
    const app = pc.Application.getApplication();
    console.log('Payments init', app);
    Payments.init(app);
    //app.once('preload:start', ()=>___);
    //app.once('start', () => app.once('update', ()=>Payments.checkOrders()));
});