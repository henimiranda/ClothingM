-- Database Schema for ClothingM

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'customer', -- 'customer', 'admin', 'manufactory', 'scm'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    base_stock INT DEFAULT 0,
    category VARCHAR(100),
    size VARCHAR(50),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'shipped', 'completed', 'cancelled'
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL
);

CREATE TABLE IF NOT EXISTS inventory_logs (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    type VARCHAR(20) NOT NULL, -- 'IN' (Stock In), 'OUT' (Stock Out)
    quantity INT NOT NULL,
    reason TEXT, -- 'production', 'sale', 'adjustment'
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS production_orders (
    id SERIAL PRIMARY KEY,
    product_id INT REFERENCES products(id),
    quantity INT NOT NULL,
    status VARCHAR(50) DEFAULT 'queued', -- 'queued', 'material_prep', 'cutting', 'sewing', 'finishing', 'completed'
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed some initial data
INSERT INTO users (name, email, password, role) VALUES 
('Admin ClothingM', 'admin@clothingm.com', '$2a$10$6jP5x1fU7G.0u7uX7G.0u7uX7G.0u7uX7G.0u7uX7G.0u7uX7G.0u7uX7G.', 'admin')
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (id, name, description, price, base_stock, category, size, image_url) VALUES 
(1, 'Kaos Polos Klasik', 'Kaos putih esensial dari 100% katun organik, nyaman dipakai sehari-hari.', 150000, 100, 'T-Shirt', 'L', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800'),
(2, 'Jaket Denim Vintage', 'Jaket denim dengan aksen pudar vintage dan kancing perak.', 450000, 50, 'Outerwear', 'XL', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=800'),
(3, 'Celana Chino Slim Fit', 'Celana chino warna khaki dengan potongan slim fit yang elegan.', 300000, 75, 'Pants', '32', 'https://images.unsplash.com/photo-1624371414361-e6e0ed262f6c?q=80&w=800'),
(4, 'Hoodie Oversized', 'Hoodie fleece ultra-lembut dengan potongan oversized yang modern.', 350000, 40, 'Outerwear', 'M', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=800'),
(5, 'Kemeja Flanel', 'Kemeja flanel motif kotak-kotak klasik untuk gaya kasual.', 250000, 60, 'T-Shirt', 'L', 'https://images.unsplash.com/photo-1598033129183-c4f50c7176c8?q=80&w=800'),
(6, 'Celana Cargo', 'Celana cargo fungsional dengan banyak saku penyimpanan.', 380000, 30, 'Pants', '34', 'https://images.unsplash.com/photo-1617114919297-3c8ddb01f599?q=80&w=800'),
(7, 'Jaket Bomber', 'Jaket bomber hitam sleek dengan bahan tahan air (water-resistant).', 550000, 25, 'Outerwear', 'L', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800'),
(8, 'Kaos Grafis Street', 'Kaos dengan print grafis berani yang terinspirasi seni urban.', 180000, 120, 'T-Shirt', 'XL', 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?q=80&w=800'),
(9, 'Kemeja Linen Musim Panas', 'Kemeja linen breathable yang sempurna untuk cuaca tropis.', 320000, 45, 'T-Shirt', 'M', 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800'),
(10, 'Ikat Pinggang Kulit', 'Ikat pinggang kulit asli premium dengan gesper logam elegan.', 200000, 100, 'Accessories', 'One Size', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800')
ON CONFLICT (id) DO NOTHING;

-- Seed initial Inventory Logs
INSERT INTO inventory_logs (product_id, type, quantity, reason) VALUES 
(1, 'IN', 100, 'Initial stock import'),
(2, 'IN', 50, 'Initial stock import'),
(3, 'IN', 75, 'Initial stock import');

-- Seed initial Production Orders
INSERT INTO production_orders (product_id, quantity, status, start_date, end_date) VALUES 
(4, 20, 'sewing', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days'),
(7, 15, 'material_prep', CURRENT_DATE - INTERVAL '1 day', CURRENT_DATE + INTERVAL '10 days');
