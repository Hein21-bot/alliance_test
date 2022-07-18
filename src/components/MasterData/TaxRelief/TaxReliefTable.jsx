import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'jspdf-autotable';
import moment from 'moment';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

export default class TaxReliefTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: props.data,
        }
    }

    componentDidMount() {
        this.setState(
            { dataSource: this.props.data },
            () => this.showTable(this.state.dataSource)
        )

    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.setState({
                dataSource: this.props.data
            }, () => {
                this.showTable(this.state.dataSource);

            })
        }
    }

    showTable(data) {
        var table;
        var self = this;
        var list = [];
        var obj, one = [];

        for (let i = 0; i < data.length; i++) {
            obj = data[i];
            one = {
                no: i + 1,
                date: obj.date != null ? moment(obj.date).format('DD-MM-YYYY') : '',
                allowance_reason: obj.name,
                allowance_percent: obj.allowance_percent,
                allowance_amount: obj.allowance_amount,
                remark: obj.remark,
                action: '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="View" ><span id="view" class="hidden" >' + JSON.stringify(obj) + '</span>&nbsp;View</button><button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="Edit" ><span id="edit" class="hidden" >' + JSON.stringify(obj) + '</span>&nbsp;Edit</button>',
            }

            list.push(one);
        }

        if ($.fn.dataTable.isDataTable('#dataTables')) {
            table = $('#dataTables').dataTable({
                destroy: true,
                searching: false,
            });
            // table.fnClearTable();
            table.fnDestroy();
            // $('#dataTables').empty();
        }


        var column = [
            { title: 'No', data: 'no' },
            { title: 'Date', data: 'date' },
            { title: 'Allowance Reason', data: 'allowance_reason' },
            { title: 'Allowance Percent', data: 'allowance_percent' },
            { title: 'Allowance Amount', data: 'allowance_amount' },
            { title: 'Remark', data: 'remark' },
            { title: "Action", data: 'action' }
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

        $('#dataTables').on('click', 'tbody #verify_by', function (e) {
            const id = e.target.attributes.id.value;
            const index = Number(e.target.attributes.index.value);
            const value_ = e.target.attributes.value.value;
            let newArr = [...self.state.leavePermissionData]
            newArr[index][id] = value_;
            self.setState(
                { leavePermissionData: newArr },
                () => {
                    document.getElementById(`verify_by${index}`).innerHTML = value_;
                }
            )
        });

        $("#dataTables").on('click', '#Edit', function () {
            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            self.props.goToEditForm(data);

        });
        $("#dataTables").on('click', '#View', function () {
            var data = $(this).find("#view").text();
            data = $.parseJSON(data);
            self.props.goToViewForm(data);

        });

    }

    render() {
        return (
            <div>
                <h3 className="col-md-12">Tax Relief Table</h3>
                <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive rm-marginTop"
                    id="dataTables"
                ></table>
            </div >
        )
    }
}
