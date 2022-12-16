import React, { Component } from "react";
import { main_url } from "../../../utils/CommonFunction";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import Select from "react-select";
import moment from "moment";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");
class EmployeeSalaryReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regionList: null,
      empName: 0,
      martial_status: null,
      contact_person: null,
      contact_phone: null,
      guarantee_contact_person: null,
      guarantee_contact_phone: null,
      phone_no: null,
      employee_id: null,
      employee_date: moment().format("YYYY-MM-DD"),
      selected_Branch: { label: "All", value: 0 },
      selected_department: { label: "All", value: 0 },
      selected_region: { label: "All", value: 0 },
      designationList: null,
      branchlist: null,
      departmentlist: null,
      branchId: null,
      designationId: null,
      departmentId: null,
      regionId: null,
      EmployeeNameList: null,
      selected_employee: { label: "All", value: 0 },
    };
  }

  async componentDidMount() {
    this.$el = $(this.el);
    this.getRegionList();
    this.getDepartmentList();
    this.getBranchList();
    // this.getDesignationList();
    this.getEmployeeName();
    // this.handleSearchData();
    this.getEmployeeSalaryReport();
  }

  //salary_report/empSalaryReport/region/branch/department/userid
  getEmployeeSalaryReport() {
    const {
      selected_Branch,
      selected_department,
      selected_region,
      selected_employee,
    } = this.state;
    let regionId = selected_region == null ? 0 : selected_region.value;
    let branchId = selected_Branch == null ? 0 : selected_Branch.value;
    let departmentId =
      selected_department == null ? 0 : selected_department.value;
    let employeeId = selected_employee == null ? 0 : selected_employee.value;
    // console.log('search ====>', regionId, branchId, departmentId, employeeId);
    fetch(
      main_url +
        `salary_report/empSalaryReport/${regionId}/${branchId}/${departmentId}/${employeeId}`
    )
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((res) => {
        this.setState(
          {
            dataSource: res,
          },
          () => {
            this._setTableData(this.state.dataSource);
          }
        );
      });
  }

  getDesignationList() {
    fetch(`${main_url}main/getDesignations`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ label: "All", value: 0 });
        this.setState({
          designationList: lists,
        });
      });
  }
  getBranchList() {
    fetch(`${main_url}benefit/getBranchList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        list.unshift({ label: "All", value: 0 });
        this.setState({
          branchlist: list,
        });
      });
  }

  getDepartmentList() {
    fetch(`${main_url}benefit/getDepartmentList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        var array = [];
        list.map((v) => {
          var obj = {};
          obj["label"] = v.deptname;
          obj["value"] = v.departments_id;
          array.push(obj);
        });
        array.unshift({ label: "All", value: 0 });
        this.setState({
          departmentlist: array,
        });
      });
  }

  getRegionList() {
    fetch(`${main_url}benefit/getRegionList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        var array = [];
        list.map((v) => {
          var obj = {};
          obj["label"] = v.state_name;
          obj["value"] = v.state_id;
          array.push(obj);
        });
        array.unshift({ label: "All", value: 0 });
        this.setState({
          regionList: array,
        });
      });
  }
  getEmployeeName() {
    fetch(`${main_url}report/employeeName`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        list.unshift({ label: "All", value: 0 });
        this.setState({
          EmployeeNameList: list,
        });
      });
  }
  handleSelectedBranch = async (event) => {
    if (event != null)
      this.setState({
        selected_Branch: event,
      });
  };
  handleSelectedDesignation = async (event) => {
    if (event != null)
      this.setState({
        selected_designation: event,
      });
  };
  handleSelectedDepartment = async (event) => {
    if (event != null)
      this.setState({
        selected_department: event,
      });
  };
  handleSelectedRegion = async (event) => {
    if (event != null)
      this.setState({
        selected_region: event,
      });
  };
  handleSelectedEmpName = async (event) => {
    if (event != null)
      this.setState({
        selected_employee: event,
      });
  };

  _setTableData = (data) => {
    var table;
    var l = [];
    if (data) {
      for (var i = 0; i < data.length; i++) {
        let result = data[i];
        let obj = [];
        var haha = {
          basic_salary: 175000,
          career_sub_level: "Level 1 B",
          deptname: "Admin",
          designations: "Sr Manager",
          effective_month: 644,
          employment_id: "A-00001",
          fullname: "Khin Thet Moe",
          last_promotion_date: null,
          location_master_name: "Head Office",
          state_name: "Mandalay Region",
          user_id: 2,
        };
        obj = {
          no: i + 1,
          employee_id: data[i].employment_id ? data[i].employment_id : "-",
          employee_name: data[i].fullname ? data[i].fullname : "-",
          branch: data[i].location_master_name ? data[i].location_master_name : "-",
          designation: data[i].designations ? data[i].designations : "-",
          level: data[i].career_sub_level ? data[i].career_sub_level : "-",
          department: data[i].deptname ? data[i].deptname : "-",
          region: data[i].state_name ? data[i].state_name : "-",
          current_effective_date: data[i].effective_month
            ? data[i].effective_month
            : "-",
          current_effective_month: data[i].effective_month
            ? data[i].effective_month
            : "-",
          current_salary: data[i].basic_salary ? data[i].basic_salary : "-",
        };
        l.push(obj);
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
      { title: "Employee Id", data: "employee_id" },
      { title: "Name", data: "employee_name" },
      { title: "Position", data: "designation" },
      { title: "Level", data: "level" },
      { title: "Department", data: "department" },
      { title: "Branch", data: "branch" },
      { title: "Region", data: "region" },
      {
        title: "Current Position Effective Date",
        data: "current_effective_date",
      },
      {
        title: "Current Position Effective Month",
        data: "current_effective_month",
      },
      { title: "Current Salary", data: "current_salary" },
    ];
    table = $("#dataTables-table").DataTable({
      autofill: true,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      pageLength: 50,
      paging: true,
      buttons: true,
      dom: "Bfrtip",
      // buttons: ["excel"],
      buttons: [
        {
          extend: "excelHtml5",
          title: "Employee Salary Report",
        },
      ],
      data: l,
      columns: column,
    });
  };

  render() {
    return (
      <div>
        <div className="row  white-bg dashboard-header">
          <h3 className="">
            Employee Salary Report
          </h3>
          <div
            className="flex-row"
            style={{
              display: "flex",
              justifyContent: "left",
              alignItems: "center",
              marginBottom:10,padding:0,marginLeft:0
            }}
          >
            <div className="col-md-2" style={{paddingLeft:0}}>
              <label htmlFor="">Branch</label>
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    //   flex: 1
                    // width: 150,
                    // marginRight:10
                  }),
                  control: (base) => ({
                    ...base,
                    minHeight: "18px",
                    
                  }),
                }}
                placeholder="Branch"
                options={this.state.branchlist}
                onChange={this.handleSelectedBranch}
                value={this.state.selected_Branch}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div className="col-md-2">
              <label htmlFor="">Region</label>
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    //   flex: 1
                    // width: 150,
                    // marginRight:10
                  }),
                  control: (base) => ({
                    ...base,
                    minHeight: "18px",
                  }),
                }}
                placeholder="Region"
                options={this.state.regionList}
                onChange={this.handleSelectedRegion}
                value={this.state.selected_region}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div className="col-md-2">
              <label htmlFor="">Department</label>
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    //   flex: 1
                    // width: 150,
                    // marginRight:10
                  }),
                  control: (base) => ({
                    ...base,
                    minHeight: "18px",
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

            {/* <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
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
            /> */}

            <div className="col-md-2">
              <label htmlFor="">Employee Name</label>
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    //   flex: 1
                    // width: 150
                  }),
                  control: (base) => ({
                    ...base,
                    minHeight: "18px",
                  }),
                }}
                placeholder="Employee Name"
                options={this.state.EmployeeNameList}
                onChange={this.handleSelectedEmpName}
                value={this.state.selected_employee}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div className="col-md-2 btn-leftend">
              <button
                className="btn btn-primary text-center"
                style={{
                  marginLeft: 10,
                  height: 30,
                  padding: "0px 5px 0px 5px",
                  marginTop: 20,
                }}
                onClick={() => this.getEmployeeSalaryReport()}
              >
                Search
              </button>
            </div>
          </div>

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
export default EmployeeSalaryReport;
