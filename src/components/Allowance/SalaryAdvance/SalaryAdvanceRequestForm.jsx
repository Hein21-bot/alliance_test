import React, { Component } from 'react'
import { main_url, getUserId, getCookieData, validate, stopSaving, startSaving, isRequestedUser } from '../../../utils/CommonFunction';
var form_validate = true;

export default class SalaryAdvanceRequestForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user_info: getCookieData("user_info"),
            employee_list: [],
            one_advance: this.props.data,
            // getCookieData('salary_advance'),
            requested_amount: 0,
            available_amount: 0,
            purpose: '',
            created_user: getUserId("user_info")
        }
    }

    componentDidMount() {
        if (!Array.isArray(this.state.one_advance) && this.state.one_advance !== null) {
            this.setSalaryAdvance(this.state.one_advance);
        } else {
            this.getAvailableAmount(this.state.user_info.user_id);
        }
    }

    getAvailableAmount(user_id) {
        fetch(`${main_url}salary_advance/getSalaryAdvanceAvailableAmount/${user_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    available_amount: data.amount
                })
            })
    }

    setSalaryAdvance(one) {
        this.setState({
            requested_amount: one.requested_amount,
            purpose: one.purpose,
            available_amount: one.available_amount
        })
    }

    save() {
        stopSaving();
        if (validate('check_form')) {
            let createdBy = this.state.created_user;
            let updatedBy = this.state.created_user;
            let path = 'saveSalaryAdvance';
            if (!Array.isArray(this.state.one_advance)) {

                createdBy = this.state.one_advance.createdBy;
                path = `editSalaryAdvance/${this.state.one_advance.salary_advance_id}`
            }
            var data = {
                user_id: this.state.user_info.user_id,
                requested_amount: this.state.requested_amount,
                purpose: this.state.purpose,
                available_amount: this.state.available_amount,
                createdBy: createdBy,
                updatedBy: updatedBy,
                status : this.state.one_advance.status == 5 ? 0 : this.state.one_advance.status
            }
            let status = 0;
            fetch(`${main_url}salary_advance/${path}`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                body: `advance=${JSON.stringify(data)}`
            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    this.props.showToast(status, text);
                })
        } else {
            form_validate = false;
            startSaving();
        }
    }

    render() {
        return (
            <div>

                <div className='wrapper wrapper-content animated fadeInRight'>

                    {/* <h2>New Salary Advance</h2> */}
                    <div className="content">
                        <div className='row'>
                            <div className='form-horizontal' name='demo-form' id="check_form">
                                <div className='ibox-content float-e-margin col-md-12 col-sm-12'>
                                    <div className='ibox-content p-md col-md-12 col-sm-12'>

                                        <div className="row">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Employee Name</label>
                                                <div className="col-sm-10">
                                                    <input type="text" className="form-control input-md" value={this.state.user_info.fullname} disabled />
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Employee ID</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md" type="text" value={this.state.user_info.employment_id} disabled></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Availabel Amount</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number" min="0" step="0.01" value={this.state.available_amount} disabled></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Amount</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number" min="0" step="0.01" value={this.state.requested_amount}
                                                        onChange={(e) => this.setState({ requested_amount: e.target.value })} disabled={isRequestedUser(this.state.created_user, this.state.one_advance.createdBy)}></input>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Purpose</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="textarea"
                                                        value={this.state.purpose} onChange={(e) => this.setState({ purpose: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                {this.state.one_advance.status == undefined || this.state.one_advance.status == 5 ?
                                                    <div className="col-sm-10 btn-rightend margin-top-20">
                                                    <a href="/salary_advance"><button className="btn btn-success m-r-10">Cancel</button></a>
                                                    <button className="btn btn-primary" id="saving_button" onClick={this.save.bind(this)}>Save</button>
                                                </div>
                                                    :
                                                    ''
                                                }
                                                {/* <div className="col-sm-10 btn-rightend margin-top-20">
                                                    <a href="/salary_advance"><button className="btn btn-success m-r-10">Cancel</button></a>
                                                    <button className="btn btn-primary" id="saving_button" onClick={this.save.bind(this)}>Save</button>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

