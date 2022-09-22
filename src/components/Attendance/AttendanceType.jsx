import React, { Component } from "react";
import { main_url, getFirstDayOfMonth } from '../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import moment from "moment";
import Select from "react-select";
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');


class AttendanceType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            s_date: moment(getFirstDayOfMonth()),
            e_date: moment(),
            data: []
        }
    }

    async componentDidMount() {
        await this.getAttendanceType()
        // await this._setTableData(this.state.data)
    }

    async getAttendanceType() {
        let start_date = moment(this.state.s_date).format('YYYY-MM-DD')
        let end_date = moment(this.state.e_date).format('YYYY-MM-DD')
        await fetch(`${main_url}attendance/getLateOrEarlyAttendance/${start_date}/${end_date}/0/0/0/0`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((list) => {
                this.setState({ data: list }, () => {
                    this._setTableData(list);
                })
            })
    }

    _setTableData = async (data) => {
        var table;
        var l = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                let result = data[i];
                console.log('data i is =====>', result)
                let obj = [];
                obj = {
                    no: i + 1,
                    employee_name: result.fullname ? result.fullname : '',
                    // employee_name: 'Hein Min Htet',
                    designation: result.designations ? result.designations : '',
                    attendance_type: result.field_checkout == 1 ? 'Field Check Out' : null,
                    attendance_date: result.createdAt ? moment(result.createdAt).format('YYYY-MM-DD') : '',
                    attendance_time: result.check_out_time ? moment(result.check_out_time).format('hh:mm A') : '',
                    location: null,
                    reason: result.checkout_remark ? result.checkout_remark : '',
                    status: result.status ? result.status : ''
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
            { title: "Employee Name", data: "employee_name" },
            { title: "Designation", data: "designation" },
            { title: "Attendance Type", data: "attendance_type" },
            { title: "Attendance Date", data: "attendance_date" },
            { title: "Attendance Time", data: "attendance_time" },
            { title: "Location", data: "location" },
            { title: "Reason", data: "reason" },
            { title: "Status", data: "status" }

        ]
        table = $("#dataTables-table").DataTable({

            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            pageLength: 50,
            paging: true,
            //     // buttons: true,
            dom: 'Bfrtip',
            //     // buttons: [
            //     //     'copy', 'csv', 'excel', 'pdf'
            //     // ],
            buttons: [
                //         // 'copy',
                //         // {
                //         //         extend: 'csvHtml5',
                //         //         title: 'Child Benefit',
                //         // },
                //         // {
                //         //     extend: 'excelHtml5',
                //         //     title: 'Child Benefit',
                //         // },
                //         // {
                //         //     extend: 'pdfHtml5',
                //         //     title: 'Child Benefit',
                //         // }
            ],
            data: l,
            columns: column
        });
    }

    render() {
        return (
            <div>
                <div>
                    <h2>Attendance Type</h2>
                    <ul className="nav nav-tabs tab" role="tablist" id="tab-pane">
                        <li className="nav-item active">
                            <a className="nav-link active" href="#attendance_type" role="tab" data-toggle="tab" aria-selected="true" onClick={() => console.log('click 1')}>Late Check In Request</a>
                        </li>
                        <li className="nav-item1 ">
                            <a className="nav-link " href="#attendance_type" role="tab" data-toggle="tab" onClick={() => console.log('click 2')}>Field Check In Request</a>
                        </li>
                        <li className="nav-item1 ">
                            <a className="nav-link " href="#attendance_type" role="tab" data-toggle="tab" onClick={() => console.log('click 3')}>Early Check Out Request</a>
                        </li>
                        <li className="nav-item1 ">
                            <a className="nav-link " href="#attendance_type" role="tab" data-toggle="tab" onClick={() => console.log('click 4')}>Field Check Out Request</a>
                        </li>
                    </ul>
                </div>
                <div>
                    <table width="99%"
                        className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                        id="dataTables-table"
                    />
                </div>
            </div>
        )
    }


}

export default AttendanceType