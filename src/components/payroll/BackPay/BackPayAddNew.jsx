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

export default class BackPayAddNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      userInfo: {},
      PayrollList:[],
      addNewData: {
        Amount:0,
        workingDay:0,
        salaryPerDay:0,
        totalWorkingDay:0,
        Total:0
        
        
      },
      dataSource: [],
      attachment: [],
      newDoc: [],
      employeeIdList:null,
      selectedEmployeeId:null,
      DetailUser:null,
      from_date:moment(),
      to_date:moment()
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
    $(document).on("click", "#toEdit", function () {
      var data = $(this).find("#edit").text();
      data = $.parseJSON(data);
      let newData = that.state.dataSource;
      let editData = newData[data];
      console.log("edit data===>",editData,newData)
      newData.splice(data, 1);
      that.setState(
        {
          dataSource: newData,
          addNewData: {
            requestMonth: editData.request_month,
            exchangeRate:editData.exchangeRate,
            lastWorkingDay: editData.last_working_day,
            grossSalary: editData.gross_salary,
            deductionOrAddition: editData.deduction_or_addition,
            salaryAfterDorA: editData.salary_after_deduction_or_addition,
            ssc3: editData.ssc3,
            ssc2: editData.ssc2,
            incomeTax_$:editData.income_tax_$,
            incomeTax_MMK:editData.incomeTax_MMK,
            maintenance: editData.maintenance,
            petrol: editData.petrol,
            totalSalary: editData.totalSalary,
            deductionOfLoan:editData.deductionOfLoan,
            atmOrCash: editData.atm_or_cash,
            houseAllowance:editData.houseAllowance,
            backPay:editData.backPay,
            allowance:editData.allowance,
            annualAward:editData.annualAward,
            medicalFund:editData.medicalFund,
            motorBikeUse:editData.motorBikeUse,
            salaryCut:editData.salaryCut,
            totalGrossSalary:editData.totalGrossSalary
            
          },
        },
        () => that.setDataTable(newData)
      );
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
  handleSelectedTodate = async (event) => {
    this.setState({
      to_date: event,
    });
  };
  handleAmount=(e)=>{
    const newData = this.state.addNewData;
    newData.Amount = e.target.value;
    this.setState({ addNewData: newData });
  }

  onRequestMonthChange = (e) => {
    const newData = this.state.addNewData;
    newData.requestMonth = e;
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
  onRadioWorkinDayChange=(e)=>{
    const newData = this.state.addNewData;
    newData.workingDay = parseInt(e.target.value);
    this.setState({ addNewData: newData });
  }

  handleTotalSalary=(e)=>{
    const newData = this.state.addNewData;
    newData.totalSalary = e.target.value;
    this.setState({ addNewData: newData });
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
  handleSelectedFromdate = async (event) => {
    this.setState({
      from_date: event,
    });
  };
  
  onBackPayChange=(e)=>{
    const newData = this.state.addNewData;
    newData.backPay = e.target.value;
    this.setState({ addNewData: newData });
  }
  handlePayroll=(event)=>{
    this.setState({
        selectedPayroll:event
    })
  }
  handlesalaryPerDay=(event)=>{
    const newData = this.state.addNewData;
    newData.salaryPerDay = event.target.value;
    this.setState({ addNewData: newData });
  }

  render() {
    
    const { addNewData, userId, userInfo, dataSource } = this.state;
    console.log("addNewData =====>",this.state.DetailUser);
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
                        <label htmlFor="">Payroll Request Type</label>
                        <Select
                                placeholder="Employee"
                                options={this.state.PayrollList}
                                onChange={this.handlePayroll}
                                value={this.state.selectedPayroll}
                                className="react-select-container"
                                classNamePrefix="react-select"
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
                        value={this.state.DetailUser ? this.state.DetailUser[0].designations : ''}
                        placeholder="Designation"
                        // onChange={this.claimChangeText}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Department</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="fullname"
                        value={this.state.DetailUser ? this.state.DetailUser[0].deptname: ''}
                        placeholder="Department"
                        // onChange={this.claimChangeText}
                      />
                    </div>
                  <div className="col-md-3">
                      <label>Branch</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="Branch"
                        value={this.state.DetailUser ? this.state.DetailUser[0].location_master_name:""}
                        placeholder="Branch"
                        // onChange={this.claimChangeText}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Region</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="number"
                        data-name="Region"
                        value={this.state.DetailUser ? this.state.DetailUser[0].state_name : ""}
                        placeholder="Region"
                        // onChange={this.onGrossSalaryChange}
                      />
                    </div>
                    
                    
                  </div>
                  <div className="row margin-top-20">
                  
                  <div className="col-md-3">
                      <label>Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="Amount"
                        value={addNewData.Amount}
                        placeholder="Enter Amount"
                        onChange={this.handleAmount}
                      />
                    </div>
                    <div className="col-md-3">
                    <label>Reason</label>
                      <input
                        className="form-control checkValidate"
                        type="text"
                        data-name="reason"
                        value={addNewData.reason}
                        placeholder="Enter Reason"
                        onChange={this.onReasonChange}
                        multiple
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Start Working Day</label>
                      <DatePicker
                        dateFormat="DD/MM/YYYY"
                        value={this.state.from_date}
                        onChange={this.handleSelectedFromdate}
                        timeFormat={false}
                    />
                    </div>
                    <div className="col-md-3">
                      <label>End Working Day</label>
                            <DatePicker
                        dateFormat="DD/MM/YYYY"
                        value={this.state.to_date}
                        onChange={this.handleSelectedTodate}
                        timeFormat={false}
                        />
                    </div>
                </div>
                <div className="row margin-top-20">
                <div className="col-md-3">
                      <label>Working Day / Calendar Day</label>
                      <div
                        onChange={this.onRadioWorkinDayChange}
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
                          name="working_day"
                          checked={addNewData.workingDay == 0 ? true : false}
                        />{" "}
                        <span>Working Day</span>
                        <input
                          type="radio"
                          value={1}
                          name="calendar_day"
                          checked={addNewData.workingDay == 1 ? true : false}
                        />{" "}
                        <span>Calendar Day</span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label>Total Working Day</label>
                      <input
                        className="form-control"
                        
                        type="number"
                        data-name="totalWorkingDay"
                        value={addNewData.totalWorkingDay}
                        onChange={this.handletotalWorkingDay}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Salary Per Day</label>
                      <input
                        className="form-control"
                       
                        type="number"
                        data-name="salaryPerDay"
                        value={addNewData.salaryPerDay}
                        onChange={this.handlesalaryPerDay}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Total Salary</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="totalSalary"
                        value={addNewData.totalSalary}
                        placeholder="Total Salary"
                        onChange={this.ontotalSalaryChange}
                      />
                    </div>
                  </div>
                  <div className="row margin-top-20">
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
                    <div className="col-md-3">
                        <label>Total</label>
                        <input
                            className="form-control"
                            disabled={true}
                            type="number"
                            data-name="total"
                            value={addNewData.Total}
                          
                            // onChange={this.handleMedicalFund}
                        />
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
