import React, { Component } from "react";
import { main_url } from '../../utils/CommonFunction';

class RegionStaffReport extends Component {

    constructor(props) {
        super(props);
        this.state = {

            
            data: [],
            listTotal: []
            
        }
    }
    componentDidMount() {
        this.getRegionStaffReport()
    }

    getRegionStaffReport = () => {
        fetch(`${main_url}report/RegionStaffReport`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((list) => {
                let totalList = list;
                let collectedTotal = [];
                totalList.forEach((v1, i1) => {
                    let total = 0;
                    v1.designations.forEach(v2 => {
                        let subTotal = v2.gender.filter(v => typeof v == "number").reduce((p, c) => { return p + c }, 0);
                        // console.log("sub total ====>", subTotal)
                        total += subTotal;
                    })
                    collectedTotal[i1] = total;
                });


                this.setState({
                    listTotal: collectedTotal,
                    data: list
                })


            })
    }



    render() {

        return (
            <div>
                <table className="table table-bordered">
                    <thead>
                        <tr style={{ backgroundColor: 'blue', color: 'white' }}>
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

                    </tbody>

                </table>
            </div>
        )
    }
}
export default RegionStaffReport;