import React, { Component } from 'react';
import DatePicker from 'react-datetime';
import ApprovalInformation from '../../Common/ApprovalInformation';
import { main_url, fno } from '../../../utils/CommonFunction';

export default class TravelRequestView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            status_info: []
        }
    }

    getStatusInfo() {
        fetch(`${main_url}allowance/getTravelDetailInfo/${this.state.data.travel_allowance_id}`)
            .then(res => res.json())
            .then(res => {

                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.log(error))
    }

    componentDidMount() {
        this.getStatusInfo();
    }

    render() {
        return (
            <div>
                <div className="row wrapper border-bottom white-bg">
                    <div className="row margin-top-20">

                        <div className="form-horizontal" name="demo-form">

                            <div className="col-md-6">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Request Type<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">

                                        <input
                                            className="form-control input-md"
                                            disabled
                                            value="Advanced"

                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Withdraw Location<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">

                                        <input
                                            className="form-control input-md"
                                            value={this.state.data.withdraw_location_name}

                                        />

                                    </div>
                                </div>

                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Start Location<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">

                                        <input
                                            className="form-control input-md"
                                            value={this.state.data.start_location}

                                        />

                                    </div>
                                </div>

                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Destination<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">

                                        <input
                                            className="form-control input-md"
                                            value={this.state.data.destination}

                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Start Date<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">

                                        <DatePicker
                                            dateFormat='DD-MM-YYYY'
                                            value={this.state.data.start_date}
                                            disabled
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >End Date<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">

                                        <DatePicker
                                            dateFormat='DD-MM-YYYY'
                                            value={this.state.data.end_date}
                                            disabled
                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >No of Days<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">

                                        <input
                                            className="form-control input-md"
                                            value={this.state.data.noOfDays}

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
                                            value={this.state.data.noOfNights}

                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Meals<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">

                                        <input
                                            className="form-control input-md"
                                            value={this.state.data.meals}

                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Lodging<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">

                                        <input
                                            className="form-control input-md"
                                            value={this.state.data.lodging}

                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Transport<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">

                                        <input
                                            className="form-control input-md"
                                            value={this.state.data.transport}

                                        />

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >Total Amount<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">

                                        <input
                                            className="form-control input-md"
                                            value={this.state.data.advanced_amount}

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
                                            className="form-control input-md"
                                            value={this.state.data.purpose}

                                        />

                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                    {
                        !Array.isArray(this.state.status_info) ?

                            <div className="row approval-main margin-top-20">
                                <ApprovalInformation status={this.state.status_info} />
                            </div>
                            : ''
                    }

                </div>
            </div>
        )
    }


}