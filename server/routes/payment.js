import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mock',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'mock_secret'
});

const PLATFORM_COMMISSION = parseInt(process.env.PLATFORM_COMMISSION || '5');

router.post('/create-order', async (req, res) => {
    const { items, storeId } = req.body;

    try {
        // Calculate amounts
        const totalAmount = items.reduce((acc, item) => acc + (item.price * item.qty), 0);
        const amountInPaise = Math.round(totalAmount * 100); // Convert to paise
        const platformFee = Math.round((totalAmount * PLATFORM_COMMISSION / 100) * 100);
        const storeAmount = amountInPaise - platformFee;

        // Mock mode if no keys
        if (!process.env.RAZORPAY_KEY_ID) {
            return res.json({
                id: `order_mock_${Date.now()}`,
                amount: amountInPaise,
                currency: 'INR',
                key_id: 'rzp_test_mock',
                message: 'Mock order created (Razorpay keys missing)'
            });
        }

        // Create order with Route transfer (if store has razorpayAccountId)
        const orderOptions = {
            amount: amountInPaise,
            currency: 'INR',
            receipt: `receipt_${Date.now()}`,
            notes: {
                platform_commission: platformFee / 100,
                store_amount: storeAmount / 100
            }
        };

        // Add transfer if storeId provided (for Route marketplace)
        // In production, fetch store's razorpayAccountId from database
        if (storeId && process.env.ENABLE_ROUTE === 'true') {
            orderOptions.transfers = [{
                account: storeId, // Store's Razorpay account ID
                amount: storeAmount,
                currency: 'INR',
                notes: {
                    type: 'store_payment'
                }
            }];
        }

        const order = await razorpay.orders.create(orderOptions);

        res.json({
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            key_id: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Order creation error:', error);
        res.status(400).send({ error: { message: error.message } });
    }
});

// Verify payment signature
router.post('/verify-payment', async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    try {
        const sign = razorpay_order_id + '|' + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 'mock_secret')
            .update(sign.toString())
            .digest('hex');

        if (razorpay_signature === expectedSignature || !process.env.RAZORPAY_KEY_SECRET) {
            res.json({ verified: true, payment_id: razorpay_payment_id });
        } else {
            res.status(400).json({ verified: false, message: 'Invalid signature' });
        }
    } catch (error) {
        res.status(400).send({ error: { message: error.message } });
    }
});

export default router;
