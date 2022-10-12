import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import Select from "react-select";
import EmployeeListTable from "./EmployeeListTable";

import {
  main_url,
  getUserId,
  getMainRole,
  getWorkFlowStatus,
  getCookieData,
  getPermissionStatus,
  startSaving,
} from "../../../utils/CommonFunction";
import EmployeeListView from "./EmployeeListView";
import EditEmployeeListForm from "./EditEmployeeListForm";
import { useLocation } from "react-router-dom";
import EmployeeDetailMain from "../EmploymentDetail/EmployeeDetailMain";

class EmployeeListMain extends Component {
  constructor() {
    super();
    this.state = {
      isAddNew: false,
      loading: false,
      user_info: getCookieData("user_info"),
      user_id: getUserId("user_info"),
      is_main_role: getMainRole(),
      isTable: true,
      isView: false,
      isEdit: false,
      datasource: [],
      permission_status: {},
      selected_status: null,
      selected_region: null,
      selected_branch: null,
      selected_department: null,
      selected_designation: null,
      selected_jobTitleList: null,
      selected_exit_status: null,
      branchlist: null,
      JobTitleList: null,
      // exitList: null,
      region: null,
      districtCodeList: null,
      granDistrictCodeList: null,
      nrcList: null,
      departmentlist: null,
      designationList: null,
      searchValue: "",
      employeeData: null,
      viewForm: false,
      editForm: false,
      selectedEmployeeData: null,
      bankList: null,
      degreeList: null,
      detailForm: false,
      statusList: null,
      exitList: [{ label: 'Active', value: 0 }, { label: 'Exit', value: 1 }]
    };
  }

  componentDidMount() {
    this.getRegionList();
    this.getBranchList();
    this.getDepartmentList();
    this.getDesignationList();
    this.getNRC_DistrictCode(0);
    this.getNRC_SD_Code(0);
    this.getGran_NRC_DistrictCode(0);
    this.getLevelOptions();
    this.getBankList();
    this.getDegreeList();
    this.getStatusList();
    this.getJobTitleList();
    // this.getExitStatus();
    // this.getEmployeeList();
  }
  getDegreeList() {
    fetch(`${main_url}employee/getDegree`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        // let lists = list.unshift({ branch_id: 0, branch_name: 'All' })
        this.setState({
          degreeList: list.map((v) => ({ ...v, label: v.degree, value: v.id })),
        });
      });
  }
  getStatusList() {
    fetch(`${main_url}benefit/getStatusList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          statusList: list,
        });
      });
  }
  getBankList() {
    fetch(`${main_url}employee/getBank`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        // let lists = list.unshift({ branch_id: 0, branch_name: 'All' })
        this.setState({
          bankList: list.map((v) => ({
            ...v,
            label: v.bank_name,
            value: v.id,
          })),
        });
      });
  }

  getNRC_DistrictCode(id) {
    fetch(`${main_url}employee/getNrc/${id}`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          districtCodeList: list.map((v) => ({
            ...v,
            label: v.district_code,
            value: v.id,
          })),

        });
      });
  }

  getGran_NRC_DistrictCode(id) {
    fetch(`${main_url}employee/getNrc/${id}`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          granDistrictCodeList: list.map((v) => ({
            ...v,
            label: v.district_code,
            value: v.id,
          })),
        });
      });
  }

  getLevelOptions() {
    fetch(`${main_url}allowLevel/getLevel`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          level_options: list.map((v) => ({
            ...v,
            label: v.career_level,
            value: v.career_level_id,
          })),
        });
      });
  }

  getNRC_SD_Code(id) {
    fetch(`${main_url}employee/getNrc/${id}`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        // let lists = list.unshift({ branch_id: 0, branch_name: 'All' })
        var idList = [];
        var sd_code_arr = [];
        var name = "";
        var count = 1;
        list &&
          list.map((v, k) => {
            if (count == 1) {
              name = v.sd_code;
              idList.push(v);
              sd_code_arr.push(v.sd_code);
            }
            if (v.sd_code != name && !sd_code_arr.includes(v.sd_code)) {
              sd_code_arr.push(v.sd_code);
              idList.push(v);
              name = v.sd_code;
            }
            count++;
          });

        this.setState({
          nrcList: idList.map((v) => ({ ...v, label: v.sd_code, value: v.id })),
        });
      });
  }

  getEmployeeList(id) {

    fetch(
      `${main_url}employee/getEmployeeList/${id.regionId}/${id.depId}/${id.branchId}/${id.designId}`
    )
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.setState({ employeeData: res });
        }

      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }

  getBranchList() {
    fetch(`${main_url}benefit/getBranchList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          branchlist: list.map((v) => ({
            ...v
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
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        let lists = list.unshift({ state_id: 0, state_name: 'All' })
        this.setState({
          region: list.map(v => ({ ...v, label: v.state_name, value: v.state_id }))
        })
      })
  }

  getDesignationList() {
    fetch(`${main_url}main/getDesignations`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          designationList: list, //list.map(v => ({ ...v, label: v.region_name, value: v.region_id }))
        });
      });
  }
  getJobTitleList() {
    fetch(`${main_url}main/getJobLabel`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          JobTitleList: list, //list.map(v => ({ ...v, label: v.region_name, value: v.region_id }))
        });
      });
  }
  // getExitStatus(){
  //   fetch(`${main_url}main/`)
  //     .then((res) => {
  //       if (res.ok) return res.json();
  //     })
  //     .then((list) => {
  //       let lists = list.unshift({ value: 0, label: "All" });
  //       this.setState({
  //         exitList: list, //list.map(v => ({ ...v, label: v.region_name, value: v.region_id }))
  //       });
  //     });
  // }

  showToast = (status, text) => {
    if (status === 200) {
      toast.success(text);
      window.location.reload();
    } else {
      startSaving();
      toast.error(text);
    }
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
  handleSelectedDesignation = (event) => {
    if (event !== null)
      this.setState({
        selected_designation: event,
      });
  };
  handleSelectedstatus = (event) => {
    if (event !== null)
      this.setState({
        selected_status: event
      });
  };
  handleSelectedJobTitle = (event) => {
    if (event !== null)
      this.setState({
        selected_jobTitleList: event,
      });
  }
  handleSelectedExitStatus = (event) => {
    if (event !== null)
      this.setState({
        selected_exit_status: event,
      });
  }


  handleSearch = (e) => {
    e.preventDefault();
    this.setState({
      loading: true
    })

    fetch(
      `${main_url}employee/getEmployeeList/${this.state.selected_region ? this.state.selected_region.state_id : 0}/${this.state.selected_department
        ? this.state.selected_department.departments_id
        : 0}/${this.state.selected_branch
          ? this.state.selected_branch.value
          : 0}/${this.state.selected_designation
            ? this.state.selected_designation.value
            : 0}/${this.state.selected_status
              ? this.state.selected_status.value
              : -1}/${this.state.selected_jobTitleList
                ? this.state.selected_jobTitleList.value
                : 0}/${this.state.selected_exit_status
                  ? this.state.selected_exit_status.value
                  : 0}`
    )
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.setState({ employeeData: res, loading: false });
        }

      })
      .catch((error) => console.error(`Fetch Error =\n`, error));

  };

  handleAddNew = () => {
    this.props.history.push("./employee_register");
  };

  BackToTable = () => {
    this.setState({
      viewForm: false,
      editForm: false,
      selectedEmployeeData: null,
      editForm: false,
    });
    const regionId = this.state.selected_region
      ? this.state.selected_region.state_id
      : 0;
    const depId = this.state.selected_department
      ? this.state.selected_department.departments_id
      : 0;
    const branchId = this.state.selected_branch
      ? this.state.selected_branch.value
      : 0;
    const designId = this.state.selected_designation
      ? this.state.selected_designation.value
      : 0;
    const statusId = this.state.selected_status
      ? this.state.selected_status.value
      : -1;
    this.getEmployeeList(regionId, depId, branchId, designId, statusId);
  };

  goToViewForm = (data) => {
    this.setState({
      viewForm: true,
      selectedEmployeeData: data,
    });
  };

  goToEditForm = (data) => {
    this.setState({
      editForm: true,
      selectedEmployeeData: data,
    });
  };

  goToDetailForm = (data) => {
    this.setState({
      detailForm: true,
      selectedEmployeeData: data,
      isTable: false,
      isView: false,
      isEdit: false,
      isAddNew: false,
    });
  };

  render() {
    if (this.state.loading == true) {
      return <div style={{ display: 'flex', justifyContent: 'center' }}><h2>Loading...</h2></div>
    } else {
      return (
        <div className=" border-bottom white-bg dashboard-header">
          {this.state.isAddNew || this.state.isView || this.state.isEdit || this.state.isTable ? (
            <>
              <ToastContainer position={toast.POSITION.TOP_RIGHT} />
              <div className="row wrapper border-bottom white-bg page-heading">
                <div className="col-lg-12">
                  <ol className="breadcrumb">
                    <li style={{ fontSize: 18 }}>Employee</li>
                    <li className="active" style={{ fontSize: 18 }}>
                      <a href="#">List</a>
                    </li>
                    {this.state.viewForm && (
                      <li className="active">
                        <a href="#">View</a>
                      </li>
                    )}
                    {this.state.editForm && (
                      <li className="active">
                        <a href="#">Edit</a>
                      </li>
                    )}
                  </ol>
                </div>
              </div> </>) : null}
          {this.state.viewForm ? (
            <EmployeeListView
              selectedEmployeeData={this.state.selectedEmployeeData}
              BackToTable={this.BackToTable}
              districtCodeList={this.state.districtCodeList}
              granDistrictCodeList={this.state.granDistrictCodeList}
              designationList={this.state.designationList}
              statusList={this.state.statusList}
              level_options={this.state.level_options}
              branchlist={this.state.branchlist}
              nrcList={this.state.nrcList}
              viewForm={true}
              editForm={false}
            />
          ) : this.state.editForm ? (
            <EditEmployeeListForm
              selectedEmployeeData={this.state.selectedEmployeeData}
              BackToTable={this.BackToTable}
              viewForm={false}
              editForm={true}
              districtCodeList={this.state.districtCodeList}
              granDistrictCodeList={this.state.granDistrictCodeList}
              designationList={this.state.designationList}
              level_options={this.state.level_options}
              branchlist={this.state.branchlist}
              nrcList={this.state.nrcList}
              bankList={this.state.bankList}
              statusList={this.state.statusList}
              getGran_NRC_DistrictCode={this.getGran_NRC_DistrictCode}
              getNRC_DistrictCode={this.getNRC_DistrictCode}
              degreeList={this.state.degreeList}
            />
          ) : this.state.detailForm ? (
            <EmployeeDetailMain data={this.state.selectedEmployeeData} />
          ) : (
            <>
              <div
                className=""
                style={{
                  marginTop: 20,
                  alignItems: "end",
                  display: "flex",
                  flexWrap: "wrap",
                }}
              >
                <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  style={{ marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}
                >
                  <div style={{ paddingBottom: 10 }}>Region</div>

                  <Select
                    options={this.state.region}
                    value={this.state.selected_region}
                    onChange={this.handleSelectedRegion.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
                <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  style={{ marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}
                >
                  <div style={{ paddingBottom: 10 }}>Department</div>

                  <Select
                    options={this.state.departmentlist}
                    value={this.state.selected_department}
                    onChange={this.handleSelectedDeaprtment.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
                <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  style={{ marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}
                >
                  <div style={{ paddingBottom: 10 }}>Branch</div>

                  <Select
                    options={this.state.branchlist}
                    value={this.state.selected_branch}
                    onChange={this.handleSelectedBranch.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
                <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  style={{ marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}
                >
                  <div style={{ paddingBottom: 10 }}>Designation</div>

                  <Select
                    options={this.state.designationList}
                    value={this.state.selected_designation}
                    onChange={this.handleSelectedDesignation.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
                <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  style={{ marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}
                >
                  <div style={{ paddingBottom: 10 }}>Status</div>

                  <Select
                    options={this.state.statusList}
                    value={this.state.selected_status}
                    onChange={this.handleSelectedstatus.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
               
                <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  style={{ marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}
                >
                  <div style={{ paddingBottom: 10 }}>Job Title</div>

                  <Select
                    options={this.state.JobTitleList}
                    value={this.state.selected_jobTitleList}
                    onChange={this.handleSelectedJobTitle.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
                <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  style={{ marginBottom: 10, paddingLeft: 20, paddingRight: 20 }}
                >
                  <div style={{ paddingBottom: 10,marginBottom:2 }}>Exit Status</div>

                  <Select
                    options={this.state.exitList}
                    value={this.state.selected_exit_status}
                    onChange={this.handleSelectedExitStatus.bind(this)}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                  />
                </div>
                <div
                  className="col-lg-2 col-md-3 col-sm-12"
                  style={{ display: "flex", marginBottom: 13 }}
                >
                  <button
                    onClick={this.handleSearch}
                    className="btn btn-primary"
                    style={{ borderRadius: 3, width: 80, marginRight: 15 }}
                  >
                    Search
                  </button>
                  <button
                    onClick={this.handleAddNew}
                    className="btn btn-primary"
                    style={{ borderRadius: 3, width: 80, textAlign: 'center' }}
                  >
                    Add New
                  </button>
                </div>
              </div>
              <EmployeeListTable
                goToViewForm={this.goToViewForm}
                goToEditForm={this.goToEditForm}
                goToDetailForm={this.goToDetailForm}
                data={this.state.employeeData ? this.state.employeeData : []}
                permission={{
                  isEdit: 1,
                  isView: 1,
                }}
              />
            </>
          )}
        </div>
      );
    }


  }
}

export default EmployeeListMain;
