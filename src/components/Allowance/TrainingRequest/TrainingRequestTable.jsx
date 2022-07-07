import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css'
import 'jspdf-autotable';
import DatePicker from 'react-datetime';
import moment from "moment";
import Select from 'react-select';
import { main_url,getUserId, getMainRole, getCookieData, getFirstDayOfMonth, getBranch, getInformation, print, fno } from '../../../utils/CommonFunction';
//import Select from 'react-select/src/Select';
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');

export default class TravelRequestAdvancedTable extends Component {
    constructor(props) {

        super(props);
        this.state = {
            dataSource: [],
            is_main_role: getMainRole(),
            selected_branch: [],
            selected_training_type: [],
            branch_id: '',
            trainingType: [],
            training_type: '',
            user_id: getUserId("user_info"),
            user_info: getCookieData("user_info"),
            s_date: moment(getFirstDayOfMonth()),
            e_date: moment(),
            training_type_id: '',

        }
    }

    async componentDidMount() {
        let branch = await getBranch();
        this._getTrainingType();
        this.filter();
        this.setState({
            branch: branch,

        })

        let that = this
        $("#dataTables-table").on('click', '#toView', function () {
            var data = $(this).find("#view").text();
            data = $.parseJSON(data);
            that._getTrainingViewData(data.training_allowance_id)

        });

        $("#dataTables-table").on('click', '#toEdit', function () {
            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            that._getTrainingEditData(data.training_allowance_id)

        });

        $("#dataTables-table").on('click', '#toClaim', function () {
            var data = $(this).find("#claim").text();
            data = $.parseJSON(data);
            that._getAdvancedData(data.training_allowance_id)

        });

        $("#dataTables-table").on('click', '#toClaimRequestView', function () {
            var data = $(this).find("#CRView").text();
            data = $.parseJSON(data);
            that._getClaimRequestViewData(data.training_allowance_id)

        });

        $("#dataTables-table").on('click', '#toClaimRequestEdit', function () {
            var data = $(this).find("#CREdit").text();
            data = $.parseJSON(data);
            that._getClaimRequestEditData(data.training_allowance_id)
        });

        $("#dataTables-table").on('click', '#toAdvanceClaimRequestView', function () {
            var data = $(this).find("#ACRView").text();
            data = $.parseJSON(data);
            that._getAdvanceClaimRequestViewData(data.training_allowance_id, data.advanced_id)

        });

        $("#dataTables-table").on('click', '#toAdvanceClaimRequestEdit', function () {
            var data = $(this).find("#ACREdit").text();
            data = $.parseJSON(data);
            that._getAdvanceClaimRequestEditData(data.training_allowance_id, data.advanced_id)

        });

        $("#dataTables-table").on('click', '#toPrint', function () {
            var data = $(this).find("#print").text;
            data = $.parseJSON(data);
            if (data.isClaim === 2) {
                that.getPrintDataForTravelAdvanceClaim(data);
            } else {
                that.getPrintData(data)
            }
        });
    }

    _getAdvancedData(trainingId) {

        fetch(main_url + "allowance/getAdvancedDataByTrainingId/" + trainingId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.props.goToClaimAddNewForm(res);

                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    _getTrainingViewData(trainingId) {

        fetch(main_url + "allowance/getTrainingViewData/" + trainingId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.props.goToAdvancedView(res);
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }

    _getClaimRequestViewData(trainingId) {

        fetch(main_url + "allowance/getClaimRequestViewData/" + trainingId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.props.goToClaimRequestView(res);
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }

    handleBranch = (event) => {
        this.setState({
            selected_branch: event
        })
    }

    handleTrainingType = (event) => {
        this.setState({
            selected_training_type: event
        });
    }

    handleStartDate = (event) => {
        this.setState({
            s_date: event
        });
    };

    handleEndDate = (event) => {
        this.setState({
            e_date: event
        });
    };

    getRequest() {
        this.request(0);
    }
    getCheck() {
        this.request(1);
    }
    getVerified() {
        this.request(2);
    }
    getApprove() {
        this.request(3);
    }
    getReject() {
        this.request(4);
    }

    request(status) {
        let data = this.state.data;
        data = data.filter(d => { return status === d.status });
        this._setTableData(data)
    }

    _getClaimRequestEditData(trainingId) {
        fetch(main_url + "allowance/getClaimRequestViewData/" + trainingId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.props.goToClaimRequestEdit(res);
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }

    _getAdvanceClaimRequestEditData(trainingId, advancedId) {

        fetch(main_url + "allowance/getAdvanceClaimRequestViewData/" + trainingId + "/" + advancedId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.props.goToAdvanceClaimRequestEdit(res);
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }

    _getAdvanceClaimRequestViewData(trainingId, advancedId) {

        fetch(main_url + "allowance/getAdvanceClaimRequestViewData/" + trainingId + "/" + advancedId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.props.goToAdvanceClaimRequestView(res);
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }

    _getTrainingEditData(trainingId) {

        fetch(main_url + "allowance/getTrainingViewData/" + trainingId)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.props.goToAdvancedEdit(res);
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    _getTrainingType() {
        fetch(main_url + "allowance/getTrainingType")
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ trainingType: res })
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    getTrainingAllowanceFilter(s_date, e_date, branch_id, t_type, user_id) {
        const user = getCookieData("user_info");
        fetch(main_url + "allowance/getTrainingAllowanceFilter/" + s_date + "/" + e_date + "/" + branch_id + "/" + t_type + "/" + user.user_id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ data: res }, () => this._setTableData(res))
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    // async setTrainingAdvanceData(doc, data, y) {
    //     var col = ["Title", "No. of Day", "Cost Per Day", "Amount"];
    //     var rows = [];
    //     if (data.isClaim === 2) {
    //         var one = await this.getAdvanceData(data.advanced_travel_id);
    //         data = one.length > 0 ? one[0] : data;
    //     }
    //     let day_count = data.noOfDays > 1 ? data.noOfNights : data.noOfDays;
    //     rows.push(
    //         ["Meal Allowance", data.noOfDays, Number(data.meals / data.noOfDays).toFixed(2), data.meals],
    //         ["Lodging", data.noOfDays, Number(data.lodging / day_count).toFixed(2), data.lodging],
    //         ["Transport", data.noOfDays, data.transport / data.noOfDays, data.transport],
    //         ["Total Amount", "", "", data.advanced_amount]
    //     )
    //     doc.text('Travel Advance', 13, y);
    //     doc.text('Location of Start: ' + data.start_location, 13, y + default_y * 1);
    //     doc.text('Destination(s): ' + data.destination, 150, y + default_y * 1);
    //     doc.text('Purpose of Travel', 13, y + default_y * 2);
    //     doc.text('Number of Day(s): ' + data.noOfDays, 13, y + default_y * 3);
    //     doc.text('Number of Night(s): ' + data.noOfNights, 150, y + default_y * 3);
    //     doc.autoTable(col, rows, { startY: y + default_y * 4 });
    // }

    // async getPrintData(data) {
    //     var info = await getInformation('training', data.training_allowance_id)
    //     var doc = new jsPDF('l', 'mm', 'legal');
    //     var today = moment(Date.now()).format('YYYY-MM-DD');
    //     var name = '';
    //     doc.setFontSize(12);
    //     doc.addImage(imgData, 'image/jpeg', 10, 10, 50, 15)
    //     doc.text('HR_0029', 300, 15);
    //     doc.text('Training Form', 300, 25)
    //     doc.text('Generate Date: ' + today, 13, 40)
    //     doc.text('Voucher No: ' + fno.fno_travel + data.form_no, 300, 40)

    //     if (data.isClaim === 0) {
    //         name = 'TrainingAdvance';
    //         this.setTravelAdvanceData(doc, data, 50);
    //     } else if (data.isClaim === 1) {
    //         name = 'TrainingClaim';
    //         await this.setTravelClaimData(doc, data, data.travel_allowance_id, 50);
    //     }
    //     doc.setFontSize(10);
    //     doc.setFontType("bold");
    //     doc.text('Request By', 13, doc.previousAutoTable.finalY + 17)
    //     doc.text('Check By', 65, doc.previousAutoTable.finalY + 17)
    //     doc.text('Verify By', 114, doc.previousAutoTable.finalY + 17)
    //     doc.text('Approve By', 164, doc.previousAutoTable.finalY + 17)
    //     doc.setFontSize(9);
    //     doc.setFontType("normal");
    //     doc.text(info.requested.requested_date, 13, doc.previousAutoTable.finalY + 25)
    //     doc.text(info.requested.employment_id, 13, doc.previousAutoTable.finalY + 30)
    //     doc.text(info.requested.requested_by, 13, doc.previousAutoTable.finalY + 35)
    //     doc.text(info.requested.branch_name, 13, doc.previousAutoTable.finalY + 40)
    //     doc.text(info.requested.designations, 13, doc.previousAutoTable.finalY + 45)
    //     doc.text(info.checked.checked_date, 65, doc.previousAutoTable.finalY + 25)
    //     doc.text(info.checked.employment_id, 65, doc.previousAutoTable.finalY + 30)
    //     doc.text(info.checked.checked_by, 65, doc.previousAutoTable.finalY + 35)
    //     doc.text(info.checked.branch_name, 65, doc.previousAutoTable.finalY + 40)
    //     doc.text(info.checked.designations, 65, doc.previousAutoTable.finalY + 45)
    //     doc.text(info.verified.verified_date, 114, doc.previousAutoTable.finalY + 25)
    //     doc.text(info.verified.employment_id, 114, doc.previousAutoTable.finalY + 30)
    //     doc.text(info.verified.verified_by, 114, doc.previousAutoTable.finalY + 35)
    //     doc.text(info.verified.branch_name, 114, doc.previousAutoTable.finalY + 40)
    //     doc.text(info.verified.designations, 114, doc.previousAutoTable.finalY + 45)
    //     doc.text(info.approved.approved_date, 164, doc.previousAutoTable.finalY + 25)
    //     doc.text(info.approved.employment_id, 164, doc.previousAutoTable.finalY + 30)
    //     doc.text(info.approved.approved_by, 164, doc.previousAutoTable.finalY + 35)
    //     doc.text(info.approved.branch_name, 164, doc.previousAutoTable.finalY + 40)
    //     doc.text(info.approved.designations, 164, doc.previousAutoTable.finalY + 45)
    //     // doc.save(name + '.pdf');
    //     print(doc)
    // }

    _setTableData = (data) => {
        var table;
        let btnview, btnedit, view, edit = '';
        var l = [];
        var permission = this.props.permission;
        var has_action = permission.isView === 1 || permission.isEdit === 1 ? true : false;

        for (var i = 0; i < data.length; i++) {
            let result = data[i];
            let status = '';
            let obj = [];
            if (result.status === 0) {
                status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'
            }
            else if (result.status === 1) {
                status = '<small class="label label-warning" style="background-color:#b33ce0"> Check </small>'
            }
            else if (result.status === 2) {
                status = '<small class="label label-warning" style="background-color:#f2a509"> Verify  </small>'
            }
            else if (result.status === 3) {
                status = '<small class="label label-warning" style="background-color:#29a50a"> Approve  </small>'
            }
            else if (result.status === 4) {
                status = '<small class="label label-warning" style="background-color:#f60e2f"> Reject  </small>'
            }
            else if (result.status === 5) {
                status = '<small class="label label-warning" style="background-color:#cc0066"> ReferBack </small>'
            }

            if (result.isClaim === 0) {
                btnview = 'toView';
                btnedit = 'toEdit';
                view = 'view';
                edit = 'edit';
            } else if (result.isClaim === 1) {
                btnview = 'toClaimRequestView';
                btnedit = 'toClaimRequestEdit';
                view = 'CRView';
                edit = 'CREdit';
            } else if (result.isClaim === 2) {
                btnview = 'toAdvanceClaimRequestView';
                btnedit = 'toAdvanceClaimRequestEdit';
                view = 'ACRView';
                edit = 'ACREdit';
            }
            // if (result.status === 0 || result.status === 4) {
            //     if (result.isClaim === 0 && result.isAdvancedClaim === 1) {
            //         action = '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="' + btnview + '" ><span id="' + view + '" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>'
            //     }
            //     else {
            //         action =
            //             '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit"  id="' + btnview + '" ><span id="' + view + '" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' +
            //             '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit"  id="' + btnedit + '" ><span id="' + edit + '" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>'
            //     }
            // }
            // else {
            //     action =
            //         this.state.is_main_role && result.status !== 3 ?
            //             '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit"  id="' + btnview + '" ><span id="' + view + '" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' +
            //             '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit"  id="' + btnedit + '" ><span id="' + edit + '" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>'
            //             : '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit"  id="' + btnview + '" ><span id="' + view + '" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>'
            // }
            obj = {
                no: i + 1,
                employee_id: result.employment_id,
                employee: result.fullname,
                position: result.designations ? result.designations : '-',
                branch: result.branch_name,
                advancedNo: fno.fno_training + result.form_no,
                trainingType: result.training_type,
                startDate: moment(result.start_date).format('DD-MM-YYYY h:mm a'),
                endDate: moment(result.end_date).format('DD-MM-YYYY h:mm a'),
                // purpose: result.purpose,
                status: status,
                title: result.isClaim === 0 ? '<small class="label label-warning" style="background-color:#b33ce0"> Advanced  </small>' :
                    ' <small class="label label-warning" style="background-color:#f2a509"> Claimed  </small>'
            }

            if (has_action) {
                if (result.status !== 3) {
                    obj.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="' + btnview + '" ><span id="' + view + '"  class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
                    obj.action += permission.isEdit === 1 || (result.status == 5 && result.createdBy == this.state.user_id ) ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="' + btnedit + '" ><span id="' + edit + '"  class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';
                } else {
                    obj.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="' + btnview + '" ><span id="' + view + '"  class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : ''
                    // obj.action += '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toPrint" ><span id="print" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Print</button>'
                }
            }

            if (result.isClaim === 0 && result.isAdvancedClaim === 0 && result.status === 3) {
                obj.action += '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toClaim" ><span id="claim" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Claim</button>'
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
            {title: "Employee Id", data: "employee_id"},
            { title: "Employee Name", data: "employee" },
            { title: "Position", data: "position" },
            { title: "Branch", data: "branch" },
            { title: "Form Number", data: "advancedNo" },
            { title: "Training Type", data: "trainingType" },
            { title: "Start Date", data: "startDate" },
            { title: "End Date", data: "endDate" },
            // { title: "Purpose", data: "purpose" },
            { title: "Title", data: "title" },
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
            buttons: true,
            dom: 'Bfrtip',
            // buttons: [
            //     'copy', 'csv', 'excel', 'pdf'
            // ],
            buttons:  [
                'copy',
            {
                    extend: 'csvHtml5',
                    title: 'Training Request',
            },
            {
                extend: 'excelHtml5',
                title: 'Training Request',
            },
            {
                extend: 'pdfHtml5',
                title: 'Training Request',
            }],
            data: l,
            columns: column
        });
    }

    filter() {
        let s_date = moment(this.state.s_date).format('YYYY-MM-DD');
        let e_date = moment(this.state.e_date).format('YYYY-MM-DD');
        let t_type = Array.isArray(this.state.selected_training_type) ? 0 : this.state.selected_training_type.value;
        let branch_id = Array.isArray(this.state.selected_branch) ? 0 : this.state.selected_branch.value;
        this.getTrainingAllowanceFilter(s_date, e_date, branch_id, t_type);
    }

    render() {
        return (
            <div>
                <div className="row border-bottom white-bg dashboard-header">
                    <div className="row">
                        <div className="col-md-2">
                            <div><label className="col-sm-12">Start Date</label></div>
                            <div className="col-md-10">
                                <DatePicker
                                    dateFormat="DD/MM/YYYY"
                                    value={this.state.s_date}
                                    onChange={this.handleStartDate}
                                    timeFormat={false}
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div><label className="col-sm-12">End Date</label></div>
                            <div className="col-md-10">
                                <DatePicker
                                    dateFormat="DD/MM/YYYY"
                                    value={this.state.e_date}
                                    onChange={this.handleEndDate}
                                    timeFormat={false}
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div><label className="col-sm-12">Branch</label></div>
                            <div className="col-md-10">
                                <Select
                                    options={this.state.branch}
                                    value={this.state.selected_branch}
                                    onChange={this.handleBranch}
                                    className='react-select-container checkValidate'
                                    classNamePrefix="react-select"
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div><label className="col-sm-12">Training Type</label></div>
                            <div className="col-md-10">
                                <Select
                                    options={this.state.trainingType}
                                    value={this.state.selected_training_type}
                                    onChange={this.handleTrainingType}
                                    className='react-select-container checkValidate'
                                    classNamePrefix="react-select"

                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <div className="col-md-10 margin-top-20">
                                <button type="button" className="btn btn-primary" onClick={this.filter.bind(this)}>Search</button>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div class="btn-group-g ">
                            <button type="button" class="btn label-request g" onClick={this.getRequest.bind(this)}>Request</button>
                            <button type="button" class=" btn label-check g" onClick={this.getCheck.bind(this)}>Check</button>
                            <button type="button" class="btn label-verified g" onClick={this.getVerified.bind(this)}>Verify</button>
                            <button type="button" class="btn label-approve g" onClick={this.getApprove.bind(this)}>Approve</button>
                            <button type="button" class="btn label-reject g" onClick={this.getReject.bind(this)}>Reject</button>
                        </div>
                    </div>
                    <br />
                    <div className="row">
                        <div className="col-md-12">
                            <table width="99%"
                                className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                                id="dataTables-table"
                            />
                        </div>
                    </div>
                </div >
            </div >
        )
    }
}