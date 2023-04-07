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
class EmployeeReport extends Component {
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
      statusList:[],
      selected_status:null,
      exitList: [{ label: 'Active', value: 0 }, { label: 'Exit', value: 1 }],
      selected_exit_status:null,
      JobTitleList:[],
      selected_jobTitleList:null

    }
  }

  async componentDidMount() {
    this.$el = $(this.el);
    await this.setState(
      {
        dataSource: this.props.data,

      },
      () => {
        this._setTableData(this.state.dataSource);
      }

    );
    await this.getRegionList();
    await this.getDepartmentList();
    await this.getBranchList();
    await this.getDesignationList();
    await this.getEmployeeName();
    await this.getStatusList()
    await  this.getJobTitleList()
    await this.handleSearchData();
    

    
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
  getJobTitleList() {
    fetch(`${main_url}main/getJobLabel`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          JobTitleList: list, //list.map(v => ({ ...v, label: v.region_name, value: v.region_id }))
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
  getStatusList() {
    fetch(`${main_url}benefit/getStatusList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          statusList: list,
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
  handleSelectedstatus = (event) => {
    if (event !== null)
      this.setState({
        selected_status: event
      });
  };
  handleSelectedJobTitle = (event) => {
    if (event !== null)
      this.setState({
        selected_jobTitleList: event,
      });
  }
  handleSelectedExitStatus = (event) => {
    if (event !== null)
      this.setState({
        selected_exit_status: event,
      });
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
          employee_id: data[i].employment_id ? data[i].employment_id : '-',
          employee_name: data[i].fullname ?data[i].fullname : "-",
          branch: data[i].branch_name ? data[i].branch_name : "-",
          phone_no: data[i].phone ? data[i].phone : "-",
          designation: data[i].designations ? data[i].designations : "-",
          employee_date:data[i].employ_date == null ? "-": moment(data[i].employ_date).format("YYYY-MM-DD"),
          region: data[i].region_name ? data[i].region_name : "-",
          martial_status: data[i].maratial_status ? data[i].maratial_status : '-',
          contact_person: data[i].contact_person ? data[i].contact_person : '-',
          contact_phone: data[i].contact_person_phone ? data[i].contact_person_phone : "-",
          guarantee_contact_person: data[i].guarantee_person ? data[i].guarantee_person : '-',
          guarantee_contact_phone: data[i].gurantee_person_phone ? data[i].gurantee_person_phone : "-",
          Job_title:data[i].job_title ? data[i].job_title  : '-',
          carrer_sub_level:data[i].career_sub_level ? data[i].career_sub_level : '-',
          gender:data[i].gender ? data[i].gender : '-',
          nrc:data[i].nrc ? data[i].nrc : '-',
          dob:data[i].dob ?  data[i].dob : '-',
          nationality:data[i].nationality ? data[i].nationality : '-',
          mother_name:data[i].mother_name ?  data[i].mother_name : '-',
          father_name:data[i].father_name ?  data[i].father_name : '-',
          religion:data[i].religion ?  data[i].religion : '-',
          address:data[i].address ?  data[i].address : '-',
          join_date:data[i].joining_date ?  data[i].joining_date : '-',
          parent_count:data[i].parent_count ?  data[i].parent_count : '-',
          customer_code:data[i].customer_code ?  data[i].customer_code : '-',
          thapyay_account:data[i].thapyay_account ?  data[i].thapyay_account : '-',
          ssc_card_no:data[i].SSC_card_no ?  data[i].SSC_card_no : '-',
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
        { title: "Employee Date", data: "employee_date" },
        { title: "Region", data: "region" },
        { title: "Branch", data: "branch" },
        { title: "Phone No", data: "phone_no" },
        { title: "Martial Status", data: "martial_status" },
        { title: "Contact Person", data: "contact_person" },
        { title: "Contact Phone", data: "contact_phone" },
        { title: "Guarantee Contact Person", data: "guarantee_contact_person" },
        { title: "Guarantee Contact Phone", data: "guarantee_contact_phone" },
        { title: "Job Title", data: "Job_title" },
        { title: "Carrer Sub Level", data: "carrer_sub_level" },
        { title: "Father Name", data: "father_name" },
        
        { title: "Mother Name", data: "mother_name" },

        { title: "Gender", data: "gender" },

        { title: "NRC", data: "nrc" },

        { title: "Date Of Birth", data: "dob" },

        { title: "Nationality", data: "nationality" },

        { title: "Religion", data: "religion" },

        { title: "Address", data: "address" },

        { title: "Join Date", data: "join_date" },

        { title: "Parent Count", data: "parent_count" },

        { title: "CBS Customer Code", data: "customer_code" },

        { title: "Thapyay Account", data: "thapyay_account" },
        { title: "SSC Card No", data: "ssc_card_no" },
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
              title: 'Employee Report',
          },
         
        ],
        data: l,
        columns: column
      });
    
  }
  handleSearchData = () => {
    // this.setState({
    const branchId = this.state.selected_Branch ? this.state.selected_Branch.value : 0
    const departmentId = this.state.selected_department ? this.state.selected_department.departments_id : 0
    const designationId = this.state.selected_designation ? this.state.selected_designation.value : 0
    const regionId = this.state.selected_region ? this.state.selected_region.state_id : 0
    const employee = this.state.selected_employee ? this.state.selected_employee.value : 0
    const jobTitle=this.state.selected_jobTitleList ? this.state.selected_jobTitleList.value : 0
    const exitStatus=this.state.selected_exit_status ?  this.state.selected_exit_status.value : 0
    const status=this.state.selected_status ?  this.state.selected_status.value : -1
    // })

    fetch(main_url + "report/employeeReport/" + regionId + "/" + departmentId + "/" + branchId + "/" + designationId + "/" + employee + '/' + jobTitle+ '/'+exitStatus+'/'+status)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this._setTableData(list);
      })
  }
  render() {
  
    return (
      <div>
        <div className="row  white-bg dashboard-header">
        <h3 className="" style={{paddingLeft:"10px"}}>Employee Report</h3>
          {/* <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}> */}
          <div className="col-md-12" style={{display:'flex',alignItems:'end',marginBottom:10}}>
            <div className="col-md-2">
              <label htmlFor="">Branch</label>
              <Select

              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  // width: 150,
                  // marginRight:10
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
            </div>
            <div className="col-md-2">
              <label htmlFor="">Region</label>
              <Select
              styles={{
                container: base => ({
                  ...base,
                  //   flex: 1
                  // width: 150,
                  // marginRight:10
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
            </div>
            <div className="col-md-2">
              <label htmlFor="">Department</label>
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
            </div>
            <div className="col-md-2">
              <label htmlFor="">Designation</label>
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
            </div>
            <div className="col-md-2">
              <label htmlFor="">Employee Name</label>
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
            </div>
            <div className="col-md-2">
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>

            </div>
          </div>
          <div className="col-md-12" style={{marginBottom:10}}>
          <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  // style={{ marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}
                >
                  <label htmlFor="">Status</label>
                  <Select
                    options={this.state.statusList}
                    value={this.state.selected_status}
                    onChange={this.handleSelectedstatus.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
               
                <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  // style={{ marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}
                >
                  <label>Job Title</label>

                  <Select
                    options={this.state.JobTitleList}
                    value={this.state.selected_jobTitleList}
                    onChange={this.handleSelectedJobTitle.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
                <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  // style={{ marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}
                >
                  <label>Exit Status</label>

                  <Select
                    options={this.state.exitList}
                    value={this.state.selected_exit_status}
                    onChange={this.handleSelectedExitStatus.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
          </div>
          
            
            
            
            
           
           
          {/* </div> */}
        
        <table width="99%"
          className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
          id="dataTables-table"
        />
      </div>
      </div>
    )
  }
}
export default EmployeeReport;