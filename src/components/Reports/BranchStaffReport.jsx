import React, { Component } from "react";
import { main_url } from '../../utils/CommonFunction';

class BranchStaffReport extends Component {

    constructor(props) {
        super(props);
        this.state = {

            
            data: [],
            listTotal: []
            
        }
    }
    componentDidMount() {
        this.getBranchStaffReportMiddle()
    }

    getBranchStaffReportMiddle = () => {
        fetch(`${main_url}report/BranchStaffReport`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((list) => {
                let totalList = list;
                let collectedTotal = [];
                let finalTotal=0;
                let finalMaleTotal=0;
                let finalFemaleTotal=0;
                totalList.forEach((v1,i1)=>{
                    let total=0;
                    v1.designations.forEach(v2=>{
                        let maleSubTotal=(v2.gender[0].toLowerCase() == "male" && v2.gender.length == 2) ? v2.gender[1] : (v2.gender.length == 4) ? v2.gender[3] : 0
                        console.log("malesubtotal===>",maleSubTotal)
                        total +=maleSubTotal;
                        
                    })
                    finalMaleTotal+= total;
                    console.log("final male total===>",finalMaleTotal)

                })
                totalList.forEach((v1,i1)=>{
                    let total=0;
                    v1.designations.forEach(v2=>{
                        let femaleSubTotal=v2.gender[0].toLowerCase() == "female" ? v2.gender[1] : 0
                        total +=femaleSubTotal;
                        
                    })
                    finalFemaleTotal+= total;
                    

                })
                totalList.forEach((v1, i1) => {
                    let total = 0;
                    v1.designations.forEach(v2 => {
                        let subTotal = v2.gender.filter(v => typeof v == "number").reduce((p, c) => { return p + c }, 0);
                        // console.log("sub total ====>", subTotal)
                        total +=subTotal;
                        // console.log("total===>",total)
                    })
                    collectedTotal[i1] = total;
                   finalTotal+=collectedTotal[i1]
                });


                this.setState({
                    listTotal: collectedTotal,
                    FinalTotal:finalTotal,
                    FinalMaleTotal:finalMaleTotal,
                    FinalFemaleTotal:finalFemaleTotal,
                    data: list
                })


            })
    }



    render() {

        return (
            <div>
                <div className="row  white-bg dashboard-header">
                  <h3 className="">Branch Staff Report</h3>
                <table className="table table-bordered">
                    <thead>
                        <tr style={{ backgroundColor: '#27568a', color: 'white' }}>
                            <th style={{ width: 100, textAlign: 'center',borderColor:'white' }}>Branch</th>
                            <th style={{ width: 200, textAlign: 'center',borderCOlor:'white' }}>Position</th>
                            <th style={{ width: 50, textAlign: 'center',borderColor:'white' }}>Male</th>
                            <th style={{ width: 50, textAlign: 'center',borderColor:'white' }}>Female</th>
                            <th style={{ width: 50, textAlign: 'center',borderColor:'white' }}>Total</th>

                        </tr>
                    </thead>
                    <tbody>

                        
                        {this.state.data.map((state, k) => (

                            <>
                               
                                {state.designations.map((designation, i) => {
                                  
                                    return (
                                        <>

                                            <tr style={{ textAlign: 'center',borderColor:'white' }}>

                                                {i === 0 ? <td style={{borderColor:'white'}} rowSpan={state.designations.length}>{state.branch_name}</td> : null}
                                               
                                                <td style={{borderColor:'white'}}>{designation.designations}</td>
                                                <td style={{borderColor:'white'}}>{(designation.gender[0].toLowerCase() == "male" && designation.gender.length == 2) ? designation.gender[1] : (designation.gender.length == 4) ? designation.gender[3] : "-"}</td>
                                                <td style={{borderColor:'white'}}> {designation.gender[0].toLowerCase() == "female" ? designation.gender[1] : "-"}</td>
                                               
                                                {i === 0 ? <td style={{borderColor:'white'}} rowSpan={state.designations.length}>{this.state.listTotal[k]}</td> : null}
                                                
                                            </tr>
                                        </>


                                    )
                                })}
                            </>
                        ))}
                        <tr style={{
                            backgroundColor:'#27568a',color:'white'
                        }}>
                        <td style={{textAlign:'center'}} colSpan={2}>Total</td>
                        <td style={{textAlign:'center'}}>{this.state.FinalMaleTotal}</td>
                        <td style={{textAlign:'center'}}>{this.state.FinalFemaleTotal}</td>
                            <td style={{textAlign:'center'}}>{this.state.FinalTotal}</td>
                        </tr>
                        
                    </tbody>

                </table>
            </div>
            </div>
        )
    }
}
export default BranchStaffReport;