import React, {Component} from 'react';
import {Chart} from 'react-google-charts';
import {get, isEmpty, reduce, sortBy} from 'lodash';
import moment from 'moment';
import firebase from '../../firebase';

function calculateChartData(data) {
  const rows = reduce(data, (memo, yearValue, year) => {
    return reduce(yearValue, (keep, monthValue, month) => {
      return reduce(monthValue, (remember, dayValue, day) => {
        return reduce(dayValue, (register, hourValue, hour) => {
          return reduce(hourValue, (sum, minuteValue) => {
            return sum + get(minuteValue, 'result.speeds.download', 0);
          }, 0) / keys(hourValue).length;

          // row.push(parse)
          return reduce(hourValue, (rows, minuteValue, minute) => {
            const downloadSpeed = get(minuteValue, 'result.speeds.download', 0);
            const ts = moment([year, month, day, hour, minute, 0, 0]);
            rows.push([ts.valueOf() / 1000, downloadSpeed]);
            return rows;
          }, register);
        }, remember);
      }, keep);
    }, memo);
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
    this.ref = firebase.database().ref('speedtest').orderByKey();

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
        "label": "Download Speed",
        "type": "number"
      }],
      "rows": this.state.chartData,
      "options": {
        "legend": true,
        "hAxis": {
          "title": "Time"
        },
        "vAxis": {"title": "Download Speed"},
        curveType: 'function'
      },
      "width": "100%"
    };

    return (
        <Chart {...props}/>
    )
  }
}