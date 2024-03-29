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
    await this.getPayrollHeader();
    this.setState(
      {
        dataSource: this.props.dataSource,
      },
      () => {
        this._setTableData(this.state.dataSource);
      }
    );
  }

  componentDidUpdate(prevProps, prevState) {
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

  getPayrollHeader = async () => {
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
  };

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
        obj["employment_id"] = result.employee_id ? result.employee_id : "-";
        obj["fullname"] = result.name ? result.name : "-";
        obj["designation"] = result.designation ? result.designation : "-";
        obj["department"] = result.department ? result.department : "-";
        obj["branch"] = result.branch ? result.branch : "-";
        obj["region"] = result.region ? result.region : "-";
        obj['salary']=result.basic_salary ? result.basic_salary.toLocaleString('en-US',{maximumFractionDigits:2}) : '-';
        obj['level']=result.level ? result.level : '-';
        this.state.steps.map((v, index) => {
          obj[v.replace(/\s/g, "").toLowerCase()] = result.labels.filter(
            (a) => a.label == v
          )[0]
            ? result.labels.filter((a) => a.label == v)[0].value.toLocaleString('en-US',{maximumFractionDigits:2})
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
      { title: "Employee Name", data: "fullname" },
      { title: "Designation", data: "designation" },
      { title: "Department", data: "department" },
      { title: "Branch", data: "branch" },
      { title: "Region", data: "region" },
      { title : "Salary",data:'salary'},
      { title :'Career Sub Level',data:'level'}
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
      buttons:  [
    {
            extend: 'csvHtml5',
            title: 'Payroll Check and Review',
    },
    {
        extend: 'excelHtml5',
        title: 'Payroll Check and Review',
    },
    {
        extend: 'pdfHtml5',
        title: 'Payroll Check and Review',
    }],
      // buttons: [],
      data: j,
      columns: column,
    });
  };

  render() {
    return (
      <div>
        <h3>Net Salary Calculation</h3>
        <div className="col-md-12 btn-rightend" style={{marginBottom: '10px'}}>
          <button
            className="btn-primary btn"
            onClick={this.props.handleCalculate}
            style={{ marginTop: 20 }}
          >
            Calculate Net Salary
          </button>
        </div>
        <div>
          <table
            width="99%"
            className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
            id="dataTables-table"
          />
        </div>
      </div>
    );
  }
}
