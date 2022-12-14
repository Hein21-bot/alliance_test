import React, { Component } from "react";
import { main_url } from "../../../utils/CommonFunction";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import Select from "react-select";
import DatePicker from "react-datetime";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import moment from "moment";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");
const empType = {
  PartTime: "Part Time",
  Permanent: "Permanent",
  Training: "Training",
  All: "All",
};
class PayrollSummaryReportWithLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      annaulAwardTotal: 0,
      petrolTotal: 0,
      maintenanceTotal: 0,
      medicalTotal: 0,
      incometaxTotal: 0,
      withoutpayTotal: 0,
      salaryTotal: 0,
      sscTotal: 0,
      staffLoanTotal: 0,
      date: new Date(),
      regionList: null,
      FinalData: [],
      fullname: "",
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
      selected_employee_status: null,
      employeeIdList: [],
      EmployeeStatus: [
        {
          value: 1,
          label: "Permanent",
        },
        {
          value: 2,
          label: "Part-Time",
        },
        {
          value: 3,
          label: "Training",
        },
      ],
      ReportHeader:[],
      additionMax:null,
      deductionMax:null
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
    this.getDepartmentList();
    this.getBranchList();
    this.getPayrollReportHeader();

    this.handleSearchData();
  }
  getDesignationList() {
    fetch(`${main_url}main/getDesignations`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          designationList: list,
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
  handleEmployeeStatus = async (event) => {
    this.setState({
      selected_employee_status: event,
    });
  };
  handleSelectedDate = async (event) => {
    this.setState({
      date: event,
    });
  };
  getPayrollReportHeader() {
    
    fetch(`${main_url}payroll_report/getPayrollReportHeader/2023-02`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          ReportHeader: list,
        });
      });
  }

  handleSearchData = () => {
    const branchId = this.state.selected_Branch
    ? this.state.selected_Branch.value
    : 0;

  const regionId = this.state.selected_region
    ? this.state.selected_region.state_id
    : 0;
  const Date = moment(this.state.date).format("YYYY-MM");
  const Status=this.state.selected_employee_status ? this.state.selected_employee_status.value : 0
    fetch(main_url + "payroll_report/payrollWiseLocationReport/"+Date+'/'+regionId+'/'+branchId+'/'+Status)
      .then(res => { if (res.ok) return res.json() })
      .then(async list => {
        // console.log('list data ====>', list)
       if(list.length > 0){
        // console.log("list",list)
        var additionMax =list.reduce((a, b)=> {
          if(b.addition){
            return b.addition.length>a.addition.length? b: a
          }
          //return Math.max(a, b.addition?b.addition.length:0);
        },{addition:[]});
        // console.log('additionMax',additionMax)
        var additionTemp = [];
        await additionMax.length > 0 && additionMax.addition.length > 0 && additionMax.addition.map((v,i) => {
          var obj = {}
          obj['salary_payment_allowance_label'] = v.salary_payment_allowance_label;
          obj['salary_payment_allowance_value'] = 0;
          additionTemp.push(obj);
        })
        

        var deductionMax =list.reduce((a, b) => {
          if(b.deduction){
            return b.deduction.length>a.deduction.length? b: a
          }
         
        },{deduction:[]});
        // console.log(deductionMax,'deductionMax')
        var deductionTemp = [];
        await deductionMax.length > 0 && deductionMax.deduction.length > 0 && deductionMax.deduction.map((v,i) => {
          var obj = {}
          obj['salary_payment_deduction_label'] = v.salary_payment_deduction_label;
          obj['salary_payment_deduction_value'] = 0;
          deductionTemp.push(obj);
        })
       }
    
       this.setState({
        data:list,
        
       })
       const getTemplatePartTime = (branch,empType) => {
        return {
        "location_master_name":branch,
        "name":empType,
        "addition":[...additionTemp],
        "total_amount": 0,
        "gross_salary": 0,
        "deduction_addition_data": 0,
        "after_deduction_or_addition": 0,
        "deduction":[...deductionTemp],
        "ssc":[
          {
          "Employer_2": 0,
          "Employee_3": 0
          }
          ],
          "net_salary": 0,
          "total_gross_salary": 0,
          "deductionTotal": 0,
          "additionTotal": 0,
          "total": 0
      }
      }
      const getAllTemplate = (empType) => {
        return {
       
        "name":empType,
        "addition":[...additionTemp],
        "total_amount": 0,
        "gross_salary": 0,
        "deduction_addition_data": 0,
        "after_deduction_or_addition": 0,
        "deduction":[...deductionTemp],
        "ssc":[
          {
          "Employer_2": 0,
          "Employee_3": 0
          }
          ],
          "net_salary": 0,
          "total_gross_salary": 0,
          "deductionTotal": 0,
          "additionTotal": 0,
          "total": 0
      }
      }

      //  console.log(list)
      let formatData = list.reduce((r, c) => {
        let R = [...r];
        const index = R.findIndex(
          (v) =>
            v.name == c.name
        );
        if (index == -1) {
          R.push({
            name: c.name,
            empType: [c],
          });
        } else {
          R[index].empType.push(c);
        }
        return R;
      }, []);
      console.log("formatdata",formatData)
      let arrary=[];
      formatData.map((v)=>{
        let Permanent=formatData.filter((d)=>d.name == 'Permanent')
        let PartTime=formatData.filter((d)=>d.name == 'Part Time')
        let Training=formatData.filter((d)=>d.name == 'Training')
        if(Permanent){
            arrary.push(Permanent)
        }else{
          array.push( getTemplatePartTime(empType.Permanent))
        }
      })
       const formatD= list.length >0 ? list.reduce((r,c)=>{
            let R={...r};
            if(!R[c.location_master_name]){
                R[c.location_master_name]={
                  location_master_name: c.location_master_name,
                  empType: [ c]
                }
            }
            else {
              R[c.location_master_name]['empType'].push(c)
            }
            return R;
        },[]): {};
        const keys=Object.keys(formatD);
        let data = {}
        for (let index = 0; index < keys.length; index++) {
          const element = formatD[keys[index]];
          let arr=[];
          let partTime= element["empType"].find(d=>d.name === empType.PartTime)
          // console.log("partTime",partTime)
          let perm= element["empType"].find(d=>d.name === empType.Permanent)
          // console.log("permanent",perm)
          let train= element["empType"].find(d=>d.name === empType.Training)
          // console.log("training",train)
          let All= element["empType"].find(d=>d.name === empType.All)


          if(perm) arr.push(perm)
          else arr.push( getTemplatePartTime(keys[index], empType.Permanent))

          if(partTime) arr.push(partTime)
          else arr.push( getTemplatePartTime(keys[index], empType.PartTime))

          if(train) arr.push(train)
          else arr.push( getTemplatePartTime(keys[index], empType.Training))
          
          // let filterData=arr.filter(v=>v.deduction.length > 0)
          // console.log("filter arrr",arr)
          let listAllowance = [];
          let arrAllowance = []
          arr.map(v=>{
            // console.log("addition temp",v)
            // console.log("addition",v.addition)
            v.addition.forEach(additionObj => {
              if(!listAllowance[additionObj.salary_payment_allowance_label]){
                listAllowance[additionObj.salary_payment_allowance_label] = 0;
              }
              listAllowance[additionObj.salary_payment_allowance_label] += additionObj.salary_payment_allowance_value;
            });
          
          })
          for (let key in listAllowance) {
            arrAllowance.push({"salary_payment_allowance_label":key, salary_payment_allowance_value: listAllowance[key]});
          }

          // console.log("ta ku ku", arrAllowance);
          // console.log('list allowance',listAllowance)
          let listDeduction = [];
          let arrDeduction = [];
          arr.map(v=>{
            // console.log("addition",v.addition)
            v.deduction.forEach(deductionObj => {
              if(!listDeduction[deductionObj.salary_payment_deduction_label]){
                listDeduction[deductionObj.salary_payment_deduction_label] = 0;
              }
              listDeduction[deductionObj.salary_payment_deduction_label] += deductionObj.salary_payment_deduction_value;
            });
          })
          for (let key in listDeduction) {
            arrDeduction.push({"salary_payment_deduction_label":key, salary_payment_deduction_value: listDeduction[key]});
          }
          if(All){
              
          }
        else{
          let temp=arr
          arr.unshift( {
          "location_master_name":keys[index],
          "name":empType.All,
          'addition':[...arrAllowance],
          'deduction':[...arrDeduction],
          "total_amount": temp.reduce((p,c)=>{return p+c.total_amount},0),
          "gross_salary": temp.reduce((p,c)=>{return p+c.gross_salary},0),
          "deduction_addition_data": temp.reduce((p,c)=>{return p+c.deduction_addition_data},0),
          "after_deduction_or_addition": temp.reduce((p,c)=>{return p+c.after_deduction_or_addition},0),
          "ssc":[
            {
            "Employer_2": temp.reduce((p,c)=>{
              if(c.ssc.length > 0){
                return p+c.ssc[0].Employer_2
              }
            },0),
            "Employee_3": temp.reduce((p,c)=>{
              if(c.ssc.length >0){
                return p+c.ssc[0].Employee_3
              }
              
            },0)
            }
            ],
            "net_salary": temp.reduce((p,c)=>{return p+c.net_salary},0),
            "total_gross_salary": temp.reduce((p,c)=>{return p+c.total_gross_salary},0),
            "deductionTotal": temp.reduce((p,c)=>{return p+c.deductionTotal},0),
            "additionTotal": temp.reduce((p,c)=>{return p+c.additionTotal},0),
            "total": temp.reduce((p,c)=>{return p+c.total},0)

        })
        }

         

          data[keys[index]] ={
            branch_name:keys[index],
            employeeType:arr
          }

        }

      // console.log("format data ===> ",data,typeof(data))
      let array=Object.values(data);
      // console.log("array",array)
      this.setState({
        FinalData:array
      })
      
      })

  }
  
  render() {
    // console.log('final data',this.state.FinalData)
    let filterData =
    this.state.ReportHeader &&
    this.state.ReportHeader.filter(
      (v) => v.label != "Income Tax" && v.label != "SSC"
    );
  let finalDatasource =
    this.state.FinalData != undefined && this.state.FinalData.length > 0
      ? this.state.FinalData
      : [];
  let filterIncomeTax = finalDatasource.map(
    (d) =>{
      d.employeeType.map(v=>{
        // console.log('v',v);
        v.deduction.length > 0 &&
        v.deduction.filter(v1=>v1.salary_payment_deduction_label == 'Income Tax')
      })
    }
     
  );
  
  // console.log("filter income tax",filterIncomeTax)
  
  let Deduction = [];
  let Addition=[]
  finalDatasource.map((v) => {
   v.employeeType.length > 0 && v.employeeType.map((v1)=>{
      filterData.map((header) => {
        if (
          v1.deduction.filter(
            (d) => d.salary_payment_deduction_label == header.label
          ).length > 0
        ) {
          Deduction.push(
            v1.deduction.filter(
              (d) => d.salary_payment_deduction_label == header.label
            )[0]
          );
        }
        // Deduction.push(v.deduction.filter(d=>d.salary_payment_deduction_label == header.label).length > 0 && v.deduction.filter(d=>d.salary_payment_deduction_label == header.label)[0])
      });
    })
    
  });
  finalDatasource.map((v) => {
    v.employeeType.length > 0 && v.employeeType.map((v1)=>{
      filterData.map((header) => {
        if (
          v1.addition.filter(
            (d) => d.salary_payment_allowance_label == header.label
          ).length > 0
        ) {
          Addition.push(
            v1.addition.filter(
              (d) => d.salary_payment_allowance_label == header.label
            )[0]
          );
        }
        // Deduction.push(v.deduction.filter(d=>d.salary_payment_deduction_label == header.label).length > 0 && v.deduction.filter(d=>d.salary_payment_deduction_label == header.label)[0])
      });
    })
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
          <h3 className="" style={{ paddingLeft: "10px" }}>
            Payroll Summary Report With Locatin Wise/Status Wise
          </h3>
          <div style={{ overflow: "scroll" }}>
            <ReactHTMLTableToExcel
              className="btn-excel"
              table="reg_wise_staff"
              filename="Payroll Summary Report With Location Wise/Status Wise"
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
                    marginRight: 10,
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
                placeholder="Employee Status"
                options={this.state.EmployeeStatus}
                onChange={this.handleEmployeeStatus}
                value={this.state.selected_employee_status}
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
                onClick={() => this.handleSearchData()}
              >
                Search
              </button>
            </div>
            <table
              className="table table-bordered"
              id="reg_wise_staff"
              style={{ overflow: "scroll" }}
            >
              <thead>
                <tr style={{ overflow: "scroll" }}>
                  <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Region/Branch</th>
                  <th rowSpan={2}  style={{textAlign:'center',verticalAlign:'middle'}}>Employee Status</th>
                  <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Gross Salary</th>
                  <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Deductins(+)/Additions(-)</th>
                  <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Salary After Deductions/Additions</th>
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
                  <th rowSpan={2} style={{textAlign:'center',verticalAlign:'middle'}}>Grand Total</th>
                </tr>
                <tr>
                <th style={{textAlign:'center',verticalAlign:'middle'}}>Employer 3%</th>
                <th style={{textAlign:'center',verticalAlign:'middle'}}>Employee 2%</th>
              </tr>
              </thead>
              <tbody>
                {
                  this.state.FinalData.map((v1,k)=>{
                    return(
                      <>
                      {
                        v1.employeeType.map((v2,k2)=>{
                          return(
                            <>
                            <tr style={{textAlign:'center'}}>
                              
                            </tr>
                            </>
                          )
                        })
                      }
                      </>
                    )
                  })
                }

                {this.state.FinalData.map((v1, k) => {
                 
                  return (
                    <>
                      {v1.employeeType.map((v2, k2) => {
                        

                        return (
                          <>
                            <tr style={{textAlign:'center'}}>
                              
                              {k2 === 0 ? (
                                <td
                                  rowSpan={v1.employeeType.length}
                                  style={{ verticalAlign: "middle" }}
                                >
                                  {v1.branch_name}
                                </td>
                              ) : null}
                              <td style={{verticalAlign:'middle'}}>{v2.name}</td>
                              <td style={{verticalAlign:'middle'}}>{v2.gross_salary}</td>
                              <td style={{verticalAlign:'middle'}}>{v2.deduction_addition_data}</td>
                              <td style={{verticalAlign:'middle'}}>{v2.after_deduction_or_addition}</td>
                              <td style={{verticalAlign:'middle'}}>{v2.ssc[0].Employer_2}</td>
                              <td style={{verticalAlign:'middle'}}>{v2.ssc[0].Employee_3}</td>
                              {v2.deduction.length > 0 ? (
                        v2.deduction.filter(
                          (v3) =>
                            v3.salary_payment_deduction_label == "Income Tax"
                        ).length > 0 ? (
                          <td style={{verticalAlign:'midddle'}}>
                            {
                              v2.deduction.filter(
                                (v4) =>
                                  v4.salary_payment_deduction_label ==
                                  "Income Tax"
                              )[0].salary_payment_deduction_value
                            }
                          </td>
                        ) : (
                          <td style={{verticalAlign:'middle'}}>0</td>
                        )
                      ) : (
                        <td style={{textAlign:'center'}}>0</td>
                      )}
                              <td style={{verticalAlign:'middle'}}>{v2.net_salary}</td>
                              <td style={{verticalAlign:'middle'}}>{v2.total_gross_salary}</td>
                              {totalDeductionData.map((a, i) => {
                        return (
                          <td style={{verticalAlign:'middle'}}>
                            
                            {v2.deduction.length > 0 &&
                            v2.deduction.filter(
                              (d) => d.salary_payment_deduction_label == a.salary_payment_deduction_label
                            ).length > 0
                              ? v2.deduction.filter(
                                  (d) =>
                                    d.salary_payment_deduction_label == a.salary_payment_deduction_label
                                )[0].salary_payment_deduction_value
                              : 0}
                           
                          </td>
                        );
                      })}
                                   {totalAdditionData.map((a, i) => {
                        return (
                          <td style={{verticalAlign:'middle'}}>
                            {v2.addition.length > 0 &&
                            v2.addition.filter(
                              (d) => d.salary_payment_allowance_label == a.salary_payment_allowance_label
                            ).length > 0
                              ? v2.addition.filter(
                                  (d) =>
                                    d.salary_payment_allowance_label == a.salary_payment_allowance_label
                                )[0].salary_payment_allowance_value
                              : 0}
                          </td>
                        );
                      })}
                         <td style={{verticalAlign:'middle'}}>{v2.total}</td>     

                              {k2 === 0 ? (
                                <td
                                  rowSpan={v1.employeeType.length}
                                  style={{ verticalAlign: "middle" }}
                                >
                                 {v1.employeeType[0].total}
                                </td>
                              ) : null}
                            </tr>
                          </>
                        );
                      })}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}
export default PayrollSummaryReportWithLocation;
