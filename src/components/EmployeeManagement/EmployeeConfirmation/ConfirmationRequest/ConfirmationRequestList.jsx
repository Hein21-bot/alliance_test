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
      confirmData: []
    }
  }
  async componentDidMount() {
    await this.getConfirmationRequestList();
  }

  async getConfirmationRequestList() {
    fetch(`${main_url}confirmation/getConfirmationAllData/0/0/0/0/0`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this.setState({
          comfirmationRequestList: list,
          confirmData: list.filter(v => v.status == 4)
        })
      })
  }

  goToViewForm = data => {
    this.setState({
      viewForm: true,
      selectedConfirmation: data
    })
    console.log("selected confirmation===>",this.state.selectedConfirmation)
  }
  backToList = (v) => {
    this.setState({ viewForm: v })
  }

  approvedlist = async (data) => {
    if (data == 'Pending') {
      this.setState({ confirmData: this.state.comfirmationRequestList.filter(v => v.status == 4) })
    } else if (data == 'approved') {
      this.setState({ confirmData: this.state.comfirmationRequestList.filter(v => v.status == 10) })
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
              <a className="nav-link active" href="#confirmation_approve_list" role="tab" data-toggle="tab" aria-selected="true" onClick={() => this.approvedlist('Pending')}>Approve Pending List</a>
            </li>
            <li className="nav-item1">
              <a className="nav-link" href="#confirmation_approve_list" role="tab" data-toggle="tab" onClick={() => this.approvedlist('approved')}>Approved List</a>
            </li>
          </ul>
        </div>
        {this.state.viewForm ? (
          <ConfirmationRequestListView item={this.state.selectedConfirmation} backToList={this.backToList} />
        ) : (
          <ConfirmationRequestListTable
            goToViewForm={this.goToViewForm}
            data={this.state.confirmData}
            pathname={this.state.pathname}
            permission={{ isView: 1, isEdit: 1 }}
          />
        )}

      </div>
    );
  }
}
