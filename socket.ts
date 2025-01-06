// import { WebSocketServer } from 'ws';
import { WebSocket, WebSocketServer } from 'ws';
const ws_port = Number(process.env.PORT) || 8090;

const wss = new WebSocketServer({ port: ws_port });

interface CustomWebSocket extends WebSocket {
    send: (data: string) => void;
}

interface Client {
    id: string;
    socket: WebSocket;
  }
  
  const clients: Map<string, Client> = new Map();
  
  wss.on('connection', (ws: WebSocket) => {
    console.log('New client connected');
    let clientId: string | null = null;
  
    ws.on('message', (message: Buffer) => {
        const messageStr = message.toString();
        console.log('Message received:', messageStr);
      const data = JSON.parse(messageStr);
      console.log('Data:', data);
  
      if (data.type === 'CREATE') {
        // User creates a room, set the unique ID for the room
        clientId = data.roomId;
        if (clientId) {
          clients.set(clientId, { id: clientId, socket: ws });
        }
        console.log('Room created with ID:', clients);
        ws.send(JSON.stringify({ type: 'roomCreated', roomId: clientId }));
      } else if (data.type === 'JOIN') {
        // Another user joins the room with the given ID
        const room = clients.get(data.roomId);
        if (room) {
          clientId = data.roomId;
          ws.send(JSON.stringify({ type: 'JOINED', roomId: data.roomId }));
          room.socket.send(JSON.stringify({ type: 'newParticipant', message: 'A new user joined!' }));
        } else {
          ws.send(JSON.stringify({ type: 'error', message: 'Room does not exist!' }));
        }
      } else if (data.type === 'message' && clientId) {
        // Broadcasting message to the room
        const room = clients.get(clientId);
        if (room) {
          room.socket.send(JSON.stringify({ type: 'MESSAGE', message: data.payload }));
        }
      }
    });
  
    ws.on('close', () => {
        console.log('Client disconnected');
      if (clientId) {
        clients.delete(clientId);
      }
    });
  });
  
console.log('WebSocket server is running on ws://localhost:8090');
