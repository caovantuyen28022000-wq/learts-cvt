-- 1. Create Admins Table
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    image TEXT NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Cart Items Table
CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Cart Metadata Table
CREATE TABLE IF NOT EXISTS cart_metadata (
    key TEXT PRIMARY KEY,
    value JSONB
);

-- 6. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY, -- ORD-XXXXXX
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_address TEXT NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    shipping NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) NOT NULL,
    total NUMERIC(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending', -- Pending, Processing, Completed, Cancelled
    coupon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Create Order Items Table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id TEXT REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    quantity INTEGER NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL
);

-- 8. Seed Categories
INSERT INTO categories (id, name) VALUES
(1, 'Home Decor'),
(2, 'Kitchen'),
(3, 'Gift Ideas'),
(4, 'Kids & Babies'),
(5, 'Knitting & Sewing')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 9. Seed Products linked to Categories with stock
INSERT INTO products (id, name, description, price, image, stock, category_id) VALUES
(1, 'Walnut Cutting Board', 'A beautiful walnut wood cutting board handcrafted to perfection.', 100.00, 'assets/images/product/s328/product-1.webp', 25, 2),
(2, 'Lucky Wooden Elephant', 'Add luck and elegance to your room with this handmade wooden elephant.', 35.00, 'assets/images/product/s328/product-2.webp', 15, 1),
(3, 'Fish Cut Out Set', 'Charming set of wooden fish cut outs, perfect for home decor.', 9.00, 'assets/images/product/s328/product-3.webp', 50, 1),
(4, 'Ceramic Flower Pot', 'Minimalist matte finish ceramic pot for your indoor plants.', 45.00, 'assets/images/product/s328/product-4.webp', 10, 1),
(5, 'Handmade Wool Basket', 'Cozy woven wool basket to keep your living room organized.', 60.00, 'assets/images/product/s328/product-5.webp', 8, 1),
(6, 'Leather Pen Holder', 'Genuine leather pen holder, an elegant desktop accessory.', 25.00, 'assets/images/product/s328/product-6.webp', 30, 3),
(7, 'Decorative Wall Plate', 'Hand-painted ceramic wall plate featuring modern art.', 55.00, 'assets/images/product/s328/product-7.webp', 12, 1),
(8, 'Mini Wooden Clock', 'Quiet bedside clock carved out of premium maple wood.', 80.00, 'assets/images/product/s328/product-8.webp', 5, 3)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    image = EXCLUDED.image,
    stock = EXCLUDED.stock,
    category_id = EXCLUDED.category_id;

-- 10. Seed Default Admin Account (admin / admin123)
INSERT INTO admins (id, username, password) VALUES
(1, 'admin', '$2b$10$iUxYbOpeDVZs8WDBt1jZIuCEUZscdzTw5Kar4rX8XS7wJA0B.nlb2')
ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password;
