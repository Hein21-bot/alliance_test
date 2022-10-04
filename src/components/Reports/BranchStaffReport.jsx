import React, { Component } from "react";
import { main_url } from '../../utils/CommonFunction';
import ReactHTMLTableToExcel from "react-html-table-to-excel";
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
                let prepSortedList = [];
                prepSortedList['Branch Manager']=1;
                prepSortedList['DBM']=2;
                prepSortedList['Sr Manager']=3
                prepSortedList['Field Executive']=4;
                prepSortedList['Recovery Officer']=5
                prepSortedList['Client Officer']=6;
                prepSortedList['Senior Client Officer']=7;
                prepSortedList['FOX']=8;
                prepSortedList['Senior BA / Cashier']=9;
                prepSortedList['Security']=10;
                prepSortedList['Cleaner']=11;
                let collectedTotal = [];
                let finalTotal=0;
                let finalMaleTotal=0;
                let finalFemaleTotal=0;
                totalList.forEach((v1,i1)=>{
                    let total=0;
                    v1.designations.forEach(v2=>{
                        let maleSubTotal=(v2.gender[0] !=null && v2.gender[0].toLowerCase() == "male" && v2.gender.length == 2) ? v2.gender[1] : (v2.gender.length == 4) ? v2.gender[3] : 0
                      
                        total +=maleSubTotal;
                        
                    })

                    v1.designations.sort((a,b)=>{
                        let v1 = prepSortedList[a.designations];
                        let v2 = prepSortedList[b.designations];
                        if(!v1){
                            v1 = 13
                        }
                        if(!v2){
                            v2 = 13
                        }
                        
                        return v1-v2;
                    });
                    finalMaleTotal+= total;
                   

                })
                totalList.forEach((v1,i1)=>{
                    let total=0;
                    v1.designations.forEach(v2=>{
                        let femaleSubTotal=(v2.gender[0] !=null && v2.gender[0].toLowerCase() == "female") ? v2.gender[1] : 0
                        total +=femaleSubTotal;
                        
                    })
                    finalFemaleTotal+= total;
                    

                })
                totalList.forEach((v1, i1) => {
                    let total = 0;
                    v1.designations.forEach(v2 => {
                        let subTotal = v2.gender.filter(v => typeof v == "number").reduce((p, c) => { return p + c }, 0);
                        
                        total +=subTotal;
                       
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
                  <ReactHTMLTableToExcel 
                    className="btn-excel"
                    table="branch_staff"
                    filename="Branch Staff Report"
                    buttonText="Excel"
                    sheet="Sheet"
                    />
                <table className="table table-bordered" id="branch_staff">
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

                                            <tr style={{ textAlign: 'center'}}>

                                                {i === 0 ? <td rowSpan={state.designations.length} style={{verticalAlign:'middle'}}>{state.branch_name}</td> : null}
                                               
                                                <td>{designation.designations}</td>
                                                <td>{(designation.gender[0] !=null && designation.gender[0].toLowerCase() == "male" && designation.gender.length == 2) ? designation.gender[1] : (designation.gender.length == 4) ? designation.gender[3] : "-"}</td>
                                                <td> {designation.gender[0] !=null &&  designation.gender[0].toLowerCase() == "female" ? designation.gender[1] : "-"}</td>
                                               
                                                {i === 0 ? <td rowSpan={state.designations.length} style={{verticalAlign:'middle'}}>{this.state.listTotal[k]}</td> : null}
                                                
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