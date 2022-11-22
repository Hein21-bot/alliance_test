import React, { Component } from "react";
import moment from "moment";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");

class SSCReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource:[]
        };
}
componentDidMount() { 
    this.$el = $(this.el);
    // this.setState({
    //     },() => {
          this._setTableData(this.state.dataSource);
        // }
    //   );
}

_setTableData = (data) => {
    var table;
    var l = [];
    if (data.length > 0) {
      for (var i = 0; i < data.length; i++) {
        let result = data[i];
        let obj = [];
        obj = {
          no: i + 1,
          year: false,
          month: data[i].employment_id ? data[i].employment_id : "",
          er_ssn: data[i].fullname ? data[i].fullname : "",
          er_name: data[i].designations ? data[i].designations : "-",
          ee_ssn: data[i].career_sub_level ? data[i].career_sub_level : "-",
          ee_name: data[i].deptname ? data[i].deptname : "-",
          ss1ee_rate: data[i].location_master_name ? data[i].location_master_name : "-",
          ss1er_rate: data[i].state_name ? data[i].state_name : "-",
          ss1ee_comamt: data[i].employ_date ? moment(data[i].employ_date).format('DD-MM-YYYY') : "-",
          ss1er_comamt: data[i].promotion_date ? moment(data[i].promotion_date).format("DD-MM-YYYY") : "-",
          ss2ee_rate: moment(result.createdAt).format("DD-MM-YYYY"),
          ss2er_rate: data[i].service_year ? data[i].service_year : "",
          ss2ee_comamt: data[i].current_level_service_year ? data[i].current_level_service_year : '',
          ss2er_comamt: data[i].current_sub_level_service_year ? data[i].current_sub_level_service_year : '',
          total: data[i].recommendation ? data[i].recommendation : "-",
        };
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
        { title: "Year", data: "year" },
        { title: "Month", data: "month" },
        { title: "Er SSN", data: "er_ssn" },
        { title: "Er Name", data: "er_name" },
        { title: "Ee SSN", data: "ee_ssn" },
        { title: "Ee Name", data: "ee_name" },
        { title: "SS1Ee Rate", data: "ss1ee_rate" },
        { title: "SS1Er Rate ", data: "ss1er_rate" },
        { title: "SS1Ee ComAmt", data: "ss1ee_comamt" },
        { title: "SS1Er ComAmt", data: "ss1er_comamt" },
        { title: "SS2Ee Rate", data: "ss2ee_rate" },
        { title: "SS2Er Rate", data: "ss2er_rate" },
        { title: "SS2Ee ComAmt", data: "ss2ee_comamt" },
        { title: "SS2Er ComAmt", data: "ss2er_comamt" },
        { title: "Total ComAmt", data: "total" },
      ];
      table = $("#dataTables-table").DataTable({
        autofill: true,
        bLengthChange: false,
        bInfo: false,
        responsive: true,
        pageLength: 50,
        paging: true,
        buttons: true,
        dom: "Bfrtip",
        buttons: [
        //     'copy', 'csv',
         'excel'
        //  , 'pdf'
        ],
        buttons: [
          // 'copy',
          // {
          //         extend: 'csvHtml5',
          //         title: 'Child Benefit',
          // },
          {
              extend: 'excelHtml5',
              title: 'Comfirmation Approve List',
          },
          // {
          //     extend: 'pdfHtml5',
          //     title: 'Child Benefit',
          // }
        ],
        data: l,
        columns: column,
      });
    };
render(){
    return(
        <div> <table
        width="99%"
        className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
        id="dataTables-table"
      /></div>
    );}
}

export default SSCReport;