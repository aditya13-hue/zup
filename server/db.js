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

    // Fallback Mock DB object that logs calls but returns empty
    db = {
        collection: (name) => ({
            get: async () => ({ docs: [], empty: true }),
            add: async (data) => console.log(`[MOCK DB] Add to ${name}:`, data),
            doc: (id) => ({
                set: async (data) => console.log(`[MOCK DB] Set doc ${name}/${id}:`, data),
                get: async () => ({ exists: false, data: () => null })
            }),
            where: () => ({
                get: async () => ({ docs: [], empty: true })
            })
        })
    };
}

export { db };
