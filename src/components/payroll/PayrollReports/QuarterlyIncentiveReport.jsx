import React, { Component } from "react";
import { main_url } from '../../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import Select from 'react-select';
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
class QuarterlyIncentiveReport extends Component {
  constructor(props) {
    super(props);
    this.state = {

      fullname:'',
      data:[],
      regionList: null,
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
      employeeIdList: null,
      selected_employeeId: null
    }
  }

  async componentDidMount() {
    this.$el = $(this.el);
    this.getRegionList();
    this.getBranchList();
    this.getDesignationList();
    this.getEmployeeCodeList();
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
  getEmployeeCodeList() {
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
  handleSelectedRegion = async (event) => {
    if (event != null)
      this.setState({
        selected_region: event
      })
  };
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

  handleSearchData = () => {
    // this.setState({
    const branchId = this.state.selected_Branch ? this.state.selected_Branch.value : 0
    const departmentId = this.state.selected_department ? this.state.selected_department.departments_id : 0
    const designationId = this.state.selected_designation ? this.state.selected_designation.value : 0
    const regionId = this.state.selected_region ? this.state.selected_region.state_id : 0
    const employee = this.state.selected_employeeId ? this.state.selected_employeeId.value : 0
    // })

    fetch(main_url + "report/employeeReport/" + regionId + "/" + branchId + "/" + designationId + "/" + employee)
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
        <h3 className="" style={{paddingLeft:"10px"}}>Quarterly Incentive Report </h3>
        <ReactHTMLTableToExcel 
                    className="btn-excel"
                    table="reg_wise_staff"
                    filename={"Quarterly Incentive Report"+moment(this.state.date).format('YYYY-MM')}
                    buttonText="Excel"
                    sheet="Sheet"
                    />
          <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
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
              placeholder="Designation"
              options={this.state.designationList}
              onChange={this.handleSelectedDesignation}
              value={this.state.selected_designation}
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
          <table className="table table-bordered" id="reg_wise_staff" style={{overflow:'scroll'}}>
            <thead>
                <tr>
                    <th style={{textAlign:'center'}} rowSpan={3}>Sr No</th>
                    <th style={{textAlign:'center'}} rowSpan={3}>Employee Code</th>
                    <th style={{textAlign:'center'}} rowSpan={3}>Name</th>
                    <th style={{textAlign:'center'}} rowSpan={3}>Position</th>
                    <th style={{textAlign:'center'}} rowSpan={3}>BSC Category</th>
                    <th style={{textAlign:'center'}} rowSpan={3}>Branch</th>
                    <th style={{textAlign:'center'}} rowSpan={3}>Branch Code</th>
                    <th style={{textAlign:'center'}} colSpan={3}>Monthly Salary</th>
                    <th style={{textAlign:'center'}} rowSpan={3}>Average Salary</th>
                    <th style={{textAlign:'center'}} rowSpan={3}>BSC%</th>
                    <th style={{textAlign:'center'}} rowSpan={3}>Total Incentive</th>
                    <th style={{textAlign:'center'}} rowSpan={3}>Remark</th>
                </tr>
                <tr>
                    <th style={{textAlign:'center'}}>Jan</th>
                    <th style={{textAlign:'center'}}>Feb</th>
                    <th style={{textAlign:'center'}}>March</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>2</td>
                    <td>A-13221</td>
                    <td>Ye Htet</td>
                    <td>IT</td>
                    <td>CO,FX</td>
                    <td>Mdy</td>
                    <td>Mandalay</td>
                    <td>20000</td>
                    <td>30000</td>
                    <td>40000</td>
                    <td>45611</td>

                    <td>2.5%</td>
                    <td>44.10</td>
                    <td></td>
                </tr>
            </tbody>
          </table>
        
      </div>
      </div>
    )
  }
}
export default QuarterlyIncentiveReport;