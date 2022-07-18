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

export default class TravelClaimRequestView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            claimDetailData: props.data.claimDetail,
            claimData: props.data.claimData,
            document: props.data.document,
            status_info: [],
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
        this._setTableData(this.props.data.claimDetail);
        this.getStatusInfo();
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
                actualDate: moment(data[i].actual_date).format("DD/MM/YYYY"),
                startLoc: data[i].start_location,
                destination: data[i].destination,
                startTime: moment(data[i].start_time).utc().format("h:mm a"),
                endTime: moment(data[i].end_time).utc().format("h:mm a"),
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
        let total_lodging = this.state.claimDetailData.map(v => v.lodging).reduce((accumulator, currentValue, currentIndex, array) => accumulator + currentValue)
        let total_meals = this.state.claimDetailData.map(v => v.meals).reduce((accumulator, currentValue, currentIndex, array) => accumulator + currentValue)
        let total_transport = this.state.claimDetailData.map(v => v.transport).reduce((accumulator, currentValue, currentIndex, array) => accumulator + currentValue)

        
        return (

            <div className="row wrapper border-bottom white-bg">
                <div className="row margin-top-20">

                    <div className="form-horizontal" name="demo-form">

                        <div className="col-md-12">
                            <div className="ibox float-e-margins">
                                <div className="ibox-content p-md">
                                    <h4>Claim Information</h4>
                                    <table width="99%"
                                        className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                                        id="dataTables-claimTable"
                                    />
                                </div></div>

                        </div>

                        <div className="col-md-12">
                            {/* <div className="col-md-2">
                                <label>Purpose</label>
                                <input
                                    className="form-control"
                                    value={this.state.claimData[0].purpose}
                                />
                            </div> */}

                            <div className="col-md-2">
                                <label>Total Amount </label>
                                <input
                                    className="form-control"
                                    value={this.state.claimData[0].actual_amount}
                                    disabled
                                />
                            </div>
                            <div className="col-md-2">
                                <label>Total Meals </label>
                                <input
                                    className="form-control"
                                    value={total_meals}
                                    disabled
                                />
                            </div>
                            <div className="col-md-2">
                                <label>Total Lodging </label>
                                <input
                                    className="form-control"
                                    value={total_lodging}
                                    disabled
                                />
                            </div>
                            <div className="col-md-2">
                                <label>Total Transport </label>
                                <input
                                    className="form-control"
                                    value={total_transport}
                                    disabled
                                />
                            </div>
                            <div className="col-md-4">
                                <label>Withdraw Location</label>
                                <input
                                    className="form-control"
                                    value={this.state.claimData[0].withdraw_location_name}

                                />
                            </div>

                            {/* @hmh */}
                            <div className="col-md-3">
                                <label>Branch</label>
                                <input
                                    className="form-control"
                                    value={this.props.data.claimData[0].branch_name}
                                    disabled

                                />
                            </div>
                            <div className="col-md-3">
                                <label>Name</label>
                                <input
                                    className="form-control"
                                    value={this.props.data.claimData[0].fullname}
                                    disabled

                                />
                            </div>
                            <div className="col-md-3">
                                <label>Position</label>
                                <input
                                    className="form-control"
                                    value={this.props.data.claimData[0].position}
                                    disabled

                                />
                            </div>
                            <div className="col-md-3">
                                <label>Voucher No</label>
                                <input
                                    className="form-control"
                                    value={fno.fno_travel + this.props.data.claimData[0].form_no}
                                    disabled

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