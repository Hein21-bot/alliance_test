import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import moment from 'moment'
import DatePicker from 'react-datetime';
import { imgData } from '../../../utils/Global';
import * as jsPDF from 'jspdf';
import { main_url, getMainRole,getFirstDayOfYear, getInformation, getUserId, setPrintedStatus, print, fno } from "../../../utils/CommonFunction";
const $ = require('jquery');
const jzip = require('jzip');
window.JSZip = jzip;
$.DataTable = require('datatables.net-bs4');
$.DataTable = require('datatables.net-responsive-bs4');


$.DataTable = require('datatables.net');
require('datatables.net-buttons/js/dataTables.buttons.min');
require('datatables.net-buttons/js/buttons.html5.min');


export default class BackPayTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: getUserId("user_info"),
            dataSource: [],
            selectedRequest: '',
            is_main_role: getMainRole(),
            to_date: moment() ,
            from_date:getFirstDayOfYear(),
            tab:this.props.tab,
        }
    }
    componentDidMount() {
        this.$el = $(this.el);

        this.setState({
            dataSource: this.state.dataSource
        }, () => {
            console.log("datasource",this.state.dataSource)
            this._setTableData(this.state.dataSource)
        });

        let that = this;
        $("#dataTables-table").on('click', '#toView', function () {

            var data = $(this).find("#view").text();
            data = $.parseJSON(data);
            // alert(JSON.stringify(data,2,undefined));
            that.props.goToViewForm(data);

        });

        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            that.props.goToEditForm(data);

        });
        $("#dataTables-table").on('click', '#toPrint', function () {


            fetch(`${main_url}wedding_benefit/getWeddingAvailableAmount`)
                .then(res => { if (res.ok) return res.json() })
                .then(list => {

                    var data = $(this).find("#print").text();
                    data = $.parseJSON(data);

                    that.getPrintData(data, list.amount)
                })

        });
    }

    async componentDidUpdate(prevProps) {
        if (prevProps.dataSource != this.props.dataSource) {
          this.setState(
            {
              dataSource: this.props.dataSource,
            },
            () => {
              this._setTableData(this.state.dataSource);
            }
          );
        }
      }

    getRequest() {
        this.search(0);
    }
    getCheck() {
        this.search(1);
    }

    getVerified() {
        this.search(2);
    }
    getApprove() {
        this.search(3);
    }
    getReject() {
        this.search(4);
    }
    // getAllBenefits() {
    //     let id = this.state.user_id;

    //     fetch(main_url + "wedding_benefit/getWeddingBenefit/" + id )
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {
    //             if (res) {
    //                 this.setState({ 
    //                     data: res,
    //                     requestData:res.filter(v=>v.createdBy != this.state.user_id),
    //                 }, () => this._setTableData(this.state.requestData))
    //             }
    //         })
    //         .catch(error => console.error(`Fetch Error =\n`, error));

    // }
    // getMyBenefits() {
    //     let id = this.state.user_id;

    //     fetch(main_url + "wedding_benefit/getWeddingBenefit/" + id)
    //         .then(response => {
    //             if (response.ok) return response.json()
    //         })
    //         .then(res => {
    //             if (res) {
    //                 this.setState({ 
    //                     datasource: res,
    //                     requestData:res.filter(v=>v.createdBy == this.state.user_id)
    //                 }, () => this._setTableData(this.state.requestData))
    //             }
    //         })
    //         .catch(error => console.error(`Fetch Error =\n`, error));

    // }
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
      filter() {
        if (this.state.tab == 0) {
            this.getAllBenefits();
        } else if (this.state.tab == 1) {
            this.getMyBenefits();
        }
    }
    search(status) {
        let data = this.state.requestData;
        data = data.filter(d => { return status === d.status });
        this._setTableData(data)
    }
    async getPrintData(data, amount) {

        var info = await getInformation('wedding_benefit', data.benefit_id)
        var doc = new jsPDF("p", "mm", "a4");
        var col = ["Benefit Title", "Amount"];
        var rows = [];
        var today = moment(Date.now()).format('YYYY-MM-DD')
        var temp = ["Wedding Benefit", amount]
        var temp1 = ["Total Amount:", amount];
        rows.push(temp)
        rows.push(temp1)
        doc.setFontSize(12);
        doc.addImage(imgData, 'image/jpeg', 10, 10, 50, 15)
        doc.text('HR_0021 V3', 150, 15);
        doc.text('Benefit Request Form', 150, 25)
        doc.text('Generate Date: ' + today, 13, 40)
        doc.text('Voucher No: ' + fno.fno_wedding + data.form_no, 150, 40)

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
        await setPrintedStatus("wedding_benefit", data.benefit_id);
        // doc.save('Wedding Benefit.pdf');
        print(doc, data)
    }

    _setTableData = (data) => {
        console.log("table",data);
        var table;
        var l = [];
        var status;
        var permission = this.props.permission;
        // var has_action = permission.isView === 1 || permission.isEdit === 1 ? true : false;
        if(data){
            for (var i = 0; i < data.length; i++) {
                console.log("stauts",data[i].status)
                let result = data[i];
                let obj = [];
                if (result.status === 0) {
                    status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'
    
                }
                else if (result.status === 1) {
                    status = '<small class="label label-warning" style="background-color:#b33ce0"> Check</small>'
                }
                else if (result.status === 2) {
                    status = '<small class="label label-warning" style="background-color:#f2a509"> Verify</small>'
                }
                else if (result.status === 3) {
                    status = '<small class="label label-warning" style="background-color:#29a50a">Approve</small>'
                }
                else if (result.status === 4) {
    
                    status = '<small class="label label-warning" style="background-color:#f60e2f"> Reject</small>'
                }
                else if (result.status === 5) {
                    status = '<small class="label label-warning" style="background-color:#cc0066"> ReferBack </small>'
                }
    
                obj = {
                    no: i + 1,
                    requestMonth: moment(data[i].request_month).format('MMM'),
                    employee_id: data[i].employment_id ? data[i].employment_id: '-',
                    employee_name: data[i].fullname ? data[i].fullname: '-',
                    designation: data[i].designations ? data[i].designations : '-',
                    department: data[i].deptname ? data[i].deptname : '-',
                    branch: data[i].location_master_name ? data[i].location_master_name : '-',
                    region: data[i].state_name ? data[i].state_name : '-',
                    payRoll:data[i].request_type==1 ? "Back Pay Salary" : data[i].request_type ==2 ? "Refund Salary": "Temporary Contract Salary",
                    amount:data[i].amount ? data[i].amount: "-",
                    reason:data[i].reason ? data[i].reason: '-',
                    start_working_day:data[i].start_working_day ? data[i].start_working_day : '-',
                    end_working_day:data[i].last_working_day ? data[i].last_working_day : '-',
                    working_day:data[i].work_calendar_day == 0 ? "Working Day": "Calendar Day",
                    total_working_day:data[i].total_working_day ? data[i].total_working_day : "-",
                    salary_per_day:data[i].salary_per_day ? data[i].salary_per_day : '-',
                    total_salary:data[i].total_salary ? data[i].total_salary : '-',
                    atm_or_cash:data[i].atm_cash == 0 ? "ATM" : "Cash",
                    total:data[i].total ? data[i].total : '-',
                    status:status
                }
                obj.action =
                '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' +
                JSON.stringify(result) +
                '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>';
              obj.action +=
                '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' +
                JSON.stringify(result) +
                '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>';
                l.push(obj)
    
            }
    
        }
        if ($.fn.dataTable.isDataTable('#dataTables-table')) {
            table = $('#dataTables-table').dataTable();
            table.fnClearTable();
            table.fnDestroy();
            $('#dataTables-table').empty();
        }

        var column = [
            { title: "No", data: "no" },
            { title: "Request Month", data: "requestMonth" },
            { title: "Employee Id", data: "employee_id" },
            { title: "Employee Name", data: "employee_name" },
            { title: "Designation", data: "designation" },
            { title: 'Department', data: 'department'},
            { title: "Branch", data: "branch" },
            { title: 'Region', data: 'region'},
            { title:"Payroll Type",data:'payRoll'},
            { title: 'Amount',data:'amount'},
            { title:"Reason",data:'reason'},
            { title: 'Start Working Day',data:'start_working_day'},
            { title: 'End Working Day',data:'end_working_day'},
            { title: 'Working Day',data:'working_day'},
            { title: 'Total Working Day',data:'total_working_day'},
            { title: 'Salary Per Day',data:'salary_per_day'},
            { title: 'Total Salary',data:'total_salary'},
            { title: 'ATM Or Cash',data:'atm_or_cash'},
            { title: 'Total',data:'total'},
            { title : 'Status',data:'status'},
            { title:"Action",data:'action'}



            
        ]

        // if (has_action) {
        //     column.push({ title: "Action", data: "action" })
        // }

        table = $("#dataTables-table").DataTable({
            autofill: true,
            bLengthChange: false,
            bInfo: false,
            responsive: true,
            paging: true,
            pageLength: 50,
            buttons: true,
            dom: 'Bfrtip',
            // buttons: [
            //     'copy', 'csv', 'excel', 'pdf'
            // ],
            buttons: [
                'copy',
                {
                    extend: 'csvHtml5',
                    title: 'Wedding Benefit',
                },
                {
                    extend: 'excelHtml5',
                    title: 'Wedding Benefit',
                },
                {
                    extend: 'pdfHtml5',
                    title: 'Wedding Benefit',
                }],
            data: l,
            columns: column
        });
    }

    render() { console.log("tab==>",this.state.dataSource)
        return (
            
            <div>   <div className=''style={{display:'flex',justifyContent:'end',marginRight:33}}>          
                       {/* <div className='row'style={{display:'flex',paddingLeft:20}}>  
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
                        </div> </div> */}
                    <div className='row'>                 
                        <div className="row border-bottom white-bg dashboard-header" >
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
                        <table width="99%"
                    className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                    id="dataTables-table"
                        />
            </div>
        )
    }
}

const tempData = [
    { employee_id: 101 },
    { employee_id: 102 },
    { employee_id: 103 },
    { employee_id: 104 },
    { employee_id: 105 },
    { employee_id: 106 },
    { employee_id: 107 },
    { employee_id: 108 },
    { employee_id: 109 },
    { employee_id: 110 },
]