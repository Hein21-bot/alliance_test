import React, { Component } from 'react';
import { main_url } from '../../../utils/CommonFunction';
import DocumentList from '../../Common/DocumentList';
import ApprovalInformation from '../../Common/ApprovalInformation';
import moment from 'moment';

export default class StaffLoanView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loan_data: this.props.data,
            one_info: [],
            document: [],
            status_info: []
        }
    }

    componentDidMount() {
        this.getLoanInfo();
        this.getStatusInfo();
    }

    getLoanInfo() {
        fetch(`${main_url}staff_loan/getOneLoanInfo/${this.state.loan_data.staff_loan_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    one_info: res.loan[0],
                    document: res.doc
                })
            })
            .catch(error => console.log(error))
    }

    getStatusInfo() {
        fetch(`${main_url}staff_loan/getOneDetailInfo/${this.state.loan_data.staff_loan_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.log(error))
    }


    render() {
        const { one_info } = this.state;
        return (
            <div>
                {
                    one_info !== null ?
                        <div className="wrapper wrapper-content animated fadeInRight">

                            <div className='row'>
                                <div className='form-horizontal' name='demo-form' id="check_form">
                                    <div className='ibox-content float-e-margin col-md-12 col-sm-12'>
                                        <div className='ibox-content p-md col-md-12 col-sm-12'>
                                            <div className="row">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Name</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            type="text"
                                                            className="form-control input-md"
                                                            value={one_info.applicant_name}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">NRC</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            value={one_info.nrc}
                                                            className='form-control input-md'
                                                            type="text"
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Bank Account</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            value={one_info.bank_acc}
                                                            className="form-control input-md"
                                                            type="text"
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Branch</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            type="text"
                                                            value={one_info.branch_name}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Department</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            type="text"
                                                            value={one_info.deptname}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Designation</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            value={one_info.designations}
                                                            className='form-control input-md'
                                                            type="text"
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Telephone</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            type="text"
                                                            value={one_info.phone}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Date of Birth</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            type="text"
                                                            value={moment(one_info.date_of_birth).format('DD-MM-YYYY')}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Join Date</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            type="text"
                                                            value={moment(one_info.joining_date).format('DD-MM-YYYY')}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Applicant Current Salary</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.current_salary}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Applicant Net Salary</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.net_salary}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Guarantor Name</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.guarantor_name}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Guarantor Salary</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.guarantor_salary}
                                                            disabled
                                                            />
                                                </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Guarantor ID</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md" 
                                                    type="text" 
                                                    value={one_info.guarantor_employment_id}
                                                    disabled>
                                                    </input>
                                                    
                                                 </div>
                                            </div>
  
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Family Member Guarantor</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.family_member_name}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                </div>
                                            <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" value={one_info.salary_advance} name="other_loan"
                                                            checked={one_info.salary_advance === 1 ? "checked" : ""}
                                                            onChange={(e) => this.setState({ salary_advance: e.target.checked })} />
                                                        <div className="state p-primary">
                                                            <label className="col-sm-12">Salary Advance</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" name="other_loan" value={one_info.personal_loan}
                                                            checked={one_info.personal_loan === 1 ? "checked" : ""}
                                                            onChange={(e) => this.setState({ personal_loan: e.target.checked })} />
                                                        <div className="state p-primary">
                                                            <label className="col-sm-12">Personal Loan</label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" value={one_info.collateral_loan} name="other_loan"
                                                            checked={one_info.collateral_loan === 1 ? "checked" : ""}
                                                            onChange={(e) => this.setState({ collateral_loan: e.target.checked })} />
                                                        <div className="state p-primary">
                                                            <label className="col-sm-12">Collateral Loan</label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" value={one_info.other_outstanding_debts} name="other_loan"
                                                            checked={one_info.other_outstanding_debts === 1 ? "checked" : ""}
                                                            onChange={(e) => this.setState({ other_outstanding_debts: e.target.checked })} />
                                                        <div className="state p-primary">
                                                            <label className="col-sm-12">Other outstanding debts</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Family Member Guarantor NRC</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.family_member_nrc}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm--6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Family Member Guarantor Relatives</label>
                                                <div className="col-sm-12">
                                                    <input
                                                     type = "text"
                                                     value={one_info.type_name}
                                                     className='form-control input-md'
                                                     disabled
                                                     />
                                                </div>
                                            </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Name of Institution</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.institution_name}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Outstanding Amount</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.outstanding_amount}
                                                            disabled
                                                        />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Installment Term</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.installment_term}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Maturity Date</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.maturity_date}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Amount Requested</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.amount_requested}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Proposed Repayment Period</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.repayment_period}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                </div>
                                                <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Loan Purpose</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.loan_purpose}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Target Achievement</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.target_achieve}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Performance Recommendation</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.performance}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Recommend By</label>
                                                    <div className="col-sm-12">
                                                        <input
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            type="text"
                                                            value={one_info.recommened_user_name}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                                </div>
                                                <div className="row margin-top-20">
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3 margin-top-20">
                                                    <div className="pretty p-default">
                                                        <input type="checkbox" name="term_and_condition"
                                                            value={this.state.term_and_condition}
                                                            checked={this.state.term_and_condition === 1 || this.state.term_and_condition === true ? "checked" : ""}
                                                            onChange={(e) => this.setState({ term_and_condition: e.target.checked })} />
                                                        <div className="state p-primary">
                                                            <label>Term and Condition</label>
                                                        </div>
                                                    </div>
                                            </div>
                                                <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                    <label className="col-sm-12">Comment</label>
                                                    <div className="col-sm-12">
                                                        <textarea
                                                            col="20"
                                                            row="5"
                                                            className="form-control input-md"
                                                            classNamePrefix="react-select"
                                                            value={one_info.comment}
                                                            disabled
                                                        />
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
                                            <div className="row approval-main">
                                            {
                                                !Array.isArray(this.state.status_info) ?

                                                    <div className="margin-top-20">
                                                        <ApprovalInformation status={this.state.status_info} />
                                                    </div>
                                                    : ''
                                            }
                                        </div>

                                            {/* {
                                                !Array.isArray(this.state.loan_data) && this.state.loan_data !== null ?

                                                    <div className="row margin-top-20">

                                                        <div className="col-md-12 file-view">
                                                            <div className="ownspacing"></div>
                                                            <h4>Staff Loan Document</h4>
                                                            <div className="col-md-12">
                                                                <div className="ibox float-e-margins">
                                                                    <div className="ibox-content p-md col-md-12" style={{ float: 'left', }}>

                                                                        {this.state.doc.map((data, index) =>
                                                                            <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">
                                                                                <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                                                    <div className="columns"><div className="column-thumbnail">
                                                                                        <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                                                                            <div className="fileuploader-item-icon" style={{ backgroundColor: '#3f4fd3' }}><i>{data.name.split(".")[1]}</i>
                                                                                            </div></div><span className="fileuploader-action-popup"></span></div>
                                                                                        <div className="column-title">
                                                                                            <span className="own-text">
                                                                                                {data.name.split("&@")[1]}</span></div>
                                                                                        <div className="column-actions">
                                                                                            <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeOldDocument(index, event)}> <i></i></a>
                                                                                        </div></div></li></ul>

                                                                            </div>
                                                                        )
                                                                        }
                                                                        {this.state.newDoc.map((data, index) =>

                                                                            <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">

                                                                                <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                                                    <div className="columns"><div className="column-thumbnail">
                                                                                        <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                                                                            <div className="fileuploader-item-icon" style={{ backgroundColor: '#3f4fd3' }}><i>{data.name.split(".")[1]}</i>
                                                                                            </div></div><span className="fileuploader-action-popup"></span></div>
                                                                                        <div className="column-title">
                                                                                            <span className="own-text">
                                                                                                {data.name}</span></div>
                                                                                        <div className="column-actions">
                                                                                            <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeNewDocument(index, event)}> <i></i></a>
                                                                                        </div></div></li></ul>
                                                                            </div>
                                                                        )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : ""
                                            }

                                            <div className="row m-20 f-right">
                                                <button className="btn btn-primary" id="saving_button" onClick={this.save.bind(this)}>Save</button>
                                            </div> */}
                                        </div >
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