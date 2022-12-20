import React, { Component } from "react";
import { main_url } from '../../../utils/CommonFunction';
import Select from 'react-select';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import moment from "moment";
import DatePicker from "react-datetime";

class QuarterlyIncentiveReport extends Component {
  constructor(props) {
    super(props);
    this.state = {

      fullname:'',
      data:[],
      quater_list:[],
      regionList: null,
      empName: 0,
      quarter:'',
      employee_id: null,
      employee_date: moment().format("YYYY-MM-DD"),
      selected_month : new Date(),
      selected_quarter:{value: 1, label: "Jan to March"},
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
      employeeIdList: null,
      selected_employeeId: null,
      quarter_months:[
        {value:1,month1:'Jan',month2:'Feb',month3:'March'},
        {value:2,month1:'April',month2:'May',month3:'June'},
        {value:3,month1:'July',month2:'Aug',month3:'Sept'},
        {value:4,month1:'Oct',month2:'Nov',month3:'Dec'},

      ]
    }
  }

  async componentDidMount() {
    this.getRegionList();
    this.getBranchList();
    this.getDesignationList();
    this.getEmployeeCodeList();
    this.getQuaterList();

  } 

  getQuaterList() {
    fetch(`${main_url}team_building/getQuater`)
        .then(res => { if (res.ok) return res.json() })
        .then(list => {
            this.setState({
                quater_list: list
            })
        })
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
  }

  handleSelectedMonth = (event) => {
    this.setState({
        selected_month: event,
      });
  };

  handleSelectedQuater = (event) => {
    this.setState({
        selected_quarter: event
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
  }

  handleSelectedRegion = async (event) => {
    if (event != null)
      this.setState({
        selected_region: event
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
  }

  handleSearchData = () => {
    const branchId = this.state.selected_Branch ? this.state.selected_Branch.value : 0
    const designationId = this.state.selected_designation ? this.state.selected_designation.value : 0
    const regionId = this.state.selected_region ? this.state.selected_region.state_id : 0
    const employee = this.state.selected_employeeId ? this.state.selected_employeeId.value : 0
    const quarterSelect  =  this.state.selected_quarter ? this.state.selected_quarter.value :0

    fetch(main_url + "salary_report/quartelyReport/" + employee + "/" + designationId + "/" + branchId + "/" + regionId + "/" + quarterSelect + "/" + moment(this.state.selected_month).format('YYYY') ) 
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        if (list.length > 0){
        this.setState({
            data:list,
            quarter:list[0].quarter 

        })}else{
          this.setState({
            data:list, })
        }
      })
  }

  render() {
  
    return (
      <div>
          <h3 style={{margin:'15px 15px 15px 0px'}}>Quarterly Incentive Report</h3>            
          <div className='' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' ,marginBottom:30}}>

          <div className='col-lg-2' style={{padding:0}} >
          <DatePicker
            dateFormat="YYYY"
            value={this.state.selected_month}
            timeFormat={false}
            onChange={this.handleSelectedMonth}
           /></div>

         <div className='col-lg-2' >
          <Select
            dateFormat="YYYY"
            options={this.state.quater_list}
            value={this.state.selected_quarter}
            timeFormat={false}
            onChange={this.handleSelectedQuater}
           /></div>

          <div className='col-lg-2' >
              <Select
              placeholder="Branch"
              options={this.state.branchlist}
              onChange={this.handleSelectedBranch}
              value={this.state.selected_Branch}
              className='react-select-container'
              classNamePrefix="react-select"
            /></div>

            <div className='col-lg-2' >
            <Select
              placeholder="Region"
              options={this.state.regionList}
              onChange={this.handleSelectedRegion}
              value={this.state.selected_region}
              className='react-select-container'
              classNamePrefix="react-select"
            /></div>

            <div className='col-lg-2' >
            <Select
              placeholder="Designation"
              options={this.state.designationList}
              onChange={this.handleSelectedDesignation}
              value={this.state.selected_designation}
              className='react-select-container'
              classNamePrefix="react-select"
            /></div>

            <div className='col-lg-2' >
            <Select
              placeholder="Employee ID"
              options={this.state.employeeIdList}
              onChange={this.handleSelectedEmpId}
              value={this.state.selected_employeeId}
              className='react-select-container'
              classNamePrefix="react-select"
            /></div>

            <div className="col-lg-2">
            <input type="text" className="form-control" style={{width:'150px'}} value={this.state.fullname} placeholder="Employee Name" disabled/>
            </div>

            <div className="col-lg-2">
            <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
            </div>

          </div>

          
{  this.state.data.length > 0 ?(
  <div>
             <div style={{marginBottom:10}}>
             <ReactHTMLTableToExcel 
             className="btn-excel"
             table="quarterly_incentive"
             filename="Quarterly Incentive Report"
             buttonText="Excel"
             sheet="Sheet"
             />
             </div>
         <div>
         <table className="table table-bordered" id="quarterly_incentive" style={{overflow:'scroll'}}>
            <thead>
                <tr>
                    <th style={{textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Sr No</th>
                    <th style={{textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Employee Code</th>
                    <th style={{textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Employee Name</th>
                    <th style={{textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Position</th>
                    <th style={{textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>BSC Category</th>
                    <th style={{textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Branch</th>
                    <th style={{textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Branch Code</th>
                    <th style={{textAlign: "center", verticalAlign: "middle" }} colSpan={3}>Monthly Salary</th>
                    <th style={{textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Average Salary</th>
                    <th style={{textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>BSC%</th>
                    <th style={{textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Total Incentive</th>
                    <th style={{textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Remark</th>
                </tr>
                <tr>
                <th style={{ textAlign: "center", verticalAlign: "middle" }}>{this.state.quarter_months.filter(v=>v.value==this.state.quarter)[0].month1}</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }}>{this.state.quarter_months.filter(v=>v.value==this.state.quarter)[0].month2}</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }}>{this.state.quarter_months.filter(v=>v.value==this.state.quarter)[0].month3}</th>
                </tr>
            </thead>
            <tbody>
            {
                    this.state.data.map((v,i)=>{
                      return(
                        <>
                  <tr>
                    <td>{i+1}</td>
                    <td>{v.employeeID}</td>
                    <td>{v.name}</td>
                    <td>{v.position}</td>
                    <td>CO/FX</td>
                    <td>{v.location_master_name}</td>
                    <td>{v.location_master_code}</td>
                    <td>{v.month1}</td>
                    <td>{v.month2}</td>
                    <td>{v.month3}</td>
                    <td>{v.average_salary}</td>
                    <td>{v.BSC}</td>
                    <td>{v.incentive}</td>
                    <td>{v.remark}</td>
                  </tr>
                  </>  )
                    })
                }  
            </tbody>
          </table></div></div>):(
             <div>
             <div style={{marginBottom:10}}>
             <ReactHTMLTableToExcel 
             className="btn-excel"
             table="quarterly_incentive"
             filename="Quarterly Incentive Report"
             buttonText="Excel"
             sheet="Sheet"
             />
             </div>
          <table className="table table-bordered" id="quarterly_incentive" style={{overflow:'scroll'}}>
            <thead>
                <tr>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Sr No</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Employee Code</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Employee Name</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Position</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>BSC Category</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Branch</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Branch Code</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} colSpan={3}>Monthly Salary</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Average Salary</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>BSC%</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Total Incentive</th>
                    <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Remark</th>
                </tr>
                <tr>
                <th style={{ textAlign: "center", verticalAlign: "middle" }}>{this.state.quarter_months.filter(v=>v.value == this.state.selected_quarter.value)[0].month1}</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }}>{this.state.quarter_months.filter(v=>v.value == this.state.selected_quarter.value)[0].month2}</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }}>{this.state.quarter_months.filter(v=>v.value == this.state.selected_quarter.value)[0].month3}</th>
                </tr>
            </thead>
            <tbody>
              <td colSpan={14}style={{ textAlign: "center", verticalAlign: "middle",height:35,fontSize:15,borderBottom:'1px solid black' }}>No data available in table</td>
           
            </tbody>
          </table></div>
          )}    
      </div>
    )
  }
}
export default QuarterlyIncentiveReport;