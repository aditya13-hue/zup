import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import productsRouter from './routes/products.js';
import paymentRouter from './routes/payment.js';
import storesRouter from './routes/stores.js';
import offersRouter from './routes/offers.js';
import partnerRouter from './routes/partner.js';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api/products', productsRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/stores', storesRouter);
app.use('/api/offers', offersRouter);
app.use('/api/partner', partnerRouter);

// Health Check
app.get('/', (req, res) => {
    res.send('Zupp Backend is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
