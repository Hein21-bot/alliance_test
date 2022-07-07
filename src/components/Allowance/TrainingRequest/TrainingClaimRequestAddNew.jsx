import React, { Component } from 'react'
import DatePicker from 'react-datetime';
import Select from 'react-select';
import moment from "moment";
import $ from 'jquery';
import { getTrainingVenue, getUserId, main_url, validate, stopSaving, startSaving, calculationDate } from '../../../utils/CommonFunction';
import 'react-toastify/dist/ReactToastify.min.css';
import { toast } from 'react-toastify';

var grandTotal = 0;
var avgCostPerPerson = 1;
var dayDiff = 0;
var form_validate = true;
export default class Training
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            trainingType: [],
            trainingVenue: [],
            trainingRoom: [],
            claimData: {
                user_id: getUserId("user_info"),
                requestTypeId: 2,
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
                amount: 0
            },
            fileArray: [],
            dataSource: [],
            expenseDataSource: [],
            attachment: [],
            newDoc: []

        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    changeExpenseData = (e) => {
        let data = this.state.claimData;
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

    changeTotalExpense = (e) => {
        let data = this.state.claimData;
        let name = e.target.dataset.name;
        let expense = this.state.expenseDataSource;
        let dataSource = this.state.dataSource;
        let claimDetail = this.state.claimDetail;

        if (name === 'noOfParticipant' || name === 'amount') {
            data.totalExpense = Number(data.noOfParticipant) * Number(data.amount)

        }
        this.setState({
            claimData: data,
            expenseDataSource: expense,
            dataSource: dataSource,
            claimDetail: claimDetail,

        })
    }

    changePurpose = (e) => {
        let data = this.state.claimData;
        let purpose = this.state.purpose;
        this.setState({
            purpose: purpose
        })
    }

    changeReason = (e) => {
        let data = this.state.claimData;
        let reason = this.state.reason;
        this.setState({
            reason: reason
        })

    }

    changeTotalTrainingDay = (e) => {
        let data = this.state.claimData;
        let totalTrainingDay = this.state.totalTrainingDay;
        this.setState({
            totalTrainingDay: totalTrainingDay,
            claimData: data
        })
    }

    changeNoOfParticipants = (e) => {
        let data = this.state.claimData;
        let dataSource = this.state.dataSource;
        let name = e.target.dataset.name;
        if (name === 'noOfParticipant') {

            if (data.acceptedParticipant >= Number(e.target.value)) {
                data[name] = e.target.value;
            }
            else {
                toast.error(' No Of Participant is more than accepted Participant !', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });

                data[name] = 1
            }
        }
        else {
            data[name] = e.target.value;
        }

        if (name === 'noOfParticipant') {
            data.totalParticipant = Number(data.totalTrainingDay) * Number(data.noOfParticipant)
        }
        this.setState({
            claimData: data,
            dataSource: dataSource,

        })

    }

    changeText = (e) => {
        let data = this.state.claimData;
        let dataSource = this.state.dataSource;
        let expense = this.state.expenseDataSource;
        let claimDetail = this.state.claimDetail;
        let expenseTotal = 0;
        let costTotal = 0;
        let name = e.target.dataset.name;

        // if(name === 'noOfParticipant' || name === 'amount'){
        //     data.totalExpense = Number(data.noOfParticipant) * Number(data.amount)

        // }

        if (name === 'noOfParticipant') {
            if (data.acceptedParticipant >= Number(e.target.value)) {
                data[name] = e.target.value;
            }
            else {
                toast.error(' No Of Participant is more than accepted Participant !', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });

                data[name] = 1
            }
            for (var i = 0; i < dataSource.length; i++) {
                dataSource[i].amount = Number(data.totalParticipant) * Number(dataSource[i].cost) *
                    Number(data.totalTrainingDay = calculationDate(data.startDate, data.endDate))
                costTotal += dataSource[i].amount;
            }
            data.totalTrainingCost = costTotal;
            // for (var i = 0; i < expense.length; i++) {

            //     expense[i].amount = Number(data.noOfParticipant) * Number(expense[i].costPerPerson) * Number(data.totalTrainingDay)
            //     expenseTotal += expense[i].amount;
            // }

            //  data.totalExpense = expenseTotal;
            // claimDetail.costPerDay = Number(data.noOfParticipant) * Number(claimDetail.cost)

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
        // data.purpose = changeReason(e);
        this.setState({
            claimData: data,
            expenseDataSource: expense,
            dataSource: dataSource,
            claimDetail: claimDetail,

        })
    }

    check = () => {
        stopSaving();
        if (validate('check_form')) {
            this.props.addClaimRequest(this.state.dataSource, this.state.claimData, this.state.expenseDataSource, this.state.fileArray, grandTotal, avgCostPerPerson)
        }
        else {
            startSaving();
            form_validate = false;
        }
    }

    handleRemove(e) {
        let newData = this.state.dataSource;
        newData.splice(e, 1);
        this.setState({
            dataSource: newData
        })
    }

    handleExpenseRemove(e) {
        let newData = this.state.expenseDataSource;
        let claim = this.state.claimData;
        newData.splice(e, 1);
        let total = 0;

        for (var i = 0; i < newData.length; i++) {

            total += Number(newData[i].amount);
        }
        claim.totalExpense = total
        this.setState({
            expenseDataSource: newData,
            claimData: claim
        })
    }

    handleChangeTrainingType = (event) => {

        let data = this.state.claimData;
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
                    this.setState({ dataSource: dataSource, })
                }
                else {
                    data.totalTrainingCost = 0
                    this.setState({ dataSource: [] })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

        this.setState({
            claimData: data,
            selectedTraining: event,
        })

    }

    handleChangeCostTitle = (event) => {

        let noOfParticipant = this.state.claimData.noOfParticipant
        let data = this.state.claimDetail;
        let total = 1
        data.costTitleId = event.value;
        data.cost = event.amount;
        data.costTitle = event.label
        total = event.amount * noOfParticipant
        data.costPerDay = total

        this.setState({
            claimDetail: data,
            selectedCostTitle: event
        }
        )

    }

    handlefileChanged(event) {
        var files = event.target.files;
        event.preventDefault();
        var attachment = [];

        let arr = [];
        let url = [];
        for (let i = 0; i < event.target.files.length; i++) {
            attachment.push(files[i])
            let reader = new FileReader();
            let getfile = event.target.files[i];
            reader.onloadend = (r) => {
                url.push(r.target.result);
            }
            reader.readAsDataURL(getfile);
            arr.push(getfile);
        }
        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#CRDropzone").files.length;
        for (var j = 0; j < obj; j++) {
            var getfile = document.querySelector("#CRDropzone").files[j];
            newDoc.push(getfile)
        }

        this.setState({
            fileArray: arr
        })
    }

    async componentDidMount() {
        let trainingVenue = await getTrainingVenue();
        this._getTrainingType();
        this.setState({
            trainingVenue: trainingVenue
        })
    }

    handleChangeTrainingVenue = (event) => {
        let data = this.state.claimData
        data.trainingVenueId = event
        this.setState({
            claimData: data
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
        let data = this.state.claimData
        data.trainingRoomNoId = event
        this.setState({
            claimData: data
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

    changeStartDate(event) {

        let data = this.state.claimData;
        let total = 0;
        let dataSource = this.state.dataSource;
        data.startDate = event;
        data.totalTrainingDay = calculationDate(event, data.endDate);
        data.totalParticipant = data.totalTrainingDay * data.noOfParticipant
        for (var i = 0; i < dataSource.length; i++) {
            dataSource[i].amount = dataSource[i].cost * data.totalParticipant;
            total += dataSource[i].amount
        }
        data.totalTrainingCost = total
        let dateDiff = calculationDate(new Date(), event);
        if (dateDiff > 1) {
            $('#reason').attr('disabled', true);
            data.reason = '';
        }
        else {
            $('#reason').attr('disabled', false);
            $('#reason').attr('class', 'form-control input-md checkValidate')
        }
        this.setState({
            claimData: data,
            dataSource: dataSource
        })

    }

    changeEndDate(value) {

        let data = this.state.claimData;
        let dataSource = this.state.dataSource;
        var today = new Date();
        var endDate = new Date(value)
        let total = 0;
        var formatToday = moment(today, 'DD-MM-YYYY');
        var formatendDate = moment(endDate, 'DD-MM-YYYY');
        var days = formatToday.diff(formatendDate, 'days');

        if (days > 5) {
            toast.error(' Training Request Date is more than 5 Days !', {
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
        data.endDate = value
        data.totalTrainingDay = calculationDate(data.startDate, value);
        data.totalParticipant = data.totalTrainingDay * data.noOfParticipant
        for (var i = 0; i < dataSource.length; i++) {
            dataSource[i].amount = dataSource[i].cost * data.totalParticipant;
            total += dataSource[i].amount
        }
        data.totalTrainingCost = total
        this.setState({
            claimData: data,
            dataSource: dataSource
        })
    }

    addData = (e) => {
        var data = this.state.dataSource;
        data.push(this.state.claimDetail)
        this.setState({
            dataSource: data,
        })

        var claim = this.state.claimData
        var total = 0

        for (var i = 0; i < data.length; i++) {

            total += data[i].costPerDay;
        }
        claim.totalTrainingCost = total
        this.setState({

            claimData: claim,
            claimDetail: {
                costTitleId: '',
                costTitle: '',
                cost: '',
                costPerDay: ''
            },

        })
    }
    //@kpk
    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        array.splice(index, 1);
        this.setState({
            newDoc: array
        })
    }

    addExpenseData = (e) => {
        if (validate("expense_check_form")) {
            var data = this.state.expenseDataSource;
            data.push(this.state.expense);

            var claim = this.state.claimData
            var total = 0
            // this.setState({
            //     expenseDataSource: data,
            // })

            for (var i = 0; i < data.length; i++) {

                total += Number(data[i].amount) * Number(this.state.claimData.noOfParticipant);
            }
            claim.totalExpense = total
            this.setState({

                claimData: claim,
                expense: {
                    expenseTitle: '',
                    costPerPerson: 0,
                    amount: 0
                }
            })
        } else {
            form_validate = false;
        }
    }

    render() {

        grandTotal = Number(this.state.claimData.totalTrainingCost) + Number(this.state.claimData.totalExpense);
        avgCostPerPerson = (Number(this.state.claimData.totalTrainingCost) + Number(this.state.claimData.totalExpense)) / Number(this.state.claimData.noOfParticipant)

        return (
            <div>
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
                                    value={this.state.purpose}
                                    placeholder="Enter Purpose"
                                    onChange={this.changePurpose}

                                />

                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">
                            <div><label className="col-sm-12" >Start Date Time<span className="text-danger">*</span></label></div>
                            <div className="col-sm-10">
                                <DatePicker
                                    dateFormat='DD-MM-YYYY'
                                    value={this.state.claimData.startDate}
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
                                    value={this.state.claimData.endDate}
                                    onChange={this.changeEndDate.bind(this)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">
                            <div><label className="col-sm-12" >Reason<span className="text-danger">*</span></label></div>
                            <div className="col-sm-10">

                                <input id="reason"
                                    className="form-control input-md"
                                    type="text"
                                    data-name='reason'
                                    value={this.state.reason}
                                    placeholder="Enter Reason"
                                    onChange={this.changeReason}

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
                                    value={this.state.claimData.totalTrainingDay}
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
                                    min="0.5"
                                    data-name='hourPerDay'
                                    value={this.state.claimData.hourPerDay}
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
                                    disabled
                                    value={this.state.claimData.totalHourTraining}

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
                                    className='react-select-container checkValidate'
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
                                    className='react-select-container checkValidate'
                                    classNamePrefix="react-select"

                                />
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="form-group">

                            <div className="col-sm-10" style={{ marginTop: 20 }}>

                                <button className="btn btn-primary" onClick={this.props.checkAvailableRoom.bind(this, this.state.claimData.trainingVenueId.value, this.state.claimData.trainingRoomNoId.value, this.state.claimData.startDate, this.state.claimData.endDate)}><span>Check Room Available</span> </button>

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
                                    disabled={this.state.claimData.acceptedParticipant < this.state.claimData.noOfParticipant ? true : false}
                                    value={this.state.claimData.noOfParticipant}
                                    placeholder="Enter Number of Participants"
                                    onChange={this.changeNoOfParticipants}

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
                                    value={this.state.claimData.totalParticipant}
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
                                    value={this.state.claimData.noOfInstructor}
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
                                    value={this.state.claimData.totalInstructor}
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
                                            <td>{this.state.claimData.totalTrainingCost}</td>
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
                                                className="form-control input-md"
                                                data-name="noOfParticipant"
                                                type="number"
                                                min="1"
                                                value={this.state.claimData.noOfParticipant}
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

                                {/* <div className="col-sm-10" id="expense_check_form">
                                    <div className="form-group" >
                                        <div><label className="col-sm-12">Total Expense Amount<span className="text-danger">*</span></label></div>
                                        <div className="col-sm-4" >

                                            <input
                                                className="form-control input-md"
                                                type="number"
                                                value={this.state.claimData.totalExpense}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div> */}
                            </div>
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

                                                (<td colSpan="3" class="text-center">No data</td>) :
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
                                            <td>{this.state.claimData.totalExpense}</td>
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
                <div className="row col-md-12 margin-top-20">
                    <div className="col-md-4" >
                        <input type="file" className="dropZone" id="CRDropzone" onChange={this.handlefileChanged.bind(this)} multiple />
                    </div>
                </div>
                <div>
                    {this.state.newDoc.map((data, index) =>

                        <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">

                            <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                <div className="columns"><div className="column-thumbnail">
                                    <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                        <div className="fileuploader-item-icon" style={{ backgroundColor: '#3f4fd3' }}><i>{data.name.split(".")[1]}</i>
                                        </div></div><span className="fileuploader-action-popup"></span></div>
                                    <div className="column-title">
                                        <span className="own-text">
                                            {data.name}
                                        </span></div>
                                    <div className="column-actions">
                                        <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeNewDocument(index, event)}> <i></i></a>
                                    </div></div></li></ul>
                        </div>
                    )
                    }
                </div>
                <div>
                    <div className="col-md-12 btn-rightend">
                        <button onClick={this.check.bind(this)} id="saving_button" className="btn btn-primary"><span>Confirm</span> </button>
                    </div>
                </div>
            </div>
        )
    }
}