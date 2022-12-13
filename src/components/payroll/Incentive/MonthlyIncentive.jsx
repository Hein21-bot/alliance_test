import React, { Component } from "react";
import { main_url,getUserId} from "../../../utils/CommonFunction";
import DatePicker from "react-datetime";
import Select from "react-select";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

const $ = require("jquery");

export default class MonthlyIncentive extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      newDoc: [],
      employeeIdList: [],
      EmployeeNameList: [],
      regionList: [],
      branchList: [],
      designationList: [],
      fxData:[],
      co_fx: [
        { value: 1, label: "CO" ,name:'co'},
        { value: 2, label: "FX" ,name:'fx' },
      ],
      selected_month: new Date(),
      selected_region: "",
      selected_branch: "",
      selected_designation: "",
      selected_employeeID: "",
      selected_employee: "",
      selected_type: { value: 1, label: "CO",name:'co' },
      loading:false,
    };
  }
  componentDidMount() {
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
  };

  showToast = (status, text) => { 
    if (status === 200) { console.log(text)
      toast.success(text ,{
        position: "top-right",
        autoClose: 5000,
      });
    } else { 
      toast.error("Fail To Save Information!");
    }
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
  };

  getBranchList() {
    fetch(`${main_url}main/getBranch`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          branchList: list,
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

  getEmployeeName() {
    fetch(`${main_url}report/employeeName`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          EmployeeNameList: list,
        });
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
        selected_employee: this.state.EmployeeNameList.filter(
          (v) => v.value == event.user_id
        )[0].label,
      });
  };

  handleSelectedMonth = (event) => {
    this.setState({
      selected_month: event,
    });
  };

  handleSelectedType = (event) => {
 document.querySelector("#attachment").value = "";
    this.setState(
      {
        selected_type: event,
        fxData: [],
      },
      () => {
        this.state.selected_type.value == 1 ||  this.state.selected_type.value == 2
          ? this.setDataTable(this.state.dataSource)
          : this._setDataTable(this.state.fxData);
      }
    );
  };
  
 actionClick = (e)=>{ 
   
if (e == 0)  {
  document.querySelector("#attachment").value = "";
  this.setState({
    fxData:[],  },
  () => {
    this.state.selected_type.value == 2 && this.state.fxData.length > 0
      ? this._setDataTable(this.state.fxData)
      : this.setDataTable(this.state.dataSource);
  })} else {
    this._setDataTable(this.state.fxData)
  }
if ( this.state.fxData.length > 0 && (e == 1 || e == 2 || e ==0 )){
  let status = 0
  fetch(`${main_url}incentive/monthlyGenerate/${this.state.selected_type.name}/${moment(this.state.selected_month).format("YYYY-MM")}/${e}`)
  .then((res) => {
    status=res.status;
    return res.text();
  })
  .then((text) => {
 if (e != 0){
  this.showToast(status, text);
 }  
  });
} else {
  toast.error("Please Choose Attachment File!");
}
  };

  checkFiles(e) {
      this.setState({
        loading: true,
        newDoc: []
      });
      var files = document.getElementById("attachment").files;
      var newDoc = this.state.newDoc;
      for(let i = 0; i < files.length; i++) {
        var getfile = document.querySelector("#attachment").files[i];
        newDoc.push(getfile);
      };
      // document.querySelector("#attachment").value = "";
      const formdata = new FormData();
      var imagedata = newDoc[0];
      formdata.append("uploadfile", imagedata);
      let status = 0;
      fetch(`${main_url}incentiveCo/addIncentiveCo/${moment(this.state.selected_month).format("YYYY-MM")}/${this.state.selected_type.name}`, {
        method: "POST",
        body: formdata,
      })
        .then((res) => {
          status = res.status;
          return res.json();
        })
        .then( (response) => {
          if (status == 200) {
            this.setState({ loading: false,fxData:response});
             this. _setDataTable(response);
             this.setDataTable(this.state.dataSource);
          } else {
            toast.error("Fail to Save Information", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
            this.setState({
              loading: false,
            });
          }
        })
  };

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
        request_month: data[i].request_month
          ? moment(data[i].request_month).format("MMM")
          : "-",
        employment_id: data[i].employment_id ? data[i].employment_id : "-",
        pay_roll:
          data[i].request_type == 1
            ? "Back Pay Salary"
            : data[i].request_type == 2
            ? "Refund Salary"
            : "•	Temporary Contract Salary",
        fullname: data[i].fullname ? data[i].fullname : "-",
        designations: data[i].designations ? data[i].designations : "-",
        departments: data[i].deptname ? data[i].deptname : "-",
        region: data[i].state_name ? data[i].state_name : "-",
        branch: data[i].location_master_name
          ? data[i].location_master_name
          : "-",
        amount: data[i].amount ? data[i].amount : "-",
        reason: data[i].reason ? data[i].reason : "-",
        start_working_day: data[i].start_working_day
          ? moment(data[i].start_working_day).format("YYYY-MM-DD")
          : "-",
        end_working_day: data[i].last_working_day
          ? moment(data[i].last_working_day).format("YYYY-MM-DD")
          : "-",
        working_day:
          data[i].work_calendar_day == 0 ? "Working Day" : "Calendar Day",
        total_working_day: data[i].total_working_day
          ? data[i].total_working_day
          : "-",
        salary_per_day: data[i].salary_per_day ? data[i].salary_per_day : "-",
        total_salary: data[i].total_salary ? data[i].total_salary : "-",
        atm_or_cash: data[i].atm_cash == 0 ? "ATM" : "Cash",
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
        { title: "Request Month", data: "request_month" },
        { title: "Payroll Type", data: "pay_roll" },
        { title: "Employee Id", data: "employment_id" },
        { title: "Employee Name", data: "fullname" },
        { title: "Position", data: "designations" },
        { title: "Departments", data: "departments" },
        { title: "Region", data: "region" },
        { title: "Branch", data: "branch" },
        { title: "Amount", data: "amount" },
        { title: "Reason", data: "reason" },
        { title: "Start Working Day", data: "start_working_day" },
        { title: "End Working Day", data: "end_working_day" },
        { title: "Working Day/Calendar Day", data: "working_day" },
        { title: "Total Working Day", data: "total_working_day" },
        { title: "Salary Per Day", data: "salary_per_day" },
        { title: "Total Salary", data: "total_salary" },
        { title: "ATM Or Cash", data: "atm_or_cash" },
        { title: "Action", data: "action" },
      ],
    });
  };

  _setDataTable(data) {
    var table;
    if ($.fn.dataTable.isDataTable("#dataTables-Table-One")) {
      table = $("#dataTables-Table-One").dataTable();
      table.fnClearTable();
      table.fnDestroy();
      $("#dataTables-Table-One").empty();
    }
    var l = [];
    for (var i = 0; i < data.length; i++) {
      const index = i;
      const result = data[i];
      const obj = {
        no: index + 1,
        employment_id: data[i].employeeID ? data[i].employeeID: "-",
        co_count:data[i].coCount ? data[i].coCount : "-",
        co_incentive: data[i].incentiveAmount ? data[i].incentiveAmount : "-",
        co_incentive_total: data[i].coIncentiveTotal ? data[i].coIncentiveTotal : "-",
      };
      l.push(obj);
    }

    table = $("#dataTables-Table-One").DataTable({
      autofill: false,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      paging: false,
      buttons: false,

      data: l,
      columns: [
        { title: "Employee Id", data: "employment_id" },
        { title: "CO Count", data: "co_count" },
        { title: "CO Incentive Amount", data: "co_incentive" },
        { title: "CO Incentive Total", data: "co_incentive_total" },
      ],
    });
  };

  render() {
    return (
      <div>
        <ToastContainer/>
        <div className="row">
          
          <div className="col-lg-3" >
            <label>Request Month</label>
            <DatePicker
              dateFormat="MM/YYYY"
              value={this.state.selected_month}
              timeFormat={false}
              onChange={this.handleSelectedMonth}
            />
          </div>

          <div className="col-lg-3">
            <label>CO/FX</label>
            <Select
              options={this.state.co_fx}
              onChange={this.handleSelectedType}
              value={this.state.selected_type}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

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

          <div className="col-lg-3">
            <label>Designation</label>
            <Select
              options={this.state.designationList}
              onChange={this.handleSelectedDesignation}
              value={this.state.selected_designation}
              className="react-select-container"
              classNamePrefix="react-select"
            />
          </div>

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
                         onChange={this.claimChangeText}/>
           </div>

           <div
            className="col-lg-3"
            style={{
              marginTop: "25px",
            }}
          >
            <button className="btn-primary btn" >Search</button>
          </div> 

        </div>

        <div className="row">
        <div className="col-lg-2" style={{ paddingTop: 30 }}>
            <input
              // className="dropZone"
              type="file"
              id="attachment"
              // name="attachment"
              onChange={ this.checkFiles.bind(this)}
              style={{ height:30 }}
            ></input>
          </div>

          <div
            className="col-lg-3"
            style={{
              marginTop: "22px",
            }}
          >
            <button className="btn-primary btn" onClick={()=>this.actionClick(1)}>Pay Slip Generate</button>
          </div>
        </div>

        { 
           this.state.loading  ||  this.state.fxData.length > 0 ? "" : ( 
          <div className="col-md-12">
                <table
                  width="99%"
                  className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                  id="dataTables-Table"
                />
              </div>)
        }
        {  
            this.state.loading  ? (
            <div className="col-lg-12" style={{display:'flex',justifyContent:'center' }}>
             <h1>Loading...</h1>
             {/* <span className="loader"></span> */}
            </div>):(
             this.state.selected_type.value == 2 &&  this.state.fxData.length > 0 ? (
          <div>
            <div className="col-md-12">
              <table
                width="99%"
                className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                id="dataTables-Table-One"
              />

              <div style={{ display:"flex",justifyContent:'end' }}>
                <div
                  className="col-lg-2"
                  style={{
                    marginTop: "22px",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <button className="btn-primary btn" onClick={()=>this.actionClick(0)}>Delete</button>
                </div>
                <div
                  className="col-lg-2"
                  style={{
                    marginTop: "22px",
                    display: "flex",
                    justifyContent: "start",
                  }}
                >
                  <button className="btn-primary btn" onClick={()=>this.actionClick(2)}>Generate</button>
                </div>
              </div>
            </div>
          </div>
            ) : this.state.selected_type.value == 1 &&  this.state.fxData.length > 0 ? (
            <div>
              <table
                className="table table-bordered"
                style={{ overflow: "scroll" }}
              >
                <thead>
                  <tr
                    style={{
                      backgroundColor: "blue",
                      color: "white",
                      overflow: "scroll",
                    }}
                  >
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={3}
                    >
                      Employee ID
                    </th>
                    <th style={{ textAlign: "center" }} colSpan={4}>
                      Credit
                    </th>
                    <th style={{ textAlign: "center" }}>Saving</th>
                    <th style={{ textAlign: "center" }} colSpan={2}>
                      Collection Rate
                    </th>
                    <th style={{ textAlign: "center" }} colSpan={2}>
                      PAR
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={3}
                    >
                      Credit Incentive
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={3}
                    >
                      Saving Incentive
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={3}
                    >
                      Collective Rate Incentive
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={3}
                    >
                      PAR Deduction Incentive
                    </th>
                  </tr>
                  <tr>
                    <th style={{ textAlign: "center" }} colSpan={2}>
                      Disbursement
                    </th>
                    <th style={{ textAlign: "center" }} colSpan={2}>
                      Portfolio
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={2}
                    >
                      Outstanding
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={2}
                    >
                      Demand
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={2}
                    >
                      Actual
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={2}
                    >
                      NO.s
                    </th>
                    <th
                      style={{ textAlign: "center", verticalAlign: "middle" }}
                      rowSpan={2}
                    >
                      Amount
                    </th>
                  </tr>
                  <tr>
                    <th style={{ textAlign: "center" }}>NO.s</th>
                    <th style={{ textAlign: "center" }}>Amount</th>
                    <th style={{ textAlign: "center" }}>NO.s</th>
                    <th style={{ textAlign: "center" }}>Outstanding</th>
                  </tr>
                </thead>
                <tbody style={{ textAlign: "center" }}>
                  {
                    this.state.fxData.map((v,i)=>{
                      return(
                        <>
                  <tr>
                    <td>{v.employeeID}</td>
                    <td>{v.creditDisbursementNo}</td>
                    <td>{v.creditDisbursementAmount}</td>
                    <td>{v.creditPortfolioNo}</td>
                    <td>{v.creditPortfolOutstanding}</td>
                    <td>{v.savingOutstanding}</td>
                    <td>{v.collectionRateDemand}</td>
                    <td>{v.collectionActual}</td>
                    <td>{v.parNo}</td>
                    <td>{v.parAmount}</td>
                    <td>{v.creditIncentive}</td>
                    <td>{v.savingIncentive}</td>
                    <td>{v.collectiveRateIncentive}</td>
                    <td>{v.parDeductionRate}</td>
                  </tr>
                  </>  )
                    })
                }
                </tbody>
              </table>

            <div style={{ display: "flex", justifyContent: "end" }}>
              <div
                className="col-lg-1"
                style={{
                  marginTop: "22px",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <button className="btn-primary btn" onClick={()=>this.actionClick(0)}>Delete</button>
              </div>

              <div
                className="col-lg-1"
                style={{
                  marginTop: "22px",
                  display: "flex",
                  justifyContent: "end",
                }}
              >
                <button className="btn-primary btn"  onClick={()=>this.actionClick(2)}>Generate</button>
              </div>

            </div>
            
           </div>
            ) : '')
         } 
        </div>
    );
  }
}

{
  /* <div className="row" style={{display:'flex',justifyContent:'center'}}>
                    <div className='col-lg-7 col-md-8 col-sm-12' style={{ background: 'white',marginTop:30,border:"1px solid grey " }}>
                 <div className="" style={{display:'flex',justifyContent:'center', background: '#1872ab',marginTop:20}}><h2 style={{color:"white",marginTop:10,fontSize:18,fontWeight:"bold"}}>Monthly Incentive</h2></div>
                 <div className="" style={{display:'flex',justifyContent:'center',paddingTop:20}}><h3>Staff Information</h3></div>
                 <div className='col-lg-6' style={{ paddingLeft: '100px', paddingTop: '10px' }}><p>Staff ID</p>
                 <p>Name</p>
                 <p>Department</p>
                 <p>Designation</p>
                 <p>Branch</p>
                 <p>Payment Month</p>
                 </div>

                 <div className='col-lg-1' style={{ paddingLeft: '0px', paddingTop: '10px' }} ><p>:</p>
                 <p>:</p>
                 <p>:</p>
                 <p>:</p>
                 <p>:</p>
                 <p>: </p>
                 </div>

                 <div className=' col-lg-5' style={{ paddingLeft: '90px', paddingTop: '10px' }}><p>Staff ID</p>
                 <p>Name</p>
                 <p>Department</p>
                 <p>Designation</p>
                 <p>Branch</p>
                 <p>Payment Month</p>
                 </div>

                 <div className="row" style={{display:'flex',justifyContent:'center',paddingTop:20}}><h3>Incentive Information</h3>
                 </div>
                 <div className='col-lg-6' style={{ paddingLeft: '100px', paddingTop: '10px' }}><p>CO Count </p>
                 <p>Co Incentive Total</p>
                 <p>Incentive Amount </p>
                 </div>

                 <div className='col-lg-1' style={{ paddingLeft: '0px', paddingTop: '10px' }} ><p>:</p>
                 <p>:</p>
                 <p>:</p>
                 </div>

                
                 <div className=' col-lg-5' style={{ paddingLeft: '90px', paddingTop: '10px', marginBottom:20 }}><p>Staff ID</p>
                 <p>Name</p>
                 <p>Department</p>
                 </div>
                    </div>
                  </div> */
}

{
  /* <div className="row" style={{display:'flex',justifyContent:'space-around'}}>
                   <div className='col-lg-4 col-md-4 col-sm-12' style={{ background: 'white',marginTop:30,border:"1px solid grey " }}>
                    
                  <div className="" style={{display:'flex',justifyContent:'center', background: '#1872ab',marginTop:20}}><h2 style={{color:"white",marginTop:10,fontSize:18,fontWeight:"bold"}}>Monthly Incentive</h2>
                  </div>

                  <div className="" style={{display:'flex',justifyContent:'center',paddingTop:20}}><h3>Staff Information</h3></div>

                  <div className='col-lg-6' style={{ paddingLeft: '30px', paddingTop: '10px' }}><p>Staff ID</p>
                  <p>Name</p>
                  <p>Department</p>
                  <p>Designation</p>
                  <p>Branch</p>
                  <p>Payment Month</p>
                  </div>

                 <div className='col-lg-1' style={{ paddingLeft: '0px', paddingTop: '10px' }} ><p>:</p>
                  <p>:</p>
                  <p>:</p>
                  <p>:</p>
                  <p>:</p>
                  <p>: </p>
                  </div>

                  <div className=' col-lg-5' style={{ paddingLeft: '90px', paddingTop: '10px' }}><p>Staff ID</p>
                  <p>Name</p>
                  <p>Department</p>
                  <p>Designation</p>
                  <p>Branch</p>
                  <p>Payment Month</p>
                  </div>
                 
                  <div className='row' style={{display:'flex',justifyContent:'center',paddingTop:20}}><h3>Incentive Information</h3>
                  </div>

                  <div className='col-lg-6' style={{ paddingLeft: '30px', paddingTop: '10px' }}><p>Credit Incentive</p>
                  <p>Saving Incentive</p>
                  <p>Collection Rate Incentive</p>
                  <p>PAR Deduction Difference</p>
                  <p>Grand Total</p>
                  </div>

                 <div className='col-lg-1' style={{ paddingLeft: '0px', paddingTop: '10px' }} ><p>:</p>
                  <p>:</p>
                  <p>:</p>
                  <p>:</p>
                  <p>:</p>
                  </div>

                
                  <div className=' col-lg-5' style={{ paddingLeft: '90px', paddingTop: '10px' }}><p>Staff ID</p>
                  <p>Name</p>
                  <p>Department</p>
                  <p>Designation</p>
                  <p>Branch</p>
                  </div>
                   </div>

                  <div className='col-lg-4 col-md-4 col-sm-12' style={{ background: 'white',marginTop:30,border:"1px solid grey " }}>                
                  <div className="" style={{display:'flex',justifyContent:'center', background: '#1872ab',marginTop:20}}><h2 style={{color:"white",marginTop:10,fontSize:18,fontWeight:"bold"}}>Detail Calculation</h2>
                  </div>

                 <div style={{padding:50,paddingTop:10,paddingBottom:0}}>
                 <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div className=""><h3>Credit Incentive</h3></div>
                  <div className=""><h3>1382</h3></div>
                 </div>

                 <div>
                 <table className="table "style={{overflow:'scroll',  border:'1px solid black'}}>
                 <thead>
                 <tr style={{overflow:'scroll',border:'1px solid black' }}>
                             <th style={{width:100,textAlign:'center',border:'1px solid black'}} colSpan={2}>Disbursement</th>
                             <th style={{verticalAlign:'middle',textAlign:'center',width:100,border:'1px solid black'}} colSpan={2}>Portfolio</th>       
                </tr>
                <tr>        
                   <th style={{textAlign:'center',border:'1px solid black'}}>No.s</th>
                             <th style={{textAlign:'center',border:'1px solid black'}}>Amount</th>
                             <th style={{textAlign:'center',border:'1px solid black'}}>No.s</th>
                             <th style={{textAlign:'center',border:'1px solid black'}}>Outstanding</th></tr>
                 </thead>
                 <tbody style={{ textAlign:'center'}}>
                  <tr>
                  <td style={{ border:'1px solid black' }}>324324</td>
                  <td style={{ border:'1px solid black' }}>324324</td>
                  <td style={{ border:'1px solid black' }}>324324</td>
                  <td style={{ border:'1px solid black' }}>324324</td>
                  </tr>
                   </tbody>
                 </table>
                 </div>

                 <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div className=""><h3>Saving Incentive</h3></div>
                  <div className=""><h3>1382</h3></div>
                 </div>

                 <div>
                 <table className="table "style={{overflow:'scroll',  border:'1px solid black'}}>
                 <thead>
                 <tr style={{overflow:'scroll',border:'1px solid black' }}>
                             <th style={{textAlign:'center',width:100,border:'1px solid black'}} colSpan={2}>Outstanding</th>
                             <th style={{textAlign:'center',width:100,border:'1px solid black'}} colSpan={2}>2222222</th>       
                </tr>
                </thead>
                </table>
                  </div>
                
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div className=""><h3>Collection Rate Incentive</h3></div>
                  <div className=""><h3>8000</h3></div>
                 </div>
               
                 <div>
                 <table className="table "style={{overflow:'scroll',  border:'1px solid black'}}>
                 <thead>
                 <tr style={{overflow:'scroll',border:'1px solid black' }}>
                             <th style={{textAlign:'center',width:100,border:'1px solid black'}}>Demand</th>
                             <th style={{textAlign:'center',width:100,border:'1px solid black'}}>Actual</th>       
                </tr>
                 </thead>
                 <tbody style={{ textAlign:'center'}}>
                  <tr>
                  <td style={{ border:'1px solid black' }}>32435324</td>
                  <td style={{ border:'1px solid black' }}>324323454</td>
                  </tr>
                   </tbody>
                 </table>
                 </div>

                 <div style={{display:'flex',justifyContent:'space-between'}}>
                  <div className=""><h3>PAR Deduction</h3></div>
                  <div className=""><h3>34000</h3></div>
                 </div>
               
                 <div>
                 <table className="table "style={{overflow:'scroll',  border:'1px solid black'}}>
                 <thead>
                 <tr style={{overflow:'scroll',border:'1px solid black' }}>
                             <th style={{textAlign:'center',width:100,border:'1px solid black'}}>No.s</th>
                             <th style={{textAlign:'center',width:100,border:'1px solid black'}}>Amount</th>       
                </tr>
                 </thead>
                 <tbody style={{ textAlign:'center'}}>
                  <tr>
                  <td style={{ border:'1px solid black' }}>32435324</td>
                  <td style={{ border:'1px solid black' }}>324323454</td>
                  </tr>
                   </tbody>
                 </table>
                 </div>
                   </div>
                   </div>
                  </div>  */
}
