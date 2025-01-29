import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoutes';
import itemRoutes from './routes/itemRoutes';
import purchaseRoutes from './routes/purchaseRoutes';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(session({
  secret: 'your_secret',
  resave: false,
  saveUninitialized: true,
}));

app.use('/api/users', userRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/purchases', purchaseRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});