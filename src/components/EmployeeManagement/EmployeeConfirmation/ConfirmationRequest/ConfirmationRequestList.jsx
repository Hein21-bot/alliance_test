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
    }
  }
  async componentDidMount() {
    this.getConfirmationRequestList();
  }

  getConfirmationRequestList() {
    fetch(`${main_url}confirmation/getConfirmationAllData/0/0/0/0/0`)
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this.setState({
          comfirmationRequestList: list
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

  render() {
    console.log('view form is ===>', this.state.viewForm)
    let confirmData = this.state.pathname == '/confirmation_approve_list' ? this.state.comfirmationRequestList.filter(v => v.status == 4) : this.state.comfirmationRequestList
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
        {this.state.viewForm ? (
          <ConfirmationRequestListView item={this.state.selectedConfirmation} backToList={this.backToList} />
        ) : (
          <ConfirmationRequestListTable
            goToViewForm={this.goToViewForm}
            data={confirmData}
            pathname={this.state.pathname}
            permission={{ isView: 1, isEdit: 1 }}
          />
        )}

      </div>
    );
  }
}
