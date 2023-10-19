const express = require('express');
const { WebSocket } = require('ws');
const app = express();

const wss = new WebSocket.Server({ 
    port: 1338,
    clientTracking: true,
});

wss.on('connection', (ws) => {
    ws.on('message', (e) => {
        const rawMessage = Buffer.from(e).toString();
        try {
            const { sender, message } = JSON.parse(rawMessage)

            for(const client of wss.clients) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({
                        sender, message
                    }));
                }
            }
        } catch(error) {
            console.log('Received non JSON message from client: ', rawMessage);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Serve static files from the public directory
app.use(express.static('src/public'));

const port = 1337;
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
