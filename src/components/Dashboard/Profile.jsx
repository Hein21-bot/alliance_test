import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { NonceProvider } from "react-select/dist/react-select.cjs.prod";
import { main_url ,imageError} from "../../utils/CommonFunction";
const primary = "#1872ab";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userInfo: null,
      // avatar:"",
      // userPhoto:"",
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

 async componentDidMount() {
    const id = localStorage.getItem("user_id");
     fetch(main_url + `main/getUserInfo/${id}`)
      .then((response) => {
        if (response.ok) return response.json();
        else return null;
      })
      .then((res) => {this.setState({ 
        userInfo: res[0],
        });
        //  this.getProfile() 
        });     
  }
  // getProfile(){
  //   fetch(main_url + `dashboard/getProfile`)
  // .then((response) => {
  //   if (response.ok){
  //     this.setState({
  //       userPhoto:response
  //     })
  //   }
  //   else{
  //     this.setState({
  //       userPhoto:'/assets/img/SeekPng.com_profile-icon-png_9665493.png'
  //     })
  //   } ;
  // })
  // }

  render() { 
    const btn = {
      // backgroundColor:this.state.tapButtonTitle == "title" ? "green" : "blue",
     
        width: 100,
        height: 60,
        borderRadius: 5,
        border:"none",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    };
    return (
      <div>
        {this.state.userInfo != undefined ? (
          <div
          className="col-lg-12 col-md-12 col-sm-12"
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
            <div className="col-lg-1 col-md-1 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center", 
                
                
              }}
            >
              <img
               onError={imageError}
               src={this.state.userInfo.avatar ? main_url + `dashboard/getProfile/`+  this.state.userInfo.avatar : 'assets/img/SeekPng.com_profile-icon-png_9665493.png'}
                style={{ width: 90, height: 90, borderRadius: 45,objectFit:"cover",border:"5px solid #23c6c8" }}
              />
            </div>
            <div className="col-lg-10 col-md-10 col-sm-12" style={{display: 'flex', flexWrap: 'wrap'}}>
            <div style={{width: 200 , display: 'flex', flexDirection: 'row'}}>
            
              <div style={{ width: '95%'}}>
              <h4 style={{ color: primary }}>{this.state.userInfo.fullname}</h4>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Gender</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={this.state.userInfo.gender.length > 15 ? styles.profileRightTextSmall : styles.profileRightText}>
                  {this.state.userInfo.gender}
                </p>
              </div>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Date of Birth</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={this.state.userInfo.date_of_birth.length > 15 ? styles.profileRightTextSmall : styles.profileRightText}>
                  {this.state.userInfo.date_of_birth}
                </p>
              </div>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>NRC</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={this.state.userInfo.nrc.length > 15 ? styles.profileRightTextSmall : styles.profileRightText}>{this.state.userInfo.nrc}</p>
              </div></div>
              <div style={{ width: '5%' }}>
              <div
                style={{
                  width: 1,
                  height: 50,
                  backgroundColor: "gray",
                  marginTop: 30,
                }}
              />
            </div>
            </div>
           

            <div style={{width: 200, display: 'flex', flexDirection: 'row'}} >
            <div  style={{ width: '95%'}}>
              <h4 style={{ color: primary }}>
                {this.state.userInfo.designations}
              </h4>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Employed Date</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={this.state.userInfo.employ_date.length > 15 ? styles.profileRightTextSmall : styles.profileRightText}>
                  {this.state.userInfo.employ_date}
                </p>
              </div>
              <div style={styles.smallContainer}>
                <p style={styles.profileLeftText}>Branch</p>
                <p style={styles.profileMiddleText}>:</p>
                <p style={this.state.userInfo.branch_name.length > 15 ? styles.profileRightTextSmall : styles.profileRightText}>
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
              </div></div>
              <div style={{ width: '5%' }}>
              <div
                style={{
                  width: 1,
                  height: 50,
                  backgroundColor: "gray",
                  marginTop: 30,
                }}
              />
            </div>
            </div>
            
            <div style={{width: 200, display: 'flex', flexDirection: 'row'}}>
            <div style={{ width: '95%'}}>
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
                <p style={this.state.userInfo.maratial_status.length > 15 ? styles.profileRightTextSmall : styles.profileRightText}>
                  {this.state.userInfo.maratial_status}
                </p>
              </div>
              {
                this.state.userInfo.maratial_status == "unmarried" || this.state.userInfo.maratial_status == "Single" ? null : <div style={styles.smallContainer}>
                  <p style={styles.profileLeftText}>Child Count</p>
                  <p style={styles.profileMiddleText}>:</p>
                  <p style={styles.profileRightText}>
                    {this.state.userInfo.child_count}
                  </p>
                </div> 
              }
            </div>
            <div style={{  width: '5%'  }}>
              <div
                style={{
                  width: 1,
                  height: 50,
                  backgroundColor: "gray",
                  marginTop: 30,
                }}
              />
            </div>
            </div>
            <div style={{width: 200}}>
            <div style={{  width: '100%'}}>
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
                <p style={this.state.userInfo.bank.length > 15 ? styles.profileRightTextSmall : styles.profileRightText}>
                  {this.state.userInfo.bank}
                </p>
              </div>
            </div>
            </div>
            </div>
            <div className="col-lg-1 col-md-1 col-sm-12"
              style={{
             
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <button className="button" style={{...btn,backgroundColor: this.props.tapButtonTitle == "active" ? '#23c6c8' : "#1872ab",
              }} onClick={() => this.props.onClickFixAssetList(this.state.userInfo.user_id, "active")}> <i
                style={{ fontSize: 20, color: "white", fontWeight: "bold" }}
                className="fa fa-file-text-o"
                aria-hidden="true"
              ></i>
                <p style={{ color: "white", fontSize: 10, fontWeight: "bold" }}>
                  Fixed Asset List
                </p></button>
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
    // backgroundColor: 'red',
  },
  profileLeftText: {
    width: "40%",
    color: primary,
    fontSize: 11,
  },
  profileMiddleText: {
    width: "3%",
    color: primary,
    fontSize: 11,
  },
  profileRightText: {
    width: "57%",
    color: primary,
    fontSize: 11,
    display: "flex",
    alignSelf: "flex-start",
  },
  profileRightTextSmall: {
    width: "57%",
    color: primary,
    fontSize: 9,
    display: "flex",
    alignSelf: "flex-start",
    marginTop: 2
  },
  leftProfileText: {
    width: "50%",
    color: primary,
    fontSize: 12,
  },
  middleProfileText: {
    width: "3%",
    color: primary,
    fontSize: 12,
  },
  rightProfileText: {
    width: "47%",
    color: primary,
    fontSize: 12,
    display: "flex",
    alignSelf: "flex-start",
  },
  leftprofileText: {
    width: "40%",
    color: primary,
    fontSize: 12,
  },
  middleprofileText: {
    width: "3%",
    color: primary,
    fontSize: 12,
  },
  rightprofileText: {
    width: "57%",
    color: primary,
    fontSize: 12,
    display: "flex",
    alignSelf: "flex-start",
  },
};
