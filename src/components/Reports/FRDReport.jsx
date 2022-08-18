import React, { Component } from "react";
import { main_url } from '../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import moment from "moment";

class FRDReport extends Component {

    constructor(props) {
        super(props);
        this.state = {

            
            data: [],
            listTotal: [],
            date:[],
            Managerial_Final_Total:0,
            OtherStaff_Final_Total:0,
            NewStaff_Final_Total:0,
            TotalStaff_Final_Total:0,
            QuitStaff_Final_Total:0
            
        }
    }
    componentDidMount() {
       
    }
    handleDate=async(event)=>{
        
        this.setState({
            date:event
        })
    }
    handleSearchData(){
        let date=moment(this.state.date).format("YYYY-MM-DD");
        this.getFRDReport(date);
    }
    getFRDReport = (date) => {
        fetch(`${main_url}report/FRDReport/${date}`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((list) => {
                let totalList = list;
                let Managerial_Final_Total=0;
                let OtherStaff_Final_Total=0;
                let TotalStaff_Final_Total=0;
                let NewStaff_Final_Total=0;
                let QuitStaff_Final_Total=0;

                totalList.forEach((v1,i1)=>{
                    let Managerial_total=0;
                    let OtherStaff_total=0;
                    let TotalStaff_total=0;
                    let NewStaff_total=0;
                    let QuitStaff_total=0;
                    let Managerial_subTotal=v1.Managerial_staff;
                    let OtherStaff_subTotal=v1.Other_staff;
                    let TotalStaff_subTotal=v1.Total_staff;
                    let NewStaff_subTotal=v1.New_staff;
                    let QuitStaff_subTotal=v1.Quit_staff;
                    
                    Managerial_total+=Managerial_subTotal;
                    Managerial_Final_Total+=Managerial_total;
                    OtherStaff_total+=OtherStaff_subTotal;
                    OtherStaff_Final_Total+=OtherStaff_total;
                    TotalStaff_total+=TotalStaff_subTotal;
                    TotalStaff_Final_Total+=TotalStaff_total;
                    NewStaff_total+=NewStaff_subTotal;
                    NewStaff_Final_Total+=NewStaff_total;
                    QuitStaff_total+=QuitStaff_subTotal;
                    QuitStaff_Final_Total+=QuitStaff_total;

                    console.log("Managerial Final total",Managerial_Final_Total)
                })
                // totalList.forEach((v1, i1) => {
                //     let total = 0;
                //     v1.designations.forEach(v2 => {
                //         let subTotal = v2.gender.filter(v => typeof v == "number").reduce((p, c) => { return p + c }, 0);
                //         // console.log("sub total ====>", subTotal)
                //         total += subTotal;
                //     })
                //     collectedTotal[i1] = total;
                // });


                this.setState({
                    Managerial_Final_Total:Managerial_Final_Total,
                    OtherStaff_Final_Total:OtherStaff_Final_Total,
                    TotalStaff_Final_Total:TotalStaff_Final_Total,
                    NewStaff_Final_Total:NewStaff_Final_Total,
                    QuitStaff_Final_Total:QuitStaff_Final_Total,
                    data: list
                })


            })
    }



    render() {

        return (
            <div>
                <div className="row  white-bg dashboard-header">
                  <h3 className="" style={{paddingLeft:"5px"}}>FRD Report</h3>
                <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 0px' }}>
                <DatePicker
                  dateFormat="DD/MM/YYYY"
                  value={this.state.date}
                  onChange={this.handleDate}
                  timeFormat={false}
                />                                              
           <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
                </div>
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
                           
                            <th style={{ width: 50, textAlign: 'center',borderColor:'white' }}>No. of Staff recruited/Joined</th>
                            <th style={{ width: 50, textAlign: 'center',borderColor:'white' }}>No. of Staff terminated/quit/left</th>
                        </tr>
                    </thead>
                    <tbody>

                            {
                              this.state.data.map((v1,i)=>{
                                    return(
                                        <>
                                        <tr style={{ textAlign:'cente',borderColor:'white'}}>
                                            <td style={{textAlign:'center',borderColor:'white'}}>{i+1}</td>
                                            <td style={{textAlign:'center',borderColor:'white'}}>{v1.branch_name}</td>
                                            <td style={{textAlign:'center',borderColor:'white'}}>{v1.region_name}</td>
                                            <td style={{textAlign:'center',borderColor:'white'}}>-</td>
                                            <td style={{textAlign:'center',borderColor:'white'}}>{v1.Managerial_staff}</td>
                                            <td style={{textAlign:'center',borderColor:'white'}}>{v1.Other_staff}</td>
                                            <td style={{textAlign:'center',borderColor:'white'}}>{v1.Total_staff}</td>
                                            <td style={{textAlign:'center',borderColor:'white'}}>{v1.New_staff}</td>
                                            <td style={{textAlign:'center',borderColor:'white'}}>{v1.Quit_staff}</td>
                                        </tr>
                                        </>
                                    )
                                })
                            }
                            <tr>
                                <td style={{textAlign:'center'}} colSpan={3}>
                                    Total
                                </td>
                                <td style={{textAlign:'center'}}>-</td>
                                <td style={{textAlign:'center'}}>{this.state.Managerial_Final_Total}</td>
                                <td style={{textAlign:'center'}}>{this.state.OtherStaff_Final_Total}</td>
                                <td style={{textAlign:'center'}}>{this.state.TotalStaff_Final_Total}</td>
                                <td style={{textAlign:'center'}}>{this.state.NewStaff_Final_Total}</td>
                                <td style={{textAlign:'center'}}>{this.state.QuitStaff_Final_Total}</td>
                               
                            </tr>
                    </tbody>

                </table>
                </div>
            </div>
            </div>
        )
    }
}
export default FRDReport;