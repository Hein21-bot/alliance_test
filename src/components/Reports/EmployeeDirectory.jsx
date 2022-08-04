import React,{Component} from "react";
import {getBranch,getDepartment,getRegion,getDesignation,main_url} from '../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import Select from "react-select";
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


class EmployeeDirectory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            branch:[],
            region:[],
            empNameList:[],
            department:[],
            phoneNoList:[],
            branchId:0,
            regionId:0,
            departmentId:0,
            designationId:0,
            empName:0,  
            phone_no:0,
            employee_id:0,
            emp_email:0,
            emp_address:0
                   
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
        // await getEmployeeList;
        // await getPhoneNoList;
        this.setState({
            branch: branch,
            department: department,
            // phoneNoList:phoneNoList,
            region: region.map(v => ({ ...v, label: v.region_name, value: v.region_id })),
            // empNameList:empNameList
        })
    }
    handleSelectedBranch = async (event) => {
        this.setState({
           branchId : event
        })
    }
    handleSelectedDesignation = async (event) => {
        this.setState({
           designationId : event
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
     // handleSelectedPhoneNo = async (event) => {
    //     this.setState({
    //        phone_no : event
    //     })
    // }
    // handleSelectedEmpName = async (event) => {
    //     this.setState({
    //        empName : event
    //     })
    // }
    // handleSearchData=()=>{
    // console.log(">>>>>",this.state.branchId,this.state.departmentId,this.state.regionId,this.state.designationId)
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
        //         photo:
        //         emp_address
        //         emp_phone
        //         region:
        //         employee_id: employment_id,
        //         employee_name: fullname,
        //         branch: branch_name, 
        //         designation:designation,
        //         department:,
        //         emp_email:,     
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
            { title: "  No", data: "no" },
            { title: "  Photo", data: "photo" },
            { title: "Employee Id", data: "employee_id" },
            { title: "Employee Name", data: "employee_name" },
            { title: "Department", data: "deparment" },
            { title: "Designation", data: "designation" },
            { title: "Branch", data: "branch" },
            { title: "Region", data: "region" },
            { title: "Phone No", data: "phone_no" },
            { title: "Address", data: "emp_address" },
            { title: "Email", data: "emp_email" },
            
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
              placeholder="Phone No"
              options={this.state.phoneNoList}
              onChange={this.handleSelectedPhoneNo}
              value={this.state.phone_no}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData(this.state.regionId.value, this.state.departmentId.value, this.state.regionId.value,  this.state.designationId.value, this.state.branchId.value, this.state.empName.value,)}>Search</button>
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
    export default EmployeeDirectory;