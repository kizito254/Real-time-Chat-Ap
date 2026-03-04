const socket = io();
const username = prompt('Enter your name:') || 'Anonymous';

socket.emit('join', username);

const messages = document.querySelector('#messages');
const form = document.querySelector('#chat-form');
const input = document.querySelector('#message-input');

const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const appendElement = (element) => {
  messages.appendChild(element);
  messages.scrollTop = messages.scrollHeight;
};

socket.on('chat-message', ({ username: sender, text, timestamp }) => {
  const item = document.createElement('article');
  item.className = 'message';

  const meta = document.createElement('span');
  meta.className = 'meta';
  meta.textContent = `${sender} • ${formatTime(timestamp)}`;

  const body = document.createElement('div');
  body.textContent = text;

  item.append(meta, body);
  appendElement(item);
});

socket.on('system-message', (text) => {
  const item = document.createElement('div');
  item.className = 'system';
  item.textContent = text;
  appendElement(item);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const message = input.value;
  socket.emit('chat-message', message);
  input.value = '';
  input.focus();
});
