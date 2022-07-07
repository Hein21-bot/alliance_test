import React, { Component } from 'react'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import Select from 'react-select';
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

export default class PermissionTitle
    extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            permissionType: [],
            permissionTitleId: '',
            selectedPermissionType: '',
            isPrice: false,
            permissionTitle: '',
            visibile: false,

        }
    }
    componentDidMount() {
        this.getPermissionTitle();
        this.getPermissionType();
        this._setTableData(this.state.dataSource)
        let that = this
        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            // console.log(data)
            var isPrice = '';
            if (data.isPrice === 1) {
                isPrice = true;
            }
            else {
                isPrice = false;
            }
            that.setState({
                isPrice: isPrice,
                selectedPermissionType: data.permission_type_id,
                permissionTitleId: data.permission_title_id,
                permissionTitle: data.permission_title

            })


        });

    }
    getPermissionType() {

        fetch(main_url + "permission/getPermissionTypeByActive")
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                // console.log(res)
                if (res.length > 0) {

                    this.setState({ permissionType: res })

                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    getPermissionTitle() {

        fetch(main_url + "permission/getPermissionTitleList")
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
    handleSelectedPermissionType = (event) => {
        this.setState({
            selectedPermissionType: event.value
        })

    }

    changeText(event) {
        this.setState({ permissionTitle: event.target.value })
    }
    changePrice(event) {
        this.setState({ isPrice: event.target.checked })
    }



    hide() {
        this.setState({ visible: false, selectedPermissionType: '', permissionTitle: '' });
    }


    getPermissionTypeName(id) {
        let type = this.state.permissionType;
        let result = [];
        for (let i = 0; i < type.length; i++) {

            if (id === type[i].value) {
                result = type[i];
                break;
            }
        }
        return result;
    }

    confirm() {
        var data = []
        data = {
            permissionType: this.state.selectedPermissionType,
            permissionTitle: this.state.permissionTitle,
            isPrice: this.state.isPrice,
        }

        fetch(main_url + 'permission/addNewPermissionTitle', {
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

    edit() {
        var data = []
        data = {
            permissionType: this.state.selectedPermissionType,
            permissionTitle: this.state.permissionTitle,
            isPrice: this.state.isPrice,
        }

        fetch(main_url + 'permission/editPermissionTitle/' + this.state.permissionTitleId, {
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
        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty()
            var l = []
            var obj = []
            for (var i = 0; i < data.length; i++) {
                let result = data[i]

                obj = {
                    no: i + 1,
                    permissionType: result.permission_type,
                    permissionTitle: result.permission_title,

                    action:
                    '<button data-toggle="modal" data-target="#editModal" style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>'


                }

                l.push(obj)

            }
            this.setState({
                dataSource: l,

            })


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
                    { title: "Permission Type", data: "permissionType" },
                    { title: "Permission Title", data: "permissionTitle" },
                    { title: "Action", data: "action" }
                ],
            });
        }

        else {

            table = $("#dataTables-table").DataTable({
                autofill: true,
                bLengthChange: false,
                bInfo: true,
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
                    { title: "Permission Type", data: "permissionType" },
                    { title: "Permission Title", data: "permissionTitle" },
                    { title: "Action", data: "action" }
                ],

            });
        }
    }



    render() {


        return (
            <div>
                <div className="modal fade" tabIndex="-1" role="dialog" id="editModal">
                    <div className="modal-dialog  modal-md" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Edit Permission Title</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body" style={{ height: '300px' }}>
                                <div className="col-md-12">
                                    <div className="col-md-3">Permission Type </div>
                                    <div className="col-md-6">
                                        <Select
                                            placeholder="Please Choose Type"
                                            value={this.getPermissionTypeName(this.state.selectedPermissionType)}
                                            onChange={this.handleSelectedPermissionType}
                                            options={this.state.permissionType}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12" style={{ marginTop: 20 }}>
                                    <div className="col-md-3">Permission Title </div>
                                    <div className="col-md-6">
                                        <input
                                            className="form-control"
                                            type="text"
                                            placeholder="Please enter permission title"
                                            onChange={this.changeText.bind(this)}
                                            value={this.state.permissionTitle}

                                        />
                                    </div>
                                </div>
                                <div className="col-md-12" style={{ marginTop: 20 }}>
                                    <div className="col-md-3"> Price </div>
                                    <div className="col-md-2">
                                        <input
                                            className="form-control"
                                            type="checkbox"
                                            style={{ margin: 0 }}
                                            onChange={this.changePrice.bind(this)}
                                            checked={this.state.isPrice === true ? 'checked' : ''}

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


                <Rodal width={600} height={320} visible={this.state.visible} onClose={this.hide.bind(this)} >
                    <div className="col-md-12 "><h4>Permission Title Set Up</h4>
                    </div>
                    <div className="col-md-12" style={{ marginTop: 30 }}>
                        <div className="col-md-3">Permission Type </div>
                        <div className="col-md-6">
                            <Select
                                placeholder="Choose Permission Type"
                                value={this.getPermissionTypeName(this.state.selectedPermissionType)}
                                onChange={this.handleSelectedPermissionType}
                                options={this.state.permissionType}
                            />
                        </div>
                    </div>
                    <div className="col-md-12" style={{ marginTop: 30 }}>

                        <div className="col-md-3">Permission Title </div>
                        <div className="col-md-6">
                            <input
                                className="form-control"
                                type="text"
                                placeholder="Please enter permission title"
                                onChange={this.changeText.bind(this)}
                                value={this.state.permissionTitle}

                            />
                        </div>
                    </div>
                    <div className="col-md-12" style={{ marginTop: 20 }}>
                        <div className="col-md-3">Price </div>
                        <div className="col-md-2">
                            <input
                                // className="form-control"
                                type="checkbox"
                                onChange={this.changePrice.bind(this)}
                                checked={this.state.isPrice === true ? 'checked' : ''}

                            />
                        </div>
                    </div>
                    <div className="col-md-12 btn-rightend" style={{ marginTop: '2%' }}>

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
                                <a>Permission Title</a>
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