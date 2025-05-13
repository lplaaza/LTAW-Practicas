const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { HOST, PORT } = require('./server');

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('renderer.html');
}

app.whenReady().then(createWindow);

ipcMain.handle('get-info', () => {
    return {
        node: process.versions.node,
        chrome: process.versions.chrome,
        electron: process.versions.electron,
        serverUrl: `http://${HOST}:${PORT}`
    };
});
