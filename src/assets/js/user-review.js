function externalRatingIntercept() {
  //<![CDATA[
  // code removed by ranjith
  _uzactions = window._uzactions || [];
  _uzactions.push(['_setID', '03840ACBBF5CEA11AA60BF52C2E54AD8']);
  _uzactions.push(['_setSID', '0E30EBC3BF5CEA11AA60BF52C2E54AD8']);
  _uzactions.push(['_start']);
  // added back so as to not push un checked changes
  (function() {
    var uz = document.createElement('script');
    uz.type = 'text/javascript';
    uz.async = true;
    uz.id = 'checking';
    uz.charset = 'utf-8';
    uz.src =
      ('https:' == document.location.protocol ? 'https://' : 'http://') +
      'cdn5.userzoom.com/trueintent/js/uz_til_us.js?cuid=C4D7AAAD43F6DF1188490022196C4538';
    // 'cdn5.userzoom.com/files/js/QzE2MVQ5.js?t=uz_til&cuid=C4D7AAAD43F6DF1188490022196C4538';   added by ranjith
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(uz, s);
  })();

  //]]>
}
