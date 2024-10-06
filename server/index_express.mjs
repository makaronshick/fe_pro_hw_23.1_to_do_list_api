import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __fileName = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__fileName);

const app = express();

app.use(express.static('../client'));

app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, '../client/index.html');
    res.sendFile(indexPath);
})

app.get('/index.js', (req, res) => {
    const indexPath = path.join(__dirname, '../client/index.js');
    res.sendFile(indexPath);
})

app.get('/styles.css', (req, res) => {
    const indexPath = path.join(__dirname, '../client/styles.css');
    res.sendFile(indexPath);
})

app.get('/users', (req, res) => {
    res.send([{name: 'Dodik'}, {name: 'Lola'}]);
})

app.listen(5555, () => {
    console.log('Server started');
})