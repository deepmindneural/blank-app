// Funciones para el manejo del chat

// Mostrar indicador de escritura
function showTyping() {
    const messagesContainer = document.getElementById('chatMessages');
    if (!messagesContainer) return;
    
    // Remover indicador existente si lo hay
    removeTyping();
    
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message bot';
    messageDiv.id = 'typing-message';
    
    const avatar = document.createElement('div');
    avatar.className = 'avatar';
    avatar.textContent = 'PC';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content typing';
    messageContent.innerHTML = `
        Escribiendo
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Remover indicador de escritura
function removeTyping() {
    const typingMessage = document.getElementById('typing-message');
    if (typingMessage) {
        typingMessage.remove();
    }
}

// Función principal para obtener respuesta del bot
async function getBotResponse(userMessage) {
    // Obtener datos del usuario desde localStorage
    const userData = JSON.parse(localStorage.getItem('printCopyUserData')) || {};
    const products = JSON.parse(localStorage.getItem('printCopyProducts')) || {};
    
    // Si hay una clave API configurada, usar ChatGPT
    if (OPENAI_API_KEY && OPENAI_API_KEY.trim() !== '') {
        try {
            return await getChatGPTResponse(userMessage, userData, products);
        } catch (error) {
            console.error('Error con ChatGPT:', error);
            // Fallback a respuestas simuladas
            return getSmartResponse(userMessage, userData, products);
        }
    }
    
    // Sistema de respuestas inteligentes simuladas
    return getSmartResponse(userMessage, userData, products);
}

// Función para obtener respuesta de ChatGPT
async function getChatGPTResponse(userMessage, userData, products) {
    try {
        // Obtener historial de chat reciente (últimos 5 mensajes) para dar contexto
        const chatHistory = JSON.parse(localStorage.getItem('printCopyChatHistory')) || [];
        const recentMessages = chatHistory.slice(-5);
        
        // Crear contexto para la API
        let context = `Eres un asistente de ventas amigable y entusiasta de Print & Copy, una empresa de productos impresos y personalizados. Tu nombre es Asistente Virtual de Print & Copy. Siempre responde en español.

Cliente: ${userData.name || 'Cliente'}
Email: ${userData.email || 'No proporcionado'}
Teléfono: ${userData.phone || 'No proporcionado'}

INSTRUCCIONES IMPORTANTES:
- Sé amable, cercano y usa emojis ocasionalmente.
- Conoces todos los productos y sus precios exactos que están en nuestra base de datos.
- NO inventes productos que no estén en la lista.
- Si te piden cotizar, genera una cotización precisa con los precios exactos.
- Si te preguntan por un material o producto específico, proporciona detalles precisos.
- Si necesitas más información para dar un precio exacto (como cantidad), pregunta por esa información.
- Menciona ofertas o sugerencias relevantes basadas en lo que busca el cliente.
- Mantén respuestas concisas pero informativas.

Lista de productos disponibles:
${Object.keys(products).join(', ')}

Historial reciente:
${recentMessages.map(msg => `${msg.sender === 'user' ? 'Cliente' : 'Asistente'}: ${msg.content}`).join('\n')}

Pregunta actual: ${userMessage}`;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENAI_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: context }],
                max_tokens: 500,
                temperature: 0.7,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error en la API: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
        
    } catch (error) {
        console.error('Error en getChatGPTResponse:', error);
        throw error;
    }
}

// Sistema de respuestas inteligentes simuladas
function getSmartResponse(userMessage, userData, products) {
    const message = userMessage.toLowerCase();
    const userName = userData.name || 'cliente';
    
    // Detectar saludos
    if (message.includes('hola') || message.includes('buenos') || message.includes('buenas') || message.includes('hi')) {
        return `¡Hola ${userName}! 😊 ¿En qué puedo ayudarte hoy? Puedes preguntarme sobre cualquiera de nuestros productos, precios, o pedir una cotización.`;
    }
    
    // Detectar productos específicos
    for (const [key, product] of Object.entries(products)) {
        if (message.includes(key) || message.includes(product.name.toLowerCase())) {
            return getProductInfo(key, product, userName);
        }
    }
    
    // Detectar búsqueda de productos por categoría
    if (message.includes('taza') || message.includes('mug')) {
        return getProductInfo('tazas', products.tazas, userName);
    }
    
    if (message.includes('abanico')) {
        return `Tenemos varios tipos de abanicos, ${userName}:\n\n🌸 **Abanicos Lencer**: Desde 4,70€ (50 uds) hasta 2,75€ (300 uds)\n🌸 **Abanicos Kronix**: Desde 2,99€ (50 uds) hasta 1,95€ (300 uds)\n🌸 **Abanicos Madera**: Desde 2,99€ (50 uds) hasta 1,95€ (300 uds)\n🌸 **Abanicos Bilsom**: Desde 1,79€ (50 uds) hasta 0,95€ (300 uds)\n\n¿Te interesa algún tipo en particular?`;
    }
    
    if (message.includes('boda') || message.includes('matrimonio') || message.includes('casamiento')) {
        return `¡Perfecto para bodas! 💒 Tenemos una línea completa, ${userName}:\n\n💌 **Invitaciones de Boda**: Desde 1,20€ hasta 2,75€ por unidad\n📋 **Seating Plan**: 59,90€ (70x50cm) - 89,90€ (100x70cm)\n📖 **Libros de Firmas**: 49,90€ (diseño incluido 9€)\n🏷️ **Marcasitios**: Desde 0,65€ hasta 1,25€ por unidad\n📄 **Menús**: Desde 0,65€ hasta 1,85€ por unidad\n📊 **Lista de Boda**: Desde 0,23€ hasta 0,48€ por unidad\n🔢 **Números de Mesa**: 2,45€ (10x15cm) - 2,95€ (13x18cm)\n\n¿Qué productos necesitas para tu boda?`;
    }
    
    // Detectar solicitud de cotización
    if (message.includes('cotiza') || message.includes('precio') || message.includes('cuanto cuesta') || message.includes('coste') || message.includes('cuesta')) {
        return `Para generar una cotización precisa, ${userName}, necesito saber:\n\n1️⃣ **¿Qué producto te interesa?**\n2️⃣ **¿Cuántas unidades necesitas?**\n3️⃣ **¿Alguna especificación especial?** (tamaño, material, etc.)\n\nPor ejemplo: "Quiero 50 tazas personalizadas" o "Necesito un seating plan de 100x70cm"\n\n¡Así podré darte el precio exacto y agregarlo a tu cotización! 💰`;
    }
    
    // Detectar solicitud de catálogo o lista de productos
    if (message.includes('productos') || message.includes('catalogo') || message.includes('catálogo') || message.includes('que tienen') || message.includes('que tienes')) {
        return `¡Tenemos una gran variedad de productos, ${userName}! 🛒\n\n📋 **Papelería**: Recordatorios, marcapáginas, etiquetas\n💒 **Bodas**: Invitaciones, seating plans, libros de firmas, marcasitios, menús\n🎁 **Personalizados**: Tazas, chapas, llaveros, imanes, pulseras\n🌸 **Abanicos**: Lencer, Kronix, Madera, Bilsom\n📱 **Tecnología**: Cargadores 3 en 1\n💡 **Neones**: Alquiler con entrega gratis\n🎨 **Otros**: Roll ups, árboles de huellas, números de mesa\n\n¿Qué tipo de producto te interesa más?`;
    }
    
    // Detectar despedidas
    if (message.includes('gracias') || message.includes('adiós') || message.includes('hasta luego') || message.includes('chao') || message.includes('bye')) {
        return `¡Ha sido un placer ayudarte, ${userName}! 😊 Si necesitas algo más o quieres modificar tu cotización, estaré aquí. ¡Que tengas un excelente día! 🌟`;
    }
    
    // Detectar ayuda
    if (message.includes('ayuda') || message.includes('help') || message.includes('como funciona') || message.includes('cómo funciona')) {
        return `¡Por supuesto, ${userName}! Estoy aquí para ayudarte 🤖\n\n🔍 **Puedes preguntarme sobre:**\n• Precios de productos específicos\n• Información detallada de cualquier producto\n• Generar cotizaciones automáticas\n• Recomendar productos para eventos\n\n💬 **Ejemplos de preguntas:**\n• "¿Cuánto cuestan 50 tazas?"\n• "Necesito productos para una boda"\n• "Quiero cotizar 100 abanicos"\n\n¡Solo escribe tu pregunta naturalmente!`;
    }
    
    // Respuesta por defecto
    return `¡Hola ${userName}! 😊 Puedo ayudarte con información sobre:\n\n📋 **Papelería**: Recordatorios, marcapáginas, etiquetas\n💒 **Bodas**: Invitaciones, seating plans, libros de firmas\n🎁 **Personalizados**: Tazas, llaveros, chapas, imanes\n🌸 **Abanicos**: Lencer, Kronix, Madera, Bilsom\n💡 **Neones**: Alquiler con entrega gratis\n\n¿Qué te interesa? También puedo generar cotizaciones específicas si me dices el producto y la cantidad. 🛒`;
}

// Obtener información detallada de un producto
function getProductInfo(key, product, userName) {
    if (!product) {
        return `Lo siento, ${userName}, no encontré información sobre ese producto. ¿Podrías ser más específico? 🤔`;
    }
    
    let response = `✨ **${product.name}** ✨\n\n`;
    
    if (product.prices) {
        response += "💰 **Precios por unidad:**\n";
        product.prices.forEach(price => {
            if (price.min && price.max) {
                if (price.max === Infinity) {
                    response += `• Más de ${price.min} unidades: ${price.price.toFixed(2)}€\n`;
                } else if (price.min === price.max) {
                    response += `• ${price.min} unidades: ${price.price.toFixed(2)}€\n`;
                } else {
                    response += `• De ${price.min} a ${price.max} unidades: ${price.price.toFixed(2)}€\n`;
                }
                if (price.material) {
                    response += `  (${price.material})\n`;
                }
            } else if (price.size) {
                response += `• ${price.size}: ${price.price.toFixed(2)}€\n`;
            }
        });
    } else if (product.price) {
        response += `💰 **Precio**: ${product.price.toFixed(2)}€\n`;
        if (product.design) {
            response += `🎨 **Diseño**: ${product.design.toFixed(2)}€\n`;
        }
    } else if (product.rental_price) {
        response += `💰 **Precio de alquiler**: ${product.rental_price}€\n`;
        response += `🛡️ **Fianza**: ${product.deposit}€\n`;
        response += `🚚 **Entrega y recogida**: ${product.delivery}\n`;
        response += `📏 **Dimensiones**: ${product.dimensions}\n`;
    }
    
    response += `\n${userName}, ¿te gustaría agregar este producto a tu cotización? Solo dime la cantidad que necesitas. 🛒`;
    
    return response;
}
