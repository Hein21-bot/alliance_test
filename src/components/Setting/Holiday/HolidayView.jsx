import React, { Component } from 'react'
import DatePicker from "react-datetime";

export default class HolidayView extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }


    render() {
        const { data } = this.props;
        return (
            <div className='col-sm-9'>
                <div className="container">
                    <div className='row'>
                        <form id="check_form" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <div className="form-group col-md-8">
                                <div className="row" style={{marginBottom: 5}}>
                                    <div><label htmlFor="event_name" className="col-sm-12">Event Name</label></div>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            id='event_name'
                                            className="form-control input-md"
                                            value={data.event_name}
                                            disabled />
                                    </div>
                                </div>
                                <div className="row" style={{marginBottom: 5}}>
                                    <div><label htmlFor="start_date" className="col-sm-12">Start Date</label></div>
                                    <div className="col-sm-10">
                                        <DatePicker
                                            dateFormat="MM-DD-YYYY"
                                            value={data.start_date}
                                            timeFormat={false}
                                            open={false}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{marginBottom: 5}}>
                                    <div><label htmlFor="end_date" className="col-sm-12">End Date</label></div>
                                    <div className="col-sm-10">
                                        <DatePicker
                                            dateFormat="MM-DD-YYYY"
                                            value={data.end_date}
                                            timeFormat={false}
                                            open={false}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{marginBottom: 5}}>
                                    <div><label htmlFor="holiday_count" className="col-sm-12">Holiday Count</label></div>
                                    <div className="col-sm-10">
                                        <input
                                            type="number"
                                            id='holiday_count'
                                            className="form-control input-md"
                                            value={data.holiday_count}
                                            disabled />
                                    </div>
                                </div>
                                <div className="row" style={{marginBottom: 5}}>
                                    <div><label htmlFor="remark" className="col-sm-12">Remark</label></div>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            id='remark'
                                            className="form-control input-md"
                                            value={data.remark}
                                            disabled />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

