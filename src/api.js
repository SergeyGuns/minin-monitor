import openSocket from 'socket.io-client';
import { port } from './settings.json'
const  socket = openSocket(`:${port}`);


function subscribeRequestJson( cb, url ) {
  socket.on('sendJson', (data)=> cb(null, data))
}


export { subscribeRequestJson };