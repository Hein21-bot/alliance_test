import React, { Component } from "react";
import { main_url } from '../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import Select from 'react-select';
import moment from "moment";
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');
class HrStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {



      regionList: null,


      empName: 0,
      martial_status: null,
      contact_person: null,
      contact_phone: null,
      guarantee_contact_person: null,
      guarantee_contact_phone: null,
      phone_no: null,
      employee_id: null,
      employee_date: moment().format("YYYY-MM-DD"),
      selected_Branch: null,
      selected_department: null,
      selected_designation: null,
      selected_region: null,
      designationList: null,
      branchlist: null,
      departmentlist: null,
      branchId: null,
      designationId: null,
      departmentId: null,
      regionId: null,
      EmployeeNameList: null,
      selected_employee: null,
      titleYear:[],
      dataSource:[]
    }
  }

  async componentDidMount() {
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
    this.getDepartmentList();
    this.getBranchList();
    this.getDesignationList();
    this.getEmployeeName();
    this.handleSearchData();

    
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
  getBranchList() {
    fetch(`${main_url}benefit/getBranchList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          branchlist: list.map((v) => ({
            ...v,
            
          })),
        });
      });
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

  getRegionList() {
    fetch(`${main_url}benefit/getRegionList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ state_id: 0, state_name: "All" });
        this.setState({
          regionList: list.map((v) => ({
            ...v,
            label: v.state_name,
            value: v.state_id,
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
  handleSelectedBranch = async (event) => {
    if (event != null)
      this.setState({
        selected_Branch: event
      })
  };
  handleSelectedDesignation = async (event) => {
    if (event != null)
      this.setState({
        selected_designation: event
      })
  }
  handleSelectedDepartment = async (event) => {
    if (event != null)
      this.setState({
        selected_department: event
      })
  }
  handleSelectedRegion = async (event) => {
    if (event != null)
      this.setState({
        selected_region: event
      })
  };
  handleSelectedEmpName = async (event) => {
    if (event != null)
      this.setState(
        {
          selected_employee: event
        }
      )
  }




  _setTableData = (data) => {
    var table;
    var l = [];
    if (data) {
      for (var i = 0; i < data.length; i++) {
        let result = data[i];
        let obj = [];
        obj = {
          no: i + 1,
          branch_count:data[i].BranchCount,
          ho_count:data[i].HOCount,
          year:data[i].year
          // employee_id: data[i].employment_id ? data[i].employment_id : '-',
          // employee_name: data[i].fullname ?data[i].fullname : "-",
          // branch: data[i].branch_name ? data[i].branch_name : "-",
          // phone_no: data[i].phone ? data[i].phone : "-",
          // designation: data[i].designations ? data[i].designations : "-",
          // employee_date:data[i].employ_date == null ? "-": moment(data[i].employ_date).format("YYYY-MM-DD"),
          // region: data[i].region_name ? data[i].region_name : "-",
          // martial_status: data[i].martial_status ? data[i].martial_status : '-',
          // contact_person: data[i].contact_person ? data[i].contact_person : '-',
          // contact_phone: data[i].contact_person_phone ? data[i].contact_person_phone : "-",
          // guarantee_contact_person: data[i].guarantee_person ? data[i].guarantee_person : '-',
          // guarantee_contact_phone: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
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
        {title:"Year",data:"year"},
        { title: "Branch Count", data: "branch_count" },
        { title: "Ho Count", data: "ho_count" },
        // { title: "Employee Id", data: "employee_id" },
        // { title: "Employee Name", data: "employee_name" },
        // { title: "Designation", data: "designation" },
        // { title: "Employee Date", data: "employee_date" },
        // { title: "Region", data: "region" },
        // { title: "Branch", data: "branch" },
        // { title: "Phone No", data: "phone_no" },
        // { title: "Martial Status", data: "martial_status" },
        // { title: "Contact Person", data: "contact_person" },
        // { title: "Contact Phone", data: "contact_phone" },
        // { title: "Guarantee Contact Person", data: "guarantee_contact_person" },
        // { title: "Guarantee Contact Phone", data: "guarantee_contact_phone" },
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
         ],
        buttons: [
          
          {
              extend: 'excelHtml5',
              title: 'HR Statistics Report',
          },
         
        ],
        data: l,
        columns: column
      });
    
  }
  handleSearchData = () => {
    
    const branchId = this.state.selected_Branch ? this.state.selected_Branch.value : 0
    const departmentId = this.state.selected_department ? this.state.selected_department.departments_id : 0
    const designationId = this.state.selected_designation ? this.state.selected_designation.value : 0
    const regionId = this.state.selected_region ? this.state.selected_region.state_id : 0
    const employee = this.state.selected_employee ? this.state.selected_employee.value : 0
   

    // fetch(main_url + "report/HRStatisticReport/" + regionId + "/" + departmentId + "/" + branchId + "/" + designationId + "/" + employee)
    fetch(main_url + "report/HRStatisticReport/2020")

      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        console.log("api list",list)
       let Year=list.length > 0 && list[0]
       console.log("year only",Year.slice(0,-1))
       this.setState({
        titleYear:Year.slice(0,-1),
        dataSource:list
       })
        // let temp=[]
        // let mapList=list.map(v=>v.map(a=>temp.push(a)))
        // console.log("temp data",temp)
        // const combinedData = temp.reduce((acc, obj) => {
        //   const year = obj.year;
          
        //   acc[year] = acc[year] || {};
        //   Object.assign(acc[year], obj);
         
        //   return acc;
        // }, {});
        // const sortedData = Object.values(combinedData).sort((a, b) => {
        //   if (a.year < b.year) {
        //     return -1;
        //   }
        //   if (a.year > b.year) {
        //     return 1;
        //   }
        //   return 0;
        // });
        // console.log("combined data",sortedData)
      })
  }
  render() {
    const data1 = [
      {"HOCount": 102, "year": "2020-1" },
      {"HOCount": 106, "year": "2020-2"},
    ];
    
    const data2 = [
      {"BranchCount": 1320, "year": "2020-1" },
      {"BranchCount": 1373, "year": "2020-2"},
    ];
    
    // Combine the objects from the two arrays based on the "year" property
    const combinedData = [...data1, ...data2].reduce((acc, obj) => {
      const year = obj.year;
      
      acc[year] = acc[year] || {};
      Object.assign(acc[year], obj);
      // console.log("acc year",acc,Object.assign(acc[year],obj))
      return acc;
    }, {});
    
    // Sort the resulting array based on the "year" property
    const sortedData = Object.values(combinedData).sort((a, b) => {
      if (a.year < b.year) {
        return -1;
      }
      if (a.year > b.year) {
        return 1;
      }
      return 0;
    });
    this._setTableData(sortedData)
    
    console.log("sorted data",sortedData);
    
    return (
      <div>
        <div className="row  white-bg dashboard-header">
        <h3 className="" style={{paddingLeft:"10px"}}>HR Statistic Report</h3>
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
              value={this.state.selected_Branch}
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
              placeholder="Department"
              options={this.state.departmentlist}
              onChange={this.handleSelectedDepartment}
              value={this.state.selected_department}
              className="react-select-container"
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
            
            
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
          </div>
        
        {/* <table width="99%"
          className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
          id="dataTables-table"
        /> */}
        <table className="table table-bordered">
          <thead>
            <tr>
              
              {
                  this.state.titleYear.length > 0 && this.state.titleYear.map(v=>(
                    <th>{v.year}</th>
                  ))
              }
              <th>Growth</th>
            </tr>
          </thead>
          <tbody>
         
            {
              this.state.dataSource!=undefined && this.state.dataSource.length > 0 && this.state.dataSource.map(v=>(
                <tr>
                  {
                    v.length > 0 && v.map(v1=>(
                      <td>{v1.HOCount}</td>
                    ))
                  }
                </tr>
              ))
            }
            
            
            {/* {
              this.state.dataSource!=undefined && this.state.dataSource.length > 0 && this.state.dataSource.map(v=>{console.log("v is===>",v)})
            } */}
          </tbody>
        </table>
      </div>
      </div>
    )
  }
}
export default HrStatistics;