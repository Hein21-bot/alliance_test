import React, { Component } from 'react';
import DocumentList from '../../Common/DocumentList';
import ApprovalForm from '../../Common/ApprovalForm';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import { main_url, getUserId, validate, getActionStatus, stopSaving, startSaving } from '../../../utils/CommonFunction';

var form_validate = true;
export default class StaffLoanApproval extends Component {

    constructor(props) {
        super(props);
        var user_id = getUserId("user_info");
        this.state = {
            loan_data: this.props.data,
            one_loan_info: [],
            document: [],
            previous_staff_loan: false,
            updatedBy: user_id
        }
    }

    componentDidMount() {
        this.getLoanInfo();
        this.checkPreviousStaffLoan();
    }

    checkPreviousStaffLoan() {
        fetch(`${main_url}staff_loan/checkPreviousStaffLoan/${this.state.loan_data.staff_loan_id}/${this.state.loan_data.applicant_id}`)
            .then(res => res.json())
            .then(res => {
                if (res.length > 0) {
                    this.setState({ previous_staff_loan: true })
                }
            })
            .catch(error => console.log(error))
    }

    componentDidUpdate() {
        if (!form_validate) validate("check_form")
    }

    getLoanInfo() {
        fetch(`${main_url}staff_loan/getOneLoanInfo/${this.state.loan_data.staff_loan_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    one_loan_info: res.loan[0],
                    document: res.doc
                })
            })
            .catch(error => console.log(error))
    }

    approvalStatus = (text) => {
        this.setState({ status_title: text }, () => this.save())
    }

    save() {
        stopSaving();
        if (validate("check_form")) {
            stopSaving();
            var data = this.state.one_loan_info
            let status = 0;
            let path = 'saveStaffLoan';
            let { status_title } = this.state;

            if (status_title !== '') {
                var action = getActionStatus(status_title, data, this.state.updatedBy);
                data.checked_by = action.checked_by;
                data.verified_by = action.verified_by;
                data.approved_by = action.approved_by;
                data.rejected_by = action.rejected_by;
                data.checked_date = action.checked_date;
                data.verified_date = action.verified_date;
                data.approved_date = action.approved_date;
                data.rejected_date = action.rejected_date;
                data.status = action.status;
            }

            fetch(`${main_url}staff_loan/setStaffLoanApproval/${data.staff_loan_id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `staff_loan=${JSON.stringify(data)}`
            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    if (status === 200) {
                        toast.success(text);
                        window.location.reload();
                    }
                    else toast.error(text);
                    // window.location.replace("/staff_loan");

                })
        } else {
            startSaving();
            form_validate = false;
        }
    }


    render() {
        const { one_loan_info } = this.state;
        return (
            <div>

                {
                    one_loan_info !== null ?
                        <div className="wrapper wrapper-content animated fadeInRight" id="check_form">
                            <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                            <div className='row'>
                                <div className='form-horizontal' name='demo-form'>
                                    <div className='ibox-content float-e-margin col-md-12 col-sm-12'>
                                        <div className='ibox-content p-md col-md-12 col-sm-12'>
                                            <div className="row">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Name</label>
                                                    <div className="col-sm-12">
                                                        <input type="text" className="form-control input-md"
                                                            value={one_loan_info.guarantor_name} disabled></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Branch</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text"
                                                            value={one_loan_info.branch_name} disabled></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Department</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text"
                                                            value={one_loan_info.deptname}
                                                            disabled></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Job Title</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text"
                                                            value={one_loan_info.additional_jd}
                                                            disabled></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Bank Account</label>
                                                    <div className="col-sm-12">
                                                        <input type="text" className="form-control input-md"
                                                            value={one_loan_info.thapyay_account} disabled></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">NRC</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={one_loan_info.nrc} disabled></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Telephone</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text"
                                                            value={one_loan_info.phone}
                                                            disabled></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Date of Birth</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="date"
                                                            value={moment(one_loan_info.date_of_birth).format('DD-MM-YYYY')}
                                                            disabled></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Join Date</label>
                                                    <div className="col-sm-12">
                                                        <input type="date" className="form-control input-md"
                                                            value={moment(one_loan_info.joining_date).format('DD-MM-YYYY')} disabled></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Applicant Current Salary</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value='-' disabled></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Applicant Net Salary</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value='-' disabled></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Guarantor Salary</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value='-' disabled></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Family Member Name</label>
                                                    <div className="col-sm-12">
                                                        <input type="text" className="form-control input-md" value={one_loan_info.family_member_name} disabled></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Family Member NRC</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={one_loan_info.family_member_nrc} disabled></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Name of Institution</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md checkValidate" type="text" value={one_loan_info.institution_name}
                                                            onChange={(e) => {
                                                                var one = this.state.one_loan_info;
                                                                one.institution_name = e.target.value
                                                                this.setState({ one_loan_info: one })
                                                            }}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Outstanding Amount</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md checkValidate" type="number" min="0" step="0.01"
                                                            value={one_loan_info.outstanding_amount}
                                                            onChange={(e) => {
                                                                var one = this.state.one_loan_info;
                                                                one.outstanding_amount = e.target.value
                                                                this.setState({ one_loan_info: one })
                                                            }}></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Installment Term</label>
                                                    <div className="col-sm-12">
                                                        <input type="number" className="form-control input-md checkValidate" min="0" step="0.01"
                                                            value={one_loan_info.installment_term}
                                                            onChange={(e) => {
                                                                var one = this.state.one_loan_info;
                                                                one.installment_term = e.target.value
                                                                this.setState({ one_loan_info: one })
                                                            }}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Installment Amount</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md checkValidate" type="number" min="0" step="0.01"
                                                            value={one_loan_info.installment_amount}
                                                            onChange={(e) => {
                                                                var one = this.state.one_loan_info;
                                                                one.installment_amount = e.target.value
                                                                this.setState({ one_loan_info: one })
                                                            }}
                                                        ></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Maturity Date</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md checkValidate" type="date"
                                                            value={one_loan_info.maturity_date}
                                                            onChange={(e) => {
                                                                var one = this.state.one_loan_info;
                                                                one.maturity_date = e.target.value
                                                                this.setState({ one_loan_info: one })
                                                            }}
                                                        ></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Amount Request</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md checkValidate" type="number" min="0" step="0.01"
                                                            value={one_loan_info.amount_requested}
                                                            onChange={(e) => {
                                                                var one = this.state.one_loan_info;
                                                                one.amount_requested = e.target.value
                                                                this.setState({ one_loan_info: one })
                                                            }}></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Purposed Repayment Period</label>
                                                    <div className="col-sm-12">
                                                        <input type="number" className="form-control input-md checkValidate" min="0" step="0.01"
                                                            value={one_loan_info.repayment_period}
                                                            onChange={(e) => {
                                                                var one = this.state.one_loan_info;
                                                                one.repayment_period = e.target.value
                                                                this.setState({ one_loan_info: one })
                                                            }}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Loan Purpose</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text"
                                                            value={one_loan_info.loan_purpose} disabled></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Performance Recommened</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text"
                                                            value={one_loan_info.performance} disabled></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Target Achievement</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text"
                                                            value={one_loan_info.target_achieve} disabled></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" value={one_loan_info.salary_advance} name="other_loan"
                                                            checked={one_loan_info.salary_advance === 1 ? "checked" : ""}
                                                            disabled />
                                                        <div className="state p-primary">
                                                            <label className="col-sm-12">Salary Advance</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" name="other_loan" value={one_loan_info.personal_loan}
                                                            checked={one_loan_info.personal_loan === 1 ? "checked" : ""}
                                                            disabled />
                                                        <div className="state p-primary">
                                                            <label className="col-sm-12">Personal Loan</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" value={one_loan_info.collateral_loan} name="other_loan"
                                                            checked={one_loan_info.collateral_loan === 1 ? "checked" : ""}
                                                            disabled />
                                                        <div className="state p-primary">
                                                            <label className="col-sm-12">Collateral Loan</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" value={one_loan_info.other_outstanding_debts} name="other_loan"
                                                            checked={one_loan_info.other_outstanding_debts === 1 ? "checked" : ""}
                                                            disabled />
                                                        <div className="state p-primary">
                                                            <label className="col-sm-12">Other outstanding debts</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">

                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Recommened By</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text"
                                                            value={one_loan_info.recommened_user_name}
                                                            disabled></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Comment</label>
                                                    <div>
                                                        <div className="col-sm-12">
                                                            <input className="form-control input-md" type="text"
                                                                value={one_loan_info.comment}
                                                                onChange={(e) => {
                                                                    var one = this.state.one_loan_info;
                                                                    one.comment = e.target.value
                                                                    this.setState({ one_loan_info: one })
                                                                }}></input>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Previous Staff Loan Info</label>
                                                    <div className="col-sm-12">
                                                        {
                                                            this.state.previous_staff_loan ?
                                                                <button className="btn btn-save" id="saving_button" onClick={() => this.props.goToViewForm()}>View</button> :
                                                                <button className="btn btn-save" id="saving_button" disabled> Not Exist</button>
                                                        }

                                                    </div>
                                                </div>
                                                {/* <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Attachment</label>
                                                    <div className="col-sm-12">
                                                        <input className="full_width" type="file"></input>
                                                    </div>
                                                </div> */}

                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" value={one_loan_info.term_and_condition} name="other_loan"
                                                            checked={one_loan_info.term_and_condition === 1 ? "checked" : ""}
                                                            disabled />
                                                        <div className="state p-primary">
                                                            <label className="col-sm-12">Term and condition</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row document-main">
                                                {
                                                    this.state.document.length > 0 ?
                                                        <DocumentList title='Staff Loan Document' doc={this.state.document} path='staff_loan' />
                                                        : ''
                                                }
                                            </div>
                                            <div className="row save-btn">
                                                <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.one_loan_info.status} work_flow={this.props.work_flow_status} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : <h3> There is no data found!</h3>
                }
            </div>
        )
    }
}