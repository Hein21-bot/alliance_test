import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import moment from 'moment'
import * as jsPDF from 'jspdf';
import { main_url,getUserId, getMainRole, getInformation, print, fno } from "../../../../utils/CommonFunction";
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
        var has_action = permission.isView === 1 || permission.isEdit === 1  ? true : false;
        var has_select = permission.isSelect === 1 ? true : false;
       
        for (var i = 0; i < data.length; i++) {
            let result = data[i];
            let obj = [];
            // if (result.status === 0) {
            //     status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'
            // }
            // else if (result.status === 1) {
            //     status = '<small class="label label-warning" style="background-color:#b33ce0"> Check  </small>'
            // }
            // else if (result.status === 2) {
            //     status = '<small class="label label-warning" style="background-color:#f2a509"> Verify </small>'
            // }
            // else if (result.status === 3) {
            //     status = '<small class="label label-warning" style="background-color:#29a50a"> Approve  </small>'
            // }
            // else if (result.status === 4) {

            //     status = '<small class="label label-warning" style="background-color:#f60e2f"> Reject  </small>'
            // }
            // else if (result.status === 5) {
            //     status = '<small class="label label-warning" style="background-color:#cc0066"> ReferBack </small>'
            // }
            console.log("obj is ===>", result)
            obj = {
                no: i + 1,
                select : false,
                employee_id: data[i].code ? data[i].code : '',
                employee_name: data[i].fullname ? data[i].fullname : '',
                position: data[i].designations ? data[i].designations : '-',
                career_level: data[i].career_level ? data[i].career_level : '-',
                career_sub_level : data[i].career_sub_level ? data[i].career_sub_level :'-',
                department : data[i].deptname ? data[i].deptname : '-',
                branch: data[i].branch_name ? data[i].branch_name : '-',
                region : data[i].region_name ? data[i].region_name : '-',
                employ_date : data[i].employ_date ? data[i].employ_date : '-',
                last_promotion_date : data[i].last_promotion_date ? data[i].last_promotion_date : '-',
                date: moment(result.createdAt).format('DD-MM-YYYY'), 
                service_year : data[i].service_year ? data[i].service_year :'',
                status: status

            }
            if(has_select){
                obj.select = permission.isSelect === 1 ? '<div style=" alignItems:center" class="btn" id="toSelect" ><input type="checkbox" /><span id="select" class="hidden" >' + JSON.stringify(result) + '</span>  </div>'  : '' //'<div style="margin-right:0px;height:20px;width:20px;border:1px solid red" class="btn" id="toSelect" ><i className="fas fa-address-card" style="color:red"></i><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  </div>' : '';
            }
            if (has_action) {
                if (result.status !== 3) {
                    obj.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
                    obj.action += permission.isEdit === 1 || (result.status == 5 && data[i].createdBy == this.state.user_id ) ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';
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
            { title: "Department", data: "department" },
            { title: "Branch", data: "branch" },
            { title: "Region", data: "region" },
            { title: "Employed Date", data: "employ_date" },
            { title: "Last Promtion Date", data: "date" },
            { title: "Service Year", data: "service_year" },
            { title: "Service Year in Current Level", data: "date" },
            { title: "Service Year in Current Sub Level", data: "date" },
            // { title: "Status", data: "status" }
        ]

        if (has_action) {
            column.push({ title: "Action", data: "action" })
        }
        if (has_select) {
            column.splice(1,0,{ title: "Select", data: "select" })
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
            buttons:  [
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
                <table width="99%" 
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                    id="dataTables-table"
                />
            </div >
        )
    }
}