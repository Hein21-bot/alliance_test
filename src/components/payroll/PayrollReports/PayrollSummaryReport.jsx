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
import ReactHTMLTableToExcel from "react-html-table-to-excel";
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
      date: moment().format("YYYY-MM"),
      dataSource: [],
      PayrollList: [],
      ReportHeader: [],
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
    this.getPayrollReportHeader();
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
  getPayrollReportHeader() {
    // fetch(
    //   `${main_url}payroll_report/getPayrollReportHeader/` +
    //     moment(this.state.data).format("YYYY-MM")
    // )
    fetch(`${main_url}payroll_report/getPayrollReportHeader/`+moment(this.state.date).format('YYYY-MM'))
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          ReportHeader: list,
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
    const Date = moment(this.state.date).format("YYYY-MM");

    // })

    fetch(main_url + "payroll_report/payrollSummaryReport/"+Date+'/'+regionId+'/'+branchId)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        // let uniqueDeductiondata=new Set();
        // list.forEach(v=>{
        //   v.deduction.forEach(v1=>{
        //     uniqueDeductiondata.add(v1.salary_payment_deduction_label)
        //   })
        // })
        // console.log("unique data",uniqueDeductiondata)
        // let uniqueDeductionMap=new Map();
        // uniqueDeductiondata.forEach(v=>{
        //   uniqueDeductionMap.set({
        //     'salary_payment_deduction_label':v,
        //     'salary_payment_deduction_value':0
        //   })
        // })
        // console.log("unique map",)
        this.setState({
          dataSource: list,
        });
      });
  };
  render() {  console.log("value in deduction is =============>", this.state.dataSource)
                console.log("final data is =============>", this.state.finalDatasource)
    let filterData =
      this.state.ReportHeader &&
      this.state.ReportHeader.filter(
        (v) => v.label != "Income Tax" && v.label != "SSC"
      );
    let finalDatasource =
      this.state.dataSource != undefined && this.state.dataSource.length > 0
        ? this.state.dataSource
        : [];
    let filterIncomeTax = finalDatasource.map(
      (d) =>
        d.deduction.length > 0 &&
        d.deduction.filter(
          (v) => v.salary_payment_deduction_label == "Income Tax"
        )
    );
    // console.log(
    //   "incometax",
    //   filterIncomeTax.filter((d) => (d.length > 0 ? d[0] : 0))
    // );
    let NextFilterIncomeTax = filterIncomeTax.filter((d) =>
      d.length > 0 ? d[0] : 0
    );
    let FilterDeduction = finalDatasource.filter((v) => v.deduction.length > 0);
    let FilterAddition=finalDatasource.filter((v)=>v.addition.length > 0);
    let Deduction = [];
    let Addition=[]
    FilterDeduction.map((v) => {
      filterData.map((header) => {
        if (
          v.deduction.filter(
            (d) => d.salary_payment_deduction_label == header.label
          ).length > 0
        ) {
          Deduction.push(
            v.deduction.filter(
              (d) => d.salary_payment_deduction_label == header.label
            )[0]
          );
        }
        // Deduction.push(v.deduction.filter(d=>d.salary_payment_deduction_label == header.label).length > 0 && v.deduction.filter(d=>d.salary_payment_deduction_label == header.label)[0])
      });
    });
    FilterAddition.map((v) => {
      filterData.map((header) => {
        if (
          v.addition.filter(
            (d) => d.salary_payment_allowance_label == header.label
          ).length > 0
        ) {
          Addition.push(
            v.addition.filter(
              (d) => d.salary_payment_allowance_label == header.label
            )[0]
          );
        }
        // Deduction.push(v.deduction.filter(d=>d.salary_payment_deduction_label == header.label).length > 0 && v.deduction.filter(d=>d.salary_payment_deduction_label == header.label)[0])
      });
    });
    console.log("filter addition",Addition)
    let totalDeductionData = Deduction.reduce((r, c) => {
      let R = [...r];
      const index = R.findIndex(
        (v) =>
          v.salary_payment_deduction_label == c.salary_payment_deduction_label
      );
      if (index == -1) {
        R.push({
          salary_payment_deduction_label: c.salary_payment_deduction_label,
          value: c.salary_payment_deduction_value,
        });
      } else {
        R[index].value += c.salary_payment_deduction_value;
      }
      return R;
    }, []);
    let totalAdditionData = Addition.reduce((r, c) => {
      let R = [...r];
      const index = R.findIndex(
        (v) =>
          v.salary_payment_allowance_label == c.salary_payment_allowance_label
      );
      if (index == -1) {
        R.push({
          salary_payment_allowance_label: c.salary_payment_allowance_label,
          value: c.salary_payment_allowance_value,
        });
      } else {
        R[index].value += c.salary_payment_allowance_value;
      }
      return R;
    }, []);
   
    // console.log("income tax total",NextFilterIncomeTax.length > 0 && NextFilterIncomeTax.reduce((p,c)=>{return p+c[0].salary_payment_deduction_value},0))
    return (
      <div style={{ overflowX: "auto" }}>
        <div className="row dashboard-header">
          <h3 className="" style={{ paddingLeft: "10px" }}>
            Employee Salary Report
          </h3>
          <ReactHTMLTableToExcel 
                    className="btn-excel"
                    table="ho_staff"
                    filename="HO Staff Report"
                    buttonText="Excel"
                    sheet="Sheet"
                    />
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
              dateFormat="YYYY-MM"
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
          <table
            className="table table-bordered"
            style={{ overflow: "scroll" }}
          >
            <thead>
              <tr style={{ overflow: "scroll" }}>
                <th rowSpan={2}>No</th>
                <th rowSpan={2}>Region</th>
                <th rowSpan={2}>Branch Name</th>
                <th rowSpan={2}>Gross salary</th>
                <th rowSpan={2}>Deductions(+)/Additions(-)</th>
                <th rowSpan={2}>Salary after deductions/additions</th>
                <th colSpan={2}>SSC</th>
                {this.state.ReportHeader &&
                this.state.ReportHeader.filter(
                  (v) => v.label == "Income Tax"
                ) ? (
                  <th rowSpan={2}>Income Tax</th>
                ) : (
                  ""
                )}
                <th rowSpan={2}>Net Salary Paid</th>
                <th rowSpan={2}>Total Gross Salary</th>
                {
                  totalDeductionData.length > 0 && totalDeductionData.map(v=>{
                    return(
                      <td rowSpan={2}>{v.salary_payment_deduction_label}</td>
                    )
                  })
                }
                {
                  totalAdditionData.length > 0 && totalAdditionData.map(v=>{
                    return(
                      <td rowSpan={2}>{v.salary_payment_allowance_label}</td>
                    )
                  })
                }

                {/* {filterData &&
                  filterData.map((v) => {
                    return <th rowSpan={2}>{v.label}</th>;
                  })} */}
                <th rowSpan={2}>Total</th>
              </tr>
              <tr>
                <th>Employer 3%</th>
                <th>Employee 2%</th>
              </tr>
            </thead>
            <tbody>
              {finalDatasource.length > 0 &&
                finalDatasource.map((v, i) => {
                  return (
                    <tr>
                      <td style={{textAlign:'center'}}>{i + 1}</td>
                      <td style={{textAlign:'center'}}>{v.state_name}</td>
                      <td style={{textAlign:'center'}}>{v.location_master_name}</td>
                      <td style={{textAlign:'center'}}>{v.gross_salary}</td>
                      <td style={{textAlign:'center'}}>{v.deduction_addition_data}</td>
                      <td style={{textAlign:'center'}}>{v.after_deduction_or_addition}</td>
                      <td style={{textAlign:'center'}}>
                        {v.ssc.length > 0 && v.ssc[0] && v.ssc[0].Employee_3}
                      </td>
                      <td style={{textAlign:'center'}}>
                        {v.ssc.length > 0 && v.ssc[0] && v.ssc[0].Employer_2}
                      </td>
                      {v.deduction.length > 0 ? (
                        v.deduction.filter(
                          (v1) =>
                            v1.salary_payment_deduction_label == "Income Tax"
                        ).length > 0 ? (
                          <td style={{textAlign:'center'}}>
                            {
                              v.deduction.filter(
                                (v1) =>
                                  v1.salary_payment_deduction_label ==
                                  "Income Tax"
                              )[0].salary_payment_deduction_value
                            }
                          </td>
                        ) : (
                          <td style={{textAlign:'center'}}>0</td>
                        )
                      ) : (
                        <td style={{textAlign:'center'}}>0</td>
                      )}
                      <td style={{textAlign:'center'}}>{v.net_salary}</td>
                      <td style={{textAlign:'center'}}>{v.total_gross_salary}</td>
                      {totalDeductionData.map((a, i) => {
                        return (
                          <td style={{textAlign:'center'}}>
                            {v.deduction.length > 0 &&
                            v.deduction.filter(
                              (d) => d.salary_payment_deduction_label == a.salary_payment_deduction_label
                            ).length > 0
                              ? v.deduction.filter(
                                  (d) =>
                                    d.salary_payment_deduction_label == a.salary_payment_deduction_label
                                )[0].salary_payment_deduction_value
                              : 0}
                          </td>
                        );
                      })}
                      {/* {totalAdditionData.map((a, i) => {
                        return (
                          <>
                            {v.addition.length > 0 &&
                            v.addition.filter(
                              (d) => d.salary_payment_allowance_label == a.salary_payment_allowance_label
                            ).length > 0 ? (
                              <td style={{textAlign:'center'}}>
                                {
                                  v.addition.filter(
                                    (d) =>
                                      d.salary_payment_allowance_label == a.salary_payment_allowance_label
                                  )[0].salary_payment_allowance_value
                                }
                              </td>
                            ) : (
                              ""
                            )}
                          </>
                        );
                      })} */}
                      {totalAdditionData.map((a, i) => {
                        return (
                          <td style={{textAlign:'center'}}>
                            {v.addition.length > 0 &&
                            v.addition.filter(
                              (d) => d.salary_payment_allowance_label == a.salary_payment_allowance_label
                            ).length > 0
                              ? v.addition.filter(
                                  (d) =>
                                    d.salary_payment_allowance_label == a.salary_payment_allowance_label
                                )[0].salary_payment_allowance_value
                              : 0}
                          </td>
                        );
                      })}
                      <td style={{textAlign:'center'}}>{v.total}</td>
                    </tr>
                  );
                })}

              {/* <tr>
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
              </tr> */}
              <tr>
                <td colSpan={3} style={{textAlign:'center'}}>All Total</td>
                <td style={{textAlign:'center'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.gross_salary;
                  }, 0)}
                </td>
                <td style={{textAlign:'center'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.deduction_addition_data;
                  }, 0)}
                </td>
                <td style={{textAlign:'center'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.after_deduction_or_addition;
                  }, 0)}
                </td>
                <td style={{textAlign:'center'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.ssc[0].Employee_3;
                  }, 0)}
                </td>
                <td style={{textAlign:'center'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.ssc[0].Employer_2;
                  }, 0)}
                </td>
                <td style={{textAlign:'center'}}>
                  {NextFilterIncomeTax.reduce((p, c) => {
                    return p + c[0].salary_payment_deduction_value;
                  }, 0)}
                </td>
                <td style={{textAlign:'center'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.net_salary;
                  }, 0)}
                </td>
                <td style={{textAlign:'center'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.total_gross_salary;
                  }, 0)}
                </td>
                {
                  totalDeductionData.map(v=>{
                    return (
                      <td style={{textAlign:'center'}}>{v.value}</td>
                    )
                  })
                }
                {
                  totalAdditionData.map(v=>{
                    return (
                      <td style={{textAlign:'center'}}>{v.value}</td>
                    )
                  })
                }
                <td style={{textAlign:'center'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.total;
                  }, 0)}
                </td>
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
