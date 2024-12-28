import Script from 'next/script';

export default function ChatWidget() {
  return (
    <Script
      id="amo-social-button"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function(a,m,o,c,r,m){
            a[m] = { 
              id: "420953", 
              hash: "3b50dfe848e1a2ab0929b6370657e8c6bdaa6c7bd8f36d4c80cbd945de3646b2", 
              locale: "ru", 
              inline: false, 
              setMeta: function(p) {
                this.params = (this.params || []).concat([p]);
              }
            };
            a[o] = a[o] || function() {
              (a[o].q = a[o].q || []).push(arguments);
            };
            var d = a.document, s = d.createElement('script');
            s.async = true;
            s.id = m + '_script';
            s.src = 'https://gso.amocrm.ru/js/button.js';
            d.head && d.head.appendChild(s);
          })(window, 0, 'amoSocialButton', 0, 0, 'amo_social_button');
        `
      }}
    />
  );
}
