import React, { Component } from "react";
import { main_url } from "../../../utils/CommonFunction";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import Select from "react-select";
import DatePicker from "react-datetime";
import moment from "moment";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");
class PayrollSummaryReport extends Component {
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
      selected_Branch: null,
      selected_department: null,
      selected_designation: null,
      selected_region: null,
      designationList: null,
      branchlist: null,
      departmentlist: null,
      branchId: null,
      designationId: null,
      departmentId: null,
      regionId: null,
      EmployeeNameList: null,
      selected_employee: null,
      date: moment().format("YYYY-MM-DD"),
      dataSource: [],
      PayrollList: [],
    };
  }

  async componentDidMount() {
    this.$el = $(this.el);
    this.setState(
      {
        dataSource: this.props.data,
      },
      () => {}
    );
    this.getRegionList();
    this.getBranchList();
    this.handleSearchData();
    this.getpayRoll();
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

  handleSelectedBranch = async (event) => {
    if (event != null)
      this.setState({
        selected_Branch: event,
      });
  };

  handleSelectedRegion = async (event) => {
    if (event != null)
      this.setState({
        selected_region: event,
      });
  };
  handleSelectedDate = async (event) => {
    this.setState({
      date: event,
    });
  };
  getpayRoll = () => {
    fetch(main_url + "payroll/getPayroll")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let data = list.filter((v) => v.check == 1);
        this.setState({
          PayrollList: data,
        });
      });
  };

  handleSearchData = () => {
    // this.setState({
    const branchId = this.state.selected_Branch
      ? this.state.selected_Branch.value
      : 0;

    const regionId = this.state.selected_region
      ? this.state.selected_region.state_id
      : 0;
    const Date = moment(this.state.date).format("YYYY-MM-DD");

    // })

    fetch(main_url + "payroll_report/payrollReportSummary/2022-11/0/0")
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          dataSource: list,
        });
      });
  };
  render() {
    return (
      <div style={{overflowX:'auto'}}>
        <div className="row dashboard-header">
          
          <h3 className="" style={{ paddingLeft: "10px" }}>
            Employee Salary Report
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
            <DatePicker
              dateFormat="DD/MM/YYYY"
              value={this.state.date}
              onChange={this.handleSelectedDate}
              timeFormat={false}
            />
            <Select
              styles={{
                container: (base) => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginRight: 10,
                  marginLeft: 10,
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
              placeholder="Region"
              options={this.state.regionList}
              onChange={this.handleSelectedRegion}
              value={this.state.selected_region}
              className="react-select-container"
              classNamePrefix="react-select"
            />

            <button
              className="btn btn-primary text-center"
              style={{ marginLeft: 10, height: 30, padding: "0px 5px 0px 5px" }}
              onClick={() => this.handleSearchData()}
            >
              Search
            </button>
          </div>
          <table className="table table-bordered" style={{overflow:'scroll'}}>
            <thead>
              <tr style={{overflow:'scroll'}}>
                <th rowSpan={2}>No</th>
                <th rowSpan={2}>Region</th>
                <th rowSpan={2}>Branch Name</th>
                <th rowSpan={2}>Gross salary</th>
                <th rowSpan={2}>Deductions(+)/Additions(-)</th>
                <th rowSpan={2}>Salary after deductions/additions</th>
                <th colSpan={2}>SSC</th>
                <th rowSpan={2}>Income Tax</th>
                <th rowSpan={2}>Net Salary Paid</th>
                <th rowSpan={2}>Total Gross Salary</th>
                <th rowSpan={2}>Maintenance</th>
                <th rowSpan={2}>Petrol</th>
                <th rowSpan={2}>Backpay</th>
                <th rowSpan={2}>Income Tax Adjust</th>
                <th rowSpan={2}>Deduct for using office cycle</th>
                <th rowSpan={2}>Salary Cut(Tablet)</th>
                <th rowSpan={2}>Deduction of Loan</th>
                <th rowSpan={2}>Total</th>
              </tr>
              <tr>
                <th>Employer 3%</th>
                <th>Employee 2%</th>
              </tr>
            </thead>
            <tbody>
             
             
                      {
                        this.state.dataSource !=undefined && this.state.dataSource.length > 0 && this.state.dataSource.map((v,i)=>{
                          return(
                            <tr>
                              <td>{i+1}</td>
                              <td>{v.region}</td>
                              <td>{v.branch}</td>
                              <td>{v.detail_amount}</td>
                              <td>0</td>
                              <td>{v.detail_amount}</td>
                              <td>{v.detail_amount}</td>
                              <td>{v.detail_amount}</td>
                              <td>{v.deduction_labels && v.deduction_labels.length > 0 && v.deduction_labels[i] && v.deduction_labels[i].label=="Income Tax" ? v.deduction_labels[i].value : 0}</td>
                              <td>{v.detail_amount}</td>
                              <td>{v.detail_amount}</td>
                              <td>{v.allowance_labels && v.allowance_labels.length > 0 && v.allowance_labels[i] && v.allowance_labels[i].label=="Maintenance" ? v.allowance_labels[i].value : 0}</td>
                              <td>{v.allowance_labels && v.allowance_labels.length > 0 && v.allowance_labels[i] && v.allowance_labels[i].label=="Petrol" ? v.allowance_labels[i].value : 0}</td>
                              <td>{v.allowance_labels && v.allowance_labels.length > 0 && v.allowance_labels[i] && v.allowance_labels[i].label=="BackPay" ? v.allowance_labels[i].value : 0}</td>
                              <td>{v.deduction_labels && v.deduction_labels.length > 0 && v.deduction_labels[i] && v.deduction_labels[i].label=="Income Tax" ? v.deduction_labels[i].value : 0}</td>
                              <td>{v.deduction_labels && v.deduction_labels.length > 0 && v.deduction_labels[i] && v.deduction_labels[i].label=="Income Tax" ? v.deduction_labels[i].value : 0}</td>
                              <td>{v.deduction_labels && v.deduction_labels.length > 0 && v.deduction_labels[i] && v.deduction_labels[i].label=="Salary Cut" ? v.deduction_labels[i].value : 0}</td>
                              <td>{v.deduction_labels && v.deduction_labels.length > 0 && v.deduction_labels[i] && v.deduction_labels[i].label=="Deduction of Loan" ? v.deduction_labels[i].value : 0}</td>
                              <td>{v.detail_amount}</td>
                    
                            </tr>
                          )
                        })
                      }
                      
              <tr>
                <td colSpan={3}>Total (Permanent)</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
              </tr>
              <tr>
                <td colSpan={3}>PartTime</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
              </tr>
              <tr>
                <td colSpan={3}>Training</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
              </tr>
              <tr>
                <td colSpan={3}>All Total</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
                <td>131</td>
              </tr>
            </tbody>
          </table>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <table className="table table-bordered" style={{ width: "20%" }}>
              <thead>
                <tr>
                  <th></th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ATM</td>
                  <td></td>
                </tr>
                <tr>
                  <td>Cash</td>
                  <td>1312</td>
                </tr>
                <tr>
                  <td>Total</td>
                  <td>3516546</td>
                </tr>
              </tbody>
            </table>
          </div>
          </div>
        </div>
      
    );
  }
}
export default PayrollSummaryReport;
