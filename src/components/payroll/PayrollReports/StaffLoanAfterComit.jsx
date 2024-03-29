import React, { Component } from "react";
import { main_url,getMonthName,getFirstDayOfMonth} from "../../../utils/CommonFunction";
import DatePicker from "react-datetime";
import Select from "react-select";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const $ = require("jquery");

class StaffLoanAfterComit extends Component {
  constructor(props) {
    super(props);
    this.state = {
    dataSource:[],
    start_date: moment(getFirstDayOfMonth()),
    end_date: moment(),
    selected_Branch:'',
    selected_department:'',
    selected_designation:'',
    selected_employeeId:'',
    branchlist:[],
    departmentList:[],
    designationList:[],
    employeeIdList:[],
    month:[
      {value:1,label:'Jan'},
      {value:2,label:'Feb'},
      {value:3,label:'Mar'},
      {value:4,label:'Apr'},
      {value:5,label:'May'},
      {value:6,label:'Jun'},
      {value:7,label:'Jul'},
      {value:8,label:'Aug'},
      {value:9,label:'Sep'},
      {value:10,label:'Oct'},
      {value:11,label:'Nov'},
      {value:12,label:'Dec'},
    ]
    }
  }

  async componentDidMount() {
    this.getDepartmentList();
    this.getBranchList();
    this.getDesignationList();
    this.getEmployeeCodeList();
    // this.handleSearchData(); 
  };

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
  };

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
  };

  getDepartmentList() {
    fetch(`${main_url}main/getDepartment`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({  value: 0, label: "All"  });
        this.setState({
          departmentList: list.map((v) => ({
            ...v,
            
          })),
        });
      });
  };

  getEmployeeCodeList() {
    fetch(`${main_url}employee/getEmployeeCode`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          employeeIdList: list.map((v) => ({
            ...v,
            label: v.employee_code,
            value: v.user_id,
          })),
        });
      });
  };

  handleStartDate = async (event) => {
      this.setState({
        start_date: event
      })
  };

  handleEndDate = async (event) => {
    this.setState({
      end_date: event
    })
  };

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
  };

  handleSelectedDepartment = async (event) => {
    if (event != null)
      this.setState({
        selected_department: event
      })
  };

  handleSelectedEmpId = async (event) => {
    if (event != null)
    if (event) {
      fetch(`${main_url}employee/getDetailUser/${event.user_id}`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((data) => {
          this.setState({
              fullname:data[0].employee_name
          })
        });
    }
      this.setState(
        {
          selected_employeeId: event
        }
      )
  };

  handleSearchData = () => {
    let status=0
    fetch(`${main_url}staff_loan_new/staffloanReportAfter/${moment(this.state.start_date).format('YYYY-MM-DD')}/${moment(this.state.end_date).format('YYYY-MM-DD')}/${this.state.selected_designation ? this.state.selected_designation.value : 0}/${this.state.selected_department ? this.state.selected_department.value : 0}/${this.state.selected_Branch ? this.state.selected_Branch.value : 0}/${ this.state.selected_employeeId ? this.state.selected_employeeId.value : 0}`)
    .then((res)=>{
      status = res.status;
      if(res.ok) return res.json();
    })
      .then(list => { 
        if (status === 200){
        this.setState({
            dataSource:list
        })}else{
          this.setState({
            dataSource:[]
        })
        }
      })
  };

  render() { 
  
    return (
      <div>
        <ToastContainer/>
        <div className="row  white-bg dashboard-header">
        <h3 className="" style={{paddingLeft:"10px"}}> Staff Loan After Committee Report</h3>
          <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
          <div style={{width: '120px',marginRight:10}}>
          <DatePicker dateFormat="DD/MM/YYYY"
                  value={this.state.start_date}
                  timeFormat={false}
                  styles={{width:15}}
                  onChange={this.handleStartDate.bind(this)}
                  ></DatePicker></div>
         <div style={{width: '120px',marginRight:10}}>
          <DatePicker dateFormat="DD/MM/YYYY"
                  value={this.state.end_date}
                  timeFormat={false}
                  styles={{width:15}}
                  onChange={this.handleEndDate.bind(this)}
                  ></DatePicker></div>
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
                })

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
              placeholder="Department"
              options={this.state.departmentList}
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
              placeholder="Employee ID"
              options={this.state.employeeIdList}
              onChange={this.handleSelectedEmpId}
              value={this.state.selected_employeeId}
              className='react-select-container'
              classNamePrefix="react-select"
            />
            <input type="text" className="form-control" style={{width:'150px'}} value={this.state.fullname} disabled/>
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
          </div>
          <ReactHTMLTableToExcel 
                    className="btn-excel"
                    table="staff_loan_after"
                    filename={"Final Staff Loan Report"}
                    buttonText="Excel"
                    sheet="Sheet"
                    />
          <table className="table table-bordered" id="staff_loan_after"  style={{ overflow: "Scroll",display:'block',whiteSpace:'nowrap' }}>
            <thead>
                <tr>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Sr No</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Loan Requested Date</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Loan Requested Month</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>HOD Check Date</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Approve Date</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Disbursement Date</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Disbursement Branch</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Requested Employee Code</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Requested Employee Name</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Position</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Branch</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Department</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Region</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} colSpan={5}>Staff Guarantor</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} colSpan={4}>Family Guarantor</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Customer Code</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Staff Loan Account</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Kant Kaw Account</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Approve Loan Amount</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Terms in Month</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Monthly Installment Amount</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Approve or Not Approve</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Committee Comment</th>
                </tr>
                <tr>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>ID Code</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Nmae</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Position</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Branch</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>NRC No</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Name</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Relationship with Staff Loan Requestor</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>NRC No</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Ph No</th>
                </tr>
            </thead>
            <tbody>
             {this.state.dataSource.length > 0 ?(
                this.state.dataSource.map((v, i) => { 
                  console.log("v====>",v)
                  return (
                    <>
                    <tr>
                    <td>{i+1}</td>
                    <td>{v.createdAt ?  moment(v.createdAt).format('DD-MM-YYYY') :'-' }</td>
                     <td>{v.month ? this.state.month.filter(a=>a.value == v.month)[0].label : '-'}</td>
                     <td>{v.checked_date ? moment(v.checked_date).format('DD-MM-YYYY'):'-' }</td>
                     <td>{v.approved_date ? moment(v.approved_date).format('DD-MM-YYYY') : '-'}</td>
                     <td>{v.disbursement_date ? moment(v.disbursement_date).format('DD-MM-YYYY') :'-'}</td>
                     <td></td>
                     <td>{v.user_empId || '-'}</td>
                     <td>{v.user_name || '-'}</td>
                     <td>{v.user_des || '-'}</td>                    
                     <td>{v.user_branch || '-'}</td>
                     <td>{v.user_dep || '-' }</td>
                     <td>{v.user_region || '-'}</td>
                     <td>{v.employment_id || '-'}</td>
                     <td>{v.fullname || '-'}</td>
                     <td>{v.designations || '-'}</td>
                     <td>{v.location_master_name || '-'}</td>
                     <td>{v.nrc || '-'}</td>  
                     <td>{v.family_guarantor_name || '-'}</td>
                     <td>{v.name || '-'}</td>
                     <td>{v.family_guarantor_nrc || '-'}</td>
                     <td>{v.family_guarantor_phone || '-'}</td>
                     <td>{v.customer_code || '-'}</td>
                     <td></td>
                     <td></td>
                     <td>{v.approved_amount ? v.approved_amount.toLocaleString() :'-'}</td>
                     <td>{v.term_in_month || '-'}</td>
                     <td>{v.approve_installment_amount ? v.approve_installment_amount.toLocaleString() : '-'}</td>
                     <td>{v.status == 1 ? "Check" : v.status == 2 ? 'Verify' : v.status == 3 ? 'Approve' : v.status == 4 ? "Referback" : "Reject" || '-'}</td>
                     <td>{v.approved_comment || '-'}</td>    
                </tr>  </>
                     )
                    })):(
                     <tr>
                     <td colSpan={30}style={{ textAlign: "center", verticalAlign: "middle",height:35,fontSize:15,borderBottom:'1px solid black' }}>No data available in table</td>
                     </tr>
                )               
            }
            </tbody>
          </table>
        
      </div>
      </div>
    )
  }
}
export default StaffLoanAfterComit;