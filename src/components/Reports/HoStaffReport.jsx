import React, { Component } from "react";

class HoStaffReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    Department: "HR Department",
                    Position: [
                        {
                            name: "HR Manager",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Senior HR Officer",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "HR Officer",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "HR Assistant",
                            male: "-",
                            female: 1
                        },

                    ],
                    Total: 6
                },
                {
                    Department: "Training",
                    Position: [
                        {
                            name: "Regional Trainer",
                            male: "-",
                            female: 1
                        },
                        {
                            name: " Sr Learning and Development Manager ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Deputy Training Manager",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "System Trainer ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Training Logistics Assistant ",
                            male: "-",
                            female: 1
                        },

                    ],
                    Total: 9
                },
                {
                    Department: "Finance Department",
                    Position: [
                        {
                            name: "Sr Reporting Officer ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: " Senior Treasury Officer ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: " Sr Funding Officer ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Accounting Officer  ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Accounting Assistant ",
                            male: "-",
                            female: 1
                        },

                    ],
                    Total: 9
                },
                {
                    Department: "Marketing",
                    Position: [
                        {
                            name: " Marketing Manager ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: " Sr Branding Officer  ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Customer Service Officer",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Customer Service Assistant ",
                            male: "-",
                            female: 1
                        },


                    ],
                    Total: 9
                },
                {
                    Department: "IT Department",
                    Position: [
                        {
                            name: " IT Manager ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: " Sr IT Officer ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "  IT Porject Officer ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "IT Officer  ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "IT Officer (Software Support)  ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: " IT Assistant ",
                            male: "-",
                            female: 1
                        },

                    ],
                    Total: 9
                },
                {
                    Department: "Operation",
                    Position: [
                        {
                            name: " Operation Manager ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Sr Agriculture PM ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "  Sr SME PM ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "BSM ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "BSO  ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Business Development Manager ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Sr Cashier",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Recovery Officer ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Cash and Back Office Manager ",
                            male: "-",
                            female: 1
                        },

                    ],
                    Total: 9
                },
                {
                    Department: "Aduit",
                    Position: [
                        {
                            name: "Sr Audit Manager ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: " Deputy Audit Manager ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: " Regional Internal Audit Supervisor ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Sr Auditor",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Jr Auditor ",
                            male: "-",
                            female: 1
                        },

                    ],
                    Total: 9
                },
                {
                    Department: "Risk",
                    Position: [
                        {
                            name: "Risk Manager",
                            male: "-",
                            female: 1
                        },
                        {
                            name: " Risk Supervisor ",
                            male: "-",
                            female: 1
                        },
                        {
                            name: "Regional Risk Monitor",
                            male: "-",
                            female: 1
                        },


                    ],
                    Total: 9
                },
            ],
            Totals: [
                {
                    Total: "Total",
                    Total_number: 9
                },
                {
                    Total: "Regional Staff",
                    Total_number: 108
                },
                {
                    Total: "Branch Staff",
                    Total_number: 32
                }, {
                    Total: "Grand Total",
                    Total_number: 6
                }
            ],
            
            vip: [
                {
                    name: 'CEO',
                    male: 1,
                    female: 1
                }, {
                    name: "COO",
                    male: 1,
                    female: 2
                }, {
                    name: "CFO",
                    male: 2,
                    female: 1
                }
            ],
            vip_total: 8
            //     },

            // ]



        }
    }



    

    render() {

        return (
            <div>
                <table className="table table-bordered">
                    <thead>
                        <tr style={{ backgroundColor: 'blue', color: 'white' }}>
                            <th style={{ width: 100, textAlign: 'center' }}>Department</th>
                            <th style={{ width: 200, textAlign: 'center' }}>Position</th>
                            <th style={{ width: 50, textAlign: 'center' }}>Male</th>
                            <th style={{ width: 50, textAlign: 'center' }}>Female</th>
                            <th style={{ width: 50, textAlign: 'center' }}>Total</th>

                        </tr>
                    </thead>
                    <tbody>
                        
                        {
                            this.state.vip.map((v,i) => (
                                <tr style={{textAlign:'center'}}>
                                    <td colSpan={2}>{v.name}</td>
                                    <td>{v.male}</td>
                                    <td>{v.female}</td>
                                    {i === 0 ? <td rowSpan={3}>{this.state.vip_total}</td> : null}
                                </tr>
                            ))
                        }
                        

                        {this.state.data.map((state) => (
                            <>
                                {state.Position.map((position, i) => (

                                    <tr style={{ textAlign: 'center' }}>
                                        {i === 0 ? <td rowSpan={state.Position.length}>{state.Department}</td> : null}
                                        <td>{position.name}</td>
                                        <td>{position.male}</td>
                                        <td>{position.female}</td>
                                        {i === 0 ? <td rowSpan={state.Position.length}>{state.Total}</td> : null}
                                    </tr>



                                ))}
                            </>
                        ))}
                        
                        {
                            this.state.Totals.map((t) => (
                                <>
                                    <tr style={{ textAlign: 'center' }}>
                                        <td colSpan={4}>{t.Total}</td>
                                        <td>{t.Total_number}</td>
                                    </tr>
                                </>
                            ))
                        }

                    </tbody>

                </table>
            </div>
        )
    }
}
export default HoStaffReport;