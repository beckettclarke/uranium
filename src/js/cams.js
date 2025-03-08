var camcount = 0;
function toggleCamView(t,u,n,i){
  if (document.querySelector('cam[uuid="'+i+'"]')){
    camcount--;
    document.querySelector('cam[uuid="'+i+'"]').remove();
  } else {
    if (camcount == maxcams){
      exit;
    }
    camcount++
    var c = document.createElement('cam');
    c.setAttribute('name',n);
    c.setAttribute('uuid',i);
    c.innerHTML='<video class="camvid" name="'+n+'" uuid="'+i+'"></video><div class="camloader"><div><div></div></div><span luuid="'+i+'"></span></div><span>'+n+'</span>';
    // c.innerHTML='<iframe src="'+u+'" allowfullscreen></iframe>';
    document.getElementById('cams').appendChild(c);
    if (t === 'hls'){
      console.log('HLS with i of ' + i);
      loadHLS(document.querySelector('video.camvid[uuid="'+i+'"]'),u,document.querySelector('span[luuid="'+i+'"]'))
    }
  }
  var cb=document.querySelector('button[cuuid="'+i+'"]');
  var cbi=document.querySelector('button[cuuid="'+i+'"] > i');
  console.log(cb);
  console.log(cbi)
  cb.classList.toggle('activecam');
  cbi.classList.toggle('fas');
  cbi.classList.toggle('far');
  var cbi=document.querySelector('button[cuuid="'+i+'"] > i');
  document.getElementById('cams').setAttribute('camcount',camcount);
  var csb = document.getElementById('camsidebar')
  if (camcount == maxcams){
    csb.classList.add('disabled');
  } else {
    csb.classList.remove('disabled');
  }
}
function addCamToList(n,t,i,u,uu){
  var c = document.createElement('button');
  c.classList.add('cam');
  c.setAttribute('cname',n);
  c.setAttribute('cuuid',uu);
  c.innerHTML='<i class="far fa-'+i+'"></i> '+n;
  c.addEventListener('click',function(){toggleCamView(t,u,n,uu)});
  document.getElementById('cambuttons').appendChild(c);
}
function loadHLS(p,s,el) {
  console.log('Loading HLS Stream');
  console.log(p);
  if (Hls.isSupported()) {
    console.log('HLS Supported');
    if (!p){
      console.log('❌ Video target not found');
    }
    var hls = new Hls();
    el.innerHTML='Loading Source...';
    hls.loadSource(s);
    el.innerHTML='Attatching Media...';
    hls.attachMedia(p);
    el.innerHTML='Fetching chunks...';
    hls.on(Hls.Events.MANIFEST_PARSED, function () {
      el.innerHTML='Loading...';
      p.play();
      console.log('✅ Loaded HLS Stream');
    });
  } 
  // SAFARI ONLY CODE, PROB WON'T NEED (Electron is GG Chrome)
  // else if (p.canPlayType("application/vnd.apple.mpegurl")) {
  //   p.src = s; // For Safari
  //   p.addEventListener("loadedmetadata", function () {
  //     p.play();
  //   });
  // }
}


function createCamEntry(){
  var n = document.getElementById('camname').value;
  var t = document.getElementById('camtype').value;
  var i = document.querySelector('.activecicon').getAttribute('icon');
  var u = document.getElementById('camurl').value;
  var uu = uuid();
  storeCamData(n,t,i,u,uu);
  addCamToList(n,t,i,u,uu);
  cm();
}

function storeCamData(name, type, icon, url) {
  if (!settings.cams) {
    console.log('set cams');
    settings.cams = {};
  }
  if (!Array.isArray(settings.cams.camlist)) {
    console.log('set camlist');
    settings.cams.camlist = [];
  }
  const camList = settings.cams.camlist;
  const camData = {
    name: name,
    type: type,
    icon: icon,
    url: url,
    uuid: uuid()
  };
  console.log(camData);
  camList.push(camData);
  window.store.set('settings', JSON.stringify(settings));
  updateSettings();
}

function pushNewCams(){
  storeCamData('Rainbow Bridge towards USA','hls','video','https://s52.nysdot.skyvdn.com/rtplive/R5_103/playlist.m3u8');
  storeCamData('I-90 At Exit 4','hls','video','https://s58.nysdot.skyvdn.com/rtplive/TA_140/playlist.m3u8');
  storeCamData('I-90 At Exit 6','hls','video','https://s58.nysdot.skyvdn.com/rtplive/TA_163/playlist.m3u8');
  storeCamData('I-90 At Exit 16','hls','video','https://s58.nysdot.skyvdn.com/rtplive/TA_154/playlist.m3u8');
  storeCamData('I-90 At Exit 54','hls','video','https://s58.nysdot.skyvdn.com/rtplive/TA_123/playlist.m3u8');
  storeCamData('I-90 At Exit 50A','hls','video','https://s58.nysdot.skyvdn.com/rtplive/TA_112/playlist.m3u8');
  storeCamData('I-190 At Peace Bridge','hls','video','https://s58.nysdot.skyvdn.com/rtplive/TA_148/playlist.m3u8');
}

function addAllCams() {
  const camList = settings.cams.camlist;
  camList.forEach(cam => {
    addCamToList(cam.name, cam.type, cam.icon, cam.url, cam.uuid);
  });
}

function removeCam(uu) {
  const camList = settings.cams.camlist;
  const index = camList.findIndex(cam => cam.uuid === uu);
  if (index !== -1) {
    camList.splice(index, 1);
    window.store.set('settings', JSON.stringify(settings));
    updateSettings();
  }
}