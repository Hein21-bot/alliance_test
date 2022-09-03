import React, { Component } from 'react';
import Select from 'react-select';
import moment from 'moment'
import DatePicker from 'react-datetime';
import { ToastContainer, toast } from 'react-toastify';
import { main_url, getCookieData, calculationDate, validate, stopSaving, startSaving, calculationDate1 } from '../../utils/CommonFunction';

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
            startDate: '',
            endDate: '',
            reason: this.props.data.reason,
            attachment: '',
            doc: [],
            isHR: '',
            leaveDetail: null,
            max_days: 0,
            leave_days1: null,
            halfDay: this.props.data.leave_days,
            childDeliveryDate: '',
            holidays: 0
        }
    }

    getVerifyBy() {
        let user_id = 0;
        let category_id = 0;
        user_id = this.state.user_info.user_id;

        var category = this.state.selectedCategory;
        category_id = !Array.isArray(category) ? category.value : 0;
        fetch(`${main_url}leave/getVerifyBy/${user_id}/${category_id}`)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                this.setState({ verifyBy: res })
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    getApprovedBy() {
        let user_id = 0;
        let category_id = 0;
        user_id = this.state.user_info.user_id;
        var category = this.state.selectedCategory;
        category_id = !Array.isArray(category) ? category.value : 0;
        fetch(`${main_url}leave/getApprovedBy/${user_id}/${category_id}`)
            .then(response => {

                if (response.ok) return response.json()
            })
            .then(res => {
                this.setState({ approvedBy: res })
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    componentDidMount() {
        //     this.leaveDays(this.props.data.leave_start_date, this.props.data.leave_end_date)
        //     this.getHolidays(this.props.data.leave_start_date, this.props.data.leave_end_date)
        // this.getHolidays(this.props.data.leave_start_date, this.props.data.leave_end_date).then(() => { this.leaveDays(this.props.data.leave_start_date, this.props.data.leave_end_date) })
        fetch(`${main_url}leave/getHR`)
            .then(response => response.json())
            .then(data =>
                this.setState({ isHR: data.map(v => v.user_id).find(v => v === this.state.user_info.user_id) }));

        this.leaveCategory();
        fetch(`${main_url}leave/getLeave/${this.props.data.leave_application_id}`)
            .then(response => response.json())
            .then(data =>
                this.setState({
                    doc: data[0].attachment,
                    isVerify: data
                })
            );

        fetch(`${main_url}leave/getLeaveDetailUser/${this.state.data.user_id}`)
            .then((response) => response.json())
            .then((data) => this.setState({ leaveDetail: data }));

        fetch(`${main_url}leave/viewBerify/${this.state.data.verify_by}`)
            .then(response => response.json())
            .then(data =>
                this.setState({ verifyBy: data[0].fullname }));

        fetch(`${main_url}leave/viewApproved/${this.state.data.approve_by}`)
            .then(response => response.json())
            .then(data =>
                data.length > 0 ? this.setState({ approvedBy: data[0].fullname })
                    : this.setState({ approvedBy: "" }))
    }

    getHolidays(startDate, endDate) {
        fetch(main_url + `leave/getHolidays/${moment(startDate).format("YYYY-MM-DD")}/${moment(endDate).format("YYYY-MM-DD")}`)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                let holidays = res.reduce(
                    (previousValue, currentValue) => previousValue + (currentValue.holidays + 1)
                    , 0
                )
                this.setState({
                    holidays: holidays
                })
            })
            .catch(error => this.setState({
                holidays: 0
            }));
    }


    componentDidUpdate(prevProps) {
        if (prevProps.data.approve_by_name != this.props.data.approve_by_name || prevProps.data.verify_by_name != this.props.data.verify_by_name) {
            this.setState({ approvedBy: this.props.data.approve_by_name });
            this.setState({ verifyBy: this.props.data.verify_by_name });
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
                if (this.props.data.approved_date == null) {
                    this.setState({ leaveCategory: res })
                } else {
                    if (this.props.data.approve_by == this.state.user_info.user_id) {
                        res = res.filter(function (l) {
                            return l.label == "Casual Leave" || l.label == "Earned Leave"
                        })
                        this.setState({
                            leaveCategory: res
                        })
                    } else {
                        this.setState({ leaveCategory: res })
                    }

                }


            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }


    handleChangeCategory = e => {
        this.setState({
            selectedCategory: e
        }, () => {
            this.getVerifyBy();
            this.getApprovedBy();
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

    handleChangeChildDeliveryDate = (event) => {

        this.setState({
            childDeliveryDate: event
        })
    }

    handleChangeStartDate = (event) => {
        this.setState({
            startDate: event
        }, () => {
            this.getHolidays(this.state.startDate, this.state.endDate == '' ? this.props.data.leave_end_date : this.state.endDate)
            this.leaveDays(this.state.startDate, this.state.endDate == '' ? this.props.data.leave_end_date : this.state.endDate)
        })
    }

    handleChangeEndDate = (event) => {
        this.setState({
            endDate: event
        }, () => {
            this.getHolidays(this.state.startDate == '' ? this.props.data.leave_start_date : this.state.startDate, this.state.endDate)
            this.leaveDays(this.state.startDate == '' ? this.props.data.leave_start_date : this.state.startDate, this.state.endDate)
        })
    }

    handleChangeReason = e => {
        if (e.target.value != "") {
            this.setState({
                reason: e.target.value,
                buttonState: false
            });
        } else {
            this.setState({
                reason: null
            });
        }
    };

    handleChangeComment = e => {
        this.setState({
            comments: e.target.value
        })
    }

    handleChangeAttachment = e => {
        this.setState({
            selectedEmployee: e
        })
    }

    onChangeWork(event) {
        this.setState({
            halfDay: event.target.value
        });
    }

    leaveDays(startDate, endDate) {
        if (this.state.selectedCategory.value == undefined ? this.props.data.leave_category_id == 4 : this.state.selectedCategory.value == 4) {
            this.setState({
                leave_days1: calculationDate1(startDate, endDate)
            })
        } else {
            this.setState({
                leave_days1: calculationDate1(startDate, endDate) > 5 ? calculationDate(startDate, endDate) : calculationDate1(startDate, endDate)
            })
        }
    }

    checkFiles = (e) => {
        var files = document.getElementById("attach_file").files;
        var attachment = [];
        for (let i = 0; i < files.length; i++) {
            attachment.push(files[i])
        }

        this.setState({
            attachment: attachment,

        })
    }

    removeOldDocument(event) {
        this.setState({
            doc: null
        })
    }


    verifySave() {
        // let path = `updateLeave`;
        let user_id = 0;

        if (validate('check_form')) {
            if (this.state.tab === 1) {
                user_id = this.state.user_info.user_id;
            } else {
                var user = this.state.selectedEmployee;
                user_id = !Array.isArray(user) ? user.value : 0;
            }
            let leave_days = calculationDate(this.state.startDate, this.state.endDate);
            let data = {
                application_status: 2,
                leave_category_id: this.state.selectedCategory.value == undefined ? this.props.data.leave_category_id : this.state.selectedCategory.value,
                comments: this.state.comments,
                req_days: parseFloat(this.state.data.leave_days),
                max_days: this.state.max_days,
                verify_date: new Date(),
                leave_start_date: this.state.startDate == '' ? this.props.data.leave_start_date : moment(this.state.startDate).format('YYYY-MM-DD'),
                leave_end_date: this.state.endDate == '' ? this.props.data.leave_start_date : moment(this.state.endDate).format('YYYY-MM-DD')
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

        if (validate('check_form')) {
            if (this.state.tab === 1) {
                user_id = this.state.user_info.user_id;
            } else {
                var user = this.state.selectedEmployee;
                user_id = !Array.isArray(user) ? user.value : 0;
            }
            let data = {
                application_status: 3,
                leave_category_id: this.state.selectedCategory.value == undefined ? this.props.data.leave_category_id : this.state.selectedCategory.value,
                comments: this.state.comments,
                req_days: parseFloat(this.state.data.leave_days),
                max_days: this.state.max_days,
                approve_date: new Date(),
                leave_start_date: this.state.startDate == '' ? this.props.data.leave_start_date : moment(this.state.startDate).format('YYYY-MM-DD'),
                leave_end_date: this.state.endDate == '' ? this.props.data.leave_start_date : moment(this.state.endDate).format('YYYY-MM-DD')
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

        if (validate('check_form')) {
            if (this.state.tab === 1) {
                user_id = this.state.user_info.user_id;
            } else {
                var user = this.state.selectedEmployee;
                user_id = !Array.isArray(user) ? user.value : 0;
            }
            let data = {
                application_status: 4,
                leave_category_id: this.state.selectedCategory.value,
                comments: this.state.comments,
                req_days: parseFloat(this.state.data.leave_days),
                max_days: this.state.max_days,
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

    referBackSave() {
        // let path = `updateLeave`;
        let user_id = 0;

        if (validate('check_form')) {
            if (this.state.tab === 1) {
                user_id = this.state.user_info.user_id;
            } else {
                var user = this.state.selectedEmployee;
                user_id = !Array.isArray(user) ? user.value : 0;
            }
            let data = {
                application_status: 5,
                leave_category_id: this.state.selectedCategory.value,
                comments: this.state.comments,
                req_days: parseFloat(this.state.data.leave_days),
                max_days: this.state.max_days,
                referback_date: new Date()
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
        let user_id = 0;

        if (validate('check_form')) {
            let leave_days = calculationDate1(this.state.startDate == '' ? this.props.data.leave_start_date : this.state.startDate, this.state.endDate == '' ? this.props.data.leave_end_date : this.state.endDate) > 5 && this.state.selectedCategory.value != 4 ? calculationDate(this.state.startDate == '' ? this.props.data.leave_start_date : this.state.startDate, this.state.endDate == '' ? this.props.data.leave_end_date : this.state.endDate) : calculationDate1(this.state.startDate == '' ? this.props.data.leave_start_date : this.state.startDate, this.state.endDate == '' ? this.props.data.leave_end_date : this.state.endDate)

            let data = {
                application_status: 1,
                child_delivery_date: this.state.childDeliveryDate == '' ? this.props.data.child_delivery_date : moment(this.state.childDeliveryDate).format('YYYY-MM-DD'),
                leave_start_date: this.state.startDate == '' ? this.props.data.leave_start_date : moment(this.state.startDate).format('YYYY-MM-DD'),
                leave_end_date: this.state.endDate == '' ? this.props.data.leave_end_date : moment(this.state.endDate).format('YYYY-MM-DD'),
                leave_category_id: this.state.selectedCategory.value == undefined ? this.props.data.leave_category_id : this.state.selectedCategory.value,
                leave_days: leave_days == 1 || leave_days == 0 ? this.state.halfDay : (this.state.leave_days1 == null ? parseFloat(this.props.data.leave_days) : (this.state.leave_days1 == 0 ? this.state.halfDay : this.state.leave_days1 - this.state.holidays)),
                reason: this.state.reason == '' ? this.state.data.reason : this.state.reason,
                verifyBy: this.state.selectedVerifyBy.length == 0 ? this.state.data.verifyBy : this.state.selectedVerifyBy.value,
                approvedBy: this.state.selectedApproveBy.length == 0 ? this.state.data.approve_by : this.state.selectedApproveBy.value,
                files: imagedata,
                max_days: this.state.max_days,
                comments: this.state.comments,
                doc: this.state.doc,
                apply_date: this.props.data.application_date

            }
            const formdata = new FormData();
            var obj = document.querySelector("#attach_file").files.length;
            for (var i = 0; i < obj; i++) {
                var imagedata = document.querySelector("#attach_file").files[i];
                formdata.append('uploadfile', imagedata);
            }
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
        let leave_left = this.state.leaveDetail != null && this.state.leaveDetail[0].leave.filter(v => v.leave_category_id == parseInt(this.state.selectedCategory.value == undefined ? this.props.data.leave_category_id : this.state.selectedCategory.value))
        this.state.max_days = leave_left.length != 0 && leave_left[0] != undefined && leave_left[0].leave_quota - leave_left[0].leave_count
        return (
            <div className="nl" style={{ display: 'flex', justifyContent: 'center' }}>
                <ToastContainer />
                <div className="col-sm-12 white-bg mt20">
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

                                {this.state.data.user_id == this.state.user_info.user_id || this.props.data.application_status == 3 ?
                                    <Select
                                        placeholder={this.props.data.leave_category}
                                        options={this.state.leaveCategory}
                                        value={this.state.selectedCategory}
                                        // value={this.state.selectedCategory}
                                        onChange={this.handleChangeCategory}
                                        className='react-select-container'
                                        classNamePrefix="react-select"
                                    /> :
                                    <input type='text' className='form-control' value={this.props.data.leave_category} disabled />}

                            </div>
                        </div>
                        <div className="form-group"  >
                            <div><label className="col-sm-4" >Leave Balance<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <input
                                    type="text"
                                    className="form-control checkValidate"
                                    value={this.state.max_days}
                                    disabled
                                >
                                </input>
                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4" >Verify By<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                {this.state.data.user_id == this.state.user_info.user_id ?
                                    <Select
                                        placeholder={typeof (this.state.selectedCategory) == "string" ? this.state.verifyBy : "Select Verify Person"}
                                        options={this.state.verifyBy}
                                        value={this.state.selectedVerifyBy.length == 0 ? this.state.verifyBy : this.state.selectedVerifyBy}
                                        onChange={this.handleChangeVerifyBy}
                                        className='react-select-container '
                                        classNamePrefix="react-select"
                                    /> :
                                    <input type='text' className='form-control' value={this.state.data.application_status == 3 ? this.props.data.verify_by_name : this.state.verifyBy} disabled />}
                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4">Approved By<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                {this.state.data.user_id == this.state.user_info.user_id ?
                                    <Select
                                        placeholder={typeof (this.state.selectedCategory) == "string" ? this.state.approvedBy : "Select Approve Person"}
                                        options={this.state.approvedBy}
                                        value={this.state.selectedApproveBy.length == 0 ? this.state.approvedBy : this.state.selectedApproveBy}
                                        onChange={this.handleChangeApproveBy}
                                        className='react-select-container '
                                        classNamePrefix="react-select"
                                    /> :
                                    <input type='text' className='form-control' value={this.state.data.application_status == 3 ? this.props.data.approve_by_name : this.state.approvedBy} disabled />}
                            </div>
                        </div>
                        {this.props.data.leave_category_id == 4 ? <div className="form-group">
                            <div><label className="col-sm-4">Child Delivery Date<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8">
                                {this.state.data.user_id == this.state.user_info.user_id ?
                                    <DatePicker
                                        className="checkValidate"
                                        timeFormat={false}
                                        value={this.state.childDeliveryDate == '' ? this.props.data.child_delivery_date : this.state.childDeliveryDate}
                                        onChange={this.handleChangeChildDeliveryDate}
                                    /> :
                                    <input type='text' className='form-control' value={this.props.data.child_delivery_date} disabled />
                                }
                            </div>
                        </div> : ""}
                        <div className="form-group">
                            <div><label className="col-sm-4">Start Date<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8">
                                {this.state.data.user_id == this.state.user_info.user_id ?
                                    <DatePicker
                                        className="checkValidate"
                                        timeFormat={false}
                                        value={this.state.startDate == '' ? this.props.data.leave_start_date : this.state.startDate}
                                        onChange={this.handleChangeStartDate}
                                    /> :
                                    <input type='text' className='form-control' value={this.props.data.leave_start_date} disabled />
                                }
                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4">End Date<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8 ">
                                {this.state.data.user_id == this.state.user_info.user_id ?
                                    <DatePicker
                                        className="checkValidate"
                                        timeFormat={false}
                                        value={this.state.endDate == '' ? this.props.data.leave_end_date : this.state.endDate}
                                        onChange={this.handleChangeEndDate}
                                    /> :
                                    <input type='text' className='form-control' value={this.props.data.leave_end_date} disabled />
                                }
                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4">Applied On<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8 ">
                                <input type='text' className='form-control' value={moment(this.props.data.application_date).format('YYYY-MM-DD h:mm a')} disabled />

                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4">Leave Days<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                {this.state.data.user_id == this.state.user_info.user_id ?
                                    <input
                                        type="text"
                                        className="form-control checkValidate"
                                        value={this.state.leave_days1 == null ? (this.props.data.leave_days == 1 || this.props.data.leave_days == 0.5 ? this.state.halfDay : parseFloat(this.props.data.leave_days)) : (this.state.leave_days1 == 0 || this.state.leave_days1 == 1 ? this.state.halfDay : this.state.leave_days1 - this.state.holidays)}
                                    >
                                    </input>
                                    :
                                    <input type='text' className='form-control' value={this.props.data.leave_days} disabled />
                                }
                            </div>
                        </div>
                        {
                            this.state.data.user_id == this.state.user_info.user_id && (this.state.startDate != '' ? moment.utc(this.state.startDate).format("YYYY-MM-DD") == moment.utc(this.state.endDate).format("YYYY-MM-DD") : this.props.data.leave_start_date == this.props.data.leave_end_date) ?
                                <div className="form-group">
                                    <div><label className="col-sm-4">Leave Type<span className="text-danger">*</span></label> </div>
                                    <div onChange={this.onChangeWork.bind(this)} className="col-sm-8">
                                        <input type="radio" value={0.5} name="work" /> Half Day <br />
                                        <input type="radio" value={1.0} name="work" /> Full Day
                                    </div>
                                </div> : ''
                        }
                        <div className="form-group">
                            <div><label className="col-sm-4">Reason</label></div>
                            <div className="col-sm-8">
                                {this.state.data.user_id == this.state.user_info.user_id ?
                                    <textarea
                                        name="reason"
                                        id="reason"
                                        cols="30"
                                        rows="5"
                                        className="form-control checkValidate"
                                        value={this.state.reason == '' ? this.props.data.reason : this.state.reason}
                                        onChange={this.handleChangeReason}
                                    >
                                    </textarea> :
                                    <textarea
                                        name="reason"
                                        id="reason"
                                        cols="30"
                                        rows="5"
                                        className="form-control checkValidate"
                                        value={this.props.data.reason}
                                        disabled
                                    ></textarea>
                                }
                            </div>
                        </div>
                        {this.props.data.user_id != this.state.user_info.user_id ?
                            < div className="form-group">
                                <div><label className="col-sm-4">Comments</label></div>
                                <div className="col-sm-8">
                                    <textarea
                                        name="comments"
                                        id="comments"
                                        cols="30"
                                        rows="5"
                                        className={this.state.data.user_id == this.state.user_info.user_id ? "form-control" : "form-control checkValidate"}
                                        value={this.state.comments}
                                        onChange={this.handleChangeComment}
                                    >
                                    </textarea>
                                </div>
                            </div> : < div className="form-group">
                                <div><label className="col-sm-4">Comments</label></div>
                                <div className="col-sm-8">
                                    <textarea
                                        name="comments"
                                        id="comments"
                                        cols="30"
                                        rows="5"
                                        className={this.state.data.user_id == this.state.user_info.user_id ? "form-control" : "form-control checkValidate"}
                                        value={this.props.data.comments}
                                        // onChange={this.handleChangeComment}
                                        disabled
                                    >
                                    </textarea>
                                </div>
                            </div>}
                        {this.state.data.user_id == this.state.user_info.user_id ? <div className="form-group">
                            <div><label htmlFor="attachment" className="col-sm-4">Attachment</label></div>
                            <div className="col-sm-8">
                                <input type="file" className="" id="attach_file" onChange={this.checkFiles} />
                            </div>
                        </div> : ''}


                        {
                            this.state.doc !== [] && this.state.doc !== null ? <div className="row document-main">
                                {this.state.data.user_id == this.state.user_info.user_id ?
                                    this.state.doc.length > 0 ? (
                                        <div className="fileuploader-items col-md-4">
                                            <ul className="fileuploader-items-list">
                                                <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                    <div className="columns">
                                                        <div className="column-title">
                                                            <a href={`${main_url}leave/getCRDocumentData/${this.state.user_info.user_id}/${this.state.doc}`}
                                                                download target='_blank'
                                                                className="btn btn-primary document-body-bt document-width">
                                                                {this.state.doc.split("&@")[1]}
                                                            </a>
                                                        </div>
                                                        <div className="column-actions">
                                                            <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeOldDocument(event)}> <i></i></a>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    ) : ''
                                    :
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

                        {this.state.data.user_id == this.state.user_info.user_id ?
                            <div className="row">
                                <div className="col-sm-4  btn-rightend ">
                                    {
                                        <button className="btn btn-success" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.save()} ><span><i class="far fa-thumbs-up" style={{ paddingRight: '5px' }} ></i>Save</span></button>
                                    }
                                </div>
                            </div> :
                            <div className="row" style={{ display: 'flex', justifyContent: 'center' }}>

                                <div className="col-sm-4 " style={{}}>
                                    {(this.props.data.application_status == 8 || this.props.data.application_status == 1 && this.props.data.verify_by == this.state.user_info.user_id == false) || (this.props.data.application_status == 2 && this.props.data.approve_by == this.state.user_info.user_id == false) || (this.props.data.application_status == 3 || (this.props.data.approved_date != null && this.props.data.application_status == 9)) || this.props.data.application_status == 4 || this.props.data.application_status == 5 || (this.props.data.previous_status == 2 && this.props.data.verify_by == this.state.user_info.user_id == true && this.props.data.verify_by != this.props.data.approve_by) ?
                                        <button className="btn" style={{ fontSize: 11, cursor: 'pointer', backgroundColor: "#cc0066", color: "white" }} onClick={() => this.referBackSave()} disabled><span><i class="fas fa-times" style={{ paddingRight: '5px' }}></i>Refer Back</span></button>
                                        :
                                        <button className="btn" style={{ fontSize: 11, cursor: 'pointer', backgroundColor: "#cc0066", color: "white" }} onClick={() => this.referBackSave()}><span><i class="fas fa-times" style={{ paddingRight: '5px' }}></i>Refer Back</span></button>
                                    }
                                </div>
                                <div className="col-sm-4 " >
                                    {this.props.data.application_status == 8 || (this.props.data.application_status > 5 ? this.props.data.verify_date != null : this.props.data.application_status != 1) || this.props.data.verify_by == this.state.user_info.user_id == false || (this.props.data.previous_status == 2 && this.props.data.application_status == 9) ?
                                        <button className="btn btn-success" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.verifySave()} disabled><span><i class="far fa-thumbs-up" style={{ paddingRight: '5px' }} ></i>Verified</span></button> :
                                        <button className="btn btn-success" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.verifySave()} ><span><i class="far fa-thumbs-up" style={{ paddingRight: '5px' }} ></i>Verified</span></button>
                                    }
                                </div>
                                <div className="col-sm-4 " style={{ paddingRight: '20px' }}>
                                    {(this.props.data.application_status > 5 ? (this.props.data.previous_status == 1 || this.props.data.previous_status == 3 && this.props.data.application_status == 9) : this.props.data.application_status !== 2) || this.props.data.approve_by == this.state.user_info.user_id == false ?
                                        <button className="btn btn-success" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.approvedSave()} disabled><span><i class="far fa-thumbs-up" style={{ paddingRight: '5px' }}></i>Approved</span></button> :
                                        <button className="btn btn-success" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.approvedSave()}><span><i class="far fa-thumbs-up" style={{ paddingRight: '5px' }}></i>Approved</span></button>
                                    }
                                </div>
                                <div className="col-sm-4 " style={{}}>
                                    {this.props.data.application_status == 8 || (this.props.data.application_status == 1 && this.props.data.verify_by == this.state.user_info.user_id == false) || (this.props.data.application_status < 6 ? this.props.data.application_status == 3 : (this.props.data.approved_date != null && this.props.data.application_status == 9)) || this.props.data.application_status == 4 || this.props.data.application_status == 5 || (this.props.data.application_status == 2 && this.props.data.approve_by == this.state.user_info.user_id == false) || (this.props.data.previous_status == 2 && this.props.data.verify_by == this.state.user_info.user_id == true && this.props.data.verify_by != this.props.data.approve_by) ?
                                        <button className="btn btn-danger" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.rejectSave()} disabled><span><i class="fas fa-times" style={{ paddingRight: '5px' }}></i>Reject</span></button>
                                        :
                                        <button className="btn btn-danger" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.rejectSave()}><span><i class="fas fa-times" style={{ paddingRight: '5px' }}></i>Reject</span></button>
                                    }
                                </div>
                                <div className="col-sm-4 " style={{}}>

                                    {(this.props.data.application_status == 3 || (this.props.data.approved_date != null && this.props.data.application_status == 9)) && this.state.user_info.user_id == this.state.data.approve_by && (this.props.data.leave_category_id == 1 || this.props.data.leave_category_id == 5) ?
                                        <button className="btn btn-success" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.approvedSave()} ><span><i class="far fa-thumbs-up" style={{ paddingRight: '5px' }} ></i>Edit</span></button> :
                                        <button className="btn btn-success" style={{ fontSize: 11, cursor: 'pointer' }} onClick={() => this.approvedSave()} disabled><span><i class="far fa-thumbs-up" style={{ paddingRight: '5px' }} ></i>Edit</span></button>
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