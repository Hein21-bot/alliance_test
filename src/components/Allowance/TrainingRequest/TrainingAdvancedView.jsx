import React, { Component } from 'react';
import moment from "moment";
import { main_url } from '../../../utils/CommonFunction';
import ApprovalInformation from '../../Common/ApprovalInformation';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
export default class TrainingAdvancedView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data.training[0],
            detail: props.data.detail,
            expense: props.data.expense,
            status_info: []
        }

    }

    componentDidUpdate() {
        $(".own-table").eq(0).empty()

    }

    componentDidMount() {
        this.getStatusInfo();
    }

    getStatusInfo() {
        fetch(`${main_url}allowance/getTrainingDetailInfo/${this.state.data.training_allowance_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.log(error))
    }

    getGrandTotal() {
        let cost = this.state.data.totalExpense + this.state.data.totalTrainingCost;
        return cost;
    }

    getAverageCose() {
        let cost = this.getGrandTotal() / this.state.data.noOfParticipant;
        return cost;
    }

    render() {

        var columns = [
            { title: "Cost Title", prop: "costTitle" },
            { title: "Cost Per Day", prop: "costPerDay" },


        ]
        var detail = []
        for (var i = 0; i < this.state.detail.length; i++) {
            var data = this.state.detail[i]
            detail.push(
                {
                    costTitle: data.cost_title,
                    costPerDay: data.costPerDay,
                }
            )
        }


        return (
            <div className="row wrapper border-bottom white-bg ">
                <div className="row margin-top-20">
                    <div className="form-horizontal" name="demo-form">
                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12" >AdvanceFormNo<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input className="form-control input-md"
                                        disabled
                                        value={this.state.data.form_no}

                                    />

                                </div>
                            </div>

                        </div>

                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12" >Training Type<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input className="form-control input-md"
                                        disabled
                                        value={this.state.data.training_type}

                                    />

                                </div>
                            </div>

                        </div>
                        <div className="col-md-4">
                            <div className="form-group" >
                                <div><label className="col-sm-12" >Purpose<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        type="text"
                                        value={this.state.data.purpose}
                                        disabled

                                    />

                                </div>
                            </div>

                        </div>

                        <div className="col-md-4">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Reason<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        type="text"
                                        value={this.state.data.reason}
                                        disabled
                                    />

                                </div>
                            </div>

                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Start Date Time<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        value={moment(this.state.data.start_date).format('DD-MM-YYYY h:mm a')}
                                        disabled
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <div><label className="col-sm-12" >End Date Time<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        value={moment(this.state.data.end_date).format('DD-MM-YYYY h:mm a')}
                                        disabled
                                    />

                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Total Training Day<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        type="text"
                                        value={this.state.data.totalTrainingDay}
                                        disabled
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Hour Per Day<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        type="text"
                                        value={this.state.data.hourPerDay}
                                        disabled
                                    />

                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Total Hour Of Training<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        type="number"
                                        disabled
                                        value={this.state.data.totalHourTraining}
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12" >Training Venue<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        type="text"
                                        value={this.state.data.location_master_name}
                                        disabled
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12" >Training Room No<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        type="text"
                                        value={this.state.data.training_room_name}
                                        disabled
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">

                        </div>


                        <div className="col-md-4">
                            <div className="form-group">
                                <div><label className="col-sm-12" >No Of Participants<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        type="text"
                                        value={this.state.data.noOfParticipant}
                                        disabled
                                    />

                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Total Number of Participants<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <input
                                        className="form-control input-md"
                                        type="text"
                                        value={this.state.data.totalParticipant}
                                        disabled
                                    />

                                </div>
                            </div>
                        </div>

                        <div className="col-md-2">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Number of Instructor<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        type="text"
                                        value={this.state.data.noOfInstructor}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Total Instructors<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        type="text"
                                        value={this.state.data.totalInstructor}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row document-main">
                    <div className="main-info">
                        <div className="header-info col-sm-12">
                            <h4>Training Cost</h4>
                        </div>
                        <div className="row body-info">

                            <div className="col-md-12">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Cost Title</th>
                                            <th>Cost Per Day</th>
                                            <th>Amount</th>

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                            this.state.detail.length <= 0 ?

                                                (<td colSpan="3" class="text-center">No data</td>) :
                                                (this.state.detail.map((data, index) => {
                                                    return (


                                                        <tr key={index}>
                                                            <td>{data.cost_title}</td>
                                                            <td>{data.amount}</td>
                                                            <td>{data.amount * this.state.data.totalParticipant}</td>

                                                        </tr>
                                                    )
                                                }
                                                ))

                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th style={{ textAlign: "right" }} colspan="2">Total Amount:</th>
                                            <td>{this.state.data.totalTrainingCost}</td>
                                        </tr>
                                    </tfoot>

                                </table>
                            </div>

                        </div>

                    </div>
                </div>
                <div className="row document-main">
                    <div className="main-info">
                        <div className="header-info col-sm-12">
                            <h4>Training Expense</h4>
                        </div>
                        <div className="row body-info">

                            <div className="col-md-12">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Expense Title</th>
                                            <th>Avg Cost Per Participant</th>
                                            <th>Amount</th>

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {
                                            this.state.expense.length <= 0 ?

                                                (<td colSpan="3" class="text-center">No data</td>) :
                                                (this.state.expense.map((data, index) => {
                                                    return (


                                                        <tr key={index}>
                                                            <td>{data.expense_title}</td>
                                                            <td>{data.amount}</td>
                                                            <td>{data.amount * this.state.data.totalParticipant}</td>

                                                        </tr>
                                                    )
                                                }
                                                ))

                                        }
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th></th>
                                            <th style={{ textAlign: "right" }} colspan="1">Total Amount:</th>
                                            <td>{this.state.data.totalExpense}</td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="row margin-top-20">

                    <div className="col-md-4" >
                        <div><label className="col-sm-12" >Grand Total</label></div>
                        <div className="col-sm-12">
                            <input type="text" className="form-control" value={this.getGrandTotal()}></input>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div><label className="col-sm-12" >Average Cost Per Participant</label></div>
                        <div className="col-sm-12">
                            <input type="text" className="form-control" value={this.getAverageCose()}></input>
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

        )
    }


}