const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    category: { type: String, default: 'General' },
    rating: { type: Number, default: 4.5 },
    stock: { type: Number, default: 10 }
});

module.exports = mongoose.model('Product', productSchema);