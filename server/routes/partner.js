import express from 'express';
const router = express.Router();

// Mock Data for Demo
let mockInventory = [
    { barcode: '8901234567890', name: 'Fresh Milk 1L', price: 65, qty: 50, image: '🥛' },
    { barcode: '8901234567891', name: 'Organic Bread', price: 45, qty: 30, image: '🍞' },
    { barcode: '8901234567892', name: 'Dark Chocolate', price: 90, qty: 100, image: '🍫' }
];

let mockTransactions = [
    { id: 'TX-1001', total: 110, date: '2026-01-04T10:00:00Z', items: 2 },
    { id: 'TX-1002', total: 45, date: '2026-01-04T11:30:00Z', items: 1 },
    { id: 'TX-1003', total: 200, date: '2026-01-04T14:15:00Z', items: 3 }
];

// --- INVENTORY ---
router.get('/inventory', (req, res) => {
    res.json(mockInventory);
});

router.post('/inventory', (req, res) => {
    const product = req.body;
    const index = mockInventory.findIndex(p => p.barcode === product.barcode);
    if (index !== -1) {
        mockInventory[index] = { ...mockInventory[index], ...product };
    } else {
        mockInventory.push(product);
    }
    res.json({ message: 'Inventory updated successfully', product });
});

router.delete('/inventory/:barcode', (req, res) => {
    mockInventory = mockInventory.filter(p => p.barcode !== req.params.barcode);
    res.json({ message: 'Product removed' });
});

// --- ANALYTICS ---
router.get('/analytics', (req, res) => {
    const totalRevenue = mockTransactions.reduce((acc, tx) => acc + tx.total, 0);
    const totalOrders = mockTransactions.length;
    res.json({
        totalRevenue,
        totalOrders,
        recentTransactions: mockTransactions.slice(-5).reverse()
    });
});

// --- VERIFICATION ---
router.post('/verify-receipt', (req, res) => {
    const { receiptId } = req.body;
    // In real app, check against database of paid transactions
    // For demo, we verify any ID that starts with ZUPP-
    if (receiptId && receiptId.startsWith('ZUPP-')) {
        res.json({ verified: true, message: 'Receipt Verified. Payment Confirmed.' });
    } else {
        res.status(400).json({ verified: false, message: 'Invalid or Unpaid Receipt.' });
    }
});

export default router;
