import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import { getMainRole, main_url } from '../../utils/CommonFunction';
import Select from 'react-select';

const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');

$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

const workflow_type = [{ label: 'Work Flow', value: 1 }, { label: 'Work Flow Wiht Branch', value: 2 }]

export default class WorkFlowTableForMore extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            selected_work_flow: workflow_type[this.props.type - 1],
            selectedRequest: '',
            is_main_role: getMainRole()
        }
    }

    componentDidMount() {
        this.$el = $(this.el);
        this.getWorkFlowList();

        let that = this;
        $("#dataTables-table").on('click', '#toView', function () {

            var data = $(this).find("#view").text();
            data = $.parseJSON(data);
            that._getWorkFlowTableView(data.workflow_id)

        });

        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            that._getWorkFlowTableEdit(data.workflow_id)
        });
    }

    _getWorkFlowTableView(id) {
        fetch(main_url + "workFlow/getWorkFlowViewDataWithAmount/" + id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {

                    this.props.goToViewForm(res);
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }
    _getWorkFlowTableEdit(id) {
        fetch(main_url + "workFlow/getWorkFlowViewDataWithAmount/" + id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {

                if (res) {
                    this.props.goToEditForm(res);
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));
    }

    getWorkFlowList() {
        fetch(`${main_url}workflow/getWorkFlowWithAmount`)
            .then(res => { if (res.ok) return res.json() })
            .then(data => {
                this.setState({
                    data: data
                }, () => this._setTableData(data))
            })
    }
    _setTableData = (data) => {

        var table;
        var l = [];
        let obj = {};

        for (var i = 0; i < data.length; i++) {
            let result = data[i]

            obj = {
                no: i + 1,
                permissionType: result.permission_type,
                permissionTitle: result.permission_title,
                request_by: result.request_by,
                branch: result.branch_name,
                department: result.deptname,
                over_limit_amount: result.over_limit_amount == 1 ?
                    '<div className="pretty p-default p-curve"> <input type="checkbox" checked="checked" disabled/> </div>' : '<div className="pretty p-default p-curve"> <input type="checkbox" disabled /> </div>',
                action:
                    '<button  style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' +
                    '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>'
            }

            l.push(obj)
        }

        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty();
        }

        table = $("#dataTables-table").DataTable({

            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            paging: true,
            // buttons: true,
            dom: 'Bfrtip',
            buttons: [
                'copy', 'csv', 'excel', 'pdf'
            ],

            data: l,
            columns: [
                { title: "No", data: "no" },
                { title: "Permission Type", data: "permissionType" },
                { title: "Permission Title", data: "permissionTitle" },
                { title: "Request By", data: "request_by" },
                { title: "Branch", data: "branch" },
                { title: "Department", data: "department" },
                { title: "Over Limit Amount", data: "over_limit_amount" },
                { title: "Action", data: "action" }
            ],
        });
    }


    render() {
        return (
            <div className="row  border-bottom white-bg dashboard-header">
                <div className="row">
                    <div className="col-md-12 btn-rightend">
                        <div className="col-md-4">
                            <Select
                                placeholder="Choose Permission Type"
                                value={this.state.selected_work_flow}
                                onChange={this.props.changeWorkFlow}
                                options={workflow_type}
                                className='react-select-container checkValidate'
                                classNamePrefix="react-select"
                            />
                        </div>
                    </div>
                </div>
                <div className="row mt20">
                    <table width="99%"
                        className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                        id="dataTables-table"
                    />
                </div>
            </div>
        )
    }
}