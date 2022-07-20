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
    fetch(`${main_url}confirmation/getConfirmationAllData`)
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
  }
  backToList = (v) => {
    this.setState({ viewForm: v })
  }

  render() {
    let confirmData = this.state.pathname == '/confirmation_approve_list' ? this.state.comfirmationRequestList.filter(v => v.status == 4) : this.state.comfirmationRequestList
    return (
      <div className=" border-bottom white-bg dashboard-header">
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
