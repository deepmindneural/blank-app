// Bot de Telegram para Print & Copy
// Integrado con el mismo sistema del chatbot web

const { Telegraf, Markup } = require('telegraf');
const fs = require('fs');
const path = require('path');

// ⚠️ IMPORTANTE: Las claves DEBEN configurarse como variables de entorno en Coolify
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Verificar que las variables de entorno estén configuradas
if (!BOT_TOKEN) {
    console.error('❌ ERROR: TELEGRAM_BOT_TOKEN no está configurado');
    console.error('💡 Solución:');
    console.error('   1. Ve a tu panel de Coolify');
    console.error('   2. En Environment Variables, agrega:');
    console.error('      Name: TELEGRAM_BOT_TOKEN');
    console.error('      Value: 123456789:ABC-DEF... (tu token de @BotFather)');
    console.error('   3. Reinicia el servicio');
    process.exit(1);
}

console.log('✅ TELEGRAM_BOT_TOKEN configurado correctamente');
if (OPENAI_API_KEY) {
    console.log('✅ OPENAI_API_KEY configurado correctamente');
} else {
    console.log('⚠️  OPENAI_API_KEY no configurado - usando respuestas inteligentes');
}

// Crear bot
const bot = new Telegraf(BOT_TOKEN);

// Importar productos y lógica del chatbot web
const products = require('./js/products.js');

// Base de datos temporal en memoria (en producción usar una base de datos real)
const telegramUsers = new Map();
const telegramQuotes = new Map();

// Clase para manejar usuarios de Telegram
class TelegramUser {
    constructor(telegramId) {
        this.telegramId = telegramId;
        this.userData = { name: '', email: '', phone: '' };
        this.quotedItems = [];
        this.chatHistory = [];
        this.registrationStep = 'name';
        this.registered = false;
    }

    addMessage(sender, content) {
        this.chatHistory.push({
            sender,
            content,
            timestamp: new Date().toISOString()
        });
        
        // Mantener solo los últimos 20 mensajes
        if (this.chatHistory.length > 20) {
            this.chatHistory = this.chatHistory.slice(-20);
        }
    }

    addToQuote(productKey, product, quantity) {
        const price = calculatePrice(product, quantity);
        
        if (price > 0) {
            const item = {
                id: Date.now(),
                productKey,
                name: product.name,
                quantity,
                unitPrice: price,
                totalPrice: price * quantity
            };
            
            this.quotedItems.push(item);
            return item;
        }
        return null;
    }

    getQuoteTotal() {
        return this.quotedItems.reduce((total, item) => total + item.totalPrice, 0);
    }

    clearQuote() {
        this.quotedItems = [];
    }

    saveQuote() {
        if (this.userData.name && this.quotedItems.length > 0) {
            const quoteId = `tg_${this.telegramId}_${Date.now()}`;
            const quote = {
                id: quoteId,
                date: new Date().toISOString(),
                user: { ...this.userData, telegramId: this.telegramId },
                items: [...this.quotedItems],
                total: this.getQuoteTotal(),
                status: 'Finalizada',
                source: 'Telegram'
            };
            
            telegramQuotes.set(quoteId, quote);
            this.clearQuote();
            return quote;
        }
        return null;
    }
}

// Función para calcular precios (igual que en el web)
function calculatePrice(product, quantity) {
    if (product.prices) {
        for (const priceRange of product.prices) {
            if (priceRange.min && priceRange.max) {
                if (quantity >= priceRange.min && quantity <= priceRange.max) {
                    return priceRange.price;
                }
            }
        }
        
        // Si no encuentra rango exacto, buscar el más cercano
        let closestPrice = product.prices[0].price;
        let closestDiff = Math.abs(quantity - product.prices[0].min);
        
        for (const priceRange of product.prices) {
            const diff = Math.abs(quantity - priceRange.min);
            if (diff < closestDiff) {
                closestDiff = diff;
                closestPrice = priceRange.price;
            }
        }
        
        return closestPrice;
    } else if (product.price) {
        return product.price;
    } else if (product.rental_price) {
        return product.rental_price;
    }
    
    return 0;
}

// Función para obtener respuesta inteligente (adaptada para Telegram)
function getSmartResponse(message, user) {
    const lowerMessage = message.toLowerCase();
    const userName = user.userData.name || 'cliente';
    
    // Detectar productos y cantidades
    const quantityMatch = lowerMessage.match(/(\d+)\s*(unidades?|uds?|piezas?)?/);
    if (quantityMatch) {
        const quantity = parseInt(quantityMatch[1]);
        
        // Buscar producto mencionado
        for (const [key, product] of Object.entries(products)) {
            if (lowerMessage.includes(key) || lowerMessage.includes(product.name.toLowerCase())) {
                const item = user.addToQuote(key, product, quantity);
                if (item) {
                    return `✅ Agregado a tu cotización:\n\n📦 ${item.name}\n🔢 Cantidad: ${item.quantity} unidades\n💰 Precio unitario: ${item.unitPrice.toFixed(2)}€\n💵 Subtotal: ${item.totalPrice.toFixed(2)}€\n\n💰 Total cotización: ${user.getQuoteTotal().toFixed(2)}€\n\n¿Necesitas algo más?`;
                }
            }
        }
        
        // Búsqueda por palabras clave
        if (lowerMessage.includes('taza')) {
            const item = user.addToQuote('tazas', products.tazas, quantity);
            if (item) {
                return `✅ Agregado a tu cotización:\n\n📦 ${item.name}\n🔢 Cantidad: ${item.quantity} unidades\n💰 Precio unitario: ${item.unitPrice.toFixed(2)}€\n💵 Subtotal: ${item.totalPrice.toFixed(2)}€\n\n💰 Total cotización: ${user.getQuoteTotal().toFixed(2)}€`;
            }
        }
    }
    
    // Detectar saludos
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas') || lowerMessage.includes('/start')) {
        return `¡Hola ${userName}! 👋 Soy el asistente virtual de Print & Copy.\n\n🛒 Puedo ayudarte con:\n• Información de productos\n• Precios y cotizaciones\n• Recomendaciones\n\n¿En qué puedo ayudarte?`;
    }
    
    // Detectar productos específicos
    for (const [key, product] of Object.entries(products)) {
        if (lowerMessage.includes(key) || lowerMessage.includes(product.name.toLowerCase())) {
            return getProductInfo(key, product, userName);
        }
    }
    
    // Detectar búsqueda por categoría
    if (lowerMessage.includes('taza') || lowerMessage.includes('mug')) {
        return getProductInfo('tazas', products.tazas, userName);
    }
    
    if (lowerMessage.includes('abanico')) {
        return `Tenemos varios tipos de abanicos, ${userName}:\n\n🌸 **Abanicos Lencer**: 4,70€-2,75€\n🌸 **Abanicos Kronix**: 2,99€-1,95€\n🌸 **Abanicos Madera**: 2,99€-1,95€\n🌸 **Abanicos Bilsom**: 1,79€-0,95€\n\n¿Cuál te interesa?`;
    }
    
    if (lowerMessage.includes('boda') || lowerMessage.includes('matrimonio')) {
        return `¡Perfecto para bodas! 💒\n\n💌 **Invitaciones**: 1,20€-2,75€\n📋 **Seating Plan**: 59,90€-89,90€\n📖 **Libros de Firmas**: 49,90€\n🏷️ **Marcasitios**: 0,65€-1,25€\n📄 **Menús**: 0,65€-1,85€\n\n¿Qué necesitas?`;
    }
    
    // Detectar solicitud de catálogo
    if (lowerMessage.includes('productos') || lowerMessage.includes('catalogo') || lowerMessage.includes('que tienen')) {
        return `📋 **Nuestros Productos:**\n\n📝 Papelería y detalles\n💒 Productos para bodas\n🎁 Artículos personalizados\n🌸 Abanicos de diferentes tipos\n💡 Neones (alquiler)\n📱 Accesorios tecnológicos\n\n¡Pregúntame por cualquier producto específico!`;
    }
    
    // Respuesta por defecto
    return `¡Hola ${userName}! 😊 Soy tu asistente de Print & Copy.\n\n🔍 Puedes preguntarme sobre:\n• Precios de productos\n• Generar cotizaciones\n• Recomendaciones\n\n📝 Ejemplo: "Quiero 50 tazas personalizadas"\n\n¿En qué te ayudo?`;
}

// Función para información de productos
function getProductInfo(key, product, userName) {
    if (!product) {
        return `Lo siento ${userName}, no encontré ese producto. 🤔`;
    }
    
    let response = `✨ **${product.name}**\n\n`;
    
    if (product.prices) {
        response += "💰 **Precios por unidad:**\n";
        product.prices.forEach(price => {
            if (price.min && price.max) {
                if (price.max === Infinity) {
                    response += `• Más de ${price.min} uds: ${price.price.toFixed(2)}€\n`;
                } else if (price.min === price.max) {
                    response += `• ${price.min} uds: ${price.price.toFixed(2)}€\n`;
                } else {
                    response += `• ${price.min}-${price.max} uds: ${price.price.toFixed(2)}€\n`;
                }
            } else if (price.size) {
                response += `• ${price.size}: ${price.price.toFixed(2)}€\n`;
            }
        });
    } else if (product.price) {
        response += `💰 **Precio**: ${product.price.toFixed(2)}€\n`;
    }
    
    response += `\n💬 Solo dime la cantidad que necesitas para agregarlo a tu cotización.`;
    
    return response;
}

// Middleware para obtener o crear usuario
bot.use((ctx, next) => {
    const telegramId = ctx.from.id;
    
    if (!telegramUsers.has(telegramId)) {
        telegramUsers.set(telegramId, new TelegramUser(telegramId));
    }
    
    ctx.user = telegramUsers.get(telegramId);
    return next();
});

// Comando /start
bot.start((ctx) => {
    const user = ctx.user;
    
    if (!user.registered) {
        ctx.reply(
            '¡Bienvenido a Print & Copy! 🖨️\n\n' +
            'Para brindarte el mejor servicio, necesito algunos datos.\n\n' +
            '👤 ¿Cuál es tu nombre completo?',
            Markup.inlineKeyboard([
                Markup.button.callback('🏠 Ir al sitio web', 'web_site')
            ])
        );
        user.registrationStep = 'name';
    } else {
        ctx.reply(
            `¡Hola de nuevo, ${user.userData.name}! 👋\n\n` +
            '¿En qué puedo ayudarte hoy?',
            getMainKeyboard()
        );
    }
});

// Comando /cotizacion
bot.command('cotizacion', (ctx) => {
    const user = ctx.user;
    
    if (user.quotedItems.length === 0) {
        ctx.reply('🛒 Tu cotización está vacía.\n\n¡Pregúntame por productos y te ayudo a cotizar!');
        return;
    }
    
    let message = '🛒 **Tu Cotización Actual:**\n\n';
    user.quotedItems.forEach((item, index) => {
        message += `${index + 1}. ${item.name}\n`;
        message += `   📦 ${item.quantity} uds × ${item.unitPrice.toFixed(2)}€ = ${item.totalPrice.toFixed(2)}€\n\n`;
    });
    
    message += `💰 **Total: ${user.getQuoteTotal().toFixed(2)}€**`;
    
    ctx.reply(message, Markup.inlineKeyboard([
        [Markup.button.callback('📄 Finalizar Cotización', 'finalize_quote')],
        [Markup.button.callback('🗑️ Limpiar', 'clear_quote')]
    ]));
});

// Comando /productos
bot.command('productos', (ctx) => {
    const categories = [
        ['📝 Papelería', 'cat_papeleria'],
        ['💒 Bodas', 'cat_bodas'],
        ['🎁 Personalizados', 'cat_personalizados'],
        ['🌸 Abanicos', 'cat_abanicos'],
        ['💡 Neones', 'cat_neones']
    ];
    
    ctx.reply(
        '📦 **Selecciona una categoría:**',
        Markup.inlineKeyboard(categories.map(([text, data]) => 
            Markup.button.callback(text, data)
        ))
    );
});

// Función para obtener teclado principal
function getMainKeyboard() {
    return Markup.keyboard([
        ['🛒 Mi Cotización', '📦 Ver Productos'],
        ['💬 Chatear', '📞 Contacto']
    ]).resize();
}

// Manejar callbacks
bot.on('callback_query', (ctx) => {
    const data = ctx.callbackQuery.data;
    const user = ctx.user;
    
    if (data === 'web_site') {
        ctx.answerCbQuery();
        ctx.reply('🌐 Visita nuestro sitio web: https://tu-sitio-web.com');
    }
    
    if (data === 'finalize_quote') {
        const savedQuote = user.saveQuote();
        if (savedQuote) {
            ctx.answerCbQuery('Cotización guardada');
            ctx.reply(
                `✅ **Cotización Finalizada**\n\n` +
                `📄 ID: ${savedQuote.id}\n` +
                `💰 Total: ${savedQuote.total.toFixed(2)}€\n` +
                `📅 Fecha: ${new Date(savedQuote.date).toLocaleDateString('es-ES')}\n\n` +
                `¡Gracias por confiar en Print & Copy! 🎉`,
                getMainKeyboard()
            );
        }
    }
    
    if (data === 'clear_quote') {
        user.clearQuote();
        ctx.answerCbQuery('Cotización limpiada');
        ctx.reply('🗑️ Cotización limpiada.\n\n¿En qué más puedo ayudarte?');
    }
    
    // Manejar categorías de productos
    if (data.startsWith('cat_')) {
        const category = data.replace('cat_', '');
        showProductCategory(ctx, category);
    }
});

// Mostrar productos por categoría
function showProductCategory(ctx, category) {
    const categoryProducts = {
        papeleria: ['recordatorios', 'marcapaginas', 'etiquetas'],
        bodas: ['invitaciones_boda', 'seating_plan', 'libro_firmas', 'marcasitios', 'menus'],
        personalizados: ['tazas', 'chapas', 'llaveros', 'imanes', 'pulseras'],
        abanicos: ['abanicos_lencer', 'abanicos_kronix', 'abanicos_madera', 'abanicos_bilsom'],
        neones: ['neones']
    };
    
    const productKeys = categoryProducts[category] || [];
    let message = `📦 **Productos de ${category.charAt(0).toUpperCase() + category.slice(1)}:**\n\n`;
    
    productKeys.forEach(key => {
        const product = products[key];
        if (product) {
            message += `• ${product.name}\n`;
        }
    });
    
    message += '\n💬 Pregúntame por cualquier producto específico con la cantidad que necesitas.';
    
    ctx.reply(message);
}

// Manejar mensajes de texto
bot.on('text', (ctx) => {
    const user = ctx.user;
    const message = ctx.message.text;
    
    // Proceso de registro
    if (!user.registered) {
        if (user.registrationStep === 'name') {
            user.userData.name = message.trim();
            user.registrationStep = 'email';
            ctx.reply('📧 ¿Cuál es tu correo electrónico?');
            return;
        }
        
        if (user.registrationStep === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(message.trim())) {
                ctx.reply('❌ Email inválido. Por favor, ingresa un email válido:');
                return;
            }
            user.userData.email = message.trim();
            user.registrationStep = 'phone';
            ctx.reply('📞 ¿Cuál es tu número de teléfono?');
            return;
        }
        
        if (user.registrationStep === 'phone') {
            user.userData.phone = message.trim();
            user.registered = true;
            ctx.reply(
                `¡Perfecto, ${user.userData.name}! 🎉\n\n` +
                'Ya estás registrado en Print & Copy.\n\n' +
                '¿En qué puedo ayudarte?',
                getMainKeyboard()
            );
            return;
        }
    }
    
    // Manejar botones del teclado
    if (message === '🛒 Mi Cotización') {
        ctx.message.text = '/cotizacion';
        return ctx.telegram.handleUpdate({
            update_id: ctx.update.update_id,
            message: { ...ctx.message, text: '/cotizacion' }
        });
    }
    
    if (message === '📦 Ver Productos') {
        ctx.message.text = '/productos';
        return ctx.telegram.handleUpdate({
            update_id: ctx.update.update_id,
            message: { ...ctx.message, text: '/productos' }
        });
    }
    
    if (message === '💬 Chatear') {
        ctx.reply('💬 ¡Pregúntame lo que necesites!\n\nEjemplos:\n• "50 tazas personalizadas"\n• "Productos para boda"\n• "¿Cuánto cuestan los abanicos?"');
        return;
    }
    
    if (message === '📞 Contacto') {
        ctx.reply('📞 **Contacta con nosotros:**\n\n📧 Email: info@printcopy.com\n📱 WhatsApp: +34 000 000 000\n🌐 Web: https://tu-sitio-web.com');
        return;
    }
    
    // Guardar mensaje en historial
    user.addMessage('user', message);
    
    // Generar respuesta
    const response = getSmartResponse(message, user);
    user.addMessage('bot', response);
    
    ctx.reply(response);
});

// Manejar errores
bot.catch((err, ctx) => {
    console.error('❌ Error en el bot:', err);
    if (ctx && ctx.reply) {
        ctx.reply('❌ Ocurrió un error. Por favor, inténtalo de nuevo.');
    }
});

// Iniciar bot
console.log('🚀 Iniciando bot de Telegram...');
bot.launch()
    .then(() => {
        console.log('✅ Bot de Telegram iniciado correctamente');
        console.log('📱 Los usuarios pueden buscar tu bot en Telegram');
        console.log('🔗 Enlace directo: https://t.me/' + BOT_TOKEN.split(':')[0]);
    })
    .catch((error) => {
        console.error('❌ Error al iniciar el bot:', error);
        console.error('💡 Verifica que el TELEGRAM_BOT_TOKEN sea válido');
        process.exit(1);
    });

// Manejar cierre elegante
process.once('SIGINT', () => {
    console.log('🛑 Deteniendo bot de Telegram...');
    bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
    console.log('🛑 Deteniendo bot de Telegram...');
    bot.stop('SIGTERM');
});

module.exports = bot;
