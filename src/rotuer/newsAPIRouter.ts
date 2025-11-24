import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/headlines', async (req: Request, res: Response) => {
    const api = process.env.NEWS_API_KEY;
    const url = new URL(`https://newsapi.org/v2/top-headlines?country=kr&apiKey=${api}`);

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    res.send({ data });
});

export default router;
