import React, { Component } from 'react';
import Select from 'react-select';
import moment from 'moment'
import MyLeaveDetail from './MyLeaveDetail';
import { ToastContainer, toast } from 'react-toastify';
import { main_url, getCookieData } from '../../utils/CommonFunction';
import DocumentList from '../Common/DocumentList'

class LeaveManagementView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            // datasource: props.data,
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
            reason: '',
            attachment: '',
            doc: [],
            leaveDetail: null,
        }
    }



    componentDidMount() {

        fetch(`${main_url}leave/getLeave/${this.props.data.leave_application_id}`)
            .then(response => response.json())
            .then(data =>
                this.setState({ doc: data[0].attachment })
            );

        fetch(`${main_url}leave/viewBerify/${this.props.data.verify_by}`)
            .then(response => response.json())
            .then(data =>
                this.setState({ verifyBy: data[0].fullname }));

        fetch(`${main_url}leave/viewApproved/${this.props.data.approve_by}`)
            .then(response => response.json())
            .then(data =>
                data.length > 0 ? this.setState({ approvedBy: data[0].fullname })
                    : this.setState({ approvedBy: "" })
            )

        fetch(`${main_url}leave/getLeaveDetailUser/${this.props.data.user_id}`)
            .then((response) => response.json())
            .then((data) => this.setState({ leaveDetail: data }));

    }

    componentDidUpdate(prevProps) {

        if (prevProps.data.approve_by_name != this.props.data.approve_by_name || prevProps.data.verify_by_name != this.props.data.verify_by_name) {
            this.setState({ approvedBy: this.props.data.approve_by_name });
            this.setState({ verifyBy: this.props.data.verify_by_name });
        }
    }


    render() {
        let leave_left = this.state.leaveDetail != null && this.state.leaveDetail[0].leave.filter(v => v.leave_category_id == this.props.data.leave_category_id)
        this.state.max_days = leave_left.length != 0 && leave_left[0] != undefined && leave_left[0].leave_quota - leave_left[0].leave_count
        console.log("data is ===>", this.props.data)
        return (
            <div className="white-bg" style={{ display: 'flex', justifyContent: 'center' }}>
                <ToastContainer />
                <div className="col-sm-8 white-bg mt20">
                    <div className="form-horizontal white-bg" id="check_form">
                        <div className="form-group"  >
                            <div><label className="col-sm-4" >Employee Name<span className="text-danger">*</span></label></div>
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
                        <div className="form-group"  >
                            <div><label className="col-sm-4" >Leave Balance<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <input type="text" className="form-control checkValidate" value={this.state.max_days} disabled >
                                </input>
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
                        {this.props.data.leave_category_id == 4 ? <div className="form-group">
                            <div><label className="col-sm-4">Child Delivery Date<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8">
                                <input type='text' className='form-control' value={this.props.data.child_delivery_date} disabled />

                            </div>
                        </div> : ""}
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
                            <div><label className="col-sm-4">Applied On<span className="text-danger">*</span></label> </div>
                            <div className="col-sm-8 ">
                                <input type='text' className='form-control' value={moment(this.props.data.application_date).format('YYYY-MM-DD h:mm a')} disabled />

                            </div>
                        </div>
                        {this.props.data.cancel_request != null ?
                            <div className="form-group">
                                <div><label className="col-sm-4">Calcel Applied On<span className="text-danger">*</span></label> </div>
                                <div className="col-sm-8 ">
                                    <input type='text' className='form-control' value={this.props.data.leave_cancel_apply_date} disabled />

                                </div>
                            </div> : " "
                        }
                        <div className="form-group">
                            <div><label className="col-sm-4">Leave Days<span className="text-danger">*</span></label></div>
                            <div className="col-sm-8">
                                <input type='text' className='form-control' value={this.props.data.leave_days} disabled />
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
                                    value={this.props.data.reason}
                                    disabled
                                >
                                </textarea>
                            </div>
                        </div>
                        <div className="form-group">
                            <div><label className="col-sm-4">Comments</label></div>
                            <div className="col-sm-8">
                                <textarea
                                    name="reason"
                                    id="reason"
                                    cols="30"
                                    rows="5"
                                    className="form-control checkValidate"
                                    value={this.props.data.comments}
                                    disabled
                                >
                                </textarea>
                            </div>
                        </div>

                        {this.props.data.application_status > 5 ?
                            <div className="form-group">
                                <div><label className="col-sm-4">Cancel Reason</label></div>
                                <div className="col-sm-8">
                                    <textarea
                                        name="cancel"
                                        id="cancel"
                                        cols="30"
                                        rows="5"
                                        className="form-control checkValidate"
                                        value={this.props.data.cancel_request}
                                        disabled
                                    >
                                    </textarea>
                                </div>
                            </div> : " "
                        }


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
                </div>
                <MyLeaveDetail />
            </div>
        )
    }


}

export default LeaveManagementView