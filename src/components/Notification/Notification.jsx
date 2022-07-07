import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import moment from 'moment'
import { main_url, getUserId } from '../../utils/CommonFunction';
import HelpDeskParent from '../HelpDesk/HelpDeskParent';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

export default class Notification extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user_id: getUserId("user_info"),
            noti_list: [],
            data: [],
            helpDesk_edit: false,

        }
    }

    componentDidMount() {
        var that = this;
        this.getNotificationList();
        $('#dataTables').on('click', '#toView', function () {
            var data = $(this).find('#view').text();
            data = $.parseJSON(data);
            that.readNoti(data.noti_id);
            that._getHelpDeskEditData(data.link_id);
        })
        this.getNotiCountForOneUser_child();
        this.getNotiCountForOneUser_wedding();
        this.getBenefitNotiCount_funeral();
        this.getBenefitNotiCount_external();
        this.getBenefitNotiCount_medical();
        this.getBenefitNotiCount_teamBuilding();
        this.getBenefitNotiCount_other();
        this.getBenefitNotiCount_birthday();
    }
    readNoti(id) {
        fetch(`${main_url}noti/readNoti/${id}`)
    }

    //@kpk
    getNotiCountForOneUser_wedding = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_wedding/${this.state.user_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    wedding_benefit_count: data.count,
                    wedding_benefit_time: data.time,
                    wedding_benefit_name: data.table_name
                })
            })
    }

    //@kpk
    getNotiCountForOneUser_child = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_child/${this.state.user_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    child_noti_count: data.count,
                    child_time: data.time,
                    child_name: data.table_name
                })
            })
    }



    //@kpk
    getBenefitNotiCount_funeral = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_funeral/${this.state.user_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    funeral_benefit_count: data.count,
                    funeral_benefit_time: data.time,
                    funeral_benefit_name: data.table_name
                })
            })
    }

    //@kpkExternal
    getBenefitNotiCount_external = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_external/${this.state.user_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    external_benefit_count: data.count,
                    external_benefit_time: data.time,
                    external_benefit_name: data.table_name
                })
            })
    }

    //@kpkMedical
    getBenefitNotiCount_medical = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_medical/${this.state.user_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    medical_benefit_count: data.count,
                    medical_benefit_time: data.time,
                    medical_benefit_name: data.table_name
                })
            })
    }

    //@kpkTeamBuilding
    getBenefitNotiCount_teamBuilding = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_teamBuilding/${this.state.user_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    teamBuilding_benefit_count: data.count,
                    teamBuilding_benefit_time: data.time,
                    teamBuilding_benefit_name: data.table_name

                })
            })
    }
    //@kpkOtherBenifit
    getBenefitNotiCount_other = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_other/${this.state.user_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    other_benefit_count: data.count,
                    other_benefit_time: data.time,
                    other_benefit_name: data.table_name
                })
            })
    }

    //@kpk
    getBenefitNotiCount_birthday = () => {
        fetch(`${main_url}noti/getNotiCountForOneUser_birthdayFun/${this.state.user_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    birthday_benefit_count: data.count,
                    birthday_benefit_time: data.time,
                    birthday_benefit_name: data.table_name
                })
            })
    }

    getNotificationList() {
        fetch(`${main_url}noti/getNotificationList/${this.state.user_id}`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    noti_list: data
                }, () => this.showTable(data))
            }).catch(error => {
                console.log(error);
                this.showTable(this.state.noti_list)

            })
    }

    _getHelpDeskEditData(ticketId) {
        fetch(main_url + "helpDesk/getHelpDeskViewData/" + ticketId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({
                        helpDesk_edit: true,
                        data: res
                    })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    showTable(data) {
        var table;
        var list = [];
        var obj, one = [];

        for (let i = 0; i < data.length; i++) {
            obj = data[i];
            one = {
                no: i + 1,
                message: obj.message,
                requester_name: obj.name,
                noti_time: moment(obj.noti_time).format('DD-MM-YYYY HH:mm:ss'),
                ticket_name: obj.ticket_name,
                priority: obj.priority,
                read: obj.is_seen === 1 ? '<span class="noti-doc noti-read"></span>' : '<span class="noti-doc noti-not-read"></span>',
                action: '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(obj) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>'
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
            { title: "Message", data: "message" },
            { title: "Time", data: "noti_time" },
            { title: "Ticket Name", data: "ticket_name" },
            { title: "Priority", data: "priority" },
            { title: "Read Status", data: "read" },
            { title: "Requester Name", data: "requester_name" },
            { title: "Action", data: "action" }
        ]

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
            columns: column
        })
    }

    render() {
        return (
            this.state.helpDesk_edit ? <HelpDeskParent data={this.state.data} edit={this.state.helpDesk_edit} />
                :
                <div >
                    <div className="row wrapper border-bottom white-bg page-heading">
                        <div className="col-lg-10">
                            <h2>HR Management System</h2>
                            <ol className="breadcrumb">
                                <li>
                                    Notification
                            </li>
                                <li className="active">
                                    <a href="#"> Notification</a>
                                </li>

                            </ol>
                        </div>
                    </div>

                    <div className="row tbl_m_10">
                        {this.state.wedding_benefit_count > 0 ?
                            <div className="col-md-3">
                                <div><label htmlFor="count-name" className="col-md-12" >{this.state.wedding_benefit_name}</label></div>
                                <div className="col-lg-5 ">
                                    <input
                                        type="text"
                                        disabled
                                        className="form-control"
                                        value={this.state.wedding_benefit_count}//this.state.datasource.staff_spouse_name
                                    />
                                </div>
                            </div> : undefined
                        }
                        {this.state.child_noti_count > 0 ?
                            <div className="col-md-3">
                                <div><label htmlFor="count-name" className="col-md-12" >{this.state.child_name}</label></div>
                                <div className="col-lg-5 ">
                                    <input
                                        type="text"
                                        disabled
                                        className="form-control"
                                        value={this.state.child_noti_count}//this.state.datasource.staff_spouse_name
                                    />
                                </div>
                            </div> : undefined
                        }

                        {this.state.funeral_benefit_count > 0 ?
                            <div className="col-md-3">
                                <div><label htmlFor="count-name" className="col-md-12" >{this.state.funeral_benefit_name}</label></div>
                                <div className="col-lg-5 ">
                                    <input
                                        type="text"
                                        disabled
                                        className="form-control"
                                        value={this.state.funeral_benefit_count}//this.state.datasource.staff_spouse_name
                                    />
                                </div>
                            </div> : undefined
                        }
                        {
                            this.state.external_benefit_count > 0 ?
                                <div className="col-md-3">
                                    <div><label htmlFor="count-name" className="col-md-12" >{this.state.external_benefit_name}</label></div>
                                    <div className="col-lg-5 ">
                                        <input
                                            type="text"
                                            disabled
                                            className="form-control"
                                            value={this.state.external_benefit_count}//this.state.datasource.staff_spouse_name
                                        />
                                    </div>
                                </div> : undefined
                        }
                        {
                            this.state.medical_benefit_count > 0 ?
                                <div className="col-md-3">
                                    <div><label htmlFor="count-name" className="col-md-12" >{this.state.medical_benefit_name}</label></div>
                                    <div className="col-lg-5 ">
                                        <input
                                            type="text"
                                            disabled
                                            className="form-control"
                                            value={this.state.medical_benefit_count}//this.state.datasource.staff_spouse_name
                                        />
                                    </div>
                                </div> : undefined
                        }
                        {
                            this.state.teamBuilding_benefit_count > 0 ?
                                <div className="col-md-3">
                                    <div><label htmlFor="count-name" className="col-md-12" >{this.state.teamBuilding_benefit_name}</label></div>
                                    <div className="col-lg-5 ">
                                        <input
                                            type="text"
                                            disabled
                                            className="form-control"
                                            value={this.state.teamBuilding_benefit_count}//this.state.datasource.staff_spouse_name
                                        />
                                    </div>
                                </div> : undefined
                        }
                        {
                            this.state.other_benefit_count > 0 ?
                                <div className="col-md-3">
                                    <div><label htmlFor="count-name" className="col-md-12" >{this.state.other_benefit_name}</label></div>
                                    <div className="col-lg-5 ">
                                        <input
                                            type="text"
                                            disabled
                                            className="form-control"
                                            value={this.state.other_benefit_count}//this.state.datasource.staff_spouse_name
                                        />
                                    </div>
                                </div> : undefined
                        }
                        {
                            this.state.birthday_benefit_count > 0 ?
                                <div className="col-md-3">
                                    <div><label htmlFor="count-name" className="col-md-12" >{this.state.birthday_benefit_name}</label></div>
                                    <div className="col-lg-5 ">
                                        <input
                                            type="text"
                                            disabled
                                            className="form-control"
                                            value={this.state.birthday_benefit_count}//this.state.datasource.staff_spouse_name
                                        />
                                    </div>
                                </div> : undefined
                        }

                    </div>
                    <div className="row  border-bottom white-bg dashboard-header">
                        <div className="content">

                            <div className="row tbl_m_10">
                                <h3 className="col-md-12">Notification List</h3>

                                <table width="99%"
                                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                                    id="dataTables"
                                />
                            </div>
                        </div>
                    </div>
                </div>
        )
    }
}