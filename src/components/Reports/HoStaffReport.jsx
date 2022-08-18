import React, { Component } from "react";
import { main_url } from '../../utils/CommonFunction';
import { thingsToDoController } from "../Dashboard/DashboardApi/ThingsToDoController";
class HoStaffReport extends Component {

    constructor(props) {
        super(props);
        this.state = {

            // data:
            //     [
            //         {
            //             "deptname": "Admin",
            //             "designations": [
            //                 {
            //                     "designations": "Sr Manager",
            //                     "gender": [
            //                         "female",
            //                         1,
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Driver",
            //                     "gender": [
            //                         "male",
            //                         2
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Security",
            //                     "gender": [
            //                         "Male",
            //                         2
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Admin Officer",
            //                     "gender": [
            //                         "Female",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Admin Assistant",
            //                     "gender": [
            //                         "Male",
            //                         6
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Cleaner",
            //                     "gender": [
            //                         "Female",
            //                         1,
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Logistics Assistant",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Admin Manager",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Procurement and Logistic Officer",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Driver Incharge",
            //                     "gender": [
            //                         "Male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Procurement Assistant",
            //                     "gender": [
            //                         "male",
            //                         2
            //                     ]
            //                 },
            //                 {
            //                     "designations": "22",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 }
            //             ]
            //         },
            //         {
            //             "deptname": "Operation",
            //             "designations": [
            //                 {
            //                     "designations": "Banking Services Officer",
            //                     "gender": [
            //                         "female",
            //                         1,
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "FX (MM)",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Banking Service Manager",
            //                     "gender": [
            //                         "female",
            //                         1,
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "RM",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Product Manager",
            //                     "gender": [
            //                         "Female",
            //                         1,
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Jr Cashier",
            //                     "gender": [
            //                         "female",
            //                         1,
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Consultant",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Agriculture Product Manager",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Operation Manager",
            //                     "gender": [
            //                         "female",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Marketing Manager",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Risk Manager",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Operation Officer",
            //                     "gender": [
            //                         "Female",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "COO",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Deputy Agriculture  Product Manager",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Business Development Manager",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Cash and Back Office Manager",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Junior Transaction Officer",
            //                     "gender": [
            //                         "female",
            //                         1,
            //                         "male",
            //                         2
            //                     ]
            //                 }
            //             ]
            //         },
            //         {
            //             "deptname": "IT",
            //             "designations": [
            //                 {
            //                     "designations": "IT Manager",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "IT Assistant",
            //                     "gender": [
            //                         "female",
            //                         3,
            //                         "male",
            //                         5
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Senior IT Officer (Hardware)",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "IT Officer ( Software)",
            //                     "gender": [
            //                         "female",
            //                         1,
            //                         "male",
            //                         2
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Sr IT Officer",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "IT Officer",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Assistant Software Support Manager",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 }
            //             ]
            //         },
            //         {
            //             "deptname": "HR",
            //             "designations": [
            //                 {
            //                     "designations": "HR Officer",
            //                     "gender": [
            //                         "female",
            //                         1,
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "HR Assistant",
            //                     "gender": [
            //                         "female",
            //                         2,
            //                         "male",
            //                         3
            //                     ]
            //                 },
            //                 {
            //                     "designations": "HR Manager",
            //                     "gender": [
            //                         "female",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Sr HR Officer",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 }
            //             ]
            //         },
            //         {
            //             "deptname": "Audit",
            //             "designations": [
            //                 {
            //                     "designations": "Auditor",
            //                     "gender": [
            //                         "female",
            //                         5
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Junior Auditor",
            //                     "gender": [
            //                         "female",
            //                         7,
            //                         "male",
            //                         3
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Audit Supervisor",
            //                     "gender": [
            //                         "female",
            //                         2
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Audit Manager",
            //                     "gender": [
            //                         "female",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Senior Auditor",
            //                     "gender": [
            //                         "female",
            //                         2,
            //                         "male",
            //                         1
            //                     ]
            //                 }
            //             ]
            //         },
            //         {
            //             "deptname": "Finance",
            //             "designations": [
            //                 {
            //                     "designations": "Accountant",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Assistant Accountant",
            //                     "gender": [
            //                         "Female",
            //                         2,
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Accounting Officer",
            //                     "gender": [
            //                         "Female",
            //                         2
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Senior Reporting Officer",
            //                     "gender": [
            //                         "Female",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Treasury Officer",
            //                     "gender": [
            //                         "Female",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Junior Accountant",
            //                     "gender": [
            //                         "Female",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "CFO",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Funding Officer",
            //                     "gender": [
            //                         "female",
            //                         1
            //                     ]
            //                 }
            //             ]
            //         },
            //         {
            //             "deptname": "Training",
            //             "designations": [
            //                 {
            //                     "designations": "Training Manager",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Trainer",
            //                     "gender": [
            //                         "female",
            //                         2,
            //                         "male",
            //                         5
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Training Logistics Assistant",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Training Supervisor",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 }
            //             ]
            //         },
            //         {
            //             "deptname": "Part time",
            //             "designations": [
            //                 {
            //                     "designations": "English teacher",
            //                     "gender": [
            //                         "male",
            //                         3
            //                     ]
            //                 }
            //             ]
            //         },
            //         {
            //             "deptname": "BOD",
            //             "designations": [
            //                 {
            //                     "designations": "CEO",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 }
            //             ]
            //         },
            //         {
            //             "deptname": "Marketing",
            //             "designations": [
            //                 {
            //                     "designations": "Graphic Designer",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Customer Service Assistant",
            //                     "gender": [
            //                         "female",
            //                         2
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Customer Service Officer",
            //                     "gender": [
            //                         "female",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Marketing Manager ( New)",
            //                     "gender": [
            //                         "female",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Marketing Officer ",
            //                     "gender": [
            //                         "female",
            //                         1
            //                     ]
            //                 },
            //                 {
            //                     "designations": "Marketing Assistant",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 }
            //             ]
            //         },
            //         {
            //             "deptname": "Risk Monitoring",
            //             "designations": [
            //                 {
            //                     "designations": "Regional Risk Monitoring Officer",
            //                     "gender": [
            //                         "male",
            //                         1
            //                     ]
            //                 }
            //             ]
            //         }
            //     ]
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

            
            //     },

            // ]



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
                   
                    
                   
                
                // headData.designations != undefined && headData.designations.map((d) => {
                //     return (
                //         <tr>
                //             <td style={{ borderColor: 'white' }} colSpan={2}>{d.designations}</td>
                //             <td style={{ borderColor: 'white' }}>{(d.gender[0].toLowerCase() == "male" && d.gender.length == 2) ? d.gender[1] : (d.gender.length == 4) ? d.gender[3] : "-"}</td>
                //             <td style={{ borderColor: 'white' }}> {d.gender[0].toLowerCase() == "female" ? d.gender[1] : "-"}</td>
                //             <td style={{ borderColor: 'white' }}>12</td>
                //         </tr>
                //     )
                // })
                // }
                // })
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
                                                <td>{(designation.gender[0].toLowerCase() == "male" && designation.gender.length == 2) ? designation.gender[1] : (designation.gender.length == 4) ? designation.gender[3] : "-"}</td>
                                                <td> {designation.gender[0].toLowerCase() == "female" ? designation.gender[1] : "-"}</td>
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
        )
    }
}
export default HoStaffReport;