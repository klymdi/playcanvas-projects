const googleAnalyticsId = 'G-D6W5C29T7T';

if(googleAnalyticsId.length === 0) {
  console.error('google analytics id is empty');
} else {
  var googleTagManagerScript = document.createElement('script');
  googleTagManagerScript.async = true;
  googleTagManagerScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + googleAnalyticsId;
  document.head.appendChild(googleTagManagerScript);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() { 
      //console.log('gtag', arguments); 
      dataLayer.push(arguments); 
  }
  // Configure gtag with the measurement ID
  googleTagManagerScript.onload = function() {
    gtag('js', new Date());
    //gtag('config', googleAnalyticsId);
    gtag('config', googleAnalyticsId, { cookie_flags: 'SameSite=None;Secure' });
  };
}