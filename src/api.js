import openSocket from 'socket.io-client';
const  socket = openSocket(':8000/');


function subscribeRequestJson( cb, url ) {
  socket.on('sendJson', (data)=> cb(null, data))
}


export { subscribeRequestJson };