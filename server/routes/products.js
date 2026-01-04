import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('products').get();
        if (snapshot.empty) {
            return res.json([]);
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
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch product" });
    }
});

export default router;
