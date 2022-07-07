import React, { Component } from 'react';
import Select from 'react-select';
import '../../Benefits/Benefits.css';
import { ToastContainer, toast } from 'react-toastify';
import ApprovalForm from '../../Common/ApprovalForm';
import ApprovalFormForLimitAmount from '../../Common/ApprovalFormForLimitAmount';
import {
    main_url, getCookieData, validate, getActionStatus, havePermissionForAmount,
    getWorkFlowStatus, stopSaving, startSaving, checkApprovalStatus
} from "../../../utils/CommonFunction";
const $ = require('jquery');
var limit_amount = 17500;
var form_validate = true;

class TeamBuildingAddNew extends Component {
    constructor(props) {
        super(props);
        var user_info = getCookieData("user_info");
        this.state = {
            one_benefit: this.props.data,
            quater_list: [],
            status: 0,
            createdBy: 0,
            updatedBy: 0,
            user_id: user_info.user_id,
            selected_quater: [],
            selected_location: [],
            employee_list: [],
            branchlist: [],
            is_main_role: false,
            status_title: '',
            work_flow_status: {},
            comment: '',
            year_list: [],
            year: '',
        }
    }

    getBranchList() {
        fetch(`${main_url}benefit/getBranchList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    branchlist: list.map(v => ({ ...v, label: v.branch_name, value: v.branch_id }))
                })
            })
    }

    getQuaterList() {
        fetch(`${main_url}team_building/getQuater`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    quater_list: list
                })
            })
    }

    getTeamBuildingDetail(id) {
        fetch(`${main_url}team_building/getTeamBuildingDetail/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    employee_list: list
                })
            })
    }

    async setOneBenefit(data) {
        if (!Array.isArray(data) && data !== null) {
            this.getTeamBuildingDetail(data.benefit_id);
            var work_flow = await getWorkFlowStatus(data.createdBy, this.state.user_id, 'Team Building', 'Benefit');
            this.setState({
                selected_quater: { value: data.quater_id, label: data.quarter_name },
                selected_location: { value: data.branch_id, label: data.branch_name },
                status: data.status,
                year: {value: data.year,label:data.year},
                work_flow_status: work_flow,
                is_main_role: havePermissionForAmount(work_flow, data.createdBy)
            })
        }
    }

    componentDidMount() {
        this.getBranchList();
        this.getQuaterList();
        this.setOneBenefit(this.state.one_benefit);
        this.getYearList()
    }

    getEmployeeListByBranch(id) {
        fetch(`${main_url}main/getEmployeeListByBranch/${id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    employee_list: list
                })
            })
    }

    handleSelectedLocation = (event) => {
        if (event !== null) this.getEmployeeListByBranch(event.value);
        this.setState({
            selected_location: event
        })
    };

    handleSelectedQuater = (event) => {
        this.setState({
            selected_quater: event
        })
    };


    approvalStatus = (text, comment) => {
        this.setState({ status_title: text, comment: comment }, () => this.save())
    }

    handleAmount = (index, e) => {
        if (e.target.value > limit_amount) {
            toast.error('Your amount is too much.Please check the amount!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } else {
            var data = this.state.employee_list;
            data[index].amount = e.target.value;
            this.setState({
                employee_list: data
            })
        }

    }

    handleAllAmount = (e) => {
        this.setState({
            all_amount: e.target.value
        })
    }

    handleYear = (event) => {
        this.setState({
            year: event
        });
    };

    getYearList() {
        var d = new Date();
        var lastYear = d.getFullYear();
        var previousYear = (d.getFullYear() - 1);
        const options = [
            { value: lastYear, label: lastYear },
            { value: previousYear, label: previousYear }

        ]
        this.setState({
            year_list: options
            //list.map(v => ({ ...v, label: v.branch_name, value: v.branch_id }))
        })
    }

    addAmount = () => {
        if (this.state.all_amount > limit_amount) {
            toast.error('Your amount is too much.Please check the amount!', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        } else {
            var data = this.state.employee_list;
            var amount = this.state.all_amount;
            for (let i = 0; i < data.length; i++) {
                data[i].amount = amount;
            }
            this.setState({
                employee_list: data
            })
        }
    }
    save() {
        stopSaving();
        let one_benefit = this.state.one_benefit;
        let total_amount = $('#total_amount').val();
        if (validate('check_form')) {
            let { status_title, is_main_role } = this.state;
            var data = {
                location_id: this.state.selected_location.value,
                quater: this.state.selected_quater.value,
                year: this.state.year.value,
                // designation: this.state.designation,
                total_amount: total_amount,
                detail: this.state.employee_list,
                status: this.state.one_benefit.status == 5 ? 0 : this.state.one_benefit.status,
            }
            let status = 0;

            if (status_title !== '' && is_main_role) {
                var action = getActionStatus(status_title, one_benefit, this.state.user_id, this.state.comment);
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

            fetch(`${main_url}team_building/editTeamBuilding/${one_benefit.benefit_id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: `benefit=${JSON.stringify(data)}`
            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    this.props.showToast(status, text);
                })
        } else {
            startSaving();
            form_validate = false;
        }
    }

    render() {
        this.total_amount = 0;
        var { is_main_role } = this.state;
        return (
            <div className="container">
                <div className='row'>
                    <div id="check_form">
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Select Location</label></div>
                                <div className="col-sm-10">
                                    {
                                        is_main_role ?
                                            <input type="text" className="form-control input-md"
                                                value={this.state.selected_location.label} disabled />
                                            :
                                            <Select
                                                options={this.state.branchlist}
                                                placeholder="Please Choose Branch"
                                                onChange={this.handleSelectedLocation.bind(this)}
                                                value={this.state.selected_location}
                                                className='react-select-container  checkValidate'
                                                classNamePrefix="react-select"
                                            />
                                    }

                                </div>
                            </div>
                            <div className="form-group col-md-6">
                                <div className="form-group col-md-6">
                                    <div><label htmlFor="designation" className="col-sm-12">Select Quater</label></div>
                                    <div className="col-sm-10">
                                        {
                                            is_main_role ?
                                                <input type="text" className="form-control input-md"
                                                    value={this.state.selected_quater.label} disabled />
                                                :
                                                <Select
                                                    options={this.state.quater_list}
                                                    placeholder="Please Choose Quater"
                                                    onChange={this.handleSelectedQuater.bind(this)}
                                                    value={this.state.selected_quater}
                                                    className='react-select-container  checkValidate'
                                                    classNamePrefix="react-select"
                                                />
                                        }

                                        {/* <input
                                        type="text"
                                        // placeholder="Please Provide The Designation"
                                        className="form-control"
                                        value={this.state.user_info.designations}
                                        disabled
                                    /> */}
                                    </div>
                                </div>
                                <div className="form-group col-md-6">
                                    <div><label htmlFor="employee-Name" className="col-sm-12">Select Year</label></div>
                                    <div className="col-sm-10">
                                        <Select
                                            placeholder="Select Year"
                                            options={this.state.year_list}
                                            value={this.state.year}
                                            onChange={this.handleYear}
                                            className='react-select-container checkValidate'
                                            classNamePrefix="react-select"
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Amount</label></div>
                                <div className="col-sm-10">

                                    <input type="number" min="0" max="17500" className="form-control input-md" value={this.state.all_amount} onChange={this.handleAllAmount.bind(this)} />

                                </div>
                            </div>
                            <div className="col-md4"></div>
                            <div className="col-md-2">
                                <div className="form-group float-right">

                                    <div className="col-sm-10" style={{ marginTop: 20 }}>

                                        <button className="btn btn-primary" onClick={() => this.addAmount()}><span>Add</span> </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="row">
                            <div className="form-group col-md-6">
                                <div><label htmlFor="employee-name" className="col-sm-12">Total Amount</label></div>
                                <div className="col-sm-10">

                                    <input type="number" className="form-control input-md" value={this.state.total_amount} disabled />

                                </div>
                            </div>
                        </div> */}
                        <div className="row">
                            <div className="funeral-detail col-md-11">
                                <table className="table table-bordered table-responsive">
                                    <thead>
                                        <tr>
                                            <th>Employee Name</th>
                                            <th>Amount</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                            this.state.employee_list.length <= 0 ?
                                                <tr>
                                                    <td colSpan="7" className="text-center">No Data To Show</td>
                                                </tr> :

                                                this.state.employee_list.map((data, index) => {
                                                    this.total_amount += Number(data.amount)
                                                    return (
                                                        <tr key={index}>
                                                            <td>{data.fullname}</td>
                                                            <td>
                                                                <input type="number"
                                                                    className="form-control"
                                                                    onChange={this.handleAmount.bind(this, index)}
                                                                    value={data.amount}
                                                                />
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                        }
                                        <tr>
                                            <td>Total Amount</td>
                                            <td>
                                                {this.total_amount}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <input type="number" className="hidden" id="total_amount" value={this.total_amount} />
                    </div>
                </div>

                {/* <div className="row save-btn">
                    <div className="float-right">
                        <div>
                            <button className="btn btn-primary" type="button" onClick={this.save.bind(this, this.total_amount)}>Save</button>
                        </div>

                    </div>
                </div> */}

                <div className="row save-btn">
                    {
                        is_main_role ?
                            <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.one_benefit.status} work_flow={this.state.work_flow_status} total_amount={this.state.one_benefit.total_amount} />
                            :

                            <div className="col-md-12 btn-rightend">
                                {this.state.one_benefit.status == undefined || this.state.one_benefit.status == 5 ?
                                    <div>
                                        <button onClick={this.save.bind(this)} className="btn btn-primary" id="saving_button" type="button">Save</button>
                                    </div>
                                    :
                                    ''
                                }
                                {/* <button onClick={this.save.bind(this)} id="saving_button" className="btn btn-primary"><span>Save</span> </button> */}
                            </div>
                    }
                </div>
            </div>
        )
    }
}

export default TeamBuildingAddNew;