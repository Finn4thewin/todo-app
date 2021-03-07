import express from 'express';

let router = express.Router();

type ListItem = {
    title: string;
    completed: boolean;
}

let list = new Map<string, boolean>();

router.get('/get-list', (req, res, next) => {
    let response: ListItem[]  = [];

    list.forEach((value, key) => {
        response.push({
            title: key,
            completed: value
        });
    });

    res.status(200);
    res.json(response);
    res.end();
});

router.post('/set-list', (req, res, next) => {
    let newList: ListItem[] = req.body.newList;

    list = new Map<string, boolean>();

    newList.forEach((item) => {
        list.set(item.title, item.completed);
    });

    res.status(200);
    res.end();
});

export default router;