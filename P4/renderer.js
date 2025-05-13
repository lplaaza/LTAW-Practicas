const { ipcRenderer } = require('electron');
const QRCode = require('qrcode');

ipcRenderer.on('info', (event, info) => {
    document.getElementById('node').textContent = `Node: ${info.node}`;
    document.getElementById('electron').textContent = `Electron: ${info.electron}`;
    document.getElementById('chrome').textContent = `Chrome: ${info.chrome}`;
    document.getElementById('url').textContent = `Clientes deben conectarse a: ${info.url}`;

    const contenedor = document.getElementById('mensajes');
    info.mensajes.forEach(msg => {
        const p = document.createElement('p');
        p.textContent = msg;
        contenedor.appendChild(p);
    });

    // Generar QR con la URL
    QRCode.toCanvas(document.getElementById('qrcode'), info.url, function (error) {
        if (error) console.error(error);
        console.log('QR generado!');
    });
});

ipcRenderer.on('nuevo-mensaje', (event, msg) => {
    const contenedor = document.getElementById('mensajes');
    const p = document.createElement('p');
    p.textContent = msg;
    contenedor.appendChild(p);
    contenedor.scrollTop = contenedor.scrollHeight;
});

document.getElementById('botonTest').addEventListener('click', () => {
    ipcRenderer.invoke('test');
});
