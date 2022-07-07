import React, { Component } from 'react';
import 'react-toastify/dist/ReactToastify.min.css';
import { toast } from 'react-toastify';
import moment from "moment";
import DocumentList from '../../Common/DocumentList';
import TrainingAdvancedView from './TrainingAdvancedView';
import Rodal from 'rodal';
import ApprovalForm from '../../Common/ApprovalForm';
import {
    getUserId, main_url, validate, getMainRole, getActionStatus, havePermission,
    stopSaving, startSaving, calculationDate, isRequestedUser
} from '../../../utils/CommonFunction';
const $ = require('jquery');
var form_validate = true;
var grandTotal = 0;
var avgCostPerPerson = 1;

export default class TrainingAdvancedClaimAddNew
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advanceData: props.data.advance[0],
            isAddNew: true,
            visible: false,
            data: {
                updatedBy: getUserId("user_info"),
                advanceId: props.data.advance[0].training_allowance_id,
                start_date: props.data.advance[0].start_date,
                end_date: props.data.advance[0].end_date,
                purpose: props.data.advance[0].purpose,
                advancedGrandTotal: props.data.advance[0].grandTotal,
                training_type_id: props.data.advance[0].training_type_id,
                trainingRoomNoId: props.data.advance[0].trainingRoomNoId,
                trainingVenueId: props.data.advance[0].trainingVenueId,
                totalTrainingDay: props.data.advance[0].totalTrainingDay,
                totalHourTraining: props.data.advance[0].totalHourTraining,
                hourPerDay: props.data.advance[0].hourPerDay,
                user_id: props.data.advance[0].user_id,
                training_allowance_id: props.data.training[0].training_allowance_id,
                noOfInstructor: props.data.training[0].noOfInstructor,
                status: props.data.training[0].status,
                totalInstructor: props.data.training[0].totalInstructor,
                totalParticipant: props.data.training[0].totalParticipant,
                noOfParticipant: props.data.training[0].noOfParticipant,
                totalTrainingCost: props.data.training[0].totalTrainingCost,
                totalExpense: props.data.training[0].totalExpense,
                total_amount: props.data.advance[0].total_amount

            },
            detail: props.data.detail,
            expense: props.data.expense,
            newExpense: {
                expense_title: '',
                amount: 0,

            },
            is_main_role: havePermission(this.props.work_flow_status),
            status_title: '',

            fileArray: [],
            newDoc: [],
            document: props.data.doc,
            training: props.data.training,
            expense: props.data.expense,
        }

    }

    show() {
        this.setState({ visible: true });
    }

    hide() {
        this.setState({ visible: false });
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

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    componentDidMount() {

        $("#own-table").find(".container>div:first-child").empty();
        $("#own-table>.container").css({
            "min-width": "100% !important"
        })

    }

    approvalStatus = (text) => {
        this.setState({ status_title: text }, () => this.check())
    }

    check = (grandTotal) => {
        stopSaving();
        if (validate('check_form')) {
            var info = this.state.data;
            var detail = this.state.detail;
            var expense = this.state.expense;
            var doc = this.state.document;
            var grand = Number(this.state.data.totalTrainingCost) + Number(this.state.data.totalExpense);
            var avgCost = avgCostPerPerson.toFixed(2)

            var { status_title, is_main_role } = this.state;

            if (status_title !== '' && is_main_role) {
                var action = getActionStatus(status_title, this.state.data, this.state.updatedBy);
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

            const formdata = new FormData();

            var obj = document.querySelector("#ACFile").files.length;
            for (var i = 0; i < obj; i++) {
                var imagedata = document.querySelector("#ACFile").files[i];

                formdata.append('uploadfile', imagedata);
            }

            formdata.append('claim', JSON.stringify(info))
            formdata.append('claimDetail', JSON.stringify(detail))
            formdata.append('expense', JSON.stringify(expense))
            formdata.append('document', JSON.stringify(doc))
            formdata.append('grandTotal', JSON.stringify(grand))
            formdata.append('avgCostPerPerson', JSON.stringify(avgCost))
            let status = 0;
            fetch(main_url + 'allowance/editAdvanceClaimRequest/' + info.training_allowance_id, {
                method: "POST",
                body: formdata
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

    handlefileChanged(event) {

        event.preventDefault();

        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#ACFile").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#ACFile").files[i];
            newDoc.push(getfile)
        }
        this.setState({
            newDoc: newDoc
        })

    }

    changeText = (e) => {
        let data = this.state.data;
        let advanced = this.state.advanceData;
        let detail = this.state.detail;
        let expense = 0;
        let costTotal = 0;
        let name = e.target.dataset.name;
        data[name] = e.target.value;

        if (name === 'noOfParticipant') {

            data.totalParticipant = advanced.totalTrainingDay * data.noOfParticipant;
            for (var i = 0; i < detail.length; i++) {
                detail[i].amount = detail[i].costFee * data.totalParticipant *
                    (data.totalTrainingDay = calculationDate(data.start_date, data.end_date))
                costTotal += detail[i].amount;
            }
            for (var i = 0; i < this.state.expense.length; i++) {
                expense += this.state.expense[i].amount * data.noOfParticipant
            }

            data.totalTrainingCost = costTotal
            data.totalExpense = expense;
        }
        if (name === 'noOfInstructor') {
            data.totalInstructor = Number(data.noOfInstructor) * Number(Math.ceil(advanced.totalTrainingDay))
        }
        this.setState({
            data: data,
            detail: detail,
            expenseDataSource: expense,
        })
    }

    changeExpenseData = (e) => {

        let data = this.state.data;
        let expense = this.state.newExpense;
        let name = e.target.dataset.name;
        expense[name] = e.target.value;

        if (name === 'costPerPerson') {
            expense.amount = Number(data.totalTrainingDay) * Number(data.noOfParticipant) * Number(expense.costPerPerson)
        }
        this.setState({
            newExpense: expense
        })

    }

    handleChangeArrayCostTitle = (index, value) => {
        let info = this.state.data;
        var total = 0
        let array = this.state.detail;
        let data = this.state.detail[index];
        let noOfParticipant = this.state.data.noOfParticipant
        data.cost_title_id = value
        data.costPerDay = value.amount * noOfParticipant
        array[index] = data
        for (var i = 0; i < array.length; i++) {

            total += array[i].costPerDay;
        }
        info.totalTrainingCost = total
        this.setState({
            detail: array,
            data: info
        })
    }

    changeExpenseTitle = (index, value) => {

        let array = this.state.expense;
        let data = this.state.expense[index];

        data.expense_title = value.target.value
        array[index] = data

        this.setState({
            expense: array
        })

    }

    changeExpenseAmount = (index, value) => {

        let array = this.state.expense;
        let data = this.state.data;
        let expense = this.state.expense[index];
        let total = 0;
        expense.amount = value.target.value
        array[index] = expense
        for (var i = 0; i < array.length; i++) {

            total += Number(array[i].amount);
        }
        data.totalExpense = total;

        this.setState({
            expense: array,
            data: data

        })

    }

    addData = (e) => {
        var data = this.state.detail;
        data.push(this.state.newData)

        this.setState({
            detail: data
        })

        var info = this.state.data
        var total = 0

        for (var i = 0; i < data.length; i++) {

            total += data[i].costPerDay;
        }
        info.totalTrainingCost = total
        this.setState({
            data: info,
            newData: {
                cost_title_id: '',
                costPerDay: 1,
                costFee: ''
            }
        })
    }

    addExpenseData = (e) => {
        var data = this.state.expense;
        data.push(this.state.newExpense)

        this.setState({
            expense: data
        })

        var info = this.state.data
        var total = 0

        for (var i = 0; i < data.length; i++) {

            total += Number(data[i].amount) * Number(this.state.data.noOfParticipant);
        }
        info.totalExpense = total
        this.setState({
            data: info,
            newExpense: {
                expense_title: '',
                amount: 0
            }
        })
    }

    handleRemove(e) {

        let newData = this.state.detail;
        newData.splice(e, 1);
        this.setState({
            detail: newData
        })
    }

    handleExpenseRemove(e) {
        let newData = this.state.expense;
        let data = this.state.data;
        let total = 0;
        newData.splice(e, 1);

        for (var i = 0; i < newData.length; i++) {

            total += Number(newData[i].amount);
        }
        data.totalExpense = total
        this.setState({
            expense: newData,
            data: data
        })
    }

    removeOldDocument(index, event) {
        var array = this.state.document;
        array.splice(index, 1);
        this.setState({
            document: array
        })
    }

    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        array.splice(index, 1);
        this.setState({
            newDoc: array
        })
    }
    render() {
        let { is_main_role } = this.state;
        grandTotal = Number(this.state.data.totalTrainingCost) + Number(this.state.data.totalExpense);
        avgCostPerPerson = (Number(this.state.data.totalTrainingCost) + Number(this.state.data.totalExpense)) / Number(this.state.data.noOfParticipant)

        return (
            <div className="row wrapper border-bottom white-bg">
                {
                    this.state.isAddNew ? (
                        <div>

                            <Rodal visible={this.state.visible} onClose={this.hide.bind(this)}>
                                <h4>Fill Your Reason</h4>
                                <textarea
                                    className="form-control"
                                    style={{ marginTop: 30, height: '100px' }}
                                    type="text"
                                    onChange={this.changeText}
                                    value={this.state.data.expiredReason}

                                />
                                <div className="col-md-12 btn-rightend" style={{ marginTop: 20 }}>

                                    <button className="btn btn-primary" onClick={this.hide.bind(this)}><span>Confirm</span> </button>

                                </div>
                            </Rodal>

                            <div className="row margin-top-20">

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
                                                            className="form-control input-md checkValidate"
                                                            type="number"
                                                            min="1"
                                                            data-name='noOfParticipant'
                                                            value={this.state.data.noOfParticipant}
                                                            placeholder="Enter No of Participants"
                                                            onChange={this.changeText}

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
                                                            data-name='totalParticipant'
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
                                                            className="form-control input-md checkValidate"
                                                            type="number"
                                                            min="1"
                                                            data-name='noOfInstructor'
                                                            value={this.state.data.noOfInstructor}
                                                            placeholder="Enter No"
                                                            onChange={this.changeText}
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
                                                            type="number"
                                                            min="1"
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
                                                                        <td>{data.costFee}</td>
                                                                        <td>{data.amount}</td>

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
                                            <div className="col-md-3">
                                                <div className="form-group" style={{ marginBottom: 0 }}>
                                                    <div><label className="col-sm-12" >Expense Title<span className="text-danger">*</span></label></div>
                                                    <div className="col-sm-10">

                                                        <input
                                                            className="form-control input-md"
                                                            data-name='expense_title'
                                                            value={this.state.newExpense.expenseTitle}
                                                            placeholder="Enter Expense Title"
                                                            onChange={this.changeExpenseData}

                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-2">
                                                <div className="form-group" style={{ marginBottom: 0 }}>
                                                    <div><label className="col-sm-12" >No of Participants<span className="text-danger">*</span></label></div>
                                                    <div className="col-sm-10">

                                                        <input
                                                            className="form-control input-md"
                                                            data-name="noOfParticipant"
                                                            type="number"
                                                            min="1"
                                                            value={this.state.data.noOfParticipant}
                                                            placeholder="Enter Number of Participants"
                                                            disabled

                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-3">
                                                <div className="form-group" style={{ marginBottom: 0 }}>
                                                    <div><label className="col-sm-12" >Avg Cost Per Participant<span className="text-danger">*</span></label></div>
                                                    <div className="col-sm-10">

                                                        <input
                                                            className="form-control input-md"
                                                            data-name='amount'
                                                            type="number"
                                                            min="0"
                                                            value={this.state.newExpense.amount}
                                                            placeholder="Enter amount"
                                                            onChange={this.changeExpenseData}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-1">
                                                <div className="form-group">

                                                    <div className="col-sm-10" style={{ marginTop: 20 }}>

                                                        <button className="btn btn-primary" onClick={this.addExpenseData}><span>Add</span> </button>

                                                    </div>
                                                </div>
                                            </div>

                                            {/* <div className="col-md-3">
                                                <div className="form-group" style={{ marginBottom: 0 }}>
                                                    <div><label className="col-sm-12" >Total Expense Amount<span className="text-danger">*</span></label></div>
                                                    <div className="col-sm-10">

                                                        <input
                                                            className="form-control input-md"
                                                            type="number"
                                                            min="0"
                                                            value={this.state.data.totalExpense}
                                                            disabled
                                                        />

                                                    </div>
                                                </div>
                                            </div> */}
                                            <div className="col-md-12">
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>Expense Title</th>
                                                            <th>Amount</th>
                                                            <th>Action</th>

                                                        </tr>
                                                    </thead>
                                                    <tbody>

                                                        {
                                                            this.state.expense.length <= 0 ?

                                                                (<td colSpan="3" class="text-center">No data</td>) :
                                                                (this.state.expense.map((data, index) => {
                                                                    return (

                                                                        <tr key={index}>
                                                                            <td>
                                                                                <input
                                                                                    className="form-control input-md"
                                                                                    data-name='expenseTitle'
                                                                                    value={data.expense_title}
                                                                                    placeholder="Enter Expense Title"
                                                                                    onChange={this.changeExpenseTitle.bind(this, index)}

                                                                                />
                                                                            </td>
                                                                            <td> <input
                                                                                className="form-control input-md"
                                                                                data-name='amount'
                                                                                value={data.amount}
                                                                                placeholder="Enter Expense Amount"
                                                                                onChange={this.changeExpenseAmount.bind(this, index)}
                                                                                disabled={isRequestedUser(this.state.updatedBy, this.state.data.createdBy) ? true : false}

                                                                            /></td>

                                                                            <td><button className="btn btn-primary btn-sm" onClick={this.handleExpenseRemove.bind(this, index)}>Remove</button></td>
                                                                        </tr>
                                                                    )
                                                                }
                                                                ))
                                                        }
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <th style={{ textAlign: "right" }} colspan="0">Total Expense Amount:</th>
                                                            <td>{this.state.data.totalExpense}</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row col-md-12 margin-top-20">

                                <div className="col-md-4" >
                                    <div><label className="col-sm-12" >Grand Total</label></div>
                                    <div className="col-sm-12">
                                        <input type="text" className="form-control" value={grandTotal}></input>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div><label className="col-sm-12" >Average Cost Per Participant</label></div>
                                    <div className="col-sm-12">
                                        <input type="text" className="form-control" value={(grandTotal / this.state.data.noOfParticipant).toFixed(2)}></input>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div><label className="col-sm-12" >Advanced Settle Amount</label></div>
                                    <div className="col-sm-12">
                                        <input type="text" className="form-control" value={(grandTotal - this.state.data.advancedGrandTotal).toFixed(2)}></input>
                                    </div>
                                </div>
                            </div>
                            {
                                is_main_role ?
                                    this.state.document.length > 0 ?
                                        <div className="row col-md-12 document-main">
                                            <input className="full_width hidden" type="file" id="ACFile" ></input>

                                            <DocumentList title='Training Document' doc={this.state.document} path="training" />
                                        </div> : <input className="full_width hidden" type="file" id="ACFile" ></input>
                                    :
                                    <div className="row col-md-12 margin-top-20" >
                                        <h4>Training Document</h4>
                                        <div className="col-md-12">
                                            <input type="file" className="dropZone" id="ACFile" onChange={this.handlefileChanged.bind(this)} multiple />

                                            <div className="ibox float-e-margins">
                                                <div className="p-md col-md-12" style={{ float: 'left', }}>

                                                    {this.state.document.map((data, index) =>
                                                        <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">
                                                            <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                                <div className="columns"><div className="column-thumbnail">
                                                                    <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                                                        <div className="fileuploader-item-icon" style={{ backgroundColor: '#3f4fd3' }}><i>{data.name.split(".")[1]}</i>
                                                                        </div></div><span className="fileuploader-action-popup"></span></div>
                                                                    <div className="column-title">
                                                                        <span className="own-text">
                                                                            {data.name.split("&@")[1]}</span></div>
                                                                    <div className="column-actions">
                                                                        <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeOldDocument(index, event)}> <i></i></a>
                                                                    </div></div></li></ul>

                                                        </div>
                                                    )

                                                    }

                                                    {this.state.newDoc.map((data, index) =>

                                                        <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">

                                                            <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                                <div className="columns"><div className="column-thumbnail">
                                                                    <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                                                        <div className="fileuploader-item-icon" style={{ backgroundColor: '#3f4fd3' }}><i>{data.name.split(".")[1]}</i>
                                                                        </div></div><span className="fileuploader-action-popup"></span></div>
                                                                    <div className="column-title">
                                                                        <span className="own-text">
                                                                            {data.name}</span></div>
                                                                    <div className="column-actions">
                                                                        <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeNewDocument(index, event)}> <i></i></a>
                                                                    </div></div></li></ul>

                                                        </div>
                                                    )

                                                    }

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                            }
                            <div className="row save-btn ">
                                <div className="margin-top-20">
                                    {
                                        is_main_role ?
                                            <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.data.status} work_flow={this.props.work_flow_status} total_amount={this.state.data.total_amount} />
                                            :
                                            <div className="col-md-12 btn-rightend">
                                                <button onClick={this.check.bind(this)} id="saving_button" className="btn btn-primary"><span>Confirm</span> </button>
                                            </div>
                                    }
                                </div>
                            </div>
                        </div>

                    ) :
                        (<TrainingAdvancedView data={this.state.advancedInfoView} goBack={this.props.goBack}></TrainingAdvancedView>)
                }
            </div>
        )
    }
}