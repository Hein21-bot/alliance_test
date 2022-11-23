import React, { Component } from "react";
import { main_url } from '../../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import Select from 'react-select';
import DatePicker from 'react-datetime';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import moment from "moment";
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');
class PayrollSummaryReportWithLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {


      date:moment().format('YYYY-MM-DD'),
      regionList: null,
        data:[],
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
        
      }

    );
    this.getRegionList();
    this.getDepartmentList();
    this.getBranchList();
   
   
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

  handleSearchData = () => {
    // this.setState({
    const branchId = this.state.selected_Branch ? this.state.selected_Branch.value : 0
    const regionId = this.state.selected_region ? this.state.selected_region.state_id : 0
    const employee_status = this.state.selected_employee_status ? this.state.selected_employee_status.value : 0
    const Date=moment(this.state.date).format('YYYY-MM-DD')
    // })

    fetch(main_url + "report/employeeReport/" + regionId + "/" + branchId + "/" + employee_status+"/"+Date)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
       this.setState({
        data:list
       })
      })
  }
  render() {
  
    return (
      <div>
        <div className="row  white-bg dashboard-header">
        <h3 className="" style={{paddingLeft:"10px"}}>Payroll Summary Report With Locatin Wise/Status Wise</h3>
        <div style={{overflow:'scroll'}}>
        <ReactHTMLTableToExcel 
                    className="btn-excel"
                    table="reg_wise_staff"
                    filename="Payroll Summary Report With Location Wise/Status Wise"
                    buttonText="Excel"
                    sheet="Sheet"
                    />
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
            
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
          </div>
          <table className="table table-bordered" id="reg_wise_staff" style={{overflow:'scroll'}}>
              <thead>
                <tr style={{overflow:'scroll'}}>
                    <th>Region/Branch</th>
                    <th>Employee Status</th>
                     <th>Gross Salary</th>
                     <th>Deductins(+)/Additions(-)</th>
                     <th>Salary After Deductions/Additions</th>
                     <th>SSC(Employer 3%)</th>
                     <th>SSC(Employee 2%)</th>
                     <th>Income Tax</th>
                     <th>Net Salary Paid</th>
                     <th>Total Gross Salary</th>
                     <th>Maintenance</th>
                     <th>Petrol</th>
                     <th>Backpay</th>
                     <th>Allowance</th>
                     <th>Income Tax Adjust</th>
                     <th>Medical Fund</th>
                     <th>Deduct for using office cycle</th>
                    <th>Salary Cut(Tablet)</th>
                    <th>Deduction of Loan</th>
                      <th>Total</th>
                       <th>Grand Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                    <td rowSpan={4}>All Alliance</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td rowSpan={4}>5600</td>
                </tr>
                <tr>
                   
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                   
                </tr>
                <tr>
                    
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    
                </tr>
                <tr>
                   
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    <td>23</td>
                    <td>All</td>
                    <td>jaslkdfj</td>
                    <td>kasdfjl</td>
                    <td>afsjlljfs</td>
                    
                </tr>
              </tbody>
          </table>
        </div>
      </div>
      </div>
    )
  }
}
export default PayrollSummaryReportWithLocation;