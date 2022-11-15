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

export default class ResignOrDismissSalaryAddNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      userInfo: {},
      addNewData: {
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
      },
      dataSource: [],
      attachment: [],
      newDoc: [],
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
      newData.splice(data, 1);
      that.setState(
        {
          dataSource: newData,
          addNewData: {
            requestMonth: editData.request_month,
            lastWorkingDay: editData.last_working_day,
            grossSalary: editData.gross_salary,
            deductionOrAddition: editData.deduction_or_addition,
            salaryAfterDorA: editData.salary_after_deduction_or_addition,
            ssc3: editData.ssc3,
            ssc2: editData.ssc2,
            incomeTax: editData.income_tax,
            maintenance: editData.maintenance,
            petrol: editData.petrol,
            totalSalary: editData.total_salary,
            reason: editData.reason,
            atmOrCash: editData.atm_or_cash,
            exitStatus: editData.exit_status,
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

  onIncomeTaxChange = (e) => {
    let newValue = parseFloat(e.target.value);
    const newData = this.state.addNewData;
    newData.incomeTax = newValue;
    newData.totalSalary =
      newData.salaryAfterDorA -
      newData.ssc2 -
      newData.incomeTax +
      newData.maintenance +
      newData.petrol;
    this.setState({ addNewData: newData });
  };

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

  removeNewDocument(index, event) {
    var array = this.state.newDoc;
    array.splice(index, 1);
    this.setState({
      newDoc: array,
    });
  }
  addData = (e) => {
    const { userInfo } = this.state;
    console.log("userInfo ===>", userInfo);
    if (validate("add_check_form")) {
      var data = [...this.state.dataSource];
      let newData = { ...this.state.addNewData };
      let tempData = {};
      tempData.request_month = newData.requestMonth;
      tempData.employment_id = userInfo.employment_id;
      tempData.fullname = userInfo.fullname;
      tempData.designations = userInfo.designations;
      tempData.level = userInfo.career_sub_level;
      tempData.deptname = userInfo.deptname;
      tempData.branch_name = userInfo.branch_name;
      tempData.state_name = userInfo.state_name;
      tempData.last_working_day = newData.lastWorkingDay;
      tempData.gross_salary = newData.grossSalary;
      tempData.deduction_or_addition = newData.deductionOrAddition;
      tempData.salary_after_deduction_or_addition = newData.salaryAfterDorA;
      tempData.ssc3 = newData.ssc3;
      tempData.ssc2 = newData.ssc2;
      tempData.income_tax = newData.incomeTax;
      tempData.maintenance = newData.maintenance;
      tempData.petrol = newData.petrol;
      tempData.total_salary = newData.totalSalary;
      tempData.reason = newData.reason;
      tempData.atm_or_cash = newData.atmOrCash;
      tempData.exit_status = newData.exitStatus;

      var totalAmount = 0;

      data.push(tempData);
      this.setState({
        dataSource: data,
        addNewData: {
          requestMonth: new Date(),
          lastWorkingDay: new Date(),
          grossSalary: 0,
          deductionOrAddition: 0,
          salaryAfterDorA: 0,
          ssc3: 0,
          ssc2: 0,
          incomeTax: 0,
          maintenance: "",
          petrol: "",
          totalSalary: 0,
          reason: "",
          atmOrCash: 0,
          exitStatus: 0,
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
        level: data[i].level ? data[i].level : "-",
        deptname: data[i].deptname ? data[i].deptname : "-",
        branch_name: data[i].branch_name ? data[i].branch_name : "-",
        state_name: data[i].state_name ? data[i].state_name : "-",
        last_working_day: data[i].last_working_day
          ? moment(data[i].last_working_day).format("DD-MM-YYYY hh:mm:ss")
          : "-",
        gross_salary: data[i].gross_salary ? data[i].gross_salary : 0,
        deduction_or_addition: data[i].deduction_or_addition
          ? data[i].deduction_or_addition
          : 0,
        salary_after_deduction_or_addition: data[i]
          .salary_after_deduction_or_addition
          ? data[i].salary_after_deduction_or_addition
          : 0,
        ssc3: data[i].ssc3 ? data[i].ssc3 : 0,
        ssc2: data[i].ssc2 ? data[i].ssc2 : 0,
        income_tax: data[i].income_tax ? data[i].income_tax : 0,
        maintenance: data[i].maintenance ? data[i].maintenance : 0,
        petrol: data[i].petrol ? data[i].petrol : 0,
        total_salary: data[i].total_salary ? data[i].total_salary : 0,
        reason: data[i].reason ? data[i].reason : "-",
        atm_or_cash: data[i].atm_or_cash == 0 ? "ATM" : "Cash",
        exit_status: data[i].exit_status != 0 ? data[i].exit_status : "-",
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
        { title: "Request Month", data: "request_month" },
        { title: "Employee Id", data: "employment_id" },
        { title: "Employee Name", data: "fullname" },
        { title: "Designation", data: "designations" },
        { title: "Level", data: "level" },
        { title: "Department", data: "deptname" },
        { title: "Branch", data: "branch_name" },
        { title: "Region", data: "state_name" },
        { title: "Last Working Day", data: "last_working_day" },
        { title: "Gross Salary", data: "gross_salary" },
        { title: "Deduction or Addition", data: "deduction_or_addition" },
        {
          title: "Salary After Deduciton or Addition",
          data: "salary_after_deduction_or_addition",
        },
        { title: "SSC Employee(3%)", data: "ssc3" },
        { title: "SSC Employee(2%)", data: "ssc2" },
        { title: "Income Tax", data: "income_tax" },
        { title: "Maintenance", data: "maintenance" },
        { title: "Petrol", data: "petrol" },
        { title: "Total Salary", data: "total_salary" },
        { title: "Reason", data: "reason" },
        { title: "ATM/Cash", data: "atm_or_cash" },
        { title: "Exit Status", data: "exit_status" },
        { title: "Action", data: "action" },
      ],
    });
  }

  check = () => {
    // if (this.state.newDoc.length == 0) {
    //     toast.error("Please Choose Attachment File!")
    // } else {
    if (validate("check_form")) {
      // @lucy
      const dataTostring = this.state.dataSource.map((v) => {
        return {
          request_month: moment(v.request_month).format("DD-MM-YYYY"),
          employment_id: v.employment_id,
          fullname: v.fullname,
          designations: v.designations,
          level: v.level,
          deptname: v.deptname,
          branch_name: v.branch_name,
          state_name: v.state_name,
          last_working_day: moment(v.last_working_day).format(
            "DD-MM-YYYY hh:mm:ss"
          ),
          gross_salary: v.gross_salary,
          deduction_or_addition: v.deduction_or_addition,
          salary_after_deduction_or_addition:
            v.salary_after_deduction_or_addition,
          ssc3: v.ssc3,
          ssc2: v.ssc2,
          income_tax: v.income_tax,
          maintenance: v.maintenance,
          petrol: v.petrol,
          total_salary: v.total_salary,
          reason: v.reason,
          atm_or_cash: v.atm_or_cash,
          exit_status: v.exit_status,
        };
      });
      if (saveBtn) {
        $("#saving_button").attr("disabled", true);
        this.props.addClaimRequest(
          dataTostring,
          this.state.data,
          this.state.newDoc
        );
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
    console.log("addNewData =====>", addNewData, dataSource);
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
                      <label>Employee ID</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="employment_id"
                        value={userInfo.employment_id}
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
                        value={userInfo.fullname}
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
                        value={userInfo.designations}
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
                        value={userInfo.career_sub_level}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Department</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="deptname"
                        value={userInfo.deptname}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Branch</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="branch_name"
                        value={userInfo.branch_name}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Region</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="state_name"
                        value={userInfo.state_name}
                      />
                    </div>
                  </div>
                  <div className="row margin-top-20">
                    <div className="col-md-3">
                      <label>Last Working Day</label>
                      <DatePicker
                        dateFormat="DD/MM/YYYY"
                        value={addNewData.lastWorkingDay}
                        timeFormat={false}
                        onChange={this.onLastWorkingDay}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Gross Salary</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="grossSalary"
                        value={addNewData.grossSalary}
                        placeholder="Enter Lodging"
                        onChange={this.onGrossSalaryChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Deduciton or Addition</label>
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
                      <label>Income Tax</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="incomeTax"
                        value={addNewData.incomeTax}
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
                      <label>Total Salary</label>
                      <input
                        className="form-control"
                        disabled
                        type="number"
                        data-name="totalSalary"
                        value={addNewData.totalSalary}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Reason</label>
                      <input
                        className="form-control"
                        type="text"
                        data-name="reason"
                        value={addNewData.reason}
                        placeholder="Enter Reason"
                        onChange={this.onReasonChange}
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
                  </div>
                  <div className="row margin-top-20">
                    <div className="col-md-3">
                      <label>Exit Status</label>
                      <Select
                        placeholder="Select Exit Status"
                        options={[]}
                        value={addNewData.exitStatus}
                        onChange={this.handleChangeExitStatus}
                        className="react-select-container"
                        classNamePrefix="react-select"
                      />
                    </div>
                    <div className="col-md-9 btn-rightend">
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
                <div className="col-md-12">
                  <div
                    className="col-md-12"
                    style={{
                      marginTop: 30,
                    }}
                  ></div>
                  <div className="col-sm-10">
                    <input
                      className="dropZone "
                      type="file"
                      id="travelCRDrop"
                      multiple
                      onChange={this.handlefileChanged.bind(this)}
                    ></input>
                  </div>
                </div>

                <div>
                  {this.state.newDoc.map((data, index) => (
                    <div className="fileuploader-items col-md-4">
                      <ul className="fileuploader-items-list">
                        <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                          <div className="columns">
                            <div className="column-thumbnail">
                              <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                <div
                                  className="fileuploader-item-icon"
                                  style={{ backgroundColor: "#3f4fd3" }}
                                >
                                  <i>{data.name.split(".")[1]}</i>
                                </div>
                              </div>
                              <span className="fileuploader-action-popup"></span>
                            </div>
                            <div className="column-title">
                              <span className="own-text">{data.name}</span>
                            </div>
                            <div className="column-actions">
                              <a
                                className="fileuploader-action fileuploader-action-remove"
                                onClick={(event) =>
                                  this.removeNewDocument(index, event)
                                }
                              >
                                {" "}
                                <i></i>
                              </a>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>

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
