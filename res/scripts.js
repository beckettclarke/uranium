function loadContent(){

}


setTimeout(loadContent,300);

function addLog(){
  if (str.split(/\r\n|\r|\n/).length > 10){
    
  }
  var lz = document.getElementById('logterminal');
  lz.value=lz.value+'\ncheese'
  var lines = textblock.split('\n');
  // remove one line, starting at the first position
  lines.splice(0,1);
  // join the array back into a single string
  var newtext = lines.join('\n');

}
setInterval(addLog,10)