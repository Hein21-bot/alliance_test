import React,{Component} from "react";
import Select from 'react-select' ;
import {getBranch,getRegion,getDesignation,main_url} from '../../utils/CommonFunction';
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


class ResignStaffReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            branch:[],
            region:[],
            empNameList:[],
            designation:[],
            exitStatus:[],
            exit_status:0,
            branchId:0,
            regionId:0,
            designationId:0,
            empName:0,                          
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
        let designation = await getDesignation();
        designation.unshift({ label: 'All', value: 0 });
        let region = await getRegion();
        region.unshift({region_name: 'ALL', region_id: 0});
        // await getEmployeeList;
        // await getExitStatus;
        this.setState({
            branch: branch,
            designation: designation,
            region: region.map(v => ({ ...v, label: v.region_name, value: v.region_id })),
            // empNameList:empNameList,
            // exitStatus: exitStatus
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
    handleSelectedRegion = async (event) => {
        this.setState({
           regionId : event
        })
    }
     
    // handleSelectedEmpName = async (event) => {
    //     this.setState({
    //        empName : event
    //     })
    // }
    // handleSelectedExitStatus = async (event) => {
    //     this.setState({
    //        exit_status : event
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
        //         employee_name: employee_name,
        //         branch: branch_name, 
        //         designation:designation,
        //         asset_name:asset_name,
        //         asset_id:asset_id,
        //         specification: specification
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
            { title: "Employee Id", data: "employee_id" },
            { title: "Employee Name", data: "employee_name" },
            { title: "Designation", data: "designation" },
            { title: "Level", data: "level" },
            { title: "Employed Date", data: "employee_date" },
            { title: "Last Working Date", data: "last_date" },
            { title: "Exit Status", data: "exit_status" },
            { title: "Resign Reason", data: "resign_reason" },
            
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
              placeholder="Exit Status"
              options={this.state.exitStatus}
              onChange={this.handleSelectedExitStatus}
              value={this.state.exit_status}
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
              placeholder="Designation"
              options={this.state.designation}
              onChange={this.handleSelectedDesignation}
              value={this.state.designationId}
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
    export default ResignStaffReport;