# 🤖 Configuración Bot de Telegram - Paso a Paso

## 🎯 **Lo que DEBES hacer (no hay otra opción)**

Las claves API **SOLO** van en variables de entorno de Coolify. **NUNCA** en el código.

---

## 📱 **Paso 1: Crear Bot en Telegram**

### 1.1 Hablar con BotFather
1. Abre Telegram
2. Busca: `@BotFather`
3. Inicia conversación: `/start`

### 1.2 Crear el bot
```
Tú: /newbot
BotFather: Alright, a new bot. How are we going to call it?

Tú: Print & Copy Asistente
BotFather: Good. Now let's choose a username for your bot.

Tú: printcopy_asistente_bot
BotFather: Done! Congratulations on your new bot.
```

### 1.3 GUARDAR EL TOKEN
```
Use this token to access the HTTP API:
123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11

Keep your token secure and store it safely...
```

**⚠️ IMPORTANTE: Copia y guarda este token completo**

---

## ⚙️ **Paso 2: Configurar en Coolify**

### 2.1 Ir a tu aplicación en Coolify
1. Entra a tu panel de Coolify
2. Selecciona tu aplicación `print-copy-chatbot`
3. Ve a la pestaña **"Environment Variables"**

### 2.2 Agregar variables de entorno

**Variable 1 - Bot de Telegram:**
```
Name: TELEGRAM_BOT_TOKEN
Value: 123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
☐ Is Build Variable? (NO marcar)
☐ Is Multiline? (NO marcar)
☐ Is Literal? (NO marcar)
```

**Variable 2 - OpenAI (opcional):**
```
Name: OPENAI_API_KEY  
Value: sk-proj-tu-clave-openai-aqui
☐ Is Build Variable? (NO marcar)
☐ Is Multiline? (NO marcar)
☐ Is Literal? (NO marcar)
```

### 2.3 Guardar y reiniciar
1. Clic en **"Save"** 
2. Ve a **"Deployments"**
3. Clic en **"Redeploy"** para reiniciar con las nuevas variables

---

## 🚀 **Paso 3: Configurar Start Command**

En Coolify, en la sección **"Start Command"**:

### Opción A: Solo bot web
```
npm start
```

### Opción B: Web + Telegram (RECOMENDADO)
```
node server.js & node telegram-bot.js
```

### Opción C: Solo bot Telegram
```
npm run telegram
```

---

## ✅ **Paso 4: Verificar que Funciona**

### 4.1 Ver logs en Coolify
1. Ve a **"Logs"** en tu aplicación
2. Deberías ver:
```
✅ TELEGRAM_BOT_TOKEN configurado correctamente
✅ OPENAI_API_KEY configurado correctamente
🚀 Iniciando bot de Telegram...
✅ Bot de Telegram iniciado correctamente
📱 Los usuarios pueden buscar tu bot en Telegram
```

### 4.2 Probar el bot
1. En Telegram, busca: `@printcopy_asistente_bot`
2. Envía: `/start`
3. Debería responder: "¡Bienvenido a Print & Copy! ¿Tu nombre?"

---

## 🐛 **Solución de Problemas**

### ❌ Error: "TELEGRAM_BOT_TOKEN no está configurado"

**Causa:** Variable de entorno mal configurada
**Solución:**
1. Verificar que el nombre sea exacto: `TELEGRAM_BOT_TOKEN`
2. Verificar que el token empiece con números: `123456789:ABC...`
3. Reiniciar la aplicación en Coolify

### ❌ Error: "401 Unauthorized" 

**Causa:** Token inválido
**Solución:**
1. Generar nuevo token con @BotFather: `/newtoken`
2. Actualizar variable en Coolify
3. Reiniciar aplicación

### ❌ Bot no responde

**Causa:** Bot no está ejecutándose
**Solución:**
1. Verificar logs en Coolify
2. Verificar Start Command: `node server.js & node telegram-bot.js`
3. Verificar que no hay errores en el código

### ❌ Error: "Cannot find module 'telegraf'"

**Causa:** Dependencias no instaladas
**Solución:**
1. Verificar que `package.json` incluye: `"telegraf": "^4.12.2"`
2. En Coolify, forzar rebuild: **"Redeploy"**

---

## 📊 **Estructura Final en Coolify**

### Variables de Entorno:
```
TELEGRAM_BOT_TOKEN = 123456789:ABC-DEF...
OPENAI_API_KEY = sk-proj-tu-clave... (opcional)
NODE_ENV = production (opcional)
PORT = 3000 (opcional)
```

### Start Command:
```bash
node server.js & node telegram-bot.js
```

### Archivos en el proyecto:
```
print-copy-chatbot/
├── telegram-bot.js        ← Bot de Telegram (CORREGIDO)
├── server.js              ← Servidor web
├── package.json           ← Con dependencia 'telegraf'
└── ...resto de archivos
```

---

## 🎯 **Resultado Final**

Cuando esté todo configurado correctamente:

### En Coolify verás:
```
✅ Build successful
✅ TELEGRAM_BOT_TOKEN configurado correctamente  
✅ Bot de Telegram iniciado correctamente
🌐 Servidor web corriendo en puerto 3000
```

### En Telegram:
```
Usuario: /start
Bot: ¡Bienvenido a Print & Copy! 🖨️ ¿Tu nombre?
Usuario: Juan Pérez  
Bot: ¿Tu email?
Usuario: juan@email.com
Bot: ¿Tu teléfono?
Usuario: +34 600 000 000
Bot: ¡Perfecto Juan! ¿En qué te ayudo?
Usuario: 50 tazas
Bot: ✅ Agregado: 50 tazas × 3,25€ = 162,50€
```

---

## 🚨 **IMPORTANTE**

1. **NUNCA** pongas tokens en el código
2. **SIEMPRE** usa variables de entorno en Coolify
3. **REGENERA** el token si lo compartiste accidentalmente
4. **VERIFICA** logs para debugging

¡Con esta configuración tu bot funcionará perfectamente! 🚀
