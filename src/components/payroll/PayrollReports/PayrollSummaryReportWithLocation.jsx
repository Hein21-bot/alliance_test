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
      deductionMax:null,
      AllDetail:{},
      PermanentDetail:{},
      PartTimeDetail:{},
      TrainingDetail:{},
      grandTotal:0
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
    // this.getPayrollReportHeader();

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
  const Date = moment(this.state.date).format("YYYY-MM");
    
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

  handleSearchData = () => {
    this.getPayrollReportHeader();
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
        "addition": (additionTemp!= undefined && additionTemp.length > 0) ? [...additionTemp] : [],
        "total_amount": 0,
        "gross_salary": 0,
        "deduction_addition_data": 0,
        "after_deduction_or_addition": 0,
        "deduction":(deductionTemp!= undefined && deductionTemp.length > 0) ? [...deductionTemp] : [],
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
        // console.log('addition temp is ==========>', additionTemp)
        return {
       
        "name":empType,
        "empType":[{
          "addition": (additionTemp!= undefined && additionTemp.length > 0) ? [...additionTemp] : [],
          "total_amount": 0,
          "gross_salary": 0,
          "deduction_addition_data": 0,
          "after_deduction_or_addition": 0,
          "deduction":(deductionTemp!= undefined && deductionTemp.length > 0) ? [...deductionTemp] : [],
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
        }]
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
      // console.log("formatdata",formatData)
      let tempArr=[];
        let Permanent=formatData.filter((d)=>d.name == 'Permanent') && formatData.filter((d)=>d.name == 'Permanent')[0]
        // console.log("permanent",Permanent);
        let PartTime=formatData.filter((d)=>d.name == 'Part Time') && formatData.filter((d)=>d.name == 'Part Time')[0]
        // console.log("part time",PartTime);
        let Training=formatData.filter((d)=>d.name == 'Training') && formatData.filter((d)=>d.name == 'Training')[0]
        // console.log('Training',Training);
        if(Permanent){
            tempArr.push(Permanent)
        }else{
          tempArr.push( getAllTemplate(empType.Permanent))
        }
        if(PartTime){
          tempArr.push(PartTime)
      }else{
        tempArr.push( getAllTemplate(empType.PartTime))
      }
      if(Training){
        tempArr.push(Training)
    }else{
      tempArr.push( getAllTemplate(empType.Training))
    }
      // formatData.map((v)=>{
        
      // })
      // console.log("array======>",tempArr)
      let DetailArray=[];
      let DetailListAllowance=[];
      let DetailArrAllowance=[];
      tempArr.map((v,i)=>{
        v.empType.map((v1,i1)=>{
          v1.addition && v1.addition.length > 0 && v1.addition.forEach(aa=>{
            // console.log("for each addition",aa)
            // console.log("label=====>",DetailListAllowance[aa.salary_payment_allowance_label])
            // console.log("ma thi bu====>",DetailListAllowance[aa.salary_payment_allowance_label]);
            if(!DetailListAllowance[aa.salary_payment_allowance_label]){
              DetailListAllowance[aa.salary_payment_allowance_label] = 0;
            }
            DetailListAllowance[aa.salary_payment_allowance_label] += aa.salary_payment_allowance_value;
          })
          // console.log("Detail list allowance",DetailListAllowance)
          DetailArray.push(DetailListAllowance)

        })
      })
      // console.log("detail array",DetailArray)
      let listAllAllowance = [];
          let arrAllAllowance = []
          list.map(v=>{
            
            v.addition.forEach(additionObj => {
              // console.log("addition salary payment",listAllAllowance[additionObj.salary_payment_allowance_label])
              if(!listAllAllowance[additionObj.salary_payment_allowance_label]){
                listAllAllowance[additionObj.salary_payment_allowance_label] = 0;
              }
              listAllAllowance[additionObj.salary_payment_allowance_label] += additionObj.salary_payment_allowance_value;
            });
          
          })
          // console.log("list all allowance",listAllAllowance)
          for (let key in listAllAllowance) {
            arrAllAllowance.push({"salary_payment_allowance_label":key, salary_payment_allowance_value: listAllAllowance[key]});
          }

          let listAllDeduction = [];
          let arrAllDeduction = [];
          list.map(v=>{
           
            v.deduction.forEach(deductionObj => {
              if(!listAllDeduction[deductionObj.salary_payment_deduction_label]){
                listAllDeduction[deductionObj.salary_payment_deduction_label] = 0;
              }
              listAllDeduction[deductionObj.salary_payment_deduction_label] += deductionObj.salary_payment_deduction_value;
            });
          })
          for (let key in listAllDeduction) {
            arrAllDeduction.push({"salary_payment_deduction_label":key, salary_payment_deduction_value: listAllDeduction[key]});
          }
          let filterPermanent=tempArr.filter(v=>v.name == 'Permanent')
          // console.log('filter permanent',filterPermanent)
          let listPermanentAllowance = [];
          let arrPermanentAllowance = []
          filterPermanent[0].empType.map(v=>{
            
            v.addition.forEach(additionObj => {
              if(!listPermanentAllowance[additionObj.salary_payment_allowance_label]){
                listPermanentAllowance[additionObj.salary_payment_allowance_label] = 0;
              }
              listPermanentAllowance[additionObj.salary_payment_allowance_label] += additionObj.salary_payment_allowance_value;
            });
          
          })
          for (let key in listPermanentAllowance) {
            arrPermanentAllowance.push({"salary_payment_allowance_label":key, salary_payment_allowance_value: listPermanentAllowance[key]});
          }

          let listPermanentDeduction = [];
          let arrPermanentDeduction = [];
          filterPermanent[0].empType.map(v=>{
           
            v.deduction.forEach(deductionObj => {
              if(!listPermanentDeduction[deductionObj.salary_payment_deduction_label]){
                listPermanentDeduction[deductionObj.salary_payment_deduction_label] = 0;
              }
              listPermanentDeduction[deductionObj.salary_payment_deduction_label] += deductionObj.salary_payment_deduction_value;
            });
          })
          for (let key in listPermanentDeduction) {
            arrPermanentDeduction.push({"salary_payment_deduction_label":key, salary_payment_deduction_value: listPermanentDeduction[key]});
          }

          let filterPartTime=tempArr.filter(v=>v.name == 'Part Time')
          let listPartTimeAllowance = [];
          let arrPartTimeAllowance = []
          filterPartTime[0].empType.map(v=>{
            
            v.addition.forEach(additionObj => {
              if(!listPartTimeAllowance[additionObj.salary_payment_allowance_label]){
                listPartTimeAllowance[additionObj.salary_payment_allowance_label] = 0;
              }
              listPartTimeAllowance[additionObj.salary_payment_allowance_label] += additionObj.salary_payment_allowance_value;
            });
          
          })
          for (let key in listPartTimeAllowance) {
            arrPartTimeAllowance.push({"salary_payment_allowance_label":key, salary_payment_allowance_value: listPartTimeAllowance[key]});
          }

          let listPartTimeDeduction = [];
          let arrPartTimeDeduction = [];
          filterPartTime[0].empType.map(v=>{
           
            v.deduction.forEach(deductionObj => {
              if(!listPartTimeDeduction[deductionObj.salary_payment_deduction_label]){
                listPartTimeDeduction[deductionObj.salary_payment_deduction_label] = 0;
              }
              listPartTimeDeduction[deductionObj.salary_payment_deduction_label] += deductionObj.salary_payment_deduction_value;
            });
          })
          for (let key in listPartTimeDeduction) {
            arrPartTimeDeduction.push({"salary_payment_deduction_label":key, salary_payment_deduction_value: listPartTimeDeduction[key]});
          }


          let filterTraining=tempArr.filter(v=>v.name == 'Training')
          // console.log("filter training",filterTraining);
          let listTrainingAllowance = [];
          let arrTrainingAllowance = []
          filterTraining[0].empType.map(v=>{
            
            v.addition.forEach(additionObj => {
              if(!listTrainingAllowance[additionObj.salary_payment_allowance_label]){
                listTrainingAllowance[additionObj.salary_payment_allowance_label] = 0;
              }
              listTrainingAllowance[additionObj.salary_payment_allowance_label] += additionObj.salary_payment_allowance_value;
            });
          
          })
          for (let key in listTrainingAllowance) {
            arrTrainingAllowance.push({"salary_payment_allowance_label":key, salary_payment_allowance_value: listTrainingAllowance[key]});
          }

          let listTrainingDeduction = [];
          let arrTrainingDeduction = [];
          filterTraining[0].empType.map(v=>{
           
            v.deduction.forEach(deductionObj => {
              if(!listTrainingDeduction[deductionObj.salary_payment_deduction_label]){
                listTrainingDeduction[deductionObj.salary_payment_deduction_label] = 0;
              }
              listTrainingDeduction[deductionObj.salary_payment_deduction_label] += deductionObj.salary_payment_deduction_value;
            });
          })
          for (let key in listTrainingDeduction) {
            arrTrainingDeduction.push({"salary_payment_deduction_label":key, salary_payment_deduction_value: listTrainingDeduction[key]});
          }
          
        let PermanentDetail={
          'name':'Permanent',
          'empType':[{
            "name":'Permanent',
          'addition':[...arrPermanentAllowance],
          'deduction':[...arrPermanentDeduction],
          "total_amount": filterPermanent[0].empType.reduce((p,c)=>{return p+c.total_amount},0),
          "gross_salary":filterPermanent[0].empType.reduce((p,c)=>{return p+c.gross_salary},0),
          "deduction_addition_data":filterPermanent[0].empType.reduce((p,c)=>{return p+c.deduction_addition_data},0),
          "after_deduction_or_addition":filterPermanent[0].empType.reduce((p,c)=>{return p+c.after_deduction_or_addition},0),
          "ssc":[
            {
            "Employer_2":filterPermanent[0].empType.reduce((p,c)=>{
              if(c.ssc.length > 0){
                return p+c.ssc[0].Employer_2
              }
            },0),
            "Employee_3":filterPermanent[0].empType.reduce((p,c)=>{
              if(c.ssc.length >0){
                return p+c.ssc[0].Employee_3
              }
              
            },0)
            }
            ],
            "net_salary":filterPermanent[0].empType.reduce((p,c)=>{return p+c.net_salary},0),
            "total_gross_salary":filterPermanent[0].empType.reduce((p,c)=>{return p+c.total_gross_salary},0),
            "deductionTotal":filterPermanent[0].empType.reduce((p,c)=>{return p+c.deductionTotal},0),
            "additionTotal":filterPermanent[0].empType.reduce((p,c)=>{return p+c.additionTotal},0),
            "total":filterPermanent[0].empType.reduce((p,c)=>{return p+c.total},0)
          }]
        }
        // console.log("Permanent detail",PermanentDetail)
        let PartTimeDetail={
          'name':'Part Time',
          'empType':[{
            "name":'Part Time',
          'addition':[...arrPartTimeAllowance],
          'deduction':[...arrPartTimeDeduction],
          "total_amount": filterPartTime[0].empType.reduce((p,c)=>{return p+c.total_amount},0),
          "gross_salary": filterPartTime[0].empType.reduce((p,c)=>{return p+c.gross_salary},0),
          "deduction_addition_data": filterPartTime[0].empType.reduce((p,c)=>{return p+c.deduction_addition_data},0),
          "after_deduction_or_addition": filterPartTime[0].empType.reduce((p,c)=>{return p+c.after_deduction_or_addition},0),
          "ssc":[
            {
            "Employer_2": filterPartTime[0].empType.reduce((p,c)=>{
              if(c.ssc.length > 0){
                return p+c.ssc[0].Employer_2
              }
            },0),
            "Employee_3": filterPartTime[0].empType.reduce((p,c)=>{
              if(c.ssc.length >0){
                return p+c.ssc[0].Employee_3
              }
              
            },0)
            }
            ],
            "net_salary": filterPartTime[0].empType.reduce((p,c)=>{return p+c.net_salary},0),
            "total_gross_salary": filterPartTime[0].empType.reduce((p,c)=>{return p+c.total_gross_salary},0),
            "deductionTotal": filterPartTime[0].empType.reduce((p,c)=>{return p+c.deductionTotal},0),
            "additionTotal": filterPartTime[0].empType.reduce((p,c)=>{return p+c.additionTotal},0),
            "total": filterPartTime[0].empType.reduce((p,c)=>{return p+c.total},0)
          }]
        }
        // console.log("PartTime detail",PartTimeDetail)
        // console.log("training total",arrTrainingAllowance,arrTrainingDeduction)
        let TrainingDetail={
          'name':'Training',
          'empType':[{
            "name":'Training',
          'addition':[...arrTrainingAllowance],
          'deduction':[...arrTrainingDeduction],
          "total_amount": filterTraining[0].empType.reduce((p,c)=>{return p+c.total_amount},0),
          "gross_salary": filterTraining[0].empType.reduce((p,c)=>{return p+c.gross_salary},0),
          "deduction_addition_data": filterTraining[0].empType.reduce((p,c)=>{return p+c.deduction_addition_data},0),
          "after_deduction_or_addition": filterTraining[0].empType.reduce((p,c)=>{return p+c.after_deduction_or_addition},0),
          "ssc":[
            {
            "Employer_2": filterTraining[0].empType.reduce((p,c)=>{
              if(c.ssc.length > 0){
                return p+c.ssc[0].Employer_2
              }
            },0),
            "Employee_3": filterTraining[0].empType.reduce((p,c)=>{
              if(c.ssc.length >0){
                return p+c.ssc[0].Employee_3
              }
              
            },0)
            }
            ],
            "net_salary": filterTraining[0].empType.reduce((p,c)=>{return p+c.net_salary},0),
            "total_gross_salary": filterTraining[0].empType.reduce((p,c)=>{return p+c.total_gross_salary},0),
            "deductionTotal": filterTraining[0].empType.reduce((p,c)=>{return p+c.deductionTotal},0),
            "additionTotal": filterTraining[0].empType.reduce((p,c)=>{return p+c.additionTotal},0),
            "total": filterTraining[0].empType.reduce((p,c)=>{return p+c.total},0)
          }]
        }
        // console.log("Training detail",TrainingDetail)
        let AllDetail={
          'name':'All',
          'empType':[{
            "name":'All',
          'addition':[...arrAllAllowance],
          'deduction':[...arrAllDeduction],
          "total_amount": list.reduce((p,c)=>{return p+c.total_amount},0),
          "gross_salary": list.reduce((p,c)=>{return p+c.gross_salary},0),
          "deduction_addition_data": list.reduce((p,c)=>{return p+c.deduction_addition_data},0),
          "after_deduction_or_addition": list.reduce((p,c)=>{return p+c.after_deduction_or_addition},0),
          "ssc":[
            {
            "Employer_2": list.reduce((p,c)=>{
              if(c.ssc.length > 0){
                return p+c.ssc[0].Employer_2
              }
            },0),
            "Employee_3": list.reduce((p,c)=>{
              if(c.ssc.length >0){
                return p+c.ssc[0].Employee_3
              }
              
            },0)
            }
            ],
            "net_salary": list.reduce((p,c)=>{return p+c.net_salary},0),
            "total_gross_salary": list.reduce((p,c)=>{return p+c.total_gross_salary},0),
            "deductionTotal": list.reduce((p,c)=>{return p+c.deductionTotal},0),
            "additionTotal": list.reduce((p,c)=>{return p+c.additionTotal},0),
            "total": list.reduce((p,c)=>{return p+c.total},0)
          }]
        }
        console.log("All detail",AllDetail)
        console.log('list detail is =======>', list.map(d => d.total))
        // let DetailAll=AllDetail !=undefined && AllDetail.empType && AllDetail.empType.length > 0
        // console.log("detail all",DetailAll) 
        // let DetailPermanent=PermanentDetail !=undefined && PermanentDetail.empType && PermanentDetail.empType.length > 0 
        // let DetailPartTime=PartTimeDetail !=undefined && PartTimeDetail.empType && PartTimeDetail.empType.length > 0 
        // let DetailTraining=TrainingDetail !=undefined && TrainingDetail.empType && TrainingDetail.empType.length > 0 

        let grandTotal=(AllDetail!=undefined && AllDetail.empType && AllDetail.empType.length > 0 && AllDetail.empType[0].total)
        +(PermanentDetail!=undefined && PermanentDetail.empType && PermanentDetail.empType.length > 0 && PermanentDetail.empType[0].total)+(PartTimeDetail!=undefined && PartTimeDetail.empType && PartTimeDetail.empType.length > 0 && PartTimeDetail.empType[0].total)+(TrainingDetail!=undefined && TrainingDetail.empType && TrainingDetail.empType.length > 0 && TrainingDetail.empType[0].total)
        this.setState({
          AllDetail,PermanentDetail,PartTimeDetail,TrainingDetail,grandTotal
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
          
          let listAllowance = [];
          let arrAllowance = []
          arr.map(v=>{
            
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

          let listDeduction = [];
          let arrDeduction = [];
          arr.map(v=>{
           
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
  let AllDeduction=[];
  let AllAddition=[];
  let PermanentDeduction=[];
  let PermanentAddition=[];
  let PartTimeDeduction=[];
  let PartTimeAddition=[];
  let TrainingDeduction=[];
  let TrainingAddition=[];
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
  
    this.state.AllDetail!=undefined && this.state.AllDetail.empType && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType.map((v1)=>{
       filterData.map((header) => {
         if (
           v1.deduction.filter(
             (d) => d.salary_payment_deduction_label == header.label
           ).length > 0
         ) {
           AllDeduction.push(
             v1.deduction.filter(
               (d) => d.salary_payment_deduction_label == header.label
             )[0]
           );
         }
         // Deduction.push(v.deduction.filter(d=>d.salary_payment_deduction_label == header.label).length > 0 && v.deduction.filter(d=>d.salary_payment_deduction_label == header.label)[0])
       });
     })
     this.state.AllDetail!=undefined && this.state.AllDetail.empType && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType.map((v1)=>{
      filterData.map((header) => {
        if (
          v1.addition.filter(
            (d) => d.salary_payment_allowance_label == header.label
          ).length > 0
        ) {
          AllAddition.push(
            v1.addition.filter(
              (d) => d.salary_payment_allowance_label == header.label
            )[0]
          );
        }
        // Deduction.push(v.deduction.filter(d=>d.salary_payment_deduction_label == header.label).length > 0 && v.deduction.filter(d=>d.salary_payment_deduction_label == header.label)[0])
      });
    })
    this.state.PermanentDetail!=undefined && this.state.PermanentDetail.empType && this.state.PermanentDetail.empType.length > 0 && this.state.PermanentDetail.empType.map((v1)=>{
      filterData.map((header) => {
        if (
          v1.deduction.filter(
            (d) => d.salary_payment_deduction_label == header.label
          ).length > 0
        ) {
          PermanentDeduction.push(
            v1.deduction.filter(
              (d) => d.salary_payment_deduction_label == header.label
            )[0]
          );
        }
        // Deduction.push(v.deduction.filter(d=>d.salary_payment_deduction_label == header.label).length > 0 && v.deduction.filter(d=>d.salary_payment_deduction_label == header.label)[0])
      });
    })
    this.state.PermanentDetail!=undefined && this.state.PermanentDetail.empType && this.state.PermanentDetail.empType.length > 0 && this.state.PermanentDetail.empType.map((v1)=>{
     filterData.map((header) => {
       if (
         v1.addition.filter(
           (d) => d.salary_payment_allowance_label == header.label
         ).length > 0
       ) {
         PermanentAddition.push(
           v1.addition.filter(
             (d) => d.salary_payment_allowance_label == header.label
           )[0]
         );
       }
       // Deduction.push(v.deduction.filter(d=>d.salary_payment_deduction_label == header.label).length > 0 && v.deduction.filter(d=>d.salary_payment_deduction_label == header.label)[0])
     });
   })
   this.state.PartTimeDetail!=undefined && this.state.PartTimeDetail.empType && this.state.PartTimeDetail.empType.length > 0 && this.state.PartTimeDetail.empType.map((v1)=>{
    filterData.map((header) => {
      if (
        v1.deduction.filter(
          (d) => d.salary_payment_deduction_label == header.label
        ).length > 0
      ) {
        PartTimeDeduction.push(
          v1.deduction.filter(
            (d) => d.salary_payment_deduction_label == header.label
          )[0]
        );
      }
      // Deduction.push(v.deduction.filter(d=>d.salary_payment_deduction_label == header.label).length > 0 && v.deduction.filter(d=>d.salary_payment_deduction_label == header.label)[0])
    });
  })
  this.state.PartTimeDetail!=undefined && this.state.PartTimeDetail.empType && this.state.PartTimeDetail.empType.length > 0 && this.state.PartTimeDetail.empType.map((v1)=>{
   filterData.map((header) => {
     if (
       v1.addition.filter(
         (d) => d.salary_payment_allowance_label == header.label
       ).length > 0
     ) {
       PartTimeAddition.push(
         v1.addition.filter(
           (d) => d.salary_payment_allowance_label == header.label
         )[0]
       );
     }
     // Deduction.push(v.deduction.filter(d=>d.salary_payment_deduction_label == header.label).length > 0 && v.deduction.filter(d=>d.salary_payment_deduction_label == header.label)[0])
   });
 })
 this.state.TrainingDetail!=undefined && this.state.TrainingDetail.empType && this.state.TrainingDetail.empType.length > 0 && this.state.TrainingDetail.empType.map((v1)=>{
  filterData.map((header) => {
    if (
      v1.deduction.filter(
        (d) => d.salary_payment_deduction_label == header.label
      ).length > 0
    ) {
      TrainingDeduction.push(
        v1.deduction.filter(
          (d) => d.salary_payment_deduction_label == header.label
        )[0]
      );
    }
    // Deduction.push(v.deduction.filter(d=>d.salary_payment_deduction_label == header.label).length > 0 && v.deduction.filter(d=>d.salary_payment_deduction_label == header.label)[0])
  });
})
this.state.TrainingDetail!=undefined && this.state.TrainingDetail.empType && this.state.TrainingDetail.empType.length > 0 && this.state.TrainingDetail.empType.map((v1)=>{
 filterData.map((header) => {
   if (
     v1.addition.filter(
       (d) => d.salary_payment_allowance_label == header.label
     ).length > 0
   ) {
     TrainingAddition.push(
       v1.addition.filter(
         (d) => d.salary_payment_allowance_label == header.label
       )[0]
     );
   }
   // Deduction.push(v.deduction.filter(d=>d.salary_payment_deduction_label == header.label).length > 0 && v.deduction.filter(d=>d.salary_payment_deduction_label == header.label)[0])
 });
})
    //  console.log('all deduction',AllDeduction)
     
   
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
  // console.log("total deduction data",totalDeductionData)
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
         <div style={{overflow:'scroll'}}>
         <div className="row" style={{ marginBottom:10 }}>
            <div className="col-md-12" style={{marginBottom:10}}>
            <div
              className="flex-row"
              style={{
                display: "flex",
                justifyContent: "left",
                alignItems: "center",
                
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
            </div>
            <div className="col-md-12 btn-leftend">
            <ReactHTMLTableToExcel
              className="btn-excel"
              table="reg_wise_staff"
              filename="Payroll Summary Report With Location Wise/Status Wise"
              buttonText="Excel"
              sheet="Sheet"
            />
            </div>
            
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
                  this.state.FinalData!=undefined && this.state.FinalData.length > 0  ? <>
                  <tr style={{textAlign:'center'}}>
                  <td rowSpan={4} style={{verticalAlign:'middle'}}>All Alliance</td>
                  <td style={{verticalAlign:'middle'}}>{this.state.AllDetail!=undefined && this.state.AllDetail.name}</td>
                  {
                    this.state.AllDetail!=undefined && this.state.AllDetail.empType && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType.map((v)=>{
                      return(
                        <>
                        <td style={{verticalAlign:'middle'}}>{v.gross_salary}</td>
                        <td style={{verticalAlign:'middle'}}>{v.deduction_addition_data}</td>
                        <td style={{verticalAlign:'middle'}}>{v.after_deduction_or_addition}</td>
                        <td style={{verticalAlign:'middle'}}>{v.ssc && v.ssc.length > 0 && v.ssc[0].Employer_2}</td>
                        <td style={{verticalAlign:'middle'}}>{v.ssc && v.ssc.length > 0 && v.ssc[0].Employee_3}</td>
                        {v.deduction.length > 0 ? (
                        v.deduction.filter(
                          (v1) =>
                            v1.salary_payment_deduction_label == "Income Tax"
                        ).length > 0 ? (
                          <td style={{verticalAlign:'midddle'}}>
                            {
                              v.deduction.filter(
                                (v2) =>
                                  v2.salary_payment_deduction_label ==
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
                      <td style={{verticalAlign:'middle'}}>{v.net_salary}</td>
                      <td style={{verticalAlign:'middle'}}>{v.total_gross_salary}</td>
                      {AllDeduction.map((a, i) => {
                        return (
                          <td style={{verticalAlign:'middle'}}>
                            
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
                       {AllAddition.map((a, i) => {
                        return (
                          <td style={{verticalAlign:'middle'}}>
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
                         <td style={{verticalAlign:'middle'}}>{v.total}</td>
                         <td rowSpan={4} style={{verticalAlign:'middle'}}>{v.total}</td>     
                        </>
                      )
                    })
                  }
                  {/* <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType[0].gross_salary}</td>
                  <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType[0].deduction_addition_data}</td>
                  <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType[0].after_deduction_or_addition}</td>
                  <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.statt.AllDetail.empType[0].ssc[0].Employer_2}</td>
                  <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.statt.AllDetail.empType[0].ssc[0].Employee_3}</td> */}
                </tr>
                <tr style={{textAlign:'center'}}>
                 
                  <td>{this.state.PermanentDetail!=undefined && this.state.PermanentDetail.name}</td>
                  {
                    this.state.PermanentDetail!=undefined && this.state.PermanentDetail.empType && this.state.PermanentDetail.empType.length > 0 && this.state.PermanentDetail.empType.map((v)=>{
                      return(
                        <>
                        <td style={{verticalAlign:'middle'}}>{v.gross_salary}</td>
                        <td style={{verticalAlign:'middle'}}>{v.deduction_addition_data}</td>
                        <td style={{verticalAlign:'middle'}}>{v.after_deduction_or_addition}</td>
                        <td style={{verticalAlign:'middle'}}>{v.ssc && v.ssc.length > 0 && v.ssc[0].Employer_2}</td>
                        <td style={{verticalAlign:'middle'}}>{v.ssc && v.ssc.length > 0 && v.ssc[0].Employee_3}</td>
                        {v.deduction.length > 0 ? (
                        v.deduction.filter(
                          (v1) =>
                            v1.salary_payment_deduction_label == "Income Tax"
                        ).length > 0 ? (
                          <td style={{verticalAlign:'midddle'}}>
                            {
                              v.deduction.filter(
                                (v2) =>
                                  v2.salary_payment_deduction_label ==
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
                      <td style={{verticalAlign:'middle'}}>{v.net_salary}</td>
                      <td style={{verticalAlign:'middle'}}>{v.total_gross_salary}</td>
                      {PermanentDeduction.map((a, i) => {
                        return (
                          <td style={{verticalAlign:'middle'}}>
                            
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
                       {PermanentAddition.map((a, i) => {
                        return (
                          <td style={{verticalAlign:'middle'}}>
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
                         <td style={{verticalAlign:'middle'}}>{v.total}</td>
                        </>
                      )
                    })
                  }
                  {/* <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType[0].gross_salary}</td>
                  <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType[0].deduction_addition_data}</td>
                  <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType[0].after_deduction_or_addition}</td>
                  <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.statt.AllDetail.empType[0].ssc[0].Employer_2}</td>
                  <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.statt.AllDetail.empType[0].ssc[0].Employee_3}</td> */}


                  <td></td>
                </tr>
                <tr style={{textAlign:'center'}}>
                 
                  <td style={{verticalAlign:'middle'}}>{this.state.PartTimeDetail!=undefined && this.state.PartTimeDetail.name}</td>
                  {
                    this.state.PartTimeDetail!=undefined && this.state.PartTimeDetail.empType && this.state.PartTimeDetail.empType.length > 0 && this.state.PartTimeDetail.empType.map((v)=>{
                      return(
                        <>
                        <td style={{verticalAlign:'middle'}}>{v.gross_salary}</td>
                        <td style={{verticalAlign:'middle'}}>{v.deduction_addition_data}</td>
                        <td style={{verticalAlign:'middle'}}>{v.after_deduction_or_addition}</td>
                        <td style={{verticalAlign:'middle'}}>{v.ssc && v.ssc.length > 0 && v.ssc[0].Employer_2}</td>
                        <td style={{verticalAlign:'middle'}}>{v.ssc && v.ssc.length > 0 && v.ssc[0].Employee_3}</td>
                        {v.deduction.length > 0 ? (
                        v.deduction.filter(
                          (v1) =>
                            v1.salary_payment_deduction_label == "Income Tax"
                        ).length > 0 ? (
                          <td style={{verticalAlign:'midddle'}}>
                            {
                              v.deduction.filter(
                                (v2) =>
                                  v2.salary_payment_deduction_label ==
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
                      <td style={{verticalAlign:'middle'}}>{v.net_salary}</td>
                      <td style={{verticalAlign:'middle'}}>{v.total_gross_salary}</td>
                      {PartTimeDeduction.map((a, i) => {
                        return (
                          <td style={{verticalAlign:'middle'}}>
                            
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
                       {PartTimeAddition.map((a, i) => {
                        return (
                          <td style={{verticalAlign:'middle'}}>
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
                         <td style={{verticalAlign:'middle'}}>{v.total}</td>
                        </>
                      )
                    })
                  }
                  {/* <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType[0].gross_salary}</td>
                  <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType[0].deduction_addition_data}</td>
                  <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType[0].after_deduction_or_addition}</td>
                  <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.statt.AllDetail.empType[0].ssc[0].Employer_2}</td>
                  <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.statt.AllDetail.empType[0].ssc[0].Employee_3}</td> */}


                  <td></td>
                </tr>
                <tr style={{textAlign:'center'}}>
                 
                 <td>{this.state.TrainingDetail!=undefined && this.state.TrainingDetail.name}</td>
                 {
                   this.state.TrainingDetail!=undefined && this.state.TrainingDetail.empType && this.state.TrainingDetail.empType.length > 0 && this.state.TrainingDetail.empType.map((v)=>{
                     return(
                       <>
                       <td>{v.gross_salary}</td>
                       <td>{v.deduction_addition_data}</td>
                       <td>{v.after_deduction_or_addition}</td>
                       <td>{v.ssc && v.ssc.length > 0 && v.ssc[0].Employer_2}</td>
                       <td>{v.ssc && v.ssc.length > 0 && v.ssc[0].Employee_3}</td>
                       {v.deduction.length > 0 ? (
                       v.deduction.filter(
                         (v1) =>
                           v1.salary_payment_deduction_label == "Income Tax"
                       ).length > 0 ? (
                         <td style={{verticalAlign:'midddle'}}>
                           {
                             v.deduction.filter(
                               (v2) =>
                                 v2.salary_payment_deduction_label ==
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
                     <td>{v.net_salary}</td>
                     <td>{v.total_gross_salary}</td>
                     {TrainingDeduction.map((a, i) => {
                       return (
                         <td style={{verticalAlign:'middle'}}>
                           
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
                    
                      {TrainingAddition.map((a, i) => {
                       return (
                         <td style={{verticalAlign:'middle'}}>
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
                        <td style={{verticalAlign:'middle'}}>{v.total}</td>
                       </>
                     )
                   })
                 }
                 {/* <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType[0].gross_salary}</td>
                 <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType[0].deduction_addition_data}</td>
                 <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.state.AllDetail.empType[0].after_deduction_or_addition}</td>
                 <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.statt.AllDetail.empType[0].ssc[0].Employer_2}</td>
                 <td>{this.state.AllDetail.empType!=undefined && this.state.AllDetail.empType.length > 0 && this.statt.AllDetail.empType[0].ssc[0].Employee_3}</td> */}


                 <td></td>
               </tr>
                  </> : null
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
