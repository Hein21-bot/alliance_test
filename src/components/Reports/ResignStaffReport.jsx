import React,{Component} from "react";
import Select from 'react-select' ;
import {main_url} from '../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import { region } from "caniuse-lite";
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
           regionList:null,
           selected_region:null,
           EmployeeNameList:null,
           selected_employee:null,
           branchlist:null,
           selected_branch:null,
           designationList:null,
           selected_designation:null,
           exitStatusList:[
            {label:"All",value:-1},
            {
              label:"Active",value:0
            },
            {
              label:"Exit",value:1
            }
           ]                         
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
          this.getEmployeeName();
          this.getBranchList();
          this.getDesignationList();
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
    getDesignationList() {
      fetch(`${main_url}main/getDesignations`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((list) => {
          let lists = list.unshift({ value: 0, label: "All" });
          this.setState({
            designationList: list
          });
        });
    }
    handleSelectedBranch = async (event) => {
        this.setState({
           selected_branch : event
        })
    }
    
    handleSelectedDesignation = async (event) => {
        this.setState({
           selected_designation : event
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
    handleSelectedExitStatus = async (event) => {
        this.setState({
           selected_exitstatus : event
        })
    }
   
    handleSearchData = () => {
      const branchId = this.state.selected_Branch ? this.state.selected_Branch.branch_id : 0
      
      const designationId=this.state.selected_designation ? this.state.selected_designation.value : 0
      const regionId = this.state.selected_region ? this.state.selected_region.region_id : 0
      const employee = this.state.selected_employee ? this.state.selected_employee.value : 0
      const exitStatusId= this.state.selected_exitstatus ? this.state.selected_exitstatus.value : -1
        fetch(main_url+"report/employeeResign/"+regionId+"/"+branchId+"/"+designationId+"/"+employee+"/"+exitStatusId)
          .then(res => { if (res.ok) return res.json() })
          .then(list => {
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
                employee_id: data[i].employment_id ? data[i].employment_id : '-',
                employee_name: data[i].fullname ? data[i].fullname : '-',
                designation:data[i].designations ? data[i].designations : '-',
                level:data[i].career_level_id ? data[i].career_level_id : '-',
                employee_date:data[i].employ_date ? data[i].employ_date : '-',
                
                last_date: data[i].discontinued_date ? data[i].discontinued_date : '-',
                exit_status: data[i].exit_status ? data[i].exit_status : '-',
                resign_reason: data[i].resign_reason ? data[i].resign_reason : '-'

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
           <h3 className="" style={{paddingLeft:"10px"}}>Resign Staff Report</h3>
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
              placeholder="Designation"
              options={this.state.designationList}
              onChange={this.handleSelectedDesignation}
              value={this.state.selected_designation}
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
              placeholder="Employee Name"
              options={this.state.EmployeeNameList}
              onChange={this.handleSelectedEmpName}
              value={this.state.selected_employee}
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
              placeholder="Exit Status"
              options={this.state.exitStatusList}
              onChange={this.handleSelectedExitStatus}
              value={this.state.selected_exitstatus}
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
    export default ResignStaffReport;