const socket = io();
const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');
const typing = document.getElementById('typing');
const notifySound = document.getElementById('notifySound');

let nickname = prompt('Introduce tu nombre:') || 'Anónimo';
socket.emit('set nickname', nickname);

form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

input.addEventListener('input', () => {
    socket.emit('typing');
});

socket.on('chat message', (msg) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    
    if (!msg.includes(nickname)) {
        notifySound.play();
    }
});

socket.on('typing', (user) => {
    typing.textContent = user;
    setTimeout(() => typing.textContent = '', 2000);
});
