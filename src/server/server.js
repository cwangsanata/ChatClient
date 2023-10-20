const express = require('express');
const mongoose = require('mongoose');
const { WebSocket } = require('ws');
const app = express();

require('dotenv').config()

const wss = new WebSocket.Server({ 
    port: 1338,
    clientTracking: true,
});

const Message = require('./models/message');
app.use(express.json());
const cors = require('cors');
app.use(cors());

let source = process.env.MONGO_URI;
mongoose.connect(source, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Connected to MongoDB cluster');
})
.catch((error) => {
    console.log('Error connecting to MongoDB cluster: ', error);
});

// Handle incoming messages and save them to the database
wss.on('connection', (ws) => {
    ws.on('message', (e) => {
        const rawMessage = Buffer.from(e).toString();
        JSON.parse(rawMessage);
        try {
            const { sender, message } = JSON.parse(rawMessage);

            // Create a new message object using the model
            const newMessage = new Message({
                sender,
                message
            });

            // Save the message to the database
            newMessage.save()
            .then(() => {
                console.log('Message saved to database');
            })
            .catch((error) => {
                console.log('Error saving message to database: ', error);
            });

            // Broadcast the message to all connected clients
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
