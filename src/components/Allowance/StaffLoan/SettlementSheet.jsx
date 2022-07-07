import React, { Component } from 'react'
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify';
import { main_url, getUserInfo, getUserId, getCookieData, validate } from '../../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'
const $ = require('jquery');
const jzip = require('jzip');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');

export default class SettlementSheet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            sheet_list: [],
            one_sheet: [],
            new_sheet: false
        }
    }

    componentDidMount() {
        getUserInfo();
        var that = this;
        this.getSettlementList();
        $('#dataTables').on('click', '#toEdit', function () {
            var data = $(this).find('#edit').text();
            that.setState({
                new_sheet: true,
                one_sheet: JSON.parse(data)
            })
        })

        $('#dataTables').on('click', '#toRemove', function () {
            var data = $(this).find('#remove').text();
            that.setState({
                one_sheet: JSON.parse(data)
            })
        })
    }

    getSettlementList() {
        fetch(`${main_url}staff_loan/getSettlementList`)
            .then(res => res.json())
            .then(data => {
                this.showTable(data);
                this.setState({
                    sheet_list: data
                })
            })
    }

    showTable(data) {
        var table;
        var list = [];
        var obj = [];

        if ($.fn.dataTable.isDataTable('#dataTables')) {
            table = $('#dataTables').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables').empty();
        }

        for (let i = 0; i < data.length; i++) {
            obj = data[i];
            list.push({
                employee_name: obj.fullname,
                employment_id: obj.employment_id,
                released_amount: obj.released_amount,
                rate_of_interest: obj.rate_of_interest,
                collection_date: obj.collection_date,
                installment_amount: obj.installment_amount,
                action: '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(obj) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>'
                // '<button style="margin-right:10px" class="btn btn-danger btn-sm own-btn-edit" id="toRemove" data-toggle="modal" data-target="#deleteModal"><span id="remove" class="hidden" >' + JSON.stringify(obj) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</button>'
            })
        }
        table = $("#dataTables").DataTable({
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
            data: list,
            columns: [
                { title: "Employee Name", data: "employee_name" },
                { title: "Employee ID", data: "employment_id" },
                { title: "Released Amount", data: "released_amount" },
                { title: "Rate of Interest", data: "rate_of_interest" },
                { title: "Collection Date", data: "collection_date" },
                { title: "Installment Amount", data: "installment_amount" },
                { title: "Action", data: "action" }
            ]
        })
    }

    deleteConfirm() {
        let id = this.state.one_sheet.sheet_id;
        fetch(`${main_url}staff_loan/deleteSettlementSheet`, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            body: `id=${id}`
        })
            .then(res => res.text())
            .then(text => {
                if (text === 'Success!') {
                    toast.success('Deleting the information is successful!');
                    window.location.reload();
                }
                else {
                    toast.error('Something is wrong!')
                }
            })
    }

    render() {
        return (
            this.state.new_sheet ?
                <NewSettlementSheet one_sheet={this.state.one_sheet} />
                :
                <div className="row  border-bottom white-bg dashboard-header">
                    <div className="content">
                        <div className="row wrapper border-bottom white-bg page-heading">
                            <div className="col-lg-10">
                                <h2>HR Management System</h2>
                                <ol className="breadcrumb">
                                    <li>
                                        Staff Loan
                                </li>
                                    <li className="active">
                                        <a>Settelment Sheet</a>
                                    </li>

                                </ol>
                            </div>
                            <div className="col-lg-2 title_btn_sty">
                                <button className="btn btn-primary title_float_btn" onClick={(e) => this.setState({ new_sheet: true })}>
                                    <span className="add_new_icon"><i className="fa fa-plus-square"></i></span>
                                    Add New
                                    </button>
                            </div>
                        </div>
                        <div className="row tbl_m_10">
                            <h3 className="col-md-12">Settlement Sheet List</h3>

                            <table width="99%"
                                className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                                id="dataTables"
                            />
                        </div>
                    </div>
                    <div className="modal fade" id="deleteModal" role="dialog" aria-labelledby="exampleModalLabel"
                        aria-hidden="true">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header" >
                                    <h3 className="modal-title" id="exampleModalLabel">Confirmation</h3>
                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close" style={{ marginTop: '-30px' }}>
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body ">
                                    <div>
                                        <div>
                                            <i className="fa fa-exclamation-triangle fa-2x"></i>
                                        </div>
                                        <div>
                                            <p>
                                                Are you sure you want to delete this sheet? <br></br>
                                                You can't undo this action.</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer" >
                                    <button type="button" className="btn btn-primary" data-dismiss="modal">No</button>
                                    <button type="button" className="btn btn-danger delete-width" data-dismiss="modal" onClick={this.deleteConfirm.bind(this)}>Yes</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}

var form_validate = true;

class NewSettlementSheet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employee_list: [],
            selected_employee: [],
            one_sheet: this.props.one_sheet,
            released_amount: 0,
            rate_of_interest: 0,
            collection_date: new Date(),
            principle_amount: 0,
            installment_amount: 0,
            interest_amount: 0,
            principle_repaid: 0,
            interest_repaid: 0,
            total: 0,
            created_user: getUserId("user_info"),
            user_info: getCookieData("user_info")
        }
    }

    componentDidUpdate() {
        if (!form_validate) validate("check_form")
    }


    componentDidMount() {
        if (!Array.isArray(this.state.one_sheet)) {
            this.setSettlementSheet(this.state.one_sheet);
        }
        this.getEmployeeList();
    }

    setSettlementSheet(one) {
        this.setState({
            released_amount: one.released_amount,
            rate_of_interest: one.rate_of_interest,
            collection_date: one.collection_date,
            installment_amount: one.installment_amount,
            principle_amount: one.principle_amount,
            interest_amount: one.interest_amount,
            principle_repaid: one.principle_repaid,
            interest_repaid: one.interest_repaid,
            total: one.total,
            selected_employee: { label: one.fullname, value: one.user_id, employment_id: one.employment_id, father_name: one.father_name }
        })
    }

    getEmployeeList() {
        fetch(`${main_url}staff_loan/getEmployeeList`)
            .then(res => { if (res.ok) return res.json() })
            .then(list => {
                this.setState({
                    employee_list: list
                })
            })
    }

    save() {
        if (validate("check_form")) {
            let createdBy = this.state.created_user;
            let updatedBy = this.state.created_user;
            let path = 'saveSettlementSheet';
            if (!Array.isArray(this.state.one_sheet)) {
                createdBy = this.state.one_sheet.createdBy;
                path = `editSettlementSheet/${this.state.one_sheet.sheet_id}`
            }
            var data = {
                user_id: this.state.selected_employee.value,
                released_amount: this.state.released_amount,
                rate_of_interest: this.state.rate_of_interest,
                collection_date: this.state.collection_date,
                installment_amount: this.state.installment_amount,
                principle_amount: this.state.principle_amount,
                interest_amount: this.state.interest_amount,
                principle_repaid: this.state.principle_repaid,
                interest_repaid: this.state.interest_repaid,
                total: this.state.total,
                createdAt: createdBy,
                updatedBy: updatedBy
            }
            let status = 0;
            fetch(`${main_url}staff_loan/${path}`, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                body: `sheet=${JSON.stringify(data)}`
            })
                .then(res => {
                    status = res.status;
                    return res.text()
                })
                .then(text => {
                    if (status === 200) {
                        toast.success(text);
                        window.location.replace('/staff_loan_settlement');
                    }
                    else toast.error(text);

                })
        } else form_validate = false;
    }

    render() {
        let { employee_list, selected_employee } = this.state;
        return (
            <div>
                <div className="row wrapper border-bottom white-bg page-heading">
                    <div className="col-lg-10">
                        <h2>HR Management System</h2>
                        <ol className="breadcrumb">
                            <li>
                                Staff Loan
                                </li>
                            <li className="active">
                                <a>New Settlement Sheet</a>
                            </li>

                        </ol>
                    </div>
                    <div className="col-lg-2" style={{ marginTop: '2%' }}>
                        <a href="/staff_loan_repayment">
                            <button className="btn btn-primary" onClick={this.props.goBack}>Back To List</button>
                        </a>
                    </div>
                </div>
                <div className='wrapper wrapper-content animated fadeInRight'>
                    <ToastContainer position={toast.POSITION.TOP_RIGHT} />
                    {/* <h2>New Settlement Sheet</h2> */}
                    <div className="content">
                        <div className='row'>
                            <div className='form-horizontal' name='demo-form' id="check_form">
                                <div className='ibox-content float-e-margin col-md-12 col-sm-12'>
                                    <div className='ibox-content p-md col-md-12 col-sm-12'>
                                        <div className="row">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Employee Name</label>
                                                <div className="col-sm-10">
                                                    {/* <Select
                                                        options={employee_list}
                                                        value={selected_employee}
                                                        onChange={(e) => this.setState({ selected_employee: e })}
                                                    /> */}
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        disabled
                                                        value={this.state.user_info.fullname}
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Employee ID</label>
                                                <div className="col-sm-10">
                                                    {/* <input className="form-control input-md" type="text" value={!Array.isArray(selected_employee) ? selected_employee.employment_id : ""} disabled></input> */}
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        disabled
                                                        value={this.state.user_info.employment_id}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Father Name</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md"
                                                        type="text"
                                                        value={this.state.user_info.father_name}
                                                        disabled></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Released Amount</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number"
                                                        min="0" step="0.01" value={this.state.released_amount}
                                                        onChange={(e) => this.setState({ released_amount: e.target.value })}></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Rate Of Interest</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number" min="0" step="0.01"
                                                        value={this.state.rate_of_interest} onChange={(e) => this.setState({ rate_of_interest: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Collection Date</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="date"
                                                        min="0" step="0.01" value={this.state.collection_date} onChange={(e) => this.setState({ collection_date: e.target.value })}></input>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Installment Amount</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number"
                                                        min="0" step="0.01" value={this.state.installment_amount} onChange={(e) => this.setState({ installment_amount: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Principle Amount</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number"
                                                        min="0" step="0.01" value={this.state.principle_amount} onChange={(e) => this.setState({ principle_amount: e.target.value })}></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Interest Amount</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number"
                                                        min="0" step="0.01" value={this.state.interest_amount} onChange={(e) => this.setState({ interest_amount: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Principle Repaid</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number"
                                                        min="0" step="0.01" value={this.state.principle_repaid} onChange={(e) => this.setState({ principle_repaid: e.target.value })}></input>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row margin-top-20">
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Interest Repaid</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number"
                                                        min="0" step="0.01" value={this.state.interest_repaid} onChange={(e) => this.setState({ interest_repaid: e.target.value })}></input>
                                                </div>
                                            </div>
                                            <div className="col-12 col-sm-6 col-lg-6 col-xl-6">
                                                <label className="col-sm-12">Total</label>
                                                <div className="col-sm-10">
                                                    <input className="form-control input-md checkValidate" type="number"
                                                        min="0" step="0.01" value={this.state.total} onChange={(e) => this.setState({ total: e.target.value })}></input>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="row save-btn">
                                            <div className="float-right  margin-top-20">
                                                {/* <a href="/staff_loan_settlement"><button className="btn btn-success m-r-10">Cancel</button></a> */}
                                                <button className="btn btn-primary" onClick={this.save.bind(this)}>Save</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}