// Base de datos de productos de Print & Copy
const products = {
    // Productos de Papelería y Detalles
    'recordatorios': {
        name: 'Recordatorios',
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
        prices: [
            { min: 20, max: 30, price: 0.60 },
            { min: 31, max: 40, price: 0.90 },
            { min: 41, max: 50, price: 0.80 },
            { min: 61, max: Infinity, price: 0.55 }
        ]
    },
    'invitaciones_boda': {
        name: 'Invitaciones de Boda',
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
        prices: [
            { size: '70x50cm', price: 59.90 },
            { size: '100x70cm', price: 89.90 }
        ]
    },
    'libro_firmas': {
        name: 'Libros de Firmas',
        price: 49.90,
        design: 9.00
    },
    'marcasitios': {
        name: 'Marcasitios',
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
        prices: [
            { min: 50, max: 50, price: 0.48 },
            { min: 100, max: 100, price: 0.29 },
            { min: 150, max: 150, price: 0.26 },
            { min: 200, max: 200, price: 0.23 }
        ]
    },
    'numeros_mesa': {
        name: 'Números de Mesa',
        prices: [
            { size: '13x18cm', price: 2.95 },
            { size: '10x15cm', price: 2.45 }
        ]
    },
    'roll_up': {
        name: 'Roll Up',
        prices: [
            { size: '85x200cm', price: 95.00 },
            { size: '100x200cm', price: 119.00 },
            { size: '120x200cm', price: 143.00 }
        ]
    },
    'arbol_huellas': {
        name: 'Árboles de Huellas',
        price: 29.95
    },
    // Productos de Detalles Personalizados
    'tazas': {
        name: 'Tazas Personalizadas',
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
        prices: [
            { min: 25, max: 99, price: 0.70, material: 'Papel y Tela' },
            { min: 100, max: 499, price: 0.95, material: 'Silicona y Bordadas' },
            { min: 500, max: 999, price: 1.25, material: 'Silicona y Bordadas' },
            { min: 1000, max: Infinity, price: 1.25, material: 'Silicona y Bordadas' }
        ]
    },
    'tarjeton_balsamo': {
        name: 'Tarjetón y Bálsamo Epson',
        prices: [
            { min: 25, max: 25, price: 2.85 },
            { min: 50, max: 50, price: 2.30 },
            { min: 100, max: 100, price: 1.90 },
            { min: 150, max: 150, price: 1.75 },
            { min: 200, max: 200, price: 1.40 },
            { min: 240, max: 240, price: 2.10 }
        ]
    },
    'abanicos_lencer': {
        name: 'Abanicos Lencer',
        prices: [
            { min: 50, max: 50, price: 4.70 },
            { min: 100, max: 100, price: 3.25 },
            { min: 200, max: 200, price: 2.89 },
            { min: 300, max: 300, price: 2.75 }
        ]
    },
    'abanicos_kronix': {
        name: 'Abanicos Kronix',
        prices: [
            { min: 50, max: 50, price: 2.99 },
            { min: 100, max: 100, price: 2.49 },
            { min: 200, max: 200, price: 2.05 },
            { min: 300, max: 300, price: 1.95 }
        ]
    },
    'abanicos_madera': {
        name: 'Abanicos Madera',
        prices: [
            { min: 50, max: 50, price: 2.99 },
            { min: 100, max: 100, price: 2.49 },
            { min: 200, max: 200, price: 2.05 },
            { min: 300, max: 300, price: 1.95 }
        ]
    },
    'abanicos_bilsom': {
        name: 'Abanicos Bilsom',
        prices: [
            { min: 50, max: 50, price: 1.79 },
            { min: 100, max: 100, price: 1.44 },
            { min: 200, max: 200, price: 1.08 },
            { min: 300, max: 300, price: 0.95 }
        ]
    },
    'cargador_3en1': {
        name: 'Cargador 3 en 1',
        prices: [
            { min: 100, max: 100, price: 4.15 },
            { min: 150, max: 150, price: 3.95 },
            { min: 250, max: 250, price: 3.75 },
            { min: 300, max: 300, price: 3.65 },
            { min: 500, max: 500, price: 3.15 }
        ]
    },
    // Productos de Neones
    'neones': {
        name: 'Neones (Alquiler)',
        rental_price: 129,
        deposit: 75,
        delivery: 'Gratis',
        dimensions: 'Desde 25x135cm hasta 100x60cm'
    }
};
