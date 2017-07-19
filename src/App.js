import React, { Component } from 'react';
import { subscribeRequestJson } from './api.js'
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    // subscribeToTimer((err, timestamp) => this.setState({
    //   timestamp
    // }));
    subscribeRequestJson((err, data) => {
      console.log(data,err)
      this.setState({
        data : data
      }) 
    })
  }
  state = {
    data : {}
  };

  render() {
    let { hashRate, avgHashrate, usdPerMin, workers } = this.state.data
    return (
      <div className="App">
        <div key={Date.now()} className='hrate'>
          Средний Hash Rate : {(+avgHashrate).toFixed(1)}H/s
          <hr/>
          USD в час : {(usdPerMin*60).toFixed(2)}$
          <hr/>
          USD в день (24h) : {(usdPerMin*60*24).toFixed(2)}$
          <hr/>
          {workers && <OnLineRigs workers={workers} />}
        </div>
      </div>
    );
  }
}

export default App;


function OnLineRigs ({workers}) {
  let countHashRate = 0;
  return <div className='rigs'>
      Капают :
      {Object.keys(workers).map((el,index)=>{

        let timeDiff = Date.now()/1000 - workers[el].workerLastSubmitTime
        console.log(el,timeDiff, workers[el].workerLastSubmitTime)
        if(timeDiff < 500) {
          countHashRate += parseInt(workers[el].hashrate)
          return <div key={index}>{` ${el} : ${workers[el].hashrate} `}</div>
        }
      })}
      <hr/>
      COUNT : { countHashRate }H/s
    </div>
}