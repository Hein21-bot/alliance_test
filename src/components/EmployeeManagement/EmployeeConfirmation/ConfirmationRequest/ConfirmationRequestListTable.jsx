import React, { Component } from "react";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import moment from "moment";
import * as jsPDF from "jspdf";
import {
  main_url,
  getUserId,
  getMainRole,
  getInformation,
  print,
  fno,
} from "../../../../utils/CommonFunction";
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
      selectedRequest: "",
      is_main_role: getMainRole(),
    };
  }
  componentDidMount() {
    this.$el = $(this.el);
    console.log("dataSource ===>", this.props);
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

  search(status) {
    let data = this.state.dataSource;
    data = data.filter((d) => {
      return status === d.status;
    });
    this._setTableData(data);
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
          promotion_date: data[i].promotion_date ? data[i].promotion_date : "-",
          date: moment(result.createdAt).format("DD-MM-YYYY"),
          service_year: data[i].service_year ? data[i].service_year : "",
          recommendation: data[i].recommendation ? data[i].recommendation : "",
          status: status,
        };

        if (has_action) {
          obj.action =
            permission.isView === 1
              ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' +
              JSON.stringify(result) +
              '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>'
              : "";
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
      { title: "Service Year in Current Sub Level", data: "date" },
      { title: "Confirm or Not", data: "recommendation" },
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
        {/* <div className="row  white-bg dashboard-header">
                    <div className="row">
                        <div class="btn-group-g ">
                            <button type="button" class="btn label-request g" onClick={this.getRequest.bind(this)}>Request</button>
                            <button type="button" class=" btn label-check g" onClick={this.getCheck.bind(this)}>Check</button>
                            <button type="button" class="btn label-verified g" onClick={this.getVerified.bind(this)}>Verify</button>
                            <button type="button" class="btn label-approve g" onClick={this.getApprove.bind(this)}>Approve</button>
                            <button type="button" class="btn label-reject g" onClick={this.getReject.bind(this)}>Reject</button>
                        </div>
                    </div>
                </div> */}
        <table
          width="99%"
          className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
          id="dataTables-table"
        />
      </div>
    );
  }
}
