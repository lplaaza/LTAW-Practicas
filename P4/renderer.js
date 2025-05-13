const { ipcRenderer } = require('electron');
const socket = require('socket.io-client')('http://localhost:3000');

ipcRenderer.on('server-info', (event, data) => {
  document.getElementById('node').textContent = data.node;
  document.getElementById('chrome').textContent = data.chrome;
  document.getElementById('electron').textContent = data.electron;
  document.getElementById('url').textContent = data.url;
  document.getElementById('qr').src = data.qrDataUrl;
});

document.getElementById('testBtn').addEventListener('click', () => {
  socket.emit('chat message', '📢 Mensaje de prueba desde el servidor Electron');
});

socket.on('chat message', (msg) => {
  const li = document.createElement('li');
  li.textContent = msg;
  document.getElementById('messages').appendChild(li);
});
