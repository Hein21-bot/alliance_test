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


class ReportbyServiceYear extends Component {
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
            date:moment().format("YYYY-MM-DD"),
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
            this._setTableData(this.state.dataSource);
          }
        );
    

        let branch = await getBranch();
        branch.unshift({ label: 'All', value: 0 });
        let designation  = await getDesignation();
        designation.unshift({label: 'ALL', value: 0});
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
            designation:designation,
            region: region.map(v => ({ ...v, label: v.region_name, value: v.region_id })),
            // empNameList:empNameList
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

    _setTableData = (data) => { 
      
        var table;
        var l = [];
        if(data){
          for (var i = 0; i < data.length; i++) {
            let result = data[i];
            let obj = [];
                obj = {
                no: i + 1,
                employee_id:data[i].employment_id ? data[i].employment_id: "-",
                employee_name:data[i].fullname ? data[i].fullname:"-",
                branch:data[i].branch_name? data[i].branch_name: "-", 
                designation:data[i].designations ? data[i].designations:"-",
                join_date:data[i].joining_date ? data[i].joining_date : "-",
                service_year:data[i].service_year[0] ? data[i].service_year[0] : "-",     
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
         
        return (
            <div>
            <div className="row  white-bg dashboard-header">
             <h3 className="" style={{paddingLeft:10}}>Employee Report by Service Year</h3>
              <div className='flex-row' style={{ display: 'flex', justifyContent: 'start', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
              <div style={{width:150,marginRight:10}}>
              <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.date}
                            onChange={this.handleSelectedDate}
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
                  width: 150,
                  marginRight:10
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
           <input type="value"  placeholder="Name" className="form-control input-md" style={{width:150,marginRight:10}} value={this.state.name} />
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
              options={this.state.designation}
              onChange={this.handleSelectedDesignation}
              value={this.state.designationId}
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
              placeholder="Branch"
              options={this.state.branch}
              onChange={this.handleSelectedBranch}
              value={this.state.branchId}
              className='react-select-container'
              classNamePrefix="react-select"
            />
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
    export default ReportbyServiceYear;