import React, { Component } from 'react';
import Highcharts from 'highcharts/highstock'
import HighchartsReact from 'highcharts-react-official'
import Select from 'react-select'
import { main_url, getFirstDayOfMonth } from '../../utils/CommonFunction'
import moment from 'moment';
import DatePicker from 'react-datetime';

class CompensationandBenefit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toDate: moment(),
      fromDate: moment(getFirstDayOfMonth()),
      chartOptions: {},
      name: [],
      amount: [],
      branchData: [],
      deptData: [],
      date:[],
      dataRow:[],
      uniqueMap:null,
      mapValue:null,
      finalMap:[],
      seriesData:[],
      chartData: [],
    }
  }


  componentDidMount() {
    this.setChartOption()
    this.getBenefit()
    // this.filter()
    // this.getBranch()
    // this.getDepartment()

  }
  // getBranch = () => {
  //   fetch(main_url + `main/getBranch`)
  //     .then((res) => {
  //       if (res.ok) return res.json();
  //     })
  //     .then((res1) => {
  //       this.setState({ branchData: res1 });
  //     })
  //     .catch((error) => console.error(`Fetch Error =\n`, error));
  // };
  // handleToDate = (event) => {
  //   this.setState({
  //     toDate: event
  //   });
  // };
  filter() {
    let s_date = moment(this.state.s_date).format("YYYY-MM-DD");
    let e_date = moment(this.state.e_date).format("YYYY-MM-DD");

    this.getBenefit(
        s_date,
        e_date,


    );
}
  handleFromDate = (event) => {
    this.setState({
      fromDate: event
    });
  };
  handleToDate = (event) => {
    this.setState({
      toDate: event
    },()=>{console.log(">><<??",moment(this.state.toDate).format("YYYY-MM-DD"))});
  };
  getBenefit = () => {
    fetch(main_url + 'dashboard/compensationBenefit'+'/'+ moment(this.state.fromDate).format("YYYY-MM-DD")+'/'+ moment(this.state.toDate).format("YYYY-MM-DD")
    // , {method: 'GET'}
    ).then(res =>
      res.json()
    ).then(data => {
      let temp = [];
      let dateArray = [];
      data.map((v) => {
        var obj = {};
        obj['name'] = v.name;
        let temp1 = [];
        v.amount.map((a) => {
          if (!dateArray.includes(a.Date)) {
            dateArray.push(a.Date);
          }
          
          temp1.push([a.Date, a.amount]);
        })
        obj['data'] = temp1;
        temp.push(obj);
      })
      var labelArray = [];
      temp.map(v => {
        labelArray.push(v.name);
      })
      this.setState({chartData: temp, date: dateArray});
      // data.forEach(v=>{
      //   v.amount.forEach(v1=>{
      //     uniquedate.add(v1.Date);
      //   })
      // })
      // console.log('uniqueDate ===>', uniquedate);
      // let uniqueMap = new Map();
      //           uniquedate.forEach(v=>{
      //               uniqueMap.set(v, {
      //                   "Date": v,
      //                   "amount":0
      //               })
      //           });

                // let mapValue = [...uniqueMap.values()]
                
                // let dataRow = data;
                // dataRow = dataRow.map(v=>{
                //     let temp = [...v.amount];
                //     // console.log("temp",temp)
                //     v.amount = mapValue;
                //     // console.log("v.amount",v.amount)

                //     v.amount = v.amount.map(amount=>{
                //         temp.forEach(originValue=>{
                //             if(amount.Date == originValue.Date){
                //                 amount = originValue;
                //             }
                            
                //         })
                //         return amount;
                //     })
                //     return v;
                // })
                
                // let finalMap = new Map();
                // this.state.dataRow.forEach(v=>{
                //     v.amount.forEach(v1=>{
                //       finalMap.set(v1,{
                //         name:v1.Date,
                //         data:[v.amount[0].amount]
                //       })
                //     })
                // });
                // console.log("finalMap",finalMap)
               
                // dataRow.forEach(v=>{
                //   //already exsit May 2020
                //   v.amount.forEach(v1=>{
                //     if(finalMap.has(v1.Date)){
                //       let arrAmt = finalMap.get(v1.Date);
                //       arrAmt.push(v1.amount);
                //       finalMap.set(v1.Date, arrAmt);
                //     }else{
                //       //May 2020 , 
                //       finalMap.set(v1.Date, [v1.amount]);
                //     }
                //   })
                 
                  
                  // v.amount.map(v1=>{
                  //     this.state.finalMap.push({name:v1.Date,data:[...v1.amount]})
                  // })
                // })
                // console.log("finalmap=============>",finalMap)
                
                // let dates = [...finalMap.keys()];
                // let seriesData = dates.map(v=>{
                //   let result = {
                //     name: v,
                //     data: finalMap.get(v)
                //   }
                //   return result;
                // })
                // console.log('seriesData ===>', seriesData)


                
                // console.log('series',seriesData)


      // console.log("unique date",uniquedate)
      // let listName = data.map(v => v.name);
      // // console.log("listname",listName)
      // let listAmt = data.map(v => v.amount);
      // let listmap=listAmt.map(v=>v.amount)
      // this.setState({ name: listName, amount: listmap,date:uniquedate,dataRow:dataRow,
      //   uniqueMap:uniqueMap,
      //   mapValue:mapValue,seriesData:seriesData,
      //  })
      // console.log("benefit name==>", this.state.name)
      // console.log('benefit amount==>', this.state.amount)
      // console.log("mapValue",mapValue)
      // console.log("dataRow",this.state.dataRow)
      this.setChartOption();
    })

  }
  // getDepartment = () => {
  //   fetch(main_url + `main/getDepartment`)
  //     .then((res) => {
  //       if (res.ok) return res.json();
  //     })
  //     .then((res1) => {
  //       this.setState({ deptData: res1 });
  //     })
  //     .catch((error) => console.error(`Fetch Error =\n`, error));
  // };

  setChartOption = () => {
    const chartOptions = {
      chart: {
        type: 'line',
        height: '400px',
      },

      title: {
        text: '',
      },

      // subtitle: {
      //   text: ''
      // },
      yAxis: {
        min: 0, tickInterval: 10000000,
        title: {
          text: ""
        },
        labels: {
          format: '{value}',
        }
      },

      xAxis: {
        categories: this.state.date,
        // tickmarkPlacement: 'on',
        title: {
          enabled: true
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
      // tooltip: {
      //   pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.percentage:.1f}%</b> ({point.y:,.0f} millions)<br/>',
      //   split: true
      // },
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
      // series: [
      // {
      //   color:'#1f4545',
      //   name:this.state.dataRow.map(v=>{
      //     v.amount.map(v1=>v1.Date)
      //   }),
      //   data: this.state.dataRow.map(v=>{
      //     v.amount.map(v1=>
      //       v1.amount
      //     )
      //   })
       
      // }],
      series:this.state.chartData

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

          <button className='btn btn-primary text-center' style={{ height: 30, padding: '0px 5px 0px 5px' }} onClick={this.filter.bind(this)}>Search</button>
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
