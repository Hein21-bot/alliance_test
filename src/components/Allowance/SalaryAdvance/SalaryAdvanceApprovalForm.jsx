import React, { Component } from 'react'
import ApprovalForm from '../../Common/ApprovalForm';
import { main_url, getUserId, getActionStatus, validate, stopSaving, startSaving } from '../../../utils/CommonFunction';
import moment from 'moment';
import DocumentList from '../../Common/DocumentList';
import { ToastContainer, toast } from "react-toastify";
import DatePicker from "react-datetime";

var form_validate = true;
export default class SalaryAdvanceApprovalForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            advance_data: this.props.data,
            one_advance: [],
            employee_list: [],
            selected_employee: [],
            employee_name: '',
            department: '',
            location: '',
            requested_amount: 0,
            purpose: '',
            duration: 0,
            monthly_installment: 0,
            approved_amount: 0,
            verifier_comment: '',
            verifier_comment: '',
            sataus: 0,
            created_user: getUserId("user_info"),
            status_title: '',
            comment: '',
            doc: [],
            repayment_date:new Date(),
            issue_date:new Date()
        }
    }

    componentDidMount() {
        this.getDocument(this.state.advance_data)
        if (this.state.advance_data !== null) {
            this.getSalaryAdvance(this.state.advance_data);
        }
    }

    getDocument(data) {
        fetch(main_url + "salary_advance/getDocument/" + data.salary_advance_id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({
                        doc: res
                    })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    componentDidUpdate() {
        if (!form_validate) validate("check_form")
    }

    getSalaryAdvance(data) {
        fetch(`${main_url}salary_advance/getOneSalaryAdvance/advance_id=${data.salary_advance_id}`)
            .then(res => res.json())
            .then(list => {
                var one = list.detail[0];
                console.log("one====>",one)

                this.setState({
                    one_advance: one,
                    employee_name: one.employee_name,
                    requested_amount: one.requested_amount,
                    purpose: one.purpose,
                    department: one.department,
                    // selected_employee: { label: one.employee_name, value: one.user_id },
                    location: one.location,
                    salary: list.salary,
                    issue_date: one.issue_date,
                    repayment_date: one.repayment_date,
                    verifier_comment: one.comment,
                    approved_amount: one.approved_amount,
                    duration: one.duration,
                    monthly_installment: one.monthly_installment

                })
            })

    }

    getEmployeeList() {
        fetch(`${main_url}staff_loan/getEmployeeList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    employee_list: list
                })
            })
    }

    monthlyInstallment() {

        const { approved_amount, duration } = this.state;
        if (approved_amount > 0 && duration > 0) {
            const result = (approved_amount / duration).toFixed();

            return result
        }
        else return 0;
    }

    approvalStatus = (text, comment) => {
        this.setState({ status_title: text, comment: comment }, () => this.save())
    }
   

    save() {
       if(this.state.one_advance.status == 1 && (this.state.approved_amount !=0 || this.state.approved_amount!='') && (this.state.duration!=0 || this.state.duration != '') && this.state.repayment_date!=null && this.state.issue_date!=null){
        let updatedBy = this.state.created_user;
        let one_advance = this.state.one_advance;
        let { status_title } = this.state;
        const formdata = new FormData()
        let path = 'saveSalaryAdvance';
        if (!Array.isArray(one_advance)) {
            path = `editSalaryAdvance/${one_advance.salary_advance_id}`
        }
        var data = {
            user_id: one_advance.user_id,
            requested_amount: this.state.requested_amount,
            purpose: this.state.purpose,
            duration: parseInt(this.state.duration),
            issue_date: this.state.issue_date,
            repayment_date: this.state.repayment_date,
            monthly_installment: this.monthlyInstallment(),
            // this.state.monthly_installment,
            approved_amount: parseInt(this.state.approved_amount),
            comment: this.state.verifier_comment,
            updatedBy: updatedBy,

        };

        if (status_title !== '') {
            var action = getActionStatus(status_title, this.state.one_advance, updatedBy, this.state.comment);
            data.referback_by = action.referback_by;
            data.checked_by = action.checked_by;
            data.verified_by = action.verified_by;
            data.approved_by = action.approved_by;
            data.rejected_by = action.rejected_by;
            data.referback_date = action.referback_date;
            data.checked_date = action.checked_date;
            data.verified_date = action.verified_date;
            data.approved_date = action.approved_date;
            data.rejected_date = action.rejected_date;
            data.referback_comment = action.referback_comment;
            data.checked_comment = action.checked_comment;
            data.verified_comment = action.verified_comment;
            data.approved_comment = action.approved_comment;
            data.status = action.status;
        }
        formdata.append('advance', JSON.stringify(data))
        formdata.append('oldDoc', JSON.stringify(this.state.doc))
        let status = 0;
        fetch(`${main_url}salary_advance/${path}`, {
            method: 'POST',
            body: formdata
        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                this.props.showToast(status, text);
            })
       }
        // else if (this.state.one_advance.status != 2) {
        //     let updatedBy = this.state.created_user;
        //     let one_advance = this.state.one_advance;
        //     let { status_title } = this.state;
        //     const formdata = new FormData()
        //     let path = 'saveSalaryAdvance';
        //     if (!Array.isArray(one_advance)) {
        //         path = `editSalaryAdvance/${one_advance.salary_advance_id}`
        //     }
        //     var data = {
        //         user_id: one_advance.user_id,
        //         requested_amount: this.state.requested_amount,
        //         purpose: this.state.purpose,
        //         duration: parseInt(this.state.duration),
        //         issue_date: this.state.issue_date,
        //         repayment_date: this.state.repayment_date,
        //         monthly_installment: this.monthlyInstallment(),
        //         // this.state.monthly_installment,
        //         approved_amount: parseInt(this.state.approved_amount),
        //         comment: this.state.verifier_comment,
        //         updatedBy: updatedBy,

        //     };

        //     if (status_title !== '') {
        //         var action = getActionStatus(status_title, this.state.one_advance, updatedBy, this.state.comment);
        //         data.referback_by = action.referback_by;
        //         data.checked_by = action.checked_by;
        //         data.verified_by = action.verified_by;
        //         data.approved_by = action.approved_by;
        //         data.rejected_by = action.rejected_by;
        //         data.referback_date = action.referback_date;
        //         data.checked_date = action.checked_date;
        //         data.verified_date = action.verified_date;
        //         data.approved_date = action.approved_date;
        //         data.rejected_date = action.rejected_date;
        //         data.referback_comment = action.referback_comment;
        //         data.checked_comment = action.checked_comment;
        //         data.verified_comment = action.verified_comment;
        //         data.approved_comment = action.approved_comment;
        //         data.status = action.status;
        //     }
        //     formdata.append('advance', JSON.stringify(data))
        //     formdata.append('oldDoc', JSON.stringify(this.state.doc))
        //     let status = 0;
        //     fetch(`${main_url}salary_advancefadsfdsa/${path}`, {
        //         method: 'POST',
        //         body: formdata
        //     })
        //         .then(res => {
        //             status = res.status;
        //             return res.text()
        //         })
        //         .then(text => {
        //             this.props.showToast(status, text);
        //         })
        // }
        else if (this.state.one_advance.status !=1) {
            let updatedBy = this.state.created_user;
            let one_advance = this.state.one_advance;
            let { status_title } = this.state;
            const formdata = new FormData()
            let path = 'saveSalaryAdvance';
            if (!Array.isArray(one_advance)) {
                path = `editSalaryAdvance/${one_advance.salary_advance_id}`
            }
            var data = {
                user_id: one_advance.user_id,
                requested_amount: this.state.requested_amount,
                purpose: this.state.purpose,
                duration: parseInt(this.state.duration),
                issue_date: this.state.issue_date,
                repayment_date: this.state.repayment_date,
                monthly_installment: this.monthlyInstallment(),
                // this.state.monthly_installment,
                approved_amount: parseInt(this.state.approved_amount),
                comment: this.state.verifier_comment,
                updatedBy: updatedBy,

            };

            if (status_title !== '') {
                var action = getActionStatus(status_title, this.state.one_advance, updatedBy, this.state.comment);
                data.referback_by = action.referback_by;
                data.checked_by = action.checked_by;
                data.verified_by = action.verified_by;
                data.approved_by = action.approved_by;
                data.rejected_by = action.rejected_by;
                data.referback_date = action.referback_date;
                data.checked_date = action.checked_date;
                data.verified_date = action.verified_date;
                data.approved_date = action.approved_date;
                data.rejected_date = action.rejected_date;
                data.referback_comment = action.referback_comment;
                data.checked_comment = action.checked_comment;
                data.verified_comment = action.verified_comment;
                data.approved_comment = action.approved_comment;
                data.status = action.status;
            }
            formdata.append('advance', JSON.stringify(data))
            formdata.append('oldDoc', JSON.stringify(this.state.doc))
            let status = 0;
            fetch(`${main_url}salary_advance/${path}`, {
                method: 'POST',
                body: formdata
            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    this.props.showToast(status, text);
                })
        }
        else {
            console.log("br nyar")
            toast.error("Please fill informatin successfully")
            // form_validate = false;
            // startSaving();
            
        }
    }

    render() {
        console.log("render",moment(this.state.issue_date).format('YYYY/MM/DD'))
        return (
            <div>
                <div className='wrapper wrapper-content'>
                    <div className="content">
                        <div className='row'>
                            <div className='form-horizontal' name='demo-form' id="check_form">
                                <div className='ibox-content float-e-margin col-md-12 col-sm-12'>
                                    <div className='ibox-content p-md col-md-12 col-sm-12'>

                                        <div className="row">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Employee Name</label>

                                                <div className="col-sm-10"><input className="form-control input-md" type="text" value={this.state.employee_name} onChange={(e) => this.setState({ employee_name: e.target.value })} disabled></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Department</label>
                                                <div className="col-sm-10"><input className="form-control input-md" type="text" value={this.state.department} onChange={(e) => this.setState({ requested_amount: e.target.value })} disabled></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Location</label>
                                                <div className="col-sm-10"><input className="form-control input-md" type="text" value={this.state.location} onChange={(e) => this.setState({ requested_amount: e.target.value })} disabled></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Monthly Salary</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md" type="number" min="0" step="0.01" value={this.state.salary} onChange={(e) => this.setState({ salary: e.target.value })} disabled></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Requested Amount</label>
                                                <div className="col-sm-10"><input className="form-control input-md" type="number" min="0" step="0.01" value={this.state.requested_amount} onChange={(e) => this.setState({ requested_amount: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Approved Amount</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number" min="0" step="0.01" value={this.state.approved_amount} onChange={(e) => this.setState({ approved_amount: e.target.value })}></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Duration</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number" min="0" step="0.01" value={this.state.duration} onChange={(e) => this.setState({ duration: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Monthly Installment</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number" min="0" step="0.01" value={this.monthlyInstallment()} onChange={(e) => this.setState({ monthly_installment: e.target.value })} ></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Issue Date</label>
                                                <div className="col-sm-10">
                                                <DatePicker
                                                        dateFormat="YYYY/MM/DD"
                                                        value={this.state.issue_date ? moment(this.state.issue_date).format('YYYY/MM/DD') : ''}
                                                        timeFormat={false}
                                                        onChange={(e) => this.setState({ issue_date: e })}
                                                    />
                                                {/* <div className="col-sm-10"><input className="form-control checkValidate input-md" type="date" value={this.state.issue_date ? moment(this.state.issue_date).format('YYYY/MM/DD') : 'dd/mm/yy'} onChange={(e) => this.setState({ issue_date: e.target.value })}></input> */}
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Repayment Date</label>
                                                <div className="col-sm-10">
                                                <DatePicker
                                                        dateFormat="YYYY/MM/DD"
                                                        value={this.state.repayment_date ? moment(this.state.repayment_date).format('YYYY/MM/DD') : ''}
                                                        timeFormat={false}
                                                        onChange={(e) => this.setState({ repayment_date: e })}
                                                    />
                                                    {/* <input className="form-control checkValidate input-md" min={this.state.repayment_date} type="date" value={this.state.repayment_date} onChange={(e) => this.setState({ repayment_date: e.target.value })}></input> */}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Purpose</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md"
                                                        type="textarea"
                                                        value={this.state.purpose}
                                                        onChange={(e) => this.setState({ purpose: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Comment</label>
                                                <div className="col-sm-10"><input className="form-control input-md" type="textarea" value={this.state.verifier_comment} onChange={(e) => this.setState({ verifier_comment: e.target.value })}></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>{
                                            this.state.doc.length > 0 ? <div className="row document-main">
                                                <input className="full_width hidden" type="file" id="attach_file" ></input>

                                                <DocumentList title='Salary Advance Document' doc={this.state.doc} path="salary_advance" />
                                            </div> : <input className="full_width hidden" type="file" id="attach_file" ></input>
                                        }</div>
                                        <div className="row  m-20 f-right">
                                            <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.one_advance.status} work_flow={this.props.work_flow_status} total_amount={this.state.requested_amount} />

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

