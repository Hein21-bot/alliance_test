import React, { Component } from "react";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import moment from "moment";
import Select from 'react-select'
import DatePicker from 'react-datetime';
import * as jsPDF from "jspdf";
import { ToastContainer, toast } from 'react-toastify';
import { main_url, getBranch, getDepartment, getRegion, getLevel, getUserId, getDesignation, getMainRole, getInformation, print, fno, getFirstDayOfMonth } from "../../../../utils/CommonFunction";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");

export default class ConfirmationRequestListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: getUserId("user_info"),
      dataSource: [],
      region: [],
      level: [],
      branch: [],
      department: [],
      designations: [],
      toDate: moment().format('DD-MM-YYYY'),
      fromDate: moment(getFirstDayOfMonth()).format('DD-MM-YYYY'),
      selectedRequest: "",
      is_main_role: getMainRole(),
      branchId: 0,
      departmentId: 0,
      regionId: 0,
      levelStatus: "",
      designationId: 0,
      employeeData: [],
      filterData: [],
      extension: [],
      recommendation: [],
      effective_date: []
    };
  }

  async componentDidMount() {
    this.$el = $(this.el);
    this.setState(
      {
        dataSource: this.props.data,

      },
      () => {
        this._setTableData(this.state.dataSource);
      }
    );

    let that = this;
    $("#dataTables-table").on("click", "#toView", function () {
      var data = $(this).find("#view").text();
      data = $.parseJSON(data);
      that.props.goToViewForm(data);
    });

    $("#dataTables-table").on('click', '#toEdit', function () {
      var data = $(this).find("#edit").text();
      data = $.parseJSON(data);
      // console.log('data is =====>', data)
      that.update(data)
    });
    let level = await getLevel();
    level.unshift({ label: "All", value: 0 });
    let designations = await getDesignation();
    designations.unshift({ label: "All", value: 0 });
    let region = await getRegion();
    region.unshift({ region_name: "All", region_id: 0 });
    let branch = await getBranch();
    branch.unshift({ label: 'All', vlaue: 0 });
    let department = await getDepartment();
    department.unshift({ label: 'All', vlaue: 0 });
    this.setState({
      branch: branch,
      department: department,
      region: region.map(v => ({ ...v, label: v.region_name, value: v.region_id })),
      level: level,
      designations: designations,

    })
  }

  async update(data) {
    let status = 0;
    fetch(`${main_url}confirmation/updateConfirmForEmployment/${data.user_id}`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `employee=${JSON.stringify(data)}`
    })
      .then(res => {
        status = res.status;
        return res.text()
      })
      .then(text => {
        if (status === 200) {
          toast.success(text);
          // window.location.reload();
        }
        else toast.error(text);
        // window.location.replace("/employment_details");
        // window.location.replace('/confirmation_list')

      })
  }


  getRequest() {
    this.search(0);
  }
  getCheck() {
    this.search(1);
  }
  getVerified() {
    this.search(3);
  }
  getConfirm() {
    this.search(2);
  }
  getApprove() {
    this.search(4 || 10);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState(
        {
          dataSource: this.props.data,
        },
        () => {
          this._setTableData(this.state.dataSource);
        }
      );
    }
  }
  handleSelectedBranch = async (event) => {
    let branchId = this.state.branchId
    branchId = event
    this.setState({
      branchId: branchId
    })
  }

  handleSelectedlevelStatus = async (event) => {
    let levelStatus = this.state.levelStatus
    levelStatus = event
    this.setState({
      levelStatus: levelStatus
    })
  }
  handleSelectedDepartment = async (event) => {
    let departmentId = this.state.departmentId
    departmentId = event
    this.setState({
      departmentId: departmentId
    })
  }
  handleSelectedDesignations = async (event) => {
    let designationId = this.state.designationId
    designationId = event
    this.setState({
      designationId: designationId
    })
  }
  handleSelectedRegion = async (event) => {
    let regionId = this.state.regionId
    regionId = event
    this.setState({
      regionId: regionId
    })
  }
  handleSearch = () => {
    this.getEmployeeList()

  }
  handleToDate = (event) => {
    this.setState({
      toDate: event
    });
  };
  handleFromDate = (event) => {
    this.setState({
      fromDate: event
    });
  };
  search(status) {
    let data = this.state.dataSource;
    data = data.filter((d) => {
      return status === d.status;
    });
    this._setTableData(data);
  }

  handleSearchData = (branchId, departmentId, regionId, levelStatus, designationId) => {
    fetch(`${main_url}confirmation/getConfirmationAllData/${branchId == undefined ? 0 : branchId}/${departmentId == undefined ? 0 : departmentId}/${regionId == undefined ? 0 : regionId}/${levelStatus == undefined ? 0 : levelStatus}/${designationId == undefined ? 0 : designationId}`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this._setTableData(list);
      })
  }

  _setTableData = (data) => {
    var table;
    var l = [];
    var status;
    var permission = this.props.permission;
    var has_action =
      permission.isView === 1 || permission.isEdit === 1 ? true : false;
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        console.log('res is ====>', data[i])
        let result = data[i];
        let obj = [];
        if (result.status === 0) {
          status =
            '<small class="label label-warning" style="background-color:#509aed"> Request </small>';
        } else if (result.status === 1) {
          status =
            '<small class="label label-warning" style="background-color:#b33ce0"> Check  </small>';
        } else if (result.status === 2) {
          status =
            '<small class="label label-warning" style="background-color:#0078FF"> Confirm </small>';
        } else if (result.status === 3) {
          status =
            '<small class="label label-warning" style="background-color:#f2a509"> Verify </small>';
        } else if (result.status === 4) {
          status =
            '<small class="label label-warning" style="background-color:#29a50a"> Approve  </small>';
        } else if (result.status === 5) {
          status =
            '<small class="label label-warning" style="background-color:#f60e2f"> Extension  </small>';
        } else if (result.status === 10) {
          status =
            '<small class="label label-warning" style="background-color:#29a50a"> Approved </small>';
        }
        obj = {
          no: i + 1,
          select: false,
          employee_id: data[i].employment_id ? data[i].employment_id : "",
          employee_name: data[i].fullname ? data[i].fullname : "",
          position: data[i].designations ? data[i].designations : "-",

          career_sub_level: data[i].career_sub_level
            ? data[i].career_sub_level
            : "-",
          department: data[i].deptname ? data[i].deptname : "-",
          branch: data[i].branch_name ? data[i].branch_name : "-",
          region: data[i].region_name ? data[i].region_name : "-",
          employ_date: data[i].employ_date ? data[i].employ_date : "-",
          promotion_date: data[i].promotion_date ? moment(data[i].promotion_date).format('YYYY-MM-DD') : moment(data[i].date).format('DD-MM-YYYY'),
          date: moment(result.createdAt).format("DD-MM-YYYY"),
          service_year: data[i].service_year ? data[i].service_year : "",
          current_level_service_year: data[i].current_level_service_year ? data[i].current_level_service_year : '',
          current_sub_level_service_year: data[i].current_sub_level_service_year ? data[i].current_sub_level_service_year : '',
          recommendation: data[i].recommendation ? data[i].recommendation : "-",
          effective_date: data[i].effective_date ? moment(data[i].effective_date).format('YYYY-MM-DD') : "-",
          extension_comment: data[i].extension_comment ? data[i].extension_comment : "-",
          status: status
        };
        if (has_action) {
          obj.action =
            permission.isView === 1
              ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-view" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : "";
          obj.action += permission.isEdit === 1 && result.status != 10
            ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Update</button>' : '';
        }

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
      { title: "No", data: "no" },
      { title: "Employee Id", data: "employee_id" },
      { title: "Name", data: "employee_name" },
      { title: "Designation", data: "position" },
      { title: "Level", data: "career_sub_level" },
      { title: "Department", data: "department" },
      { title: "Branch", data: "branch" },
      { title: "Region", data: "region" },
      { title: "Employed Date", data: "employ_date" },
      { title: "Last Promtion Date", data: "promotion_date" },
      { title: "Service Year", data: "service_year" },
      { title: "Service Year in Current Level", data: "current_level_service_year" },
      { title: "Service Year in Current Sub Level", data: "current_sub_level_service_year" },
      { title: "Confirm or Not", data: "recommendation" },
      // { title: "Extension Comment", data: "extension_comment" },
      { title: "Effective Date", data: "effective_date" },
      { title: "Status", data: "status" },
    ];

    if (has_action) {
      column.push({ title: "Action", data: "action" });
    }
    table = $("#dataTables-table").DataTable({
      autofill: true,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      pageLength: 50,
      paging: true,
      // buttons: true,
      dom: "Bfrtip",
      // buttons: [
      //     'copy', 'csv', 'excel', 'pdf'
      // ],
      buttons: [
        // 'copy',
        // {
        //         extend: 'csvHtml5',
        //         title: 'Child Benefit',
        // },
        // {
        //     extend: 'excelHtml5',
        //     title: 'Child Benefit',
        // },
        // {
        //     extend: 'pdfHtml5',
        //     title: 'Child Benefit',
        // }
      ],
      data: l,
      columns: column,
    });
  };

  render() {

    return (
      <div>
        <div className="row  white-bg dashboard-header">
          <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
            <DatePicker className='fromdate'

              dateFormat="DD/MM/YYYY"
              value={this.state.fromDate}
              onChange={this.handleFromDate}
              timeFormat={false} />
            < DatePicker className='fromdate'
              dateFormat="DD/MM/YYYY"
              value={this.state.toDate}
              onChange={this.handleToDate}
              timeFormat={false} />
            <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150
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
            <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginLeft: 10
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
            <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginLeft: 10
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
            <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginLeft: 10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Level"
              options={this.state.level}
              onChange={this.handleSelectedlevelStatus}
              value={this.state.levelStatus}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginLeft: 10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Designation"
              options={this.state.designations}
              onChange={this.handleSelectedDesignations}
              value={this.state.designationId}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            {/* </div> */}
            {/* <div className='flex-row' style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', margin: '10px 10px 10px 10px' }}> */}
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData(this.state.branchId.value, this.state.departmentId.value, this.state.regionId.value, this.state.levelStatus.value, this.state.designationId.value)}>Search</button>
          </div>
          {/* <div className="row">
            <div class="btn-group-g ">
              <button type="button" class="btn label-request g" onClick={this.getRequest.bind(this)}>Request</button>
              <button type="button" class=" btn label-check g" onClick={this.getCheck.bind(this)}>Check</button>
              <button type="button" class="btn label-success g" onClick={this.getConfirm.bind(this)}>Confirm</button>
              <button type="button" class="btn label-verified g" onClick={this.getVerified.bind(this)}>Verify</button>
              <button type="button" class="btn label-approve g" onClick={this.getApprove.bind(this)}>Approve</button>
            </div>
          </div> */}
        </div>
        <table
          width="99%"
          className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
          id="dataTables-table"
        />
      </div>
    );
  }
}
