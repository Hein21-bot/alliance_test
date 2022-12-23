import React, { Component } from "react";
import {
  main_url,
  stopSaving,
  startSaving,
  getUserInfo,
  getWorkFlowStatus,
  havePermission,
  getActionStatus
} from "../../../utils/CommonFunction";
import "react-toastify/dist/ReactToastify.min.css";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import ApprovalForm1 from "../../Common/ApprovalForm1";
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
      userId: null,
      edit:this.props.edit,
      comment:'',
      is_main_role:false,
      status_title:'',
      work_flow_status:{},
      updatedBy:getUserId("user_info"),
      preveData:[],
      userInfo: {},
      PayrollList:[],
      addNewData: {
        request_month:new Date(),
        amount:0,
        reason:'',
        work_calendar_day:0,
        salary_per_day:0,
        total_working_day:1,
        // Total:0,
        atm_cash:0,
        start_working_day:new Date(),
        last_working_day:new Date(),
        request_type:0,
        total_salary:0
        
        
      },
      dataSource: [],
      attachment: [],
      newDoc: [],
      employeeIdList:null,
      selectedEmployeeId:{},
      selectedPayroll:null,
      DetailUser:{
        employment_id:0,
        employee_name:'',
        state_name:'',
        location_master_name:'',
        deptname:'',
        designations:''
      },
      
     
    };
  }

  componentDidUpdate() {
    if (!form_validate) validate("check_form");
  }

  async componentDidMount() {
    var work_flow = await getWorkFlowStatus(this.props.dataSource.createdBy, this.state.updatedBy, 'PayrollForBackPay-RefundAndTemporaryContract', 'PayrollForBackPay-RefundAndTemporaryContract');
    this.setState({
        work_flow_status: work_flow,
        is_main_role: havePermission(work_flow)
    })
    // var work_flow = await getWorkFlowStatus(this.props.dataSource.createdBy, this.state.updatedBy, 'Child Benefit', 'Benefit');
    // this.setState({
    //     work_flow_status: work_flow,
    //     is_main_role: havePermission(work_flow)
    // })
    let that = this;
    let id = await getUserId("user_info");
    let branch = await getBranch();
    let userInfo = await getUserInfo(id);
    this.getEmployeeCodeList();
    this.getBackPay();
    this.payrollRequest();
    this.setState({
      branch: branch,
      userId: id,
      userInfo: userInfo[0],
    });
    $(document).on("click", "#toEdit", function () {
      var data = $(this).find("#edit").text();
      data = $.parseJSON(data);
      let newData = that.state.preveData;
      let editData = newData[data];
      newData.splice(data, 1);
      
      that.setState(
        {
          dataSource: newData,
          selectedPayroll:that.state.PayrollList.filter(v=>v.value== editData.request_type),
          selectedEmployeeId:that.state.employeeIdList.filter(v=>v.value == editData.user_id),
          addNewData: {
            request_month: editData.request_month,
            amount:editData.amount,
            work_calendar_day:editData.work_calendar_day,
            salary_per_day:editData.salary_per_day,
            total_working_day:editData.total_working_day,
            // Total:editData.Total,
            start_working_day:editData.start_working_day,
            last_working_day:editData.last_working_day,
            request_type:editData.request_type,
            atm_cash:editData.atm_cash,
            reason:editData.reason,
            total_salary:editData.total_salary
          },
          DetailUser:{
        employment_id:editData.employment_id,
        employee_name:editData.fullname,
        employment_id:editData. employment_id,
        state_name:editData.state_name,
        location_master_name:editData.location_master_name,
        deptname:editData.deptname,
        designations:editData.designations
          },
          
        },
        () => that.setDataTable(newData)
      );
    });
    $(document).on("click", "#toRemove", function () {
      var data = $(this).find("#remove").text();
      data = $.parseJSON(data);

      let newData = that.state.preveData;
      newData.splice(data, 1);
      that.setState(
        {
          dataSource: newData,
        },
        () => that.setDataTable(newData)
      );
    });
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
  totalWorkingDays=(startDate,endDate)=>{
    if(startDate<=endDate){
      console.log("in")
      const newData = this.state.addNewData;
      newData.total_working_day = calculationDate(startDate,endDate);
      console.log("total work day==+>",newData.total_working_day)
        this.setState({
          addNewData:newData
        })
    }

  }
  handleSelectedTodate = async (event) => {
    console.log("end===>",moment(event).format('YYYY-MM-DD'))
    const newData = this.state.addNewData;
    newData.last_working_day =event;
    this.setState({
      addNewData:newData
    })
    this.totalWorkingDays(this.state.addNewData.start_working_day,event);
  };
  handleAmount=(e)=>{
    const newData = this.state.addNewData;
    newData.amount = e.target.value;
    this.setState({ addNewData: newData });
  }

  onRequestMonthChange = (e) => {
    console.log("EE",e)
    const newData = this.state.addNewData;
    newData.request_month = e;
    this.setState({ addNewData: newData });
  };

  onReasonChange = (e) => {
    console.log("event",e.target.value)
    const newData = this.state.addNewData;
    newData.reason = e.target.value;
    this.setState({ addNewData: newData });
  };

  onRadioChange = (e) => {
    const newData = this.state.addNewData;
    newData.atm_cash = parseInt(e.target.value);
    this.setState({ addNewData: newData });
  };
  onRadioWorkinDayChange=(e)=>{
    const newData = this.state.addNewData;
    newData.work_calendar_day = parseInt(e.target.value);
    this.setState({ addNewData: newData });
  }
  handleSelectedFromdate = async (event) => {
    console.log("start===>",event)
    const newData = this.state.addNewData;
    newData.start_working_day = event;
    this.setState({
        addNewData:newData
    })
    this.totalWorkingDays(event,this.state.addNewData.last_working_day);
  };
  
  onBackPayChange=(e)=>{
    const newData = this.state.addNewData;
    newData.backPay = e.target.value;
    this.setState({ addNewData: newData });
  }
  handlePayroll=(event)=>{
    console.log("payroll",event)
    const newData = this.state.addNewData;
    newData.request_type = event.payrollRequestId;
    this.setState({
        selectedPayroll:event,
        
    })
  }
  handlesalaryPerDay=(event)=>{
    const newData = this.state.addNewData;
    newData.salary_per_day = event.target.value;
    this.setState({ addNewData: newData });
  }

  // handleTotalSalary=(e)=>{
  //   const newData = this.state.addNewData;
  //   newData.total = e.target.value;
  //   this.setState({ addNewData: newData });
  // }
  // handleTotal=(e)=>{
  //   const newData = this.state.addNewData;
  //   newData.Total = e.target.value;
  //   this.setState({ addNewData: newData });
  // }
  ontotalSalaryChange=(e)=>{
    const newData = this.state.addNewData;
    newData.total_salary = e.target.value;
    this.setState({ addNewData: newData });
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
    if (e) {
        fetch(`${main_url}employee/getDetailUser/${e.user_id}`)
          .then((res) => {
            if (res.ok) return res.json();
          })
          .then((data) => {
            this.setState({
                DetailUser:{
                  employment_id:data[0].employment_id,
                  employee_name:data[0].employee_name,
                  state_name:data[0].state_name,
                  location_master_name:data[0].location_master_name,
                  deptname:data[0].deptname,
                  designations:data[0].designations,
                  user_id:data[0].user_id
                }
            })
          });
      }
      console.log(">>",e)
    this.setState({
        selectedEmployeeId:e
    })
  }
  addData = (e) => {
    const { userInfo } = this.state;
    console.log("add data", this.state.newData,this.state.DetailUser);
    if (validate("add_check_form")) {
      var data = [...this.state.preveData];
      let newData = { ...this.state.addNewData };
    //   let totalAmount=0;
    //   for (var i = 0; i < data.length; i++) {

    //     totalAmount += data[i].totalSalary;
    // }
      let tempData = {};
      tempData.request_month = moment(newData.request_month).format('MM');
      tempData.request_type=newData.payRoll;
      tempData.employment_id = this.state.DetailUser.employment_id;
      tempData.fullname = this.state.DetailUser.employee_name;
      tempData.designations = this.state.DetailUser.designations;
      tempData.deptname=this.state.DetailUser.deptname;
      tempData.state_name=this.state.DetailUser.state_name;
      tempData.location_master_name=this.state.DetailUser.location_master_name;
      tempData.amount=newData.amount;
      tempData.start_working_day= moment(newData.start_working_day).format('YYYY-MM-DD');
      tempData.last_working_day=moment(newData.last_working_day).format('YYYY-MM-DD');
      tempData.work_calendar_day =newData.worwork_calendar_daykingDay;
      tempData.salary_per_day=newData.salary_per_day;
      tempData.total_working_day =newData.total_working_day;
      // tempData.Total=newData.totalSalary;
      // tempData.selectedEmployeeId=this.state.selectedEmployeeId;
      tempData.atm_cash=newData.atm_cash;
      // tempData.selectedPayroll=this.state.selectedPayroll;
      tempData.user_id=this.state.DetailUser.user_id;
      tempData.createdBy=this.state.userInfo.user_id;
      tempData.reason=newData.reason;
      tempData.total_salary=newData.total_salary;


      data.push(tempData);
      this.setState({
        preveData: data,
        selectedEmployeeId:null,
        selectedPayroll:null,
        addNewData: {
          request_month:new Date(),
          amount:0,
          work_calendar_day:0,
          salary_per_day:0,
          total_working_day:1,
          atm_cash:0,
          reason:'',
          total_salary:0,
          start_working_day:new Date(),
          last_working_day:new Date(),
          request_type:0,
          user_id:''
          
        },
        DetailUser:{
          employment_id:0,
          employee_name:'',
          state_name:'',
          location_master_name:'',
          deptname:'',
          designations:'',
          user_id:0
        },
       
      });

      saveBtn = true;
      form_validate = true;

      this.setDataTable(data);
    } else {
      form_validate = false;
    }
  };

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
        request_month: data[i].request_month ? moment(data[i].request_month).format("YYYY-MM"): "-",
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
    if (validate("check_form")) {
      let formdata={};
      var { status_title, is_main_role } = this.state;
      let status=0
      let Total=this.state.preveData.reduce((p,c)=>{return p+parseInt(c.total_salary)},0)
      let workflow={};
      var info={
        id : this.props.dataSource.id,
        total:Total,
        createdBy:this.props.dataSource.createdBy,
        status: 0
      };
      if (status_title !== '' && is_main_role) {
        var action = getActionStatus(status_title, this.state.preveData, this.state.updatedBy, this.state.comment);
        info.referback_by = action.referback_by;
        info.checked_by = action.checked_by;
        info.verified_by = action.verified_by;
        info.approved_by = action.approved_by;
        info.rejected_by = action.rejected_by;
        info.referback_date = action.referback_date;
        info.checked_date = action.checked_date;
        info.verified_date = action.verified_date;
        info.approved_date = action.approved_date;
        info.rejected_date = action.rejected_date;
        info.referback_comment = action.referback_comment;
        info.checked_comment = action.checked_comment;
        info.verified_comment = action.verified_comment;
        info.approved_comment = action.approved_comment;
        info.status = action.status;
     ; }
      const dataTostring = this.state.preveData.map((v) => {
        return {
          request_month: moment(v.request_month).format("YYYY-MM-DD"),
          request_type:v.request_type,
          employment_id: v.employment_id,
          employee_name: v.fullname,
          designations: v.designations,
          deptname:v.deptname,
          state_name:v.state_name,
          location_master_name:v.location_master_name,
          amount:v.amount,
          start_working_day:v.start_working_day,
          last_working_day:v.last_working_day,
          work_calendar_day:v.work_calendar_day,
          salary_per_day:parseInt(v.salary_per_day),
          total_working_day:v.total_working_day,
          selectedEmployeeId:v.selectedEmployeeId,
          selectedPayroll:v.selectedPayroll,
          // total:Total,
          status:v.status == 5 ? 0 : v.status,
          atm_cash: v.atm_cash,
          user_id:v.user_id,
          reason:v.reason,
          total_salary:v.total_salary,
          createdBy:v.createdBy,
          // id :this.props.dataSource.id,
        };
      });
      formdata.data=info;
      formdata.detail=dataTostring;
      formdata.action=workflow;
      // formdata.push('detail', JSON.stringify(info))
      // formdata.push('data', JSON.stringify(dataTostring))
      console.log("formdata",formdata)
      
      fetch(`${main_url}back_pay/edit_back_pay/${this.props.dataSource.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
        // body:`data=${formdata}`
        // body:JSON.stringify(formdata)
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
        // this.props.addClaimRequest(
        //   dataTostring,
        //   this.state.data,
        //   this.state.newDoc
        // );
      } 
      // else {
      //   startSaving();
      //   toast.error(" Please Add Full Information", {
      //     position: "top-right",
      //     autoClose: 5000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //   });
      // }
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
  // confirm =()=>{

  // }
  

  render() { 
    const { addNewData, userId, userInfo, dataSource } = this.state;
    console.log("addNewData =====>",this.state.preveData.status,havePermission(this.state.work_flow_status));
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
                        value={moment(addNewData.request_month).format('MMM')}
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
                                // value={this.state.edit ? filterpayroll : this.state.selectedPayroll}
                                value={this.state.selectedPayroll}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                    </div>
                    <div className="col-md-3">
                      <label>Employee ID</label>
                      <Select
                                placeholder="Employee"
                                options={this.state.employeeIdList}
                                onChange={this.handleEmployeeId}
                                // value={this.state.edit ? filterEmployeeId : this.state.selectedEmployeeId}
                                value={this.state.selectedEmployeeId}
                                className="react-select-container"
                                classNamePrefix="react-select"
                            />
                    </div>
                    <div className="col-md-3">
                      <label>Employee Name</label>
                      <input
                        className="form-control checkValidate"
                        disabled={true}
                        type="text"
                        data-name="fullname"
                        value={this.state.DetailUser.employee_name}
                        placeholder="Employee Name"
                        // onChange={this.claimChangeText}
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
                        value={this.state.DetailUser.designations}
                        placeholder="Designation"
                        // onChange={this.claimChangeText}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Department</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="fullname"
                        value={this.state.DetailUser.deptname}
                        placeholder="Department"
                        // onChange={this.claimChangeText}
                      />
                    </div>
                  <div className="col-md-3">
                      <label>Branch</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="Branch"
                        value={this.state.DetailUser.location_master_name}
                        placeholder="Branch"
                        // onChange={this.claimChangeText}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Region</label>
                      <input
                        className="form-control"
                        disabled={true}
                        type="text"
                        data-name="Region"
                        value={this.state.DetailUser && this.state.DetailUser.state_name}
                        placeholder="Region"
                        // onChange={this.onGrossSalaryChange}
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
                        value={addNewData.amount}
                        placeholder="Enter Amount"
                        onChange={this.handleAmount}
                      />
                    </div>
                    <div className="col-md-3">
                    <label>Reason</label>
                      <input
                        className="form-control checkValidate"
                        type="text"
                        data-name="reason"
                        value={addNewData.reason}
                        placeholder="Enter Reason"
                        onChange={this.onReasonChange}
                        multiple
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Start Working Day</label>
                      <DatePicker
                        dateFormat="DD/MM/YYYY"
                        value={moment(addNewData.start_working_day).format('DD-MM-YYYY')}
                        onChange={this.handleSelectedFromdate}
                        timeFormat={false}
                    />
                    </div>
                    <div className="col-md-3">
                      <label>End Working Day</label>
                            <DatePicker
                        dateFormat="DD/MM/YYYY"
                        value={moment(addNewData.last_working_day).format('DD-MM-YYYY')}
                        onChange={this.handleSelectedTodate}
                        timeFormat={false}
                        />
                    </div>
                </div>
                <div className="row margin-top-20" style={{display:'flex',alignItems:'end'}}>
                <div className="col-md-3">
                      <div className="row">
                        <div className="col-md-7">
                        <label>Working Day / Calendar Day</label>
                      <div
                        onChange={this.onRadioWorkinDayChange}
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
                          name="working_day"
                          checked={addNewData.work_calendar_day == 0  ? true : false}
                        />{" "}
                        <span>Working Day</span>
                        <input
                          type="radio"
                          value={1}
                          name="calendar_day"
                          checked={addNewData.work_calendar_day == 1 ? true : false}
                        />{" "}
                        <span>Calendar Day</span>
                      </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <label>Total Working Day</label>
                      <input
                        className="form-control"
                        
                        type="number"
                        data-name="totalWorkingDay"
                        value={addNewData.total_working_day}
                        onChange={this.handletotalWorkingDay}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Salary Per Day</label>
                      <input
                        className="form-control"
                       
                        type="number"
                        data-name="salaryPerDay"
                        value={addNewData.salary_per_day}
                        onChange={this.handlesalaryPerDay}
                      />
                    </div>
                    <div className="col-md-3">
                      <label>Total Salary</label>
                      <input
                        className="form-control"
                        type="number"
                        data-name="totalSalary"
                        value={addNewData.total_salary}
                        placeholder="Total Salary"
                        onChange={this.ontotalSalaryChange}
                      />
                    </div>
                  </div>
                  <div className="row margin-top-20" style={{display:'flex',alignItems:'flex-end'}}>
                    <div className="col-md-3">
                       <div className="row">
                        <div className="col-md-5">
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
                            checked={addNewData.atm_cash == 0 ? true : false}
                          />{" "}
                          <span>ATM</span>
                        
                          
                          <input
                            type="radio"
                            value={1}
                            name="work"
                            checked={addNewData.atm_cash == 1 ? true : false}
                          />{" "}
                          <span>Cash</span>
                          
                        </div>
                        </div>
                       </div>
                      </div>
                    <div className="col-md-9 btn-rightend">
                      <button
                        className="btn-primary btn"
                        onClick={this.addData}
                        // style={{ marginTop: 20 }}
                      >
                        Add
                      </button>
                    </div>
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
              <div className="col-md-12" style={{display:'flex',alignItems:'end'}}>
                <div className="col-md-3 btn-leftend mt20">
                  <label htmlFor="">Total</label>
                  <input type="text" className="form-control" value={this.state.preveData.reduce((p,c)=>{return p+parseInt(c.total_salary)},0)} disabled />
                </div>

                {/* <div className="col-md-9 btn-rightend mt20">
                  <button
                    onClick={this.check.bind(this)}
                    id="saving_button"
                    className="btn btn-primary"
                  >
                    <span>Submit</span>{" "}
                  </button>
                </div> */}

              </div>

                     <div className="row save-btn">
                    {
                        havePermission(this.state.work_flow_status) && this.props.dataSource.status !=5  ?
                            <ApprovalForm1 approvalStatus={this.approvalStatus.bind(this)} status={this.props.dataSource.status} work_flow={this.state.work_flow_status} />
                            :
                            <div className="col-md-12 btn-rightend">
                                { this.props.dataSource.status == 5 ?
                                    <div>
                                        <button onClick={this.check.bind(this)} className="btn btn-primary" id="saving_button" type="button">Confirm</button>
                                    </div>
                                    :
                                    ''
                                }
                            </div>
                    }
                </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
