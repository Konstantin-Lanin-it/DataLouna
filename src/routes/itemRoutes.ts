import { Router, Request, Response } from 'express';
import fetch from 'node-fetch';
import redis from 'redis';

const router = Router();
const client = redis.createClient();

const fetchItems = async (appId: number, currency: string, tradable: boolean): Promise<any[]> => {
    const params = new URLSearchParams({
        app_id: `${appId}`,
        currency: currency,
        tradable: tradable ? '1' : '0'
    });

    const response = await fetch(`https://api.skinport.com/v1/items?${params}`, {
        method: 'GET',
        headers: {
            'Accept-Encoding': 'br'
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
};

router.get('/items', async (req: Request, res: Response) => {
    const appId = req.query.app_id ? parseInt(req.query.app_id as string) : 730;
    const currency = req.query.currency ? req.query.currency as string : 'EUR';
    const tradable = req.query.tradable === '1';

    const cacheKey = `items:${appId}:${currency}:${tradable ? 'tradable' : 'not_tradable'}`;
   
    client.get(cacheKey, async (err, cachedData) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        try {
            const items = await fetchItems(appId, currency, tradable);

            const result = items.map(item => ({
                market_hash_name: item.market_hash_name,
                min_price: item.min_price,
                suggested_price: item.suggested_price,
                item_page: item.item_page,
                market_page: item.market_page
            }));

            const sortedItems = result.sort((a, b) => {
                const priceA = a.min_price || Infinity;
                const priceB = b.min_price || Infinity;
                return priceA - priceB;
            }).slice(0, 2);

            client.setex(cacheKey, 300, JSON.stringify(sortedItems));

            res.json(sortedItems);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error fetching items' });
        }
    });
});

export default router;