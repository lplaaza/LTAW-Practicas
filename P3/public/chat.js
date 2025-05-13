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
        addMessage(`💬 ${nickname}: ${input.value}`, true); // Mostramos localmente
        socket.emit('chat message', input.value);
        input.value = '';
    }
});

input.addEventListener('input', () => {
    socket.emit('typing');
});

socket.on('chat message', (msg) => {
    if (!msg.includes(nickname)) {
        addMessage(msg, false);
        notifySound.play();
    }
});

socket.on('typing', (user) => {
    typing.textContent = user;
    setTimeout(() => typing.textContent = '', 2000);
});

function addMessage(msg, isSelf) {
    const item = document.createElement('li');
    item.classList.add('message');
    item.classList.add(isSelf ? 'self' : 'other');
    item.textContent = msg;
    messages.appendChild(item);
    messages.scrollTop = messages.scrollHeight;
}
