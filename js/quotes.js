// Funciones para el manejo de cotizaciones

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

// Actualizar visualización de la cotización
function updateQuoteDisplay(quotedItems = null) {
    // Si no se proporciona, cargar desde localStorage
    if (quotedItems === null) {
        quotedItems = JSON.parse(localStorage.getItem('printCopyQuotedItems')) || [];
    }
    
    const quoteList = document.getElementById('quoteList');
    let totalAmount = 0;
    
    if (quotedItems.length === 0) {
        quoteList.innerHTML = '<p style="text-align: center; color: #64748b; font-style: italic;">Aún no has agregado productos</p>';
    } else {
        quoteList.innerHTML = '';
        
        quotedItems.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'quote-item';
            itemDiv.innerHTML = `
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-quantity">${item.quantity} unidades × ${item.unitPrice.toFixed(2)}€</div>
                </div>
                <div class="item-price">${item.totalPrice.toFixed(2)}€</div>
            `;
            quoteList.appendChild(itemDiv);
            totalAmount += item.totalPrice;
        });
    }
    
    document.getElementById('totalAmount').textContent = `${totalAmount.toFixed(2)}€`;
}

// Eliminar un producto de la cotización
function removeQuoteItem(itemId) {
    const quotedItems = JSON.parse(localStorage.getItem('printCopyQuotedItems')) || [];
    const updatedItems = quotedItems.filter(item => item.id !== itemId);
    localStorage.setItem('printCopyQuotedItems', JSON.stringify(updatedItems));
    updateQuoteDisplay(updatedItems);
}

// Generar PDF de cotización
function generateQuotePDF() {
    // Aquí se podría implementar la generación de PDF
    alert('Función de generación de PDF en desarrollo');
}
