import React from "react";
import { Component } from "react";



export default class AttendanceAdd extends Component{
    constructor(){
        super();
        this.state={
            latti:'',
            longi:''
        }
    }
    componentDidMount(){
       
    }
     success(data) { console.log(data);
        const crd = data.coords;
      this.setState({
        latti: crd.latitude,
        longi: crd.longitude
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
     
      navigator.geolocation.getCurrentPosition(this.success.bind(this), error, options);
   
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

    render(){ console.log(this.state.latti);
        return(
            <div>
               <input placeholder={this.state.latti}></input>
               <input placeholder={this.state.longi}></input>
               <button onClick={this.handleClick.bind(this)}>get location</button>
               <input disabled='true'></input>
               <button>checkin</button>
               <button>checkout</button>
               

            </div>
        )
    }
}