import React, { Component } from "react";
import { main_url} from "../../../utils/CommonFunction";
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
    start_date:new Date(),
    end_date:new Date(),
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

  // handleSearchData = () => {
  //   // this.setState({
  //   const branchId = this.state.selected_Branch ? this.state.selected_Branch.value : 0
  //   const departmentId = this.state.selected_department ? this.state.selected_department.departments_id : 0
  //   const designationId = this.state.selected_designation ? this.state.selected_designation.value : 0
  //   const regionId = this.state.selected_region ? this.state.selected_region.state_id : 0
  //   const employee = this.state.selected_employeeId ? this.state.selected_employeeId.value : 0
  //   // })

  //   fetch(main_url + "report/employeeReport/" + regionId + "/" + branchId + "/" + designationId + "/" + employee)
  //     .then(res => { if (res.ok) return res.json() })
  //     .then(list => {
  //       this.setState({
  //           data:list
  //       })
  //     })
  // };

  render() {
  
    return (
      <div>
        <ToastContainer/>
        <div className="row  white-bg dashboard-header">
        <h3 className="" style={{paddingLeft:"10px"}}>Quarterly Incentive Report </h3>
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
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Sr No</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Loan Requested Date</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Loan Requested Month</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>HOD Check Date</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Approve Date</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} colSpan={2}>Disbursement Date</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Disbursement Branch</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Requested Employee Code</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Requested Employee Name</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Position</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Branch</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Department</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} colSpan={2}>Region</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={5}>Staff Guarantor</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={4}>Family Guarantor</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Customer Code</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Staff Loan Account</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} colSpan={2}>Kant Kaw Account</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Approve Loan Ammount</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Terms in Month</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Monthly Installment Amount</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} colSpan={2}>Approve or Not Approve</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Committee Comment</th>
                </tr>
                <tr>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Performance Recommendation</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Other Loan Information</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Status(Recommend or Not)</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}}>Supervisor Comments</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>2</td>
                    <td>A-13221</td>
                    <td>Ye Htet</td>
                    <td>IT</td>
                    <td>CO,FX</td>
                    <td>Mdy</td>
                    <td>Mandalay</td>
                    <td>20000</td>
                    <td>30000</td>
                    <td>40000</td>                  
                </tr>
            </tbody>
          </table>
        
      </div>
      </div>
    )
  }
}
export default StaffLoanAfterComit;