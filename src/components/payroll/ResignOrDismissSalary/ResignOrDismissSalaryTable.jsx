import React, { Component } from "react";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import moment from "moment";
import DatePicker from "react-datetime";
import { imgData } from "../../../utils/Global";
import Select from "react-select";
import * as jsPDF from "jspdf";
import {
  main_url,
  getMainRole,
  getFirstDayOfYear,
  getInformation,
  getUserId,
  setPrintedStatus,
  print,
  fno,
  getCookieData,
  getPermissionStatus
} from "../../../utils/CommonFunction";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");

$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");
const default_y = 10;
const default_x=20;
export default class ResignOrDismissSalaryTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: getUserId("user_info"),
      user_info: getCookieData("user_info"),
      dataSource: [],
      is_main_role: getMainRole(),
      regionList: [],
      branchList: [],
      departmentList: [],
      selected_month: new Date(),
      selected_region: "",
      selected_branch: "",
      selected_department: "",
      permission_status:{},
      exitStatusList:[]
    };
  }
  async componentDidMount() {
    this.getBranchList();
    this.getRegionList();
    this.getDepartmentList();
    this.getExitStatus();
    //var permission_status = await getPermissionStatus(this.state.user_info.designations_id,  'ResignOrDismiss', 'ResignOrDismiss');

  var permission_status = await getPermissionStatus(this.state.user_info.role_id,  'ResignOrDismiss', 'ResignOrDismiss');
    this.setState({
        permission_status: permission_status
    })
    this.setState(
      {
        // permission_status:this.props.permission_status,
        dataSource: this.props.dataSource,
      },
      () => {
        this._setTableData(this.state.dataSource);
        // console.log('dtatttt',this.props.dataSource);
      }
    );

    let that = this;

    $("#dataTables-table").on('click', '#toView', function () {

        var data = $(this).find("#view").text();
        data = $.parseJSON(data);
        console.log("data=========>",data)
        that.props.goToViewForm(data);

    });

    $("#dataTables-table").on('click', '#toPrint', function () {

        // fetch(`${main_url}child_benefit/getChildAvailableAmount`)
            // .then(res => { if (res.ok) return res.json() })
            // .then(list => {
                // var data = $(this).find("#print").text();
                // data = $.parseJSON(data);

                // that.getPrintData(data, list.amount)
            // })
            var data = $(this).find("#print").text();
            data = $.parseJSON(data);
            that.getPrintData(data,1)

    });

    $("#dataTables-table").on('click', '#toEdit', function () {
        var data = $(this).find("#edit").text();
        data = $.parseJSON(data);
        that.props.goToEditForm(data);

    });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.dataSource != this.props.dataSource) {
      this.setState(
        {
          dataSource: this.props.dataSource,
        },
        () => {
          this._setTableData(this.state.dataSource);
        }
      );
    }
  }
  getRegionList() {
    fetch(`${main_url}benefit/getRegionList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ state_id: 0, state_name: "All" });
        this.setState({
          regionList: list.map((v) => ({
            ...v,
            label: v.state_name,
            value: v.state_id,
          })),
        });
      });
  };
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

  getDepartmentList() {
    fetch(main_url + `main/getDepartment`)
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((res1) => {
      res1.unshift({ label: "All", value: 0 })
      this.setState({ departmentList: res1 });
    })
    .catch((error) => console.error(`Fetch Error =\n`, error));
  };

  getBranchList() {
    fetch(`${main_url}main/getBranch`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          branchList: list,
        });
      });
  };
  getRequest() {
    this.search(0);
  }
  getCheck() {
    this.search(1);
  }

  getVerified() {
    this.search(2);
  }
  getApprove() {
    this.search(3);
  }
  getReject() {
    this.search(4);
  }
  
  handleSelectedMonth = (event) => {
    this.setState({
      selected_month: event,
    });
  };

  handleSelectedRegion = (event) => {
    if (event !== null)
      this.setState({
        selected_region: event,
      });
  };

  handleSelectedBranch = (event) => {
    if (event !== null)
      this.setState({
        selected_branch: event,
      });
  };

  handleSelectedDepartment = (event) => {
    if (event !== null)
              this.setState({
                selected_department: event,
              });
          };
 
  handleSearchData = async (s_date, e_date, user_id) => {
    const departmentId = this.state.selected_department ? this.state.selected_department.value : 0
  const branchId = this.state.selected_branch ? this.state.selected_branch.value :0
  const regionId = this.state.selected_region ? this.state.selected_region.value : 0
    fetch(`${main_url}resign_or_dismiss/get_resign_or_dismiss/${regionId}/${branchId}/${departmentId}/${moment(this.state.selected_month).format('YYYY-MM')}/${this.state.user_id}`)
      .then(res => { if (res.ok) return res.json() })
      .then((res) => {
        if (res) {
          this.setState({ dataSource: res },()=>{ this._setTableData(res)});
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }

  search(status) {
      let data = this.state.dataSource;
      data = data.filter(d => { return status === d.status });
      this._setTableData(data)
  }
  async getPrintData(data, amount) {
    // console.log("print data",data)
    data['resign_or_dismiss_id']=data['id']
    console.log("print data",data)
    const dataSource=data!=undefined && data;
    const Atm_Cash=dataSource.ATM_Cash == 0 ? "ATM" : "Cash"
    const exitStatus=this.state.exitStatusList.filter(v=>v.id==dataSource.exit_status)[0].label
    console.log("exit status=====>",exitStatus)
      var info = await getInformation('resign_or_dismiss', data.id)
      var doc = new jsPDF("p", "mm", "a4");
      var col = ["No","ID","Name","Position","Level","Branch","Department","Region","Last Working Day"];
      var rows = [];
      var today = moment(Date.now()).format('YYYY-MM-DD')
      var temp = ['1',dataSource.employment_id, dataSource.fullname,dataSource.designations,dataSource.career_sub_level,dataSource.location_master_name,dataSource.deptname,dataSource.state_name,moment(dataSource.last_working_day).format('YYYY-MM-DD')]
      // var temp1 = ["Total Amount:", amount];
      rows.push(temp)
      // rows.push(temp1)
      doc.setFontSize(12);
      doc.addImage(imgData, 'image/jpeg', 10, 10, 50, 15)
      doc.text('HR_0021 V3', 150, 15);
      doc.text('Resign or Dismiss Salary', 150, 25)
      doc.text('Generate Date: ' + today, 13, 40)
      doc.text('Voucher No: ' + fno.fno_resign_dismiss + data.form_no, 150, 40)

      doc.autoTable(col, rows, { startY: 55 });
      if (doc.previousAutoTable.finalY > 220) {
          doc.addPage();
          doc.previousAutoTable.finalY = 0;
      }
      doc.text(
        "Gross Salary:" + dataSource.gross_salary,
        13,
        doc.previousAutoTable.finalY + default_y*1
      );
      doc.text(
        "Deductino or Addition:" + dataSource.deduction_or_addition,
        65,
        doc.previousAutoTable.finalY + default_y*1
      );
      doc.text(
        "Salary After Deduction Or" + '',
        130,
        doc.previousAutoTable.finalY + default_y*1
      );
      doc.text(
        "Addition:" + dataSource.after_deduction_or_addition,
        130,
        doc.previousAutoTable.finalY + default_y+5
      );

      doc.text(
        "SSC(Employer 3%):" + dataSource.SSC_employer,
        13,
        doc.previousAutoTable.finalY + default_y+15
      );
      doc.text(
        "SSC(Employee 2%):" + dataSource.SSC_employee,
        65,
        doc.previousAutoTable.finalY + default_y+15
      );
      doc.text(
        "Income Tax:" + dataSource.income_tax,
        130,
        doc.previousAutoTable.finalY + default_y+15
      );
      doc.text(
        "Maintenance:" + dataSource.maintenance,
        13,
        doc.previousAutoTable.finalY + default_y+25
      );
      doc.text(
        "Petrol:" + dataSource.SSC_employee,
        65,
        doc.previousAutoTable.finalY + default_y+25
      );
      doc.text(
        "Total Salary:" + dataSource.income_tax,
        130,
        doc.previousAutoTable.finalY + default_y+25
      );
      doc.text(
        "ATM or Cash:" + Atm_Cash,13,doc.previousAutoTable.finalY+default_y+35
      )
      doc.text(
        "Exit Status:"+exitStatus,65,doc.previousAutoTable.finalY+default_y+35
      )
            
      
      doc.setFontType("bold");
      doc.text('Request By', 13, doc.previousAutoTable.finalY + 55)
      doc.text('Check By', 65, doc.previousAutoTable.finalY + 55)
      doc.text('Verify By', 114, doc.previousAutoTable.finalY + 55)
      doc.text('Approve By', 164, doc.previousAutoTable.finalY + 55)
      doc.setFontSize(9);
      doc.setFontType("normal");
      doc.text(moment(info.requested.requested_date).format('YYYY-MM-DD'), 13, doc.previousAutoTable.finalY + 60)
      doc.text(info.requested.employment_id, 13, doc.previousAutoTable.finalY + 65)
      doc.text(info.requested.requested_by, 13, doc.previousAutoTable.finalY + 70)
      doc.text(info.requested.branch_name, 13, doc.previousAutoTable.finalY + 75)
      doc.text(info.requested.designations, 13, doc.previousAutoTable.finalY + 80)
      doc.text(moment(info.checked.checked_date).format('YYYY-MM-DD'), 65, doc.previousAutoTable.finalY + 60)
      doc.text(info.checked.employment_id, 65, doc.previousAutoTable.finalY + 65)
      doc.text(info.checked.checked_by, 65, doc.previousAutoTable.finalY + 70)
      doc.text(info.checked.branch_name, 65, doc.previousAutoTable.finalY + 75)
      doc.text(info.checked.designations, 65, doc.previousAutoTable.finalY + 80)
      doc.text(moment(info.verified.verified_date).format('YYYY-MM-DD'), 114, doc.previousAutoTable.finalY + 60)
      doc.text(info.verified.employment_id, 114, doc.previousAutoTable.finalY + 65)
      doc.text(info.verified.verified_by, 114, doc.previousAutoTable.finalY + 70)
      doc.text(info.verified.branch_name, 114, doc.previousAutoTable.finalY + 75)
      doc.text(info.verified.designations, 114, doc.previousAutoTable.finalY + 80)
      doc.text(moment(info.approved.approved_date).format('YYYY-MM-DD'), 164, doc.previousAutoTable.finalY + 60)
      doc.text(info.approved.employment_id, 164, doc.previousAutoTable.finalY + 65)
      doc.text(info.approved.approved_by, 164, doc.previousAutoTable.finalY + 70)
      doc.text(info.approved.branch_name, 164, doc.previousAutoTable.finalY + 75)
      doc.text(info.approved.designations, 164, doc.previousAutoTable.finalY + 80)
// await setPrintedStatus("back_pay", data.id);
// doc.save('Backpay.pdf');
      print(doc, data)  
  }

  _setTableData = (data) => {
    
    var on = {
      ATM_Cash: 0,
      SSC_employee: 3700,
      SSC_employer: 5550,
      after_deduction_or_addition: 185000,
      approve_by: null,
      check_by: null,
      createdAt: "2022-11-16T14:19:32.023Z",
      createdBy: 17,
      deduction_or_addition: 10000,
      deptname: "Admin",
      designations: "Security",
      exit_status: 2,
      form_no: null,
      gross_salary: 175000,
      id: 10,
      income_tax: null,
      last_working_day: "2022-11-16T02:12:28.000Z",
      location_master_name: "Meiktila",
      maintenance: 0,
      petrol: 0,
      reason: "hahha1",
      referback_by: null,
      request_month: null,
      state_name: "Mandalay South Region",
      status: null,
      total_salary: 181300,
      user_id: 40,
      verify_by: null,
    };
    var table;
    var l = [];
    var status;
    console.log("permission",this.state.permission_status)
    var has_action = this.state.permission_status.isView === 1 || this.state.permission_status.isEdit === 1 ? true : false; console.log("action>>>>>>",this.state.permission_status,has_action);
    if (data) {
      for (var i = 0; i < data.length; i++) {
        let result = data[i];
        let obj = [];
        if (result.status === 0 || result.status == null) {
          status =
            '<small class="label label-warning" style="background-color:#509aed"> Request </small>';
        } else if (result.status === 1) {
          status =
            '<small class="label label-warning" style="background-color:#b33ce0"> Check</small>';
        } else if (result.status === 2) {
          status =
            '<small class="label label-warning" style="background-color:#f2a509"> Verify</small>';
        } else if (result.status === 3) {
          status =
            '<small class="label label-warning" style="background-color:#29a50a">Approve</small>';
        } else if (result.status === 4) {
          status =
            '<small class="label label-warning" style="background-color:#f60e2f"> Reject</small>';
        } else if (result.status === 5) {
          status =
            '<small class="label label-warning" style="background-color:#cc0066"> ReferBack </small>';
        }

        obj = {
          no: i + 1,
          requestMonth: data[i].request_month
            ? moment(data[i].request_month).format("YYYY-MM")
            : "-",
          employee_id: data[i].employment_id ? data[i].employment_id : "-",
          fullname: data[i].fullname ? data[i].fullname : "-",
          designations: data[i].designations ? data[i].designations : "-",
          career_sub_level: data[i].career_sub_level ? data[i].career_sub_level : '-',
          deptname: data[i].deptname ? data[i].deptname : "-",
          location_master_name: data[i].location_master_name
            ? data[i].location_master_name
            : "-",
          state_name: data[i].state_name ? data[i].state_name : "-",
          lastWorkingDay: data[i].last_working_day
            ? moment(data[i].last_working_day).format("DD-MM-YYYY")
            : "-",
          grossSalary: data[i].gross_salary ? data[i].gross_salary : "-",
          deduction_or_addition: data[i].deduction_or_addition
            ? data[i].deduction_or_addition
            : "-",
          after_deduction_or_addition: data[i].after_deduction_or_addition
            ? data[i].after_deduction_or_addition
            : "-",
          SSC_employer: data[i].SSC_employer ? data[i].SSC_employer : "-",
          SSC_employee: data[i].SSC_employee ? data[i].SSC_employee : "-",
          income_tax: data[i].income_tax ? data[i].income_tax : "-",
          maintenance: data[i].maintenance ? data[i].maintenance : "-",
          petrol: data[i].petrol ? data[i].petrol : "-",
          total_salary: data[i].total_salary ? data[i].total_salary : "-",
          reason: data[i].reason ? data[i].reason : "-",
          ATM_Cash: data[i].ATM_Cash == 0 ? "ATM" : "Cash",
          exit_status: data[i].exit_status
            ? data[i].exit_status == 1
              ? "Resign"
              : data[i].exit_status == 2
              ? "Dismiss"
              : data[i].exit_status == 3
              ? "Termination"
              : data[i].exit_status == 4
              ? "Dead"
              : "-"
            : "-",
          status: status,
        };

        // obj.action =
        //   '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' +
        //   JSON.stringify(result) +
        //   '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>';
        // obj.action +=
        //   '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' +
        //   JSON.stringify(result) +
        //   '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>';
        if (has_action) {
          console.log("has action",has_action)
            if (result.status !== 3) {
        obj.action = this.state.permission_status.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
        obj.action += this.state.permission_status.isEdit === 1 || (result.status == 5 && data[i].createdBy == this.state.user_id) ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';
            } else {
                obj.action = this.state.permission_status.isView === 1 ?

                    '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';

                if (result.print === 1) {
                    obj.action +=
                        '<button style="margin-right:10px" class="btn btn-info btn-sm own-btn-edit" id="toPrint" ><span id="print" class="hidden" >' +
                        JSON.stringify(result) +
                        '</span>  <i className="fa fa-cogs"></i>&nbsp;Printed</button>';
                } else {
                    obj.action +=
                        '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toPrint" ><span id="print" class="hidden" >' +
                        JSON.stringify(result) +
                        '</span>  <i className="fa fa-cogs"></i>&nbsp;Print</button>';
                }
            }
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
      { title: "Request Month", data: "requestMonth" },
      { title: "Employee Id", data: "employee_id" },
      { title: "Employee Name", data: "fullname" },
      { title: "Designation", data: "designations" },
      { title: "Level", data: "career_sub_level"},
      { title: "Department", data: "deptname" },
      { title: "Branch", data: "location_master_name" },
      { title: "Region", data: "state_name" },
      { title: "Last Working Day", data: "lastWorkingDay" },
      { title: "Gross Salary", data: "grossSalary" },
      { title: "Deduction or Addition", data: "deduction_or_addition" },
      {
        title: "Salary After Deduciton or Addition",
        data: "after_deduction_or_addition",
      },
      { title: "SSC Employee(3%)", data: "SSC_employer" },
      { title: "SSC Employee(2%)", data: "SSC_employee" },
      { title: "Income Tax", data: "income_tax" },
      { title: "Maintenance", data: "maintenance" },
      { title: "Petrol", data: "petrol" },
      { title: "Total Salary", data: "total_salary" },
      { title: "Reason", data: "reason" },
      { title: "ATM/Cash", data: "ATM_Cash" },
      { title: "Exit Status", data: "exit_status" },
      { title: 'Status', data: 'status'},
      // {title: 'Action', data: 'action'}
    ];

    if (has_action) {
        column.push({ title: "Action", data: "action" })
    }

    table = $("#dataTables-table").DataTable({
      autofill: true,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      paging: true,
      pageLength: 50,
      buttons: true,
      dom: "Bfrtip",
      // buttons: [
      //     'copy', 'csv', 'excel', 'pdf'
      // ],
      buttons: [
        "copy",
        {
          extend: "csvHtml5",
          title: "Wedding Benefit",
        },
        {
          extend: "excelHtml5",
          title: "Wedding Benefit",
        },
        {
          extend: "pdfHtml5",
          title: "Wedding Benefit",
        },
      ],
      data: l,
      columns: column,
    });
  };

  render() {
    // console.log("tab==>", permission.isView == 1 || permission.isEdit == 1 ? true : false);
    console.log("permission status",this.props.permission_status)

    return (
      <div>
        <div className="row">
       <div className="col-lg-2" >
            <label>Request Month</label>
            <DatePicker
              dateFormat="MM/YYYY"
              value={this.state.selected_month}
              timeFormat={false}
              onChange={this.handleSelectedMonth}
            />
          </div>

          <div className='col-lg-2' >
        <label>Region</label>
        <Select 
          options={this.state.regionList}
          onChange={this.handleSelectedRegion}
          value={this.state.selected_region}
          className="react-select-container"
          classNamePrefix="react-select"/></div>

          <div className='col-lg-2' >
        <label>Branch </label>
        <Select 
          options={this.state.branchList}
          onChange={this.handleSelectedBranch}
          value={this.state.selected_branch}
          className="react-select-container"
          classNamePrefix="react-select"/></div>

          <div className="col-lg-2">
            <label>Department</label>
            <Select
              options={this.state.departmentList}
              onChange={this.handleSelectedDepartment}
              value={this.state.selected_department}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>
        
          <div
            className="col-lg-2"
            style={{
              marginTop: "25px",
            }}
          >
            <button className="btn-primary btn" onClick={this.handleSearchData.bind(this)}>Search</button>
          </div> </div>

        <div
          className="row"
          style={{ display: "flex", justifyContent: "end", marginRight: 33 }}
        >
          <div className="row">
            <div className="row border-bottom white-bg dashboard-header">
               <div className="col-12">
               
              <div className="row">
                <div class="btn-group-g ">
                  <button
                    type="button"
                    class="btn label-request g"
                    onClick={this.getRequest.bind(this)}
                  >
                    Request
                  </button>
                  <button
                    type="button"
                    class=" btn label-check g"
                    onClick={this.getCheck.bind(this)}
                  >
                    Check
                  </button>
                  <button
                    type="button"
                    class="btn label-verified g"
                    onClick={this.getVerified.bind(this)}
                  >
                    Verify
                  </button>
                  <button
                    type="button"
                    class="btn label-approve g"
                    onClick={this.getApprove.bind(this)}
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    class="btn label-reject g"
                    onClick={this.getReject.bind(this)}
                  >
                    Reject
                  </button>
                </div>
              </div>
               </div>
            </div>
          </div>
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

const tempData = [
  { employee_id: 101 },
  { employee_id: 102 },
  { employee_id: 103 },
  { employee_id: 104 },
  { employee_id: 105 },
  { employee_id: 106 },
  { employee_id: 107 },
  { employee_id: 108 },
  { employee_id: 109 },
  { employee_id: 110 },
];
