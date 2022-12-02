import React, { Component } from "react";

import ApprovalInformation from '../../Common/ApprovalInformation';
import { main_url } from "../../../utils/CommonFunction";
import moment from "moment/moment";
export default class ForeignerSalaryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      status_info:[]
    };
  }
  componentDidMount(){
    this.getStatusInfo()
  }
  getStatusInfo() {
    fetch(`${main_url}child_benefit/getOneDetailInfo/${this.props.dataSource.id}`)
        .then(res => res.json())
        .then(res => {
            this.setState({
                status_info: res
            })
        })
        .catch(error => console.log(error))
}

  render() { console.log("datasource",this.props.dataSource)
    
    const {
      request_month,
      exchange_rage,
          employment_id,
          fullname,
          designations,
          gross_salary,
          deduction_or_addition,
          after_deduction_or_addition,
          SSC_employee,
          SSC_employer,
          income_tax,
          income_tax_MMK,
          net_salary_paid,
          housing_allowance,
          total_gross_salary,
          maintenance,
          petrol,
          back_pay,
          allowance,
          annual_award,
          medical_fund,
          debut_for_motorbike,
          salary_cut,
          deduction_of_loan,
          total_salary,
          atm_or_cash
    } = this.props.dataSource;
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
                      <input
                      className="form-control"
                        // dateFormat="MMM"
                        value={moment(request_month).format('MMM')}
                        timeFormat={false}
                        disabled={true}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Exchange Rate</label>
                      <input
                        className="form-control checkValidate"
                        type="number"
                        data-name="employment_id"
                        value={exchange_rage}
                        placeholder="Exchange Rate"
                        disabled={true}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Employee ID</label> <input type="text" className="form-control" value={employment_id} disabled/>
                    </div>
                    <div className="col-md-3">
                      <label>Employee Name</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="fullname"
                        value={fullname}
                        placeholder="Employee Name"
                        // onChange={this.claimChangeText}
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
                        value={designations}
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
                        value={gross_salary}
                        placeholder="Enter Lodging"
                        // onChange={this.onGrossSalaryChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Deduction or Addition</label>
                      <input
                        className="form-control"
                        type="number"
                        disabled={true}
                        data-name="deductionOrAddition"
                        value={deduction_or_addition}
                        placeholder="Enter Deduction or Addition"
                        // onChange={this.onDeductionOrAddition}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Salary After Deduction or Addition</label>
                      <input
                        className="form-control"
                        type="number"
                        disabled={true}
                        data-name="salaryAfterDorA"
                        value={after_deduction_or_addition}
                        placeholder={"Enter Salary After Deduction or Addition"}
                      />
                    </div>
                  </div>
                  <div className="row margin-top-20">
                  
                    <div className="col-md-3">
                      <label>SSC (Employee 3%)</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="number"
                        data-name="ssc3"
                        value={SSC_employee}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>SSC (Employee 2%)</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="number"
                        data-name="ssc2"
                        value={SSC_employer}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Income Tax($)</label>
                      <input
                        className="form-control"
                        type="number"
                        disabled={true}
                        data-name="incomeTax"
                        value={income_tax}
                        placeholder={"Enter Income Tax"}
                        // onChange={this.onIncomeTax$Change}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Income Tax(MMK)</label>
                      <input
                        disabled={true}
                        className="form-control"
                        type="number"
                        data-name="incomeTax"
                        value={income_tax_MMK}
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
                        value={net_salary_paid}
                        placeholder={"Enter Net Salary Paid"}
                        // onChange={this.handleNetSalaryPaid}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>House Allowance</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="number"
                        data-name="houseAllowance"
                        value={housing_allowance}
                        // onChange={this.handleHouseAllowance}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Total Gross Salary</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="number"
                        data-name="totalGrossSalary"
                        value={total_gross_salary}
                        // onChange={this.handleTotalGrossSalary}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Maintenance</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="maintenance"
                        value={maintenance}
                        disabled={true}
                        placeholder="Enter Maintenance"
                        // onChange={this.onMaintenanceChange}
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
                            disabled={true}
                            value={petrol}
                            placeholder={"Enter Petrol"}
                            // onChange={this.onPetrolChange}
                        />
                    </div>
                    <div className="col-md-3">
                      <label>Back Pay</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="backPay"
                        value={back_pay}
                        disabled={true}
                        placeholder={"Enter BackPay"}
                        // onChange={this.onBackPayChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Allowance</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="allowance"
                        value={allowance}
                        disabled={true}
                        placeholder={"Enter Allowance"}
                        // onChange={this.allowanceChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Annual Award</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="annualAward"
                        disabled={true}
                        value={annual_award}
                        placeholder={"Enter Annual Award"}
                        // onChange={this.handleAnnualAward}
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
                            value={medical_fund}
                            disabled={true}
                            placeholder={"Enter Medical Fund"}
                            // onChange={this.handleMedicalFund}
                        />
                    </div>
                    <div className="col-md-3">
                        <label>Deduct for Office Motor Bike Use</label>
                        <input
                            className="form-control"
                            type="number"
                            data-name="deductForOfficeMotorBikeUse"
                            value={debut_for_motorbike}
                            disabled={true}
                            placeholder={"Enter DeductForOfficeMotorBikeUse"}
                            // onChange={this.handleMotorBikeUse}
                        />
                    </div>
                    <div className="col-md-3">
                        <label>Salary Cut</label>
                        <input
                            className="form-control"
                            type="number"
                            data-name="salaryCut"
                            value={salary_cut}
                            disabled={true}
                            placeholder={"Enter Salary Cut"}
                            // onChange={this.handleSalaryCut}
                        />
                    </div>
                    <div className="col-md-3">
                        <label>Deduction Of Loan</label>
                        <input
                            className="form-control"
                            type="number"
                            data-name="deductionOfLoan"
                            value={deduction_of_loan}
                            disabled={true}
                            placeholder={"Enter Deduction of Loan"}
                            // onChange={this.handleDeductionOfLoan}
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
                            value={total_salary}
                            disabled={true}
                            placeholder={"Enter Total Salary"}
                            // onChange={this.handleTotalSalary}
                        />
                    </div>
                    <div className="col-md-3">
                      <label>ATM / Cash</label>
                      <input type="text" className="form-control" value={atm_or_cash == 0 ? "ATM" : "Cash"} disabled />
                      {/* <div
                        onChange={this.onRadioChange}
                        className="row"
                        style={{
                          display: "flex",
                          // justifyContent: "space-between",
                          //   alignItems: "center",
                          marginLeft:0,
                          marginTop:6
                        }}
                      >
                        <input
                          type="radio"
                          value={0}
                          name="work"
                          checked={atmOrCash == 0 ? true : false}
                        />{" "}
                        <span style={{marginLeft:'5px'}}>ATM</span>
                        <input
                         style={{marginLeft:'15px'}}
                        
                          type="radio"
                          value={1}
                          name="work"
                          checked={atmOrCash == 1 ? true : false}
                        />{" "}
                        <span style={{marginLeft:'5px'}}>Cash</span>
                      </div> */}
                    </div>
                  </div>
                  </div>
              </div>
            </div>
          </div>
        </div>
        {
                            !Array.isArray(this.state.status_info) ?

                                <div className="row approval-main margin-top-20">
                                    <ApprovalInformation status={this.state.status_info} />
                                </div>
                                : ''
                        }
      </div>
    );
  }
}
