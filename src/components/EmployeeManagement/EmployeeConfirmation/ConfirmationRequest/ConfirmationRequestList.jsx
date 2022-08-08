import React, { Component } from "react";
import { main_url } from "../../../../utils/CommonFunction";
import ConfirmationRequestListTable from "./ConfirmationRequestListTable";
import ConfirmationRequestListView from "./ConfirmationRequestListView";

export default class ConfirmationRequestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      comfirmationRequestList: [],
      viewForm: false,
      selectedConfirmation: null,
      pathname: window.location.pathname,
      confirmData: [],
      sub_level: [],
      status_info: [],
      status: null,
      pending_approve: ''
    }
  }
  async componentDidMount() {
    await this.getConfirmationRequestList();
    await this.getCareerSubLevelOptions()
  }

  async getConfirmationRequestList() {
    fetch(`${main_url}confirmation/getConfirmationAllData/0/0/0/0/0`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this.setState({
          comfirmationRequestList: list,
          confirmData: list.filter(v => v.status == 4 && v.recommendation != 'Extensions')
        })
      })
  }

  async getCareerSubLevelOptions() {
    await fetch(`${main_url}allowLevel/getCareerSubLevel`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this.setState({ sub_level: list })
      })
  }


  goToViewForm = data => {
    fetch(`${main_url}confirmation/getActionStatus/${data.table_id}`)
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(res => {
        this.setState({
          status_info: res
        })
      })
      .catch(error => console.error(`Fetch Error =\n`, error));
    this.setState({
      viewForm: true,
      selectedConfirmation: data
    })

  }
  backToList = (v) => {
    this.setState({ viewForm: v })
  }

  approvedlist = async (data) => {
    if (data == 'pending') {
      this.setState({
        confirmData: this.state.comfirmationRequestList.filter(v => v.status == 4 && v.recommendation != "Extensions"),
        pending_approve: 'pending'
      })
    } else if (data == 'approved') {
      this.setState({
        confirmData: this.state.comfirmationRequestList.filter(v => v.status == 10 && v.recommendation != "Extensions"),
        pending_approve: 'approve'
      })
    }
  }

  render() {

    return (
      <div className=" border-bottom white-bg dashboard-header">
        <div className="row wrapper white-bg page-heading">
          <div className="col-lg-12">
            <ol className="breadcrumb">
              <li style={{ fontSize: 18 }}>Employee</li>
              <li style={{ fontSize: 18 }}>Confirmation</li>
              <li style={{ fontSize: 18 }}>{this.state.pathname == '/confirmation_approve_list' ? 'Confirmation Approve List' : 'Confirmation Request List'}</li>
            </ol>
          </div>
        </div>
        <div>
          <ul className="nav nav-tabs tab" role="tablist" id="tab-pane">
            <li className="active">
              <a className="nav-link active" href="#confirmation_approve_list" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.approvedlist('pending')}>Approve Pending List</a>
            </li>
            <li className="nav-item1">
              <a className="nav-link" href="#confirmation_approve_list" role="tab" data-toggle="tab" onClick={() => this.approvedlist('approved')}>Approved List</a>
            </li>
          </ul>
        </div>
        {this.state.viewForm ? (
          <ConfirmationRequestListView item={this.state.selectedConfirmation} backToList={this.backToList} sub_level={this.state.sub_level} status_info={this.state.status_info} />
        ) : (
          <ConfirmationRequestListTable
            goToViewForm={this.goToViewForm}
            data={this.state.confirmData}
            pathname={this.state.pathname}
            permission={{ isView: 1, isEdit: 1 }}
            pending_approve={this.state.pending_approve}
          />
        )}

      </div>
    );
  }
}
