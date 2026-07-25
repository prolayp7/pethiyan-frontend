import Script from "next/script";

export default function Plerdy() {
  return (
    <Script id="plerdy" data-plerdy_code="1" strategy="lazyOnload">
      {`(function(w,d){
  if(w.__plerdyCode)return;
  w.__plerdyCode=1;
  w._protocol=w.location.protocol=="https:"?"https://":"http://";
  w._site_hash_code="a520b06ef4f614356dd5b11c88924158";
  w._suid=79072;
  var s=d.createElement("script");
  s.async=true;
  s.referrerPolicy="strict-origin-when-cross-origin";
  s.src="https://a.plerdy.com/public/js/click/main.js?v="+Math.random();
  d.head.appendChild(s);
})(window,document);`}
    </Script>
  );
}
