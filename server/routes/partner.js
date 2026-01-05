import { db } from '../db.js';

const router = express.Router();

// Note: No more local mockInventory array. We use db.collection('products') instead.

// --- INVENTORY ---
router.get('/inventory', async (req, res) => {
    try {
        const snapshot = await db.collection('products').get();
        const products = snapshot.docs.map(doc => doc.data());
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/inventory', async (req, res) => {
    const product = req.body;
    try {
        await db.collection('products').doc(product.barcode).set(product, { merge: true });
        res.json({ message: 'Inventory updated in Firestore', product });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/inventory/:barcode', async (req, res) => {
    try {
        await db.collection('products').doc(req.params.barcode).delete();
        res.json({ message: 'Product removed from Firestore' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- ANALYTICS ---
router.get('/analytics', async (req, res) => {
    try {
        const snapshot = await db.collection('transactions').get();
        const transactions = snapshot.docs.map(doc => doc.data());
        const totalRevenue = transactions.reduce((acc, tx) => acc + (tx.total || 0), 0);
        const totalOrders = transactions.length;

        res.json({
            totalRevenue,
            totalOrders,
            recentTransactions: transactions.slice(-5).reverse()
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- VERIFICATION ---
router.post('/verify-receipt', async (req, res) => {
    const { receiptId } = req.body;

    try {
        const doc = await db.collection('transactions').doc(receiptId).get();
        if (!doc.exists) {
            return res.status(404).json({ verified: false, message: 'Receipt Not Found.' });
        }

        const data = doc.data();
        if (data.status === 'paid') {
            res.json({
                verified: true,
                message: 'Payment Confirmed.',
                details: {
                    amount: data.amount,
                    items: data.items.length,
                    date: data.paidAt
                }
            });
        } else {
            res.status(400).json({ verified: false, message: 'Payment Pending or Failed.' });
        }
    } catch (error) {
        res.status(500).json({ verified: false, message: 'Server Error' });
    }
});

export default router;
