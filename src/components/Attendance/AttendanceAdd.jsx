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
   handleClick(){
    this.getGeolocation()
   }
   getGeolocation(){
    if(navigator.geolocation){
        console.log("ssss");
        navigator.geolocation.getCurrentPosition((position)=>{ console.log(position.coords.latitude);
            this.setState({
                latti:position.coords.latitude,
                longi:position.coords.longitude
            })
        })
    }
   }


      
    
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