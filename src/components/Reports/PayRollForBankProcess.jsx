import React, { Component } from "react";
import { main_url } from '../../utils/CommonFunction';
import DatePicker from 'react-datetime';
import moment from "moment";
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');


class PayrollReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: moment()
        }
    }

    async componentDidMount() {
        this.$el = $(this.el);
        this.setState(
            {
                dataSource: this.props.data,

            },
            () => {
                this._setTableData(this.state.dataSource);
            }
        )
    }
    handleSelectedDate = async (event) => {
        this.setState({
            date: event
        })
    }
    handleSearchData = () => {
        console.log(">>>>>", this.state.date)
    }
    // handleSearchData = (branchId, departmentId, regionId,empName, designationId) => {
    //     fetch(`${main_url}.../${regionId == undefined ? 0 : regionId}/${departmentId == undefined ? 0 : departmentId}/${designationId == undefined ? 0 : designationId}/${branchId == undefined ? 0 : branchId}/${empName == undefined ? 0 : empName}`)
    //       .then(res => { if (res.ok) return res.json() })
    //       .then(list => {
    //         this._setTableData(list);
    //       })
    //   }

    _setTableData = (data) => {
        var table;
        var l = [];
        // for (var i = 0; i < data.length; i++) {
        //     let result = data[i];
        let obj = [];
        obj = {
            no: 1,
            employee_id: "employment_id",
            employee_name: "employee_name",
            branch: "branch_name",
            bank_format_name: "bank_format_name",
            nrc: "nrc",
            atm_no: "atm_no",
            total_salary: "total_salary",
        }
        l.push(obj)

        // }
        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty();
        }
        var column = [
            { title: "Sr No", data: "no" },
            { title: "Employee Id", data: "employee_id" },
            { title: " Name", data: "employee_name" },
            { title: "Branch", data: "branch" },
            { title: "Bank Format Name", data: "bank_format_name" },
            { title: "NRC", data: "nrc" },
            { title: "<div class='specific_header_color'>ATM No</div>", data: "atm_no" },
            { title: "Total Salary", data: "total_salary" },
        ]
        table = $("#dataTables-table").DataTable({

            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            pageLength: 50,
            paging: true,
            //     // buttons: true,
            dom: 'Bfrtip',
            //     // buttons: [
            //     //     'copy', 'csv', 'excel', 'pdf'
            //     // ],
            buttons: [
                //         // 'copy',
                //         // {
                //         //         extend: 'csvHtml5',
                //         //         title: 'Child Benefit',
                //         // },
                //         // {
                //         //     extend: 'excelHtml5',
                //         //     title: 'Child Benefit',
                //         // },
                //         // {
                //         //     extend: 'pdfHtml5',
                //         //     title: 'Child Benefit',
                //         // }
            ],
            data: l,
            columns: column,
            createdRow: function (row, data, index) {
                console.log('data is ===>', data, row, )
                if ("NRC" !== 0) {
                    $(column).css('background-color', 'orange');
                }
            }
        });

    }
    render() {

        return (
            <div>
                <div className="row  white-bg dashboard-header">

                    <div className='flex-row' style={{ display: 'flex', justifyContent: 'left', alignItems: 'center', margin: '10px 10px 10px 10px' }}>
                        <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.date}
                            onChange={this.handleSelectedDate}
                            timeFormat={false}
                        />
                        <button className='btn btn-primary text-center' style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }} onClick={() => this.handleSearchData()}>Search</button>
                    </div>
                </div>
                <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                    id="dataTables-table"
                />
            </div>
        )
    }
}
export default PayrollReport;