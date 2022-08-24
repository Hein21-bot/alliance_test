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
import AttendenceBarChart from "./AttendenceBarChart";
import LeaveCalendar from "./LeaveCalendar"
import ResignBarChart from "./ResignBarChart";
import CompensationandBenefit from "./CompensationandBenefit";

const primary = "#1872ab";
var button = document.querySelector('.button');


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

    const btn = {
      // backgroundColor:this.state.tapButtonTitle == "title" ? "green" : "blue",
      color: "white",
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 5,
      paddingBottom: 5,
      borderRadius: 5,
      borderColor: "transparent"
     
    };
    return (
      <div>
        {/* <h3>Dashboard</h3> */}
        {/* <LeaveCalendar /> */}
        <div className=""
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            flexWrap: "wrap",
            marginBottom: 15,
          }}
        >
          <button className="button"
          style={{...btn,backgroundColor:this.state.tapButtonTitle == "headCount" ? '#23C6C8' :"#1872ab"}}
          onClick={() => this.tapButtonClick("headCount")} >
            Head Count
          </button>
          <button style={{...btn,backgroundColor:this.state.tapButtonTitle == "attendenceChart" ? '#23c6c8' :"#1872ab"}}
           onClick={() => this.tapButtonClick("attendenceChart")}
          >Attandence</button>
          <button
            style={{...btn,backgroundColor:this.state.tapButtonTitle == "leaveChart" ? '#23c6c8' :"#1872ab"}}
            onClick={() => this.tapButtonClick("leaveChart")}
          >
            Leave
          </button>
          <button
            style={{...btn,backgroundColor:this.state.tapButtonTitle == "totalEmployee" ? '#23c6c8' :"#1872ab"}}
            onClick={() => this.tapButtonClick("totalEmployee")}
          >
            Total Employee
          </button>
          <button
            style={{...btn,backgroundColor:this.state.tapButtonTitle == "expense" ? '#23c6c8' :"#1872ab"}}
            onClick={() => this.tapButtonClick("expense")}
          >
            Expense
          </button>
          <button
            style={{...btn,backgroundColor:this.state.tapButtonTitle == "benefit" ? '#23c6c8' :"#1872ab"}}
            onClick={() => this.tapButtonClick("benefit")}
          >
           Compansation and Benefit
          </button>
          <button style={{...btn,backgroundColor:this.state.tapButtonTitle == "helpdesk" ? '#23c6c8' :"#1872ab"}} onClick={()=>this.tapButtonClick('helpdesk')}>Help Desk</button>
          <button style={{...btn,backgroundColor:this.state.tapButtonTitle == "resign" ? '#23c6c8' :"#1872ab"}}onClick={() => this.tapButtonClick("resign")}
          >Resign</button>
         
        </div>
        <Profile />
        {this.state.tapButtonTitle == "headCount" ? (
          <div className="row mt-4" style={{marginTop: 15,position:"relative",left:"18%"}}>
            <div className="col-md-8 col-lg-8 col-sm-12">
              <HeadCountBarChart title={"department"} />
            </div>
            <div className="col-md-8 col-lg-8 col-sm-12">
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
            <div className="col-lg-10">
              <AttendenceBarChart/>
            </div>
          </div>
        ):this.state.tapButtonTitle == "totalEmployee" ? (
          <div
            className="row mt-4"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15
            }}
          >
            <div className="col-md-8">
              <EmployeePieChart/>
            </div>
          </div>
        ) : this.state.tapButtonTitle == "benefit" ? (
          <div className="row mt-4" style={{
            display:'flex',
            justifyContent:"center",
            alignItems:'center',
            marginTop:"13px"
          }}>
            <div className="col-md-8">
              
              <CompensationandBenefit></CompensationandBenefit>
            </div>
          </div>
        ) : this.state.tapButtonTitle == "expense" ? (
          <div className="row mt-4" style={{
            display:'flex',
            justifyContent:"center",
            alignItems:'center'
          }}>
            <div className="col-md-8">
              
              <BenefitBarChart></BenefitBarChart>
            </div>
          </div>
        ): this.state.tapButtonTitle == "helpdesk" ? (
          <div className="row mt-4">
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
              <HelpDesk></HelpDesk>
            </div>
            <div className="col-xl-6 col-lg-6 col-md-12 col-sm-12">
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
            <div className="row mt-4" style={{marginTop: 15}}>
              <div className="col-md-4 col-lg-4 col-sm-12">
                <ThingsTodoTable />
              </div>
              <div className="col-md-8 col-lg-8 col-sm-12 d-flex column" >
                <AttendanceCaldendar/>
                <LeaveCalendar/>
            </div></div>
          </div>
        )}
      </div>
    );
  }
}


const styles = {
  
  tapButtonStyle: {
    
    // backgroundColor:this.state.color,
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
