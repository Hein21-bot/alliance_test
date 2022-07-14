import React, { Component } from "react";
import ReactDatePicker from "react-datepicker";
import EmployeePieChart from "./EmployeePieChart";
import { getMacAddress, getMacAddress1 } from "./getMac";
import HeadCountBarChart from "./HeadCountBarChart";
import { LeaveCalendar } from "./LeaveCalendar";
import Profile from "./Profile";
import ThingsTodoTable from "./ThingsTodoTable";

const primary = "#1872ab";

export class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tapButtonTitle: '',
    };
  }

  async componentDidMount() {
    //   const a = await getMacAddress();
    //   console.log('a', a)
    //   const b = await getMacAddress1();
  }

  tapButtonClick = (title) => {
    this.setState({tapButtonTitle: title});
  };
  render() {
    return (
      <div>
        {/* <h3>Dashboard</h3> */}
        {/* <LeaveCalendar /> */}
        {console.log("count ===>", this.state.count)}
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
          <button style={styles.tapButtonStyle}>Attandence</button>
          <button style={styles.tapButtonStyle}>Leave</button>
          <button style={styles.tapButtonStyle}>Total Employee</button>
          <button style={styles.tapButtonStyle}>Expense</button>
          <button style={styles.tapButtonStyle}>
            Compansation and Benefit
          </button>
          <button style={styles.tapButtonStyle}>Help Desk</button>
          <button style={styles.tapButtonStyle}>Resign</button>
        </div>
        <Profile />
        {this.state.tapButtonTitle == 'headCount' ? (
          <div className="row mt-3">
            <div className="col-md-6">
              <HeadCountBarChart />
            </div>
            <div className="col-md-6">
              <HeadCountBarChart />
            </div>
          </div>
        ) : (
          <div>
            <div className="row" style={{}}>
              <div className="col-md-6">
                <ThingsTodoTable />
              </div>
              <div className="col-md-6">
                <LeaveCalendar />
              </div>
            </div>
            <div className="row" style={{}}>
              <div className="col-md-6">
                <EmployeePieChart />
              </div>
            </div>
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
