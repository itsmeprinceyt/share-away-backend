import express from 'express';
import routes from './routes';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());

app.use(bodyParser.json({ limit: '500kb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '500kb' }));

app.get('/', (req, res) => {
    res.send('Subscribe: https://www.youtube.com/@itsmeprinceyt');
});
app.use('/api', routes);

export default app;
