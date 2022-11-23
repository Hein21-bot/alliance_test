import React, { Component } from "react";
import {
  main_url,
  stopSaving,
  startSaving,
  getUserInfo,
  havePermission,
  getWorkFlowStatus,
  getActionStatus
} from "../../../utils/CommonFunction";
import "react-toastify/dist/ReactToastify.min.css";
import ApprovalForm from '../../Common/ApprovalForm';
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import DatePicker from "react-datetime";
import {
  getUserId,
  validate,
  getBranch,
  alertText,
  calculationDate
} from "../../../utils/CommonFunction";
import Select from "react-select";
const $ = require("jquery");
var form_validate = true;
var saveBtn = false;

export default class BackPayAddNew extends Component {
  constructor(props) {
    super(props);
    this.state = {
      updatedBy: getUserId("user_info"),
      userId: null,
      edit:this.props.edit,
      editData:this.props.dataSource,
      comment:'',
      work_flow_status:{},
      is_main_role:false,
      PayrollList:[],
    };
  }

  componentDidUpdate() {
    if (!form_validate) validate("check_form");
  }

  async componentDidMount() {
    var work_flow = await getWorkFlowStatus(this.state.editData.user_id, this.state.updatedBy, 'Child Benefit', 'Benefit');
        this.setState({
            work_flow_status: work_flow,
            is_main_role: havePermission(work_flow)
        })
    this.payrollRequest();
    let that = this;
    let id = await getUserId("user_info");
    let branch = await getBranch();
    let userInfo = await getUserInfo(id);
    this.getEmployeeCodeList()
    this.setState({
      branch: branch,
      userId: id,
      userInfo: userInfo[0],
    });
  }
  totalWorkingDays=(startDate,endDate)=>{
    console.log("gggg")
    if(startDate<=endDate){
      console.log("in")
      const newData = this.state.editData;
      newData.total_working_day = calculationDate(startDate,endDate);
      console.log("total work day==+>",newData.total_working_day)
        this.setState({
          editData:newData
        })
    }

  }

  payrollRequest(){
    fetch(`${main_url}back_pay/get_payroll_request_type`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        console.log("pay roll request",list)
        this.setState({
          PayrollList: list.map((v) => ({
            ...v,
            label:v.payrollRequestName,
            value:v.payrollRequestId
          })),
        },()=>{
          console.log("payrolllist",this.state.PayrollList)
        })
      });
  }
  handleSelectedTodate = async (event) => {
    console.log("end===>",moment(event).format('YYYY-MM-DD'))
    const newData = this.state.editData;
    newData.last_working_day =event;
    this.setState({
      editData:newData
    })
    this.totalWorkingDays(this.state.editData.start_working_day,event);
  };
  handleAmount=(e)=>{
    const newData = this.state.editData;
    newData.amount = e.target.value;
    this.setState({ editData: newData });
  }

  onRequestMonthChange = (e) => {
    const newData = this.state.editData;
    newData.request_month = e;
    this.setState({ editData: newData });
  };

  onReasonChange = (e) => {
    console.log("event",e.target.value)
    const newData = this.state.editData;
    newData.reason = e.target.value;
    this.setState({ editData: newData });
  };

  onRadioChange = (e) => {
    console.log("atm or cash",e.target.value)
    const newData = this.state.editData;
    newData.atm_cash = parseInt(e.target.value);
    this.setState({ editData: newData });
  };
  onRadioWorkinDayChange=(e)=>{
    const newData = this.state.editData;
    newData.work_calendar_day = parseInt(e.target.value);
    this.setState({ editData: newData });
  }
  handleSelectedFromdate = async (event) => {
    console.log("start===>",event)
    const newData = this.state.editData;
    newData.start_working_day = event;
    this.setState({
        editData:newData
    })
    this.totalWorkingDays(event,this.state.editData.last_working_day);
  };
  
//   onBackPayChange=(e)=>{
//     const newData = this.state.editData;
//     newData.request_type = e.target.value;
//     this.setState({ editData: newData });
//   }
  handlePayroll=(event)=>{
    console.log("payroll",event)
    const newData = this.state.editData;
    newData.request_type = event.value;
    this.setState({
        editData:newData,
        
    })
  }
  handlesalaryPerDay=(event)=>{
    const newData = this.state.editData;
    newData.salary_per_day = event.target.value;
    this.setState({ editData: newData });
  }

  handleTotalSalary=(e)=>{
    const newData = this.state.editData;
    newData.total_salary = e.target.value;
    this.setState({ editData: newData });
  }
  handleTotal=(e)=>{
    const newData = this.state.editData;
    newData.total = e.target.value;
    this.setState({ editData: newData });
  }
  ontotalSalaryChange=(e)=>{
    const newData = this.state.editData;
    newData.total_salary = e.target.value;
    this.setState({ editData: newData });
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

  handleEmployeeId=(e)=>{
    console.log("id event===>",e)
    
    if (e) {
        fetch(`${main_url}employee/getDetailUser/${e.user_id}`)
          .then((res) => {
            if (res.ok) return res.json();
          })
          .then((data) => {
            this.setState({
                editData:{
                  employment_id:data[0].employment_id,
                  employee_name:data[0].employee_name,
                  state_name:data[0].state_name,
                  location_master_name:data[0].location_master_name,
                  deptname:data[0].deptname,
                  designations:data[0].designations,
                  user_id:data[0].user_id,
                  
                }
            })
            // if (data.length > 0) {
            //   this.getData(this.props.id);
            //   this.setState({ tableEdit: true, tableView: false });
  
  
            // }
          });
      }

    // this.setState({
    //     selectedEmployeeId:e
    // })
  }
  // addData = (e) => {
  //   const { userInfo } = this.state;
  //   console.log("add data", this.state.newData,this.state.DetailUser);
  //   if (validate("add_check_form")) {
  //     var data = [...this.state.dataSource];
  //     let newData = { ...this.state.editData };
  //     let tempData = {};
  //     tempData.request_month = newData.requestMonth;
  //     tempData.payRoll=newData.payRoll;
  //     tempData.employment_id = this.state.DetailUser.employment_id;
  //     tempData.fullname = this.state.DetailUser.employee_name;
  //     tempData.designations = this.state.DetailUser.designations;
  //     tempData.departments=this.state.DetailUser.deptname;
  //     tempData.region=this.state.DetailUser.state_name;
  //     tempData.branch=this.state.DetailUser.location_master_name;
  //     tempData.Amount=newData.Amount;
  //     tempData.start_working_day=newData.start_working_day;
  //     tempData.end_working_day=newData.end_working_day;
  //     tempData.workingDay=newData.workingDay;
  //     tempData.salaryPerDay=newData.salaryPerDay;
  //     tempData.totalWorkingDay=newData.totalWorkingDay;
  //     tempData.Total=newData.Total;
  //     tempData.selectedEmployeeId=this.state.selectedEmployeeId;
  //     tempData.atmOrCash=newData.atmOrCash;
  //     tempData.selectedPayroll=this.state.selectedPayroll;
  //     tempData.user_id=this.state.DetailUser.user_id;
  //     tempData.createdBy=this.state.userInfo.user_id;
  //     tempData.reason=newData.reason;
  //     tempData.totalSalary=newData.totalSalary
      
  //     var totalAmount = 0;

  //     data.push(tempData);
  //     this.setState({
  //       dataSource: data,
  //       selectedEmployeeId:null,
  //       selectedPayroll:null,
  //       editData: {
  //         requestMonth:new Date(),
  //         Amount:0,
  //         workingDay:0,
  //         salaryPerDay:0,
  //         totalWorkingDay:0,
  //         Total:0,
  //         atmOrCash:0,
  //         reason:'',
  //         totalSalary:0,
  //         start_working_day:new Date(),
  //         end_working_day:new Date(),
  //         payRoll:0,
  //         user_id:''
          
  //       },
  //       DetailUser:{
  //         employment_id:0,
  //         employee_name:'',
  //         state_name:'',
  //         location_master_name:'',
  //         deptname:'',
  //         designations:'',
  //         user_id:0
  //       },
       
  //     });

  //     saveBtn = true;
  //     form_validate = true;
  //     this.setDataTable(data);
  //   } else {
  //     form_validate = false;
  //   }
  // };

  // setDataTable(data) {
  //   console.log("data===>",data)
  //   var table;
  //   if ($.fn.dataTable.isDataTable("#dataTables-Table")) {
  //     table = $("#dataTables-Table").dataTable();
  //     table.fnClearTable();
  //     table.fnDestroy();
  //     $("#dataTables-Table").empty();
  //   }
  //   var l = [];
  //   for (var i = 0; i < data.length; i++) {
  //     const index = i;
  //     const result = data[i];
  //     const obj = {
  //       no: index + 1,
  //       request_month: data[i].request_month
  //         ? moment(data[i].request_month).format("MMM")
  //         : "-",
  //       employment_id: data[i].employment_id ? data[i].employment_id : "-",
  //       pay_roll:data[i].payRoll == 1 ? "Back Pay Salary" : data[i].payRoll ==2 ? "Refund Salary" : "•	Temporary Contract Salary",
  //       fullname: data[i].fullname ? data[i].fullname : "-",
  //       designations: data[i].designations ? data[i].designations : "-",
  //       departments:data[i].departments ? data[i].departments : '-',
  //       region:data[i].branch ? data[i].branch:'-',
  //       branch:data[i].region ? data[i].region : '-',
  //       amount:data[i].Amount ? data[i].Amount : '-',
  //       reason:data[i].reason ? data[i].reason : '-',
  //       start_working_day:data[i].start_working_day ? moment(data[i].start_working_day).format('YYYY-MM-DD') : '-',
  //       end_working_day:data[i].end_working_day ? moment(data[i].end_working_day).format('YYYY-MM-DD') : '-',
  //       working_day:data[i].workingDay== 0 ? "Working Day" : 'Calendar Day',
  //       total_working_day:data[i].totalWorkingDay ? data[i].totalWorkingDay : '-',
  //       salary_per_day:data[i].salaryPerDay ? data[i].salaryPerDay : '-',
  //       total_salary:data[i].totalSalary ? data[i].totalSalary : '-',
  //       atm_or_cash: data[i].atmOrCash == 0 ? "ATM" : "Cash",
  //       Total:data[i].Total ? data[i].Total : 0,
  //       action:
  //         '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' +
  //         index +
  //         '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' +
  //         '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toRemove" ><span id="remove" class="hidden" >' +
  //         index +
  //         '</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</button>',
  //     };
  //     l.push(obj);
  //   }

  //   table = $("#dataTables-Table").DataTable({
  //     autofill: false,
  //     bLengthChange: false,
  //     bInfo: false,
  //     responsive: true,
  //     paging: false,
  //     buttons: false,

  //     data: l,
  //     columns: [
  //       { title: "No", data: "no" },
  //       { title :"Request Month",data:"request_month"},
  //       { title : "Payroll Type",data:'pay_roll'},
  //       { title: "Employee Id", data: "employment_id" },
  //       { title: "Employee Name", data: "fullname" },
  //       { title: "Position", data: "designations" },
  //       { title :"Departments",data:"departments"},
  //       { title :"Region",data:"region"},
  //       { title :"Branch",data:"branch"},
  //       { title :"Amount",data:"amount"},
  //       { title :"Reason",data:"reason"},
  //       { title :"Start Working Day",data:"start_working_day"},
  //       { title :"End Working Day",data:"end_working_day"},
  //       { title :"Working Day/Calendar Day",data:"working_day"},
  //       { title: "Total Working Day",data:"total_working_day"},
  //       { title: "Salary Per Day",data:"salary_per_day"},
  //       { title: "Total Salary",data:"total_salary"},
  //       { title: "ATM Or Cash",data:"atm_or_cash"},
  //       { title: "Total",data:"Total"},
  //       { title: "Action",data:'action'}
  //     ],
  //   });
  // }

  showToast = (status, text) => {
    if (status === 200) {
      toast.success(text);
      window.location.reload('/backpay')
      // {this.state.attendance_type == "late_check_in" ? this.LateCheckIn ? this.state.attendance_type == "field_check_in" : this.FieldCheckIn ? this.state.attendance_type == "early_check_out" : this.EarlyCheckOut : this.FieldCheckOut}
    } else {
      toast.error(text);
    }
  };
  approvalStatus = (text, comment) => {
    this.setState({ status_title: text, comment: comment },
        () => this.check())
}


  check = () => {
    // if (this.state.newDoc.length == 0) {
    //     toast.error("Please Choose Attachment File!")
    // } else {
      const {editData} = this.state;
    if (validate("check_form")) {
      var { status_title, is_main_role } = this.state;

      // @lucy
      let status=0
      
      
        const data= {
          request_month: moment(editData.request_month).format("YYYY-MM-DD"),
          request_type:editData.request_type,
          employment_id: editData.employment_id,
          fullname: editData.fullname,
          designations: editData.designations,
          deptname:editData.deptname,
          state_name:editData.state_name,
          location_master_name:editData.location_master_name,
          amount:editData.amount,
          start_working_day:moment(editData.start_working_day).format('YYYY-MM-DD'),
          last_working_day:moment(editData.last_working_day).format('YYYY-MM-DD'),
          work_calendar_day:editData.work_calendar_day,
          salary_per_day:parseInt(editData.salary_per_day),
          total_working_day:editData.total_working_day,
          // selectedEmployeeId:editData.selectedEmployeeId,
          // selectedPayroll:editData.selectedPayroll,
          total:editData.total,
          atm_cash: editData.atm_cash,
          user_id:editData.user_id,
          reason:editData.reason,
          total_salary:editData.total_salary,
          createdBy:editData.createdBy,
          status:this.state.editData.status == 5 ? 0 : this.state.editData.status,
          updatedBy:this.state.updatedBy
         
        };
        if (status_title !== '' && is_main_role) {
          var action = getActionStatus(status_title, this.state.editData, this.state.updatedBy, this.state.comment);
          data.referback_by = action.referback_by;
          data.checked_by = action.checked_by;
          data.verified_by = action.verified_by;
          data.approved_by = action.approved_by;
          data.rejected_by = action.rejected_by;
          data.referback_date = action.referback_date;
          data.checked_date = action.checked_date;
          data.verified_date = action.verified_date;
          data.approved_date = action.approved_date;
          data.rejected_date = action.rejected_date;
          data.referback_comment = action.referback_comment;
          data.checked_comment = action.checked_comment;
          data.verified_comment = action.verified_comment;
          data.approved_comment = action.approved_comment;
          data.status = action.status;
  
      }
      // console.log("data===>",dataTostring)

      fetch(`${main_url}back_pay/edit_back_pay/${editData.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${JSON.stringify(data)}`,
      })
        .then((res) => {
          status = res.status;
          return res.text();
        })
        .then((text) => {
          this.showToast(status, text);
        });
      if (saveBtn) {
        $("#saving_button").attr("disabled", true);
       
      } else {
        startSaving();
        toast.error(" Please Add Full Information", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } else {
      startSaving();
      form_validate = false;
      toast.error(alertText, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    // }
  };
 
  

  render() {
    console.log("eidt data",this.state.editData,this.state.employeeIdList)
    let filterpayroll=this.state.PayrollList.filter(v=>v.value == this.state.editData.request_type)
    let filterEmployeeId=this.state.employeeIdList && this.state.employeeIdList.filter(v=>v.user_id == this.state.editData.user_id)
    console.log("filter employee id",filterEmployeeId)
    const { addNewData, userId, userInfo, dataSource } = this.state;
    console.log("render =====>",this.state.editData);
    return (
      <div>
        <div className="row">
          <div className="form-horizontal" name="demo-form">
            <div className="col-md-12" style={{ marginTop: 20 }}>
              <div className="ibox float-e-margins" id="add_check_form">
                <div className="ibox-content p-md">
                  <div className="row">
                  <div className="col-md-3">
                      <label>Request Month</label>
                      <DatePicker
                        dateFormat="MMM"
                        value={new Date(this.state.editData.request_month)}
                        timeFormat={false}
                        onChange={this.onRequestMonthChange.bind(this)}
                      />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="">Payroll Request Type</label>
                        <Select
                                placeholder="Payroll Request"
                                options={this.state.PayrollList}
                                onChange={this.handlePayroll}
                                value={filterpayroll}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                    </div>
                    <div className="col-md-3">
                      <label>Employee ID</label>
                      <input type="text" className="form-control" value={this.state.editData.employment_id} disabled />
                    </div>
                    <div className="col-md-3">
                      <label>Employee Name</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="fullname"
                        value={this.state.editData.fullname}
                        placeholder="Employee Name"
                      />
                    </div>
                    
                    
                  </div>
                  <div className="row margin-top-20">
                  <div className="col-md-3">
                      <label>Designation</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="designation"
                        value={this.state.editData.designations}
                        placeholder="Designation"
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Department</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="fullname"
                        value={this.state.editData.deptname}
                        placeholder="Department"
                      />
                    </div>
                  <div className="col-md-3">
                      <label>Branch</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="Branch"
                        value={this.state.editData.location_master_name}
                        placeholder="Branch"
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Region</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="Region"
                        value={this.state.editData.state_name}
                        placeholder="Region"
                      />
                    </div>
                    
                    
                  </div>
                  <div className="row margin-top-20">
                  
                  <div className="col-md-3">
                      <label>Amount</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="Amount"
                        value={ this.state.editData.amount}
                        placeholder="Enter Amount"
                        onChange={this.handleAmount}
                      />
                    </div>
                    <div className="col-md-3">
                    <label>Reason</label>
                      <input
                        className="form-control"
                        type="text"
                        data-name="reason"
                        value={this.state.editData.reason}
                        placeholder="Enter Reason"
                        onChange={this.onReasonChange}
                        multiple
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Start Working Day</label>
                      <DatePicker
                        dateFormat="DD/MM/YYYY"
                        value={moment(this.state.editData.start_working_day).format('YYYY-MM-DD')}
                        onChange={this.handleSelectedFromdate}
                        timeFormat={false}
                    />
                    </div>
                    <div className="col-md-3">
                      <label>End Working Day</label>
                            <DatePicker
                        dateFormat="DD/MM/YYYY"
                        value={moment(this.state.editData.last_working_day).format('YYYY-MM-DD')}
                        onChange={this.handleSelectedTodate}
                        timeFormat={false}
                        />
                    </div>
                </div>
                <div className="row margin-top-20">
                <div className="col-md-3">
                      <label>Working Day / Calendar Day</label>
                      <div
                        onChange={this.onRadioWorkinDayChange}
                        className="row"
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <input
                          type="radio"
                          value={0}
                          name="working_day"
                          checked={this.state.editData.work_calendar_day == 0 ? true : false}
                        />{" "}
                        <span>Working Day</span>
                        <input
                          type="radio"
                          value={1}
                          name="calendar_day"
                          checked={this.state.editData.work_calendar_day == 1 ? true : false}
                        />{" "}
                        <span>Calendar Day</span>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label>Total Working Day</label>
                      <input
                        className="form-control"
                        
                        type="number"
                        data-name="totalWorkingDay"
                        value={this.state.editData.total_working_day}
                        onChange={this.handletotalWorkingDay}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Salary Per Day</label>
                      <input
                        className="form-control"
                       
                        type="number"
                        data-name="salaryPerDay"
                        value={this.state.editData.salary_per_day}
                        onChange={this.handlesalaryPerDay}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Total Salary</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="totalSalary"
                        value={this.state.editData.total_salary}
                        placeholder="Total Salary"
                        onChange={this.ontotalSalaryChange}
                      />
                    </div>
                  </div>
                  <div className="row margin-top-20">
                    <div className="col-md-3">
                        <label>ATM / Cash</label>
                        <div
                          onChange={this.onRadioChange}
                          className="row"
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            //   alignItems: "center",
                          }}
                        >
                          <input
                            type="radio"
                            value={0}
                            name="work"
                            checked={this.state.editData.atm_cash== 0 ? true :false}
                          />{" "}
                          <span>ATM</span>
                          <input
                            type="radio"
                            value={1}
                            name="work"
                            checked={this.state.editData.atm_cash== 1 ? true : false}
                          />{" "}
                          <span>Cash</span>
                        </div>
                      </div>
                    <div className="col-md-3">
                        <label>Total</label>
                        <input
                            className="form-control"
                           
                            type="number"
                            data-name="total"
                            value={this.state.editData.total}
                          
                            onChange={this.handleTotal}
                        />
                    </div>
                    {/* <div className="col-md-6 btn-rightend">
                      <button
                        className="btn-primary btn"
                        onClick={this.addData}
                        style={{ marginTop: 20 }}
                      >
                        Add
                      </button>
                    </div> */}
                  </div>
                  </div>
                 
              </div>

              <div className="col-md-12">
                <table
                  width="99%"
                  className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                  id="dataTables-Table"
                />
              </div>
              <div className="row save-btn">
                    {
                        havePermission(this.state.work_flow_status) ?
                            <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.editData.status} work_flow={this.state.work_flow_status} />
                            :
                            <div className="col-md-12 btn-rightend">
                                {this.state.editData.status == undefined || this.state.editData.status == 5 ?
                                    <div>
                                        <button onClick={this.check.bind(this)} className="btn btn-primary" id="saving_button" type="button">Confirm</button>
                                    </div>
                                    :
                                    ''
                                }
                                {/* <button onClick={this.save.bind(this)} id="saving_button" className="btn btn-primary"><span>Save</span> </button> */}
                            </div>
                    }
                </div>
              {/* <div className="col-md-12">
                <div className="col-md-12 btn-rightend mt20">
                  
                 
              <button
                    onClick={this.check.bind(this)}
                    id="saving_button"
                    className="btn btn-primary"
                  >
                    <span>Confirm</span>{" "}
                  </button>
                  
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
