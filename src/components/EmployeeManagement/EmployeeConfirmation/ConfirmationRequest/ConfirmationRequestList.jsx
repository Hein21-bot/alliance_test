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
        selectedConfirmation: null
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
        this.setState({viewForm: v})
    }

  render() {
    // const {confirmationRequestList} = this.state;
    return (
      <div className=" border-bottom white-bg dashboard-header">
        {this.state.viewForm ? (
            <ConfirmationRequestListView item={this.state.selectedConfirmation} backToList={this.backToList} />
        ) : (
            <ConfirmationRequestListTable
            //   handleCheckBoxChange={this.handleCheckBoxChange}
              goToViewForm={this.goToViewForm}
            //   goToEditForm={null}
            //   selectedCheckBox={this.state.selectedCheckBox}
              data={
                this.state.comfirmationRequestList
                  
              }
              permission={{
                isView: 1
            }}
            />
        )}
        
      </div>
    );
  }
}
