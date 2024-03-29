import React, { Component } from "react";
import { main_url, getUserId } from "../../utils/CommonFunction";

export default class MyLeaveDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      leaveData: null,
      leaveDetail: null,
      user_id: getUserId("user_info"),
    };
  }

  componentDidMount() {
    // fetch(`${main_url}leave/getMyLeave/${this.state.user_id}`)
    //     .then(response => response.json())
    //     .then(data =>
    //         this.setState({ leaveData: data })
    //     );

    fetch(`${main_url}leave/leaveDetailBalance/${this.state.user_id}`)
      .then((response) => response.json())
      .then((data) => this.setState({ leaveData: data }));
    //
    fetch(`${main_url}leave/getLeaveDetailUser/${this.state.user_id}`)
      .then((response) => response.json())
      .then((data) => this.setState({ leaveDetail: data }));
  }

  render() { 
    let casualLeaveBalance = this.state.leaveDetail != null &&
      parseFloat(this.state.leaveDetail[0].leave[0].leave_quota)
    let casualLeaveCount = this.state.leaveDetail != null &&
      parseFloat(this.state.leaveDetail[0].leave[0].leave_count)
    let earnedLeaveCount =
      this.state.leaveDetail != null &&
      parseFloat(this.state.leaveDetail[0].leave[3].leave_quota);
    let earnedLeaveCount1 =
      this.state.leaveDetail != null &&
      parseFloat(this.state.leaveDetail[0].leave[3].leave_count);
    const annualLeave = this.state.annualLeaveBalance;
    // if (annualLeave) {
    // const annualLeaveBalance = annualLeave.filter(v => v.leave_category === "Earned  Leave" ? v.leave_quota : null)
    // const totalLeaveBalance = parseInt(annualLeaveBalance[0].leave_quota) + 10 + 120 + 10 + 30 + 5 + 90
    const leaveDetail = this.state.leaveDetail;
    
    if (leaveDetail) {
      // const casualCount =
      //   leaveData
      //     .map((v) => v)
      //     .filter((vv) => vv.leave_category == "Casual Leave").length > 0
      //     ? parseFloat(
      //       leaveData
      //         .map((v) => v)
      //         .filter((vv) => vv.leave_category == "Casual Leave")[0]
      //         .leave_days
      //     )
      //     : 0;
      const casualCount=leaveDetail[0].leave[0].leave_count;
      // const maternityCount =
      //   leaveData
      //     .map((v) => v)
      //     .filter((vv) => vv.leave_category == "Maternity Leave").length > 0
      //     ? parseInt(
      //       leaveData
      //         .map((v) => v)
      //         .filter((vv) => vv.leave_category == "Maternity Leave")[0]
      //         .leave_days
      //     )
      //     : 0;
      const maternityCount=leaveDetail[0].leave[1].leave_count;
      // const paternityCount =
      //   leaveData
      //     .map((v) => v)
      //     .filter((vv) => vv.leave_category == "Paternity Leave").length > 0
      //     ? parseInt(
      //       leaveData
      //         .map((v) => v)
      //         .filter((vv) => vv.leave_category == "Paternity Leave")[0]
      //         .leave_days
      //     )
      //     : 0;
      const paternityCount=leaveDetail[0].leave[2].leave_count;
      // const annualCount =
      //   leaveData
      //     .map((v) => v)
      //     .filter((vv) => vv.leave_category == "Earned Leave").length > 0
      //     ? parseFloat(
      //       leaveData
      //         .map((v) => v)
      //         .filter((vv) => vv.leave_category == "Earned Leave")[0]
      //         .leave_days
      //     )
      //     : 0;
      const annualCount=leaveDetail[0].leave[3].leave_count;
      // const medicalCount =
      //   leaveData
      //     .map((v) => v)
      //     .filter((vv) => vv.leave_category == "Medical Leave").length > 0
      //     ? parseInt(
      //       leaveData
      //         .map((v) => v)
      //         .filter((vv) => vv.leave_category == "Medical Leave")[0]
      //         .leave_days
      //     )
      //     : 0;
      const medicalCount=leaveDetail[0].leave[4].leave_count;
      // const compassionateCount =
      //   leaveData
      //     .map((v) => v)
      //     .filter((vv) => vv.leave_category == "Compassionate Leave").length > 0
      //     ? parseInt(
      //       leaveData
      //         .map((v) => v)
      //         .filter((vv) => vv.leave_category == "Compassionate Leave")[0]
      //         .leave_days
      //     )
      //     : 0;
      const compassionateCount=leaveDetail[0].leave[5].leave_count;
      // const leaveWithoutPay =
      //   leaveData
      //     .map((v) => v)
      //     .filter((vv) => vv.leave_category == "Leave Without Pay").length > 0
      //     ? parseInt(
      //       leaveData
      //         .map((v) => v)
      //         .filter((vv) => vv.leave_category == "Leave Without Pay")[0]
      //         .leave_days
      //     )
      //     : 0;
      const leaveWithoutPay=leaveDetail[0].leave[6].leave_count;
      const totalLeave =
        casualLeaveCount +
        maternityCount +
        paternityCount +
        earnedLeaveCount1 +
        medicalCount +
        compassionateCount +
        leaveWithoutPay;
        console.log("><><><><>total",casualLeaveCount,maternityCount,paternityCount,earnedLeaveCount1,medicalCount,compassionateCount,leaveWithoutPay)
      const totalLeaveCount = casualLeaveBalance + 120 + 10 + earnedLeaveCount + 30 + 5 + 90;

      return (
        <div className="col-sm-4 white-bg mt20 border-class">
          <div className="form-group" style={{ marginTop: 20 }}>
            <h4>My Leave Details</h4>
            <hr />
            <div className="row">
              <div className="col-sm-8">Casual Leave:</div>
              <div className="col-sm-4">{casualLeaveCount}/{casualLeaveBalance}</div>
            </div>
            <div className="row mt20">
              <div className="col-sm-8">Maternity Leave:</div>
              <div className="col-sm-4">{maternityCount}/120</div>
            </div>
            <div className="row mt20">
              <div className="col-sm-8">Paternity Leave:</div>
              <div className="col-sm-4">{paternityCount}/10</div>
            </div>
            <div className="row mt20">
              <div className="col-sm-8">Earned Leave:</div>
              <div className="col-sm-4">{earnedLeaveCount1}/{earnedLeaveCount}</div>
            </div>
            <div className="row mt20">
              <div className="col-sm-8">Medical Leave:</div>
              <div className="col-sm-4">{medicalCount}/30</div>
            </div>
            <div className="row mt20">
              <div className="col-sm-8">Compassionate Leave:</div>
              <div className="col-sm-4">{compassionateCount}/5</div>
            </div>
            <div className="row mt20">
              <div className="col-sm-8">Leave Without Pay:</div>
              <div className="col-sm-4">{leaveWithoutPay}/90</div>
            </div>
            <div className="row mt20">
              <div className="col-sm-8">Total:</div>
              <div className="col-sm-4">{totalLeave}/{totalLeaveCount}</div>
            </div>
          </div>
        </div>
      );
      
    } else {
      return null;
    }
  }
}
