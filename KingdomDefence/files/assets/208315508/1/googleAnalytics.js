const id = 'G-D5S0WFPC7P';

if(id.length === 0) {
  console.error('google analytics id is empty');
} else {
  var script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + id;
  document.head.appendChild(script);

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || [];
  function gtag() { 
      //console.log('gtag', arguments); 
      dataLayer.push(arguments); 
  }
  // Configure gtag with the measurement ID
  script.onload = function() {
    gtag('js', new Date());
    gtag('config', id);
  };
}