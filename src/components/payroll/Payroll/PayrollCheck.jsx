import React, { Component } from "react";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import moment from "moment";
import { imgData } from "../../../utils/Global";
import * as jsPDF from "jspdf";
import { main_url } from "../../../utils/CommonFunction";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");

$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");

export default class PayrollCheck extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      steps: [],
    };
  }

  async componentDidMount() {
    await this.getPayrollCheckAndReview();
  }

  getPayrollCheckAndReview = async () => {
    await fetch(`${main_url}payroll/getPayrollHeader`)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        var formatData = [];

        res.map((v) => {
          formatData.push(v.name);
        });

        if (res) {
          this.setState({ steps: formatData });
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
    await fetch(
      main_url + `payroll/reviewData/${moment(new Date()).format("YYYY-MM")}`
    )
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.setState({
            dataSource: res,
          });
          this._setTableData(res);
        }
      });
  };

  componentDidUpdate(prevProps, prevState) {}

  _setTableData = async (data) => {
    // console.log("getEmp ===>", data);
    var table;
    var j = [];
    // var has_action = permission.isView === 1 || permission.isEdit === 1 ? true : false;
    if (data) {
      for (var i = 0; i < data.length; i++) {
        let result = data[i];
        let obj = {};
        obj["no"] = i + 1;
        obj["employment_id"] = result.employee_id ? result.employee_id : '-';
        obj['fullname'] = result.name ? result.name : '-';
        obj['designation'] = result.designations ? result.designations : '-';
        obj['department'] = result.department ? result.department : '-';
        obj['branch'] = result.branch ? result.branch : '-';
        obj['region'] = result.region ? result.region : '-';
        this.state.steps.map((v, index) => {
          obj[v.replace(/\s/g, "").toLowerCase()] = result.labels.filter(
            (a) => a.label == v
          )[0]
            ? result.labels.filter((a) => a.label == v)[0].value
            : "-";
        });
        j.push(obj);
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
      { title: "Employee Id", data: "employment_id" },
      { title: 'Employee Name', data: 'fullname'},
      { title: 'Designation', data: 'designation'},
      { title: 'Department', data: 'department'},
      { title: 'Branch', data: 'branch'},
      { title: 'Region', data: 'region'}
    ];

    this.state.steps.map((v) => {
      var obj = {};
      obj["title"] = v;
      obj["data"] = v.replace(/\s/g, "").toLowerCase();
      column.push(obj);
    });

    table = $("#dataTables-table").DataTable({
      autofill: true,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      paging: true,
      pageLength: 50,
      // buttons: true,
      dom: "Bfrtip",
      // buttons: [
      //     'copy', 'csv', 'excel', 'pdf'
      // ],
      buttons: [],
      data: j,
      columns: column,
    });
  };

  render() {
    return (
      <div>
        <div className="col-md-12 btn-rightend">
          <button
            className="btn-primary btn"
            onClick={this.props.handleCalculate}
            style={{ marginTop: 20 }}
          >
            Calculate
          </button>
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
