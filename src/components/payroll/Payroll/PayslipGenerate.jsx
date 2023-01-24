import React, { Component } from "react";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import moment from "moment";
import DatePicker from "react-datetime";
import Select from 'react-select';
import { imgData } from "../../../utils/Global";
import * as jsPDF from "jspdf";
import { main_url } from "../../../utils/CommonFunction";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");

$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");

export default class PayslipGenerate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    
      designationList:[],
      regionList:[],
      departmentlist:[],
      branchlist:[],
      EmployeeNameList:[],
      selected_Branch:null,
      selected_designation:null,
      selected_department: null,
      selected_region:null,
      selected_employee:null,
      employeeIdList:[],
      selected_employeeId:null,
      selected_payment:null,
      paymentList:[
        {label:'ATM',value:0},
        {label:'Cash',value:1}
      ]

    };
  }

  async componentDidMount() {
    await this.getBranchList();
    await this.getDepartmentList();
    await this.getDesignationList();
    // await this.getEmployeeName();
    await this.getPayrollHeader();
    await this.getRegionList();
    this.getEmployeeCode();
    this.setState(
      {
        dataSource: this.props.dataSource,
      },
      () => {
        this._setTableData(this.state.dataSource);
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.dataSource != this.props.dataSource) {
      this.setState(
        {
          dataSource: this.props.dataSource,
        },
        () => {
          this._setTableData(this.state.dataSource);
        }
      );
    }
  }
  getDesignationList() {
    fetch(`${main_url}main/getDesignations`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          designationList: list
        });
      });
  }
  getBranchList() {
    fetch(`${main_url}benefit/getBranchList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          branchlist: list.map((v) => ({
            ...v,
            
          })),
        });
      });
  }

  getDepartmentList() {
    fetch(`${main_url}benefit/getDepartmentList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ departments_id: 0, deptname: "All" });
        this.setState({
          departmentlist: list.map((v) => ({
            ...v,
            label: v.deptname,
            value: v.departments_id,
          })),
        });
      });
  }

  getRegionList() {
    fetch(`${main_url}benefit/getRegionList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ state_id: 0, state_name: "All" });
        this.setState({
          regionList: list.map((v) => ({
            ...v,
            label: v.state_name,
            value: v.state_id,
          })),
        });
      });
  }
  getEmployeeName() {
    fetch(`${main_url}report/employeeName`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ user_id: 0, employee_code: "All" });
        this.setState({
          EmployeeNameList: list.map((v) => ({
            ...v
          }))
        })
      })
  }
  handleSelectedBranch = async (event) => {
    if (event != null)
      this.setState({
        selected_Branch: event
      })
  };
  handleSelectedDesignation = async (event) => {
    if (event != null)
      this.setState({
        selected_designation: event
      })
  }
  handleSelectedDepartment = async (event) => {
    if (event != null)
      this.setState({
        selected_department: event
      })
  }
  handleSelectedRegion = async (event) => {
    if (event != null)
      this.setState({
        selected_region: event
      })
  };
  handleSelectedEmpId = async (event) => {

    this.setState(
      {
        selected_employeeId: event
      }
    )
    if (event != null)
    if (event) {
      fetch(`${main_url}employee/getDetailUser/${event.user_id}`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((data) => {
          if(data.length > 0){
           
            this.setState({
              fullname:data[0].employee_name
          })
          }else{
            
            this.setState({
              fullname:''
            })
          }
          // if (data.length > 0) {
          //   this.getData(this.props.id);
          //   this.setState({ tableEdit: true, tableView: false });


          // }
        });
    }
      
  }
  getEmployeeCode() {
    fetch(`${main_url}employee/getEmployeeCode`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ user_id: 0, employee_code: "All" });
        this.setState({
          employeeIdList: list.map((v) => ({
            ...v,
            label: v.employee_code,
            value: v.user_id,
          })),
        });
      });
  }

  getPayrollHeader = async () => {
    await fetch(`${main_url}payroll/getPayrollHeader`)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        var formatData = [];

        res.map((v) => {
          formatData.push(v.name);
        });

        if (res) {
          this.setState({ steps: formatData });
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  };
  handleSelectedpaymentType=(event)=>{
    this.setState({
      selected_payment:event
    })
  }
  handleSearchData=()=>{
    const branchId = this.state.selected_Branch ? this.state.selected_Branch.value : 0
    const departmentId = this.state.selected_department ? this.state.selected_department.departments_id : 0
    const designationId = this.state.selected_designation ? this.state.selected_designation.value : 0
    const regionId = this.state.selected_region ? this.state.selected_region.state_id : 0
    const employee = this.state.selected_employeeId ? this.state.selected_employeeId.value : 0

    // })

    fetch(main_url + "payroll/reviewData/"+moment(this.props.filterDate).format('YYYY-MM-DD')+"/" + regionId + "/" + departmentId + "/" + designationId + "/" + branchId + "/" + employee,
    {
      method: 'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(this.props.selectedBranchMainList),
    })
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this._setTableData(list);
      })
  }

  _setTableData = async (data) => {
    var table;
    var j = [];
    if (data) {
      for (var i = 0; i < data.length; i++) {
        let result = data[i];
        let obj = {};
        obj["no"] = i + 1;
        obj["employment_id"] = result.employee_id ? result.employee_id : "-";
        obj["fullname"] = result.name ? result.name : "-";
        obj["designation"] = result.designation ? result.designation : "-";
        obj["department"] = result.department ? result.department : "-";
        obj["branch"] = result.branch ? result.branch : "-";
        obj["region"] = result.region ? result.region : "-";
        obj["netSalary"] = result.detail_amount ? result.detail_amount.toLocaleString('en-US',{maximumFractionDigits:2}) : "-";
        this.state.steps.map((v, index) => {
          obj[v.replace(/\s/g, "").toLowerCase()] = result.labels.filter(
            (a) => a.label == v
          )[0]
            ? result.labels.filter((a) => a.label == v)[0].value.toLocaleString('en-US',{maximumFractionDigits:2})
            : "-";
        });
        j.push(obj);
      }
    }

    if ($.fn.dataTable.isDataTable("#dataTables-table")) {
      table = $("#dataTables-table").dataTable();
      table.fnClearTable();
      table.fnDestroy();
      $("#dataTables-table").empty();
    }

    var column = [
      { title: "No", data: "no" },
      { title: "Employee Id", data: "employment_id" },
      { title: "Employee Name", data: "fullname" },
      { title: "Designation", data: "designation" },
      { title: "Department", data: "department" },
      { title: "Branch", data: "branch" },
      { title: "Region", data: "region" },
    ];

    this.state.steps.map((v) => {
      var obj = {};
      obj["title"] = v;
      obj["data"] = v.replace(/\s/g, "").toLowerCase();
      column.push(obj);
    });

    column.push({ title: "Net Salary", data: "netSalary" });

    table = $("#dataTables-table").DataTable({
      autofill: true,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      paging: true,
      pageLength: 50,
      // buttons: true,
      dom: "Bfrtip",
      // buttons: [
      //     'copy', 'csv', 'excel', 'pdf'
      // ],
      buttons: [],
      data: j,
      columns: column,
    });
  };

  
  render() {

    return (
      <div>
        <div className="row col-md-12">
          <div className="col-md-10">
           <div className="row" style={{display:'flex',justifyContent:'center',alignItems:'end'}}>
            <div className="col-md-2">
              
            <label>Month</label>
                  <DatePicker
                    dateFormat="MM/YYYY"
                    value={this.props.filterDate ? this.props.filterDate : new Date()}
                    timeFormat={false}
                    onChange={this.props.onFilterDateChange.bind(this)}
                  />
            </div>
           <div className="col-md-2">
              <label htmlFor="">Designation</label>
              <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                 
                  marginRight:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Designation"
              options={this.state.designationList}
              onChange={this.handleSelectedDesignation}
              value={this.state.selected_designation}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            </div>
            <div className="col-md-2">
              <label htmlFor="">Branch</label>
              <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                 
                  marginRight:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Branch"
              options={this.state.branchlist}
              onChange={this.handleSelectedBranch}
              value={this.state.selected_Branch}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            </div>
            <div className="col-md-2">
              <label htmlFor="">Region</label>
              <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                 
                  marginRight:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Region"
              options={this.state.regionList}
              onChange={this.handleSelectedRegion}
              value={this.state.selected_region}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            </div>
            <div className="col-md-2">
              <label htmlFor="">Employee Name</label>
              <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                 
                  marginRight:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Employee ID"
              options={this.state.employeeIdList}
              onChange={this.handleSelectedEmpId}
              value={this.state.selected_employeeId}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            </div>
            <div className="col-md-2">
              <label htmlFor="">Employee Name</label>
              <input type="text" className="form-control" value={this.state.fullname} disabled />
            </div>
            
            <div className="col-md-2">
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>

              </div>
           </div>
          </div>
          <div className="col-md-2">
            
              <label>Pay Slip Remark</label>
              <input
                
                type="text"
                data-name="paySlipRemark"
                value={this.props.paySlipRemark}
                placeholder="Remark"
                className="form-control"
                onChange={this.props.onChangeText}
              />

          </div>
          
          <div className="col-md-10" style={{marginTop:5}}>
            <div className="row">
            <div className="col-md-2">
              <label htmlFor="">Departments</label>
              <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                 
                  marginRight:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Department"
              options={this.state.departmentlist}
              onChange={this.handleSelectedDepartment}
              value={this.state.selected_department}
              className="react-select-container"
              classNamePrefix="react-select"
            />
            </div>
           
            </div>
          </div>
          <div
            className="col-md-2 btn-rightend"
            style={{ marginBottom: "10px" }}
          >
            <button
              className="btn-primary btn"
              onClick={this.props.handleDelete}
              style={{ marginTop: 20 }}
            >
              Delete
            </button>
            <button
              className="btn-primary btn"
              onClick={this.props.handleConfirm}
              style={{ marginTop: 20,marginLeft:10 }}
            >
              Confirm
            </button>
          </div>
          
        </div>

        <div>
          <table
            width="99%"
            className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
            id="dataTables-table"
          />
        </div>
      </div>
    );
  }
}
