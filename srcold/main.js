// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('node:path');

const Store = require('electron-store');
const store = new Store();
console.log('✅ Imports');

let splash; // Declare the splash screen variable
let mainWindow; // Declare the main window variable

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

function createWindow () {
  // Create the splash screen. This will show before the main window is shown
  splash = new BrowserWindow({
    width: 400,
    height: 300,
    resizable: false,
    backgroundColor: '#00000000', // Set background color to transparent
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, './js/preload.js'),
      nodeIntegration: true
    }
  });

  // Load the splash screen html
  splash.setVibrancy('menu');
  splash.loadFile('./src/splash/splash.html');

  // After 5 seconds, close the splash screen and open the main window
  splash.webContents.on('did-finish-load', () => {
    setTimeout(() => {
      // Check if the splash screen still exists before trying to close it
      if (!splash.isDestroyed()) {
        splash.close();
      }

      const mainWindow = new BrowserWindow({
        width: 1000,
        minWidth: 1000,
        height: 600,
        minHeight: 600,
        titleBarStyle: 'hiddenInset',
        trafficLightPosition: { x: 15, y: 15 },
        title: "Uranium",
        backgroundColor: '#00000000', // Set background color to transparent
        webPreferences: {
          preload: path.resolve(__dirname, './js/preload.js'),
          nodeIntegration: true
        }
      });
      mainWindow.setMenuBarVisibility(false);
      mainWindow.setVibrancy('menu');

      // Load the index.html of the app.
      mainWindow.loadFile('./src/uranium.html');
      console.log('✅ Opened splash');

      // Open the DevTools.
      // mainWindow.webContents.openDevTools();

      mainWindow.on('enter-full-screen', () => {
        mainWindow.setWindowButtonVisibility(true);
      });
      
      mainWindow.on('leave-full-screen', () => {
        mainWindow.setWindowButtonVisibility(true);
      });
    }, 5E1);
  });
}

app.on('ready', createWindow);

process.on('uncaughtException', error => {
	console.error('Exception:', error); 
	app.exit(1);
});

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0 && !mainWindow) createWindow()
})

app.on('window-all-closed', function () {
  app.quit()
})


/* 

store.set('unicorn', '🦄');
console.log(store.get('unicorn'));
//=> '🦄'

Use dot-notation to access nested properties
store.set('foo.bar', true);
console.log(store.get('foo'));
//=> {bar: true}

store.delete('unicorn');
console.log(store.get('unicorn'));
//=> undefined 

*/


ipcMain.handle('get', (event, key) => {
  return store.get(key);
});

ipcMain.on('set', (event, key, value) => {
  store.set(key, value);
});