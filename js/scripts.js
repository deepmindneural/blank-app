// Configuración de la API de OpenAI
// La clave API se carga desde config.js

// Variables globales
let userData = { name: '', email: '', phone: '' };
let quotedItems = [];

// Inicializar cuando se carga la página
window.addEventListener('DOMContentLoaded', function() {
    // Inicializar localStorage
    initLocalStorage();
    
    // Cargar datos
    loadFromLocalStorage();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Enfocar input nombre
    document.getElementById('userName').focus();
});

// Inicializar localStorage si es necesario
function initLocalStorage() {
    // Guardar productos en localStorage si no existen
    if (!localStorage.getItem('printCopyProducts')) {
        localStorage.setItem('printCopyProducts', JSON.stringify(products));
    }
    
    // Inicializar datos de usuario si no existen
    if (!localStorage.getItem('printCopyUserData')) {
        localStorage.setItem('printCopyUserData', JSON.stringify({
            name: '',
            email: '',
            phone: ''
        }));
    }
    
    // Inicializar cotización si no existe
    if (!localStorage.getItem('printCopyQuotedItems')) {
        localStorage.setItem('printCopyQuotedItems', JSON.stringify([]));
    }
    
    // Inicializar historial de chat si no existe
    if (!localStorage.getItem('printCopyChatHistory')) {
        localStorage.setItem('printCopyChatHistory', JSON.stringify([]));
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Event listener para enviar mensaje con Enter
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !this.disabled) {
            sendMessage();
        }
    });
    
    // Event listener para el botón cerrar chat
    document.querySelector('.close-btn').addEventListener('click', toggleChat);
}

// Cargar datos desde localStorage
function loadFromLocalStorage() {
    // Cargar datos del usuario
    userData = JSON.parse(localStorage.getItem('printCopyUserData')) || {
        name: '',
        email: '',
        phone: ''
    };
    
    // Si el usuario ya tiene datos guardados, llenar el formulario y habilitar chat
    if (userData.name && userData.email && userData.phone) {
        document.getElementById('userName').value = userData.name;
        document.getElementById('userEmail').value = userData.email;
        document.getElementById('userPhone').value = userData.phone;
        
        // Mostrar datos en la cotización
        document.getElementById('displayName').textContent = userData.name;
        document.getElementById('displayEmail').textContent = userData.email;
        document.getElementById('displayPhone').textContent = userData.phone;
        
        // Ocultar formulario y habilitar chat
        document.getElementById('userForm').style.display = 'none';
        document.getElementById('messageInput').disabled = false;
        document.getElementById('sendBtn').disabled = false;
        document.getElementById('messageInput').placeholder = `¡Hola ${userData.name}! ¿En qué puedo ayudarte?`;
    }
    
    // Cargar productos cotizados
    quotedItems = JSON.parse(localStorage.getItem('printCopyQuotedItems')) || [];
    updateQuoteDisplay();
    
    // Cargar historial de chat
    const chatHistory = JSON.parse(localStorage.getItem('printCopyChatHistory')) || [];
    restoreChatHistory(chatHistory);
}

// Guardar datos de usuario en localStorage
function saveUserData() {
    const name = document.getElementById('userName').value.trim();
    const email = document.getElementById('userEmail').value.trim();
    const phone = document.getElementById('userPhone').value.trim();

    if (!name || !email || !phone) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    // Validar email
    if (!validateEmail(email)) {
        alert('Por favor, ingresa un email válido.');
        return;
    }

    // Guardar datos en localStorage
    const userData = { name, email, phone };
    localStorage.setItem('printCopyUserData', JSON.stringify(userData));
    
    // Actualizar la información en la cotización
    document.getElementById('displayName').textContent = name;
    document.getElementById('displayEmail').textContent = email;
    document.getElementById('displayPhone').textContent = phone;

    // Ocultar el formulario y habilitar el chat
    document.getElementById('userForm').style.display = 'none';
    document.getElementById('messageInput').disabled = false;
    document.getElementById('sendBtn').disabled = false;
    document.getElementById('messageInput').placeholder = `¡Hola ${name}! ¿En qué puedo ayudarte?`;

    // Enviar mensaje de bienvenida personalizado
    setTimeout(() => {
        addMessage('bot', `¡Perfecto, ${name}! 🎉 Ahora puedo ayudarte con toda nuestra gama de productos de Print & Copy. 

Tenemos:
📋 **Papelería y detalles**: Recordatorios, marcapáginas, invitaciones de boda, seating plans, libros de firmas, etc.
🎁 **Productos personalizados**: Tazas, chapas, llaveros, imanes, pulseras, abanicos, etc.
💡 **Neones**: Alquiler con entrega y recogida gratis

¿Qué tipo de producto te interesa? ¡Puedes preguntarme sobre precios, cantidades o pedir una cotización!`);
    }, 500);
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Mostrar/Ocultar el chat
function toggleChat() {
    const chatContainer = document.querySelector('.chat-container');
    chatContainer.classList.toggle('hidden');
}

// Función principal para enviar mensaje
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Añadir mensaje del usuario al chat
    addMessage('user', message);
    
    // Limpiar input
    messageInput.value = '';
    
    // Mostrar indicador de escritura
    showTypingIndicator();
    
    // Procesar el mensaje para buscar productos para cotización
    processMessageForQuote(message);
    
    // Generar respuesta del bot
    generateBotResponse(message);
}

// Guardar mensaje en el historial
function saveChatHistory(sender, content) {
    const chatHistory = JSON.parse(localStorage.getItem('printCopyChatHistory')) || [];
    chatHistory.push({
        sender,
        content,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('printCopyChatHistory', JSON.stringify(chatHistory));
}

// Restaurar historial de chat
function restoreChatHistory(chatHistory) {
    const messagesContainer = document.getElementById('chatMessages');
    
    // Mantener el mensaje de bienvenida con el formulario
    const welcomeMessage = messagesContainer.innerHTML;
    messagesContainer.innerHTML = '';
    
    // Si no hay historial, mostrar solo el mensaje de bienvenida
    if (chatHistory.length === 0) {
        messagesContainer.innerHTML = welcomeMessage;
        return;
    }
    
    // Agregar mensajes del historial
    chatHistory.forEach(message => {
        addMessage(message.sender, message.content, false); // No guardar en el historial de nuevo
    });
}

function addMessage(sender, content, saveToHistory = true) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    
    // Obtener userData desde localStorage
    const userData = JSON.parse(localStorage.getItem('printCopyUserData')) || { name: '' };
    avatar.textContent = sender === 'bot' ? 'PC' : userData.name.charAt(0).toUpperCase();
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = content.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Guardar mensaje en el historial si es necesario
    if (saveToHistory) {
        saveChatHistory(sender, content);
    }
}
