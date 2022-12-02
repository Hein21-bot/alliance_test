import React, { Component } from "react";
import { main_url } from '../../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import Select from 'react-select';
import DatePicker from 'react-datetime';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import moment from "moment";
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');
const  empType={
  PartTime: "Part Time",
  Permanent: "Permanent",
  Training: "Training",
  All:"All"
};
class PayrollSummaryReportWithLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {

      annaulAwardTotal:0,
      petrolTotal:0,
      maintenanceTotal:0,
      medicalTotal:0,
      incometaxTotal:0,
      withoutpayTotal:0,
      salaryTotal:0,
      sscTotal:0,
      staffLoanTotal:0,
      date:moment().format('YYYY-MM-DD'),
      regionList: null,
      FinalData:[],
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
      employeeIdList:[],
      EmployeeStatus:[
        {
            value:1,label:'Permanent'
        },
        {
            value:2,label:'Part-Time'
        },
        {
            value:3,label:'Training'
        }
      ]
    }
  }

  async componentDidMount() {
    this.$el = $(this.el);
    this.setState(
      {
        dataSource: this.props.data,

      },
      () => {
        
      }

    );
    this.getRegionList();
    this.getDepartmentList();
    this.getBranchList();
   
   
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
    const getTemplatePartTime = (branch,empType) => {
      return {
        "branch_name":branch,
      "emp_type":empType,
      "allowance_labels":
      [{"label":"Annual Award",
      "value":0},
      {"label":"Maintenance",
      "value":0},{"label":"Medical Benefit",
      "value":0},{"label":"Petrol","value":0}],
      "deduction_labels":[{"label":"Income Tax",
      "value":0},{"label":"Leave Without Pay","value":0},
      {"label":"Salary Advance","value":0},
      {"label":"SSC","value":0},
      {"label":"Staff Loan","value":0}]
    }
    }
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
    fetch(main_url + "payroll_report/payrollWiseReport/2022-11/0/0/0")
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
       this.setState({
        data:list
       })
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
  render() {
  
    return (
      <div>
        <div className="row  white-bg dashboard-header">
        <h3 className="" style={{paddingLeft:"10px"}}>Payroll Summary Report With Locatin Wise/Status Wise</h3>
        <div style={{overflow:'scroll'}}>
        <ReactHTMLTableToExcel 
                    className="btn-excel"
                    table="reg_wise_staff"
                    filename="Payroll Summary Report With Location Wise/Status Wise"
                    buttonText="Excel"
                    sheet="Sheet"
                    />
          <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
          <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.date}
                            onChange={this.handleSelectedDate}
                            timeFormat={false}
                        />
          <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginRight:10,
                  marginLeft:10
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
            <Select
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
              placeholder="Region"
              options={this.state.regionList}
              onChange={this.handleSelectedRegion}
              value={this.state.selected_region}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            
             <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                 
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
            
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
          </div>
          <table className="table table-bordered" id="reg_wise_staff" style={{overflow:'scroll'}}>
              <thead>
                <tr style={{overflow:'scroll'}}>
                    <th>Region/Branch</th>
                    <th>Employee Status</th>
                     <th>Gross Salary</th>
                     <th>Deductins(+)/Additions(-)</th>
                     <th>Salary After Deductions/Additions</th>
                     <th>SSC(Employer 3%)</th>
                     <th>SSC(Employee 2%)</th>
                     <th>Income Tax</th>
                     <th>Net Salary Paid</th>
                     <th>Total Gross Salary</th>
                     <th>Maintenance</th>
                     <th>Petrol</th>
                     <th>Backpay</th>
                     <th>Allowance</th>
                     <th>Income Tax Adjust</th>
                     <th>Medical Fund</th>
                     <th>Deduct for using office cycle</th>
                    <th>Salary Cut(Tablet)</th>
                    <th>Deduction of Loan</th>
                      <th>Total</th>
                       <th>Grand Total</th>
                </tr>
              </thead>
              <tbody>
                {/* <tr>
                    <td rowSpan={4}>All Alliance</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td rowSpan={4}>5600</td>
                </tr>
                <tr>
                   
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                   
                </tr>
                <tr>
                    
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    
                </tr>
                <tr>
                   
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    
                </tr> */}
                {
                  this.state.FinalData.map((v1,k)=>{
                    console.log("lenght",v1.employeeType.length)
                    return(
                     
                      <>
                          
                          {
                            v1.employeeType.map((v2,k2)=>{
                              console.log("k2",k2)
                              
                                return(
                                  
                                  <>
                                  <tr>
                                  {/* <td rowSpan={4}>{v1.branch_name}</td> */}
                                  {k2 === 0 ? <td rowSpan={v1.employeeType.length} style={{verticalAlign:'middle'}}>{v1.branch_name}</td> : null}
                                    <td>{v2.emp_type}</td>
                                    <td>{v2.allowance_labels.filter(v1=>v1.label ==  "Annual Award")[0] && v2.allowance_labels.filter(v1=>v1.label ==  "Annual Award")[0].value}</td>
                                    <td>{v2.allowance_labels.filter(v1=>v1.label ==  "Annual Award")[0] && v2.allowance_labels.filter(v1=>v1.label ==  "Annual Award")[0].value}</td>
                                    <td>{v2.allowance_labels.filter(v1=>v1.label ==  "Annual Award")[0] && v2.allowance_labels.filter(v1=>v1.label ==  "Annual Award")[0].value}</td>
                                    <td>{v2.allowance_labels.filter(v1=>v1.label ==  "Annual Award")[0] && v2.allowance_labels.filter(v1=>v1.label ==  "Annual Award")[0].value}</td>
                                    <td>{v2.allowance_labels.filter(v1=>v1.label ==  "Annual Award")[0] && v2.allowance_labels.filter(v1=>v1.label ==  "Annual Award")[0].value}</td>
                                    <td>{v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0] && v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0].value}</td>
                                    <td>{v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0] && v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0].value}</td>
                                    <td>{v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0] && v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0].value}</td>
                                    <td>{v2.allowance_labels.filter(v1=>v1.label ==  "Maintenance")[0] && v2.allowance_labels.filter(v1=>v1.label ==  "Maintenance")[0].value}</td>
                                    <td>{v2.allowance_labels.filter(v1=>v1.label ==  "Petrol")[0] && v2.allowance_labels.filter(v1=>v1.label ==  "Petrol")[0].value}</td>
                                    <td>{v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0] && v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0].value}</td>
                                    <td>{v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0] && v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0].value}</td>
                                    <td>{v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0] && v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0].value}</td>
                                    <td>{v2.allowance_labels.filter(v1=>v1.label ==  "Medical Benefit")[0] && v2.allowance_labels.filter(v1=>v1.label ==  "Medical Benefit")[0].value}</td>
                                    <td>{v2.deduction_labels.filter(v1=>v1.label ==  "Leave Without Pay")[0] && v2.deduction_labels.filter(v1=>v1.label ==  "Leave Without Pay")[0].value}</td>
                                    <td>{v2.deduction_labels.filter(v1=>v1.label ==  "Salary Advance")[0] && v2.deduction_labels.filter(v1=>v1.label ==  "Salary Advance")[0].value}</td>
                                    <td>{v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0] && v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0].value}</td>
                                    <td>{v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0] && v2.deduction_labels.filter(v1=>v1.label ==  "Income Tax")[0].value}</td>
                                    
                                    {k2 === 0 ? <td rowSpan={v1.employeeType.length} style={{verticalAlign:'middle'}}>232133</td> : null}
                                    </tr>
                                </>
                                )
                            })
                          }
                          
                      </>
                    )
                  })
                }
              </tbody>
          </table>
        </div>
      </div>
      </div>
    )
  }
}
export default PayrollSummaryReportWithLocation;