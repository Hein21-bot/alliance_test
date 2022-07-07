import React, { Component } from 'react'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css';
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import Select from 'react-select';
import Rodal from 'rodal';
import {
    getDesignation
} from '../../../utils/CommonFunction';
// include styles
import 'rodal/lib/rodal.css';
import 'react-toastify/dist/ReactToastify.min.css';
import { toast } from 'react-toastify';
import { main_url } from '../../utils/CommonFuntion';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');

require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

export default class PermissionApproval
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
        let designation = await getDesignation();

        this.setState({ designation: designation })
        this.getPermissionType();
        this.getPermissionApproval();
        this._setTableData(this.state.dataSource)
        let that = this
        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);

            that.getPermissionTitle(data.permission_title_id)
            that.setState({
                selectedPermissionType: data.permission_type_id,
                selectedPermissionTitle: data.permission_title_id,
                checkby: data.checkBy,
                approveby: data.approveBy,
                verifyby: data.verifyBy,
                approval_id: data.permission_approval_id,

            })


        });

    }

    getPermissionApproval() {

        fetch(api_url + "permission/getPermissionApprovalList")
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

    getPermissionType() {

        fetch(api_url + "permission/getPermissionTypeByActive")
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res.length > 0) {

                    this.setState({ permissionType: res })

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
        this.getPermissionTitle(event.value)

    }

    handleSelectedPermissionTitle = (event) => {
        this.setState({
            selectedPermissionTitle: event.value

        })

    }
    handleSelectedCheckBy = (event) => {
        this.setState({
            checkby: event.value

        })

    }
    handleSelectedVerifyBy = (event) => {
        this.setState({
            verifyby: event.value

        })

    }
    handleSelectedApproveBy = (event) => {
        this.setState({
            approveby: event.value

        })

    }
    getPermissionTitle(id) {

        fetch(api_url + "permission/getPermissionTitleByPermissionType/" + id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res.length > 0) {


                    this.setState({ permissionTitle: res })

                }
                else {

                    this.setState({ permissionTitle: [] })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));


    }

    changeText(event) {
        this.setState({ permissionTitle: event.target.value })
    }
    changePrice(event) {
        this.setState({ isPrice: event.target.checked })
    }



    hide() {
        this.setState({ visible: false });
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
    getPermissionTitleName(id) {

        let type = this.state.permissionTitle;
        let result = [];
        for (let i = 0; i < type.length; i++) {

            if (id === type[i].value) {
                result = type[i];
                break;
            }
        }
        return result;
    }
    getDesignationName(id) {
        let designation = this.state.designation;
        let result = [];
        for (let i = 0; i < designation.length; i++) {

            if (id === designation[i].value) {
                result = designation[i];
                break;
            }
        }
        return result;
    }

    confirm() {
        var data = []
        data = {
            permissionType: this.state.selectedPermissionType,
            permissionTitle: this.state.selectedPermissionTitle,
            checkby: this.state.checkby,
            verifyby: this.state.verifyby,
            approveby: this.state.approveby
        }

        fetch(api_url + 'permission/addNewPermissionApproval', {
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
            permissionTitle: this.state.selectedPermissionTitle,
            checkBy: this.state.checkby,
            verifyBy: this.state.verifyby,
            approveBy: this.state.approveby,

            //  isPrice: this.state.isPrice,
        }

        fetch(api_url + 'permission/editPermissionApproval/' + this.state.approval_id, {
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
                    checkBy: result.checker,
                    verifyBy: result.verifier,
                    approveBy: result.approver,

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
                    { title: "Check By", data: "checkBy" },
                    { title: "Verify By", data: "verifyBy" },
                    { title: "Approve By", data: "approveBy" },
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
                            <div className="modal-body" style={{ height: '444px' }}>
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
                                        <Select
                                            placeholder="Choose Permission Title"
                                            value={this.getPermissionTitleName(this.state.selectedPermissionTitle)}
                                            onChange={this.handleSelectedPermissionTitle}
                                            options={this.state.permissionTitle}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12" style={{ marginTop: 30 }}>

                                    <div className="col-md-3">Check By</div>
                                    <div className="col-md-6">
                                        <Select
                                            placeholder="Choose Permission Title"
                                            value={this.getDesignationName(this.state.checkby)}
                                            onChange={this.handleSelectedCheckBy}
                                            options={this.state.designation}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12" style={{ marginTop: 30 }}>

                                    <div className="col-md-3">Verify By </div>
                                    <div className="col-md-6">
                                        <Select
                                            placeholder="Choose Permission Title"
                                            value={this.getDesignationName(this.state.verifyby)}
                                            onChange={this.handleSelectedVerifyBy}
                                            options={this.state.designation}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12" style={{ marginTop: 30 }}>

                                    <div className="col-md-3">Approve By</div>
                                    <div className="col-md-6">
                                        <Select
                                            placeholder="Choose Permission Title"
                                            value={this.getDesignationName(this.state.approveby)}
                                            onChange={this.handleSelectedApproveBy}
                                            options={this.state.designation}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-12 btn-rightend" style={{ marginTop: '2%' }}>

                                    <button className="btn btn-primary" onClick={this.edit.bind(this)}><span>Submit</span> </button>

                                </div>



                            </div>
                        </div>
                    </div>
                </div>


                <Rodal width={600} height={450} visible={this.state.visible} onClose={this.hide.bind(this)} >
                    <div className="col-md-12 "><h4>Permission Approval Setup  </h4>
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
                            <Select
                                placeholder="Choose Permission Title"
                                value={this.getPermissionTitleName(this.state.selectedPermissionTitle)}
                                onChange={this.handleSelectedPermissionTitle}
                                options={this.state.permissionTitle}
                            />
                        </div>
                    </div>
                    <div className="col-md-12" style={{ marginTop: 30 }}>

                        <div className="col-md-3">Check By</div>
                        <div className="col-md-6">
                            <Select
                                placeholder="Choose Permission Title"
                                value={this.getDesignationName(this.state.checkby)}
                                onChange={this.handleSelectedCheckBy}
                                options={this.state.designation}
                            />
                        </div>
                    </div>
                    <div className="col-md-12" style={{ marginTop: 30 }}>

                        <div className="col-md-3">Verify By </div>
                        <div className="col-md-6">
                            <Select
                                placeholder="Choose Permission Title"
                                value={this.getDesignationName(this.state.verifyby)}
                                onChange={this.handleSelectedVerifyBy}
                                options={this.state.designation}
                            />
                        </div>
                    </div>
                    <div className="col-md-12" style={{ marginTop: 30 }}>

                        <div className="col-md-3">Approve By</div>
                        <div className="col-md-6">
                            <Select
                                placeholder="Choose Permission Title"
                                value={this.getDesignationName(this.state.approveby)}
                                onChange={this.handleSelectedApproveBy}
                                options={this.state.designation}
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