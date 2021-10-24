import express from 'express';
import helmet from 'helmet';

import { config as envConfig } from 'dotenv';


// setup env
envConfig();

import sequelize from './db.js';
import LocalApp from './local-app.js';

// setup sequelize
sequelize.sync().then(() => console.log('DB connected!'));

const app = express();

app.use(helmet());

app.use(express.json());

app.get('/', (req, res) => {
    res.send(
        `
Routes-
<br />
<br />POST /create
<br />(Responds with JSON containing token)
<br />
<br />GET /data?token=&lt;TOKEN&gt;
<br />PUT /update?token=&lt;TOKEN&gt;
<br />`
    );
});

app.post('/create', async (req, res) => {
    const json: { name: string; data?: string } = req.body;

    if (!json.name || typeof json.name !== 'string') {
        res.status(400).send('Local App `name` missing or disallowed');
        return;
    }

    if (typeof json.data !== 'string' && typeof json.data !== 'undefined') {
        res.status(400).send('Local App `data` value disallowed');
        return;
    }

    try {
        const localApp = await LocalApp.create({ data: '{}', ...json });
        res.status(201).json({ token: localApp.id, name: localApp.name, data: localApp.data });
    } catch (e) {
        console.error(e);
        res.status(400).send('Local App `name` already taken. Please choose a new name');
    }
});

app.get('/data', async (req, res) => {
    const token = req.query.token;

    const localApp = await LocalApp.findOne({ where: { id: String(token) } });

    if (!localApp) {
        res.status(400).send('Invalid token');
        return;
    }

    res.json({ name: localApp.name, data: localApp.data });
});

app.put('/update', async (req, res) => {
    const token = req.query.token;

    const json: { data?: string } = req.body;

    if (!json.data || typeof json.data !== 'string') {
        res.status(400).send('Local App `data` missing or disallowed');
        return;
    }

    const localApp = await LocalApp.findOne({ where: { id: String(token) } });

    if (!localApp) {
        res.status(400).send('Invalid token');
        return;
    }

    try {
        localApp.data = json.data;
        await localApp.save();
        res.json({ name: localApp.name, data: localApp.data });
    } catch (e) {
        console.error(e);
        res.status(500).send('Something went wrong');
    }
});

app.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`);
});
