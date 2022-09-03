import React, { Component } from 'react'
import { main_url, stopSaving, startSaving, getBranch } from '../../../utils/CommonFunction';
import 'react-toastify/dist/ReactToastify.min.css';
import { toast } from 'react-toastify';

import moment from "moment";
import Select from 'react-select';
import DatePicker from 'react-datetime';
import { getUserId, validate, fno } from '../../../utils/CommonFunction';
const $ = require('jquery');
var form_validate = true;
var saveBtn = false;
export default class TravelAdvancedClaimAddNew
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fileArray:[],
            newDoc:[],
            advanceData: props.data[0],
            branch: [],
            selected_location: [],
            claimData: {
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

            },
            data: {
                withdraw_location: 0,
                user_id: getUserId("user_info"),
                selectedRequest: '',
                actual_amount: 0,
                purpose: '',
                settle_amount: 0,
                advancedNo: props.data[0].form_no,
                advancedId: props.data[0].travel_allowance_id
            },
            dataSource: []

        }
    }

    async componentDidMount() {
        let that = this;
        let branch = await getBranch();
        that.setState({
            branch: branch
        })
        $(document).on('click', '#toRemove', function () {

            var data = $(this).find("#remove").text();
            data = $.parseJSON(data);

            let newData = that.state.dataSource;
            newData.splice(data, 1);

            let claimData = that.state.data;
            var totalAmount = 0

            for (var i = 0; i < newData.length; i++) {

                totalAmount += newData[i].amount;
            }
            claimData.actual_amount = totalAmount;
            that.setState({
                dataSource: newData,
                data: claimData
            }, () => that.setDataTable(newData))
        });

    }

    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    changePurpose = (e) => {
        let data = this.state.claimData;
        data.purpose = e.target.value;
        this.setState({
            claimData: data
        })
    }

    changeactual_date(value) {
        let data = this.state.claimData;
        data.actual_date = value
        this.setState({
            claimData: data
        })
    }
    changeStartTime(value) {
        let data = this.state.claimData;
        data.start_time = value
        this.setState({
            claimData: data
        })

    }
    changeEndTime(value) {
        let data = this.state.claimData;
        data.end_time = value
        this.setState({
            claimData: data
        })

    }

    changeWithdrawLocation = e => {
        let data = this.state.data;
        data.withdraw_location = e.value;
        this.setState({
            selected_location: e,
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

    addData = (e) => {
        if (validate('check_form')) {
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

            settleAmount = totalAmount - this.state.advanceData.advanced_amount

            let claimData = this.state.data;
            claimData.settle_amount = settleAmount;
            claimData.actual_amount = totalAmount;
            saveBtn = true
            form_validate = true
            this.setDataTable(data)
            this.setState({
                claimData: {
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
                data: claimData

            })
        }
        else {
            form_validate = false
        }

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
                actual_date: moment(data[i].actual_date).format('DD-MM-YYYY'),
                start_location: data[i].start_location,
                destination: data[i].destination,
                start_time: moment(data[i].start_time).format('h:mm a'),
                end_time: moment(data[i].end_time).format('h:mm a'),
                noOfDays: data[i].noOfDays,
                noOfNights: data[i].noOfNights,
                meals: data[i].meals,
                lodging: data[i].lodging,
                transport: data[i].transport,
                amount: data[i].amount,
                purpose: data[i].purpose,
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
                { title: "Acutal Date", data: "actual_date" },
                { title: "Start Location", data: "start_location" },
                { title: "Destination", data: "destination" },
                { title: "Start Time", data: "start_time" },
                { title: "End Time", data: "end_time" },
                { title: "No Of Days", data: "noOfDays" },
                { title: "No Of Nights", data: "noOfNights" },
                { title: "Meals", data: "meals" },
                { title: "Lodging", data: "lodging" },
                { title: "Transport", data: "transport" },
                { title: "Amount", data: "amount" },
                { title: "Purpose", data: "purpose" },
                { title: "Action", data: "action" }

            ],
        });

    }


    handlefileChanged(event) {
        console.log(event.target.files)
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
        document.getElementById('travelDropzone').value=''
        this.setState({
            fileArray: arr
        })

    }
    removeNewDocument(index, event) {
        var array = this.state.fileArray;
        
        array.splice(index, 1);
        this.setState({
            fileArray: array
        })
        
    }

    // checkFiles(e) {
    //     var files = document.getElementById("travelDropzone").files;
       
    //     if (files.length > 2) {
    //         toast.warning('You can only upload a maximum of 2 files!')
    //     }
        
    //     let newDoc = this.state.newDoc;
    //     var obj = document.querySelector("#travelDropzone").files.length;
    //     for (var i = 0; i < obj; i++) {
    //         var getfile = document.querySelector("#travelDropzone").files[i];
    //         newDoc.push(getfile)
    //     }
    //     document.getElementById('attach_file').value=''
    //     this.setState({
    //         // attachment: attachment,
    //         newDoc: newDoc
    //     })
    // }


    check = () => {
<<<<<<< HEAD
        stopSaving();
        // if (this.state.newDoc.length == 0) {
        //     toast.error("Please Choose Attachment File!")
        // } else {
        if (saveBtn) {
            this.props.addTravelAdvancedClaim(this.state.dataSource, this.state.data, this.state.advanceData.advanced_amount)
        }
        else {
            startSaving();
            toast.error(' Please Add Full Information', {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true
            });
        }
        // }
=======
        if(this.state.fileArray.length == 0){
            toast.error("Please Choose Attachment File!")
        }else{
            if (saveBtn) {
                $('#saving_button').attr('disabled', true);
                this.props.addTravelAdvancedClaim(this.state.dataSource, this.state.data, this.state.advanceData.advanced_amount,this.state.fileArray)
    
            }
            else {
                startSaving();
                toast.error(' Please Add Full Information', {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        }
        
>>>>>>> 96d1ee1b8e04f9fd5e730d381d273ee3b1c3d3d1
    }



    render() {
        return (

            <div className="row wrapper border-bottom white-bg">
                <div className="margin-top-20">

                    <div className="form-horizontal" name="demo-form">
                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Request Type</label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control"
                                        disabled
                                        value="Claim"

                                    />

                                </div>
                            </div>

                        </div>

                        <div className="col-md-6">
                            <div className="form-group">
                                <div><label className="col-sm-12" >Advanced Number</label></div>
                                <div className="col-sm-10">

                                    <input
                                        className="form-control"
                                        placeholder="Please Choose Advanced No"
                                        value={fno.fno_travel + this.state.advanceData.form_no}
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
                                            value={this.state.advanceData.fullname}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>Start Location</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advanceData.start_location}

                                        />

                                    </div>
                                    <div className="col-md-2">
                                        <label>Destination</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advanceData.destination}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>Start Date</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advanceData.start_date}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>End Date</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advanceData.end_date}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>No Of Days</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            disabled
                                            value={this.state.advanceData.noOfDays}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>No Of Nights</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            disabled
                                            value={this.state.advanceData.noOfNights}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>Meals</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            disabled
                                            value={this.state.advanceData.meals}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>Lodging</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            disabled
                                            value={this.state.advanceData.lodging}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>Transport</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            disabled
                                            value={this.state.advanceData.transport}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>Total Amount</label>
                                        <input
                                            className="form-control"
                                            type="number"
                                            disabled
                                            value={this.state.advanceData.advanced_amount}
                                        />
                                    </div>

                                </div>
                            </div>
                        </div>

                        <div className="col-md-12" id="check_form">
                            <div className="ownspacing"></div>
                            <h4>Claim Information</h4>
                            <div className="ibox float-e-margins">
                                <div className="ibox-content p-md" >
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Actual Date</label>
                                            <DatePicker
                                                dateFormat="DD/MM/YYYY"
                                                value={this.state.claimData.actual_date}
                                                timeFormat={false}
                                                onChange={this.changeactual_date.bind(this)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label>Start Location</label>
                                            <input
                                                className="form-control checkValidate"
                                                type="text"
                                                data-name='start_location'
                                                value={this.state.claimData.start_location}
                                                placeholder="Enter Start Location"
                                                onChange={this.claimChangeText}

                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label>Destination</label>
                                            <input
                                                className="form-control checkValidate"
                                                type="text"
                                                data-name='destination'
                                                value={this.state.claimData.destination}
                                                placeholder="Enter Destination"
                                                onChange={this.claimChangeText}

                                            />

                                        </div>
                                    </div>
                                    <div className="row margin-top-20">
                                        <div className="col-md-3">
                                            <label>Start Time</label>
                                            <DatePicker

                                                value={this.state.claimData.start_time}
                                                dateFormat={false}

                                                onChange={this.changeStartTime.bind(this)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label>End Time</label>
                                            <DatePicker

                                                value={this.state.claimData.end_time}
                                                dateFormat={false}
                                                onChange={this.changeEndTime.bind(this)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label>No Of Days</label>
                                            <input
                                                className="form-control checkValidate"
                                                type="text"
                                                data-name='noOfDays'
                                                value={this.state.claimData.noOfDays}
                                                placeholder="No Of Days"
                                                onChange={this.claimChangeText}

                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label>No Of Nights</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                data-name='noOfNights'
                                                value={this.state.claimData.noOfNights}
                                                placeholder="No Of Nights"
                                                onChange={this.claimChangeText}

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
                                                value={this.state.claimData.meals}
                                                placeholder="Enter Meals"
                                                onChange={this.claimChangeText}

                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label>Lodging</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                data-name='lodging'
                                                value={this.state.claimData.lodging}
                                                placeholder="Enter Lodging"
                                                onChange={this.claimChangeText}

                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label>Transport</label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                data-name='transport'
                                                value={this.state.claimData.transport}
                                                placeholder="Enter Meals"
                                                onChange={this.claimChangeText}

                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label>Total Amount</label>
                                            <input
                                                className="form-control input-md "
                                                type="text"
                                                disabled
                                                data-name='amount'
                                                value={this.state.claimData.amount}

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
                                                onChange={this.changePurpose}
                                                value={this.state.claimData.purpose}
                                            />
                                        </div>
                                        <div className="col-md-6 btn-rightend">

                                            <button className="btn-primary btn" onClick={this.addData} style={{ marginTop: 20 }}>Add</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-12">
                                <table width="99%"
                                    className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                                    id="dataTables-claimTable"
                                />
                            </div>
                            <div className="col-md-12">
                                {/* <div className="col-md-3">
                                        <label>Purpose</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            data-name='purpose'
                                            value={this.state.data.purpose}
                                            placeholder="Enter Purpose"
                                            onChange={this.changePurpose}

                                        />
                                    </div> */}
                                <div className="col-md-3">
                                    <label>Advanced Amount</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        disabled
                                        value={this.state.advanceData.advanced_amount}


                                    />
                                </div>
                                <div className="col-md-3">
                                    <label>Actual Amount </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        disabled
                                        value={this.state.data.actual_amount}

                                    />
                                </div>
                                <div className="col-md-3">
                                    <label>Setttle Amount</label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        disabled
                                        value={this.state.data.settle_amount}

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

                        </div>
                        <div className="col-md-12" style={{
                            marginTop: 30
                        }}>
                            <input type="file" className="dropZone" id="travelDropzone" onChange={this.handlefileChanged.bind(this)} multiple /></div>
                            <div>
                                    {this.state.fileArray.map((data, index) =>

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
                        <div className="col-md-12 btn-rightend mt20">
                            <button onClick={this.check.bind(this)} id="saving_button" className="btn btn-primary"><span>Confirm</span> </button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}