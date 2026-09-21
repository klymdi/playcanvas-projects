const AnalyticsHelper = {
    /**@param {String} eventName
     * @param {Object} eventData
    */
    sendEvent(eventName, eventData){
        //
        console.log('[AnalyticsHelper] sendEvent', eventName, eventData);
        //
        if(window.firebase && firebase.analyticsInstance){
            firebase.analyticsInstance.logEvent(eventName, eventData);
        }
        else if(window.gtag) gtag('event', eventName, eventData);
        //
    },
}