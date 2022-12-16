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
      userInfo: {
        user_id: 0,
        employment_id: "",
        employee_name: "",
        deptname: "",
        career_sub_level: "",
        designations: "",
        location_master_name: "",
        state_name: "",
        basic_salary: 0,
      },
      addNewData: {
        requestMonth: new Date(),
        lastWorkingDay: new Date(),
        grossSalary: null,
        deduction_or_addition: 0,
        salary_after_deduction_or_addition: 0,
        ssc3: 0,
        ssc2: 0,
        incomeTax: 0,
        maintenance: 0,
        petrol: 0,
        totalSalary: 0,
        reason: "",
        atmOrCash: 0,
        exitStatus: 0,
        // exitStatusName: '',
      },
      dataSource: [],
      selectedEmployeeId: "",
      employeeIdList: [],
      exitStatusList: [],
    };
  }

  componentDidUpdate() {
    if (!form_validate) validate("check_form");
  }

  async componentDidMount() {
    this.getEmployeeCodeList();
    this.getExitStatus();
    let that = this;
    let id = await getUserId("user_info");
    let branch = await getBranch();
    this.setState({
      branch: branch,
      userId: id,
    });
    $(document).on("click", "#toEdit", function () {
      var data = $(this).find("#edit").text();
      data = $.parseJSON(data);

      let newData = that.state.dataSource;
      let editData = newData[data];
      console.log("editdata",editData)
      newData.splice(data, 1);
      that.setState(
        {
          dataSource: newData,
          addNewData: {
            requestMonth: editData.request_month,
            lastWorkingDay: editData.last_working_day,
            grossSalary: editData.gross_salary,
            deduction_or_addition: parseInt(editData.deduction_or_addition),
            salary_after_deduction_or_addition: editData.salary_after_deduction_or_addition,
            ssc3: editData.ssc3,
            ssc2: editData.ssc2,
            incomeTax: editData.income_tax,
            maintenance: editData.maintenance,
            petrol: editData.petrol,
            totalSalary: editData.total_salary,
            reason: editData.reason,
            atmOrCash: editData.atm_or_cash,
            exitStatus: editData.exit_status,
            // exitStatusName:  editData.exit_status_name,
          },
          userInfo: {
            user_id: editData.user_id,
            employment_id: editData.employment_id,
            employee_name: editData.employee_name,
            deptname: editData.deptname,
            career_sub_level: editData.career_sub_level,
            designations: editData.designations,
            location_master_name: editData.location_master_name,
            state_name: editData.state_name,
            basic_salary: editData.basic_salary,
          },
          selectedEmployeeId: editData.selectedEmployeeId,
        },
        () => that.setDataTable(newData)
      );
      console.log("edit data deduction or addition",that.state.addNewData.deduction_or_addition)
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

  getExitStatus() {
    fetch(`${main_url}employee/getExitStatus`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          exitStatusList: list.map((v) => ({
            ...v,
            label: v.status,
            value: v.id,
          })),
        });
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

  // onGrossSalaryChange = (e) => {
  //   let newValue = parseFloat(e.target.value);
  //   const newData = this.state.addNewData;
  //   newData.salary_after_deduction_or_addition =
  //     newValue + parseFloat(newData.deduction_or_addition);
  //   newData.grossSalary = newValue;
  //   newData.ssc3 = newData.salary_after_deduction_or_addition * 0.03;
  //   newData.ssc2 = newData.salary_after_deduction_or_addition * 0.02;
  //   newData.totalSalary =
  //     newData.salary_after_deduction_or_addition -
  //     newData.ssc2 -
  //     newData.incomeTax +
  //     newData.maintenance +
  //     newData.petrol;
  //   this.setState({ addNewData: newData });
  // };

  onDeductionOrAddition = (e) => {
    console.log("event",e.target.value)
    let newValue = parseInt(e.target.value);
    const newData = this.state.addNewData;
    console.log("type of basice salary",typeof(this.state.userInfo.basic_salary))
    newData.salary_after_deduction_or_addition =
      (this.state.userInfo.basic_salary!=undefined ? this.state.userInfo.basic_salary : newData.grossSalary) + newValue;
    console.log("event salary after deduction or addition",newData.salary_after_deduction_or_addition,typeof(newData.salary_after_deduction_or_addition))
    newData.deduction_or_addition = newValue;
    // newData.ssc3 = newData.salary_after_deduction_or_addition * 0.03;
    // newData.ssc2 = newData.salary_after_deduction_or_addition * 0.02;

    // newData.ssc2 = this.state.userInfo.basic_salary >= 300000 ? 300000*0.02 : this.state.userInfo.basic_salary * 0.02
    newData.totalSalary =
      newData.salary_after_deduction_or_addition -
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
      newData.salary_after_deduction_or_addition -
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
      newData.salary_after_deduction_or_addition -
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
      newData.salary_after_deduction_or_addition -
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
    newData.exitStatus = e;
    this.setState({ addNewData: newData });
  };

  addData = (e) => {
    const { userInfo, selectedEmployeeId } = this.state;
    if (validate("add_check_form")) {
      var data = [...this.state.dataSource];
      let newData = { ...this.state.addNewData };
      let tempData = {};
      tempData.request_month = newData.requestMonth;
      tempData.selectedEmployeeId = selectedEmployeeId;
      tempData.user_id = userInfo.user_id;
      tempData.employment_id = userInfo.employment_id;
      tempData.employee_name = userInfo.employee_name;
      tempData.designations = userInfo.designations;
      tempData.career_sub_level = userInfo.career_sub_level;
      tempData.deptname = userInfo.deptname;
      tempData.location_master_name = userInfo.location_master_name;
      tempData.state_name = userInfo.state_name;
      tempData.last_working_day = newData.lastWorkingDay;
      tempData.gross_salary = userInfo.basic_salary;
      tempData.deduction_or_addition = newData.deduction_or_addition;
      tempData.salary_after_deduction_or_addition = newData.salary_after_deduction_or_addition;
      tempData.SSC_employer = newData.ssc3;
      tempData.SSC_employee = newData.ssc2;
      tempData.income_tax = newData.incomeTax;
      tempData.maintenance = newData.maintenance;
      tempData.petrol = newData.petrol;
      tempData.total_salary = newData.totalSalary;
      tempData.reason = newData.reason;
      tempData.atm_or_cash = newData.atmOrCash;
      tempData.exit_status = newData.exitStatus;
      // tempData.exit_status_name = newData.exitStatusName;


      data.push(tempData);
      this.setState({
        dataSource: data,
        addNewData: {
          requestMonth: new Date(),
          lastWorkingDay: new Date(),
          grossSalary: null,
          deduction_or_addition: 0,
          salary_after_deduction_or_addition: 0,
          ssc3: 0,
          ssc2: 0,
          incomeTax: 0,
          maintenance: 0,
          petrol: 0,
          totalSalary: 0,
          reason: "",
          atmOrCash: 0,
          exitStatus: 0,
          // exitStatusName: '',
        },
        userInfo: {
          user_id: 0,
          employment_id: "",
          employee_name: "",
          deptname: "",
          career_sub_level: "",
          designations: "",
          location_master_name: "",
          state_name: "",
          basic_salary: 0,
        },
        selectedEmployeeId: "",
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
      // let exitStatusName = this.state.exitStatusList.filter(v => v.value == data[i].exit_status.value);
      // console.log('exitStatusName ====>', exitStatusName);
      const obj = {
        no: index + 1,
        request_month: data[i].request_month
          ? moment(data[i].request_month).format("YYYY-MM")
          : "-",
        employment_id: data[i].employment_id ? data[i].employment_id : "-",
        employee_name: data[i].employee_name ? data[i].employee_name : "-",
        designations: data[i].designations ? data[i].designations : "-",
        career_sub_level: data[i].career_sub_level
          ? data[i].career_sub_level
          : "-",
        deptname: data[i].deptname ? data[i].deptname : "-",
        location_master_name: data[i].location_master_name
          ? data[i].location_master_name
          : "-",
        state_name: data[i].state_name ? data[i].state_name : "-",
        last_working_day: data[i].last_working_day
          ? moment(data[i].last_working_day).format("DD-MM-YYYY hh:mm:ss")
          : "-",
        basic_salary: data[i].gross_salary ? data[i].gross_salary : 0,
        deduction_or_addition: data[i].deduction_or_addition
          ? data[i].deduction_or_addition
          : 0,
        salary_after_deduction_or_addition: data[i]
          .salary_after_deduction_or_addition
          ? data[i].salary_after_deduction_or_addition
          : 0,
        ssc3: data[i].SSC_employer ? data[i].SSC_employer : 0,
        ssc2: data[i].SSC_employee ? data[i].SSC_employee : 0,
        income_tax: data[i].income_tax ? data[i].income_tax : 0,
        maintenance: data[i].maintenance ? data[i].maintenance : 0,
        petrol: data[i].petrol ? data[i].petrol : 0,
        total_salary: data[i].total_salary ? data[i].total_salary : 0,
        reason: data[i].reason ? data[i].reason : "-",
        atm_or_cash: data[i].atm_or_cash == 0 ? "ATM" : "Cash",
        exit_status: data[i].exit_status != 0 ? data[i].exit_status.label : "-",
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
        { title: "Employee Name", data: "employee_name" },
        { title: "Designation", data: "designations" },
        { title: "Level", data: "career_sub_level" },
        { title: "Department", data: "deptname" },
        { title: "Branch", data: "location_master_name" },
        { title: "Region", data: "state_name" },
        { title: "Last Working Day", data: "last_working_day" },
        { title: "Gross Salary", data: "basic_salary" },
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
    if (validate("check_form")) {
      console.log("datasource",this.state.dataSource)
      // @lucy
      const dataTostring = this.state.dataSource.map((v) => {
        return {
          request_month: moment(v.request_month).format("YYYY-MM-DD"),
          user_id: v.user_id,
          employment_id: v.employment_id,
          employee_name: v.employee_name,
          designations: v.designations,
          career_sub_level: v.career_sub_level,
          deptname: v.deptname,
          location_master_name: v.location_master_name,
          state_name: v.state_name,
          last_working_day: moment(v.last_working_day).format(
            "YYYY-MM-DD hh:mm:ss"
          ),
          gross_salary: v.gross_salary,
          deduction_or_addition: v.deduction_or_addition,
          salary_after_deduction_or_addition:
            v.salary_after_deduction_or_addition,
            SSC_employer: v.SSC_employer,
            SSC_employee: v.SSC_employee,
          income_tax: parseFloat(v.income_tax),
          maintenance: v.maintenance,
          petrol: v.petrol,
          total_salary: v.total_salary,
          reason: v.reason,
          ATM_Cash: v.atm_or_cash,
          exit_status: v.exit_status.id,
          createdBy: this.state.userId,
        };
      });
      if (saveBtn) {
        $("#saving_button").attr("disabled", true);
        let status = 0;
        fetch(main_url + "resign_or_dismiss/add_resign_or_dismiss", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `data=${JSON.stringify(dataTostring)}`,
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

  getData(id) {
    fetch(`${main_url}employee/getDetailUser/${id}`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((data) => {
        if (data.length > 0) {
          this.setState({
            userInfo: {
              user_id: data[0].user_id,
              employment_id: data[0].employment_id,
              employee_name: data[0].employee_name,
              deptname: data[0].deptname,
              designations: data[0].designations,
              career_sub_level: data[0].career_sub_level,
              location_master_name: data[0].location_master_name,
              state_name: data[0].state_name,
              basic_salary: data[0].basic_salary,
            },
          },()=>{
            const newData = this.state.addNewData;
          newData.ssc2 = this.state.userInfo.basic_salary >= 300000 ? 300000*0.02 : this.state.userInfo.basic_salary * 0.02
          newData.ssc3 = this.state.userInfo.basic_salary >= 300000 ? 300000*0.03 : this.state.userInfo.basic_salary * 0.03
          newData.salary_after_deduction_or_addition=this.state.userInfo.basic_salary
          this.setState({ addNewData: newData });
          });
        }
      });
  }

  handleSelectedEmployeeId = (event) => {
    
    console.log("basic salary",this.state.userInfo.basic_salary)
    if (event !== null) this.getData(event.user_id);
    this.setState({
      selectedEmployeeId: event,
    },);
    
  };

  render() {
    const {
      addNewData,
      userId,
      userInfo,
      dataSource,
      employeeIdList,
      selectedEmployeeId,
      exitStatusList,
    } = this.state;

    console.log("hahahaahaah ===>", addNewData.salary_after_deduction_or_addition,typeof(addNewData.salary_after_deduction_or_addition),typeof(addNewData.deduction_or_addition));
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
                        dateFormat="MM/YYYY"
                        value={addNewData.requestMonth}
                        timeFormat={false}
                        onChange={this.onRequestMonthChange.bind(this)}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Employee ID</label>
                      <Select
                        options={employeeIdList}
                        value={selectedEmployeeId}
                        onChange={this.handleSelectedEmployeeId}
                        className="react-select-container checkValidate"
                        classNamePrefix="react-select"
                        isDisabled={
                          this.props.view
                            ? true
                            : this.props.edit
                            ? true
                            : false
                        }
                      />
                      {/* <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="employment_id"
                        value={userInfo.employment_id}
                        placeholder="Employee ID"
                        // onChange={this.claimChangeText}
                      /> */}
                    </div>
                    <div className="col-md-3">
                      <label>Employee Name</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="fullname"
                        value={userInfo.employee_name}
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
                        value={userInfo.deptname}
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
                        value={userInfo.location_master_name}
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
                        value={userInfo.state_name}
                        placeholder="Region"
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
                        // className="form-controlcheckValidate"
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Gross Salary</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="grossSalary"
                        value={userInfo.basic_salary ? userInfo.basic_salary : addNewData.gross_salary}
                        placeholder="Enter Lodging"
                        disabled={true}
                        // onChange={this.onGrossSalaryChange}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Deduciton or Addition</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="deduction_or_addition"
                        value={addNewData.deduction_or_addition}
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
                        data-name="salary_after_deduction_or_addition"
                        value={addNewData.salary_after_deduction_or_addition}
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
                        data-name="ssc3"
                        value={addNewData.ssc3 ? addNewData.ssc3 : addNewData.SSC_employer}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>SSC (Employee 2%)</label>
                      <input
                        className="form-control"
                        disabled
                        type="number"
                        data-name="ssc2"
                        value={addNewData.ssc2 ? addNewData.ssc2 : addNewData.SSC_employee}
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
                      <label>Exit Status</label>
                      <Select
                        options={exitStatusList}
                        value={addNewData.exitStatus}
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
                    <div className="col-md-6">
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
