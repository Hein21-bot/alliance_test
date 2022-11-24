import React, { Component } from "react";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import moment from "moment";
import DatePicker from "react-datetime";
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

export default class PayrollCalculated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      paySlipRemark: '',
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
    var table;
    var j = [];
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
        obj["netSalary"] = result.detail_amount ? result.detail_amount : "-";
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
      { title: "Employee Name", data: "fullname" },
      { title: "Designation", data: "designation" },
      { title: "Department", data: "department" },
      { title: "Branch", data: "branch" },
      { title: "Region", data: "region" },
    ];

    this.state.steps.map((v) => {
      var obj = {};
      obj["title"] = v;
      obj["data"] = v.replace(/\s/g, "").toLowerCase();
      column.push(obj);
    });

    column.push({ title: "Net Salary", data: "netSalary" });

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

  onChangeText = (e) => {
    this.setState({
      paySlipRemark: e.target.value
    })
  }

  render() {
    return (
      <div>
        <div className="row col-md-12">
          <div className="col-md-6">
            <div className="col-md-4">
              <label>Pay Slip Remark</label>
              <input
                className=""
                type="text"
                data-name="paySlipRemark"
                value={this.state.paySlipRemark}
                placeholder="Remark"
                onChange={this.onChangeText}
              />
            </div>
          </div>
          <div
            className="row col-md-6 btn-rightend"
            style={{ marginBottom: "10px" }}
          >
            <button
              className="btn-primary btn"
              onClick={this.props.handleDelete}
              style={{ marginTop: 20 }}
            >
              Delete
            </button>
            <button
              className="btn-primary btn"
              onClick={this.props.handleConfirm}
              style={{ marginTop: 20 }}
            >
              Confirm
            </button>
          </div>
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
