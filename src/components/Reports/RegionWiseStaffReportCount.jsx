import React, { Component } from "react";
import { main_url } from '../../utils/CommonFunction';

class RegionWiseStaffReportCount extends Component {

    constructor(props) {
        super(props);
        this.state = {

            
            data: [
               
            ],
            listTotal: []
            
        }
    }
    componentDidMount() {
       this.getWiseStaffReport()
    }
    getWiseStaffReport=()=>{
        fetch(`${main_url}report/regionWiseReport`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((list) => {
                
                this.setState({
                    
                    data: list
                })


            })
    }

   


    render() {

        return (
            <div style={{overflowX:'auto'}}>
                <table className="table table-bordered" style={{overflow:'scroll'}}>
                    <thead>
                        <tr style={{ backgroundColor: 'blue', color: 'white',overflow:'scroll' }}>
                            <th style={{textAlign:'center',width:100}} rowSpan={2}><div style={{width:100}}>Region</div></th>
                            {
                                    this.state.data.map((v1)=>{
                                        
                                        return(
                                            <>{
                                                v1.designations.map((designation)=>{
                                                    return(
                                                        <th style={{textAlign:'center'}} colSpan={2}>
                                                            <div style={{width:100}}>{designation.designations}</div>
                                                            </th>
                                                    )
                                                })
                                            }
                                            </>
                                        ) 
                                    })
                                }
                            
                            <th style={{textAlign:'center'}} rowSpan={2}>Total</th>
                        </tr>
                        <tr style={{ backgroundColor: 'white', color: 'color' }}>
                            
                            {
                                this.state.data.map(v1=>{
                                    return(
                                        <>
                                        {
                                            v1.designations.map(designation=>{
                                                return(
                                                    <>
                                                <th style={{textAlign:'center'}}>Male</th>
                                                <th style={{textAlign:'center'}}>Female</th>
                                                </>
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
                       
                           
                            {
                                this.state.data.map(v1=>{
                                    return(
                                        <tr>
                                             <td style={{borderColor:'white'}}>{v1.branch_name}</td>
                                        {
                                            v1.designations.map(designation=>{
                                                return(
                                                    <>
                                                            <td style={{ borderColor: 'white' }}>{(designation.gender[0].toLowerCase() == "male" && designation.gender.length == 2) ? designation.gender[1] : (designation.gender.length == 4) ? designation.gender[3] : "-"}</td>
                                                            <td style={{ borderColor: 'white' }}> {designation.gender[0].toLowerCase() == "female" ? designation.gender[1] : "-"}</td>  
                                                    </>
                                                )
                                            })
                                        }
                                        </tr>
                                    )
                                })
                            }
                    </tbody>

                </table>
            </div>
        )
    }
}
export default RegionWiseStaffReportCount;