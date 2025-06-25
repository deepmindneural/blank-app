// Bot de Telegram para Print & Copy - CORREGIDO
// Integrado con el mismo sistema del chatbot web

const { Telegraf, Markup } = require('telegraf');

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

// 🔧 CORECCIÓN: Importar productos correctamente
const { products, calculateProductPrice } = require('./js/products.js');

// Base de datos temporal en memoria
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

// 🔧 CORREGIDA: Función para calcular precios
function calculatePrice(product, quantity) {
    if (!product) return 0;
    
    if (product.prices) {
        // Buscar el rango exacto
        for (const priceRange of product.prices) {
            if (priceRange.min && priceRange.max) {
                if (quantity >= priceRange.min && (quantity <= priceRange.max || priceRange.max === Infinity)) {
                    return priceRange.price;
                }
            }
        }
        
        // Si no encuentra rango exacto, buscar el más cercano
        let closestPrice = product.prices[0].price;
        let closestDiff = Math.abs(quantity - product.prices[0].min);
        
        for (const priceRange of product.prices) {
            if (priceRange.min) {
                const diff = Math.abs(quantity - priceRange.min);
                if (diff < closestDiff) {
                    closestDiff = diff;
                    closestPrice = priceRange.price;
                }
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

// 🔧 CORREGIDA: Función para respuesta inteligente
function getSmartResponse(message, user) {
    const lowerMessage = message.toLowerCase();
    const userName = user.userData.name || 'cliente';
    
    console.log(`🔍 Procesando mensaje: "${message}" de usuario: ${userName}`);
    
    // 🔧 CORREGIDO: Detectar cantidades y productos
    const quantityMatch = lowerMessage.match(/(\d+)\s*(unidades?|uds?|piezas?|tazas?|abanicos?)?/);
    if (quantityMatch) {
        const quantity = parseInt(quantityMatch[1]);
        console.log(`📊 Cantidad detectada: ${quantity}`);
        
        // Buscar producto mencionado en la base de datos
        for (const [key, product] of Object.entries(products)) {
            if (lowerMessage.includes(key) || 
                lowerMessage.includes(product.name.toLowerCase()) ||
                (key === 'tazas' && lowerMessage.includes('taza')) ||
                (key.includes('abanico') && lowerMessage.includes('abanico'))) {
                
                console.log(`🎯 Producto encontrado: ${key} - ${product.name}`);
                const item = user.addToQuote(key, product, quantity);
                if (item) {
                    return `✅ Agregado a tu cotización:\n\n📦 ${item.name}\n🔢 Cantidad: ${item.quantity} unidades\n💰 Precio unitario: ${item.unitPrice.toFixed(2)}€\n💵 Subtotal: ${item.totalPrice.toFixed(2)}€\n\n💰 **Total cotización: ${user.getQuoteTotal().toFixed(2)}€**\n\n¿Necesitas algo más?`;
                }
            }
        }
        
        // 🔧 CORREGIDO: Búsqueda por palabras clave mejorada
        if (lowerMessage.includes('taza')) {
            console.log('🎯 Detectado: tazas');
            const item = user.addToQuote('tazas', products.tazas, quantity);
            if (item) {
                return `✅ Agregado: ${item.quantity} tazas personalizadas\n💰 Precio: ${item.unitPrice.toFixed(2)}€/ud\n💵 Subtotal: ${item.totalPrice.toFixed(2)}€\n\n💰 **Total: ${user.getQuoteTotal().toFixed(2)}€**`;
            }
        }
        
        if (lowerMessage.includes('abanico')) {
            console.log('🎯 Detectado: abanicos');
            // Detectar tipo específico o usar Bilsom por defecto
            let productKey = 'abanicos_bilsom';
            if (lowerMessage.includes('lencer')) productKey = 'abanicos_lencer';
            else if (lowerMessage.includes('kronix')) productKey = 'abanicos_kronix';
            else if (lowerMessage.includes('madera')) productKey = 'abanicos_madera';
            
            const item = user.addToQuote(productKey, products[productKey], quantity);
            if (item) {
                return `✅ Agregado: ${item.quantity} ${item.name}\n💰 Precio: ${item.unitPrice.toFixed(2)}€/ud\n💵 Subtotal: ${item.totalPrice.toFixed(2)}€\n\n💰 **Total: ${user.getQuoteTotal().toFixed(2)}€**`;
            }
        }
        
        // Si detectó cantidad pero no producto específico
        return `🔍 Detecté que necesitas ${quantity} unidades, pero ¿de qué producto?\n\n📝 Ejemplos:\n• "${quantity} tazas"\n• "${quantity} abanicos"\n• "${quantity} invitaciones"\n\n¿Puedes especificar el producto?`;
    }
    
    // Detectar saludos
    if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('buenas') || lowerMessage.includes('hi')) {
        return `¡Hola ${userName}! 👋\n\nSoy el asistente virtual de Print & Copy.\n\n🛒 Puedo ayudarte con:\n• Información de productos\n• Precios y cotizaciones\n• Recomendaciones\n\n💬 Escribe algo como "50 tazas" o "productos para boda"`;
    }
    
    // Detectar búsqueda de productos por categoría
    if (lowerMessage.includes('taza') && !quantityMatch) {
        return getProductInfo('tazas', products.tazas, userName);
    }
    
    if (lowerMessage.includes('abanico') && !quantityMatch) {
        return `🌸 **Tipos de Abanicos Disponibles:**\n\n• **Abanicos Lencer**: 4,70€ - 2,75€\n• **Abanicos Kronix**: 2,99€ - 1,95€  \n• **Abanicos Madera**: 2,99€ - 1,95€\n• **Abanicos Bilsom**: 1,79€ - 0,95€\n\n💬 Ejemplo: "50 abanicos kronix"`;
    }
    
    if (lowerMessage.includes('boda') || lowerMessage.includes('matrimonio')) {
        return `💒 **Productos para Bodas:**\n\n💌 Invitaciones: 1,20€ - 2,75€\n📋 Seating Plan: 59,90€ - 89,90€\n📖 Libros de Firmas: 49,90€\n🏷️ Marcasitios: 0,65€ - 1,25€\n📄 Menús: 0,65€ - 1,85€\n\n💬 ¿Qué necesitas para tu boda?`;
    }
    
    // Detectar solicitud de catálogo
    if (lowerMessage.includes('productos') || lowerMessage.includes('catalogo') || lowerMessage.includes('que tienen') || lowerMessage.includes('qué tienen')) {
        return `📦 **Nuestro Catálogo:**\n\n📝 Papelería y detalles\n💒 Productos para bodas\n🎁 Artículos personalizados\n🌸 Abanicos (4 tipos)\n💡 Neones (alquiler)\n📱 Accesorios tecnológicos\n\n💬 Pregúntame por cualquier producto específico con la cantidad. Ejemplo: "100 tazas"`;
    }
    
    // Detectar solicitud de precios
    if (lowerMessage.includes('precio') || lowerMessage.includes('cuanto cuesta') || lowerMessage.includes('cuánto cuesta')) {
        return `💰 **Para darte precios exactos necesito saber:**\n\n1️⃣ ¿Qué producto te interesa?\n2️⃣ ¿Cuántas unidades necesitas?\n\n📝 Ejemplo: "50 tazas personalizadas"\n\n¡Así te doy el precio exacto!`;
    }
    
    // Respuesta por defecto mejorada
    return `¡Hola ${userName}! 😊\n\n🤖 Soy tu asistente de Print & Copy.\n\n💬 **Pregúntame sobre:**\n• Precios de productos\n• Generar cotizaciones  \n• Recomendaciones\n\n📝 **Ejemplos:**\n• "50 tazas personalizadas"\n• "productos para boda"\n• "100 abanicos kronix"\n\n¿En qué te ayudo?`;
}

// Función para información de productos
function getProductInfo(key, product, userName) {
    if (!product) {
        return `Lo siento ${userName}, no encontré ese producto. 🤔`;
    }
    
    let response = `✨ **${product.name}**\n\n`;
    
    if (product.prices && product.prices.length > 0) {
        response += "💰 **Precios por cantidad:**\n";
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
    
    response += `\n💬 Escribe la cantidad que necesitas para agregarlo a tu cotización.\nEjemplo: "50 ${product.name.toLowerCase()}"`;
    
    return response;
}

// Middleware para obtener o crear usuario
bot.use((ctx, next) => {
    const telegramId = ctx.from.id;
    console.log(`👤 Usuario Telegram ID: ${telegramId}`);
    
    if (!telegramUsers.has(telegramId)) {
        console.log(`🆕 Creando nuevo usuario: ${telegramId}`);
        telegramUsers.set(telegramId, new TelegramUser(telegramId));
    }
    
    ctx.user = telegramUsers.get(telegramId);
    console.log(`📋 Usuario registrado: ${ctx.user.registered}, Paso: ${ctx.user.registrationStep}`);
    return next();
});

// 🔧 CORREGIDO: Comando /start
bot.start((ctx) => {
    const user = ctx.user;
    console.log(`🚀 Comando /start ejecutado. Usuario registrado: ${user.registered}`);
    
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
    console.log(`📊 Comando /cotizacion - Items en cotización: ${user.quotedItems.length}`);
    
    if (user.quotedItems.length === 0) {
        ctx.reply('🛒 Tu cotización está vacía.\n\n¡Pregúntame por productos y te ayudo a cotizar!\n\n📝 Ejemplo: "50 tazas personalizadas"');
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
    console.log('📦 Comando /productos ejecutado');
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

// 🔧 CORREGIDA: Función para obtener teclado principal
function getMainKeyboard() {
    return Markup.keyboard([
        ['🛒 Mi Cotización', '📦 Ver Productos'],
        ['💬 Chatear', '📞 Contacto']
    ]).resize();
}

// 🔧 CORREGIDO: Manejar callbacks
bot.on('callback_query', (ctx) => {
    const data = ctx.callbackQuery.data;
    const user = ctx.user;
    console.log(`🔘 Callback recibido: ${data}`);
    
    ctx.answerCbQuery(); // Responder inmediatamente al callback
    
    if (data === 'web_site') {
        ctx.reply('🌐 Visita nuestro sitio web: https://tu-sitio-web.com');
        return;
    }
    
    if (data === 'finalize_quote') {
        const savedQuote = user.saveQuote();
        if (savedQuote) {
            ctx.reply(
                `✅ **Cotización Finalizada**\n\n` +
                `📄 ID: ${savedQuote.id}\n` +
                `💰 Total: ${savedQuote.total.toFixed(2)}€\n` +
                `📅 Fecha: ${new Date(savedQuote.date).toLocaleDateString('es-ES')}\n\n` +
                `¡Gracias por confiar en Print & Copy! 🎉`,
                getMainKeyboard()
            );
        }
        return;
    }
    
    if (data === 'clear_quote') {
        user.clearQuote();
        ctx.reply('🗑️ Cotización limpiada.\n\n¿En qué más puedo ayudarte?');
        return;
    }
    
    // Manejar categorías de productos
    if (data.startsWith('cat_')) {
        const category = data.replace('cat_', '');
        showProductCategory(ctx, category);
        return;
    }
});

// Mostrar productos por categoría
function showProductCategory(ctx, category) {
    console.log(`📂 Mostrando categoría: ${category}`);
    
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
    
    message += '\n💬 Pregúntame por cualquier producto específico con la cantidad que necesitas.\n📝 Ejemplo: "50 tazas personalizadas"';
    
    ctx.reply(message);
}

// 🔧 CORREGIDO COMPLETAMENTE: Manejar mensajes de texto
bot.on('text', (ctx) => {
    const user = ctx.user;
    const message = ctx.message.text;
    
    console.log(`💬 Mensaje recibido: "${message}" de ${user.userData.name || 'Usuario sin registrar'}`);
    console.log(`📋 Estado: Registrado=${user.registered}, Paso=${user.registrationStep}`);
    
    // 🔧 CORREGIDO: Proceso de registro
    if (!user.registered) {
        if (user.registrationStep === 'name') {
            user.userData.name = message.trim();
            user.registrationStep = 'email';
            console.log(`✅ Nombre guardado: ${user.userData.name}`);
            ctx.reply('📧 Perfecto! ¿Cuál es tu correo electrónico?');
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
            console.log(`✅ Email guardado: ${user.userData.email}`);
            ctx.reply('📞 Excelente! ¿Cuál es tu número de teléfono?');
            return;
        }
        
        if (user.registrationStep === 'phone') {
            user.userData.phone = message.trim();
            user.registered = true;
            console.log(`✅ Teléfono guardado: ${user.userData.phone} - Usuario registrado completamente`);
            ctx.reply(
                `¡Perfecto, ${user.userData.name}! 🎉\n\n` +
                'Ya estás registrado en Print & Copy.\n\n' +
                '💬 Ahora puedes preguntarme sobre productos y precios.\n\n' +
                '📝 Ejemplo: "50 tazas personalizadas"',
                getMainKeyboard()
            );
            return;
        }
    }
    
    // 🔧 CORREGIDO: Manejar botones del teclado (simplificado)
    if (message === '🛒 Mi Cotización') {
        console.log('🔘 Botón: Mi Cotización');
        // Ejecutar directamente la lógica de cotización
        const user = ctx.user;
        if (user.quotedItems.length === 0) {
            ctx.reply('🛒 Tu cotización está vacía.\n\n¡Pregúntame por productos y te ayudo a cotizar!\n\n📝 Ejemplo: "50 tazas personalizadas"');
            return;
        }
        
        let quotationMessage = '🛒 **Tu Cotización Actual:**\n\n';
        user.quotedItems.forEach((item, index) => {
            quotationMessage += `${index + 1}. ${item.name}\n`;
            quotationMessage += `   📦 ${item.quantity} uds × ${item.unitPrice.toFixed(2)}€ = ${item.totalPrice.toFixed(2)}€\n\n`;
        });
        
        quotationMessage += `💰 **Total: ${user.getQuoteTotal().toFixed(2)}€**`;
        
        ctx.reply(quotationMessage, Markup.inlineKeyboard([
            [Markup.button.callback('📄 Finalizar Cotización', 'finalize_quote')],
            [Markup.button.callback('🗑️ Limpiar', 'clear_quote')]
        ]));
        return;
    }
    
    if (message === '📦 Ver Productos') {
        console.log('🔘 Botón: Ver Productos');
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
        return;
    }
    
    if (message === '💬 Chatear') {
        console.log('🔘 Botón: Chatear');
        ctx.reply('💬 ¡Perfecto! Ahora puedes preguntarme lo que necesites.\n\n📝 **Ejemplos:**\n• "50 tazas personalizadas"\n• "Productos para boda"\n• "¿Cuánto cuestan los abanicos?"\n\n¿En qué te ayudo?');
        return;
    }
    
    if (message === '📞 Contacto') {
        console.log('🔘 Botón: Contacto');
        ctx.reply('📞 **Contacta con nosotros:**\n\n📧 Email: info@printcopy.com\n📱 WhatsApp: +34 000 000 000\n🌐 Web: https://printcopy.com\n\n¡Estaremos encantados de ayudarte!');
        return;
    }
    
    // Guardar mensaje en historial
    user.addMessage('user', message);
    
    // 🔧 CORREGIDO: Generar respuesta
    console.log('🤖 Generando respuesta...');
    const response = getSmartResponse(message, user);
    user.addMessage('bot', response);
    
    console.log(`🤖 Respuesta enviada: ${response.substring(0, 50)}...`);
    ctx.reply(response);
});

// Manejar errores
bot.catch((err, ctx) => {
    console.error('❌ Error en el bot:', err);
    console.error('📍 Contexto del error:', {
        updateType: ctx?.updateType,
        userId: ctx?.from?.id,
        message: ctx?.message?.text
    });
    
    if (ctx && ctx.reply) {
        ctx.reply('❌ Ocurrió un error técnico. Por favor, inténtalo de nuevo.\n\n💬 Si el problema persiste, escribe /start para reiniciar.');
    }
});

// 🔧 MEJORADO: Iniciar bot con mejor logging
console.log('🚀 Iniciando bot de Telegram...');
console.log(`📦 Productos cargados: ${Object.keys(products).length}`);

bot.launch()
    .then(() => {
        console.log('✅ Bot de Telegram iniciado correctamente');
        console.log('📱 Los usuarios pueden buscar tu bot en Telegram');
        
        // Extraer el nombre del bot del token
        const botUsername = BOT_TOKEN.split(':')[0];
        console.log(`🔗 Enlace directo: https://t.me/${botUsername}`);
        
        // Log de productos disponibles
        console.log(`📦 Productos disponibles: ${Object.keys(products).join(', ')}`);
    })
    .catch((error) => {
        console.error('❌ Error al iniciar el bot:', error);
        console.error('💡 Verifica que el TELEGRAM_BOT_TOKEN sea válido');
        console.error('🔧 Verifica que @BotFather haya creado el bot correctamente');
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
