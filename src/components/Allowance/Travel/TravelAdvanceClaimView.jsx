import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'
import ApprovalInformation from '../../Common/ApprovalInformation';
import DocumentList from '../../Common/DocumentList';
import { main_url, fno } from '../../../utils/CommonFunction';
import moment from "moment";
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

export default class TravelAdvanceClaimView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advancedData: props.data.advancedData,
            claimDetailData: props.data.claimDetail,
            claimData: props.data.claimData,
            document: props.data.document,
            status_info: []
        }
    }
    getStatusInfo() {

        fetch(`${main_url}allowance/getTravelDetailInfo/${this.state.claimData[0].travel_allowance_id}`)
            .then(res => res.json())
            .then(res => {

                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.log(error))
    }

    async componentDidMount() {
        this.getStatusInfo();
        this._setTableData(this.props.data.claimDetail);

    }

    _setTableData(data) {


        var table;
        if ($.fn.dataTable.isDataTable('#dataTables-claimTable')) {
            table = $('#dataTables-claimTable').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-claimTable').empty()
        }
        var l = []
        for (var i = 0; i < data.length; i++) {
            const obj = {
                actualDate: moment(data[i].actual_date).format('DD-MM-YYYY'),
                startLoc: data[i].start_location,
                destination: data[i].destination,
                startTime: moment(data[i].start_time).format('hh:mm A'),
                endTime: moment(data[i].end_time).format('hh:mm A'),
                noOfDays: data[i].noOfDays,
                noOfNights: data[i].noOfNights,
                meals: data[i].meals,
                lodging: data[i].lodging,
                transport: data[i].transport,
                amount: data[i].amount,
                purpose: data[i].purpose
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
                { title: "Purpose", data: "purpose" }
            ],
        });

    }


    render() {
        return (
            <div className="row wrapper border-bottom white-bg">
                <div className="row margin-top-20">

                    <div className="form-horizontal" name="demo-form">

                        <div className="col-md-6">

                            <div><label className="col-sm-12" >Request Type<span className="text-danger">*</span></label></div>
                            <div className="col-sm-10">

                                <input
                                    className="form-control input-md"
                                    value="Claim"

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
                                        <label>Total A   mount</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advancedData[0].advanced_amount}

                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <label>Purpose</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            disabled
                                            value={this.state.advancedData[0].purpose}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <div className="ownspacing"></div>
                            <h4 >Claim Information</h4>
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
                                        value={this.state.claimData[0].purpose}


                                    />
                                </div> */}
                            <div className="col-md-3">
                                <label>Advanced Amount</label>
                                <input
                                    className="form-control"
                                    value={this.state.advancedData[0].advanced_amount}


                                />
                            </div>
                            <div className="col-md-3">
                                <label>Actual Amount </label>
                                <input
                                    className="form-control"

                                    value={this.state.claimData[0].actual_amount}

                                />
                            </div>
                            <div className="col-md-3">
                                <label>Settle Amount</label>
                                <input
                                    className="form-control"

                                    value={this.state.claimData[0].settle_amount}

                                />
                            </div>
                            <div className="col-md-3">
                                <label>Withdraw Location</label>
                                <input
                                    className="form-control"

                                    value={this.state.claimData[0].withdraw_location_name}

                                />
                            </div>
                        </div>
                    </div>


                </div>

                <div className="row document-main">
                    {
                        this.state.document.length > 0 ?
                            <DocumentList title='Travel Document' doc={this.state.document} path='travel' />
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
        )
    }


}