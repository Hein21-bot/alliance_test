import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import moment from 'moment';
import Select from 'react-select';
import DatePicker from 'react-datetime';
import * as jsPDF from 'jspdf';
import { main_url, getBranch, getDepartment, getLevel, getRegion, getDesignation, getUserId, getMainRole, getFirstDayOfMonth, getCookieData } from "../../../../utils/CommonFunction";
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');


export default class BenefitChildTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_info: getCookieData("user_info"),
      user_id: getUserId("user_info"),
      dataSource: props.data,
      selectedRequest: '',
      is_main_role: getMainRole(),
      region: [],
      level: [],
      branch: [],
      department: [],
      designations: [],
      toDate: moment().format('DD-MM-YYYY'),
      fromDate: moment(getFirstDayOfMonth()).format('DD-MM-YYYY'),
      branchId: 0,
      departmentId: 0,
      regionId: 0,
      levelStatus: 0,
      designationId: 0,

    }
  }
  async componentDidMount() {
    this.$el = $(this.el);

    this.setState({
      dataSource: this.props.data
    }, () => {
      this._setTableData(this.state.dataSource)
    });


    let that = this;
    $("#dataTables-table").on('click', '#toView', function () {
      var data = $(this).find("#view").text();
      data = $.parseJSON(data);
      that.props.goToViewForm(data);

    });


    // $("#dataTables-table").on('click', '#toPrint', function () {

    //     fetch(`${main_url}child_benefit/getChildAvailableAmount`)
    //         .then(res => { if (res.ok) return res.json() })
    //         .then(list => {
    //             var data = $(this).find("#print").text();
    //             data = $.parseJSON(data);

    //             that.getPrintData(data, list.amount)
    //         })

    // });

    $("#dataTables-table").on('click', '#toEdit', function () {

      var data = $(this).find("#edit").text();
      data = $.parseJSON(data);
      that.props.goToEditForm(data);

    });

    $("#dataTables-table").on('click', '#toSelect', function () {

      var data = $(this).find("#select").text();
      data = $.parseJSON(data);
      that.props.handleCheckBoxChange(data);
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

  componentDidUpdate(prevProps) {
    if (prevProps.data !== this.props.data) {
      this.setState({
        dataSource: this.props.data
      }, () => {
        this._setTableData(this.state.dataSource);

      })
    }
    else if (prevProps.checkedAll !== this.props.checkedAll) {
      if (this.props.checkedAll) {
        $("input[type='checkbox']").prop("checked", true);
      }
      else {
        $("input[type='checkbox']").prop("checked", false);
      }
    }
  }


  getRequest() {
    this.search(0);
  }
  getCheck() {
    this.search(1);
  }
  getVerify() {
    this.search(3);
  }
  getConfirm() {
    this.search(2);
  }
  getApprove() {
    this.search(4);
  }
  handleSelectedBranch = async (event) => {
    let branchId = this.state.branchId
    console.log('event branch is ===>', event)
    branchId = event
    this.setState({
      branchId: branchId
    })
  }

  handleSelectedlevelStatus = async (event) => {
    let levelStatus = this.state.levelStatus
    console.log('level event is ===>', event)
    levelStatus = event
    this.setState({
      levelStatus: levelStatus
    })
  }
  handleSelectedDepartment = async (event) => {
    let departmentId = this.state.departmentId
    console.log('event dep is ===>', event)
    departmentId = event
    this.setState({
      departmentId: departmentId
    })
  }
  handleSelectedDesignations = async (event) => {
    console.log("designation event is ===>", event)
    let designationId = this.state.designationId
    designationId = event
    this.setState({
      designationId: designationId
    })
  }
  handleSelectedRegion = async (event) => {
    console.log('region event is ===<>', event)
    let regionId = this.state.regionId
    regionId = event
    this.setState({
      regionId: regionId
    })
  }
  // handleSearch = () => {
  //   this.getEmployeeList()
  // }
  handleSearchData = (branchId, departmentId, regionId, levelStatus, designationId) => {
    fetch(`${main_url}confirmation/getConfirmationdata/${getCookieData("user_info").user_id}/${getCookieData("user_info").user_id}/${branchId.value == undefined ? 0 : branchId.value}/${departmentId.value == undefined ? 0 : departmentId.value}/${regionId.region_id == undefined ? 0 : regionId.region_id}/${levelStatus.value == undefined ? 0 : levelStatus.value}/${designationId.value == undefined ? 0 : designationId.value}`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        if (list) {
          this._setTableData(list);
        }
      })
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
    data = data.filter(d => { return status === d.status });
    this._setTableData(data)
  }

  _setTableData = (data) => {

    var table;
    var l = [];
    var status;
    var permission = this.props.permission;
    var has_action = permission.isView === 1 || permission.isEdit === 1 ? true : false;
    var has_select = permission.isSelect === 1 ? true : false;

    for (var i = 0; i < data.length; i++) {
      let result = data[i];
      let obj = [];
      console.log('data i is ===>', data[i])
      if (data[i].status === 0) {
        status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'

      }
      else if (data[i].status === 1) {
        status = '<small class="label label-warning" style="background-color:#b33ce0"> Check</small>'
      }
      else if (data[i].status === 2) {
        status = '<small class="label label-warning" style="background-color:#0078FF"> Confirm</small>'
      }
      else if (data[i].status === 3) {
        status = '<small class="label label-warning" style="background-color:#f2a509"> Verify</small>'
      }
      else if (data[i].status === 4) {
        status = '<small class="label label-warning" style="background-color:#29a50a">Approve</small>'
      }

      obj = {
        no: i + 1,
        employee_id: data[i].employment_id ? data[i].employment_id : '-',
        employee_name: data[i].fullname ? data[i].fullname : '-',
        employ_date:data[i].employ_date ? data[i].employ_date:'-',
        position: data[i].designations ? data[i].designations : '-',
        level: data[i].career_sub_level ? data[i].career_sub_level : '-',
        region: data[i].region_name ? data[i].region_name : '-',
        department: data[i].deptname ? data[i].deptname : '-',
        branch: data[i].branch_name ? data[i].branch_name : '-',
        date: data[i].date ? moment(data[i].date).format('DD-MM-YYYY') : '',
        promotionDate: data[i].promotion_date ? moment(data[i].promotion_date).format('DD-MM-YYYY') : moment(data[i].date).format('DD-MM-YYYY'),
        serviceYear: data[i].service_year,
        currentLevelServiceYear: data[i].current_level_service_year ? data[i].current_level_service_year : '',
        currentSubLevelServiceYear: data[i].current_sub_level_service_year ? data[i].current_sub_level_service_year : '_',
        status: status,
        confirmOrNot: data[i].recommendation ? data[i].recommendation : '',
        extensionComment:data[i].extension_comment ? data[i].extension_comment : 'gg'
      }

      if (has_select) {
        obj.select = permission.isSelect === 1 ? '<div style=" alignItems:center" class="btn" id="toSelect" ><input type="checkbox" /><span id="select" class="hidden" >' + JSON.stringify(result) + '</span>  </div>' : '' //'<div style="margin-right:0px;height:20px;width:20px;border:1px solid red" class="btn" id="toSelect" ><i className="fas fa-address-card" style="color:red"></i><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  </div>' : '';
      }
      if (has_action) {
        if (result.status !== 4) {
          obj.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-view" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
          obj.action += permission.isEdit === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';
        } else {
          obj.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';

        }
      }


      l.push(obj)

    }

    if ($.fn.dataTable.isDataTable('#dataTables-table')) {
      table = $('#dataTables-table').dataTable();
      table.fnClearTable();
      table.fnDestroy();
      $('#dataTables-table').empty();
    }

    var column = [
      { title: "No", data: "no" },
      { title: "Employee Id", data: "employee_id" },
      { title: "Name", data: "employee_name" },
      { title: "Designation", data: "position" },
      { title: "Level", data: "level" },
      { title: "Department", data: "department" },
      { title: "Branch", data: "branch" },
      { title: "Region", data: "region" },
      { title: "Employed Date", data: "employ_date" },
      { title: "Last Promtion Date", data: "promotionDate" },
      { title: "Service Year", data: "serviceYear" },
      { title: "Service Year in Current Level", data: "currentLevelServiceYear" },
      { title: "Service Year in Current Sub Level", data: "currentSubLevelServiceYear" },
      { title: "Status", data: "status" },
      { title: "Extension Comment",data:'extensionComment'},
      { title: "Confirm or Not", data: "confirmOrNot" },

    ]

    if (has_action) {
      column.push({ title: "Action", data: "action" })
    }
    if (has_select) {
      column.splice(1, 0, { title: "Select", data: "select" })
    }
    table = $("#dataTables-table").DataTable({

      autofill: true,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      pageLength: 50,
      paging: true,
      // buttons: true,
      dom: 'Bfrtip',
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
      columns: column

    });

  }


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
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData(this.state.branchId, this.state.departmentId, this.state.regionId, this.state.levelStatus, this.state.designationId)}>Search</button>
          </div>
          <div className="row">
            <div class="btn-group-g ">
              <button type="button" class="btn label-request g" onClick={this.getRequest.bind(this)} >Request</button>
              <button type="button" class=" btn label-check g" onClick={this.getCheck.bind(this)} >Check</button>
              <button type="button" class="btn label-success g" onClick={this.getConfirm.bind(this)} >Confim</button>
              <button type="button" class="btn label-verified g" onClick={this.getVerify.bind(this)} >Verify</button>
              <button type="button" class="btn label-approve g" onClick={this.getApprove.bind(this)}>Approve</button>
            </div>
          </div>
        </div>
        {/* <h3 style={{  }}>Confirmation Check Table</h3> */}
        <table width="99%"
          className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
          id="dataTables-table"
        />
      </div >
    )
  }
}