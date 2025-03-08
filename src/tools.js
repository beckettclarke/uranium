function resetMenus(){
  document.getElementById('iplookupresult').style.display='none';
  document.getElementById('iplookupfield').value=null;
}

function lookupIP(){
  document.getElementById('ipbmain').style.display='none';
  document.getElementById('ipbload').style.display='inline';
  const options = {method: 'GET'};
  fetch('https://ipwho.is/'+document.getElementById('iplookupfield').value+'', options)
    .then(response => response.json())
    .then(response => parseIPResults(response))
    .catch(err => console.error(err));
}
function dqr(s,v){document.querySelector('f[f="'+s+'"]').innerHTML=v;console.log('replace '+s+' with '+v);}
function parseIPResults(r){
  document.getElementById('ipbmain').style.display='inline';
  document.getElementById('ipbload').style.display='none';
  document.getElementById('iplookupresult').style.display='block';
  dqr('ip',r.ip);
  dqr('country',r.country);
  dqr('city',r.city);
  dqr('region',r.region);
  dqr('postal',r.postal);
  dqr('latitude',r.latitude);
  dqr('longitude',r.longitude);
  dqr('org',r.connection.org);
  dqr('isp',r.connection.isp);
  dqr('asn',r.connection.asn);
  dqr('timezone',r.timezone.id);
}