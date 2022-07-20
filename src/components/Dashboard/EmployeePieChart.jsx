import React, { Component } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { data } from "browserslist";

class EmployeePieChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartOptions: {},
      // piename:['user','admin','guest'],
      // piedata:[20,60,30],
      // pielength:3
    };
  }

  componentDidMount() {
    this.setChartOption();
  }
  
  

  setChartOption = () => {
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
        text: "",
      },
      plotOptions: {
        pie: {
          innerSize: 50,
          depth: 45,
          cursor: "pointer",
          showInLegend: true,
        },
        series: {
          dataLabels: {
            enabled: true,
            format: "{point.name}: {point.y:.1f}%",
          },
        },
      },

      tooltip: {
        headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
        pointFormat:
          '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
      },

      credits: {
        enabled: false,
      },

      series: [
        {
          data: [
            {
              name: "Male",
              y: 60.29,
              drilldown: "Male",
            },{
              name:"Female",
              y:10.29,
              drilldown:'Female'
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
          className="col-md-7 col-sm-7"
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
            <h4>Total Employees</h4>
            <h3>368</h3>
          </div>
          <HighchartsReact
            highcharts={Highcharts}
            options={this.state.chartOptions}
            containerProps={{ className: "w-100" }}
          />
        </div>
        <div
          className="col-md-5 col-sm-5"
          style={{ margin: "7px", display: "flex", flexWrap: "wrap" }}
        >
          <div
            className="row col-md-12"
            style={{
              boxShadow: "1px 1px 3px 1px #e6e6e6",
              display: "flex",
              alignItems: "center",
              borderRadius: 10,
              padding: "5px",
              fontSize: 12,
            }}
          >
            <div
              className="col-md-6"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                padding: "0px 0px 0px 3px",
              }}
            >
              <i
                className="fa fa-user margin-y"
                aria-hidden="true"
                style={{ fontSize: 18 }}
              ></i>
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
            <div
              className="col-md-6"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "end",
                marginLeft: 6,
                padding: 0,
              }}
            >
              <div className="text-right" style={{ width: "100%" }}>
                Attendance
              </div>
              <div className="text-right" style={{ width: "100%" }}>
                350
              </div>
            </div>
          </div>

          <div
            className="row col-md-12"
            style={{
              boxShadow: "1px 1px 3px 1px #e6e6e6",
              display: "flex",
              alignItems: "center",
              borderRadius: 10,
              padding: "5px",
              fontSize: 12,
              marginTop: 10,
            }}
          >
            <div
              className="col-md-6"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                padding: "0px 0px 0px 3px",
              }}
            >
              <i
                className="fa fa-user margin-y"
                aria-hidden="true"
                style={{ fontSize: 18 }}
              ></i>
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
            <div
              className="col-md-6"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "end",
                marginLeft: 6,
                padding: 0,
              }}
            >
              <div className="text-right" style={{ width: "100%" }}>
                Field Attendance
              </div>
              <div className="text-right" style={{ width: "100%" }}>
                350
              </div>
            </div>
          </div>

          <div
            className="row col-md-12"
            style={{
              boxShadow: "1px 1px 3px 1px #e6e6e6",
              display: "flex",
              alignItems: "center",
              borderRadius: 10,
              padding: "5px",
              fontSize: 12,
              marginTop: 10,
            }}
          >
            <div
              className="col-md-6"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                padding: "0px 0px 0px 3px",
              }}
            >
              <i
                className="fa fa-user margin-y"
                aria-hidden="true"
                style={{ fontSize: 18 }}
              ></i>
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
            <div
              className="col-md-6"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "end",
                marginLeft: 6,
                padding: 0,
              }}
            >
              <div className="text-right" style={{ width: "100%" }}>
                Leave
              </div>
              <div className="text-right" style={{ width: "100%" }}>
                20
              </div>
            </div>
          </div>

          <div
            className="row col-md-12"
            style={{
              boxShadow: "1px 1px 3px 1px #e6e6e6",
              display: "flex",
              alignItems: "center",
              borderRadius: 10,
              padding: "5px",
              fontSize: 12,
              marginTop: 10,
            }}
          >
            <div
              className="col-md-6"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                padding: "0px 0px 0px 3px",
              }}
            >
              <i
                className="fa fa-user margin-y"
                aria-hidden="true"
                style={{ fontSize: 18 }}
              ></i>
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
            <div
              className="col-md-6"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "end",
                marginLeft: 6,
                padding: 0,
              }}
            >
              <div className="text-right" style={{ width: "100%" }}>
                Absence
              </div>
              <div className="text-right" style={{ width: "100%" }}>
                5
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default EmployeePieChart;
