import { Router, Request, Response } from 'express';
import client from '../db/db';

const router = Router();

router.post('/purchase', async (req: Request, res: Response) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return res.status(400).json({ error: 'User ID and Product ID are required' });
    }

    try {
        const userResult = await client.query('SELECT * FROM users WHERE id = $1', [userId]);
        const user = userResult.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const productResult = await client.query('SELECT * FROM products WHERE id = $1', [productId]);
        const product = productResult.rows[0];

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        if (user.balance < product.price) {
            return res.status(400).json({ error: 'Insufficient balance' });
        }

        const newBalance = user.balance - product.price;
        await client.query('UPDATE users SET balance = $1 WHERE id = $2', [newBalance, userId]);

        await client.query('INSERT INTO purchases (user_id, product_id) VALUES ($1, $2)', [userId, productId]);

        res.json({ balance: newBalance });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing the purchase' });
    }
});

export default router;