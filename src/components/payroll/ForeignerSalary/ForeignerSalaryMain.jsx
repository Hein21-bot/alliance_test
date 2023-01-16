import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import PayrollPageHeader from "../payrollHeader";
import {
  main_url,
  getUserId,
  getMainRole,
  getWorkFlowStatus,
  getCookieData,
  getPermissionStatus,
  startSaving,
} from "../../../utils/CommonFunction";
// import ForeignerSalaryTable from './ForeignerSalaryTable';
// import ForeignerSalaryAddNew from './ForeignerSalaryAddNew';
import ForeignerSalaryAddNew from "./ForeignerSalaryAddNew";
import ForeignerSalaryTable from "./ForeignerSalaryTable";
import ForeignerSalaryView from "./ForeignerSalaryView";
import ForeignerSalaryEdit from "./ForeignerSalaryEdit";
import moment from "moment";
class ForeignerSalaryMain extends Component {
  constructor() {
    super();
    this.state = {
      isAddNew: false,
      user_info: getCookieData("user_info"),
      user_id: getUserId("user_info"),
      is_main_role: getMainRole(),
      isTable: true,
      isView: false,
      isEdit: false,
      datasource: [],
      permission_status: {},
      requestType: "",
      
      branchList: [],
      deptList: [],
      regionList: [],
    };
  }
  async componentDidMount() {
    var permission_status = await getPermissionStatus(this.state.user_info.role_id,'Foreigner Salary','Foreigner Salary');
    this.setState({
        permission_status: permission_status
    })
    await this.getBranchList();
    await this.getDepartmentList();
    await this.getRegionList();
    await this._getForeginerSalary();
  }

  async getBranchList() {
    await fetch(`${main_url}benefit/getBranchList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        list.unshift({ label: "All", value: 0 });
        this.setState({
          branchList: list,
        });
      });
  }

  async getDepartmentList() {
    await fetch(`${main_url}benefit/getDepartmentList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        var array = [];
        list.map((v) => {
          var obj = {};
          obj["label"] = v.deptname;
          obj["value"] = v.departments_id;
          array.push(obj);
        });
        array.unshift({ label: "All", value: 0 });
        this.setState({
          deptList: array,
        });
      });
  }

  async getRegionList() {
    await fetch(`${main_url}benefit/getRegionList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        var array = [];
        list.map((v) => {
          var obj = {};
          obj["label"] = v.state_name;
          obj["value"] = v.state_id;
          array.push(obj);
        });
        array.unshift({ label: "All", value: 0 });
        this.setState({
          regionList: array,
        });
      });
  }

  async _getForeginerSalary() {
    let id = this.state.user_id;

    await fetch(
      `${main_url}foreigner_salary/get_foreigner_salary/0/0/0/${moment(new Date()).format("YYYY-MM")}/${id}`
    )
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.setState({
            datasource: res,
          });
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }
  setupForm = () => {
    this.setState({
      isAddNew: true,
      isEdit: false,
      isTable: false,
    });
  };

  goToTable = () => {
    this.setState({
      isAddNew: false,
      isEdit: false,
      isTable: true,
    });
    window.location.reload();
  };

  goToViewForm = (data) => {
    this.setState({
      isAddNew: false,
      isTable: false,
      isEdit: false,
      isView: true,
      datasource: data,
    });
  };
  goToEditForm = (data) => {
    this.setState({
      isAddnew: false,
      isTable: false,
      isView: false,
      isEdit: true,
      datasource: data,
    });
  };
  showToast = (status, text) => {
    if (status === 200) {
      toast.success(text);
      window.location.reload();
    } else {
      startSaving();
      toast.error(text);
    }
  };

  render() {
    return (
      <div className="pay-roll border-bottom white-bg dashboard-header">
        <ToastContainer position={toast.POSITION.TOP_RIGHT} />

        <PayrollPageHeader
          pageTitle="Foreigner Salary"
          setupForm={this.setupForm}
          isAddNew={this.state.isAddNew}
          isView={this.state.isView}
          isEdit={this.state.isEdit}
          permission={this.state.permission_status}
        />

        <br />

        {this.state.isTable ? (
          <ForeignerSalaryTable
            view={this.state.isView}
            goToViewForm={this.goToViewForm}
            goToEditForm={this.goToEditForm}
            dataSource={this.state.datasource}
            branchList={this.state.branchList}
            deptList={this.state.deptList}
            regionList={this.state.regionList}
            handleRequestMonth={this.handleRequestMonth}
          />
        ) : this.state.isView ? (
          <ForeignerSalaryView
            view={this.state.isView}
            dataSource={this.state.datasource}
          />
        ) : this.state.isAddNew ? (
          <ForeignerSalaryAddNew />
        ) : this.state.isEdit ? (
          <ForeignerSalaryEdit dataSource={this.state.datasource} />
        ) : null}
      </div>
    );
  }
}

export default ForeignerSalaryMain;
