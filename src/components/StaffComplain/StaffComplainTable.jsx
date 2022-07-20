import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import DatePicker from 'react-datetime';
import moment from "moment";
import { getFirstDayOfMonth } from '../../utils/CommonFunction';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');

$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');


export default class StaffComplainTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: props.data,
            selectedRequest: '',
            s_date: moment(getFirstDayOfMonth()),
            e_date: moment()
        }
    }
    componentDidMount() {
        this.$el = $(this.el);

        this.setState({
            dataSource: this.props.data
        }, () => {
            this.search()
        });

        let that = this;
        $("#dataTables-table").on('click', '#toView', function () {

            var data = $(this).find("#view").text();
            data = $.parseJSON(data);
            that.props.goToViewForm(data);

        });

        // $("#dataTables-table").on('click', '#toEdit', function () {

        //     var data = $(this).find("#edit").text();
        //     data = $.parseJSON(data);

        //     that.props.goToEditForm(data);

        // });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                dataSource: this.props.data
            }, () => {
                this.search();

            })
        }
    }

    _setTableData = (data) => {
        var table;

        var l = [];
        var status;
        var anonymous;
        for (var i = 0; i < data.length; i++) {
            let result = data[i];
            let obj = [];
            if (result.isAnonymous === 1) {
                anonymous = '<img src="assets/img/checked.svg"  style="width:20px;"></img>'
            }
            if (result.isAnonymous === 0) {
                anonymous = '<img src="assets/img/cancel.svg"  style="width:20px;"></img>'
            }
            if (result.status === 0) {
                status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'

            }
            else if (result.status === 1) {
                status = '<small class="label label-warning" style="background-color:#b33ce0"> Check By </small>'
            }
            else if (result.status === 2) {
                status = '<small class="label label-warning" style="background-color:#f2a509"> Approve By </small>'
            }
            else if (result.status === 3) {
                status = '<small class="label label-warning" style="background-color:#29a50a"> Verify By </small>'
            }
            else if (result.status === 4) {

                status = '<small class="label label-warning" style="background-color:#f60e2f"> Reject By </small>'
            }
            obj = {
                no: i + 1,
                isAnonymous: anonymous,
                case_date: moment(data[i].case_date).format('DD-MM-YYYY'),
                case_time: moment(data[i].case_time).utc().format('h:mm a'),
                complain_text: data[i].complain_text,
                status: status,
                action: result.status === 0 || result.status === 4 ?
                    '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' 
                    :
                    '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>'
            }

            l.push(obj)

        }
        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty();
        }

        table = $("#dataTables-table").DataTable({

            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            paging: true,
            // buttons: true,
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf'
            ],

            data: l,
            columns: [
                { title: "No", data: "no" },
                { title: "Anonymous", data: "isAnonymous" },
                { title: "Case Date", data: "case_date" },
                { title: "Case Time", data: "case_time" },
                { title: "Complain Text", data: "complain_text" },
                { title: "Status", data: "status" },
                { title: "Action", data: "action" }
            ],
        });

    }

    handleStartDate = (event) => {
        this.setState({
            s_date: event
        });
    };

    handleEndDate = (event) => {
        this.setState({
            e_date: event
        });
    };
    search() {
        let data = this.state.dataSource;
        let s_date = moment(this.state.s_date).format('YYYY-MM-DD');
        let e_date = moment(this.state.e_date).format('YYYY-MM-DD');
        data = data.filter(d => { return d.case_date >= s_date && d.case_date <= e_date })
        this._setTableData(data);
    }

    render() {
        return (

            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>HR Management System</h2>
                        <ol className="breadcrumb">
                            <li>
                                Staff Complain
                                </li>

                        </ol>
                    </div>
                    <div className="col-lg-2" style={{ marginTop: 20 }}>

                        <button className="btn btn-primary" onClick={this.props.addStaffComplain}>Add New</button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div><label className="col-sm-12">Start Date</label></div>
                        <div className="col-md-10">
                            <DatePicker
                                dateFormat="DD/MM/YYYY"
                                value={this.state.s_date}
                                onChange={this.handleStartDate}
                                timeFormat={false}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div><label className="col-sm-12">End Date</label></div>
                        <div className="col-md-10">
                            <DatePicker
                                dateFormat="DD/MM/YYYY"
                                value={this.state.e_date}
                                onChange={this.handleEndDate}
                                timeFormat={false}
                            />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="col-md-10 margin-top-20">
                            <button type='button' className='btn btn-primary' onClick={this.search.bind(this)} >Search</button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="row">
                    <div className="col-md-12">
                        <table width="99%"
                            className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                            id="dataTables-table"
                        />
                    </div>
                </div>
            </div >
        )
    }
}