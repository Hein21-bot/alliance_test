import React,{Component} from "react";
import {getBranch,getRegion,getDepartment,main_url,getFirstDayOfMonth} from '../../utils/CommonFunction';
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


class AttendanceReport extends Component {
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
            AttendanceTypeList:[],
            AttendanceStatusList:[],
            StatusList:[],
            AttendanceReasonList:[],
            selectedAttendanceType:null,
            selectedAttendanceStatus:null,
            selectedstatus:null,
            selectedEmployeeName:null,
            selectedAttendanceReason:null
        }
    }
    
    async componentDidMount (){
        this.$el = $(this.el);
        this.setState(
          {
            dataSource: this.props.data,
    
          },
          () => {
            this._setTableData(this.state.dataSource);
          }
        );
    

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
        this.handleSearchData();
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
    handleSelectedAttendanceType=async(event)=>{
      this.setState({
        selectedAttendanceType:event
      })
    }
    handleSelectedAttendanceStatus=async(event)=>{
      this.setState({
        selectedAttendanceStatus:event
      })
    }
    handleSelectedStatus=async(event)=>{
      this.setState({
        selectedstatus:event
      })
    }
    handleSelectedEmployeeName=async(event)=>{
      this.setState({
        selectedEmployeeName:event.target.value
      })
    }
    handleSelectedAttendanceReason=async(event)=>{
      this.setState({
        selectedAttendanceReason:event
      })
    }
    handleSearchData = () => {
        fetch(`${main_url}report/extensionReport/${this.state.branchId ? this.state.branchId.value : 0}/${this.state.regionId ? this.state.regionId.value : 0}/${this.state.departmentId ? this.state.departmentId.value : 0}/${moment(this.state.from_date).format("YYYY-MM-DD")}/${moment(this.state.to_date).format("YYYY-MM-DD")}`)
          .then(res => { if (res.ok) return res.json() })
          .then(list => { 
            this._setTableData(list);
          })
      }

    _setTableData = (data) => { 
        var table;
        var l = [];
        if (data){
        for (var i = 0; i < data.length; i++) {
            let result = data[i];
            let obj = [];
                obj = {
                no: i + 1,
                employee_id:data[i].employment_id ? data[i].employment_id :"-",
                employee_name:data[i].fullname ? data[i].fullname : "-",
                branch: data[i].branch_name ? data[i].branch_name: "-",
                designation:data[i].designations ? data[i].designations : "-",
                level:data[i].career_level ? data[i].career_level : "-",
                department:data[i].deptname ? data[i].deptname : "-",
                region:data[i].region_name ? data[i].region_name : '-',
                pa_score:data[i].performance_score ? data[i].performance_score : '-',
                target_achievement:data[i].target_achievement ? data[i].target_achievement : '-',
                overall_performance:data[i].comment_overall_performance ? data[i].comment_overall_performance : '-',
                extension_period:data[i].extension_period ? data[i].extension_period : '-'
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
            { title: "Sr No", data: "no" },
            { title: "Date", data: "employee_id" },
            { title: "Employee ID", data: "employee_name" },
            { title: "Employee Name", data: "designation" },
            { title: "Position", data: "level" },
            { title: "Branch", data: "department" },
            { title: "Check in", data: "branch" },
            { title: "Check Out", data: "region" },
            { title: "Working Hour", data: "pa_score" },
            { title: "Attendance Type", data: "target_achievement" },
            { title: "Attendance Status", data: "overall_performance" },
            { title: "Attenedacne Reason", data: "extension_period" },
            { title: "Status", data: "extension_period" },
        ]
        table = $("#dataTables-table").DataTable({

            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            pageLength: 50,
            paging: true,
        //     // buttons: true,
            dom: 'Bfrtip',
        //     // buttons: [
        //     //     'copy', 'csv', 'excel', 'pdf'
        //     // ],
            buttons: [
        //         // 'copy',
        //         // {
        //         //         extend: 'csvHtml5',
        //         //         title: 'Child Benefit',
        //         // },
        //         // {
        //         //     extend: 'excelHtml5',
        //         //     title: 'Child Benefit',
        //         // },
        //         // {
        //         //     extend: 'pdfHtml5',
        //         //     title: 'Child Benefit',
        //         // }
            ],
            data: l,
            columns: column
        });
    }
   
  
        render(){
          
        return (
            <div>
            <div className="row  white-bg dashboard-header">
           <h3 className="" style={{paddingLeft:"10px"}}>Attendance Report</h3>
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
            <div style={{width:150,marginLeft:10}}>
            <input type="text" className="form-control" onChange={this.handleSelectedEmployeeName} placeholder='Employee Name'/>
            </div>
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
            </div>
            <div className="flex-row" style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
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
              placeholder="Attendance Type"
              options={this.state.AttendanceTypeList}
              onChange={this.handleSelectedAttendanceType}
              value={this.state.selectedAttendanceType}
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
              placeholder="Attendance Status"
              options={this.state.AttendanceStatusList}
              onChange={this.handleSelectedAttendanceStatus}
              value={this.state.selectedAttendanceStatus}
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
              placeholder="AttendanceReason"
              options={this.state.AttendanceReasonList}
              onChange={this.handleSelectedAttendanceReason}
              value={this.state.selectedAttendanceReason}
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
              placeholder="Status"
              options={this.state.StatusList}
              onChange={this.handleSelectedStatus}
              value={this.state.selectedstatus}
              className='react-select-container'
              classNamePrefix="react-select"
            />
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
    export default AttendanceReport;