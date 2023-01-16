import React, { Component } from 'react';
import DatePicker from 'react-datetime';
import Select from 'react-select';
import {
    getUserId, validate, getActionStatus, main_url, havePermissionForAmount, stopSaving, startSaving,
    getBranch, isRequestedUser, fno
} from '../../../utils/CommonFunction';
import ApprovalForm from '../../Common/ApprovalForm';

var form_validate = true;
export default class TravelAdvancedEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            branch: [],
            selected_location: [],
            setupData: {
                modifiedBy: getUserId("user_info"),
                selectedRequest: 1,
                id: props.data.travel_allowance_id,
                purpose: props.data.purpose,
                startLoc: props.data.start_location,
                destination: props.data.destination,
                startDate: props.data.start_date,
                endDate: props.data.end_date,
                noOfDays: props.data.noOfDays,
                noOfNights: props.data.noOfNights,
                meals: props.data.meals,
                lodging: props.data.lodging,
                transport: props.data.transport,
                amount: props.data.advanced_amount,
                checked_by: props.data.checked_by,
                verified_by: props.data.verified_by,
                approved_by: props.data.approved_by,
                rejected_by: props.data.rejected_by,
                checked_date: props.data.checked_date,
                verified_date: props.data.verified_date,
                approved_date: props.data.approved_date,
                rejected_date: props.data.rejected_date,
                status: props.data.status == 5 ? 0 : props.data.status,
                withdraw_location: props.data.withdraw_location

            },
            is_main_role: havePermissionForAmount(this.props.work_flow_status, this.props.data.createdBy),
            status_title: '',
            comment: ''

        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    // isRequestedUser() {
    //     if (this.state.setupData.modifiedBy === this.state.data.createdBy) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }

    async componentDidMount() {
        let that = this;
        let branch = await getBranch();
        that.setState({
            branch: branch,
            selected_location: { label: this.props.data.withdraw_location_name, value: this.props.data.withdraw_location }
        })
    }

    changeText = (e) => {
        let data = this.state.setupData;
        let name = e.target.dataset.name;
        data[name] = e.target.value;

        if (name === 'meals' || name === 'transport' || name === 'lodging') {
            data.amount = Number(data.meals) + Number(data.transport) + Number(data.lodging)
        }
        this.setState({
            setupData: data
        })
    }

    changeWithdrawLocation = (e) => {
        let data = this.state.setupData;
        data.withdraw_location = e.value;
        this.setState({
            selected_location: e,
            setupData: data
        })
    }

    changeStartDate(value) {
        let data = this.state.setupData;
        data.startDate = value
        this.setState({
            setupData: data,

        })
    }

    changeEndDate(value) {
        let data = this.state.setupData;
        data.endDate = value
        this.setState({
            setupData: data,

        })
    }

    check = (data) => {
        stopSaving();
        let comment=encodeURIComponent(this.state.setupData.purpose);
        let startLocation=encodeURIComponent(this.state.setupData.startLoc);
        let destinationEncode=encodeURIComponent(this.state.setupData.destination);
        var data = this.state.setupData;
        data['startLoc']=startLocation;
        data['purpose']=comment;
        data['destination']=destinationEncode;
        // var data = {
        //     user_id: ,
        //     withdraw_location: data.
            // purpose:comment,
            // start_location:startLocation,
            // destination:destinationEncode ,
        //     start_date: ,
        //     end_date: ,
        //     noOfDays: ,
        //     noOfNights: ,
        //     meals: ,
        //     lodging: ,
        //     transport: ,
        //     status: ,
        // }
        if (validate('check_form')) {
            var { status_title, is_main_role } = this.state;
            //  this.props.edit(this.state.setupData)

            if (status_title !== '' && is_main_role) {
                var action = getActionStatus(status_title, this.state.data, this.state.setupData.modifiedBy, this.state.comment);
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

            let status = 0;
            fetch(main_url + 'allowance/editAdvancedTravelRequestAllowance/' + data.id, {
                method: "PUT",
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
        else {
            startSaving();
            form_validate = false;
        }
    }

    approvalStatus = (text, comment) => {
        this.setState({ status_title: text, comment: comment }, () => this.check())
    }

    render() {
        let { is_main_role } = this.state;
        return (

            <div className="row wrapper border-bottom white-bg">
                <div className="row margin-top-20" id="check_form">

                    <div className="form-horizontal" name="demo-form">
                        <div className="col-md-6">

                            <div className="form-group">
                                <div><label className="col-sm-12" >Request Type<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <input
                                        className="form-control input-md"
                                        disabled
                                        value="Advanced "
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Withdraw Location<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <Select
                                        data-name='withdraw_loction'
                                        value={this.state.selected_location}
                                        onChange={this.changeWithdrawLocation}
                                        options={this.state.branch}
                                        className='react-select-container checkValidate'
                                        classNamePrefix="react-select"
                                    />
                                </div>
                            </div>

                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Start Location<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md checkValidate"
                                        value={this.state.setupData.startLoc}
                                        data-name='startLoc'
                                        onChange={this.changeText}
                                        disabled={is_main_role ? true : false}

                                    />

                                </div>
                            </div>

                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Destination<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md checkValidate"
                                        value={this.state.setupData.destination}
                                        data-name='destination'
                                        onChange={this.changeText}
                                        disabled={is_main_role ? true : false}

                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Start Date<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <DatePicker
                                        dateFormat="DD/MM/YYYY"
                                        value={this.state.setupData.startDate}
                                        data-name='startDate'
                                        timeFormat={false}
                                        onChange={this.changeStartDate.bind(this)}
                                        disabled={is_main_role ? true : false}

                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >End Date<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <DatePicker
                                        dateFormat="DD/MM/YYYY"
                                        value={this.state.setupData.endDate}
                                        data-name='endDate'
                                        timeFormat={false}
                                        onChange={this.changeEndDate.bind(this)}
                                        disabled={is_main_role ? true : false}

                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >No of Days<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md checkValidate"
                                        value={this.state.setupData.noOfDays}
                                        data-name='noOfDays'
                                        type="number"
                                        min="0"
                                        onChange={this.changeText}
                                        disabled={is_main_role ? true : false}

                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >No of Nights<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        value={this.state.setupData.noOfNights}
                                        data-name='noOfNights'
                                        type="number"
                                        min="0"
                                        onChange={this.changeText}
                                        disabled={is_main_role ? true : false}

                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Meals<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        id="meal"
                                        className="form-control input-md"
                                        value={this.state.setupData.meals}
                                        data-name='meals'
                                        type="number"
                                        onChange={this.changeText}
                                        disabled={isRequestedUser(this.state.setupData.modifiedBy, this.state.data.createdBy) ? true : false}
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Lodging<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        id="lodging"
                                        className="form-control input-md"
                                        value={this.state.setupData.lodging}
                                        data-name='lodging'
                                        type="number"
                                        onChange={this.changeText}
                                        disabled={isRequestedUser(this.state.setupData.modifiedBy, this.state.data.createdBy) ? true : false}

                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Transport<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        id="transport"
                                        className="form-control input-md"
                                        value={this.state.setupData.transport}
                                        data-name='transport'
                                        type="number"
                                        onChange={this.changeText}
                                        disabled={isRequestedUser(this.state.setupData.modifiedBy, this.state.data.createdBy) ? true : false}

                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Total Amount<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        disabled
                                        className="form-control input-md checkValidate"
                                        value={this.state.setupData.amount}

                                    />

                                </div>
                            </div>

                        </div>
                        {/* @hmh */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Branch<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        value={this.props.data.branch_name}
                                        disabled
                                    />

                                </div>
                            </div>

                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Name<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        value={this.state.data.fullname}
                                        disabled
                                    />

                                </div>
                            </div>

                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Position<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        value={this.state.data.designations}
                                        disabled
                                    />

                                </div>
                            </div>

                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Voucher No<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        value={fno.fno_travel + this.state.data.form_no}
                                        disabled
                                    />

                                </div>
                            </div>

                        </div>
                        {/* @hmh */}
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Purpose<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <textarea
                                        cols="20"
                                        rows="10"
                                        className="form-control input-md checkValidate"
                                        data-name='purpose'
                                        value={this.state.setupData.purpose}
                                        onChange={this.changeText}
                                        disabled={is_main_role ? true : false}

                                    />
                                </div>
                            </div>

                        </div>
                        <div className="row save-btn">
                            {
                                is_main_role ?
                                    <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.data.status} work_flow={this.props.work_flow_status} total_amount={this.state.data.total_amount} />
                                    :

                                    <div className="col-md-12 btn-rightend">
                                        {this.state.data.status == undefined || this.state.data.status == 5 ?
                                            <div>
                                                <button onClick={this.check.bind(this,this.state.setupData)} className="btn btn-primary" id="saving_button" type="button">Save</button>
                                            </div>
                                            :
                                            ''
                                        }
                                        {/* <button onClick={this.check.bind(this, this.state.setupData)} id="saving_button" className="btn btn-primary"><span>Confirm</span> </button> */}
                                    </div>
                            }
                        </div>


                    </div>

                </div>

            </div>
        )
    }


}