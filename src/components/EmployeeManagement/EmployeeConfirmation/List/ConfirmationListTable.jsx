import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import moment from 'moment'
import Select from "react-select";
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
        console.log('dept ===>', this.props.departmentlist)
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
            }, async () => {
                await this._setTableData(this.state.dataSource);
                $("#dropdownid").on("change", function (e) {
                    console.log("Change", $(this).val());
                })
                // $("#checkPerson").on('click', function (e) {

                //     // var data = $(this).find("#checkPerson").text();
                //     // var data1 = $('#dropdownid').val("Hello");
                //     console.log('data is =================>',  $(this).val())
                //     // data = $.parseJSON(data);

                //     // that.props.handleCheckBoxChange(data);

                // });
            })
        }
    }

    search(status) {
        let data = this.state.dataSource;
        data = data.filter(d => { return status === d.status });
        this._setTableData(data)
    }




    _setTableData = async (data) => {
        var table;
        var l = [];
        var status;
        var permission = this.props.permission;
        var has_action = permission.isView === 1 || permission.isEdit === 1 ? true : false;
        var has_select = permission.isSelect === 1 ? true : false;

        for (var i = 0; i < data.length; i++) {

            // await fetch(main_url + 'confirmation/detailCheckPerson/' + data[i].branch_id).then(response => {
            //     return response.json();
            // }).then(res => { tempArray = res })
            let result = data[i];
            let obj = [];
            obj = {
                no: i + 1,
                select: false,
                employee_id: data[i].code ? data[i].code : '',
                employee_name: data[i].fullname ? data[i].fullname : '',
                position: data[i].designations ? data[i].designations : '-',
                career_level: data[i].career_level ? data[i].career_level : '-',
                career_sub_level: data[i].career_sub_level ? data[i].career_sub_level : '-',
                department: data[i].deptname ? data[i].deptname : '-',
                branch: data[i].branch_name ? data[i].branch_name : '-',
                region: data[i].region_name ? data[i].region_name : '-',
                employee_date: data[i].employee_date ? moment(data[i].employee_date).format('DD-MM-YYYY') : '-',
                promotion_date: data[i].last_promotion_date ? moment(data[i].last_promotion_date).format('DD-MM-YYYY') : '-',
                date: moment(result.createdAt).format('DD-MM-YYYY'),
                service_year: data[i].service_year ? data[i].service_year : '-',
                current_level_service_year: data[i].current_level_service_year ? data[i].current_level_service_year : '',
                current_sub_level_service_year: data[i].current_sub_level_service_year ? data[i].current_sub_level_service_year : '',
                leave: data[i].leave ? data[i].leave : '-',
                extension: data[i].extension ? data[i].extension : '-',
                status: status,

                // checkPerson: `<div id ='toCheckPerson' ><select id='dropdownid' on>` +
                //     '<option value="Hello"> Please choose </option>' +
                //     tempArray.map((v, i) => (
                //         `<option value='${v.user_id}' id=${v.user_id}>${v.fullname}</option>`
                //     )) +
                //     '</select></div>'



            }
            if (has_select) {
                obj.select = permission.isSelect === 1 ? '<div style="alignItems:center" id="toSelect" class="select-btn"  ><input  type="checkbox" /><span id="select" class="hidden" >' + JSON.stringify(result) + '</span>  </div>' : '' //'<div style="margin-right:0px;height:20px;width:20px;border:1px solid red" class="btn" id="toSelect" ><i className="fas fa-address-card" style="color:red"></i><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  </div>' : '';
            }
            if (has_action) {
                if (result.status !== 3) {
                    obj.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
                    obj.action += permission.isEdit === 1 || (result.status == 5 && data[i].createdBy == this.state.user_id) ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';
                } else {
                    obj.action = permission.isView === 1 ?
                        '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';

                    if (result.print === 1) {
                        obj.action +=
                            '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toPrint" ><span id="print" class="hidden" >' +
                            JSON.stringify(result) +
                            '</span>  <i className="fa fa-cogs"></i>&nbsp;Printed</button>';
                    } else {
                        obj.action +=
                            '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toPrint" ><span id="print" class="hidden" >' +
                            JSON.stringify(result) +
                            '</span>  <i className="fa fa-cogs"></i>&nbsp;Print</button>';
                    }
                }
            }
            // obj.checkPerson = `<div><Select options={[]} value={0} class="react-select-container checkValidate" classNamePrefix="react-select"/></div>`,
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
            { title: "Level", data: "career_level" },
            { title: "Sub Level", data: "career_sub_level" },
            // { title: 'Check Person', data: 'checkPerson' },
            { title: "Department", data: "department" },
            { title: "Branch", data: "branch" },
            { title: "Region", data: "region" },
            { title: "Employed Date", data: "employee_date" },
            { title: "Last Promtion Date", data: "promotion_date" },
            { title: "Service Year", data: "service_year" },
            { title: "Service Year in Current Level", data: "current_level_service_year" },
            { title: "Service Year in Current Sub Level", data: "current_sub_level_service_year" },
            { title: "Leave", data: "leave" },
            { title: "Extension", data: "extension" },


            // { title: "Status", data: "status" }
        ]

        if (has_action) {
            column.push({ title: "Action", data: "action" })
        }
        if (has_select) {
            column.splice(1, 0, { title: "Select", data: "select" })
        }
        table = $("#dataTables-table").DataTable({
            // columnDefs: [
            //     {
            //       targets: 5,
            //       createdCell: function (td) {
            //         $(td).css('background-color', "red")
            //       }
            //     }
            //   ],
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
            columns: column,
            createdRow: function (row, data, td, index) {
                if (data.leave === true) {
                    $(row).css('background-color', 'Yellow');
                }
                if (data.extension != '-') {
                    // $(row).css('background-color', 'Orange');
                    $(td).first().addClass("changeRed");
                }
            }


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
                <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                    id="dataTables-table"
                />
            </div >
        )
    }
}