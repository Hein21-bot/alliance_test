import React, { Component } from 'react';
import DatePicker from 'react-datetime';
import moment from 'moment'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import { main_url, getMainRole, getUserId, getFirstDayOfMonth } from "../../utils/CommonFunction";
import Select from 'react-select'
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

export default class LeaveManagementTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: props.tab,
            user_id: getUserId('user_info'),
            data: [],
            is_main_role: getMainRole(),
            year: moment(getFirstDayOfMonth()),
            loading: false,
            statusList: [
                { label: 'All', value: 0 },
                { label: 'Request', value: 1 },
                { label: 'Verify', value: 2 },
                { label: 'Approve', value: 3 },
                { label: 'Reject', value: 4 },
                { label: 'ReferBack', value: 5 },
                { label: 'Cancel Request', value: 6 },
                { label: 'Cancel Verify', value: 7 },
                { label: 'Cancel Approve', value: 8 },
                { label: 'Cancel Reject', value: 9 },

            ],
            leaveCategory: [],
            selected_category_value: null,
            selected_category: null,
            selected_status: null,
            selected_status_value: null
            // isHR: this.props.isHR
        }
    }



    getData() {
        let tab = this.state.tab;
        let year = moment(this.state.year).format('YYYY')
        if (tab === 0) {
            this.getMyLeave(year);
        } else if (tab === 2) {
            this.setState({ loading: true });
            this.getAllLeave(year,0,0);
        }
    }

    componentDidMount() {
        this.$el = $(this.el);
        this.getData();
        this.leaveCategory();
        let that = this;
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

        $("#dataTables-table").on('click', '#toCancel', function () {

            var data = $(this).find("#cancel").text();
            data = $.parseJSON(data);
            that.props.goToCancelForm(data);

        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.tab != this.props.tab) {
            this.setState({
                tab: this.props.tab
            }, () => this.getData())

        }
    }
    leaveCategory() {
        fetch(main_url + "leave/getLeaveCategory")
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                res.unshift({label:'All',value:0})
                this.setState({ leaveCategory: res })
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }
    getMyLeave() {

        fetch(`${main_url}leave/getMyLeave/${this.state.user_id}`)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                this.setState({ data: res }, () => this._setTableData(res))
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    getAllLeave(year,selectedCategoryValue, selectedStatusValue) { console.log("dsahgsd",selectedCategoryValue, selectedStatusValue)
        let years = moment(year).format('YYYY')
        this.setState({ loading: true });
        fetch(`${main_url}leave/getAllLeave/${years}/${this.state.user_id}`)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                this.setState({ data: res, loading: false }, () => (selectedCategoryValue == 0  && selectedStatusValue == 0 ) ? this._setTableData(res): (selectedCategoryValue != 0  && selectedStatusValue == 0 ) ? this._setTableData(res.filter(d =>d.leave_category_id == selectedCategoryValue  )):(selectedCategoryValue == 0  && selectedStatusValue != 0 ) ? this._setTableData(res.filter(d => d.application_status == selectedStatusValue  ))           : this._setTableData(res.filter(d =>  d.application_status == selectedStatusValue && d.leave_category_id == selectedCategoryValue)) )
                // this.setState({ data: res, loading: false }, () => (selectedCategoryValue == 0 || selectedCategoryValue == null && selectedStatusValue == 0 || selectedStatusValue == null) ? this._setTableData(res) : (selectedCategoryValue != 0 || selectedCategoryValue != null && selectedStatusValue == 0 || selectedStatusValue == null) ? this._setTableData(res.filter(d =>  d.leave_category_id == selectedCategoryValue)) : (selectedStatusValue != 0 || selectedStatusValue != null && selectedCategoryValue != 0 || selectedCategoryValue != null ) ? this._setTableData(res.filter(d => d.application_status == selectedStatusValue && d.leave_category_id == selectedCategoryValue)) :  this._setTableData(res.filter(d =>  d.application_status == selectedStatusValue && d.leave_category_id == selectedCategoryValue)))
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }
    handlestatus = (event) => {
        this.setState({
            selected_status: event,
            selected_status_value: event.value
        })
    }
    handlecategory = (event) => {
        this.setState({
            selected_category: event,
            selected_category_value: event.value
        })
    }
    filter() {
        if (this.state.tab == 0) {
            let year = moment(this.state.year).format('YYYY')
            this.getAllLeave(year, 0 ,0);
        } else if (this.state.tab == 2) {
            let year = moment(this.state.year).format('YYYY')
            let selectedStatusValue = this.state.selected_status_value ? this.state.selected_status_value : 0
            let selectedCategoryValue = this.state.selected_category_value ? this.state.selected_category_value : 0
            this.getAllLeave(year,selectedCategoryValue, selectedStatusValue);
        }
    }

    handleYear = (event) => {
        this.setState({
            year: event
        })
    }


    _setTableData = (data) => {
        var table;
        // var permission = this.props.permission;
        // var has_action = permission.isView === 1 || permission.isEdit === 1 ? true : false;
        var has_action = true;

        var l = [];
        for (var i = 0; i < data.length; i++) {
            let result = data[i];
            let application_status = '';
            let reject_status = '';
            let obj = [];
            // application_status
            if (result.application_status === 0) {
                application_status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'
            }
            else if (result.application_status === 1) {
                application_status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'
            }
            else if (result.application_status === 2) {
                application_status = '<small class="label label-warning" style="background-color:#f2a509"> Verify  </small>'
            }
            else if (result.application_status === 3) {
                application_status = '<small class="label label-warning" style="background-color:#29a50a"> Approve  </small>'
            }
            else if (result.application_status === 4) {
                application_status = '<small class="label label-warning" style="background-color:#f60e2f"> Reject  </small>'
            }
            else if (result.application_status === 5) {
                application_status = '<small class="label label-warning" style="background-color:#cc0066"> Refer Back  </small>'
            }
            else {
                if (result.previous_status == 3) {
                    application_status = '<small class="label label-warning" style="background-color:#29a50a"> Approve  </small>'
                } else if (result.previous_status == 5) {
                    application_status = '<small class="label label-warning" style="background-color:#cc0066"> Refer Back  </small>'
                } else if (result.previous_status == 2) {
                    application_status = '<small class="label label-warning" style="background-color:#f2a509"> Verify  </small>'
                } else if (result.previous_status == 1) {
                    application_status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'
                } else {
                    application_status = '<small class="label label-warning" style="background-color:#f60e2f"> Reject  </small>'
                }
            }

            // reject_status
            if (result.application_status === 6) {
                reject_status = '<small class="label label-warning" style="background-color:#eb6b1c"> Cancel Request </small>'
            }
            else if (result.application_status === 7) {
                reject_status = '<small class="label label-warning" style="background-color:#eb6b1c"> Cancel Verify</small>'
            }
            else if (result.application_status === 8) {
                reject_status = '<small class="label label-warning" style="background-color:#eb6b1c"> Cancel Approve</small>'
            }
            else if (result.application_status === 9) {
                reject_status = '<small class="label label-warning" style="background-color:#eb6b1c"> Cancel Reject</small>'
            } else {
                if (result.cancel_verify != null) {
                    reject_status = '<small class="label label-warning" style="background-color:#eb6b1c"> Cancel Verify</small>'
                } else if (result.cancel_approve != null) {
                    reject_status = '<small class="label label-warning" style="background-color:#eb6b1c"> Cancel Approve</small>'
                } else if (result.cancel_reject) {
                    reject_status = '<small class="label label-warning" style="background-color:#eb6b1c"> Cancel Reject</small>'
                } else if (result.leave_cancel_apply_date != null) {
                    reject_status = '<small class="label label-warning" style="background-color:#eb6b1c"> Cancel Request </small>'
                }
            }

            obj = {
                no: i + 1,
                name: result.fullname,
                employee_id: result.employment_id,
                start_date: result.leave_start_date,
                end_date: result.leave_end_date,
                leave_day: result.leave_days,
                leave_category: result.leave_category,
                application_status: application_status,
                reject_status: reject_status
            }

            if (this.state.tab == 2) {
                obj.action =
                    '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>'
                if (result.application_status < 5 || result.application_status == 8 || result.application_status == 9) {
                    obj.action +=
                        '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>'
                }

                if (result.application_status == 6 || result.application_status == 7) {
                    obj.action +=
                        '<button style="margin-right:10px" class="btn btn-danger btn-sm own-btn-cancel" id="toCancel" ><span id="cancel" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Cancel Edit</button>'
                }
            } else {
                obj.action =
                    '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>'

                if ((result.approve_by == this.state.user_id && result.application_status == 3 || result.application_status == 5 && result.user_id == this.state.user_id) || (result.user_id == this.state.user_id && result.application_status == 9 && (result.approved_date != null ? result.referback_date >= result.approved_date : result.verify_date != null ? result.referback_date >= result.verify_date : result.referback_date != null))) {
                    obj.action +=
                        '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>'
                }
                if (result.user_id == this.state.user_id && result.application_status == 3) {
                    obj.action +=
                        '<button style="margin-right:10px" class="btn btn-danger btn-sm own-btn-cancel" id="toCancel" ><span id="cancel" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Cancel Request</button>'
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
            { title: "Name", data: "name" },
            { title: "Employee Id", data: "employee_id" },
            { title: "Start Date", data: "start_date" },
            { title: "End Date", data: "end_date" },
            { title: "Leave Day", data: "leave_day" },
            { title: "Leave Category", data: "leave_category" },
            { title: "status", data: "application_status" },
            { title: "cancel status", data: "reject_status" },
            // { title: "Action", data: "action" }
        ]

        if (has_action) {
            column.push({ title: "Action", data: "action" })
        }

        table = $("#dataTables-table").DataTable({
            pageLength: 50,
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
            columns: column
        });
    }

    render() { console.log(this.state.tab)
        // if (this.state.loading === true) {
        //     return <div style={{ display: 'flex', justifyContent: 'center' }}><h2>Loading...</h2></div>
        // } else {
        return (
            <div>
                <div className="row border-bottom white-bg dashboard-header">
                    <div className="row">
                        {this.state.tab == 0 ?
                            <>
                                <div className="col-md-3">
                                    <div><label className="col-sm-12">Select Year</label></div>
                                    <div className="col-md-10">
                                        <DatePicker

                                            dateFormat="YYYY"
                                            // dateFormat="DD/MM/YYYY"
                                            value={moment(this.state.year).format('YYYY')}
                                            onChange={this.handleYear}
                                            selected={moment(this.state.year).format('YYYY')}
                                            timeFormat={false}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="col-md-10 margin-top-20">
                                        <button type="button" className="btn btn-primary" onClick={this.filter.bind(this)}>Search</button>
                                    </div>
                                </div>

                            </>
                            : ''}
                        {
                            this.state.tab == 2 ? <>
                                <div className="col-md-3">
                                    <div><label className="col-sm-12">Select Year</label></div>
                                    <div className="col-md-10">
                                        <DatePicker

                                            dateFormat="YYYY"
                                            // dateFormat="DD/MM/YYYY"
                                            value={moment(this.state.year).format('YYYY')}
                                            onChange={this.handleYear}
                                            selected={moment(this.state.year).format('YYYY')}
                                            timeFormat={false}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div><label className="col-sm-12">Leave Category</label></div>
                                    <div className="col-md-10">
                                        <Select
                                            options={this.state.leaveCategory}
                                            value={this.state.selected_category}
                                            onChange={this.handlecategory}
                                            className="react-select-container checkValidate"
                                            classNamePrefix="react-select"
                                        />

                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div><label className="col-sm-12">Leave Status</label></div>
                                    <div className="col-md-10">
                                        <Select
                                            options={this.state.statusList}
                                            value={this.state.selected_status}
                                            onChange={this.handlestatus}
                                            className="react-select-container checkValidate"
                                            classNamePrefix="react-select"
                                        />

                                    </div>
                                </div>
                            
                                <div className="col-md-3">
                                    <div className="col-md-10 margin-top-20">
                                        <button type="button" className="btn btn-primary" onClick={this.filter.bind(this)}>Search</button>
                                    </div>
                                </div>


                            </> : ''
                        }
                    </div>
                </div>

                <div className='row container mt20'>
                    <table width="99%"
                        className="table table-striped table-bordered table-hover nowrap dt-responsive"
                        id="dataTables-table"
                    />
                </div>
            </div>
        )
    }
    // }

}


