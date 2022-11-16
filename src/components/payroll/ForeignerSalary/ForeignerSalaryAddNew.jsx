import React, { Component } from "react";
import {
  main_url,
  stopSaving,
  startSaving,
  getUserInfo,
} from "../../../utils/CommonFunction";
import "react-toastify/dist/ReactToastify.min.css";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import DatePicker from "react-datetime";
import {
  getUserId,
  validate,
  getBranch,
  alertText,
} from "../../../utils/CommonFunction";
import Select from "react-select";
const $ = require("jquery");
var form_validate = true;
var saveBtn = false;

export default class ForeignerSalaryAddNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      userInfo: {},
      addNewData: {
        exchangeRate:0,
        requestMonth: new Date(),
        lastWorkingDay: new Date(),
        grossSalary: null,
        deductionOrAddition: "",
        salaryAfterDorA: 0,
        ssc3: 0,
        ssc2: 0,
        incomeTax: null,
        maintenance: null,
        petrol: null,
        totalSalary: 0,
        reason: "",
        atmOrCash: 0,
        exitStatus: 0,
        houseAllowance:0,
        backPay:0,
        allowance:0,
        incomeTax_$:0,
        incomeTax_MMK:0,
        annualAward:0,
        medicalFund:0,
        motorBikeUse:0,
        salaryCut:0,
        deductionOfLoan:0,
        netSalaryPaid:0,
        totalGrossSalary:0
        
      },
      dataSource: [],
      attachment: [],
      newDoc: [],
      employeeIdList:null,
      selectedEmployeeId:null,
      DetailUser:null
    };
  }

  componentDidUpdate() {
    if (!form_validate) validate("check_form");
  }

  async componentDidMount() {
    let that = this;
    let id = await getUserId("user_info");
    let branch = await getBranch();
    let userInfo = await getUserInfo(id);
    this.getEmployeeCodeList()
    this.setState({
      branch: branch,
      userId: id,
      userInfo: userInfo[0],
    });
    if (this.props.id) {
        fetch(`${main_url}employee/getDetailUser/${this.props.id}`)
          .then((res) => {
            if (res.ok) return res.json();
          })
          .then((data) => {
            if (data.length > 0) {
              this.getData(this.props.id);
              this.setState({ tableEdit: true, tableView: false });
  
  
            }
          });
      }
    $(document).on("click", "#toEdit", function () {
      var data = $(this).find("#edit").text();
      data = $.parseJSON(data);
      console.log(data);

      // let newData = that.state.dataSource;
      // let editData = newData[data];
      // newData.splice(data, 1);
      // that.setState(
      //   {
      //     dataSource: newData,
      //     addNewData: {
      //       requestMonth: editData.request_month,
      //       exchangeRate:editData.exchangeRate,
      //       lastWorkingDay: editData.last_working_day,
      //       grossSalary: editData.gross_salary,
      //       deductionOrAddition: editData.deduction_or_addition,
      //       salaryAfterDorA: editData.salary_after_deduction_or_addition,
      //       ssc3: editData.ssc3,
      //       ssc2: editData.ssc2,
      //       incomeTax: editData.income_tax,
      //       maintenance: editData.maintenance,
      //       petrol: editData.petrol,
      //       totalSalary: editData.totalSalary,
      //       reason: editData.reason,
      //       atmOrCash: editData.atm_or_cash,
      //       exitStatus: editData.exit_status,
      //       houseAllowance:editData.houseAllowance,
      //       backPay:editData.backPay,
      //       allowance:editData.allowance,
      //       annualAward:editData.annualAward,
      //       medicalFund:editData.medicalFund,
      //       motorBikeUse:editData.motorBikeUse,
      //       salaryCut:editData.salaryCut,
      //       totalGrossSalary:editData.totalGrossSalary
            
      //     },
      //   },
      //   () => that.setDataTable(newData)
      // );
    });
    $(document).on("click", "#toRemove", function () {
      var data = $(this).find("#remove").text();
      data = $.parseJSON(data);

      let newData = that.state.dataSource;
      newData.splice(data, 1);
      that.setState(
        {
          dataSource: newData,
        },
        () => that.setDataTable(newData)
      );
    });
  }

  onRequestMonthChange = (e) => {
    const newData = this.state.addNewData;
    newData.requestMonth = e;
    this.setState({ addNewData: newData });
  };

  onLastWorkingDay = (e) => {
    const newData = this.state.addNewData;
    newData.lastWorkingDay = e;
    this.setState({ addNewData: newData });
  };

  onGrossSalaryChange = (e) => {
    let newValue = parseFloat(e.target.value);
    const newData = this.state.addNewData;
    newData.salaryAfterDorA =
      newValue + parseFloat(newData.deductionOrAddition);
    newData.grossSalary = newValue;
    newData.ssc3 = newData.salaryAfterDorA * 0.03;
    newData.ssc2 = newData.salaryAfterDorA * 0.02;
    newData.totalSalary =
      newData.salaryAfterDorA -
      newData.ssc2 -
      newData.incomeTax +
      newData.maintenance +
      newData.petrol;
    this.setState({ addNewData: newData });
  };
  allowanceChange=(e)=>{
    const newData = this.state.addNewData;
    newData.allowance = e.target.value;
    this.setState({ addNewData: newData });
  }

  onDeductionOrAddition = (e) => {
    let newValue = e.target.value;
    const newData = this.state.addNewData;
    newData.salaryAfterDorA = newData.grossSalary + parseFloat(newValue);
    newData.deductionOrAddition = newValue;
    newData.ssc3 = newData.salaryAfterDorA * 0.03;
    newData.ssc2 = newData.salaryAfterDorA * 0.02;
    newData.totalSalary =
      newData.salaryAfterDorA -
      newData.ssc2 -
      newData.incomeTax +
      newData.maintenance +
      newData.petrol;
    this.setState({ addNewData: newData });
  };

  onIncomeTax$Change = (e) => {
    const newData = this.state.addNewData;
    newData.incomeTax_$ = e.target.value;
    newData.netSalaryPaid=newData.salaryAfterDorA-newData.incomeTax_$;
    newData.incomeTax_MMK=newData.exchangeRate*newData.incomeTax_$;
    this.setState({ addNewData: newData });
  };
  // onIncomeTaxMMKChange=(e)=>{
  //   const newData = this.state.addNewData;
  //   newData.incomeTax_MMK = e.target.value;
  //   this.setState({ addNewData: newData });
  // }

  onMaintenanceChange = (e) => {
    let newValue = parseFloat(e.target.value);
    const newData = this.state.addNewData;
    newData.maintenance = newValue;
    newData.totalSalary =
      newData.salaryAfterDorA -
      newData.ssc2 -
      newData.incomeTax +
      newData.maintenance +
      newData.petrol;
    this.setState({ addNewData: newData });
  };

  onPetrolChange = (e) => {
    let newValue = parseFloat(e.target.value);
    const newData = this.state.addNewData;
    newData.petrol = newValue;
    newData.totalSalary =
      newData.salaryAfterDorA -
      newData.ssc2 -
      newData.incomeTax +
      newData.maintenance +
      newData.petrol;
    this.setState({ addNewData: newData });
  };

  onReasonChange = (e) => {
    const newData = this.state.addNewData;
    newData.reason = e.target.value;
    this.setState({ addNewData: newData });
  };

  onRadioChange = (e) => {
    const newData = this.state.addNewData;
    newData.atmOrCash = parseInt(e.target.value);
    this.setState({ addNewData: newData });
  };

  handleChangeExitStatus = (e) => {
    const newData = this.state.addNewData;
    newData.exitStatus = e.target.value;
    this.setState({ addNewData: newData });
  };
  handleAnnualAward=(e)=>{
    const newData = this.state.addNewData;
    newData.annualAward = e.target.value;
    this.setState({ addNewData: newData });
  }
  handleMedicalFund=(e)=>{
    const newData = this.state.addNewData;
    newData.medicalFund = e.target.value;
    this.setState({ addNewData: newData });
  }
  handleMotorBikeUse=(e)=>{
    const newData = this.state.addNewData;
    newData.motorBikeUse = e.target.value;
    this.setState({ addNewData: newData });
  }
  handleSalaryCut=(e)=>{
    const newData = this.state.addNewData;
    newData.salaryCut = e.target.value;
    this.setState({ addNewData: newData });
  }
  handleDeductionOfLoan=(e)=>{
    const newData = this.state.addNewData;
    newData.deductionOfLoan = e.target.value;
    this.setState({ addNewData: newData });
  }
  handleTotalSalary=(e)=>{
    const newData = this.state.addNewData;
    newData.totalSalary = e.target.value;
    this.setState({ addNewData: newData });
  }

  removeNewDocument(index, event) {
    var array = this.state.newDoc;
    array.splice(index, 1);
    this.setState({
      newDoc: array,
    });
  }
  getEmployeeCodeList() {
    fetch(`${main_url}employee/getEmployeeCode`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          employeeIdList: list.map((v) => ({
            ...v,
            label: v.employee_code,
            value: v.user_id,
          })),
        });
      });
  }
  exChangeRate=(event)=>{
    const newData = this.state.addNewData;
    newData.exchangeRate = event.target.value;
    this.setState({ addNewData: newData });
  }
  handleEmployeeId=(e)=>{
    console.log(e)
    
    if (e) {
        fetch(`${main_url}employee/getDetailUser/${e.user_id}`)
          .then((res) => {
            if (res.ok) return res.json();
          })
          .then((data) => {
            this.setState({
                DetailUser:data
            })
            // if (data.length > 0) {
            //   this.getData(this.props.id);
            //   this.setState({ tableEdit: true, tableView: false });
  
  
            // }
          });
      }

    this.setState({
        selectedEmployeeId:e
    })
  }
  addData = (e) => {
    const { userInfo } = this.state;
    console.log("userInfo ===>", userInfo);
    if (validate("add_check_form")) {
      var data = [...this.state.dataSource];
      let newData = { ...this.state.addNewData };
      let tempData = {};
      tempData.request_month = newData.requestMonth;
      tempData.exchangeRate=newData.exchangeRate;
      tempData.employment_id = this.state.DetailUser[0].employment_id;
      tempData.fullname = this.state.DetailUser[0].employee_name;
      tempData.designations = this.state.DetailUser[0].designations;
      tempData.gross_salary = this.state.DetailUser[0].basic_salary;
      tempData.deduction_or_addition = newData.deductionOrAddition;
      tempData.salary_after_deduction_or_addition = newData.salaryAfterDorA;
      tempData.ssc3 = newData.ssc3;
      tempData.ssc2 = newData.ssc2;
      tempData.income_tax_$ = newData.incomeTax_$;
      tempData.incomeTax_MMK=newData.incomeTax_MMK;
      tempData.netSalaryPaid=newData.netSalaryPaid;
      tempData.houseAllowance=newData.houseAllowance;
      tempData.totalGrossSalary=newData.totalGrossSalary
      tempData.maintenance = newData.maintenance;
      tempData.petrol = newData.petrol;
      tempData.backPay=newData.backPay;
      tempData.allowance=newData.allowance;
      tempData.annualAward=newData.annualAward;
      tempData.medicalFund=newData.medicalFund;
      tempData.motorBikeUse=newData.motorBikeUse;
      tempData.salaryCut=newData.salaryCut;
      tempData.deductionOfLoan=newData.deductionOfLoan;
      tempData.totalSalary = newData.totalSalary;
      tempData.atm_or_cash = newData.atmOrCash;
      tempData.user_id=this.state.DetailUser[0].user_id;
      tempData.createdBy=this.state.userInfo.user_id;
      
      
      
     

      var totalAmount = 0;

      data.push(tempData);
      this.setState({
        dataSource: data,
        addNewData: {
          requestMonth: new Date(),
          exchangeRate:0,
          grossSalary: 0,
          deductionOrAddition: 0,
          salaryAfterDorA: 0,
          ssc3: 0,
          ssc2: 0,
          netSalaryPaid:0,
          incomeTax_$: 0,
          incomeTax_MMK:0,
          houseAllowance:0,
          totalGrossSalary:0,
          maintenance: "",
          petrol: "",
          totalSalary: 0,
          atmOrCash: 0,
          backPay:0,
          allowance:0,
          annualAward:0,
          medicalFund:0,
          motorBikeUse:0,
          salaryCut:0,
          deductionOfLoan:0,
          user_id:''
        },
      });

      saveBtn = true;
      form_validate = true;
      this.setDataTable(data);
    } else {
      form_validate = false;
    }
  };

  setDataTable(data) {
    console.log("data===>",data)
    var table;
    if ($.fn.dataTable.isDataTable("#dataTables-Table")) {
      table = $("#dataTables-Table").dataTable();
      table.fnClearTable();
      table.fnDestroy();
      $("#dataTables-Table").empty();
    }
    var l = [];
    for (var i = 0; i < data.length; i++) {
      const index = i;
      const result = data[i];
      const obj = {
        no: index + 1,
        request_month: data[i].request_month
          ? moment(data[i].request_month).format("MMM")
          : "-",
        employment_id: data[i].employment_id ? data[i].employment_id : "-",
        fullname: data[i].fullname ? data[i].fullname : "-",
        designations: data[i].designations ? data[i].designations : "-",
        gross_salary: data[i].gross_salary ? data[i].gross_salary : 0,
        exchangeRate:data[i].exChangeRate ? data[i].exChangeRate: 0,
        deduction_or_addition: data[i].deduction_or_addition
          ? data[i].deduction_or_addition
          : 0,
        salary_after_deduction_or_addition: data[i]
          .salary_after_deduction_or_addition
          ? data[i].salary_after_deduction_or_addition
          : 0,
        ssc3: data[i].ssc3 ? data[i].ssc3 : 0,
        ssc2: data[i].ssc2 ? data[i].ssc2 : 0,
        income_tax_$: data[i].income_tax_$ ? data[i].income_tax_$ : 0,
        income_taxMMK:data[i].incomeTax_MMK ? data[i].incomeTax_MMK : 0,
        netSalaryPaid:data[i].netSalaryPaid ? data[i].netSalaryPaid : 0,
        houseAllowance:data[i].houseAllowance ? data[i].houseAllowance : 0,
        maintenance: data[i].maintenance ? data[i].maintenance : 0,
        petrol: data[i].petrol ? data[i].petrol : 0,
        total_gross_salary: data[i].totalGrossSalary ? data[i].totalGrossSalary : 0,
        back_pay:data[i].backPay ? data[i].backPay : 0,
        allowance:data[i].allowance ? data[i].allowance : 0,
        annual_Award:data[i].annualAward ? data[i].annualAward : 0,
        medical_Fund:data[i].medicalFund ? data[i].medicalFund : 0,
        deduct_for_office_motorbike_use:data[i].motorBikeUse ? data[i].motorBikeUse : 0,
        salary_cut:data[i].salaryCut ? data[i].salaryCut : 0,
        deduction_of_loan:data[i].deductionOfLoan ? data[i].deductionOfLoan : 0,
        atm_or_cash: data[i].atm_or_cash == 0 ? "ATM" : "Cash",
        Total:data[i].totalSalary ? data[i].totalSalary : 0,
        action:
          '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' +
          index +
          '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' +
          '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toRemove" ><span id="remove" class="hidden" >' +
          index +
          '</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</button>',
      };
      l.push(obj);
    }

    table = $("#dataTables-Table").DataTable({
      autofill: false,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      paging: false,
      buttons: false,

      data: l,
      columns: [
        { title: "No", data: "no" },
        { title :"Request Month",data:"request_month"},
        { title: "Employee Id", data: "employment_id" },
        { title: "Employee Name", data: "fullname" },
        { title: "Position", data: "designations" },
        { title:"Exchange Rate",data:"exchangeRate"},
        { title: "Gross Salary",data:"gross_salary"},
        { title: "Deduction or Addition", data: "deduction_or_addition" },
        {
          title: "Salary After Deduciton or Addition",
          data: "salary_after_deduction_or_addition",
        },
        { title: "SSC Employee(3%)", data: "ssc3" },
        { title: "SSC Employee(2%)", data: "ssc2" },
        { title: "Income Tax($)", data: "income_tax_$" },
        { title:"Income Tax(MMK)",data:"income_taxMMK"},
        { title:"Net Salary Paid($)",data:"netSalaryPaid"},
        { title :'Housing Allowance',data:"houseAllowance"},
    
        { title: "Total Gross Salary", data: "total_gross_salary" },
        { title: "Maintenance", data: "maintenance" },
        { title: "Petrol", data: "petrol" },
        { title: "BackPay", data: "back_pay" },
        { title: "Allowance", data: "allowance" },
        { title: "Annual Award", data: "annual_Award" },
        { title: "Medical Fund", data: "medical_Fund" },
        { title: "Deduct For Office Motor Bike Using", data: "deduct_for_office_motorbike_use" },
        { title: "Salary Cut",data:'salary_cut'},
        { title: "Deduction Of Loan",data:"deduction_of_loan"},
        { title: "ATM Or Cash",data:"atm_or_cash"},
        { title: "Total",data:"Total"},
        { title: "Action",data:'action'}
      ],
    });
  }

  showToast = (status, text) => {
    if (status === 200) {
      toast.success(text);
      window.location.reload('/foreigner_salary')
      // {this.state.attendance_type == "late_check_in" ? this.LateCheckIn ? this.state.attendance_type == "field_check_in" : this.FieldCheckIn ? this.state.attendance_type == "early_check_out" : this.EarlyCheckOut : this.FieldCheckOut}
    } else {
      toast.error(text);
    }
  };


  check = () => {
    // if (this.state.newDoc.length == 0) {
    //     toast.error("Please Choose Attachment File!")
    // } else {
    if (validate("check_form")) {
      // @lucy
      let status=0
      const dataTostring = this.state.dataSource.map((v) => {
        return {
          request_month: moment(v.request_month).format("YYYY-MM-DD"),
          employment_id: v.employment_id,
          fullname: v.fullname,
          designations: v.designations,
          gross_salary: v.gross_salary,
          exchange_rate:v.exChangeRate,
          deduction_or_addition: v.deduction_or_addition,
          salary_after_deduction_or_addition:
            v.salary_after_deduction_or_addition,
          ssc_employer: v.ssc3,
          ssc_employee: v.ssc2,
          income_tax_$: v.income_tax_$,
          income_tax_MMK:v.incomeTax_MMK,
          net_salary_paid:v.netSalaryPaid,
          house_allowance:v.houseAllowance,
          maintenance: v.maintenance,
          petrol: v.petrol,
          total_gross_salary:v.totalGrossSalary,
          back_pay:v.backPay,
          allowance:v.allowance,
          annual_Award:v.annualAward,
          medical_Fund:v.medicalFund,
          deduct_for_office_motorbike_use:v.motorBikeUse,
          salary_cut:v.salaryCut,
          deduction_of_loan:v.deductionOfLoan,
          Total:v.totalSalary,
          atm_or_cash: v.atm_or_cash,
          user_id:v.user_id,
          createdBy:v.createdBy
         
        };
      });
      console.log("data===>",dataTostring)

      fetch(`${main_url}foreigner_salary/add_foreigner_salary`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${JSON.stringify(dataTostring)}`,
      })
        .then((res) => {
          status = res.status;
          return res.text();
        })
        .then((text) => {
          this.showToast(status, text);
        });
      if (saveBtn) {
        $("#saving_button").attr("disabled", true);
        // this.props.addClaimRequest(
        //   dataTostring,
        //   this.state.data,
        //   this.state.newDoc
        // );
      } else {
        startSaving();
        toast.error(" Please Add Full Information", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      startSaving();
      form_validate = false;
      toast.error(alertText, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    // }
  };
  handleHouseAllowance=(e)=>{
    const newData = this.state.addNewData;
    newData.houseAllowance = e.target.value;
    this.setState({ addNewData: newData });
  }
  handleTotalGrossSalary=(e)=>{
    const newData = this.state.addNewData;
    newData.totalGrossSalary = e.target.value;
    this.setState({ addNewData: newData });
  }
  onBackPayChange=(e)=>{
    const newData = this.state.addNewData;
    newData.backPay = e.target.value;
    this.setState({ addNewData: newData });
  }

  handlefileChanged(e) {
    var files = e.target.files;
    var attachment = [...this.state.attachment];

    for (let i = 0; i < files.length; i++) {
      attachment.push(files[i]);

      // this.setState({
      //     attachment: attachment
      // })
    }
    let newDoc = this.state.newDoc;
    var obj = document.querySelector("#travelCRDrop").files.length;
    for (var j = 0; j < obj; j++) {
      var getfile = document.querySelector("#travelCRDrop").files[j];
      newDoc.push(getfile);
    }
    document.querySelector("#travelCRDrop").value = "";
    this.setState({
      newDoc: newDoc,
      attachment: attachment,
    });
  }

  render() {
    
    const { addNewData, userId, userInfo, dataSource } = this.state;
    console.log("addNewData =====>",this.state.userInfo);
    return (
      <div>
        <div className="row">
          <div className="form-horizontal" name="demo-form">
            <div className="col-md-12" style={{ marginTop: 20 }}>
              <div className="ibox float-e-margins" id="add_check_form">
                <div className="ibox-content p-md">
                  <div className="row">
                    <div className="col-md-3">
                      <label>Request Month</label>
                      <DatePicker
                        dateFormat="MMM"
                        value={addNewData.requestMonth}
                        timeFormat={false}
                        onChange={this.onRequestMonthChange.bind(this)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Exchange Rate</label>
                      <input
                        className="form-control checkValidate"
                        type="number"
                        data-name="employment_id"
                        value={addNewData.exchangeRate}
                        placeholder="Exchange Rate"
                        onChange={this.exChangeRate.bind(this)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Employee ID</label>
                      <Select
                                placeholder="Employee"
                                options={this.state.employeeIdList}
                                onChange={this.handleEmployeeId}
                                value={this.state.selectedEmployeeId}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                    </div>
                    <div className="col-md-3">
                      <label>Employee Name</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="fullname"
                        value={this.state.DetailUser ? this.state.DetailUser[0].employee_name : ''}
                        placeholder="Employee Name"
                        // onChange={this.claimChangeText}
                      />
                    </div>
                    
                  </div>
                  <div className="row margin-top-20">
                  <div className="col-md-3">
                      <label>Designation</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="designation"
                        value={this.state.DetailUser ? this.state.DetailUser[0].designations:""}
                        placeholder="designation"
                        // onChange={this.claimChangeText}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Gross Salary</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="number"
                        data-name="grossSalary"
                        value={this.state.DetailUser ? this.state.DetailUser[0].basic_salary : ""}
                        placeholder="Enter Lodging"
                        // onChange={this.onGrossSalaryChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Deduction or Addition</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="deductionOrAddition"
                        value={addNewData.deductionOrAddition}
                        placeholder="Enter Deduction or Addition"
                        onChange={this.onDeductionOrAddition}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Salary After Deduction or Addition</label>
                      <input
                        className="form-control"
                        type="number"
                        disabled
                        data-name="salaryAfterDorA"
                        value={addNewData.salaryAfterDorA}
                        placeholder={"Enter Salary After Deduction or Addition"}
                      />
                    </div>
                  </div>
                  <div className="row margin-top-20">
                  
                    <div className="col-md-3">
                      <label>SSC (Employee 3%)</label>
                      <input
                        className="form-control"
                        disabled
                        type="number"
                        data-name="ssc3"
                        value={addNewData.ssc3}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>SSC (Employee 2%)</label>
                      <input
                        className="form-control"
                        disabled
                        type="number"
                        data-name="ssc2"
                        value={addNewData.ssc2}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Income Tax($)</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="incomeTax"
                        value={addNewData.incomeTax_$}
                        placeholder={"Enter Income Tax"}
                        onChange={this.onIncomeTax$Change}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Income Tax(MMK)</label>
                      <input
                        disabled={true}
                        className="form-control"
                        type="number"
                        data-name="incomeTax"
                        value={addNewData.incomeTax_$*addNewData.exchangeRate}
                        placeholder={"Enter Income Tax"}
                        // onChange={this.onIncomeTaxMMKChange}
                      />
                    </div>
                </div>
                <div className="row margin-top-20">
                    <div className="col-md-3">
                      <label>Net Salary Paid($)</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="number"
                        data-name="netSalaryPaid"
                        value={addNewData.salaryAfterDorA-addNewData.incomeTax_$}
                        placeholder={"Enter Net Salary Paid"}
                        // onChange={this.handleNetSalaryPaid}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>House Allowance</label>
                      <input
                        className="form-control"
                        
                        type="number"
                        data-name="houseAllowance"
                        value={addNewData.houseAllowance}
                        onChange={this.handleHouseAllowance}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Total Gross Salary</label>
                      <input
                        className="form-control"
                       
                        type="number"
                        data-name="totalGrossSalary"
                        value={addNewData.totalGrossSalary}
                        onChange={this.handleTotalGrossSalary}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Maintenance</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="maintenance"
                        value={addNewData.maintenance}
                        placeholder="Enter Maintenance"
                        onChange={this.onMaintenanceChange}
                      />
                    </div>
                  </div>
                  <div className="row margin-top-20">
                    <div className="col-md-3">
                        <label>Petrol</label>
                        <input
                            className="form-control"
                            type="number"
                            data-name="petrol"
                            value={addNewData.petrol}
                            placeholder={"Enter Petrol"}
                            onChange={this.onPetrolChange}
                        />
                    </div>
                    <div className="col-md-3">
                      <label>Back Pay</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="backPay"
                        value={addNewData.backPay}
                        placeholder={"Enter BackPay"}
                        onChange={this.onBackPayChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Allowance</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="allowance"
                        value={addNewData.allowance}
                        placeholder={"Enter Allowance"}
                        onChange={this.allowanceChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Annual Award</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="annualAward"
                        value={addNewData.annualAward}
                        placeholder={"Enter Annual Award"}
                        onChange={this.handleAnnualAward}
                      />
                    </div>
                  </div>
                  <div className="row margin-top-20">
                    <div className="col-md-3">
                        <label>Medical Fund</label>
                        <input
                            className="form-control"
                            type="number"
                            data-name="medicalFund"
                            value={addNewData.medicalFund}
                            placeholder={"Enter Medical Fund"}
                            onChange={this.handleMedicalFund}
                        />
                    </div>
                    <div className="col-md-3">
                        <label>Deduct for Office Motor Bike Use</label>
                        <input
                            className="form-control"
                            type="number"
                            data-name="deductForOfficeMotorBikeUse"
                            value={addNewData.motorBikeUse}
                            placeholder={"Enter DeductForOfficeMotorBikeUse"}
                            onChange={this.handleMotorBikeUse}
                        />
                    </div>
                    <div className="col-md-3">
                        <label>Salary Cut</label>
                        <input
                            className="form-control"
                            type="number"
                            data-name="salaryCut"
                            value={addNewData.salaryCut}
                            placeholder={"Enter Salary Cut"}
                            onChange={this.handleSalaryCut}
                        />
                    </div>
                    <div className="col-md-3">
                        <label>Deduction Of Loan</label>
                        <input
                            className="form-control"
                            type="number"
                            data-name="deductionOfLoan"
                            value={addNewData.deductionOfLoan}
                            placeholder={"Enter Deduction of Loan"}
                            onChange={this.handleDeductionOfLoan}
                        />
                    </div>
                  </div>
                  <div className="row margin-top-20">
                    <div className="col-md-3">
                        <label>Total Salary</label>
                        <input
                            className="form-control"
                            type="number"
                            data-name="totalSalary"
                            value={addNewData.totalSalary}
                            placeholder={"Enter Total Salary"}
                            onChange={this.handleTotalSalary}
                        />
                    </div>
                    <div className="col-md-3">
                      <label>ATM / Cash</label>
                      <div
                        onChange={this.onRadioChange}
                        className="row"
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          //   alignItems: "center",
                        }}
                      >
                        <input
                          type="radio"
                          value={0}
                          name="work"
                          checked={addNewData.atmOrCash == 0 ? true : false}
                        />{" "}
                        <span>ATM</span>
                        <input
                          type="radio"
                          value={1}
                          name="work"
                          checked={addNewData.atmOrCash == 1 ? true : false}
                        />{" "}
                        <span>Cash</span>
                      </div>
                    </div>
                    <div className="col-md-6 btn-rightend">
                      <button
                        className="btn-primary btn"
                        onClick={this.addData}
                        style={{ marginTop: 20 }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  </div>
                 
              </div>

              <div className="col-md-12">
                <table
                  width="99%"
                  className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                  id="dataTables-Table"
                />
              </div>
              <div className="col-md-12">
                <div className="col-md-12 btn-rightend mt20">
                  <button
                    onClick={this.check.bind(this)}
                    id="saving_button"
                    className="btn btn-primary"
                  >
                    <span>Confirm</span>{" "}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
