import React, { Component } from "react";
import { toast, ToastContainer } from "react-toastify";
import moment from "moment";
import StaffLoanPageHeader from "./StaffLoanPageHeader";
import {
  main_url,
  getUserId,
  getMainRole,
  getCookieData,
  getPermissionStatus,
  startSaving,
} from "../../utils/CommonFunction";
import StaffLoanTable from "./StaffLoanTable";
import StaffLoanAddNew from "./StaffLoanAddNew";

class StaffLoanMain extends Component {
  constructor() {
    super();
    this.state = {
      user_id: getUserId("user_info"),
      user_info: getCookieData("user_info"),
      is_main_role: getMainRole(),
      isAddNew: false,
      isTable: true,
      isView: false,
      isEdit: false,
      data: [],
      permission_status: {},
      requestData: [],
      active_tab: 0,
    };
  }

  async componentDidMount() {
    // var permission_status = await getPermissionStatus(this.state.user_info.designations_id, 'Child Benefit', 'Benefit');
    // this.getStaffLoanData();
    // this.setState({
    //     permission_status: permission_status
    // })
  }

  // getStaffLoanData() {
  //     let id = this.state.user_id;

  //     fetch(main_url + "child_benefit/getChildBenefit/" + id + "/" + moment(this.state.from_date).format("YYYY-MM-DD") + "/" + moment(this.state.to_date).format("YYYY-MM-DD"))
  //         .then(response => {
  //             if (response.ok) return response.json()
  //         })
  //         .then(res => {

  //             if (res) {
  //                 this.setState({ data: res,
  //                     requestData:res.filter(v=>v.createdBy !=this.state.user_id)})
  //             }
  //         })
  //         .catch(error => console.error(`Fetch Error =\n`, error));

  // }
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
      isView: false,
    });
  };

  goToTable = () => {
    this.setState({
      isAddNew: false,
      isEdit: false,
      isTable: true,
      isView: false,
    });
    window.location.reload();
  };

  goToViewForm = (data) => {
    this.setState({
      data: data,
      isAddNew: false,
      isEdit: false,
      isView: true,
      isTable: false,
    });
  };

  goToEditForm = (data) => {
    this.setState({
      data: data,
      isAddNew: false,
      isEdit: true,
      isView: false,
      isTable: false,
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
  requestlist = async (data) => {
    if (data == "myrequest") {
      this.setState({
        requestData: this.state.data.filter(
          (v) => v.createdBy == this.state.user_id
        ),
        requestType: "myrequest",
      });
    } else if (data == "allrequest") {
      this.setState({
        requestData: this.state.data.filter(
          (v) => v.createdBy != this.state.user_id
        ),
        requestType: "allrequest",
      });
    }
  };

  render() {
    return (
      <div className="border-bottom white-bg dashboard-header">
        <ToastContainer position={toast.POSITION.TOP_RIGHT} />
        <StaffLoanPageHeader
          setupForm={this.setupForm}
          isAddNew={this.state.isAddNew}
          isView={this.state.isView}
          isEdit={this.state.isEdit}
          permission={this.state.permission_status}
        />

        <br />

        {/* {
                    this.state.isAddNew ? <BenefitChildAddNew goToTable={this.goToTable} showToast={this.showToast} /> : ''
                }
                {
                    this.state.isView ? <BenefitChildView data={this.state.data} /> : ''
                }
                {
                    this.state.isEdit ? <BenefitChildEdit data={this.state.data} showToast={this.showToast} /> : ''
                } */}
        {this.state.isTable ? (
          <div>
            <div>
              <ul className="nav nav-tabs tab" role="tablist" id="tab-pane">
                <li className="nav-item">
                  <a
                    className="nav-link "
                    href="#wedding_benefit"
                    role="tab"
                    data-toggle="tab"
                    aria-selected="true"
                    onClick={() => this.changeTab(1)}
                  >
                    My Request
                  </a>
                </li>
                <li className="nav-item1 active">
                  <a
                    className="nav-link active"
                    href="#wedding_benefit"
                    role="tab"
                    data-toggle="tab"
                    onClick={() => this.changeTab(0)}
                  >
                    All Request
                  </a>
                </li>
              </ul>
            </div>
            <StaffLoanTable
              goToViewForm={this.goToViewForm}
              tab={this.state.active_tab}
              goToEditForm={this.goToEditForm}
              data={this.state.requestData}
              requestlist={this.requestlist}
              permission={this.state.permission_status}
            />
          </div>
        ) : this.state.isAddNew ? (
            <StaffLoanAddNew goToTable={this.goToTable} showToast={this.showToast}/>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default StaffLoanMain;