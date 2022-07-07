import React, { Component } from 'react'
import { getBranch, stopSaving, startSaving, calculationDate } from '../../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import Select from 'react-select';
import moment from "moment";
import 'react-toastify/dist/ReactToastify.min.css';
import { toast } from 'react-toastify';
import { getUserId, validate, main_url } from '../../../utils/CommonFunction';
const $ = require('jquery');
var form_validate = true;

var grandTotal = 0;
var avgCostPerPerson = 1;

export default class TrainingAdvancedAddNew
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trainingType: [],
            costTitle: [],
            trainingVenue: [],
            trainingRoom: [],
            advancedData: {
                requestTypeId: props.data,
                user_id: getUserId("user_info"),
                trainingTypeID: '',
                purpose: '',
                reason: '',
                startDate: new Date(),
                endDate: new Date(),
                totalTrainingDay: 1,
                hourPerDay: 1,
                totalHourTraining: '',
                trainingVenueId: '',
                trainingRoomNoId: '',
                acceptedParticipant: '',
                noOfParticipant: 1,
                totalParticipant: 0,
                noOfInstructor: '',
                totalInstructor: 0,
                totalTrainingCost: 0,
                totalExpense: 0
            },
            expense: {
                expenseTitle: '',
                amount: 0,
            },
            dataSource: [],
            expenseDataSource: []
        }
    }

    changeExpenseData = (e) => {

        let expense = this.state.expense;
        let name = e.target.dataset.name;
        expense[name] = e.target.value;

        // if (name === 'costPerPerson') {
        //     expense.amount = Number(data.totalTrainingDay) * Number(data.noOfParticipant) * Number(expense.costPerPerson)
        // }

        this.setState({
            expense: expense
        })
    }

    changeText = (e) => {
        let data = this.state.advancedData;
        let detail = this.state.dataSource;
        let expense = this.state.expenseDataSource;
        let trainingCostDetail = this.state.advancedDetail
        let expenseTotal = 0;
        let costTotal = 0;
        let name = e.target.dataset.name;

        if (name === 'noOfParticipant') {
            // it validate maximum participant 
            if (data.acceptedParticipant >= Number(e.target.value)) {
                data[name] = e.target.value;
            }
            else {
                toast.error('No Of Participant is more than accepted Participant !', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
                data[name] = 1
            }
            for (var i = 0; i < detail.length; i++) {
                detail[i].amount = Number(data.totalParticipant) * Number(detail[i].cost) *
                    Number(data.totalTrainingDay = calculationDate(data.startDate, data.endDate))
                costTotal += detail[i].amount;
            }
            data.totalTrainingCost = costTotal

            // for (var i = 0; i < expense.length; i++) {


            //     expense[i].amount = Number(data.noOfParticipant) * Number(expense[i].costPerPerson) * Number(data.totalTrainingDay)
            //     expenseTotal += expense[i].amount;
            // }
            // data.totalExpense = expenseTotal

            // trainingCostDetail.costPerDay = Number(data.noOfParticipant) * Number(trainingCostDetail.cost)

        }
        else {
            data[name] = e.target.value;
        }

        if (name === 'totalTrainingDay' || name === 'hourPerDay') {
            data.totalHourTraining = Number(data.totalTrainingDay) * Number(data.hourPerDay)
            // for (var i = 0; i < expense.length; i++) {

            //     expense[i].amount = Number(data.noOfParticipant) * Number(expense[i].costPerPerson) * Number(data.totalTrainingDay)
            //     expenseTotal += expense[i].amount;
            // }
            // data.totalExpense = expenseTotal

        }
        if (name === 'noOfParticipant' || name === 'totalTrainingDay') {
            data.totalParticipant = Number(data.totalTrainingDay) * Number(data.noOfParticipant)
        }
        if (name === 'noOfInstructor' || name === 'totalTrainingDay') {
            data.totalInstructor = Number(data.noOfInstructor) * Number(data.totalTrainingDay)
        }
        this.setState({
            advancedData: data,
            dataSource: detail,
            expenseDataSource: expense,
            advancedDetail: trainingCostDetail
        })
    }

    check = () => {
        stopSaving();
        if (validate('check_form')) {
            this.props.addAdvancedTraining(this.state.dataSource, this.state.advancedData, this.state.expenseDataSource, grandTotal, avgCostPerPerson.toFixed(2))
        }
        else {
            startSaving();
            form_validate = false;
        }
    }

    handleExpenseRemove(e) {
        let newData = this.state.expenseDataSource;
        let advanced = this.state.advancedData;
        newData.splice(e, 1);
        let total = 0

        for (var i = 0; i < newData.length; i++) {

            total += Number(newData[i].amount);
        }
        advanced.totalExpense = total

        this.setState({
            expenseDataSource: newData,
            advancedData: advanced
        })
    }

    handleChangeTrainingVenue = (event) => {
        let data = this.state.advancedData
        data.trainingVenueId = event
        this.setState({
            advancedData: data
        })

        fetch(main_url + "allowance/getTrainingRoomByVenue/" + event.value)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res.length > 0) {

                    this.setState({ trainingRoom: res, })

                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }

    handleChangeTrainingRoom = (event) => {
        let data = this.state.advancedData
        data.trainingRoomNoId = event
        this.setState({
            advancedData: data
        })
    }

    handleChangeTrainingType = (event) => {

        let data = this.state.advancedData;
        let dataSource = this.state.dataSource;
        let total = 0;
        data.trainingTypeID = event;
        data.acceptedParticipant = event.maximum_participant;

        fetch(main_url + "allowance/getCostTitle/" + event.value)
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
                            amount: Number(data.totalParticipant) * Number(res[i].amount)
                        })
                        total += res[i].amount

                    }
                    data.totalTrainingCost = total

                    this.setState({ dataSource: dataSource, data: data })

                }
                else {
                    data.totalTrainingCost = 0
                    this.setState({ dataSource: [], data: data })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

        this.setState({
            advancedData: data,
            selectedTraining: event,
        }
        )

    }

    handleChangeCostTitle = (event) => {

        let noOfParticipant = this.state.advancedData.noOfParticipant
        let data = this.state.advancedDetail;
        let total = 1
        data.costTitleId = event.value;
        data.cost = event.amount;
        data.costTitle = event.label
        total = event.amount * noOfParticipant
        data.costPerDay = total

        this.setState({
            advancedDetail: data,
            selectedCostTitle: event
        }
        )
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    async componentDidMount() {
        let trainingVenue = await getBranch();
        this._getTrainingType();
        // this._getCostTitle();
        $("#own-table").find(".container>div:first-child").empty();
        $("#own-table>.container").css({
            "width": "400px !important"
        })
        this.setState({
            trainingVenue: trainingVenue
        })

    }

    _getTrainingType() {
        fetch(main_url + "allowance/getTrainingType")
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.setState({ trainingType: res })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    changeStartDate(value) {
        var formatToday = moment().format('DD-MM-YYYY');
        var formatStartDate = moment(value).format('DD-MM-YYYY');
        var todayTS = new Date(formatToday).getTime();
        var startDateTS = new Date(formatStartDate).getTime();
        if (startDateTS <= todayTS) {

            toast.error(' Training Date should be at least before one Day !', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }

        let data = this.state.advancedData;
        let total = 0;
        let dataSource = this.state.dataSource;
        data.startDate = value
        data.totalTrainingDay = calculationDate(value, data.endDate);
        data.totalParticipant = data.totalTrainingDay * data.noOfParticipant
        for (var i = 0; i < dataSource.length; i++) {
            dataSource[i].amount = dataSource[i].cost * data.totalParticipant;
            total += dataSource[i].amount
        }
        data.totalTrainingCost = total
        let dateDiff = calculationDate(new Date(), value);
        if (dateDiff > 1) {
            $('#reason').attr('disabled', true);
            data.reason = '';
        }
        else {
            $('#reason').attr('disabled', false);
            $('#reason').attr('class', 'form-control input-md checkValidate')
        }

        this.setState({
            advancedData: data,
            dataSource: dataSource
        })
    }

    changeEndDate(value) {

        let data = this.state.advancedData;
        let total = 0;
        let dataSource = this.state.dataSource;
        data.endDate = value
        data.totalTrainingDay = calculationDate(data.startDate, value);
        data.totalParticipant = data.totalTrainingDay * data.noOfParticipant
        for (var i = 0; i < dataSource.length; i++) {
            dataSource[i].amount = dataSource[i].cost * data.totalParticipant;
            total += dataSource[i].amount
        }
        data.totalTrainingCost = total
        this.setState({
            advancedData: data,
            dataSource: dataSource

        })
    }

    addData = (e) => {
        var data = this.state.dataSource;
        data.push(this.state.advancedDetail)
        this.setState({
            dataSource: data,
        })

        var advanced = this.state.advancedData
        var total = 0

        for (var i = 0; i < data.length; i++) {

            total += data[i].costPerDay;
        }
        advanced.totalTrainingCost = total
        this.setState({

            advancedData: advanced,
            advancedDetail: {
                costTitleId: '',
                costTitle: '',
                cost: '',
                costPerDay: ''
            },

        })
    }

    addExpenseData = (e) => {
        if (validate('expense_check_form')) {
            var data = this.state.expenseDataSource;
            data.push(this.state.expense)

            var advanced = this.state.advancedData
            var total = 0

            for (var i = 0; i < data.length; i++) {

                total += Number(data[i].amount) * Number(this.state.advancedData.noOfParticipant);
            }
            advanced.totalExpense = total

            this.setState({
                advancedData: advanced,
                expenseDataSource: data,
                expense: {
                    expenseTitle: '',
                    amount: 1
                }
            })
        } else {
            form_validate = false;
        }
    }

    render() {

        grandTotal = this.state.advancedData.totalTrainingCost + this.state.advancedData.totalExpense;
        avgCostPerPerson = (this.state.advancedData.totalTrainingCost + this.state.advancedData.totalExpense) / this.state.advancedData.noOfParticipant

        return (
            <div >
                <div id="check_form">
                    <div className="col-md-4">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <div><label className="col-sm-12" >Training Type<span className="text-danger">*</span></label></div>
                            <div className="col-sm-10">

                                <Select
                                    placeholder="Please Choose Type"
                                    value={this.state.trainingTypeID}
                                    onChange={this.handleChangeTrainingType}
                                    options={this.state.trainingType}
                                    className='react-select-container checkValidate'
                                    classNamePrefix="react-select"
                                />

                            </div>
                        </div>

                    </div>
                    <div className="col-md-4">
                        <div className="form-group" >
                            <div><label className="col-sm-12" >Purpose<span className="text-danger">*</span></label></div>
                            <div className="col-sm-10">

                                <input
                                    className="form-control input-md checkValidate"
                                    type="text"
                                    data-name='purpose'
                                    value={this.state.advancedData.purpose}
                                    placeholder="Enter Purpose"
                                    onChange={this.changeText}

                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <div><label className="col-sm-12" >Start Date Time<span className="text-danger">*</span></label></div>
                            <div className="col-sm-10">
                                <DatePicker
                                    dateFormat='DD/MM/YYYY'
                                    value={this.state.advancedData.startDate}
                                    onChange={this.changeStartDate.bind(this)}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <div><label className="col-sm-12" >End Date Time<span className="text-danger">*</span></label></div>
                            <div className="col-sm-10">
                                <DatePicker
                                    dateFormat='DD-MM-YYYY'
                                    value={this.state.advancedData.endDate}
                                    onChange={this.changeEndDate.bind(this)}

                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <div><label className="col-sm-12" >Reason</label></div>
                            <div className="col-sm-10">

                                <input id="reason"
                                    className="form-control input-md"
                                    type="text"
                                    data-name='reason'
                                    value={this.state.advancedData.reason}
                                    placeholder="Enter Reason"
                                    onChange={this.changeText}

                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <div><label className="col-sm-12" >Total Training Day<span className="text-danger">*</span></label></div>
                            <div className="col-sm-10">

                                <input
                                    className="form-control input-md checkValidate"
                                    type="number"
                                    min="0.5"
                                    data-name='totalTrainingDay'
                                    value={this.state.advancedData.totalTrainingDay}
                                    placeholder="Enter total training day"
                                    onChange={this.changeText}

                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">
                            <div><label className="col-sm-12" >Hour Per Day<span className="text-danger">*</span></label></div>
                            <div className="col-sm-10">

                                <input
                                    className="form-control input-md checkValidate"
                                    type="number"
                                    min="1"
                                    data-name='hourPerDay'
                                    value={this.state.advancedData.hourPerDay}
                                    placeholder="Enter Hour Per Day"
                                    onChange={this.changeText}

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
                                    min="0"
                                    disabled
                                    value={this.state.advancedData.totalHourTraining}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <div><label className="col-sm-12" >Training Venue<span className="text-danger">*</span></label></div>
                            <div className="col-sm-10">

                                <Select
                                    placeholder="Please Choose Type"
                                    value={this.state.trainingVenueId}
                                    onChange={this.handleChangeTrainingVenue}
                                    options={this.state.trainingVenue}
                                    className='react-select-container  checkValidate'
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <div><label className="col-sm-12" >Training Room No<span className="text-danger">*</span></label></div>
                            <div className="col-sm-10">

                                <Select
                                    placeholder="Please Choose Type"
                                    value={this.state.trainingRoomNoId}
                                    onChange={this.handleChangeTrainingRoom}
                                    options={this.state.trainingRoom}
                                    className='react-select-container  checkValidate'
                                    classNamePrefix="react-select"

                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">

                            <div className="col-sm-10" style={{ marginTop: 20 }}>

                                <button className="btn btn-primary" onClick={this.props.checkAvailableRoom.bind(this, this.state.advancedData.trainingVenueId.value, this.state.advancedData.trainingRoomNoId.value, this.state.advancedData.startDate, this.state.advancedData.endDate)}><span>Check Room Available</span></button>

                            </div>
                        </div>

                    </div>
                    <div className="col-md-4">
                        <div className="form-group">
                            <div><label className="col-sm-12" >No Of Participants<span className="text-danger">*</span></label></div>
                            <div className="col-sm-10">

                                <input
                                    className="form-control input-md checkValidate"
                                    type="number"
                                    min="1"
                                    data-name='noOfParticipant'
                                    disabled={this.state.advancedData.acceptedParticipant < this.state.advancedData.noOfParticipant ? true : false}
                                    value={this.state.advancedData.noOfParticipant}
                                    placeholder="Enter Number of Participants"
                                    onChange={this.changeText}

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
                                    disabled
                                    data-name='totalParticipant'
                                    value={this.state.advancedData.totalParticipant}
                                />

                            </div>
                        </div>
                    </div>

                    <div className="col-md-2">
                        <div className="form-group">
                            <div><label className="col-sm-12" >Number of Instructor<span className="text-danger">*</span></label></div>
                            <div className="col-sm-10">

                                <input
                                    className="form-control input-md checkValidate"
                                    type="number"
                                    min="1"
                                    data-name='noOfInstructor'
                                    value={this.state.advancedData.noOfInstructor}
                                    placeholder="Enter No"
                                    onChange={this.changeText}
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
                                    type="number"
                                    min="0"
                                    value={this.state.advancedData.totalInstructor}
                                    disabled
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row col-md-12 document-main">
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
                                            <td>{this.state.advancedData.totalTrainingCost}</td>
                                        </tr>
                                    </tfoot>

                                </table>

                            </div>

                        </div>

                    </div>
                </div>
                <div className="row col-md-12 document-main">
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
                                                type="text"
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
                                                value={this.state.advancedData.noOfParticipant}
                                                placeholder="Enter Number of Participants"
                                                disabled

                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="col-md-3">
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <div><label className="col-sm-12">Avg Cost Per Participant<span className="text-danger">*</span></label></div>
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
                                        <div><label className="col-sm-12" >Total Expense Amount<span className="text-danger">*</span></label></div>
                                        <div className="col-sm-10">

                                            <input
                                                className="form-control input-md"
                                                type="number"
                                                min="0"
                                                value={this.state.advancedData.totalExpense}
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
                                                this.state.expenseDataSource.length <= 0 ?

                                                    (<td colSpan="3" class="text-center">No data</td>

                                                    ) :
                                                    (this.state.expenseDataSource.map((data, index) => {
                                                        return (


                                                            <tr key={index}>
                                                                <td>{data.expenseTitle}</td>
                                                                <td>{data.amount}</td>
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
                                                <td>{this.state.advancedData.totalExpense}</td>
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

                </div>


                <div className="col-md-12 btn-rightend">
                    <button onClick={this.check.bind(this)} id="saving_button" className="btn btn-primary"><span>Confirm</span> </button>
                </div>

            </div>


        )
    }
}