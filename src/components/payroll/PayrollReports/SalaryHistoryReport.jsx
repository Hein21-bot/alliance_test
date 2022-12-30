import React, { Component } from "react";
import { main_url, getUserId } from "../../../utils/CommonFunction";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import Select from "react-select";
import moment from "moment";
import DatePicker from "react-datetime";
class SalaryHistoryReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      start_date: null,
      end_date: new Date(),
      EmployeeNameList: [],
      selected_employee: null,
      salaryHistoryLabel: [],
      columnHeader: [],
      basicSalaryData: [],
      netSalaryData: [],
      employeeInfo: null,
    };
  }
  async componentDidMount() {
    var currentDate = new Date();
    var y = currentDate.getFullYear();
    var m = currentDate.getMonth();
    var previousMonth = new Date(y, m - 1, 1);
    this.setState({
      start_date: previousMonth,
    });
    await this.getEmployeeName();
    await this.getSalaryHistory();
    await this.getSalaryHistoryLabel();
  }
  async getEmployeeName() {
    await fetch(`${main_url}report/employeeName`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then(async (list) => {
        let userId = getUserId("user_info");
        var selected_employee = await list.filter((a) => a.value == userId);
        this.setState({
          EmployeeNameList: list,
          selected_employee,
        });
      });
  }
  handleSelectedEmpName = async (event) => {
    if (event != null)
      this.setState({
        selected_employee: event,
      });
  };
  handleSelectedStartDate = async (event) => {
    this.setState({
      start_date: event,
    });
  };
  handleSelectedEndDate = async (event) => {
    this.setState({
      end_date: event,
    });
  };
  handleSearchData = () => {
    const employee = this.state.selected_employee
      ? this.state.selected_employee.value
      : 0;
    const StartDate = moment(this.state.start_date).format("YYYY-MM-DD");
    const EndDate = moment(this.state.end_date).format("YYYY-MM-DD");
    // })

    fetch(
      main_url +
        "report/employeeReport/" +
        StartDate +
        "/" +
        EndDate +
        "/" +
        employee
    )
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          data: list,
        });
      });
  };

  getSalaryHistoryLabel = async () => {
    const { selected_employee, start_date, end_date } = this.state;
    let userId = getUserId("user_info");
    let selectedEmployeeId = selected_employee.value
      ? selected_employee.value
      : userId;
    fetch(
      `${main_url}salary_report/salaryHistoryLabel/${selectedEmployeeId}/${moment(
        start_date
      ).format("YYYY-MM")}/${moment(end_date).format("YYYY-MM")}`
    )
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((list) => {
        this.setState({
          salaryHistoryLabel: list,
        });
      });
  };

  getSalaryHistory = async () => {
    const { selected_employee, start_date, end_date } = this.state;
    let userId = getUserId("user_info");
    let selectedEmployeeId = selected_employee.value
      ? selected_employee.value
      : userId;
    fetch(
      `${main_url}salary_report/salaryHistory/${selectedEmployeeId}/${moment(
        start_date
      ).format("YYYY-MM")}/${moment(end_date).format("YYYY-MM")}`
    )
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((list) => {
        var columnArray = [];
        var dataRow = [];
        var basicSalary = [];
        var netSalary = [];
        list.map((v, i) => {
          var objRow = {};
          var objBasicSalary = {};
          var objNetSalary = {};
          var objColumn = {};

          objColumn["column"] = moment(v.payment_month).format("MMM-YY");

          objBasicSalary["basic_salary"] = v.basic_salary;
          objNetSalary["net_salary"] = v.net_salary;

          v.allowance_details.map((a, j) => {
            objRow[a.salary_payment_allowance_label] =
              a.salary_payment_allowance_value;
          });
          v.deduction_details.map((b, k) => {
            objRow[b.salary_payment_deduction_label] =
              b.salary_payment_deduction_value;
          });

          columnArray.push(objColumn);
          dataRow.push(objRow);
          basicSalary.push(objBasicSalary);
          netSalary.push(objNetSalary);
        });

        this.setState({
          employeeInfo: list[0],
          columnHeader: columnArray,
          basicSalaryData: basicSalary,
          netSalaryData: netSalary,
          data: dataRow,
        });
        // let totalList = list;
        // let collectedTotal = [];
        // totalList.forEach((v1, i1) => {
        //   let total = 0;
        //   v1.designations.forEach((v2) => {
        //     let subTotal = v2.gender
        //       .filter((v) => typeof v == "number")
        //       .reduce((p, c) => {
        //         return p + c;
        //       }, 0);
        //     // console.log("sub total ====>", subTotal)
        //     total += subTotal;
        //     console.log(total);
        //   });
        //   collectedTotal[i1] = total;
        // });
        // let uniqueDesign = new Set();
        // list.forEach((v) => {
        //   v.designations.forEach((v1) => {
        //     uniqueDesign.add(v1.designations);
        //   });
        // });

        // let uniqueMap = new Map();
        // uniqueDesign.forEach((v) => {
        //   uniqueMap.set(v, {
        //     designations: v,
        //     gender: ["female", 0, "male", 0],
        //   });
        // });
        // console.log("uniqueMap", uniqueMap);

        // let mapValue = [...uniqueMap.values()];

        // let dataRow = list;
        // dataRow = dataRow.map((v) => {
        //   let temp = [...v.designations];
        //   v.designations = mapValue;

        //   v.designations = v.designations.map((designation) => {
        //     temp.forEach((originValue) => {
        //       if (designation.designations == originValue.designations) {
        //         designation = originValue;
        //       }
        //     });
        //     return designation;
        //   });
        //   return v;
        // });

        // console.log("DataRow", dataRow);

        // this.setState({
        //   listTotal: collectedTotal,
        //   dataRow,
        //   uniqueMap: uniqueMap,
        //   mapValue,
        //   data: list,
        // });
      });
  };

  render() {
    return (
      <div>
        <h3 className="">Salary History Report</h3>
       
        <div
          className="flex-row"
          style={{
            display: "flex",
            justifyContent: "left",
            alignItems: "end",
            margin: "10px 10px 10px 0px",
          }}
        >
          <div style={{ marginRight: "10px" }}>
            <label htmlFor="">Start Date</label>
            <DatePicker
              dateFormat="YYYY-MM"
              value={this.state.start_date}
              onChange={this.handleSelectedStartDate}
              timeFormat={false}
            />
          </div>
          <div style={{ marginRight: "10px" }}>
            <label htmlFor="">End Date</label>
            <DatePicker
              dateFormat="YYYY-MM"
              value={this.state.end_date}
              onChange={this.handleSelectedEndDate}
              timeFormat={false}
            />
          </div>
          <div>
            <label htmlFor="">Employee Name</label>
            <Select
              styles={{
                container: (base) => ({
                  ...base,
                  //   flex: 1
                  width: 180,
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

          <div>
            <button
              className="btn btn-primary text-center"
              style={{ marginLeft: 10, height: 30, padding: "0px 5px 0px 5px" }}
              onClick={() => {
                this.getSalaryHistory();
                this.getSalaryHistoryLabel();
              }}
            >
              Search
            </button>
          </div>
        </div>
       
       {/* <table id="reg_wise_staff">
       {this.state.employeeInfo != null && (
          <table className="table table-bordered" style={{ width: "20%" }}>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>{this.state.employeeInfo.employment_id}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Name</td>
              <td>{this.state.employeeInfo.fullname}</td>
            </tr>
            <tr>
              <td>Position</td>
              <td>{this.state.employeeInfo.designations}</td>
            </tr>
            <tr>
              <td>Department</td>
              <td>{this.state.employeeInfo.deptname}</td>
            </tr>
            <tr>
              <td>Branch</td>
              <td>{this.state.employeeInfo.location_master_name}</td>
            </tr>
            <tr>
              <td>Region</td>
              <td>{this.state.employeeInfo.state_name}</td>
            </tr>
          </tbody>
        </table>
        )}
        
        <div style={{ overflowX: "auto" }}>
          <table
            className="table table-bordered"
           
            style={{ overflow: "scroll" }}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  overflow: "scroll",
                }}
              >
                <th style={{ textAlign: "center", width: 100 }}>
                  <div style={{ width: 100 }}></div>
                </th>
                {this.state.columnHeader != null &&
                  this.state.columnHeader.map((v1) => {
                    return (
                      <th style={{ textAlign: "center", width: 100 }}>
                        {v1.column}
                      </th>
                    );
                  })}
              </tr>
            </thead>

            <tbody style={{ textAlign: "center" }}>
              <tr>
                <td style={{ borderColor: "white" }}>Basic Salary</td>
                {this.state.basicSalaryData.map((b, i) => (
                  <td style={{ borderColor: "white" }} align={"right"}>
                    {b.basic_salary}
                  </td>
                ))}
              </tr>
              {this.state.salaryHistoryLabel.map((v1, k2) => {
                return (
                  <tr>
                    <td style={{ borderColor: "white" }}>{v1.label}</td>
                    {this.state.data.map((v2, k2) => {
                      return (
                        <td style={{ borderColor: "white" }} align={"right"}>
                          {v2[v1.label] == undefined ? 0 : v2[v1.label]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr>
                <td style={{ borderColor: "white" }}>Net Salary</td>
                {this.state.netSalaryData.map((b, i) => (
                  <td style={{ borderColor: "white" }} align={"right"}>
                    {b.net_salary}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
       </table> */}
<div style={{display:'flex',justifyContent:'start'}}>
  <div>
 <table id="reg_wise_staff">

  {this.state.employeeInfo != null && (
    <div className="row" style={{marginLeft:0}}>
      <div style={{marginTop:30}}>
        <ReactHTMLTableToExcel
          className="btn-excel"
          table="reg_wise_staff"
          filename={"Salary History Report("+moment(this.state.start_date).format('YYYY-MM')+'_'+moment(this.state.end_date).format('YYYY-MM')+')'}
          buttonText="Excel"
          sheet="Sheet"
        />
       
   <table className="table table-bordered" style={{ width:600 }}>
           <thead>
             <tr>
               <th>Employee ID</th>
               <th>{this.state.employeeInfo.employment_id}</th>
             </tr>
           </thead>
           <tbody>
             <tr>
               <td>Name</td>
               <td>{this.state.employeeInfo.fullname}</td>
             </tr>
             <tr>
               <td>Position</td>
               <td>{this.state.employeeInfo.designations}</td>
             </tr>
             <tr>
               <td>Department</td>
               <td>{this.state.employeeInfo.deptname}</td>
             </tr>
             <tr>
               <td>Branch</td>
               <td>{this.state.employeeInfo.location_master_name}</td>
             </tr>
             <tr>
               <td>Region</td>
               <td>{this.state.employeeInfo.state_name}</td>
             </tr>
           </tbody>
        </table> </div>
        </div>
        )}
        <table
            className="table table-bordered"
           
            style={{ overflow: "scroll" ,minWidth:600}}
          >
            <thead>
              <tr
                style={{
                  backgroundColor: "blue",
                  color: "white",
                  overflow: "scroll",
                }}
              >
                <th style={{ textAlign: "center", width: 100 }}>
                  <div style={{ width: 100 }}></div>
                </th>
                {this.state.columnHeader != null &&
                  this.state.columnHeader.map((v1) => {
                    return (
                      <th style={{ textAlign: "center", width: 100 }}>
                        {v1.column}
                      </th>
                    );
                  })}
              </tr>
            </thead>

            <tbody style={{ textAlign: "center" }}>
              <tr>
                <td style={{ borderColor: "white" }}>Basic Salary</td>
                {this.state.basicSalaryData.map((b, i) => (
                  <td style={{ borderColor: "white" }} align={"right"}>
                    {b.basic_salary}
                  </td>
                ))}
              </tr>
              {this.state.salaryHistoryLabel.map((v1, k2) => {
                return (
                  <tr>
                    <td style={{ borderColor: "white" }}>{v1.label}</td>
                    {this.state.data.map((v2, k2) => {
                      return (
                        <td style={{ borderColor: "white" }} align={"right"}>
                          {v2[v1.label] == undefined ? 0 : v2[v1.label]}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
              <tr>
                <td style={{ borderColor: "white" }}>Net Salary</td>
                {this.state.netSalaryData.map((b, i) => (
                  <td style={{ borderColor: "white" }} align={"right"}>
                    {b.net_salary}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
</table>

  </div>
</div>
      </div>
    );
  }
}
export default SalaryHistoryReport;
