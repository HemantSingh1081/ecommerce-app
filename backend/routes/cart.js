const express = require('express');
const router = express.Router();

// Simple in-memory cart
let userCarts = {};

router.get('/', (req, res) => {
    const userId = req.headers['userid'] || 'guest';
    res.json(userCarts[userId] || []);
});

router.post('/add', (req, res) => {
    const userId = req.headers['userid'] || 'guest';
    if (!userCarts[userId]) userCarts[userId] = [];
    userCarts[userId].push(req.body);
    res.json(userCarts[userId]);
});

router.delete('/clear', (req, res) => {
    const userId = req.headers['userid'] || 'guest';
    delete userCarts[userId];
    res.json({ message: 'Cart cleared' });
});

module.exports = router;