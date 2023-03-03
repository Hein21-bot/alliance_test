import React, { Component } from 'react';
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css';
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css';
import 'datatables.net-dt/css/jquery.dataTables.css'
import 'datatables.net-buttons-dt/css/buttons.dataTables.css';
import 'jspdf-autotable';
import moment from 'moment'
import { imgData } from '../../../utils/Global';
import DatePicker from 'react-datetime';
import * as jsPDF from 'jspdf';
import { main_url, getUserId,getMainRole,getFirstDayOfPrevMonth, getInformation, print, fno } from "../../../utils/CommonFunction";
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
            requestData: [],
            user_id: getUserId("user_info"),
            is_main_role: getMainRole(),
            start_date : new Date(getFirstDayOfPrevMonth()),
            end_date : new Date(),
            tab:this.props.tab,
            pending_approve:'allrequest',
            dataListL:[]
        }
    }

    componentDidMount() {
        

        this.$el = $(this.el);
        this.handleSearchData()
        this.setState({
            requestData: this.state.requestData
        }, () => {
            this._setTableData(this.state.dataList)
        });

        let that = this;
        $("#dataTables-table").on('click', '#toView', function () {

            var data = $(this).find("#view").text();
            data = $.parseJSON(data);
            that.getViewData(data.funeral_benefit_id)

        });
        $("#dataTables-table").on('click', '#toPrint', function () {

            fetch(`${main_url}funeral_benefit/getFuneralAvailableAmount`)
                .then(res => { if (res.ok) return res.json() })
                .then(list => {
                    var data = $(this).find("#print").text();
                    data = $.parseJSON(data);

                    that.getPrintData(data.funeral_benefit_id, list.amount)
                })

        });

        $("#dataTables-table").on('click', '#toEdit', function () {

            var data = $(this).find("#edit").text();
            data = $.parseJSON(data);
            that.getEditData(data.funeral_benefit_id)

        });
    }

    getViewData(id) {
        fetch(main_url + "funeral_benefit/getFuneralViewData/" + id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                this.props.goToViewForm(res);
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }

    getEditData(id) {
        fetch(main_url + "funeral_benefit/getFuneralViewData/" + id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(res => {
                this.props.goToEditForm(res);
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }
    componentDidUpdate(prevProps) {
        if (prevProps.tab != this.props.tab) {
            this.setState({
                tab: this.props.tab
            }, () => this.filter())

        }
    }
    getTotalAmount(arr, amount) {

        let tot = 0;
        for (let i = 0; i < arr.length; i++) {
            tot += arr[i].headNo * amount;
        }

        return tot;

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
   
    handleStartDate = async (event) => {
        this.setState({
          start_date:event
        },()=>{console.log(this.state.start_date)})
      }
      handleEndDate = async (event) => {
        this.setState({
          end_date:event
        },()=>{console.log(this.state.end_date)})
      }
    search(status) {
        let data = this.state.dataList;
        data = data.filter(d => { return status === d.status });
        this._setTableData(data)
    }
    approvedlist = async (data) => {
        console.log('data is =====>', data)
        if (data == 'myrequest') {
          this.setState({
            data: this.state.dataList.filter(v => v.user_id == this.state.user_id),
            pending_approve: 'myrequest',
    
          }, () => {
            this._setTableData(this.state.data)
          })
        } else {
          this.setState({
            data: this.state.dataList.filter(v => v.user_id != this.state.user_id),
            pending_approve: 'allrequest'
          }, () => { this._setTableData(this.state.data) })
        }
      }
    handleSearchData = async () => {
        let id = this.state.user_id;

        
        fetch(main_url + "funeral_benefit/getFuneralBenefit/" + id + "/" + moment(this.state.start_date).format("YYYY-MM-DD") + "/" + moment(this.state.end_date).format("YYYY-MM-DD"))


          .then(res => { if (res.ok) return res.json() })
          .then(list => {
            if(list && list.length > 0){
                if (this.state.pending_approve == 'myrequest') {
                    console.log('my request')
                  this.setState({ dataList: list, data: list.filter(v => v.user_id == this.state.user_id) }, () => { this._setTableData(this.state.data) });
                } else if (this.state.pending_approve == 'allrequest') {
                    console.log('all request')
                  this.setState({ dataList: list, data: list.filter(v => v.user_id != this.state.user_id) }, () => { this._setTableData(this.state.data) });
        
                }
            }
            
    
          })
      }
      filter() { 
        if (this.props.tab == 0) {
            this.getAllBenefits();
        } else if (this.props.tab == 1) {
            this.getMyBenefits();
        }
    }
   

    getPrintData(id, amount) {
        fetch(main_url + "funeral_benefit/getFuneralViewData/" + id)
            .then(response => {
                if (response.ok) return response.json()
            })
            .then(async res => {
                var info = await getInformation('funeral_benefit', id)
                var doc = new jsPDF("p", "mm", "a4");
                var col = ["Benefit Title", "Beneficiary Person", "Head No", "Amount"];
                var rows = [];
                var detail = [];
                var today = moment(Date.now()).format('YYYY-MM-DD')
                detail = res.detail;

                detail.forEach(element => {
                    var temp = ["Funeral Expense", element.selected_personName, element.headNo, element.headNo * amount];
                    rows.push(temp);
                });
                rows.push(["", "", "Total Amount:", this.getTotalAmount(detail, amount)])

                doc.setFontSize(12);
                doc.addImage(imgData, 'image/jpeg', 10, 10, 50, 15)
                doc.text('HR_0021 V3', 150, 15);
                doc.text('Benefit Request Form', 150, 25)
                doc.text('Generate Date: ' + today, 13, 40)
                doc.text('Voucher No: ' + fno.fno_funeral + res.data[0].form_no, 150, 40)

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
                // doc.save('FuneralBenefit.pdf');
                print(doc,res.data[0])
                
            })
            .catch(error => console.error(`Fetch Error =\n`, error));

    }

    _setTableData = (data) => {
        var table;
        var permission = this.props.permission;
        var has_action = permission.isView === 1 || permission.isEdit === 1 ? true : false;

        var l = [];
        var status;
        if(data){
            for (var i = 0; i < data.length; i++) {
                let result = data[i];
                let obj = [];
                if (result.status === 0) {
                    status = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'
                }
                else if (result.status === 1) {
                    status = '<small class="label label-warning" style="background-color:#b33ce0"> Check </small>'
                }
                else if (result.status === 2) {
                    status = '<small class="label label-warning" style="background-color:#f2a509"> Verify </small>'
                }
                else if (result.status === 3) {
                    status = '<small class="label label-warning" style="background-color:#29a50a"> Approve </small>'
                }
                else if (result.status === 4) {
    
                    status = '<small class="label label-warning" style="background-color:#f60e2f"> Reject </small>'
                }
                else if (result.status === 5) {
                    status = '<small class="label label-warning" style="background-color:#cc0066"> ReferBack </small>'
                }
                obj = {
                    no: i + 1,
                    form_no: fno.fno_funeral + data[i].form_no,
                    employee_id: data[i].employment_id,
                    employee_name: data[i].fullname,
                    position: data[i].designations ? data[i].designations : '-',
                    branch: data[i].branch_name,
                    designations: data[i].designations,
                    date: moment(result.createdAt).format('DD-MM-YYYY'),
                    status: status
                }
                if (has_action) {
                    if (result.status !== 3) {
                        obj.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
                        obj.action += permission.isEdit === 1  ||(result.status == 5 && data[i].createdBy == this.state.user_id ) ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';
                    } else {
                        obj.action = permission.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
    
                        if (result.print === 1) {
                            obj.action +=
                              '<button style="margin-right:10px" class="btn btn-info btn-sm own-btn-edit" id="toPrint" ><span id="print" class="hidden" >' +
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
                { title: "Form No", data: "form_no" },
                { title: "Employee Id", data: "employee_id" },
                { title: "Employee Name", data: "employee_name" },
                { title: "Position", data: "position" },
                { title: "Branch", data: "branch" },
                { title: "Designations", data: "designations" },
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
                        title: 'Funeral Benefit',
                },
                {
                    extend: 'excelHtml5',
                    title: 'Funeral Benefit',
                },
                {
                    extend: 'pdfHtml5',
                    title: 'Funeral Benefit',
                }],
                data: l,
                columns: column
            });
        }
        
    }

    render() {
        return (
            <div>  
                 <div>
                            <ul className="nav nav-tabs tab" role="tablist" id="tab-pane">
                           <li className="nav-item">
                            <a className="nav-link " href="#wedding_benefit" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.approvedlist('myrequest')}>My Request</a>
                           </li>
                           <li className="nav-item1 active">
                           <a className="nav-link active" href="#wedding_benefit" role="tab" data-toggle="tab" onClick={() => this.approvedlist('allrequest')}>All Request</a>
                           </li>
                           </ul>

                           </div>
                           <div className="row mt-2" style={{display:'flex',alignItems:'end'}}>
                         <div className="col-md-2">
                             <label htmlFor="">Start Date</label>
                             <DatePicker
                   dateFormat="DD/MM/YYYY"
                   value={this.state.start_date}
                   onChange={this.handleStartDate}
                   timeFormat={false}
                 />
                         </div>
                         <div className="col-md-2">
                             <label htmlFor="">End Date</label>
                             <DatePicker
                   dateFormat="DD/MM/YYYY"
                   value={this.state.end_date}
                   onChange={this.handleEndDate}
                   timeFormat={false}
                 />
                         </div>
                         <div className="col-md-2">
             <button className='btn btn-primary text-center' 
             style={{ marginLeft: 10, height: 30, padding: '0px 5px 0px 5px' }}
              onClick={() => this.handleSearchData()}>Search</button>

                         </div>
                     </div>
                     <br />
                     <div className="row">
            <div class="btn-group-g ">
              <button
                type="button"
                class="btn label-request g"
                onClick={this.getRequest.bind(this)}
              >
                Request
              </button>
              <button
                type="button"
                class=" btn label-check g"
                onClick={this.getCheck.bind(this)}
              >
                Check
              </button>
              <button
                type="button"
                class="btn label-verified g"
                onClick={this.getVerified.bind(this)}
              >
                Verify
              </button>
              <button
                type="button"
                class="btn label-approve g"
                onClick={this.getApprove.bind(this)}
              >
                Approve
              </button>
              <button
                type="button"
                class="btn label-reject g"
                onClick={this.getReject.bind(this)}
              >
                Reject
              </button>
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