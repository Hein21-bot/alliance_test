import moment from "moment";
import React, { Component } from "react";
import ApprovalInformation from '../../Common/ApprovalInformation';
import {
  getMonth

} from "../../../utils/CommonFunction";
import DatePicker from "react-datetime";
export default class BackPayView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
    };
  }

  render() {
    
    const {
      request_month,
          payRoll,
          employment_id,
          employee_name,
          designations,
          departments,
          region,
          branch,
          Amount,
          start_working_day,
          end_working_day,
          workingDay,
          salaryPerDay,
          totalWorkingDay,
          selectedEmployeeId,
          selectedPayroll,
          Total,
          atm_or_cash,
          user_id,
          reason,
          totalSalary,
          createdBy
      
    } = this.props.dataSource;
    console.log("datasource",getMonth(moment(request_month).format('YYYY-MM-DD')),request_month)
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
                      {/* <input type="text" className="form-control" value={getMonth(request_month)} disabled={true}/> */}
                      <DatePicker
                        dateFormat="MMM"
                        value={new Date(request_month)}
                        timeFormat={false}
                        disabled={true}
                        // onChange={this.onRequestMonthChange.bind(this)}
                      />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="">Payroll Request Type</label>
                        <input type="text" className="form-control" value={payRoll ==1 ? "Back Pay Salary": payRoll ==2 ? "Refund Salary": "Temporary Contract Salary"} disabled/>
                        {/* <Select
                                placeholder="Employee"
                                options={this.state.PayrollList}
                                onChange={this.handlePayroll}
                                value={this.state.selectedPayroll}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            /> */}
                    </div>
                    <div className="col-md-3">
                      <label>Employee ID</label>
                      <input type="text" className="form-control" value={employment_id} disabled/>
                      {/* <Select
                                placeholder="Employee"
                                options={this.state.employeeIdList}
                                onChange={this.handleEmployeeId}
                                value={this.state.selectedEmployeeId}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            /> */}
                    </div>
                    <div className="col-md-3">
                      <label>Employee Name</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="fullname"
                        value={employee_name}
                        
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
                        // placeholder="Designation"
                        // onChange={this.claimChangeText}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Department</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="fullname"
                        value={departments}
                        placeholder="Department"
                        // onChange={this.claimChangeText}
                      />
                    </div>
                  <div className="col-md-3">
                      <label>Branch</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="Branch"
                        value={branch}
                        // placeholder="Branch"
                        // onChange={this.claimChangeText}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Region</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="Region"
                        value={region}
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
                        value={Amount}
                        disabled
                        // placeholder="Enter Amount"
                        // onChange={this.handleAmount}
                      />
                    </div>
                    <div className="col-md-3">
                    <label>Reason</label>
                      <input
                        className="form-control checkValidate"
                        type="text"
                        data-name="reason"
                        value={reason}
                        disabled
                        // placeholder="Enter Reason"
                        // onChange={this.onReasonChange}
                        // multiple
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Start Working Day</label>
                      <input type="text" className="form-control" value={start_working_day} disabled/>
                      {/* <DatePicker
                        dateFormat="DD/MM/YYYY"
                        value={this.state.start_working_day}
                        onChange={this.handleSelectedFromdate}
                        timeFormat={false}
                    /> */}
                    </div>
                    <div className="col-md-3">
                      <label>End Working Day</label>
                      <input type="text" className="form-control" value={end_working_day} disabled />
                            {/* <DatePicker
                        dateFormat="DD/MM/YYYY"
                        value={this.state.end_working_day}
                        onChange={this.handleSelectedTodate}
                        timeFormat={false}
                        /> */}
                    </div>
                </div>
                <div className="row margin-top-20">
                <div className="col-md-3">
                      <label>Working Day / Calendar Day</label>
                      <input type="text" className="form-control" value={totalWorkingDay == 0 ? "Working Day": "Calendar Day"} disabled/>
                      {/* <div
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
                      </div> */}
                    </div>
                    <div className="col-md-3">
                      <label>Total Working Day</label>
                      <input
                        className="form-control"
                        
                        type="number"
                        data-name="totalWorkingDay"
                        value={totalWorkingDay}
                        disabled
                        // onChange={this.handletotalWorkingDay}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Salary Per Day</label>
                      <input
                        className="form-control"
                       
                        type="number"
                        data-name="salaryPerDay"
                        value={salaryPerDay}
                        disabled
                        // onChange={this.handlesalaryPerDay}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Total Salary</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="totalSalary"
                        value={totalSalary}
                        placeholder="Total Salary"
                        disabled
                        // onChange={this.ontotalSalaryChange}
                      />
                    </div>
                  </div>
                  <div className="row margin-top-20">
                    <div className="col-md-3">
                        <label>ATM / Cash</label>
                        <input type="text" className="form-control" value={atm_or_cash == 0 ? "ATM" : "Cash"} disabled/>
                        {/* <div
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
                        </div> */}
                      </div>
                    <div className="col-md-3">
                        <label>Total</label>
                        <input
                            className="form-control"
                            type="number"
                            data-name="total"
                            value={Total}
                            disabled
                            // onChange={this.handleTotal}
                        />
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
        </div>
      </div>
    );
  }
}
