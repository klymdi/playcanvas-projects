const AnalyticsHelper = {
    /**@param {String} eventName
     * @param {Object} eventData
    */
    sendEvent(eventName, eventData=undefined){
        // console.log('[AnalyticsHelper] sendEvent', eventName, eventData);
        if(window.location.hostname == 'launch.playcanvas.com') {
            // console.log('analytics was not realy sent in test env (launch.playcanvas.com)');
            return;
        }
        if(window.gtag) gtag('event', eventName, eventData);
    },
}