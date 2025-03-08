// const { upc } = require('electron');
// upc.send('set','theme','red');
// document.body.innerHTML += upc.sendSync('get','theme');


window.parent.postMessage({ type: 'set', key: 'theme', value: 'red' }, '*');

window.parent.postMessage({ type: 'get', key: 'theme' }, '*');

window.addEventListener('message', (event) => {
  if (event.data.type === 'response') {
    console.log(`The value of ${event.data.key} is ${event.data.value}`);
  }
});