import React, { Component } from "react";
import { main_url } from '../../utils/CommonFunction';

class RegionWiseStaffReportCount extends Component {

    constructor(props) {
        super(props);
        this.state = {

            
            data: [
               
            ],
            listTotal: [],
            uniqueMap: null,
            mapValue: null,
            dataRow: []
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
                let totalList=list;
                let collectedTotal=[];
                totalList.forEach((v1,i1)=>{
                    let total=0;
                    v1.designations.forEach(v2 => {
                        let subTotal = v2.gender.filter(v => typeof v == "number").reduce((p, c) => { return p + c }, 0);
                        // console.log("sub total ====>", subTotal)
                        total += subTotal;
                        console.log(total);
                    })
                    collectedTotal[i1] = total;
                    
                })
                let uniqueDesign = new Set();                
                list.forEach(v => {
                    v.designations.forEach(v1 => {
                        uniqueDesign.add(v1.designations)
                    });
                });
                

                let uniqueMap = new Map();
                uniqueDesign.forEach(v=>{
                    uniqueMap.set(v, {
                        "designations": v,
                        "gender":["female", 0, "male", 0]
                    })
                });
                console.log("uniqueMap",uniqueMap)

                let mapValue = [...uniqueMap.values()]
                
                let dataRow = list;
                dataRow = dataRow.map(v=>{
                    let temp = [...v.designations];
                    v.designations = mapValue;

                    v.designations = v.designations.map(designation=>{
                        temp.forEach(originValue=>{
                            if(designation.designations == originValue.designations){
                                designation = originValue;
                            }
                            
                        })
                        return designation;
                    })
                    return v;
                })

                
                console.log("DataRow",dataRow);

                
                this.setState({
                    listTotal:collectedTotal,
                    dataRow,
                    uniqueMap:uniqueMap,
                    mapValue,
                    data: list
                })


            })
    }

   


    render() {

        return (
            <div style={{overflowX:'auto'}}>
                <h3 className="">RegionWiseStaff Report</h3>
                <table className="table table-bordered" style={{overflow:'scroll'}}>
                    <thead>
                        <tr style={{ backgroundColor: 'blue', color: 'white',overflow:'scroll' }}>
                            <th style={{textAlign:'center',width:100}} rowSpan={2}><div style={{width:100}}>Region</div></th>
                            {
                                    this.state.mapValue != null && this.state.mapValue.map((v1)=>{
                                        
                                        return(
                                            <th style={{textAlign:'center',width:100}} colSpan={2}>
                                                {v1.designations}
                                            </th>
                                        ) 
                                    })
                                }
                            
                            <th style={{textAlign:'center'}} rowSpan={2}><div style={{width:100}}>Total</div></th>
                        </tr>
                        <tr style={{ backgroundColor: 'white', color: 'color' }}>
                            
                            {
                                this.state.mapValue != null && this.state.mapValue.map((v1)=>{
                                    return(
                                        <>
                                        
                                                <th style={{textAlign:'center'}}>Male</th>
                                                <th style={{textAlign:'center'}}>Female</th>
                                                </>
                                                
                                        
                                    )
                                })
                            }
                            
                        </tr>
                    </thead>
                    <tbody style={{ textAlign:'center'}}>
                            {
                                this.state.dataRow.map((v1,k)=>{
                                    return(
                                        <tr>
                                             <td style={{borderColor:'white'}}>{v1.branch_name}</td>
                                        {
                                            v1.designations.map((designation,i)=>{
                                                return(
                                                    <>
                                                            <td style={{ borderColor: 'white' }}>{(designation.gender[0].toLowerCase() == "male" && designation.gender.length == 2) ? designation.gender[1] : (designation.gender.length == 4) ? designation.gender[3] : 0}</td>
                                                            <td style={{ borderColor: 'white' }}> {designation.gender[0].toLowerCase() == "female" ? designation.gender[1] : 0}</td>  
                                                           
                                                    </>
                                                )
                                            })
                                        }
                                        <td>{this.state.listTotal[k]}</td>
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