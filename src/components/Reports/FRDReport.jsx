import React, { Component } from "react";
import { main_url } from '../../utils/CommonFunction';

class FRDReport extends Component {

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
                        <tr>
                            <td colSpan={10} style={{backgroundColor:'white',color:'black',textAlign:'center'}}>Staff Information</td>
                        </tr>
                        <tr style={{ backgroundColor: 'blue', color: 'white' }}>
                            <th style={{ width: 30, textAlign: 'center',borderColor:'white'}}>Sr No</th>
                            <th style={{ width: 100, textAlign: 'center',borderCOlor:'white' }}>Branch</th>
                            <th style={{ width: 100, textAlign: 'center',borderColor:'white' }}>Region</th>
                            <th style={{ width: 50, textAlign: 'center',borderColor:'white' }}>No.of filed staff(Client Officers,FX)</th>
                            <th style={{ width: 50, textAlign: 'center',borderColor:'white' }}>Managerial Staff</th>
                            <th style={{ width: 50, textAlign: 'center',borderColor:'white' }}>Other Staff</th>
                            <th style={{ width: 50, textAlign: 'center',borderColor:'white' }}>Total Staff</th>
                            <th style={{ width: 50, textAlign: 'center',borderColor:'white' }}>Total Staff</th>
                            <th style={{ width: 50, textAlign: 'center',borderColor:'white' }}>No. of Staff recruited/Joined</th>
                            <th style={{ width: 50, textAlign: 'center',borderColor:'white' }}>No. of Staff terminated/quit/left</th>
                        </tr>
                    </thead>
                    <tbody>
                            
                    </tbody>

                </table>
            </div>
        )
    }
}
export default FRDReport;