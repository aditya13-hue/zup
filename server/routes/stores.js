import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// Get all stores
router.get('/', async (req, res) => {
    try {
        const snapshot = await db.collection('stores').get();
        if (snapshot.empty) {
            return res.json([]);
        }
        const stores = snapshot.docs.map(doc => doc.data());
        res.json(stores);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch stores" });
    }
});

// Get store by ID
router.get('/:id', async (req, res) => {
    try {
        const doc = await db.collection('stores').doc(req.params.id).get();
        if (doc.exists) {
            res.json(doc.data());
        } else {
            res.status(404).json({ message: 'Store not found' });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch store" });
    }
});

export default router;
