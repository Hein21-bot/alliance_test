import React, { Component } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datetime';
import moment from 'moment';
import '../../Benefits/Benefits.css';
import { ToastContainer, toast } from 'react-toastify';
import { main_url, getUserId, validate, stopSaving, startSaving } from "../../../utils/CommonFunction";

let form_validate = true;
class BirthdayFundAddNew extends Component {
    constructor(props) {
        super(props);
        var created_user = getUserId("user_info")
        this.state = {
            one_benefit: this.props.data,
            user_id: 0,
            branch_id: '',
            branchlist: [],
            selected_branch: [],
            month: moment(),
            request_amount: 0,
            status: 0,
            createdBy: created_user,
            updatedBy: created_user,
            description: '',
            birthdayList: []
        }
    }

    componentDidMount() {
        this.setOneBenefit(this.state.one_benefit);

        fetch(`${main_url}benefit/getBranchList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    branchlist: list.map(v => ({ ...v, label: v.branch_name, value: v.branch_id }))
                })
            })
    }

    componentDidUpdate() {
        if (!form_validate) validate("check_form");
    }

    setOneBenefit(data) {
        if (!Array.isArray(data) && data !== null) {
            this.setState({
                branch_id: { value: data.branch_id, label: data.branch_name },
                month: data.month,
                description: data.description,
                request_amount: data.request_amount,
                createdBy: data.createdBy,
                updatedBy: this.state.created_user,
                status: data.status
            })
        }
    }

    getBirthdayFunList(branch_id, date) {

        fetch(`${main_url}birthday_benefit/getBirthdayList/${this.state.month.format('M')}/${this.state.branch_id.value}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    birthdayList: list
                })
            })
    }

    handleRequestByBranch = (event) => {
        this.setState({
            branch_id: event
        }, () => this.getBirthdayFunList());
    };

    handleMonth = (event) => {
        this.setState({
            month: event
        }, () => this.getBirthdayFunList());
    };

    handleDescription = (event) => {
        this.setState({
            description: event.target.value
        });
    };

    handlerequest_amount = (event) => {
        this.setState({
            request_amount: event.target.value
        });
    };

    save() {
        stopSaving();
        if (validate('check_form')) {
            var data = {
                attribute: this.state.branch_id.value,
                month: this.state.month,
                description: this.state.description,
                request_amount: this.state.request_amount,
                status: this.state.status,
                createdBy: this.state.createdBy,
                updatedBy: this.state.updatedBy
            }
            let path = 'saveBirthdayBenefit';
            if (!Array.isArray(this.state.one_benefit) && this.state.one_benefit !== null) {
                path = `editBirthdayBenefit/${this.state.one_benefit.birthday_benefit_id}`;
            }
            let status = 0;
            fetch(`${main_url}birthday_benefit/${path}`, {
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
                    this.props.showToast(status, text);
                })
        } else {
            startSaving();
            form_validate = false;
        }
    }


    render() {
        return (
            <div className="benefits benefits-birthday-fund">
                <ToastContainer />
                <div className='row'>
                    <form className="form-group" id="check_form">
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="training-type" className="col-sm-12">Request By Branch/HO </label></div>
                                <div className="col-sm-10">
                                    <Select
                                        options={this.state.branchlist}
                                        placeholder="Please Choose The BM"
                                        onChange={this.handleRequestByBranch}
                                        value={this.state.branch_id}
                                        className='react-select-container  checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div><label htmlFor="month" className="col-sm-12">Please Enter The Month </label></div>
                                <div className="col-sm-10">
                                    {/* <input type="date"
                                        className="form-control checkValidate"
                                        placeholder="Enter The Month"
                                        onChange={this.handleMonth}
                                        value={this.state.month}
                                    /> */}
                                    <DatePicker
                                        dateFormat="YYYY-MM"
                                        value={this.state.month}
                                        onChange={this.handleMonth}
                                        timeFormat={false}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">

                            <div className="col-md-6">
                                <div><label htmlFor="request_amount" className="col-sm-12">Please Enter The request_amount</label></div>
                                <div className="col-sm-10">
                                    <input type="number"
                                        className="form-control checkValidate"
                                        placeholder="Enter The request_amount"
                                        onChange={this.handlerequest_amount}
                                        value={this.state.request_amount}
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div><label htmlFor="description" className="col-sm-12">Please Enter The Description</label></div>
                                <div className="col-sm-10">
                                    <textarea
                                        name="description"
                                        id="description"
                                        cols="30"
                                        rows="10"
                                        placeholder="Please Give The Description"
                                        className="form-control"
                                        onChange={this.handleDescription}
                                    >
                                    </textarea>
                                </div>
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
                    </form>
                    {/* <div className="funeral-detail col-md-11">
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
                            </div> */}
                </div>
                <div className="row save-btn">
                    <div className="float-right">
                        <div>
                            <button className="btn btn-primary" id="saving_button" type="button" onClick={this.save.bind(this)}>Save</button>
                        </div>

                    </div>
                </div>

            </div>
        )
    }
}

export default BirthdayFundAddNew;