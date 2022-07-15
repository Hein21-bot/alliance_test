import React, { Component } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Select from "react-select";
import { main_url } from "../../utils/CommonFunction";

class HeadCountBarChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chartOptions: {},
      
      id: {
        branchId: {value: "1", label: 'Head Office'},
        deptId: {value: 1, label: ''},
      },
      xAxisDept: [],
      countDataDept: [],
      branchData: [],
      xAxisDesign: [],
      countDataDesign: [],
      
      deptData: [],
    };
  }

  componentDidMount() {
    if (this.props.title == "department") {
      this.getHeadCountbyDepartment();
      this.getBranch();
    } else {
      this.getHeadCountbyDesignation();
      this.getDesignation();
    }
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

  getHeadCountbyDepartment = () => {
    fetch(main_url + `dashboard/headCountByDepartments/${this.state.id.branchId.value}`)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          var label = [];
          var count = [];
          res.map((v, i) => {
            label.push(v.deptname);
            count.push(v.count);
          });
          this.setState({ xAxisDept: label, countDataDept: count });
        }
        this.setChartOptionDepartment();
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  };

  setChartOptionDepartment = () => {
    const chartOptions = {
      chart: {
        type: "bar",
        height: "300px",
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: this.state.xAxisDept,
        title: {
          text: null,
        },
      },
      yAxis: {
        title: {
          text: "Count",
        },
      },
      tooltip: {
        // valueSuffix: ' millions'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      legend: {
        layout: "vertical",
        align: "center",
        verticalAlign: "top",
      },
      boost: {
        useGPUTranslations: true,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "Head Count by Department",
          data: this.state.countDataDept,
        },
      ],
    };

    this.setState({ chartOptions });
  };

  getDesignation = () => {
    fetch(main_url + `main/getDepartment`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((res1) => {
        this.setState({ deptData: res1 });
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  };

  getHeadCountbyDesignation = () => {
    fetch(main_url + `dashboard/headCountByDesignation/${this.state.id.deptId.value}`)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        console.log("haha ==>", res.length);
        if (res) {
          var label = [];
          var count = [];
          res.map((v, i) => {
            label.push(v.designations);
           
            count.push(v.count);
          });
          this.setState({ xAxisDesign: label, countDataDesign: count });
        }
        this.setChartOptionDesignation();
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  };

  setChartOptionDesignation = () => {
    const chartOptions = {
      chart: {
        type: "bar",
        height: "300px",
      },
      title: {
        text: "",
      },
      xAxis: {
        categories: this.state.xAxisDesign,
        title: {
          text: null,
        },
      },
      yAxis: {
        title: {
          text: "Count",
        },
      },
      tooltip: {
        // valueSuffix: ' millions'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
          },
        },
      },
      legend: {
        layout: "vertical",
        align: "center",
        verticalAlign: "top",
      },
      boost: {
        useGPUTranslations: true,
      },
      credits: {
        enabled: false,
      },
      series: [
        {
          name: "Head Count by Designation",
          data: this.state.countDataDesign,
        },
      ],
    };

    this.setState({ chartOptions });
  };

  onClickDeptSearch = () => {
    this.getHeadCountbyDepartment();
  }

  onClickDesignSearch = () => {
    this.getHeadCountbyDesignation();
  }

  handleSelectedBranch = async (event) => {
    let data = this.state.id
    data.branchId = event
    this.setState({
        id: data
    })
}
handleSelectedDepartment = async (event) => {
  console.log('id ===>', event)
    let data = this.state.id
    data.deptId = event
    this.setState({
        id: data
    })
}

  render() {
    return (
      <div>
        {console.log('deptID ===>', this.state.deptId)}
        {this.props.title == "department" ? (
          <div
            className="text-center margin-y"
            style={{
              background: "#fff",
              color: "#222",
              boxShadow: "3px 3px 3px #e5e5e5",
              borderRadius: 6,
              padding: "2px 0px 2px 0px",
            }}
          >
            <h3 className="" style={{ padding: "10px 0px 0px 0px" }}>
              Head Count by Department
            </h3>
            <div
              className="flex-row"
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                margin: "10px 10px 0px 10px",
              }}
            >
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    //   flex: 1
                    width: 200,
                  }),
                  control: (base) => ({
                    ...base,
                    minHeight: "18px",
                  }),
                }}
                placeholder="Branch"
                options={this.state.branchData}
                onChange={this.handleSelectedBranch}
                value={this.state.id.branchId}
                className="react-select-container"
                classNamePrefix="react-select"
              />
              <button
                className="btn btn-primary text-center"
                style={{
                  marginLeft: 10,
                  height: 30,
                  padding: "0px 5px 0px 5px",
                }}
                onClick={() => this.onClickDeptSearch()}
              >
                Search
              </button>
            </div>
            <HighchartsReact
              highcharts={Highcharts}
              options={this.state.chartOptions}
              containerProps={{ className: "w-100" }}
            />
          </div>
        ) : (
          <div
            className="text-center margin-y"
            style={{
              background: "#fff",
              color: "#222",
              boxShadow: "3px 3px 3px #e5e5e5",
              borderRadius: 6,
              padding: "2px 0px 2px 0px",
            }}
          >
            <h3 className="" style={{ padding: "10px 0px 0px 0px" }}>
              Head Count by Designation
            </h3>
            <div
              className="flex-row"
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                margin: "10px 10px 0px 10px",
              }}
            >
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    //   flex: 1
                    width: 200,
                  }),
                  control: (base) => ({
                    ...base,
                    minHeight: "18px",
                  }),
                }}
                placeholder="Department"
                options={this.state.deptData}
                onChange={this.handleSelectedDepartment}
                value={this.state.id.deptId}
                className="react-select-container"
                classNamePrefix="react-select"
              />
              <button
                className="btn btn-primary text-center"
                style={{
                  marginLeft: 10,
                  height: 30,
                  padding: "0px 5px 0px 5px",
                }}
                onClick={() => this.onClickDesignSearch()}
              >
                Search
              </button>
            </div>
            <HighchartsReact
              highcharts={Highcharts}
              options={this.state.chartOptions}
              containerProps={{ className: "w-100" }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default HeadCountBarChart;
