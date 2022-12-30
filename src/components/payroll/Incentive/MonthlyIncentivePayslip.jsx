import React,{Component} from 'react';
import { main_url,getUserId } from "../../../utils/CommonFunction";
import DatePicker from "react-datetime";
import moment from "moment";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.min.css";

export default class MonthlyIncentivePayslip extends Component{
constructor(props){
    super(props);
    this.state={
      user_id: getUserId("user_info"),
      coData:[],
      dataSource:[],
      employeeIdList: [],
      EmployeeNameList: [],
      regionList: [],
      branchList: [],
      designationList: [],
      fxData:[],
      selected_month: new Date(),
      componentIndex: "main",
      selected_region: "",
      selected_branch: "",
      selected_designation: "",
      selected_employeeID: "",
      selected_employee: "",
      selected_type:0,
      
    }
}
componentDidMount(){
    this.getEmployeeCodeList();
    this.getEmployeeName();
    this.getBranchList();
    this.getRegionList();
    this.getDesignationList();
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
  };

  getDesignationList() {
    fetch(`${main_url}main/getDesignations`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          designationList: list,
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

  getIncentive () {
    fetch(`${main_url}incentive/findDesignation/${moment(this.state.selected_month).format("YYYY-MM")}/${this.state.user_id}`)
    .then((res)=>{
      if(res.ok) return res.json();
    })
    .then((list) =>{
      this.setState({
        dataSource:list
          })
      if (list[0].CoFx === 'FX'){
      this.setState({
    fxData:list,
    selected_type:2
      })}else{
        this.setState({
          coData:list,
          selected_type:1
            })
      }
    })
    .catch((error)=>{

    })
  }

render(){
    return( 
        <div>
          <ToastContainer position={toast.POSITION.TOP_RIGHT} />
          <h3 style={{margin:'15px 15px 15px 0px'}}>Monthly Incentive Payslip</h3>
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

          <div
            className="col-lg-3"
            style={{
              marginTop: "25px",
            }}
          >
            <button className="btn-primary btn"  onClick={()=>this.getIncentive()} >Search</button>
          </div>
        </div>
{  this.state.selected_type == 1 ?( this.state.coData.length > 0  ? ( 
  <div className="row" style={{display:'flex',justifyContent:'space-around'}}>
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

 <div className=' col-lg-5' style={{  paddingTop: '10px' }}><div className='col-lg-10'><p>{this.state.coData[0].employment_id}</p>
 <p>{this.state.coData[0].fullname ? this.state.coData[0].fullname :'-'}</p>
 <p>{this.state.coData[0].deptname ? this.state.coData[0].deptname :'-'}</p>
 <p>{this.state.coData[0].designations ? this.state.coData[0].designations :'-'}</p>
 <p>{this.state.coData[0].location_master_name ? this.state.coData[0].location_master_name :'-'}</p>
 <p>{this.state.coData[0].monthIncentive ? this.state.coData[0].monthIncentive :'-'}</p>
 </div></div>

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


 <div className=' col-lg-5' style={{ paddingTop: '10px' }}><div className='col-lg-10'><p>{this.state.coData[0].credit_incentive}</p>

 <p>{this.state.coData[0].saving_incentive ? this.state.coData[0].saving_incentive :'0'}</p>
 <p>{this.state.coData[0].collection_rate ? this.state.coData[0].collection_rate :'0'}</p>
 <p>{this.state.coData[0].PAR_deduction}</p>
 <p>{this.state.coData[0].total ? this.state.coData[0].total :'-'}</p>
 </div></div>
  </div>

 <div className='col-lg-4 col-md-4 col-sm-12' style={{ background: 'white',marginTop:30,border:"1px solid grey " }}>                
 <div className="" style={{display:'flex',justifyContent:'center', background: '#1872ab',marginTop:20}}><h2 style={{color:"white",marginTop:10,fontSize:18,fontWeight:"bold"}}>Detail Calculation</h2>
 </div>

<div style={{padding:50,paddingTop:10,paddingBottom:0}}>
<div style={{display:'flex',justifyContent:'space-between'}}>
 <div className=""><h3>Credit Incentive</h3></div>
 <div className=""><h3>{this.state.coData[0].detailCalaultaion[0].credit_incentive ? this.state.coData[0].detailCalaultaion[0].credit_incentive :'0'}</h3></div>
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
 <td style={{ border:'1px solid black' }}>{this.state.coData[0].detailCalaultaion[0].disbursementNo ? this.state.coData[0].detailCalaultaion[0].disbursementNo :'0'}</td>
 <td style={{ border:'1px solid black' }}>{this.state.coData[0].detailCalaultaion[0].disbursementAmount ? this.state.coData[0].detailCalaultaion[0].disbursementAmount :'0'}</td>
 <td style={{ border:'1px solid black' }}>{this.state.coData[0].detailCalaultaion[0].portfolioNo ? this.state.coData[0].detailCalaultaion[0].portfolioNo :'0'}</td>
 <td style={{ border:'1px solid black' }}>{this.state.coData[0].detailCalaultaion[0].portfolioAmount ? this.state.coData[0].detailCalaultaion[0].portfolioAmount :'0'}</td>
 </tr>
  </tbody>
</table>
</div>

<div style={{display:'flex',justifyContent:'space-between'}}>
 <div className=""><h3>Saving Incentive</h3></div>
 <div className=""><h3>{this.state.coData[0].detailCalaultaion[0].saving_incentive ? this.state.coData[0].detailCalaultaion[0].saving_incentive :'0'}</h3></div>
</div>

<div>
<table className="table "style={{overflow:'scroll',  border:'1px solid black'}}>
<thead>
<tr style={{overflow:'scroll',border:'1px solid black' }}>
            <td style={{textAlign:'center',width:100,border:'1px solid black',fontWeight:'bold'}} colSpan={2}>Outstanding</td>
            <td style={{textAlign:'center',width:100,border:'1px solid black'}} colSpan={2}>{this.state.coData[0].detailCalaultaion[0].savingOutstanding ? this.state.coData[0].detailCalaultaion[0].savingOutstanding :'0'}</td>       
</tr>
</thead>
</table>
 </div>

 <div style={{display:'flex',justifyContent:'space-between'}}>
 <div className=""><h3>Collection Rate Incentive</h3></div>
 <div className=""><h3>{this.state.coData[0].detailCalaultaion[0].collection_rate ? this.state.coData[0].detailCalaultaion[0].collection_rate :'0'}</h3></div>
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
 <td style={{ border:'1px solid black' }}>{this.state.coData[0].detailCalaultaion[0].collectionRateDemand ? this.state.coData[0].detailCalaultaion[0].collectionRateDemand :'0'}</td>
 <td style={{ border:'1px solid black' }}>{this.state.coData[0].detailCalaultaion[0].collectionActual ? this.state.coData[0].detailCalaultaion[0].collectionActual :'0'}</td>
 </tr>
  </tbody>
</table>
</div>

<div style={{display:'flex',justifyContent:'space-between'}}>
 <div className=""><h3>PAR Deduction</h3></div>
 <div className=""><h3>{this.state.coData[0].detailCalaultaion[0].PAR ? this.state.coData[0].detailCalaultaion[0].PAR :'0'}</h3></div>
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
 <td style={{ border:'1px solid black' }}>{this.state.coData[0].detailCalaultaion[0].parNo ? this.state.coData[0].detailCalaultaion[0].parNo :'0'}</td>
 <td style={{ border:'1px solid black' }}>{this.state.coData[0].detailCalaultaion[0].parAmount ? this.state.coData[0].detailCalaultaion[0].parAmount :'0'}</td>
 </tr>
  </tbody>
</table>
</div>
  </div>
  </div>
  </div>):('')

):(  this.state.fxData.length > 0 && this.state.fxData != undefined ? ( 

       <div className="row" style={{display:'flex',justifyContent:'center'}}>
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

                 <div className=' col-lg-5' style={{ paddingLeft: '90px', paddingTop: '10px' }}><p>{this.state.fxData[0].fullname ? this.state.fxData[0].fullname :'-'}</p>
                 <p>{this.state.fxData[0].employeeID  ? this.state.fxData[0].employeeID :'-'}</p>
                 <p>{this.state.fxData[0].deptname ? this.state.fxData[0].deptname :'-'}</p>
                 <p>{this.state.fxData[0].designations ? this.state.fxData[0].designations :'-'}</p>
                 <p>{this.state.fxData[0].location_master_name ? this.state.fxData[0].location_master_name :'-'}</p>
                 <p>{this.state.fxData[0].monthIncentive ? this.state.fxData[0].monthIncentive : '-'}</p>
                 </div>

                 <div className="row " style={{display:'flex',justifyContent:'center',paddingTop:20}}><h3>Incentive Information</h3>
                 </div>
                 <div className='col-lg-6' style={{ paddingLeft: '100px', paddingTop: '10px' }}><p>CO Count </p>
                 <p>Co Incentive Total</p>
                 <p>Incentive Amount </p>
                 </div>

                 <div className='col-lg-1' style={{ paddingLeft: '0px', paddingTop: '10px' }} ><p>:</p>
                 <p>:</p>
                 <p>:</p>
                 </div>

                
                 <div className=' col-lg-5' style={{ paddingLeft: '90px', paddingTop: '10px', marginBottom:20 }}><p>{this.state.fxData[0].coCount}</p>
                 <p>{this.state.fxData[0].coIncentiveTotal ? this.state.fxData[0].coIncentiveTotal :'0'}</p>
                 <p>{this.state.fxData[0].incentiveAmount ? this.state.fxData[0].incentiveAmount :'0'}</p>
                 </div>
                    </div>
                  </div> ):('')

)
}
        </div>
    )
}
}