import React, { Component } from "react";
import moment from "moment";
import { main_url } from "../../../utils/CommonFunction";
import ApprovalInformation from '../../Common/ApprovalInformation';

export default class ResignOrDismissSalaryView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
    };
  }
  componentDidMount(){
    this.getStatusInfo()
  }
  getStatusInfo() {
    fetch(`${main_url}resign_or_dismiss/getOneDetailInfo/${this.props.dataSource.id}`)
        .then(res => res.json())
        .then(res => {
            this.setState({
                status_info: res
            })
        })
        .catch(error => console.log(error))
}
  render() { 
    console.log("datasource ",this.props.dataSource)
    const {
      request_month,
      employment_id,
      fullname,
      designations,
      deptname,
      location_master_name,
      state_name,
      gross_salary,
      last_working_day,
      deduction_or_addition,
      after_deduction_or_addition,
      income_tax,
      SSC_employer,
      SSC_employee,
      maintenance,
      petrol,
      total_salary,
      exit_status,
      ATM_Cash,
      reason,
      career_sub_level,
    } = this.props.dataSource;
    return (
      <div className="white-bg">
        <div className="row margin-top-20 ">
          <div className="col-md-3">
            <label>Request Month</label>
            <input
              className="form-control"
              disabled
              type="text"
              placeholder={"Request Month"}
              value={moment(request_month).format('MM/YYYY')}
            />
          </div>
          <div className="col-md-3">
            <label>Employee ID</label>
            <input
              className="form-control"
              disabled
              type="text"
              placeholder={"Employee ID"}
              value={employment_id}
            />
          </div>
          <div className="col-md-3">
            <label>Employee Name</label>
            <input
              className="form-control"
              disabled
              type="text"
              value={fullname}
              placeholder={"Employee Name"}
            />
          </div>
          <div className="col-md-3">
            <label>Designation</label>
            <input
              className="form-control"
              disabled
              type="text"
              value={designations}
              placeholder="Designation"
            />
          </div>
        </div>
        <div className="row margin-top-20 ">
        <div className="col-md-3">
            <label>Level</label>
            <input
              className="form-control"
              disabled
              type="text"
              value={career_sub_level}
              placeholder={"Level"}
            />
          </div>
          <div className="col-md-3">
            <label>Department</label>
            <input
              className="form-control"
              disabled
              type="text"
              placeholder={"Department"}
              value={deptname}
            />
          </div>
          <div className="col-md-3">
            <label>Branch</label>
            <input
              className="form-control"
              disabled
              type="text"
              placeholder={"Branch"}
              value={location_master_name}
            />
          </div>
          <div className="col-md-3">
            <label>Region</label>
            <input
              className="form-control"
              disabled
              type="text"
              value={state_name}
              placeholder={"Region"}
            />
          </div>
          
        </div>
        <div className="row margin-top-20 ">
        <div className="col-md-3">
            <label>Gross Salary</label>
            <input
              className="form-control"
              disabled
              type="text"
              value={gross_salary}
              placeholder="Gross Salary"
            />
          </div>
          <div className="col-md-3">
            <label>Last Working Day</label>
            <input
              className="form-control"
              disabled
              type="text"
              placeholder={"Last Working Day"}
              value={moment(last_working_day).format('DD/MM/YYYY')}
            />
          </div>
          <div className="col-md-3">
            <label>Deduction or Addition</label>
            <input
              className="form-control"
              disabled
              type="text"
              placeholder={"Deduction or Addition"}
              value={deduction_or_addition}
            />
          </div>
          <div className="col-md-3">
            <label>Salary After Deduction or Addition</label>
            <input
              className="form-control"
              disabled
              type="text"
              value={after_deduction_or_addition}
              placeholder={"Salary After Deduction or Addition"}
            />
          </div>
          
        </div>
        <div className="row margin-top-20 ">
          <div className="col-md-3">
            <label>SSC (Employee 3%)</label>
            <input
              className="form-control"
              disabled
              type="text"
              placeholder={"SSC (Employee 3%)"}
              value={SSC_employer}
            />
          </div>
          <div className="col-md-3">
            <label>SSC (Employee 2%)</label>
            <input
              className="form-control"
              disabled
              type="text"
              placeholder={"SSC (Employee 2%)"}
              value={SSC_employee}
            />
          </div>
          <div className="col-md-3">
            <label>Income Tax</label>
            <input
              className="form-control"
              disabled
              type="text"
              value={income_tax}
              placeholder="Income Tax"
            />
          </div>
          <div className="col-md-3">
            <label>Maintenance</label>
            <input
              className="form-control"
              disabled
              type="text"
              value={maintenance}
              placeholder={"Maintenance"}
            />
          </div>
          
        </div>
        <div className="row margin-top-20 ">
        <div className="col-md-3">
            <label>Petrol</label>
            <input
              className="form-control"
              disabled
              type="text"
              value={petrol}
              placeholder="Petrol"
            />
          </div>
          <div className="col-md-3">
            <label>Total Salary</label>
            <input
              className="form-control"
              disabled
              type="text"
              placeholder={"Total Salary"}
              value={total_salary}
            />
          </div>
          <div className="col-md-3">
            <label>Exit Status</label>
            <input
              className="form-control"
              disabled
              type="text"
              placeholder={"Exit Status"}
              value={exit_status == 1
                ? "Resign"
                : exit_status == 2
                ? "Dismiss"
                : exit_status == 3
                ? "Termination"
                : exit_status == 4
                ? "Dead"
                : ""}
            />
          </div>
          <div className="col-md-3">
            <label>ATM or Cash</label>
            <input
              className="form-control"
              disabled
              type="text"
              value={ATM_Cash == 0 ? 'ATM' : 'Cash'}
              placeholder={"ATM or Cash"}
            />
          </div>
          
        </div>
        <div className="row margin-top-20 ">
        <div className="col-md-6">
            <label>Reason</label>
            <input
              className="form-control"
              disabled
              multiple
              type="text"
              value={reason}
              placeholder="reason"
            />
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
