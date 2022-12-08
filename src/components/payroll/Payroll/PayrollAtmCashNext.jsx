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
      regionList: [],
      branchList: [],
      departmentList:[],
      selected_region: "",
      selected_branch: "",
      selected_department:'',
      steps:[]
    
    }
  }

  async componentDidMount() {
   if(this.props.filterDate){
    this.handleSearchData();
    this.getBranchList();
    this.getRegionList();
    this.getDepartmentList();
    this.getPayrollHeader();
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

  _setTableData = (data) => {
    var table;
    var l = [];
    if (data) {
      for (var i = 0; i < data.length; i++) {
        let result = data[i];
        let obj = {};
        // obj = {
        //   no: i + 1,
        //   employee_id: data[i].employee_id ? data[i].employee_id : '-',
        //   employee_name: data[i].name ?data[i].name : "-",
        //   branch: data[i].branch ? data[i].branch : "-",
        //   designation: data[i].designation ? data[i].designation : "-",
        //   region: data[i].region ? data[i].region : "-",
          
        //   atmorcash:data[i].cash_or_atm ==1 ? "ATM" : data[i].cash_or_atm == 2 ? "Cash" : '-',
        //   basic_salary:data[i].detail_amount ? data[i].detail_amount : '-'
          
        // }
        obj["no"] = i + 1;
        obj["employee_id"] = result.employee_id ? result.employee_id : "-";
        obj["employee_name"] = result.name ? result.name : "-";
        obj["designation"] = result.designation ? result.designation : "-";
        obj["branch"] = result.branch ? result.branch : "-";
        obj["region"] = result.region ? result.region : "-";
        obj['atmorcash']=result.cash_or_atm == 1? "ATM":result.cash_or_atm == 2 ? "Cash": '-'
        obj["basic_salary"] = result.detail_amount ? result.detail_amount : "-";
        this.state.steps.map((v, index) => {
          console.log("v====>",v)
          obj[v.replace(/\s/g, "").toLowerCase()] = result.labels.filter(
            (a) => a.label == v
          )[0]
            ? result.labels.filter((a) => a.label == v)[0].value
            : "-";
        });
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
        { title:"Net Salary",data:'basic_salary'}
      ]
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
    let region = this.state.selected_region ? this.state.selected_region.value : 0;
     let   department  = this.state.selected_department ? this.state.selected_department.value : 0
      let  branch  = this.state.selected_branch ? this.state.selected_branch.value : 0

    fetch(main_url + 'payroll/getReviewDetailData/'+moment(this.props.filterDate).format('YYYY-MM')+'/'+region+'/'+department+'/0/'+branch+'/0')
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this._setTableData(list);
      })
  }
  render() { console.log(this.state.selected_branch);
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

<div className='col-lg-2' >
        <label>Department</label>
        <Select 
          options={this.state.departmentList}
          onChange={this.handleSelectedDepartment}
          value={this.state.selected_department}
          className="react-select-container"
          classNamePrefix="react-select"/></div>

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