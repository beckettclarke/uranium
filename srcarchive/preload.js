console.log('✅ Preload script');
vars='{"app_name":"Uranium","app_version":"2.3.3"}';
function loadvars(i) {
  // Parse JSON input
  const d = JSON.parse(i);

  // Get the HTML content of the current page
  let hc = document.body.innerHTML;

  // Replace placeholders in HTML content
  for (const key in d) {
    if (d.hasOwnProperty(key)) {
      const r = new RegExp('{'+key+'}', 'g');
      hc = hc.replace(r, d[key]);
    }
  }

  // Update the HTML content of the current page
  document.body.innerHTML = hc;
}


const { contextBridge, ipcRenderer } = require('electron');

window.store = {
  get: async (key) => await ipcRenderer.invoke('get', key),
  set: (key, value) => ipcRenderer.send('set', key, value)
}

contextBridge.exposeInMainWorld(
  "store", 
  {
    get: async (key) => await ipcRenderer.invoke('get', key),
    set: (key, value) => ipcRenderer.send('set', key, value)
  }
);

console.log('🌉 Bridged window.store to main world');

/* if (!window.store.get('settings')){
  window.store.set('settings', '{"name":"","theme":"#0066FF","beta":false}');
  console.log('❌ Reset Settings');
} */