import React, {Component} from 'react';
import {Chart} from 'react-google-charts';
import {get, isEmpty, keys, reduce} from 'lodash';
import moment from 'moment';
import firebase from '../../firebase';

function calculateChartData(data) {
  const start = moment().subtract('hour', 24);
  const end = moment();

  return reduce(data, (memo, monthValue, month) => {
    return reduce(monthValue, (keep, dayValue, day) => {
      const date = moment(`${month}/${day}`, "MM/DD");

      if (!date.isBetween(start, end)) {
        return memo;
      }

      return reduce(dayValue, (register, hourValue, hour) => {
        const speed = reduce(hourValue, (sum, minuteValue) => {
          return sum + get(minuteValue, 'result.speeds.download', 0);
        }, 0) / keys(hourValue).length;
        register.push([date.hour(parseInt(hour, 10)).toDate(), speed]);
        return register;
      }, keep);
    }, memo);
  }, []);
}

export default class Speedtest extends Component {
  constructor(props) {
    super(props);
    this.state = {chartData: []};
  }

  componentWillMount() {
    this.ref = firebase.database().ref(`speedtest/${moment().format('YYYY')}`);

    this.ref.on('value', snapshot => {
      const chartData = calculateChartData(snapshot.val());
      this.setState({chartData});
    });
  }

  componentWillUnmount() {
    this.ref.off('value');
  }

  render() {
    if (isEmpty(this.state.chartData)) {
      return null;
    }

    const props = {
      "chartType": "LineChart",
      "columns": [{
        "label": "Hour",
        "type": "date"
      }, {
        "label": "Download Speed (Mbps)",
        "type": "number"
      }],
      "rows": this.state.chartData,
      "options": {
        title: 'Internet Speed in the last 24h',
        "legend": 'none',
        hAxis: {title: 'Hour'},
        vAxis: {title: 'Mbps', minValue: 0},
        curveType: 'function'
      },
      "width": "100%"
    };

    return (
        <Chart {...props}/>
    )
  }
}