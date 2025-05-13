const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const dayjs = require('dayjs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static('public'));

let users = {}; // socket.id => nickname

io.on('connection', (socket) => {
    // Esperar nickname
    socket.on('set nickname', (nickname) => {
        users[socket.id] = nickname;

        socket.emit('chat message', `🎉 Bienvenido, ${nickname}`);
        socket.broadcast.emit('chat message', `🔔 ${nickname} se ha conectado`);
    });

    // Mensajes
    socket.on('chat message', (msg) => {
        const nickname = users[socket.id] || 'Anónimo';
        if (msg.startsWith('/')) {
            let response;
            switch (msg) {
                case '/help':
                    response = 'Comandos: /help, /list, /hello, /date';
                    break;
                case '/list':
                    response = `Usuarios conectados: ${Object.keys(users).length}`;
                    break;
                case '/hello':
                    response = `¡Hola, ${nickname}!`;
                    break;
                case '/date':
                    response = `Fecha actual: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`;
                    break;
                default:
                    response = 'Comando no reconocido. Usa /help';
            }
            socket.emit('chat message', `🟡 [COMANDO] ${response}`);
        } else {
            io.emit('chat message', `💬 ${nickname}: ${msg}`);
        }
    });

    // Indicador "escribiendo..."
    socket.on('typing', () => {
        const nickname = users[socket.id] || 'Alguien';
        socket.broadcast.emit('typing', `${nickname} está escribiendo...`);
    });

    // Desconexión
    socket.on('disconnect', () => {
        const nickname = users[socket.id] || 'Usuario';
        delete users[socket.id];
        socket.broadcast.emit('chat message', `❌ ${nickname} se ha desconectado`);
    });
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});