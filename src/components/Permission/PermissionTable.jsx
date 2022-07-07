import React, { Component } from 'react'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import Select from 'react-select';
import Rodal from 'rodal';
import {
    main_url
} from '../../utils/CommonFunction';
// include styles
import 'rodal/lib/rodal.css';
import 'react-toastify/dist/ReactToastify.min.css';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

export default class PermissionTable
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            designation: [],
            permissionType: [],
            permissionTitle: [],
            selectedPermissionType: '',
            selectedPermissionTitle: '',
            approval_id: '',
            checkby: '',
            approveby: '',
            verifyby: '',

        }
    }
    async componentDidMount() {
        this.getPermissionApproval();
        this._setTableData(this.state.dataSource)
        let that = this
        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            that.goToEdit(data.designations_id)

        });

    }
    goToEdit(id) {
        fetch(main_url + "permission/viewOnePermissionApproval/" + id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                this.props.goToEditForm(res)


            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }

    getPermissionApproval() {

        fetch(main_url + "permission/getPermissionApprovalList")
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                this._setTableData(res)
                this.setState({ dataSource: res })


            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    _setTableData = (data) => {
        var table;
        var l = []
        var obj = []
        for (var i = 0; i < data.length; i++) {
            let result = data[i]

            obj = {
                no: i + 1,
                designation: result.designations,
                action:
                '<button data-toggle="modal" data-target="#editModal" style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>'

            }

            l.push(obj)

        }
        this.setState({
            dataSource: l,

        })

        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty()
        }

        table = $("#dataTables-table").DataTable({

            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            paging: true,
            buttons: true,
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf'
            ],
            data: l,
            columns: [
                { title: "No", data: "no" },
                { title: "Designation", data: "designation" },
                { title: "Action", data: "action" }
            ],
        });

    }

    render() {
        return (
            <div>

                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>HR Management System</h2>
                        <ol className="breadcrumb">
                            <li>
                                Permission
                                </li>
                            <li className="active">
                                <a>Permission Approval</a>
                            </li>

                        </ol>
                    </div>
                    <div className="col-lg-2" style={{ marginTop: 20 }}>

                        <button className="btn btn-primary" onClick={this.props.setupForm}>Add New</button>
                    </div>
                </div>
                <div>
                    <h3 className="col-md-12">Permission Approval Table</h3>
                    <table width="99%"
                        className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                        id="dataTables-table"
                    />
                </div >
            </div>
        )
    }
}