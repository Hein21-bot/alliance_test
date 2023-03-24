import React, { Component } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import {
  getBranch,
  getRegion,
  getDepartment,
  main_url,
  getFirstDayOfCurrentWeek
} from "../../utils/CommonFunction";
import DatePicker from "react-datetime";
import moment from "moment";
import Select from "react-select";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");

class WeeklyAttendanceReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      branch: [],
      region: [],
      department: [],
      branchId: null,
      regionId: null,
      departmentId: null,
      from_date:moment(getFirstDayOfCurrentWeek()),
      to_date: moment(),
      EmployeeIDList: [],
      HolidayList: [],
      selectedEmployeeId: "",
      selectedEmployeeID: null,
      selectedEmployeeName: null,
      dataSource: [],
      dateList: null,
    };
  }

  async componentDidMount() {
    this.$el = $(this.el);
    let branch = await getBranch();
    branch.unshift({ label: "All", value: 0 });
    let department = await getDepartment();
    department.unshift({ label: "All", value: 0 });
    let region = await getRegion();
    region.unshift({ state_name: "ALL", state_id: 0 });
    this.setState({
      branch: branch,
      department: department,
      region: region.map((v) => ({
        ...v,
        label: v.state_name,
        value: v.state_id,
      })),
    });
    this.getHolidayList();
    this.getEmployeeList();
    this.handleSearchData();
  }
  getHolidayList() {
    fetch(`${main_url}holidaySetup/getAllholiday`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({
          HolidayList: data
        });
      });
  }
  getEmployeeList() {
    fetch(`${main_url}main/getEmployeeWithDesignation/0`)
      .then((res) => res.json())
      .then((data) => {
        // const all = data.map(v => (v.employment_id).trim())
        this.setState({
          EmployeeIDList: data.map((v) => ({
            ...v,
            label: v.employment_id,
            value: v.value,
            name: v.label,
          })),
          // allEmployeeID: all
        });
      });
  }
  handleSelectedBranch = async (event) => {
    this.setState({
      branchId: event,
    });
  };

  handleSelectedDepartment = async (event) => {
    this.setState({
      departmentId: event,
    });
  };
  handleSelectedRegion = async (event) => {
    this.setState({
      regionId: event,
    });
  };
  handleSelectedFromdate = async (event) => {
    this.setState({
      from_date: event,
    });
  };
  handleSelectedTodate = async (event) => {
    this.setState({
      to_date: event,
    });
  };
  handleSelectedEmployeeID = async (event) => {
    this.setState({
      selectedEmployeeID: event,
      selectedEmployeeName: event.name,
      selectedEmployeeId: event.value,
    });
  };
  getDaysBetweenDates = (startDate, endDate) => {
    var now = startDate.clone(),
      dates = [];

    while (now.isSameOrBefore(endDate)) {
      dates.push(now.format("MM/DD/YYYY"));
      now.add(1, "days");
    }
    return dates;
  };
  handleSearchData = () => {
    console.log(this.state.from_date, this.state.to_date);
    let dateList_one = this.getDaysBetweenDates(
     this.state.from_date,
      this.state.to_date
    );
    this.setState({
      dateList: dateList_one,
    });
    fetch(
      `${main_url}attendance/weekelyAttendance/${moment(
        this.state.from_date
      ).format("YYYY-MM-DD")}/${moment(this.state.to_date).format(
        "YYYY-MM-DD"
      )}/${this.state.branchId ? this.state.branchId.value : 0}/${
        this.state.departmentId ? this.state.departmentId.value : 0
      }/${this.state.regionId ? this.state.regionId.value : 0}/${
        this.state.selectedEmployeeId ? this.state.selectedEmployeeId : 0
      }`
    )
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        if(list!=undefined && list.length > 0){
          const data_source = list.reduce((r,c)=> {
            const R=[...r];
            for(let i=0; i<=dateList_one.length; i++){
              const index = R.findIndex(v=> v.name === c.name);
              const isExistIndex = c.array.findIndex(v=> moment(v.start_time).format("MM/DD/YYYY") === dateList_one[i]);
              if(isExistIndex > -1){
                if(index > -1){
                  R[index][dateList_one[i]+'_in'] = moment(c.array[isExistIndex].start_time).format("hh:mm:ss A")
                  R[index][dateList_one[i]+'_out'] = moment(c.array[isExistIndex].end_time).format("hh:mm:ss A")
                }else{
                  R.push({
                    name: c.name,
                    position: c.position,
                    branch: c.branch,
                    total_working_hours: c.total_hours,
                    [dateList_one[i]+'_in']:  moment(c.array[isExistIndex].start_time).format("hh:mm:ss A"),
                    [dateList_one[i]+'_out']: moment(c.array[isExistIndex].end_time).format("hh:mm:ss A"),
                  })
                }
              }
            }
            return R
          }, [])
          this.setState({
            dataSource: data_source
          })
        }
       
      });
  };
  render() { console.log(this.state.dataSource);
   
    return (
      <div>
        <div className="row  white-bg dashboard-header">
          <h3 className="" style={{ paddingLeft: "10px" }}>
            Weekly Attendance Report
          </h3>
          <div
            className="flex-row"
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
              margin: "10px 10px 10px 10px",
            }}
          >
            <div style={{ marginRight: 10, width: 150 }}>
              <DatePicker
                dateFormat="DD/MM/YYYY"
                value={this.state.from_date}
                onChange={this.handleSelectedFromdate}
                timeFormat={false}
              />
            </div>
            <div style={{ marginRight: 10, width: 150 }}>
              <DatePicker
                dateFormat="DD/MM/YYYY"
                value={this.state.to_date}
                onChange={this.handleSelectedTodate}
                timeFormat={false}
              />
            </div>
            <Select
              styles={{
                container: (base) => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginRight: 10,
                }),
                control: (base) => ({
                  ...base,
                  minHeight: "18px",
                }),
              }}
              placeholder="Branch"
              options={this.state.branch}
              onChange={this.handleSelectedBranch}
              value={this.state.branchId}
              className="react-select-container"
              classNamePrefix="react-select"
            />
            <Select
              styles={{
                container: (base) => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginRight: 10,
                }),
                control: (base) => ({
                  ...base,
                  minHeight: "18px",
                }),
              }}
              placeholder="Region"
              options={this.state.region}
              onChange={this.handleSelectedRegion}
              value={this.state.regionId}
              className="react-select-container"
              classNamePrefix="react-select"
            />

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
              placeholder="Department"
              options={this.state.department}
              onChange={this.handleSelectedDepartment}
              value={this.state.departmentId}
              className="react-select-container"
              classNamePrefix="react-select"
            />

            <Select
              styles={{
                container: (base) => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginLeft: 10,
                }),
                control: (base) => ({
                  ...base,
                  minHeight: "18px",
                }),
              }}
              placeholder="Employee ID"
              options={this.state.EmployeeIDList}
              onChange={this.handleSelectedEmployeeID}
              value={this.state.selectedEmployeeID}
              className="react-select-container"
              classNamePrefix="react-select"
            />
            <div style={{ marginLeft: 10, width: 110 }}>
              <input
                type="value"
                placeholder="Employee Name"
                className="form-control"
                value={this.state.selectedEmployeeName}
              />
            </div>
            <button
              className="btn btn-primary text-center"
              style={{ marginLeft: 10, height: 30, padding: "0px 5px 0px 5px" }}
              onClick={() => this.handleSearchData()}
            >
              Search
            </button>
          </div>

          {/* <table
            width="99%"
            className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
            id="dataTables-table"
          /> */}
        <div>
        <div className="col-lg-12" style={{paddingTop:30,paddingLeft:0}}>
                        <ReactHTMLTableToExcel 
                         className="btn-excel"
                         table="weekly_table"
                         filename={"Weekly Attendance Report "}
                         buttonText="Excel"
                         sheet="Sheet"
                        
                         />
                        </div>
          <table
            className="table table-bordered"
            id='weekly_table'
            style={{ overflow: "Scroll",display:'block',whiteSpace:'nowrap'}}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  overflow: "scroll",
                }}
              >
                <th style={{ textAlign: "center", width: 100,verticalAlign:'middle' }} rowSpan={2}>
                 Employee Name
                </th>
                <th style={{ textAlign: "center", width: 100,verticalAlign:'middle' }} rowSpan={2}>
                 Position
                </th>
                <th style={{ textAlign: "center", width: 100,verticalAlign:'middle' }} rowSpan={2}>
                 Branch
                </th>
                {this.state.dateList
                  ? this.state.dateList.map((v, i) => {
                      return (
                        <th
                          key={i}
                          style={{ textAlign: "center", width: 100,verticalAlign:'middle' }}
                          colSpan={2}
                        >
                         {moment(v).format("DD-MM-YYYY")}
                        </th>
                      );
                    })
                  : null}
               <th style={{ textAlign: "center", width: 100,verticalAlign:'middle' }} rowSpan={2}>
                 Total Working Hour
                </th>
              </tr>
              <tr style={{ backgroundColor: "white", color: "color" }}>
              {this.state.dateList
                  ? this.state.dateList.map((v, i) => {
                      return (
                       <>
                       <th style={{ textAlign: "center",verticalAlign:'middle', width: 100 }}>IN</th>
                <th style={{ textAlign: "center",verticalAlign:'middle', width: 100 }}>OUT</th>
                </>
                      );
                    })
                  : null}
              </tr>
            </thead>
            { this.state.dataSource.length > 0 ?(
            <tbody style={{ textAlign: "center" }}>
             
              {this.state.dataSource.map((v, i) => {
                return (
                  <>
                    <tr>
                      <td style={{ borderColor: "white",verticalAlign:'middle' }}>{v.name}</td>
                      <td style={{ borderColor: "white",verticalAlign:'middle' }}>{v.position}</td>
                      <td style={{ borderColor: "white" ,verticalAlign:'middle'}}>{v.branch}</td>
                      {this.state.dateList
                  ? this.state.dateList.map((v1, i1) => {
                    let date = new Date(v1)
                    let check_date = date.getDay()
                    let holiday = 0
                    if(check_date == 6 || check_date == 0){
                      holiday = 1
                    }
                    let holiday_date = this.state.HolidayList.filter(data => moment(data.date).format("YYYY-MM-DD") === moment(v1).format("YYYY-MM-DD"))
                    if(holiday_date.length>0){
                      holiday = 1
                    }
                      return (
                       <>
                       <td style={{ borderColor: "white",verticalAlign:'middle', background: holiday ? 'gainsboro': 'white' }}>{v[v1+'_in'] || '-'}</td>
                       <td style={{ borderColor: "white",verticalAlign:'middle',  background: holiday ? 'gainsboro': 'white' }}>{v[v1+'_out'] || '-'}</td>
                </>
                      );
                    })
                  : null}

                      <td style={{ borderColor: "white",verticalAlign:'middle' }}>{v.total_working_hours}</td>
                    </tr>
                  </>
                );
              })}
            </tbody>):( <tbody style={{ textAlign: "center" }}>
              <tr>
                <td
                  colSpan={20}
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                    height: 35,
                    fontSize: 15,
                    borderBottom: "1px solid black",
                  }}
                >
                  No data available in table
                </td>
              </tr>
            </tbody>)}
          </table>
        </div>
      </div>
      </div>

    );
  }
}
export default WeeklyAttendanceReport;
