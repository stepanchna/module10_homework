const ws = new WebSocket('wss://echo-ws-service.herokuapp.com');
const chat = document.getElementById('chat');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
const geoBtn = document.getElementById('geoBtn');

// Функция добавления сообщения в чат
function addMessage(text, className) {
  const msg = document.createElement('div');
  msg.textContent = text;
  msg.classList.add('message', className);
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}

// Отправка обычного сообщения
sendBtn.addEventListener('click', () => {
  const text = messageInput.value;
  if (text) {
    ws.send(text);
    addMessage(text, 'from-user');
    messageInput.value = '';
  }
});

// Получение ответа от сервера
ws.addEventListener('message', (event) => {
  // Не отображать ответ на геолокацию
  if (!event.data.startsWith('https://www.openstreetmap.org/')) {
    addMessage(event.data, 'from-server');
  }
});

// Отправка гео-локации
geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    alert('Гео-локация не поддерживается вашим браузером');
    return;
  }

  navigator.geolocation.getCurrentPosition((position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const link = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
    ws.send(link); // отправка серверу (ответ от сервера не отображается)
    addMessage('Гео-локация: ' + link, 'from-user');
  }, () => {
    alert('Не удалось получить гео-локацию');
  });
});
