import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { db } from '../db.js';

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MOCK_KEY');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post('/recommend', async (req, res) => {
    // Basic body check
    if (!req.body || !req.body.cart) {
        return res.status(400).json({ error: "Cart is required" });
    }

    const { cart, nearestStoreId } = req.body;

    try {
        // 1. Fetch all products to give Gemini context
        const productsSnapshot = await db.collection('products').get();
        const allProducts = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        // 2. Mock response if no API Key OR if cart has specific items
        // This ensures the demo feels "smart" even without the key
        if (!process.env.GEMINI_API_KEY) {
            let mockOffers = [
                {
                    id: 'mock-flash',
                    title: 'Flash Deal!',
                    description: 'Get any Beverage for 20% off if you checkout in the next 5 mins.',
                    discountType: 'percentage',
                    discountValue: 20
                }
            ];

            // Context-aware mock logic
            const hasMilk = cart.some(item => item.name.toLowerCase().includes('milk'));
            const hasBread = cart.some(item => item.name.toLowerCase().includes('bread'));

            if (hasMilk && !hasBread) {
                mockOffers.push({
                    id: 'mock-cross-1',
                    title: 'The Breakfast Club',
                    description: 'Compliment your milk with fresh Bread (10% Off).',
                    discountType: 'percentage',
                    discountValue: 10,
                    rewardItem: 'Bread'
                });
            } else if (hasBread && !hasMilk) {
                mockOffers.push({
                    id: 'mock-cross-2',
                    title: 'Perfect Pair',
                    description: 'Found your bread! How about some Milk to go with it?',
                    discountType: 'percentage',
                    discountValue: 10,
                    rewardItem: 'Milk'
                });
            }

            return res.json({ offers: mockOffers });
        }

        // 3. Prepare Prompt for Gemini
        const cartString = cart.map(item => item.name).join(', ');
        const productContext = allProducts.map(p => `${p.name} (₹${p.price})`).join(', ');

        const prompt = `
            You are an AI Retail Assistant for Zup, a smart checkout system. 
            Current User Cart: [${cartString}]
            Available Products in Store: [${productContext}]

            Task: Generate 3 smart, personalized shopping offers. 
            One should be a cross-sell (e.g. if I have milk, suggest bread), 
            one should be a quantity discount (e.g. "Buy 2, Get 1 Free"), 
            and one should be a "flash deal" based on current trends.

            Return ONLY a JSON array of objects with this structure:
            {
                "offers": [
                    {
                        "id": "unique-id",
                        "title": "Short catchy title",
                        "description": "Clear description of the offer",
                        "discountType": "percentage | fixed",
                        "discountValue": number,
                        "rewardItem": "Name of the product recommended"
                    }
                ]
            }
            CRITICAL: Only suggest rewardItems that are actually in the "Available Products" list provided above.
            Do not include any markdown formatting or extra text.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Robust JSON parsing (handles markdown blocks if AI includes them)
        if (text.includes('```json')) {
            text = text.split('```json')[1].split('```')[0].trim();
        } else if (text.includes('```')) {
            text = text.split('```')[1].split('```')[0].trim();
        }

        try {
            const data = JSON.parse(text);
            res.json(data);
        } catch (parseError) {
            console.error("Failed to parse Gemini response:", text);
            // Fallback to mock on parse error
            res.json({
                offers: [{
                    id: 'fallback-1',
                    title: 'Special Surprise',
                    description: 'Add a snack to your order for a small discount!',
                    discountType: 'fixed',
                    discountValue: 5
                }]
            });
        }

    } catch (error) {
        console.error('Recommendation error:', error);
        res.status(500).json({ error: "Failed to generate recommendations" });
    }
});

export default router;
