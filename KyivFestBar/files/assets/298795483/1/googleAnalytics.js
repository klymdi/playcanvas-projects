const GoogleAnalytics = {
  id:'G-5N7L90MJ3M',

  init(){
    if(this.id.length === 0) {
      console.error('google analytics id is empty');
      return;
    }

    if(window.location.hostname == 'launch.playcanvas.com'){
      console.log('analytics was not realy sent in test env (launch.playcanvas.com)');
      return;
    }

    var googleAnalyticsScript = document.createElement('script');
    googleAnalyticsScript.async = true;
    googleAnalyticsScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + this.id;
    document.head.appendChild(googleAnalyticsScript);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { 
      window.dataLayer.push(arguments); 
    };
    
    googleAnalyticsScript.onload = () => {
      gtag('js', new Date());
      gtag('config', this.id);
    };
  }
}

GoogleAnalytics.init();