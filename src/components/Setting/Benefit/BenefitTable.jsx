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

export default class BenefitTable extends Component {
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
        const { benefit_type_options, martial_status_options, level_options } = this.props;

        for (let i = 0; i < data.length; i++) {
            obj = data[i];
            one = {
                no: i + 1,
                date: obj.date == null ? '' : moment(obj.date).format('DD-MM-YYYY'),
                benefit_type_id: benefit_type_options.find(v => Number(v.benefit_type_id) === Number(obj.benefit_type_id)) ? benefit_type_options.find(v => Number(v.benefit_type_id) === Number(obj.benefit_type_id)).value : '',
                is_married: martial_status_options.find(v => Number(v.is_married) === Number(obj.is_married)) ? martial_status_options.find(v => Number(v.is_married) === Number(obj.is_married)).value : '',
                no_of_child: obj.no_of_child,
                amount: obj.amount,
                description: obj.description == '' ? obj.hospitalization_type : obj.description,
                allow_service_year: obj.allow_service_year,
                allow_level: ((level_options.find(v => Number(v.career_level_id) === Number(obj.allow_level)) ? level_options.find(v => Number(v.career_level_id) === Number(obj.allow_level)).career_level : '') + (obj.above_level == 1 ? ' and above' : '')),
                remark: obj.remark,
                text: obj.text,
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
            { title: "Date", data: "date", },
            { title: "Benefit Type", data: "benefit_type_id" },
            { title: "Martial Status", data: 'is_married' },
            { title: "Child Count", data: "no_of_child", },
            { title: "Amount", data: "amount", },
            { title: "Description", data: "description" },
            { title: "Allow Service Year", data: 'allow_service_year' },
            { title: "Allow Level", data: "allow_level", },
            { title: "Remark", data: "remark", },
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
            <div className='margin-y'>
                {/* <h3 className="col-md-12">Benefit Table</h3> */}
                <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive rm-marginTop"
                    id="dataTables"
                ></table>
            </div >
        )
    }
}
