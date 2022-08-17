import React, { Component } from "react";
import { main_url } from '../../utils/CommonFunction';

class RegionWiseStaffReportCount extends Component {

    constructor(props) {
        super(props);
        this.state = {

            
            data: [
                {
                    Regions:"Mandalay Region",
                    Positions:[
                       {
                        name:"FOX",
                        gender:["male",1,"female",3]
                       },
                       {
                        name:"DBM",
                        gender:["male",1,"female",3]
                       },
                       {
                        name:"FX",
                        gender:["male",1,"female",3]
                       },
                       {
                        name:"BM",
                        gender:["male",1,"female",3]
                       },{
                        name:"CO",
                        gender:["male",1,"female",3]
                       },{
                        name:"Cashier",
                        gender:["male",1,"female",3]
                       }
                    ]
                    
                },
                {
                    Regions:"Shan Region",
                    Positions:[
                       {
                        name:"FOX",
                        gender:["male",1,"female",3]
                       },
                       {
                        name:"DBM",
                        gender:["male",1,"female",3]
                       },
                       {
                        name:"FX",
                        gender:["male",1,"female",3]
                       },
                       {
                        name:"BM",
                        gender:["male",1,"female",3]
                       },{
                        name:"CO",
                        gender:["male",1,"female",3]
                       },{
                        name:"Cashier",
                        gender:["male",1,"female",3]
                       }
                    ]
                    
                },
                {
                    Regions:"Sagaing Region",
                    Positions:[
                       {
                        name:"FOX",
                        gender:["male",1,"female",3]
                       },
                       {
                        name:"DBM",
                        gender:["male",1,"female",3]
                       },
                       {
                        name:"FX",
                        gender:["male",1,"female",3]
                       },
                       {
                        name:"BM",
                        gender:["male",1,"female",3]
                       },{
                        name:"CO",
                        gender:["male",1,"female",3]
                       },{
                        name:"Cashier",
                        gender:["male",1,"female",3]
                       }
                    ]
                    
                },
                
            ],
            listTotal: []
            
        }
    }
    componentDidMount() {
       
    }

   


    render() {

        return (
            <div>
                <table className="table table-bordered">
                    <thead>
                        <tr style={{ backgroundColor: 'blue', color: 'white' }}>
                            <th style={{textAlign:'center'}} rowSpan={2}>Region</th>
                            {/* <th style={{textAlign:'center'}} colSpan={2}>BM</th>
                            <th style={{textAlign:'center'}} colSpan={2}>DBM</th>
                            <th style={{textAlign:'center'}} colSpan={2}>FX</th>
                            <th style={{textAlign:'center'}} colSpan={2}>CO</th>
                            <th style={{textAlign:'center'}} colSpan={2}>FOX</th>
                            <th style={{textAlign:'center'}} colSpan={2}>Cashier</th> */}
                            {/* {
                                this.state.data.map((state,index)=>{
                                    console.log("state======>",state)
                                    
                                    {state.Positions.map((position,i)=>{
                                        console.log("position name===>",position.name)
                                        return(
                                            <>
                                                <th colSpan={2}>
                                                    {position.name}
                                                </th>
                                            </>
                                        )
                                    })}
                                    
                                    
                                })
                            } */}
                            {
                                this.state.data[0].Positions.map(position=>{
                                    return (
                                        <>
                                            <th style={{textAlign:'center'}} colSpan={2}>{position.name}</th>
                                        </>
                                    )
                                })
                            }
                            <th style={{textAlign:'center'}} rowSpan={2}>Total</th>
                        </tr>
                        <tr style={{ backgroundColor: 'white', color: 'color' }}>
                            {/* <th style={{textAlign:'center'}}>Male</th>
                            <th style={{textAlign:'center'}}>Female</th>
                            <th style={{textAlign:'center'}}>Male</th>
                            <th style={{textAlign:'center'}}>Female</th>
                            <th style={{textAlign:'center'}}>Male</th>
                            <th style={{textAlign:'center'}}>Female</th>
                            <th style={{textAlign:'center'}}>Male</th>
                            <th style={{textAlign:'center'}}>Female</th>
                            <th style={{textAlign:'center'}}>Male</th>
                            <th style={{textAlign:'center'}}>Female</th>
                            <th style={{textAlign:'center'}}>Male</th>
                            <th style={{textAlign:'center'}}>Female</th> */}
                            {/* {
                                this.state.data[0].Positions.map(position=>{
                                    return(
                                        <>
                                            <th style={{textAlign:'center'}}>
                                                {console.log("string===>",position.gender.filter(v=>typeof v=="string").map(data=>{}))}
                                                {(position.gender.filter(v=>typeof v =="string")) == "male"}
                                            </th>
                                            <th style={{textAlign:'center'}}>{position.gender.filter(v=>typeof v =="string") == "female"}</th>
                                        </>
                                    )
                                })
                            } */}
                            {/* {
                                this.state.data[0].Positions.map(position=>{
                                    
                                    let gender=position.gender.filter(v=>typeof v=="string")
                                    return(
                                        <>
                                            <th>{gender[0]}</th>
                                            <th>{gender[1]}</th> 
                                        </>
                                    )
                                    
                                })
                            } */}
                            {
                                this.state.data[0].Positions.map(position=>{
                                    console.log("string====>",position.gender.filter(v=>typeof v=="string"))
                                    return(
                                        <>
                                            {
                                                position.gender.filter(v=>typeof v=="string").map(data=>{
                                                    console.log("data",data)
                                                    return(
            
                                                            <th style={{textAlign:'center'}}>{data}</th>
                                                       
                                                    )
                                                })
            
                                            }
                                        </>
                                    )
                                    
                                
                                })
                            }
                            
                        </tr>
                    </thead>
                    <tbody style={{ textAlign:'center'}}>
                        <tr>
                            <td>Mandalay North</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>12</td>
                        </tr>
                        <tr>
                            <td>Mandalay South</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>12</td>
                        </tr>
                        <tr>
                            <td>Sagaing</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>12</td>
                        </tr>
                        <tr>
                            <td>Magway</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>12</td>
                        </tr>
                        <tr>
                            <td>Shan</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>12</td>
                        </tr>
                      
                    </tbody>

                </table>
            </div>
        )
    }
}
export default RegionWiseStaffReportCount;