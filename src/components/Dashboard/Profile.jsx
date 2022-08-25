import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { main_url } from "../../utils/CommonFunction";
const primary = "#1872ab";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: {},
    };
  }

  calcDate(date2, date1) {
    const diffInMs = Math.abs(date2 - date1);
    const noOfDays = diffInMs / (1000 * 60 * 60 * 24);
    let years = Math.floor(noOfDays / 365);
    let months = Math.floor((noOfDays % 365) / 30);
    let days = Math.floor((noOfDays % 365) % 30);
    let formatMonth = Math.floor(noOfDays / 30);
    let formatYear =
      years == 0
        ? months + " months " + days + " days "
        : years + " years " + months + " months " + days + " days ";
    let returnData = formatYear;
    return returnData;
  }

  componentDidMount() {
    const id = localStorage.getItem("user_id");
    fetch(main_url + `main/getUserInfo/${id}`)
      .then((response) => {
        if (response.ok) return response.json();
        else return null;
      })
      .then((res) => this.setState({ userInfo: res[0] }));
  }

  render() {
    
    return (
      <div>
        {this.state.userInfo != undefined ? (
          <div
            style={{
              // height: 120,
              display: "flex",
              flexDirection: "row",
              backgroundColor: "white",
              borderRadius: 10,
              flexWrap: "wrap",
              paddingTop: 10
            }}
          >
            <div
              style={{
                width: "10%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                src="assets/img/ic_launcher_foreground.png"
                style={{ width: 80, height: 80, borderRadius: 45 }}
              />
            </div>
            <div style={{ width: "17%" }}>
              <h4 style={{ color: primary }}>{this.state.userInfo.fullname}</h4>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Gender</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={styles.profileRightText}>
                  {this.state.userInfo.gender}
                </p>
              </div>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Date of Birth</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={styles.profileRightText}>
                  {this.state.userInfo.date_of_birth}
                </p>
              </div>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>NRC</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={styles.profileRightText}>{this.state.userInfo.nrc}</p>
              </div>
            </div>
            <div style={{ width: "0.5%", marginRight: 5 }}>
              <div
                style={{
                  width: 1,
                  height: 50,
                  backgroundColor: "gray",
                  marginTop: 30,
                }}
              />
            </div>

            <div style={{ width: "17%" }}>
              <h4 style={{ color: primary }}>
                {this.state.userInfo.designations}
              </h4>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Employed Date</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={styles.profileRightText}>
                  {this.state.userInfo.employ_date}
                </p>
              </div>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Branch</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={styles.profileRightText}>
                  {this.state.userInfo.branch_name}
                </p>
              </div>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Service Year</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={styles.profileRightText}>
                  {this.calcDate(
                    new Date(),
                    new Date(this.state.userInfo.employ_date)
                  )}
                </p>
              </div>
            </div>
            <div style={{ width: "0.5%", marginRight: 5 }}>
              <div
                style={{
                  width: 1,
                  height: 50,
                  backgroundColor: "gray",
                  marginTop: 30,
                }}
              />
            </div>
            <div style={{ width: "17%" }}>
              <h4 style={{ color: primary }}>
                Staff ID: {this.state.userInfo.employment_id}
              </h4>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Promotion Date</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={styles.profileRightText}>
                  {this.state.userInfo.last_promotion_date == null
                    ? "-"
                    : this.state.userInfo.last_promotion_date}
                </p>
              </div>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Martial Status</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={styles.profileRightText}>
                  {this.state.userInfo.maratial_status}
                </p>
              </div>
              {
                this.state.userInfo.maratial_status !="unmarried" || this.state.userInfo.maratial_status !="single" ? <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Child Count</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={styles.profileRightText}>
                  {this.state.userInfo.child_count}
                </p>
              </div>:null
              }
            </div>
            <div style={{ width: "0.5%", marginRight: 5 }}>
              <div
                style={{
                  width: 1,
                  height: 50,
                  backgroundColor: "gray",
                  marginTop: 30,
                }}
              />
            </div>
            <div style={{ width: "17%" }}>
              <h4 style={{ color: "transparent" }}>hahahahaha</h4>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Parent Count</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={styles.profileRightText}>
                  {this.state.userInfo.parent_count}
                </p>
              </div>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Bank Account</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={styles.profileRightText}>
                  {this.state.userInfo.bank}
                </p>
              </div>
            </div>
            <div
              style={{
                width: "17%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 60,
                  borderRadius: 5,
                  backgroundColor: primary,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={() => this.props.onClickFixAssetList(this.state.userInfo.user_id)}
              >
                <i
                  style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
                  className="fa fa-file-text-o"
                  aria-hidden="true"
                ></i>
                <p style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
                  Fixed Asset List
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default withRouter(Profile);

const styles = {
  smallContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  profileLeftText: {
    width: "40%",
    color: primary,
    fontSize: 10,
  },
  profileMiddleText: {
    width: "3%",
    color: primary,
    fontSize: 10,
  },
  profileRightText: {
    width: "57%",
    color: primary,
    fontSize: 10,
    display: "flex",
    alignSelf: "flex-start",
  },
};
