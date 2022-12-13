import React,{Component} from "react";
import { main_url } from '../../../utils/CommonFunction';
import DatePicker from "react-datetime";
import Select from "react-select";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
const $ = require('jquery');


export default class QuarterlyIncentive extends Component{
    constructor(props){
        super(props);
        this.state={
            newDoc:[],
            dataSource:[],
            regionList : [],
            branchList : [],
            departmentList : [],
            quater_list : [],
            selected_month : new Date(),
            selected_region :'',
            selected_branch :'',
            selected_department :'',
            selected_quarter:'', 
            loading:false,
            quarter:'',
            quarter_months:[
              {value:1,month1:'Jan',month2:'Feb',month3:'March'},
              {value:2,month1:'April',month2:'May',month3:'June'},
              {value:3,month1:'July',month2:'Aug',month3:'Sept'},
              {value:4,month1:'Oct',month2:'Nov',month3:'Dec'},

            ]

        }};
        componentDidMount(){
            this.$el = $(this.el);
            this.getRegionList();
            this.getBranchList();
            this.getDepartment();
            this.getQuaterList();
            // this.setDataTable(this.state.dataSource);
        }

        getDepartment(){
            fetch(main_url + `main/getDepartment`)
            .then((res) => {
              if (res.ok) return res.json();
            })
            .then((res1) => {
              res1.unshift({ label: "All", value: 0 })
              this.setState({ departmentList: res1 });
            })
            .catch((error) => console.error(`Fetch Error =\n`, error));
          };

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
          };

        getRegionList() {
            fetch(`${main_url}benefit/getRegionList`)
                .then(res => { if (res.ok) return res.json() })
                .then(list => {
                    let lists = list.unshift({ state_id: 0, state_name: 'All' })
                    this.setState({
                        regionList: list.map(v => ({ ...v, label: v.state_name, value: v.state_id }))
                    })
                })
          };

        getQuaterList() {
            fetch(`${main_url}team_building/getQuater`)
                .then(res => { if (res.ok) return res.json() })
                .then(list => {
                    this.setState({
                        quater_list: list
                    })
                })
          };

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

        handleSelectedMonth = (event) => {
            this.setState({
                selected_month: event,
              });
          };
          
        handleSelectedBranch = (event) => {
            if (event !== null)
              this.setState({
                selected_branch: event,
              });
          };

        handleSelectedQuater = (event) => {
            this.setState({
                selected_quarter: event
            })
          };

        checkFiles(e) {       
            var files = document.getElementById("attachment").files;
            var newFile = [];
            for(let i = 0; i < files.length; i++) {
              var getfile = document.querySelector("#attachment").files[i];
              newFile.push(getfile)
           this.setState({
              newDoc:newFile})
            };
          };

        actionClick = (e)=>{  console.log(e,this.state.dataSource.length)
          if (e == 0)  {
            document.querySelector("#attachment").value = "";
            this.setState({
              dataSource:[]
            })} 
           
            if ( this.state.dataSource.length > 0 && (e == 1 || e == 2 || e ==0 )){
              let status = 0
              fetch(`${main_url}incentive/quartelyGenerate/${this.state.selected_quarter.value}/${moment(this.state.selected_month).format("YYYY")}/${e}`)
              .then((res) => {
                status=res.status;
                return res.text();
              })
              .then((text) => {
             if (e != 0){
              toast.success(text);
             }  
              });
            } else {
              toast.error("Please Calculate First!");
            }
          };

        calculate(e){ 
         
        if (this.state.newDoc.length == 0 )  { 
            toast.error("Please Choose Attachment File!")
        } else {
          this.setState({
            loading:true
          })
        const formdata = new FormData();
        var imagedata = this.state.newDoc[0];
        formdata.append("uploadfile", imagedata);
        let status = 0;
        fetch(`${main_url}incentiveCo/quartelyImportFile/${moment(this.state.selected_month).format("YYYY")}/${this.state.selected_quarter.value}`, {
            method: "POST",
            body: formdata,
          })
            .then((res) => {
              status = res.status;
              return res.json();
            })
            .then( (response) => {
             this.setState({
               dataSource:response,
               quarter:response[0].quarter,
               loading:false
             })
            })}
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
                employment_id: data[i].employment_id ? data[i].employment_id : "-",
                co_count:data[i].request_type == 1 ? "Back Pay Salary" : data[i].request_type ==2 ? "Refund Salary" : "•	Temporary Contract Salary",
                co_incentive: data[i].fullname ? data[i].fullname : "-",
                co_incentive_total: data[i].designations ? data[i].designations : "-",
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
                { title: "Employee Id", data: "employment_id" },
                { title: "CO Count", data: "co_count" },
                { title: "CO Incentive", data: "co_incentive" },
                { title :"CO Incentive Total",data:"co_incentive_total"},
              ],
            });
          };

  render(){   
            return(
        <div>
          <ToastContainer/>
          <div className='col-lg-2' >
        <label>Select Year</label>
        <DatePicker
            dateFormat="YYYY"
            value={this.state.selected_month}
            timeFormat={false}
            onChange={this.handleSelectedMonth}

           /></div>
         
          <div className='col-lg-2' >
          <label>Select Quarter</label>
          <Select
            dateFormat="YYYY"
            options={this.state.quater_list}
            value={this.state.selected_quarter}
            timeFormat={false}
            onChange={this.handleSelectedQuater}

           /></div>

          <div className='col-lg-2' >
        <label>Region</label>
        <Select 
          options={this.state.regionList}
          onChange={this.handleSelectedRegion}
          value={this.state.selected_region}
          className="react-select-container"
           classNamePrefix="react-select"/></div>

          <div className='col-lg-2' >
        <label>Branch </label>
        <Select 
          options={this.state.branchList}
          onChange={this.handleSelectedBranch}
          value={this.state.selected_branch}
          className="react-select-container"
          classNamePrefix="react-select"/></div>

          <div className='col-lg-2' style={{marginBottom:20}} >
        <label>Department</label>
        <Select 
          options={this.state.departmentList}
          onChange={this.handleSelectedDeaprtment}
          value={this.state.selected_department}
          className="react-select-container"
          classNamePrefix="react-select"/></div>
          
          <div className="row" style={{paddingTop:25,marginLeft:15}}><button className='btn-primary btn'>Search</button></div>
  
          <div className="col-lg-2" style={{ paddingTop: 8 }}>
            <input
              // className="dropZone"
              type="file"
              id="attachment"
              // name="attachment"
              onChange={()=> this.checkFiles()}
              style={{ height: 30 }}
            ></input>
           </div>

          <div
            className="col-lg-2"
            style={{
              // marginTop: "22px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button className="btn-primary btn" onClick={ ()=>this.calculate()}>Calculate</button>
           </div>

           <div
            className="col-lg-2"
            style={{
              // marginTop: "22px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <button className="btn-primary btn" onClick={ ()=>this.actionClick(1)}>Pay Slip Generate</button>
           </div>

          <div>
            {/* <div>
                <table
                      width="99%"
                      className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                      id="dataTables-Table"/>
                      </div> */}
          { this.state.loading ? ( <div className="col-lg-12" style={{display:'flex',justifyContent:'center' }}><h1>Loading...</h1></div>) : 
          this.state.dataSource.length > 0 ? (
          
             <div>
             <table className="table table-bordered" style={{overflow:'scroll'}}>
              <thead>
              <tr style={{overflow:'scroll',backgroundColor:"blue",color:'white' }}>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>No</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>ID</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Name</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Position</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} colSpan={3}>Monthly Salary</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Average Salary</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Department Score</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Bsc %</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Incentive</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Remark</th>
                </tr>
                <tr> 
                  <th style={{ textAlign: "center", verticalAlign: "middle" }}>{this.state.quarter_months.filter(v=>v.value==this.state.quarter)[0].month1}</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }}>{this.state.quarter_months.filter(v=>v.value==this.state.quarter)[0].month2}</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }}>{this.state.quarter_months.filter(v=>v.value==this.state.quarter)[0].month3}</th>
                </tr>
              </thead>
              <tbody style={{ textAlign: "center" }}>
                 {
                    this.state.dataSource.map((v,i)=>{
                      return(
                        <>
                  <tr>
                    <td>{i+1}</td>
                    <td>{v.employeeID}</td>
                    <td>{v.name}</td>
                    <td>{v.position}</td>
                    <td>{v.month1}</td>
                    <td>{v.month2}</td>
                    <td>{v.month3}</td>
                    <td>{v.average_salary}</td>
                    <td>{v.dpt_score}</td>
                    <td>{v.BSC}</td>
                    <td>{v.incentive}</td>
                    <td>{v.remark}</td>
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
                <button className="btn-primary btn" onClick={()=>this.actionClick(2)}>Generate</button>
              </div>

            </div>
             </div>):('')
               }  
           </div>
         </div>
            )
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
