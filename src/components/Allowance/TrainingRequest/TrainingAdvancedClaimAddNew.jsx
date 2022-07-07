import React, { Component } from 'react'
import 'react-toastify/dist/ReactToastify.min.css';
import { toast } from 'react-toastify';
import TrainingAdvancedView from './TrainingAdvancedView';
import moment from "moment";
import Rodal from 'rodal';
import { main_url, validate, stopSaving, startSaving, calculationDate } from '../../../utils/CommonFunction';
// include styles
import 'rodal/lib/rodal.css';
var form_validate = true;
var grandTotal = 0;
var avgCostPerPerson = 1;

export default class TrainingAdvancedClaimAddNew
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advancedInfoView: [],
            isAddNew: true,
            visible: false,
            advanceData: props.data.advance[0],
            data: {
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
                noOfInstructor: props.data.advance[0].noOfInstructor,
                totalInstructor: props.data.advance[0].totalInstructor,
                totalParticipant: props.data.advance[0].totalParticipant,
                noOfParticipant: props.data.advance[0].noOfParticipant,
                expiredReason: props.data.advance[0].reason,
                totalTrainingCost: props.data.advance[0].totalTrainingCost,
                totalExpense: props.data.advance[0].totalExpense,
                total_amount: props.data.advance[0].total_amount
            },
            fileArray: [],
            dataSource: [],
            expense: props.data.expense,
        }

    }

    show() {
        this.setState({ visible: true });
    }

    hide() {
        this.setState({ visible: false });
    }

    check = () => {
        stopSaving();
        if (validate('check_form')) {
            this.props.addTrainingAdvancedClaim(this.state.data, this.state.dataSource, this.state.expense, grandTotal, grandTotal / this.state.data.noOfParticipant)

        }
        else {
            startSaving();
            form_validate = false;
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    componentDidMount() {
        let data = this.state.data;
        let total = 0;
        let expense = 0;
        let dataSource = this.state.dataSource;
        let noOfParticipant = this.props.data.advance[0].noOfParticipant;
        fetch(main_url + "allowance/getCostTitle/" + this.props.data.advance[0].training_type_id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res.length > 0) {
                    dataSource = []
                    for (var i = 0; i < res.length; i++) {

                        dataSource.push({
                            costTitleId: res[i].value,
                            costTitle: res[i].label,
                            cost: res[i].amount,
                            amount: Number(this.props.data.advance[0].totalParticipant) * Number(res[i].amount)
                        })
                        //total += res[i].amount
                        total += dataSource[i].amount
                    }
                    for (var i = 0; i < this.state.expense.length; i++) {
                        expense += this.state.expense[i].amount * noOfParticipant
                    }
                    data.totalTrainingCost = total;
                    data.totalExpense = expense;

                    this.setState({ dataSource: dataSource, data: data })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

        var today = new Date();
        var endDate = new Date(this.props.data.advance[0].end_date)
        var formatToday = moment(today, 'DD-MM-YYYY');
        var formatendDate = moment(endDate, 'DD-MM-YYYY');

        var days = formatToday.diff(formatendDate, 'days');

        if (days > 5) {

            toast.error(' Training Date is more than 5 Days !', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
            this.setState({
                visible: true
            })
        }

    }

    addExpenseData = (e) => {
        if (validate("expense_check_form")) {
            let expense = this.state.expense;
            expense.push(this.state.expense)

            var total = 0
            let data = this.state.data;

            for (var i = 0; i < expense.length; i++) {

                total += Number(expense[i].amount) * Number(this.state.data.noOfParticipant);
            }
            data.totalExpense = total

            this.setState({
                data: data,
                expense: expense,
                expense: {
                    expense_title: '',
                    amount: 0
                }
            })
        } else {
            form_validate = false;

        }
    }

    // _getCostTitle() {
    //     fetch(main_url + "allowance/getCostTitle")
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {

    //             if (res) {
    //                 this.setState({ costTitle: res })

    //             }
    //         })
    //         .catch(error => console.error(`Fetch Error =\n`, error));
    // }

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

    changeExpenseData = (e) => {
        let expense = this.state.expense;
        expense.expense_title = e.target.value;

        this.setState({
            expense: expense
        })
    }

    handleExpenseTitle = (event) => {
        let expense = this.state.expense;
        expense.expense_title = event.target.value;

        this.setState({
            expense: expense
        })
    }

    handleExpenseAmount = (event) => {

        let expense = this.state.expense;
        expense.amount = event.target.value;

        this.setState({
            expense: expense
        })
    }

    changeExpenseTitle = (index, value) => {

        let array = this.state.expense;
        let data = this.state.expense[index];

        data.expense_title = value.target.value
        array[index] = data

        this.setState({
            expense: array,

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

    handlefileChanged(event) {

        event.preventDefault();

        let arr = [];
        let url = [];
        for (let i = 0; i < event.target.files.length; i++) {
            let reader = new FileReader();
            let getfile = event.target.files[i];
            reader.onloadend = (r) => {
                url.push(r.target.result);
            }
            reader.readAsDataURL(getfile);
            arr.push(getfile);
        }

        this.setState({
            fileArray: arr
        })

    }

    changeText = (e) => {
        let data = this.state.data;
        // let advanced = this.state.data;
        let dataSource = this.state.dataSource;
        let expense = 0;
        let costTotal = 0;
        let name = e.target.dataset.name;
        data[name] = e.target.value;
        if (name === 'noOfParticipant') {

            data.totalParticipant = data.totalTrainingDay * data.noOfParticipant;
            for (var i = 0; i < dataSource.length; i++) {
                dataSource[i].amount = Number(data.totalParticipant) * Number(dataSource[i].cost) *
                    Number(data.totalTrainingDay)
                costTotal += dataSource[i].amount;

            }
            for (var i = 0; i < this.state.expense.length; i++) {
                expense += this.state.expense[i].amount * data.noOfParticipant
            }

            data.totalTrainingCost = costTotal
            data.totalExpense = expense
        }
        if (name === 'noOfInstructor') {
            data.totalInstructor = Number(data.noOfInstructor) * Number(data.totalTrainingDay)
        }


        this.setState({
            data: data,
            dataSource: dataSource,
        })
    }


    addData = (e) => {
        var data = this.state.dataSource;
        data.push(this.state.claimDetail)
        this.setState({
            dataSource: data,
        })

        var info = this.state.data
        var total = 0

        for (var i = 0; i < data.length; i++) {

            total += data[i].costPerDay;
        }
        info.totalTrainingCost = total
        this.setState({
            data: info,
            detail: {
                costTitleId: '',
                costTitle: '',
                cost: '',
                costPerDay: ''
            },
            selectedCostTitle: ''

        })
    }


    handleRemove(e) {
        let newData = this.state.dataSource;
        newData.splice(e, 1);
        this.setState({
            dataSource: newData
        })
    }

    render() {
        // grandTotal = this.state.data.totalTrainingCost + this.state.data.totalExpense;
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
                                                            min="0"
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
                                                        this.state.dataSource.length <= 0 ?

                                                            (<td colSpan="3" class="text-center">No data</td>) :
                                                            (this.state.dataSource.map((data, index) => {
                                                                return (


                                                                    <tr key={index}>
                                                                        <td>{data.costTitle}</td>
                                                                        <td>{data.cost}</td>
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
                                        <div className="col-md-12" id="expense_check_form">
                                            <div className="col-md-4">
                                                <div className="form-group" style={{ marginBottom: 0 }}>
                                                    <div><label className="col-sm-12" >Expense Title<span className="text-danger">*</span></label></div>
                                                    <div className="col-sm-10">

                                                        <input
                                                            className="form-control input-md checkValidate"
                                                            data-name='expenseTitle'
                                                            value={this.state.expense.expenseTitle}
                                                            placeholder="Enter Expense Title"
                                                            onChange={this.changeExpenseData}

                                                        />

                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-md-4">
                                                <div className="form-group" style={{ marginBottom: 0 }}>
                                                    <div><label className="col-sm-12" >No of Participants<span className="text-danger">*</span></label></div>
                                                    <div className="col-sm-10">

                                                        <input
                                                            className="form-control input-md checkValidate"
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
                                                            className="form-control input-md checkValidate"
                                                            data-name='amount'
                                                            type="number"
                                                            min="0"
                                                            value={this.state.expense.amount}
                                                            placeholder="Enter Amount"
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
                                                    <div><label className="col-sm-12">Total Expense Amount<span className="text-danger">*</span></label></div>
                                                    <div className="col-sm-10">

                                                        <input
                                                            className="form-control input-md"
                                                            type="number"
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
                                                                                    data-name='expense_title'
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
                                        <input type="text" className="form-control" value={avgCostPerPerson}></input>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div><label className="col-sm-12" >Advanced Settle Amount</label></div>
                                    <div className="col-sm-12">
                                        <input type="text" className="form-control" value={grandTotal - this.state.advanceData.grandTotal}></input>
                                    </div>
                                </div>
                            </div>
                            <div className="row col-md-12 margin-top-20" >
                                <input type="file" className="dropZone" id="advClaimDropZone" onChange={this.handlefileChanged.bind(this)} multiple />
                            </div>
                            <div className="row col-md-12 margin-top-20">
                                <div className="btn-rightend ">
                                    <button onClick={this.check.bind(this)} className="btn btn-primary"><span>Confirm</span> </button>
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