window.onload = function() {
    // Инициализация карты Leaflet
    if (document.getElementById('map')) {
        const map = L.map('map').setView([55.7961, 37.4911], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
        L.marker([55.7961, 37.4911]).addTo(map)
            .bindPopup('МИЭМ НИУ ВШЭ');
    }

    // Элементы чата
    const chatMessages = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');
    const voiceBtn = document.getElementById('voice-btn');
    
    if (!chatMessages || !chatInput || !chatSend) return;

    // Ключевые слова и ответы
    const keywords = {
        'привет': 'Привет! Чем могу помочь?',
        'здравствуй': 'Добрый день!',
        'курс': 'Учусь на 4 курсе МИЭМ',
        'вшэ': 'ВШЭ - лучший университет!',
        'миэм': 'МИЭМ - мой факультет',
        'математика': 'Обожаю математику!',
        'проект': 'Могу рассказать о своих проектах',
        'контакты': 'Напиши на почту: example@edu.hse.ru',
        'по умолчанию': 'Интересный вопрос... Задам преподавателю :)'
    };

    // Отправка сообщения
    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Сообщение пользователя
        addMessage(text, 'user');
        chatInput.value = '';

        // Автоответ
        setTimeout(() => {
            let reply = keywords['по умолчанию'];
            const lowerText = text.toLowerCase();
            
            for (let [word, answer] of Object.entries(keywords)) {
                if (lowerText.includes(word)) {
                    reply = answer;
                    break;
                }
            }
            
            addMessage(reply, 'bot');
        }, 500);
    }

    // Добавление сообщения в чат
    function addMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-message ${sender}-message`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Голосовое сообщение (фиктивное)
    function sendVoice() {
        addMessage('Голосовое сообщение (2 сек)', 'user');
        setTimeout(() => {
            addMessage('Распознано: "Привет, как дела?"', 'bot');
        }, 500);
    }

    // Обработчики событий
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
    
    if (voiceBtn) {
        voiceBtn.addEventListener('click', sendVoice);
    }
};
