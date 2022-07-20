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

  //   NRC_District_code: null
  // NRC_District_code_guarantee: null
  // NRC_SD_code: null
  // NRC_SD_code_guarantee: null
  // NRC_full: null
  // NRC_full_gurantee: null
  // NRC_no: null
  // NRC_no_guarantee: null
  // SSC_card_no: null
  // account_details_id: "17"
  // additional_jd: ""
  // address: ""
  // attachment_link: null
  // avatar: null
  // black_list: 0
  // black_reason: ""
  // blood_group: ""
  // branch_id: "1"
  // branch_name: "Head Office"
  // career_level_id: 22
  // career_sub_level: "Level 6 B"
  // child_count: 0
  // city: "Mandalay"
  // company: "-"
  // contact_detail: null
  // contact_person: ""
  // contact_person_phone: ""
  // contact_phone: null
  // country: "Myanmar"
  // customer_code: null
  // date_of_birth: "1988-08-04"
  // degree: null
  // designation: null
  // designations: "HR Manager"
  // designations_id: 53
  // discontinued: 0
  // discontinued_date: null
  // discontinued_status: null
  // dob: "1988-08-04"
  // ec_location: 0
  // ec_renewal_date: null
  // employ_date: "2015-08-01"
  // employed_days: 0
  // employed_month: 0
  // employed_year: 0
  // employee_code: null
  // employee_date: null
  // employee_name: null
  // employee_name_eng: null
  // employee_name_myn: null
  // employee_status: null
  // employment_id: "A-00036                                                                                                                                                                                                 "
  // father_name: "U Myint Thein"
  // from_month_year: null
  // fullname: "Ohnmar Thein"
  // gender: "female"
  // guarantee_person: null
  // gurantee_person: ""
  // gurantee_person_phone: ""
  // job_title: null
  // joining_date: "2015-08-01"
  // language: "english"
  // last_promotion_date: null
  // life_insurance: 0
  // locale: "my_MM"
  // location: null
  // maratial_status: "married"
  // marital_status: null
  // mobile: "9969777297"
  // mother_name: "-"
  // nationality: null
  // nrc: "9/MaHtaLa(N)232834"
  // office_phone: null
  // organization_name: null
  // parent_count: 0
  // parent_in_law_count: 0
  // part_time_code: null
  // period: null
  // permanent_address: "40th Bet 71&72"
  // personal_phone: null
  // phone: "9969777297"
  // present_address: ""
  // profile_photo: null
  // qualification: "B.Sc (Maths)"
  // race: ""
  // religion: "Buddhist"
  // remark: ""
  // role_id: 1
  // same_with_contact_person: null
  // sibling_count: 0
  // skype: ""
  // thapyay_account: ""
  // to_month_year: null
  // training_code: "                    "
  // user_id: 17
  // work_experience: "1. Account (Beauty Palace Co.,Ltd)

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
                src="https://bukovskevrchy.pl/img/64c9c78b19101eadf6e459ddbb0fd69a.jpg"
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
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Child Count</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={styles.profileRightText}>
                  {this.state.userInfo.child_count}
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
              <h4 style={{ color: "transparent" }}>hahahahaha</h4>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Parent Count</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={styles.profileRightText}>
                  {this.state.userInfo.parent_count}
                </p>
              </div>
              <div style={{ width: "100%" }}>
                <p style={styles.profileLeftText}>Bank Account</p>
                <p style={styles.profileRightText}>{"-"}</p>
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
