import React, { Component } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datetime';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import AttendanceHistory from './AttendanceHistory'
import { main_url, getCookieData, calculationDate, validate, stopSaving, startSaving, calculationDate1, getUserId } from '../../utils/CommonFunction';


export default class AlternativeLeave extends Component {

    constructor(props) {
        super(props);
        this.state = {
            startDate: new Date(),
            endDate: new Date(),
            halfDay: 1,
            data: props.data,
            verifyBy: [],
            approvedBy: [],
            leave_days1: 0,
            history: 0
        }
    }


    componentDidMount() {
        this.getVerifyBy()
        this.getApprovedBy()
        this.setState({ history: 0 })
    }

    handleChangeStartDate = (event) => {
        this.setState({
            startDate: event
        })
        // this.leaveDays(event, this.state.endDate)
    }

    handleChangeEndDate = (event) => {
        this.setState({
            endDate: event
        })
        // this.leaveDays(this.state.startDate, event)
    }

    onChangeWork(event) {
        this.setState({
            halfDay: event.target.value
        });
    }

    getVerifyBy() {
        fetch(`${main_url}leave/getVerifyBy/${this.state.data.user_id}/1`)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                this.setState({ verifyBy: res })
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    getApprovedBy() {
        fetch(`${main_url}leave/getApprovedBy/${this.state.data.user_id}/1`)
            .then(response => {

                if (response.ok) return response.json()
            })
            .then(res => {
                this.setState({ approvedBy: res })
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    handleChangeVerifyBy = e => {
        this.setState({
            selectedVerifyBy: e
        })

    }

    handleChangeApproveBy = e => {
        this.setState({
            selectedApproveBy: e
        })
    }

    // leaveDays(startDate, endDate) {
    //     if (startDate <= endDate) {
    //         this.setState({ leave_days1: calculationDate(startDate, endDate) })

    //     } else {
    //         this.setState({ leave_days1: -1 })
    //     }
    // }

    backToHistory() {
        this.setState({ history: 1 })
    }

    save() {
        if (moment(this.state.data.createdAt).add(30, 'days').format('YYYY-MM-DD') < moment(this.state.startDate).utc().format("YYYY-MM-DD")) {
            toast.error("You can only request within one month!");
        } else {
            if (validate('check_form')) {
                if (this.state.leave_days1 != -1) {
                    let saveData = {
                        user_id: this.state.data.user_id,
                        leave_start_date: this.state.startDate,
                        leave_end_date: this.state.startDate,
                        leave_category_id: 11,
                        leave_days: this.state.halfDay,
                        reason: this.state.reason,
                        verifyBy: this.state.selectedVerifyBy.value,
                        approvedBy: this.state.selectedApproveBy.value,
                        application_status: 1,
                        max_days: this.state.max_days
                    }
                    let status = 0;
                    fetch(`${main_url}leave/addLeave`, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: `leave_info=${JSON.stringify(saveData)}`
                    })
                        .then(res => {
                            status = res.status;
                            return res.text()
                        })
                        .then(text => {
                            if (status === 200) {
                                toast.success(text);
                                window.location.reload()
                            }
                            else toast.error(text);
                        })
                } else {
                    toast.error("Start date is greather than end date!");
                }
            }
        }


    }


    render() {
        return (
            <div className='col-12' style={{ display: 'flex', justifyContent: 'center' }}>
                <ToastContainer
                    position="top-right"
                    autoClose={15000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                {this.state.history == 1 ? <div className='col-md-12'><AttendanceHistory /></div> : <div className="col-md-6 white-bg mt20" style={{ height: 800 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                        <h3>Alternative Leave Form</h3>
                    </div>
                    <div className="form-horizontal mt20" id="check_form">
                        <div className="form-group" style={{ marginTop: 20 }}>
                            <div><label className="col-sm-4" >Employee Name<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <input type="text" className='form-control' value={this.state.data.fullname} disabled />
                            </div>
                        </div>
                        <div className="form-group mt20"  >
                            <div><label className="col-sm-4" >Leave Category<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <input type="text" className='form-control' value={'Alternative Leave'} disabled />
                            </div>
                        </div>
                        <div className="form-group mt20"  >
                            <div><label className="col-sm-4" >Leave Balance<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <input
                                    type="text"
                                    className="form-control checkValidate"
                                    value={this.state.data.leave_allow_day}
                                    disabled
                                >
                                </input>
                            </div>
                        </div>
                        <div className="form-group mt30">
                            <div><label className="col-sm-4" >Verify By<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <Select
                                    placeholder="Select Verify Person"
                                    options={this.state.verifyBy}
                                    value={this.state.selectedVerifyBy}
                                    onChange={this.handleChangeVerifyBy}
                                    className='react-select-container checkValidate'
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                        <div className="form-group mt30">
                            <div><label className="col-sm-4">Approved By<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <Select
                                    placeholder="Select Approve Person"
                                    options={this.state.approvedBy}
                                    value={this.state.selectedApproveBy}
                                    onChange={this.handleChangeApproveBy}
                                    className='react-select-container checkValidate'
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                        <div className="form-group mt30">
                            <div><label className="col-sm-4">Date<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8">
                                <DatePicker
                                    className="checkValidate"
                                    timeFormat={false}
                                    value={this.state.startDate}
                                    onChange={this.handleChangeStartDate}
                                />
                            </div>
                        </div>
                        {/* <div className="form-group mt30">
                            <div><label className="col-sm-4">End Date<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8 ">
                                <DatePicker
                                    className="checkValidate"
                                    timeFormat={false}
                                    value={this.state.endDate}
                                    onChange={this.handleChangeEndDate}
                                />
                            </div>
                        </div> */}
                        {
                            <div className="form-group mt30">
                                <div><label className="col-sm-4">Leave Type<span className="text-danger">*</span></label> </div>
                                <div onChange={this.onChangeWork.bind(this)} className="col-sm-8">
                                    <div className='' style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <div><input type="radio" value={0.5} name="work" /> </div>
                                        <div style={{ marginLeft: 10 }}>Half Day</div>
                                    </div>
                                    <div className='' style={{ display: 'flex', justifyContent: 'flex-start' }}>
                                        <div><input type="radio" value={1} name="work" /> </div>
                                        <div style={{ marginLeft: 10 }}>Full Day</div>
                                    </div>
                                </div>
                            </div>
                        }
                        <div className="form-group mt30"  >
                            <div><label className="col-sm-4" >Leave Days<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <input
                                    type="text"
                                    className="form-control checkValidate"
                                    value={(this.state.leave_days1 == 0 || this.state.leave_days1 == 1) ? this.state.halfDay : this.state.leave_days1}
                                >
                                </input>
                            </div>
                        </div>
                        <div className="form-group mt30">
                            <div className="col-sm-12" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div className='f-left'>
                                    <button className="btn btn-primary" type="button" onClick={() => this.backToHistory()}>Back</button>
                                </div>
                                <div className='f-right'>
                                    <button className="btn btn-success" type="button" onClick={() => this.save()}>Submit</button>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }
}