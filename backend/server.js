const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/ecommerce')
    .then(() => {
        console.log('✅ MongoDB connected');
        app.listen(5000, () => {
            console.log('🚀 Server running on http://localhost:5000');
        });
    })
    .catch(err => console.log('❌ MongoDB error:', err));