const io = require('socket.io')();
const http = require('http')
const express = require('express');
const PORT = require('./src/settings.json').port

const app = express();
let timeuotTime = 15000;

app.use('/', express.static(__dirname + '/build'));

app.listen(PORT, function () {
  console.log(`Example app listening on port ${PORT}!`);
});


let JSONFromFlypool = {};
let timer;
io.on('connection', (client) => {
  console.log('connection')
  clearInterval(timer)
  client.emit('sendJson' , JSONFromFlypool)

  let customAddres = null
  timer = setInterval(
    ()=> {
      getJson(
        'http://zcash.flypool.org/api/miner_new/t1ND65g6W7Bq3eMUb3CZkGmdZfccEp2xjPt'
        ,(data)=>client.emit('sendJson' , data)
      )
    }
  , timeuotTime)

});

io.on('disconnect', ()=>{
  try {
    clearInterval(timer)
  } catch (err) {
    console.log(err)
  }
})



io.listen(PORT+1)
console.log('listen port ',PORT+1)


function getJson(url , cb) {

  http.get(url, (res) => {
    const { statusCode } = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
      error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
    }
    if (error) {
      console.error(error.message);
      // consume response data to free up memory
      res.resume();
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsedData = JSON.parse(rawData);
        parsedData.timeuotTime = timeuotTime
        if( rawData !== JSON.stringify(JSONFromFlypool) ) {
          cb(parsedData)
          timeuotTime > 15000 ? timeuotTime -= 100 : null;
          JSONFromFlypool = parsedData
        } else {
          timeuotTime += 100
          return ;
        }
      } catch (e) {
        console.error(e.message);
      }
    });
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });

}
