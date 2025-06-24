// Servidor Node.js para servir el chatbot con variables de entorno
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Servir archivos estáticos
app.use(express.static('.'));

// Endpoint para obtener configuración (sin exponer la API key completa)
app.get('/api/config', (req, res) => {
    const hasApiKey = !!process.env.OPENAI_API_KEY;
    
    res.json({
        hasApiKey,
        source: hasApiKey ? 'environment' : 'none',
        message: hasApiKey ? '✅ ChatGPT configurado via variable de entorno' : '⚠️ No configurado'
    });
});

// Endpoint para hacer requests a OpenAI (proxy seguro)
app.use(express.json());
app.post('/api/chat', async (req, res) => {
    if (!process.env.OPENAI_API_KEY) {
        return res.status(400).json({ 
            error: 'API key no configurada en el servidor' 
        });
    }

    try {
        const { message, userData, products, chatHistory } = req.body;
        
        // Crear contexto
        const context = `Eres un asistente de ventas amigable y entusiasta de Print & Copy, una empresa de productos impresos y personalizados. Tu nombre es Asistente Virtual de Print & Copy. Siempre responde en español.

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
${Object.keys(products || {}).join(', ')}

Historial reciente:
${chatHistory?.slice(-5).map(msg => `${msg.sender === 'user' ? 'Cliente' : 'Asistente'}: ${msg.content}`).join('\n') || ''}

Pregunta actual: ${message}`;

        // Hacer request a OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
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
            throw new Error(`OpenAI API Error: ${errorData.error?.message || response.statusText}`);
        }

        const data = await response.json();
        res.json({ 
            response: data.choices[0].message.content,
            source: 'openai'
        });

    } catch (error) {
        console.error('Error en /api/chat:', error);
        res.status(500).json({ 
            error: error.message,
            fallback: true
        });
    }
});

// Servir index.html para todas las rutas
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🤖 OpenAI configurado: ${!!process.env.OPENAI_API_KEY}`);
});
