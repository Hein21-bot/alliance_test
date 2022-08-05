import React,{Component} from "react";
import {getBranch,getRegion,getDepartment,main_url,getFirstDayOfMonth, getTicketStatus} from '../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import moment from "moment";
import Select from "react-select"
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
            empNameList:[],
            region:[],
            atdTypeList:[],
            statusList:[],
            atdStatusList:[],
            atdReasonList:[],
            department:[],
            branchId:0,
            regionId:0,
            empName:0,
            status:0,
            atd_type:0,
            atd_reason:0,
            atd_status:0,
            departmentId:0,
            from_date:moment(),
            to_date:moment() 
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
        region.unshift({region_name: 'ALL', region_id: 0});
        // await getEmployeeNameList();
        // await getAttendanceTypeList();
        // await getStatus();
        // await getAttendanceStatusList();
        // await getAttendanceReasonList();
        this.setState({
            branch: branch,
            department: department,
            region: region.map(v => ({ ...v, label: v.region_name, value: v.region_id })),
            // status:status,
            // atdTypeList:atdTypeList,
            // atdStatusList:atdStatusList,
            // atdReasonList:atdReasonList,
            // empNameList:empNameList,
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
     // handleSelectedAttendanceReason = async (event) => {
    //     this.setState({
    //        atd_reason : event
    //     })
    // }
     // handleSelectedAttendanceStatus = async (event) => {
    //     this.setState({
    //        atd_status : event
    //     })
    // }
     // handleSelectedAttendanceType = async (event) => {
    //     this.setState({
    //        atd_type : event
    //     })
    // }
     // handleSelectedEmpName = async (event) => {
    //     this.setState({
    //        empName : event
    //     })
    // }
     // handleSelectedStatus = async (event) => {
    //     this.setState({
    //        status : event
    //     })
    // }
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
    handleSearchData=()=>{
    console.log(">>>>>",this.state.branchId,this.state.departmentId,this.state.regionId,this.state.designationId)
    }
    // handleSearchData = (branchId, departmentId, regionId,empName, designationId) => {
    //     fetch(`${main_url}.../${regionId == undefined ? 0 : regionId}/${departmentId == undefined ? 0 : departmentId}/${designationId == undefined ? 0 : designationId}/${branchId == undefined ? 0 : branchId}/${empName == undefined ? 0 : empName}`)
    //       .then(res => { if (res.ok) return res.json() })
    //       .then(list => {
    //         this._setTableData(list);
    //       })
    //   }

    _setTableData = (data) => {
        var table;
        var l = [];
        // for (var i = 0; i < data.length; i++) {
        //     let result = data[i];
        //     let obj = [];
        //         obj = {
        //         no: i + 1,
        //         date:date
        //         employee_id: employment_id,
        //         employee_name: employee_name,
        //         position:position,
        //         branch: branch_name, 
        //         checkin:checkin,
        //         check_out:check_out,
        //         working_hour:working_hour,
        //         atd_type:atd_type,
        //         atd_reason:atd_reason,
        //         atd_status:atd:status,
        //         status:status,
        //     }    
        //     l.push(obj)

        // }
        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty();
        }
        var column = [
            { title: " Sr No", data: "no" },
            { title: " Date", data: "date" },
            { title: "Employee Id", data: "employee_id" },
            { title: "Employee Name", data: "employee_name" },
            { title: "Position", data: "position" },
            { title: "Branch", data: "branch" },
            { title: " Check In", data: "checkin" },
            { title: "Check Out", data: "check_out" },
            { title: "Working Hour", data: "working_hour" },
            { title: "Attendance Type", data: "atd_type" },
            { title: "Attendance Status", data: "atd_status" },
            { title: "Attendance Reason", data: "atd_reason" },
            { title: "Status", data: "status" },
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
           
              <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
              <DatePicker
                  dateFormat="DD/MM/YYYY"
                  value={this.state.from_date}
                  onChange={this.handleSelectedFromdate}
                  timeFormat={false}
                />
              <DatePicker
                 dateFormat="DD/MM/YYYY"
                 value={this.state.to_date}
                 onChange={this.handleSelectedTodate}
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
              placeholder="Employee Name"
              options={this.state.empNameList}
              onChange={this.handleSelectedEmpName}
              value={this.state.empName}
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
              placeholder="Attendance Type"
              options={this.state.atdTypeList}
              onChange={this.handleSelectedAttendanceType}
              value={this.state.atd_type}
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
              placeholder="Attendance Reason"
              options={this.state.atdReasonList}
              onChange={this.handleSelectedAttendanceReason}
              value={this.state.atd_reason}
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
              placeholder="Attendance Status"
              options={this.state.atdStatusList}
              onChange={this.handleSelectedAttendanceStatus}
              value={this.state.atd_status}
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
              placeholder="Status"
              options={this.state.statusList}
              onChange={this.handleSelectedStatus}
              value={this.state.status}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
            </div>
           </div>
            <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                    id="dataTables-table"
                />
           </div>
        )
    }
}
    export default AttendanceReport;