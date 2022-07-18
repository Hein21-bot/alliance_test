import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import ApprovalForm from '../../Common/ApprovalForm';
import moment from 'moment';
import {
    main_url, getUserId, getActionStatus,alertText, validate, havePermission, getWorkFlowStatus, stopSaving,
    startSaving, isRequestedUser
} from "../../../utils/CommonFunction";
import 'react-toastify/dist/ReactToastify.min.css'
const $ = require('jquery');
let form_validate = true;
export default class BirthdayFundEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            branchlist: [],
            data: this.props.data,
            status: this.props.data.status,
            updatedBy: getUserId("user_info"),
            status_title: '',
            is_main_role: false,
            work_flow_status: {},
            comment: '',
            description: '',
            birthdayList: [],
        }
    }

    async componentDidMount() {
        this.getBranchList();
        this.getBirthdayFunList();
        var work_flow = await getWorkFlowStatus(this.state.data.createdBy, this.state.updatedBy, 'Birthday Benefit', 'Benefit');
        this.setState({
            work_flow_status: work_flow,
            is_main_role: havePermission(work_flow)
        })
        // var that = this;
        // $('#check_form').on('change', '#amount', function () {
        //     var index = $(this).next().text();
        //     var value = $(this).val();
        //     that.handlerequest_amount(index, value);
        // })

    }
    getBirthdayFunList() {

        fetch(`${main_url}birthday_benefit/getBirthdayList/${moment(this.state.data.month).format('M')}/${this.state.data.branch_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    birthdayList: list
                })
            })
    }

    handleDescription = (event) => {
        let data = this.state.data;
        data.description = event.target.value;
        this.setState({
            data: data,
        });
    };
    //@kpk
    getBranchList() {
        fetch(`${main_url}benefit/getBranchList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    branchlist: list.map(v => ({ ...v, label: v.branch_name, value: v.branch_id }))
                })
            })
    }

    approvalStatus = (text, comment) => {
        this.setState({ status_title: text, comment: comment }, () => this.edit())
    }

    edit() {
        stopSaving();
        if (validate('check_form')) {
            var { status_title, is_main_role } = this.state;
            var data = {
                attribute: this.state.data.branch_id,
                month: this.state.data.month,
                description: this.state.data.description,
                request_amount: this.state.data.request_amount,
                status: this.state.data.status == 5 ? 0 : this.state.data.status,
                updatedBy: this.state.updatedBy
            }
            let status = 0;
            if (status_title !== '' && is_main_role) {
                var action = getActionStatus(status_title, this.state.data, this.state.updatedBy, this.state.comment);
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

            fetch(main_url + 'birthday_benefit/editBirthdayBenefit/' + this.state.data.birthday_benefit_id, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `birthday_benefit=${JSON.stringify(data)}`

            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    // if (status !== 200) {
                    //     this.setState({
                    //         data: {
                    //             status: this.state.status
                    //         }
                    //     })
                    // }
                    this.props.showToast(status, text);
                })
        } else {
            startSaving();
            
            form_validate = false;
            toast.error(alertText, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
    }

    getBranchName(id) {
        let branch = this.state.branchlist;
        let result = [];
        for (let i = 0; i < branch.length; i++) {

            if (id == branch[i].value) {
                result = branch[i];
                break;
            }
        }
        return result;
    }

    handleRequestByBranch = (event) => {
        let data = this.state.data;
        data.branch_id = event.value
        this.setState({
            data: data
        });
    };

    handleMonth = (event) => {
        let data = this.state.data;
        data.month = event.target.value
        this.setState({
            data: data
        });
    };

    handlerequest_amount = (event) => {
        let data = this.state.data;
        data.request_amount = event.target.value

        this.setState({
            data: data
        });
    };
    render() {
        let { is_main_role } = this.state;
        return (
            <div className="benefits benefits-birthday-fund">
                <div className='row'>
                    <form className="form-group" id="check_form" style={{ marginBottom: 0 }}>
                        <div className="col-md-6">
                            <div><label htmlFor="training-type" className="col-sm-12">Request By Branch/HO </label></div>
                            <div className="col-sm-10">
                                {
                                    is_main_role ?
                                        <input type="text"
                                            className="form-control"
                                            value={this.getBranchName(this.state.data.branch_id).label}
                                            disabled
                                        />
                                        :
                                        <Select
                                            options={this.state.branchlist}
                                            placeholder="Please Choose The BM"
                                            onChange={this.handleRequestByBranch}
                                            value={this.getBranchName(this.state.data.branch_id)}
                                            className='react-select-container  checkValidate'
                                            classNamePrefix="react-select"
                                        />
                                }
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div><label htmlFor="month" className="col-sm-12">Please Enter The Month </label></div>
                            <div className="col-sm-10">
                                <input type="date"
                                    className="form-control checkValidate"
                                    placeholder="Enter The Month"
                                    onChange={this.handleMonth}
                                    value={this.state.data.month}
                                    disabled={is_main_role ? true : false}
                                />
                            </div>
                        </div>
                    </form>
                </div>

                <div className="row">

                    <div className="col-md-6">
                        <div><label htmlFor="request_amount" className="col-sm-12">Please Enter The request_amount</label></div>
                        <div className="col-sm-10">
                            <input type="number"
                                // id="amount"
                                className="form-control checkValidatel"
                                placeholder="Enter The request_amount"
                                onChange={this.handlerequest_amount}
                                value={this.state.data.request_amount}
                                disabled={isRequestedUser(this.state.updatedBy, this.state.data.createdBy) ? true : false}
                            />
                        </div>
                    </div>

                </div>
                <div className="row">
                    <div className="col-md-6">
                        <form
                            className="form-group"
                            id="check_form"
                            style={{ marginBottom: 0 }}
                        >
                            <div>

                                <label htmlFor="description" className="col-sm-12">
                                    Please Enter The Description
                                </label>
                            </div>
                            <div className="col-sm-10">
                                <textarea
                                    name="description"
                                    id="description"
                                    cols="30"
                                    rows="6"
                                    value={this.state.data.description}
                                    className="form-control"
                                    onChange={this.handleDescription}
                                    disabled={is_main_role ? true : false}
                                ></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="funeral-detail col-md-6">
                        <table className="table table-bordered table-responsive">
                            <thead>
                                <tr>
                                    <th>Birthday List</th>
                                </tr>
                            </thead>

                            <tbody>

                                {
                                    this.state.birthdayList <= 0 ?
                                        <tr>
                                            <td colSpan="7" className="text-center">No Data To Show</td>
                                        </tr> :

                                        this.state.birthdayList.map((data, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>{data.fullname}</td>
                                                </tr>
                                            );
                                        })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="row save-btn">
                    {
                        this.state.status == undefined || this.state.status == 5 && this.state.updatedBy == this.state.data.createdBy ?
                            <div>
                                <button onClick={this.edit.bind(this)} className="btn btn-primary" id="saving_button" type="button">Save</button>
                            </div>
                            :
                            havePermission(this.state.work_flow_status) ?
                                <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.data.status} work_flow={this.state.work_flow_status} total_amount={this.state.data.request_amount} /> : ''
                        // havePermission(this.state.work_flow_status) ?
                        //     <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.data.status} work_flow={this.state.work_flow_status} total_amount={this.state.data.request_amount} />
                        //     :
                        //     <div className="float-right">
                        //         <div>
                        //             {this.state.status == undefined || this.state.status == 5 ?
                        //                 <div>
                        //                     <button onClick={this.edit.bind(this)} className="btn btn-primary" id="saving_button" type="button">Save</button>
                        //                 </div>
                        //                 :
                        //                 ''
                        //             }
                        //         </div>

                        //     </div>
                    }
                </div>

            </div>



        )
    }
}