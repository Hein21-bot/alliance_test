import React, { Component } from 'react'
import DatePicker from "react-datetime";
import { main_url, calculationDate } from '../../../utils/CommonFunction';
import moment from 'moment';
import { HolidayValidation } from '../SettingValidation';

export default class HolidayAddNew extends Component {
    constructor(props) {
        super(props);
        this.state = {
            event_name: '',
            start_date: new Date(`${this.props.selectedMonth + '-01-' + this.props.selectedYear}`),
            end_date: new Date(`${this.props.selectedMonth + '-01-' + this.props.selectedYear}`),
            holiday_count: '',
            remark: '',
            validateErr: {}
        }
    }

    handleInputChange = (e) => {
        const key = e.target.id;
        const val = e.target.value;
        const state = {};
        state[key] = val;
        this.setState(state)
    }

    handleSelectDate = (date, key) => {
        const state = {};
        state[key] = date;
        this.setState(state)
    }

    handleSave = () => {
        let status = 0;
        const { event_name, start_date, end_date, remark } = this.state;
        const data = {
            event_name,
            start_date: moment(start_date).format('YYYY-MM-DD HH:mm:ss'),
            end_date: moment(end_date).format('YYYY-MM-DD HH:mm:ss'),
            holiday_count: calculationDate(start_date, end_date),
            remark
        }
        const validateErr = HolidayValidation(data);
        this.setState({ validateErr })
        if (Object.keys(validateErr).length === 0) {
            fetch(`${main_url}holidaySetup/addHoliday`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `data=${JSON.stringify(data)}`

            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    this.props.showToast(status, text);
                })
        } else {
            this.props.showToast(status, 'Please Add Fully Information.');
        }
    }

    render() {
        const { event_name, start_date, end_date, remark } = this.state;
        return (
            <div className='col-sm-9'>
                <div className="container">
                    <div className='row'>
                        <form id="check_form" style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                            <div className="form-group col-md-8">
                                <div className="row" style={{ marginBottom: 5 }}>
                                    <div><label htmlFor="event_name" className="col-sm-12">Event Name<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            id='event_name'
                                            className="form-control input-md"
                                            value={event_name}
                                            onChange={this.handleInputChange}
                                            style={{ border: this.state.validateErr.eventNameErr && '1px solid red' }}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{ marginBottom: 5 }}>
                                    <div><label htmlFor="start_date" className="col-sm-12">Start Date<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">
                                        <DatePicker
                                            dateFormat="MM-DD-YYYY"
                                            value={start_date ? moment(start_date).format("MM-DD-YYYY") : ''}
                                            onChange={(date) => this.handleSelectDate(date, 'start_date')}
                                            timeFormat={false}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{ marginBottom: 5 }}>
                                    <div><label htmlFor="end_date" className="col-sm-12">End Date<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">
                                        <DatePicker
                                            dateFormat="MM-DD-YYYY"
                                            value={end_date ? moment(end_date).format("MM-DD-YYYY") : ''}
                                            onChange={(date) => this.handleSelectDate(date, 'end_date')}
                                            timeFormat={false}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{ marginBottom: 5 }}>
                                    <div><label htmlFor="holiday_count" className="col-sm-12">Holiday Count<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">
                                        <input
                                            type="number"
                                            id='holiday_count'
                                            className="form-control input-md"
                                            value={calculationDate(start_date, end_date)}
                                            disabled />
                                    </div>
                                </div>
                                <div className="row" style={{ marginBottom: 5 }}>
                                    <div><label htmlFor="remark" className="col-sm-12">Remark</label></div>
                                    <div className="col-sm-10">
                                        <input
                                            type="text"
                                            id='remark'
                                            className="form-control input-md"
                                            value={remark}
                                            onChange={this.handleInputChange} />
                                    </div>
                                </div>
                                <div className="row save-btn">
                                    <div className="float-right">
                                        <button onClick={() => this.handleSave()} className="btn btn-primary" id="saving_button" type="button">Save</button>
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

