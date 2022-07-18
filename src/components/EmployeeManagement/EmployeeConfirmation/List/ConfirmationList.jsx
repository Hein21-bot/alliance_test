import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";

import {
  main_url,
  getUserId,
  getMainRole,
  getWorkFlowStatus,
  getCookieData,
  getPermissionStatus,
  startSaving,
} from "../../../../utils/CommonFunction";
import Rodal from "rodal";
import Select from "react-select";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";
import ListSearchForm from "./ListSearchForm";
import ConfirmationListTable from "./ConfirmationListTable";
import ViewConfirmationListForm from "./ViewConfirmationListForm";
import ConfirmationRequest from "./components/ConfirmationRequest";

class ConfirmationList extends Component {
  constructor() {
    super();
    this.state = {
      user_info: getCookieData("user_info"),
      user_id: getUserId("user_info"),
      is_main_role: getMainRole(),
      view: false,
      titleList: [],
      confirmationMonth: null,
      date: new Date(),
      dropDownOpen: false,
      selected_designation: null,
      designationList: null,
      subLevelList: null,
      levelList: null,
      selected_region: null,
      selected_branch: null,
      selected_department: null,
      branchlist: null,
      departmentlist: null,
      regionList: null,
      confirmationListData: null,
      selectedCheckBox: null,
      checkPersonList: null,
      selected_checkPerson: null,
      fullname: null,
      employment_id: null,
      career_level: null,
      career_sub_level: null,
      level_options: null,
      sub_level_options: null,
      verifyPersonList: null,
      selected_verifyPerson: null,
      checkedListData: [],
      visible: false,
      modal_visible: false,
      extension_comment: "",
      requestComponent: false,
      title: ''
    };
  }

  show_Modal() {
    this.setState({ modal_visible: true });
  }

  hide_Modal() {
    this.setState({ modal_visible: false });
  }

  async componentDidMount() {
    this.getRegionList();
    this.getBranchList();
    this.getDepartmentList();
    this.getDesignationList();
    // this.getConfirmationList()
    this.getConfirmationTitleList();
    const level = await this.getLevelOptions();
    const sub_level = await this.getCareerSubLevelOptions();
    const level_options =
      level &&
      level.map((v) => ({
        ...v,
        label: v.career_level,
        value: v.career_level,
      }));
    const sub_level_options =
      sub_level &&
      sub_level.map((v) => ({
        ...v,
        label: v.career_sub_level,
        value: v.career_sub_level,
      }));
    this.setState({
      level_options,
      sub_level_options,
    });
  }

  getLevelOptions = async () => {
    var res = await fetch(`${main_url}allowLevel/getLevel`);
    if (res.ok) return res.json();
    else return [];
  };

  getCareerSubLevelOptions = async () => {
    var res = await fetch(`${main_url}allowLevel/getCareerSubLevel`);
    if (res.ok) return res.json();
    else return [];
  };

  getConfirmationList() {
    const {
      selected_region,
      selected_title,
      confirmationMonth,
      selected_branch,
      selected_department,
      selected_designation,
      career_level,
      career_sub_level,
    } = this.state;
    const regionId = selected_region ? selected_region.region_id : 0;
    const branchId = selected_branch ? selected_branch.branch_id : 0;
    const depId = selected_department ? selected_department.departments_id : 0;
    const designId = selected_designation ? selected_designation.value : 0;
    const lvlId = career_level ? career_level.career_level_id : 0;
    const subLvlId = career_sub_level ? selected_branch.career_sub_level_id : 0;
    const title = selected_title
      ? selected_title.value
        ? selected_title.value
        : confirmationMonth
      : 0;
    fetch(
      `${main_url}confirmation/getConfirmationList/${regionId}/${depId}/${branchId}/${designId}/${lvlId}/${subLvlId}/${parseInt(
        title
      )}`
    )
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          confirmationListData: list,
        });
      });
  }
  // confirmation/getConfirmationList/:regionId/:depId/:branchId/:designationId/:levelId/:subLevelId
  getCheckPersonList() {
    const regionId = this.state.selected_region
      ? this.state.selected_region.region_id
      : 0;
    const branchId = this.state.selected_branch
      ? this.state.selected_branch.branch_id
      : 0;
    const departmentId = this.state.selected_department
      ? this.state.selected_department.departments_id
      : 0;
    fetch(
      `${main_url}confirmation/getCheckPerson/${regionId}/${branchId}/${departmentId}`
    )
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          checkPersonList: list.map((v) => ({
            ...v,
            label: v.fullname,
            value: v.branch_id,
          })),
        });
      });
  }

  getVerifyPersonList() {
    const regionId = this.state.selected_region
      ? this.state.selected_region.region_id
      : 0;
    const branchId = this.state.selected_branch
      ? this.state.selected_branch.branch_id
      : 0;
    const departmentId = this.state.selected_department
      ? this.state.selected_department.departments_id
      : 0;
    fetch(
      `${main_url}confirmation/getVerifyPerson/${regionId}/${branchId}/${departmentId}`
    )
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ branch_id: 0, branch_name: "All" });

        this.setState({
          verifyPersonList: list.map((v) => ({
            ...v,
            label: v.fullname,
            value: v.branch_id,
          })),
        });
      });
  }

  getBranchList() {
    fetch(`${main_url}benefit/getBranchList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ branch_id: 0, branch_name: "All" });
        this.setState({
          branchlist: list.map((v) => ({
            ...v,
            label: v.branch_name,
            value: v.branch_id,
          })),
        });
      });
  }

  getDepartmentList() {
    fetch(`${main_url}benefit/getDepartmentList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ departments_id: 0, deptname: "All" });
        this.setState({
          departmentlist: list.map((v) => ({
            ...v,
            label: v.deptname,
            value: v.departments_id,
          })),
        });
      });
  }

  getRegionList() {
    fetch(`${main_url}benefit/getRegionList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ region_id: 0, region_name: "All" });
        this.setState({
          regionList: list.map((v) => ({
            ...v,
            label: v.region_name,
            value: v.region_id,
          })),
        });
      });
  }

  handleLevelSelectorChange = (val, key) => {
    const { sub_level_options, level_options } = this.state;
    const value =
      key === "career_level"
        ? level_options.find(
            (v) => Number(v.career_level_id) === Number(val.career_level_id)
          )
        : sub_level_options.find(
            (v) =>
              Number(v.career_sub_level_id) === Number(val.career_sub_level_id)
          );

    const setState = {};
    setState[key] = value;
    this.setState(setState);
  };

  handleSelectedDesignation = (event) => {
    if (event !== null)
      this.setState({
        selected_designation: event,
      });
  };

  handleSelectedDeaprtment = (event) => {
    if (event !== null)
      this.setState({
        selected_department: event,
      });
  };

  handleSelectedRegion = (event) => {
    if (event !== null)
      this.setState({
        selected_region: event,
      });
  };

  handleSelectedBranch = (event) => {
    if (event !== null)
      this.setState({
        selected_branch: event,
      });
  };
  handleSelectedCheckPerson = (event) => {
    if (event !== null)
      this.setState({
        selected_checkPerson: event,
      });
  };

  handleSelectedVerifyPerson = (event) => {
    if (event !== null)
      this.setState({
        selected_verifyPerson: event,
      });
  };

  getDesignationList() {
    fetch(`${main_url}main/getDesignations`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          designationList: list, //list.map(v => ({ ...v, label: v.region_name, value: v.region_id }))
        });
      });
  }

  getConfirmationTitleList() {
    fetch(`${main_url}confirmation/getConfirmationTitle`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          titleList: list.map((v) => ({ ...v, label: v.name, value: v.value })),
        });
      });
  }

  handleSelectedTitle = (event) => {
    if (event !== null)
      this.setState({
        selected_title: event,
      });
  };

  handleCheckBoxChange = (data) => {
    const { checkedListData } = this.state;
    const checkedListData_ = [...checkedListData];
    console.log("data", data.user_id);
    const newData = {
      id: data.user_id,
      employee_id: data.code ? data.code : "",
      employee_name: data.fullname ? data.fullname : "",
      position: data.designations ? data.designations : "-",
      career_level: data.career_level ? data.career_level : "-",
      career_sub_level: data.career_sub_level ? data.career_sub_level : "-",
      department: data.deptname ? data.deptname : "-",
      branch: data.branch_name ? data.branch_name : "-",
      region: data.region_name ? data.region_name : "-",
      employ_date: data.employ_date ? data.employ_date : "-",
      last_promotion_date: data.last_promotion_date
        ? data.last_promotion_date
        : "-",
      date: moment(data.createdAt).format("DD-MM-YYYY"),
      service_year: data.service_year ? data.service_year : "",
      leave: data.leave ? data.leave : "-",
    };
    if (checkedListData_.length === 0) {
      console.log("1....");
      checkedListData_.push(newData);
      this.setState(
        {
          checkedListData: checkedListData_,
        },
        () => console.log(this.state.checkedListData)
      );
    } else if (
      checkedListData_.filter((c) => c.id === data.user_id).length > 0
    ) {
      console.log("2....");
      for (var i = 0; i < checkedListData_.length; i++) {
        console.log(checkedListData_[i].id, data.user_id);
        if (checkedListData_[i].id == data.user_id) {
          checkedListData_.splice(i, 1);
        }
      }
      this.setState({
        checkedListData: checkedListData_,
      });
    } else {
      console.log("3....");
      checkedListData_.push(newData);
      this.setState({
        checkedListData: checkedListData_,
      });
    }
  };

  handleConfirmationListInputChange = (e) => {
    this.setState({
      confirmationMonth: e.target.value,
    });
  };

  handleSearch = (e) => {
    // this.getEmployeeList({ regionId, depId, branchId, designId })
    this.getCheckPersonList();
    this.getVerifyPersonList();
    this.getConfirmationList();
  };

  onChange = (date) => {
    this.setState({
      date,
      dropDownOpen: false,
    });
  };

  handleVisible = (title) => {
    if (this.state.checkedListData.length > 0) {
      this.setState({
        requestComponent: true,
        title: title
      });
    }
  };

  handleLeaveExtensionRequest = (extension_comment) => {
    if (this.state.checkedListData.length > 0) {
      let data = {
        person: getCookieData("user_info").user_id,
        list: this.state.checkedListData,
        extension_comment: extension_comment,
        status: 5,
      };
      console.log('data ===>', data)

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
        });
    } else toast.error("Please choose at least one user!");
  };

  handleConfirmRequest = () => {
    if (this.state.checkedListData.length > 0) {
      if (this.state.selected_checkPerson && this.state.selected_verifyPerson) {
        let data = {
          person: getCookieData("user_info").user_id,
          list: this.state.checkedListData,
          verify_person: this.state.selected_verifyPerson.user_id,
          check_person: this.state.selected_checkPerson.user_id,
          status: 0,
        };

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
      } else if (!this.state.selected_verifyPerson)
        toast.error("Please choose verify person!");
      else toast.error("Please choose check person!");
    } else toast.error("Please choose at least one user!");
  };

  handleDropDown = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();
  };

  render() {
    console.log("check list dat6a is ===>", this.state.checkedListData);
    const {
      view,
      selected_title,
      titleList,
      confirmationMonth,
      verifyPersonList,
      selected_verifyPerson,
      date,
      user_info,
      level_options,
      sub_level_options,
      career_level,
      career_sub_level,
      confirmationListData,
      checkPersonList,
      selected_checkPerson,
      dropDownOpen,
      selected_designation,
      designationList,
      subLevelList,
      levelList,
      selected_branch,
      selected_department,
      selected_region,
      regionList,
      branchlist,
      departmentlist,
    } = this.state;
    return (
      <div className=" border-bottom white-bg dashboard-header">
        <ToastContainer position={toast.POSITION.TOP_RIGHT} />
        {this.state.requestComponent == false ? (
          <>
            <div className="row wrapper white-bg page-heading">
              <div className="col-lg-12">
                <h2>HR Management System</h2>
                <ol className="breadcrumb">
                  <li>Employee</li>
                  <li>Confirmation</li>
                  <li>List</li>
                </ol>
              </div>
            </div>

            <div className="white-bg" style={{}}>
              <ListSearchForm
                titleList={titleList}
                confirmationMonth={confirmationMonth}
                date={date}
                dropDownOpen={dropDownOpen}
                selected_designation={selected_designation}
                designationList={designationList}
                subLevelList={subLevelList}
                levelList={levelList}
                selected_title={selected_title}
                selected_region={selected_region}
                selected_branch={selected_branch}
                selected_department={selected_department}
                branchlist={branchlist}
                departmentlist={departmentlist}
                regionList={regionList}
                level_options={level_options}
                sub_level_options={sub_level_options}
                career_level={career_level}
                career_sub_level={career_sub_level}
                handleSearch={this.handleSearch}
                handleSelectedDesignation={this.handleSelectedDesignation}
                handleConfirmationListInputChange={
                  this.handleConfirmationListInputChange
                }
                handleSelectedTitle={this.handleSelectedTitle}
                handleSelectedBranch={this.handleSelectedBranch}
                handleSelectedDeaprtment={this.handleSelectedDeaprtment}
                handleSelectedRegion={this.handleSelectedRegion}
                handleDropDown={this.handleDropDown}
                onChange={this.onChange}
                handleLevelSelectorChange={this.handleLevelSelectorChange}
              />
              <div style={{}}>
                <div
                  className="dashboard-header "
                  style={{
                    alignItems: "center",
                    borderTop: "1px solid grey",
                    display: "flex",
                  }}
                >
                  <h3>Confirmation List Table</h3>
                </div>
                {this.state.visible == false ? (
                  <div
                    className="col-lg-6 col-md-6 col-sm-12"
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <button
                      onClick={() => this.handleVisible('request')}
                      className="btn btn-primary"
                      style={{ borderRadius: 10, width: 150 }}
                    >
                      Request
                    </button>
                    <button
                      onClick={() =>this.handleVisible('extension')}
                      className="btn btn-danger"
                      style={{ borderRadius: 10, width: 150 }}
                    >
                      Extension
                    </button>
                  </div>
                ) : (
                  ""
                )}
              </div>

              <ConfirmationListTable
                handleCheckBoxChange={this.handleCheckBoxChange}
                goToViewForm={null}
                goToEditForm={null}
                selectedCheckBox={this.state.selectedCheckBox}
                data={
                  this.state.confirmationListData
                    ? this.state.confirmationListData
                    : []
                }
                permission={{
                  isEdit: 0,
                  isView: 0,
                  isSelect: 1,
                }}
              />
            </div>
            {/* <Rodal
              width={500}
              height={150}
              visible={this.state.modal_visible}
              onClose={this.hide_Modal.bind(this)}
            >
              <div className="col-md-12 ">
                <h4>Leave Extension Comment </h4>
              </div>
              <div className="col-md-12" style={{ marginTop: 30 }}>
                <div className="col-md-3">Comment </div>
                <div className="col-md-7">
                  <input
                    type="text"
                    className="full_width"
                    onChange={(e) =>
                      this.setState({ extension_comment: e.target.value })
                    }
                  ></input>
                </div>
                <div className="col-md-2 btn-rightend">
                  <button
                    className="btn btn-primary"
                    onClick={() => this.handleLeaveExtensionRequest()}
                  >
                    <span>Submit</span>{" "}
                  </button>
                </div>
              </div>
            </Rodal> */}
          </>
        ) : (
          <ConfirmationRequest
            data={this.state.checkedListData}
            checkData={this.state.checkPersonList}
            confirmData={this.state.verifyPersonList}
            selected_verifyPerson={selected_verifyPerson}
            handleSelectedVerifyPerson={this.handleSelectedVerifyPerson}
            selected_checkPerson={selected_checkPerson}
            handleSelectedCheckPerson={this.handleSelectedCheckPerson}
            handleConfirmRequest={this.handleConfirmRequest}
            handleLeaveExtensionRequest={this.handleLeaveExtensionRequest}
            title={this.state.title}
          />
        )}
      </div>
    );
  }
}

export default ConfirmationList;
