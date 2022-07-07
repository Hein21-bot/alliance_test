import React, { Component } from 'react';
import Select from 'react-select';
import moment from 'moment';
import ApprovalForm from '../../Common/ApprovalForm';
import { main_url, getBranch, getUserId, validate, getActionStatus, havePermission, getWorkFlowStatus, stopSaving, startSaving } from '../../../utils/CommonFunction';
import DatePicker from 'react-datetime';
var form_validate = true;

class PhoneBillRequest extends Component {

    constructor(props) {
        super(props);
        var user_id = getUserId("user_info");
        this.state = {
            user_id: user_id,
            one_request: this.props.data,
            status: this.props.data.status,
            employee_list: [],
            branch: [],
            status_title: '',
            selectedUser: [],
            selectedBranch: [],

            phonebilldata: {
                designations: '',
                user_id: '',
                branch_name: '',
                branch_id: 0,
                user_name: '',
                contact_number: '',
                ooredoo_package: '',
                ooredoo_extra: '',
                other_phone: '',
                amount: '',
                remark: ''

            },
            dataSource: [],
            is_main_role: false,
            PhoneBillRequestData: {
                form_no: '',
                status: 0,
                branch_id: 0,
                selected_date: moment().format('MM/DD/YYYY'),
                createdBy: user_id,
                updatedBy: user_id
            },
            work_flow_status: {}
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    approvalStatus = (text) => {
        this.setState({ status_title: text }, () => this.savePhoneBill())
    }

    async componentDidMount() {
        var branch = await getBranch();
        var data = this.state.one_request;
        var work_flow = {}
        if (data !== null && data !== undefined && !Array.isArray(data)) {
            work_flow = await getWorkFlowStatus(data.createdBy, this.state.user_id, 'Phone Bill', 'Allowance');
            this.setBranch(data);
            this.setOneRequest(data);
        }
        // console.log(branch);
        this.setState({
            branch: branch,
            work_flow_status: work_flow,
            is_main_role: havePermission(work_flow)
        })
    }

    setBranch(data) {
        let branch = {
            value: data.branch_id,
            label: data.branch_name
        };
        this.handleChangeBranch(branch);
    }

    setOneRequest(data) {

        fetch(`${main_url}allowance/getPhoneBillRequestView/${data.phone_bill_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                console.log(list);
                this.setState({
                    dataSource: list,
                    PhoneBillRequestData: {
                        form_no: data.form_no,
                        status: data.status == 5 ? 0 : data.status,
                        selected_date: moment(data.selected_date).format('MM/DD/YYYY'),
                        createBy: data.createBy,
                        updatedBy: this.state.user_id
                    }
                })
            })
    }

    getEmployeeWithDesignation(branch_id) {
        fetch(`${main_url}main/getEmployeeWithDesignation/${branch_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    employee_list: data
                })
            })
    }

    handleChangename = (e) => {
        let data = this.state.phonebilldata;
        data.user_id = e.value;
        data.user_name = e.label;
        data.designations = e.designations;
        data.employment_id = e.employment_id;
        data.branch_id = this.state.selectedBranch.value;
        data.branch_name = this.state.selectedBranch.label;
        this.setState({
            phonebilldata: data,
            selectedUser: e
        })
    }

    handleChangeBranch = (e) => {
        let data = this.state.phonebilldata;
        let main = this.state.PhoneBillRequestData;
        data.branch_id = e.value;
        data.branch_name = e.label;
        main.branch_id = e.value;
        this.setState({
            phonebilldata: data,
            PhoneBillRequestData: main,
            selectedBranch: e
        }, () => {
            this.getPreviousPhoneBillInfo(e.value);
            this.getEmployeeWithDesignation(e.value)
        })
    }

    getPreviousPhoneBillInfo(id) {
        let date = this.state.PhoneBillRequestData;
        let year = moment(date).format('YYYY');
        let month = moment(date).format('MM');
        fetch(`${main_url}allowance/getPreviousPhoneBillInfo/${id}/${year}/${month}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    dataSource: data
                })
            })
    }

    setSelectedDate(e) {
        let data = this.state.PhoneBillRequestData;
        data.selected_date = e;
        this.setState({
            PhoneBillRequestData: data
        })
    }

    setContactNumber = (e) => {
        let data = this.state.phonebilldata;
        data.contact_number = e.target.value;
        this.setState({
            phonebilldata: data
        })
    }

    setOoredooPackage = (e) => {
        let data = this.state.phonebilldata;
        data.ooredoo_package = e.target.value;
        this.setState({
            phonebilldata: data
        })
    }

    setOoredooExtra = (e) => {
        let data = this.state.phonebilldata;
        data.ooredoo_extra = e.target.value;
        this.setState({
            phonebilldata: data
        })
    }

    setOtherPhone = (e) => {
        let data = this.state.phonebilldata;
        data.other_phone = e.target.value;
        this.setState({
            phonebilldata: data
        })
    }

    setAmount = (e) => {
        let data = this.state.phonebilldata;
        data.amount = e.target.value;
        this.setState({
            phonebilldata: data
        })

    }

    setRemark = (e) => {
        let data = this.state.phonebilldata;
        data.remark = e.target.value;
        this.setState({
            phonebilldata: data
        })
    }

    handlePhoneBillRequestRemove(e) {
        let newData = this.state.dataSource;
        newData.splice(e, 1);
        this.setState({
            dataSource: newData
        })
    }

    addData = (e) => {
        if (validate('check_form')) {
            var data = this.state.dataSource;
            data.push(this.state.phonebilldata);
            this.setState({
                dataSource: data
            })
            form_validate = true
            this.setState({
                selectedUser: [],
                phonebilldata: {
                    user_id: '',
                    branch_id: '',
                    branch_name: '',
                    designations: '',
                    user_name: '',
                    contact_number: '',
                    ooredoo_package: '',
                    ooredoo_extra: '',
                    other_phone: '',
                    amount: '',
                    remark: ''
                }
            })
        }
        else {
            form_validate = false
        }
    }

    savePhoneBill() {
        stopSaving();
        let { one_request, status_title, is_main_role } = this.state;
        var info = this.state.PhoneBillRequestData;

        let path = 'addPhoneBillRequest';
        if (this.state.one_request !== null && !Array.isArray(this.state.one_request)) {
            if (status_title !== '' && is_main_role) {
                var action = getActionStatus(status_title, one_request, this.state.user_id);
                info.referback_by = action.referback_by;
                info.checked_by = action.checked_by;
                info.verified_by = action.verified_by;
                info.approved_by = action.approved_by;
                info.rejected_by = action.rejected_by;
                info.referback_date = action.referback_date;
                info.checked_date = action.checked_date;
                info.verified_date = action.verified_date;
                info.approved_date = action.approved_date;
                info.rejected_date = action.rejected_date;
                info.referback_comment = action.referback_comment;
                info.checked_comment = action.checked_comment;
                info.verified_comment = action.verified_comment;
                info.approved_comment = action.approved_comment;
                info.status = action.status;
            }

            path = `editPhoneBillRequest/${this.state.one_request.phone_bill_id}`;

        }

        var data = {
            main: info,
            detail: this.state.dataSource
        };
        // console.log(data);
        let status = 0;
        fetch(`${main_url}allowance/${path}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `info=${JSON.stringify(data)}`
        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                this.props.showToast(status, text);
            })
    }

    render() {
        let { selectedBranch, selectedUser, one_request } = this.state;
        //console.log(this.state.one_request);
        return (
            <div>
                <div className="wrapper wrapper-content animated fadeInRight">
                    <div className='row'>
                        <div className='form-horizontal' name='demo-form' id="check_form">
                            <div className='ibox-content float-e-margin col-md-12 col-sm-12'>
                                <div className='ibox-content p-md col-md-12 col-sm-12'>
                                    <div className='row'>
                                        <div className='col-md-4 col-lg-4'>

                                            <div>
                                                <label className='col-sm-12'>Select Date</label>
                                            </div>
                                            <div className='col-sm-10'>

                                                <DatePicker
                                                    dateFormat='DD-MM-YYYY'
                                                    value={this.state.PhoneBillRequestData.selected_date}
                                                    timeFormat={false}
                                                    onChange={this.setSelectedDate.bind(this)}
                                                />
                                            </div>

                                        </div>
                                        <div className="col-md-4 col-lg-4">

                                            <div><label className="col-sm-12" >Branch<span className="text-danger">*</span></label></div>
                                            <div className="col-sm-10">

                                                <Select
                                                    placeholder="Please Choose Type"
                                                    onChange={this.handleChangeBranch.bind(this)}
                                                    options={this.state.branch}
                                                    value={selectedBranch}
                                                    className='react-select-container  checkValidate'
                                                    classNamePrefix="react-select"

                                                />

                                            </div>

                                        </div>
                                        <div className="col-lg-4 col-md-4">

                                            <div><label className="col-sm-12" >Name<span className="text-danger">*</span></label></div>
                                            <div className="col-sm-10">

                                                <Select
                                                    placeholder="Please Choose Type"
                                                    onChange={this.handleChangename}
                                                    options={this.state.employee_list}
                                                    value={selectedUser}
                                                    className='react-select-container  checkValidate'
                                                    classNamePrefix="react-select"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row margin-top-20'>
                                        <div className='col-md-4 col-lg-4'>

                                            <div>
                                                <label className='col-sm-12'>Employee Id</label>
                                            </div>
                                            <div className='col-sm-10'>
                                                <input type='text' disabled className="form-control input-md"
                                                    value={Array.isArray(selectedUser) ? "" : selectedUser.employment_id}></input>
                                            </div>

                                        </div>

                                        <div className="col-lg-4 col-md-4">

                                            <div><label className="col-sm-12" >Position</label></div>
                                            <div className="col-sm-10">

                                                <input type="text" disabled className="form-control input-md"
                                                    value={Array.isArray(selectedUser) ? "" : selectedUser.designations} />

                                            </div>

                                        </div>
                                        <div className='col-md-4 col-lg-4'>

                                            <div>
                                                <label className='col-sm-12'>Contact Number</label>
                                            </div>
                                            <div className='col-sm-10'>
                                                <input
                                                    type='text'
                                                    placeholder='Enter Phone Number'
                                                    value={this.state.phonebilldata.contact_number}
                                                    className="form-control input-md checkValidate"
                                                    onChange={this.setContactNumber}>

                                                </input>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row margin-top-20'>
                                        <div className='col-md-4 col-lg-4'>

                                            <div>
                                                <label className='col-sm-12'>Ooredoo Package</label>
                                            </div>
                                            <div className='col-sm-10'>
                                                <input
                                                    type='text'
                                                    value={this.state.phonebilldata.ooredoo_package}
                                                    placeholder='Enter Package'
                                                    onChange={this.setOoredooPackage}
                                                    className="form-control input-md checkValidate"></input>
                                            </div>
                                        </div>

                                        <div className='col-md-4 col-lg-4'>

                                            <div>
                                                <label className='col-sm-12'>Ooredoo Extra</label>
                                            </div>
                                            <div className='col-sm-10'>
                                                <input
                                                    type='text'
                                                    placeholder='Enter Extra'
                                                    onChange={this.setOoredooExtra}
                                                    value={this.state.phonebilldata.ooredoo_extra}
                                                    className="form-control input-md checkValidate" />
                                            </div>

                                        </div>

                                        <div className='col-md-4 col-lg-4'>

                                            <div>
                                                <label className='col-sm-12'>Other Phone</label>
                                            </div>
                                            <div className='col-sm-10'>
                                                <input
                                                    type='text'
                                                    className="form-control input-md checkValidate"
                                                    placeholder='Enter Other Phone'
                                                    onChange={this.setOtherPhone}
                                                    value={this.state.phonebilldata.other_phone}>

                                                </input>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='row margin-top-20'>
                                        <div className='col-md-4 col-lg-4'>

                                            <div>
                                                <label className='col-sm-12'>Amount</label>
                                            </div>
                                            <div className='col-sm-10'>
                                                <input
                                                    type='text'
                                                    className="form-control input-md checkValidate"
                                                    placeholder='Enter Amount'
                                                    value={this.state.phonebilldata.amount}
                                                    onChange={this.setAmount}></input>
                                            </div>

                                        </div>

                                        <div className='col-md-4 col-lg-4'>

                                            <div>
                                                <label className='col-sm-12'>Remark</label>
                                            </div>
                                            <div className='col-sm-10'>
                                                <input
                                                    type='text'
                                                    className="form-control input-md"
                                                    placeholder='Enter Remark'
                                                    value={this.state.phonebilldata.remark}
                                                    onChange={this.setRemark}></input>
                                            </div>

                                        </div>
                                        <div className="col-md-4"></div>

                                        <div className="col-md-4 ">

                                            <div className="col-sm-10" style={{ marginTop: 20 }}>

                                                <button className="btn btn-md btn-primary f-right" onClick={this.addData}><span>Add</span> </button>


                                            </div>
                                        </div>
                                    </div>

                                    <div className="result-area col-md-12 margin-top-20">
                                        <table className="table table-bordered table-responsive">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Position</th>
                                                    <th>Branch</th>
                                                    <th>Contact Number</th>
                                                    <th>Ooredoo Packgae</th>
                                                    <th>Ooredoo Extra</th>
                                                    <th>Other Phone</th>
                                                    <th>Amount</th>
                                                    <th>Remark</th>
                                                </tr>
                                            </thead>

                                            <tbody>

                                                {

                                                    this.state.dataSource.length <= 0 ?

                                                        (<tr><td colSpan="9" className="text-center">No data</td></tr>) :
                                                        (this.state.dataSource.map((data, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td>{data.user_name}</td>
                                                                    <td>{data.designations}</td>
                                                                    <td>{data.branch_name}</td>
                                                                    <td>{data.contact_number}</td>
                                                                    <td>{data.ooredoo_package}</td>
                                                                    <td>{data.ooredoo_extra}</td>
                                                                    <td>{data.other_phone}</td>
                                                                    <td>{data.amount}</td>
                                                                    <td>{data.remark}</td>
                                                                    <td><button className="btn btn-primary btn-sm" onClick={this.handlePhoneBillRequestRemove.bind(this, index)} >Remove</button></td>
                                                                </tr>
                                                            )


                                                        }
                                                        ))
                                                }
                                                { /*<tr >
                                                    <td><Select
                                                        placeholder="Please Choose Type"
                                                        onChange={this.handleChangename}
                                                        options={this.state.employee_list}
                                                    /></td>
                                                    <td>
                                                        <input type='text' disabled className="form-control input-md"></input>
                                                    </td>
                                                    <td>
                                                        <input type='text' disabled className="form-control input-md"></input>
                                                    </td>
                                                    <td>
                                                        <input type='text' disabled className="form-control input-md"></input>
                                                    </td>
                                                    <td>
                                                        <input type='text' disabled className="form-control input-md"></input>
                                                    </td>
                                                    <td>
                                                        <input type='text' disabled className="form-control input-md"></input>
                                                    </td>
                                                    <td>
                                                        <input type='text' disabled className="form-control input-md"></input>
                                                    </td>
                                                    <td>
                                                        <input type='text' disabled className="form-control input-md"></input>
                                                    </td>
                                                    <td>
                                                        <input type='text' disabled className="form-control input-md"></input>
                                                    </td>
                                                    <td><button className="btn btn-primary btn-sm"
                                                    >Remove</button></td>
                                                </tr> */}
                                            </tbody>

                                        </table>
                                    </div>
                                </div>

                                <div className="row save-btn">
                                    {
                                        !Array.isArray(one_request) && havePermission(this.state.work_flow_status) ?
                                            <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.status} work_flow={this.state.work_flow_status} />

                                            :
                                            <div className="float-right">
                                                <div>
                                                    {this.state.status == undefined || this.state.status == 5 ?
                                                        <div>
                                                            <button onClick={this.savePhoneBill.bind(this)} className="btn btn-primary" id="saving_button" type="button"><span>Confirm</span></button>
                                                        </div>
                                                        :
                                                        ''
                                                    }
                                                    {/* <button className="btn btn-primary m-b-10" id="saving_button" onClick={this.savePhoneBill.bind(this)} ><span>Confirm</span> </button> */}
                                                </div>

                                            </div>
                                    }

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default PhoneBillRequest;
