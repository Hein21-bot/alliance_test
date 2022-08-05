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


class ReportByServiceYear extends Component {
    constructor(props) {
        super(props);
        this.state = {
            branch:[],
            region:[],
            empNameList:[],
            department:[],
            dateRange:[],
            empIdList:[],
            designation:[],
            branchId:0,
            regionId:0,
            departmentId:0,
            designationId:0,
            empName:0,              
            phone_no:null,
            employee_id:null,
            join_date:null,
            service_year:null,
            date:moment()
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
        let designation  = await getDesignation();
        designation.unshift({label: 'ALL', value: 0});
        let region = await getRegion();
        region.unshift({region_name: 'ALL', region_id: 0});
        // await getEmployeeList;
        // await getEmpIdList;
        // await getDate;
        let department = await getDepartment();
        department.unshift({label:'ALL', value: 0});
        this.setState({
            branch: branch,
            department: department,
            designation:designation,
            region: region.map(v => ({ ...v, label: v.region_name, value: v.region_id })),
            // empNameList:empNameList
        })
    }
    handleSelectedBranch = async (event) => {
        this.setState({
           branchId : event
        })
    }
    handleSelectedDate = async (event) => {
        this.setState({
           date : event
        })
    }
    handleSelectedDesignation = async (event) => {
        this.setState({
           designationId : event
        })
    }
    handleSelectedEmpId = async (event) => {
        this.setState({
           employee_id : event
        })
    }
    handleSelectedRegion = async (event) => {
        this.setState({
           regionId : event
        })
    }
    // handleSearchData=()=>{
    //   console.log(">>>>>",this.state.branchId,this.state.departmentId,this.state.regionId,this.state.designationId)
    //   }
    // handleSelectedEmpName = async (event) => {
    //     this.setState({
    //        empName : event
    //     })
    // }
   
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
        //         employee_id: employment_id,
        //         employee_name: fullname,
        //         branch: branch_name, 
        //         designation:designation,
        //         join_date:join_date,
        //         service_year :service_year,     
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
            { title: "Employee Id", data: "employee_id" },
            { title: "Employee Name", data: "employee_name" },
            { title: "Designation", data: "designation" },
            { title: "Branch", data: "branch" },
            { title: "Join Date", data: "join_date" },
            { title: "Service Year", data: "service_year" },
            
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
            console.log("selector",this.state.branchId)
        return (
            <div>
            <div className="row  white-bg dashboard-header">
           
              <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
              <h3>Employee Report by Service Year</h3>
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
              options={this.state.empIdList}
              onChange={this.handleSelectedDepartment}
              value={this.state.employee_id}
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
              placeholder="Designation"
              options={this.state.designation}
              onChange={this.handleSelectedDesignation}
              value={this.state.designationId}
              className='react-select-container'
              classNamePrefix="react-select"
            />
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
              placeholder="Employee Name"
              options={this.state.empNameList}
              onChange={this.handleSelectedEmpName}
              value={this.state.empName}
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
    export default ReportByServiceYear;