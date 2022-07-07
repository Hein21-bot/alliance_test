import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'
import { main_url, getMainRole, getCookieData } from '../../../utils/CommonFunction';

const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

class PetrolRequestByEmployeeTable extends Component {

    constructor(props) {
        super(props)
        this.state = {
            user_info: getCookieData("user_info"),
            dataSource: [],
            permission: {},
            isView: false,
            is_main_role: getMainRole()
        }
    }

    componentDidMount() {
        this._getPetrolEmployee();
        // this._setTableData(this.state.dataSource)

        let that = this
        $("#dataTables-table").on('click', '#toView', function () {

            var data = $(this).find("#view").text();
            data = $.parseJSON(data);
            that.props.goToViewForm(data);
        });

        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            that.props.goToEditForm(data);
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.permission !== this.props.permission) {
            this.setState({
                permission: this.props.permission
            }, () => {
                this._setTableData(this.state.dataSource);
            })
        }
    }

    _getPetrolEmployee() {
        fetch(main_url + "allowance/getPetrolEmployee/" + this.state.user_info.user_id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ dataSource: res }, () => this._setTableData(res))
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    _setTableData(data) {
        var table;
        let status = '';
        var l = [];
        var permission = this.state.permission;
        var has_action = permission.isView === 1 || permission.isEdit === 1  ? true : false;
        for (var i = 0; i < data.length; i++) {
            let result = data[i]
            let obj = [];
            let action = "";
            if (result.status === 0) {
                status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'
            }
            else if (result.status === 1) {
                status = '<small class="label label-warning" style="background-color:#b33ce0"> Check </small>'
            }
            else if (result.status === 2) {
                status = '<small class="label label-warning" style="background-color:#f2a509"> Verify </small>'
            }
            else if (result.status === 3) {
                status = '<small class="label label-warning" style="background-color:#29a50a"> Approve</small>'
            }
            else if (result.status === 4) {

                status = '<small class="label label-warning" style="background-color:#f60e2f"> Reject </small>'
            }
            else if (result.status === 5) {
                status = '<small class="label label-warning" style="background-color:#cc0066"> ReferBack </small>'
            }

            obj = {
                no: i + 1,
                employee: data[i].fullname,
                position: data[i].designations ? data[i].designations : '-',
                //branch: data[i].branch_name ? data[i].branch_name :'-',
                form_no: data[i].form_no,
                request_month: data[i].request_month,
                // net_kilo: data[i].net_kilo,
                // total_mile: data[i].total_mile,
                net_claim_amount: data[i].net_claim_amount,
                status: status
            }

            if (has_action) {
                if (result.status !== 3) {
                    obj.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
                    obj.action += permission.isEdit === 1 || (result.status === 5) ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';
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
            $('#dataTables-table').empty()
        }

        var column = [
            { title: "No", data: "no" },
            { title: "Employee Name", data: "employee" },
            { title: "Position", data: "position" },
            //{ title: "Branch", data: "branch" },
            { title: "Request Month", data: "request_month" },
            // { title: "Vehicle Number", data: "vehicle_number" },
            // { title: "Net Kilo", data: "net_kilo" },
            // { title: "Total Mile", data: "total_mile" },
            { title: "Net Claim Amount", data: "net_claim_amount" },
            { title: "Status", data: "status" }
        ];

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
            buttons: true,
            dom: 'Bfrtip',
            // buttons: [
            //     'copy', 'csv', 'excel', 'pdf'
            // ],

            buttons:  [
                'copy',
            {
                    extend: 'csvHtml5',
                    title: 'Petrol Request',
            },
            {
                extend: 'excelHtml5',
                title: 'Petrol Request',
            },
            {
                extend: 'pdfHtml5',
                title: 'Petrol Request',
            }],            data: l,

            columns: column
        });
    }

    render() {
        return (
            <div>
                <h3 className="col-md-12">Petrol Request By Employee Table</h3>
                <table width="99%"
                    className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                    id="dataTables-table"
                />

            </div>
        )
    }
}

export default PetrolRequestByEmployeeTable;