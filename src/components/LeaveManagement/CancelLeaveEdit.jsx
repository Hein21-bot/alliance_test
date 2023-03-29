import React, { Component } from 'react';
import Select from 'react-select';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import { main_url, getCookieData, calculationDate, validate, stopSaving, startSaving } from '../../utils/CommonFunction';

var form_validate = true;
class LeaveManagementEdit extends Component {


    constructor(props) {
        super(props);
        this.state = {
            tab: this.props.tab,
            user_info: getCookieData('user_info'),
            data: props.data,
            employeeList: [],
            leaveCategory: [],
            verifyBy: [],
            approvedBy: [],
            selectedEmployee: [],
            selectedCategory: this.props.data.leave_category,
            selectedVerifyBy: [],
            selectedApproveBy: [],
            startDate: new Date(),
            endDate: new Date(),
            reason: '',
            attachment: '',
            doc: [],
            isHR: '',
        }
    }



    componentDidMount() {
        // this.getEmployeeList();

        fetch(`${main_url}leave/getHR`)
            .then(response => response.json())
            .then(data =>
                this.setState({ isHR: data.map(v => v.user_id).find(v => v === this.state.user_info.user_id) }));
        // const HR = this.state.HRis
        // const isHR = HR.map(v => v = this.state.user_info.user_id)

        this.leaveCategory();
        fetch(`${main_url}leave/getLeave/${this.props.data.leave_application_id}`)
            .then(response => response.json())
            .then(data =>
                this.setState({
                    doc: data[0].attachment,
                    isVerify: data
                })
            );

        fetch(`${main_url}leave/viewBerify/${this.props.data.verify_by}`)
            .then(response => response.json())
            .then(data =>
                this.setState({ verifyBy: data[0].fullname }));

        fetch(`${main_url}leave/viewApproved/${this.props.data.approve_by}`)
            .then(response => response.json())
            .then(data =>
                data.length > 0 ? this.setState({ approvedBy: data[0].fullname })
                    : this.setState({ approvedBy: "" }))
    }


    componentDidUpdate(prevProps) {
        if (!form_validate) validate('check_form')
        if (prevProps.tab !== this.props.tab) {
            this.setState({
                tab: this.props.tab
            })
        }
    }

    getEmployeeList() {
        fetch(`${main_url}main/getEmployeeWithDesignation/0`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    employeeList: data
                })
            })
    }

    leaveCategory() {
        fetch(main_url + "leave/getLeaveCategory")
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                this.setState({ leaveCategory: res })
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }




    handleChangeCategory = e => {
        this.setState({
            selectedCategory: e
        }, () => {
        })
    }

    handleChangeEmployee = e => {
        this.setState({
            selectedEmployee: e
        }, () => {
            this.getVerifyBy();
            this.getApprovedBy();
        })
    }

    handleChangeVerifyBy = e => {
        this.setState({
            selectedVerifyBy: e
        })
    }

    handleChangeApproveBy = e => {
        this.setState({
            selectedApproveBy: e
        })
    }

    handleChangeStartDate = (event) => {
        this.setState({
            startDate: event
        })
    }

    handleChangeEndDate = (event) => {
        this.setState({
            endDate: event
        })
    }

    handleChangeReason = e => {
        this.setState({
            reason: e.target.value
        })
    }

    handleChangeCancelReason = e => {
        this.setState({
            cancel_reason: e.target.value
        })
    }

    handleChangeAttachment = e => {
        this.setState({
            selectedEmployee: e
        })
    }

    checkFiles = (e) => {
        var files = document.getElementById("attach_file").files;
        var attachment = [];
        for (let i = 0; i < files.length; i++) {
            attachment.push(files[i])
        }

        this.setState({
            attachment: attachment
        })
    }

    verifySave() {
        // let path = `updateLeave`;
        let user_id = 0;
        stopSaving();
        if (validate('check_form')) {
            if (this.state.tab === 1) {
                user_id = this.state.user_info.user_id;
            } else {
                var user = this.state.selectedEmployee;
                user_id = !Array.isArray(user) ? user.value : 0;
            }
            let leave_days = calculationDate(this.state.startDate, this.state.endDate);
            let cancel_reason = this.state.cancel_reason
            let data = {
                application_status: 7,
                leave_category_id: this.state.selectedCategory.value == undefined ? this.props.data.leave_category_id : this.state.selectedCategory.value,
                cancel_reason: this.state.cancel_reason,
                cancel_verify: new Date()
            }

            const formdata = new FormData();
            formdata.append('leave_info', JSON.stringify(data))
            let status = 0;
            fetch(`${main_url}leave/updateLeave/` + this.state.data.leave_application_id, {
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
                })
        }
        else {
            startSaving();
            form_validate = false;
        }
    }


    approvedSave() {
        // let path = `updateLeave`;
        let user_id = 0;
        stopSaving();
        if (validate('check_form')) {
            if (this.state.tab === 1) {
                user_id = this.state.user_info.user_id;
            } else {
                var user = this.state.selectedEmployee;
                user_id = !Array.isArray(user) ? user.value : 0;
            }
            let data = {
                application_status: 8,
                leave_category_id: this.state.selectedCategory.value == undefined ? this.props.data.leave_category_id : this.state.selectedCategory.value,
                cancel_reason: this.state.cancel_reason,
                cancel_approve: new Date()
            }

            const formdata = new FormData();

            formdata.append('leave_info', JSON.stringify(data))
            let status = 0;
            fetch(`${main_url}leave/updateLeave/` + this.state.data.leave_application_id, {
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
                })
        }
        else {
            startSaving();
            form_validate = false;
        }
    }

    rejectSave() {
        // let path = `updateLeave`;
        let user_id = 0;
        stopSaving();
        if (validate('check_form')) {
            if (this.state.tab === 1) {
                user_id = this.state.user_info.user_id;
            } else {
                var user = this.state.selectedEmployee;
                user_id = !Array.isArray(user) ? user.value : 0;
            }
            let data = {
                application_status: 9,
                leave_category_id: this.state.selectedCategory.value,
                cancel_reason: this.state.cancel_reason,
                cancel_reject: new Date()
            }

            const formdata = new FormData();

            formdata.append('leave_info', JSON.stringify(data))
            let status = 0;
            fetch(`${main_url}leave/updateLeave/` + this.state.data.leave_application_id, {
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
                })
        }
        else {
            startSaving();
            form_validate = false;
        }
    }

    save() {
        // let path = `updateLeave`;
        let user_id = 0;
        stopSaving();
        if (validate('check_form')) {
            if (this.state.tab === 1) {
                user_id = this.state.user_info.user_id;
            } else {
                var user = this.state.selectedEmployee;
                user_id = !Array.isArray(user) ? user.value : 0;
            }
            let data = {
                application_status: 6,
                leave_category_id: this.state.selectedCategory.value == undefined ? this.props.data.leave_category_id : this.state.selectedCategory.value,
                cancel_reason: this.state.cancel_reason,
                cancel_date: new Date()
            }

            const formdata = new FormData();

            formdata.append('leave_info', JSON.stringify(data))
            let status = 0;
            fetch(`${main_url}leave/updateLeave/` + this.state.data.leave_application_id, {
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
                })
        }
        else {
            startSaving();
            form_validate = false;
        }
    }


    render() {
        return (
            <div className="nl" style={{ display: 'flex', justifyContent: 'center' }}>
                <ToastContainer />
                <div className="col-sm-8 white-bg mt20">
                    <div className="form-horizontal" id="check_form">
                        <div className="form-group"  >
                            <div><label className="col-sm-3" >Employee Name<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                {
                                    <input type='text' className='form-control' value={this.props.data.fullname} disabled />

                                }

                            </div>
                        </div>
                        <div className="form-group"  >
                            <div><label className="col-sm-4" >Leave Category<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <input type='text' className='form-control' value={this.props.data.leave_category} disabled />
                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4">Start Date<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8">
                                <input type='text' className='form-control' value={this.props.data.leave_start_date} disabled />

                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4">End Date<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8 ">
                                <input type='text' className='form-control' value={this.props.data.leave_end_date} disabled />

                            </div>
                        </div>

                        <div className="form-group">
                            <div><label className="col-sm-4">Leave Days<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <input type='text' className='form-control' value={this.props.data.leave_days} disabled />
                            </div>
                        </div>
                        {this.props.data.leave_days === 0.5 && this.props.data.half_time ?
                            <div className="form-group">
                                <div><label className="col-sm-4">AM or PM<span className="text-danger">*</span></label> </div>
                                <div className="col-sm-8 ">
                                    <input type='text' className='form-control' value={this.props.data.half_time} disabled />
                                </div>
                            </div> : " "
                        }
                        <div className="form-group">
                            <div><label className="col-sm-4">Reason</label></div>
                            <div className="col-sm-8">
                                <textarea
                                    name="reason"
                                    id="reason"
                                    cols="30"
                                    rows="3"
                                    className="form-control checkValidate"
                                    value={this.props.data.reason}
                                    disabled
                                >
                                </textarea>
                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4">Applied On<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8 ">
                                <input type='text' className='form-control' value={moment(this.props.data.application_date).format('YYYY-MM-DD h:mm a')} disabled />

                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4">Cancel Apply Date<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8 ">
                                <input type='text' className='form-control' value={this.props.data.leave_cancel_apply_date ? moment(this.props.data.leave_cancel_apply_date).format('YYYY-MM-DD') : moment(new Date()).format('YYYY-MM-DD')} disabled />

                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4">Cancel Reason</label></div>
                            <div className="col-sm-8">
                                {this.state.data.application_status == 6 || this.state.data.application_status == 7 || this.state.data.application_status == 8 ?
                                    <textarea
                                        name="cancel_reason"
                                        id="cancel_reason"
                                        cols="30"
                                        rows="3"
                                        className="form-control checkValidate"
                                        value={this.props.data.cancel_request}
                                        onChange={this.handleChangeCancelReason}
                                        disabled
                                    >
                                    </textarea> :
                                    <textarea
                                        name="cancel_reason"
                                        id="cancel_reason"
                                        cols="30"
                                        rows="3"
                                        className="form-control checkValidate"
                                        value={this.state.cancel_reason}
                                        onChange={this.handleChangeCancelReason}
                                    ></textarea>
                                }
                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4" >Verify By<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <input type='text' className='form-control' value={this.state.verifyBy} disabled />
                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4">Approved By<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <input type='text' className='form-control' value={this.state.approvedBy} disabled />
                            </div>
                        </div>


                        {
                            this.state.doc !== [] && this.state.doc !== null ? <div className="row document-main">
                                {
                                    this.state.doc.length > 0 ?
                                        (
                                            <div className="main-info">
                                                <div className="header-info col-sm-12">
                                                    <h4>Leave Management</h4>
                                                </div>
                                                <a href={`${main_url}leave/getCRDocumentData/${this.state.user_info.user_id}/${this.state.doc}`}
                                                    download target='_blank'
                                                    className="btn btn-primary document-body-bt document-width">
                                                    {this.state.doc.split("&@")[1]}
                                                </a>
                                            </div>
                                        )
                                        : ''

                                }
                            </div> : ''}

                    </div>
                    <div className="mt20">
                        {/* <div className="col-sm-4">Change Status:</div> */}
                        {this.state.data.user_id == this.state.user_info.user_id ?
                            <div className="row">
                                {(this.props.data.application_status > 5 && this.props.data.application_status < 9) ? "" : <div className="col-sm-4 col-sm-2 btn-rightend ">
                                    {
                                        <button className="btn btn-success" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.save()} ><span><i class="far fa-thumbs-up" style={{ paddingRight: '5px' }} ></i>Submit</span></button>
                                    }
                                </div>}
                            </div> :
                            <div className="row">

                                <div className="col-xs-4 col-sm-3" style={{ float: 'left' }}>

                                    {
                                        this.props.data.application_status !== 6 || this.props.data.verify_by == this.state.user_info.user_id == false ?
                                            <button className="btn btn-success" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.verifySave()} disabled><span><i class="far fa-thumbs-up" style={{ paddingRight: '5px' }} ></i>Verified</span></button> :
                                            <button className="btn btn-success" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.verifySave()} ><span><i class="far fa-thumbs-up" style={{ paddingRight: '5px' }} ></i>Verified</span></button>
                                    }
                                </div>
                                <div className="col-xs-4 col-sm-3" style={{ paddingRight: '20px' }}>
                                    {this.props.data.application_status !== 7 || this.props.data.approve_by == this.state.user_info.user_id == false ?
                                        <button className="btn btn-success" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.approvedSave()} disabled><span><i class="far fa-thumbs-up" style={{ paddingRight: '5px' }}></i>Approved</span></button> :
                                        <button className="btn btn-success" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.approvedSave()}><span><i class="far fa-thumbs-up" style={{ paddingRight: '5px' }}></i>Approved</span></button>
                                    }
                                </div>
                                <div className="col-xs-4 col-sm-3" style={{ paddingLeft: '20px' }}>
                                    {(this.props.data.application_status == 6 && this.props.data.approve_by == this.state.user_info.user_id && this.props.data.approve_by != this.props.data.verify_by) || (this.props.data.application_status == 7 && this.props.data.verify_by == this.state.user_info.user_id && this.props.data.approve_by != this.props.data.verify_by) || this.props.data.application_status == 8 || this.props.data.application_status == 9 ?
                                        <button className="btn btn-danger" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.rejectSave()} disabled><span><i class="fas fa-times" style={{ paddingRight: '5px' }}></i>Reject</span></button>
                                        :
                                        <button className="btn btn-danger" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.rejectSave()}><span><i class="fas fa-times" style={{ paddingRight: '5px' }}></i>Reject</span></button>
                                    }
                                </div>

                            </div>}
                    </div>
                </div>

            </div >
        )
    }

}

export default LeaveManagementEdit