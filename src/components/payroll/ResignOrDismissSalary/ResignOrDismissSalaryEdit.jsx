import React, { Component } from "react";
import {
  main_url,
  stopSaving,
  startSaving,
  getUserInfo,
  havePermission,
  getActionStatus
} from "../../../utils/CommonFunction";
import "react-toastify/dist/ReactToastify.min.css";
import { toast, ToastContainer } from "react-toastify";
import ApprovalForm1 from "../../Common/ApprovalForm1";
import DatePicker from "react-datetime";
import {
  getUserId,
  validate,
  getBranch,
  alertText,
  getWorkFlowStatus
} from "../../../utils/CommonFunction";
import Select from "react-select";
import moment from "moment";
const $ = require("jquery");

const exit_status_array = [
    {label: 'Resign', value: 1},
    {label: 'Dismiss', value: 2},
    {label: 'Termination', value: 3},
    {label: 'Dead', value: 4},
]

export default class ResignOrDismissSalaryEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
      exitStatusList: [],
      employeeIdList: [],
      is_main_role:false,
      work_flow_status:{},
      status_title:'',
      comment:'',
      updatedBy:getUserId("user_info")
      
    };
  }

  async componentDidMount() {
    await this.getExitStatus();
    var work_flow = await getWorkFlowStatus(this.state.dataSource.user_id, this.state.updatedBy, 'Child Benefit', 'Benefit');
    this.setState({
        work_flow_status: work_flow,
        is_main_role: havePermission(work_flow)
    })

    this.setState({
      dataSource: this.props.dataSource,
    });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.dataSource != this.props.dataSource) {
      this.setState({
        dataSource: this.props.dataSource,
      });
    }
  }

  async getExitStatus() {
    await fetch(`${main_url}employee/getExitStatus`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        const exitStatusArray = [];
        list.map((v) => {
          const obj = {};
          obj["label"] = v.status;
          obj["value"] = v.id;
          exitStatusArray.push(obj);
        });
        this.setState({
          exitStatusList: exitStatusArray,
        });
      });
  }

  getEmployeeCodeList() {
    fetch(`${main_url}employee/getEmployeeCode`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        const employeeArray = [];
        list.map((v) => {
          const obj = {};
          obj["label"] = v.employee_code;
          obj["value"] = v.user_id;
          employeeArray.push(obj);
        });
        this.setState({
          employeeIdList: employeeArray,
        });
      });
  }

  onRequestMonthChange = (e) => {
    const newData = {...this.state.dataSource};
    newData.request_month = e;
    this.setState({ dataSource: newData });
  };

  onLastWorkingDay = (e) => {
    const newData = {...this.state.dataSource};
    newData.last_working_day = e;
    this.setState({ dataSource: newData });
  };

  onDeductionOrAddition = (e) => {
    let newValue = e.target.value;
    const newData = {...this.state.dataSource};
    newData.after_deduction_or_addition =
      newData.gross_salary + parseFloat(newValue);
    newData.deduction_or_addition = newValue;
    newData.SSC_employer = newData.after_deduction_or_addition * 0.03;
    newData.SSC_employee = newData.after_deduction_or_addition * 0.02;
    newData.total_salary =
      newData.after_deduction_or_addition -
      newData.SSC_employee -
      newData.income_tax +
      newData.maintenance +
      newData.petrol;
    this.setState({ dataSource: newData });
  };

  onIncomeTaxChange = (e) => {
    let newValue = parseFloat(e.target.value);
    const newData = {...this.state.dataSource};
    newData.income_tax = newValue;
    newData.total_salary =
      newData.after_deduction_or_addition -
      newData.SSC_employee -
      newData.income_tax +
      newData.maintenance +
      newData.petrol;
    this.setState({ dataSource: newData });
  };

  onMaintenanceChange = (e) => {
    let newValue = parseFloat(e.target.value);
    const newData = {...this.state.dataSource};
    newData.maintenance = newValue;
    newData.total_salary =
      newData.after_deduction_or_addition -
      newData.SSC_employee -
      newData.income_tax +
      newData.maintenance +
      newData.petrol;
    this.setState({ dataSource: newData });
  };

  onPetrolChange = (e) => {
    let newValue = parseFloat(e.target.value);
    const newData = {...this.state.dataSource};
    newData.petrol = newValue;
    newData.total_salary =
      newData.after_deduction_or_addition -
      newData.SSC_employee -
      newData.income_tax +
      newData.maintenance +
      newData.petrol;
    this.setState({ dataSource: newData });
  };

  onReasonChange = (e) => {
    const newData = {...this.state.dataSource};
    newData.reason = e.target.value;
    this.setState({ dataSource: newData });
  };

  onRadioChange = (e) => {
    const newData = {...this.state.dataSource};
    newData.ATM_Cash = parseInt(e.target.value);
    this.setState({ dataSource: newData });
  };

  handleChangeExitStatus = (e) => {
    const newData = {...this.state.dataSource};
    newData.exit_status = e;
    this.setState({ dataSource: newData });
  };

  exit_status_value = (value) => {
    const newValue = exit_status_array.filter(a => a.value == value);
    return newValue[0];
  }
  approvalStatus = (text, comment) => {
    this.setState({ status_title: text, comment: comment },
        () => this.edit())
}

  edit = () => {
    const {dataSource} = this.state;
    if (validate("check_form")) {
        // @lucy
        var { status_title, is_main_role } = this.state;
       
        
          const obj = {
            request_month: moment(dataSource.request_month).format("YYYY-MM-DD"),
            user_id: dataSource.user_id,
            employment_id: dataSource.employment_id,
            employee_name: dataSource.employee_name,
            designations: dataSource.designations,
            career_sub_ledataSourceel: dataSource.career_sub_ledataSourceel,
            deptname: dataSource.deptname,
            location_master_name: dataSource.location_master_name,
            state_name: dataSource.state_name,
            last_working_day: moment(dataSource.last_working_day).format(
              "YYYY-MM-DD hh:mm:ss"
            ),
            basic_salary: dataSource.basic_salary,
            deduction_or_addition: dataSource.deduction_or_addition,
            after_deduction_or_addition:
              dataSource.after_deduction_or_addition,
            SSC_employer: dataSource.SSC_employer,
            SSC_employee: dataSource.SSC_employee,
            income_tax: parseFloat(dataSource.income_tax),
            maintenance: dataSource.maintenance,
            petrol: dataSource.petrol,
            total_salary: dataSource.total_salary,
            reason: dataSource.reason,
            ATM_Cash: dataSource.ATM_Cash,
            exit_status: dataSource.exit_status.value,
            // createdBy: dataSource.createdBy,
            // check_by: dataSource.check_by,
            // verify_by: dataSource.verify_by,
            // approve_by: dataSource.approve_by,
            // referback_by: dataSource.referback_by,
            status:this.state.dataSource.status == 5 ? 0 : this.state.dataSource.status,
            updatedBy:this.state.updatedBy 
          };
          if (status_title !== '' && is_main_role) {
            
            var action = getActionStatus(status_title, this.state.dataSource, this.state.updatedBy, this.state.comment);
            obj.referback_by = action.referback_by;
            obj.checked_by = action.checked_by;
            obj.verified_by = action.verified_by;
            obj.approved_by = action.approved_by;
            obj.rejected_by = action.rejected_by;
            obj.referback_date = action.referback_date;
            obj.checked_date = action.checked_date;
            obj.verified_date = action.verified_date;
            obj.approved_date = action.approved_date;
            obj.rejected_date = action.rejected_date;
            obj.referback_comment = action.referback_comment;
            obj.checked_comment = action.checked_comment;
            obj.verified_comment = action.verified_comment;
            obj.approved_comment = action.approved_comment;
            obj.status = action.status;
    
        }
        
          let status = 0;
          fetch(main_url + `resign_or_dismiss/edit_resign_or_dismiss/${dataSource.id}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `data=${JSON.stringify(obj)}`,
          })
            .then((response) => {
              status = response.status;
              return response.text();
            })
            .then((text) => {
              if (status == 200) {
                toast.success(text, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
                window.location.reload();
              } else {
                toast.error(text, {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                });
              }
            });
        
      } else {
        startSaving();
        toast.error(alertText, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
  }

  render() {
    const { dataSource, exitStatusList } = this.state;
    console.log("dataSource =====>",havePermission(this.state.work_flow_status), this.state.dataSource);
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
                        value={new Date(dataSource.request_month)}
                        timeFormat={false}
                        onChange={this.onRequestMonthChange.bind(this)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Employee ID</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="employment_id"
                        value={dataSource.employment_id}
                        placeholder="Employee ID"
                        // onChange={this.claimChangeText}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Employee Name</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="fullname"
                        value={dataSource.fullname}
                        placeholder="Employee Name"
                        // onChange={this.claimChangeText}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Designation</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="designation"
                        value={dataSource.designations}
                        placeholder="designation"
                        // onChange={this.claimChangeText}
                      />
                    </div>
                  </div>
                  <div className="row margin-top-20">
                    <div className="col-md-3">
                      <label>Level</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="career_sub_level"
                        value={dataSource.career_sub_level}
                        placeholder="Level"
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Department</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="deptname"
                        value={dataSource.deptname}
                        placeholder="Department"
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Branch</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="branch_name"
                        value={dataSource.location_master_name}
                        placeholder="Branch"
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Region</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="state_name"
                        value={dataSource.state_name}
                        placeholder="Region"
                      />
                    </div>
                  </div>
                  <div className="row margin-top-20">
                    <div className="col-md-3">
                      <label>Last Working Day</label>
                      <DatePicker
                        dateFormat="DD/MM/YYYY"
                        value={new Date(dataSource.last_working_day)}
                        timeFormat={false}
                        onChange={this.onLastWorkingDay}
                        // className="form-control checkValidate"
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Gross Salary</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="grossSalary"
                        value={dataSource.gross_salary}
                        placeholder="Enter Lodging"
                        disabled={true}
                        // onChange={this.onGrossSalaryChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Deduciton or Addition</label>
                      <input
                        className="form-control checkValidate"
                        type="number"
                        data-name="deduction_or_addition"
                        value={dataSource.deduction_or_addition}
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
                        data-name="after_deduction_or_addition"
                        value={dataSource.after_deduction_or_addition}
                        placeholder={"Enter Salary After Deduction or Addition"}
                      />
                    </div>
                  </div>
                  <div className="row margin-top-20">
                    <div className="col-md-3">
                      <label>SSC (Employer 3%)</label>
                      <input
                        className="form-control"
                        disabled
                        type="number"
                        data-name="SSC_employer"
                        value={dataSource.SSC_employer}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>SSC (Employee 2%)</label>
                      <input
                        className="form-control"
                        disabled
                        type="number"
                        data-name="SSC_employee"
                        value={dataSource.SSC_employee}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Income Tax</label>
                      <input
                        className="form-control checkValidate"
                        type="number"
                        data-name="income_tax"
                        value={dataSource.income_tax}
                        placeholder={"Enter Income Tax"}
                        onChange={this.onIncomeTaxChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Maintenance</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="maintenance"
                        value={dataSource.maintenance}
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
                        value={dataSource.petrol}
                        placeholder={"Enter Petrol"}
                        onChange={this.onPetrolChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Total Salary</label>
                      <input
                        className="form-control"
                        disabled
                        type="number"
                        data-name="total_salary"
                        value={dataSource.total_salary}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Exit Status</label>
                      <Select
                        options={exitStatusList}
                        value={this.exit_status_value(dataSource.exit_status)}
                        onChange={this.handleChangeExitStatus}
                        className="react-select-container checkValidate"
                        classNamePrefix="react-select"
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
                          checked={dataSource.ATM_Cash
                            == 0 ? true : false}
                        />{" "}
                        <span>ATM</span>
                        <input
                          type="radio"
                          value={1}
                          name="work"
                          checked={dataSource.ATM_Cash
                            == 1 ? true : false}
                        />{" "}
                        <span>Cash</span>
                      </div>
                    </div>
                  </div>
                  <div className="row margin-top-20">
                    <div className="col-md-6">
                      <label>Reason</label>
                      <input
                        className="form-control checkValidate"
                        type="text"
                        data-name="reason"
                        value={dataSource.reason}
                        placeholder="Enter Reason"
                        onChange={this.onReasonChange}
                        multiple
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="col-md-12">
                <div className="col-md-12 btn-rightend mt20">
                  <button
                    onClick={this.edit.bind(this)}
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
                            <ApprovalForm1 approvalStatus={this.approvalStatus.bind(this)} status={this.state.dataSource.status} work_flow={this.state.work_flow_status} />
                            :
                            <div className="col-md-12 btn-rightend">
                                { this.state.dataSource.status == 5 ?
                                    <div>
                                        <button onClick={this.edit.bind(this)} className="btn btn-primary" id="saving_button" type="button">Confirm</button>
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
