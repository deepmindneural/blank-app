// Base de datos completa de productos de Print & Copy
// Todos los productos con precios exactos según especificaciones

const products = {
    // ========================================
    // PRODUCTOS DE PAPELERÍA Y DETALLES
    // ========================================
    
    'recordatorios': {
        name: 'Recordatorios',
        category: 'papeleria',
        prices: [
            { min: 20, max: 30, price: 1.25 },
            { min: 31, max: 40, price: 0.85 },
            { min: 41, max: 50, price: 0.95 },
            { min: 51, max: 100, price: 1.10 },
            { min: 101, max: Infinity, price: 0.75 }
        ]
    },
    
    'marcapaginas': {
        name: 'Marcapáginas',
        category: 'papeleria',
        prices: [
            { min: 20, max: 30, price: 1.30 },
            { min: 31, max: 40, price: 0.80 },
            { min: 41, max: 50, price: 0.95 },
            { min: 51, max: 100, price: 1.10 },
            { min: 101, max: Infinity, price: 0.65 }
        ]
    },
    
    'etiquetas': {
        name: 'Etiquetas y Pegatinas',
        category: 'papeleria',
        prices: [
            { min: 20, max: 30, price: 0.60 },
            { min: 31, max: 40, price: 0.90 },
            { min: 41, max: 50, price: 0.80 },
            { min: 61, max: Infinity, price: 0.55 }
        ]
    },
    
    // ========================================
    // PRODUCTOS PARA BODAS
    // ========================================
    
    'invitaciones_boda': {
        name: 'Invitaciones de Boda',
        category: 'bodas',
        prices: [
            { min: 25, max: 25, price: 1.70 },
            { min: 50, max: 50, price: 1.95 },
            { min: 100, max: 100, price: 2.75 },
            { min: 150, max: 150, price: 1.20 },
            { min: 200, max: 200, price: 1.45 },
            { min: 250, max: 250, price: 2.45 }
        ]
    },
    
    'seating_plan': {
        name: 'Seating Plan (Cartón Pluma + Vinilo Laminado)',
        category: 'bodas',
        prices: [
            { size: '70x50cm', price: 59.90 },
            { size: '100x70cm', price: 89.90 }
        ]
    },
    
    'libro_firmas': {
        name: 'Libros de Firmas',
        category: 'bodas',
        price: 49.90,
        design: 9.00,
        description: 'Precio total incluye IVA, diseño adicional'
    },
    
    'marcasitios': {
        name: 'Marcasitios',
        category: 'bodas',
        prices: [
            { min: 25, max: 25, price: 1.25 },
            { min: 50, max: 50, price: 0.95 },
            { min: 100, max: 100, price: 0.75 },
            { min: 150, max: 150, price: 0.65 },
            { min: 200, max: 200, price: 0.85 }
        ]
    },
    
    'menus': {
        name: 'Menús',
        category: 'bodas',
        prices: [
            { min: 25, max: 25, price: 1.60 },
            { min: 50, max: 50, price: 1.85 },
            { min: 100, max: 100, price: 1.10 },
            { min: 150, max: 150, price: 1.35 },
            { min: 200, max: 200, price: 0.65 }
        ]
    },
    
    'lista_boda': {
        name: 'Lista de Boda',
        category: 'bodas',
        prices: [
            { min: 50, max: 50, price: 0.48 },
            { min: 100, max: 100, price: 0.29 },
            { min: 150, max: 150, price: 0.26 },
            { min: 200, max: 200, price: 0.23 }
        ]
    },
    
    'numeros_mesa': {
        name: 'Números de Mesa',
        category: 'bodas',
        prices: [
            { size: '13x18cm', price: 2.95 },
            { size: '10x15cm', price: 2.45 }
        ]
    },
    
    // ========================================
    // PRODUCTOS PUBLICITARIOS
    // ========================================
    
    'roll_up': {
        name: 'Roll Up',
        category: 'publicitarios',
        prices: [
            { size: '85x200cm', price: 95.00 },
            { size: '100x200cm', price: 119.00 },
            { size: '120x200cm', price: 143.00 }
        ]
    },
    
    'arbol_huellas': {
        name: 'Árboles de Huellas',
        category: 'bodas',
        price: 29.95
    },
    
    // ========================================
    // PRODUCTOS PERSONALIZADOS
    // ========================================
    
    'tazas': {
        name: 'Tazas Personalizadas',
        category: 'personalizados',
        prices: [
            { min: 5, max: 10, price: 8.95 },
            { min: 11, max: 15, price: 9.50 },
            { min: 16, max: 20, price: 7.95 },
            { min: 21, max: 30, price: 5.95 },
            { min: 61, max: Infinity, price: 3.25 }
        ]
    },
    
    'chapas': {
        name: 'Chapas, Abridores y Espejos',
        category: 'personalizados',
        prices: [
            { min: 10, max: 24, price: 1.85 },
            { min: 25, max: 49, price: 1.95 },
            { min: 50, max: 99, price: 0.55 },
            { min: 100, max: 149, price: 2.40 },
            { min: 150, max: Infinity, price: 2.35 }
        ]
    },
    
    'llaveros': {
        name: 'Llaveros Personalizados',
        category: 'personalizados',
        prices: [
            { min: 10, max: 24, price: 4.25 },
            { min: 25, max: 49, price: 5.50 },
            { min: 50, max: 99, price: 3.75 },
            { min: 100, max: 149, price: 2.75 },
            { min: 150, max: Infinity, price: 3.25 }
        ]
    },
    
    'imanes': {
        name: 'Imanes Personalizados',
        category: 'personalizados',
        prices: [
            { min: 10, max: 24, price: 2.75 },
            { min: 25, max: 49, price: 2.25 },
            { min: 50, max: 99, price: 1.15 },
            { min: 100, max: 149, price: 0.90 },
            { min: 150, max: Infinity, price: 1.75 }
        ]
    },
    
    'pulseras': {
        name: 'Pulseras Personalizadas',
        category: 'personalizados',
        prices: [
            { min: 25, max: 99, price: 0.70, material: 'Papel y Tela' },
            { min: 100, max: 499, price: 0.95, material: 'Silicona y Bordadas' },
            { min: 500, max: 999, price: 1.25, material: 'Silicona y Bordadas' },
            { min: 1000, max: Infinity, price: 1.25, material: 'Silicona y Bordadas' }
        ]
    },
    
    'tarjeton_balsamo': {
        name: 'Tarjetón y Bálsamo Epson',
        category: 'personalizados',
        prices: [
            { min: 25, max: 25, price: 2.85 },
            { min: 50, max: 50, price: 2.30 },
            { min: 100, max: 100, price: 1.90 },
            { min: 150, max: 150, price: 1.75 },
            { min: 200, max: 200, price: 1.40 },
            { min: 240, max: 240, price: 2.10 }
        ]
    },
    
    // ========================================
    // ABANICOS (4 TIPOS DIFERENTES)
    // ========================================
    
    'abanicos_lencer': {
        name: 'Abanicos Lencer',
        category: 'abanicos',
        material: 'Lencer premium',
        prices: [
            { min: 50, max: 50, price: 4.70 },
            { min: 100, max: 100, price: 3.25 },
            { min: 200, max: 200, price: 2.89 },
            { min: 300, max: 300, price: 2.75 }
        ]
    },
    
    'abanicos_kronix': {
        name: 'Abanicos Kronix',
        category: 'abanicos',
        material: 'Kronix resistente',
        prices: [
            { min: 50, max: 50, price: 2.99 },
            { min: 100, max: 100, price: 2.49 },
            { min: 200, max: 200, price: 2.05 },
            { min: 300, max: 300, price: 1.95 }
        ]
    },
    
    'abanicos_madera': {
        name: 'Abanicos Madera',
        category: 'abanicos',
        material: 'Madera natural',
        prices: [
            { min: 50, max: 50, price: 2.99 },
            { min: 100, max: 100, price: 2.49 },
            { min: 200, max: 200, price: 2.05 },
            { min: 300, max: 300, price: 1.95 }
        ]
    },
    
    'abanicos_bilsom': {
        name: 'Abanicos Bilsom',
        category: 'abanicos',
        material: 'Bilsom económico',
        prices: [
            { min: 50, max: 50, price: 1.79 },
            { min: 100, max: 100, price: 1.44 },
            { min: 200, max: 200, price: 1.08 },
            { min: 300, max: 300, price: 0.95 }
        ]
    },
    
    // ========================================
    // PRODUCTOS TECNOLÓGICOS
    // ========================================
    
    'cargador_3en1': {
        name: 'Cargador 3 en 1',
        category: 'tecnologia',
        description: 'Cargador universal para móviles',
        prices: [
            { min: 100, max: 100, price: 4.15 },
            { min: 150, max: 150, price: 3.95 },
            { min: 250, max: 250, price: 3.75 },
            { min: 300, max: 300, price: 3.65 },
            { min: 500, max: 500, price: 3.15 }
        ]
    },
    
    // ========================================
    // PRODUCTOS DE ALQUILER
    // ========================================
    
    'neones': {
        name: 'Neones (Alquiler)',
        category: 'alquiler',
        rental_price: 129,
        deposit: 75,
        delivery: 'Gratis',
        dimensions: 'Desde 25x135cm hasta 100x60cm',
        description: 'Alquiler de neones personalizados con entrega y recogida incluida'
    }
};

// ========================================
// FUNCIONES AUXILIARES
// ========================================

// Función para obtener todos los productos
function getAllProducts() {
    return products;
}

// Función para obtener productos por categoría
function getProductsByCategory(category) {
    const result = {};
    for (const [key, product] of Object.entries(products)) {
        if (product.category === category) {
            result[key] = product;
        }
    }
    return result;
}

// Función para buscar productos por nombre
function searchProducts(searchTerm) {
    const result = {};
    const term = searchTerm.toLowerCase();
    
    for (const [key, product] of Object.entries(products)) {
        if (product.name.toLowerCase().includes(term) || key.includes(term)) {
            result[key] = product;
        }
    }
    return result;
}

// Función para obtener un producto específico
function getProduct(productKey) {
    return products[productKey] || null;
}

// Función para obtener categorías disponibles
function getCategories() {
    const categories = new Set();
    for (const product of Object.values(products)) {
        if (product.category) {
            categories.add(product.category);
        }
    }
    return Array.from(categories);
}

// Función para calcular precio según cantidad
function calculateProductPrice(productKey, quantity) {
    const product = products[productKey];
    if (!product) return 0;
    
    // Productos con rangos de precios
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
            if (priceRange.min) {
                const diff = Math.abs(quantity - priceRange.min);
                if (diff < closestDiff) {
                    closestDiff = diff;
                    closestPrice = priceRange.price;
                }
            }
        }
        
        return closestPrice;
    }
    
    // Productos con precio fijo
    if (product.price) {
        return product.price;
    }
    
    // Productos de alquiler
    if (product.rental_price) {
        return product.rental_price;
    }
    
    return 0;
}

// Función para obtener información de precios formateada
function getProductPriceInfo(productKey) {
    const product = products[productKey];
    if (!product) return 'Producto no encontrado';
    
    let info = `${product.name}\n`;
    
    if (product.prices) {
        info += 'Precios por cantidad:\n';
        product.prices.forEach(price => {
            if (price.min && price.max) {
                if (price.max === Infinity) {
                    info += `• Más de ${price.min} uds: ${price.price.toFixed(2)}€\n`;
                } else if (price.min === price.max) {
                    info += `• ${price.min} uds: ${price.price.toFixed(2)}€\n`;
                } else {
                    info += `• ${price.min}-${price.max} uds: ${price.price.toFixed(2)}€\n`;
                }
                if (price.material) {
                    info += `  (${price.material})\n`;
                }
            } else if (price.size) {
                info += `• ${price.size}: ${price.price.toFixed(2)}€\n`;
            }
        });
    } else if (product.price) {
        info += `Precio fijo: ${product.price.toFixed(2)}€\n`;
        if (product.design) {
            info += `Diseño adicional: ${product.design.toFixed(2)}€\n`;
        }
    } else if (product.rental_price) {
        info += `Alquiler: ${product.rental_price}€\n`;
        info += `Fianza: ${product.deposit}€\n`;
        info += `Entrega: ${product.delivery}\n`;
        info += `Dimensiones: ${product.dimensions}\n`;
    }
    
    return info;
}

// ========================================
// ESTADÍSTICAS DE PRODUCTOS
// ========================================

// Función para obtener estadísticas del catálogo
function getProductStats() {
    const categories = {};
    let totalProducts = 0;
    let withPriceRanges = 0;
    let withFixedPrice = 0;
    let rentalProducts = 0;
    
    for (const [key, product] of Object.entries(products)) {
        totalProducts++;
        
        // Contar por categorías
        const category = product.category || 'sin_categoria';
        categories[category] = (categories[category] || 0) + 1;
        
        // Contar por tipo de precio
        if (product.prices) withPriceRanges++;
        else if (product.price) withFixedPrice++;
        else if (product.rental_price) rentalProducts++;
    }
    
    return {
        total: totalProducts,
        categories,
        priceTypes: {
            ranges: withPriceRanges,
            fixed: withFixedPrice,
            rental: rentalProducts
        }
    };
}

// ========================================
// EXPORTACIÓN (Para Node.js y Browser)
// ========================================

// Para uso en Node.js (Telegram bot)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        getAllProducts,
        getProductsByCategory,
        searchProducts,
        getProduct,
        getCategories,
        calculateProductPrice,
        getProductPriceInfo,
        getProductStats
    };
}

// Para uso en el navegador (Chatbot web)
if (typeof window !== 'undefined') {
    window.products = products;
    window.getAllProducts = getAllProducts;
    window.getProductsByCategory = getProductsByCategory;
    window.searchProducts = searchProducts;
    window.getProduct = getProduct;
    window.getCategories = getCategories;
    window.calculateProductPrice = calculateProductPrice;
    window.getProductPriceInfo = getProductPriceInfo;
    window.getProductStats = getProductStats;
}
