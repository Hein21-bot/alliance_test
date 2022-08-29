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
      dep_regionId: 0,
      dep_branchId: 0,
      des_depId: 0,
      des_regionId: 0,
      des_branchId: 0,
      xAxisDept: [],
      countDataDept: [],
      branchData: [],
      xAxisDesign: [],
      countDataDesign: [],
      regionList: [],
      deptData: [],
      department_male: [],
      department_female: [],
      designation_male: [],
      designation_female: []

    };
  }

  componentDidMount() {
    if (this.props.title == "department") {
      this.getHeadCountbyDepartment(1, 3);
    } else {
      this.getHeadCountbyDesignation(3, 1, 3);
      this.getDesignation();
    }

    this.setChartOptionDepartment();
    this.getRegionList()
    this.getBranch()
    


  }

  getRegionList() {
    fetch(`${main_url}benefit/getRegionList`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        let lists = list.unshift({ state_id: 0, state_name: 'All' })
        this.setState({
          regionList: list.map(v => ({ ...v, label: v.state_name, value: v.state_id }))
        })
      })
  }


  getBranch = () => {

    fetch(main_url + `main/getBranch`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((res1) => {
        res1.unshift({ label: 'All', value: 0 })
        this.setState({ branchData: res1 });

      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  };

  getHeadCountbyDepartment = (branchId, regionId) => {

    fetch(main_url + `dashboard/headCountByDepartments/${branchId}/${regionId}`)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          var label = [];
          var count = [];
          var department_male = [];
          var department_female = [];
          res.map((v, i) => {
            label.push(v.deptname);
            count.push(v.count);
            department_male.push(v.department_male)
            department_female.push(v.department_female)
          });
          this.setState({ xAxisDept: label, countDataDept: count, department_male: department_male, department_female: department_female });
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
          colorByPoint: true,
          data: this.state.countDataDept,
          colors: ['#1f4545', '#3d86dy', '#193759', '#419191', '#9bcece', '#59c5c5', '#7ea8d9', '#344545', '#5c7c9f', '#59c5c5']
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
        res1.unshift({ label: "All", value: 0 })
        this.setState({ deptData: res1 });
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  };

  getHeadCountbyDesignation = (deptId, branchId, regionId) => {
    fetch(main_url + `dashboard/headCountByDesignation/${deptId}/${branchId}/${regionId}`)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          var label = [];
          var count = [];
          var designation_male = []
          var designation_female = []
          res.map((v, i) => {
            label.push(v.designations);
            count.push(v.count);
            designation_male.push(v.designation_male)
            designation_female.push(v.designation_female)
          });
          this.setState({ xAxisDesign: label, countDataDesign: count, designation_male: designation_male, designation_female: designation_female });
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
          colorByPoint: true,
          data: this.state.countDataDesign,
          colors: ['#1f4545', '#3d86dy', '#193759', '#419191', '#9bcece', '#59c5c5', '#7ea8d9', '#344545', '#5c7c9f', '#59c5c5']
        },
      ],
    };

    this.setState({ chartOptions });
  };

  onClickDeptSearch = () => {
    this.getHeadCountbyDepartment(this.state.dep_regionId.value == undefined ? this.state.dep_regionId : this.state.dep_regionId.value, this.state.dep_branchId.value == undefined ? this.state.dep_branchId : this.state.dep_branchId.value);
  }

  onClickDesignSearch = () => {
    this.getHeadCountbyDesignation(this.state.des_depId.value == undefined ? this.state.des_depId : this.state.des_depId.value,this.state.des_regionId.value == undefined ? this.state.des_regionId : this.state.des_regionId.value, this.state.des_branchId.value == undefined ? this.state.des_branchId : this.state.des_branchId.value);
  }


  // Designation handle change start
  handleSelectedDepartment = async (event) => {
    this.setState({
      des_depId: event
    })
  }

  handleSelectedRegionDesignation = async (event) => {
    this.setState({
      des_regionId: event
    })
  }

  handleSelectedBranchDesignation = async (event) => {
    this.setState({
      des_branchId: event
    })
  }

  // designation end

  // Department handle chagne start 
  handleSelectedBranch = async (event) => {
    this.setState({
      dep_branchId: event
    })
  }

  handleSelectedRegion = async (event) => {
    this.setState({
      dep_regionId: event
    })
  }
  // Dep end


  render() {
    return (
      <div>
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
                justifyContent: "start",
                alignItems: "end",
                margin: "10px 10px 0px 10px",
              }}
            >
              <div style={{
                textAlign: 'start'
              }}>
                <label htmlFor="">Region</label>
                <Select
                  styles={{
                    container: (base) => ({
                      ...base,
                      //   flex: 1

                      width: 150,

                    }),
                    control: (base) => ({
                      ...base,
                      minHeight: "18px",
                    }),
                  }}
                  options={this.state.regionList}
                  placeholder="All"
                  onChange={this.handleSelectedRegion.bind(this)}
                  value={this.state.dep_regionId}
                  className='react-select-container checkValidate'
                  classNamePrefix="react-select"
                />
              </div>
              <div style={{
                textAlign: 'start',
                marginLeft: 10
              }}>
                <label htmlFor="">Branch</label>
                <Select
                  styles={{
                    marginLeft: '10px',
                    container: (base) => ({
                      ...base,
                      //   flex: 1

                      width: 150,

                      // marginLeft: 10
                    }),
                    control: (base) => ({
                      ...base,
                      minHeight: "18px",

                    })
                  }}
                  placeholder="All"
                  options={this.state.branchData}
                  onChange={this.handleSelectedBranch}
                  value={this.state.dep_branchId}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />

              </div>
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
            <div style={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              marginRight: '10px',
              marginBottom: '10px'

            }}>
              <div style={{
                backgroundColor: '#1872ab',
                width: '90px',
                height: '50px',

                borderRadius: '5px'
              }}>
                <p style={{
                  marginBottom: 0, textAlign: 'center',
                  paddingTop: '5px', color: 'white'
                }}>Male-{this.state.department_male.map(v => v != undefined && v)}</p>
                <p style={{ marginBottom: 0, textAlign: 'center', color: 'white' }}>Female-{this.state.department_female.map(v => v != undefined && v)}</p>
              </div>
            </div>


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
                justifyContent: "start",
                alignItems: "end",
                margin: "10px 10px 0px 10px",
              }}
            >
              <div style={{
                textAlign: 'start'
              }}>
                <label htmlFor="">Department</label>
                <Select
                  styles={{
                    container: (base) => ({
                      ...base,
                      //   flex: 1

                      width: 150,

                      marginRight: 10
                    }),
                    control: (base) => ({
                      ...base,
                      minHeight: "18px",
                    }),
                  }}
                  placeholder="All"
                  options={this.state.deptData}
                  onChange={this.handleSelectedDepartment}
                  value={this.state.des_depId}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />

              </div>
              <div style={{
                textAlign: 'start'
              }}>
                <label htmlFor="">Region</label>
                <Select
                  styles={{
                    container: (base) => ({
                      ...base,
                      //   flex: 1

                      width: 150,

                      marginRight: 10
                    }),
                    control: (base) => ({
                      ...base,
                      minHeight: "18px",
                    }),
                  }}

                  options={this.state.regionList}
                  placeholder="All"
                  onChange={this.handleSelectedRegionDesignation.bind(this)}
                  value={this.state.des_regionId}
                  className='react-select-container checkValidate'
                  classNamePrefix="react-select"
                />
              </div>
              <div style={{
                textAlign: 'start'
              }}>
                <label htmlFor="">Branch</label>
                <Select
                  styles={{
                    container: (base) => ({
                      ...base,
                      //   flex: 1

                      width: 150,

                    }),
                    control: (base) => ({
                      ...base,
                      minHeight: "18px",
                    }),
                  }}
                  placeholder="All"
                  options={this.state.branchData}
                  onChange={this.handleSelectedBranchDesignation}
                  value={this.state.des_branchId}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
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
            <div style={{
              display: 'flex',
              justifyContent: 'end',
              alignItems: 'center',
              marginRight: '10px',
              marginBottom: '10px'

            }}>
              <div style={{
                backgroundColor: '#1872ab',
                width: '90px',
                height: '50px',

                borderRadius: '5px'
              }}>
                <p style={{
                  marginBottom: 0, textAlign: 'center',
                  paddingTop: '5px', color: 'white'
                }}>Male-{this.state.designation_male.map(v => v != undefined && v)}</p>
                <p style={{ marginBottom: 0, textAlign: 'center', color: 'white' }}>Female-{this.state.designation_female.map(v => v != undefined && v)}</p>
              </div>
            </div>
          </div>

        )}
      </div>
    );
  }
}


export default HeadCountBarChart;
