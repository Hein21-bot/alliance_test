import React, { Component, useState } from "react";
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
  getCookieData,
  fno,
} from "../../../../../utils/CommonFunction";
import { ToastContainer, toast } from "react-toastify";
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
      extension_comment: "",
      pathname: window.location.pathname,
      leaveCategory: [],
    };
  }

  handleSelectedCheckPerson = (user_id, checkPersonId) => {
    const filter = this.state.dataSource.filter((a) => a.id == user_id);
    const array = [...this.state.dataSource];
    let data = array.map((f, i) => {
      const obj = { ...f };
      if (f.id == filter[0].id) {
        obj["check_person_id"] = checkPersonId;
        return obj;
      } else {
        return obj;
      }
    });
    this.setState({ dataSource: data });
  };

  handleConfirmRequest = () => {
    if (this.state.dataSource.length > 0) {
      if (this.props.selected_verifyPerson) {
        let data = {
          person: getCookieData("user_info").user_id,
          list: this.state.dataSource,
          verify_person: this.props.selected_verifyPerson.user_id,
          // check_person: this.state.selected_checkPerson.user_id,
          status: 0,
        };
        console.log("data list ===>", data);
        let status = 0;
        fetch(`${main_url}confirmation/addConfirmation`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: `confirmation=${JSON.stringify(data)}`,
        })
          .then((res) => {
            status = res.status;
            return res.text();
          })
          .then((text) => {
            if (status === 200) {
              toast.success(text);
              window.location.reload();
            } else toast.error(text);
            window.location.replace("/confirmation_list");
          });
      } else {
        toast.error("Please choose verify person!");
      }
    } else toast.error("Please choose at least one user!");
  };

  componentDidMount() {
    fetch(`${main_url}leaveCategory/getLeaveCategory`).then(response => {if (response.ok) return response.json()
    else return []}).then(res => this.setState({leaveCategory: res}))
  }

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
    const { dataSource, leaveCategory } = this.state;
    console.log('leaveCategory ===>', leaveCategory)
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
            marginBottom: "10px",
            padding: 0,
          }}
        >
          {this.props.title == "request" ? (
            <>
              {/* <div
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
              </div> */}
              <div
                className="col-lg-9 col-md-9 col-sm-12"
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
                  onClick={this.handleConfirmRequest}
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
                    style={{ width: "50%" }}
                    onChange={(e) =>
                      this.setState({ extension_comment: e.target.value })
                    }
                  ></input>
                </div>

                <div className="col-md-2 ">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
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
                      onClick={() =>
                        this.props.handleLeaveExtensionRequest(
                          this.state.extension_comment
                        )
                      }
                    >
                      <span>Submit</span>{" "}
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        <div
          className="container"
          style={{ overflowX: "auto", paddingBottom: 100 }}
        >
          <table className="">
            <thead style={{ width: "100%" }}>
              <tr style={{ width: "100%", backgroundColor: "#27568A" }}>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 50,paddingLeft:"10" }}>No</div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 100 }}>Employee ID</div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 150 }}>Name</div>
                </th>
                {this.props.title == "request" ? (
                  <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                    <div style={{ width: 170 }}>Check Person</div>
                  </th>
                ) : null}

                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 150 }}>Designation</div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 100 }}>Level</div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 100 }}> Sub Level</div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 150 }}>Department</div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 150 }}>Branch</div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 150 }}>Region</div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 100 }}>Employee Date</div>
                </th>
                {/* <th style={{ border: "2px solid white", color: "white" }}>
                  <div style={{ width: 100 }}>Region</div>
                </th> */}
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 200 }}>Service Years</div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 150 }}>
                    Service Year In Current Level
                  </div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 150 }}>
                    Service Year in Current Sub Level
                  </div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 100 }}>Leave</div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 100 }}>Leave Category</div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 100 }}>Leave Start Date</div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 100 }}>Leave End Date</div>
                </th>
                <th style={{ border: "2px solid white", color: "white",paddingLeft:"10px" }}>
                  <div style={{ width: 100 }}>Leave Status</div>
                </th>
              </tr>
            </thead>
            <tbody>
              {dataSource.map((v, i) => (
                <RowData
                  v={v}
                  i={i}
                  handleSelectedCheckPerson={this.handleSelectedCheckPerson}
                  title={this.props.title}
                  leaveCategory={leaveCategory}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const RowData = ({ v, i, handleSelectedCheckPerson, title, leaveCategory }) => {
  const [checkPerson, setCheckPerson] = useState(null);
  let filterLeaveCategory = leaveCategory.length > 0 ? leaveCategory.filter(a => a.leave_category_id == v.leave_category) : [];
  let leaveCategoryName = filterLeaveCategory.length > 0 && filterLeaveCategory[0].leave_category;
  return (
    <tr style={v.leave===true ? {backgroundColor:"yellow"} : v.extension != "-" ? {backgroundColor:"orange"} :{}}>
      <th style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {i + 1}
      </th>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.employee_id}
      </td>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.employee_name}
      </td>
      {title == "request" ? (
        <td style={{ border: "1px solid lightgrey"}}>
          <div style={{ maxWidth: 180 }}>
            <Select
              laceholder="Please Choose An Option"
              options={v.checkPerson}
              // isOptionDisabled={(workingDayOptions) => workingDayOptions.disabled}
              onChange={(a) => {
                handleSelectedCheckPerson(v.id, a.value);
                setCheckPerson(a);
              }}
              value={checkPerson}
              isClearable={true}
              isSearchable={true}
              className="react-select-container checkValidate"
              classNamePrefix="react-select"
              // hideSelectedOptions={false}
              // closeMenuOnSelect
             
              styles={{
                control: (provided) => ({
                  ...provided,

                  cursor: "pointer",
                  maxWidth:"180px",
                  maxHeight:"50px"
                }),
              }}
            />
          </div>
        </td>
      ) : null}
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.position}
      </td>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.career_level}
      </td>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.career_sub_level}
      </td>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.department}
      </td>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.branch}
      </td>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.region}
      </td>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.employee_date}
      </td>
      {/* <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.promotion_date}
      </td> */}
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.service_year}
      </td>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.date}
      </td>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.date}
      </td>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.leave==true ? "Leave Taken" : "No Leave"}
      </td>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {leaveCategoryName}
      </td>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.leave_start_date}
      </td>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.leave_end_date}
      </td>
      <td style={{ border: "1px solid lightgrey",paddingLeft:"10px" }}>
        {v.leave_status}
      </td>
    </tr>
  );
};
