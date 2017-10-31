import React, {Component} from 'react';
import {Chart} from 'react-google-charts';
import {get, isEmpty, keys, reduce, sortBy} from 'lodash';
import moment from 'moment';
import firebase from '../../firebase';

function calculateChartData(data) {
  const startDate = moment().subtract('week', 1);
  const endDate = moment();

  const rows = reduce(data, (memo, monthValue, month) => {
    return reduce(monthValue, (keep, dayValue, day) => {
      const date = moment(`${month}/${day}`, 'MM/DD');
      if (date.isBetween(startDate, endDate)) {
        const dayAvg = reduce(dayValue, (register, hourValue, hour) => {
          return reduce(hourValue, (sum, minuteValue) => {
            return sum + get(minuteValue, 'result.speeds.download', 0);
          }, 0) / keys(hourValue).length;
        }, []) / keys(dayValue).length;
        keep.push([date.toDate(), dayAvg]);
      }
      return keep;
    }, memo);
  }, []);

  return sortBy(rows, ([date]) => date.valueOf());
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
        "legend": 'none',
        hAxis: {
          title: 'Day'
        },
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