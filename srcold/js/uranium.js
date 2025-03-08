// const { ipc } = require('electron');
var maxcams = 8;
function cl(m){
  console.log(m);
  var l = document.getElementById('logs')
  l.innerHTML+='<log><ic>'+m[0]+m[1]+'</ic><time>uranium.main @ '+Date.now()+'</time><desc>'+m.slice(3)+'</desc></log>';
  if (settings){
    if (settings.autoscroll == true){
      l.scrollTop = l.scrollHeight;
    }
  }
}

function exportFile(data, fileName) {
  var blob = new Blob([data], {type: "text/plain"}),
    url = window.URL.createObjectURL(blob);
  var a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
  cl('📤 Exported file '+fileName);
}

cl('🌉 Bridged electron.window.store');

function settingsMenu(){
  document.body.classList.add('dark');
  document.getElementById('settingsWindow').classList.add('show');
  cl('🔧 Opened Settings Menu');
}
function closeSettings(){
  document.body.classList.remove('dark');
  document.getElementById('settingsWindow').classList.remove('show');
  cl('🔧 Closed Settings menu')
}



function switchSetting(e){
  switchClass(e,'active');
  switchClass(document.querySelector('.menu[menu="'+e.textContent.trim()+'"]'),'activeMenu');
  cl('🔄 Switched settings menu to '+e.textContent.trim());
}

function switchClass(e,c){
  document.querySelectorAll('.'+c).forEach(function(e){
    e.classList.toggle(c);
  });
  e.classList.add(c);
}


// document.getElementById('starter').click();
function resetSettings(e){
  settings = JSON.parse('{"name":"User","theme":"#ffffff","font":"Satoshi","privatemode":false,"email":"user@example.com","launchonstart":true,"gpuaccel":true,"advancerender":true,"legacyoptions":false,"safemode":true,"requireverification":true,"bgcol":false,"lightmode":false,"codefont":"Jetbrains Mono","boldfont":true,"windowtitle":"Uranium 3.2","windowicon":"planet-ringed","defaultshell":"zsh","startcmd":"echo $date","launchwithshell":true,"maxthreads":"16","maxtimeout":"15","allowextracpu":false,"hardwareaccel":false,"autodependency":true,"autocleanshell":true,"cachebinaries":true,"prunefiles":true,"retrywitholdbins":true,"npmint":true,"brewint":true,"yarnint":true,"defaultport":"4000","outgoingport":"5000","videoport":"6000","smtpport":"1888","blockunknown":true,"requirevpn":false,"hideip":true,"preferlan":true,"preferdoh":true,"disablehttp":true,"maxconnections":"10","maxoutgoing":"1024","maxincoming":"2048","maxoutspeed":"500","maxinspeed":"500","restrictvpntoknown":false,"restrictvpnlocation":false,"encrypttorrenttraffic":true,"dnsserver":"dns.adguard-dns.com","dnsfallback":"94.140.14.14","workingdir":"~/.uranium/work","cachedir":"/tmp/","packagedir":"~/.uranium/packages","showhidden":false,"maxcachesize":"1024","maxcacheage":"10","keepoldbinaries":true,"cleandirectories":true,"tgzovertargz":true,"splitbigarchives":false,"maxarchivesize":"5","backups":true,"maxbackupsize":"500","backupfrequency":"1","backupcache":false,"backupoldbinaries":false,"backupbinaries":true,"pyinterpreter":"/usr/local/bin/python","pyscriptoverride":true,"pydebugparser":true,"pyverboseimport":true,"pyinteractivemode":true,"pyoptimizebytecode":true,"pychecktabconsistency":true,"pyflags":"-f","dockerintegratedterminal":true,"dockervminbackup":false,"dockerusecontainerd":true,"dockervirtframework":true,"dockerprefervirtiofs":true,"dockersbomindex":true,"dockercpulimit":"8","dockermemlimit":"4","dockerswap":"1","dockerdisksize":"64","dockerextensions":true,"dockerextfrommarketplace":true,"dockershowextensions":true,"autoscroll":true}');
  window.store.set('settings',JSON.stringify(settings));
  if (e){e.blur();}
  updateSettings();
  settingsSetup();
  cl('🌀 Reset Settings')
}

var settings;
async function getSettings(){
  settings = JSON.parse(await window.store.get('settings'));
  if (!settings){
    resetSettings();
    cl('⚙️ Set settings to default')
  }
  cl('📥 Fetched settings');
}
getSettings().then(() => {
  settingsSetup();
  updateSettings();
});

function settingsSetup(){
  document.querySelectorAll('#settingsWindow *[setting]').forEach(function(e){
    var sn=e.getAttribute('setting')
    e.value=settings[sn];
    if (e.tagName == 'BUTTON' && settings[sn] == true){
      e.classList.add('true');
      cl('🔘 Set button '+sn+' to true')
    }
    e.addEventListener('change', function() {updateValue(this);});
    e.addEventListener('input', function() {updateValue(this);});
    cl('📬 Added eventListener for setting '+sn)
  })
}

function updateValue(e){
  var rv = e.value;
  var sn=e.getAttribute('setting')
  settings[sn] = rv;
  window.store.set('settings', JSON.stringify(settings));
  updateSettings();
  cl('📜 Updated setting '+sn+' to '+settings[sn]);
}

function updateSettings(){
  cl('🔄 Updating settings');
  // Update references to settings in the HTML
  document.querySelectorAll('sv').forEach(function(e){
    e.innerHTML = settings[e.getAttribute('s')];
    cl('🔁 Replaced '+e.getAttribute('s')+' with '+settings[e.getAttribute('s')]);
  })
  // Update the theme colour
  document.getElementById('themecolour').innerHTML=':root{--th:'+settings.theme+' !important;}';
  document.getElementById('themefont').innerHTML='body{--f:'+settings.font+';--font:var(--f, JetBrains Mono) !important;}';
  cl('🎨 Updated theme data');
  var toggleClasses = '["privatemode","boldfont","lightmode","bgcol"]';
  var toggleClassesArray = JSON.parse(toggleClasses);
  toggleClassesArray.forEach(function(e){
    document.body.classList.toggle(e, settings[e]);
  });
  document.querySelector('header > i').classList='fas fa-'+settings.windowicon;
  document.querySelector('#iconpreview').classList='fas fa-'+settings.windowicon;
  
}

document.querySelectorAll('button.toggle').forEach(
  function(e){
    e.addEventListener('click', function(){
      e.classList.toggle('true');
      sn=e.getAttribute('setting');
      if(e.classList.contains('true')){
        settings[sn]=true;
      } else {
        settings[sn]=false;
      }
      window.store.set('settings',JSON.stringify(settings));
      updateSettings();
      cl('📜 Updated setting '+sn+' to '+settings[sn]);
    }
  )}
);



function importSettings(e) {
  var input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = function(event) {
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.onload = function() {
      var contents = reader.result;
      settings = JSON.parse(contents);
      window.store.set('settings',JSON.stringify(settings));
      console.log('📥 Imported settings from file ' + file.name);
      settingsSetup();
      updateSettings();
    };

    reader.readAsText(file);
  };

  input.click();
}

function exportLogs() {
  var logsDiv = document.getElementById('logs');
  var logs = Array.from(logsDiv.getElementsByTagName('log'));
  
  var logStrings = logs.map(function(log) {
    var icon = log.getElementsByTagName('ic')[0].textContent;
    var time = log.getElementsByTagName('time')[0].textContent;
    var desc = log.getElementsByTagName('desc')[0].textContent;
    return icon+' '+time+' - '+desc;
  });

  exportFile(logStrings.join('\n'),'uraniumlog.txt')
}




function st(e){
  switchClass(e,'activetab');
  cl('🏠 Switched tab to '+e.id.replace('tab',''))
  switchClass(document.getElementById(e.id.replace('tab','screen')),'activescreen');
}

function openmenu(l){
  document.getElementById('menus').style.display=null;
  document.body.classList.add('dark');
  var m = document.querySelector('menu[menu="'+l+'"' );
  if (!document.querySelector('menu[menu="'+l+'"] > menuheader')){
    m.innerHTML='<menuheader><i class="fa fa-'+m.getAttribute('icon')+'"></i>'+m.getAttribute('title')+'<button onclick="cm();"><i class="fas fa-xmark"></i></button></menuheader>'+m.innerHTML;
  }
  m.classList.add('openmenu');

}

function cm(){
  document.getElementById('menus').style.display='none';
  document.body.classList.remove('dark');
  document.querySelector('.openmenu').classList.remove('openmenu');
}

document.getElementById('camtab').click();

// updateSettings();

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}