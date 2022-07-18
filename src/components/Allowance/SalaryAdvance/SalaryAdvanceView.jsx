import React, { Component } from 'react'
import ApprovalInformation from '../../Common/ApprovalInformation';
import { ToastContainer, toast } from 'react-toastify';
import { main_url, getUserId, getCookieData, getActionStatus } from '../../../utils/CommonFunction';
import DocumentList from '../../Common/DocumentList';

export default class SalaryAdvanceRequestForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            advance_data: this.props.data,
            // getCookieData('salary_advance'),
            one_advance: [],
            employee_name: '',
            department: '',
            location: '',
            requested_amount: 0,
            purpose: '',
            duration: 0,
            monthly_installment: 0,
            approved_amount: 0,
            verifier_comment: '',
            sataus: 0,
            created_user: getUserId("user_info"),
            status_info: [],
            document: []
        }
    }
    

    componentDidMount() {
        this.getDocument()
        if (this.state.advance_data !== null) {
            this.getSalaryAdvance(this.state.advance_data);
            this.getStatusInfo();
        }

    }

    getDocument() {
        fetch(main_url + "salary_advance/getDocument/" + this.state.advance_data.salary_advance_id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({
                        document: res
                    })
                    
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    getStatusInfo() {
        fetch(`${main_url}salary_advance/getOneDetailInfo/${this.state.advance_data.salary_advance_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.log(error))
    }

    getSalaryAdvance(data) {
        fetch(`${main_url}salary_advance/getOneSalaryAdvance/advance_id=${data.salary_advance_id}`)
            .then(res => res.json())
            .then(list => {
                var one = list.detail[0];
                this.setState({
                    one_advance: one,
                    employee_name: one.employee_name,
                    requested_amount: one.requested_amount,
                    purpose: one.purpose,
                    department: one.department,
                    issue_date: one.issue_date,
                    repayment_date: one.repayment_date,
                    location: one.location,
                    salary: list.salary,
                    verifier_comment: one.comment,
                    approved_amount: one.approved_amount,
                    duration: one.duration,
                    monthly_installment: one.monthly_installment
                })
            })

    }

    monthlyInstallment() {
        var { approved_amount, duration } = this.state;
        if (approved_amount > 0 && duration > 0) {
            return (approved_amount / duration)
        }
        else return 0;
    }

    render() {
        return (
            <div>

                <div className='wrapper wrapper-content animated fadeInRight'>
                    <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                    <div className="content">
                        <div className='row'>
                            <div className='form-horizontal' name='demo-form'>
                                <div className='ibox-content float-e-margin col-md-12 col-sm-12'>
                                    <div className='ibox-content p-md col-md-12 col-sm-12'>

                                        <div className="row">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Employee Name</label>

                                                <div className="col-sm-10">
                                                    <input className="form-control input-md" type="text" value={this.state.employee_name} onChange={(e) => this.setState({ employee_name: e.target.value })} disabled></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Department</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md" type="text" value={this.state.department} disabled></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Location</label>
                                                <div className="col-sm-10"><input className="form-control input-md" type="text"
                                                    value={this.state.location} disabled></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Monthly Salary</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md" type="number" step={0.01} min={0}
                                                        value={this.state.salary} disabled></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Requested Amount</label>
                                                <div className="col-sm-10"><input className="form-control input-md" type="number"
                                                    step={0.01} min={0} value={this.state.requested_amount} disabled></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Approved Amount</label>
                                                <div className="col-sm-10"><input className="form-control input-md" type="number"
                                                    step={0.01} min={0} value={this.state.approved_amount} disabled></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Duration</label>
                                                <div className="col-sm-10"><input className="form-control input-md" type="number"
                                                    step={0.01} min={0} value={this.state.duration} disabled></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Monthly Installment</label>
                                                <div className="col-sm-10"><input className="form-control input-md" type="number"
                                                    step={0.01} min={0} value={this.monthlyInstallment()} disabled></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Issue Date</label>
                                                <div className="col-sm-10"><input className="form-control input-md" type="date"
                                                    value={this.state.issue_date} disabled></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Repayment Date</label>
                                                <div className="col-sm-10"><input className="form-control input-md" min={this.state.issue_date}
                                                    type="date" value={this.state.repayment_date} disabled></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Purpose</label>
                                                <div className="col-sm-10"><input className="form-control input-md" type="textarea"
                                                    value={this.state.purpose} disabled></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Comment</label>
                                                <div className="col-sm-10"><input className="form-control input-md" type="textarea" cols="30" rows="5"
                                                    value={this.state.verifier_comment} disabled></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row document-main">
                                            {
                                                this.state.document.length > 0 ?
                                                    <DocumentList title='Salary Advance Document' doc={this.state.document} path='salary_advance' />
                                                    : 'hey'
                                            }
                                        </div>
                                        <div className="row approval-main">
                                            {
                                                !Array.isArray(this.state.status_info) ?

                                                    <div className="margin-top-20">
                                                        <ApprovalInformation status={this.state.status_info} />
                                                    </div>
                                                    : ''
                                            }
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

