import React, { Component } from "react";
import {
  getBranch,
  getRegion,
  getDepartment,
  main_url,
  getFirstDayOfMonth,
  getUserId,
  getPermissionStatus,
  getCookieData
} from "../../utils/CommonFunction";
import DatePicker from "react-datetime";
import moment from "moment";
import Rodal from "rodal";
import Select from "react-select";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";
import { fabClasses } from "@mui/material";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");

class ImcompleteAndMissingReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      checkedListData:[],
      user_info:getCookieData("user_info"),
      permission_status:{},
      branch: [],
      region: [],
      department: [],
      branchId: { value: 0, label: "All" },
      regionId: { value: 0, label: 'All' },
      departmentId: { value: 0, label: "All" },
      from_date: moment(getFirstDayOfMonth()),
      to_date: moment(),
      EmployeeNameList: [],
      selectedEmployeeName: { value: 0, label: "All" },
      selected_checkbox_incom: 0,
      selected_checkbox_missing:0,
      incomplete: 0,
      checkboxAll:true,
      missingAttendance: 0,
      AttendanceType: null,
      selectedAttendance: { value: 0, label: "All" },
      visibleApprove: false,
      optionList: [
        {
          label: "Attendance",
          value: 1,
        },
        {
          label: "Late Check In",
          value: 2,
        },
        {
          label: "Early Check Out",
          value: 3,
        },
        {
          
            label: "Absence",
            value: 4,
          
        }
      ],
      selectedOption: { value: 0, label: "Select Option" },
      user_id: getUserId("user_info"),
      approve_data: {},
      attendancePolicyList:[]
    };
  }

  async componentDidMount() {
    this.$el = $(this.el);
    const {
      branchId,
      departmentId,
      regionId,
      selectedAttendance,
      selectedEmployeeName,
      from_date,
      to_date,
      user_id,
      selected_checkbox,
    } = this.state;
    var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Incomplete And Missing Report', 'Attendance');

    //  var permission_status = await getPermissionStatus(this.state.user_info.role_id, 'Attendance', 'Attendance');
    let branch = await getBranch();
    branch.unshift({ label: "All", value: 0 });
    let department = await getDepartment();
    department.unshift({ label: "All", value: 0 });
    let region = await getRegion();
    region.unshift({ state_name: "ALL", state_id: 0 });
    this.setState({
      permission_status:permission_status,
      branch: branch,
      department: department,
      region: region.map((v) => ({
        ...v,
        label: v.state_name,
        value: v.state_id,
      })),
    });
    this.handleSearchData();
    this.getEmployeeName();
    this.getAttendanceType();
    this.attendancePolicy();
    let that = this;
    $("#dataTables-table").on("click", "#toEditApprove", function () {
      var data = $(this).find("#editApprove").text();
      data = $.parseJSON(data);
      that.handleVisibleApprove(data);
    });
    $("#dataTables-table").on("click", "#toSelect", function () {
      var data = $(this).find("#select").text();
      data = $.parseJSON(data);
      that.handleCheckBoxChange(data);
      // var selectEle = $(this).find("#check1");
    });
  }
  attendancePolicy(){
    fetch(`${main_url}attendancePolicy/getAttendancePolicy`)
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((list) => {
      // let lists = list.unshift({ value: 0, label: "All" });
      this.setState({
        attendancePolicyList:list
      });
    });
  }
  goToEditForm() {}
  getEmployeeName() {
    fetch(`${main_url}report/employeeName`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          EmployeeNameList: list.map((v) => ({
            ...v,
          })),
        });
      });
  }
  getAttendanceType() {
    fetch(`${main_url}attendance/attendanceStatus`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          AttendanceType: list.map((v) => ({
            ...v,
          })),
        });
      });
  }
  handleSelectedBranch = async (event) => {
    this.setState({
      branchId: event,
    });
  };
  handleSelectedEmployeeName = async (event) => {
    this.setState({
      selectedEmployeeName: event,
    });
  };

  handleSelectedDepartment = async (event) => {
    this.setState({
      departmentId: event,
    });
  };
  handleSelectedRegion = async (event) => {
    this.setState({
      regionId: event,
    });
  };
  handleSelectedFromdate = async (event) => {
    this.setState({
      from_date: event,
    });
  };
  handleSelectedTodate = async (event) => {
    this.setState({
      to_date: event,
    });
  };
  handleSelectedAttendance = async (event) => {
    this.setState({
      selectedAttendance: event,
    });
  };
  handleSelectedOption = async (event) => {
    this.setState({
      selectedOption: event,
    });
  };
  handleCheckboxIncom = async (event) => {
    if(event.target.checked == true){
      this.setState({
        selected_checkbox_incom:event.target.value
      })
    }else{
      this.setState({
        selected_checkbox_incom:0
      })
    }
  };
  handleCheckboxMissing = async (event) => {
    if(event.target.checked == true){
      this.setState({
        selected_checkbox_missing:event.target.value
      })
    }else{
      this.setState({
        selected_checkbox_missing:0
      })
    }
  };
  handleCheckBoxChange = async (newData) => {
    const { checkedListData } = this.state;
    const checkedListData_ = [...checkedListData];
  
    if (checkedListData_.length === 0) {
      checkedListData_.push(newData);
      this.setState({ checkedListData: checkedListData_ });

    } else if (checkedListData_.filter((c) => c.user_id === newData.user_id).length > 0) {
      for (var i = 0; i < checkedListData_.length; i++) {
        if (checkedListData_[i].user_id == newData.user_id && checkedListData_[i].date === newData.date) {
          checkedListData_.splice(i, 1);
        }
      }
      this.setState({
        checkedListData: checkedListData_,
      });
    } else {
      checkedListData_.push(newData);
      this.setState({
        checkedListData: checkedListData_,
      });
    }
  };

  handleCheckboxAll =  (e) => {
   
    this.setState({ checkboxAll: e}
     
);
    if (this.state.checkboxAll == true) {
      this.setState({
        checkedListData:this.state.dataSource,
      });
    } else {
      this.setState({ checkedListData: [] });
    }
  };
  handleSearchData = () => {
    let checkbox=this.state.selected_checkbox_incom == 0 && this.state.selected_checkbox_missing == 0 || this.state.selected_checkbox_incom ==1 && this.state.selected_checkbox_missing ==2  ? 0 : this.state.selected_checkbox_incom ? 1 : this.state.selected_checkbox_missing ? 2 : 0
    // let checkbox=(this.state.selected_checkbox_incom ==1 && this.state.selected_checkbox_missing ==2 ) ? 0 :this.state.selected_checkbox_incom ? 1: this.state.selected_checkbox_missing ? 2 : 0;
    fetch(
      `${main_url}attendance/incompleteAttReport/${this.state.user_id}/${
        this.state.branchId.value
      }/${this.state.departmentId.value}/${this.state.regionId.value}/${
        this.state.selectedAttendance.value
      }/${this.state.selectedEmployeeName.value}/${
        checkbox
      }/${moment(this.state.from_date).format("YYYY-MM-DD")}/${moment(
        this.state.to_date
      ).format("YYYY-MM-DD")}`
    )
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState(
          {
            dataSource: list,
            checkboxAll:true,
          },
          () => {
            this._setTableData(this.state.dataSource);
          }
        );
      });
    // fetch(`${main_url}attendance/incompleteAttReport`)
    //   .then(res => { if (res.ok) return res.json() })
    //   .then(list => {
    //     this._setTableData(list);
    //   })
  };

  handleVisibleApprove = (data) => {

    this.setState({ visibleApprove: true, approve_data: data });
  };

  hideApprove() {
    this.setState({ visibleApprove: false, approve_data: {} });
  }

  approveSave() {
    if (this.state.selectedOption.value == 0) {
      toast.error("Please Select Option");
    } else {
      let status = 0;
      fetch(`${main_url}attendance/editIncomAtt`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${JSON.stringify({
          id: this.state.approve_data.id ? this.state.approve_data.id : 0,
          user_id: this.state.approve_data.user_id,
          incom_option: this.state.selectedOption.value,
          date: moment(this.state.approve_data.date+" 00:00:00").format("YYYY-MM-DD"),
          check_in_time : this.state.selectedOption.value ==1 || this.state.selectedOption.value ==2 || this.state.selectedOption.value == 3 ? this.state.approve_data.check_in_time
          ? moment(this.state.approve_data.check_in_time,'YYYY-MM-DD HH:mm:ss')
              
          : moment(this.state.attendancePolicyList[0].day_open_hour,"DD-MM-YYYY HH:mm:ss"): this.state.approve_data.check_in_time
          ? moment(this.state.approve_data.check_in_time,"YYYY-MM-DD HH:mm:ss")
              : '-',
          check_out_time :  this.state.selectedOption.value ==1 || this.state.selectedOption.value ==2 || this.state.selectedOption.value == 3 ? this.state.approve_data.check_out_time
          ? moment(this.state.approve_data.check_out_time,'YYYY-MM-DD HH:mm:ss')
             
          : moment(this.state.attendancePolicyList[0].day_close_hour,"DD-MM-YYYY HH:mm:ss") : this.state.approve_data.check_out_time
          ? moment(this.state.approve_data.check_in_time,"YYYY-MM-DD HH:mm:ss")
              : '-'
        })}`,
      })
        .then((res) => {
          status = res.status;
          return res.text();
        })
        .then((text) => {
          this.showToast(status, text);
        });
    }
  }

  showToast = (status, text) => {
    if (status === 200) {
      toast.success(text);
      window.location.reload();
    } else {
      toast.error(text);
    }
  };

  _setTableData = async (data) => {
    var table;
    var l = [];
    // var temp = {
    //   check_in_time: "2022-10-12T10:46:09.000Z",
    //   check_out_time: null,
    //   date: "2022-10-12",
    //   designations: "IT Assistant",
    //   employment_id:
    //     "A-00499                                                                                                            ",
    //   fullname: "Phyo Zin Aung",
    //   id: 19,
    //   incom_option: 1,
    //   incom_status: 1,
    //   att_type_in_status: 2,
    //   att_type_out_status: null,
    //   location_master_name: "Head Office",
    //   user_id: 527,
    // };
    if (data) {
      for (var i = 0; i < data.length; i++) {
        let result = data[i];
        let obj = [];
        obj = {
          no: i + 1,
          date: data[i].date ? data[i].date : "-",
          employee_id: data[i].employment_id
            ? data[i].employment_id.trim()
            : "-",
          employee_name: data[i].fullname ? data[i].fullname : "-",
          designation: data[i].designations ? data[i].designations : "-",
          branch: data[i].location_master_name
            ? data[i].location_master_name
            : "-",
          checkin: data[i].check_in_time
            ? moment(data[i].check_in_time)
                .utc()
                .format("DD-MM-YYYY hh:mm:ss a")
            : "-",
          checkout: data[i].check_out_time
            ? moment(data[i].check_out_time)
                .utc()
                .format("DD-MM-YYYY hh:mm:ss a")
            : "-",
            Attendance_check_in: data[i].check_in_time
              ? data[i].att_type_in_status == 0
                ? "Normal Check In"
                : data[i].att_type_in_status == 1
                ? "Holiday Check In"
                : data[i].att_type_in_status == 2
                ? "Field Check In"
                : "Late Check In"
              :"-",
              Attendance_check_out:data[i].check_out_time
                ? data[i].att_type_in_status == 0
                  ? "Normal Check Out"
                  : data[i].att_type_in_status == 1
                  ? "Holiday Check Out"
                  : data[i].att_type_in_status == 2
                  ? "Field Check Out"
                  : "Early Check Out"
                : "-",
          // attendanceType: data[i].check_in_time
          //   ? data[i].att_type_in_status == 0
          //     ? "Normal"
          //     : data[i].att_type_in_status == 1
          //     ? "Holiday"
          //     : data[i].att_type_in_status == 2
          //     ? "Field"
          //     : "Late Check In"
          //   : data[i].check_out_time
          //   ? data[i].att_type_in_status == 0
          //     ? "Normal"
          //     : data[i].att_type_in_status == 1
          //     ? "Holiday"
          //     : data[i].att_type_in_status == 2
          //     ? "Field"
          //     : "Early Check Out"
          //   : "-",
          option: data[i].incom_option
            ? data[i].incom_option == 1
              ? "Attendance"
              : data[i].incom_option == 2
              ? "Late"
              : "Absence"
            : "-",
          status: data[i].incom_status
            ? data[i].incom_status == 1
              ? '<small class="label label-warning" style="background-color:#29a50a"> Approve </small>'
              : "-"
            : "-",
        };
        obj.select =
        `<div style="alignItems:center" id="toSelect" class="select-btn"  ><input class='ipSelect'  type="checkbox"/><span id="select" class="hidden" >` +
        JSON.stringify(result) +
        "</span>  </div>"; 
        obj.action =this.state.permission_status.isEdit == 1 ? data[i].incom_status ? '' :
        '<button style="margin-right:10px; background-color:#27568a" class="btn btn-primary btn-sm own-btn-edit" id="toEditApprove" ><span id="editApprove" class="hidden" >' +
        JSON.stringify(result) +
        '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';

        l.push(obj);
      }
    }
    if ($.fn.dataTable.isDataTable("#dataTables-table")) {
      table = $("#dataTables-table").dataTable();
      table.fnClearTable();
      table.fnDestroy();
      $("#dataTables-table").empty();
    }
    var column = [
      { title: "Sr No", data: "no" },
      { title: "Date", data: "date" },
      { title: "Employee Id", data: "employee_id" },
      { title: "Employee Name", data: "employee_name" },
      { title: "Position", data: "designation" },
      { title: "Branch", data: "branch" },
      { title: "Check In", data: "checkin" },
      { title: "Check Out", data: "checkout" },
      { title: "Attendance Check In", data: "Attendance_check_in" },
      { title:"Attendance Check Out",data:"Attendance_check_out"},
      { title: "Option", data: "option" },
      { title: "Status", data: "status" },
      { title: "Action", data: "action" },
    ];
    let that = this
    // column.push({ title: "Action", data: "action" });
    // column.splice(1, 0, { title: "Select", data: "select" });
    table = $("#dataTables-table").dataTable({
      autofill: true,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      pageLength: 50,
      paging: true,
      buttons: true,
      dom: 'Bfrtip',
          buttons: [
      //     //     'copy', 'csv',
       'excel',
      //  'pdf'
          ],
      buttons: [
          //         // 'copy',
          //         // {
          //         //         extend: 'csvHtml5',
          //         //         title: 'Child Benefit',
          //         // },
                  {
                      extend: 'excelHtml5',
                      title: 'Imcomplete And Missing Report',
                  },
          //         // {
          //         //     extend: 'pdfHtml5',
          //         //     title: 'Child Benefit',
                  // }
      ],
      data: l,
      columns: column
  });
  var allPages = await table.fnGetNodes();

  $('body').on('click', '#ipSelect', async function () {
    if (that.state.checkboxAll == false) {
    $('.ipSelect', await allPages).prop('checked', that.state.checkboxAll);
    } else {
    $('.ipSelect', await allPages).prop('checked', true);
    }
    $(this).toggleClass('allChecked');
  })
}
  render() {
    return (
      <div>
        <ToastContainer position={toast.POSITION.TOP_RIGHT} />
        <div className="row  white-bg dashboard-header">
          <h3 className="" style={{ paddingLeft: "10px" }}>
            Incomplete Attendance and Missing Attendance Report
          </h3>
          {/* <div className="col-md-12">
            <div className="col-md-2">
                <div>
                <label htmlFor="" className="col-sm-12">Start Date</label>
                </div>
                <div className="col-md-10">
                <DatePicker
                  dateFormat="DD/MM/YYYY"
                  value={this.state.from_date}
                  onChange={this.handleSelectedFromdate}
                  timeFormat={false}
                />
                </div>
              </div>
              <div className="col-md-2">
                <div>
                <label htmlFor="" className="col-sm-12">End Date</label>
                </div>
                <div className="col-md-10">
                <DatePicker
                  dateFormat="DD/MM/YYYY"
                  value={this.state.to_date}
                  onChange={this.handleSelectedTodate}
                  timeFormat={false}
                />
                </div>
              </div>
            
            <div className="col-2">
              <div>
              <label htmlFor="" className="col-sm-12">Branch</label>
              </div>
             <div className="col-md-10">
             <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginRight:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Branch"
              options={this.state.branch}
              onChange={this.handleSelectedBranch}
              value={this.state.branchId}
              className='react-select-container'
              classNamePrefix="react-select"
            />
             </div>
              
            
            </div>
            <div className="col-2">
            <div style={{textAlign:'start'}}>
                <label htmlFor="">Region</label>
              <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 300,
                  marginRight:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Region"
              options={this.state.region}
              onChange={this.handleSelectedRegion}
              value={this.state.regionId}
              className='react-select-container'
              classNamePrefix="react-select"
            /> 
              </div>
            </div>
            <div className="col-2">
            <div style={{textAlign:'start'}}>
              <label htmlFor="">Department</label>
            <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 300
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Department"
              options={this.state.department}
              onChange={this.handleSelectedDepartment}
              value={this.state.departmentId}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            </div>
            </div>
            <div className="col-2">
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 35, padding: '0px 5px 0px 5px',marginTop:20 }} onClick={() => this.handleSearchData()}>Search</button>
            </div>
            <div className="col-2">
            <div>
            <label htmlFor="">Employee Name</label>
           <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 300,
                  marginRight:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Employee Name"
              options={this.state.EmployeeNameList}
              onChange={this.handleSelectedEmployeeName}
              value={this.state.selectedEmployeeName}
              className='react-select-container'
              classNamePrefix="react-select"
            />
           </div>
            </div>
            <div className="col-2">
            <div>
              <label htmlFor="">Attendance Type</label>
             <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 300,
                  marginRight:10

                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Attendance Type"
              options={this.state.AttendanceType}
              onChange={this.handleSelectedAttendance}
              value={this.state.selectedAttendance}
              className='react-select-container'
              classNamePrefix="react-select"
            />
             </div>
            </div>
            <div className="col-2">
            <div>
              <label htmlFor="">Status</label>
              <div style={{display:'flex',justifyContent:'start',alignItems:'end',marginLeft:10}}>
                            <div style={{marginRight:50, height: 20}}>
                            
                            <input type="checkbox" id='region'  name='region' checked={this.state.selected_checkbox == 1 ? 'checked': ''} value='1' onChange={this.handleCheckbox}/>
                            <label for="region" style={{marginLeft: 5, marginBottom: 5}}> Incomplete</label>
                            </div>
                            <div style={{marginRight:50, height: 20}}>
                                
                                <input type="checkbox" id='branch'  name='branch' checked={this.state.selected_checkbox == 2 ? 'checked': ''} value='2' onChange={this.handleCheckbox}/>
                                <label for='branch' style={{marginLeft: 5, marginBottom: 5}}> Missing Attendance</label>
                            </div>
                            
                    </div>
            </div>
            </div>

           </div> */}
          <div>
            <div className="col-lg-2 col-md-3 col-sm-12">
              <div style={{ paddingBottom: 10 }}>Start Date</div>

              <DatePicker
                dateFormat="DD/MM/YYYY"
                value={this.state.from_date}
                onChange={this.handleSelectedFromdate}
                timeFormat={false}
              />
            </div>
            <div className="col-lg-2 col-md-3 col-sm-12">
              <div style={{ paddingBottom: 10 }}>End Date</div>

              <DatePicker
                dateFormat="DD/MM/YYYY"
                value={this.state.to_date}
                onChange={this.handleSelectedTodate}
                timeFormat={false}
              />
            </div>
            <div
              className="col-lg-2 col-md-3 col-sm-12"
              style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
            >
              <div style={{ paddingBottom: 10 }}>Region</div>

              <Select
                placeholder="Region"
                options={this.state.region}
                onChange={this.handleSelectedRegion}
                value={this.state.regionId}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            <div
              className="col-lg-2 col-md-3 col-sm-12"
              style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
            >
              <div style={{ paddingBottom: 10 }}>Department</div>

              <Select
                placeholder="Department"
                options={this.state.department}
                onChange={this.handleSelectedDepartment}
                value={this.state.departmentId}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            <div
              className="col-lg-2 col-md-3 col-sm-12"
              style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
            >
              <div style={{ paddingBottom: 10 }}>Branch</div>

              <Select
                placeholder="Branch"
                options={this.state.branch}
                onChange={this.handleSelectedBranch}
                value={this.state.branchId}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            <div
              className="col-lg-2 col-md-3 col-sm-12"
              style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
            >
              <div style={{ paddingBottom: 10 }}>Employee Name</div>

              <Select
                placeholder="Employee Name"
                options={this.state.EmployeeNameList}
                onChange={this.handleSelectedEmployeeName}
                value={this.state.selectedEmployeeName}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            <div
              className="col-lg-2 col-md-3 col-sm-12"
              style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
            >
              <div style={{ paddingBottom: 10 }}>Attendance Type</div>

              <Select
                placeholder="Attendance Type"
                options={this.state.AttendanceType}
                onChange={this.handleSelectedAttendance}
                value={this.state.selectedAttendance}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div
              className="col-lg-2 col-md-2 col-sm-12"
              style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
            >
              <div style={{ paddingBottom: 10 }}>Status</div>

              <div
                style={{
                  display: "flex",
                  flexDirection: 'column',
                  // justifyContent: "space-between",
                  // alignItems: "end",
                }}
              >
                <div>
                  <input
                    type="checkbox"
                    id="region"
                    name="region"
                    // checked={this.state.selected_checkbox == 1 ? "checked" : ""}
                    value="1"
                    onChange={this.handleCheckboxIncom}
                  />
                  <label
                    for="incomplete"
                    style={{ marginLeft: 5, marginBottom: 5 }}
                  >
                    {" "}
                    Incomplete
                  </label>
                </div>
                <div>
                  <input
                    type="checkbox"
                    id="branch"
                    name="branch"
                    // checked={this.state.selected_checkbox == 2 ? "checked" : ""}
                    value="2"
                    onChange={this.handleCheckboxMissing}
                  />
                  <label
                    for="missingattendance"
                    style={{ marginLeft: 5, marginBottom: 5 }}
                  >
                    {" "}
                    Missing Attendance
                  </label>
                </div>
              </div>
            </div>

            <div className="col-lg-2 col-md-3 col-sm-12">
              <div className="col-md-10" style={{ marginTop: 30 }}>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => this.handleSearchData()}
                >
                  Search
                </button>
              </div>
            </div>
            {/* <div style={{ width: "20%" }}>
                  <label>
                    <input
                      id="ipSelect"
                      type={"checkbox"}
                      checked={!this.state.checkboxAll}
                      onChange={() =>
                        this.handleCheckboxAll(!this.state.checkboxAll)
                      }
                    />
                    Select All
                  </label>
                </div> */}
          </div>

          <table
            width="99%"
            className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
            id="dataTables-table"
          />
          <Rodal
            width={500}
            height={350}
            visible={this.state.visibleApprove}
            onClose={this.hideApprove.bind(this)}
          >
            <div>
              <h3>Approve</h3>
            </div>
            <div className="col-md-12" style={{ marginTop: 10 }}>
              <div className="col-md-4">Employee Name :</div>
              <div className="col-md-8">
                {this.state.approve_data
                  ? this.state.approve_data.fullname
                  : "-"}
              </div>
            </div>
            <div className="col-md-12" style={{ marginTop: 10 }}>
              <div className="col-md-4">Designations :</div>
              <div className="col-md-8">
                {this.state.approve_data
                  ? this.state.approve_data.designations
                  : "-"}
              </div>
            </div>
            <div className="col-md-12" style={{ marginTop: 10 }}>
              <div className="col-md-4">Branch :</div>
              <div className="col-md-8">
                {this.state.approve_data
                  ? this.state.approve_data.location_master_name
                  : "-"}
              </div>
            </div>
            <div className="col-md-12" style={{ marginTop: 10 }}>
              <div className="col-md-4">Check In Time :</div>
              <div className="col-md-8">
                {/* {this.state.approve_data.check_in_time
                  ? moment(this.state.approve_data.check_in_time)
                      .utc()
                      .format("hh:mm A")
                  : "-"} */}
                  
                  {
                    //26-10-2022 09:00:00
                    //DD-MM-YYYY HH:mm:ss
                    this.state.selectedOption.value ==1 || this.state.selectedOption.value ==2 || this.state.selectedOption.value == 3 ? this.state.approve_data.check_in_time
                    ? moment(this.state.approve_data.check_in_time)
                        .utc()
                        .format("hh:mm A")
                    : moment(this.state.attendancePolicyList[0].day_open_hour,'DD-MM-YYYY HH:mm:ss').format('hh:mm A') : this.state.approve_data.check_in_time
                    ? moment(this.state.approve_data.check_in_time)
                        .utc()
                        .format("hh:mm A") : '-'
                  }
              </div>
            </div>
            <div className="col-md-12" style={{ marginTop: 10 }}>
              <div className="col-md-4">Check Out Time :</div>
              <div className="col-md-8">
                
                   {
                     this.state.selectedOption.value ==1 || this.state.selectedOption.value ==2 || this.state.selectedOption.value == 3 ? this.state.approve_data.check_out_time
                     ? moment(this.state.approve_data.check_out_time)
                         .utc()
                         .format("hh:mm A")
                     : moment(this.state.attendancePolicyList[0].day_close_hour,'DD-MM-YYYY HH:mm:ss').format('hh:mm A') : this.state.approve_data.check_out_time
                     ? moment(this.state.approve_data.check_out_time)
                         .utc()
                         .format("hh:mm A") : '-'
                  
                  }
              </div>
            </div>
            <div className="col-md-12" style={{ marginTop: 10 }}>
              <div className="col-md-4">Attendance Type :</div>
              <div className="col-md-8">
                {this.state.approve_data
                  ? this.state.approve_data.attendanceType
                  : "-"}
              </div>
            </div>
            <div className="col-md-12" style={{ marginTop: 10 }}>
              <div className="col-md-4"> Option :</div>
              <div className="col-md-8">
                <Select
                  styles={{
                    container: (base) => ({
                      ...base,
                      //   flex: 1
                      width: 300,
                      marginRight: 10,
                    }),
                    control: (base) => ({
                      ...base,
                      minHeight: "18px",
                    }),
                  }}
                  placeholder="Option"
                  options={this.state.optionList}
                  onChange={this.handleSelectedOption}
                  value={this.state.selectedOption}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
            </div>

            <div
              className="col-md-12"
              style={{
                display: "flex",
                justifyContent: "right",
                marginTop: 20,
              }}
            >
              <div className="col-md-2 btn-rightend">
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    this.approveSave();
                  }}
                >
                  <span>Approve</span>{" "}
                </button>
              </div>
              <div className="col-md-2 btn-rightend">
                <button
                  className="btn btn-danger"
                  onClick={() => this.hideApprove()}
                >
                  <span>Cancel</span>{" "}
                </button>
              </div>
            </div>
          </Rodal>
        </div>
      </div>
    );
  }
}
export default ImcompleteAndMissingReport;
