import React, { Component } from "react";
import { main_url, getFirstDayOfMonth, getUserId } from '../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import moment from "moment";
import Rodal from 'rodal';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import AlternativeLeave from './AlternativeLeave'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import { data } from "browserslist";
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

class AttendanceHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            s_date: moment(getFirstDayOfMonth()),
            e_date: moment(),
            user_id: localStorage.getItem("user_id"),
            alternative: 0,
            alternativeData: null,
            alter_id: null
        }
    }

    async componentDidMount() {
        await this.getAttendanceHistory()
        this.setState({ alternative: 0 })
        let that = this;
        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            that.setState({ alternative: 1, alternativeData: data, alter_id: data.id })

        });
        // window.location.reload();
    }

    async getAttendanceHistory() {
        let start_date = moment(this.state.s_date).format('YYYY-MM-DD')
        let end_date = moment(this.state.e_date).format('YYYY-MM-DD')
        await fetch(`${main_url}attendance/attendanceHistory/${this.state.user_id}/${start_date}/${end_date}`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((list) => {
                this.setState({ data: list }, () => {
                    this._setTableData(list);
                })
            })
    }

    handleStartDate = (event) => {
        this.setState({
            s_date: event,
        });
    };

    handleEndDate = (event) => {
        this.setState({
            e_date: event,
        });
    };

    _setTableData = async (data) => {
        var table;
        var l = [];
        var action = []
        if (data) {
            for (var i = 0; i < data.length; i++) {
                let result = data[i];
                let status = "";
                let obj = [];
                if (result.holiday_checkin == 0 && result.check_out_status == 0 && result.status == 0) {
                    status +=
                        '<small class="label label-warning" style="background-color:#509aed"> Request </small>';
                } else if (result.holiday_checkin == 1 && result.check_out_status == 1 && result.status == 1) {
                    status +=
                        '<small class="label label-warning" style="background-color:#29a50a"> Approve </small>';
                } else if (result.holiday_checkin == 1 && result.check_out_status == 1 && result.status == 2) {
                    status +=
                        '<small class="label label-warning" style="background-color:#f60e2f"> Reject </small>';
                }
                obj = {
                    no: i + 1,
                    date: moment(result.createdAt).format('YYYY-MM-DD'),

                    check_in_time: moment(result.check_in_time).utc().format('hh:mm A'),
                    check_out_time: moment(result.check_out_time).utc().format('hh:mm A'),
                    working_hour : result.working_hour ? result.working_hour : "-",

                    check_in_time:result.check_in_time ? moment(result.check_in_time).utc().format('hh:mm A') : '-',
                    check_out_time:result.check_out_time ? moment(result.check_out_time).utc().format('hh:mm A') : '-',

                    attendance_type_check_in: result.late_check_in == 1 ? 'Late Check In' : result.field_checkin == 1 ? 'Field Check In' : result.holiday_checkin ? 'Holiday Check In' : 'Normal Check In',
                    attendance_type_check_out: result.early_checkout == 1 ? 'Early Check Out' : result.field_checkout == 1 ? 'Field Check Out' : result.holiday_checkout == 1 ? 'Holiday Check Out' : 'Normal Check Out',
                    status: status,
                    action: result.holiday_checkin == 1 && result.check_out_status == 1 ? result.leave_status == 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" disabled><span id="edit" class="hidden" disabled>' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Applied </button>' : '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" disabled>' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Apply Leave</button>' : ''
                }

                if ((result.holiday_checkin == 1 || result.check_out_status == 1) && result.status == 1 && result.leave_allow_day > 0) {
                    action.push(i)
                }

                l.push(obj)
            }
        }
        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty();
        }
        var column = [
            { title: "No", data: "no" },
            { title: "Date", data: "date" },
            { title: "Check In Time", data: "check_in_time" },
            { title: "Check In Attendance Type ", data: "attendance_type_check_in" },
            { title: "Check Out Time", data: "check_out_time" }, 
            { title: "Check Out Attendance Type ", data: "attendance_type_check_out" },
            { title: "Working Hour", data: "working_hour" },
            { title: "Status", data: "status" },

        ]
        if (action.length > 0) {
            column.push({ title: "Action", data: "action" })
        }

        table = $("#dataTables-table").DataTable({

            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            pageLength: 50,
            paging: true,
            buttons: true,
            dom: 'Bfrtip',
                buttons: [
            //     //     'copy', 'csv',
             'excel',
            //  'pdf'
                ],
            buttons: [
                //         // 'copy',
                //         // {
                //         //         extend: 'csvHtml5',
                //         //         title: 'Child Benefit',
                //         // },
                        {
                            extend: 'excelHtml5',
                            title: 'Attendance History',
                        },
                //         // {
                //         //     extend: 'pdfHtml5',
                //         //     title: 'Child Benefit',
                        // }
            ],
            data: l,
            columns: column
        });
    }
    render() {
        return (
            <div>
                {this.state.alternative == 1 ? <AlternativeLeave data={this.state.alternativeData} id={this.state.alter_id} /> : <div className="row border-bottom white-bg dashboard-header">
                    <div >
                        <div className="row" style={{ marginBottom: 10 }}>
                            <h3 style={{ margin: 7 }}>Attendance History</h3>
                        </div>

                        <div className="col-md-12" style={{marginBottom:10,paddingLeft:0}} >
                            <div className="col-md-3"style={{padding:0,margin:0}}>
                                <div>
                                    <label className="col-sm-12"style={{padding:0}}>Start Date</label>
                                </div>
                                <div className="col-md-10"style={{padding:0}}>
                                    <DatePicker
                                        dateFormat="DD/MM/YYYY"
                                        value={this.state.s_date}
                                        onChange={this.handleStartDate}
                                        timeFormat={false}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3"style={{padding:0}}>
                                <div>
                                    <label className="col-sm-12"style={{padding:0}}>End Date</label>
                                </div>
                                <div className="col-md-10"style={{padding:0}}>
                                    <DatePicker
                                        dateFormat="DD/MM/YYYY"
                                        value={this.state.e_date}
                                        onChange={this.handleEndDate}
                                        timeFormat={false}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="col-md-10 margin-top-20">
                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={() => this.getAttendanceHistory()}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>

                        <table width="99%"
                            className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                            id="dataTables-table"
                        />
                    </div>
                </div>}
            </div>
        )
    }
}



export default AttendanceHistory