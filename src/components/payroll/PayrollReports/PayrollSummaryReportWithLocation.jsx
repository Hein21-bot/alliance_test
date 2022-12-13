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
      date: moment().format("YYYY-MM-DD"),
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
    // fetch(
    //   `${main_url}payroll_report/getPayrollReportHeader/` +
    //     moment(this.state.data).format("YYYY-MM")
    // )
    fetch(`${main_url}payroll_report/getPayrollReportHeader/2023-03`)
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
    // this.setState({
    // const branchId = this.state.selected_Branch ? this.state.selected_Branch.value : 0
    // const regionId = this.state.selected_region ? this.state.selected_region.state_id : 0
    // const employee_status = this.state.selected_employee_status ? this.state.selected_employee_status.value : 0
    // const Date=moment(this.state.date).format('YYYY-MM-DD')
    // })

    // fetch(main_url + "report/employeeReport/" + regionId + "/" + branchId + "/" + employee_status+"/"+Date)
    //   .then(res => { if (res.ok) return res.json() })
    //   .then(list => {
    //    this.setState({
    //     data:list
    //    })
    //   })
   
    // const getTemplateAll = (branch,empType) => {
    //   return {
    //     "branch_name":branch,
    //   "emp_type":empType,
    //   "allowance_labels":
    //   [{"label":"Annual Award",
    //   "value":0},
    //   {"label":"Maintenance",
    //   "value":0},{"label":"Medical Benefit",
    //   "value":0},{"label":"Petrol","value":0}],
    //   "deduction_labels":[{"label":"Income Tax",
    //   "value":0},{"label":"Leave Without Pay","value":0},
    //   {"label":"Salary Advance","value":0},
    //   {"label":"SSC","value":0},
    //   {"label":"Staff Loan","value":0}]
    // }
    // }
    fetch(main_url + "payroll_report/payrollWiseLocationReport/2023-03/0/0/0")
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        var additionMax = list.reduce((a, b)=> {
          return b.addition && b.addition.length>a.addition && a.addition.length? b: a
          //return Math.max(a, b.addition?b.addition.length:0);
        });
        console.log('max',additionMax);
        var deductionMax = list.reduce((a, b)=> {
          return b.addtion && b.deduction.length>a.deduction && a.deduction.length? b: a
          //return Math.max(a, b.addition?b.addition.length:0);
        });
        let deductionTemp=[]
        deductionMax.deduction.map((v,i)=>{
          return (v[i] ? v[i].salary_payment_deduction_value = 0 : 0)
        })
        // for (let index = 0; index < deductionMax.deduction.length; index++) {
        //   return deductionMax.deduction[index].salary_payment_allowance_value =0
          
        // }
        console.log('deductiontemp',deductionMax);
       this.setState({
        data:list,
        
       })
       const getTemplatePartTime = (branch,empType) => {
        return {
          "branch_name":branch,
        "emp_type":empType,
        "allowance_labels":[additionMax],
        // [{"label":"Annual Award",
        // "value":0},
        // {"label":"Maintenance",
        // "value":0},{"label":"Medical Benefit",
        // "value":0},{"label":"Petrol","value":0}],
  
        "deduction_labels":[deductionMax]
      }
      }

      //  console.log(list)
       const formatD= list.length >0 ? list.reduce((r,c)=>{
            let R={...r};
            if(!R[c.branch_name]){
                R[c.branch_name]={
                  branch_name: c.branch_name,
                  empType: [ c]
                }
                // let empType1=[];
                // if (c['emp_type'] === empType.PartTime) {
                //   empType1.push(c);
                // } else empType1.push( getTemplatePartTime(c.branch_name, empType.PartTime))

                // if(c['emp_type'] === empType.Training){
                //   empType1.push(c);
                // } else empType1.push( getTemplatePartTime(c.branch_name, empType.Training));

                // if (c['emp_type'] ===empType.Permanent ) {
                //   empType1.push(c);
                // } else empType1.push( getTemplatePartTime(c.branch_name, empType.Permanent));

                // R[c.branch_name]['empType']= empType1

            }
            else {
              // let empType1=R[c.branch_name]['empType'];
              // if (c['emp_type'] === empType.PartTime) {
              //   empType1.push(c);
              // } else empType1.push( getTemplatePartTime(c.branch_name, empType.PartTime))

              // if(c['emp_type'] === empType.Training){
              //   empType1.push(c);
              // } else empType1.push( getTemplatePartTime(c.branch_name, empType.Training));

              // if (c['emp_type'] === empType.Permanent ) {
              //   empType1.push(c);
              // } else empType1.push( getTemplatePartTime(c.branch_name, empType.Permanent));

              R[c.branch_name]['empType'].push(c)
            }
            return R;
        },[]): {};
        const keys=Object.keys(formatD);
        let data = {}
        for (let index = 0; index < keys.length; index++) {
          const element = formatD[keys[index]];
          let arr=[];
          let partTime= element["empType"].find(d=>d.emp_type === empType.PartTime)
          // console.log("partTime",partTime)
          let perm= element["empType"].find(d=>d.emp_type === empType.Permanent)
          // console.log("permanent",perm)
          let train= element["empType"].find(d=>d.emp_type === empType.Training)
          // console.log("training",train)

          if(perm) arr.push(perm)
          else arr.push( getTemplatePartTime(keys[index], empType.Permanent))

          if(partTime) arr.push(partTime)
          else arr.push( getTemplatePartTime(keys[index], empType.PartTime))

          if(train) arr.push(train)
          else arr.push( getTemplatePartTime(keys[index], empType.Training))

          console.log("arr",arr)
          let AnnualAward=[];
          let AnnualAwardTotal=0;
          let MaintenanceTotal=0;
          let Maintenance=[];
          let MedicalBenefit=[];
          let MedicalBenefitTotal=0;
          let PetrolTotal=0;
          let Petrol=[];
          let IncomeTax=[];
          let IncomeTaxTotal=0;
          let Withoutpay=[];
          let WithoutpayTotal=0;
          let salaryAdvance=[];
          let salaryAdvanceTotal=0
          let ssc=[];
          let sscTotal=0;
          let staffLoan=[];
          let staffLoanTotal=0;

          // if(AnnualAward.length == 2){

          // }

          arr.forEach((v,i)=>{

            let AnnualAwardsubTotal=v.allowance_labels.filter(v1=>v1.label ==  "Annual Award");
            let MaintenancesubTotal=v.allowance_labels.filter(v1=>v1.label == "Maintenance");
            let MedicalsubTotal=v.allowance_labels.filter(v1=>v1.label == "Medical Benefit");
            let PetrolsubTotal=v.allowance_labels.filter(v1=>v1.label == "Petrol");
            let IncomeTaxsubTotal=v.deduction_labels.filter(v=>v.label == "Income Tax");
            let WithoutpaysubTotal=v.deduction_labels.filter(v=>v.label == "Leave Without Pay");
            let salaryAdvancesubTotal=v.deduction_labels.filter(v=>v.label == "Salary Advance");
            let sscsubTotal=v.deduction_labels.filter(v=>v.label == "SSC");
            let staffLoansubTotal=v.deduction_labels.filter(v=>v.label == "SSC");

            // console.log("subtotal====>",subTotal[0] && subTotal[0].value)
            AnnualAwardTotal+=parseInt(AnnualAwardsubTotal[0] && AnnualAwardsubTotal[0].value);
            MaintenanceTotal+=parseInt(MaintenancesubTotal[0] && MaintenancesubTotal[0].value);
            MedicalBenefitTotal+=parseInt(MedicalsubTotal[0] && MedicalsubTotal[0].value);
            PetrolTotal+=parseInt(PetrolsubTotal[0] && PetrolsubTotal[0].value);
            IncomeTaxTotal+=parseInt(IncomeTaxsubTotal[0] && IncomeTaxsubTotal[0].value);
            WithoutpayTotal+=parseInt(WithoutpaysubTotal[0] && WithoutpaysubTotal[0].value);
            salaryAdvanceTotal+=parseInt(salaryAdvancesubTotal[0] && salaryAdvancesubTotal[0].value);
            sscTotal+=parseInt(sscsubTotal[0] && sscsubTotal[0].value);
            staffLoanTotal+=parseInt(staffLoansubTotal[0] && staffLoansubTotal[0].value);

            AnnualAward[i]=AnnualAwardTotal;
            Maintenance[i]=MaintenanceTotal;
            MedicalBenefit[i]=MedicalBenefitTotal;
            Petrol[i]=PetrolTotal;
            IncomeTax[i]=IncomeTaxTotal;
            Withoutpay[i]=WithoutpayTotal;
            salaryAdvance[i]=salaryAdvanceTotal;
            ssc[i]=sscTotal;
            staffLoan[i]=staffLoanTotal;

            this.setState({
              annaulAwardTotal:AnnualAwardTotal,
              maintenanceTotal:MaintenanceTotal,
              petrolTotal:PetrolTotal,
              medicalTotal:MedicalBenefitTotal,
              withoutpayTotal:WithoutpayTotal,
              incometaxTotal:IncomeTaxTotal,
              salaryTotal:salaryAdvanceTotal,
              sscTotal:sscTotal,
              staffLoanTotal:staffLoanTotal

            })
            console.log("annual award",AnnualAwardTotal)

            // console.log("v",v.allowance_labels.filter(v1=>v1.label ==  "Annual Award")[0].value)
            // v.allowance_labels.forEach((v1,k)=>{
            //   console.log("v1",v1.label == "Annual Award")

            // })
            // AnnualAward[i]=Total
              // let annual= v.allowance_labels.filter(k=>k.label == "Annual Award");
              // console.log("annual",annual)
          })
          console.log("annual award total",AnnualAward)

          arr.unshift( {
            "branch_name":keys[index],
            "emp_type":empType.All,
            "allowance_labels":
            [{"label":"Annual Award",
            "value":this.state.annaulAwardTotal},
            {"label":"Maintenance",
            "value":this.state.maintenanceTotal},{"label":"Medical Benefit",
            "value":this.state.medicalTotal},{"label":"Petrol","value":0}],
            "deduction_labels":[{"label":"Income Tax",
            "value":this.state.incometaxTotal},{"label":"Leave Without Pay","value":this.state.withoutpayTotal},
            {"label":"Salary Advance","value":this.state.salaryTotal},
            {"label":"SSC","value":this.state.sscTotal},
            {"label":"Staff Loan","value":this.state.staffLoanTotal}]
          })

          // console.log(keys[index],element,arr.length)

          data[keys[index]] ={
            branch_name:keys[index],
            employeeType:arr
          }

        }

      // console.log("format data ===> ",data,typeof(data))
      let array=Object.values(data);
      console.log("array",array)
      this.setState({
        FinalData:array
      })
      // console.log("final data",this.state.FinalData)
      //  let UniqueBranch=new Set();
      //   list.forEach(v=>{
      //     UniqueBranch.add(v.branch_name)
      //   })
      //   let uniqueMap=new Map();
      //   UniqueBranch.forEach(v=>{
      //     uniqueMap.set(v,{
      //       "branch_name":v,
      //       "EmpType":[
      //         {
      //           "emp_type": "Permanent",
      //             "allowance_labels":[
      //             {"label": "Annual Award", "value": 0},
      //             {"label": "Maintenance", "value": 0},
      //             {"label": "Medical Benefit", "value": 0},
      //             {"label": "Petrol", "value": 0}
      //             ],
      //             "deduction_labels":[
      //             {"label": "Income Tax", "value": 0},
      //             {"label": "Leave Without Pay", "value": 0},
      //             {"label": "Salary Advance", "value": 0},
      //             {"label": "SSC", "value": 0},
      //             {"label": "Staff Loan", "value": 0}
      //             ]
      //         },{
      //           "emp_type": "Parttime",
      //             "allowance_labels":[
      //             {"label": "Annual Award", "value": 0},
      //             {"label": "Maintenance", "value": 0},
      //             {"label": "Medical Benefit", "value": 0},
      //             {"label": "Petrol", "value": 0}
      //             ],
      //             "deduction_labels":[
      //             {"label": "Income Tax", "value": 0},
      //             {"label": "Leave Without Pay", "value": 0},
      //             {"label": "Salary Advance", "value": 0},
      //             {"label": "SSC", "value": 0},
      //             {"label": "Staff Loan", "value": 0}
      //             ]
      //         },{
      //           "emp_type": "Training",
      //             "allowance_labels":[
      //             {"label": "Annual Award", "value": 0},
      //             {"label": "Maintenance", "value": 0},
      //             {"label": "Medical Benefit", "value": 0},
      //             {"label": "Petrol", "value": 0}
      //             ],
      //             "deduction_labels":[
      //             {"label": "Income Tax", "value": 0},
      //             {"label": "Leave Without Pay", "value": 0},
      //             {"label": "Salary Advance", "value": 0},
      //             {"label": "SSC", "value": 0},
      //             {"label": "Staff Loan", "value": 0}
      //             ]
      //         }
      //       ]
      //     })
      //   })
      //   let mapValue=[...uniqueMap.values()]
      })

  }
  // handleSearchData = () => {
  //   fetch(main_url + "payroll_report/payrollWiseLocationReport/2023-03/0/0/0")
  //     .then((res) => {
  //       if (res.ok) return res.json();
  //     })
  //     .then((list) => {
  //       // let uniqueDeductiondata=new Set();
  //       // list.forEach(v=>{
  //       //   v.deduction.forEach(v1=>{
  //       //     uniqueDeductiondata.add(v1.salary_payment_deduction_label)
  //       //   })
  //       // })
  //       // console.log("unique data",uniqueDeductiondata)
  //       // let uniqueDeductionMap=new Map();
  //       // uniqueDeductiondata.forEach(v=>{
  //       //   uniqueDeductionMap.set({
  //       //     'salary_payment_deduction_label':v,
  //       //     'salary_payment_deduction_value':0
  //       //   })
  //       // })
  //       // console.log("unique map",)
  //       this.setState({
  //         dataSource: list,
  //       });
  //       let finalData =
  //         this.state.dataSource != undefined && this.state.dataSource.length > 0
  //           ? this.state.dataSource
  //           : [];
  //       let sortData = finalData.reduce((r, c) => {
  //         let R = [...r];
  //         const index = R.findIndex((v) => v.location_master_name == c.location_master_name);
  //         if (index == -1) {
  //           R.push({
  //             location_master_name: c.location_master_name,
  //             branch: [c],
  //           });
  //         } else {
  //           R[index].branch.push(c);
  //         }
  //         return R;
  //       }, []);
  //       console.log("sort data", sortData);
  //     });
  // };
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
  console.log("value in deduction is =============>", totalAdditionData);
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

                {this.state.FinalData.map((v1, k) => {
                  console.log("lenght", v1.employeeType.length);
                  return (
                    <>
                      {v1.employeeType.map((v2, k2) => {
                        console.log("k2", k2);

                        return (
                          <>
                            <tr>
                              {/* <td rowSpan={4}>{v1.branch_name}</td> */}
                              {k2 === 0 ? (
                                <td
                                  rowSpan={v1.employeeType.length}
                                  style={{ verticalAlign: "middle" }}
                                >
                                  {v1.branch_name}
                                </td>
                              ) : null}
                              <td>{v2.emp_type}</td>
                              <td>
                                {v2.allowance_labels.filter(
                                  (v1) => v1.label == "Annual Award"
                                )[0] &&
                                  v2.allowance_labels.filter(
                                    (v1) => v1.label == "Annual Award"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.allowance_labels.filter(
                                  (v1) => v1.label == "Annual Award"
                                )[0] &&
                                  v2.allowance_labels.filter(
                                    (v1) => v1.label == "Annual Award"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.allowance_labels.filter(
                                  (v1) => v1.label == "Annual Award"
                                )[0] &&
                                  v2.allowance_labels.filter(
                                    (v1) => v1.label == "Annual Award"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.allowance_labels.filter(
                                  (v1) => v1.label == "Annual Award"
                                )[0] &&
                                  v2.allowance_labels.filter(
                                    (v1) => v1.label == "Annual Award"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.allowance_labels.filter(
                                  (v1) => v1.label == "Annual Award"
                                )[0] &&
                                  v2.allowance_labels.filter(
                                    (v1) => v1.label == "Annual Award"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.deduction_labels.filter(
                                  (v1) => v1.label == "Income Tax"
                                )[0] &&
                                  v2.deduction_labels.filter(
                                    (v1) => v1.label == "Income Tax"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.deduction_labels.filter(
                                  (v1) => v1.label == "Income Tax"
                                )[0] &&
                                  v2.deduction_labels.filter(
                                    (v1) => v1.label == "Income Tax"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.deduction_labels.filter(
                                  (v1) => v1.label == "Income Tax"
                                )[0] &&
                                  v2.deduction_labels.filter(
                                    (v1) => v1.label == "Income Tax"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.allowance_labels.filter(
                                  (v1) => v1.label == "Maintenance"
                                )[0] &&
                                  v2.allowance_labels.filter(
                                    (v1) => v1.label == "Maintenance"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.allowance_labels.filter(
                                  (v1) => v1.label == "Petrol"
                                )[0] &&
                                  v2.allowance_labels.filter(
                                    (v1) => v1.label == "Petrol"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.deduction_labels.filter(
                                  (v1) => v1.label == "Income Tax"
                                )[0] &&
                                  v2.deduction_labels.filter(
                                    (v1) => v1.label == "Income Tax"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.deduction_labels.filter(
                                  (v1) => v1.label == "Income Tax"
                                )[0] &&
                                  v2.deduction_labels.filter(
                                    (v1) => v1.label == "Income Tax"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.deduction_labels.filter(
                                  (v1) => v1.label == "Income Tax"
                                )[0] &&
                                  v2.deduction_labels.filter(
                                    (v1) => v1.label == "Income Tax"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.allowance_labels.filter(
                                  (v1) => v1.label == "Medical Benefit"
                                )[0] &&
                                  v2.allowance_labels.filter(
                                    (v1) => v1.label == "Medical Benefit"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.deduction_labels.filter(
                                  (v1) => v1.label == "Leave Without Pay"
                                )[0] &&
                                  v2.deduction_labels.filter(
                                    (v1) => v1.label == "Leave Without Pay"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.deduction_labels.filter(
                                  (v1) => v1.label == "Salary Advance"
                                )[0] &&
                                  v2.deduction_labels.filter(
                                    (v1) => v1.label == "Salary Advance"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.deduction_labels.filter(
                                  (v1) => v1.label == "Income Tax"
                                )[0] &&
                                  v2.deduction_labels.filter(
                                    (v1) => v1.label == "Income Tax"
                                  )[0].value}
                              </td>
                              <td>
                                {v2.deduction_labels.filter(
                                  (v1) => v1.label == "Income Tax"
                                )[0] &&
                                  v2.deduction_labels.filter(
                                    (v1) => v1.label == "Income Tax"
                                  )[0].value}
                              </td>

                              {k2 === 0 ? (
                                <td
                                  rowSpan={v1.employeeType.length}
                                  style={{ verticalAlign: "middle" }}
                                >
                                  232133
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
