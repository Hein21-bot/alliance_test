import React, { Component } from "react";
import ReactDatePicker from "react-datepicker";
import EmployeePieChart from "./EmployeePieChart";
import { getMacAddress, getMacAddress1 } from "./getMac";
import HeadCountBarChart from "./HeadCountBarChart";
import LeaveCountBarChart from "./LeaveCountBarChart";
import { AttendanceCaldendar } from "./AttendanceCaldendar";
import Profile from "./Profile";
import ThingsTodoTable from "./ThingsTodoTable";
import BenefitBarChart from "./BenefitBarChart";
import ExpenseBarChart from "./ExpenseBarChart";
import HelpDesk from "./HelpDesk";
import HelpDeskLineChart from "./HelpDeskLineChart";
import CompensationandBenefit from "./CompensationandBenefit";

import AttendenceBarChart from "./AttendenceBarChart";
import LeaveCalendar from "./LeaveCalendar"
import ResignBarChart from "./ResignBarChart";
const primary = "#1872ab";

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tapButtonTitle: "",
    };
  }

  async componentDidMount() {
    //   const a = await getMacAddress();
    //   const b = await getMacAddress1();
  }

  tapButtonClick = (title) => {
    this.setState({ tapButtonTitle: title });
  };

  render() {
    return (
      <div>
        {/* <h3>Dashboard</h3> */}
        {/* <LeaveCalendar /> */}
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            flexWrap: "wrap",
            marginBottom: 15,
          }}
        >
          <button
            style={styles.tapButtonStyle}
            onClick={() => this.tapButtonClick("headCount")}
          >
            Head Count
          </button>
          <button style={styles.tapButtonStyle}
           onClick={() => this.tapButtonClick("attendenceChart")}
          >Attandence</button>
          <button
            style={styles.tapButtonStyle}
            onClick={() => this.tapButtonClick("leaveChart")}
          >
            Leave
          </button>
          <button
            style={styles.tapButtonStyle}
            onClick={() => this.tapButtonClick("totalEmployee")}
          >
            Total Employee
          </button>
          <button
            style={styles.tapButtonStyle}
            onClick={() => this.tapButtonClick("expense")}
          >
            Expense
          </button>
          <button
            style={styles.tapButtonStyle}
            onClick={() => this.tapButtonClick("benefit")}
          >
           Compansation and Benefit
          </button>
          <button style={styles.tapButtonStyle} onClick={()=>this.tapButtonClick('helpdesk')}>Help Desk</button>
          <button style={styles.tapButtonStyle}>Resign</button>
        </div>
        <Profile />
        {this.state.tapButtonTitle == "headCount" ? (
          <div className="row" style={{marginTop: 15}}>
            <div className="col-md-6">
              <HeadCountBarChart title={"department"} />
            </div>
            <div className="col-md-6">
              <HeadCountBarChart title={"designation"} />
            </div>
          </div>
        ) : this.state.tapButtonTitle == "attendenceChart" ? (
          <div
            className="row mt-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15
            }}
          >
            <div className="col-lg-8">
              <AttendenceBarChart />
            </div>
          </div>
        ):this.state.tapButtonTitle == "totalEmployee" ? (
          <div
            className="row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15
            }}
          >
            <div className="col-md-8">
              <EmployeePieChart />
            </div>
          </div>
        ) : this.state.tapButtonTitle == "benefit" ? (
          <div className="row mt-3">
            <div className="col-md-8">
              <BenefitBarChart></BenefitBarChart>
              <CompensationandBenefit></CompensationandBenefit>
            </div>
          </div>
        ) : this.state.tapButtonTitle == "expense" ? (
          <div className="row mt-3">
            <div className="col-md-8">
              <ExpenseBarChart></ExpenseBarChart>
            </div>
          </div>
        ): this.state.tapButtonTitle == "helpdesk" ? (
          <div className="row mt-3">
            <div className="col-md-6">
              <HelpDesk></HelpDesk>
            </div>
            <div className="col-md-6">
              <HelpDeskLineChart></HelpDeskLineChart>
              </div> 
          </div>
        ) : this.state.tapButtonTitle == "leaveChart" ? (
          <div
            className="row mt-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15
            }}
          >
            <div className="col-lg-8">
              <LeaveCountBarChart />
            </div>
          </div>
        ) :  this.state.tapButtonTitle == "resign" ? (
          <div
            className="row mt-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15
            }}
          >
            <div className="col-lg-8">
              <ResignBarChart />
            </div>
          </div>
        ):(
          <div> 
            <div className="row" style={{marginTop: 15}}>
              <div className="col-md-4">
                <ThingsTodoTable />
              </div>
              <div className="col-8">
              <div className="col-md-8" >
                <AttendanceCaldendar/>
                <LeaveCalendar/>
              </div> 
            </div></div>
          </div>
        )}
      </div>
    );
  }
}

const styles = {
  tapButtonStyle: {
    backgroundColor: primary,
    color: "white",
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    borderColor: "transparent",
  },
  smallContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  profileLeftText: {
    width: "45%",
    color: primary,
    fontSize: 10,
  },
  profileMiddleText: {
    width: "5%",
    color: primary,
  },
  profileRightText: {
    width: "50%",
    color: primary,
    fontSize: 10,
    display: "flex",
    alignSelf: "flex-start",
  },
};
