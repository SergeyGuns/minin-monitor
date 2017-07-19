const io = require('socket.io')();
const http = require('http')


let JSONFromFlypool = {};
let timer;
io.on('connection', (client) => {
  console.log('connection')
  clearInterval(timer)
  client.emit('sendJson' , JSONFromFlypool)

  let customAddres = null
  timer = setInterval(
    ()=> {
      console.log('sendJson')
      getJson(
        'http://zcash.flypool.org/api/miner_new/t1ND65g6W7Bq3eMUb3CZkGmdZfccEp2xjPt'
        ,(data)=>client.emit('sendJson' , data)
      )
    }
  , 5000)

});

io.on('disconnect', ()=>{
  try {
    clearInterval(timer)
  } catch (err) {
    console.log(err)
  }
})


const port = 8000;
io.listen(port)
console.log('listen port ',port)


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
        // console.log(parsedData);
        if( rawData !== JSON.stringify(JSONFromFlypool) ) {
          cb(parsedData) 
          JSONFromFlypool = parsedData
        } else {
          console.log('no diff')
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
