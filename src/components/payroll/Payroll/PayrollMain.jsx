import React, { Component } from "react";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import moment from "moment";
import DatePicker from "react-datetime";
import PayrollUpload from "./PayrollUpload";
import PayrollCheck from "./PayrollCheck";
import { imgData } from "../../../utils/Global";
import * as jsPDF from "jspdf";
import { main_url } from "../../../utils/CommonFunction";
import PayrollCalculated from "./PayrollCalculated";
import { toast, ToastContainer } from "react-toastify";
import PayrollAtmCash from "./PayrollAtmCash";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");

$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");

export default class PayrollMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
      filterDate: new Date(),
      employeeData: [],
      componentIndex: 'main',
      pathname: window.location.pathname,
      payrollCheckData: [],
      payrollCalculatedData: [],
      loading: false,
      paySlipRemark:''
    };
  }

  async componentDidMount() {
    await this.getEmployeeInfo();
    // fetch(
    //   main_url +
    //     `payroll/getReviewDetailData/${moment(
    //       this.state.filterDate
    //     ).format("YYYY-MM")}`
    // )
    //   .then((response1) => {
    //     if (response1.ok) return response1.json();
    //   })
    //   .then((res1) => {
    //     if (res1) {
    //       this.setState({
    //         payrollCalculatedData: res1,
    //         loading: false,
    //       });
    //     }
    //   });
  }

  getEmployeeInfo = async () => {
    await fetch(main_url + `payroll/getEmpInfo`)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then(async (res) => {
        if (res) {
          this.setState(
            {
              employeeData: await res,
            },
            async () => {
              await this._setTableData(this.state.employeeData);
            }
          );
        }
      });
  };

  onFilterDateChange = (e) => {
    this.setState({
      filterDate: e,
    });
  };

  onNextClick = () => {
    this.setState({
      componentIndex: 'upload',
    });
  };

  handleReview = () => {
    this.setState({
      componentIndex: 'check',
      loading: true,
    });
    fetch(
      main_url +
        `payroll/reviewData/${moment(this.state.filterDate).format("YYYY-MM")}/0/0/0/0/0`
    )
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.setState({
            payrollCheckData: res,
            loading: false,
          });
        }
      });
  };

  handleCalculate = () => {
    this.setState({
      componentIndex: 'calculate',
      loading: true,
    });
    let status = 0;
    fetch(main_url + `payrollCalculate/calculate`)
      .then((response) => {
        status = response.status;
        return response.text();
      })
      .then((text) => {
        if (status == 200) {
          fetch(
            main_url +
              `payroll/getReviewDetailData/${moment(
                this.state.filterDate
              ).format("YYYY-MM")}/0/0/0/0`
          )
            .then((response1) => {
              if (response1.ok) return response1.json();
            })
            .then((res1) => {
              if (res1) {
                this.setState({
                  payrollCalculatedData: res1,
                  loading: false,
                });
              }
            });
        } else {
          toast.error(text, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      });
  };

  handleDelete = () => {
    this.setState({
      componentIndex: 'upload'
    })
  };
 
  handleConfirm = async() => {
    let status =0
    await fetch(`${main_url}payroll/addPayslipRemark/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: `data=${JSON.stringify(this.state.paySlipRemark)}`,
    })
      .then((res) => {
        status = res.status;
        return res.text();
      })
    this.setState({
      componentIndex: 'atmOrCash'
    })
   

  };
  onChangeText = (e) => {
    console.log("event",e.target.value)
    this.setState({
      paySlipRemark: e.target.value
    })
  }

  _setTableData = async (data) => {
    // console.log("getEmp ===>", data);
    var table;
    var j = [];
    // var has_action = permission.isView === 1 || permission.isEdit === 1 ? true : false;
    if (data) {
      for (var i = 0; i < data.length; i++) {
        let result = data[i];
        // let obj = {};
        let obj = {
          no: i + 1,
          employee_id: result.employment_id ? result.employment_id : "-",
          fullname: result.fullname ? result.fullname : "-",
          designations: result.designations ? result.designations : "-",
          career_sub_level: result.career_sub_level
            ? result.career_sub_level
            : "-",
          deptname: result.deptname ? result.deptname : "-",
          location_master_name: result.location_master_name
            ? result.location_master_name
            : "-",
          state_name: result.state_name ? result.state_name : "-",
          basic_salary: result.basic_salary ? result.basic_salary : "-",
        };
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
      { title: "Employee Id", data: "employee_id" },
      { title: "Employee Name", data: "fullname" },
      { title: "Designation", data: "designations" },
      { title: "Level", data: "career_sub_level" },
      { title: "Department", data: "deptname" },
      { title: "Branch", data: "location_master_name" },
      { title: "Region", data: "state_name" },
      { title: "Basic Salary", data: "basic_salary" },
    ];

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
    console.log("pay slip remark",this.state.paySlipRemark)
    const { filterDate, componentIndex} = this.state;
    return (
      <div>
        <ToastContainer position={toast.POSITION.TOP_RIGHT} />
        {componentIndex == 'main' ? (
          <div>
            <div className="row col-md-12">
              <div className="col-md-3">
                <label>Month</label>
                <DatePicker
                  dateFormat="MM/YYYY"
                  value={filterDate}
                  timeFormat={false}
                  onChange={this.onFilterDateChange.bind(this)}
                />
              </div>
              <div className="col-md-9 btn-rightend">
                <button
                  className="btn-primary btn"
                  onClick={this.onNextClick}
                  style={{ marginTop: 20 }}
                >
                  Next
                </button>
              </div>
            </div>
            <table
              width="99%"
              className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
              id="dataTables-table"
            />
          </div>
        ) : componentIndex == 'upload' ? (
          <PayrollUpload
            filterDate={filterDate}
            handleReview={this.handleReview}
          />
        ) : componentIndex == 'check' ? (
          this.state.loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h2>Loading...</h2>
            </div>
          ) : (
            <PayrollCheck
              dataSource={this.state.payrollCheckData}
              handleCalculate={this.handleCalculate}
            />
          )
        ) : componentIndex == 'calculate' ? (
          this.state.loading ? (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <h2>Loading...</h2>
            </div>
          ) : (
            <PayrollCalculated
              dataSource={this.state.payrollCalculatedData}
              filterDate={filterDate}
              handleDelete={this.handleDelete}
              handleConfirm={this.handleConfirm}
              paySlipRemark={this.state.paySlipRemark} onChangeText={this.onChangeText}
            />
          )
        ) : componentIndex == 'atmOrCash' ? (
          <PayrollAtmCash dataSource={this.state.payrollCalculatedData}
        
          />
        ) : null}
      </div>
    );
  }
}
