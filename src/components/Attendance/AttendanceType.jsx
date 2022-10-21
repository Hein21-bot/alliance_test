import React, { Component } from "react";
import { main_url, getFirstDayOfMonth,getUserId } from '../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import moment from "moment";
import Rodal from 'rodal';
import { ToastContainer, toast } from 'react-toastify';
import Select from "react-select";
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import { data } from "browserslist";
import AttendanceRequestView from "./AttendanceRequestView";
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
            data: [],
            attendance_type: 'late_check_in',
            checkboxAll: false,
            checkedListData: [],
            visible: false,
            rejected_comment: '',
            datasource:[],
            isView:false,
            user_id: getUserId("user_info"),
        }
    }

    async componentDidMount() {
        await this.getAttendanceType(this.state.attendance_type)
        // await this.checkBoxAll()

        let that = this;
        $("#dataTables-table").on('click', '#toView', function () {

            var data = $(this).find("#view").text();
            data = $.parseJSON(data);
            // alert(JSON.stringify(data,2,undefined));
            that.goToViewForm(data);

        });
        $("#dataTables-table").on('click', '#toSelect', function () {

            var data = $(this).find("#select").text();
            data = $.parseJSON(data);
            that.handleCheckBoxChange(data);
            // var selectEle = $(this).find("#check1");

        });

        // $.on('click', '#check1', function () {

        //     var selectEle = $(this).find("#check1");
        //     console.log(selectEle,"select element")

        // });

    }
    goToViewForm = (data) => {
        console.log("ggggggg");
        this.setState({
            
            isView: true,
            datasource: data
        })
    }


    handleCheckBoxChange = async (newData) => {
        const { checkedListData } = this.state;
        const checkedListData_ = [...checkedListData];
        if (checkedListData_.length === 0) {
            checkedListData_.push(newData);
            this.setState({ checkedListData: checkedListData_ });
        } else if (
            checkedListData_.filter((c) => c.id === newData.id).length > 0
        ) {
            for (var i = 0; i < checkedListData_.length; i++) {
                if (checkedListData_[i].id == newData.id) {
                    checkedListData_.splice(i, 1);
                }
            }
            this.setState({
                checkedListData: checkedListData_,
            });
        } else {
            checkedListData_.push(newData);
            this.setState({
                checkedListData: checkedListData_,
            });
        }
    };

    handleCheckboxAll = async (e) => {
        this.setState({ checkboxAll: e }, () => {
            if (e) {
                $('.ipSelect').prop('checked', true);

            } else {
                $('.ipSelect').prop('checked', false);
            }
        })
        if (e == true) {
            this.setState({ checkedListData: this.state.data });
        } else {
            this.setState({ checkedListData: [] });
        }
    }

    async getAttendanceType(type) {
        this.setState({ attendance_type: type, checkedListData: [] })
        let check_in = 0
        let field_in = 0
        let check_out = 0
        let field_out = 0
        if (type == 'late_check_in') {
            check_in = 1
        }
        if (type == 'field_check_in') {
            field_in = 1
        }
        if (type == 'early_check_out') {
            check_out = 1
        }
        if (type == 'field_check_out') {
            field_out = 1
        }
        let start_date = moment(this.state.s_date).format('YYYY-MM-DD')
        let end_date = moment(this.state.e_date).format('YYYY-MM-DD')
        await fetch(`${main_url}attendance/getLateOrEarlyAttendance/${this.state.user_id}/${start_date}/${end_date}/${check_in}/${field_in}/${check_out}/${field_out}`)
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

    handleVisible = (title) => {
        this.setState({ visible: true })
    };

    hide() {
        this.setState({ visible: false });
    }

    _setTableData = async (data) => {
        var table;
        var l = [];
        if (data) {
            for (var i = 0; i < data.length; i++) {
                let result = data[i];
                let status = "";
                let obj = [];
                // var has_select = true
                if (this.state.attendance_type == 'early_check_out' || this.state.attendance_type == 'field_check_out' ? result.check_out_status == 0 : result.status === 0) {
                    status =
                        '<small class="label label-warning" style="background-color:#509aed"> Request </small>';
                } else if (this.state.attendance_type == 'early_check_out' || this.state.attendance_type == 'field_check_out' ? result.check_out_status == 1 : result.status === 1) {
                    status =
                        '<small class="label label-warning" style="background-color:#29a50a"> Approve </small>';
                } else if (this.state.attendance_type == 'early_check_out' || this.state.attendance_type == 'field_check_out' ? result.check_out_status == 2 : result.status === 2) {
                    status =
                        '<small class="label label-warning" style="background-color:#f60e2f"> Reject </small>';
                }
                obj = {
                    no: i + 1,
                    employee_name: result.fullname ? result.fullname : '',
                    designation: result.designations ? result.designations : '',
                    attendance_type: this.state.attendance_type == 'late_check_in' ? 'Late Check In' : this.state.attendance_type == 'field_check_in' ? 'Field Check In' : this.state.attendance_type == 'early_check_out' ? 'Early Check Out' : 'Field Check Out',
                    attendance_date: result.createdAt ? moment(result.createdAt).format('YYYY-MM-DD') : '',
                    attendance_time: this.state.attendance_type == 'early_check_out' || this.state.attendance_type == 'field_check_out' ? moment(result.check_out_time).utc().format('hh:mm A') : moment(result.check_in_time).utc().format('hh:mm A'),
                    location: this.state.attendance_type == 'late_check_in' ? '' : this.state.attendance_type == 'field_check_in' ? result.visit_location : this.state.attendance_type == 'early_check_out' ? '' : result.checkout_visit_location,
                    reason: this.state.attendance_type == 'late_check_in' ? (result.late_checkin_reason ? result.late_checkin_reason : '') : this.state.attendance_type == 'field_check_in' ? result.visit_reason : this.state.attendance_type == 'early_check_out' ? result.early_checkout_reason : result.checkout_visit_reason,
                    status: status
                }
                // if (has_select) {
                obj.select = `<div style="alignItems:center" id="toSelect" class="select-btn"  ><input class="ipSelect"  type="checkbox" /><span id="select" class="hidden" >` + JSON.stringify(result) + '</span>  </div>' //'<div style="margin-right:0px;height:20px;width:20px;border:1px solid red" class="btn" id="toSelect" ><i className="fas fa-address-card" style="color:red"></i><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  </div>' : '';
                // }
                obj.action = '<button style="margin-right:10px; background-color:#27568a" class="btn btn-primary btn-sm own-btn-edit " id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>';


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
        column.push({title:"Action",data:"action"})
        // if (has_select) {
        column.splice(1, 0, { title: "Select", data: "select" })
        // }
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
                            title: 'Attendance Request',
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
        let saveData = []
        this.state.checkedListData.map((v, i) => {
            var obj = { ...v }
            obj[this.state.attendance_type == 'early_check_out' || this.state.attendance_type == 'field_check_out' ? 'check_out_status' : 'status'] = 1
            saveData.push(obj)
        })

        fetch(`${main_url}attendance/editApproveOrReject`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `data=${JSON.stringify(saveData)}`,

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

        let saveData = []
        this.state.checkedListData.map((v, i) => {
            var obj = { ...v }
            obj[this.state.attendance_type == 'early_check_out' || this.state.attendance_type == 'field_check_out' ? 'check_out_status' : 'status'] = 2
            obj['comment'] = this.state.rejected_comment
            saveData.push(obj)
        })

        fetch(`${main_url}attendance/editApproveOrReject`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `data=${JSON.stringify(saveData)}`
        })
            .then(res => {
                status = res.status;
                return res.text()
            })
            .then(text => {
                this.showToast(status, text);
                this.hide()
            })

    }

    showToast = (status, text) => {

        if (status === 200) {
            toast.success(text);
            this.getAttendanceType(this.state.attendance_type)
        }
        else {
            toast.error(text);
        }

    }

    render() {
        return (
            
            <div>
                {
                this.state.isView ?
                    <AttendanceRequestView data={this.state.datasource} isView={this.state.isView} /> : 
                    <div className="row border-bottom white-bg dashboard-header">
                    <div >
                        <div className="row" style={{ marginBottom: 10 }}>
                            <h3 style={{ margin: 7 }}>Attendance Request</h3>
                            <ul className="nav nav-tabs tab" role="tablist" id="tab-pane">
                                <li className="nav-item active">
                                    <a className="nav-link active" href="#attendance_type" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.getAttendanceType('late_check_in')}>Late Check In Request</a>
                                </li>
                                <li className="nav-item1 ">
                                    <a className="nav-link " href="#attendance_type" role="tab" data-toggle="tab" onClick={() => this.getAttendanceType('field_check_in')}>Field Check In Request</a>
                                </li>
                                <li className="nav-item1 ">
                                    <a className="nav-link " href="#attendance_type" role="tab" data-toggle="tab" onClick={() => this.getAttendanceType('early_check_out')}>Early Check Out Request</a>
                                </li>
                                <li className="nav-item1 ">
                                    <a className="nav-link " href="#attendance_type" role="tab" data-toggle="tab" onClick={() => this.getAttendanceType('field_check_out')}>Field Check Out Request</a>
                                </li>
                            </ul>
                        </div>

                        <div className="col-md-12">
                            <div className="col-md-3">
                                <div>
                                    <label className="col-sm-12">Start Date</label>
                                </div>
                                <div className="col-md-10">
                                    <DatePicker
                                        dateFormat="DD/MM/YYYY"
                                        value={this.state.s_date}
                                        onChange={this.handleStartDate}
                                        timeFormat={false}
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div>
                                    <label className="col-sm-12">End Date</label>
                                </div>
                                <div className="col-md-10">
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
                                        onClick={() => this.getAttendanceType(this.state.attendance_type)}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12" style={{ height: 0.1, backgroundColor: 'gray', marginTop: 30 }}>
                        </div>
                        <div className="col-lg-12 col-md-12" style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                            <div style={{ width: '20%' }}>
                                <label>
                                    <input type={'checkbox'}
                                        onChange={() => this.handleCheckboxAll(!this.state.checkboxAll)}
                                    />
                                    Select All
                                </label>
                            </div>
                            <div
                                style={{ width: '80%', display: 'flex', justifyContent: 'flex-end', marginBottom: 5, paddingRight: 5 }}
                            >
                                <button
                                    className="btn btn-primary"
                                    style={{ borderRadius: 3, width: 80, marginRight: 15 }}
                                    onClick={() => this.approveSave()}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => this.handleVisible('extension')}
                                    className="btn btn-danger"
                                    style={{ borderRadius: 3, width: 90 }}
                                >
                                    Reject
                                </button>
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
                </div>
                }
                
            </div>
        )
    }


}

export default AttendanceType