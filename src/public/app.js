const ws = new WebSocket(`ws://${document.location.hostname}:1338`);

// TODO: Add TimeStamps

const username = localStorage.getItem('username') || prompt('What do you want your username to be?') || 'Anonymous';
let message_log = JSON.parse(localStorage.getItem('messages')) || [];

localStorage.setItem('username', username);
localStorage.setItem('messages', JSON.stringify(message_log));

ws.addEventListener('open', connectionOpen);
ws.addEventListener('open', loadLocalStorage);
ws.addEventListener('message', handleSocketMessage);

function connectionOpen() {
    console.log('Websocket connection established');
}

function loadLocalStorage() {
    for(const message of message_log) {
        appendToChatbox(message);
    }
}

function appendToChatbox({ sender, message }) {
    const div = document.createElement('div');
    div.className = 'message-row';

    const senderDiv = document.createElement('div');
    senderDiv.className = 'sender';
    senderDiv.textContent = sender +": ";

    const messageDiv = document.createElement('div');
    messageDiv.className = 'message';
    messageDiv.textContent = message;

    div.appendChild(senderDiv);
    div.appendChild(messageDiv);

    document.getElementById('chat').appendChild(div);
}

// From the server
function handleSocketMessage(e) {
    try {
        const realMessage = JSON.parse(e.data);
        const { sender, message } = realMessage;
        appendToChatbox({ sender, message })

        // Store the message in local storage
        message_log.push({sender, message});
        localStorage.setItem('messages', JSON.stringify(message_log));
    } catch(error) {
        console.log('Received non JSON message from server: ', e.data)
    }
}

// From the client
function runHandler(e) {
    e.preventDefault()

    if(ws.readyState === WebSocket.OPEN) {
        const field = document.getElementById('message-field');
        const message = field.value;
        field.value = '';
        console.log(`Trying to send this message on socket: ${message}`);
        if (message === '' )
            return;
        
        ws.send(JSON.stringify({
            sender: username,
            message,
        }))
    } else {
        console.log('Still establishing connection');
    }
}
