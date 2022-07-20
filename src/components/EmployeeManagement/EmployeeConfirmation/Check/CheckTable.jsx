import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import moment from 'moment'
import * as jsPDF from 'jspdf';
import { main_url, getUserId, getMainRole, getInformation, print, fno } from "../../../../utils/CommonFunction";
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');


export default class BenefitChildTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: getUserId("user_info"),
            dataSource: props.data,
            selectedRequest: '',
            is_main_role: getMainRole(),

        }
    }
    componentDidMount() {
        this.$el = $(this.el);

        this.setState({
            dataSource: this.props.data
        }, () => {
            this._setTableData(this.state.dataSource)
        });


        let that = this;
        $("#dataTables-table").on('click', '#toView', function () {

            var data = $(this).find("#view").text();
            data = $.parseJSON(data);
            that.props.goToViewForm(data);

        });


        // $("#dataTables-table").on('click', '#toPrint', function () {

        //     fetch(`${main_url}child_benefit/getChildAvailableAmount`)
        //         .then(res => { if (res.ok) return res.json() })
        //         .then(list => {
        //             var data = $(this).find("#print").text();
        //             data = $.parseJSON(data);

        //             that.getPrintData(data, list.amount)
        //         })

        // });

        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            that.props.goToEditForm(data);

        });

        $("#dataTables-table").on('click', '#toSelect', function () {

            var data = $(this).find("#select").text();
            data = $.parseJSON(data);
            that.props.handleCheckBoxChange(data);
        });
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                dataSource: this.props.data
            }, () => {
                this._setTableData(this.state.dataSource);

            })
        }
        else if (prevProps.checkedAll !== this.props.checkedAll) {
            if (this.props.checkedAll) {
                $("input[type='checkbox']").prop("checked", true);
            }
            else {
                $("input[type='checkbox']").prop("checked", false);
            }
        }
    }

   



    search(status) {
        let data = this.state.dataSource;
        data = data.filter(d => { return status === d.status });
        this._setTableData(data)
    }



    _setTableData = (data) => {
        var table;
        var l = [];
        var status;
        var permission = this.props.permission;
        var has_action = permission.isView === 1 || permission.isEdit === 1 ? true : false;
        var has_select = permission.isSelect === 1 ? true : false;

        for (var i = 0; i < data.length; i++) {
            let result = data[i];
            let obj = [];
            if (data[i].status === 0) {
                status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'

            }
            else if (data[i].status === 1) {
                status = '<small class="label label-warning" style="background-color:#b33ce0"> Check</small>'
            }
            else if (data[i].status === 2) {
                status = '<small class="label label-warning" style="background-color:#0078FF"> Confirm</small>'
            }
            else if (data[i].status === 3) {
                status = '<small class="label label-warning" style="background-color:#f2a509"> Verify</small>'
            }
            else if (data[i].status === 4) {
                status = '<small class="label label-warning" style="background-color:#29a50a">Approve</small>'
            }

            obj = {
                no: i + 1,
                employee_id: data[i].employment_id ? data[i].employment_id : '-',
                employee_name: data[i].fullname ? data[i].fullname : '-',
                position: data[i].designations ? data[i].designations : '-',
                level: data[i].career_sub_level ? data[i].career_sub_level : '-',
                region: data[i].region_name ? data[i].region_name : '-',
                department: data[i].deptname ? data[i].deptname : '-',
                branch: data[i].branch_name ? data[i].branch_name : '-',
                date: data[i].date ? moment(data[i].date).format('DD-MM-YYYY') : '',
                promotionDate: data[i].promotion_date ? moment(data[i].promotion_date).format('DD-MM-YYYY') : moment(data[i].date).format('DD-MM-YYYY'),
                serviceYear: data[i].service_year,
                currentLevelServiceYear: '_',
                currentSubLevelServiceYear: data[i].current_sub_level_service_year ? data[i].current_sub_level_service_year : '_',
                status: status,
                confirmOrNot: data[i].confirm_or_not ? data[i].confirm_or_not : ''
            }

            if (has_select) {
                obj.select = permission.isSelect === 1 ? '<div style=" alignItems:center" class="btn" id="toSelect" ><input type="checkbox" /><span id="select" class="hidden" >' + JSON.stringify(result) + '</span>  </div>' : '' //'<div style="margin-right:0px;height:20px;width:20px;border:1px solid red" class="btn" id="toSelect" ><i className="fas fa-address-card" style="color:red"></i><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  </div>' : '';
            }
            if (has_action) {
                if (result.status !== 4) {
                    obj.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
                    obj.action += permission.isEdit === 1  ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';
                } else {
                    obj.action = permission.isView === 1 ?
                        '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';

                }
            }


            l.push(obj)

        }

        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty();
        }

        var column = [
            { title: "No", data: "no" },
            { title: "Employee Id", data: "employee_id" },
            { title: "Name", data: "employee_name" },
            { title: "Designation", data: "position" },
            { title: "Level", data: "level" },
            { title: "Department", data: "department" },
            { title: "Branch", data: "branch" },
            { title: "Region", data: "region" },
            { title: "Employed Date", data: "date" },
            { title: "Last Promtion Date", data: "promotionDate" },
            { title: "Service Year", data: "serviceYear" },
            { title: "Service Year in Current Level", data: "currentLevelServiceYear" },
            { title: "Service Year in Current Sub Level", data: "currentSubLevelServiceYear" },
            { title: "Status", data: "status" },
            { title: "Confirm or Not", data: "confirmOrNot" },

        ]

        if (has_action) {
            column.push({ title: "Action", data: "action" })
        }
        if (has_select) {
            column.splice(1, 0, { title: "Select", data: "select" })
        }
        table = $("#dataTables-table").DataTable({

            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            pageLength: 50,
            paging: true,
            // buttons: true,
            dom: 'Bfrtip',
            // buttons: [
            //     'copy', 'csv', 'excel', 'pdf'
            // ],
            buttons: [
                // 'copy',
                // {
                //         extend: 'csvHtml5',
                //         title: 'Child Benefit',
                // },
                // {
                //     extend: 'excelHtml5',
                //     title: 'Child Benefit',
                // },
                // {
                //     extend: 'pdfHtml5',
                //     title: 'Child Benefit',
                // }
            ],
            data: l,
            columns: column

        });

    }


    render() {
        return (

            <div>
                {/* <div className="row  white-bg dashboard-header">
                    <div className="row">
                        <div class="btn-group-g ">
                            <button type="button" class="btn label-request g" onClick={this.getRequest.bind(this)}>Request</button>
                            <button type="button" class=" btn label-check g" onClick={this.getCheck.bind(this)}>Check</button>
                            <button type="button" class="btn label-verified g" onClick={this.getVerified.bind(this)}>Verify</button>
                            <button type="button" class="btn label-approve g" onClick={this.getApprove.bind(this)}>Approve</button>
                            <button type="button" class="btn label-reject g" onClick={this.getReject.bind(this)}>Reject</button>
                        </div>
                    </div>
                </div> */}
                {/* <h3 style={{  }}>Confirmation Check Table</h3> */}
                <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                    id="dataTables-table"
                />
            </div >
        )
    }
}