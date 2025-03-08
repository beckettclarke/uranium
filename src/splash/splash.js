//document.getElementById('introreveal').style.width='0px';
setTimeout(
  function(){
   //document.getElementById('introreveal').style.width=null;

  },1000
)

function lm(t,m){
  setTimeout(function(){document.getElementById('loadingtext').innerHTML=m},t+2000)
}
lm(50,'Checking License');
lm(500,'Checking Connection');
lm(1700,'Loading Themes');
lm(1900,'Loading Settings');
lm(2200,'Checking cache');

let incs = 59
let ms = 5000;
let counter = 1;
let inc = 2000/incs;

const interval = setInterval(() => {
  lm(ms,`Loading Plugins... (${counter}/${incs})`);
  ms += inc;
  counter++;

  if (counter > incs) {
    clearInterval(interval);
  }
}, 1);

lm(7500,'Opening...');
