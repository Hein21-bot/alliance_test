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
import ResignOrDismissSalaryTable from "./ResignOrDismissSalaryTable";
import ResignOrDismissSalaryAddNew from "./ResignOrDismissSalaryAddNew";
import ResignOrDismissSalaryView from "./ResignOrDismissSalaryView";

class ResignOrDismissSalaryMain extends Component {
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
      permission_status: { isAddNew: true },
      requestType: "",
      active_tab: 0,
      resignOrDismissData: [],
      datasource: null,
        };
  }

  async componentDidMount() {
    this.getResignOrDismissData();
  }

  getResignOrDismissData() {
    fetch(`${main_url}resign_or_dismiss/get_resign_or_dismiss/${this.state.user_id}`)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        if (res) {
          this.setState({ resignOrDismissData: res });
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }


  changeTab(tab) {
    this.setState({ active_tab: tab }, () => {
      console.log(tab);
    });
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
    const { isView, isEdit, resignOrDismissData, datasource } = this.state;
    console.log('data =====>', resignOrDismissData)
    return (
      <div className="pay-roll border-bottom white-bg dashboard-header">
        <ToastContainer position={toast.POSITION.TOP_RIGHT} />

        <PayrollPageHeader
          pageTitle="Resign Or Dismisss Salary"
          setupForm={this.setupForm}
          isAddNew={this.state.isAddNew}
          isView={this.state.isView}
          isEdit={this.state.isEdit}
          permission={this.state.permission_status}
        />

        <br />

        {this.state.isTable ? (
          <ResignOrDismissSalaryTable dataSource={resignOrDismissData} goToViewForm={this.goToViewForm} />
        ) : this.state.isAddNew ? (
          <ResignOrDismissSalaryAddNew
            view={isView}
            edit={isEdit}
          />
        ) : this.state.isView ? (
            <ResignOrDismissSalaryView dataSource={datasource} />
        ) :null}

       
      </div>
    );
  }
}

export default ResignOrDismissSalaryMain;
