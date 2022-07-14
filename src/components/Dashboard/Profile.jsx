import React, { Component } from "react";
import { withRouter } from "react-router-dom";
const primary = "#1872ab";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        style={{
          // height: 120,
          display: "flex",
          flexDirection: "row",
          backgroundColor: "white",
          borderRadius: 10,
          flexWrap: "wrap",
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
            src="https://bukovskevrchy.pl/img/64c9c78b19101eadf6e459ddbb0fd69a.jpg"
            style={{ width: 80, height: 80, borderRadius: 45 }}
          />
        </div>
        <div style={{ width: "17%" }}>
          <h4 style={{ color: primary }}>May Choon Htike</h4>
          <div style={styles.smallContainer}>
            <p style={styles.profileLeftText}>Gender</p>
            <p style={styles.profileMiddleText}>-</p>
            <p style={styles.profileRightText}>Female</p>
          </div>
          <div style={styles.smallContainer}>
            <p style={styles.profileLeftText}>Date of Birth</p>
            <p style={styles.profileMiddleText}>-</p>
            <p style={styles.profileRightText}>12-12-1980</p>
          </div>
          <div style={styles.smallContainer}>
            <p style={styles.profileLeftText}>NRC</p>
            <p style={styles.profileMiddleText}>-</p>
            <p style={styles.profileRightText}>9/XXX(N)XXXXXX</p>
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
          <h4 style={{ color: primary }}>IT Officer</h4>
          <div style={styles.smallContainer}>
            <p style={styles.profileLeftText}>Employed Date</p>
            <p style={styles.profileMiddleText}>-</p>
            <p style={styles.profileRightText}>22-06-2018</p>
          </div>
          <div style={styles.smallContainer}>
            <p style={styles.profileLeftText}>Branch</p>
            <p style={styles.profileMiddleText}>-</p>
            <p style={styles.profileRightText}>Head Office</p>
          </div>
          <div style={styles.smallContainer}>
            <p style={styles.profileLeftText}>Service Year</p>
            <p style={styles.profileMiddleText}>-</p>
            <p style={styles.profileRightText}>4 years</p>
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
          <h4 style={{ color: primary }}>Staff ID: A-000001</h4>
          <div style={styles.smallContainer}>
            <p style={styles.profileLeftText}>Promotion Date</p>
            <p style={styles.profileMiddleText}>-</p>
            <p style={styles.profileRightText}>12-07-2021</p>
          </div>
          <div style={styles.smallContainer}>
            <p style={styles.profileLeftText}>Martial Status</p>
            <p style={styles.profileMiddleText}>-</p>
            <p style={styles.profileRightText}></p>
          </div>
          <div style={styles.smallContainer}>
            <p style={styles.profileLeftText}>Child Count</p>
            <p style={styles.profileMiddleText}>-</p>
            <p style={styles.profileRightText}></p>
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
          <h4 style={{ color: "transparent" }}>hahahahaha</h4>
          <div style={styles.smallContainer}>
            <p style={styles.profileLeftText}>Parent Count</p>
            <p style={styles.profileMiddleText}>-</p>
            <p style={styles.profileRightText}>2</p>
          </div>
          <div style={{ width: "100%" }}>
            <p style={styles.profileLeftText}>Bank Account</p>
            {/* <p style={styles.profileMiddleText}>-</p> */}
            <p style={styles.profileRightText}>XXXXXXXXXXXXXXXXXXXXXXXX</p>
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
