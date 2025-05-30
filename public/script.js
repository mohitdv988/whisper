const socket = io();
const statusDiv = document.getElementById('status');
const chatBox = document.getElementById('chat-box');
const messages = document.getElementById('messages');
const input = document.getElementById('input');
const newChatBtn = document.getElementById('new-chat');

const typingIndicator = document.getElementById('typing-indicator');
let typingTimeout;
function addMessage(text, sender) {
  const div = document.createElement('div');
  div.textContent = text;
  div.classList.add(sender);
  messages.appendChild(div);
  messages.scrollTop = messages.scrollHeight;
}


socket.on('waiting', () => {
  statusDiv.innerText = 'Waiting for a partner...';
  statusDiv.style.display = 'block';
  chatBox.hidden = true;
  newChatBtn.hidden = true;
  input.disabled = false;
});

socket.on('partner-connected', () => {
  statusDiv.style.display = 'none';
  chatBox.hidden = false;
  newChatBtn.hidden = true;
  input.disabled = false;
  addMessage('You are now connected. Say hi!', 'system');
});

socket.on('message', (msg) => {
  addMessage("Stranger: " + msg, 'stranger');
});

socket.on('partner-disconnected', () => {
  addMessage('Stranger disconnected. Waiting for a new partner...', 'system');
  input.disabled = true;
  chatBox.hidden = true;
  statusDiv.innerText = 'Waiting for a partner...';
  statusDiv.style.display = 'block';
  newChatBtn.hidden = false;
});

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && input.value.trim() !== '') {
    socket.emit('message', input.value);
    addMessage('You: ' + input.value, 'you');
    input.value = '';
  }
});

newChatBtn.addEventListener('click', () => {
  window.location.reload();
});

socket.on('chat message', (msg) => {
  appendMessage(msg, 'Stranger');
});
