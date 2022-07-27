import React, { Component } from 'react';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import { main_url, getFirstDayOfMonth } from '../../utils/CommonFunction'
import moment from 'moment';
import DatePicker from 'react-datetime';

class CompensationandBenefit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toDate: moment().format('DD-MM-YYYY'),
      fromDate: moment(getFirstDayOfMonth()).format('DD-MM-YYYY'),
      exitToDate: moment().format('DD-MM-YYYY'),
      exitFromDate: moment(getFirstDayOfMonth()).format('DD-MM-YYYY'),
      chartOptions: {},
      name: [],
      amount: [],
      branchData: [],
      deptData: []
    }
  }


  componentDidMount() {
    this.setChartOption()
    this.getBenefit()
    this.getBranch()
    this.getDepartment()

  }
  getBranch = () => {
    fetch(main_url + `main/getBranch`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((res1) => {
        this.setState({ branchData: res1 });
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  };
  handleToDate = (event) => {
    this.setState({
      toDate: event
    });
  };
  handleFromDate = (event) => {
    this.setState({
      fromDate: event
    });
  };
  getBenefit = () => {
    fetch(main_url + 'dashboard/benefitExpense', {
      method: 'GET'
    }).then(res =>
      res.json()
    ).then(data => {
      console.log(data)
      let listName = data.map(v => v.name);
      let listAmt = data.map(v => v.amount);
      this.setState({ name: listName, amount: listAmt })
      console.log("benefit name==>", this.state.name)
      console.log('benefit amount==>', this.state.amount)
      this.setChartOption();
    })

  }
  getDepartment = () => {
    fetch(main_url + `main/getDepartment`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((res1) => {
        this.setState({ deptData: res1 });
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  };

  setChartOption = () => {
    const chartOptions = {
      chart: {
        type: 'line',
        height: '400px',
      },

      title: {
        text: '',
      },

      subtitle: {
        text: ''
      },
      yAxis: {
        min: 0, max: 100, tickInterval: 10,
        title: {
          text: ""
        },
        labels: {
          format: '{value}',
        }
      },

      xAxis: {
        categories: ['Payroll', 'Monthly Incentive', 'Quarterly Incentive', 'Benefit', 'Allowance'],
        tickmarkPlacement: 'on',
        title: {
          enabled: false
        }
      },
      accessibility: {
        point: {
          valueDescriptionFormat: '{index}. {point.category}, {point.y:,.0f} millions, {point.percentage:.1f}%.'
        }
      },
      legend: {
        align: 'center',
        verticalAlign: 'bottom',
        x: 0,
        y: 0
      },
      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>',
        split: true
      },
      plotOptions: {
      

        area: {
          stacking: 'percent',
          lineColor: '#ffffff',
          lineWidth: 1,
          marker: {
            lineWidth: 1,
            lineColor: '#ffffff'
          }
        }
      },
      // colorByPoint: true,
      // colors: ['#1f4545', '#3d86dy', '#193759', '#419191', '#9bcece', '#59c5c5', '#7ea8d9', '#344545', '#5c7c9f', '#59c5c5'],
      series: [{
        color:'#1f4545',
        name: 'Jan',
        data: [50, 63, 80, 94, 14,]
      }, {
        color:'#344545',
        name: 'Feb',
        data: [10, 17, 11, 33, 22]
      }, {
        color:'#193759',
        name: 'March',
        data: [16, 23, 26, 48, 57,]
      }, {
        color:'#419191',
        name: 'Aprial',
        data: [18, 31, 54, 56, 33]
      }, {
        color:'#59c5c5',
        name: 'May',
        data: [2, 2, 2, 6, 13,]
      }, {
        color:'#5c7c9f',
        name: 'June',
        data: [23, 43, 54, 87, 34]
      }],

    };

    this.setState({ chartOptions })

  }

  render() {
    return (
      <div
        className='text-center margin-y'
        style={{
          background: '#fff',
          color: '#222',
          boxShadow: '3px 3px 3px #e5e5e5',
          borderRadius: 6,
          padding: '2px 0px 2px 0px'
        }}
      >
        <h3 className='' style={{ padding: '10px 0px 0px 0px', marginBottom: '20px' }}>Compensation and Benefit</h3>
        <div className='flex-row' style={{ display: 'flex', justifyContent: 'start', alignItems: 'end', margin: '10px 10px 0px 10px' }}>

          <div style={{ textAlign: 'start', display: 'fexl flex-col'}}>
            <label htmlFor="" >Start Date</label>
            <div style={{ }}>
              <DatePicker className='fromdate'
                dateFormat="DD/MM/YYYY"
                value={this.state.fromDate}
                onChange={this.handleFromDate}
                timeFormat={false} />
            </div>
          </div>

          <div style={{ textAlign: 'start', display: 'fexl flex-col' }}>
            <label htmlFor="">End Date</label>
            <div style={{ }}>
              < DatePicker className='fromdate'
                dateFormat="DD/MM/YYYY"
                value={this.state.toDate}
                onChange={this.handleToDate}
                timeFormat={false} />

            </div>
          </div>

          <button className='btn btn-primary text-center' style={{ height: 30, padding: '0px 5px 0px 5px' }} >Search</button>
        </div>
        <HighchartsReact
          highcharts={Highcharts}
          options={this.state.chartOptions}
          containerProps={{ className: "w-100" }} />
      </div>

    )
  }

}
export default CompensationandBenefit;
