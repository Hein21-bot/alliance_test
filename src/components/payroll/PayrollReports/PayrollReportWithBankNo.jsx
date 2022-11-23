import React, { Component } from "react";
import { main_url } from '../../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import Select from 'react-select';
import moment from "moment";
import DatePicker from 'react-datetime';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');
class PayrollReportWithBankNo extends Component {
  constructor(props) {
    super(props);
    this.state = {
     date:moment().format('YYYY-MM-DD')
    }
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
    
  }
  handleSelectedDate = async (event) => {
    this.setState({
        date : event
    })
  }


  _setTableData = (data) => {
    var table;
    var l = [];
    if (data) {
      for (var i = 0; i < data.length; i++) {
        let result = data[i];
        let obj = [];
        obj = {
          no: i + 1,
          employee_id: data[i].employment_id ? data[i].employment_id : '-',
          employee_name: data[i].fullname ?data[i].fullname : "-",
          branch: data[i].branch_name ? data[i].branch_name : "-",
          bank_format_name:data[i].bank_name ? data[i].bank_name : '-',
          nrc:data[i].bank_name ? data[i].bank_name : '-',
          atm_no:data[i].bank_name ? data[i].bank_name : '-',
          total_salary:data[i].bank_name ? data[i].bank_name : '-',
        }
        l.push(obj)

      }
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
        { title: "Branch", data: "branch" },
        { title: "Bank Format Name", data: "bank_format_name" },
        { title: "NRC", data: "nrc" },
        { title: "ATM No", data: "atm_no" },
        { title: "Total Salary", data: "total_salary" },
      ]
      table = $("#dataTables-table").DataTable({

        autofill: true,
        bLengthChange: false,
        bInfo: false,
        responsive: true,
        pageLength: 50,
        paging: true,
            buttons: true,
        dom: 'Bfrtip',
         buttons: [
       
        'excel'
         ],
        buttons: [
          
          {
              extend: 'excelHtml5',
              title: 'Payroll Report With Bank Account No',
          },
         
        ],
        data: l,
        columns: column
      });
    
  }
  handleSearchData = () => {
    // this.setState({
    const branchId = this.state.selected_Branch ? this.state.selected_Branch.value : 0
    const departmentId = this.state.selected_department ? this.state.selected_department.departments_id : 0
    const regionId = this.state.selected_region ? this.state.selected_region.state_id : 0
    const employee = this.state.selected_employee ? this.state.selected_employee.value : 0
    // })

    fetch(main_url + "report/employeeReport/" + this.state.date)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this._setTableData(list);
      })
  }
  render() {
  
    return (
      <div>
        <div className="row  white-bg dashboard-header">
        <h3 className="" style={{paddingLeft:"10px"}}>Employee Salary Report</h3>
          <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
          <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.date}
                            onChange={this.handleSelectedDate}
                            timeFormat={false}
                        />
            
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
          </div>
        
        <table width="99%"
          className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
          id="dataTables-table"
        />
      </div>
      </div>
    )
  }
}
export default PayrollReportWithBankNo;