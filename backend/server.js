import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, 'db.json');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key-2026';

app.use(cors());
app.use(express.json());

// Initialize Supabase client if credentials are provided
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const useSupabase = SUPABASE_URL && SUPABASE_KEY && SUPABASE_URL.startsWith('http');

let supabase = null;
if (useSupabase) {
  console.log("Supabase credentials detected. Connecting to Supabase database...");
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
} else {
  console.log("Supabase credentials missing or invalid. Operating in LOCAL file database mode.");
}

// Standardized Response Helper
function sendResponse(res, statusCode, success, message, data = null) {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
}

// Local Database Fallback Seeds
const INITIAL_CATEGORIES = [
  { id: 1, name: 'Home Decor' },
  { id: 2, name: 'Kitchen' },
  { id: 3, name: 'Gift Ideas' },
  { id: 4, name: 'Kids & Babies' },
  { id: 5, name: 'Knitting & Sewing' }
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: "Walnut Cutting Board",
    price: 100.0,
    image: "assets/images/product/s328/product-1.webp",
    description: "A beautiful walnut wood cutting board handcrafted to perfection.",
    stock: 25,
    categoryId: 2
  },
  {
    id: 2,
    name: "Lucky Wooden Elephant",
    price: 35.0,
    image: "assets/images/product/s328/product-2.webp",
    description: "Add luck and elegance to your room with this handmade wooden elephant.",
    stock: 15,
    categoryId: 1
  },
  {
    id: 3,
    name: "Fish Cut Out Set",
    price: 9.0,
    image: "assets/images/product/s328/product-3.webp",
    description: "Charming set of wooden fish cut outs, perfect for home decor.",
    stock: 50,
    categoryId: 1
  },
  {
    id: 4,
    name: "Ceramic Flower Pot",
    price: 45.0,
    image: "assets/images/product/s328/product-4.webp",
    description: "Minimalist matte finish ceramic pot for your indoor plants.",
    stock: 10,
    categoryId: 1
  },
  {
    id: 5,
    name: "Handmade Wool Basket",
    price: 60.0,
    image: "assets/images/product/s328/product-5.webp",
    description: "Cozy woven wool basket to keep your living room organized.",
    stock: 8,
    categoryId: 1
  },
  {
    id: 6,
    name: "Leather Pen Holder",
    price: 25.0,
    image: "assets/images/product/s328/product-6.webp",
    description: "Genuine leather pen holder, an elegant desktop accessory.",
    stock: 30,
    categoryId: 3
  },
  {
    id: 7,
    name: "Decorative Wall Plate",
    price: 55.0,
    image: "assets/images/product/s328/product-7.webp",
    description: "Hand-painted ceramic wall plate featuring modern art.",
    stock: 12,
    categoryId: 1
  },
  {
    id: 8,
    name: "Mini Wooden Clock",
    price: 80.0,
    image: "assets/images/product/s328/product-8.webp",
    description: "Quiet bedside clock carved out of premium maple wood.",
    stock: 5,
    categoryId: 3
  }
];

function readLocalDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      const initialDb = { 
        admins: [{
          id: 1,
          username: 'admin',
          password: '$2b$10$iUxYbOpeDVZs8WDBt1jZIuCEUZscdzTw5Kar4rX8XS7wJA0B.nlb2',
          createdAt: new Date().toISOString()
        }],
        categories: INITIAL_CATEGORIES, 
        products: INITIAL_PRODUCTS, 
        cart: [], 
        coupon: null, 
        orders: [] 
      };
      fs.writeFileSync(DB_FILE, JSON.stringify(initialDb, null, 2));
      return initialDb;
    }
    const db = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    // Ensure all tables exist and seed default admin if empty
    if (!db.admins || db.admins.length === 0) {
      db.admins = [{
        id: 1,
        username: 'admin',
        password: '$2b$10$iUxYbOpeDVZs8WDBt1jZIuCEUZscdzTw5Kar4rX8XS7wJA0B.nlb2',
        createdAt: new Date().toISOString()
      }];
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    }
    if (!db.categories) db.categories = INITIAL_CATEGORIES;
    if (!db.products) db.products = INITIAL_PRODUCTS;
    if (!db.orders) db.orders = [];
    if (!db.users) db.users = [];
    return db;
  } catch (err) {
    console.error("Local database read error:", err);
    return { admins: [], users: [], categories: INITIAL_CATEGORIES, products: INITIAL_PRODUCTS, cart: [], coupon: null, orders: [] };
  }
}

function writeLocalDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Local database write error:", err);
  }
}

// ==========================================
// MIDDLEWARE: JWT ADMIN AUTHENTICATION
// ==========================================
function authenticateAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return sendResponse(res, 401, false, "Authorization header is missing");
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return sendResponse(res, 401, false, "Bearer Token is missing");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return sendResponse(res, 403, false, "Invalid or expired Bearer Token");
  }
}

// ==========================================
// MODULE 1: AUTHENTICATION (Register / Login)
// ==========================================

// Register Admin Account
app.post('/api/auth/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password || username.trim() === '' || password.trim() === '') {
    return sendResponse(res, 400, false, "Username and password are required");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (useSupabase) {
      // Check if username already exists
      const { data: existing } = await supabase
        .from('admins')
        .select('id')
        .eq('username', username)
        .maybeSingle();

      if (existing) {
        return sendResponse(res, 400, false, "Username is already taken");
      }

      // Insert new admin
      const { data, error } = await supabase
        .from('admins')
        .insert({ username, password: hashedPassword })
        .select('id, username')
        .single();

      if (error) throw error;
      return sendResponse(res, 201, true, "Admin registered successfully", data);
    } else {
      const db = readLocalDb();
      const existing = db.admins.find(a => a.username === username);
      if (existing) {
        return sendResponse(res, 400, false, "Username is already taken");
      }

      const newAdmin = {
        id: db.admins.length + 1,
        username,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };

      db.admins.push(newAdmin);
      writeLocalDb(db);

      return sendResponse(res, 201, true, "Admin registered successfully", { id: newAdmin.id, username: newAdmin.username });
    }
  } catch (err) {
    console.error("Register Error:", err.message);
    return sendResponse(res, 500, false, err.message);
  }
});

// Login Admin & Issue JWT
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return sendResponse(res, 400, false, "Username and password are required");
  }

  try {
    let admin = null;

    if (useSupabase) {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .maybeSingle();
      
      if (error) throw error;
      admin = data;
    } else {
      const db = readLocalDb();
      admin = db.admins.find(a => a.username === username);
    }

    if (!admin) {
      return sendResponse(res, 401, false, "Invalid username or password");
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, "Invalid username or password");
    }

    // Sign JWT
    const token = jwt.sign(
      { id: admin.id, username: admin.username },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    return sendResponse(res, 200, true, "Login successful", {
      token,
      username: admin.username
    });
  } catch (err) {
    console.error("Login Error:", err.message);
    return sendResponse(res, 500, false, err.message);
  }
});

// ==========================================
// USER AUTHENTICATION MIDDLEWARE & ENDPOINTS
// ==========================================

function authenticateUser(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return sendResponse(res, 401, false, "Authorization header is missing");
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return sendResponse(res, 401, false, "Bearer Token is missing");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Contains { id, username, email }
    next();
  } catch (err) {
    return sendResponse(res, 403, false, "Invalid or expired Bearer Token");
  }
}

// Register User Account
app.post('/api/users/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password || username.trim() === '' || email.trim() === '' || password.trim() === '') {
    return sendResponse(res, 400, false, "Username, email, and password are required");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    if (useSupabase) {
      // Check if username or email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .or(`username.eq.${username},email.eq.${email}`)
        .maybeSingle();

      if (existingUser) {
        return sendResponse(res, 400, false, "Username or Email is already taken");
      }

      // Insert new user
      const { data, error } = await supabase
        .from('users')
        .insert({ username, email, password: hashedPassword })
        .select('id, username, email')
        .single();

      if (error) throw error;
      return sendResponse(res, 201, true, "User registered successfully", data);
    } else {
      const db = readLocalDb();
      db.users = db.users || [];

      const existingUser = db.users.find(u => u.username === username || u.email === email);
      if (existingUser) {
        return sendResponse(res, 400, false, "Username or Email is already taken");
      }

      const newUser = {
        id: db.users.length + 1,
        username,
        email,
        password: hashedPassword,
        createdAt: new Date().toISOString()
      };

      db.users.push(newUser);
      writeLocalDb(db);

      return sendResponse(res, 201, true, "User registered successfully", { id: newUser.id, username: newUser.username, email: newUser.email });
    }
  } catch (err) {
    console.error("User Register Error:", err.message);
    return sendResponse(res, 500, false, err.message);
  }
});

// Login User
app.post('/api/users/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return sendResponse(res, 400, false, "Email and password are required");
  }

  try {
    let user = null;

    if (useSupabase) {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .maybeSingle();
      
      if (error) throw error;
      user = data;
    } else {
      const db = readLocalDb();
      db.users = db.users || [];
      user = db.users.find(u => u.email === email);
    }

    if (!user) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendResponse(res, 401, false, "Invalid email or password");
    }

    // Sign JWT
    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: 'user' },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return sendResponse(res, 200, true, "Login successful", {
      token,
      username: user.username,
      email: user.email
    });
  } catch (err) {
    console.error("User Login Error:", err.message);
    return sendResponse(res, 500, false, err.message);
  }
});

// Get User Profile
app.get('/api/users/profile', authenticateUser, async (req, res) => {
  return sendResponse(res, 200, true, "Profile retrieved successfully", req.user);
});

// ==========================================
// MODULE 2: CATEGORY & PRODUCT MANAGEMENT
// ==========================================

// GET Category List (Public)
app.get('/api/categories', async (req, res) => {
  try {
    if (useSupabase) {
      const { data, error } = await supabase.from('categories').select('*').order('id', { ascending: true });
      if (error) throw error;
      return sendResponse(res, 200, true, "Categories retrieved successfully", data);
    } else {
      const db = readLocalDb();
      return sendResponse(res, 200, true, "Categories retrieved successfully", db.categories);
    }
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// GET Product List (Public - supports Pagination, Filtering)
app.get('/api/products', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const categoryId = req.query.categoryId ? parseInt(req.query.categoryId) : null;

  try {
    if (useSupabase) {
      let query = supabase.from('products').select('*', { count: 'exact' });

      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }

      // Apply pagination bounds
      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error, count } = await query
        .order('id', { ascending: true })
        .range(from, to);

      if (error) throw error;

      return sendResponse(res, 200, true, "Products retrieved successfully", {
        products: data,
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit)
      });
    } else {
      const db = readLocalDb();
      let filteredProducts = db.products;

      if (categoryId) {
        filteredProducts = filteredProducts.filter(p => p.categoryId === categoryId);
      }

      const total = filteredProducts.length;
      const startIndex = (page - 1) * limit;
      const paginatedProducts = filteredProducts.slice(startIndex, startIndex + limit);

      return sendResponse(res, 200, true, "Products retrieved successfully", {
        products: paginatedProducts,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      });
    }
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// GET Single Product Details (Public)
app.get('/api/products/:id', async (req, res) => {
  const id = Number(req.params.id);
  try {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('id', id)
        .maybeSingle();

      if (error) throw error;
      if (!data) return sendResponse(res, 404, false, "Product not found");

      return sendResponse(res, 200, true, "Product details retrieved", data);
    } else {
      const db = readLocalDb();
      const product = db.products.find(p => p.id === id);
      if (!product) return sendResponse(res, 404, false, "Product not found");

      const category = db.categories.find(c => c.id === product.categoryId);
      return sendResponse(res, 200, true, "Product details retrieved", {
        ...product,
        category
      });
    }
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// POST Add New Product (Protected)
app.post('/api/products', authenticateAdmin, async (req, res) => {
  const { name, description, price, image, stock, categoryId } = req.body;

  if (!name || price === undefined || !image || stock === undefined || !categoryId) {
    return sendResponse(res, 400, false, "Name, price, image, stock, and categoryId are required");
  }

  try {
    if (useSupabase) {
      // Validate category exists
      const { data: cat } = await supabase.from('categories').select('id').eq('id', Number(categoryId)).maybeSingle();
      if (!cat) return sendResponse(res, 400, false, "Invalid categoryId. Category does not exist.");

      const { data, error } = await supabase
        .from('products')
        .insert({
          name,
          description,
          price: Number(price),
          image,
          stock: Number(stock),
          category_id: Number(categoryId)
        })
        .select('*')
        .single();

      if (error) throw error;
      return sendResponse(res, 201, true, "Product created successfully", data);
    } else {
      const db = readLocalDb();
      const cat = db.categories.find(c => c.id === Number(categoryId));
      if (!cat) return sendResponse(res, 400, false, "Invalid categoryId. Category does not exist.");

      const newProduct = {
        id: db.products.length > 0 ? Math.max(...db.products.map(p => p.id)) + 1 : 1,
        name,
        description,
        price: Number(price),
        image,
        stock: Number(stock),
        categoryId: Number(categoryId)
      };

      db.products.push(newProduct);
      writeLocalDb(db);
      return sendResponse(res, 201, true, "Product created successfully", newProduct);
    }
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// PUT Update Product details (Protected)
app.put('/api/products/:id', authenticateAdmin, async (req, res) => {
  const id = Number(req.params.id);
  const { name, description, price, image, stock, categoryId } = req.body;

  try {
    if (useSupabase) {
      // Verify product exists
      const { data: existing } = await supabase.from('products').select('id').eq('id', id).maybeSingle();
      if (!existing) return sendResponse(res, 404, false, "Product not found");

      if (categoryId) {
        const { data: cat } = await supabase.from('categories').select('id').eq('id', Number(categoryId)).maybeSingle();
        if (!cat) return sendResponse(res, 400, false, "Category does not exist.");
      }

      const updates = {};
      if (name !== undefined) updates.name = name;
      if (description !== undefined) updates.description = description;
      if (price !== undefined) updates.price = Number(price);
      if (image !== undefined) updates.image = image;
      if (stock !== undefined) updates.stock = Number(stock);
      if (categoryId !== undefined) updates.category_id = Number(categoryId);

      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select('*')
        .single();

      if (error) throw error;
      return sendResponse(res, 200, true, "Product updated successfully", data);
    } else {
      const db = readLocalDb();
      const product = db.products.find(p => p.id === id);
      if (!product) return sendResponse(res, 404, false, "Product not found");

      if (categoryId) {
        const cat = db.categories.find(c => c.id === Number(categoryId));
        if (!cat) return sendResponse(res, 400, false, "Category does not exist.");
      }

      if (name !== undefined) product.name = name;
      if (description !== undefined) product.description = description;
      if (price !== undefined) product.price = Number(price);
      if (image !== undefined) product.image = image;
      if (stock !== undefined) product.stock = Number(stock);
      if (categoryId !== undefined) product.categoryId = Number(categoryId);

      writeLocalDb(db);
      return sendResponse(res, 200, true, "Product updated successfully", product);
    }
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// DELETE Product (Protected)
app.delete('/api/products/:id', authenticateAdmin, async (req, res) => {
  const id = Number(req.params.id);
  try {
    if (useSupabase) {
      const { data: existing } = await supabase.from('products').select('id').eq('id', id).maybeSingle();
      if (!existing) return sendResponse(res, 404, false, "Product not found");

      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      return sendResponse(res, 200, true, "Product deleted successfully");
    } else {
      const db = readLocalDb();
      const idx = db.products.findIndex(p => p.id === id);
      if (idx === -1) return sendResponse(res, 404, false, "Product not found");

      db.products.splice(idx, 1);
      writeLocalDb(db);
      return sendResponse(res, 200, true, "Product deleted successfully");
    }
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// ==========================================
// MODULE 2.5: CART MANAGEMENT (Public Client)
// ==========================================

// Helper function to calculate cart totals
async function calculateCart(dbOrSupabase) {
  let cartItems = [];
  let appliedCoupon = null;

  if (useSupabase) {
    const { data: items, error: itemsErr } = await supabase
      .from('cart_items')
      .select('*, product:products(*)');
    if (itemsErr) throw itemsErr;

    cartItems = items.map(item => {
      if (!item.product) return null;
      return {
        id: item.product.id,
        name: item.product.name,
        price: parseFloat(item.product.price),
        image: item.product.image,
        description: item.product.description || '',
        stock: item.product.stock,
        categoryId: item.product.category_id,
        quantity: item.quantity,
        subtotal: parseFloat((parseFloat(item.product.price) * item.quantity).toFixed(2))
      };
    }).filter(Boolean);

    const { data: meta, error: metaErr } = await supabase
      .from('cart_metadata')
      .select('*')
      .eq('key', 'applied_coupon')
      .maybeSingle();
    if (metaErr) throw metaErr;
    appliedCoupon = meta ? meta.value : null;
  } else {
    const db = dbOrSupabase || readLocalDb();
    cartItems = db.cart.map(item => {
      const prod = db.products.find(p => p.id === Number(item.productId));
      if (!prod) return null;
      return {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        image: prod.image,
        description: prod.description || '',
        stock: prod.stock,
        categoryId: prod.categoryId,
        quantity: item.quantity,
        subtotal: parseFloat((prod.price * item.quantity).toFixed(2))
      };
    }).filter(Boolean);

    appliedCoupon = db.coupon;
  }

  const subtotal = parseFloat(cartItems.reduce((sum, item) => sum + item.subtotal, 0).toFixed(2));
  
  let shipping = 0; // Free shipping by default as requested

  let discount = 0;
  if (appliedCoupon) {
    const code = appliedCoupon.code.toUpperCase();
    if (code === 'DISCOUNT10') {
      discount = subtotal * 0.10;
    } else if (code === 'DISCOUNT20') {
      discount = subtotal * 0.20;
    } else if (code === 'WELCOME50') {
      discount = 50.00;
    } else if (code === 'FREESHIP') {
      shipping = 0.0;
    }
  }

  discount = parseFloat(Math.min(discount, subtotal + shipping).toFixed(2));
  const total = parseFloat(Math.max(0, subtotal + shipping - discount).toFixed(2));

  return {
    items: cartItems,
    subtotal,
    shipping,
    discount,
    total,
    appliedCoupon
  };
}

// GET Cart State
app.get('/api/cart', async (req, res) => {
  try {
    const cartData = await calculateCart();
    return res.status(200).json(cartData);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// POST Add Item to Cart
app.post('/api/cart', async (req, res) => {
  const { productId, quantity } = req.body;
  const prodId = Number(productId);
  const qty = Number(quantity) || 1;

  if (!prodId) {
    return sendResponse(res, 400, false, "productId is required");
  }

  try {
    if (useSupabase) {
      const { data: prod } = await supabase.from('products').select('stock').eq('id', prodId).maybeSingle();
      if (!prod) return sendResponse(res, 404, false, "Product not found");

      // Check existing item in cart
      const { data: existing } = await supabase.from('cart_items').select('*').eq('product_id', prodId).maybeSingle();

      const newQty = existing ? existing.quantity + qty : qty;
      if (prod.stock < newQty) {
        return sendResponse(res, 400, false, `Cannot add more. Available stock is ${prod.stock}`);
      }

      if (existing) {
        const { error } = await supabase.from('cart_items').update({ quantity: newQty }).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('cart_items').insert({ product_id: prodId, quantity: qty });
        if (error) throw error;
      }
    } else {
      const db = readLocalDb();
      const prod = db.products.find(p => p.id === prodId);
      if (!prod) return sendResponse(res, 404, false, "Product not found");

      const existingIdx = db.cart.findIndex(item => item.productId === prodId);
      const newQty = existingIdx !== -1 ? db.cart[existingIdx].quantity + qty : qty;

      if (prod.stock < newQty) {
        return sendResponse(res, 400, false, `Cannot add more. Available stock is ${prod.stock}`);
      }

      if (existingIdx !== -1) {
        db.cart[existingIdx].quantity = newQty;
      } else {
        db.cart.push({ productId: prodId, quantity: qty });
      }
      writeLocalDb(db);
    }

    return sendResponse(res, 200, true, "Item added to cart successfully");
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// PUT Update Cart Item Quantity
app.put('/api/cart/:productId', async (req, res) => {
  const prodId = Number(req.params.productId);
  const { quantity } = req.body;
  const qty = Number(quantity);

  if (isNaN(qty) || qty < 1) {
    return sendResponse(res, 400, false, "Quantity must be a positive integer");
  }

  try {
    if (useSupabase) {
      const { data: prod } = await supabase.from('products').select('stock').eq('id', prodId).maybeSingle();
      if (!prod) return sendResponse(res, 404, false, "Product not found");

      if (prod.stock < qty) {
        return sendResponse(res, 400, false, `Cannot update quantity. Available stock is ${prod.stock}`);
      }

      const { error } = await supabase.from('cart_items').update({ quantity: qty }).eq('product_id', prodId);
      if (error) throw error;
    } else {
      const db = readLocalDb();
      const prod = db.products.find(p => p.id === prodId);
      if (!prod) return sendResponse(res, 404, false, "Product not found");

      if (prod.stock < qty) {
        return sendResponse(res, 400, false, `Cannot update quantity. Available stock is ${prod.stock}`);
      }

      const cartItem = db.cart.find(item => item.productId === prodId);
      if (cartItem) {
        cartItem.quantity = qty;
        writeLocalDb(db);
      } else {
        return sendResponse(res, 404, false, "Item not found in cart");
      }
    }

    return sendResponse(res, 200, true, "Cart quantity updated successfully");
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// DELETE Remove Item from Cart
app.delete('/api/cart/:productId', async (req, res) => {
  const prodId = Number(req.params.productId);

  try {
    if (useSupabase) {
      const { error } = await supabase.from('cart_items').delete().eq('product_id', prodId);
      if (error) throw error;
    } else {
      const db = readLocalDb();
      db.cart = db.cart.filter(item => item.productId !== prodId);
      writeLocalDb(db);
    }
    return sendResponse(res, 200, true, "Item removed from cart");
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// POST Apply Coupon
app.post('/api/cart/coupon', async (req, res) => {
  const { code } = req.body;
  if (!code) return sendResponse(res, 400, false, "Coupon code is required");

  const cleanCode = code.trim().toUpperCase();
  const validCoupons = {
    'DISCOUNT10': { code: 'DISCOUNT10', discountType: 'percent', value: 10 },
    'DISCOUNT20': { code: 'DISCOUNT20', discountType: 'percent', value: 20 },
    'WELCOME50': { code: 'WELCOME50', discountType: 'flat', value: 50 },
    'FREESHIP': { code: 'FREESHIP', discountType: 'freeship', value: 0 }
  };

  const coupon = validCoupons[cleanCode];
  if (!coupon) {
    return sendResponse(res, 400, false, "Invalid or expired coupon code");
  }

  try {
    if (useSupabase) {
      const { error } = await supabase.from('cart_metadata').upsert({
        key: 'applied_coupon',
        value: coupon
      });
      if (error) throw error;
    } else {
      const db = readLocalDb();
      db.coupon = coupon;
      writeLocalDb(db);
    }
    return sendResponse(res, 200, true, "Coupon applied successfully", coupon);
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// DELETE Remove Coupon
app.delete('/api/cart/coupon', async (req, res) => {
  try {
    if (useSupabase) {
      const { error } = await supabase.from('cart_metadata').delete().eq('key', 'applied_coupon');
      if (error) throw error;
    } else {
      const db = readLocalDb();
      db.coupon = null;
      writeLocalDb(db);
    }
    return sendResponse(res, 200, true, "Coupon removed successfully");
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// ==========================================
// MODULE 3: ORDER PROCESSING
// ==========================================

// POST Create Checkout Order (Public Client)
// Triggers inventory stock check and deduction!
app.post('/api/orders', async (req, res) => {
  const { customerName, customerPhone, customerAddress, items, couponCode } = req.body;

  if (!customerName || !customerPhone || !customerAddress || !items || !Array.isArray(items) || items.length === 0) {
    return sendResponse(res, 400, false, "Customer details and items list are required");
  }

  try {
    let subtotal = 0;
    const orderItems = [];

    if (useSupabase) {
      // 1. Fetch matching products and verify inventory stock
      const productIds = items.map(item => Number(item.id));
      const { data: dbProducts, error: pError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);
      
      if (pError) throw pError;

      for (const item of items) {
        const product = dbProducts.find(p => p.id === Number(item.id));
        if (!product) {
          return sendResponse(res, 404, false, `Product ID ${item.id} not found in catalog`);
        }

        if (product.stock < item.quantity) {
          return sendResponse(res, 400, false, `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`);
        }

        const itemSubtotal = parseFloat(product.price) * item.quantity;
        subtotal += itemSubtotal;
        orderItems.push({
          productId: product.id,
          name: product.name,
          price: parseFloat(product.price),
          quantity: item.quantity,
          subtotal: parseFloat(itemSubtotal.toFixed(2))
        });
      }

      // Deduct stock in DB
      for (const item of items) {
        const product = dbProducts.find(p => p.id === Number(item.id));
        const newStock = product.stock - item.quantity;
        const { error: stockErr } = await supabase
          .from('products')
          .update({ stock: newStock })
          .eq('id', product.id);
        if (stockErr) throw stockErr;
      }
    } else {
      // Local Database Mode Stock check & deduction
      const db = readLocalDb();

      for (const item of items) {
        const product = db.products.find(p => p.id === Number(item.id));
        if (!product) {
          return sendResponse(res, 404, false, `Product ID ${item.id} not found in catalog`);
        }

        if (product.stock < item.quantity) {
          return sendResponse(res, 400, false, `Insufficient stock for product "${product.name}". Available: ${product.stock}, Requested: ${item.quantity}`);
        }

        const itemSubtotal = product.price * item.quantity;
        subtotal += itemSubtotal;
        orderItems.push({
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: item.quantity,
          subtotal: parseFloat(itemSubtotal.toFixed(2))
        });
      }

      // Deduct local stock
      items.forEach(item => {
        const product = db.products.find(p => p.id === Number(item.id));
        product.stock -= item.quantity;
      });
      writeLocalDb(db);
    }

    // Calculate coupon discount
    let discount = 0;
    let shipping = 0; // Free shipping by default

    if (couponCode) {
      const cleanCoupon = couponCode.trim().toUpperCase();
      if (cleanCoupon === 'DISCOUNT10') {
        discount = subtotal * 0.10;
      } else if (cleanCoupon === 'DISCOUNT20') {
        discount = subtotal * 0.20;
      } else if (cleanCoupon === 'WELCOME50') {
        discount = 50.00;
      } else if (cleanCoupon === 'FREESHIP') {
        shipping = 0;
      }
    }
    discount = Math.min(discount, subtotal + shipping);
    const total = Math.max(0, subtotal + shipping - discount);

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const createdAt = new Date().toISOString();

    const placedOrder = {
      id: orderId,
      customerName,
      customerPhone,
      customerAddress,
      subtotal: parseFloat(subtotal.toFixed(2)),
      shipping: parseFloat(shipping.toFixed(2)),
      discount: parseFloat(discount.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
      status: 'Pending',
      coupon: couponCode || null,
      createdAt,
      items: orderItems
    };

    if (useSupabase) {
      // Save order record
      const { error: orderErr } = await supabase.from('orders').insert({
        id: orderId,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_address: customerAddress,
        subtotal: placedOrder.subtotal,
        shipping: placedOrder.shipping,
        discount: placedOrder.discount,
        total: placedOrder.total,
        status: placedOrder.status,
        coupon: placedOrder.coupon,
        created_at: createdAt
      });
      if (orderErr) throw orderErr;

      // Save order items
      const itemsToInsert = orderItems.map(item => ({
        order_id: orderId,
        product_id: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.subtotal
      }));
      const { error: itemsErr } = await supabase.from('order_items').insert(itemsToInsert);
      if (itemsErr) throw itemsErr;

      // Clear general session cart items since checkout is completed
      await supabase.from('cart_items').delete().neq('id', 0);
      await supabase.from('cart_metadata').delete().eq('key', 'applied_coupon');
    } else {
      // Save to local file
      const db = readLocalDb();
      db.orders.push(placedOrder);
      db.cart = []; // clear cart
      db.coupon = null; // reset coupon
      writeLocalDb(db);
    }

    return sendResponse(res, 201, true, "Order placed successfully", placedOrder);
  } catch (err) {
    console.error("Place Order Error:", err.message);
    return sendResponse(res, 500, false, err.message);
  }
});

// GET All Orders (Public list, Newest first)
app.get('/api/orders', async (req, res) => {
  try {
    if (useSupabase) {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .order('created_at', { ascending: false });
      if (ordersError) throw ordersError;

      const formattedOrders = ordersData.map((order) => ({
        id: order.id,
        customerName: order.customer_name,
        customerPhone: order.customer_phone,
        customerAddress: order.customer_address,
        subtotal: parseFloat(order.subtotal),
        shipping: parseFloat(order.shipping),
        discount: parseFloat(order.discount),
        total: parseFloat(order.total),
        status: order.status,
        coupon: order.coupon,
        createdAt: order.created_at,
        items: order.order_items.map((item) => ({
          productId: item.product_id,
          name: item.name,
          price: parseFloat(item.price),
          quantity: item.quantity,
          subtotal: parseFloat(item.subtotal)
        }))
      }));

      return sendResponse(res, 200, true, "Orders list retrieved", formattedOrders);
    } else {
      const db = readLocalDb();
      const sortedLocalOrders = db.orders.slice().reverse();
      return sendResponse(res, 200, true, "Orders list retrieved", sortedLocalOrders);
    }
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// PUT Update Order Status (Admin, Protected)
app.put('/api/orders/:id/status', authenticateAdmin, async (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  const validStatuses = ['Pending', 'Processing', 'Completed', 'Cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return sendResponse(res, 400, false, "Status is required and must be Pending, Processing, Completed, or Cancelled");
  }

  try {
    if (useSupabase) {
      const { data: existing } = await supabase.from('orders').select('id').eq('id', orderId).maybeSingle();
      if (!existing) return sendResponse(res, 404, false, "Order not found");

      const { data, error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
        .select('*')
        .single();
      
      if (error) throw error;
      return sendResponse(res, 200, true, "Order status updated successfully", data);
    } else {
      const db = readLocalDb();
      const order = db.orders.find(o => o.id === orderId);
      if (!order) return sendResponse(res, 404, false, "Order not found");

      order.status = status;
      writeLocalDb(db);

      return sendResponse(res, 200, true, "Order status updated successfully", order);
    }
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// DELETE Order (Admin, Protected)
app.delete('/api/orders/:id', authenticateAdmin, async (req, res) => {
  const orderId = req.params.id;
  try {
    if (useSupabase) {
      const { data: existing } = await supabase.from('orders').select('id').eq('id', orderId).maybeSingle();
      if (!existing) return sendResponse(res, 404, false, "Order not found");

      const { error } = await supabase.from('orders').delete().eq('id', orderId);
      if (error) throw error;
    } else {
      const db = readLocalDb();
      const idx = db.orders.findIndex(o => o.id === orderId);
      if (idx === -1) return sendResponse(res, 404, false, "Order not found");

      db.orders.splice(idx, 1);
      writeLocalDb(db);
    }
    return sendResponse(res, 200, true, "Order deleted successfully");
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// PUT Update Order Details (Admin, Protected)
app.put('/api/orders/:id', authenticateAdmin, async (req, res) => {
  const orderId = req.params.id;
  const { customerName, customerPhone, customerAddress, status } = req.body;

  try {
    if (useSupabase) {
      const { data: existing } = await supabase.from('orders').select('id').eq('id', orderId).maybeSingle();
      if (!existing) return sendResponse(res, 404, false, "Order not found");

      const updates = {};
      if (customerName !== undefined) updates.customer_name = customerName;
      if (customerPhone !== undefined) updates.customer_phone = customerPhone;
      if (customerAddress !== undefined) updates.customer_address = customerAddress;
      if (status !== undefined) updates.status = status;

      const { data, error } = await supabase
        .from('orders')
        .update(updates)
        .eq('id', orderId)
        .select('*')
        .single();
      
      if (error) throw error;
      return sendResponse(res, 200, true, "Order updated successfully", data);
    } else {
      const db = readLocalDb();
      const order = db.orders.find(o => o.id === orderId);
      if (!order) return sendResponse(res, 404, false, "Order not found");

      if (customerName !== undefined) order.customerName = customerName;
      if (customerPhone !== undefined) order.customerPhone = customerPhone;
      if (customerAddress !== undefined) order.customerAddress = customerAddress;
      if (status !== undefined) order.status = status;

      writeLocalDb(db);
      return sendResponse(res, 200, true, "Order updated successfully", order);
    }
  } catch (err) {
    return sendResponse(res, 500, false, err.message);
  }
});

// Initialize database on startup
if (!useSupabase) {
  readLocalDb();
}

// Start server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Learts shopping backend running at http://localhost:${PORT}`);
  });
}

export default app;
