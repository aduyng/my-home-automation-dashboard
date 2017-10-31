import React, {Component} from 'react';
import {Chart} from 'react-google-charts';
import {get, isEmpty, keys, map, reduce, sortBy} from 'lodash';
import moment from 'moment';
import firebase from '../../firebase';

function calculateChartData(data) {
  const start = moment().subtract('hour', 24);
  const end = moment();

  const rows = reduce(data, (memo, monthValue, month) => {
    return reduce(monthValue, (keep, dayValue, day) => {
      const date = moment(`${month}/${day}`, "MM/DD");

      if (!date.isBetween(start, end)) {
        return memo;
      }

      return reduce(dayValue, (register, hourValue, hour) => {
        const speed = reduce(hourValue, (sum, minuteValue) => {
          return sum + get(minuteValue, 'result.speeds.download', 0);
        }, 0) / keys(hourValue).length;
        register.push([date.clone().hour(parseInt(hour, 10)), speed]);
        return register;
      }, keep);
    }, memo);
  }, []);

  const sortedRow = sortBy(rows, ([date]) => date.valueOf());

  return map(sortedRow, ([date, value]) => {
    return [[date.hour(), date.minute(), date.second()], value];
  });
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

    const columns = [{
      "label": "Time of Day",
      "type": "timeofday"
    }, {
      "label": "Download Speed (Mbps)",
      "type": "number"
    }];

    const rows = this.state.chartData;

    const props = {
      "chartType": "LineChart",
      columns,
      rows,
      "options": {
        legend: 'none',
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