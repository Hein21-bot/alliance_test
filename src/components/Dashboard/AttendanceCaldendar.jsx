import React, { Component } from "react";
import ReactDatePicker, { CalendarContainer } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { getDate, format } from 'date-fns'
import * as dateFns from 'date-fns'
import moment from "moment";
import 'react-toastify/dist/ReactToastify.css';

const data = [
    { date: '05-03-2022', leave_count: 4, employees: ['Dave', 'Josh', 'Mary', 'Joh'] },
    { date: '05-19-2022', leave_count: 2, employees: ['Scarlet', 'Peter'] },
    { date: '05-22-2022', leave_count: 2, employees: ['West', 'Nancy'] },
];
const primary = "#1872ab";
const softblue = 'rgb(24 114 171)';
const secondary = '#23c6c8';
const darky = '#5d5d5a';
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
        // console.log('calendar date => ', moment(date).format('DD-MM-YYYY'))
        // console.log('data is ==> ', data.map(V=> ( moment(V.date).format('DD-MM-YYYY'))), moment((date)).format('DD-MM-YYYY'))
        const highlight = data.filter(v => v.date == moment(date).format('MM-DD-YYYY'))

        console.log('highlight data ==> ', highlight, data.map(v => v.date), moment(date).format('MM-DD-YYYY'))
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
        console.log('modalData ===>', modalData)
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
                className='row col-lg-12 col-md-12 col-sm-12' id="attendence_calendar"
                style={{
                    background: '#fff',
                    color: '#222',
                    WebkitBoxShadow: '0px 0px 3px 0px rgba(194,194,194,1)',
                    boxShadow: '0px 0px 3px 0px rgba(194,194,194,1)',
                    borderRadius: '0px 20px 20px 20px',
                    // padding: '5px',
                    // margin: '5px 0px',
                    margin:'0px !important'

                }}
            >
                <h3 style={{
                    marginLeft: "13px",
                    color: primary, fontWeight: 'bolder'
                }}>Attendance Calendar</h3>
                <div className="modal fade" id="leave-detail-modal" role="dialog" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document" style={{ width: 200, float: 'right' }}>
                        {
                            Object.keys(modalData).length > 0 &&
                            <div className="modal-content">
                                <div className="modal-header" style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',

                                }} >
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center'
                                    }}>
                                        <h5 className="modal-title" id="exampleModalLabel" style={{
                                            color: 'white !important'
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
                <div className="col-md-8 col-lg-4 col-sm-5" style={{ position: 'relative' }}>
                    <ReactDatePicker
                        selected={this.state.startDate}
                        onChange={(date) => this.setState({ startDate: date })}
                        renderDayContents={this.renderDayContents}
                        inline
                        calendarClassName="custom-datePicker"
                        // style={{ width: '100%' }}
                        calendarContainer={MyContainer}
                        formatWeekDay={nameOfDay => nameOfDay.substr(0, 3)}
                    />
                </div>
                <div className="col-md-7 col-lg-8 col-sm-7">
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', }}>
                        <div className="col-md-12 col-lg-12" style={{ display: 'flex', marginBottom: '30px', flexDirection: 'column', marginLeft: 20 }}>
                            <div style={{ display: 'flex', flexDirection: 'row', width: 'col-12' }}>
                                <div className="col-md-7 col-lg-5" style={{ height: '30px', borderRadius: '5px 0px 0px 5px', backgroundColor: '#efefef', display: 'flex', justifyContent: 'center', alignItems: 'center', color: primary, fontSize: '12px' }}>Total Working Days
                                </div>
                                <div style={{ width: '20%', height: '30px', borderRadius: '5px', backgroundColor: primary, display: "flex", justifyContent: "center", alignItems: "center", fontSize: '16px', color: 'white' }}>21</div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'row', width: 'col-12', alignItems: 'end', justifyContent: 'space-between', marginTop: 20 }}>
                                <div className="col-md-12 col-lg-12" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'left' }}>
                                    <div style={{ width: '20%', height: '130px', backgroundColor: secondary, borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', marginRight: 5 }}>
                                        <p style={{ fontSize: '30px', color: 'white' }}>19</p>
                                        <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '10px', color: 'white' }}>Attendance Day</p>
                                    </div>
                                    <div style={{ width: '20%', height: '130px', backgroundColor: primary, borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', marginRight: 5 }}>
                                        <p style={{ fontSize: '30px', color: 'white' }}>02</p>
                                        <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '10px', color: 'white' }}>Leave Day</p>
                                    </div>
                                    <div style={{ width: '20%', height: '130px', backgroundColor: darky, borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', marginRight: 5 }}>
                                        <p style={{ fontSize: '30px', color: 'white' }}>00</p>
                                        <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '10px', color: 'white' }}>Absense Day</p>
                                    </div>
                                </div>
                                <div className="">
                                    <div style={{ display: 'flex', width: '100%', marginBottom: '5px' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '5px', backgroundColor: darky, marginRight: 5 }}>
                                        </div>
                                        <p style={{ fontSize: '10px', marginTop: 2 }}>Absense</p>
                                    </div>
                                    <div style={{ display: 'flex', width: '100%', marginBottom: '5px' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '5px', backgroundColor: secondary, marginRight: 5, }}>
                                        </div>
                                        <p style={{ fontSize: '10px', marginTop: 2 }}>Attendance</p>
                                    </div>
                                    <div style={{ display: 'flex', width: '100%', marginBottom: '5px' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '5px', backgroundColor: primary, marginRight: 5 }}>

                                        </div>
                                        <p style={{ fontSize: '10px', marginTop: 2 }}>Leave</p>
                                    </div>
                                    <div style={{ display: 'flex', width: '100%', marginBottom: '5px' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '5px', backgroundColor: softblue, marginRight: 5, }}>
                                        </div>
                                        <p style={{ fontSize: '10px', marginTop: 2, marginBottom: 0 }}>Incomplete <br />Attendance</p>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="col-lg-5 col-md-5 col-sm-5" style={{margin:'0px !important'}}>
                <ReactDatePicker
                        selected={this.state.startDate}
                        onChange={(date) => this.setState({ startDate: date })}
                        renderDayContents={this.renderDayContents}
                        inline
                        calendarClassName="custom-datePicker"
                        // style={{ width: '100%' }}
                        calendarContainer={MyContainer}
                        formatWeekDay={nameOfDay => nameOfDay.substr(0, 3)}
                    />
                </div>
               
                <div className="col-lg-5 col-md-5 col-sm-5" style={{margin:'0px !important'}}>
                    <div style={{ display: 'flex', flexDirection: 'row', width: 'col-12',marginBottom:5 }}>
                        <div className="col-lg-12 col-md-12 col-sm-12" style={{ height: '30px', borderRadius: '5px 0px 0px 5px', backgroundColor: '#efefef', display: 'flex', justifyContent: 'center', alignItems: 'center', color: primary, fontSize: '12px' }}>Total Working Days
                        </div>
                        <div style={{ width: '20%', height: '30px', borderRadius: '5px', backgroundColor: primary, display: "flex", justifyContent: "center", alignItems: "center", fontSize: '16px', color: 'white' }}>21
                        </div>                           
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                    <div style={{ width: '33%', height: '130px', backgroundColor: secondary, borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', marginRight: 5 }}>
                                        <p style={{ fontSize: '30px', color: 'white' }}>19</p>
                                        <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '10px', color: 'white' }}>Attendance Day</p>
                                    </div>
                                    <div style={{ width: '33%', height: '130px', backgroundColor: primary, borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', marginRight: 5 }}>
                                        <p style={{ fontSize: '30px', color: 'white' }}>02</p>
                                        <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '10px', color: 'white' }}>Leave Day</p>
                                    </div>
                                    <div style={{ width: '33%', height: '130px', backgroundColor: darky, borderRadius: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center', marginRight: 5 }}>
                                        <p style={{ fontSize: '30px', color: 'white' }}>00</p>
                                        <p style={{ fontWeight: 'bold', textAlign: 'center', fontSize: '10px', color: 'white' }}>Absense Day</p>
                                    </div>
                    </div>
                    
                </div>
                <div className="col-lg-2 col-md-2 col-sm-2">
                <div style={{ display: 'flex', width: '100%', marginBottom: '5px' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '5px', backgroundColor: darky, marginRight: 5 }}>
                                        </div>
                                        <p style={{ fontSize: '10px', marginTop: 2 }}>Absense</p>
                                    </div>
                                    <div style={{ display: 'flex', width: '100%', marginBottom: '5px' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '5px', backgroundColor: secondary, marginRight: 5, }}>
                                        </div>
                                        <p style={{ fontSize: '10px', marginTop: 2 }}>Attendance</p>
                                    </div>
                                    <div style={{ display: 'flex', width: '100%', marginBottom: '5px' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '5px', backgroundColor: primary, marginRight: 5 }}>

                                        </div>
                                        <p style={{ fontSize: '10px', marginTop: 2 }}>Leave</p>
                                    </div>
                                    <div style={{ display: 'flex', width: '100%', marginBottom: '5px' }}>
                                        <div style={{ width: '20px', height: '20px', borderRadius: '5px', backgroundColor: softblue, marginRight: 5, }}>
                                        </div>
                                        <p style={{ fontSize: '10px', marginTop: 2, marginBottom: 0 }}>Incomplete <br />Attendance</p>

                                    </div>
                </div> */}

            </div>
        )
    }
}