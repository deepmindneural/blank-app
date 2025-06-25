
# 🚀 Configuración Completa - Print & Copy Chatbot

## ✅ **Problemas Solucionados**

### 🐛 **1. Cotizaciones Corregidas**
- ✅ Auto-guardado en tiempo real
- ✅ Historial completo visible en admin
- ✅ Botones para gestionar cotizaciones
- ✅ Estados: "En Progreso" y "Finalizada"

### 📦 **2. Módulo de Productos**
- ✅ Panel completo en admin
- ✅ Búsqueda y filtros
- ✅ Gestión de productos
- ✅ Exportación a CSV

### 📱 **3. Bot de Telegram**
- ✅ Misma funcionalidad que web
- ✅ Registro de usuarios
- ✅ Cotizaciones automáticas
- ✅ Teclados interactivos

---

## 📁 **Archivos Actualizados/Nuevos**

### **Archivos a Reemplazar:**
```
js/quotes.js          ← REEMPLAZAR (auto-guardado corregido)
index.html            ← ACTUALIZAR (botones cotización)
admin.html            ← ACTUALIZAR (módulo productos)
package.json          ← ACTUALIZAR (dependencias Telegram)
```

### **Archivos Nuevos:**
```
telegram-bot.js       ← NUEVO (bot de Telegram)
SETUP-COMPLETO.md     ← NUEVO (esta guía)
```

---

## 🤖 **Configuración Bot de Telegram**

### **Paso 1: Crear Bot en Telegram**
1. Habla con [@BotFather](https://t.me/BotFather) en Telegram
2. Envía `/newbot`
3. Elige un nombre: `Print & Copy Asistente`
4. Elige un username: `printcopy_bot` (debe terminar en `_bot`)
5. **Guarda el TOKEN** que te dé

### **Paso 2: Configurar Variables de Entorno**
En Coolify, agregar estas variables:

```
TELEGRAM_BOT_TOKEN=123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
OPENAI_API_KEY=sk-proj-tu-clave-openai
```

### **Paso 3: Actualizar Scripts en package.json**
```json
{
  "scripts": {
    "start": "node server.js",
    "telegram": "node telegram-bot.js",
    "both": "node server.js & node telegram-bot.js"
  }
}
```

### **Paso 4: Configurar Coolify para ambos servicios**

#### **Opción A: Un solo servicio (Recomendado)**
```bash
# En Coolify, usar este start command:
node server.js & node telegram-bot.js
```

#### **Opción B: Dos servicios separados**
- **Servicio 1**: Chatbot Web (`npm start`)
- **Servicio 2**: Bot Telegram (`npm run telegram`)

---

## 🎯 **Funcionalidades del Bot de Telegram**

### **Comandos Disponibles:**
- `/start` - Iniciar y registrarse
- `/cotizacion` - Ver cotización actual
- `/productos` - Explorar catálogo

### **Teclado Interactivo:**
```
🛒 Mi Cotización    📦 Ver Productos
💬 Chatear         📞 Contacto
```

### **Flujo de Usuario:**
1. **Registro**: Nombre → Email → Teléfono
2. **Consultas**: "50 tazas personalizadas"
3. **Cotización**: Automática en tiempo real
4. **Finalización**: Guarda en historial

### **Características Avanzadas:**
- 🔄 **Sincronización**: Misma lógica que web
- 📱 **Nativo**: Teclados y botones Telegram
- 💾 **Persistencia**: Base de datos temporal
- 📊 **Análisis**: Tracking completo

---

## 🌐 **Configuración Web Mejorada**

### **Nuevas Funciones en la Web:**
- 🔄 **Nuevo Cliente**: Botón en header
- ⚙️ **Admin Mejorado**: Panel de productos
- 💾 **Auto-guardado**: Cotizaciones en tiempo real
- 🗑️ **Gestión**: Eliminar productos de cotización

### **Panel de Administración:**
- 📊 **Estadísticas**: Ingresos totales, promedios
- 📋 **Cotizaciones**: Búsqueda, filtros, exportación
- 📦 **Productos**: Catálogo completo, gestión
- 🔧 **API**: Configuración ChatGPT

---

## 🚀 **Despliegue en Coolify**

### **Variables de Entorno Necesarias:**
```env
# OpenAI (opcional pero recomendado)
OPENAI_API_KEY=sk-proj-tu-clave-aqui

# Telegram Bot (requerido para bot)
TELEGRAM_BOT_TOKEN=123456789:ABC-DEF...

# Configuración opcional
NODE_ENV=production
PORT=3000
```

### **Start Command:**
```bash
# Para web + telegram
node server.js & node telegram-bot.js

# Solo web
node server.js

# Solo telegram
node telegram-bot.js
```

### **Build Command:**
```bash
npm install
```

---

## 📱 **Uso del Bot de Telegram**

### **Para Clientes:**
```
👤 Cliente: "Hola"
🤖 Bot: "¡Hola! Necesito tus datos..."
👤 Cliente: "Juan Pérez"
🤖 Bot: "¿Tu email?"
👤 Cliente: "juan@email.com"
🤖 Bot: "¿Tu teléfono?"
👤 Cliente: "+34 600 000 000"
🤖 Bot: "¡Perfecto Juan! ¿En qué te ayudo?"
👤 Cliente: "50 tazas personalizadas"
🤖 Bot: "✅ Agregado: 50 tazas × 3,25€ = 162,50€"
👤 Cliente: "/cotizacion"
🤖 Bot: "🛒 Tu cotización: 162,50€ [Finalizar]"
```

### **Para Administradores:**
- 📊 Todas las cotizaciones aparecen en admin web
- 🔍 Se pueden buscar por nombre/email/teléfono
- 📤 Exportar a CSV incluye origen (Web/Telegram)
- 📈 Estadísticas combinadas de ambas fuentes

---

## 🧪 **Testing del Sistema**

### **Probar Chatbot Web:**
1. Abrir `https://tu-dominio.com`
2. Completar registro
3. Preguntar: "50 tazas personalizadas"
4. Verificar cotización se agrega
5. Ir a `/admin.html`
6. Verificar cotización aparece

### **Probar Bot Telegram:**
1. Buscar `@tu_bot_name` en Telegram
2. Enviar `/start`
3. Completar registro
4. Escribir: "50 tazas"
5. Verificar cotización automática
6. Usar `/cotizacion` para ver resumen

### **Probar Integración:**
1. Crear cotizaciones en ambos canales
2. Verificar que aparecen en admin web
3. Exportar CSV y verificar origen
4. Probar búsquedas y filtros

---

## 🔧 **Solución de Problemas**

### **Bot de Telegram no responde:**
```bash
# Verificar token
echo $TELEGRAM_BOT_TOKEN

# Ver logs
node telegram-bot.js
```

### **Cotizaciones no se guardan:**
```javascript
// Verificar en consola del navegador
localStorage.getItem('printCopyAllQuotes')
```

### **Productos no aparecen en admin:**
```javascript
// Verificar productos cargados
localStorage.getItem('printCopyProducts')
```

### **API ChatGPT no funciona:**
- Verificar variable `OPENAI_API_KEY`
- Verificar créditos en OpenAI
- Comprobar conexión de red

---

## 🎉 **Resultado Final**

### **Sistema Completo Incluye:**
- ✅ **Chatbot Web**: Cotizaciones en tiempo real
- ✅ **Bot Telegram**: Funcionalidad completa
- ✅ **Panel Admin**: Gestión total
- ✅ **Auto-guardado**: No se pierde nada
- ✅ **Multi-canal**: Web + Telegram integrados
- ✅ **Exportación**: CSV, PDF, JSON
- ✅ **Búsquedas**: Potentes filtros
- ✅ **Estadísticas**: Ingresos y métricas

### **Para Print & Copy:**
- 📈 **Ventas 24/7**: Atención automatizada
- 📱 **Multi-canal**: Web y Telegram
- 📊 **Análisis**: Métricas de negocio
- 🤖 **IA Real**: Respuestas naturales
- 💾 **Historial**: Todas las cotizaciones
- 📤 **Reportes**: Exportación automática

¡Tu sistema está listo para revolucionar Print & Copy! 🚀
