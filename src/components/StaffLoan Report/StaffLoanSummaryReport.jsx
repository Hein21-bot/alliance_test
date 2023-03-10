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
            designationList:[],
            regionList: [],
            departmentlist: [],
            branchlist: [],
            selected_region: null,
            selected_department: null,
            selected_branch: null,
            selected_designation:'',
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

    handleSearchData = () => {
        let start_date = moment(this.state.s_date).format('YYYY-MM-DD')
        let end_date = moment(this.state.e_date).format('YYYY-MM-DD')
        let region = this.state.selected_region ? this.state.selected_region.state_id : 0
        let branch = this.state.selected_branch? this.state.selected_branch.value : 0
        let department = this.state.selected_department ? this.state.selected_department.value : 0
        let designation = this.state.selected_designation ? this.state.selected_designation.value: 0
         fetch(`${main_url}staff_loan_new/summaryReport/${start_date}/${end_date}/${designation}/${department}/${branch}/${region}`)
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
                let obj = [];

                obj = {
                    no: i + 1,
                    total_staff: result.total_staff ? result.total_staff : '-',
                    eligible_staff: result.eligible_staff ? result.eligible_staff : '-',
                    loan_disbursement_staff: result.loan_disbursement_staff ? result.loan_disbursement_staff : '-',
                    request: result.request ? result.request : '-',
                    approve: result.approve ? result.approve : '-',
                    reject: result.reject ? result.reject : '-',
                    pending: result.pending ? result.pending : '-',
                    approve_amount: result.approve_amount ? result.approve_amount : '-',
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
            { title: "Total Staff", data: "total_staff" },
            { title: "Eligible Staff", data: "eligible_staff" },
            { title: "Loan disbursement staff", data: "loan_disbursement_staff" },
            { title: "Requested", data: "request" },
            { title: "Approved", data: "approve" },
            { title: "Rejected", data: "reject" },
            { title: "Pending", data: "pending" },
            { title: "Approve Amount", data: "approve_amount" },
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
                            title: 'Staff Loan Summary Report',
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