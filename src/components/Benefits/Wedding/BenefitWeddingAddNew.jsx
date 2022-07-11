import React, { Component } from "react";
import Select from "react-select";
import "../../Benefits/Benefits.css";
import { ToastContainer, toast } from "react-toastify";
import {
  main_url,
  getCookieData,
  validate,
  getActionStatus,
  alertText,
  havePermission,
  getWorkFlowStatus,
  stopSaving,
  startSaving,
} from "../../../utils/CommonFunction";
import ApprovalForm from "../../Common/ApprovalForm";
import DocumentList from "../../Common/DocumentList";

const SpouseCompanyOptions = [
  { value: 1, label: "Yes" },
  { value: 2, label: "No" },
];

var form_validate = true;
class BenefitWeddingAddNew extends Component {
  constructor(props) {
    super(props);
    var user_info = getCookieData("user_info");
    this.state = {
      visible: false,
      employee_name: user_info.fullname,
      designations: user_info.designations,
      one_benefit: this.props.data,
      employeeName: [],
      spouseName: "",
      employee_id: 0,
      spouseCompanyOption: 0,
      check_employee: "",
      check_spouse: "",
      check_spouse_name: "",
      status: 0,
      createdBy: 0,
      updatedBy: 0,
      user_id: user_info.user_id,
      selectedEmployee: [],
      selectedSpouseName: [],
      is_main_role: false,
      selectedSpouseCompany: "",
      status_title: "",
      doc: [],
      newDoc: [],
      attachment: [],
      work_flow_status: {},
      available_amount: 0,
      comment: "",
    };
  }

  componentDidUpdate() {
    if (!form_validate) validate("check_form");
  }

  async componentDidMount() {
    if (!Array.isArray(this.state.one_benefit)) {
      await this.setOneBenefit();
    } else {
      this.getAvailabelAmount();
    }
    fetch(`${main_url}main/getSpouseEmployee`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          employeeName: list,
        });
      });
  }

  getAvailabelAmount() {
    fetch(`${main_url}wedding_benefit/getWeddingAvailableAmount`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          available_amount: list.amount,
        });
      });
  }
  getDocument(id) {
    fetch(`${main_url}wedding_benefit/getDocument/${id}`)
      .then((res) => res.json())
      .then((res) => {
        this.setState({
          doc: res,
        });
      })
      .catch((error) => console.log(error));
  }

  async setOneBenefit() {
    var one = this.state.one_benefit;
    var work_flow = await getWorkFlowStatus(
      one.user_id,
      this.state.user_id,
      "Wedding Benefit",
      "Benefit"
    );
    this.getDocument(one.benefit_id);
    this.setState({
      work_flow_status: work_flow,
      spouseName: one.staff_spouse_name,
      employee_id: one.user_id,
      status: one.status,
      employee_name: one.employee_name,
      designations: one.designations,
      spouseCompanyOption: one.is_alliance_staff,
      available_amount: one.available_amount,
      selectedSpouseName: {
        value: one.spouse_name,
        label: one.staff_spouse_name,
      },
      selectedSpouseCompany: SpouseCompanyOptions[one.is_alliance_staff - 1],
      is_main_role: havePermission(work_flow),
    });
  }

  handleSpouseName = (event) => {
    // console.log(event)
    this.setState({
      spouseName: event.target.value,
    });
  };

  handleAllianceSpouseName = (event) => {
    this.setState({
      selectedSpouseName: event,
      spouseName: event.value,
    });
  };

  handleSpouseCompanyOptions = (event) => {
    let name = this.state.spouseName;
    if (event.value === 2) {
      name = "";
    }
    this.setState({
      spouseCompanyOption: event.value,
      selectedSpouseCompany: event,
      spouseName: name,
    });
  };

  handlefileChanged(event) {
    event.preventDefault();

    let newDoc = this.state.newDoc;
    var obj = document.querySelector("#attach_file").files.length;
    for (var i = 0; i < obj; i++) {
      var getfile = document.querySelector("#attach_file").files[i];
      newDoc.push(getfile);
    }

    this.setState({
      newDoc: newDoc,
    });
  }

  removeOldDocument(index, event) {
    var array = this.state.doc;
    array.splice(index, 1);
    this.setState({
      doc: array,
    });
  }

  //@kpk
  removeNewDocument(index, event) {
    var array = this.state.newDoc;
    array.splice(index, 1);
    this.setState({
      newDoc: array,
    });
  }

  checkFiles(e) {
    var files = document.getElementById("attach_file").files;
    var attachment = [];
    if (files.length > 2) {
      toast.warning("You can only upload a maximum of 2 files!");
    } else {
      for (let i = 0; i < files.length; i++) {
        attachment.push(files[i]);
      }
    }
    let newDoc = this.state.newDoc;
    var obj = document.querySelector("#attach_file").files.length;
    for (var i = 0; i < obj; i++) {
      var getfile = document.querySelector("#attach_file").files[i];
      newDoc.push(getfile);
    }
    console.log("new doc is ===>", this.state.newDoc, this.state.attachment);
    this.setState({
      attachment: attachment,
    });
  }

  approvalStatus = (text, comment) => {
    this.setState({ status_title: text, comment: comment }, () => this.save());
  };

  save() {
    stopSaving();
    let { one_benefit, status_title, is_main_role, newDoc } = this.state;
    console.log('!Array.isArray(one_benefit) is ===>', !Array.isArray(one_benefit), this.state.attachment , this.state.doc)
    let editData = !Array.isArray(one_benefit) == true ? (this.state.newDoc.length > 0 || this.state.attachment.length > 0 || this.state.doc.length > 0) && !Array.isArray(one_benefit) : !Array.isArray(one_benefit)
    if (
      validate("check_form") &&
      (this.state.attachment.length > 0 || editData)
    ) {
      stopSaving();
      var data = {
        user_id: this.state.one_benefit.user_id
          ? this.state.one_benefit.user_id
          : this.state.user_id,
        is_alliance_staff: this.state.spouseCompanyOption,
        spouse_name: this.state.spouseName,
        available_amount: this.state.available_amount,
        status: this.state.status == 5 ? 0 : this.state.status,
        createdBy: this.state.one_benefit.user_id
          ? this.state.one_benefit.user_id
          : this.state.user_id,
        updatedBy: this.state.user_id,
      };

      let status = 0;
      let path = "";

      if (!Array.isArray(one_benefit) && one_benefit !== null) {
        if (status_title !== "" && is_main_role) {
          var action = getActionStatus(
            status_title,
            one_benefit,
            this.state.user_id,
            this.state.comment
          );
          data.referback_by = action.referback_by;
          data.checked_by = action.checked_by;
          data.verified_by = action.verified_by;
          data.approved_by = action.approved_by;
          data.rejected_by = action.rejected_by;
          data.referback_date = action.referback_date;
          data.checked_date = action.checked_date;
          data.verified_date = action.verified_date;
          data.approved_date = action.approved_date;
          data.rejected_date = action.rejected_date;
          data.referback_comment = action.referback_comment;
          data.checked_comment = action.checked_comment;
          data.verified_comment = action.verified_comment;
          data.approved_comment = action.approved_comment;
          data.status = action.status;
          if (status_title === "rejected") {
            data.rejected_comment = this.state.comment;
          }
        }
        path = `editWeddingBenefit/${one_benefit.benefit_id}`;
      } else {
        path = `saveWeddingBenefit`;
      }
      const formdata = new FormData();

      // var obj = document.querySelector("#attach_file").files.length;
      for (var i = 0; i < newDoc.length; i++) {
        // var imagedata = document.querySelector("#attach_file").files[i];
        var imagedata = newDoc[i]; // new doc HMH
        formdata.append("uploadfile", imagedata);
      }
      formdata.append("oldDoc", JSON.stringify(this.state.doc));
      formdata.append("wedding_benefit", JSON.stringify(data));

      fetch(`${main_url}wedding_benefit/${path}`, {
        method: "POST",
        body: formdata,
      })
        .then((res) => {
          status = res.status;
          return res.text();
        })
        .then((text) => {
          this.props.showToast(status, text);
        });
    } else {
      startSaving();
      toast.error(alertText, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }

  render() {
    console.log(
      "data in wedding benefit",
      this.state.one_benefit.user_id,
      this.state.user_id
    );
    let { one_benefit, is_main_role } = this.state;
    return (
      <div className="container">
        <div className="row">
          <form id="check_form">
            <div className="row">
              <div className="form-group col-md-6">
                <div>
                  <label htmlFor="employee-name" className="col-sm-12">
                    Employee Name
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control input-md"
                    value={this.state.employee_name}
                    disabled
                  />
                </div>
              </div>
              <div className="form-group col-md-6">
                <div>
                  <label htmlFor="designation" className="col-sm-12">
                    Designation
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    type="text"
                    // placeholder="Please Provide The Designation"
                    className="form-control"
                    value={this.state.designations}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <div>
                  <label htmlFor="employee-name" className="col-sm-12">
                    Is Your Spouse An Alliance Staff ?
                  </label>
                </div>
                <div className="col-sm-10">
                  {!Array.isArray(one_benefit) && is_main_role ? (
                    <input
                      type="text"
                      // placeholder="Please Provide The Designation"
                      className="form-control"
                      value={
                        this.state.spouseCompanyOption === 1 ? "Yes" : "No"
                      }
                      disabled
                    />
                  ) : (
                    <Select
                      placeholder="Please Choose An Option"
                      options={SpouseCompanyOptions}
                      onChange={this.handleSpouseCompanyOptions.bind(this)}
                      value={this.state.selectedSpouseCompany}
                      className="react-select-container  checkValidate"
                      classNamePrefix="react-select"
                    />
                  )}
                </div>
              </div>
              <div className="form-group col-md-6">
                <div>
                  <label htmlFor="spouse-name" className="col-sm-12">
                    Spouse Name
                  </label>
                </div>
                <div className="col-sm-10">
                  {!Array.isArray(one_benefit) && is_main_role ? (
                    <input
                      type="text"
                      // placeholder="Please Provide The Designation"
                      className="form-control"
                      value={this.state.spouseName}
                      disabled
                    />
                  ) : this.state.spouseCompanyOption === 1 ? (
                    <Select
                      options={this.state.employeeName}
                      placeholder="Please Choose Employee Name"
                      onChange={this.handleAllianceSpouseName.bind(this)}
                      className="react-select-container  checkValidate"
                      classNamePrefix="react-select"
                      value={this.state.selectedSpouseName}
                    />
                  ) : (
                    <input
                      type="text"
                      // placeholder="Please Provide The Employee Name"
                      className={`form-control checkValidate`}
                      onChange={this.handleSpouseName.bind(this)}
                      value={this.state.spouseName}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-6">
                <div>
                  <label htmlFor="employee-name" className="col-sm-12">
                    Availabel Amount
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className="form-control input-md"
                    value={this.state.available_amount}
                    disabled
                  />
                </div>
              </div>
            </div>
            {!Array.isArray(this.state.one_benefit) ? (
              is_main_role ? (
                this.state.doc.length > 0 ? (
                  <div className="row document-main">
                    <input
                      className="full_width hidden"
                      type="file"
                      id="attach_file"
                    ></input>

                    <DocumentList
                      title="Wedding Benefit Document"
                      doc={this.state.doc}
                      path="wedding_benefit"
                    />
                  </div>
                ) : (
                  <input
                    className="full_width hidden"
                    type="file"
                    id="attach_file"
                  ></input>
                )
              ) : (
                <div className="row">
                  <div
                    className="form-group col-md-12"
                    style={{ overflowX: "auto" }}
                  >
                    <div className="ownspacing"></div>
                    <h4>Wedding Benefit Document</h4>
                    <div className="col-md-12">
                      <input
                        type="file"
                        className="dropZone"
                        id="attach_file"
                        onChange={this.handlefileChanged.bind(this)}
                        multiple
                      />
                    </div>

                    <div className="ibox float-e-margins">
                      <div className="p-md col-md-12" style={{ float: "left" }}>
                        {this.state.doc.map((data, index) => (
                          <div className="fileuploader-items col-md-4">
                            <ul className="fileuploader-items-list">
                              <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                <div className="columns">
                                  <div className="column-title">
                                    <a
                                      href={`${main_url}wedding_benefit/getCRDocumentData/${data.name}`}
                                      download
                                      target="_blank"
                                      className="btn btn-primary document-body-bt document-width"
                                    >
                                      {data.name.split("&@")[1]}
                                    </a>
                                  </div>
                                  <div className="column-actions">
                                    <a
                                      className="fileuploader-action fileuploader-action-remove"
                                      onClick={(event) =>
                                        this.removeOldDocument(index, event)
                                      }
                                    >
                                      {" "}
                                      <i></i>
                                    </a>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        ))}

                        {this.state.newDoc.map((data, index) => (
                          <div className="fileuploader-items col-md-4">
                            <ul className="fileuploader-items-list">
                              <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                                <div className="columns">
                                  <div className="column-title">
                                    <a
                                      href="#"
                                      className="btn btn-primary document-body-bt document-width"
                                    >
                                      {data.name}
                                    </a>
                                  </div>
                                  <div className="column-actions">
                                    <a
                                      className="fileuploader-action fileuploader-action-remove"
                                      onClick={(event) =>
                                        this.removeNewDocument(index, event)
                                      }
                                    >
                                      {" "}
                                      <i></i>
                                    </a>
                                  </div>
                                </div>
                              </li>
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            ) : (
              // <div className="row">
              //     <div className="form-group col-md-6">
              //         <div>
              //             <label htmlFor="attachment" className="col-sm-12 custom-file-label">Provide At Least One Or At Most Two
              //         Attachment</label>
              //         </div>

              //         <div className="col-sm-10">
              //             <input className="dropZone" type="file" id="attach_file" multiple onChange={this.checkFiles.bind(this)}></input>

              //         </div>

              //     </div>
              // </div>
              <div className="form-group col-md-6">
                <div>
                  <label
                    htmlFor="attachment"
                    className="col-sm-12 custom-file-label"
                  >
                    Provide At Least One Or At Most Two Attachment
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="attach_file"
                    multiple
                    onChange={this.checkFiles.bind(this)}
                  ></input>
                </div>
              </div>
            )}
          </form>
        </div>
        <div>
          {Array.isArray(this.state.one_benefit) && this.state.newDoc.map((data, index) => (
            <div className="fileuploader-items col-md-4">
              <ul className="fileuploader-items-list">
                <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                  <div className="columns">
                    <div className="column-thumbnail">
                      <div className="fileuploader-item-image fileuploader-no-thumbnail">
                        <div
                          className="fileuploader-item-icon"
                          style={{ backgroundColor: "#3f4fd3" }}
                        >
                          <i>{data.name.split(".")[1]}</i>
                        </div>
                      </div>
                      <span className="fileuploader-action-popup"></span>
                    </div>
                    <div className="column-title">
                      <span className="own-text">{data.name}</span>
                    </div>
                    <div className="column-actions">
                      <a
                        className="fileuploader-action fileuploader-action-remove"
                        onClick={(event) =>
                          this.removeNewDocument(index, event)
                        }
                      >
                        {" "}
                        <i></i>
                      </a>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          ))}
        </div>

        <div className="row save-btn">
          {!Array.isArray(one_benefit) &&
          havePermission(this.state.work_flow_status) &&
          this.state.one_benefit.user_id != this.state.user_id ? (
            <ApprovalForm
              approvalStatus={this.approvalStatus.bind(this)}
              status={this.state.status}
              work_flow={this.state.work_flow_status}
              total_amount={this.state.available_amount}
            />
          ) : (
            <div className="float-right">
              <div>
                {this.state.one_benefit.status == undefined ||
                this.state.one_benefit.status == 5 ? (
                  <div>
                    <button
                      onClick={this.save.bind(this)}
                      className="btn btn-primary"
                      id="saving_button"
                      type="button"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  ""
                )}
                {/* <button className="btn btn-primary" id="saving_button" type="button" onClick={this.save.bind(this)}>Save</button> */}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default BenefitWeddingAddNew;
