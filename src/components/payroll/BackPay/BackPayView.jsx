import moment from "moment";
import React, { Component } from "react";
import ApprovalInformation from '../../Common/ApprovalInformation';
import {
  getMonth,
 main_url
} from "../../../utils/CommonFunction";
import DatePicker from "react-datetime";
const $ = require("jquery");
export default class BackPayView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      status_info:[]
    };
  }

  async componentDidMount(){
  this.getBackPay();
  this.getStatusInfo();
}
getStatusInfo() {
  fetch(`${main_url}child_benefit/getOneDetailInfo/${this.props.dataSource.id}`)
      .then(res => res.json())
      .then(res => {
          this.setState({
              status_info: res
          })
      })
      .catch(error => console.log(error))
}
  getBackPay(){
    fetch(`${main_url}back_pay/get_back_pay_details/${this.props.dataSource.id}`)
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((list) => {
      this.setState({
        preveData: list
    }, () => { 
        this.setDataTable(list)
    });
    });
  }

  setDataTable(data) {
    console.log("data===>",data)
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
        // action:
        //   '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' +
        //   index +
        //   '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' +
        //   '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toRemove" ><span id="remove" class="hidden" >' +
        //   index +
        //   '</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</button>',
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
        // { title: "Action",data:'action'}
      ],
    });
  }


  render() {
    
    const {
      request_month,
          payRoll,
          employment_id,
          employee_name,
          designations,
          departments,
          region,
          branch,
          Amount,
          start_working_day,
          end_working_day,
          workingDay,
          salaryPerDay,
          totalWorkingDay,
          selectedEmployeeId,
          selectedPayroll,
          Total,
          atm_or_cash,
          user_id,
          reason,
          totalSalary,
          createdBy
      
    } = this.props.dataSource;
    return (
     
      <div>
         <div className="col-md-12">
                <table
                  width="99%"
                  className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                  id="dataTables-Table"
                />
              </div>
              <div className="col-md-3 btn-leftend mt20"  style={{marginBottom:'20px',marginTop:'0px'}}>
                  <label htmlFor="">Total</label>
                  <input type="text" className="form-control" value={this.props.dataSource.total} disabled />
                </div>
        {
                            !Array.isArray(this.state.status_info) ?

                                <div className="row approval-main margin-top-20">
                                    <ApprovalInformation status={this.state.status_info} />
                                </div>
                                : ''
                        }
      </div>
    );
  }
}
