// Funciones para el manejo de cotizaciones - CORREGIDO

// Procesar mensaje para cotización
function processMessageForQuote(message) {
    const lowerMessage = message.toLowerCase();
    
    // Regex para detectar cantidades y productos
    const quantityMatch = lowerMessage.match(/(\d+)\s*(unidades?|uds?|piezas?)?/);
    
    if (quantityMatch) {
        const quantity = parseInt(quantityMatch[1]);
        
        // Cargar productos desde localStorage
        const products = JSON.parse(localStorage.getItem('printCopyProducts'));
        
        // Buscar producto mencionado
        for (const [key, product] of Object.entries(products)) {
            if (lowerMessage.includes(key) || lowerMessage.includes(product.name.toLowerCase())) {
                addToQuote(key, product, quantity);
                return;
            }
        }
        
        // Búsqueda por palabras clave
        if (lowerMessage.includes('taza')) {
            addToQuote('tazas', products.tazas, quantity);
        } else if (lowerMessage.includes('abanico')) {
            // Si no especifica tipo, agregar Bilsom (más económico)
            if (lowerMessage.includes('lencer')) {
                addToQuote('abanicos_lencer', products.abanicos_lencer, quantity);
            } else if (lowerMessage.includes('kronix')) {
                addToQuote('abanicos_kronix', products.abanicos_kronix, quantity);
            } else if (lowerMessage.includes('madera')) {
                addToQuote('abanicos_madera', products.abanicos_madera, quantity);
            } else {
                addToQuote('abanicos_bilsom', products.abanicos_bilsom, quantity);
            }
        } else if (lowerMessage.includes('invitacion') || lowerMessage.includes('invitación')) {
            addToQuote('invitaciones_boda', products.invitaciones_boda, quantity);
        } else if (lowerMessage.includes('seating') || lowerMessage.includes('plano mesa')) {
            // Por defecto el tamaño más pequeño
            addToQuote('seating_plan', products.seating_plan, 1);
        }
    }
}

// Añadir producto a la cotización
function addToQuote(productKey, product, quantity) {
    const price = calculatePrice(product, quantity);
    
    if (price > 0) {
        // Cargar cotización actual
        const quotedItems = JSON.parse(localStorage.getItem('printCopyQuotedItems')) || [];
        
        const item = {
            id: Date.now(),
            productKey,
            name: product.name,
            quantity,
            unitPrice: price,
            totalPrice: price * quantity
        };
        
        // Añadir nuevo item
        quotedItems.push(item);
        
        // Guardar en localStorage
        localStorage.setItem('printCopyQuotedItems', JSON.stringify(quotedItems));
        
        // Actualizar visualización
        updateQuoteDisplay(quotedItems);
        
        // 🆕 AUTO-GUARDAR: Actualizar cotización en tiempo real
        autoSaveCurrentQuote();
        
        console.log('Producto agregado a cotización:', item.name, quantity, 'unidades');
    }
}

// 🆕 NUEVA FUNCIÓN: Auto-guardar cotización en tiempo real
function autoSaveCurrentQuote() {
    const userData = JSON.parse(localStorage.getItem('printCopyUserData')) || {};
    const quotedItems = JSON.parse(localStorage.getItem('printCopyQuotedItems')) || [];
    
    if (userData.name && quotedItems.length > 0) {
        let allQuotes = JSON.parse(localStorage.getItem('printCopyAllQuotes')) || [];
        
        // Buscar si ya existe una cotización en progreso para este usuario
        const existingIndex = allQuotes.findIndex(quote => 
            quote.user.email === userData.email && quote.status === 'En Progreso'
        );
        
        const quoteRecord = {
            id: existingIndex >= 0 ? allQuotes[existingIndex].id : Date.now(),
            date: new Date().toISOString(),
            user: {
                name: userData.name,
                email: userData.email,
                phone: userData.phone
            },
            items: quotedItems,
            total: calculateTotal(quotedItems),
            status: 'En Progreso'
        };
        
        if (existingIndex >= 0) {
            // Actualizar cotización existente
            allQuotes[existingIndex] = quoteRecord;
        } else {
            // Crear nueva cotización
            allQuotes.unshift(quoteRecord);
        }
        
        localStorage.setItem('printCopyAllQuotes', JSON.stringify(allQuotes));
        console.log('Cotización auto-guardada para:', userData.name);
    }
}

// 🆕 NUEVA FUNCIÓN: Finalizar cotización (cambiar estado)
function finalizeCurrentQuote() {
    const userData = JSON.parse(localStorage.getItem('printCopyUserData')) || {};
    
    if (userData.name) {
        let allQuotes = JSON.parse(localStorage.getItem('printCopyAllQuotes')) || [];
        
        // Buscar cotización en progreso
        const existingIndex = allQuotes.findIndex(quote => 
            quote.user.email === userData.email && quote.status === 'En Progreso'
        );
        
        if (existingIndex >= 0) {
            allQuotes[existingIndex].status = 'Finalizada';
            allQuotes[existingIndex].finalizedDate = new Date().toISOString();
            localStorage.setItem('printCopyAllQuotes', JSON.stringify(allQuotes));
            console.log('Cotización finalizada para:', userData.name);
        }
    }
}

// Calcular precio según cantidad
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

// Calcular total de una cotización
function calculateTotal(items) {
    return items.reduce((total, item) => total + (item.totalPrice || 0), 0);
}

// Actualizar visualización de la cotización
function updateQuoteDisplay(quotedItems = null) {
    // Si no se proporciona, cargar desde localStorage
    if (quotedItems === null) {
        quotedItems = JSON.parse(localStorage.getItem('printCopyQuotedItems')) || [];
    }
    
    const quoteList = document.getElementById('quoteList');
    if (!quoteList) return;
    
    let totalAmount = 0;
    
    if (quotedItems.length === 0) {
        quoteList.innerHTML = '<p style="text-align: center; color: #64748b; font-style: italic;">Aún no has agregado productos</p>';
    } else {
        quoteList.innerHTML = '';
        
        quotedItems.forEach((item, index) => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'quote-item';
            itemDiv.innerHTML = `
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">${item.quantity} unidades × ${item.unitPrice.toFixed(2)}€</div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="item-price">${item.totalPrice.toFixed(2)}€</div>
                    <button onclick="removeQuoteItem(${item.id})" style="background: #dc2626; color: white; border: none; border-radius: 4px; padding: 4px 8px; cursor: pointer; font-size: 12px;">×</button>
                </div>
            `;
            quoteList.appendChild(itemDiv);
            totalAmount += item.totalPrice;
        });
    }
    
    const totalAmountEl = document.getElementById('totalAmount');
    if (totalAmountEl) {
        totalAmountEl.textContent = `${totalAmount.toFixed(2)}€`;
    }
    
    // Auto-guardar cuando se actualiza la visualización
    autoSaveCurrentQuote();
}

// 🆕 MEJORADO: Eliminar un producto de la cotización
function removeQuoteItem(itemId) {
    const quotedItems = JSON.parse(localStorage.getItem('printCopyQuotedItems')) || [];
    const updatedItems = quotedItems.filter(item => item.id !== itemId);
    localStorage.setItem('printCopyQuotedItems', JSON.stringify(updatedItems));
    updateQuoteDisplay(updatedItems);
    
    console.log('Producto eliminado de cotización, ID:', itemId);
}

// 🆕 NUEVA FUNCIÓN: Limpiar cotización actual
function clearCurrentQuote() {
    if (confirm('¿Estás seguro de que quieres limpiar la cotización actual?')) {
        localStorage.setItem('printCopyQuotedItems', JSON.stringify([]));
        updateQuoteDisplay([]);
        console.log('Cotización actual limpiada');
    }
}

// 🆕 NUEVA FUNCIÓN: Generar PDF de cotización
function generateQuotePDF() {
    const userData = JSON.parse(localStorage.getItem('printCopyUserData')) || {};
    const quotedItems = JSON.parse(localStorage.getItem('printCopyQuotedItems')) || [];
    
    if (!userData.name || quotedItems.length === 0) {
        alert('No hay cotización para generar PDF');
        return;
    }
    
    // Finalizar cotización antes de generar PDF
    finalizeCurrentQuote();
    
    // Generar contenido del PDF (texto plano por ahora)
    const total = calculateTotal(quotedItems);
    const date = new Date().toLocaleDateString('es-ES');
    
    const pdfContent = `
PRINT & COPY - COTIZACIÓN

Fecha: ${date}

CLIENTE:
Nombre: ${userData.name}
Email: ${userData.email}
Teléfono: ${userData.phone}

PRODUCTOS:
${quotedItems.map(item => 
`• ${item.name}
  Cantidad: ${item.quantity} unidades
  Precio unitario: ${item.unitPrice.toFixed(2)}€
  Subtotal: ${item.totalPrice.toFixed(2)}€`
).join('\n\n')}

TOTAL: ${total.toFixed(2)}€

¡Gracias por confiar en Print & Copy!
    `.trim();
    
    // Crear blob y descargar
    const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cotizacion-${userData.name.replace(/\s+/g, '-')}-${date.replace(/\//g, '-')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert('Cotización descargada como archivo de texto');
}
