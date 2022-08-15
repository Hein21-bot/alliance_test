import React,{Component} from "react";
import {main_url} from '../../utils/CommonFunction';
import Select from 'react-select' ;
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


class EmployeeFixedAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            regionList:[],
            branchlist:[],
            empNameList:[],
            departmentlist:[]

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
        this.getRegionList();
        this.getBranchList();
        this.getEmployeeName();
        this.getDepartmentList();
    }
    getRegionList() {
      fetch(`${main_url}benefit/getRegionList`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((list) => {
          let lists = list.unshift({ region_id: 0, region_name: "All" });
          this.setState({
            regionList: list.map((v) => ({
              ...v,
              label: v.region_name,
              value: v.region_id,
            })),
          });
        });
    }
    getBranchList() {
      fetch(`${main_url}benefit/getBranchList`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((list) => {
          let lists = list.unshift({ branch_id: 0, branch_name: "All" });
          this.setState({
            branchlist: list.map((v) => ({
              ...v,
              label: v.branch_name,
              value: v.branch_id,
            })),
          });
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
    getDepartmentList() {
      fetch(`${main_url}benefit/getDepartmentList`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((list) => {
          let lists = list.unshift({ departments_id: 0, deptname: "All" });
          this.setState({
            departmentlist: list.map((v) => ({
              ...v,
              label: v.deptname,
              value: v.departments_id,
            })),
          });
        });
    }
  
    handleSelectedBranch = async (event) => {
        this.setState({
           selected_branch : event
        })
    }
    
    handleSelectedDepartment = async (event) => {
        this.setState({
           selected_department : event
        })
    }
    handleSelectedRegion = async (event) => {
        this.setState({
           selected_region : event
        })
    }
     
    handleSelectedEmpName = async (event) => {
        this.setState({
           selected_employee : event
        })
    }
   
    handleSearchData = () => {
      const branchId = this.state.selected_Branch ? this.state.selected_Branch.branch_id : 0
      
      const departmentId=this.state.selected_department ? this.state.selected_department.departments_id : 0
      const regionId = this.state.selected_region ? this.state.selected_region.region_id : 0
      const employee = this.state.selected_employee ? this.state.selected_employee.value : 0
        fetch(main_url)
          .then(res => { if (res.ok) return res.json() })
          .then(list => {
            this._setTableData(list);
          })
      }

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
            { title: "Branch", data: "branch" },
            { title: "Fixed Asset ID", data: "asset_id" },
            { title: "Asset Name", data: "asset_name" },
            { title: "Specification", data: "specification" },
            
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
                  width: 150,
                  marginRight:10
                }),
                control: base => ({
                  ...base,
                  minHeight: '18px'
                }),

              }}
              placeholder="Region"
              options={this.state.regionList}
              onChange={this.handleSelectedRegion}
              value={this.state.selected_region}
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
              placeholder="Department"
              options={this.state.departmentlist}
              onChange={this.handleSelectedDepartment}
              value={this.state.selected_department}
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
              placeholder="Branch"
              options={this.state.branchlist}
              onChange={this.handleSelectedBranch}
              value={this.state.selected_branch}
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
              options={this.state.EmployeeNameList}
              onChange={this.handleSelectedEmpName}
              value={this.state.selected_employee}
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
    export default EmployeeFixedAsset;