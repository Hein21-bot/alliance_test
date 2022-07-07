import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import ApprovalInformation from '../../Common/ApprovalInformation';
import DatePicker from 'react-datetime';
import { main_url } from '../../../utils/CommonFunction';
const $ = require('jquery');
const jzip = require('jzip');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');


class PhoneBillRequestView extends Component {

    constructor(props) {
        super(props)
        this.state = {
            phone_main_data: props.data,
            phone_detail_data: [],
            status_info: [],
        }
    }

    componentDidMount() {
        this.getPhoneBillDetail();
        this.getStatusInfo();
    }


    getStatusInfo() {
        fetch(`${main_url}allowance/getPhoneBillDetailInfo/${this.state.phone_main_data.phone_bill_id}`)
            .then(res => res.json())
            .then(res => {
                this.setState({
                    status_info: res
                })
            })
            .catch(error => console.log(error))
    }


    getPhoneBillDetail() {
        let data = this.state.phone_main_data;
        if (data !== null && data.phone_bill_id !== undefined)
            fetch(`${main_url}allowance/getPhoneBillRequestView/${data.phone_bill_id}`)
                .then(res => { if (res.ok) return res.json() })
                .then(list => {
                    this._setTableData(list)
                    this.setState({
                        phone_detail_data: list
                    })
                })
    }

    _setTableData(data) {
       // console.log(data);
        var table;

        var l = [];
        // let action = '';
        for (var i = 0; i < data.length; i++) {
            let obj = [];
            // if (result.status === 0) {
            //     status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'

            // }
            // else if (result.status === 1) {
            //     status = '<small class="label label-warning" style="background-color:#b33ce0"> Check By </small>'
            // }
            // else if (result.status === 2) {
            //     status = '<small class="label label-warning" style="background-color:#f2a509"> Approve By </small>'
            // }
            // else if (result.status === 3) {
            //     status = '<small class="label label-warning" style="background-color:#29a50a"> Verify By </small>'
            // }
            // else if (result.status === 4) {

            //     status = '<small class="label label-warning" style="background-color:#f60e2f"> Reject By </small>'
            // }
            // if (result.status === 0 || result.status === 4) {
            //     action = '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' +
            //         '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>'

            // }
            // else {
            //     action = '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>'

            // }
            obj = {
                no: i + 1,
                name: data[i].user_name,
                employeeid: data[i].employment_id,
                position: data[i].designations,
                branch: data[i].branch_name,
                amount: data[i].amount,
                contact_number: data[i].contact_number,
                ooredoo_package: data[i].ooredoo_package,
                ooredoo_extra: data[i].ooredoo_extra,
                other_phone: data[i].other_phone,
                remark: data[i].remark
                // action: action

            }

            l.push(obj)
        }
        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty()

            table = $("#dataTables-table").DataTable({

                autofill: true,
                bLengthChange: false,
                bInfo: false,
                responsive: true,
                paging: true,
                buttons: false,
                // dom: 'Bfrtip',
                // buttons: [
                //     'copy', 'csv', 'excel', 'pdf'
                // ],
                data: l,

                columns: [
                    { title: "No", data: "no" },
                    { title: "UserName", data: "name" },
                    { title: "Employee Id", data: "employeeid" },
                    { title: "Position", data: "position" },
                    { title: "Branch", data: "branch" },
                    { title: "Contact Number", data: "contact_number" },
                    { title: "Ooredoo Package", data: "ooredoo_package" },
                    { title: "Ooredoo Extra", data: "ooredoo_extra" },
                    { title: "Other Phone", data: "other_phone" },
                    { title: "Amount", data: "amount" },
                    { title: "Remark", data: "remark" },
                    // { title: "Action", data: "action" }
                ]
            });
        }

        else {

            table = $("#dataTables-table").DataTable({
                autofill: true,
                bLengthChange: false,
                bInfo: false,
                responsive: true,
                paging: true,
                buttons: false,
                // dom: 'Bfrtip',
                // buttons: [
                //     'copy', 'csv', 'excel', 'pdf'
                // ],
                data: l,
                columns: [
                    { title: "No", data: "no" },
                    { title: "UserName", data: "name" },
                    { title: "Employee Id", data: "employeeid" },
                    { title: "Position", data: "position" },
                    { title: "Branch", data: "branch" },
                    { title: "Contact Number", data: "contact_number" },
                    { title: "Ooredoo Package", data: "ooredoo_package" },
                    { title: "Ooredoo Extra", data: "ooredoo_extra" },
                    { title: "Other Phone", data: "other_phone" },
                    { title: "Amount", data: "amount" },
                    { title: "Remark", data: "remark" },
                    // { title: "Action", data: "action" }
                ]
            });
        }

    }

    render() {
        return (
            <div >
                <div className="wrapper wrapper-content animated fadeInRight">
                    <h4 className="col-md-12">Phone Bill Request View</h4>
                    <div className="row margin-top-20">
                        <div className="ibox float-e-margins">
                            <div className="ibox-content p-md">
                                <div className="row">
                                    <div className="col-md-4">
                                        <label>Form No</label>
                                        <input
                                            className="form-control"
                                            disabled
                                            value={this.state.phone_main_data.form_no}

                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label>Acutal Date</label>
                                        <input

                                            className="form-control"
                                            value={this.state.phone_main_data.selected_date}
                                            disabled
                                        />
                                    </div>
                                    <div className="col-md-4">
                                        <label>Branch</label>
                                        <input

                                            className="form-control"
                                            value={this.state.phone_main_data.branch_name}
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="row margin-top-20">
                                    <table width="99%"
                                        className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                                        id="dataTables-table"
                                    />
                                </div>

                                {
                                    !Array.isArray(this.state.status_info) ?

                                        <div className="row">
                                            <ApprovalInformation status={this.state.status_info} />
                                        </div>
                                        : ''
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default PhoneBillRequestView;