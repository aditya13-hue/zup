import express from 'express';
import { db } from '../db.js';

const router = express.Router();

const DEMO_PRODUCTS = [
    { barcode: '8901234500001', name: 'Coca Cola 750ml', price: 40, qty: 50, image: '🥤' },
    { barcode: '8901234500002', name: 'Lays Classic Salted', price: 20, qty: 30, image: '🥔' },
    { barcode: '8901234500003', name: 'Maggi Noodles', price: 14, qty: 100, image: '🍜' },
    { barcode: '8901234500004', name: 'Dairy Milk Silk', price: 80, qty: 25, image: '🍫' },
    { barcode: '8901234500005', name: 'Colgate Totale', price: 95, qty: 40, image: '🦷' },
    { barcode: '8908010900964', name: 'Peanut Butter', price: 300, qty: 15, image: '🥜' }
];

// Get all products
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('products').get();
        if (snapshot.empty) {
            console.log("Database empty. Serving Demo Products.");
            return res.json(DEMO_PRODUCTS);
        }
        const products = snapshot.docs.map(doc => doc.data());
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// Get product by barcode
router.get('/:barcode', async (req, res) => {
    try {
        const doc = await db.collection('products').doc(req.params.barcode).get();
        if (doc.exists) {
            res.json(doc.data());
        } else {
            // Check demo products fallback
            const demo = DEMO_PRODUCTS.find(p => p.barcode === req.params.barcode);
            if (demo) {
                res.json(demo);
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch product" });
    }
});

export default router;
