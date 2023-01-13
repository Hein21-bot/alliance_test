import React,{Component} from "react";
import { main_url } from '../../../utils/CommonFunction';
import DatePicker from "react-datetime";
import Select from "react-select";
import moment from "moment";
import { toast, ToastContainer } from "react-toastify";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

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
            selected_quarter:{value: 1, label: "Jan to March"},
            loading:false,
            quarter:'',
            viewButton:false,
            quarter_months:[
              {value:1,month1:'Jan',month2:'Feb',month3:'March'},
              {value:2,month1:'April',month2:'May',month3:'June'},
              {value:3,month1:'July',month2:'Aug',month3:'Sept'},
              {value:4,month1:'Oct',month2:'Nov',month3:'Dec'},
              

            ],
            validate:0
        }};
        componentDidMount(){
            this.$el = $(this.el);
            this.getRegionList();
            this.getBranchList();
            this.getDepartment();
            this.getQuaterList();
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

        handleSelectedQuater = (event) => {
            this.setState({
                selected_quarter: event
            })
          };
   
        handleSearch(){     
    const branchId = this.state.selected_branch ? this.state.selected_branch.value : 0
    const designationId = this.state.selected_department ? this.state.selected_department.value : 0
    const regionId = this.state.selected_region ? this.state.selected_region.state_id : 0
    const employee = this.state.selected_employeeId ? this.state.selected_employeeId.value : 0
    const quarterSelect  =  this.state.selected_quarter ? this.state.selected_quarter.value :0 
    fetch(main_url + "salary_report/quartelyReport/" + employee + "/" + designationId + "/" + branchId + "/" + regionId + "/" + quarterSelect + "/" + moment(this.state.selected_month).format('YYYY') + "/" +'0' ) 
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        // if (list.length > 0){
        this.setState({
          dataSource:list || [],
            quarter: this.state.selected_quarter.value,

        })
      // }else{
      //     this.setState({
      //       dataSource:list, })
      //   }
      })
          }

        checkFiles(e) {  
          this.setState({
            newDoc:[]
          })     
            var files = document.getElementById("attachment").files;
            var newFile = [];
            for(let i = 0; i < files.length; i++) {
              var getfile = document.querySelector("#attachment").files[i];
              newFile.push(getfile)
              console.log('kkkkk',newFile);
           this.setState({
              newDoc:newFile})
            };
          };

        actionClick = (e)=>{   
          if( e === 1 ){
            this.setState({
              validate:1
            })
          } 
            if ((( this.state.dataSource.length > 0 && this.state.dataSource[0].generate !== 2) && (e == 1 || e ==0 ))||(e === 2 && this.state.validate === 1 )){ 
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
             if (e == 0)  {
              document.querySelector("#attachment").value = "";
              this.setState({
                viewButton:false,
                dataSource:[]
              })} else if (e == 2){ 
              window.location.reload();
            }
              });
              
            }
            else if (e === 1 && this.state.dataSource.length === 0 ){
              toast.error("Please Calculate First!");
            }
           
            else if(e === 1 && this.state.dataSource[0].generate === 2){
              toast.error("Already Calculated Pay Slip!");
            }
            else if(e === 2 && this.state.validate !== 1){
              toast.error("Please Generate PaySlip First!");
            }
          };

        calculate(e){ 
         if(this.state.selected_quarter.value == undefined){
           toast.error("Please Choose Quarter!")
         }
           else if (this.state.newDoc.length == 0 )  { 
            toast.error("Please Choose Attachment File!")
        } else {
          this.setState({
            loading:true
          })
        const formdata = new FormData();
        var imagedata = this.state.newDoc[0];
        console.log(imagedata);
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
               quarter:response[0] ? response[0].quarter : this.state.selected_quarter.value,
               loading:false,
               newDoc:[],
               viewButton:true
             })            
            })
          .catch((err) =>{ 
            toast.error('Data Is Already Calculated!')
            this.setState({
              loading:false,
              dataSource:[],

            })
          })
          }
          };

        // setDataTable(data) {
        //     var table;
        //     if ($.fn.dataTable.isDataTable("#dataTables-Table")) {
        //       table = $("#dataTables-Table").dataTable();
        //       table.fnClearTable();
        //       table.fnDestroy();
        //       $("#dataTables-Table").empty();
        //     }
        //     var l = [];
        //     for (var i = 0; i < data.length; i++) {
        //       const index = i;
        //       const result = data[i];
        //       const obj = {
        //         no: index + 1,
        //         employment_id: data[i].employment_id ? data[i].employment_id : "-",
        //         co_count:data[i].request_type == 1 ? "Back Pay Salary" : data[i].request_type ==2 ? "Refund Salary" : "•	Temporary Contract Salary",
        //         co_incentive: data[i].fullname ? data[i].fullname : "-",
        //         co_incentive_total: data[i].designations ? data[i].designations : "-",
        //       };
        //       l.push(obj);
        //     }
        
        //     table = $("#dataTables-Table").DataTable({
        //       autofill: false,
        //       bLengthChange: false,
        //       bInfo: false,
        //       responsive: true,
        //       paging: false,
        //       buttons: false,
        
        //       data: l,
        //       columns: [
        //         { title: "Employee Id", data: "employment_id" },
        //         { title: "CO Count", data: "co_count" },
        //         { title: "CO Incentive", data: "co_incentive" },
        //         { title :"CO Incentive Total",data:"co_incentive_total"},
        //       ],
        //     });
        //   };

  render(){   
            return(
        <div>
          <ToastContainer/>
          <h3 style={{margin:'15px 15px 15px 0px'}}>Quarterly Incentive</h3>
          <div className="col-lg-12" style={{padding:0}}>
          <div className='col-lg-2' style={{margin:'0px 0px 0px 0px',padding:'0px 15px 0px 0px'}} >
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
          
          <div className="row" style={{margin:'25px 15px 0px 15px'}}><button className='btn-primary btn' onClick={()=>this.handleSearch()}>Search</button></div>
            </div>

          <div className="col-lg-2" style={{ padding:'8px 0px 15px 0px'}}>
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
            className="col-lg-1"
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
          
          { this.state.loading ? ( <div className="col-lg-12" style={{display:'flex',justifyContent:'center' }}><h1>Loading...</h1></div>) : 
          this.state.dataSource.length > 0 ? (
          
             <div>
                  <div className="col-lg-12" style={{padding:0}}>
             <ReactHTMLTableToExcel 
             className="btn-excel"
             table="quarterly_incentive"
             filename="Quarterly Incentive"
             buttonText="Excel"
             sheet="Sheet"
             />
             </div>
             <table id="quarterly_incentive" className="table table-bordered" style={{display: "block",
              overflowX: "Scroll",
              whiteSpace: "nowrap",}}>
              <thead>
              <tr style={{overflow:'scroll',backgroundColor:"blue",color:'white' }}>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>No</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Employee ID</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Employee Name</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Position</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Branch</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Department</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} colSpan={3}>Monthly Salary</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Average Salary</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>BSC %</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Total Incentive</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Branch Score</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Cash Team Score</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>2.5%</th>
                  
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Additional Amount(2.5%)</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Total</th>
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
                    <td>{v.employeeID ? v.employeeID:'-'}</td>
                    <td>{v.name ? v.name :'-'}</td>
                    <td>{v.position ? v.position :'-'}</td>
                    <td>{v.branch ? v.branch:'-'}</td>
                    <td>{v.department ? v.department :'-'}</td>
                    <td>{v.month1 ? v.month1 :'-'}</td>
                    <td>{v.month2 ? v.month2 : '-'}</td>
                    <td>{v.month3 ? v.month3 :'-'}</td>
                    <td>{v.average_salary ? v.average_salary :'-'}</td>
                    <td>{v.BSC ? (v.BSC * 100).toFixed(2)+'%':'-'}</td>
                    <td>{v.total_incentive ? v.total_incentive :'-'}</td>
                    <td>{v.branch_score ? v.branch_score : '-'}</td>
                    <td>{v.cash_team_score ? v.cash_team_score :'-'}</td>
                    <td>{v.incentive ? (v.incentive * 100).toFixed(2)+'%' :'-'} </td>
                    <td>{v.additional_amount ? v.additional_amount :'-'}</td>
                    <td>{v.total ? v.total :'-'}</td>
                    <td>{v.remark ? v.remark :'-'}</td>
                  </tr>
                  </>  )
                    })
                }   
              </tbody>
             </table>
{       this.state.dataSource[0].generate !== 2 ? (
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

            </div> ) : ('')
  }
             </div>):(
              <div>
                <div className="col-lg-12" style={{padding:0}}>
             <ReactHTMLTableToExcel 
             className="btn-excel"
             table="quarterly_incentive"
             filename="Quarterly Incentive"
             buttonText="Excel"
             sheet="Sheet"
             />
             </div>
           <table className="table table-bordered" id="quarterly_incentive" style={{display: "block",
           overflowX: "Scroll",
           whiteSpace: "nowrap",}}>
           <thead>
               <tr>
               <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>No</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Employee ID</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Employee Name</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Position</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Branch</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Department</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} colSpan={3}>Monthly Salary</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Average Salary</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Bsc %</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Total Incentive</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Branch Score</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Cash Team Score</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>2.5%</th>
                  
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Additional Amount(2.5%)</th>
                  <th style={{ textAlign: "center", verticalAlign: "middle" }} rowSpan={2}>Total</th>
                   <th style={{textAlign:'center',verticalAlign: "middle"}} rowSpan={2}>Remark</th>
               </tr>
               <tr>
               <th style={{ textAlign: "center", verticalAlign: "middle" }}>{this.state.quarter_months.filter(v=>v.value == this.state.selected_quarter.value)[0].month1}</th>
                 <th style={{ textAlign: "center", verticalAlign: "middle" }}>{this.state.quarter_months.filter(v=>v.value == this.state.selected_quarter.value)[0].month2}</th>
                 <th style={{ textAlign: "center", verticalAlign: "middle" }}>{this.state.quarter_months.filter(v=>v.value == this.state.selected_quarter.value)[0].month3}</th>
               </tr>
           </thead>
           <tbody>
             <td colSpan={18}style={{ textAlign: "center", verticalAlign: "middle",height:35,fontSize:15,borderBottom:'1px solid black' }}>No data available in table</td>
          
           </tbody>
         </table></div>
           )
               }  
           </div>
         </div>
            )
        }
}
