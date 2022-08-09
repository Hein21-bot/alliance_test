import React, { Component } from "react";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import moment from "moment";
import * as jsPDF from "jspdf";
import Select from "react-select";
import {
  main_url,
  getUserId,
  getMainRole,
  getInformation,
  print,
  fno,
} from "../../../../../utils/CommonFunction";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");

export default class ConfirmationRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {

      user_id: getUserId("user_info"),
      dataSource: props.data,
      checkPersonData: props.checkData,
      confirmPersonData: props.confirmData,
      // selectedRequest: '',
      is_main_role: getMainRole(),
      extension_comment: '',
      pathname: window.location.pathname
    };
  }


  // componentDidMount() {
  //   this.$el = $(this.el);

  //   this.setState(
  //     {
  //       dataSource: this.props.data,
  //     },
  //     () => {
  //       this._setTableData(this.state.dataSource);
  //     }
  //   );
  // }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.data !== this.props.data) {
  //     this.setState(
  //       {
  //         dataSource: this.props.data,
  //       },
  //       () => {
  //         this._setTableData(this.state.dataSource);
  //       }
  //     );
  //   }
  // }

  // search(status) {
  //   let data = this.state.dataSource;
  //   data = data.filter((d) => {
  //     return status === d.status;
  //   });
  //   this._setTableData(data);
  // }

  // _setTableData = (data) => {

  //   var table;
  //   var l = [];
  //   var leaveCategory;
  //   var leaveStatus;
  //   for (var i = 0; i < data.length; i++) {
  //     let obj = [];
  //     if (data[i].leave_category == 1) {
  //       leaveCategory = "Casual Leave"
  //     } else if (data[i].leave_category == 3) {
  //       leaveCategory = "Maternity Leave"
  //     } else if (data[i].leave_category == 4) {
  //       leaveCategory = "Paternity Leave"
  //     } else if (data[i].leave_category == 5) {
  //       leaveCategory = "Earned Leave"
  //     } else if (data[i].leave_category == 6) {
  //       leaveCategory = "Medical Leave"
  //     } else if (data[i].leave_category == 7) {
  //       leaveCategory = "Compassionate Leave"
  //     } else if (data[i].leave_category == 8) {
  //       leaveCategory = "Leave Without Pay"
  //     } else {
  //       leaveCategory = "-"
  //     }
  //     if (data[i].leave_status == 0) {
  //       leaveStatus = '<small class="label label-warning" style="background-color:#509aed"> Request </small>'
  //     }
  //     else if (data[i].leave_status === 1) {
  //       leaveStatus = '<small class="label label-warning" style="background-color:#b33ce0"> Check</small>'
  //     }
  //     else if (data[i].leave_status === 2) {
  //       leaveStatus = '<small class="label label-warning" style="background-color:#0078FF"> Confirm</small>'
  //     }
  //     else if (data[i].leave_status === 3) {
  //       leaveStatus = '<small class="label label-warning" style="background-color:#f2a509"> Verify</small>'
  //     }
  //     else if (data[i].leave_status === 4) {
  //       leaveStatus = '<small class="label label-warning" style="background-color:#29a50a">Approve</small>'
  //     }
  //     else if (data[i].leave_status === 10) {
  //       leaveStatus = '<small class="label label-warning" style="background-color:#29a50a">Approved</small>'
  //     } else {
  //       leaveStatus = '-'
  //     }
  //     obj = {
  //       no: i + 1,
  //       employee_id: data[i].employee_id ? data[i].employee_id : "",
  //       employee_name: data[i].employee_name ? data[i].employee_name : "",
  //       position: data[i].position ? data[i].position : "-",
  //       career_level: data[i].career_level ? data[i].career_level : "-",
  //       career_sub_level: data[i].career_sub_level
  //         ? data[i].career_sub_level
  //         : "-",
  //       department: data[i].department ? data[i].department : "-",
  //       branch: data[i].branch ? data[i].branch : "-",
  //       region: data[i].region ? data[i].region : "-",
  //       employ_date: data[i].employee_date ? data[i].employee_date : "-",
  //       last_promotion_date: data[i].last_promotion_date
  //         ? data[i].last_promotion_date
  //         : "-",
  //       date: data[i].date ? data[i].date : "-",
  //       service_year: data[i].service_year ? data[i].service_year : "",
  //       leave: data[i].leave ? data[i].leave : "-",
  //       leave_category: leaveCategory,
  //       leave_start_date: data[i].leave_start_date ? data[i].leave_start_date : '-',
  //       leave_end_date: data[i].leave_end_date ? data[i].leave_end_date : '-',
  //       leave_status: leaveStatus
  //     };
  //     l.push(obj);
  //   }

  //   if ($.fn.dataTable.isDataTable("#dataTables-table")) {
  //     table = $("#dataTables-table").dataTable();
  //     table.fnClearTable();
  //     table.fnDestroy();
  //     $("#dataTables-table").empty();
  //   }

  //   var column = [
  //     { title: "No", data: "no" },
  //     { title: "Employee Id", data: "employee_id" },
  //     { title: "Name", data: "employee_name" },
  //     { title: "Designation", data: "position" },
  //     { title: "Level", data: "career_level" },
  //     { title: "Sub Level", data: "career_sub_level" },
  //     { title: "Department", data: "department" },
  //     { title: "Branch", data: "branch" },
  //     { title: "Region", data: "region" },
  //     { title: "Employed Date", data: "employ_date" },
  //     { title: "Last Promtion Date", data: "date" },
  //     { title: "Service Year", data: "service_year" },
  //     { title: "Service Year in Current Level", data: "date" },
  //     { title: "Service Year in Current Sub Level", data: "date" },
  //     { title: "Leave", data: "leave" },
  //     { title: "Leave Category", data: "leave_category" },
  //     { title: "Leave Start Date", data: "leave_start_date" },
  //     { title: "Leave End Date", data: "leave_end_date" },
  //     { title: "Leave Status", data: "leave_status" },
  //     // { title: "Status", data: "status" }
  //   ];
  // table = $("#dataTables-table").DataTable({
  //     autofill: true,
  //  scrollX: true,
  //     bLengthChange: false,
  //     bInfo: false,
  //     responsive: true,
  //     pageLength: 50,
  //     paging: true,
  //     // buttons: true,
  //     dom: "Bfrtip",
  //     // buttons: [
  //     //     'copy', 'csv', 'excel', 'pdf'
  //     // ],
  //     buttons: [
  //       // 'copy',
  //       // {
  //       //         extend: 'csvHtml5',
  //       //         title: 'Child Benefit',
  //       // },
  //       // {
  //       //     extend: 'excelHtml5',
  //       //     title: 'Child Benefit',
  //       // },
  //       // {
  //       //     extend: 'pdfHtml5',
  //       //     title: 'Child Benefit',
  //       // }
  //     ],
  //     data: l,
  //     columns: column,
  //     createdRow: function (row, data, index) {
  //       if (data.leave === true) {
  //         $(row).css("background-color", "Yellow");
  //       }
  //     },
  // });
  // };

  render() {

    return (
      <div>
        <div
          className="col-lg-12 col-md-12 col-sm-12"
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            justifyContent: "space-between",
            marginTop: "12px",
            marginBottom: '10px',
            padding: 0
          }}
        >
          {this.props.title == "request" ? (
            <>
              <div
                className="col-lg-4 col-md-3 col-sm-12"
                style={{
                  display: "flex",
                  paddingBottom: 10,
                  alignItems: "center",
                }}
              >
                <div className="col-lg-3 col-md-3 col-sm-2">Check Person</div>
                <div
                  className="col-lg-8 col-md-8 col-sm-6 "
                  style={{ display: "flex", justifyContent: "start" }}
                >
                  <div style={{ minWidth: 250 }}>
                    <Select
                      options={this.state.checkPersonData}
                      value={this.props.selected_checkPerson}
                      onChange={this.props.handleSelectedCheckPerson}
                      className="react-select-container checkValidate"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>
              <div
                className="col-lg-4 col-md-3 col-sm-12"
                style={{
                  display: "flex",
                  paddingBottom: 10,
                  alignItems: "center",
                }}
              >
                <div className="col-lg-3 col-md-3 col-sm-2">Confirm Person</div>
                <div
                  className="col-lg-8 col-md-8 col-sm-6 "
                  style={{ display: "flex", justifyContent: "start" }}
                >
                  <div style={{ minWidth: 250 }}>
                    <Select
                      options={this.state.confirmPersonData}
                      value={this.props.selected_verifyPerson}
                      onChange={this.props.handleSelectedVerifyPerson}
                      className="react-select-container checkValidate"
                      classNamePrefix="react-select"
                    />
                  </div>
                </div>
              </div>
              <div
                className="col-lg-3 col-md-2 col-sm-12"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  paddingBottom: 10,

                  justifyContent: "flex-end",
                  margin: 0,
                  alignItems: "center",
                }}
              >
                <a href={this.state.pathname}>
                  <button

                    className="btn btn-primary"
                    style={{ borderRadius: 3, width: 80, marginRight: 10 }}
                  >
                    Back
                  </button>
                </a>
                <button
                  onClick={this.props.handleConfirmRequest}
                  className="btn btn-primary"
                  style={{ borderRadius: 3, width: 80 }}
                >
                  Submit
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="col-md-12 ">
                <h4>Leave Extension </h4>
              </div>
              <div className="col-md-12" style={{ marginTop: 30 }}>
                <div className="col-md-2">Extension Comment </div>
                <div className="col-md-8">
                  <input
                    type="text"
                    // className="full_width"
                    style={{ width: '50%' }}
                    onChange={(e) =>
                      this.setState({ extension_comment: e.target.value })

                    }
                  ></input>
                </div>
                
                <div className="col-md-2 ">
                    <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                    <a href={this.state.pathname}>
                  <button

                    className="btn btn-primary"
                    style={{ borderRadius: 3, width: 70, marginRight: 10 }}
                  >
                    Back
                  </button>
                </a>
                  <button
                    className="btn btn-primary"
                    onClick={() => this.props.handleLeaveExtensionRequest(this.state.extension_comment)}
                  >
                    <span>Submit</span>{" "}
                  </button>
                    </div>
                </div>
              </div>
            </>
          )}

        </div>
        <div className="container" style={{ overflowX: "auto", width: "100%", }}>
          <table className="table">
            <thead className="">
              <tr className="" >
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white" }}>No</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white", width:"150px" }}>Employee ID</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white" }}>Name</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white" }}>Designation</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white" }}>Level</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white",width:"100px" }}>Sub Level</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white" }}>Department</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white" }}>Branch</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white" }}>Region</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white",width:"120px" }}>Employee Date</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white",width:"150px" }}>Last Promotion Date</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white",width:"170px" }}>Service Year</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white",width:"300px" }}>Service Year in Current Level</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white",width:"300px" }}>Service Year in Current Sub Level</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white" }}>Leave</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white", width:"150px" }}>Leave Categorey</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white" }}>Leave Start Date</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white" }}>Leave End Date</th>
                <th style={{ backgroundColor: "#27568A", border: "2px solid white", color: "white" }}>Leave Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th className="" style={{border:"1px solid lightgrey"}}>1</th>
                <td className="" style={{border:"1px solid lightgrey"}}>ertetetete2</td>
                <td className="" style={{border:"1px solid lightgrey"}}>3rtetetert</td>
                <td className="" style={{border:"1px solid lightgrey"}}>rterterterte@4</td>
                <td className="" style={{border:"1px solid lightgrey"}}>rtertertete5</td>
                <td className="" style={{border:"1px solid lightgrey"}}>6eterterte</td>
                <td className="" style={{border:"1px solid lightgrey"}}>@ertetertert7</td>
                <td className="" style={{border:"1px solid lightgrey"}}>tertertertert8</td>
                <td className="" style={{border:"1px solid lightgrey"}}>erteterterter9</td>
                <td className="" style={{border:"1px solid lightgrey"}}>@ertertertert0</td>
                <td className="" style={{border:"1px solid lightgrey"}}>1ertertertetert1</td>
                <td className="" style={{border:"1px solid lightgrey"}}>1ertertertertet2</td>
                <td className="" style={{border:"1px solid lightgrey"}}>1eterterterter3</td>
                <td className="" style={{border:"1px solid lightgrey"}}>1erretertertert4</td>
                <td className="" style={{border:"1px solid lightgrey"}}>1ertertertetert1</td>
                <td className="" style={{border:"1px solid lightgrey"}}>1ertertertertet2</td>
                <td className="" style={{border:"1px solid lightgrey"}}>1eterterterter3</td>
                <td className="" style={{border:"1px solid lightgrey"}}>1erretertertert4</td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>ertetetete2</td>
                <td>3rtetetert</td>
                <td>rterterterte@4</td>
                <td>rtertertete5</td>
                <td>6eterterte</td>
                <td>@ertetertert7</td>
                <td>tertertertert8</td>
                <td>erteterterter9</td>
                <td>@ertertertert0</td>
                <td>1ertertertetert1</td>
                <td>1ertertertertet2</td>
                <td>1eterterterter3</td>
                <td>1erretertertert4</td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>ertetetete2</td>
                <td>3rtetetert</td>
                <td>rterterterte@4</td>
                <td>rtertertete5</td>
                <td>6eterterte</td>
                <td>@ertetertert7</td>
                <td>tertertertert8</td>
                <td>erteterterter9</td>
                <td>@ertertertert0</td>
                <td>1ertertertetert1</td>
                <td>1ertertertertet2</td>
                <td>1eterterterter3</td>
                <td>1erretertertert4</td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>ertetetete2</td>
                <td>3rtetetert</td>
                <td>rterterterte@4</td>
                <td>rtertertete5</td>
                <td>6eterterte</td>
                <td>@ertetertert7</td>
                <td>tertertertert8</td>
                <td>erteterterter9</td>
                <td>@ertertertert0</td>
                <td>1ertertertetert1</td>
                <td>1ertertertertet2</td>
                <td>1eterterterter3</td>
                <td>1erretertertert4</td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>ertetetete2</td>
                <td>3rtetetert</td>
                <td>rterterterte@4</td>
                <td>rtertertete5</td>
                <td>6eterterte</td>
                <td>@ertetertert7</td>
                <td>tertertertert8</td>
                <td>erteterterter9</td>
                <td>@ertertertert0</td>
                <td>1ertertertetert1</td>
                <td>1ertertertertet2</td>
                <td>1eterterterter3</td>
                <td>1erretertertert4</td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>ertetetete2</td>
                <td>3rtetetert</td>
                <td>rterterterte@4</td>
                <td>rtertertete5</td>
                <td>6eterterte</td>
                <td>@ertetertert7</td>
                <td>tertertertert8</td>
                <td>erteterterter9</td>
                <td>@ertertertert0</td>
                <td>1ertertertetert1</td>
                <td>1ertertertertet2</td>
                <td>1eterterterter3</td>
                <td>1erretertertert4</td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>ertetetete2</td>
                <td>3rtetetert</td>
                <td>rterterterte@4</td>
                <td>rtertertete5</td>
                <td>6eterterte</td>
                <td>@ertetertert7</td>
                <td>tertertertert8</td>
                <td>erteterterter9</td>
                <td>@ertertertert0</td>
                <td>1ertertertetert1</td>
                <td>1ertertertertet2</td>
                <td>1eterterterter3</td>
                <td>1erretertertert4</td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>ertetetete2</td>
                <td>3rtetetert</td>
                <td>rterterterte@4</td>
                <td>rtertertete5</td>
                <td>6eterterte</td>
                <td>@ertetertert7</td>
                <td>tertertertert8</td>
                <td>erteterterter9</td>
                <td>@ertertertert0</td>
                <td>1ertertertetert1</td>
                <td>1ertertertertet2</td>
                <td>1eterterterter3</td>
                <td>1erretertertert4</td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>ertetetete2</td>
                <td>3rtetetert</td>
                <td>rterterterte@4</td>
                <td>rtertertete5</td>
                <td>6eterterte</td>
                <td>@ertetertert7</td>
                <td>tertertertert8</td>
                <td>erteterterter9</td>
                <td>@ertertertert0</td>
                <td>1ertertertetert1</td>
                <td>1ertertertertet2</td>
                <td>1eterterterter3</td>
                <td>1erretertertert4</td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>ertetetete2</td>
                <td>3rtetetert</td>
                <td>rterterterte@4</td>
                <td>rtertertete5</td>
                <td>6eterterte</td>
                <td>@ertetertert7</td>
                <td>tertertertert8</td>
                <td>erteterterter9</td>
                <td>@ertertertert0</td>
                <td>1ertertertetert1</td>
                <td>1ertertertertet2</td>
                <td>1eterterterter3</td>
                <td>1erretertertert4</td>
              </tr>
              <tr>
                <th scope="row">1</th>
                <td>ertetetete2</td>
                <td>3rtetetert</td>
                <td>rterterterte@4</td>
                <td>rtertertete5</td>
                <td>6eterterte</td>
                <td>@ertetertert7</td>
                <td>tertertertert8</td>
                <td>erteterterter9</td>
                <td>@ertertertert0</td>
                <td>1ertertertetert1</td>
                <td>1ertertertertet2</td>
                <td>1eterterterter3</td>
                <td>1erretertertert4</td>
              </tr>

              {/* <tr>
                <th scope="row">2</th>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
                <td>Jacob</td>
                <td>Thornton</td>
                <td>@fat</td>
              </tr>
              <tr>
                <th scope="row">3</th>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
                <td>Larry</td>
                <td>the Bird</td>
                <td>@twitter</td>
              </tr> */}
            </tbody>
          </table>

        </div>


        {/* <div className="col-12">
          <table
            width="99%"
            className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
            >
           <thead className="" style={{backgroundColor:"#0078FF"}}>
        <tr>
          <th >#</th>
          <th scope="col">First</th>
          <th scope="col">Last</th>
          <th scope="col">Handle</th>
          <th scope="col">#</th>
          <th scope="col">First</th>
          <th scope="col">Last</th>
          <th scope="col">Handle</th>
          <th scope="col">#</th>
          <th scope="col">First</th>
          <th scope="col">Last</th>
          <th scope="col">Handle</th>
          <th scope="col">First</th>
          <th scope="col">Last</th>
          <th scope="col">Handle</th>
          <th scope="col">#</th>
          <th scope="col">First</th>
          <th scope="col">Last</th>
          <th scope="col">Handle</th>
       </tr>
      </thead>
      <tbody>
       <tr>
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
        <td>1</td>
        <td>2</td>
        <td>3</td>
        <td>4</td>
        <td>Mark</td>
        <td>Otto</td>
        <td>@mdo</td>
        <td>Mark</td>
        <td>Otto</td>
        <td>8</td>
       </tr>
      <tr>
       <th scope="row">2</th>
       <td>Jacob</td>
       <td>Thornton</td>
       <td>@fat</td>
       <td>Jacob</td>
       <td>Thornton</td>
       <td>@fat</td>
       <td>Jacob</td>
       <td>Thornton</td>
       <td>@fat</td>
       <td>Jacob</td>
       <td>Thornton</td>
       <td>@fat</td>
       <td>Thornton</td>
       <td>@fat</td>
       <td>Jacob</td>
       <td>Thornton</td>
       <td>@fat</td>
       <td>Jacob</td>
       <td>Thornton</td>
       <td>@fat</td>
     </tr>
     <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
     </tr>
    </tbody>
          </table>
        </div> */}
      </div>
    );
  }
}
