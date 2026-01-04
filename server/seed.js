import { db } from './db.js';
import { products } from './data/products.js';

// Sample stores with location data
const stores = [
    {
        id: 'store-mumbai-1',
        name: 'Zupp Flagship - Mumbai',
        address: '123 MG Road, Mumbai, Maharashtra',
        lat: 19.0760,
        lng: 72.8777,
        radius: 100, // meters, for geofencing
        razorpayAccountId: 'acc_MOCK_MUMBAI' // Store's Razorpay account for Route
    },
    {
        id: 'store-delhi-1',
        name: 'Zupp Express - Delhi',
        address: '456 Connaught Place, New Delhi',
        lat: 28.6139,
        lng: 77.2090,
        radius: 100,
        razorpayAccountId: 'acc_MOCK_DELHI'
    },
    {
        id: 'store-bangalore-1',
        name: 'Zupp Central - Bangalore',
        address: '789 MG Road, Bangalore, Karnataka',
        lat: 12.9716,
        lng: 77.5946,
        radius: 100,
        razorpayAccountId: 'acc_MOCK_BANGALORE'
    }
];

const seedDatabase = async () => {
    console.log("🌱 Seeding database...");

    try {
        // Seed Products
        const productsRef = db.collection('products');
        for (const product of products) {
            await productsRef.doc(product.barcode).set(product);
            console.log(`Saved product: ${product.name}`);
        }

        // Seed Stores
        const storesRef = db.collection('stores');
        for (const store of stores) {
            await storesRef.doc(store.id).set(store);
            console.log(`Saved store: ${store.name}`);
        }

        console.log("✅ Database seeding complete!");
    } catch (error) {
        console.error("❌ Seeding failed:", error);
    }
};

seedDatabase();
