import React, { Component } from 'react';
import Select from 'react-select';
import DocumentList from '../../Common/DocumentList';
import {
    getTrainingVenue, getUserId, getActionStatus, main_url, validate, havePermission,
    stopSaving, startSaving, calculationDate, isRequestedUser
} from '../../../utils/CommonFunction';
import 'react-toastify/dist/ReactToastify.min.css';
import { toast } from 'react-toastify';
import DatePicker from 'react-datetime';
import ApprovalForm from '../../Common/ApprovalForm';
const $ = require('jquery');
var form_validate = true;
var grandTotal = 0;
var avgCostPerPerson = 1;
export default class TrainingClaimRequestEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newData: {
                cost_title_id: '',
                costPerDay: 1,
                costFee: ''
            },
            newExpense: {
                expense_title: '',
                amount: 0
            },

            trainingType: [],
            trainingVenue: [],
            trainingRoom: [],
            costTitle: [],
            data: props.data.training[0],
            detail: props.data.detail,
            expense: props.data.expense,
            newDoc: [],
            document: props.data.doc,
            acceptedParticipant: 0,
            dataSource: [],
            updatedBy: getUserId("user_info"),
            is_main_role: havePermission(this.props.work_flow_status),
            status_title: ''
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    async componentDidMount() {
        this._getTrainingType();
        let trainingVenue = await getTrainingVenue();
        fetch(main_url + "allowance/getTrainingRoomByVenue/" + this.state.data.trainingVenueId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res.length > 0) {

                    this.setState({ trainingRoom: res, })


                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
        //  this._getCostTitle();
        $("#own-table").find(".container>div:first-child").empty();
        $("#own-table>.container").css({
            "min-width": "100% !important"
        })
        this.setState({
            trainingVenue: trainingVenue,

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

    approvalStatus = (text) => {
        this.setState({ status_title: text }, () => this.check())
    }

    getTrainingTypeId(id) {
        let type = this.state.trainingType;
        let result = [];
        for (let i = 0; i < type.length; i++) {

            if (id === type[i].value) {
                result = type[i];
                break;
            }
        }
        return result;
    }

    getCostTitleId(id) {
        let title = this.state.costTitle;
        let result = [];
        for (let i = 0; i < title.length; i++) {

            if (id === title[i].value) {
                result = title[i];
                break;
            }
        }
        return result;
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

    changeStartDate(value) {
        let data = this.state.data;
        data.start_date = value
        data.totalTrainingDay = calculationDate(value, data.end_date);
        data.totalParticipant = data.totalTrainingDay * data.noOfParticipant
        let dateDiff = calculationDate(new Date(), value);
        if (dateDiff > 1) {
            $('#reason').attr('disabled', true);
            data.reason = "";
        }
        else {
            $('#reason').attr('disabled', false);
            $('#reason').attr('class', 'form-control input-md checkValidate')
        }
        this.setState({
            data: data,

        })
    }

    changeEndDate(value) {
        let data = this.state.data;
        data.end_date = value
        data.totalTrainingDay = calculationDate(data.start_date, value);
        data.totalParticipant = data.totalTrainingDay * data.noOfParticipant
        this.setState({
            data: data,

        })
    }

    handleChangeTrainingType = (event) => {
        let data = this.state.data;
        data.training_type_id = event.value;
        data.maximum_participant = event.maximum_participant
        this.setState({
            data: data,

        })
    }

    getTrainingVenueId(id) {
        let type = this.state.trainingVenue;
        let result = [];
        for (let i = 0; i < type.length; i++) {

            if (id === type[i].value) {
                result = type[i];

                break;
            }
        }
        return result;
    }

    getTrainingRoomId(id) {

        let type = this.state.trainingRoom;

        let result = [];
        for (let i = 0; i < type.length; i++) {

            if (id === type[i].value) {
                result = type[i];
                break;
            }
        }
        return result;
    }

    handleChangeTrainingVenue = (event) => {

        let data = this.state.data;
        data.trainingVenueId = event.value;
        this.setState({
            data: data,
            trainingRoom: []
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
        let data = this.state.data;
        data.trainingRoomNoId = event.value;
        this.setState({
            data: data
        })
    }

    getRequestType() {
        var type = '';
        if (this.state.data.isClaim === 0) {
            type = 'Advanced'
        }
        else {
            type = "Claim"
        }
        return type
    }

    changeText = (e) => {
        let data = this.state.data;
        let detail = this.state.detail;
        let expense = this.state.expense;
        let cost = 1;
        let totalCost = 0;
        let expenseTotal = 0;

        let name = e.target.dataset.name;
        data[name] = e.target.value;
        if (name === 'noOfParticipant') {

            if (data.maximum_participant >= Number(e.target.value)) {
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

            for (var i = 0; i < detail.length; i++) {
                detail[i].amount = detail[i].costFee * data.totalParticipant *
                    (data.totalTrainingDay = calculationDate(data.start_date, data.end_date))
                totalCost += detail[i].amount;
            }
            // for (var i = 0; i < expense.length; i++) {

            //     expense[i].amount = Number(data.noOfParticipant) * Number(expense[i].costPerPerson) * Number(data.totalTrainingDay)
            //     expenseTotal += expense[i].amount;
            // }

            cost = Number(data.noOfParticipant) * Number(this.state.newData.costFee)
            data.totalTrainingCost = totalCost
            //  data.totalExpense = expenseTotal

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
            data.totalParticipant = Number(data.totalTrainingDay * Number(data.noOfParticipant))
        }
        if (name === 'noOfInstructor' || name === 'totalTrainingDay') {
            data.totalInstructor = Number(data.noOfInstructor * Number(data.totalTrainingDay))
        }

        this.setState({
            data: data,
            detail: detail,
            expense: expense,
            costPerDay: cost
        })
    }

    // changedCostTitle = (event) => {
    //     var data = this.state.newData
    //     let noOfParticipant = this.state.data.noOfParticipant
    //     let total = 1
    //     total = event.amount * noOfParticipant
    //     data.costPerDay = total;
    //     data.cost_title_id = event.value
    //     data.costFee = event.amount
    //     this.setState({
    //         newData: data
    //     }
    //     )
    // }

    changeExpenseData = (e) => {
        let data = this.state.data;
        let expense = this.state.newExpense;
        let name = e.target.dataset.name;
        expense[name] = e.target.value;

        // if (name === 'costPerPerson') {
        //     expense.amount = Number(data.totalTrainingDay) * Number(data.noOfParticipant) * Number(expense.costPerPerson)
        // }
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
            expense: array,

        })

    }

    check = () => {
        stopSaving();
        if (validate('check_form')) {
            var info = [this.state.data].map(v => ({ ...v,  status: v.status == 5 ? 0 : v.status }))[0];
            var grand = Number(this.state.data.totalTrainingCost) + Number(this.state.data.totalExpense);
            var avgCost = avgCostPerPerson.toFixed(2);

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

            var obj = document.querySelector("#dropCREditZone").files.length;
            for (var i = 0; i < obj; i++) {
                var imagedata = document.querySelector("#dropCREditZone").files[i];

                formdata.append('uploadfile', imagedata);
            }

            formdata.append('claim', JSON.stringify(info))
            formdata.append('user', JSON.stringify(this.state.updatedBy))
            formdata.append('claimDetail', JSON.stringify(this.state.detail))
            formdata.append('expense', JSON.stringify(this.state.expense))
            formdata.append('document', JSON.stringify(this.state.document))
            formdata.append('grandTotal', JSON.stringify(grand))
            formdata.append('avgCostPerPerson', JSON.stringify(avgCost))
            let status = 0;
            fetch(main_url + 'allowance/editTrainingClaimRequest/' + info.training_allowance_id, {
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

    // changeCostPerPerson = (index, value) => {
    //     let info = this.state.data;
    //     var total = 0
    //     let array = this.state.expense;
    //     let data = this.state.expense[index];
    //     let noOfParticipant = this.state.data.noOfParticipant
    //     let day = this.state.data.totalTrainingDay
    //     data.costPerPerson = value.target.value
    //     data.amount = value.target.value * noOfParticipant * day
    //     array[index] = data
    //     for (var i = 0; i < array.length; i++) {

    //         total += array[i].amount;
    //     }
    //     info.totalExpense = total
    //     this.setState({
    //         expense: array,
    //         data: info
    //     })
    // }

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
        if (validate("expense_check_form")) {
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
        else {
            form_validate = false;
        }
    }

    handlefileChanged(event) {

        event.preventDefault();

        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#dropCREditZone").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#dropCREditZone").files[i];
            newDoc.push(getfile)

        }

        this.setState({
            newDoc: newDoc,

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
                <div className="row" >

                    <div className="form-horizontal" name="demo-form" id="check_form">

                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12" >Request Type<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        value={this.getRequestType()}
                                        disabled
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <div><label className="col-sm-12" >Training Type<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <input
                                        placeholder="Please Choose Type"
                                        value={this.state.data.training_type}
                                        onChange={this.handleChangeTrainingType}
                                        options={this.state.trainingType}
                                        disabled
                                        className='form-control input-md'

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
                                        data-name='purpose'
                                        value={this.state.data.purpose}
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
                                        dateFormat='DD-MM-YYYY'
                                        value={new Date(this.state.data.start_date)}
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
                                        value={new Date(this.state.data.end_date)}
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
                                        value={this.state.data.reason}
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
                                        className="form-control input-md"
                                        type="number"
                                        min="1"
                                        data-name='totalTrainingDay'
                                        value={this.state.data.totalTrainingDay}
                                        placeholder="Enter total training day"
                                        onChange={this.changeText}
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
                                        type="number"
                                        min="1"
                                        data-name='hourPerDay'
                                        value={this.state.data.hourPerDay}
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
                                        value={this.state.data.totalHourTraining}

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
                                        value={this.getTrainingVenueId(this.state.data.trainingVenueId)}
                                        onChange={this.handleChangeTrainingVenue}
                                        options={this.state.trainingVenue}
                                        className='react-select-container'
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
                                        value={this.getTrainingRoomId(this.state.data.trainingRoomNoId)}
                                        onChange={this.handleChangeTrainingRoom}
                                        options={this.state.trainingRoom}
                                        className='react-select-container'
                                        classNamePrefix="react-select"

                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="form-group">

                                <div className="col-sm-10" style={{ marginTop: 20 }}>

                                    <button className="btn btn-primary" onClick={this.props.checkAvailableRoom.bind(this, this.state.data.trainingVenueId, this.state.data.trainingRoomNoId, this.state.data.start_date, this.state.data.end_date)}><span>Check Room Available</span> </button>

                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <div><label className="col-sm-12" >No Of Participants<span className="text-danger">*</span></label></div>
                                    <div className="col-sm-10">

                                        <input
                                            className="form-control input-md"
                                            type="number"
                                            min="1"
                                            data-name='noOfParticipant'
                                            // disabled={this.state.advancedData.acceptedParticipant < this.state.advancedData.noOfParticipant ? true : false}
                                            value={this.state.data.noOfParticipant}
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
                                            value={this.state.data.totalParticipant}
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
                        </div>

                        <div className="col-md-2">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Total Instructors<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control input-md"
                                        type="number"
                                        value={this.state.data.totalInstructor}
                                        disabled

                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
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
                            <div className="col-md-12" id="expense_check_form">
                                <div className="col-md-4">
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <div><label className="col-sm-12" >Expense Title<span className="text-danger">*</span></label></div>
                                        <div className="col-sm-10">
                                            <input
                                                className="form-control input-md checkValidate"
                                                data-name='expense_title'
                                                value={this.state.newExpense.expense_title}
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
                                                value={this.state.newExpense.amount}
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
                                    <div><label className="col-sm-12" >Total Expense Amount <span className="text-danger">*</span></label></div>
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

                                                            <td><input
                                                                className="form-control input-md"
                                                                data-name='amount'
                                                                value={data.amount}
                                                                placeholder="Enter Expense Amount"
                                                                onChange={this.changeExpenseAmount.bind(this, index)}
                                                                disabled={isRequestedUser(this.state.updatedBy, this.state.data.createdBy) ? true : false} />
                                                            </td>
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
                {
                    is_main_role ?
                        this.state.document.length > 0 ?
                            <div className="row col-md-12 document-main">
                                <input className="full_width hidden" type="file" id="dropTravelCREdit" ></input>

                                <DocumentList title='Training Document' doc={this.state.document} path="training" />
                            </div> : <input className="full_width hidden" type="file" id="dropTravelCREdit" ></input>
                        :
                        <div className="row margin-top-20">
                            <div className="col-md-12">
                                <div className="ownspacing"></div>
                                <h4>Training Document</h4>
                                <div className="col-md-12">
                                    <input type="file" className="dropZone" id="dropCREditZone" onChange={this.handlefileChanged.bind(this)} multiple /></div>

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
                                <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.data.status} work_flow={this.props.work_flow_status} />
                                :
                                <div className="col-md-12  btn-rightend">
                                    <div>
                                        {this.state.data.status == undefined || this.state.data.status == 5 ?
                                            <div>
                                                <button onClick={this.check.bind(this)} className="btn btn-primary" id="saving_button" type="button"><span>Confirm</span></button>
                                            </div>
                                            :
                                            ''
                                        }
                                    </div>
                                    {/* <button onClick={this.check.bind(this)} id="saving_button" className="btn btn-primary"><span>Confirm</span> </button> */}
                                </div>
                        }
                    </div>
                </div>
            </div >

        )
    }

}