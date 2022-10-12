import React,{Component} from "react";
import {getBranch,getRegion,getDepartment,main_url,getFirstDayOfMonth} from '../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import moment from "moment";
import Rodal from 'rodal';
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


class ImcompleteAndMissingReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            branch:[],
            region:[],
            department:[],
            branchId:null,
            regionId:null,
            departmentId:null,
            from_date:moment(getFirstDayOfMonth()),
            to_date:moment(),
            EmployeeNameList:[],
            selectedEmployeeName:null,
            selected_checkbox:1,
            incomplete:0,
            missingAttendance:0,
            AttendanceType:null,
            selectedAttendance:null,
            visibleApprove: false,
            optionList:[
              {
                label:'Attendance',
                value:1
              },{
                label:'Late',
                value:2
              },{
                label:'Absence',
                value:3
              }
            ],
            selectedOption:null
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
        this.getEmployeeName();
        this.getAttendanceType();
        this.handleSearchData();
        let that = this
        $("#dataTables-table").on('click', '#toEditApprove', function () {

          var data = $(this).find("#editApprove").text();
          data = $.parseJSON(data);
          that.handleVisibleApprove(data)

      });
    }
    goToEditForm(){

    }
    getEmployeeName() {
      fetch(`${main_url}report/employeeName`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((list) => {
          let lists = list.unshift({ value: 0, label: "All" });
          this.setState({
            EmployeeNameList: list.map((v) => ({
              ...v
            }))
          })
        })
    }
    getAttendanceType(){
      fetch(`${main_url}attendance/attendanceStatus`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((list) => {
          let lists = list.unshift({ value: 0, label: "All" });
          this.setState({
            AttendanceType: list.map((v) => ({
              ...v
            }))
          })
        })
    }
    handleSelectedBranch = async (event) => {
        this.setState({
           branchId : event
          })
    }
    handleSelectedEmployeeName=async(event)=>{
      this.setState({
        selectedEmployeeName:event
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
    handleSelectedAttendance=async(event)=>{
      console.log("attendance event",event)
      this.setState({
          selectedAttendance:event
      })
    }
    handleSelectedOption=async(event)=>{
      this.setState({
        selectedOption:event
      })
    }
    handleCheckbox=async (event)=>{
      let incomplete=event.target.value ==1 ? 1 : 0
      let missingAttendance=event.target.value == 2 ? 2 : 0
     
      this.setState({
          selected_checkbox:event.target.value
      })
  }
 
  
    handleSearchData = () => {
      
        fetch(`${main_url}attendance/incompleteAttReport/${this.state.branchId ? this.state.branchId.value : 0}/${this.state.departmentId ? this.state.departmentId.value : 0}/${this.state.regionId ? this.state.regionId.value : 0}/${this.state.selectedAttendance ? this.state.selectedAttendance.value : 0}/${this.state.selectedEmployeeName ? this.state.selectedEmployeeName.value : 0}/${this.state.selected_checkbox ? this.state.selected_checkbox : 0}/${moment(this.state.from_date).format("YYYY-MM-DD")}/${moment(this.state.to_date).format("YYYY-MM-DD")}`)
          .then(res => { if (res.ok) return res.json() })
          .then(list => { 
            this._setTableData(list);
          })
        // fetch(`${main_url}attendance/incompleteAttReport`)
        //   .then(res => { if (res.ok) return res.json() })
        //   .then(list => { 
        //     this._setTableData(list);
        //   })
      }

      handleVisibleApprove = (data) => {
        console.log(data)
        this.setState({ visibleApprove: true, approve_data: data })
    }

    hideApprove() {
      console.log('here ===>')
      this.setState({ visibleApprove: false });
  }

  approveSave() {
    let status = 0;
    
    fetch(`${main_url}attendance/editIncomAtt/` + this.state.approve_data.id, {
        method: "POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `data=${JSON.stringify(this.state.approve_data)}`,

    })
        .then(res => {
            status = res.status;
            return res.text()
        })
        .then(text => {
            this.showToast(status, text);
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
                date:data[i].date ? data[i].date :"-",
                employee_id:data[i].employee_id ? data[i].employee_id : "-",
                employee_name:data[i].employee_name ? data[i].employee_name : "-",
                designation:data[i].designations ? data[i].designations : "-",
                branch: data[i].location_master_name ? data[i].location_master_name: "-",
                level:data[i].career_level ? data[i].career_level : "-",
                department:data[i].deptname ? data[i].deptname : "-",
                region:data[i].region_name ? data[i].region_name : '-',
                pa_score:data[i].performance_score ? data[i].performance_score : '-',
                target_achievement:data[i].target_achievement ? data[i].target_achievement : '-',
                overall_performance:data[i].comment_overall_performance ? data[i].comment_overall_performance : '-',
                extension_period:data[i].extension_period ? data[i].extension_period : '-',
                
            }
            obj.action = '<button style="margin-right:10px; background-color:#27568a" class="btn btn-primary btn-sm own-btn-edit" id="toEditApprove" ><span id="editApprove" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>';
            
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
            {title :"Date",data:'date'},
            { title: "Employee Id", data: "employee_id" },
            { title: "Employee Name", data: "employee_name" },
            { title: "Position", data: "designation" },
            { title: "Branch", data: "branch" },
            { title: "Check In", data: "department" },
            { title: "Check Out", data: "checkout" },
            { title: "Attendance Type", data: "region" },
            { title: "Option", data: "pa_score" },
            { title: "Action", data: "action" },
           
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
           <h3 className="" style={{paddingLeft:"10px"}}>Incomplete Attendance and Missing Attendance Report</h3>
              <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
              <div style={{marginRight:10,width:300}}>
              <label htmlFor="">Start Date</label>
              <DatePicker
                  dateFormat="DD/MM/YYYY"
                  value={this.state.from_date}
                  onChange={this.handleSelectedFromdate}
                  timeFormat={false}
                />
              </div>
              <div style={{marginRight:10,width:300}}>
                <label htmlFor="">End Date</label>
              <DatePicker
                 dateFormat="DD/MM/YYYY"
                 value={this.state.to_date}
                 onChange={this.handleSelectedTodate}
                 timeFormat={false}
                />
              </div>
              <div tyle={{
                textAlign: 'start',
                marginLeft: 10
              }}>
              <label htmlFor="">Branch</label>
              <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 300,
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
              </div>
              <div style={{textAlign:'start'}}>
                <label htmlFor="">Region</label>
              <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 300,
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
              </div>
           
            <div style={{textAlign:'start'}}>
              <label htmlFor="">Department</label>
            <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 300
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
            </div>
            
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 35, padding: '0px 5px 0px 5px',marginTop:20 }} onClick={() => this.handleSearchData()}>Search</button>
            </div>
            <div className="flex-row" style={{display:'flex',justifyContent:'left',alignItems:'center',margin:'10px 10px 10px 10px'}}>
           <div>
            <label htmlFor="">Employee Name</label>
           <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 300,
                  marginRight:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Employee Name"
              options={this.state.EmployeeNameList}
              onChange={this.handleSelectedEmployeeName}
              value={this.state.selectedEmployeeName}
              className='react-select-container'
              classNamePrefix="react-select"
            />
           </div>
             <div>
              <label htmlFor="">Attendance Type</label>
             <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  width: 300,
                  marginRight:10

                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Attendance Type"
              options={this.state.AttendanceType}
              onChange={this.handleSelectedAttendance}
              value={this.state.selectedAttendance}
              className='react-select-container'
              classNamePrefix="react-select"
            />
             </div>
            <div>
              <label htmlFor="">Status</label>
              <div style={{display:'flex',justifyContent:'start',alignItems:'end',marginLeft:10}}>
                            <div style={{marginRight:50, height: 20}}>
                            
                            <input type="checkbox" id='region'  name='region' checked={this.state.selected_checkbox == 1 ? 'checked': ''} value='1' onChange={this.handleCheckbox}/>
                            <label for="region" style={{marginLeft: 5, marginBottom: 5}}> Incomplete</label>
                            </div>
                            <div style={{marginRight:50, height: 20}}>
                                
                                <input type="checkbox" id='branch'  name='branch' checked={this.state.selected_checkbox == 2 ? 'checked': ''} value='2' onChange={this.handleCheckbox}/>
                                <label for='branch' style={{marginLeft: 5, marginBottom: 5}}> Missing Attendance</label>
                            </div>
                            
                    </div>
            </div>
            </div>
           
            <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                    id="dataTables-table"
                />
                <Rodal width={500} height={350} visible={this.state.visibleApprove} onClose={this.hideApprove.bind(this)} >
                        <div>
                            <h3>Approve</h3>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4">Employee Name :</div>
                            <div className="col-md-8">
                                {this.state.approve_data ? this.state.approve_data.fullname : '-'}
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4">Designations :</div>
                            <div className="col-md-8">
                                {this.state.approve_data ? this.state.approve_data.designations : '-'}
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4">Branch :</div>
                            <div className="col-md-8">
                                {this.state.approve_data ? this.state.approve_data.location_master_name : '-'}
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4">Check In Time :</div>
                            <div className="col-md-8">
                                {this.state.approve_data ? moment(this.state.approve_data.check_in_time).utc().format('hh:mm A') : '-'}
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4">Check Out Time :</div>
                            <div className="col-md-8">
                                {this.state.approve_data ? moment(this.state.approve_data.check_out_time).utc().format('hh:mm A') : '-'}
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4">Attendance Type :</div>
                            <div className="col-md-8">
                                {this.state.approve_data ? this.state.approve_data.attendanceType : '-'}
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4"> Option :</div>
                            <div className="col-md-8">
                            <Select
                                styles={{
                                  container: base => ({
                                    ...base,
                                    //   flex: 1
                                    width: 300,
                                    marginRight:10
                                  }),
                                  control: base => ({
                                    ...base,
                                    minHeight: '18px'
                                  }),

                                }}
                                placeholder="Option"
                                options={this.state.optionList}
                                onChange={this.handleSelectedOption}
                                value={this.state.selectedOption}
                                className='react-select-container'
                                classNamePrefix="react-select"
                              />
                            </div>
                        </div>
                       
                        <div className="col-md-12" style={{ display: 'flex', justifyContent: 'right', marginTop: 20 }}>
                            <div className="col-md-2 btn-rightend" >
                                <button className="btn btn-primary" onClick={() => this.approveSave()}><span>Approve</span> </button>
                            </div>
                            <div className="col-md-2 btn-rightend" >
                                <button className="btn btn-danger" onClick={() => this.hideApprove()}><span>Cancel</span> </button>
                            </div>
                        </div>

                    </Rodal>
           </div>
           </div>
        )
    }
}
    export default ImcompleteAndMissingReport;