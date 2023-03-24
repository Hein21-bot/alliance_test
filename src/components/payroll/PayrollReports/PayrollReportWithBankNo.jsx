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
     date: new Date(),
     dataSource: [],
     branchlist:[],
     selected_Branch:null,
     regionList:[],
     selected_region:null,
     departmentlist:[],
     selected_department:null,
     empNameList:[],
     employeeName:null,
     
     employeeList:[],
     empId:null,
     bankList:[],
     selected_bank:null
     
    }
  }

  async componentDidMount() {
    await this.getPayrollReportWithBankNo();
    await this.getEmployeeName();
    await this.getBranchList();
    await this.getDepartmentList();
    await this.getRegionList();
    await this.getEmployeeList();
    await this.getBank();


  }

  getPayrollReportWithBankNo = () => {
    let deparmentId=this.state.selected_department ?  this.state.selected_department.value : 0;
    let branchId=this.state.selected_Branch ? this.state.selected_Branch.value : 0;
    let regionId=this.state.selected_region ? this.state.selected_region.value: 0;
    let employeeId=this.state.empId ? this.state.empId.value: 0;
    let bankId=this.state.selected_bank ?  this.state.selected_bank.value : 0 ;
    fetch(main_url + `salary_report/payrollWithBankReport/${moment(this.state.date).format('YYYY-MM')}/${branchId}/${regionId}/${deparmentId}/${employeeId}`)
    .then(response => {
      if (response.ok){
        return response.json();
      }
    }).then(res => {
      this.setState(
        {
          dataSource: res,
  
        },
        () => {
          this._setTableData(this.state.dataSource);
        }
  
      );
    })
  }
   getEmployeeList=async ()=> {
    await fetch(`${main_url}main/getEmployeeWithDesignation/0`)
        .then(res => res.json())
        .then(data => {
            let filterData=data.filter(v=>v.value != 1)
            
            this.setState({
                employeeList: filterData.map(v => ({ ...v, label: v.employment_id, value: v.value, name: v.label })),
                // allEmployeeID: all
            },()=>{
              this.state.employeeList.unshift({value:0,label:'All',name:'All'})
            })

        })
}
getBank=async ()=> {
  await fetch(`${main_url}employee/getBank`)
      .then(res => res.json())
      .then(data => {
       
          this.setState({
              bankList: data.map(v => ({ ...v, label: v.bank_name, value: v.id, name: v.bank_name })),
              // allEmployeeID: all
          })

      })
}
  async getBranchList() {
    await fetch(`${main_url}benefit/getBranchList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        list.unshift({ label: "All", value: 0 });
        this.setState({
          branchlist: list,
        });
      });
  }
  async getDepartmentList() {
    await fetch(`${main_url}benefit/getDepartmentList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        var array = [];
        list.map((v) => {
          var obj = {};
          obj["label"] = v.deptname;
          obj["value"] = v.departments_id;
          array.push(obj);
        });
        array.unshift({ label: "All", value: 0 });
        this.setState({
          departmentlist: array,
        });
      });
  }
  async getRegionList() {
    await fetch(`${main_url}benefit/getRegionList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        var array = [];
        list.map((v) => {
          var obj = {};
          obj["label"] = v.state_name;
          obj["value"] = v.state_id;
          array.push(obj);
        });
        array.unshift({ label: "All", value: 0 });
        this.setState({
          regionList: array,
        });
      });
  }
  async getEmployeeName() {
    await fetch(`${main_url}report/employeeName`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        list.unshift({ label: "All", value: 0 });
        this.setState({
          empNameList: list,
        });
      });
  }

  handleSelectedDate = async (event) => {
    this.setState({
        date : event
    })
  }
  handleSelectedBranch = async (event) => {
    if (event != null)
      this.setState({
        selected_Branch: event,
      });
  };
  handleSelectedDesignation = async (event) => {
    if (event != null)
      this.setState({
        selected_designation: event,
      });
  };
  handleSelectedDepartment = async (event) => {
    if (event != null)
      this.setState({
        selected_department: event,
      });
  };
  handleSelectedRegion = async (event) => {
    if (event != null)
      this.setState({
        selected_region: event,
      });
  };
  handleSelectedEmpId = async (event) => {
    this.setState({
        empId: event,
        employeeName: this.state.empNameList.filter(v => v.value == event.value),
        
    })
  }
  handleSelectedName = async (event) => {
      this.setState({
          employeeName: event,
          empId: this.state.employeeList.filter(v => v.value == event.value)[0],
          selectedEmployeeName:event
      },()=>{console.log("listnaem",this.state.employeeName.value,this.state.empId.value)})
  }
  handleSelectedBank=async(event)=>{
    this.setState({
      selected_bank:event
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
          region:data[i].state_name ? data[i].state_name : '-',
          branch: data[i].location_master_name ? data[i].location_master_name : "-",
          department:data[i].deptname ? data[i].deptname : '-',
          bank_format_name:data[i].account_name.toUpperCase() ? data[i].account_name.toUpperCase() : '-',
          nrc:data[i].nrc ? data[i].nrc : '-',
          atm_no:data[i].account_no ? data[i].account_no : '-',
          total_salary:data[i].payment_amount ? data[i].payment_amount : '-',
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
        { title: "Employee ID", data: "employee_id" },
        { title: "Name", data: "employee_name" },
        { title: "Region", data: "region" },

        { title: "Branch", data: "branch" },
        { title : "Department",data:'department'},
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
              title: `'Payroll Report With Bank Account No-'${moment(this.state.date).format('YYYY-MM')}`,
          },
         
        ],
        data: l,
        columns: column
      });
    
  }
  // handleSearchData = () => {
  //   // this.setState({
  //   const branchId = this.state.selected_Branch ? this.state.selected_Branch.value : 0
  //   const departmentId = this.state.selected_department ? this.state.selected_department.departments_id : 0
  //   const regionId = this.state.selected_region ? this.state.selected_region.state_id : 0
  //   const employee = this.state.selected_employee ? this.state.selected_employee.value : 0
  //   // })

  //   fetch(main_url + "report/employeeReport/" + this.state.date)
  //     .then(res => { if (res.ok) return res.json() })
  //     .then(list => {
  //       this._setTableData(list);
  //     })
  // }
  render() {
    console.log("employee id===<",this.state.empId,this.state.employeeName,this.state.employeeList
    );
  
    return (
      <div>
        <div className="row  white-bg dashboard-header">
        <h3 className="" style={{paddingLeft:"10px"}}>Payroll Report With Bank No</h3>
          <div className='col-md-12' style={{ display: 'flex', justifyContent: 'left', alignItems: 'end', margin: '10px 10px 10px 0px' }}>
          
          <div className="col-md-2">
            <label htmlFor="">Date</label>
            <DatePicker
                            dateFormat="YYYY-MM"
                            value={this.state.date}
                            onChange={this.handleSelectedDate}
                            timeFormat={false}
                        />
          </div>
          
             <div className="col-md-2" >
              <label htmlFor="">Branch</label>
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    //   flex: 1
                    // width: 150,
                    // marginRight:10
                  }),
                  control: (base) => ({
                    ...base,
                    minHeight: "18px",
                    
                  }),
                }}
                placeholder="Branch"
                options={this.state.branchlist}
                onChange={this.handleSelectedBranch}
                value={this.state.selected_Branch}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            <div className="col-md-2">
              <label htmlFor="">Region</label>
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    //   flex: 1
                    // width: 150,
                    // marginRight:10
                  }),
                  control: (base) => ({
                    ...base,
                    minHeight: "18px",
                  }),
                }}
                placeholder="Region"
                options={this.state.regionList}
                onChange={this.handleSelectedRegion}
                value={this.state.selected_region}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            <div className="col-md-2">
              <label htmlFor="">Employee Id</label>
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    //   flex: 1
                    // width: 150
                  }),
                  control: (base) => ({
                    ...base,
                    minHeight: "18px",
                  }),
                }}
                placeholder="Employee Id"
                options={this.state.employeeList}
                onChange={this.handleSelectedEmpId}
                value={this.state.empId}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>

            
            <div className="col-md-2">
              <label htmlFor="">Employee Name</label>
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    //   flex: 1
                    // width: 150
                  }),
                  control: (base) => ({
                    ...base,
                    minHeight: "18px",
                  }),
                }}
                placeholder="Employee Name"
                options={this.state.empNameList}
                onChange={this.handleSelectedName}
                value={this.state.employeeName}
                className="react-select-container"
                classNamePrefix="react-select"
              />
              </div>
              <div className="col-md-2">
            <button className='btn btn-primary text-center' style={{  height: 30, padding: '0px 10px 0px 10px' }} onClick={() => this.getPayrollReportWithBankNo()}>Search</button>
                
                </div>           
            
          </div>
          <div className="col-md-12" style={{marginBottom:'10px'}}>
          <div className="col-md-2">
              <label htmlFor="">Department</label>
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    //   flex: 1
                    // width: 150,
                    // marginRight:10
                  }),
                  control: (base) => ({
                    ...base,
                    minHeight: "18px",
                  }),
                }}
                placeholder="Department"
                options={this.state.departmentlist}
                onChange={this.handleSelectedDepartment}
                value={this.state.selected_department}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div>
            {/* <div className="col-md-2">
              <label htmlFor="">Bank Name</label>
              <Select
                styles={{
                  container: (base) => ({
                    ...base,
                    //   flex: 1
                    // width: 150,
                    // marginRight:10
                  }),
                  control: (base) => ({
                    ...base,
                    minHeight: "18px",
                  }),
                }}
                placeholder="Bank Name"
                options={this.state.bankList}
                onChange={this.handleSelectedBank}
                value={this.state.selected_bank}
                className="react-select-container"
                classNamePrefix="react-select"
              />
            </div> */}
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