window.api.getInfo().then(info => {
    const ul = document.getElementById('info');
    ul.innerHTML = `
        <li>Node: ${info.node}</li>
        <li>Electron: ${info.electron}</li>
        <li>Chrome: ${info.chrome}</li>
        <li>URL del servidor: ${info.serverUrl}</li>
    `;
});

const socket = io(); // Se conecta automáticamente a localhost:3000

socket.on('chat message', (msg) => {
    const div = document.getElementById('messages');
    const p = document.createElement('p');
    p.textContent = msg;
    div.appendChild(p);
    div.scrollTop = div.scrollHeight;
});

document.getElementById('testBtn').addEventListener('click', () => {
    socket.emit('chat message', '[MENSAJE DE PRUEBA DESDE EL SERVIDOR]');
});
