// Archivo de configuración para el chatbot de Print & Copy
// Compatible con Coolify y variables de entorno

// Variable global para la API key
let OPENAI_API_KEY = '';

// Función para inicializar la configuración
function initializeConfig() {
    // Intentar obtener desde variable de entorno (para Coolify/producción)
    if (typeof process !== 'undefined' && process.env && process.env.OPENAI_API_KEY) {
        OPENAI_API_KEY = process.env.OPENAI_API_KEY;
        return;
    }
    
    // Para desarrollo local, intentar cargar desde localStorage
    const storedKey = localStorage.getItem('printCopyApiKey');
    if (storedKey) {
        OPENAI_API_KEY = storedKey;
        return;
    }
    
    // Si no hay nada configurado, OPENAI_API_KEY queda vacío
    OPENAI_API_KEY = '';
}

// Función para configurar la API key manualmente
function setApiKey(apiKey) {
    OPENAI_API_KEY = apiKey;
    localStorage.setItem('printCopyApiKey', apiKey);
}

// Función para obtener la API key
function getApiKey() {
    if (!OPENAI_API_KEY) {
        initializeConfig();
    }
    return OPENAI_API_KEY;
}

// Función para verificar si hay API key configurada
function hasApiKey() {
    return getApiKey() !== '';
}

// Función para solicitar API key al usuario (fallback)
function promptForApiKey() {
    const apiKey = prompt(`🔑 Para usar ChatGPT, ingresa tu API Key de OpenAI:

1. Ve a: https://platform.openai.com/api-keys
2. Crea una nueva clave API
3. Cópiala y pégala aquí

(Opcional: Si no tienes API key, el bot funcionará con respuestas inteligentes simuladas)`);
    
    if (apiKey && apiKey.trim()) {
        setApiKey(apiKey.trim());
        alert('✅ API Key configurada correctamente. Ahora usarás ChatGPT real!');
        return true;
    }
    
    return false;
}

// Función para remover la API key
function removeApiKey() {
    OPENAI_API_KEY = '';
    localStorage.removeItem('printCopyApiKey');
}

// Función para mostrar el estado de configuración
function getConfigStatus() {
    const apiKey = getApiKey();
    if (apiKey) {
        if (apiKey.startsWith('sk-')) {
            return {
                configured: true,
                source: localStorage.getItem('printCopyApiKey') ? 'Usuario' : 'Variable de Entorno',
                message: '✅ ChatGPT configurado'
            };
        }
    }
    
    return {
        configured: false,
        source: 'Ninguna',
        message: '⚠️ ChatGPT no configurado - Usando modo inteligente'
    };
}

// Inicializar al cargar
initializeConfig();

// No modificar esta línea
if (typeof module !== 'undefined') module.exports = { 
    getApiKey, 
    hasApiKey, 
    setApiKey, 
    promptForApiKey, 
    removeApiKey, 
    getConfigStatus 
};
