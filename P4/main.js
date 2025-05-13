const electron = require('electron');
const { HOST, PORT, mensajes, io } = require('./server');

let win = null;

electron.app.on('ready', () => {
    console.log("Evento Ready!");

    win = new electron.BrowserWindow({
        width: 600,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    win.loadFile("index.html");

    // Enviar mensaje inicial y datos del sistema
    win.webContents.on('did-finish-load', () => {
        win.webContents.send('info', {
            node: process.versions.node,
            electron: process.versions.electron,
            chrome: process.versions.chrome,
            url: `http://${HOST}:${PORT}`,
            mensajes
        });
    });

    // Si llega un nuevo mensaje al servidor, enviarlo a la GUI
    io.on('connection', (socket) => {
        socket.on('chat message', (msg) => {
            win.webContents.send('nuevo-mensaje', msg);
        });
    });
});

// Recibe evento desde botón de prueba
electron.ipcMain.handle('test', () => {
    io.emit('chat message', '[MENSAJE DE PRUEBA DESDE ELECTRON]');
});
