const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dayjs = require('dayjs');
const os = require('os');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let users = {};
let mensajes = [];

io.on('connection', (socket) => {
    socket.on('set nickname', (nickname) => {
        users[socket.id] = nickname;
        const msg = `🎉 Bienvenido, ${nickname}`;
        socket.emit('chat message', msg);
        io.emit('chat message', `🔔 ${nickname} se ha conectado`);
        mensajes.push(msg);
    });

    socket.on('chat message', (msg) => {
        const nickname = users[socket.id] || 'Anónimo';
        let output;
        if (msg.startsWith('/')) {
            switch (msg) {
                case '/help': output = 'Comandos: /help, /list, /hello, /date'; break;
                case '/list': output = `Usuarios conectados: ${Object.keys(users).length}`; break;
                case '/hello': output = `¡Hola, ${nickname}!`; break;
                case '/date': output = `Fecha actual: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`; break;
                default: output = 'Comando no reconocido. Usa /help';
            }
            socket.emit('chat message', `🟡 [COMANDO] ${output}`);
            mensajes.push(`[CMD] ${output}`);
        } else {
            const full = `💬 ${nickname}: ${msg}`;
            io.emit('chat message', full);
            mensajes.push(full);
        }
    });

    socket.on('disconnect', () => {
        const nickname = users[socket.id] || 'Usuario';
        delete users[socket.id];
        const msg = `❌ ${nickname} se ha desconectado`;
        io.emit('chat message', msg);
        mensajes.push(msg);
    });
});

function getIP() {
    const interfaces = os.networkInterfaces();
    for (let iface of Object.values(interfaces).flat()) {
        if (iface.family === 'IPv4' && !iface.internal) return iface.address;
    }
    return 'localhost';
}

const HOST = getIP();
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://${HOST}:${PORT}`);
});

module.exports = {
    HOST,
    PORT,
    mensajes,
    io
};
