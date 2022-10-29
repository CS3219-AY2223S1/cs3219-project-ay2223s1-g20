import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { handleChatEvents } from './controller/chat-controller';

const app = express();
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors()) // config cors so that front-end can use
app.options('*', cors())

app.get('/', (req, res) => {
    res.send('Hello World from chat-service');
});

const httpServer = createServer(app)

instrument(io, {
    auth: false
})

handleChatEvents(io)

httpServer.listen(8003);
