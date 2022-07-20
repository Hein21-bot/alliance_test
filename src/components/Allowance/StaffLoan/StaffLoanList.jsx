import React, { Component } from 'react';
import { main_url, getCookieData } from '../../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'
import moment from "moment";
const $ = require('jquery');
const jzip = require('jzip');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');

export default class StaffLoanList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: getCookieData("user_info"),
            staff_loan_list: this.props.data
        }
    }

    componentDidMount() {
        this.showTable(this.state.staff_loan_list)
        var that = this;
        $('#dataTables').on('click', '#toView', function () {
            var data = $(this).find('#view').text();
            data = $.parseJSON(data);
            that.props.goToViewForm(data);
        })

        $('#dataTables').on('click', '#toEdit', function () {
            var data = $(this).find('#edit').text();
            data = $.parseJSON(data);
            that.props.goToEditForm(data);
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                staff_loan_list: this.props.data
            }, () => {
                this.showTable(this.state.staff_loan_list);

            })
        }
    }

    showTable(data) {
        var table;
        var list = [];
        var obj, one = [];
        let status, action = '';
        var permission = this.props.permission;
        var has_action = permission.isView === 1 || permission.isEdit === 1 ? true : false;
        for (let i = 0; i < data.length; i++) {
            obj = data[i];
            status = '';
            action = '';
            if (obj.status === 0) {
                status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'

            }
            else if (obj.status === 1) {
                status = '<small class="label label-warning" style="background-color:#b33ce0"> Check  </small>'
            }
            else if (obj.status === 2) {
                status = '<small class="label label-warning" style="background-color:#f2a509"> Verify  </small>'
            }
            else if (obj.status === 3) {
                status = '<small class="label label-warning" style="background-color:#29a50a"> Approve  </small>'
            }
            else if (obj.status === 4) {

                status = '<small class="label label-warning" style="background-color:#f60e2f"> Reject  </small>'
            }
            one = {
                no: i + 1,
                applicant_name: obj.applicant_name,
                position: data[i].designations ? data[i].designations : '-',
                requested_amount: obj.amount_requested,
                // institution_name: obj.institution_name,
                // outstanding_amount: obj.outstanding_amount,
                // installment_amount: obj.installment_amount,
                maturity_date: obj.maturity_date,
                repayment_period: obj.repayment_period,
                date: moment(obj.createdAt).utc().format("DD-MM-YYYY HH:mm a"),
                status: status
            }

            if (has_action) {
                if (obj.status !== 3) {
                    one.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(obj) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
                    one.action += permission.isEdit === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(obj) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';
                } else {
                    one.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(obj) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : ''
                }
            }
            list.push(one);
        }

        if ($.fn.dataTable.isDataTable('#dataTables')) {
            table = $('#dataTables').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables').empty();
        }

        var column = [
            { title: "No", data: "no" },
            { title: "Applicant Name", data: "applicant_name" },
            { title: "Position", data: "position" },
            { title: "Requested Amount", data: "requested_amount" },
            // { title: "Institution Name", data: "institution_name" },
            // { title: "Outstanding Amount", data: "outstanding_amount" },
            // { title: "Installment Amount", data: "installment_amount" },
            { title: "Maturity Date", data: "maturity_date" },
            { title: "Repayment Repriod", data: "repayment_period" },
            { title: "Date", data: "date" },
            { title: "Status", data: "status" }
        ]

        if (has_action) {
            column.push({ title: "Action", data: "action" })
        }

        table = $("#dataTables").DataTable({
            autofill: true,
            bLengthChange: false,
            bInfo: false,
            pageLength: 50,
            responsive: true,
            paging: true,
            buttons: true,
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf'
            ],

            data: list,
            columns: column
        })
    }

    render() {
        return (
            <div className="row  border-bottom white-bg dashboard-header">
                <div className="content">
                    <div className="row tbl_m_10">
                        <h3 className="col-md-12">Staff Loan List</h3>

                        <table width="99%"
                            className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                            id="dataTables"
                        />
                    </div>
                </div>
            </div>
        )
    }

}