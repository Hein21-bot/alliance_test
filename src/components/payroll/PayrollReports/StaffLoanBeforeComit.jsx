import React, { Component } from "react";
import { main_url} from "../../../utils/CommonFunction";
import DatePicker from "react-datetime";
import Select from "react-select";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const $ = require("jquery");

class StaffLoanBeforeComit extends Component {
  constructor(props) {
    super(props);
    this.state = {
    dataSource:[],
    start_date:new Date(),
    end_date:new Date(),
    selected_Branch:'',
    selected_region:'',
    }
  }

  async componentDidMount() {
    this.getRegionList();
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

  handleSelectedRegion = async (event) => {
    if (event != null)
      this.setState({
        selected_region: event
      })
  };

  handleSelectedEmpId = async (event) => {
    console.log("event",event)
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
          // if (data.length > 0) {
          //   this.getData(this.props.id);
          //   this.setState({ tableEdit: true, tableView: false });


          // }
        });
    }
      this.setState(
        {
          selected_employeeId: event
        }
      )
  };

  handleSearchData = () => {
    fetch(main_url + "staff_loan_new/staffloanReportBefore")
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this.setState({
            dataSource:list
        })
      })
  };

  render() { 
  
    return (
      <div>
        <ToastContainer/>
        <div className="row  white-bg dashboard-header">
        <h3 className="" style={{paddingLeft:"10px"}}>Staff Loan Before Committee Report </h3>
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
                    table="staff_loan_before"
                    filename={"Staff Loan Before Committee"}
                    buttonText="Excel"
                    sheet="Sheet"
                    />
          <table className="table table-bordered" id="staff_loan_before"  style={{ overflow: "Scroll",display:'block',whiteSpace:'nowrap' }}>
            <thead>
                <tr>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>No</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Loan Request Date</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} colSpan={10}>Requested Employee</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Other Credit Facilities and/or Advance Salary currently held;</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} colSpan={3}>Personal Loan</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} colSpan={3}>Collateral Loan</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} colSpan={3}>Other Outstending Debts</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} colSpan={5}>Staff Guarantor</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} colSpan={7}>Family Guarantor</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Customer Code</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Loan Purpose</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Requested Loan Amount</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Proposed Repayment Period</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Requested Disbursement Branch</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} colSpan={4}>HOD Recommendation(Check Person)</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>HR Comment</th>
                </tr>
                <tr>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} >Employee ID</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} >Name</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} >Position</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} >Branch</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} >Department</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} >Region</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} >Employee Date</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} >Service Year</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} >Employee Phone No(Personal)</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} >Current Salary(No Other Allowance)</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Institution</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Outstanding Amount</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Materity Date</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Institution</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Outstanding Amount</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Materity Date</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Institution</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Outstanding Amount</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Materity Date</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>ID Code</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Name</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Position</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Branch</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Department</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Name</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Relationship with Staff Loan Requestor</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Occupation</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Mothly Income</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>NRC No</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Ph No</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Address</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Performance Recommendation</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Other Loan Information</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Status(Recommend or Not)</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Supervisor Comments</th>
                </tr>
            </thead>
            <tbody>
            {this.state.dataSource.length > 0 ?(
              this.state.dataSource.map((v, i) => { 
                return (
                  <>
                <tr>
                    <td>{i+1}</td>
                    <td>{moment(v.loan_requested_date).format('DD-MM-YYYY') || '-'}</td>
                   <td>{v.emp_id || '-'}</td>
                   <td>{v.user_name || '-'}</td>
                   <td>{v.designation || '-'}</td>
                   <td>{v.branch || '-'}</td>
                   <td>{v.department || '-'}</td>
                   <td>{v.state || '-'}</td>
                   <td>{moment(v.employ_date).format('DD-MM-YYYY') || '-'}</td>
                   <td>{v.service_year || '-'}</td>
                   <td>{v.phone || '-'}</td>
                   <td>{v.salary || '-'}</td>
                   <td>{v.other_loan_check || '-'}</td>
                   <td>{v.loan.filter(v=>v.name === 'Personal Loan')[0] ? v.loan.filter(v=>v.name === 'Personal Loan')[0].institution :'-'}</td>  
                   <td>{v.loan.filter(v=>v.name === 'Personal Loan')[0] ? v.loan.filter(v=>v.name === 'Personal Loan')[0].outstanding_amount :'-'}</td>
                   <td>{v.loan.filter(v=>v.name === 'Personal Loan')[0] ? moment( v.loan.filter(v=>v.name === 'Personal Loan')[0].maturity_date).format('DD-MM-YYYY') :'-'}</td>
                   <td>{v.loan.filter(v=>v.name === 'Collateral Loan')[0] ? v.loan.filter(v=>v.name === 'Collateral Loan')[0].institution :'-'}</td>  
                   <td>{v.loan.filter(v=>v.name === 'Collateral Loan')[0] ? v.loan.filter(v=>v.name === 'Collateral Loan')[0].outstanding_amount :'-'}</td>
                   <td>{v.loan.filter(v=>v.name === 'Collateral Loan')[0] ? moment( v.loan.filter(v=>v.name === 'Collateral Loan')[0].maturity_date).format('DD-MM-YYYY') :'-'}</td>
                   <td>{v.loan.filter(v=>v.name === 'Other Outstanding debts')[0] ? v.loan.filter(v=>v.name === 'Other Outstanding debts')[0].institution :'-'}</td>  
                   <td>{v.loan.filter(v=>v.name === 'Other Outstanding debts')[0] ? v.loan.filter(v=>v.name === 'Other Outstanding debts')[0].outstanding_amount :'-'}</td>
                   <td>{v.loan.filter(v=>v.name ==='Other Outstanding debts')[0] ? moment( v.loan.filter(v=>v.name === 'Other Outstanding debts')[0].maturity_date).format('DD-MM-YYYY') :'-'}</td>
                   <td>{v.staff_emp_id || '-'}</td>
                   <td>{v.staff_name || '-'}</td>
                   <td>{v.staff_des || '-'}</td>
                   <td>{v.staff_branch || '-'}</td>
                   <td>{v.staff_dep || '-'}</td>
                   <td>{v.guar_name || '-'}</td>
                   <td>{v.relation_family || '-'}</td>
                   <td>{v.family_job || '-'}</td>  
                   <td>{v.family_income || '-'}</td>
                   <td>{v.family_nrc || '-'}</td>
                   <td>{v.family_phone || '-'}</td>
                   <td>{v.family_address || '-'}</td>
                   <td>{v.customer_code || '-'}</td>
                   <td>{v.loan_purpose || '-'}</td>
                   <td>{v.requested_amount || '-'}</td>
                   <td>{v.repayment_period || '-'}</td>
                   <td>{this.state.branchlist.filter(c=>c.value === v.withdraw_location)[0].label || '-'}</td>
                   <td>{v.performance_recommendation || '-'}</td>
                   <td>{v.other_loan_information || '-'}</td> 
                   <td>{v.performance_recommendation || '-'}</td>
                   <td>{v.checked_comment || '-'}</td>
                   <td>{v.verified_comment || '-'}</td>
                </tr>   </>
                     )
                    })):(
                     <tr>
                     <td colSpan={44}style={{ textAlign: "center", verticalAlign: "middle",height:35,fontSize:15,borderBottom:'1px solid black' }}>No data available in table</td>
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
export default StaffLoanBeforeComit;