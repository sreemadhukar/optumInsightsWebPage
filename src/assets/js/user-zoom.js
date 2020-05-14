export default function userZoomInit() {
  function userzoom() {
    var uz = document.createElement('script');
    uz.type = 'text/javascript';
    uz.async = true;
    uz.charset = 'utf-8';

    uz.src =
      ('https:' == document.location.protocol ? 'https://' : 'http://') +
      'cdn5.userzoom.com/files/js/QzE2MVQ5.js?t=uz_til&cuid=C4D7AAAD43F6DF1188490022196C4538';

    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(uz, s);
  }

  const trigger = setInterval(() => {
    if (sessionStorage.getItem('currentUser')) {
      userzoom();
      clearInterval(trigger);
    }
  }, 1000);
}
