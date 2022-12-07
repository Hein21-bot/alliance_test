import React, { Component } from "react";
import { main_url } from '../../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import DatePicker from "react-datetime";
import Select from 'react-select';
import moment from "moment";
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');
class EmployeeReport extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  async componentDidMount() {
   if(this.props.filterDate){
    this.handleSearchData();
   }
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
  
  _setTableData = (data) => {
    var table;
    var l = [];
    if (data) {
      for (var i = 0; i < data.length; i++) {
        let result = data[i];
        let obj = [];
        obj = {
          no: i + 1,
          employee_id: data[i].employee_id ? data[i].employee_id : '-',
          employee_name: data[i].name ?data[i].name : "-",
          branch: data[i].branch ? data[i].branch : "-",
          designation: data[i].designation ? data[i].designation : "-",
          region: data[i].region ? data[i].region : "-",
          
          atmorcash:data[i].cash_or_atm ==1 ? "ATM" : data[i].cash_or_atm == 2 ? "Cash" : '-',
          basic_salary:data[i].detail_amount ? data[i].detail_amount : '-'
          
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
        { title: "Employee Name", data: "employee_name" },
        { title: "Designation", data: "designation" },
        { title: "Region", data: "region" },
        { title: "Branch", data: "branch" },
        { title:"ATM or Cash",data:"atmorcash"},
        { title:"Baisc Salary",data:'basic_salary'}
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
              title: 'Payroll Generate',
          },
         
        ],
        data: l,
        columns: column
      });
    
  }
  handleSearchData = () => {
   
    fetch(main_url + 'payroll/getReviewDetailData/'+moment(this.props.filterDate).format('YYYY-MM')+'/0/0/0/0/0')
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this._setTableData(list);
      })
  }
  render() {
  console.log("filter date",this.props.filterDate);
    return (
      <div>
        <div className="row  white-bg dashboard-header">
        <h3 className="" style={{paddingLeft:"10px"}}>Payroll Generate</h3>
                
                <div style={{ marginBottom: 20 }}>
              <div
                className="row"
                style={{ display: "flex", alignItems: "end" }}
              >
                <div className="col-md-2">
                  <label>Month</label>
                  <DatePicker
                    dateFormat="MM/YYYY"
                    value={this.props.filterDate ? this.props.filterDate : new Date()}
                    timeFormat={false}
                    onChange={this.props.onFilterDateChange.bind(this)}
                  />
                </div>
                
                <div>
                  <div className="row">
                    
                        <div className="col-md-4">
                          <button
                          className="btn-primary btn"
                          onClick={this.handleSearchData}
                          style={{ marginTop: 20, minWidth: 70, marginRight: 10 }}
                        >
                          Search
                        </button>
                        </div>
                          <div className="col-md-6">
                          <button
                      className="btn btn-primary"
                      style={{ minWidth: "100px",marginTop:20 }}
                      type="button"
                      onClick={this.props.atmorcashback}
                    >
                      Check Pay Slip Data
                    </button>
                          </div>
                    
                  </div>
                </div>
                
               
              </div>
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
export default EmployeeReport;