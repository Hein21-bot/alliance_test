import React,{Component} from "react";
import {getBranch,getDepartment,getRegion,getDesignation,main_url} from '../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import Select from 'react-select' ;
import DatePicker from 'react-datetime';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');


class WeeklyAttendance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            branch:[],
            region:[],
            EmployeeNameList:[],
            department:[],
            dateRange:[],
            empIdList:[],
            designation:[],
            branchId:null,
            regionId:null,
            departmentId:null,
            designationId:null,
            empName:null,              
            phone_no:null,
            empId:null,
            start_date:moment().format("YYYY-MM-DD"),
            end_date:moment().format("YYYY-MM-DD"),
            name:"",
            dataSource:[],
            regionvalue:null
           
        }
    }
    
    async componentDidMount (){
        this.$el = $(this.el);
        this.setState(
          {
            dataSource: this.props.data,
    
          },
          () => {
            // this._setTableData(this.state.dataSource);
          }
        );
    

        let branch = await getBranch();
        branch.unshift({ label: 'All', value: 0 });
        let region = await getRegion();
        region.unshift({region_name: 'ALL', region_id: 0});
        // await this.getEmployeeName();
        await this.getEmployeeList();
        // await getDate;
        let department = await getDepartment();
        department.unshift({label:'ALL', value: 0});
        this.setState({
            branch: branch,
            department: department,
            region: region.map(v => ({ ...v, label: v.region_name, value: v.region_id })),
           
        })
    }
    getEmployeeList() {
      fetch(`${main_url}main/getEmployeeWithDesignation/0`)
          .then(res => res.json())
          .then(data => {
              // const all = data.map(v => (v.employment_id).trim())
              this.setState({
                  employeeList: data.map(v => ({ ...v, label: v.employment_id, value: v.value,name:v.label })),
                  // allEmployeeID: all
              })

          })
  }
    handleSelectedBranch = async (event) => {
        this.setState({
           branchId : event
        })
    }
    handleSelectedStartDate = async (event) => {
      this.setState({
          start_date : event
      })
    }
    handleSelectedEndDate = async (event) => {
        this.setState({
            end_date : event
        })
      }
    handleSelectedDepartment = async (event) => {
        this.setState({
           departmentId : event
        })
    }
    handleSelectedEmpId = async (event) => {
     
        this.setState({
           empId : event,
          name: event.name
        })
    }
  
    handleSelectedRegion = async (event) => {
        this.setState({
           regionId : event,
           
        })
    }
    handleSearchData = (regionId,date,designationId,branchId,empId) => {
        fetch(`${main_url}report/employeeReportServiceYear/${this.state.regionId  ? this.state.regionId.value : 0}/${this.state.branchId ? this.state.branchId.value : 0}/${this.state.designationId ? this.state.designationId.value :0 }/${this.state.empId ?this.state.empId.name :0 }/${this.state.date}`)
        .then(res => { if (res.ok) return res.json() })
          .then(list => { console.log(list)
            // let data=list
            this._setTableData(list);
          })
      }

    
    
        render(){ 
         
        return (
            <div className="col-lg-12">
            <div className="row  white-bg dashboard-header">
           
              <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
              
              <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.start_date}
                            onChange={this.handleSelectedStartDate}
                            timeFormat={false}
                        />
              <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.end_date}
                            onChange={this.handleSelectedEndDate}
                            timeFormat={false}
                        />
              <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Region"
              options={this.state.region}
              onChange={this.handleSelectedRegion}
              value={this.state.regionId}
              className='react-select-container'
              classNamePrefix="react-select"
            />
             <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Employee ID"
              options={this.state.employeeList}
              onChange={this.handleSelectedEmpId}
              value={this.state.empId}
              className='react-select-container'
              classNamePrefix="react-select"
            />
           <input type="value"  placeholder="Name" className="form-control input-md" style={{width:"100px"}} value={this.state.name} />
             <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Department"
              options={this.state.department}
              onChange={this.handleSelectedDepartment}
              value={this.state.departmentId}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            
             <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 150
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Branch"
              options={this.state.branch}
              onChange={this.handleSelectedBranch}
              value={this.state.branchId}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
            </div>
           </div>
           
            <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                    id="dataTables-table"
                > <thead>
                <tr className="" style={{textAlign:"center"}}>
                    <th rowspan="2">Employee Name</th>
                    <th rowspan="2">Position</th>
                    <th rowspan="2">Branch</th>
                    <th colspan="2">10/5/2021</th>
                    <th colspan="2">11/5/2021</th>
                    <th colspan="2">11/5/2021</th>
                    <th colspan="2">11/5/2021</th>
                    <th colspan="2">11/5/2021</th>
                    <th rowspan="2">Total Working Hour</th>
                </tr>
                <tr>
                    <th>In</th>
                    <th>Out</th>
                    <th>In</th>
                    <th>Out</th>
                    <th>In</th>
                    <th>Out</th>
                    <th>In</th>
                    <th>Out</th>
                    <th>In</th>
                    <th>Out</th>
                   
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Lae Lae Moe</td>
                    <td>IT Assistanse</td>
                    <td>Head Office</td>
                    <td>8:20:00 AM</td>
                    <td>8:20:00 AM</td>
                    <td>8:20:00 AM</td>
                    <td>8:20:00 AM</td>
                    <td>8:20:00 AM</td>
                    <td>8:20:00 AM</td>
                    <td>8:20:00 AM</td>
                    <td>8:20:00 AM</td>
                    <td>8:20:00 AM</td>
                    <td>8:20:00 AM</td>
                    <td>8:20:00 AM</td>
                </tr>
                </tbody>
                </table>
           </div>
           
        )
    }
}
    export default WeeklyAttendance;