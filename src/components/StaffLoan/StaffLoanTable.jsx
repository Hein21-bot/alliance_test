import React, { Component } from "react";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import moment from "moment";
import DatePicker from "react-datetime";
import { imgData } from "../../utils/Global";
import * as jsPDF from "jspdf";
import {
  main_url,
  getUserId,
  getMainRole,
  getInformation,
  print,
  fno,
  getFirstDayOfPrevMonth,
  getCookieData,
  getPermissionStatus
} from "../../utils/CommonFunction";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");

export default class StaffLoanTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: getUserId("user_info"),
      user_info: getCookieData("user_info"),
      requestData: [],
      selectedRequest: "",
      is_main_role: getMainRole(),
      from_date: new Date(),
      to_date: new Date(),
      permission_status:{},

      tab: this.props.tab,
      dataSource:[]
    };
  }
  async componentDidMount() {
     //var permission_status = await getPermissionStatus(this.state.user_info.designations_id,  'Staff Loan', 'Staff Loan');

  var permission_status = await getPermissionStatus(this.state.user_info.role_id,  'Staff Loan', 'Staff Loan');
    this.setState({
        permission_status: permission_status
    })
    let user_info= await getCookieData("user_info")

    // await fetch(`${main_url}staff_loan_new/getStaffLoan/${user_info!=null && user_info.user_id}`)
    //   .then(res => { if (res.ok) return res.json() })
    //   .then(list => {
    //     console.log("table list",list)
    //     this._setTableData(list)
    //     this.setState({
    //       dataSource: list
    //     })
    //   })
    // this.getAllBenefits();
    this.getAllStaffLoan();

        this.setState({
            requestData: this.state.requestData
        }, () => {
            this._setTableData(this.state.requestData)
        });

    this.$el = $(this.el);
    // this.setState(
    //   {
    //     requestData: this.state.requestData,
    //   },
    //   () => {
    //     this._setTableData(this.state.requestData);
    //   }
    // );

    let that = this;
    $("#dataTables-table").on("click", "#toView", function () {
      var data = $(this).find("#view").text();
      data = $.parseJSON(data);
      that.props.goToViewForm(data);
    });

    $("#dataTables-table").on("click", "#toReport", function () {
      var data = $(this).find("#report").text();
      data = $.parseJSON(data);
      that.props.goToReportForm(data);
    });

    // $("#dataTables-table").on("click", "#toPrint", function () {
    //   fetch(`${main_url}child_benefit/getChildAvailableAmount`)
    //     .then((res) => {
    //       if (res.ok) return res.json();
    //     })
    //     .then((list) => {
    //       var data = $(this).find("#print").text();
    //       data = $.parseJSON(data);

    //       that.getPrintData(data, list.amount);
    //     });
    // });

    $("#dataTables-table").on("click", "#toEdit", function () {
      var data = $(this).find("#edit").text();
      data = $.parseJSON(data);
      that.props.goToEditForm(data);
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps.tab != this.props.tab) {
        this.setState({
            tab: this.props.tab
        }, () => this.filter())

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
  handleStartDate = async (event) => {
    this.setState({
      from_date: event,
    });
  };
  handleEndDate = async (event) => {
    this.setState({
      to_date: event,
    });
  };
  filter() {
    if (this.state.tab == 0) {
      this.getAllStaffLoan();
    } else if (this.state.tab == 1) {
      this.getMyStaffLoan();
    }
  }
  getAllStaffLoan() {
    let id = this.state.user_id;

    // fetch(main_url + "wedding_benefit/getWeddingBenefit/" + id + "/" + moment(this.state.from_date).format("YYYY-MM-DD") + "/" + moment(this.state.to_date).format("YYYY-MM-DD"))
    fetch(`${main_url}staff_loan_new/getStaffLoan/${this.state.user_info!=null && this.state.user_info.user_id}`)
    .then(response => {
            if (response.ok) return response.json()
        })
        .then(res => {
            if (res) {
                this.setState({ 
                    dataSource: res,
                    requestData:res.filter(v=>v.createdBy != this.state.user_info.user_id),
                }, () => this._setTableData(this.state.requestData))
            }
        })
        .catch(error => console.error(`Fetch Error =\n`, error));

}
getMyStaffLoan() {
    let id = this.state.user_id;
    // fetch(main_url + "wedding_benefit/getWeddingBenefit/" + id + "/" + moment(this.state.from_date).format("YYYY-MM-DD") + "/" + moment(this.state.to_date).format("YYYY-MM-DD"))
    fetch(`${main_url}staff_loan_new/getStaffLoan/${this.state.user_info!=null && this.state.user_info.user_id}`)
        .then(response => {
            if (response.ok) return response.json()
        })
        .then(res => {
            if (res) {
                this.setState({ 
                    datasource: res,
                    requestData:res.filter(v=>v.createdBy == this.state.user_info.user_id)
                }, () => this._setTableData(this.state.requestData))
            }
        })
        .catch(error => console.error(`Fetch Error =\n`, error));

}
  search(status) {
    let data = this.state.dataSource;
    data = data.filter((d) => {
      return status === d.status;
    });
    this._setTableData(data);
  }

  async getPrintData(data, amount) {
    var info = await getInformation("child_benefit", data.child_benefit_id);
    var doc = new jsPDF("p", "mm", "a4");
    var col = ["Benefit Title", "Amount"];
    var rows = [];
    var today = moment(Date.now()).format("YYYY-MM-DD");
    var temp = ["Child Delivery Benefit", data.child_count, amount];
    var temp1 = ["Total Amount:", amount * data.child_count];
    rows.push(temp);
    rows.push(temp1);
    doc.setFontSize(12);
    doc.addImage(imgData, "image/jpeg", 10, 10, 50, 15);
    doc.text("HR_0021 V3", 150, 15);
    doc.text("Benefit Request Form", 150, 25);
    doc.text("Generate Date: " + today, 13, 40);
    doc.text("Voucher No: " + fno.fno_staff_loan + data.form_no, 150, 40);

    doc.autoTable(col, rows, { startY: 55 });
    if (doc.previousAutoTable.finalY > 220) {
      doc.addPage();
      doc.previousAutoTable.finalY = 0;
    }
    doc.setFontSize(10);
    doc.setFontType("bold");
    doc.text("Request By", 13, doc.previousAutoTable.finalY + 17);
    doc.text("Check By", 65, doc.previousAutoTable.finalY + 17);
    doc.text("Verify By", 114, doc.previousAutoTable.finalY + 17);
    doc.text("Approve By", 164, doc.previousAutoTable.finalY + 17);
    doc.setFontSize(9);
    doc.setFontType("normal");
    doc.text(
      info.requested.requested_date,
      13,
      doc.previousAutoTable.finalY + 25
    );
    doc.text(
      info.requested.employment_id,
      13,
      doc.previousAutoTable.finalY + 30
    );
    doc.text(
      info.requested.requested_by,
      13,
      doc.previousAutoTable.finalY + 35
    );
    doc.text(info.requested.branch_name, 13, doc.previousAutoTable.finalY + 40);
    doc.text(
      info.requested.designations,
      13,
      doc.previousAutoTable.finalY + 45
    );
    doc.text(info.checked.checked_date, 65, doc.previousAutoTable.finalY + 25);
    doc.text(info.checked.employment_id, 65, doc.previousAutoTable.finalY + 30);
    doc.text(info.checked.checked_by, 65, doc.previousAutoTable.finalY + 35);
    doc.text(info.checked.branch_name, 65, doc.previousAutoTable.finalY + 40);
    doc.text(info.checked.designations, 65, doc.previousAutoTable.finalY + 45);
    doc.text(
      info.verified.verified_date,
      114,
      doc.previousAutoTable.finalY + 25
    );
    doc.text(
      info.verified.employment_id,
      114,
      doc.previousAutoTable.finalY + 30
    );
    doc.text(info.verified.verified_by, 114, doc.previousAutoTable.finalY + 35);
    doc.text(info.verified.branch_name, 114, doc.previousAutoTable.finalY + 40);
    doc.text(
      info.verified.designations,
      114,
      doc.previousAutoTable.finalY + 45
    );
    doc.text(
      info.approved.approved_date,
      164,
      doc.previousAutoTable.finalY + 25
    );
    doc.text(
      info.approved.employment_id,
      164,
      doc.previousAutoTable.finalY + 30
    );
    doc.text(info.approved.approved_by, 164, doc.previousAutoTable.finalY + 35);
    doc.text(info.approved.branch_name, 164, doc.previousAutoTable.finalY + 40);
    doc.text(
      info.approved.designations,
      164,
      doc.previousAutoTable.finalY + 45
    );
    // doc.save('ChildBenefit.pdf');
    print(doc, data);
  }

  _setTableData = (data) => {
    console.log("data=====>", data)
    var table;
    var l = [];
    var status;
    var permission = this.state.permission_status;
    var has_action =
      permission.isView === 1 || permission.isEdit === 1 ? true : false;
    for (var i = 0; i < data.length; i++) {
      let result = data[i];
      let obj = [];
      if (result.status === 0) {
        status =
          '<small class="label label-warning" style="background-color:#509aed"> Request </small>';
      } else if (result.status === 1) {
        status =
          '<small class="label label-warning" style="background-color:#b33ce0"> Check  </small>';
      } else if (result.status === 2) {
        status =
          '<small class="label label-warning" style="background-color:#f2a509"> Verify </small>';
      } else if (result.status === 3) {
        status =
          '<small class="label label-warning" style="background-color:#29a50a"> Approve  </small>';
      } else if (result.status === 4) {
        status =
          '<small class="label label-warning" style="background-color:#f60e2f"> Reject  </small>';
      } else if (result.status === 5) {
        status =
          '<small class="label label-warning" style="background-color:#cc0066"> ReferBack </small>';
      }
      obj = {
        no: i + 1,
        form_no: fno.fno_staff_loan + data[i].form_no,
        employee_id: data[i].employment_id,
        employee_name: data[i].fullname,
        position: data[i].designations ? data[i].designations : "-",
        branch: data[i].location_master_name  ?  data[i].location_master_name : '-',
        request_amount:data[i].requested_amount ?  data[i].requested_amount : '-',
        
        date: result.createdAt
          ? moment(result.createdAt).format("DD-MM-YYYY")
          : "-",
        status: status,
      };
      // obj.action ='<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' +
      //          JSON.stringify(result) +
      //       '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>'
      //       obj.action +='<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' +
      //          JSON.stringify(result) +
      //       '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>'
      if (has_action) {
        console.log("has action",has_action)
          if (result.status !== 3) {
      obj.action = this.state.permission_status.isView === 1 ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';
      obj.action += this.state.permission_status.isEdit === 1 || (result.status == 5 && data[i].createdBy == this.state.user_id) ? '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' : '';
          } else {
              obj.action = this.state.permission_status.isView === 1 ?

                  '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toView" ><span id="view" class="hidden" >' + JSON.stringify(result) + '</span>  <i className="fa fa-cogs"></i>&nbsp;View</button>' : '';

                  if (result.status === 3){
                    obj.action +=
                     '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toReport" ><span id="report" class="hidden" >' +
                     JSON.stringify(result) +
                     '</span>  <i className="fa fa-cogs"></i>&nbsp;Loan Settlement</button>';
                  }
              // if (result.print === 1) {
              //     obj.action +=
              //         '<button style="margin-right:10px" class="btn btn-info btn-sm own-btn-edit" id="toPrint" ><span id="print" class="hidden" >' +
              //         JSON.stringify(result) +
              //         '</span>  <i className="fa fa-cogs"></i>&nbsp;Printed</button>';
              // } else {
              //     obj.action +=
              //         '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toPrint" ><span id="print" class="hidden" >' +
              //         JSON.stringify(result) +
              //         '</span>  <i className="fa fa-cogs"></i>&nbsp;Print</button>';
              // }
          }
      }else{

        obj.action=''
      }

      l.push(obj);
    }

    if ($.fn.dataTable.isDataTable("#dataTables-table")) {
      table = $("#dataTables-table").dataTable();
      table.fnClearTable();
      table.fnDestroy();
      $("#dataTables-table").empty();
    }

    var column = [
      { title: "No", data: "no" },
      { title: "Form No", data: "form_no" },
      { title: "Employee Id", data: "employee_id" },
      { title: "Employee Name", data: "employee_name" },
      { title: "Position", data: "position" },
      { title: "Branch", data: "branch" },
      {title : "Request Amount",data:'request_amount'},
      { title: "Date", data: "date" },
      { title: "Status", data: "status" },
    ];

    // if (has_action) {
      column.push({ title: "Action", data: "action" });
    // }
    table = $("#dataTables-table").DataTable({
      autofill: true,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      pageLength: 50,
      paging: true,
      // buttons: true,
      dom: "Bfrtip",
      // buttons: [
      //     'copy', 'csv', 'excel', 'pdf'
      // ],
      buttons: [
        "copy",
        {
          extend: "csvHtml5",
          title: "Child Benefit",
        },
        {
          extend: "excelHtml5",
          title: "Staff Loan",
        },
        {
          extend: "pdfHtml5",
          title: "Child Benefit",
        },
      ],
      data: l,
      columns: column,
    });
  };

  render() {
    return (
      <div>
        {" "}
        {/* <div className='row'style={{display:'flex',paddingLeft:20,marginTop:10}}>  
             <div className="col-md-3" style={{padding:0,width:150}}>
                         <div><label className="col"style={{padding:0}}>Start Date</label></div>
                         <div className="col"style={{padding:0}}>
                         <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.from_date}
                            onChange={this.handleStartDate}
                            timeFormat={false}/>
                         </div>
             </div>
             <div className="col-md-3"style={{padding:0, marginLeft:10,width:150}}>
                         <div><label className="col"style={{padding:0}}>End Date</label></div>
                         <div className="col"style={{padding:0}}>
                         <DatePicker
                            dateFormat="DD/MM/YYYY"
                            value={this.state.to_date}
                            onChange={this.handleEndDate}
                            timeFormat={false}/>
                         </div>
             </div>
             <div className="col-md-3" style={{padding:0,marginTop:4}}>
                         <div className="col-md-10 margin-top-20 padding-0">
                             <button type="button" className="btn btn-primary" onClick={this.filter.bind(this)}>Search</button>
                         </div>
             </div> </div> */}
        <div
          className=""
          style={{ display: "flex", justifyContent: "end", marginRight: 33 }}
        >
          
          <div className="row">
            <div className="row border-bottom white-bg dashboard-header">
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
            </div>
          </div>
        </div>
        <table
          width="99%"
          className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
          id="dataTables-table"
        />
      </div>
    );
  }
}
