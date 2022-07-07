import React, { Component } from 'react';
import { getUserId, main_url } from '../../../utils/CommonFunction';
import ApprovalInformation from '../../Common/ApprovalInformation';
import DocumentList from '../../Common/DocumentList';
import TrainingAdvancedView from './TrainingAdvancedView';
import moment from "moment";
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
export default class TrainingClaimRequestView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isAddNew: true,
            advanceData: props.data.advance[0],
            data: props.data.training[0],
            detail: props.data.detail,
            expense: props.data.expense,
            document: props.data.doc,
            created_user: getUserId("user_info"),
            status_info: [],
        }

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
    downloadData(filename) {
        let file = `${main_url}allowance/getCRDocumentData/${filename}`;

    }

    viewAdvanceDetail(event) {
        fetch(main_url + "allowance/getTrainingViewData/" + event)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {

                    this.setState({
                        isAddNew: false,
                        advancedInfoView: res
                    })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
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
        return (
            < div className="row wrapper border-bottom white-bg" >
                {
                    this.state.isAddNew ? (
                        <div className="margin-top-20">

                            <div className="row" style={{ marginLeft: 0 }}>

                                <h4>Advanced Information</h4>
                                <div className="ibox float-e-margins">
                                    <div className="ibox-content p-md" style={{ float: 'left', backgroundColor: 'darkgrey' }}>
                                        <div className="col-md-2">
                                            <label>Advance Form No</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                disabled
                                                value={this.state.advanceData.form_no}

                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label>User</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                disabled
                                                value={this.state.advanceData.user_id}

                                            />
                                        </div>
                                        <div className="col-md-3" style={{ width: '19%' }}>
                                            <label>Start Date</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                disabled
                                                value={moment(this.state.advanceData.start_date).format('DD-MM-YYYY h:mm a')}

                                            />

                                        </div>
                                        <div className="col-md-3" style={{ width: '19%' }}>
                                            <label>End Date</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                disabled
                                                value={moment(this.state.advanceData.end_date).format('DD-MM-YYYY h:mm a')}

                                            />
                                        </div>
                                        <div className="col-md-2" style={{ width: '14%' }}>
                                            <label>Training Type</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                disabled
                                                value={this.state.advanceData.training_type}

                                            />
                                        </div>
                                        <div className="col-md-2" style={{ width: '14%' }}>
                                            <label>Hour Per Day</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                disabled
                                                value={this.state.advanceData.hourPerDay}

                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label>Total Training Day</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                disabled
                                                value={this.state.advanceData.totalTrainingDay}

                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label>No Of Participant</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                disabled
                                                value={this.state.advanceData.noOfParticipant}

                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label>Total Participant</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                disabled
                                                value={this.state.advanceData.totalParticipant}

                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label>Total Instructor</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                disabled
                                                value={this.state.advanceData.totalInstructor}

                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <label>Total Training Cost</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                disabled
                                                value={this.state.advanceData.totalTrainingCost}

                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <div className="form-group">

                                                <div className="col-sm-10" style={{ marginTop: 20 }}>

                                                    <button className="btn btn-primary" onClick={this.viewAdvanceDetail.bind(this, this.state.advanceData.training_allowance_id)}><span>View More</span> </button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="row">
                                <div className="main-info">
                                    <div className="header-info col-sm-12">
                                        <h4>Actual Information</h4>
                                    </div>
                                    <div className="row body-info">
                                        <div className="col-md-12">
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <div><label className="col-sm-12" >No Of Participants<span className="text-danger">*</span></label></div>
                                                    <div className="col-sm-12">

                                                        <input
                                                            className="form-control input-md"
                                                            value={this.state.data.noOfParticipant}
                                                            disabled
                                                        />

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <div><label className="col-sm-12" >Total Number of Participants<span className="text-danger">*</span></label></div>
                                                    <div className="col-sm-10">

                                                        <input
                                                            className="form-control input-md"
                                                            disabled
                                                            value={this.state.data.totalParticipant}
                                                        />

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <div><label className="col-sm-12" >Number of Instructor<span className="text-danger">*</span></label></div>
                                                    <div className="col-sm-10">

                                                        <input
                                                            className="form-control input-md"
                                                            value={this.state.data.noOfInstructor}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-md-3">
                                                <div className="form-group">
                                                    <div><label className="col-sm-12" >Total Instructors<span className="text-danger">*</span></label></div>
                                                    <div className="col-sm-10">

                                                        <input
                                                            className="form-control input-md"
                                                            value={this.state.data.totalInstructor}
                                                            disabled
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row ">
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

                            <div className="row">
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
                                                                        <td>{data.amount * Number(this.state.data.noOfParticipant)}</td>

                                                                    </tr>
                                                                )
                                                            }
                                                            ))

                                                    }
                                                </tbody>
                                                <tfoot>
                                                    <tr>
                                                        <th></th>
                                                        <th style={{ textAlign: "right" }} colspan="1">Total Expense Amount:</th>
                                                        <td>{this.state.data.totalExpense}</td>
                                                    </tr>
                                                </tfoot>

                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="row col-md-12 margin-top-20">

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
                            <div className="row document-main">
                                {
                                    this.state.document.length > 0 ?
                                        <DocumentList title='Training Document' doc={this.state.document} path='training' />
                                        : ''
                                }
                            </div>

                            {
                                !Array.isArray(this.state.status_info) ?

                                    <div className="row approval-main margin-top-20">
                                        <ApprovalInformation status={this.state.status_info} />
                                    </div>
                                    : ''
                            }
                        </div>

                    ) :
                        (<TrainingAdvancedView data={this.state.advancedInfoView} goBack={this.props.goBack}></TrainingAdvancedView>)
                }



            </div >

        )
    }


}