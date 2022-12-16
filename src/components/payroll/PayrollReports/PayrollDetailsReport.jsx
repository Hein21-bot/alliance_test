import React, { Component } from "react";
import { main_url } from '../../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import Select from 'react-select';
import DatePicker from 'react-datetime';
import moment from "moment";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');
class PayrollDetailsReport extends Component {
  constructor(props) {
    super(props);
    this.state = {

      regionList: null,
      dataSource:[],
      fullname:'',
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
      selected_employeeId: null,
      selected_employee_status:null,
      // employeeIdList:[],
      EmployeeStatus:[
        {
          value:0,label:'All'
        },
        {
            value:1,label:'Permanent'
        },
        {
            value:2,label:'Part-Time'
        },
        {
            value:3,label:'Training'
        }
      ],
      empNameList:[],
      employeeList:[],
      date: moment().format("YYYY-MM"),
      PayrollList: [],
      ReportHeader: [],
      employeeName:null,
      empId:null
    }
  }

  async componentDidMount() {
    this.$el = $(this.el);
    this.setState(
      {
        
      },
      () => {
        
      }

    );
    this.getRegionList();
    this.getDepartmentList();
    this.getBranchList();
   
    // this.getEmployeeCode();
    this.handleSearchData();
    // this.getPayrollReportHeader();
    // this.getEmployeeCode();
    this.getEmployeeName();
    this.getEmployeeList();

    
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
  getPayrollReportHeader() {
    // fetch(
    //   `${main_url}payroll_report/getPayrollReportHeader/` +
    //     moment(this.state.data).format("YYYY-MM")
    // )
    const Date=moment(this.state.date).format('YYYY-MM')
    fetch(`${main_url}payroll_report/getPayrollReportHeader/`+Date)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          ReportHeader: list,
        });
      });
  }
  // getEmployeeCode() {
  //   fetch(`${main_url}employee/getEmployeeCode`)
  //     .then((res) => {
  //       if (res.ok) return res.json();
  //     })
  //     .then((list) => {
  //       this.setState({
  //         employeeIdList: list.map((v) => ({
  //           ...v,
  //           label: v.employee_code,
  //           value: v.user_id,
  //         })),
  //       });
  //     });
  // }
  getEmployeeList() {
    fetch(`${main_url}main/getEmployeeWithDesignation/0`)
        .then(res => res.json())
        .then(data => {
         
            this.setState({
                employeeList: data.map(v => ({ ...v, label: v.employment_id, value: v.value, name: v.label })),
                // allEmployeeID: all
            })

        })
}
getEmployeeName() {
    fetch(`${main_url}report/employeeName`)
        .then((res) => {
            if (res.ok) return res.json();
        })
        .then((list) => {
            let lists = list.unshift({ value: 0, label: "All" });
            this.setState({
                empNameList: list.map((v) => ({
                    ...v
                }))
            })
        })
}
handleSelectedEmpId = async (event) => {
  // console.log("event=======>",event)
  // console.log("empName List====>",this.state.empNameList.filter(v=>v.value==event.value))
  this.setState({
      empId: event,
      employeeName: this.state.empNameList.filter(v => v.value == event.value),
      
  }, 
  // () => { console.log("name>>>>>",this.state.empId.value,this.state.employeeName.value) }
  )
}
  // handleSelectedEmpId = async (event) => {
  //   console.log("event",event)
  //   if (event != null)
  //   if (event) {
  //     fetch(`${main_url}employee/getDetailUser/${event.user_id}`)
  //       .then((res) => {
  //         if (res.ok) return res.json();
  //       })
  //       .then((data) => {
  //         this.setState({
  //             fullname:data[0].employee_name
  //         })
  //         // if (data.length > 0) {
  //         //   this.getData(this.props.id);
  //         //   this.setState({ tableEdit: true, tableView: false });


  //         // }
  //       });
  //   }
  //     this.setState(
  //       {
  //         selected_employeeId: event
  //       }
  //     )
  // }
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
  handleSelectedEmpName = async (event) => {
    if (event != null)
      this.setState(
        {
          selected_employee: event
        }
      )
  }
  handleEmployeeStatus=async(event)=>{
    this.setState({
        selected_employee_status:event
    })
  }
  handleSelectedDate=async(event)=>{
    this.setState({
        date:event
    })
  }
  handleSelectedName = async (event) => {
    // console.log("selected name",event.label)
    this.setState({
        employeeName: event,
        empId: this.state.employeeList.filter(v => v.value == event.value)[0],
        selectedEmployeeName:event
    },()=>{console.log("listnaem",this.state.employeeName.value,this.state.empId.value)})
}

  handleSearchData = async() => {
    // this.setState({
    const branchId = this.state.selected_Branch ? this.state.selected_Branch.value : 0
    const departmentId = this.state.selected_department ? this.state.selected_department.departments_id : 0
    const designationId = this.state.selected_designation ? this.state.selected_designation.value : 0
    const regionId = this.state.selected_region ? this.state.selected_region.state_id : 0
    const employee = this.state.empId ? this.state.empId.value: 0
    const Date=moment(this.state.date).format('YYYY-MM')
    const Status=this.state.selected_employee_status ? this.state.selected_employee_status.value : 0
    // })

    await fetch(main_url + "payroll_report/payrollReportSummary/"+Date+"/"+regionId+"/"+branchId+"/"+departmentId+'/'+Status+'/'+employee)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          dataSource: list,
        });
      });
      this.getPayrollReportHeader();
  }
  render() {
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
    console.log("filter deduction",FilterDeduction)
    
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
    console.log("deduction",Deduction)
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
    // console.log("filter addition",Addition)
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
    // console.log("total Deduction data",totalDeductionData)
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
    // console.log("value in deduction is =============>", totalAdditionData);
  
    return (
      <div>
        <div className="row  white-bg dashboard-header">
        <h3 className="">Payroll Details Report</h3>
        
          <div style={{overflow:'scroll'}}>
          <div className="row">
          
          <div className='col-md-12' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center',marginLeft:0,marginBottom:10,padding:0}}>
          <div className="col-md-3">
          <DatePicker
                            dateFormat="YYYY-MM"
                            value={this.state.date}
                            onChange={this.handleSelectedDate}
                            timeFormat={false}
                        />
          </div>
         <div className="col-md-3">
         <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  
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
           <div className="col-md-3">
           <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                 
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
            <div className="col-md-3">
            <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  
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
            <div className="col-md-3">
            <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Employee Status"
              options={this.state.EmployeeStatus}
              onChange={this.handleEmployeeStatus}
              value={this.state.selected_employee_status}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            </div>
            <div className="col-md-3">
            <Select
                                styles={{
                                    container: base => ({
                                        ...base,
                                        //   flex: 1
                                       
                                    }),
                                    control: base => ({
                                        ...base,
                                        minHeight: '18px'
                                    }),

                                }}
                                placeholder="Employee ID"
                                options={this.state.employeeList}
                                onChange={this.handleSelectedEmpId}
                                value={this.state.empId}
                                className='react-select-container'
                                classNamePrefix="react-select"
                            />
            </div>
            <div className="col-md-3">
            <Select
                                styles={{
                                    container: base => ({
                                        ...base,
                                        //   flex: 1
                                        
                                    }),
                                    control: base => ({
                                        ...base,
                                        minHeight: '18px'
                                    }),

                                }}
                                placeholder="Employee Name"
                                options={this.state.empNameList}
                                onChange={this.handleSelectedName}
                                value={this.state.employeeName}
                                className='react-select-container'
                                classNamePrefix="react-select"
                            />
            </div>
            <div className="col-md-3">
            <button className='btn btn-primary text-center' onClick={() => this.handleSearchData()}>Search</button>
            </div>
          </div>
          <div className="col-md-12 btn-leftend" style={{marginBottom:10}}>
          <ReactHTMLTableToExcel 
                    className="btn-excel"
                    table="payroll_details_report"
                    filename="Payroll Details Report"
                    buttonText="Excel"
                    sheet="Sheet"
                    />
          </div>
          
          </div>
        
          <table
            className="table table-bordered"
            style={{ overflow: "scroll" }}
            id='payroll_details_report'
          >
            <thead>
              <tr style={{ overflow: "scroll" }}>
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>No</th>
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}} >Employee ID</th>
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Name</th>
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Position</th>
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Level</th>
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Departments</th>
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Region</th>
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Branch Name</th>
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Employee Status</th>
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Gross salary</th>
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Deductions(+)/Additions(-)</th>
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Salary after deductions/additions</th>
                <th colSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>SSC</th>
                {this.state.ReportHeader &&
                this.state.ReportHeader.filter(
                  (v) => v.label == "Income Tax"
                ) ? (
                  <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Income Tax</th>
                ) : (
                  ""
                )}
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Net Salary Paid</th>
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Total Gross Salary</th>
                {
                  totalDeductionData.length > 0 && totalDeductionData.map(v=>{
                    return(
                      <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>{v.salary_payment_deduction_label}</th>
                    )
                  })
                }
                {
                  totalAdditionData.length > 0 && totalAdditionData.map(v=>{
                    return(
                      <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>{v.salary_payment_allowance_label}</th>
                    )
                  })
                }
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Total</th>
                <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>ATM or Cash</th>
              </tr>
              <tr>
                <th style={{textAlign:'center',verticalAlign:'middle'}}>Employer 3%</th>
                <th style={{textAlign:'center',verticalAlign:'middle'}}>Employee 2%</th>
              </tr>
            </thead>
            <tbody>
              {finalDatasource.length > 0 &&
                finalDatasource.map((v, i) => {
                  return (
                    <tr>
                      <td style={{textAlign:'center'}}>{i + 1}</td>
                      <td style={{textAlign:'center'}}>{v.employment_id}</td>
                      <td style={{textAlign:'center'}}>{v.fullname}</td>
                      <td style={{textAlign:'center'}}>{v.designations}</td>
                      <td style={{textAlign:'center'}}>{v.career_sub_level}</td>
                      <td style={{textAlign:'center'}}>{v.deptname}</td>
                      <td style={{textAlign:'center'}}>{v.state_name}</td>
                      <td style={{textAlign:'center'}}>{v.location_master_name}</td>
                      <td style={{textAlign:'center'}}>{v.name}</td>
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
                      <td style={{textAlign:'center'}}>{v.payment_type == 1 ? "ATM" : v.payment_type == 2 ? 'Cash' : '-'}</td>
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
                <td colSpan={9} style={{textAlign:'center',fontWeight:'bold'}}>All Total</td>
                <td style={{textAlign:'center',fontWeight:'bold'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.gross_salary;
                  }, 0)}
                </td>
                <td style={{textAlign:'center',fontWeight:'bold'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.deduction_addition_data;
                  }, 0)}
                </td>
                <td style={{textAlign:'center',fontWeight:'bold'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.after_deduction_or_addition;
                  }, 0)}
                </td>
                <td style={{textAlign:'center',fontWeight:'bold'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.ssc[0].Employee_3;
                  }, 0)}
                </td>
                <td style={{textAlign:'center',fontWeight:'bold'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.ssc[0].Employer_2;
                  }, 0)}
                </td>
                <td style={{textAlign:'center',fontWeight:'bold'}}>
                  {NextFilterIncomeTax.reduce((p, c) => {
                    return p + c[0].salary_payment_deduction_value;
                  }, 0)}
                </td>
                <td style={{textAlign:'center',fontWeight:'bold'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.net_salary;
                  }, 0)}
                </td>
                <td style={{textAlign:'center',fontWeight:'bold'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.total_gross_salary;
                  }, 0)}
                </td>
                {
                  totalDeductionData.map(v=>{
                    return (
                      <td style={{textAlign:'center',fontWeight:'bold'}}>{v.value}</td>
                    )
                  })
                }
                {
                  totalAdditionData.map(v=>{
                    return (
                      <td style={{textAlign:'center',fontWeight:'bold'}}>{v.value}</td>
                    )
                  })
                }
                <td style={{textAlign:'center',fontWeight:'bold'}}>
                  {finalDatasource.reduce((p, c) => {
                    return p + c.total;
                  }, 0)}
                <td></td>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
      </div>
      </div>
    )
  }
}
export default PayrollDetailsReport;