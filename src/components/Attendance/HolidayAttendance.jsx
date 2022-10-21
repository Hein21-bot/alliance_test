import React, { Component } from "react";
import { main_url, getFirstDayOfMonth,getUserId } from '../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import moment from "moment";
import Rodal from 'rodal';
import Select from "react-select";
import { ToastContainer, toast } from 'react-toastify';
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

class HolidayAttendance extends Component {
    constructor(props) {
        super(props);
        this.state = {
            s_date: moment(getFirstDayOfMonth()),
            e_date: moment(),
            data: [],
            visible: false,
            visibleApprove: false,
            rejected_comment: '',
            approve_data: [],
            leave_allow_day: 0,
            user_id: getUserId("user_info"),
        }
    }

    async componentDidMount() {
        await this.getHolidayAttendance()

        let that = this
        // $("#dataTables-table").on('click', '#toView', function () {

        //     var data = $(this).find("#view").text();
        //     data = $.parseJSON(data);

        // });

        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            that.handleVisible(data)

        });

        $("#dataTables-table").on('click', '#toEditApprove', function () {

            var data = $(this).find("#editApprove").text();
            data = $.parseJSON(data);
            that.handleVisibleApprove(data)

        });
    }
    async getHolidayAttendance() {
        let start_date = moment(this.state.s_date).format('YYYY-MM-DD')
        let end_date = moment(this.state.e_date).format('YYYY-MM-DD')
        await fetch(`${main_url}attendance/getHolidayCheckIn/${this.state.user_id}/${start_date}/${end_date}`)
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

    handleVisible = (data) => {
        this.setState({ visible: true, approve_data: data })
    };

    handleVisibleApprove = (data) => {
        this.setState({ visibleApprove: true, approve_data: data })
    }

    hide() {
        this.setState({ visible: false });
    }

    hideApprove() {
        console.log('here ===>')
        this.setState({ visibleApprove: false });
    }

    _setTableData = async (data) => {
        var table;
        var l = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                let result = data[i];
                let status = "";
                let obj = [];
                if (result.status === 0) {
                    status =
                        '<small class="label label-warning" style="background-color:#509aed"> Request </small>';
                } else if (result.status === 1) {
                    status =
                        '<small class="label label-warning" style="background-color:#29a50a"> Approve </small>';
                } else if (result.status === 2) {
                    status =
                        '<small class="label label-warning" style="background-color:#f60e2f"> Reject </small>';
                }
                obj = {
                    no: i + 1,
                    employee_name: result.fullname ? result.fullname : '',
                    designation: result.designations ? result.designations : '',
                    attendance_date: moment(result.createdAt).format('DD/MM/YYYY'),
                    check_in_time: result.check_in_time ? moment(result.check_in_time).utc().format('hh:mm A') : '',
                    check_out_time: result.check_out_time ? moment(result.check_out_time).utc().format('hh:mm A') : '',
                    working_hour: result.WorkingHour ? result.WorkingHour : '',
                    reason: result.holiday_des,
                    status: status
                } 
                if(result.status === 0){
                obj.action = '<button style="margin-right:10px; background-color:#29a50a" class="btn btn-success btn-sm own-btn-edit " id="toEditApprove" ><span id="editApprove" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Approve</button>';
                obj.action += '<button style="margin-right:10px" class="btn btn-danger btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Reject</button>';
                } else{
                    obj.action = '<button style="margin-right:10px; background-color:#29a50a" class="btn btn-success btn-sm own-btn-edit disabled" id="toEditApprove" ><span id="editApprove" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Approve</button>';
                obj.action += '<button style="margin-right:10px" class="btn btn-danger btn-sm own-btn-edit disabled" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Reject</button>';
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
            { title: "Attendance Date", data: "attendance_date" },
            { title: "Check In Time", data: "check_in_time" },
            { title: "Check Out Time", data: "check_out_time" },
            { title: "Working Hour", data: "working_hour" },
            { title: "Reason", data: "reason" },
            { title: "Status", data: "status" }

        ]
        column.push({ title: "Action", data: "action" })

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
                            title: 'Holiday Attendance ',
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

    approveSave() {
        let status = 0;
        this.state.approve_data.leave_allow_day = this.state.leave_allow_day
        this.state.approve_data.status = 1
        this.state.approve_data.check_out_status = 1
        fetch(`${main_url}attendance/editHolidayReq/` + this.state.approve_data.id, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `data=${JSON.stringify(this.state.approve_data)}`,

        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                this.showToast(status, text);
            })

    }

    rejectSave() {
        let status = 0;
        this.state.approve_data.comment = this.state.rejected_comment
        this.state.approve_data.status = 2
        this.state.approve_data.check_out_status = 2
        fetch(`${main_url}attendance/editHolidayReq/` + this.state.approve_data.id, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `data=${JSON.stringify(this.state.approve_data)}`,

        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                this.showToast(status, text);
            })

    }

    showToast = (status, text) => {

        if (status === 200) {
            toast.success(text);
            window.location.reload();
        }
        else {
            toast.error(text);
        }

    }

    render() {
        console.log('approve data is ====>', this.state.approve_data)
        return (
            <div>
                <div className="row border-bottom white-bg dashboard-header">
                    <div >
                        <div className="row" style={{ marginBottom: 10 }}>
                            <h3 style={{ margin: 7 }}>Holiday Attendance</h3>
                        </div>

                        <div className="col-md-12" style={{padding:0,marginBottom:10}}>
                            <div className="col-md-3" style={{padding:0}}>
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
                                        onClick={() => this.getHolidayAttendance()}
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
                    <Rodal width={500} height={150} visible={this.state.visible} onClose={this.hide.bind(this)} >
                        <div className="col-md-12 ">
                            <h4>Reject Comment</h4>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 30 }}>
                            <div className="col-md-3">Comment :</div>
                            <div className="col-md-7">
                                <input type="text" className="full_width" onChange={(e) => this.setState({ rejected_comment: e.target.value })}></input>
                            </div>
                            <div className="col-md-2 btn-rightend" >

                                <button className="btn btn-primary" onClick={() => this.rejectSave()}><span>Submit</span> </button>

                            </div>
                        </div>

                    </Rodal>

                    <Rodal width={500} height={350} visible={this.state.visibleApprove} onClose={this.hideApprove.bind(this)} >
                        <div>
                            <h3>Approve</h3>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4">Employee Name :</div>
                            <div className="col-md-8">
                                {this.state.approve_data.fullname}
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4">Designations :</div>
                            <div className="col-md-8">
                                {this.state.approve_data.designations}
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4">Attendance Date :</div>
                            <div className="col-md-8">
                                {moment(this.state.approve_data.createdAt).format('DD/MM/YYYY')}
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4">Check In Time :</div>
                            <div className="col-md-8">
                                {moment(this.state.approve_data.check_in_time).utc().format('hh:mm A')}
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4">Check Out Time :</div>
                            <div className="col-md-8">
                                {moment(this.state.approve_data.check_out_time).utc().format('hh:mm A')}
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4">Working Hour :</div>
                            <div className="col-md-8">
                                {this.state.approve_data.WorkingHour}
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4">Reason :</div>
                            <div className="col-md-8">
                                {this.state.approve_data.holiday_des}
                            </div>
                        </div>
                        <div className="col-md-12" style={{ marginTop: 10 }}>
                            <div className="col-md-4">Leave Allow Day :</div>
                            <div className="col-md-8">
                                <input type="number" className="full_width" onKeyDown={(e) => ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()} onChange={(e) => this.setState({ leave_allow_day: e.target.value })}></input>
                            </div>

                        </div>
                        <div className="col-md-12" style={{ display: 'flex', justifyContent: 'right', marginTop: 20 }}>
                            <div className="col-md-2 btn-rightend" >
                                <button className="btn btn-primary" onClick={() => this.approveSave()}><span>Approve</span> </button>
                            </div>
                            <div className="col-md-2 btn-rightend" >
                                <button className="btn btn-danger" onClick={() => this.hideApprove()}><span>Cancel</span> </button>
                            </div>
                        </div>

                    </Rodal>
                </div >
            </div >
        )
    }

}
export default HolidayAttendance