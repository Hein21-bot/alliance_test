import React, { Component } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datetime';
import MyLeaveDetail from './MyLeaveDetail';
import moment from 'moment'
import { ToastContainer, toast } from 'react-toastify';
import { main_url, getCookieData, calculationDate, validate, stopSaving, startSaving, calculationDate1, getUserId } from '../../utils/CommonFunction';

var form_validate = true;

export default class NewLeave extends Component {

    constructor(props) {
        super(props);
        this.state = {
            tab: this.props.tab,
            user_info: getCookieData('user_info'),
            employeeList: [],
            leaveCategory: [],
            verifyBy: [],
            approvedBy: [],
            selectedEmployee: [],
            selectedCategory: [],
            selectedVerifyBy: [],
            selectedApproveBy: [],
            startDate: new Date(),
            endDate: new Date(),
            childDeliveryDate: new Date(),
            reason: '',
            attachment: '',
            halfDay: 1.0,
            leaveDetail: null,
            user_id: getUserId("user_info"),
            leave_days1: 0,
            max_days: 0,
            holidays: 0
        }
    }

    componentDidMount() {
        this.getEmployeeList();
        this.leaveCategory();
        fetch(`${main_url}leave/getLeaveDetailUser/${this.state.user_id}`)
            .then((response) => response.json())
            .then((data) =>
                this.setState({ leaveDetail: data })
            );
    }

    componentDidUpdate(prevProps) {
        if (!form_validate) validate('check_form')
        if (prevProps.tab !== this.props.tab) {
            this.setState({
                tab: this.props.tab
            })
        }
    }

    async getHolidays(startDate, endDate) {
        await fetch(main_url + `leave/getHolidays/${moment.utc(startDate).format("YYYY-MM-DD")}/${moment.utc(endDate).format("YYYY-MM-DD")}`)
            .then(response => {
                return response.json()
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



    getVerifyBy() {
        let user_id = 0;
        let category_id = 0;
        if (this.state.tab === 1 || this.state.tab === 3) {
            user_id = this.state.user_info.user_id;
        } else {
            var user = this.state.selectedEmployee;
            user_id = !Array.isArray(user) ? user.value : 0;
        }
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
        if (this.state.tab === 1 || this.state.tab === 3) {
            user_id = this.state.user_info.user_id;
        } else {
            var user = this.state.selectedEmployee;
            user_id = !Array.isArray(user) ? user.value : 0;
        }
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


    leaveDays(startDate, endDate) {
        if (startDate <= endDate) {
            if (this.state.selectedCategory.value == 4 || this.state.selectedCategory.value == 1 || this.state.selectedCategory.value == 5) {

                if (this.state.selectedCategory.value == 4) {
                    this.setState({
                        leave_days1: calculationDate(startDate, endDate) - this.state.holidays
                    })
                } else {
                    this.setState({
                        leave_days1: (calculationDate1(startDate, endDate) - this.state.holidays) > 5 ? calculationDate(startDate, endDate) : (calculationDate1(startDate, endDate) - this.state.holidays)
                    })
                }
            } else {
                this.setState({
                    leave_days1: calculationDate(startDate, endDate)
                })
            }

        } else {
            this.setState({
                leave_days1: -1
            })
        }
    }

    handleChangeCategory = e => {
        this.setState({
            selectedCategory: e,
            selectedVerifyBy: null,
            selectedApproveBy: null
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
        })
        this.getHolidays(event, this.state.endDate).then(() => { this.leaveDays(event, this.state.endDate) })
    }

    handleChangeEndDate = (event) => {
        this.setState({
            endDate: event
        })
        this.getHolidays(this.state.startDate, event).then(() => { this.leaveDays(this.state.startDate, event) })
    }


    handleChangeReason = e => {
        this.setState({
            reason: e.target.value
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
            console.log("in file", files)
            attachment.push(files[i])
        }

        this.setState({
            attachment: attachment
        })
    }
    onChangeWork(event) {
        this.setState({
            halfDay: event.target.value
        });
    }

    save() {
        let path = 'addLeave';
        let user_id = 0;
        stopSaving();
        if (validate('check_form')) {
            if (this.state.leave_days1 != -1) {

                if (this.state.tab === 1 || this.state.tab == 3) {
                    user_id = this.state.user_info.user_id;
                } else {
                    var user = this.state.selectedEmployee;
                    user_id = !Array.isArray(user) ? user.value : 0;
                }

                let data = {
                    user_id: user_id,
                    child_delivery_date: this.state.childDeliveryDate,
                    leave_start_date: this.state.startDate,
                    leave_end_date: this.state.endDate,
                    leave_category_id: this.state.selectedCategory.value,
                    leave_days: moment.utc(this.state.startDate).format("YYYY-MM-DD") === moment.utc(this.state.endDate).format("YYYY-MM-DD") ? this.state.halfDay : this.state.leave_days1,
                    reason: this.state.reason,
                    verifyBy: this.state.selectedVerifyBy.value,
                    approvedBy: this.state.selectedApproveBy.value,
                    application_status: 1,
                    files: imagedata,
                    max_days: this.state.max_days
                }
                const formdata = new FormData();
                var obj = document.querySelector("#attach_file").files.length;
                for (var i = 0; i < obj; i++) {
                    var imagedata = document.querySelector("#attach_file").files[i];
                    formdata.append('uploadfile', imagedata);
                }
                formdata.append('leave_info', JSON.stringify(data))
                let status = 0;
                fetch(`${main_url}leave/${path}`, {
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
            } else {
                toast.error("Start date is greather than end date!");
            }
        }
        else {
            startSaving();
            form_validate = false;
        }
    }

    render() {
        let leave_left = this.state.leaveDetail != null && this.state.leaveDetail[0].leave.filter(v => v.leave_category_id == this.state.selectedCategory.value)
        this.state.max_days = leave_left.length != 0 && leave_left[0] != undefined && leave_left[0].leave_quota - leave_left[0].leave_count
        return (
            <div className="nl">
                <ToastContainer
                    position="top-right"
                    autoClose={15000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
                {/* <ToastContainer /> */}
                <div className="col-sm-8 white-bg mt20">
                    <div className="form-horizontal" id="check_form">
                        <div className="form-group"  >
                            <div><label className="col-sm-4" >Employee Name<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                {
                                    this.state.tab === 1 || this.state.tab === 3 ?
                                        <input type='text' className='form-control' value={this.state.user_info.fullname} disabled />
                                        : <Select
                                            placeholder="Select Employee"
                                            options={this.state.employeeList}
                                            value={this.state.selectedEmployee}
                                            onChange={this.handleChangeEmployee}
                                            className='react-select-container checkValidate'
                                            classNamePrefix="react-select"
                                        />
                                }
                            </div>
                        </div>
                        <div className="form-group"  >
                            <div><label className="col-sm-4" >Leave Category<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <Select
                                    placeholder="Select Leave Category"
                                    options={this.state.leaveCategory}
                                    value={this.state.selectedCategory}
                                    onChange={this.handleChangeCategory}
                                    className='react-select-container checkValidate'
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                        <div className="form-group"  >
                            <div><label className="col-sm-4" >Leave Balance<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <input
                                    type="text"
                                    className="form-control checkValidate"
                                    value={this.state.max_days}
                                >
                                </input>
                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4" >Verify By<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <Select
                                    placeholder="Select Verify Person"
                                    options={this.state.verifyBy}
                                    value={this.state.selectedVerifyBy}
                                    onChange={this.handleChangeVerifyBy}
                                    className='react-select-container checkValidate'
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4">Approved By<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <Select
                                    placeholder="Select Approve Person"
                                    options={this.state.approvedBy}
                                    value={this.state.selectedApproveBy}
                                    onChange={this.handleChangeApproveBy}
                                    className='react-select-container checkValidate'
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                        {this.state.selectedCategory.value == 4 ? <div className="form-group">
                            <div><label className="col-sm-4">Child Delivery Date<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8">
                                <DatePicker
                                    className="checkValidate"
                                    timeFormat={false}
                                    value={this.state.childDeliveryDate}
                                    onChange={this.handleChangeChildDeliveryDate}
                                />
                            </div>
                        </div> : ""}
                        <div className="form-group">
                            <div><label className="col-sm-4">Start Date<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8">
                                <DatePicker
                                    className="checkValidate"
                                    timeFormat={false}
                                    value={this.state.startDate}
                                    onChange={this.handleChangeStartDate}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4">End Date<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8 ">
                                <DatePicker
                                    className="checkValidate"
                                    timeFormat={false}
                                    value={this.state.endDate}
                                    onChange={this.handleChangeEndDate}
                                />
                            </div>
                        </div>
                        {
                            moment.utc(this.state.startDate).format("YYYY-MM-DD") == moment.utc(this.state.endDate).format("YYYY-MM-DD") ?
                                <div className="form-group">
                                    <div><label className="col-sm-4">Leave Type<span className="text-danger">*</span></label> </div>
                                    <div onChange={this.onChangeWork.bind(this)} className="col-sm-8">
                                        <input type="radio" value={0.5} name="work" /> Half Day <br />
                                        <input type="radio" value={1.0} name="work" /> Full Day
                                    </div>
                                </div> : ''
                        }
                        <div className="form-group"  >
                            <div><label className="col-sm-4" >Leave Days<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <input
                                    type="text"
                                    className="form-control checkValidate"
                                    value={(this.state.leave_days1 == 0 || this.state.leave_days1 == 1) ? this.state.halfDay : this.state.leave_days1}
                                >
                                </input>
                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4">Reason</label></div>
                            <div className="col-sm-8">
                                <textarea
                                    name="reason"
                                    id="reason"
                                    cols="30"
                                    rows="5"
                                    className="form-control checkValidate"
                                    value={this.state.reason}
                                    onChange={this.handleChangeReason}
                                >
                                </textarea>
                            </div>
                        </div>
                        <div className="form-group">
                            <div><label htmlFor="attachment" className="col-sm-4">Attachment</label></div>
                            <div className="col-sm-8">
                                <input type="file" accept="image/*" className="" id="attach_file" onChange={this.checkFiles} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-12">
                                <div className='f-right'>
                                    <button className="btn btn-primary" type="button" onClick={() => this.save()}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <MyLeaveDetail />
            </div>
        )
    }
}