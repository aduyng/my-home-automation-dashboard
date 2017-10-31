import React, {Component} from 'react';
import InternetSpeedToday from './components/InternetSpeedToday/InternetSpeedToday';
import InternetSpeedThisWeek from './components/InternetSpeedThisWeek/InternetSpeedThisWeek';
import PowerToday from './components/PowerToday/PowerToday';
import AppBar from './components/AppBar/AppBar';
import {Card, CardHeader, CardText} from 'material-ui/Card';

class App extends Component {
  render() {
    return (
        <div className="App">
          <AppBar/>

          <Card>
            <CardHeader title="Internet Speed in the last 24h"/>
            <CardText>
              <InternetSpeedToday firebase={this.props.firebase}/>
            </CardText>
          </Card>

          <Card>
            <CardHeader title="Internet Speed This Week"/>
            <CardText>
              <InternetSpeedThisWeek firebase={this.props.firebase}/>
            </CardText>
          </Card>

          <Card>
            <CardHeader title="Power Consumption Today"/>
            <CardText>
              <PowerToday firebase={this.props.firebase}/>
            </CardText>
          </Card>


        </div>
    );
  }
}

export default App;
