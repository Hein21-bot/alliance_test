import React,{Component} from 'react';
import { main_url } from '../../../utils/CommonFunction';
import DatePicker from "react-datetime";
import Select from "react-select";
import moment from "moment";
import MonthlyIncentiveUpload from './MonthlyIncentiveUpload';
const  $ = require('jquery');

export default class MonthlyIncentive extends Component{
constructor(props){
super(props);
this.state={
dataSource : [],
employeeIdList : [],
EmployeeNameList: [],
regionList : [],
branchList : [],
designationList : [],
co_fx : [{value:0,label:'CO'},{value:1,label:'FX'}],
selected_month : new Date(),
componentIndex : 'main',
selected_region :'',
selected_branch :'',
selected_designation :'',
selected_employeeID : '',
selected_employee :'',
selected_type :'',
}
}
componentDidMount(){
    this.$el = $(this.el);
    this.setDataTable(this.state.dataSource);
    this.getEmployeeCodeList();
    this.getEmployeeName();
    this.getBranchList();
    this.getRegionList();
    this.getDesignationList();
    // this.setState({
    //     dataSource: this.state.dataSource
    // }, () => {
    //     this.setDataTable(this.state.dataSource)
    // });

}


getRegionList() {
    fetch(`${main_url}benefit/getRegionList`)
        .then(res => { if (res.ok) return res.json() })
        .then(list => {
            let lists = list.unshift({ state_id: 0, state_name: 'All' })
            this.setState({
                regionList: list.map(v => ({ ...v, label: v.state_name, value: v.state_id }))
            })
        })
}

getDesignationList() {
    fetch(`${main_url}main/getDesignations`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          designationList: list, //list.map(v => ({ ...v, label: v.region_name, value: v.region_id }))
        });
      });
  }

getBranchList() {
    fetch(`${main_url}main/getBranch`)
        .then((res) => {
            if (res.ok) return res.json();
        })
        .then((list) => {
            let lists = list.unshift({ value: 0, label: 'All' })
            this.setState({
                branchList: list
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

  getEmployeeName() {
    fetch(`${main_url}report/employeeName`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          EmployeeNameList: list
        })
      })
  }

  handleSelectedDeaprtment = (event) => {
    if (event !== null)
      this.setState({
        selected_department: event,
      });
  };

  handleSelectedRegion = (event) => {
    if (event !== null)
      this.setState({
        selected_region: event,
      });
  };

  handleSelectedBranch = (event) => {
    if (event !== null)
      this.setState({
        selected_branch: event,
      });
  };
  handleSelectedDesignation = (event) => {
    if (event !== null)
      this.setState({
        selected_designation: event,
      });
  };
  handleSelectedEmployeeId = (event) => {
    if (event !== null)
      this.setState({
        selected_employeeID: event,
        selected_employee : this.state.EmployeeNameList.filter(v=>v.value == event.user_id)[0].label
      });
  };

  handleSelectedMonth = (event) => {
    this.setState({
        selected_month: event,
      });
  }

  handleSelectedType = (event) => {
    this.setState({
        selected_type: event,
      });
  }
  onClickNext = (event) =>{
    this.setState({
        componentIndex : 'upload'
    })
  }
setDataTable(data) {
    var table;
    if ($.fn.dataTable.isDataTable("#dataTables-Table")) {
      table = $("#dataTables-Table").dataTable();
      table.fnClearTable();
      table.fnDestroy();
      $("#dataTables-Table").empty();
    }
    var l = [];
    for (var i = 0; i < data.length; i++) {
      const index = i;
      const result = data[i];
      const obj = {
        no: index + 1,
        request_month: data[i].request_month ? moment(data[i].request_month).format("MMM"): "-",
        employment_id: data[i].employment_id ? data[i].employment_id : "-",
        pay_roll:data[i].request_type == 1 ? "Back Pay Salary" : data[i].request_type ==2 ? "Refund Salary" : "•	Temporary Contract Salary",
        fullname: data[i].fullname ? data[i].fullname : "-",
        designations: data[i].designations ? data[i].designations : "-",
        departments:data[i].deptname ? data[i].deptname : '-',
        region:data[i].state_name ? data[i].state_name:'-',
        branch:data[i].location_master_name ? data[i].location_master_name: '-',
        amount:data[i].amount ? data[i].amount : '-',
        reason:data[i].reason ? data[i].reason : '-',
        start_working_day:data[i].start_working_day ? moment(data[i].start_working_day).format('YYYY-MM-DD') : '-',
        end_working_day:data[i].last_working_day ? moment(data[i].last_working_day).format('YYYY-MM-DD') : '-',
        working_day:data[i].work_calendar_day== 0 ? "Working Day" : 'Calendar Day',
        total_working_day:data[i].total_working_day ? data[i].total_working_day: '-',
        salary_per_day:data[i].salary_per_day ? data[i].salary_per_day : '-',
        total_salary:data[i].total_salary? data[i].total_salary : '-',
        atm_or_cash: data[i].atm_cash  == 0 ? "ATM" : "Cash",
        action:
          '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' +
          index +
          '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' +
          '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toRemove" ><span id="remove" class="hidden" >' +
          index +
          '</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</button>',
      };
      l.push(obj);
    }

    table = $("#dataTables-Table").DataTable({
      autofill: false,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      paging: false,
      buttons: false,

      data: l,
      columns: [
        { title: "No", data: "no" },
        { title :"Request Month",data:"request_month"},
        { title : "Payroll Type",data:'pay_roll'},
        { title: "Employee Id", data: "employment_id" },
        { title: "Employee Name", data: "fullname" },
        { title: "Position", data: "designations" },
        { title :"Departments",data:"departments"},
        { title :"Region",data:"region"},
        { title :"Branch",data:"branch"},
        { title :"Amount",data:"amount"},
        { title :"Reason",data:"reason"},
        { title :"Start Working Day",data:"start_working_day"},
        { title :"End Working Day",data:"end_working_day"},
        { title :"Working Day/Calendar Day",data:"working_day"},
        { title: "Total Working Day",data:"total_working_day"},
        { title: "Salary Per Day",data:"salary_per_day"},
        { title: "Total Salary",data:"total_salary"},
        { title: "ATM Or Cash",data:"atm_or_cash"},
        { title: "Action",data:'action'}
      ],
    });
  }

render(){ 
return(
   <div>
{this.state.componentIndex == "main" ? (
    <div>
    <div className='col-lg-3' >
        <label>Request Month</label>
        <DatePicker
            dateFormat="MM/YYYY"
            value={this.state.selected_month}
            timeFormat={false}
            onChange={this.handleSelectedMonth}

        /></div>
         <div className='col-lg-3' >
        <label>CO/FX</label>
        <Select 
          options={this.state.co_fx}
          onChange={this.handleSelectedType}
          value={this.state.selected_type}
          className="react-select-container"
          classNamePrefix="react-select"/></div>
    <div className='col-lg-3' >
        <label>Designation</label>
        <Select 
          options={this.state.designationList}
          onChange={this.handleSelectedDesignation}
          value={this.state.selected_designation}
          className="react-select-container"
          classNamePrefix="react-select"/></div>
    <div className='col-lg-3' >
        <label>Region</label>
        <Select 
          options={this.state.regionList}
          onChange={this.handleSelectedRegion}
          value={this.state.selected_region}
          className="react-select-container"
          classNamePrefix="react-select"/></div>
     <div className='col-lg-3' >
        <label>Branch </label>
        <Select 
          options={this.state.branchList}
          onChange={this.handleSelectedBranch}
          value={this.state.selected_branch}
          className="react-select-container"
          classNamePrefix="react-select"/></div>
    <div className='col-lg-3' >
        <label>Employee Id </label>
        <Select 
                                options={this.state.employeeIdList}
                                onChange={this.handleSelectedEmployeeId}
                                value={this.state.selected_employeeID}
                                className="react-select-container"
                                classNamePrefix="react-select"/>

         </div>
    <div className='col-lg-3' >
        <label>Employee Name</label>
              <input 
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="fullname"
                        value={this.state.selected_employee}
                        placeholder="Employee Name"
                        // onChange={this.claimChangeText}
                      /></div>
        <div className='col-lg-3' style={{marginTop:'22px',display:"flex",justifyContent:'space-between'}}>
        <button className='btn-primary btn'>Search</button>
        <button className='btn-primary btn' onClick={this.onClickNext}>Next</button>
        </div>

        <div className="col-md-12">
                <table
                  width="99%"
                  className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                  id="dataTables-Table"
                />
              </div>
              </div>
         ): this.state.componentIndex == "upload" ? (
            <MonthlyIncentiveUpload type={this.state.selected_type}/>
         ): null
         }
   </div>
);
}
}


