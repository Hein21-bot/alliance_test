import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import $ from "jquery";
import {
  main_url,
  getCookieData,
  validate,
  getUserId,
  alertText,
  stopSaving,
  startSaving,
} from "../../utils/CommonFunction";
import Select from "react-select";
import DatePicker from "react-datetime";

var form_validate = true;

class StaffLoanAddNew extends Component {
  constructor() {
    super();
    this.state = {
      user_info: getCookieData("user_info"),
      staffInfo: null,
      staffGuarantorInfo: {
        staffGuarantorId: 0,
        staffGuarantorName: "",
        staffGuarantorNRC: "",
        staffGuarantorPosition: "",
        staffGuarantorBranch: "",
      },
      user_id: "",
      designation: "",
      noOfChildren: "",
      status: 0,
      available_amount: 0,
      createdBy: getUserId("user_info"),
      updatedBy: getUserId("user_info"),
      attachment: [],
      newDoc: [],
    };
  }

  componentDidUpdate() {
    if (!form_validate) validate("check_form");
  }

  componentDidMount() {
    // fetch(`${main_url}child_benefit/getChildAvailableAmount`)
    //     .then(res => { if (res.ok) return res.json() })
    //     .then(list => {
    //         this.setState({
    //             available_amount: list.amount
    //         })
    //     })
  }

  handleNoOfChildren = (event) => {
    this.setState({
      noOfChildren: event.target.value,
    });
  };
  removeNewDocument(index, event) {
    var array = this.state.newDoc;

    array.splice(index, 1);
    this.setState({
      newDoc: array,
    });
    console.log("new doc", this.state.newDoc);
  }

  checkFiles(e) {
    var files = document.getElementById("attach_file").files;

    if (files.length > 2) {
      toast.warning("You can only upload a maximum of 2 files!");
    }

    let newDoc = this.state.newDoc;
    var obj = document.querySelector("#attach_file").files.length;
    for (var i = 0; i < obj; i++) {
      var getfile = document.querySelector("#attach_file").files[i];
      newDoc.push(getfile);
    }
    document.getElementById("attach_file").value = "";
    this.setState({
      // attachment: attachment,
      newDoc: newDoc,
    });
  }
  //@kpk

  save() {
    console.log("new doc", this.state.newDoc);
    console.log("doc", this.state.doc);
    if (this.state.newDoc.length == 0) {
      toast.error("Please Choose Attachment File!");
    } else {
      if (validate("check_form") && this.state.newDoc.length > 0) {
        console.log("save new doc", this.state.newDoc);
        $("#saving_button").attr("disabled", true);
        var data = {
          user_id: this.state.user_info.user_id,
          child_count: this.state.noOfChildren,
          available_amount: this.state.available_amount,
          status: this.state.status,
          createdBy: this.state.createdBy,
          updatedBy: this.state.updatedBy,
        };

        const formdata = new FormData();

        // var obj = document.querySelector("#attach_file").files.length;
        // for (var i = 0; i < obj; i++) {
        //     var imagedata = document.querySelector("#attach_file").files[i];
        //     formdata.append('uploadfile', imagedata);
        // }
        var obj = this.state.newDoc.length;
        for (var i = 0; i < obj; i++) {
          var imagedata = this.state.newDoc[i];
          formdata.append("uploadfile", imagedata);
        }

        formdata.append("child_benefit", JSON.stringify(data));

        let status = 0;
        fetch(`${main_url}child_benefit/saveChildBenefit`, {
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
        form_validate = false;
      }
    }
  }

  render() {
    return (
      <div className="">
        <ToastContainer />
        <div className="row">
          <form className="form-group" id="check_form">
            {/* StaffInformation */}
            <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Staff Information</h3>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="employeeId" className="col-md-12">
                    Employee ID
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.employment_id}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="employeeName" className="col-md-12">
                    Employee Name
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.fullname}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="nrc" className="col-md-12">
                    NRC
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.nrc}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="backAccount" className="col-md-12">
                    Bank Account
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={""}
                  />
                </div>
              </div>
            </div>

            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="dateOfBirth" className="col-md-12">
                    Date of Birth
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.employment_id}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="employedDate" className="col-md-12">
                    Employed Date
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.fullname}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="applicantCurrentSalary" className="col-md-12">
                    Applicant's Current Salary
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.nrc}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="region" className="col-md-12">
                    Region
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.branch_name}
                  />
                </div>
              </div>
            </div>

            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="branch" className="col-md-12">
                    Branch
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.employment_id}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="designation" className="col-md-12">
                    Designation
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.fullname}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="officePhone" className="col-md-12">
                    Office Phone
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.nrc}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="personalPhone" className="col-md-12">
                    Personal Phone
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.branch_name}
                  />
                </div>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-9">
                <div>
                  <label htmlFor="personalPhone" className="col-md-12">
                    Address
                  </label>
                </div>
                <div className="col-md-12">
                  <textarea
                    type="text"
                    className="form-control"
                    disabled
                    rows={3}
                    value={this.state.user_info.branch_name}
                  />
                </div>
              </div>
            </div>
            {/* StaffInformation */}

            {/* Staff Guarantor Information */}
            <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Staff Guarantor Information</h3>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="staffGuarantorId" className="col-md-12">
                    Staff Guarantor ID
                  </label>
                </div>
                <div className="col-md-12">
                  <Select
                    styles={{
                      container: (base) => ({
                        ...base,
                        //   flex: 1
                        // width: 150,
                        // marginRight:10
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: "18px",
                      }),
                    }}
                    placeholder="Staff Guarantor ID"
                    options={[]}
                    // onChange={this.handleSelectedDepartment}
                    value={""}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="staffGuarantorName" className="col-md-12">
                    Staff Guarantor Name
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.fullname}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="staffGuarantorNRC" className="col-md-12">
                    Staff Guarantor NRC
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.nrc}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="staffGuarantorPosition" className="col-md-12">
                    Staff Guarantor Position
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={""}
                  />
                </div>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="staffGuarantorBranch" className="col-md-12">
                    Staff Guarantor Branch
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={""}
                  />
                </div>
              </div>
            </div>
            {/* Staff Guarantor Information */}

            {/* Family Guarantor Information */}
            <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Family Guarantor Information</h3>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="familyGuarantorName" className="col-md-12">
                    Family Guarantor Name
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.fullname}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="familyGuarantorNRC" className="col-md-12">
                    Family Guarantor NRC
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={this.state.user_info.nrc}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="relationWithFamily" className="col-md-12">
                    Ralation with Family
                  </label>
                </div>
                <div className="col-md-12">
                  <Select
                    styles={{
                      container: (base) => ({
                        ...base,
                        //   flex: 1
                        // width: 150,
                        // marginRight:10
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: "18px",
                      }),
                    }}
                    placeholder="Ralation with Family"
                    options={[]}
                    // onChange={this.handleSelectedDepartment}
                    value={""}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="familyGuarantorJob" className="col-md-12">
                    Family Guarantor Job
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={""}
                  />
                </div>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-6">
                <div>
                  <label htmlFor="familyGuarantorAddress" className="col-md-12">
                    Family Guarantor Address
                  </label>
                </div>
                <div className="col-md-12">
                  <textarea
                    type="text"
                    className="form-control"
                    disabled
                    rows={3}
                    value={this.state.user_info.branch_name}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="familyGuarantorIncome" className="col-md-12">
                    Family Guarantor Income
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={""}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="familyGuarantorPhone" className="col-md-12">
                    Family Guarantor Phone
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="text"
                    className="form-control"
                    disabled
                    value={""}
                  />
                </div>
              </div>
            </div>
            {/* Family Guarantor Information */}

            {/* Other Loan Information */}
            <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Other Loan Information</h3>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="otherLoan" className="col-md-12">
                    Other Loan
                  </label>
                </div>
                <div className="col-md-12">
                  <input
                    type="checkbox"
                    checked={"checked"}
                    onChange={() => {}}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="otherLoanDropdown" className="col-md-12">
                    Other Loan
                  </label>
                </div>
                <div className="col-md-12">
                  <Select
                    styles={{
                      container: (base) => ({
                        ...base,
                        //   flex: 1
                        // width: 150,
                        // marginRight:10
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: "18px",
                      }),
                    }}
                    placeholder="Other Loan"
                    options={[]}
                    // onChange={this.handleSelectedDepartment}
                    value={""}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="nameOfInstitution" className="col-md-12">
                    Name of Institution
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" value={""} />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="outstandingAmount" className="col-md-12">
                    Outstanding Amount
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" value={""} />
                </div>
              </div>
            </div>
            <div className="row" style={{ marginBottom: 10 }}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="installmentterm" className="col-md-12">
                    Installment Term
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" value={""} />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="installmentAmount" className="col-md-12">
                    Installment Amount
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" value={""} />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="maturityDate" className="col-md-12">
                    Maturity Date
                  </label>
                </div>
                <div className="col-md-12">
                  <DatePicker
                    className="checkValidate"
                    timeFormat={true}
                    value={new Date()}
                    dateFormat={false}

                    // onChange={this.changeCaseTime.bind(this)}
                  />
                </div>
              </div>
              <div className="col-md-3" style={{paddingTop: 20}}>
                <button
                  className="btn btn-primary"
                  id="add_button"
                  type="button"
                  // onClick={this.save.bind(this)}
                >
                  Add
                </button>
              </div>
            </div>
            {/* Other Loan Information */}

            {/* Loan Request Information */}
            <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Loan Request Information</h3>
                </div>
              </div>
              <div className="row" style={{marginBottom: 10}}>
              <div className="col-md-3">
                <div>
                  <label htmlFor="requestAmount" className="col-md-12">
                    Request Amount
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" value={""} />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="repaymentPeriod" className="col-md-12">
                    Repayment Period
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" value={""} />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="installmentterm" className="col-md-12">
                    Installment Amount
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" value={""} />
                </div>
              </div>
              <div className="col-md-3">
                <div>
                  <label htmlFor="loanPurpose" className="col-md-12">
                    Loan Purpose
                  </label>
                </div>
                <div className="col-md-12">
                  <input type="text" className="form-control" value={""} />
                </div>
              </div>
              </div>
              <div className="row" style={{marginBottom: 10}}>
                <div className="col-md-3">
                <div>
                  <label htmlFor="withdrawLocation" className="col-md-12">
                    Withdraw Location
                  </label>
                </div>
                <div className="col-md-12">
                <Select
                    styles={{
                      container: (base) => ({
                        ...base,
                        //   flex: 1
                        // width: 150,
                        // marginRight:10
                      }),
                      control: (base) => ({
                        ...base,
                        minHeight: "18px",
                      }),
                    }}
                    placeholder="Withdraw Location"
                    options={[]}
                    // onChange={this.handleSelectedDepartment}
                    value={""}
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
                
                </div>
              </div>
            
            {/* Loan Request Information */}

            <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Attachment</h3>
                </div>
              </div>
            <div className="row">
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
                <div>
                  {this.state.newDoc.map((data, index) => (
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
              </div>
            </div>
          </form>
        </div>
        <div className="row save-btn">
          <div className="float-right">
            <div>
              <button
                className="btn btn-primary"
                id="saving_button"
                type="button"
                // onClick={this.save.bind(this)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StaffLoanAddNew;
