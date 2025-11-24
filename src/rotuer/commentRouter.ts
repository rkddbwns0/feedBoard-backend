import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    let star = '';

    for (let i = 0; i < 10; i++) {
        star += '*';
        console.log(star);
    }
});

export default router;
