import React,{Component} from "react";
import {getBranch,getRegion,getDepartment,main_url,getFirstDayOfMonth} from '../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
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


class LateReportByEmployee extends Component {
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
            loading: false,
            dataSource:[]
        }
    }
    
    async componentDidMount () {
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
        this.getEmployeeName();
        
       await this.handleSearchData();
       await this.setState({},()=>{
        this._setTableData(this.state.dataSource)
       });
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
    handleSearchData = () => {
      //   this.setState({
      //   loading:true,
      //   dataSource:[]
      // })
        fetch(`${main_url}attendance/lateReportEmp/${moment(this.state.from_date).format("YYYY-MM-DD")}/${moment(this.state.to_date).format("YYYY-MM-DD")}/${this.state.branchId ? this.state.branchId.value : 0}/${this.state.regionId ? this.state.regionId.value : 0}/${this.state.departmentId ? this.state.departmentId.value : 0}/${
          this.state.selectedEmployeeName ? this.state.selectedEmployeeName.value : 0
        }`)
          .then(res => { if (res.ok) return res.json() })
          .then(list => { 
            this.setState({
             loading:false,
             dataSource:list
            },
             () => {
             this._setTableData(this.state.dataSource);
             } )
            
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
                branch: data[i].location_master_name ? data[i].location_master_name : "-",
                designation:data[i].designations ? data[i].designations : "-",
                region:data[i].state_name ? data[i].state_name : '-',
                late:data[i].late_count[0].late_count ? data[i].late_count[0].late_count : '-',
                early:data[i].late_count[0].early_count ? data[i].late_count[0].early_count : '-',
                incom:data[i].late_count[0].incom_count ? data[i].late_count[0].incom_count : '-',
                miss:data[i].late_count[0].missing_count ? data[i].late_count[0].missing_count : '-',
                leave:data[i].late_count[0].leave_count ? data[i].late_count[0].leave_count: '-',
                working_days:data[i].late_count[0].working_day_count ? data[i].late_count[0].working_day_count: '-',
                abscence:data[i].late_count[0].absent_count ? data[i].late_count[0].absent_count : '-',
                total:data[i].late_count[0] ? Object.values(data[i].late_count[0]).reduce((a,c)=>{return a+c},0) : '-',
                
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
            { title: "Branch", data: "branch" },
             {title: "Region",data:'region'},
            { title: "Late Check In", data: "late" },
            { title: "Early Check Out", data: "early" },
            { title: "Incomplete", data: "incom" },
            { title: "Missing Attendance", data: "miss" },
            { title: "Leave", data: "leave" },
            { title: "Total Working Days", data: "working_days" },
            { title: "Absence", data: "abscence" },
            { title: "Total", data: "total" },
           
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
        //     //     'copy', 'csv', 'excel', 'pdf'
                   ],
            buttons: [
        //         // 'copy',
        //         // {
        //         //         extend: 'csvHtml5',
        //         //         title: 'Child Benefit',
        //         // },
                      {
                          extend: 'excelHtml5',
                          title: 'Late Report By Employee',
                      },
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
              <ToastContainer/>
            <div className="row  white-bg dashboard-header">
           <h3 className="" style={{paddingLeft:"10px"}}>Late Report By Employee</h3>
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
              placeholder="Employee Name"
              options={this.state.EmployeeNameList}
              onChange={this.handleSelectedEmployeeName}
              value={this.state.selectedEmployeeName}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
            </div>
           { this.state.loading ? (
            <div
            className="col-lg-12"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <h1>Loading...</h1>
            {/* <span className="loader"></span> */}
          </div>):(
          <>  <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                    id="dataTables-table"
                /></>
                 )
                } 
           </div>
           </div>
        )
    }
}
    export default LateReportByEmployee;