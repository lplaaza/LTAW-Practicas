const electron = require('electron');
const os = require('os');
const QRCode = require('qrcode');

let win = null;

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let alias of interfaces[iface]) {
      if (alias.family === 'IPv4' && !alias.internal) {
        return alias.address;
      }
    }
  }
  return 'localhost';
}

electron.app.on('ready', () => {
  win = new electron.BrowserWindow({
    width: 600,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile("index.html");

  win.webContents.once('did-finish-load', async () => {
    const ip = getLocalIP();
    const url = `http://${ip}:3000`;

    const qrDataUrl = await QRCode.toDataURL(url);

    win.webContents.send('server-info', {
      ip,
      url,
      qrDataUrl,
      node: process.versions.node,
      chrome: process.versions.chrome,
      electron: process.versions.electron
    });
  });
});

electron.ipcMain.handle('test', (event, msg) => {
  console.log("-> Mensaje recibido desde interfaz: " + msg);
});
