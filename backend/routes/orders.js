const express = require('express');
const Order = require('../models/Order');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const order = new Order(req.body);
        await order.save();
        res.json({ success: true, message: 'Order placed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;