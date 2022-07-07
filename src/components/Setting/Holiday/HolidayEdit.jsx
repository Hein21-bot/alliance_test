import React, { Component } from 'react'
import DatePicker from "react-datetime";
import { calculationDate, main_url } from '../../../utils/CommonFunction';
import moment from 'moment';
import { HolidayValidation } from '../SettingValidation';

export default class HolidayEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            validateErr: {}
        }
    }

    handleInputChange = (e) => {
        const obj = { ...this.state.data };
        obj[e.target.id] = e.target.value;
        this.setState({
            data: obj
        })
    }

    handleSelectDate = (date, key) => {
        const obj = { ...this.state.data };
        obj[key] = date;
        this.setState({
            data: obj
        })
    }

    handleSave = () => {
        const { data } = this.state;
        data.holiday_count = calculationDate(data.start_date, data.end_date)
        let status = 0;
        const validateErr = HolidayValidation(data);
        data.start_date = moment(data.start_date).format("YYYY-MM-DD HH:mm:ss")
        data.end_date = moment(data.end_date).format('YYYY-MM-DD HH:mm:ss')
        this.setState({ validateErr })
        if(Object.keys(validateErr).length === 0){
        fetch(`${main_url}holidaySetup/editHoliday/${data.holiday_id}`, {
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
    }else{
        this.props.showToast(status, 'Please Add Fully Information.');
    }
    }

    render() {
        const { data } = this.state;
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
                                            onChange={this.handleInputChange} 
                                            style={{border: this.state.validateErr.eventNameErr && '1px solid red'}}
                                            />
                                    </div>
                                </div>
                                <div className="row" style={{marginBottom: 5}}>
                                    <div><label htmlFor="start_date" className="col-sm-12">Start Date</label></div>
                                    <div className="col-sm-10">
                                        <DatePicker
                                            dateFormat="MM-DD-YYYY"
                                            value={moment(data.start_date).format('MM-DD-YYYY')}
                                            onChange={(date)=>this.handleSelectDate(date,'start_date')}
                                            timeFormat={false}
                                        />
                                    </div>
                                </div>
                                <div className="row" style={{marginBottom: 5}}>
                                    <div><label htmlFor="end_date" className="col-sm-12">End Date</label></div>
                                    <div className="col-sm-10">
                                        <DatePicker
                                            dateFormat="MM-DD-YYYY"
                                            value={moment(data.end_date).format('MM-DD-YYYY')}
                                            onChange={(date)=>this.handleSelectDate(date,'end_date')}
                                            timeFormat={false}
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
                                            value={calculationDate(data.start_date, data.end_date)}
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

