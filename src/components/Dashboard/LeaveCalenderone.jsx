import React, { Component } from "react";
import ReactDatePicker, { CalendarContainer } from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import { getDate, format } from 'date-fns'
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datetime';

const data = [
    { date: '05-03-2022', leave_count: 4, employees: ['Dave', 'Josh', 'Mary', 'Joh'] },
    { date: '05-19-2022', leave_count: 2, employees: ['Scarlet', 'Peter'] },
    { date: '05-22-2022', leave_count: 2, employees: ['West', 'Nancy'] },
];

export default class LeaveCalenderone extends Component {
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
                    padding: '2px 0px 2px 0px',
                    margin: '10px 0px'
                }}
            >
                <div className="modal fade" id="leave-detail-modal" role="dialog" aria-labelledby="exampleModalLabel"
                    aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document" style={{ width: 200, float: 'right' }}>
                        {
                            Object.keys(modalData).length > 0 &&
                            <div className="modal-content">
                                <div className="modal-header" style={{ padding: 5 }} >
                                    <h5 className="modal-title" id="exampleModalLabel" style={{ textAlign: 'center' }}>{format(new Date(modalData.date), 'dd-MMM-yyyy')}</h5>
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
                <div className=" " style={{margin:'20px'}}>
                    <div className="col-md-6 col-6 col-sm-6 ">
                    <div className="col ">
                    <h3 style={{ paddingLeft: 8, color:"#1872ab", fontWeight: 'bolder' }}>Leave Calendar</h3>

                      <div style={{display:'flex'}}>
                     <input  type="radio" name="flexRadioDefault" id="flexRadioDefault1"></input>
                    <p class="form-check-label" for="flexRadioDefault1"style={{marginLeft:5,display:'inline-block',color:'#1872ab'}}>
                     Team
                    </p>
                     </div>
                     <div style={{display:'flex'}}>
                    <input  type="radio" name="flexRadioDefault" id="flexRadioDefault2" ></input>
                    <p class="form-check-label" for="flexRadioDefault2" style={{marginLeft:5,display:'inline-block',color:'#1872ab'}}>
                     All
                    </p>
                    </div>
                     <div style={{display:'flex'}}>
                     <input  type="radio" name="flexRadioDefault" id="flexRadioDefault3"></input>
                    <p className="form-check-label" for="flexRadioDefault3" style={{marginLeft:5,display:'inline-block',color:'#1872ab'}}>
                      My Calender
                    </p>
                     </div>
                     </div>
                     <div className="" style={{display:'flex',marginTop:10}}> 
                     <div><i class="fa fa-calendar fa-2x" aria-hidden="true" style={{marginRight:'10px',color:'#1872ab'}}></i></div>
                               
                              <div style={{
                                position:"relative"
                              }}>
                              <div style={{
                                position:"absolute",
                                
                              }}><DatePicker className="leavedatepicker"
                                    dateFormat="DD/MM/YYYY"
                                    value={this.state.s_date}
                                    onChange={this.handleStartDate}
                                    timeFormat={false} 
                                    
                                >
                                 </DatePicker><i class="fa fa-search fa-1.5x" aria-hidden="true" style={{color:'#1872ab',
                                position:"absolute",
                                right:'20px',
                                top:'10px'}} /></div> 
                              </div>
                     </div>
                     </div>
                     <div bu9 className="col-md-6 col-lg-6 col-sm-6">
                    <ReactDatePicker
                        selected={this.state.startDate}
                        onChange={(date) => this.setState({ startDate: date })}
                        renderDayContents={this.renderDayContents}
                        inline
                        calendarClassName="custom-datePicker"
                        style={{ width: '50%' }}ssssssss
                        calendarContainer={MyContainer}
                        formatWeekDay={nameOfDay => nameOfDay.substr(0,3)}
                        
                    /></div>
                     
                    </div>
                </div>
            
        )
    }
}