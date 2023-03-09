import React, { Component } from "react";
import { main_url, getFirstDayOfMonth,getUserId, } from '../../utils/CommonFunction';
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
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');


class StaffLoanSummaryReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            s_date: moment(getFirstDayOfMonth()),
            e_date: moment(),
            region: 0,
            branch: 0,
            department: 0,
            selected_user_id: 0,
            attendance_type: 0,
            attendance_status: 0,
            attendance_att_type: 0,
            attendance_reason:'',
            status: 0,
            EmployeeNameList:[],
            designationList:[],
            regionList: [],
            departmentlist: [],
            branchlist: [],
            attTypeList: [],
            attStatusList: [],
            statusList: [{
                value: -1,
                label: 'All'
            },{
                value: 0,
                label: 'Request'
            },
            {
                value: 1,
                label: 'Approve'
            },
            {
                value: 2,
                label: 'Reject'
            }],
            selected_region: null,
            selected_department: null,
            selected_branch: null,
            selected_designation:'',
            selected_att_type: null,
            selected_att_status: null,
            selected_status: null,
            user_id: getUserId("user_info"),
        }
    }

    async componentDidMount() {
        this.getRegionList()
        this.getDepartmentList()
        this.getBranchList()
        this.getDesignationList()
        this.handleSearchData()

    }

    getDesignationList() {
      fetch(`${main_url}main/getDesignations`)
        .then((res) => {
          if (res.ok) return res.json();
        })
        .then((list) => {
          let lists = list.unshift({ value: 0, label: "All" });
          this.setState({
            designationList: list
          });
        });
    };

    getRegionList() {
        fetch(`${main_url}benefit/getRegionList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                let lists = list.unshift({ state_id: 0, state_name: 'All' })
                this.setState({
                    regionList: list.map(v => ({ ...v, label: v.state_name, value: v.state_id }))
                })
            })
    }

    getDepartmentList() {
        fetch(`${main_url}benefit/getDepartmentList`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((list) => {
                let lists = list.unshift({ departments_id: 0, deptname: 'All' })
                this.setState({
                    departmentlist: list.map((v) => ({
                        ...v,
                        label: v.deptname,
                        value: v.departments_id,
                    })),
                });
            });
    }
    getBranchList() {
        fetch(`${main_url}benefit/getBranchList`)
            .then((res) => {
                if (res.ok) return res.json();
            })
            .then((list) => {
                let lists = list.unshift({ value: 0, label: 'All' })
                this.setState({
                    branchlist: list.map((v) => ({
                        ...v,

                    })),
                });
            });
    }

    handleSelectedRegion = (event) => {
        if (event !== null)
            this.setState({
                selected_region: event,
            });
    };

    handleSelectedDeaprtment = (event) => {
        if (event !== null)
            this.setState({
                selected_department: event,
            },()=>{console.log("wer",this.state.selected_department)});
    };

    handleSelectedBranch = (event) => {
        if (event !== null)
            this.setState({
                selected_branch: event,
            },()=>{console.log("wer",this.state.selected_branch)});
    };

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

    handleSelectedDesignation = async (event) => {
      if (event != null)
        this.setState({
          selected_designation: event
        })
    };

    // async attendanceReport() {
    //     let start_date = moment(this.state.s_date).format('YYYY-MM-DD')
    //     let end_date = moment(this.state.e_date).format('YYYY-MM-DD')
    //     await fetch(`${main_url}attendance/attendanceReport/${this.state.user_id}/${this.state.region}/${this.state.branch}/${this.state.department}/${this.state.selected_user_id}/${this.state.attendance_att_type}/${this.state.attendance_status}/${this.state.attendance_reason ? this.state.attendance_reason : 0}/${this.state.status}/${start_date}/${end_date}`)
    //         .then((res) => {
    //             if (res.ok) return res.json();
    //         })
    //         .then((list) => {
    //             this.setState({ data: list },()=>{
    //             this._setTableData(list);   
    //             })
    //         })
    // }
    handleSearchData = () => {
        let start_date = moment(this.state.s_date).format('YYYY-MM-DD')
        let end_date = moment(this.state.e_date).format('YYYY-MM-DD')
        let region = this.state.selected_region ? this.state.selected_region.state_id : 0
        let branch = this.state.selected_branch? this.state.selected_branch.value : 0
        let department = this.state.selected_department ? this.state.selected_department.value : 0
        let designation = this.state.selected_designation ? this.state.selected_designation: 0
        // ${this.state.selected_designation ? this.state.selected_designation.value : 0}

        //delete
        let user_id = this.state.selected_selected_employee_name ? this.state.selected_selected_employee_name.value :0
        let attendance_status = this.state.selected_att_status ? this.state.selected_att_status.value : 0
        let attendance_att_type =  this.state.selected_att_type ? this.state.selected_att_type.value :0
        let status = this.state.selected_status ? this.state.selected_status.value : -1
        let attendance_reason=this.state.attendance_reason ? this.state.attendance_reason : 0
        //delete
         fetch(`${main_url}attendance/attendanceReport/${this.state.user_id}/${region}/${branch}/${department}/${user_id}/${attendance_att_type}/${attendance_status}/${attendance_reason}/${status}/${start_date}/${end_date}`)
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
                let status = "";
                let check_out_status = "";
                let obj = [];
                if(result.status == 0 && result.late_checkin == 1 && result.late_checkin_reason == null){
                    console.log('not request',i)
                    status='<small class="label label-warning" style="background-color:#509aed"> Not Request </small>';
                }
                else if (result.status === 0) {
                    console.log('check in request',i)
                    status =
                        '<small class="label label-warning" style="background-color:#509aed"> Request </small>';
                } else if (result.status === 1) {
                    status =
                        '<small class="label label-warning" style="background-color:#29a50a"> Approve </small>';
                } else if (result.status === 2) {
                    status =
                        '<small class="label label-warning" style="background-color:#f60e2f"> Reject </small>';
                }

                if (result.check_out_status === 0) {
                    check_out_status =
                        '<small class="label label-warning" style="background-color:#509aed"> Request </small>';
                } else if (result.check_out_status === 1) {
                    check_out_status =
                        '<small class="label label-warning" style="background-color:#29a50a"> Approve </small>';
                } else if (result.check_out_status === 2) {
                    check_out_status =
                        '<small class="label label-warning" style="background-color:#f60e2f"> Reject </small>';
                }

                obj = {
                    no: i + 1,
                    date: moment(result.createdAt).format('YYYY/MM/DD'),
                    employee_id: result.employment_id,
                    employee_name: result.fullname ? result.fullname : '-',
                    designation: result.designations ? result.designations : '-',
                    branch: result.location_master_name,
                    // attendance_type: result.field_checkin == 1 || result.field_checkout ? 'Field' : result.holiday_checkin == 1 ? 'Holiday' : 'Normal',
                    check_in_time: result.check_in_time ? moment(result.check_in_time).utc().format('hh:mm A') : "-",
                    check_in_att_status: result.late_checkin == 1 ? 'Late Check In' : result.field_checkin == 1 ? 'Field Check In' : result.holiday_checkin == 1 ? 'Holiday Check In' : result.check_in_time ? 'Normal Check In' : '-',
                    check_in_att_reason: result.late_checkin_reason ? result.late_checkin_reason : result.visit_reason ? result.visit_reason : result.holiday_des ? result.holiday_des : '-',
                    check_in_status: (result.late_checkin == 1 && result.late_checkin_reason) || result.late_checkin == 1 ||  result.field_checkin == 1 || result.holiday_checkin == 1 ? status : '-',
                    check_in_lat : result.check_in_lat ? result.check_in_lat : "-",
                    check_in_lng : result.check_in_lng ? result.check_in_lng : "-",
                    check_out_time: result.check_out_time ?  moment(result.check_out_time).utc().format('hh:mm A') : "-",
                    check_out_lat : result.check_out_lat ? result.check_out_lat : "-",
                    check_out_long : result.check_out_lng ? result.check_out_lng : "-",
                    check_out_att_status: result.early_checkout == 1 ? 'Early Check Out' : result.field_checkout == 1 ? 'Field Check Out' : result.holiday_checkout == 1 ? 'Holiday Check Out' : result.check_out_time !=null ? 'Normal Check Out' :"-",
                    check_out_att_reason: result.early_checkout_reason ? result.early_checkout_reason : result.checkout_visit_reason ? result.checkout_visit_reason : '-',
                    check_out_status: result.early_checkout == 1 ||  result.field_checkout == 1 || result.holiday_checkout == 1 ? check_out_status : '-',
                    workingHour: result.WorkingHour,
                    status:result.incom_option ? result.incom_option ==1 ? "Attendance" : "Late" :"-"
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
            // { title: "No", data: "no" },
            // { title: "Total Staff", data: "date" },
            // { title: "Eligible Staff", data: "employee_id" },
            // { title: "Loan disbursement staff", data: "employee_name" },
            // { title: "Requested", data: "designation" },
            // { title: "Approved", data: "branch" },
            // { title: "Rejected", data: "attendance_type" },
            // { title: "Pending", data: "check_in_time" },
            // { title: "Approve Amount", data: "check_out_time" },
            { title: "No", data: "" },
            { title: "Total Staff", data: "" },
            { title: "Eligible Staff", data: "" },
            { title: "Loan disbursement staff", data: "" },
            { title: "Requested", data: "" },
            { title: "Approved", data: "" },
            { title: "Rejected", data: "" },
            { title: "Pending", data: "" },
            { title: "Approve Amount", data: "" },
        ]
        table = $("#dataTables-table").DataTable({

            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            pageLength: 50,
            paging: true,
            dom: 'Bfrtip',
            data: l,
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
                            title: 'Attendance Report',
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
                <h3 style={{ margin: 7 }}>Staff Loan Summary Report</h3>
                <div>
                    <div className="col-lg-3 col-md-3 col-sm-12">
                        <div style={{ paddingBottom: 10 }}>
                            Start Date
                        </div>

                        <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.s_date}
                            onChange={this.handleStartDate}
                            timeFormat={false}
                        />
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-12">
                        <div style={{ paddingBottom: 10 }}>
                            End Date
                        </div>

                        <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.e_date}
                            onChange={this.handleEndDate}
                            timeFormat={false}
                        />
                    </div>
                    <div
                        className="col-lg-3 col-md-3 col-sm-12"
                        style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
                    >
                        <div style={{ paddingBottom: 10 }}>Region</div>

                        <Select
                            options={this.state.regionList}
                            value={this.state.selected_region}
                            onChange={this.handleSelectedRegion.bind(this)}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>
                    <div
                        className="col-lg-3 col-md-3 col-sm-12"
                        style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
                    >
                        <div style={{ paddingBottom: 10 }}>Branch</div>

                        <Select
                            options={this.state.branchlist}
                            value={this.state.selected_branch}
                            onChange={this.handleSelectedBranch.bind(this)}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>
                    <div
                        className="col-lg-3 col-md-3 col-sm-12"
                        style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
                    >
                        <div style={{ paddingBottom: 10 }}>Designation</div>

                        <Select
                            options={this.state.designationList}
                            onChange={this.handleSelectedDesignation}
                            value={this.state.selected_designation}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>
                    <div
                        className="col-lg-3 col-md-3 col-sm-12"
                        style={{ marginBottom: 10, paddingLeft: 10, paddingRight: 10 }}
                    >
                        <div style={{ paddingBottom: 10 }}>Department</div>

                        <Select
                            options={this.state.departmentlist}
                            value={this.state.selected_department}
                            onChange={this.handleSelectedDeaprtment.bind(this)}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                        />
                    </div>
                    <div className="col-lg-3 col-md-3">
                        <div className="col-md-10 margin-top-20">
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={() => this.handleSearchData()}
                            >
                                Search
                            </button>
                        </div>
                    </div>
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

export default StaffLoanSummaryReport