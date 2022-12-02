import React,{Component} from 'react';
const $ = require('jquery');



export default class MonthlyIncentiveUpload extends Component{
constructor(props){
    super(props);
    this.state={
      dataSource:[],
      type:this.props.type,
    }
}
componentDidMount(){
    this.$el = $(this.el);
    this.setDataTable(this.state.dataSource);
}

// checkFiles(e) {
//     this.setState({
//       loading: true,
//     });
//     var files = document.getElementById("attachment").files;
//     var newDoc = this.state.newDoc;

//     for (let i = 0; i < files.length; i++) {
//       var getfile = document.querySelector("#attachment").files[i];
//       newDoc.push(getfile);
//     }
//     // document.querySelector("#attachment").value = "";
//     const formdata = new FormData();
//     var imagedata = newDoc[0];
//     formdata.append("uploadfile", imagedata);
//     formdata.append("data", this.state.steps[this.state.activeStep]);
//     let status = 0;
//     fetch(main_url + "payrollCalculate/addPayroll/"+moment(this.props.filterDate).format('YYYY-MM'), {
//       method: "POST",
//       body: formdata,
//     })
//       .then((res) => {
//         status = res.status;
//         return res.json();
//       })
//       .then(async (response) => {
//         if (status == 200) {
//           console.log('ma thi bu chit tal')
//           this.setState({ dataSource: response, loading: false });
//           await this._setTableData(response);
//         } else {
//           toast.error("Fail to Save Information", {
//             position: "top-right",
//             autoClose: 5000,
//             hideProgressBar: false,
//             closeOnClick: true,
//             pauseOnHover: true,
//             draggable: true,
//           });
//           this.setState({
//             loading: false,
//           });
//         }
//       });
//   }

backClick = (e) =>{
  console.log("sdfsdfsdfsdfsdfsdf")
  window.location.reload();
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
  }

render(){ console.log(this.state.type)
    return( 
        <div>
        <div 
                  className="col-md-12 col-lg-12"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  <div>
                    <label
                      htmlFor="attachment"
                      className="custom-file-label"
                      style={{ marginTop: 50, marginRight: 20 }}
                    >
                      {this.state.type.label} Monthly Incentive
                    </label>
                  </div>
                  <div className="">
                    <input
                      className="dropZone"
                      type="file"
                      id="attachment"
                      name="attachment"
                    //   onChange={this.checkFiles.bind(this)}
                    ></input>
                  </div>
                  <div><button className='btn-primary btn' onClick={this.backClick.bind(this)}>Back</button></div>
                </div>
              {
                this.state.type.value == 1 ? (
                  <div>

                 <div className='col-lg-12'>
                  <table
                      width="99%"
                     className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                    id="dataTables-Table"
                    /> </div>

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
                  </div>
                 </div>
                  
                
                ): this.state.type.value == 0 ? (
                 
                 <div>  
                  {/* <div>
                   <table
                       width="99%"
                       className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                       id="dataTables-Table"
                     /> </div> */}

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
                <tr>         <th style={{textAlign:'center',border:'1px solid black'}}>No.s</th>
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
                   </div>

                  <div>
                    <table className="table table-bordered" id="reg_wise_staff" style={{overflow:'scroll'}}>
                      <thead>
                      <tr style={{ backgroundColor: 'blue', color: 'white',overflow:'scroll' }}>                 
                          <th style={{textAlign:'center',verticalAlign:'middle'}} rowSpan={3}>Employee ID</th>
                          <th style={{textAlign:'center'}} colSpan={4}>Credit</th>
                          <th style={{textAlign:'center'}}>Saving</th>
                          <th style={{textAlign:'center'}} colSpan={2}>Collection Rate</th>
                          <th style={{textAlign:'center'}} colSpan={2}>PAR</th>
                          <th style={{textAlign:'center',verticalAlign:'middle'}}rowSpan={3}>Credit Incentive</th>
                          <th style={{textAlign:'center',verticalAlign:'middle'}}rowSpan={3}>Saving Incentive</th>
                          <th style={{textAlign:'center',verticalAlign:'middle'}}rowSpan={3}>Collective Rate Incentive</th>
                          <th style={{textAlign:'center',verticalAlign:'middle'}}rowSpan={3}>PAR Deduction Incentive</th>
                        </tr>
                        <tr>
                          <th style={{textAlign:'center'}}colSpan={2}>Disbursement</th>
                          <th style={{textAlign:'center'}}colSpan={2}>Portfolio</th>
                          <th style={{textAlign:'center',verticalAlign:'middle'}}rowSpan={2}>Outstanding</th>
                          <th style={{textAlign:'center',verticalAlign:'middle'}}rowSpan={2}>Demand</th>
                          <th style={{textAlign:'center',verticalAlign:'middle'}}rowSpan={2}>Actual</th>
                          <th style={{textAlign:'center',verticalAlign:'middle'}}rowSpan={2}>NO.s</th>
                          <th style={{textAlign:'center',verticalAlign:'middle'}}rowSpan={2}>Amount</th>
                        </tr>
                        <tr>
                          <th>NO.s</th>
                          <th>Amount</th>
                          <th>NO.s</th>
                          <th>Outstanding</th>
                        </tr>
                      </thead>
                      <tbody style={{ textAlign:'center'}}>
                          <td>1</td>
                          <td>2</td>
                          <td>3</td>
                          <td>4</td>
                          <td>5</td>
                          <td>6</td>
                          <td>7</td>
                          <td>8</td>
                          <td>9</td>
                          <td>10</td>
                          <td>11</td>
                          <td>12</td>
                          <td>13</td>
                          <td>14</td>
                      </tbody>

                     </table>



                  </div>

              </div>
                ) : null
              }






        </div>
    )
}









}