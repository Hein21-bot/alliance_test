import React, { Component } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { data } from "browserslist";
import { main_url } from "../../utils/CommonFunction";

class EmployeePieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartOptions: {},
      total_count: 0,
      male_count: 0,
      female_count: 0,
      empDetails:{}
      // attendenceCount:"",
      // fieldAttendenceCount:"",
      // absenceCount:"",
      // leaveCount:""

      // piename:['user','admin','guest'],
      // piedata:[20,60,30],
      // pielength:3
      
    };
  }

  async componentDidMount() {
    await this.setChartOption();
    await this.totalEmployeeDashboard();
    await this.totalEmpDetails();
  }
  async totalEmpDetails(){
    fetch(`${main_url}dashboard/totalEmpDetails`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((res) => {
        
        this.setState({ empDetails:res });
       
      })  
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }

  async totalEmployeeDashboard() {
    fetch(`${main_url}dashboard/totalEmployee`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((res) => {
        let total = []
        let male = []
        let female = []
        res.map((v, i) => {
          total.push(v.count);
          female.push(v.female);
          male.push(v.male);
        })
        this.setState({ male_count: male[2], female_count: female[1] });
        this.setChartOption()
      })  
      .catch((error) => console.error(`Fetch Error =\n`, error));
  };



  setChartOption = async () => {
    const chartOptions = {
      chart: {
        type: "pie",
        height: "280px",
        options3d: {
          enabled: true,
          alpha: 180,
        },

      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          innerSize: 50,
          depth: 45,
          cursor: "pointer",
          showInLegend: true,
          dataLabels: {
            enabled: true,
          
            format: '<b>{point.name}</b>: {point.y} '
          }
        },
        // series: {
        //   dataLabels: {
        //     enabled: true,
        //     // format: "{point.name}: {point.y}"
        //   },
        // },
      },

      // tooltip: {
      //   headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      //   pointFormat:
      //     '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.1f}%</b> of total<br/>',
      // },

      credits: {
        enabled: false,
      },
      legend:{
        useHTML: true
      },

      series: [
        {
          data: [
            {
              name: "Male",
              color: '#27568a',
              y: this.state.male_count,
              drilldown: "Male",
             
            }, {
              name: "Female",
              color: '#d72323',
              y: this.state.female_count,
              drilldown: 'Female'
            }


          ],

        },
      ],
    };

    this.setState({ chartOptions });
  };

  render() {
    
    return (
      <div
        className=" margin-y"
        style={{
          background: "#fff",
          display: "flex",
          color: "#222",
          boxShadow: "3px 3px 3px #e5e5e5",
          borderRadius: 6,
          padding: "2px 0px 2px 0px",
        }}
      >
        <div
          className=" col-lg-9 col-md-7 col-sm-7"
          style={{
            boxShadow: "1px 1px 3px 1px #e6e6e6",
            margin: "7px",
            borderRadius: 6,
          }}
        >
          <div
            className=""
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "0px 10px 0px 10px",
            }}
          >
            <h4 style={{fontSize:22}}>Total Employees</h4>
            <h3 style={{fontSize:22}}>{this.state.male_count+this.state.female_count}</h3>
          </div>
          <HighchartsReact
            highcharts={Highcharts}
            options={this.state.chartOptions}
            containerProps={{ className: "w-100" }}
          />
        </div>
        <div
          className="col-lg-3 col-md-5 col-sm-5"
          style={{ margin: "7px", display: "flex", flexWrap: "wrap" }}
        >
          {/* <div className="row col-md-12">
            <div className="col-md-6">
              <div className="row">
                <div className="col-12">
                  <div className="col-6">
                  <i
                    className="fa fa-user"
                    aria-hidden="true"
                    style={{ fontSize: 18 }}
                  ></i>
                  </div>
                  <div className="col-6">
                  <button
                  className="btn text-center"
                  style={{ height: 22, padding: "0px 5px 0px 5px", fontSize: 12 }}
                >
                  More Info
                  <i
                    class="fa fa-arrow-circle-right"
                    style={{ marginLeft: 5 }}
                    aria-hidden="true"
                  ></i>
                </button>
                  </div>
                </div>
              </div>
              
            </div>
            <div className="col-md-6">
              <div className="row">
                <div className="col-12">
                <div className="col-6">
                    Attendance
              </div>
              <div className="col-6">
                123
              </div>
                </div>
              </div>
              
            </div>
          </div> */}
          <div
            className="row col-lg-12 col-md-12 col-sm-12"
            style={{
              // boxShadow: "1px 1px 3px 1px #e6e6e6",
              display: "flex",
              justifyContent:'space-evenly',
              alignItems: "center",
              borderRadius: 10,
              padding: "5px",
              fontSize: 12,
              
              border:'1px solid #27568a'
            }}
          >
            <div
              className="col-lg-6 col-md-8 col-sm-4"
              style={{
                display: "flex",
                flexDirection:'column',
                flexWrap: "wrap",
                justifyContent: "center",
                padding: "0px 0px 0px 3px",
              }}
            >
              <i
                className="fa fa-user margin-y"
                aria-hidden="true"
                style={{ fontSize: 26,color:'#17b978' }}
              ></i>
              
            </div>
            <div
              className=" col-lg-6 col-md-8 col-sm-8"
              style={{
                display: "flex",
               
                flexWrap: "wrap",
                justifyContent: "end",
                marginLeft: 6,
                padding: 0,
              }}
            >
              <div className="text-right" style={{ width: "100%",fontWeight:'bold' }}>
                Attendance
              </div>
              <div className="text-right" style={{ width: "100%",fontWeight:'bold' }}>
                {
                  this.state.empDetails.attendance_count
                }
              </div>
            </div>
          </div>
          <div
            className="row col-lg-12 col-md-12 col-sm-12"
            style={{
              // boxShadow: "1px 1px 3px 1px #e6e6e6",
              display: "flex",
              justifyContent:'space-evenly',
              alignItems: "center",
              borderRadius: 10,
              padding: "5px",
              fontSize: 12,
              marginTop:10,
              border:'1px solid #27568a'
            }}
          >
            <div
              className="col-lg-6 col-md-8 col-sm-4"
              style={{
                display: "flex",
                flexDirection:'column',
                flexWrap: "wrap",
                justifyContent: "center",
                padding: "0px 0px 0px 3px",
              }}
            >
              <i
                className="fa fa-user margin-y"
                aria-hidden="true"
                style={{ fontSize: 26,color:'#27568a' }}
              ></i>
              
            </div>
            <div
              className=" col-lg-6 col-md-8 col-sm-8"
              style={{
                display: "flex",
               
                flexWrap: "wrap",
                justifyContent: "end",
                marginLeft: 6,
                padding: 0,
              }}
            >
              <div className="text-right" style={{ width: "100%",fontWeight:'bold' }}>
                Field Attendance
              </div>
              <div className="text-right" style={{ width: "100%",fontWeight:'bold' }}>
               {this.state.empDetails.field_count}
              </div>
            </div>
          </div>
          <div
            className="row col-lg-12 col-md-12 col-sm-12"
            style={{
              // boxShadow: "1px 1px 3px 1px #e6e6e6",
              display: "flex",
              justifyContent:'space-evenly',
              alignItems: "center",
              borderRadius: 10,
              padding: "5px",
              fontSize: 12,
              marginTop:10,
              border:'1px solid #27568a'
            }}
          >
            <div
              className="col-lg-6 col-md-8 col-sm-4"
              style={{
                display: "flex",
                flexDirection:'column',
                flexWrap: "wrap",
                justifyContent: "center",
                padding: "0px 0px 0px 3px",
              }}
            >
              <i
                className="fa fa-user margin-y"
                aria-hidden="true"
                style={{ fontSize: 26,color:'#5d5d5a' }}
              ></i>
              
            </div>
            <div
              className=" col-lg-6 col-md-8 col-sm-8"
              style={{
                display: "flex",
               
                flexWrap: "wrap",
                justifyContent: "end",
                marginLeft: 6,
                padding: 0,
              }}
            >
              <div className="text-right" style={{ width: "100%",fontWeight:'bold' }}>
                Leave
              </div>
              <div className="text-right" style={{ width: "100%",fontWeight:'bold' }}>
                {this.state.empDetails.leave_count}
              </div>
            </div>
          </div>
          <div
            className="row col-lg-12 col-md-12 col-sm-12"
            style={{
              // boxShadow: "1px 1px 3px 1px #e6e6e6",
              display: "flex",
              justifyContent:'space-evenly',
              alignItems: "center",
              borderRadius: 10,
              padding: "5px",
              fontSize: 12,
              marginTop:10,
              border:'1px solid #27568a'
            }}
          >
            <div
              className="col-lg-6 col-md-8 col-sm-4"
              style={{
                display: "flex",
                flexDirection:'column',
                flexWrap: "wrap",
                justifyContent: "center",
                padding: "0px 0px 0px 3px",
              }}
            >
              <i
                className="fa fa-user margin-y"
                aria-hidden="true"
                style={{ fontSize: 26,color:'#d72323' }}
              ></i>
              
            </div>
            <div
              className=" col-lg-6 col-md-8 col-sm-8"
              style={{
                display: "flex",
               
                flexWrap: "wrap",
                justifyContent: "end",
                marginLeft: 6,
                padding: 0,
              }}
            >
              <div className="text-right" style={{ width: "100%",fontWeight:'bold' }}>
                Absence
              </div>
              <div className="text-right" style={{ width: "100%",fontWeight:'bold' }}>
               {this.state.empDetails.absent_count}
              </div>
            </div>
          </div>

          
        </div>
      </div>
    );
  }
}

export default EmployeePieChart;
