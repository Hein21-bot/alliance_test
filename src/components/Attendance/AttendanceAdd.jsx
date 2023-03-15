import React from "react";
import { Component } from "react";
import { toast ,ToastContainer} from "react-toastify";
import Rodal from 'rodal';
import { main_url,getUserId,getAttendanceReason } from "../../utils/CommonFunction";
import Select from 'react-select';



export default class AttendanceAdd extends Component{
    constructor(){
        super();
        this.state={
          user_id: getUserId("user_info"),
            latti:'',
            longi:'',
            modal:false,
            visible:true,
            message:'',
            showReason:false,
            reason:'',
            reasonType:'',
            type:'',
            fieldLocation:'',
            reasonList:[],
            missAtt:false
           
        }
    }
   async componentDidMount(){
    let reasonList= await getAttendanceReason()
    this.setState({
      reasonList:reasonList
    })
    
    }
// getAttendanceReason(){
//   fetch(`${main_url}attendance/fieldAttendanceReason`)

// }

     success(data) { console.log(data);
        const crd = data.coords;
      this.setState({
        latti: crd.latitude,
        longi: crd.longitude
      })
      }
   onChangeReason(e){
     this.setState({
      reason:e.target.value
     })
   }  
   onchangeField(e) {
    this.setState({
      fieldLocation:e.target.value
    })
   }
   onchangeFieldRemark(e) {
    this.setState({
      fieldRemark:e.target.value
    })
   }
   onchangeFieldReason(e){
this.setState({
  reason:e
})
   }
   handleClick(){
    // this.getGeolocation()
    const options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      };
      
      
      function error(err) {
        alert(`ERROR(${err.code}): ${err.message}`);
      }
      if(window.location.protocol !== 'http:'){
        console.log('https');
        navigator.geolocation.getCurrentPosition(this.success.bind(this), error, options);
      }else{
        console.log('http');
        fetch(`http://ip-api.com/json`)
        .then(response => {
          return response.json();
        }).then(res =>{
          this.setState({
            latti:res.lat,
            longi: res.lon
          })
        }).catch(err =>{
          console.log('error',err);
        })
      }
   }
   handleChechIn(){
    if(this.state.latti === '' || this.state.longi === ''){
      toast('Please Fill Your Location First!')
    } else {
      let obj = {
        latitude: this.state.latti,
        longtitude:this.state.longi,
      };
      fetch(`${main_url}attendance/checkLoginCondition`,{
        method:'POST',
        body:JSON.stringify(obj)
      })
      .then(response => {
        return response.json();
      })
      .then(res => {
        if (res.holiday1 == true) {
          this.setState({
            modal:true,
            message:'You make attendance on holiday. Do you want to make a Holiday Attendance Request?',
            reasonType:'Holiday Check In',
            type:'1'

          })
         
        } else if (res.location1 == true) {
          this.setState({
            modal:true,
            message:'Your attendance location is out of office, Do you want to make Field Attendance?',
            reasonType:'Field Check In',
            type:'2'
          })
         
        }else if (res.check_time1 == true) {
          this.setState({
            modal:true,
            message:'Your attendance time is late, Do you want to make Late Attendance Request',
            reasonType:'Late Check In',
            type:'3'
          })
          
        }
      })
    }
   }

   handleChechOut(){
    if(this.state.latti === '' || this.state.longi === ''){
      toast('Please Fill Your Location First!')
    } else {
      let obj = {
        latitude: this.state.latti,
        longtitude:this.state.longi,
      };
      fetch(`${main_url}attendance/checkLogoutCondition`,{
        method:'POST',
        body:JSON.stringify(obj)
      })
      .then(response => {
        return response.json();
      })
      .then(res => {
        if (res.holiday1 === true) {
          this.setState({
            modal:true,
            message:'You make attendance on Holiday. Do you want to make a Holiday Attendance Request?',
            reasonType:'Holiday Check Out',
            type:'4'
          })
         
        } else if (res.location1 === true) {
          this.setState({
            modal:true,
            message:'Your attendance location is out of office, Do you want to make Field Attendance?',
            reasonType:'Field Check Out',
            type:'5'
          })
         
        }else if (res.check_out_time1 === true) {
          this.setState({
            modal:true,
            message:'Your attendance time is early, Do you want to make Early Check Out Request?',
            reasonType:'Early Check Out',
            type:'6'
          })
          
        }
      })
    }
   }
   handleComfirm(){
  var typeOne = this.state.type
  if(this.state.user_id != getUserId("user_info")){
    toast('User Id is not the same !')
    return;
  }
   switch (typeOne){  
    case '1' :
      var obj = {
      data: {
          userId:this.state.user_id,
          latitude:this.state.latti,
          longtitude:this.state.longi,
          holidayCheckIn: true,
          holidayDescription:this.state.reason,
      }
    };
    break;
   case '2' :
    var obj = {
      data: {
        userId:this.state.user_id,
        latitude:this.state.latti,
        longtitude:this.state.longi,
        fieldCheckIn: true,
        fieldLocation:this.state.fieldLocation,
        fieldReason:this.state.reason.label,
        fieldRemark:this.state.fieldRemark,
      }
    };
    break;
    case '3' :
      var obj = {
        data: {
          userId:this.state.user_id,
          latitude:this.state.latti,
          longtitude:this.state.longi,
          lateCheckIn: true,
          lateCheckInReason:this.state.reason,
        }
      };
      break;
    case '4' :
      var obj = {
        data: {
          userId:this.state.user_id,
          latitude:this.state.latti,
          longtitude:this.state.longi,
          holidayCheckOut: true,
        }
      };
      break;
    case '5' :
      var obj = {
        data: {
          userId:this.state.user_id,
          latitude:this.state.latti,
          longtitude:this.state.longi,
          fieldCheckOut: true,
          fieldCheckOutLocation:this.state.fieldLocation,
          fieldCheckOutReason:this.state.reason.label,
          fieldCheckOutRemark:this.state.fieldRemark,
        }
      };
      break;
    case '6' :
      var obj = {
        data: {
          userId:this.state.user_id,
          latitude:this.state.latti,
          longtitude:this.state.longi,
          earlyCheckOut: true,
          earlyCheckOutReason:this.state.reason,
        }
      };  
      break;  
      default:  
      var obj = {
        data: ''
      };  
    } 
    if ((this.state.reason === '' )){ console.log(this.state.fieldReason,this.state.reason)
      toast('Please Fill Reason First!')
    } else if(this.state.type === '1' || this.state.type === '2' || this.state.type === '3' ){
      let status = 0;
      fetch(`${main_url}attendance/addAttendance`,{
        method:'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body:JSON.stringify(obj)
      })
      .then(response => {
        status=response.status
        return response.text();
      })
      .then(text =>{
        if(status === 400){
          this.setState({
            modal:true,
            message:text,
            missAtt:true
          })
        }else if (status === 200){
          window.location.reload()
           toast(text)
        }
      })
      .catch(err =>
        console.log(err)
      )
    }else if (this.state.type === '4' || this.state.type === '5' || this.state.type === '6' ){   console.log("api");
    let status = 0;
    fetch(`${main_url}attendance/editAttendance`,{
        method:'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body:JSON.stringify(obj)
      })
      .then(response => { 
        status=response.status
        return response.text();
      })
      .then(text =>{
        
        if(status === 400){
        this.setState({ 
          modal:true,
          message:text,
          missAtt:true
        })
      }else if (status === 200){
        window.location.reload()
         toast(text)
      }
      })
      .catch(err =>
        console.log(err)
      )
      
    }
   }
   show(){
    if (this.state.missAtt){
      var typeOne = this.state.type
switch (typeOne){
  case '4' :
    var obj = {
      data: {
        userId:this.state.user_id,
        latitude:this.state.latti,
        longtitude:this.state.longi,
        holidayCheckOut: true,
      }
    };
    break;
  case '5' :
    var obj = {
      data: {
        userId:this.state.user_id,
        latitude:this.state.latti,
        longtitude:this.state.longi,
        fieldCheckOut: true,
        fieldCheckOutLocation:this.state.fieldLocation,
        fieldCheckOutReason:this.state.reason.label,
        fieldCheckOutRemark:this.state.fieldRemark,
      }
    };
    break;
  case '6' :
    var obj = {
      data: {
        userId:this.state.user_id,
        latitude:this.state.latti,
        longtitude:this.state.longi,
        earlyCheckOut: true,
        earlyCheckOutReason:this.state.reason,
      }
    };  
    break;  
    default:  
    var obj = {
      data: ''
    }; 
    }
      fetch(`${main_url}attendance/addAttendancePolicyNoCheckInData`,{
        method:'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body:JSON.stringify(obj)
      })
      .then(response => {
        return response.text();
      })
      .then(text =>{
        this.setState({ modal: false,latti:'',longi:'',showReason:false,missAtt:false });
        toast(text)
      })
      .catch(err => toast(err))

    } else {
    this.setState({
     showReason:true,
     modal:false
    })}
   }

   hide(e) {
    if (this.state.type === '3' && e === 1){
      var obj = {
        data: {
          userId:this.state.user_id,
          latitude:this.state.latti,
          longtitude:this.state.longi,
          lateCheckIn: true,
    }}
    fetch(`${main_url}attendance/addAttendance`,{
      method:'POST',
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      body:JSON.stringify(obj)
    })
    .then(response => {
      return response.text();
    })
    .then(text =>{
      this.setState({ modal: false,latti:'',longi:'',showReason:false,missAtt:false });
      toast(text)
    })
    .catch(err => console.log(err))
  } else {
this.setState({ modal: false,latti:'',longi:'',showReason:false,missAtt:false });
  }
}
//    getGeolocation(){
    
//     if(navigator.geolocation){
//         console.log("ssss");
       
//         navigator.geolocation.getCurrentPosition((position)=>{ console.log(position.coords.latitude);
//             this.setState({
//                 latti:position.coords.latitude,
//                 longi:position.coords.longitude
//             })
//         },(err)=>{
//             alert(err.message)
//         })
//     } else{
//         alert('Location is not Support on your browser')
//     }
//    }

    render(){ 
        return(

        <div>
          <ToastContainer/>
           { this.state.modal ? 
        <div>
        <Rodal width={400} height={223} visible={this.state.modal} onClose={this.hide.bind(this)} padding={20}>
                  <div className="col-md-12 mt20">
                        <p style={{fontSize:'20px',fontWeight:'bold',textAlign:'center'}}>Attendance</p>
                    </div>
                    <div className="col-md-12">
                      <p>{this.state.message}</p>
                      <div className="col-lg-12 col-md-12 col-sm-12 " style={{marginTop: '20px'}}>
                      <div className="col-lg-2 col-md-2 col-sm-2"></div>
                      <div className="col-lg-8 col-md-8 col-sm-8" style={{display:'flex',justifyContent:'space-evenly'}}>
                      <button className="btn btn-danger" onClick={()=>this.hide(1)}><span>Cancel</span> </button>
                      <button className="btn btn-primary" onClick={this.show.bind(this)}><span>ok</span> </button>
                      </div>
                      <div className="col-lg-2 col-md-2 col-sm-2"></div>
                      </div>
                       
                    </div>
                </Rodal>
            </div> :<></> }

            <div className="" style={{display:'flex',justifyContent:'center',padding:'20px 0px',backgroundColor:'#f3f3f4'}}>
                <div className="col-lg-7 col-md-10 col-sm-12 " style={{backgroundColor:'#ffff'}}>
                    <div className="col-lg-12">
                 <div className="col-lg-12" style={{display:'flex',justifyContent:'center'}}><h2>Attendance</h2> </div>
             
               <div className="col-lg-12" style={{marginTop:20}}>
                <div className="col-lg-5 col-md-5 col-sm-5" style={{height:35,display:'flex',justifyContent:'end',alignItems:'center'}}>
                <h5 style={{margin:0}}>Latitude</h5>
                </div>
                <div className="col-lg-7 col-md-7 col-sm-7">
                <input placeholder={this.state.latti} style={{height:35,borderRadius:5,border:'1px solid grey',width:200}}></input>
                </div>
                </div>
               
               <div className="col-lg-12" style={{marginTop:20}}>
                <div className="col-lg-5 col-md-5 col-sm-5" style={{height:35,display:'flex',justifyContent:'end',alignItems:'center'}}>
                <h5>Longitude</h5>
                </div>
                <div className="col-lg-7 col-md-7 col-sm-7" style={{padding:0}}>
                <div className="col-lg-12">
                <input placeholder={this.state.longi} style={{height:35,borderRadius:5,border:'1px solid grey',width:200}}></input></div>
                <div className="col-lg-12" style={{marginTop:20}}>
                <button onClick={this.handleClick.bind(this)} style={{height:35,backgroundColor:'#1872ab',border:'none',color:'#fff',borderRadius:5}}><i class="fa fa-street-view" aria-hidden="true"></i>  Get Location</button>
                </div>
               </div></div>
               </div>
              { this.state.showReason ? 
              <div className="col-lg-12" style={{marginTop:20}}>
               { this.state.type === '2' || this.state.type === '5' ? (
             <div>
             <div className="col-lg-12" style={{marginTop:20}}>
                <div className="col-lg-5 col-md-5 col-sm-5" style={{height:35,display:'flex',justifyContent:'end',alignItems:'center'}}>
                <h5 style={{margin:0}}>{this.state.reasonType} Location</h5>
                </div>
                <div className="col-lg-7 col-md-7 col-sm-7">
                <input placeholder={this.state.fieldLocation} style={{height:35,borderRadius:5,border:'1px solid grey',width:200}} onChange={this.onchangeField.bind(this)}></input>
                </div>
                </div>

                <div className="col-lg-12" style={{marginTop:20}}>
                <div className="col-lg-5 col-md-5 col-sm-5" style={{height:35,display:'flex',justifyContent:'end',alignItems:'center'}}>
                <h5 style={{margin:0}}>{this.state.reasonType} Reason</h5>
                </div>
                <div className="col-lg-7 col-md-7 col-sm-7">
                  <div className=""style={{width:200}}>
                <Select placeholder='Select Reason' style={{height:35,borderRadius:5,border:'1px solid grey' }} value={this.state.reason} onChange={this.onchangeFieldReason.bind(this)}  options={this.state.reasonList}/>
                </div>
                </div>
                <div className="col-lg-12" style={{marginTop:20}}>
                <div className="col-lg-5 col-md-5 col-sm-5" style={{height:35,display:'flex',justifyContent:'end',alignItems:'center'}}>
                <h5 style={{margin:0}}>{this.state.reasonType} Remark</h5>
                </div>
                <div className="col-lg-7 col-md-7 col-sm-7">
                <input placeholder={this.state.fieldRemark} style={{height:35,borderRadius:5,border:'1px solid grey',width:200}} onChange={this.onchangeFieldRemark.bind(this)}></input>
                </div>
                </div>
                </div> </div>):(
                 <div className="col-lg-12" style={{marginTop:20}}>
                 <div className="col-lg-5 col-md-5 col-sm-5" style={{height:35,display:'flex',justifyContent:'end',alignItems:'center'}}>
                 <h5 style={{margin:0}}>{this.state.reasonType} Reason</h5>
                 </div>
                 <div className="col-lg-7 col-md-7 col-sm-7">
                 <textarea placeholder={this.state.reason} style={{height:100,borderRadius:5,border:'1px solid grey'}} onChange={this.onChangeReason.bind(this)}/>
                 </div>
                 </div>)
                 }

                 <div className="col-lg-12" style={{display:'flex',justifyContent:'end',marginTop:20,marginBottom:50,padding:0}}>
                 <div className="col-lg-4 col-md-5 col-sm-7" style={{display:'flex',justifyContent:'space-evenly',padding:0}}>
                 {/* <button style={{height:35,backgroundColor:'#1872ab',border:'none',color:'#fff',borderRadius:5}} onClick={this.hide.bind(this)}>Cancel</button>          */}
                 <button style={{height:35,backgroundColor:'#1872ab',border:'none',color:'#fff',borderRadius:5}} onClick={this.handleComfirm.bind(this)}>{this.state.reasonType}</button>
                   </div>
                  </div>

                 </div>
              :  <div className="col-lg-12" style={{display:'flex',justifyContent:'center',marginTop:200,marginBottom:50}}>
              <div className="col-lg-4 col-md-5 col-sm-7" style={{display:'flex',justifyContent:'space-evenly'}}>
                 <button style={{height:35,backgroundColor:'#1872ab',border:'none',color:'#fff',borderRadius:5,width:72}} onClick={this.handleChechIn.bind(this)}>Check In</button>         
                 <button style={{height:35,backgroundColor:'#1872ab',border:'none',color:'#fff',borderRadius:5}} onClick={this.handleChechOut.bind(this)}>Check Out</button>
                   </div>
             </div>
              }
               </div>
            </div>
            </div>
        )
    }
}