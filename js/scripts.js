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
    const userNameInput = document.getElementById('userName');
    if (userNameInput) {
        userNameInput.focus();
    }
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
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !this.disabled) {
                sendMessage();
            }
        });
    }
    
    // Event listener para el botón cerrar chat
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', toggleChat);
    }
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
        const userNameInput = document.getElementById('userName');
        const userEmailInput = document.getElementById('userEmail');
        const userPhoneInput = document.getElementById('userPhone');
        
        if (userNameInput) userNameInput.value = userData.name;
        if (userEmailInput) userEmailInput.value = userData.email;
        if (userPhoneInput) userPhoneInput.value = userData.phone;
        
        // Mostrar datos en la cotización
        updateUserDisplay();
        
        // Ocultar formulario y habilitar chat
        const userForm = document.getElementById('userForm');
        const messageInput = document.getElementById('messageInput');
        const sendBtn = document.getElementById('sendBtn');
        
        if (userForm) userForm.style.display = 'none';
        if (messageInput) {
            messageInput.disabled = false;
            messageInput.placeholder = `¡Hola ${userData.name}! ¿En qué puedo ayudarte?`;
        }
        if (sendBtn) sendBtn.disabled = false;
    }
    
    // Cargar productos cotizados
    quotedItems = JSON.parse(localStorage.getItem('printCopyQuotedItems')) || [];
    updateQuoteDisplay();
    
    // Cargar historial de chat
    const chatHistory = JSON.parse(localStorage.getItem('printCopyChatHistory')) || [];
    restoreChatHistory(chatHistory);
}

// Actualizar información del usuario en la pantalla
function updateUserDisplay() {
    const displayName = document.getElementById('displayName');
    const displayEmail = document.getElementById('displayEmail');
    const displayPhone = document.getElementById('displayPhone');
    
    if (displayName) displayName.textContent = userData.name;
    if (displayEmail) displayEmail.textContent = userData.email;
    if (displayPhone) displayPhone.textContent = userData.phone;
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

    // Guardar datos en localStorage y variable global
    userData = { name, email, phone };
    localStorage.setItem('printCopyUserData', JSON.stringify(userData));
    
    // Actualizar la información en la cotización
    updateUserDisplay();

    // Ocultar el formulario y habilitar el chat
    const userForm = document.getElementById('userForm');
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    
    if (userForm) userForm.style.display = 'none';
    if (messageInput) {
        messageInput.disabled = false;
        messageInput.placeholder = `¡Hola ${name}! ¿En qué puedo ayudarte?`;
        messageInput.focus();
    }
    if (sendBtn) sendBtn.disabled = false;

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
    if (chatContainer) {
        chatContainer.classList.toggle('hidden');
    }
}

// Función principal para enviar mensaje
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    if (!messageInput) return;
    
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Añadir mensaje del usuario al chat
    addMessage('user', message);
    
    // Limpiar input
    messageInput.value = '';
    
    // Mostrar indicador de escritura
    showTyping();
    
    // Procesar el mensaje para buscar productos para cotización
    processMessageForQuote(message);
    
    // Generar respuesta del bot (ahora implementada correctamente)
    generateBotResponse(message);
}

// Función corregida para generar respuesta del bot
async function generateBotResponse(message) {
    try {
        // Obtener respuesta usando la función de chat.js
        const response = await getBotResponse(message);
        
        // Remover indicador de escritura
        removeTyping();
        
        // Añadir respuesta del bot
        addMessage('bot', response);
    } catch (error) {
        console.error('Error al generar respuesta del bot:', error);
        
        // Remover indicador de escritura
        removeTyping();
        
        // Respuesta de error amigable
        addMessage('bot', `Lo siento, ${userData.name}, he tenido un pequeño problema técnico. ¿Podrías repetir tu pregunta? 🤖`);
    }
}

// Mostrar indicador de escritura (simplificado para compatibility)
function showTypingIndicator() {
    showTyping();
}

// Guardar mensaje en el historial
function saveChatHistory(sender, content) {
    const chatHistory = JSON.parse(localStorage.getItem('printCopyChatHistory')) || [];
    chatHistory.push({
        sender,
        content,
        timestamp: new Date().toISOString()
    });
    
    // Mantener solo los últimos 50 mensajes para evitar sobrecarga
    if (chatHistory.length > 50) {
        chatHistory.splice(0, chatHistory.length - 50);
    }
    
    localStorage.setItem('printCopyChatHistory', JSON.stringify(chatHistory));
}

// Restaurar historial de chat
function restoreChatHistory(chatHistory) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    // Mantener el mensaje de bienvenida con el formulario
    const welcomeMessage = messagesContainer.innerHTML;
    
    // Si no hay historial o el usuario no se ha registrado, mostrar solo el mensaje de bienvenida
    if (chatHistory.length === 0 || !userData.name) {
        return;
    }
    
    // Agregar mensajes del historial (sin incluir el formulario inicial)
    chatHistory.forEach(message => {
        addMessage(message.sender, message.content, false); // No guardar en el historial de nuevo
    });
}

function addMessage(sender, content, saveToHistory = true) {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    
    // Obtener userData desde localStorage para asegurar datos actuales
    const currentUserData = JSON.parse(localStorage.getItem('printCopyUserData')) || { name: 'U' };
    avatar.textContent = sender === 'bot' ? 'PC' : currentUserData.name.charAt(0).toUpperCase();
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = content.replace(/\n/g, '<br>');
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll al final
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Guardar mensaje en el historial si es necesario
    if (saveToHistory && currentUserData.name) {
        saveChatHistory(sender, content);
    }
}
