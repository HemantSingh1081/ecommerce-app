const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add sample products
router.get('/add-samples', async (req, res) => {
    const samples = [
        { name: 'iPhone 15 Pro', price: 999, description: 'Latest Apple smartphone', image: 'https://picsum.photos/300/300?random=1' },
        { name: 'Sony Headphones', price: 299, description: 'Noise cancelling headphones', image: 'https://picsum.photos/300/300?random=2' },
        { name: 'Nike Shoes', price: 120, description: 'Running shoes', image: 'https://picsum.photos/300/300?random=3' },
        { name: 'Apple Watch', price: 399, description: 'Smart watch', image: 'https://picsum.photos/300/300?random=4' }
    ];
    
    await Product.insertMany(samples);
    res.json({ message: 'Sample products added' });
});

module.exports = router;