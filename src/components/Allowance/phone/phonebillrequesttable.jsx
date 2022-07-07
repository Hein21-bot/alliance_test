import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'
import { main_url, getMainRole,getUserId } from '../../../utils/CommonFunction';
const $ = require('jquery');
const jzip = require('jzip');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');

let status = 0;
class PhoneBillRequestTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            dataSource: props.data,
            is_main_role: getMainRole(),
            user_id: getUserId("user_info"),
        }
    }

    componentDidMount() {

        this.$el = $(this.el);

        this.setState({
            dataSource: this.props.data,


        }, () => {

            this._setTableData(this.state.dataSource)
        })

        let that = this
        $("#dataTables-table").on('click', '#toView', function () {
            var data = $(this).find("#view").text();
            data = $.parseJSON(data);
            that.props.goToViewForm(data)


        });

        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            that.props.goToEditForm(data);
            // that._getPhoneBillRequestView(data.phone_bill_id)

        });
    }

    _getPhoneBillRequestView(phone_bill_id) {
        fetch(main_url + 'allowance/getPhoneBillRequestView/' + phone_bill_id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.props.goToEditForm(res);

                }
            })
    }
    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                dataSource: this.props.data,

            }, () => {

                this._setTableData(this.state.dataSource);

            })
        }
    }


    _setTableData = (data) => {
        var table;
        var l = [];
        var permission = this.props.permission;
        var has_action = permission.isView === 1 || permission.isEdit === 1 ? true : false;
        for (var i = 0; i < data.length; i++) {
            let result = data[i]
            let obj = [];
            if (result.status === 0) {
                status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'

            }
            else if (result.status === 1) {
                status = '<small class="label label-warning" style="background-color:#b33ce0"> Check  </small>'
            }
            else if (result.status === 2) {
                status = '<small class="label label-warning" style="background-color:#f2a509"> Verify  </small>'
            }
            else if (result.status === 3) {
                status = '<small class="label label-warning" style="background-color:#29a50a"> Approve  </small>'
            }
            else if (result.status === 4) {

                status = '<small class="label label-warning" style="background-color:#f60e2f"> Reject </small>'
            }
            else if (result.status === 5) {
                status = '<small class="label label-warning" style="background-color:#cc0066"> ReferBack </small>'
            }

            obj = {
                no: i + 1,
                employee_id: result.employment_id,
                employee: result.fullname,
                position: result.designations ? result.designations : '-',
                branch: result.branch_name,
                form_no: result.form_no,
                branch: result.branch_name,
                date: result.createdAt,
                status: status
            }

            if (has_action) {
                if (result.status !== 3) {
                    obj.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
                    obj.action += permission.isEdit === 1 || (result.status == 5 && result.createdBy == this.state.user_id)? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';
                } else {
                    obj.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : ''
                }
            }

            l.push(obj)

        }
        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty();
        }

        var column = [
            { title: "No", data: "no" },
            { title: "Employee Id", data: "employee_id" },
            { title: "Employee Name", data: "employee" },
            { title: "Position", data: "position" },
            { title: "Branch", data: "branch"},
            { title: "Form No", data: "form_no" },
            { title: "Branch", data: "branch" },
            { title: "Date", data: "date" },
            { title: "Status", data: "status" }
        ]

        if (has_action) {
            column.push({ title: "Action", data: "action" })
        }

        table = $("#dataTables-table").DataTable({

            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            pageLength: 50,
            paging: true,
            dom: 'Bfrtip',
            // buttons: [
            //     'copy', 'csv', 'excel', 'pdf'
            // ],
            buttons:  [
                'copy',
            {
                    extend: 'csvHtml5',
                    title: 'Phone Bills',
            },
            {
                extend: 'excelHtml5',
                title: 'Phone Bills',
            },
            {
                extend: 'pdfHtml5',
                title: 'Phone Bills',
            }],
            data: l,
            columns: column
        });
    }

    render() {
        return (
            <div>
                <h3 className="col-md-12">Phone Bill Request Table</h3>
                <div className="ibox float-e-margins">

                    <div className="ibox-content p-md">

                        <table width="99%"
                            className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                            id="dataTables-table"
                        />
                    </div></div>
            </div>
        )
    }
}

export default PhoneBillRequestTable;