import React, { Component } from 'react'
import { main_url, stopSaving, startSaving } from '../../../utils/CommonFunction';
import 'react-toastify/dist/ReactToastify.min.css';
import { toast, ToastContainer } from 'react-toastify';
import moment from "moment";
import DatePicker from 'react-datetime';
import Select from 'react-select';
import { getUserId, validate, getBranch, alertText } from '../../../utils/CommonFunction';
const $ = require('jquery');
var form_validate = true;
var saveBtn = false;
export default class TravelClaimRequestAddNew
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            branch: [],
            selected_location: [],
            claimData: {
                purpose: '',
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
                withdraw_location: 0
            },
            data: {
                user_id: getUserId("user_info"),
                actual_amount: 0,
                purpose: '',
                withdraw_location: 0
            },
            dataSource: [],
            attachment: [],
            newDoc: []
        }

    }



    componentDidUpdate() {
        if (!form_validate) validate('check_form')
    }

    async componentDidMount() {
        let that = this
        let branch = await getBranch();
        this.setState({
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
            // claimData: moment(data).toISOString()
        })
    }

    changeWithdrawLocation = (e) => {
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

    removeNewDocument(index, event) {
        var array = this.state.newDoc;
        array.splice(index, 1);
        this.setState({
            newDoc: array
        })
    }
    addData = (e) => {
        if (validate('add_check_form')) {
            var data = this.state.dataSource;
            let claimData = this.state.data;
            var totalAmount = 0

            data.push(this.state.claimData)
            this.setState({
                dataSource: data

            })

            for (var i = 0; i < data.length; i++) {

                totalAmount += parseInt(data[i].amount);
            }

            // let claimData = this.state.data;
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
                    noOfDays: 0,
                    noOfNights: 0,
                    meals: 0,
                    lodging: 0,
                    transport: 0,
                    amount: 0,
                    withdraw_location: 0
                },
                data: claimData


            })
        }
        else {
            form_validate = false;
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
                actual_date: moment(data[i].actual_date).format("DD/MM/YYYY"),
                start_location: data[i].start_location,
                destination: data[i].destination,
                start_time: data[i].start_time > 0 ? moment(data[i].start_time).format(' h:mm a') : 0,
                end_time: data[i].end_time > 0 ? moment(data[i].end_time).format(' h:mm a') : 0,
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
                { title: "Action", data: "action" }

            ],
        });

    }

    check = () => {
        if (this.state.newDoc.length == 0) {
            toast.error("Please Choose Attachment File!")
        } else {
            if (validate("check_form")) {

                // @lucy
                const dataTostring = this.state.dataSource.map((v) => {
                    return {
                        actual_date: moment(v.actual_date).format(),
                        amount: v.amount,
                        destination: v.destination,
                        end_time: moment(v.end_time).utc().format(),
                        lodging: v.lodging,
                        meals: v.meals,
                        noOfDays: v.noOfDays,
                        noOfNights: v.noOfNights,
                        purpose: v.purpose,
                        start_location: v.start_location,
                        start_time: moment(v.start_time).utc().format(),
                        transport: v.transport,
                        withdraw_location: v.withdraw_location,
                        createdBy: this.state.data.user_id
                    };
                });
                if (saveBtn) {
                    $('#saving_button').attr('disabled', true);
                    this.props.addClaimRequest(dataTostring, this.state.data, this.state.newDoc);
                } else {
                    startSaving();
                    toast.error(" Please Add Full Information", {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                    });
                }
            }
            else {
                startSaving();
                form_validate = false;
                toast.error(alertText, {
                    position: 'top-right',
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });
            }
        }

    };

    handlefileChanged(e) {
        var files = e.target.files;
        var attachment = [...this.state.attachment];

        for (let i = 0; i < files.length; i++) {
            attachment.push(files[i])

            // this.setState({
            //     attachment: attachment
            // })

        }
        let newDoc = this.state.newDoc;
        var obj = document.querySelector("#travelCRDrop").files.length;
        for (var j = 0; j < obj; j++) {
            var getfile = document.querySelector("#travelCRDrop").files[j];
            newDoc.push(getfile)
        }
        document.querySelector("#travelCRDrop").value = ''
        this.setState({
            newDoc: newDoc,
            attachment: attachment
        })
    }

    render() {
        return (
            <div>
                <div className="row">
                    <div className="form-horizontal" name="demo-form">
                        <div className="col-md-12" style={{ marginTop: 20 }}>
                            <div className="ibox float-e-margins" id="add_check_form">
                                <div className="ibox-content p-md">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <label>Actual Date</label>
                                            <DatePicker
                                                dateFormat="DD/MM/YYYY"
                                                value={(this.state.claimData.actual_date)}
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
                                                timeFormat={true}
                                                value={this.state.claimData.start_time}
                                                dateFormat={false}
                                                onChange={this.changeStartTime.bind(this)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label>End Time</label>
                                            <DatePicker
                                                timeFormat={true}
                                                value={this.state.claimData.end_time}
                                                dateFormat={false}
                                                onChange={this.changeEndTime.bind(this)}
                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label>No Of Days</label>
                                            <input
                                                className="form-control checkValidate"
                                                type="number"
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
                                                type="number"
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
                                                type="number"
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
                                                type="number"
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
                                                type="number"
                                                data-name='transport'
                                                value={this.state.claimData.transport}
                                                placeholder="Enter Transport"
                                                onChange={this.claimChangeText}

                                            />
                                        </div>
                                        <div className="col-md-3">
                                            <label>Total Amount</label>
                                            <input
                                                className="form-control input-md"
                                                type="number"
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
                                                className="form-control"
                                                type="textarea"
                                                data-name='purpose'
                                                rows="5" cols="30"
                                                value={this.state.claimData.purpose}
                                                placeholder="Enter Purpose"
                                                onChange={this.changePurpose}

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
                                    <label>Total Amount </label>
                                    <input
                                        className="form-control"
                                        type="text"
                                        disabled
                                        value={this.state.data.actual_amount}

                                    />
                                </div>
                                <div className="col-md-3" id="check_form">
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
                                {/* <div className="col-md-12" style={{
                                    marginTop: 30
                                }}>
                                    <input type="file" className="dropZone" id="travelCRDrop" onChange={this.handlefileChanged.bind(this)} multiple />
                                    <div>
                                        {this.state.newDoc.map((data, index) =>
                                            <div className="column-title">
                                                <span className="own-text">
                                                    {data.name}</span></div>
                                        )}
                                    </div>
                                </div> */}

                                <div className="col-md-12">
                                    <div className="col-md-12" style={{
                                        marginTop: 30
                                    }}>
                                    </div>
                                    <div className="col-sm-10">
                                        <input className="dropZone " type="file" id="travelCRDrop" multiple onChange={this.handlefileChanged.bind(this)}></input>
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

                                <div className="col-md-12 btn-rightend mt20">
                                    <button onClick={this.check.bind(this)} id="saving_button" className="btn btn-primary"><span>Confirm</span> </button>
                                </div>



                            </div></div>
                    </div>
                </div>
            </div >
        )
    }
}