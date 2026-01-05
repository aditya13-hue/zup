import { db } from '../db.js';

const router = express.Router();

const DEMO_PRODUCTS = [
    { barcode: '8901234500001', name: 'Coca Cola 750ml', price: 40, qty: 50, image: '🥤' },
    { barcode: '8901234500002', name: 'Lays Classic Salted', price: 20, qty: 30, image: '🥔' },
    { barcode: '8901234500003', name: 'Maggi Noodles', price: 14, qty: 100, image: '🍜' },
    { barcode: '8901234500004', name: 'Dairy Milk Silk', price: 80, qty: 25, image: '🍫' },
    { barcode: '8901234500005', name: 'Colgate Totale', price: 95, qty: 40, image: '🦷' }
];

// Note: No more local mockInventory array. We use db.collection('products') instead.

// --- INVENTORY ---
router.get('/inventory', async (req, res) => {
    try {
        const snapshot = await db.collection('products').get();
        if (snapshot.empty) {
            return res.json(DEMO_PRODUCTS);
        }
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
