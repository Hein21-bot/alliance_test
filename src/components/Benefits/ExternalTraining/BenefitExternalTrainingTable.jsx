import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import moment from 'moment'
import { imgData } from '../../../utils/Global';
import * as jsPDF from 'jspdf';
import { getMainRole, getUserId,getInformation, print, fno } from "../../../utils/CommonFunction";
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
            is_main_role: getMainRole()
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

        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);

            that.props.goToEditForm(data);

        });

        $("#dataTables-table").on('click', '#toPrint', function () {

            var data = $(this).find("#print").text();
            data = $.parseJSON(data);
            that.getPrintData(data)
        })
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

    getRequest(){
        this.search(0);
    }
   
    getCheck(){
        this.search(1);
    }

    getVerified(){
     this.search(2);
   }
    getApprove(){
        this.search(3);
    }
    getReject(){
        this.search(4);
    }

  search(status){
    let data= this.state.dataSource;
    data= data.filter(d => {return status === d.status });
    this._setTableData(data)
  }

    async getPrintData(data) {

        var info = await getInformation('external_benefit', data.external_training_id)
        var doc = new jsPDF("p", "mm", "a4");
        var col = ["Training Name", "Date Of Training", "Training Period", "Amount"];
        var rows = [];
        var today = moment(Date.now()).format('YYYY-MM-DD')
        var temp = [data.training_name, data.training_date, data.training_period, data.approve_amount]
        rows.push(temp)
        doc.setFontSize(12);
        doc.addImage(imgData, 'image/jpeg', 10, 10, 50, 15)
        doc.text('HR_0020 V2', 150, 15);
        doc.text('Benefit Request Form', 150, 25)
        doc.text('Generate Date: ' + today, 13, 40)
        doc.text('Voucher No: ' + fno.fno_external + data.form_no, 150, 40)
        doc.autoTable(col, rows, { startY: 55 });
        if (doc.previousAutoTable.finalY > 220) {
            doc.addPage();
            doc.previousAutoTable.finalY = 0;
        }
        doc.setFontSize(10);
        doc.setFontType("bold");
        doc.text('Request By', 13, doc.previousAutoTable.finalY + 17)
        doc.text('Check By', 65, doc.previousAutoTable.finalY + 17)
        doc.text('Verify By', 114, doc.previousAutoTable.finalY + 17)
        doc.text('Approve By', 164, doc.previousAutoTable.finalY + 17)
        doc.setFontSize(9);
        doc.setFontType("normal");
        doc.text(info.requested.requested_date, 13, doc.previousAutoTable.finalY + 25)
        doc.text(info.requested.employment_id, 13, doc.previousAutoTable.finalY + 30)
        doc.text(info.requested.requested_by, 13, doc.previousAutoTable.finalY + 35)
        doc.text(info.requested.branch_name, 13, doc.previousAutoTable.finalY + 40)
        doc.text(info.requested.designations, 13, doc.previousAutoTable.finalY + 45)
        doc.text(info.checked.checked_date, 65, doc.previousAutoTable.finalY + 25)
        doc.text(info.checked.employment_id, 65, doc.previousAutoTable.finalY + 30)
        doc.text(info.checked.checked_by, 65, doc.previousAutoTable.finalY + 35)
        doc.text(info.checked.branch_name, 65, doc.previousAutoTable.finalY + 40)
        doc.text(info.checked.designations, 65, doc.previousAutoTable.finalY + 45)
        doc.text(info.verified.verified_date, 114, doc.previousAutoTable.finalY + 25)
        doc.text(info.verified.employment_id, 114, doc.previousAutoTable.finalY + 30)
        doc.text(info.verified.verified_by, 114, doc.previousAutoTable.finalY + 35)
        doc.text(info.verified.branch_name, 114, doc.previousAutoTable.finalY + 40)
        doc.text(info.verified.designations, 114, doc.previousAutoTable.finalY + 45)
        doc.text(info.approved.approved_date, 164, doc.previousAutoTable.finalY + 25)
        doc.text(info.approved.employment_id, 164, doc.previousAutoTable.finalY + 30)
        doc.text(info.approved.approved_by, 164, doc.previousAutoTable.finalY + 35)
        doc.text(info.approved.branch_name, 164, doc.previousAutoTable.finalY + 40)
        doc.text(info.approved.designations, 164, doc.previousAutoTable.finalY + 45)
        // doc.save('External Training Benefit.pdf');
        print(doc,data)
    }


    _setTableData = (data) => {
        var table;
        var l = [];
        var status;
        var permission = this.props.permission;
        var has_action = permission.isView === 1 || permission.isEdit === 1 ? true : false;
       if(data){
        for (var i = 0; i < data.length; i++) {
            let result = data[i];
            let obj = [];
            if (result.status === 0) {
                status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'
            }
            else if (result.status === 1) {
                status = '<small class="label label-warning" style="background-color:#b33ce0"> Check  </small>'
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

            obj = {
                no: i + 1,
                form_no: fno.fno_external + data[i].form_no,
                employee_id: data[i].employment_id,
                employee_name: data[i].fullname,
                position: data[i].designations ? data[i].designations : '-',
                branch: data[i].branch_name,
                training_type: data[i].training_name,
                // available_amount: data[i].available_amount,
                date_of_training: data[i].training_date,
                training_period: data[i].training_period,
                request_amount: data[i].request_amount,
                approve_amount: data[i].approve_amount,
                date: moment(result.createdAt).format('DD-MM-YYYY'),
                status: status
            }
            if (has_action) {
                if (result.status !== 3) {
                    obj.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
                    obj.action += permission.isEdit === 1 || (result.status == 5 && data[i].createdBy == this.state.user_id ) ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';
                } else {
                    obj.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';

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
       }
        // this.setState({
        //     dataSource: l,

        // });
        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty();
        }

        var column = [
            { title: "No", data: "no" },
            { title: "Form No", data: "form_no" },
            { title: "Employee Id", data: "employee_id" },
            { title: "Employee Name", data: "employee_name" },
            { title: "Position", data: "position" },
            { title: "Branch", data: "branch" },
            { title: "Training Type", data: "training_type" },
            { title: "Date of Training", data: "date_of_training" },
            { title: "Training Period", data: "training_period" },
            { title: "Request Amount", data: "request_amount" },
            { title: "Approve Amount", data: "approve_amount" },
            { title: "Date", data: "date" },
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
            // buttons: true,
            dom: 'Bfrtip',
            // buttons: [
            //     'copy', 'csv', 'excel', 'pdf'
            // ],
            buttons:  [
                'copy',
            {
                    extend: 'csvHtml5',
                    title: 'External Training',
            },
            {
                extend: 'excelHtml5',
                title: 'External Training',
            },
            {
                extend: 'pdfHtml5',
                title: 'External Training',
            }],
            data: l,
            columns: column
        });
    }

    render() {
        return (

            <div>
                <div className="row border-bottom white-bg dashboard-header">
                    <div className = "row">
                        <div class= "btn-group-g ">
                        <button type="button" class="btn label-request g" onClick = {this.getRequest.bind(this)}>Request</button>
                        <button type="button" class=" btn label-check g" onClick = {this.getCheck.bind(this)}>Check</button>
                        <button type="button" class="btn label-verified g" onClick = {this.getVerified.bind(this)}>Verify</button>
                        <button type="button" class="btn label-approve g" onClick = {this.getApprove.bind(this)}>Approve</button>
                        <button type="button" class="btn label-reject g" onClick = {this.getReject.bind(this)}>Reject</button>
                        </div>
                    </div>
                </div>
                
                <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                    id="dataTables-table"
                />
            </div >
        )
    }
}