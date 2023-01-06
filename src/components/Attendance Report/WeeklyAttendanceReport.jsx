import React,{Component} from "react";
import {getBranch,getRegion,getDepartment,main_url,getDatesInRange} from '../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import moment from "moment";
import Select from "react-select";
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');



class WeeklyAttendanceReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            branch:[],
            region:[],
            department:[],
            branchId:null,
            regionId:null,
            departmentId:null,
            from_date:moment(),
            to_date:moment(),
            EmployeeIDList:[],
            selectedEmployeeId:'',
            selectedEmployeeID:null,
            selectedEmployeeName:null,
            dataSource:[],
            dateList:[]
        }
    }
    
    async componentDidMount (){
        this.$el = $(this.el);
        let branch = await getBranch();
        branch.unshift({ label: 'All', value: 0 });
        let department = await getDepartment();
       department.unshift({ label: 'All', value: 0 });
        let region = await getRegion();
        region.unshift({state_name: 'ALL', state_id: 0});
        this.setState({
            branch: branch,
            department: department,
            region: region.map(v => ({ ...v, label: v.state_name, value: v.state_id })),
           
        })
        this.getEmployeeList();
        // this.handleSearchData();
    }
    getEmployeeList() {
        fetch(`${main_url}main/getEmployeeWithDesignation/0`)
            .then(res => res.json())
            .then(data => {
                // const all = data.map(v => (v.employment_id).trim())
                this.setState({
                    EmployeeIDList: data.map(v => ({ ...v, label: v.employment_id, value: v.value,name:v.label })),
                    // allEmployeeID: all
                })
  
            })
    }
    handleSelectedBranch = async (event) => {
        this.setState({
           branchId : event
          })
    }
    
    handleSelectedDepartment = async (event) => {
        this.setState({
           departmentId : event
          })
    }
    handleSelectedRegion = async (event) => {
        this.setState({
           regionId : event
        })
    }
    handleSelectedFromdate = async (event) => {
        this.setState({
           from_date : event
        })
    }
     handleSelectedTodate = async (event) => {
        this.setState({
           to_date : event
        })
    }
    handleSelectedEmployeeID=async(event)=>{
        this.setState({
            selectedEmployeeID:event,
            selectedEmployeeName:event.name,
            selectedEmployeeId:event.value
        })
    }
    
    handleSearchData = () => {
     const dates=getDatesInRange((this.state.from_date),this.state.to_date)
     console.log("dateeeeeeeeeee",dates);
        fetch(`${main_url}attendance/weekelyAttendance/${moment(this.state.from_date).format('YYYY-MM-DD')}/${moment(this.state.to_date).format('YYYY-MM-DD')}/${this.state.branchId ? this.state.branchId.value : 0}/${this.state.departmentId ? this.state.departmentId.value : 0}/${this.state.regionId ? this.state.regionId.value : 0}/${this.state.selectedEmployeeId ? this.state.selectedEmployeeId : 0}`)
          .then(res => { if (res.ok) return res.json() })
          .then(list => { 
           this.setState({
            dataSource:list
           })
          })
      }

     
   
  
        render(){  
          
        return (
            <div>
            <div className="row  white-bg dashboard-header">
           <h3 className="" style={{paddingLeft:"10px"}}>Weekly Attendance Report</h3>
              <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
              <div style={{marginRight:10,width:150}}>
              <DatePicker
                  dateFormat="DD/MM/YYYY"
                  value={this.state.from_date}
                  onChange={this.handleSelectedFromdate}
                  timeFormat={false}
                />
              </div>
              <div style={{marginRight:10,width:150}}>
              <DatePicker
                 dateFormat="DD/MM/YYYY"
                 value={this.state.to_date}
                 onChange={this.handleSelectedTodate}
                 timeFormat={false}
                />
              </div>
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
              options={this.state.branch}
              onChange={this.handleSelectedBranch}
              value={this.state.branchId}
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
                  width: 150,
                  marginLeft:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Employee ID"
              options={this.state.EmployeeIDList}
              onChange={this.handleSelectedEmployeeID}
              value={this.state.selectedEmployeeID}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            <div style={{marginLeft:10,width:110}}>
                <input type="value" placeholder="Employee Name" className="form-control" value={this.state.selectedEmployeeName}/>
           </div>
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
            </div>
           
            <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                    id="dataTables-table"
                />
           </div>
           <div style={{overflowX:'auto'}}>
                <table className="table table-bordered" style={{overflow:'scroll'}}>
                    <thead>
                        <tr style={{ backgroundColor: 'blue', color: 'white',overflow:'scroll' }}>
                            <th style={{textAlign:'center',width:100}} rowSpan={2}><div style={{width:100}}>Employee Name</div></th>
                            <th style={{textAlign:'center',width:100}} rowSpan={2}><div style={{width:100}}>Position</div></th>
                            <th style={{textAlign:'center',width:100}} rowSpan={2}><div style={{width:100}}>Branch</div></th>
                            <th style={{textAlign:'center',width:100}} colSpan={2}>10/5/2021</th>
                            <th style={{textAlign:'center',width:100}} colSpan={2}>11/5/2021</th>
                            <th style={{textAlign:'center',width:100}} colSpan={2}>12/5/2021</th>
                            <th style={{textAlign:'center',width:100}} colSpan={2}>13/5/2021</th>
                            <th style={{textAlign:'center',width:100}} colSpan={2}>14/5/2021</th>

                            {/* {
                                    this.state.mapValue != null && this.state.mapValue.map((v1)=>{
                                        
                                        return(
                                            <th style={{textAlign:'center',width:100}} colSpan={2}>
                                                {v1.designations}
                                            </th>
                                        ) 
                                    })
                                } */}
                            
                            <th style={{textAlign:'center'}} rowSpan={2}><div style={{width:100}}>Total Working Hour</div></th>
                        </tr>
                        {/* <tr style={{ backgroundColor: 'white', color: 'color' }}>
                            
                            {
                                this.state.mapValue != null && this.state.mapValue.map((v1)=>{
                                    return(
                                        <>
                                        
                                                <th style={{textAlign:'center'}}>Male</th>
                                                <th style={{textAlign:'center'}}>Female</th>
                                                </>
                                                
                                        
                                    )
                                })
                            }
                            
                        </tr> */}
                        <tr style={{ backgroundColor: 'white', color: 'color' }}>
                            <th style={{textAlign:'center'}}>In</th>
                            <th style={{textAlign:'center'}}>Out</th>
                            <th style={{textAlign:'center'}}>In</th>
                            <th style={{textAlign:'center'}}>Out</th>
                            <th style={{textAlign:'center'}}>In</th>
                            <th style={{textAlign:'center'}}>Out</th>
                            <th style={{textAlign:'center'}}>In</th>
                            <th style={{textAlign:'center'}}>Out</th>
                            <th style={{textAlign:'center'}}>In</th>
                            <th style={{textAlign:'center'}}>Out</th>
                        </tr>
                    </thead>
                    <tbody style={{ textAlign:'center'}}>
                            {/* {
                                this.state.dataRow.map((v1,k)=>{
                                    return(
                                        <tr>
                                             <td style={{borderColor:'white'}}>{v1.branch_name}</td>
                                        {
                                            v1.designations.map((designation,i)=>{
                                                return(
                                                    <>
                                                            <td style={{ borderColor: 'white' }}>{(designation.gender[0].toLowerCase() == "male" && designation.gender.length == 2) ? designation.gender[1] : (designation.gender.length == 4) ? designation.gender[3] : 0}</td>
                                                            <td style={{ borderColor: 'white' }}> {designation.gender[0].toLowerCase() == "female" ? designation.gender[1] : 0}</td>  
                                                           
                                                    </>
                                                )
                                            })
                                        }
                                        <td>{this.state.listTotal[k]}</td>
                                        </tr>
                                    )
                                })
                            } */}
                            {
                    this.state.dataSource.map((v,i)=>{
                      return(
                        <>
                               <tr>
                                <td style={{borderColor:'white'}}>{v.name}</td>
                                <td style={{borderColor:'white'}}>{v.position}</td>
                                <td style={{borderColor:'white'}}>{v.branch}</td>
                                <td style={{borderColor:'white'}}>8:20:00AM</td>
                                <td style={{borderColor:'white'}}>8:20:00AM</td>
                                <td style={{borderColor:'white'}}>8:20:00AM</td>
                                <td style={{borderColor:'white'}}>8:20:00AM</td>
                                <td style={{borderColor:'white'}}>8:20:00AM</td>
                                <td style={{borderColor:'white'}}>8:20:00AM</td>
                                <td style={{borderColor:'white'}}>8:20:00AM</td>
                                <td style={{borderColor:'white'}}>8:20:00AM</td>
                                <td style={{borderColor:'white'}}>8:20:00AM</td>
                                <td style={{borderColor:'white'}}>8:20:00AM</td>
                                
                                <td style={{borderColor:'white'}}>{v.total_hours}</td>
                                
                            </tr>
                            </>)
                    })}
                    </tbody>

                </table>
            </div>
           </div>
        )
    }
}
    export default WeeklyAttendanceReport;