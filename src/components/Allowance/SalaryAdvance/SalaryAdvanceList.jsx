import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { main_url, getUserId, getCookieData,getFirstDayOfPrevMonth, setCookieData, getMainRole, getInformation, print, fno } from '../../../utils/CommonFunction';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import moment from 'moment'
import { imgData } from '../../../utils/Global';
import DatePicker from 'react-datetime';
import * as jsPDF from 'jspdf';
import './Pyidaungsu-2.5_Regular-normal';
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');
$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');

export default class SalaryAdvanceList extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            requestData : [],
            user: getCookieData("user_info"),
            // salary_advance_list: this.props.data,
            user_id: getUserId("user_info"),
            pending_approve:"",
            tab : this.props.tab,
            from_date:getFirstDayOfPrevMonth(),
            to_date : moment(),
        }
    }

    componentDidMount() {
        this.getAllBenefits();
        this.$el = $(this.el);
        this.setState({
            requestData: this.state.requestData
        }, () => {
            this._setTableData(this.state.requestData)
        });

        var that = this;
        this._setTableData(this.state.salary_advance_list);
        $('#dataTables').on('click', '#toView', function () {
            var data = $(this).find('#view').text();
            data = $.parseJSON(data);
            that.props.goToViewForm(data);
        })

        $('#dataTables').on('click', '#toEdit', function () {
            var data = $(this).find('#edit').text();
            data = $.parseJSON(data);
            that.props.goToEditForm(data);
        })

        $("#dataTables").on('click', '#toPrint', function () {
            var data = $(this).find("#print").text();
            data = $.parseJSON(data);
            that.getPrintData(data)
        });
    }
    componentDidUpdate(prevProps) {
        if (prevProps.tab != this.props.tab) {
            this.setState({
                tab: this.props.tab
            }, () => this.filter())

        }
    }
    // componentDidUpdate(prevProps) {
    //     if (prevProps.data !== this.props.data) {
    //         this.setState({
    //             salary_advance_list: this.props.data
    //         }, () => {
    //             this.showTable(this.state.salary_advance_list);

    //         })
    //     }
    // }

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
    getAllBenefits() {
        let id = this.state.user_id;
        fetch(`${main_url}salary_advance/getSalaryAdvanceList/user_id=${id}/${moment(this.state.from_date).format("YYYY-MM-DD")}/${moment(this.state.to_date).format("YYYY-MM-DD")}`)
        // fetch(main_url + "salary_advance/getSalaryAdvanceList/" + id + "/" + moment(this.state.from_date).format("YYYY-MM-DD") + "/" + moment(this.state.to_date).format("YYYY-MM-DD"))
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ 
                        datasource: res,
                        requestData:res.filter(v=>v.createdBy != this.state.user_id)
                    }, () => this._setTableData(this.state.requestData))
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }
    getMyBenefits() {
        let id = this.state.user_id;
        fetch(`${main_url}salary_advance/getSalaryAdvanceList/user_id=${id}/${moment(this.state.from_date).format("YYYY-MM-DD")}/${moment(this.state.to_date).format("YYYY-MM-DD")}`)

            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                if (res) {
                    this.setState({ 
                        datasource: res,
                        requestData:res.filter(v=>v.createdBy == this.state.user_id)
                    }, () => this._setTableData(this.state.requestData))
                }
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }
    handleStartDate = async (event) => {
        this.setState({
          from_date:event
        },()=>{console.log(this.state.s_date)})
      }
      handleEndDate = async (event) => {
        this.setState({
          to_date:event
        },()=>{console.log(this.state.e_date)})
      }
    request(status) {
        let data = this.state.salary_advance_list;
        data = data.filter(d => { return status === d.status });
        this._setTableData(data)
    }
    filter() { console.log("asjhdahsdh",this.state.tab)
        if (this.state.tab == 0) {
            this.getAllBenefits();
        } else if (this.state.tab == 1) {
            this.getMyBenefits();
        }
    }
    getDuration(duration, month) {
        var text = '';
        var date = new Date(month);
        while (duration > 0) {
            text += moment(date).format('MMM-YY');
            if (duration !== 1) {
                text += " / ";
            }
            date.setMonth(date.getMonth() + 1);
            duration--;
        }
        return text;
    }

    monthlyInstallment(approved_amount, duration) {
        if (approved_amount > 0 && duration > 0) {
            return (approved_amount / duration)
        }
        else return 0;
    }

    async getPrintData(data) {
        var info = await getInformation('salary_advance', data.salary_advance_id)
        var doc = new jsPDF("p", "mm", "a4");

        var col = ["Title", "Amount"];
        var rows = [];
        var today = moment(Date.now()).format('YYYY-MM-DD');
        var duration = this.getDuration(data.duration, moment(data.repayment_date).format('YYYY-MM'));
        var monthlyInstallment = this.monthlyInstallment(data.approved_amount, data.duration)
        rows.push(
            ["Reason of Salary Advance", data.purpose],
            ["Requested Amount", data.requested_amount],
            ["Approve Amount", data.approved_amount],
            ["Installment Amount", monthlyInstallment],
            ["Installment Month", duration]
        )
        doc.setFontSize(12);
        doc.addImage(imgData, 'image/jpeg', 10, 10, 50, 15)
        doc.text('HR_0029', 150, 15);
        doc.text('Salary Advance Form', 150, 25)
        doc.text('Generate Date: ' + today, 13, 40)
        doc.text('Voucher No: ' + fno.fno_salary + data.form_no, 150, 40)
        doc.setFont("Pyidaungsu-2.5_Regular");
        doc.autoTable(col, rows, { startY: 55, styles: { font: "Pyidaungsu-2.5_Regular" } });
        if (doc.previousAutoTable.finalY > 220) {
            doc.addPage();
            doc.previousAutoTable.finalY = 0;
        }
        doc.setFontSize(10);
        // doc.setFontType("bold");
        doc.text('Request By', 13, doc.previousAutoTable.finalY + 17)
        doc.text('Check By', 65, doc.previousAutoTable.finalY + 17)
        doc.text('Verify By', 114, doc.previousAutoTable.finalY + 17)
        doc.text('Approve By', 164, doc.previousAutoTable.finalY + 17)
        doc.setFontSize(12);
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
        // doc.save('SalaryAdvance.pdf');
        print(doc, data)

    }

    _setTableData(data) {
        var table;
        var list = [];
        var obj, one = [];
        var permission = this.props.permission;
        var has_action = permission.isView === 1 || permission.isEdit === 1 ? true : false;
      if(data){
        for (let i = 0; i < data.length; i++) {
            obj = data[i];
            let status = '';
            if (obj.status === 0) {
                status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'

            }
            else if (obj.status === 1) {
                status = '<small class="label label-warning" style="background-color:#b33ce0"> Check  </small>'
            }
            else if (obj.status === 2) {
                status = '<small class="label label-warning" style="background-color:#f2a509"> Verify  </small>'
            }
            else if (obj.status === 3) {
                status = '<small class="label label-warning" style="background-color:#29a50a"> Approve  </small>'
            }
            else if (obj.status === 4) {

                status = '<small class="label label-warning" style="background-color:#f60e2f"> Reject  </small>'
            }
            else if (obj.status === 5) {
                status = '<small class="label label-warning" style="background-color:#cc0066"> ReferBack </small>'
            }

            one = {
                no: i + 1,
                employee_id: obj.employment_id,
                form_no: fno.fno_salary + obj.form_no,
                applicant_name: obj.applicant_name,
                position: obj.designations ? obj.designations : '-',
                branch: obj.branch_name,
                requested_amount: obj.requested_amount,
                purpose: obj.purpose,
                date: moment(obj.createdAt).format('DD-MM-YYYY'),
                status: status
            }
            if (has_action) {
                if (obj.status !== 3) {
                    one.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(obj) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
                    one.action += permission.isEdit === 1 || (obj.status == 5 && obj.createdBy == this.state.user_id) ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(obj) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';
                } else {
                    one.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(obj) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';

                    if (obj != null && obj.print == 1) {
                        one.action +=
                            '<button style="margin-right:10px" class="btn btn-info btn-sm own-btn-edit" id="toPrint" ><span id="print" class="hidden" >' +
                            JSON.stringify(obj) +
                            '</span>  <i className="fa fa-cogs"></i>&nbsp;Printed</button>';
                    } else {
                        one.action += '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toPrint" ><span id="print" class="hidden" >' + JSON.stringify(obj) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Print</button>'
                    }
                }
            }
            list.push(one);
        }
    }
        if ($.fn.dataTable.isDataTable('#dataTables')) {
            table = $('#dataTables').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables').empty();
        }

        var column = [
            { title: "No", data: "no" },
            { title: "Employee Id", data: "employee_id" },
            { title: "Form No", data: "form_no" },
            { title: "Applicant Name", data: "applicant_name" },
            { title: "Position", data: "position" },
            { title: "Branch", data: "branch" },
            { title: "Requested Amount", data: "requested_amount" },
            { title: "Purpose", data: "purpose" },
            { title: "Date", data: "date" },
            { title: "Status", data: "status" }
        ]

        if (has_action) {
            column.push({ title: "Action", data: "action" })
        }

        table = $("#dataTables").DataTable({
            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            paging: true,
            buttons: true,
            pageLength: 50,
            dom: 'Bfrtip',
            // buttons: [
            //     'copy', 'csv', 'excel'
            // ],
            buttons: [
                'copy',
                {
                    extend: 'csvHtml5',
                    title: 'Salary Advance',
                },
                {
                    extend: 'excelHtml5',
                    title: 'Salary Advance',
                },
                {
                    extend: 'pdfHtml5',
                    title: 'Salary Advance',
                }],
            data: list,
            columns: column
        })
    }


    render() {
        return (
            <div>
                 <div className=''style={{display:'flex',justifyContent:'space-between',marginRight:33}}>          
            <div className='row'style={{display:'flex',paddingLeft:20}}>  
             <div className="col" style={{padding:0,width:150}}>
                         <div><label className="col"style={{padding:0}}>Start Date</label></div>
                         <div className="col"style={{padding:0}}>
                         <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.from_date}
                            onChange={this.handleStartDate}
                            timeFormat={false}/>
                         </div>
             </div>
             <div className="col"style={{padding:0, marginLeft:10,width:150}}>
                         <div><label className="col"style={{padding:0}}>End Date</label></div>
                         <div className="col"style={{padding:0}}>
                         <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.to_date}
                            onChange={this.handleEndDate}
                            timeFormat={false}/>
                         </div>
             </div>
             <div className="col-md-2" style={{padding:0,marginTop:4}}>
                         <div className="col-md-10 margin-top-20 padding-0">
                             <button type="button" className="btn btn-primary" onClick={this.filter.bind(this)}>Search</button>
                         </div>
             </div> </div>
         <div className='row'>                 
             <div className="row border-bottom white-bg dashboard-header">
         <div className="row">
             <div class="btn-group-g ">
                 <button type="button" class="btn label-request g" onClick={this.getRequest.bind(this)}>Request</button>
                 <button type="button" class=" btn label-check g" onClick={this.getCheck.bind(this)}>Check</button>
                 <button type="button" class="btn label-verified g" onClick={this.getVerified.bind(this)}>Verify</button>
                 <button type="button" class="btn label-approve g" onClick={this.getApprove.bind(this)}>Approve</button>
                 <button type="button" class="btn label-reject g" onClick={this.getReject.bind(this)}>Reject</button>
             </div>
         </div>
             </div>
         </div>    
             </div>
                <div className="row  border-bottom white-bg dashboard-header">
                    <div className="content">
                        <div className="row tbl_m_10">
                            <table width="99%"
                                className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                                id="dataTables"
                                
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}