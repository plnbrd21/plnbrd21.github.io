window.onload = function() {
    // Инициализация карты Leaflet
    if (document.getElementById('map')) {
        const map = L.map('map').setView([55.8030, 37.4096], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        }).addTo(map);
        L.marker([55.8030, 37.4096]).addTo(map)
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

        addMessage(text, 'user');
        chatInput.value = '';

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

    // Запись гс
    let mediaRecorder;
    let audioChunks = [];

    // Запрос доступа к микрофону при нажатии
    voiceBtn.addEventListener('click', async () => {
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            // Остановка записи
            mediaRecorder.stop();
            voiceBtn.textContent = 'записано';
            voiceBtn.style.background = 'var(--accent)';
        } else {
            try {
                // Запрос доступа к микрофону
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                
                mediaRecorder = new MediaRecorder(stream);
                audioChunks = [];

                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };

                mediaRecorder.onstop = () => {
                    // Создаем аудиофайл (но никуда не отправляем)
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    
                    // Показываем сообщение о голосовом
                    addMessage(' Голосовое сообщение записано', 'user');
                    
                    // Останавливаем все треки микрофона
                    stream.getTracks().forEach(track => track.stop());
                    
                    // Автоответ на голосовое
                    setTimeout(() => {
                        addMessage(' Получил голосовое! Скоро послушаю', 'bot');
                    }, 500);
                };

                mediaRecorder.start();
                voiceBtn.textContent = 'запись';
                voiceBtn.style.background = 'var(--error)';
                
            } catch (err) {
                alert('Нет доступа к микрофону');
                console.error(err);
            }
        }
    });

    // Обработчики для текстовых сообщений
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
};
