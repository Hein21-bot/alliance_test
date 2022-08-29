import React, { Component } from 'react'
import { getUserId, stopSaving, startSaving, calculationDate } from '../../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import Select from 'react-select';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'
import moment from "moment";
import { toast } from 'react-toastify';
// import moment from "moment-timezone";
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import { main_url, validate, getBranch } from '../../../utils/CommonFunction';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');


const type = [{
    value: 1,
    label: 'Advanced'
}, {
    value: 2,
    label: 'Claim'
}]

var form_validate = true;
export default class TravelAdvancedAddNew
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            requestTypeId: '',
            requestType: type,
            advancedNo: [],
            branch: [],
            selected_location: [],
            setupData: {
                user_id: getUserId("user_info"),
                fullname: '',
                selectedRequest: '',
                selectedAdvancedNo: '',
                purpose: '',
                startLoc: '',
                destination: '',
                startDate: new Date(),
                endDate: new Date(),
                noOfDays: 1,
                noOfNights: 0,
                meals: '',
                lodging: '',
                transport: '',
                withdraw_location: 0,
                amount: 0
            },
            claimData: {
                actualDate: new Date(),
                startLoc: '',
                destination: '',
                startTime: new Date(),
                endTime: new Date(),
                noOfDays: 0,
                noOfNights: 0,
                meals: 0,
                lodging: 0,
                transport: 0,
                amount: 0
            },
            data: {
                user_id: getUserId("user_info"),
                selectedRequest: '',
                actual_amount: 0,
                purpose: '',
                settle_amount: 0,
                advancedNo: '',
                advancedId: ''
            },
            dataSource: []
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    async componentDidMount() {
        let that = this;
        let branch = await getBranch();

        that.setState({
            branch: branch,
            selected_location: { label: this.props.data.withdraw_location_name, value: this.props.data.withdraw_location }

        })
        $(document).on('click', '#toRemove', function () {

            var data = $(this).find("#remove").text();
            data = $.parseJSON(data);

            let newData = that.state.dataSource;
            newData.splice(data, 1)
            that.setState({
                dataSource: newData
            }, () => that.setDataTable(newData))

        });

    }

    handleSelectedAdvancedNo = (event) => {
        let data = this.state.setupData;
        let advancedNo = this.state.data;
        data.selectedAdvancedNo = event;
        advancedNo.advancedNo = event.label
        advancedNo.advancedId = event.value
        this.setState({
            setupData: data,
            data: advancedNo
        })

        fetch(main_url + "allowance/getDataByAdvancedNo/" + event.label)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res.length > 0) {
                    data.startLoc = res[0].start_location
                    data.fullname = res[0].fullname
                    data.destination = res[0].destination
                    data.startDate = res[0].start_date
                    data.endDate = res[0].end_date
                    data.noOfDays = res[0].noOfDays
                    data.noOfNights = res[0].noOfNights
                    data.meals = res[0].meals
                    data.lodging = res[0].lodging
                    data.transport = res[0].transport
                    data.amount = res[0].advanced_amount
                    this.setState({
                        setupData: data
                    })
                }

            })
            .catch(error => console.error(`Fetch Error =\n`, error));

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

    addData = (e) => {
        var data = this.state.dataSource;
        var totalAmount = 0
        var settleAmount = 0
        data.push(this.state.claimData)
        this.setState({
            dataSource: data

        })

        for (var i = 0; i < data.length; i++) {

            totalAmount += data[i].amount;
        }

        settleAmount = totalAmount - this.state.setupData.amount

        let claimData = this.state.data;
        claimData.settle_amount = settleAmount;
        claimData.actual_amount = totalAmount;

        this.setDataTable(data)
        this.setState({
            claimData: {
                actualDate: new Date(),
                startLoc: '',
                destination: '',
                startTime: new Date(),
                endTime: new Date(),
                noOfDays: '',
                noOfNights: '',
                meals: '',
                lodging: '',
                transport: '',
                amount: '',


            },
            data: claimData

        })

    }

    setDataTable(data) {
        var table;
        if ($.fn.dataTable.isDataTable('#dataTables-claimTable')) {
            table = $('#dataTables-claimTable').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-claimTable').empty()
        }
        var l = []
        for (var i = 0; i < data.length; i++) {

            const index = i
            const obj = {
                actualDate: moment(data[i].actualDate).format('DD-MM-YYYY'),
                startLoc: data[i].startLoc,
                destination: data[i].destination,
                startTime: moment(data[i].startTime).format('h:mm a'),
                endTime: moment(data[i].endTime).format('h:mm a'),
                noOfDays: data[i].noOfDays,
                noOfNights: data[i].noOfNights,
                meals: data[i].meals,
                lodging: data[i].lodging,
                transport: data[i].transport,
                amount: data[i].amount,
                action:
                    '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toRemove" ><span id="remove" class="hidden" >' + index + '</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</button>'
            }

            l.push(obj)

        }

        table = $("#dataTables-claimTable").DataTable({
            autofill: false,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            paging: false,
            buttons: false,

            data: l,
            columns: [
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
                { title: "Action", data: "action" }

            ],
        });

    }

    handleSelectedRequestType = (event) => {

        if (event.value === 1) {
            let data = this.state.setupData;
            data.selectedRequest = event;
            this.setState({
                setupData: data,
                requestTypeId: event.value
            })
        }
        else {
            this.getUnclaimAdvanced();
            let data = this.state.setupData;
            let claim = this.state.data;
            data.selectedRequest = event;
            claim.selectedRequest = event;
            this.setState({
                setupData: data,
                data: claim,
                requestTypeId: event.value
            }
            )
        }
    }

    getUnclaimAdvanced() {
        fetch(main_url + "allowance/getUnclaimAdvancedNo")
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.setState({ advancedNo: res })

                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
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

        }, () => {
            data.noOfDays = calculationDate(value, data.endDate)
            data.noOfNights = calculationDate(value, data.endDate) - 1
            this.setState({
                setupData: data
            })
        })
    }

    changeEndDate(value) {

        let data = this.state.setupData;
        data.endDate = value
        this.setState({
            setupData: data,

        }, () => {
            data.noOfDays = calculationDate(data.startDate, value)
            data.noOfNights = calculationDate(data.startDate, value) - 1
            this.setState({
                setupData: data
            })
        })
    }

    changeActualDate(value) {
        let data = this.state.claimData;
        data.actualDate = value
        this.setState({
            claimData: data
        })
    }

    changeStartTime(value) {
        let data = this.state.claimData;
        data.startTime = value
        this.setState({
            claimData: data
        })

    }

    changeEndTime(value) {
        let data = this.state.claimData;
        data.endTime = value
        this.setState({
            claimData: data
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

    changePurpose = (e) => {
        let data = this.state.data;
        let name = e.target.dataset.name;
        data[name] = e.target.value;
        this.setState({
            data: data
        })
    }

    claimChangeText = (e) => {

        let data = this.state.claimData;
        let name = e.target.dataset.name;
        data[name] = e.target.value;

        if (name === 'meals' || name === 'transport' || name === 'lodging') {
            data.amount = Number(data.meals) + Number(data.transport) + Number(data.lodging)

        }
        this.setState({
            claimData: data
        })

    }

    check = () => {
        stopSaving();
        if (validate('check_form')) {
            if (this.state.setupData.withdraw_location == 0) {
                toast.error("Please choose withdraw location");
            } else {
                this.props.add(this.state.setupData)
            }
        }
        else {
            startSaving();
            form_validate = false;
        }
    }

    render() {
        return (
            <div id="check_form" >
                <div className="col-md-6">
                    <div className="form-group">
                        <div><label className="col-sm-12" >WithDraw Location<span className="text-danger">*</span></label></div>
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
                                type="text"
                                data-name='startLoc'
                                value={this.state.setupData.startLoc}
                                placeholder="Enter Location"
                                onChange={this.changeText}

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
                                type="text"
                                data-name='destination'
                                value={this.state.setupData.destination}
                                placeholder="Enter Destination"
                                onChange={this.changeText}

                            />

                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <div><label className="col-sm-12" >Start Date<span className="text-danger">*</span></label></div>
                        <div className="col-sm-10">

                            <DatePicker
                                dateFormat="DD-MM-YYYY"
                                value={this.state.setupData.startDate}
                                displayTimeZone={this.state.timezone}
                                timeFormat={false}
                                onChange={this.changeStartDate.bind(this)}
                            />

                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <div><label className="col-sm-12" >End Date<span className="text-danger">*</span></label></div>
                        <div className="col-sm-10">
                            <DatePicker
                                dateFormat="DD-MM-YYYY"
                                value={this.state.setupData.endDate}
                                timeFormat={false}
                                minDate={this.state.setupData.startDate}
                                onChange={this.changeEndDate.bind(this)}
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
                                type="number"
                                min="0"
                                data-name='noOfDays'
                                value={this.state.setupData.noOfDays}
                                placeholder="Enter No Of Days"
                                onChange={this.changeText}

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
                                type="number"
                                min="0"
                                data-name='noOfNights'
                                value={this.state.setupData.noOfNights}
                                placeholder="Enter No Of Nights"
                                onChange={this.changeText}

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
                                type="number"
                                min="0"
                                data-name='meals'
                                value={this.state.setupData.meals}
                                placeholder="Enter Meal"
                                onChange={this.changeText}

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
                                type="number"
                                min="0"
                                data-name='lodging'
                                value={this.state.setupData.lodging}
                                placeholder="Enter Lodging"
                                onChange={this.changeText}

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
                                type="number"
                                min="0"
                                data-name='transport'
                                value={this.state.setupData.transport}
                                placeholder="Enter Transport"
                                onChange={this.changeText}

                            />

                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <div><label className="col-sm-12" >Total Amount<span className="text-danger">*</span></label></div>
                        <div className="col-sm-10">

                            <input
                                className="form-control input-md checkValidate"
                                type="text"
                                disabled
                                data-name='amount'
                                value={this.state.setupData.amount}

                            />

                        </div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="form-group">
                        <div><label className="col-sm-12" >Purpose<span className="text-danger">*</span></label></div>
                        <div className="col-sm-10">

                            <textarea
                                className="form-control input-md checkValidate"
                                cols="20"
                                rows="5"
                                data-name='purpose'
                                value={this.state.setupData.purpose}
                                placeholder="Enter Purpose"
                                onChange={this.changeText}

                            />

                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-11 btn-rightend">
                        <button onClick={this.check.bind(this)} id="saving_button" className="btn btn-primary"><span>Confirm</span> </button>
                    </div>
                </div>
            </div>
        )
    }
}