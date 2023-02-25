import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { getUserId } from "../../utils/CommonFunction";
import { thingsToDoController } from "./DashboardApi/ThingsToDoController";
const primary = "#1872ab";

// const id = getUserId("user_info");
class ThingsTodoTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: localStorage.getItem("user_id"),
      birthdayCount: 0,
      childCount: 0,
      externalCount: 0,
      leaveCount: 0,
      medicalCount: 0,
      salaryCount: 0,
      travelCount: 0,
      weddingCount: 0,
      confirmationCount: 0,
      staffComplainCount: 0,
      funeralCount: 0,
      teamBuildingCount: 0,
      hospitalCount: 0,
      cycleCount: 0,
      otherCount: 0,
      trainingCount: 0,
      phoneCount: 0,
      petrolCount: 0,
      helpDeskCount: 0,
      attResCount: 0,
      holidayAttResCount: 0,
      staffLoanCount:0
    };
  }

  async componentDidMount() {
    const id =  localStorage.getItem("user_id");
    await thingsToDoController.getBirthdayRequest(id, (data) => {
      this.setState({ birthdayCount: data.count })
    });
    await thingsToDoController.getChildRequest(id, (data) => {
      this.setState({ childCount: data.count })
    });
    await thingsToDoController.getExternalRequest(id, (data) => {
      this.setState({ externalCount: data.count })
    });
    await thingsToDoController.getLeaveRequest(id, data => {
      this.setState({ leaveCount: data.count })
    });
    await thingsToDoController.getMedicalRequest(id, data => {
      this.setState({ medicalCount: data.count })
    });
    await thingsToDoController.getSalaryRequest(id, data => {
      this.setState({ salaryCount: data.count })
    });
    await thingsToDoController.getTravelRequest(id, data => {
      this.setState({ travelCount: data.count })
    });
    await thingsToDoController.getWeddingRequest(id, data => {
      this.setState({ weddingCount: data.count })
    });
    await thingsToDoController.getConfirmationRequest(id, data => {
      this.setState({ confirmationCount: data.count })
    })
    await thingsToDoController.getFuneralRequest(id, data => {
      this.setState({ funeralCount: data.count })
    })
    await thingsToDoController.getTeamBulidingRequest(id, data => {
      this.setState({ teamBuildingCount: data.count })
    })
    await thingsToDoController.getHospitalRequest(id, data => {
      this.setState({ hospitalCount: data.count })
    })
    await thingsToDoController.getCycleRequest(id, data => {
      this.setState({ cycleCount: data.count })
    })
    await thingsToDoController.getOtherRequest(id, data => {
      this.setState({ otherCount: data.count })
    })
    await thingsToDoController.getTrainingRequest(id, data => {
      this.setState({ trainingCount: data.count })
    })
    // await thingsToDoController.getPhoneRequest(id, data => {
    //   this.setState({ phoneCount: data[0].count })
    // })
    // await thingsToDoController.getPetrolRequest(id, data => {
    //   this.setState({ petrolCount: data[0].count })
    // })
    await thingsToDoController.getStaffComplainRequest(id, data => {
      this.setState({ staffComplainCount: data[0].count })
    })
    await thingsToDoController.getHelpDeskRequest(id, data => {
      // console.log('helpdesk count ===>', data)
      this.setState({ helpDeskCount: data[0].count })
    })
    await thingsToDoController.getAttRequest(id, data => {
      this.setState({ attResCount: data.count })
    })
    await thingsToDoController.getHolidayAttRequest(id, data => {
      this.setState({ holidayAttResCount: data.count })
    })
    await thingsToDoController.getStaffLoanRequest(id, data => {
      this.setState({staffLoanCount: data.count })
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
      { request: "Phone Bill Request", count: this.state.phoneCount, link: "/phonebillrequest" },
      { request: "Petrol Request", count: this.state.petrolCount, link: "/petrolRequest" },
      { request: "Bithday Fund Request", count: this.state.birthdayCount, link: "/birthday_fund_benefit" },

      { request: "Confirmation Request", count: this.state.confirmationCount, link: "/confirmation_check" },
      { request: "TeamBuilding Request", count: this.state.teamBuildingCount, link: "/team_building_benefit" },
      { request: "Cycle Request", count: this.state.cycleCount, link: "/cycle_insurance_benefit" },
      { request: "Hospital Request", count: this.state.hospitalCount, link: "/hospitalization_benefit" },
      { request: "Funeral Request", count: this.state.funeralCount, link: "/funeral_benefit" },
      { request: "Other Request", count: this.state.otherCount, link: "/other_benefit" },
      { request: "Training Request", count: this.state.trainingCount, link: "/trainingRequest" },
      { request: "Staff Complain Box", count: this.state.staffComplainCount, link: "/staffComplain" },
      { request: "Help Desk Request", count: this.state.helpDeskCount, link: "/helpDesk" },
      { request: "Attendance Request", count: this.state.attResCount, link: "/attendance_type" },
      { request: "Holiday Attendance", count: this.state.holidayAttResCount, link: "/holiday_attendance" },
      { request: "Staff Loan", count: this.state.staffLoanCount, link: "/staff_loan" },

    ];

    let data_filter = this.state.user_id == 17 || this.state.user_id == 921 ? dummy_data.filter(a => a.count != 0) : dummy_data.filter(v => v.request != 'Staff Complain Box' && v.count != 0)
    // let data_filter = dummy_data

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
          style={{ maxHeight: 600, overflowY: "scroll" }}
        >
          {data_filter.map((v, k) => (
            <>
              {
                v.count != 0 ? <>
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
                            fontSize: 13,
                            fontWeight: "bold",
                            color: primary,
                            textAlign: "center",
                            marginTop: "3px",
                          }}
                        >
                          {v.count}

                        </p>
                      </div>
                    </div>
                    <div className="col-lg-7 col-md-7 col-sm-7" style={{ color: primary, fontSize: 12, marginTop: 5,fontWeight:"bold" }}>
                      {v.request}
                    </div>
                    <div className="col-lg-3 col-md-3 col-sm-3" style={{display:"flex",justifyContent:"end"}}>
                      <button
                        className="btn text-center"
                        onClick={() => this.props.history.push(v.link)}
                        style={{
                          height: 22,
                          padding: "0px 5px 0px 5px",
                          backgroundColor:"#ffff"
                        }}
                      > 
                          <i
                           class="fa fa-angle-right fa-1.5x" 
                          style={{ marginLeft: 5,color:""}}
                          aria-hidden="true"
                        >    </i>
                      </button>
                    </div>
                  </div>
                  {k != data_filter.length - 1 && <div style={{ width: '95%', height: "0.5px", backgroundColor: 'black', margin: '0px auto' }} />}
                </> : ""
              }


            </>
          ))}
        </div>
      </div>
    );
  }
}

export default withRouter(ThingsTodoTable);


