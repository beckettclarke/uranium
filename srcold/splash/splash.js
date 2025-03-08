//document.getElementById('introreveal').style.width='0px';
setTimeout(
  function(){
   //document.getElementById('introreveal').style.width=null;

  },1000
)

function lm(t,m){
  setTimeout(function(){document.getElementById('loadingtext').innerHTML=m},t)
}
lm(50,'Checking License...');
lm(500,'Checking Connection...');
lm(700,'Loading Themes...');
lm(900,'Loading Settings...');

let incs = 59
let ms = 1000;
let counter = 1;
let inc = 2750/incs;

const interval = setInterval(() => {
  lm(ms,`Loading Plugins... (${counter}/${incs})`);
  ms += inc;
  counter++;

  if (counter > incs) {
    clearInterval(interval);
  }
}, 1);

lm(4000,'Opening...');
