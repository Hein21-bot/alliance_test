import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { main_url, getCookieData } from '../../../utils/CommonFunction';
import ApprovalInformation from '../../Common/ApprovalInformation';

export default class StaffLoanView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loan_data: this.props.data,
            one_loan_info: [],
            document: []
        }
    }

    componentDidMount() {
        this.getLoanInfo();
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

    render() {
        const { one_loan_info } = this.state;
        return (
            <div>
                {
                    one_loan_info !== null ?
                        <div className="wrapper wrapper-content animated fadeInRight">
                            <div className='row'>
                                <div className='form-horizontal' name='demo-form'>
                                    <div className='ibox-content float-e-margin col-md-12 col-sm-12'>
                                        <div className='ibox-content p-md col-md-12 col-sm-12'>
                                            <div className="row">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Name</label>
                                                    <div className="col-sm-12">
                                                        <input type="text" className="form-control input-md" value={one_loan_info.guarantor_name}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Branch</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={one_loan_info.branch_name} ></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Department</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={one_loan_info.deptname} onChange={(e) => this.setState({ family_member_name: e.target.value })}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Job Title</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={one_loan_info.additional_jd} onChange={(e) => this.setState({ family_member_nrc: e.target.value })}></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Bank Account</label>
                                                    <div className="col-sm-12">
                                                        <input type="text" className="form-control input-md" value={one_loan_info.thapyay_account} ></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">NRC</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={one_loan_info.nrc}  ></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Telephone</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={one_loan_info.phone} onChange={(e) => this.setState({ family_member_name: e.target.value })}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Date of Birth</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="date" value={one_loan_info.date_of_birth} onChange={(e) => this.setState({ family_member_nrc: e.target.value })}></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Join Date</label>
                                                    <div className="col-sm-12">
                                                        <input type="date" className="form-control input-md" value={one_loan_info.joining_date}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Applicant Current Salary</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={"-"} ></input>
                                                        {/* one_loan_info.applicant_name */}

                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Applicant Net Salary</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={"-"} onChange={(e) => this.setState({ family_member_name: e.target.value })}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Guarantor Salary</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={"-"} onChange={(e) => this.setState({ family_member_nrc: e.target.value })}></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Family Member Name</label>
                                                    <div className="col-sm-12">
                                                        <input type="text" className="form-control input-md" value={one_loan_info.family_member_name}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Family Member NRC</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={one_loan_info.family_member_nrc} ></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Name of Institution</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={one_loan_info.institution_name} onChange={(e) => this.setState({ family_member_name: e.target.value })}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Outstanding Amount</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="number" value={one_loan_info.outstanding_amount} onChange={(e) => this.setState({ family_member_nrc: e.target.value })}></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Installment Term</label>
                                                    <div className="col-sm-12">
                                                        <input type="number" className="form-control input-md" value={one_loan_info.installment_amount}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Installment Amount</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="number" value={one_loan_info.installment_amount} ></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Maturity Date</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="date" value={one_loan_info.maturity_date} onChange={(e) => this.setState({ family_member_name: e.target.value })}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Amount Request</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="number" value={one_loan_info.amount_requested} onChange={(e) => this.setState({ family_member_nrc: e.target.value })}></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Purposed Repayment Period</label>
                                                    <div className="col-sm-12">
                                                        <input type="number" className="form-control input-md" value={one_loan_info.repayment_period}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Loan Purpose</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={one_loan_info.loan_purpose} ></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Performance Recommened</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={one_loan_info.performance} onChange={(e) => this.setState({ institution_name: e.target.value })}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Target Achievement</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={one_loan_info.target_achieve} onChange={(e) => this.setState({ family_member_nrc: e.target.value })}></input>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" value={one_loan_info.salary_advance} name="other_loan"
                                                            checked={one_loan_info.salary_advance === 1 ? "checked" : ""}
                                                            onChange={(e) => this.setState({ salary_advance: e.target.checked })} />
                                                        <div className="state p-primary">
                                                            <label className="col-sm-12">Salary Advance</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" name="other_loan" value={one_loan_info.personal_loan}
                                                            checked={one_loan_info.personal_loan === 1 ? "checked" : ""}
                                                            onChange={(e) => this.setState({ personal_loan: e.target.checked })} />
                                                        <div className="state p-primary">
                                                            <label className="col-sm-12">Personal Loan</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" value={one_loan_info.collateral_loan} name="other_loan"
                                                            checked={one_loan_info.collateral_loan === 1 ? "checked" : ""}
                                                            onChange={(e) => this.setState({ collateral_loan: e.target.checked })} />
                                                        <div className="state p-primary">
                                                            <label className="col-sm-12">Collateral Loan</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" value={one_loan_info.other_outstanding_debts} name="other_loan"
                                                            checked={one_loan_info.other_outstanding_debts === 1 ? "checked" : ""}
                                                            onChange={(e) => this.setState({ other_outstanding_debts: e.target.checked })} />
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
                                                        <input className="form-control input-md" type="text" value={one_loan_info.recommened_user_name} onChange={(e) => this.setState({ outstanding_amount: e.target.value })}></input>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Comment</label>
                                                    <div>
                                                        <div className="col-sm-12">
                                                            <input className="form-control input-md" type="text" value={one_loan_info.comment} onChange={(e) => this.setState({ installment_term: e.target.value })}></input>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Previous Staff Loan Info</label>
                                                    <div className="col-sm-12">
                                                        <input className="form-control input-md" type="text" value={one_loan_info.branch_name} onChange={(e) => this.setState({ installment_amount: e.target.value })}></input>
                                                    </div>
                                                </div>
                                                {/* <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Attachment</label>
                                                    <div className="col-sm-12">
                                                        <input className="full_width" type="file"></input>
                                                    </div>
                                                </div> */}
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3 margin-top-20">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" value={one_loan_info.term_and_condition} name="other_loan"
                                                            checked={one_loan_info.term_and_condition === 1 ? "checked" : ""}
                                                            onChange={(e) => this.setState({ term_and_condition: e.target.checked })} />
                                                        <div className="state p-primary">
                                                            <label className="col-sm-12">Term and condition</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row margin-top-20">

                                                <div className="col-md-12 file-view">
                                                    <div className="ownspacing"></div>
                                                    <h4>Staff Loan Document</h4>
                                                    <div className="col-md-12">
                                                        <div className="ibox float-e-margins">
                                                            <div className="ibox-content p-md col-md-12" style={{ float: 'left', }}>

                                                                {this.state.document.map((data, index) =>

                                                                    <div class="fileuploader-items col-md-4"><ul class="fileuploader-items-list">

                                                                        <li class="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                                            <div class="columns"><div class="column-thumbnail">
                                                                                <div class="fileuploader-item-image fileuploader-no-thumbnail">
                                                                                    <div class="fileuploader-item-icon" style={{ backgroundColor: '#3f4fd3' }}><i>{data.name.split(".")[1]}</i>
                                                                                    </div></div><span class="fileuploader-action-popup"></span></div>
                                                                                <div class="column-title">
                                                                                    <a className="own-text" href={`${main_url}allowance/getCRDocumentData/${data.name}`}
                                                                                        download>
                                                                                        {data.name.split("&@")[1]}</a></div>
                                                                                <div class="column-actions"></div></div></li></ul>
                                                                    </div>
                                                                )
                                                                }
                                                            </div></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div className="row">
                                                <ApprovalInformation />
                                            </div> */}
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