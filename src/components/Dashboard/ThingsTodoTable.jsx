import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { thingsToDoController } from "./DashboardApi/ThingsToDoController";
const primary = "#1872ab";

class ThingsTodoTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      birthdayCount: 0,
      childCount: 0,
      externalCount: 0,
      leaveCount: 0,
      medicalCount: 0,
      salaryCount: 0,
      travelCount: 0,
      weddingCount: 0
    };
  }

  componentDidMount() {
    const id = localStorage.getItem("user_id");
    thingsToDoController.getBirthdayRequest(id, (data) => {
      this.setState({birthdayCount: data[0].count})
    });
    thingsToDoController.getChildRequest(id, (data) => {
      this.setState({childCount: data[0].count})
    });
    thingsToDoController.getExternalRequest(id, (data) => {
      this.setState({externalCount: data[0].count})
    });
    thingsToDoController.getLeaveRequest(id, data => {
      this.setState({leaveCount: data[0].count})
    });
    thingsToDoController.getMedicalRequest(id, data => {
      this.setState({medicalCount: data[0].count})
    });
    thingsToDoController.getSalaryRequest(id, data => {
      this.setState({salaryCount: data[0].count})
    });
    thingsToDoController.getTravelRequest(id, data => {
      this.setState({travelCount: data[0].count})
    });
    thingsToDoController.getWeddingRequest(id, data => {
      this.setState({weddingCount: data[0].count})
    })
  }

  

  render() {

    var dummy_data = [
      { request: "Leave Request", count: this.state.leaveCount, link: "/leave_management" },
      { request: "Travel Request", count: this.state.travelCount, link: "/travelRequest" },
      { request: "Medical Request", count: this.state.medicalCount, link: "/medical_benefit" },
      {
        request: "External Traning Request",
        count: this.state.externalCount,
        link: "/external_training_benefit",
      },
      { request: "Wedding Request", count: this.state.weddingCount, link: "/wedding_benefit" },
      { request: "Child Request", count: this.state.childCount, link: "/child_benefit" },
      { request: "Salary Advance Request", count: this.state.salaryCount, link: "/salary_advance" },
      { request: "Phone Bill Request", count: 0, link: "/phonebillrequest" },
      { request: "Petrol Request", count: 0, link: "/petrolRequest" },
      { request: "Bithday Fund Request", count: this.state.birthdayCount, link: "/birthday_fund_benefit" },
    ];
    return (
      <div
        className="col-md-12"
        style={{
          // height: 645,
          background: "#fff",
          color: "#222",
          WebkitBoxShadow: '0px 0px 3px 0px rgba(194,194,194,1)',
                    boxShadow: '0px 0px 3px 0px rgba(194,194,194,1)',
                    borderRadius: '0px 20px 20px 20px',
          padding: "2px 0px 2px 0px",
          margin: "5px 0px",
        }}
      >
        <div className="" style={{ margin: "10px 15px 0px", display: "flex" }}>
          {/* <i
            style={{ fontSize: 22, color: "#1872ab", fontWeight: "bold" }}
            className="fa fa-file-text-o"
            aria-hidden="true"
          ></i> */}
          <h3 style={{ paddingLeft: 8, color: primary, fontWeight: 'bolder' }}>Things To Do</h3>
        </div>
        <div
          className="col-12"
          style={{ maxHeight: 600, overflowY: "scroll"}}
        >
          {dummy_data.map((v, k) => (
            <>
              {
                v.count != 0? <>
                      <div
                key={k}
                className=""
                style={{
                  // boxShadow: "1px 1px 3px 1px #e6e6e6",
                  // borderRadius: 4,
                  margin: "11px 0px",
                  // padding: "0px",
                  display: "flex",
                }}
              >

                <div className="col-lg-1 col-md-2 col-sm-2">
                  <div
                    style={{
                      border: "1px solid #1872ab",
                      borderRadius: 5,
                      width: 25,
                      height: 25,
                      // display: 'flex',
                      // justifyContent: 'center',
                      // alignItems: 'center'
                    }}
                  >
                    <p
                      style={{
                        fontSize: 11,
                        color: primary,
                        textAlign: "center",
                        marginTop: "3px",
                      }}
                    >
                      {v.count}
                      
                    </p>
                  </div>
                </div>
                <div className="col-lg-7 col-md-7 col-sm-7" style={{ color: primary, fontSize: 11, marginTop: 5 }}>
                  {v.request}
                </div>
                <div className="col-lg-4 col-md-3 col-sm-3">
                  <button
                    className="btn text-center"
                    onClick={() => this.props.history.push(v.link)}
                    style={{
                      height: 22,
                      padding: "0px 5px 0px 5px",
                      fontSize: 10,
                    }}
                  >
                    More Info
                    <i
                      class="fa fa-arrow-circle-right"
                      style={{ marginLeft: 5 }}
                      aria-hidden="true"
                    ></i>
                  </button>
                </div>
              </div>
              {k != dummy_data.length - 1 && <div style={{width: '95%', height: "0.5px", backgroundColor: 'black', margin: '0px auto'}}/>}
                </> :""
              }
              
              
            </>
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(ThingsTodoTable);


