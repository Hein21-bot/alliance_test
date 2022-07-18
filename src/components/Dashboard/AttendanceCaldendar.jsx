import React, { Component } from "react";
import ReactDatePicker, { CalendarContainer } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { getDate, format } from 'date-fns'
import 'react-toastify/dist/ReactToastify.css';

const data = [
    { date: '05-03-2022', leave_count: 4, employees: ['Dave', 'Josh', 'Mary', 'Joh'] },
    { date: '05-19-2022', leave_count: 2, employees: ['Scarlet', 'Peter'] },
    { date: '05-22-2022', leave_count: 2, employees: ['West', 'Nancy'] },
];
const primary = "#1872ab";
const softblue='rgb(24 114 171)';
const secondary='#21e6c1';
const darky='#5d5d5a';
export class AttendanceCaldendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            modalData: {}
        }
    }

    setModalData = (data) => {
        if (data.length > 0) {
            this.setState({ modalData: data[0] });
        }
    }

    renderDayContents = (day, date) => {
        // console.log('date', date)
        const highlight = data.filter(v => format(new Date(v.date), 'dd-MM-yyyy') === format(date, 'dd-MM-yyyy'))
        const tooltipText = `<div style="color:red">Tooltip for date: ${date}</div>`;
        return (
            <>
                <div onClick={() => this.setModalData(highlight)} data-toggle={highlight.length > 0 && "modal"} data-target={highlight.length > 0 && "#leave-detail-modal"} style={{ border: highlight.length > 0 && '1px solid red', padding: '0px 2px', borderRadius: 50, minWidth: 29, minHeight: 29, paddingTop: 5, width: 29, height: 29 }}>
                    {getDate(date)}
                </div>
                {
                    highlight.length > 0 &&
                    <span className="white-bg" style={{ fontSize: 12, color: 'red', position: 'relative', top: -35, left: 8, fontWeight: 'bold', borderRadius: '15px' }}>
                        {highlight[0].leave_count}
                    </span>
                }
            </>
        );
    };

    render() {
        const { modalData } = this.state;
        const MyContainer = ({ className, children }) => {
            return (
                <div style={{ color: "#fff", fontSize: 14, width: '100%' }}>
                    <CalendarContainer className={className} style={{ width: '100%' }}>
                        <div style={{ position: "relative", fontSize: 14 }}>{children}</div>
                    </CalendarContainer>
                </div>
            );
        };
        return (
            <div
                className='row'
                style={{
                    background: '#fff',
                    color: '#222',
                    boxShadow: '3px 3px 3px #e5e5e5',
                    borderRadius: 6,
                    padding: '20px 10px',
                    margin: '10px 0px',
                    
                }}
            >
                <h3 style={{
                    marginLeft:"13px"
                }}>Attendance Calendar</h3>
                <div className="modal fade" id="leave-detail-modal" role="dialog" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document" style={{ width: 200, float: 'right' }}>
                        {
                            Object.keys(modalData).length > 0 &&
                            <div className="modal-content">
                                <div className="modal-header" style={{
                                    display:'flex',
                                    justifyContent:'space-between',
                                    alignItems:'center',
                                   
                                }} >
                                    <div style={{
                                        display:'flex',
                                        justifyContent:'center',
                                        alignItems:'center'
                                    }}>
                                    <h5 className="modal-title" id="exampleModalLabel" style={{
                                       color:'white !important'
                                    }}>{format(new Date(modalData.date), 'dd-MMM-yyyy')}</h5>
                                    </div>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{ marginTop: '-20px' }}>
                                        <span aria-hidden="true" style={{}}>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body " style={{ padding: '5px' }}>
                                    <ul style={{ margin: '4px 0px' }}>
                                        {
                                            modalData.employees.map((v, k) => (
                                                <li key={k}>
                                                    {v}
                                                </li>
                                            ))
                                        }
                                    </ul>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                <div className="col-md-5 col-5 col-sm-5" style={{ width: 300, position: 'relative' }}>
                    <ReactDatePicker 
                        selected={this.state.startDate}
                        onChange={(date) => this.setState({ startDate: date })}
                        renderDayContents={this.renderDayContents}
                        inline
                        calendarClassName="custom-datePicker"
                        style={{ width: '100%' }}
                        calendarContainer={MyContainer}
                        formatWeekDay={nameOfDay => nameOfDay.substr(0,3)}
                    />
                </div>
                <div className="col-md-5 col-5 col-sm-5">
                        <div style={{
                            display:'flex',
                            flexDirection:'column',
                            justifyContent:'center',
                            alignItems:'center'
                        }}>
                        <div style={{
                                display:'flex',
                                marginBottom:'30px',
                        }}>
                                <div style={{
                                    width:'280px',
                                    height:'40px',
                                    border:'1px solid #efefef',
                                    borderRadius:'5px',
                                    backgroundColor:'#efefef',
                                    display:'flex',
                                    justifyContent:'center',
                                    alignItems:'center',
                                    // marginLeft:'20px',
                                    position:'relative',
                                    color:primary,
                                    fontSize:'12px'
                                
                                }}>Total Working Days</div>
                                <div style={{
                                    width:'70px',
                                    height:'40px',
                                    boder:'1px solid black',
                                    borderRadius:'5px',
                                    backgroundColor:primary,
                                    display:"flex",
                                    justifyContent:"center",
                                    alignItems:"center",
                                    marginRight:'20px',
                                    position:'absolute',
                                    right:10,
                                    fontSize:'20px',
                                    color:'white'
                                   
                                }}>21</div>
                            </div>
                            <div style={{
                                display:'flex',
                                
                                alignItems:'center'

                            }}>
                                <div style={{
                                    width:'90px',
                                    height:'130px',
                                    backgroundColor:secondary,
                                    borderRadius:'10px',
                                    marginRight:'5px'
                                }}>
                                    <p style={{
                                        fontSize:'40px',
                                        display:'flex',
                                        justifyContent:'center',
                                        alignItems:'center',
                                        color:'white'
                                        
                                    }}>19</p>
                                    <p style={{
                                        marginTop:'50px',
                                        textAlign:'center',
                                        fontSize:'10px',
                                        color:'white'
                                       
                                    }}>Attendance Day</p>
                                </div>
                                <div style={{
                                    width:'90px',
                                    height:'130px',
                                    backgroundColor:primary,
                                    borderRadius:'10px',
                                    marginRight:'5px'
                                }}>
                                    <p style={{
                                        fontSize:'40px',
                                        textAlign:'center',
                                       
                                        color:'white'
                                        
                                    }}>02</p>
                                    <p style={{
                                        marginTop:'50px',
                                        textAlign:'center',
                                        fontSize:'10px',
                                        color:'white'
                                    }}>Leave Day</p>
                                </div>
                                <div style={{
                                    width:'90px',
                                    height:'130px',
                                    backgroundColor:darky,
                                    borderRadius:'10px'
                                }}>
                                    <p style={{
                                        fontSize:'40px',
                                        textAlign:'center',
                                       
                                        color:'white'
                                        
                                    }}>00</p>
                                    <p style={{
                                        marginTop:'50px',
                                        textAlign:'center',
                                        fontSize:'10px',
                                        color:'white'
                                    }}>Allowance Day</p>
                                </div>
                            </div>
                        </div>
                </div>
                <div className="col-md-2 col-2 col-sm-2">
                    <div style={{
                       display:'flex',
                       
                       alignContent:'center'
                    }}>
                        <div style={{
                            width:'20px',
                            height:'20px',
                            borderRadius:'5px',
                            marginRight:'10px',
                            backgroundColor:darky,
                            marginBottom:'20px'
                        }}>
                            
                        </div>
                        <p>Absense</p>
                    </div>
                    <div style={{
                       display:'flex',
                       
                       alignContent:'center'
                    }}>
                        <div style={{
                            width:'20px',
                            height:'20px',
                            borderRadius:'5px',
                            marginRight:'10px',
                            backgroundColor:secondary,
                            marginBottom:'20px'
                        }}>
                            
                        </div>
                        <p>Attendance</p>
                    </div>
                    <div style={{
                       display:'flex',
                       
                       alignContent:'center'
                    }}>
                        <div style={{
                            width:'20px',
                            height:'20px',
                            borderRadius:'5px',
                            marginRight:'10px',
                            backgroundColor:primary,
                            marginBottom:'20px'
                        }}>
                            
                        </div>
                        <p>Leave</p>
                    </div>
                    <div style={{
                       display:'flex',
                       
                       alignContent:'center'
                    }}>
                        <div style={{
                            width:'20px',
                            height:'20px',
                            borderRadius:'5px',
                            marginRight:'10px',
                            backgroundColor:softblue,
                            marginBottom:'20px'
                        }}>
                            
                        </div>
                        <p>Incomplete <br />Attendance</p>
                        
                    </div>
                    
                </div>
            </div>
        )
    }
}