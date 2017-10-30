import React, {Component} from 'react';
import {Chart} from 'react-google-charts';
import {isEmpty, keys, reduce, sortBy} from 'lodash';
import moment from 'moment';
import firebase from '../../firebase';

function calculateChartData(data) {
  const rows = reduce(data, (memo, hourValue, hour) => {
    const avg = reduce(hourValue, (sum, minuteValue) => {
      return sum + minuteValue.power;
    }, 0) / keys(hourValue).length;

    memo.push([parseInt(hour, 10), avg]);
    return memo;
  }, []);

  return sortBy(rows, (row) => {
    return row[0];
  });
}

export default class Speedtest extends Component {
  constructor(props) {
    super(props);
    this.state = {chartData: []};
  }

  componentWillMount() {
    const path = moment().format('YYYY/MM/DD');
    this.ref = firebase.database().ref(`power/${path}`).orderByKey();

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
        "label": "time",
        "type": "number"
      }, {
        "label": "Power (W)",
        "type": "number"
      }],
      "rows": this.state.chartData,
      "options": {
        "legend": 'none',
        title: 'Power Consumption Today',
        hAxis: {title: 'Hour', minValue: 0, maxValue: 24},
        vAxis: {title: 'Watt', minValue: 0, maxValue: 3000},
        curveType: 'function'
      },
      "width": "100%"
    };

    return (
        <Chart {...props}/>
    )
  }
}