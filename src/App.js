import React, { Component } from 'react';
import InternetSpeedToday from './components/InternetSpeedToday/InternetSpeedToday';
import InternetSpeedThisWeek from './components/InternetSpeedThisWeek/InternetSpeedThisWeek';
import PowerToday from './components/PowerToday/PowerToday';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <InternetSpeedToday firebase={this.props.firebase}/>
        <InternetSpeedThisWeek firebase={this.props.firebase}/>
        <PowerToday firebase={this.props.firebase}/>
      </div>
    );
  }
}

export default App;
