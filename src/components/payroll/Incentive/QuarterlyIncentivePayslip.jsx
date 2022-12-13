import React,{Component} from "react";
import { main_url,getUserId } from "../../../utils/CommonFunction";
import DatePicker from "react-datetime";
import Select from "react-select";
import moment from "moment";



export default class QuarterlyIncentivePayslip extends Component{
    constructor(props){
        super(props);
        this.state={ 
            user_id: getUserId("user_info"),
            dataSource:[],
            quater_list:[],
            selected_quarter:'', 
            selected_month : new Date(),
        }}

        componentDidMount(){
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
            fetch(`${main_url}incentive/quartelyPayslip/${this.state.selected_quarter.value}/${moment(this.state.selected_month).format("YYYY")}/${this.state.user_id}`)
            .then((res)=>{
              if(res.ok) return res.json();
            })
            .then((list) =>{
              this.setState({
                dataSource:list
                  })
        })
    }

        render(){   
            return( 
                <div>
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

          <div className="row" style={{paddingTop:25,marginLeft:15}} onClick={()=>this.handleSearch()}><button className='btn-primary btn'>Search</button></div>


{ this.state.dataSource.length > 0 ? (
                <div className="row" style={{display:'flex',justifyContent:'center'}}>

                <div className='col-lg-7 col-md-8 col-sm-12' style={{ background: 'white',marginTop:30,border:"1px solid grey " }}>
            
             <div className="" style={{display:'flex',justifyContent:'center',marginTop:20}}><h2 style={{marginTop:10,fontSize:18,fontWeight:"bold"}}>Quarterly Incentive</h2></div>
             <div className="" style={{display:'flex',justifyContent:'center',backgroundColor:'#1872ab',marginTop:20}}><h3 style={{color:'white'}}>Staff Information</h3></div>
             <div className='col-lg-6' style={{ paddingLeft: '100px', paddingTop: '10px' }}><p>Staff ID</p>
             <p>Name</p>
             <p>Department</p>
             <p>Designation</p>
             <p>Branch</p>
             <p>Start Month</p>
             <p>End Month</p>
             </div>

             <div className='col-lg-1' style={{ paddingLeft: '0px', paddingTop: '10px' }} ><p>:</p>
             <p>:</p>
             <p>:</p>
             <p>:</p>
             <p>:</p>
             <p>:</p>
             <p>:</p>
             </div>

             <div className=' col-lg-5' style={{ paddingLeft: '90px', paddingTop: '10px' }}><p>{this.state.dataSource[0].employeeID}</p>
             <p>{this.state.dataSource[0].name}</p>
             <p>{this.state.dataSource[0].deptname}</p>
             <p>{this.state.dataSource[0].position}</p>
             <p>{this.state.dataSource[0].location_master_name}</p>
             <p>{this.state.dataSource[0].start_month}</p>
             <p>{this.state.dataSource[0].end_month}</p>
             </div>
 
             <div className="row col-lg-12" style={{display:'flex',justifyContent:'center',marginTop:20 , background: '#1872ab',marginLeft:0}}><h3 style={{color:'white'}}>Incentive Information</h3>
             </div>

             <div className='col-lg-6' style={{ paddingLeft: '100px', paddingTop: '10px' }}><p>Average salary</p>
             <p>Deaprtment Score</p>
             <p>BSC%</p>
             <p style={{fontWeight:'bold'}}>Incentive Amount</p>
             </div>

             <div className='col-lg-1' style={{ paddingLeft: '0px', paddingTop: '10px' }} ><p>:</p>
             <p>:</p>
             <p>:</p>
             <p>:</p>
             </div>
            
             <div className=' col-lg-5' style={{ paddingLeft: '90px', paddingTop: '10px', marginBottom:20 }}><p>{this.state.dataSource[0].average_salary}</p>
             <p>{this.state.dataSource[0].dpt_score}</p>
             <p>{this.state.dataSource[0].BSC}</p>
             <p style={{fontWeight:'bold'}}>{this.state.dataSource[0].incentive}</p>
             </div> 

             <div style={{marginBottom:30}}><span>Remark:</span></div>
                </div>

              </div>):('')}
              </div>
            )}
}







