import React, { Component } from 'react';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import { main_url, validate, getUserId, stopSaving, startSaving, getCookieData, getPersonType, } from '../../../utils/CommonFunction';
import 'react-toastify/dist/ReactToastify.css';
// const $ = require('jquery');

var form_validate = true;
export default class ApplyForm extends Component {

    constructor(props) {
        super(props);
        var user_id = getUserId("user_info")
        this.state = {
            one_info: [],
            user_id: user_id,
            guarantor_id: user_id,
            applicant_id: user_id,
            loan_data: this.props.data,
            doc: [],
            newDoc: [],
            guarantor_list: '',
            selected_relative: [],
            relative_list: [],
            selected_guarantor: [],
            recommended_user_list: [],
            selected_recommended: [],
            createdBy: user_id,
            updatedBy: user_id
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate("check_form")
    }

    async  componentDidMount() {
        let relative_list = await getPersonType();
        this.setState({
            relative_list: relative_list
        })
        this.getCheckSalaryAdvance(this.state.salary_advance);
        //  console.log(this.state.salary_advance);
        this.getOneInfo();
        if (!Array.isArray(this.state.loan_data) && this.state.loan_data !== null) {
            this.getLoanInfo();

        }
        fetch(`${main_url}staff_loan/getEmployeeList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    guarantor_list: list,
                    recommended_user_list: list
                })

            })
    }

    getCheckSalaryAdvance() {
        fetch(`${main_url}staff_loan/getCheckSalaryAdvance/${this.state.user_id}`)
            .then(res => res.json())
            .then(res => {

                if (res.length > 0) {
                    this.setState({ salary_advance: 1 })
                }
                else {
                    this.setState({ salary_advance: 0 })
                }
            })
            .catch(error => console.log(error))

    }


    getLoanInfo() {
        fetch(`${main_url}staff_loan/getOneLoanInfo/${this.state.loan_data.staff_loan_id}`)
            .then(res => res.json())
            .then(res => {
                this.setOneLoanInfo(res.loan[0]);
                this.setState({
                    one_loan_info: res.loan[0],
                    doc: res.doc
                })
            })
            .catch(error => console.log(error))

    }

    getOneInfo() {
        fetch(`${main_url}staff_loan/getOneInfo/${this.state.createdBy}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    one_info: res[0]
                })
            })
            .catch(error => console.log(error))
    }

    setOneLoanInfo(one) {
        console.log(one);
        this.setState({
            selected_relative: { value: one.person_type_id, label: one.type_name },
            selected_guarantor: { value: one.guarantor_id, label: one.guarantor_name, nrc: one.guarantor_nrc, employment_id: one.guarantor_employment_id },
            bank_acc: one.bank_acc,
            // branch: one.branch,
             // department: one.department,
            // des ignation: one.designation,
            // telephone: one.telephone,
            // one_info: one.one_info,
            institution_name: one.institution_name,
            outstanding_amount: one.outstanding_amount,
            installment_amount: one.installment_amount,
            installment_term: one.installment_term,
            maturity_date: one.maturity_date,
            amount_requested: one.amount_requested,
            repayment_period: one.repayment_period,
            loan_purpose: one.loan_purpose,
            salary_advance: one.salary_advance,
            personal_loan: one.personal_loan,
            collateral_loan: one.collateral_loan,
            other_outstanding_debts: one.other_outstanding_debts,
            target_achieve: one.target_achieve,
            performance: one.performance,
            comment: one.comment,
            term_and_condition: one.term_and_condition,
            selected_recommended: { value: one.recommended_by, label: one.recommened_user_name },
            family_member_name: one.family_member_name,
            family_member_nrc: one.family_member_nrc,
            applicant_id: one.applicant_id,
            createdBy: one.createdBy,
            updatedBy: this.state.user_id
        })
    }

    handleSelectedRelative(event) {
        this.setState({
            selected_relative: event
        })
        //console.log(e)
    }

    handleSelectedGuarantor(e) {
        this.setState({
            selected_guarantor: e
        })
    }

    handleSelectedRecommendedBy(e) {
        this.setState({
            selected_recommended: e
        })
    }

    handlefileChanged(event) {
        event.preventDefault();
        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#attach_file").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#attach_file").files[i];
            newDoc.push(getfile)
        }
        this.setState({
            newDoc: newDoc
        })
    }

    removeOldDocument(index, event) {
        var array = this.state.doc;
        array.splice(index, 1);
        this.setState({
            doc: array
        })
    }

    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        array.splice(index, 1);
        this.setState({
            newDoc: array
        })
    }

    checkFiles(e) {
        var files = document.getElementById("attach_file").files;
        var attachment = [];
        if (files.length > 5) {
            toast.warning('You can only upload a maximum of 5 files!')
        }
        else {
            for (let i = 0; i < files.length; i++) {
                attachment.push(files[i])
            }
        }
        this.setState({
            attachment: attachment
        })

    }

    handelSalaryAdvance(e) {
        this.setState({ salary_advance: e.target.checked })
    }

    save() {
        stopSaving();
        // if ()
        if (validate("check_form")) {
            var data = {
                // one_info: this.state.one_info,
                // user_info: this.state.user_info,
                // bank_acc: this.state.bank_acc,
                // branch: this.state.branch,
                // department: this.state.department,
                // designation: this.state.designation,
                // telephone: this.state.telephone,
                //  user_id: this.state.user_info.user_id,
                person_type_id: this.state.selected_relative.value,
                employment_id: this.state.selected_guarantor.value,
                guarantor_id: this.state.selected_guarantor.value,
                recommended_by: this.state.selected_recommended.value,
                applicant_id: this.state.applicant_id,
                family_member_name: this.state.family_member_name,
                family_member_nrc: this.state.family_member_nrc,
                institution_name: this.state.institution_name,
                outstanding_amount: this.state.outstanding_amount,
                installment_amount: this.state.installment_amount,
                installment_term: this.state.installment_term,
                maturity_date: this.state.maturity_date,
                amount_requested: this.state.amount_requested,
                repayment_period: this.state.repayment_period,
                loan_purpose: this.state.loan_purpose,
                salary_advance: this.state.salary_advance === true && this.state.salary_advance !== undefined ? 1 : 0,
                personal_loan: this.state.personal_loan === true && this.state.personal_loan !== undefined ? 1 : 0,
                collateral_loan: this.state.collateral_loan === true && this.state.collateral_loan !== undefined ? 1 : 0,
                other_outstanding_debts: this.state.other_outstanding_debts === true && this.state.other_outstanding_debts !== undefined ? 1 : 0,
                target_achieve: this.state.target_achieve,
                performance: this.state.performance,
                comment: this.state.comment,
                term_and_condition: this.state.term_and_condition === true && this.state.term_and_condition !== undefined ? 1 : 0,
                createdBy: this.state.createdBy,
                updatedBy: this.state.updatedBy
            }
            let status = 0;
            let path = 'saveStaffLoan';

            if (!Array.isArray(this.state.loan_data)) {
                path = `editStaffLoan/${this.state.loan_data.staff_loan_id}`;
            }

            const formdata = new FormData();

            var obj = document.querySelector("#attach_file").files.length;
            for (var i = 0; i < obj; i++) {
                var imagedata = document.querySelector("#attach_file").files[i];
                formdata.append('uploadfile', imagedata);
            }

            formdata.append('staff_loan', JSON.stringify(data))
            formdata.append('oldDoc', JSON.stringify(this.state.doc))

            fetch(`${main_url}staff_loan/${path}`, {
                method: "POST",
                body: formdata
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
                     window.location.replace("/staff_loan");

                })
        } else {
            startSaving();
            form_validate = false;
        }
    }

    render() {

        var { one_info } = this.state;
        let { guarantor_list, selected_guarantor, selected_relative, recommended_user_list, selected_recommended, relative_list } = this.state;
        return (
            <div>
                <div className="wrapper wrapper-content">
                    <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                    {/* <h2>Staff Loan Apply Form</h2> */}
                    <div className="content">
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
                                                        value={one_info.name}
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
                                                        value={one_info.date_of_birth}
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
                                                        value={one_info.joining_date}
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
                                                        value='-'
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
                                                        value='-'
                                                        disabled
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Staff Guarantor Name</label>
                                                <div className="col-sm-12">
                                                    <Select
                                                        options={guarantor_list}
                                                        value={selected_guarantor}
                                                        onChange={this.handleSelectedGuarantor.bind(this)}
                                                        className='react-select-container checkValidate'
                                                        classNamePrefix="react-select"
                                                    />
                                                </div>
                                            </div>

                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Guarantor NRC</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md" type="text"
                                                        value={!Array.isArray(selected_guarantor) ? selected_guarantor.nrc : ""}
                                                        disabled>
                                                    </input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Guarantor ID</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md"
                                                        type="text"
                                                        value={!Array.isArray(selected_guarantor) ? selected_guarantor.employment_id : ""}
                                                        disabled>
                                                    </input>

                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Family Member Guarantor</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md checkValidate" type="text"
                                                        value={this.state.family_member_name}
                                                        onChange={(e) => this.setState({ family_member_name: e.target.value })}>
                                                    </input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <div className="pretty p-default ">
                                                    <input type="radio" value={1} name="salary_advance"
                                                        //  value={this.state.getAutoTick}
                                                        checked={this.state.salary_advance === 1 || this.state.salary_advance === true ? "checked" : ""}
                                                        onChange={(e) => this.setState({ salary_advance: e.target.checked })}
                                                    />
                                                    <div className="state p-primary">
                                                        <label>Salary Advance</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <div className="pretty p-default">
                                                    <input type="radio" value={2} name="personal_loan"
                                                        // value={this.state.personal_loan}
                                                        checked={this.state.personal_loan === 1 || this.state.personal_loan === true ? "checked" : ""}
                                                        onChange={(e) => this.setState({ personal_loan: e.target.checked })} />
                                                    <div className="state p-primary">
                                                        <label>Personal Loan</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <div className="pretty p-default">
                                                    <input type="checkbox" name="collateral_loan"
                                                        // value={this.state.collateral_loan}
                                                        checked={this.state.collateral_loan === 1 || this.state.collateral === true ? "checked" : ""}
                                                        onChange={(e) => this.setState({ collateral: e.target.checked })} />
                                                    <div className="state p-primary">
                                                        <label>Collateral Loan</label>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <div className="pretty p-default">
                                                    <input type="checkbox" name="other_outstanding_debts"
                                                        // value={this.state.other_outstanding_debts}
                                                        checked={this.state.other_outstanding_debts === 1 || this.state.other_outstanding_debts === true ? "checked" : ""}
                                                        onChange={(e) => this.setState({ other_outstanding_debts: e.target.checked })} />
                                                    <div className="state p-primary">
                                                        <label>Other outstanding debts</label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Family Member Guarantor NRC</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md checkValidate" type="text"
                                                        value={this.state.family_member_nrc}
                                                        onChange={(e) => this.setState({ family_member_nrc: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm--6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Family Member Guarantor Relatives</label>
                                                <div className="col-sm-12">
                                                    <Select
                                                        options={relative_list}
                                                        value={selected_relative}
                                                        onChange={this.handleSelectedRelative.bind(this)}
                                                        className='react-select-container checkValidate'
                                                        classNamePrefix="react-select"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Name of Institution</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md" type="text"
                                                        value={this.state.institution_name}
                                                        onChange={(e) => this.setState({ institution_name: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Outstanding Amount</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md"
                                                        type="number" min="0" step="0.01"
                                                        value={this.state.outstanding_amount}
                                                        onChange={(e) => this.setState({ outstanding_amount: e.target.value })}></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Installment Term</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md"
                                                        type="number" min="0" step="0.01"
                                                        value={this.state.installment_term}
                                                        onChange={(e) => this.setState({ installment_term: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Installment Amount</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md"
                                                        type="number" min="0" step="0.01"
                                                        value={this.state.installment_amount}
                                                        onChange={(e) => this.setState({ installment_amount: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Maturity Date</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md checkValidate" type="date"
                                                        value={this.state.maturity_date}
                                                        onChange={(e) => this.setState({ maturity_date: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Amount Requested</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md checkValidate"
                                                        type="number" min="0" step="0.01"
                                                        value={this.state.amount_requested}
                                                        onChange={(e) => this.setState({ amount_requested: e.target.value })}></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Proposed Repayment Period</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md checkValidate" type="number" min="0" step="0.01"
                                                        value={this.state.repayment_period}
                                                        onChange={(e) => this.setState({ repayment_period: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Loan Purpose</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md checkValidate" type="text"
                                                        value={this.state.loan_purpose}
                                                        onChange={(e) => this.setState({ loan_purpose: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Target Achievement</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md" type="text"
                                                        value={this.state.target_achieve}
                                                        onChange={(e) => this.setState({ target_achieve: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Performance Recommendation</label>
                                                <div className="col-sm-12">
                                                    <input className="form-control input-md" type="text"
                                                        value={this.state.performance}
                                                        onChange={(e) => this.setState({ performance: e.target.value })}></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Recommend By</label>
                                                <div className="col-sm-12">
                                                    <Select
                                                        options={recommended_user_list}
                                                        value={selected_recommended}
                                                        onChange={this.handleSelectedRecommendedBy.bind(this)}
                                                    />
                                                </div>
                                            </div>
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

                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Comment</label>
                                                <div className="col-sm-12">
                                                    <textarea className="form-control input-md"
                                                        cols="10"
                                                        rows="5"
                                                        value={this.state.comment}
                                                        onChange={(e) => this.setState({ comment: e.target.value })} />
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-3 col-xl-3">
                                                <label className="col-sm-12">Attachment</label>
                                                <div className="col-sm-12">
                                                    <input className="full_width dropZone" type="file" id="attach_file" multiple
                                                        onChange={
                                                            !Array.isArray(this.state.loan_data) && this.state.loan_data !== null ?
                                                                this.handlefileChanged.bind(this) :
                                                                this.checkFiles.bind(this)
                                                        } />
                                                </div>
                                            </div>


                                        </div>
                                        {
                                            !Array.isArray(this.state.loan_data) && this.state.loan_data !== null ?

                                                <div className="row margin-top-20">

                                                    <div className="col-md-12">
                                                        <div className="ibox float-e-margins">
                                                            <div className="ibox-content p-md col-md-12" style={{ float: 'left', }}>

                                                                {this.state.doc.map((data, index) =>
                                                                    <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">
                                                                        <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                                            <div className="columns">
                                                                                <div className="column-title">
                                                                                    <a href={`${main_url}staff_loan/getCRDocumentData/${data.name}`}
                                                                                        download target='_blank'
                                                                                        className="btn btn-primary document-body-bt document-width">
                                                                                        {data.name.split("&@")[1]}
                                                                                    </a>
                                                                                </div>
                                                                                <div className="column-actions">
                                                                                    <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeOldDocument(index, event)}> <i></i></a>
                                                                                </div>
                                                                            </div></li></ul>

                                                                    </div>

                                                                    // <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">
                                                                    //     <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                                    //         <div className="columns"><div className="column-thumbnail">
                                                                    //             <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                                                    //                 <div className="fileuploader-item-icon" style={{ backgroundColor: '#3f4fd3' }}><i>{data.name.split(".")[1]}</i>
                                                                    //                 </div></div><span className="fileuploader-action-popup"></span></div>
                                                                    //             <div className="column-title">
                                                                    //                 <span className="own-text">
                                                                    //                     {data.name.split("&@")[1]}</span></div>
                                                                    //             <div className="column-actions">
                                                                    //                 <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeOldDocument(index, event)}> <i></i></a>
                                                                    //             </div></div></li></ul>

                                                                    // </div>
                                                                )
                                                                }
                                                                {this.state.newDoc.map((data, index) =>
                                                                    <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">

                                                                        <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                                            <div className="columns">
                                                                                <div className="column-title">
                                                                                    <a href='#'
                                                                                        className="btn btn-primary document-body-bt document-width">
                                                                                        {data.name}
                                                                                    </a>
                                                                                </div>
                                                                                <div className="column-actions">
                                                                                    <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeNewDocument(index, event)}> <i></i></a>
                                                                                </div>
                                                                            </div></li></ul>
                                                                    </div>

                                                                    // <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">

                                                                    //     <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                                    //         <div className="columns"><div className="column-thumbnail">
                                                                    //             <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                                                    //                 <div className="fileuploader-item-icon" style={{ backgroundColor: '#3f4fd3' }}><i>{data.name.split(".")[1]}</i>
                                                                    //                 </div></div><span className="fileuploader-action-popup"></span></div>
                                                                    //             <div className="column-title">
                                                                    //                 <span className="own-text">
                                                                    //                     {data.name}</span></div>
                                                                    //             <div className="column-actions">
                                                                    //                 <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeNewDocument(index, event)}> <i></i></a>
                                                                    //             </div></div></li></ul>
                                                                    // </div>
                                                                )
                                                                }
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                : ""
                                        }

                                        <div className="row m-20 f-right">
                                            {/* <a href="/staff_loan"><button className="btn btn-success m-r-10">Cancel</button></a> */}
                                            <button className="btn btn-primary" id="saving_button" onClick={this.save.bind(this)}>Save</button>
                                        </div>
                                    </div >
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}