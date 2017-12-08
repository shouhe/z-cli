import React, { Component } from 'react';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      msg: '原来是你'
    }
  }

  componentDidMount() {
    console.log('mount');
  }


  render() {
    let { msg } = this.state;
    
    return <div>
      <h1>
        { msg }
      </h1>
    </div>
  }
}