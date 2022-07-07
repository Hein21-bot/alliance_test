import React, { Component } from 'react'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'
import Rodal from 'rodal';
// include styles
import 'rodal/lib/rodal.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { toast } from 'react-toastify';
import { main_url } from '../../utils/CommonFunction';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');

require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

export default class PermissionType
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            permissionType: '',
            permissionTypeId: '',
            visibile: false,
            active: true,

        }
    }
    componentDidMount() {
        this.getPermissionType();
        this._setTableData(this.state.dataSource)
        let that = this
        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            var active = '';
            if (data.active === 1) {
                active = true;
            }
            else {
                active = false;
            }
            that.setState({
                permissionType: data.permission_type,
                active: active,
                permissionTypeId: data.permission_type_id
            })

        });

    }
    getPermissionType() {
        fetch(main_url + "permission/getPermissionTypeList")
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res.length > 0) {

                    this._setTableData(res)
                    this.setState({ dataSource: res })

                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    showModal() {
        this.setState({ visible: true });
    }
    changeText(event) {
        this.setState({ permissionType: event.target.value })
    }
    changeActive(event) {

        this.setState({ active: event.target.checked })
    }

    hide() {

        this.setState({ visible: false, permissionType: '' });
    }

    confirm() {

        fetch(main_url + 'permission/addNewPermissionType', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `info=${JSON.stringify(this.state.permissionType)}`

        })
            .then(data => data.text())
            .then(data => {
                if (data === 'success') {


                    window.location.reload();

                }
                else {
                    toast.error('😰 Failed', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }

            })

    }

    edit() {
        var data = []
        data = {
            permissionType: this.state.permissionType,
            active: this.state.active,
        }


        fetch(main_url + 'permission/editPermissionType/' + this.state.permissionTypeId, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `info=${JSON.stringify(data)}`

        })
            .then(data => data.text())
            .then(data => {
                if (data === 'success') {


                    window.location.reload();

                }
                else {
                    toast.error('😰 Failed', {
                        position: 'top-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true
                    });
                }

            })

    }
    _setTableData = (data) => {

        var table;

        var l = []
        var obj = []
        for (var i = 0; i < data.length; i++) {
            let result = data[i]

            obj = {
                no: i + 1,
                permissionType: result.permission_type,

                action:
                '<button data-toggle="modal" data-target="#editModal" style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>'


            }

            l.push(obj)

        }
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
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf'
            ],
            data: l,
            columns: [
                { title: "No", data: "no" },
                { title: "Permission Type", data: "permissionType" },
                { title: "Action", data: "action" }
            ],
        });
    }

    render() {
        return (
            <div>
                <div className="modal fade" tabIndex="-1" role="dialog" id="editModal">
                    <div className="modal-dialog  modal-md" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Edit Permission Type</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ height: '200px' }}>
                                <div className="col-md-3">Permission Type </div>
                                <div className="col-md-6">
                                    <input
                                        className="form-control"
                                        type="text"
                                        placeholder="Please enter permission type"
                                        onChange={this.changeText.bind(this)}
                                        value={this.state.permissionType}

                                    />
                                </div>
                                <div className="col-md-12" style={{ marginTop: 20 }}>
                                    <div className="col-md-3">Active </div>
                                    <div className="col-md-2">
                                        <input
                                            className="form-control"
                                            type="checkbox"
                                            onChange={this.changeActive.bind(this)}
                                            checked={this.state.active === true ? 'checked' : ''}

                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 btn-rightend" style={{ marginTop: '5%' }}>

                                    <button className="btn btn-primary" onClick={this.edit.bind(this)}><span>Submit</span> </button>

                                </div>

                            </div>
                        </div>
                    </div>
                </div>


                <Rodal width={600} visible={this.state.visible} onClose={this.hide.bind(this)} >
                    <div className="col-md-12 "><h4>Permission Type Set Up</h4>
                    </div>
                    <div className="col-md-12" style={{ marginTop: 30 }}>
                        <div className="col-md-3">Permission Type </div>
                        <div className="col-md-6">
                            <input
                                className="form-control"
                                type="text"
                                value={this.state.permissionType}
                                placeholder="Please enter permission type"
                                onChange={this.changeText.bind(this)}
                            //value={this.state.headerType}

                            />
                        </div>
                    </div>
                    <div className="col-md-12 btn-rightend" style={{ marginTop: '10%' }}>

                        <button className="btn btn-primary" onClick={this.confirm.bind(this)}><span>Submit</span> </button>

                    </div>

                </Rodal>

                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>HR Management System</h2>
                        <ol className="breadcrumb">
                            <li>
                                Permission
                                </li>
                            <li className="active">
                                <a>Permission Type</a>
                            </li>

                        </ol>
                    </div>
                    <div className="col-lg-2" style={{ marginTop: 20 }}>

                        <button className="btn btn-primary" onClick={this.showModal.bind(this)}>Add New</button>
                    </div>
                </div>
                <div>
                    <h3 className="col-md-12">Permission Type Table</h3>
                    <table width="99%"
                        className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                        id="dataTables-table"
                    />
                </div >
            </div>
        )
    }
}