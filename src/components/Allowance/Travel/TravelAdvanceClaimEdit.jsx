import React, { Component } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datetime';
import DocumentList from '../../Common/DocumentList';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import moment from 'moment';
import {
    getUserId, validate, getActionStatus,
    main_url, havePermissionForAmount, stopSaving, startSaving, fno, getBranch, isRequestedUser
} from '../../../utils/CommonFunction';
import ApprovalForm from '../../Common/ApprovalForm';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');
var form_validate = true;

export default class TravelAdvancedClaimEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advancedData: props.data.advancedData,
            claimDetailData: props.data.claimDetail,
            claimData: props.data.claimData,
            newDoc: [],
            branch: [],
            selected_location: [],
            document: props.data.document,
            updatedBy: getUserId("user_info"),
            is_main_role: havePermissionForAmount(this.props.work_flow_status, this.props.data.claimData[0].createdBy),
            status_title: '',
            comment: '',
            claimData1: {
                actual_date: new Date(),
                start_location: '',
                destination: '',
                start_time: new Date(),
                end_time: new Date(),
                noOfDays: 1,
                noOfNights: 0,
                meals: 0,
                lodging: 0,
                transport: 0,
                amount: 0,
                purpose: ''
            },
            data: {
                withdraw_location: 0,
                user_id: getUserId("user_info"),
                selectedRequest: '',
                actual_amount: 0,
                purpose: '',
                settle_amount: 0,
                // advancedNo: props.data[0].form_no,
                // advancedId: props.data[0].travel_allowance_id
            },
            toEdit: false
            // dataSource:[]
        }
    }

    // isRequestedUser() {
    //     if (this.state.updatedBy === this.state.claimData.createdBy) {
    //         return true;
    //     }
    //     else {
    //         return false;
    //     }
    // }

    async componentDidMount() {
        let branch = await getBranch();
        let selected_location = this.getSelectedLocation(branch, this.props.data.claimData[0].withdraw_location);
        this.showClaimData(this.state.claimDetailData);
        this.setState({
            branch: branch,
            selected_location: selected_location
        })
        var that = this;
        $('#claim-table').on('change', '#meal', function () {
            var index = $(this).next().text();
            var value = $(this).val();
            that.handleChangeMeal(index, value);
        })
        $('#claim-table').on('change', '#lodging', function () {
            var index = $(this).next().text();
            var value = $(this).val();
            that.handleChangelodging(index, value);
        })
        $('#claim-table').on('change', '#transport', function () {
            var index = $(this).next().text();
            var value = $(this).val();
            that.handleChangeTransport(index, value);
        })

        $(document).on('click', '#toRemove', function () {
            var data = $(this).find("#remove").text();
            data = $.parseJSON(data);
            var advanceData = $(this).find("#removeData").text();
            advanceData = $.parseJSON(advanceData);
            let newData = that.state.claimDetailData;
            newData.splice(data, 1);

            let claimData = that.state.data;
            var totalAmount = 0
            var settleAmount =0

            for (var i = 0; i < newData.length; i++) {

                totalAmount += newData[i].amount;
            }
            claimData.actual_amount = totalAmount;
            settleAmount =  advanceData-totalAmount
            claimData.settle_amount = settleAmount;
            that.setState({
                claimDetailData: newData,
                data: claimData
            }, () => that.showClaimData(newData))
        });
        $(document).on('click', '#toEdit', function () {
            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            let updateData = that.state.claimDetailData[data];
            that.setState({ toEdit: true, claimData1: updateData })
        });
    }

    changeactual_date(value) {
        let data = this.state.claimData1;
        data.actual_date = value
        this.setState({
            claimData1: data
        })
    }

    changePurpose1 = (e) => {
        let data = this.state.claimData1;
        data.purpose = e.target.value;
        this.setState({
            claimData1: data
        })
    }

    claimChangeText1 = (e) => {

        let data = this.state.claimData1;
        let name = e.target.dataset.name;
        data[name] = e.target.value;

        if (name === 'meals' || name === 'transport' || name === 'lodging') {
            data.amount = Number(data.meals) + Number(data.transport) + Number(data.lodging)

        }
        this.setState({
            claimData1: data
        })

    }
    changeStartTime1(value) {
        
        let data = this.state.claimData1;
        data.start_time = value
        this.setState({
            claimData1: data
        },()=>{
            console.log("start time ",this.state.claimData1)
        })

    }
    changeEndTime1(value) {
        let data = this.state.claimData1;
        data.end_time = value
        this.setState({
            claimData1: data
        })

    }

    getSelectedLocation(branch, location) {
        let selected = branch.filter(function (b) { return b.value === location })
        return selected;
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    changeActualDate(index, value) {
        var array = this.state.claimDetailData
        let data = this.state.claimDetailData[index];
        data.actual_date = value
        array[index] = data
        this.setState({
            claimDetailData: array
        })
    }
    changeStartTime(index, value) {
        var array = this.state.claimDetailData;
        let data = this.state.claimDetailData[index];
        data.start_time = value
        array[index] = data
        this.setState({
            claimDetailData: array
        })
    }
    changeEndTime(index, value) {
        var array = this.state.claimDetailData;
        let data = this.state.claimDetailData[index];
        data.end_time = value
        array[index] = data
        this.setState({
            claimDetailData: array
        })
    }

    changeWithdrawLocation = e => {
        let data = this.state.claimData;
        data[0].withdraw_location = e.value;
        this.setState({
            selected_location: e,
            claimData: data
        })
    }

    changePurpose(index, e) {
        let data = this.state.claimDetailData;
        data[index].purpose = e.target.value

        this.setState({
            claimDetailData: data
        })
    }

    handleChangeMeal(index, value) {
        var array = this.state.claimDetailData;
        var claimData = this.state.claimData;
        var advanced_amount = this.state.advancedData[0].advanced_amount;
        var totalAmount = 0
        let data = array[index]
        data.meals = value

        data.amount = Number(data.meals) + Number(data.transport) + Number(data.lodging)
        array[index] = data
        for (var i = 0; i < array.length; i++) {
            totalAmount += Number(array[i].amount);
        }
        claimData[0].actual_amount = totalAmount;
        claimData[0].settle_amount = advanced_amount - totalAmount;
        this.setState({
            claimDetailData: array,
            claimData: claimData
        }, () => this.showClaimData())
    }


    handleChangelodging(index, value) {
        var array = this.state.claimDetailData;
        var claimData = this.state.claimData;
        var advanced_amount = this.state.advancedData[0].advanced_amount;
        var totalAmount = 0
        let data = array[index]
        data.lodging = value

        data.amount = Number(data.meals) + Number(data.transport) + Number(data.lodging)
        array[index] = data
        for (var i = 0; i < array.length; i++) {
            totalAmount += Number(array[i].amount);
        }
        claimData[0].actual_amount = totalAmount;
        claimData[0].settle_amount =  advanced_amount - totalAmount;
        this.setState({
            claimDetailData: array,
            claimData: claimData
        }, () => this.showClaimData())
    }

    handleChangeTransport(index, value) {
        var array = this.state.claimDetailData;
        var claimData = this.state.claimData;
        var advanced_amount = this.state.advancedData[0].advanced_amount;
        var totalAmount = 0
        let data = array[index]
        data.transport = value

        data.amount = Number(data.meals) + Number(data.transport) + Number(data.lodging)
        array[index] = data
        for (var i = 0; i < array.length; i++) {
            totalAmount += Number(array[i].amount);
        }
        claimData[0].actual_amount = totalAmount;
        claimData[0].settle_amount =  advanced_amount - totalAmount;
        this.setState({
            claimDetailData: array,
            claimData: claimData
        }, () => this.showClaimData())
    }

    claimChangeText(index, value) {

        var totalAmount = 0
        var settleAmount = 0
        var array = this.state.claimDetailData
        var claimData = this.state.claimData
        var name = value.target.dataset.name
        let data = this.state.claimDetailData[index]
        data[name] = value.target.value

        if (name === 'meals' || name === 'transport' || name === 'lodging') {
            data.amount = Number(data.meals) + Number(data.transport) + Number(data.lodging)

        }
        array[index] = data

        for (var i = 0; i < array.length; i++) {

            totalAmount += Number(array[i].amount);
        }

        settleAmount = totalAmount - this.state.advancedData[0].advanced_amount

        claimData[0].actual_amount = totalAmount;
        claimData[0].settle_amount = settleAmount

        this.setState({
            claimDetailData: array,
            claimData: claimData
        })
    }

    check = () => {
        stopSaving();
        if (validate('check_form')) {
            var { status_title, is_main_role } = this.state;
            var info = this.state.claimData.map(v => ({
                ...v, status: v.status == 5 ? 0 : v.status, settle_amount: this.state.data.settle_amount == 0 ? this.state.claimData[0].settle_amount : this.state.data.settle_amount,
                total_amount: this.state.data.actual_amount == 0 ? this.state.claimData[0].actual_amount : this.state.data.actual_amount,
                actual_amount: this.state.data.actual_amount == 0 ? this.state.claimData[0].actual_amount : this.state.data.actual_amount
            }))[0]
            if (status_title !== '' && is_main_role) {
                var action = getActionStatus(status_title, this.state.claimData[0], this.state.updatedBy, this.state.comment);
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
                // info.total_amount = this.state.data.total_amount
                // info.settle_amount =  this.state.data.settle_amount
            }
            const formdata = new FormData();

            var obj = document.querySelector("#dropTravelACEdit").files.length;
            for (var i = 0; i < obj; i++) {
                var imagedata = document.querySelector("#dropTravelACEdit").files[i];

                formdata.append('uploadfile', imagedata);
            }
            formdata.append('claimData', JSON.stringify(info))
            formdata.append('document', JSON.stringify(this.state.document))
            formdata.append('claimDetail', JSON.stringify(this.state.claimDetailData))
            formdata.append('updatedBy', JSON.stringify(this.state.updatedBy))

            let status = 0;
            fetch(main_url + 'allowance/editAdvancedClaimTravelRequestAllowance/' + this.state.claimData[0].travel_allowance_id, {
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
        var obj = document.querySelector("#dropTravelACEdit").files.length;
        for (var i = 0; i < obj; i++) {
            var getfile = document.querySelector("#dropTravelACEdit").files[i];
            newDoc.push(getfile)

        }

        this.setState({
            newDoc: newDoc,

        })

    }

    approvalStatus = (text, comment) => {
        this.setState({ status_title: text, comment: comment }, () => this.check())
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

    addData = (e) => {
        console.log("add data")
        if (validate('check_form')) {
            var data = this.state.claimDetailData;
            var totalAmount = 0
            var settleAmount = 0

            data.push(this.state.claimData1)
            this.setState({
                claimDetailData: data

            })

            for (var i = 0; i < data.length; i++) {

                totalAmount += parseInt(data[i].amount);
            }
            console.log("advanced amouont",this.state.advancedData[0].advanced_amount)

            settleAmount = this.state.advancedData[0].advanced_amount - totalAmount
            console.log("settleamount",settleAmount)
            let claimData1 = this.state.data;
            claimData1.settle_amount = settleAmount;
            claimData1.actual_amount = totalAmount;
            // saveBtn = true
            form_validate = true
            this.showClaimData(data)
            this.setState({
                claimData1: {
                    actual_date: new Date(),
                    start_location: '',
                    destination: '',
                    start_time: new Date(),
                    end_time: new Date(),
                    noOfDays: '',
                    noOfNights: '',
                    meals: '',
                    lodging: '',
                    transport: '',
                    amount: '',
                    purpose: ''

                },
                data: claimData1

            })
        }
        else {
            form_validate = false
        }

    }

    updateData = (e) => {
        console.log("updatedata")
        if (validate('check_form')) {
            var data = this.state.claimDetailData;
            var totalAmount = 0
            var settleAmount = 0

            data.filter(v => v.travel_detail_id == this.state.claimData1.travel_detail_id).push(this.state.claimData1)
            this.setState({
                claimDetailData: data
            })


            for (var i = 0; i < data.length; i++) {

                totalAmount += parseInt(data[i].amount);
            }

            settleAmount =  this.state.advancedData[0].advanced_amount - totalAmount
 
            let claimData1 = this.state.data;
            claimData1.settle_amount = settleAmount;
            claimData1.actual_amount = totalAmount;
            // saveBtn = true
            form_validate = true
            this.showClaimData(data)
            this.setState({
                claimData1: {
                    actual_date: new Date(),
                    start_location: '',
                    destination: '',
                    start_time: new Date(),
                    end_time: new Date(),
                    noOfDays: '',
                    noOfNights: '',
                    meals: '',
                    lodging: '',
                    transport: '',
                    amount: '',
                    purpose: ''

                },
                data: claimData1

            })
        }
        else {
            form_validate = false
        }

    }

    showClaimData(data1) {
        console.log("advanced data====>",this.state.advancedData)
        var claimDetail = [];
        var table;
        // for (var i = 0; i < this.state.claimDetailData.length; i++) {
        for (var i = 0; i < this.state.claimDetailData.length; i++) {

            const index = i
            var data = this.state.claimDetailData[i];
            claimDetail.push(
                {
                    actualDate: moment(data.actual_date).format("DD/MM/YYYY"),
                    startLoc: data.start_location,
                    destination: data.destination,
                    startTime: moment(data.start_time).format('h:mm A'),
                    endTime: moment(data.end_time).format('h:mm A'),
                    noOfDays: data.noOfDays,
                    noOfNights: data.noOfNights,
                    meals: data.meals,
                    lodging: data.lodging,
                    transport: data.transport,
                    amount: data.amount,
                    purpose: data.purpose,
                    action: '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toRemove" ><span id="remove" class="hidden" >' + index + '</span><span id="removeData" class="hidden">'+ this.state.advancedData[0].advanced_amount +'</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</button>',
                    action1: '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden"  >' + index + '</span>  <i className="fa fa-cogs" ></i>&nbsp;Edit</button>',

                    //     actualDate: `<input
                    //     class="form-control"
                    //     value=${moment(data.actual_date).format("DD/MM/YYYY")}
                    //     disabled
                    // />`,
                    //     startLoc: (
                    //     `<input
                    //         class="form-control checkValidate"
                    //         data-name="start_location"
                    //         value=${data.start_location}
                    //         onChange=${this.claimChangeText.bind(this, i)}
                    //     />`
                    //     ),
                    //     destination: `<input
                    //         data-name="destination"
                    //         class="form-control checkValidate"
                    //         value=${data.destination}
                    //         onChange=${this.claimChangeText.bind(this, i)}
                    //     />`,
                    //     startTime: `<input
                    //     class="form-control"
                    //     value=${moment(data.start_time).format('HH:mm:ss')}
                    //     disabled
                    // />`,
                    //     endTime: `<input
                    //     class="form-control"
                    //     value=${moment(data.end_time).format('HH:mm:ss')}
                    //     disabled
                    // />`,
                    //     noOfDays: `<input
                    //         class="form-control checkValidate"
                    //         value=${data.noOfDays}
                    //         data-name="noOfDays"
                    //         onChange=${this.claimChangeText.bind(this, i)}
                    //     />`,
                    //     noOfNights: `<input
                    //         class="form-control"
                    //         value=${data.noOfNights}
                    //         data-name="noOfNights"
                    //         onChange=${this.claimChangeText.bind(this, i)}
                    //     />`,
                    //     meals: `<input
                    //         id="meal"
                    //         class="form-control"
                    //         data-name="meals"
                    //         value=${data.meals}
                    //         ${isRequestedUser(this.state.updatedBy, this.state.claimData.createdBy) ? 'disabled' : ''}
                    //     /><span class="hidden">${i}</span>`,
                    //     lodging: `<input
                    //         id="lodging"
                    //         class="form-control"
                    //         value=${data.lodging}
                    //         data-name="lodging"
                    //         ${isRequestedUser(this.state.updatedBy, this.state.claimData.createdBy) ? 'disabled' : ''}
                    //     /><span class="hidden">${i}</span>`,
                    //     transport: `<input
                    //         id="transport"
                    //         class="form-control"
                    //         value=${data.transport}
                    //         data-name="transport"
                    //         ${isRequestedUser(this.state.updatedBy, this.state.claimData.createdBy) ? 'disabled' : ''}
                    //     /><span class="hidden">${i}</span>`,
                    //     amount: `<input
                    //         class="form-control"
                    //         value=${data.amount}
                    //         disabled
                    //     />`,
                    //     purpose: `<input class="form-control"
                    //         value='${data.purpose}'
                    //         type="textarea"
                    //         data-name="purpose"
                    //         onChange=${this.changePurpose.bind(this, i)}
                    //     />`,
                    //     action:
                    //     '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toRemove" ><span id="remove" class="hidden" >' + index + '</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</button>'

                }
            )

        }
        if ($.fn.dataTable.isDataTable('#claim-table')) {
            table = $('#claim-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#claim-table').empty();
        }

        var column = [
            { title: "Acutal Date", data: "actualDate" },
            { title: "Start Location", data: "startLoc" },
            { title: "Destination", data: "destination" },
            { title: "Start Time", data: "startTime" },
            { title: "End Time", data: "endTime" },
            { title: "No Of Days", data: "noOfDays" },
            { title: "No Of Nights", data: "noOfNights" },
            { title: "Meals", data: "meals" },
            { title: "Lodging", data: "lodging" },
            { title: "Transport", data: "transport" },
            { title: "Amount", data: "amount" },
            { title: "Purpose", data: "purpose" },
            { title: "Remove", data: "action" },
        ]
        if (this.state.is_main_role) {
            column.push({ title: "Edit", data: "action1" })
        }


        table = $("#claim-table").DataTable({
            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            buttons: false,
            paging: false,
            // dom: 'Bfrtip',
            buttons: [],
            data: claimDetail,
            columns: column
        });
    }

    render() {
        let { is_main_role } = this.state;
        return (
            < div className="row wrapper border-bottom white-bg ">
                <div className="row margin-top-20">

                    <div className="form-horizontal" name="demo-form">

                        <div className="col-md-6">

                            <div><label className="col-sm-12" >Request Type<span className="text-danger">*</span></label></div>
                            <div className="col-sm-10">

                                <input
                                    className="form-control input-md"
                                    value="Claim"
                                    disabled
                                />

                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Advanced Number<span className="text-danger">*</span></label></div>
                                <div className="col-sm-10">
                                    <input
                                        className="form-control input-md"
                                        value={fno.fno_travel + this.state.advancedData[0].form_no}
                                        disabled
                                    />

                                </div>
                            </div>

                        </div>

                        <div className="col-md-12">
                            <h4>Advanced Information</h4>
                            <div className="ibox float-e-margins">
                                <div className="ibox-content p-md" style={{ float: 'left', backgroundColor: 'darkgrey' }}>
                                    <div className="col-md-2">
                                        <label>User</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advancedData[0].fullname}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>Start Location</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advancedData[0].start_location}
                                        />

                                    </div>
                                    <div className="col-md-2">
                                        <label>Destination</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advancedData[0].destination}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>Start Date</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advancedData[0].start_date}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>End Date</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advancedData[0].end_date}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>No Of Days</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advancedData[0].noOfDays}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>No Of Nights</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advancedData[0].noOfNights}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>Meals</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advancedData[0].meals}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>Lodging</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advancedData[0].lodging}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>Transport</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advancedData[0].transport}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>Total Amount</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advancedData[0].advanced_amount}

                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-12" id="check_form" >
                            <div className="ownspacing"></div>
                            <h4>Claim Information</h4>
                            {this.state.claimData[0].status == 5 || this.state.toEdit ?
                                <div className="ibox float-e-margins">
                                    <div className="ibox-content p-md" >
                                        <div className="row">
                                            <div className="col-md-3">
                                                <label>Actual Date</label>
                                                <DatePicker
                                                    dateFormat="DD/MM/YYYY"
                                                    value={this.state.claimData1.actual_date}
                                                    timeFormat={false}
                                                    onChange={this.changeactual_date.bind(this)}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label>Start Location</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    data-name='start_location'
                                                    value={this.state.claimData1.start_location}
                                                    placeholder="Enter Start Location"
                                                    onChange={this.claimChangeText1}

                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label>Destination</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    data-name='destination'
                                                    value={this.state.claimData1.destination}
                                                    placeholder="Enter Destination"
                                                    onChange={this.claimChangeText1}

                                                />

                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-md-3">
                                                <label>Start Time</label>
                                                <DatePicker
                                                    // value={this.state.claimData1.start_time}
                                                    value={moment(this.state.claimData1.start_time).format("hh:mm A")}
                                                    timeFormat='hh:mm A'
                                                    dateFormat={false}

                                                    onChange={this.changeStartTime1.bind(this)}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label>End Time</label>
                                                <DatePicker
                                                    // value={this.state.claimData1.end_time}
                                                    value={moment(this.state.claimData1.end_time).format("hh:mm A")}
                                                    timeFormat='hh:mm A'
                                                    dateFormat={false}

                                                    onChange={this.changeEndTime1.bind(this)}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label>No Of Days</label>
                                                <input
                                                    className="form-control "
                                                    type="text"
                                                    data-name='noOfDays'
                                                    value={this.state.claimData1.noOfDays}
                                                    placeholder="No Of Days"
                                                    onChange={this.claimChangeText1}

                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label>No Of Nights</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    data-name='noOfNights'
                                                    value={this.state.claimData1.noOfNights}
                                                    placeholder="No Of Nights"
                                                    onChange={this.claimChangeText1}

                                                />
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-md-3">
                                                <label>Meals</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    data-name='meals'
                                                    value={this.state.claimData1.meals}
                                                    placeholder="Enter Meals"
                                                    onChange={this.claimChangeText1}

                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label>Lodging</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    data-name='lodging'
                                                    value={this.state.claimData1.lodging}
                                                    placeholder="Enter Lodging"
                                                    onChange={this.claimChangeText1}

                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label>Transport</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    data-name='transport'
                                                    value={this.state.claimData1.transport}
                                                    placeholder="Enter Meals"
                                                    onChange={this.claimChangeText1}

                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label>Total Amount</label>
                                                <input
                                                    className="form-control input-md "
                                                    type="text"
                                                    disabled
                                                    data-name='amount'
                                                    value={this.state.claimData1.amount}

                                                />
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-md-6">
                                                <label>Purpose</label>
                                                <input
                                                    className="form-control input-md "
                                                    type="textarea"
                                                    data-name='purpose'
                                                    onChange={this.changePurpose1}
                                                    value={this.state.claimData1.purpose}
                                                />
                                            </div>
                                            <div className="col-md-6 btn-rightend">

                                                {this.state.claimData[0].status == 5 ?
                                                    <button className="btn-primary btn" onClick={this.addData} style={{ marginTop: 20 }}>Add</button>
                                                    : <button className="btn-primary btn" onClick={this.updateData} style={{ marginTop: 20 }}>Update</button>}
                                            </div>
                                        </div>
                                    </div>
                                </div> : null}
                            <div className="col-md-12">
                                {/* <DataTable
                                            keys="claimDetail"
                                            columns={columns}
                                            initialData={claimDetail}

                                        /> */}
                                <table width="99%"
                                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                                    id="claim-table"
                                />

                            </div>

                        </div>

                        <div className="col-md-12" style={{ marginTop: 25 }}>
                            {/* <div className="col-md-3">
                                    <label>Purpose</label>
                                    <input
                                        className="form-control"
                                        data-name="purpose"
                                        onChange={this.changePurpose.bind(this)}
                                        value={this.state.claimData[0].purpose}


                                    />
                                </div> */}
                            <div className="col-md-3">
                                <label>Advanced Amount</label>
                                <input
                                    className="form-control"
                                    disabled
                                    value={this.state.advancedData[0].advanced_amount}

                                />
                            </div>
                            <div className="col-md-3">
                                <label>Actual Amount </label>
                                <input
                                    className="form-control"
                                    disabled
                                    value={this.state.data.actual_amount == 0 ? this.state.claimData[0].actual_amount : this.state.data.actual_amount}

                                />
                            </div>
                            <div className="col-md-3">
                                <label>Settle Amount</label>
                                <input
                                    className="form-control"
                                    disabled
                                    value={this.state.data.settle_amount == 0 ? this.state.claimData[0].settle_amount : this.state.data.settle_amount}

                                />
                            </div>
                            <div className="col-md-3">
                                <label>Withdraw Location</label>
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

                        {
                            this.state.is_main_role ?
                                this.state.document.length > 0 ?
                                    <div className="row col-md-12 document-main">
                                        <input className="full_width hidden" type="file" id="dropTravelACEdit" ></input>

                                        <DocumentList title='Travel Document' doc={this.state.document} path="travel" />
                                    </div> : <input className="full_width hidden" type="file" id="dropTravelACEdit" ></input>
                                :

                                this.state.claimData[0].status == 5 && this.state.claimData[0].createdBy == this.state.data.user_id ?

                                    <div className="col-md-12" style={{ overflowX: "auto" }}>
                                        <div className="ownspacing"></div>
                                        <h4>Travel Document</h4>
                                        <div className="col-md-12">
                                            <input type="file" className="dropZone" id="dropTravelACEdit" onChange={this.handlefileChanged.bind(this)} multiple /></div>

                                        <div className="ibox float-e-margins">
                                            <div className="p-md col-md-12" style={{ float: 'left', }}>

                                                {this.state.document.map((data, index) =>
                                                    <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">
                                                        <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                            <div className="columns">
                                                                <div className="column-title">
                                                                    <a href={`${main_url}travel/getCRDocumentData/${data.name}`}
                                                                        download target='_blank'
                                                                        className="btn btn-primary document-body-bt document-width">
                                                                        {data.name}
                                                                    </a>
                                                                </div>
                                                                <div className="column-actions">
                                                                    <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeOldDocument(index, event)}> <i></i></a>
                                                                </div>
                                                            </div></li></ul>

                                                    </div>
                                                )
                                                }
                                                {this.state.newDoc.map((data, index) =>

                                                    <div className="fileuploader-items col-md-4"><ul className="fileuploader-items-list">

                                                        <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                                            <div className="columns">
                                                                <div className="column-title">
                                                                    <a href='#'
                                                                        className="btn btn-primary document-body-bt document-width">
                                                                        {data.name}
                                                                    </a>
                                                                </div>
                                                                <div className="column-actions">
                                                                    <a className="fileuploader-action fileuploader-action-remove" onClick={(event) => this.removeNewDocument(index, event)}> <i></i></a>
                                                                </div>
                                                            </div></li></ul>

                                                    </div>
                                                )


                                                }


                                            </div>
                                        </div>
                                    </div> :
                                    <div className="row col-md-12 document-main">
                                        <input className="full_width hidden" type="file" id="dropTravelACEdit" ></input>

                                        <DocumentList title='Travel Document' doc={this.state.document} path="travel" />
                                    </div>

                        }


                        <div className="row save-btn" style={{ paddingTop: 25 }} >
                            {
                                is_main_role ?
                                    <ApprovalForm approvalStatus={this.approvalStatus.bind(this)} status={this.state.claimData[0].status} work_flow={this.props.work_flow_status} total_amount={this.state.claimData[0].total_amount} />
                                    :
                                    this.state.claimData[0].status == 5 && this.state.claimData[0].createdBy == this.state.data.user_id ?
                                        < div className="col-md-12 btn-rightend" style={{ marginTop: 50 }}>
                                            <button onClick={this.check.bind(this)} id="saving_button" className="btn btn-primary"><span>Confirm</span> </button>
                                        </div>
                                        : null
                            }
                        </div>
                    </div>
                </div>
            </ div >
        )
    }


}