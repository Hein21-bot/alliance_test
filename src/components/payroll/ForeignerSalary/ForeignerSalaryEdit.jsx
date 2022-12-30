import React, { Component } from "react";
import {
  main_url,
  stopSaving,
  startSaving,
  getUserInfo,
  getWorkFlowStatus,
  havePermission,
  getActionStatus
} from "../../../utils/CommonFunction";
import "react-toastify/dist/ReactToastify.min.css";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import ApprovalForm1 from "../../Common/ApprovalForm1";
import DatePicker from "react-datetime";
import {
  getUserId,
  validate,
  getBranch,
  alertText,
} from "../../../utils/CommonFunction";
const $ = require("jquery");
var form_validate = true;
var saveBtn = false;

export default class ForeignerSalaryEdit extends Component {
  constructor(props) {
    super(props);
   
    this.state = {
      userId: null,
      userInfo: {},
      editData:this.props.dataSource,
      is_main_role:false,
      work_flow_status:{},
      status_title:'',
      comment:'',
      updatedBy:getUserId("user_info")
    }
  }

  componentDidUpdate() {
    if (!form_validate) validate("check_form");
  }

  async componentDidMount() {
    var work_flow = await getWorkFlowStatus(this.state.editData.user_id, this.state.updatedBy,'Foreigner Salary','Foreigner Salary');
    this.setState({
        work_flow_status: work_flow,
        is_main_role: havePermission(work_flow)
    })
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
  }

  onRequestMonthChange = (e) => {
    const newData = this.state.editData;
    newData.request_month = e;
    this.setState({ editData: newData });
  };

  // onLastWorkingDay = (e) => {
  //   const newData = this.state.editData;
  //   newData.lastWorkingDay = e;
  //   this.setState({ editData: newData });
  // };

  onGrossSalaryChange = (e) => {
    let newValue = parseFloat(e.target.value);
    const newData = this.state.editData;
    newData.after_deduction_or_addition=
      newValue + parseFloat(newData.deductionOrAddition);
    newData.grossSalary = newValue;
    newData.SSC_employee = newData.after_deduction_or_addition* 0.03;
    newData.SSC_employer = newData.after_deduction_or_addition* 0.02;
    newData.totalSalary =
      newData.after_deduction_or_addition-
      newData.SSC_employer -
      newData.income_tax +
      newData.maintenance +
      newData.petrol;
    this.setState({ editData: newData });
  };

  allowanceChange=(e)=>{
    const newData = this.state.editData;
    newData.allowance = e.target.value;
    this.setState({ editData: newData });
  };

  onDeductionOrAddition = (e) => {
    let newValue = e.target.value;
    const newData = this.state.editData;
    newData.after_deduction_or_addition = newData.gross_salary + parseFloat(newValue);
    newData.deduction_or_addition = newValue;
    newData.SSC_employee = newData.after_deduction_or_addition * 0.03;
    newData.SSC_employer = newData.after_deduction_or_addition * 0.02;
    newData.total_salary =
      newData.after_deduction_or_addition -
      newData.SSC_employer -
      newData.income_tax +
      newData.maintenance +
      newData.petrol;
    this.setState({ editData: newData },()=>{console.log("editdataaaa",this.state.editData)});
  };

  onIncomeTax$Change = (e) => {
    const newData = this.state.editData;
    newData.income_tax = e.target.value;
    newData.net_salary_paid=newData.after_deduction_or_addition-newData.income_tax;
    newData.income_tax_MMK=newData.exchange_rage*newData.income_tax;
    this.setState({ editData: newData });
  };

  // onIncomeTaxMMKChange=(e)=>{
  //   const newData = this.state.addNewData;
  //   newData.incomeTax_MMK = e.target.value;
  //   this.setState({ addNewData: newData });
  // }:

  onMaintenanceChange = (e) => {
    let newValue = parseFloat(e.target.value);
    const newData = this.state.editData;
    newData.maintenance = newValue;
    newData.total_salary =
      newData.after_deduction_or_addition -
      newData.SSC_employer -
      newData.income_tax +
      newData.maintenance +
      newData.petrol;
    this.setState({ editData: newData });
  };

  onPetrolChange = (e) => {
    let newValue = parseFloat(e.target.value);
    const newData = this.state.editData;
    newData.petrol = newValue;
    newData.total_salary =
      newData.after_deduction_or_addition -
      newData.SSC_employer -
      newData.income_tax +
      newData.maintenance +
      newData.petrol;
    this.setState({ editData: newData });
  };

  onReasonChange = (e) => {
    const newData = this.state.addNewData;
    newData.reason = e.target.value;
    this.setState({ addNewData: newData });
  };

  onRadioChange = (e) => {
    const newData = this.state.editData;
    newData.atm_or_cash = parseInt(e.target.value);
    this.setState({ editData: newData });
  };

  handleChangeExitStatus = (e) => {
    const newData = this.state.addNewData;
    newData.exitStatus = e.target.value;
    this.setState({ addNewData: newData });
  };

  handleAnnualAward=(e)=>{
    const newData = this.state.editData;
    newData.annual_award = e.target.value;
    this.setState({ editData: newData });
  };

  handleMedicalFund=(e)=>{
    const newData = this.state.editData;
    newData.medical_fund = e.target.value;
    this.setState({ editData: newData });
  };

  handleMotorBikeUse=(e)=>{
    const newData = this.state.editData;
    newData.debut_for_motorbike = e.target.value;
    this.setState({ editData: newData });
  };

  handleSalaryCut=(e)=>{
    const newData = this.state.editData;
    newData.salary_cut = e.target.value;
    this.setState({ editData: newData });
  };

  handleDeductionOfLoan=(e)=>{
    const newData = this.state.editData;
    newData.deduction_of_loan = e.target.value;
    this.setState({ editData: newData });
  };

  handleTotalSalary=(e)=>{
    const newData = this.state.editData;
    newData.total_salary = e.target.value;
    this.setState({ editData: newData });
  };

  removeNewDocument(index, event) {
    var array = this.state.newDoc;
    array.splice(index, 1);
    this.setState({
      newDoc: array,
    });
  };

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
  };

  exChangeRate=(event)=>{
    const newData = this.state.editData;
    newData.exchange_rage = event.target.value;
    this.setState({ editData: newData });
  };

  showToast = (status, text) => {
    if (status === 200) {
      toast.success(text);
      window.location.reload('/foreigner_salary')
      // {this.state.attendance_type == "late_check_in" ? this.LateCheckIn ? this.state.attendance_type == "field_check_in" : this.FieldCheckIn ? this.state.attendance_type == "early_check_out" : this.EarlyCheckOut : this.FieldCheckOut}
    } else {
      toast.error(text);
    }
  };
  approvalStatus = (text, comment) => {
    this.setState({ status_title: text, comment: comment },
        () => this.check())
}

  check = () => {
    
    const {editData} = this.state;
    if (validate("check_form")) {
      var { status_title, is_main_role } = this.state;
      let status=0

        const data= {
          request_month: moment(editData.request_month).format("YYYY-MM-DD"),        
          exchange_rage:editData.exchange_rage,
          fullname:editData.fullname,
          designations : editData.designations,
          employment_id: editData.employment_id,
          deduction_or_addition: editData.deduction_or_addition,       
          income_tax: editData.income_tax,
          gross_salary: editData.gross_salary,
          after_deduction_or_addition :editData.after_deduction_or_addition,
          SSC_employee :editData.SSC_employee,
          SSC_employer :editData.SSC_employer,
          income_tax_MMK :editData.income_tax_MMK,
          net_salary_paid :editData.net_salary_paid,
          housing_allowance:editData.housing_allowance,
          maintenance: editData.maintenance,
          petrol: editData.petrol,
          total_gross_salary:editData.total_gross_salary,
          back_pay:editData.back_pay,
          allowance:editData.allowance,
          annual_award:editData.annual_award,
          medical_fund:editData.medical_fund,
          debut_for_motorbike:editData.debut_for_motorbike,
          salary_cut:editData.salary_cut,
          deduction_of_loan:editData.deduction_of_loan,
          total_salary:editData.total_salary,
          atm_or_cash: editData.atm_or_cash,
          status:this.state.editData.status == 5 ? 0 : this.state.editData.status,
          updatedBy:this.state.updatedBy 
        };
        if (status_title !== '' && is_main_role) {
          var action = getActionStatus(status_title, this.state.editData, this.state.updatedBy, this.state.comment);
          data.referback_by = action.referback_by;
          data.checked_by = action.checked_by;
          data.verified_by = action.verified_by;
          data.approved_by = action.approved_by;
          data.rejected_by = action.rejected_by;
          data.referback_date = action.referback_date;
          data.checked_date = action.checked_date;
          data.verified_date = action.verified_date;
          data.approved_date = action.approved_date;
          data.rejected_date = action.rejected_date;
          data.referback_comment = action.referback_comment;
          data.checked_comment = action.checked_comment;
          data.verified_comment = action.verified_comment;
          data.approved_comment = action.approved_comment;
          data.status = action.status;
  
      }
      console.log("data",data)
      fetch(`${main_url}foreigner_salary/edit_foreigner_salary/${editData.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${JSON.stringify(data)}`,
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
        // toast.error(" Please Add Full Information", {
        //   position: "top-right",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        // });
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
  };
  
  handleHouseAllowance=(e)=>{
    const newData = this.state.editData;
    newData.housing_allowance = e.target.value;
    this.setState({ editData: newData });
  };

  handleTotalGrossSalary=(e)=>{
    const newData = this.state.editData;
    newData.total_gross_salary = e.target.value;
    this.setState({ editData: newData });
  };

  onBackPayChange=(e)=>{
    const newData = this.state.editData;
    newData.back_pay = e.target.value;
    this.setState({ editData: newData });
  };

  handlefileChanged(e) {
    var files = e.target.files;
    var attachment = [...this.state.attachment];
    for (let i = 0; i < files.length; i++) {
      attachment.push(files[i]);
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
  };

  render() { 
    console.log("work flow status",this.state.work_flow_status)
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
                        value={new Date(this.state.editData.request_month)}
                        timeFormat={false}
                        onChange={this.onRequestMonthChange.bind(this)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Exchange Rate</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="employment_id"
                        value={this.state.editData.exchange_rage}
                        placeholder="Exchange Rate"
                        onChange={this.exChangeRate.bind(this)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Employee ID</label> 
                      <input 
                      type="text" 
                      className="form-control" 
                      value={this.state.editData.employment_id} 
                      disabled={true}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Employee Name</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="fullname"
                        value={this.state.editData.fullname}
                        placeholder="Employee Name"
                      />
                    </div>
                    
                  </div>
                  <div className="row margin-top-20">
                  <div className="col-md-3">
                      <label>Designation</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="designation"
                        value={this.state.editData ? this.state.editData.designations:""}
                        placeholder="designation"
                        onChange={this.claimChangeText}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Gross Salary</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="number"
                        data-name="grossSalary"
                        value={this.state.editData.gross_salary}
                        placeholder="Enter Lodging"
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Deduction or Addition</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="deductionOrAddition"
                        value={this.state.editData.deduction_or_addition}
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
                        value={this.state.editData.after_deduction_or_addition}
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
                        value={this.state.editData.SSC_employee}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>SSC (Employee 2%)</label>
                      <input
                        className="form-control"
                        disabled
                        type="number"
                        data-name="ssc2"
                        value={this.state.editData.SSC_employer}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Income Tax($)</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="incomeTax"
                        value={this.state.editData.income_tax}
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
                        value={this.state.editData.income_tax*this.state.editData.exchange_rage}
                        placeholder={"Enter Income Tax"}
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
                        value={this.state.editData.after_deduction_or_addition-this.state.editData.income_tax}
                        placeholder={"Enter Net Salary Paid"}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>House Allowance</label>
                      <input
                        className="form-control"
                        placeholder={"Enter House Allowance"}
                        type="number"
                        data-name="houseAllowance"
                        value={this.state.editData.housing_allowance}
                        onChange={this.handleHouseAllowance}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Total Gross Salary</label>
                      <input
                        className="form-control"
                       
                        type="number"
                        data-name="totalGrossSalary"
                        value={this.state.editData.total_gross_salary}
                        onChange={this.handleTotalGrossSalary}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Maintenance</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="maintenance"
                        value={this.state.editData.maintenance}
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
                            value={this.state.editData.petrol}
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
                        value={this.state.editData.back_pay}
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
                        value={this.state.editData.allowance}
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
                        value={this.state.editData.annual_award}
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
                            value={this.state.editData.medical_fund}
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
                            value={this.state.editData.debut_for_motorbike}
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
                            value={this.state.editData.salary_cut}
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
                            value={this.state.editData.deduction_of_loan}
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
                            value={this.state.editData.total_salary}
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
                          marginLeft:0,
                          marginTop:6
                        }}
                      >
                        <input
                          type="radio"
                          value={0}
                          name="work"
                          checked={this.state.editData.atm_or_cash == 0 ? true : false}
                        />{" "}
                        <span  style={{marginLeft:'5px'}}>ATM</span>
                        <input
                         style={{marginLeft:'15px'}}
                          type="radio"
                          value={1}
                          name="work"
                          checked={this.state.editData.atm_or_cash == 1 ? true : false}
                        />{" "}
                        <span  style={{marginLeft:'5px'}}>Cash</span>
                      </div>
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
              {/* <div className="col-md-12">
                <div className="col-md-12 btn-rightend mt20">
                  <button
                    onClick={this.check.bind(this)}
                    id="saving_button"
                    className="btn btn-primary"
                  >
                    <span>Confirm</span>{" "}
                  </button>
                </div>
              </div> */}
                            <div className="row save-btn">
                    {
                        havePermission(this.state.work_flow_status) ?
                            <ApprovalForm1 approvalStatus={this.approvalStatus.bind(this)} status={this.state.editData.status} work_flow={this.state.work_flow_status} name={'foreigner_salary'}/>
                            :
                            <div className="col-md-12 btn-rightend">
                                { this.state.editData.status == 5 ?
                                    <div>
                                        <button onClick={this.check.bind(this)} className="btn btn-primary" id="saving_button" type="button">Confirm</button>
                                    </div>
                                    :
                                    ''
                                }
                                {/* <button onClick={this.save.bind(this)} id="saving_button" className="btn btn-primary"><span>Save</span> </button> */}
                            </div>
                    }
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
