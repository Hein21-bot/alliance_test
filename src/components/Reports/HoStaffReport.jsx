import React, { Component } from "react";
import { main_url } from '../../utils/CommonFunction';
import { thingsToDoController } from "../Dashboard/DashboardApi/ThingsToDoController";
class HoStaffReport extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            listTotal: [],
            headlistTotal:[],
            headData:[],
            FinalHeadTotal:[],
            FinalTotal:[],
            head: null,
            headCollectedTotal:[],
            TotalStaffHO:[],
            region_final_total:0,
            branch_final_total:0,
        }
    }
    componentDidMount() {
        this.getHoStaffReportMiddle()
        this.getTotalStaffHO()
    }
    getTotalStaffHO(){
        fetch(main_url+"report/totalStaffHO").then((res)=>{
            if(res.ok) return res.json();
        }).then((list)=>{
            let data=list;
            let region_total=0;
            let region_final_total=0;
            let branch_totl=0;
            let branch_final_total=0;
            data.forEach(v2=>{
                let region_subTotal=v2.region_staff_total;
                let branch_subTotal=v2.branch_staff_total;
                console.log("region total",region_subTotal)
            })
            this.setState({
                TotalStaffHO:list,
                region_final_total:region_final_total,
                branch_final_total:branch_final_total
            })
        })
    }

    getHoStaffReportMiddle = () => {
        fetch(`${main_url}report/HOstaffReport`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((list) => {
                let totalList = list;
                let HeadDepartment = list;
                let headData = HeadDepartment.filter(d => d.deptname == 'Head Department')
               
                let head = headData.reduce((p,c)=>{
                    let result = p;
                    if(p == null){
                        result = c;
                    }else{
                        result.designations.push(...c.designations);
                    }
                    
                    return result
                }, null);
                console.log("head",head)
                
                let headcollectedTotal=[];
                let finalHeadTotal=0;
                let finalTotal=0;
               
                    let total=0;
                    head.designations.forEach(v2=>{
                        let subTotal=v2.gender.filter(v=>typeof v=="number").reduce((p,c)=>{return p+c},0);
                        total+=subTotal;
                    })
                    headcollectedTotal=total;
                   
                let collectedTotal = [];
                let middleTotal=0;
                console.log("total list",totalList)
                totalList.forEach((v1, i1) => {
                    let total = 0;
                    v1.designations.forEach(v2 => {
                        let subTotal = v2.gender.filter(v => typeof v == "number").reduce((p, c) => { return p + c }, 0);
                        // console.log("sub total ====>", subTotal)
                        total += subTotal;
                    })
                    collectedTotal[i1] = total;
                    middleTotal+=collectedTotal[i1];
                });
                finalTotal=middleTotal+headcollectedTotal


                this.setState({
                    listTotal: collectedTotal,
                    headlistTotal:headcollectedTotal,
                    data: list,
                    headData:headData,
                    head:head,
                    FinalHeadTotal:finalHeadTotal,
                    FinalTotal:finalTotal,
                    headCollectedTotal:headcollectedTotal
                })


            })
    }



    render() {

        return (
            <div>
                 <div className="row  white-bg dashboard-header">
                  <h3 className="">HO Staff Report</h3>
                <table className="table table-bordered">
                    <thead>
                        <tr style={{ backgroundColor: '#27568a', color: 'white' }}>
                            <th style={{ width: 100, textAlign: 'center', borderColor: 'white' }}>Department</th>
                            <th style={{ width: 200, textAlign: 'center', borderCOlor: 'white' }}>Position</th>
                            <th style={{ width: 50, textAlign: 'center', borderColor: 'white' }}>Male</th>
                            <th style={{ width: 50, textAlign: 'center', borderColor: 'white' }}>Female</th>
                            <th style={{ width: 50, textAlign: 'center', borderColor: 'white' }}>Total</th>

                        </tr>
                    </thead>
                    <tbody>
                        
                        {
                            this.state.head && this.state.head.designations.map((designation,i)=>{
                                return(
                                    <>
                                        <tr style={{textAlign:'center'}}>
                                            <td colSpan={2}>{designation.designations}</td>
                                            <td >{(designation.gender[0].toLowerCase() == "male" && designation.gender.length == 2) ? designation.gender[1] : (designation.gender.length == 4) ? designation.gender[3] : "-"}</td>
                                                <td > {designation.gender[0].toLowerCase() == "female" ? designation.gender[1] : "-"}</td>
                                                {i==-0 ? <td  rowSpan={3}>{this.state.headCollectedTotal}</td> : null}
                                        </tr>
                                    </>
                                )
                            })
                        }
                        
                        
                        {this.state.data.map((state, k) => (

                            <>

                                {state.designations.filter(d => d.designations != "CEO" && d.designations != "CFO" && d.designations != "COO").map((designation, i) => {

                                    return (
                                        <>

                                            <tr style={{ textAlign: 'center', borderColor: 'white' }}>

                                                {i === 0 ? <td rowSpan={state.designations.length}>{state.deptname}</td> : null}
                                                {/* <td rowSpan={state.designations.length}>{state.deptname}</td> */}
                                                <td>{designation.designations}</td>
                                                <td>{(designation.gender[0] !=null && designation.gender[0].toLowerCase() == "male" && designation.gender.length == 2) ? designation.gender[1] : (designation.gender.length == 4) ? designation.gender[3] : "-"}</td>
                                                <td> {designation.gender[0] !=null && designation.gender[0].toLowerCase() == "female" ? designation.gender[1] : "-"}</td>
                                                {/* <td rowSpan={state.designations.length}>{this.state.listTotal[k]}</td> */}
                                                {i === 0 ? <td rowSpan={state.designations.length}>{this.state.listTotal[k]}</td> : null}
                                            </tr>
                                        </>


                                    )
                                })}
                            </>
                        ))}

                        <tr style={{textAlign:'center',border:'white'}}>
                            <td colSpan={4}>Total</td>
                            <td>{this.state.FinalTotal}</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} colSpan={4}>Regional Staff</td>
                            <td style={{textAlign:'center'}}>{this.state.TotalStaffHO.map(v=>{
                                return(
                                    <>{v.region_staff_total}</>
                                )
                            })}</td>
                        </tr>
                        <tr>
                            <td style={{textAlign:'center'}} colSpan={4}>Branch Staff</td>
                            <td style={{textAlign:'center'}}>{this.state.TotalStaffHO.map(v=>{
                                return(
                                    <>{v.branch_staff_total}</>
                                )
                            })}</td>
                        </tr>
                        <tr style={{textAlign:'center'}}>
                            <td colSpan={4}>Grand Total</td>
                            <td>{this.state.FinalTotal+ (this.state.TotalStaffHO.length>=2?this.state.TotalStaffHO[0].region_staff_total+this.state.TotalStaffHO[1].branch_staff_total:0)}</td>
                        </tr>

                    </tbody>

                </table>
            </div>
            </div>
        )
    }
}
export default HoStaffReport;