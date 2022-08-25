import React, { Component } from "react";

import { main_url } from "../../utils/CommonFunction";
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

class FixedAssectListTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
     
    };
  }

  componentDidMount() {
    const id = localStorage.getItem("user_id");
    fetch(main_url + `dashboard/fixedAssetList/${id}`)
    .then(response => { return response.json() }).then(res => {
      this._setTableData(res);
    })

  }
  _setTableData = async (data) => {
    var table;
    var l = [];
    var status;
    this.setState({ tapButtonTitle: "active" });
    for (var i = 0; i < data.length; i++) {
      let result = data[i];
      let obj = [];
      obj = {
        no: i + 1,
        employee_id: data[i].employment_id ? data[i].employment_id : '',
        employee_name: data[i].fullname ? data[i].fullname : '',
        position: data[i].designations ? data[i].designations : '-',
        branch: data[i].location_master_name ? data[i].location_master_name : '-',
        asset_item_code: data[i].asset_item_code ? data[i].asset_item_code : '-',
        item_name: data[i].item_name ? data[i].item_name : '-',
        asset_item_description: data[i].asset_item_description ? data[i].asset_item_description : '',
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
      { title: "Employee Name", data: "employee_name" },
      { title: "Designation", data: "position" },
      { title: "Branch", data: "branch" },
      { title: "Fixed Asset ID", data: "asset_item_code" },
      { title: "Asset Name", data: "item_name" },
      { title: "Specification", data: "asset_item_description" },
    ]
    table = $("#dataTables-table").DataTable({
      // columnDefs: [
      //     {
      //       targets: 5,
      //       createdCell: function (td) {
      //         $(td).css('background-color', "red")
      //       }
      //     }
      //   ],
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
      columns: column,
      // createdRow: function (row, data, td, index) {
      //     if (data.leave === true) {
      //         $(row).css('background-color', 'Yellow');
      //     }
      //     if (data.extension != '-') {
      //         $(row).css('background-color', 'Orange');

      //     }
      // }


    });

  }

 
  // Dep end


  render() {
    return (
      <div>
        <table width="99%"
                className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                id="dataTables-table"
              />
      </div>
    );
  }
}


export default FixedAssectListTable;
