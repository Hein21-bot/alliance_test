import React, { Component } from "react";
import { main_url } from '../../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import Select from 'react-select';
import DatePicker from 'react-datetime';
import moment from "moment";
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');
class PayrollDetailsReport extends Component {
  constructor(props) {
    super(props);
    this.state = {


      date:moment().format('YYYY-MM-DD'),
      regionList: null,

      fullname:'',
      empName: 0,
      martial_status: null,
      contact_person: null,
      contact_phone: null,
      guarantee_contact_person: null,
      guarantee_contact_phone: null,
      phone_no: null,
      employee_id: null,
      employee_date: moment().format("YYYY-MM-DD"),
      selected_Branch: null,
      selected_department: null,
      selected_designation: null,
      selected_region: null,
      designationList: null,
      branchlist: null,
      departmentlist: null,
      branchId: null,
      designationId: null,
      departmentId: null,
      regionId: null,
      EmployeeNameList: null,
      selected_employeeId: null,
      selected_employee_status:null,
      employeeIdList:[],
      EmployeeStatus:[
        {
            value:1,label:'Permanent'
        },
        {
            value:2,label:'Part-Time'
        },
        {
            value:3,label:'Training'
        }
      ]
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
    this.getRegionList();
    this.getDepartmentList();
    this.getBranchList();
   
    this.getEmployeeCode();
    this.handleSearchData();

    
  }
  getDesignationList() {
    fetch(`${main_url}main/getDesignations`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          designationList: list
        });
      });
  }
  getBranchList() {
    fetch(`${main_url}benefit/getBranchList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          branchlist: list.map((v) => ({
            ...v,
            
          })),
        });
      });
  }

  getDepartmentList() {
    fetch(`${main_url}benefit/getDepartmentList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ departments_id: 0, deptname: "All" });
        this.setState({
          departmentlist: list.map((v) => ({
            ...v,
            label: v.deptname,
            value: v.departments_id,
          })),
        });
      });
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
  getEmployeeCode() {
    fetch(`${main_url}employee/getEmployeeCode`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          employeeIdList: list.map((v) => ({
            ...v,
            label: v.employee_code,
            value: v.user_id,
          })),
        });
      });
  }
  handleSelectedEmpId = async (event) => {
    console.log("event",event)
    if (event != null)
    if (event) {
      fetch(`${main_url}employee/getDetailUser/${event.user_id}`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((data) => {
          this.setState({
              fullname:data[0].employee_name
          })
          // if (data.length > 0) {
          //   this.getData(this.props.id);
          //   this.setState({ tableEdit: true, tableView: false });


          // }
        });
    }
      this.setState(
        {
          selected_employeeId: event
        }
      )
  }
  handleSelectedBranch = async (event) => {
    if (event != null)
      this.setState({
        selected_Branch: event
      })
  };
  handleSelectedDesignation = async (event) => {
    if (event != null)
      this.setState({
        selected_designation: event
      })
  }
  handleSelectedDepartment = async (event) => {
    if (event != null)
      this.setState({
        selected_department: event
      })
  }
  handleSelectedRegion = async (event) => {
    if (event != null)
      this.setState({
        selected_region: event
      })
  };
  handleSelectedEmpName = async (event) => {
    if (event != null)
      this.setState(
        {
          selected_employee: event
        }
      )
  }
  handleEmployeeStatus=async(event)=>{
    this.setState({
        selected_employee_status:event
    })
  }
  handleSelectedDate=async(event)=>{
    this.setState({
        date:event
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
          designation: data[i].designations ? data[i].designations : "-",
          level:data[i].carrer_level ? data[i].carrer_level : "-",
          region: data[i].region_name ? data[i].region_name : "-",
          employee_status: data[i].martial_status ? data[i].martial_status : '-',
          gross_salary: data[i].contact_person ? data[i].contact_person : '-',
          deduction_or_addition: data[i].contact_person_phone ? data[i].contact_person_phone : "-",
          salary_after_deduction_addition: data[i].guarantee_person ? data[i].guarantee_person : '-',
          ssc_3: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          ssc_2: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          income_tax: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          net_salary_paid: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          total_gross_salary: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          maintenance: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          petrol: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          back_pay: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          allowance: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          income_tax_adjust: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          medical_fund: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          confirmation: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          annual_award: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          incentive: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          other_deduction: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          salary_cut: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          deduction_loan: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          atm_or_cash: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          total: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",

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
        { title :'Level',data:'level'},
        { title: "Region", data: "region" },
        { title: "Branch", data: "branch" },
        { title: "Employee Status", data: "employee_status" },
        { title: "Gross Salary", data: "gross_salary" },
        { title: "Deduction(+)/Additions(-)", data: "deduction_or_addition" },
        { title: "Salary After Deductions/Additions", data: "salary_after_deduction_addition" },
        { title: "SSC(Employer 3%)", data: "ssc_2" },
        { title: "SSC(Employee 2%)", data: "ssc_3" },
        { title: "Income Tax", data: "income_tax" },
        { title: "Net Salary Paid", data: "net_salary_paid" },
        { title: "Total Gross Salary", data: "total_gross_salary" },
        { title: "Maintenance", data: "maintenance" },
        { title: "Petrol", data: "petrol" },
        { title: "Back Pay", data: "back_pay" },
        { title: "Allowance", data: "allowance" },
         { title: "Income Tax Adjust", data: "income_tax_adjust" },
          { title: "Medical Fund", data: "medical_fund" }, 
          { title: "Confirmation on Salary Adjustment", data: "confirmation" },
          { title: "Annual Award", data: "annual_award" },
          { title: "Incentive", data: "incentive" },
          { title: "Other Deduction", data: "other_deduction" },
          { title: "Salary Cut", data: "salary_cut" },
          { title: "Deduction of Loan", data: "deduction_loan" },
          { title: "ATM or Cash",data:'atm_or_cash'},
          { title :"Total",data:'total'}

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
              title: 'Payroll Details Report',
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
    const designationId = this.state.selected_designation ? this.state.selected_designation.value : 0
    const regionId = this.state.selected_region ? this.state.selected_region.state_id : 0
    const employee = this.state.selected_employeeId ? this.state.selected_employeeId.value : 0
    const Date=moment(this.state.date).format('YYYY-MM-DD')
    // })

    fetch(main_url + "report/employeeReport/" + regionId + "/" + departmentId + "/" + branchId + "/" + designationId + "/" + employee+"/"+Date)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this._setTableData(list);
      })
  }
  render() {
  
    return (
      <div>
        <div className="row  white-bg dashboard-header">
        <h3 className="" style={{paddingLeft:"10px"}}>Payroll Details Report</h3>
          <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
          <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.date}
                            onChange={this.handleSelectedDate}
                            timeFormat={false}
                        />
          <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginRight:10,
                  marginLeft:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Branch"
              options={this.state.branchlist}
              onChange={this.handleSelectedBranch}
              value={this.state.selected_Branch}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginRight:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Region"
              options={this.state.regionList}
              onChange={this.handleSelectedRegion}
              value={this.state.selected_region}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginRight:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Department"
              options={this.state.departmentlist}
              onChange={this.handleSelectedDepartment}
              value={this.state.selected_department}
              className="react-select-container"
              classNamePrefix="react-select"
            />
             <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginRight:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Employee Status"
              options={this.state.EmployeeStatus}
              onChange={this.handleEmployeeStatus}
              value={this.state.selected_employee_status}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150,
                  marginRight:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Employee ID"
              options={this.state.employeeIdList}
              onChange={this.handleSelectedEmpId}
              value={this.state.selected_employeeId}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            <input type="text" className="form-control" style={{width:'150px'}} value={this.state.fullname} disabled/>
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
export default PayrollDetailsReport;