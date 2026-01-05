import admin from 'firebase-admin';
import { readFileSync } from 'fs';

let db;

try {
    // Attempt to load service account key locally
    const serviceAccount = JSON.parse(
        readFileSync(new URL('./serviceAccountKey.json', import.meta.url))
    );

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    db = admin.firestore();
    console.log("🔥 Firebase connected successfully.");

} catch (error) {
    console.log("⚠️ Firebase key not found or invalid. Using Mock DB mode.");

    // Fallback Mock DB with In-Memory Storage
    const mockData = {
        products: [
            { barcode: '8901234500001', name: 'Coca Cola 750ml', price: 40, qty: 50, image: '🥤' },
            { barcode: '8901234500002', name: 'Lays Classic Salted', price: 20, qty: 30, image: '🥔' },
            { barcode: '8901234500003', name: 'Maggi Noodles', price: 14, qty: 100, image: '🍜' },
            { barcode: '8901234500004', name: 'Dairy Milk Silk', price: 80, qty: 25, image: '🍫' },
            { barcode: '8901234500005', name: 'Colgate Totale', price: 95, qty: 40, image: '🦷' },
            { barcode: '8908010900964', name: 'Peanut Butter', price: 300, qty: 15, image: '🥜' }
        ],
        transactions: []
    };

    db = {
        collection: (name) => {
            if (!mockData[name]) mockData[name] = [];

            return {
                get: async () => ({
                    docs: mockData[name].map(d => ({ data: () => d })),
                    empty: mockData[name].length === 0
                }),
                add: async (data) => {
                    const id = `mock_${Date.now()}`;
                    mockData[name].push({ ...data, id });
                    console.log(`[MOCK DB] Added to ${name}:`, data);
                    return { id };
                },
                doc: (id) => ({
                    get: async () => {
                        const doc = mockData[name].find(d => d.barcode === id || d.id === id);
                        return {
                            exists: !!doc,
                            data: () => doc
                        };
                    },
                    set: async (data, options) => {
                        const idx = mockData[name].findIndex(d => d.barcode === id || d.id === id);
                        if (idx >= 0) {
                            if (options?.merge) mockData[name][idx] = { ...mockData[name][idx], ...data };
                            else mockData[name][idx] = data;
                        } else {
                            mockData[name].push({ ...data, id }); // Fallback ID if barcode not present?
                        }
                        console.log(`[MOCK DB] Set ${name}/${id}:`, data);
                    },
                    delete: async () => {
                        mockData[name] = mockData[name].filter(d => d.barcode !== id && d.id !== id);
                        console.log(`[MOCK DB] Deleted ${name}/${id}`);
                    }
                }),
                where: () => ({
                    get: async () => ({ docs: [], empty: true })
                })
            };
        }
    };
}

export { db };
