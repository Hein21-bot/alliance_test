import React, { Component } from "react";
import ReactDatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getDate, format } from "date-fns";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datetime";
import { getFirstDayOfMonth, getLastDayOfMonth, getUserInfo, main_url } from "../../utils/CommonFunction";
import moment from "moment";
const primary = "#1872ab";

// const data = [
//   {
//     date: "05-03-2022",
//     leave_count: 4,
//     employees: ["Dave", "Josh", "Mary", "Joh"],
//   },
//   { date: "05-19-2022", leave_count: 2, employees: ["Scarlet", "Peter"] },
//   { date: "05-22-2022", leave_count: 2, employees: ["West", "Nancy"] },
// ];

export default class LeaveCalendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: new Date(),
      toDate: new Date(),
      fromDate: getFirstDayOfMonth(),
      modalData: {},
      data: [],
      calendar: null,
      userInfo: null
    };
  }

  async componentDidMount() {
    await this.getLeaveCalendar('myCalendar', new Date());
    await this.setState({ calendar: 'myCalendar' })
    this.setState({ userInfo: await getUserInfo(localStorage.getItem("user_id")) })
  }

  getLeaveCalendar = (title, date) => {
    let start_date = date == undefined ? moment(this.state.fromDate).format('YYYY-MM-DD') : moment(date).format('YYYY-MM') + '-01'
    let end_date = date == undefined ? moment(this.state.toDate).format('YYYY-MM-DD') : moment(date).format('YYYY-MM') + `-${getLastDayOfMonth(moment(date).format('YYYY'), moment(date).format('MM') - 1)}`
    const id = localStorage.getItem('user_id');
    if (title == 'myCalendar') {
      fetch(main_url + `dashboard/leaveMyCalendar/${id}/${start_date}/${end_date}`).then(response => {
        return response.json();
      }).then(res => {
        let data=res.map(v=>{
          v.Date=v.Date.split("-").reverse().join("-");
          return v
        })

        let filterData=data.filter(v=> new Date(v.Date).getDay() !== 6 && new Date(v.Date).getDay() !== 0)
        console.log("filter data",filterData)
        this.setState({ data: filterData })
      }).catch(err => {
        console.log('error ===>', err);
      })
      this.setState({
        calendar: title,
        fromDate: start_date,
        toDate: end_date
      })
    } else if (title == 'teamCalendar') {
      let branch = this.state.userInfo && this.state.userInfo[0].branch_id
      let department = this.state.userInfo && this.state.userInfo[0].departments_id
      fetch(main_url + `dashboard/leaveTeamCalendar/${parseInt(branch)}/${parseInt(department)}/${start_date}/${end_date}`).then(response => {
        return response.json();
      }).then(res => {
        this.setState({ data: res })
      }).catch(err => {
        console.log('error ===>', err);
      })
      this.setState({
        calendar: title,
        fromDate: start_date,
        toDate: end_date
      })
    } else if (title == 'allCalendar') {
      fetch(main_url + `dashboard/leaveAllCalendar/${start_date}/${end_date}`).then(response => {
        return response.json();
      }).then(res => {
        this.setState({ data: res })
      }).catch(err => {
        console.log('error ===>', err);
      })
      this.setState({
        calendar: title,
        fromDate: start_date,
        toDate: end_date
      })
    }
  }


  setModalData = (data) => {
    if (data.length > 0) {
      this.setState({ modalData: data[0] });
    }
  };

  renderDayContents = (day, date) => {
    console.log("render data",this.state.data)
    const highlight = this.state.data.filter(
      (v) =>
         v.Date === moment(date).format('YYYY-MM-DD') || v.Date === moment(date).format('DD-MM-YYYY')
    );
    console.log("hightlight",highlight)
    const tooltipText = `<div style="color:red">Tooltip for date: ${date}</div>`;
    return (
      <>
        <div
          onClick={() => this.setModalData(highlight)}
          data-toggle={highlight.length > 0 && "modal"}
          data-target={highlight.length > 0 && "#leave-detail-modal1"}
          style={{
            border: highlight.length > 0 && "1px solid red",
            padding: "0px 2px",
            borderRadius: 50,
            minWidth: 29,
            minHeight: 29,
            paddingTop: 5,
            width: 29,
            height: 29,
          }}
        >
          {getDate(date)}
        </div>
        {highlight.length > 0 && (
          <span
            className="white-bg"
            style={{
              fontSize: 12,
              color: "red",
              position: "relative",
              top: -35,
              left: 8,
              fontWeight: "bold",
              borderRadius: "15px",
            }}
          >
            {highlight[0].leave_count}
          </span>
        )}
      </>
    );
  };

  render() {
    const { modalData } = this.state;
    const MyContainer = ({ className, children }) => {
      return (
        <div style={{ color: "#fff", fontSize: 14, width: "100%" }}>
          <CalendarContainer className={className} style={{ width: "100%" }}>
            <div style={{ position: "relative", fontSize: 14 }}>{children}</div>
          </CalendarContainer>
        </div>
      );
    };
    return (
      <div
      className='row col-lg-12 col-md-12 col-sm-12' 
      style={{
          background: '#fff',
          color: '#222',
          WebkitBoxShadow: '0px 0px 3px 0px rgba(194,194,194,1)',
          boxShadow: '0px 0px 3px 0px rgba(194,194,194,1)',
          borderRadius: '0px 0px 20px 20px',
         marginTop:"10px"
      }}
      >
        <h3
          style={{
            marginLeft: "13px",
            color: primary,
            fontWeight: "bolder",
          }}
        >
          Leave Calendar
        </h3>
        <div
          className="modal fade"
          id="leave-detail-modal1"
          role="dialog"
          aria-labelledby="exampleModalLabel1"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            style={{ width: 200, float: "right", height: 300 }}
          >
            {Object.keys(modalData).length > 0 && (
              <div className="modal-content">
                <div className="modal-header" style={{ padding: 5 }}>
                  <h5
                    className="modal-title"
                    id="exampleModalLabel1"
                    style={{ textAlign: "center" }}
                  >
                    {modalData.Date}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                    style={{ marginTop: "-20px" }}
                  >
                    <span aria-hidden="true" style={{}}>
                      &times;
                    </span>
                  </button>
                </div>
                <div className="modal-body " style={{ padding: "5px" }}>
                  <ul style={{ margin: "4px 0px" }}>
                    {modalData.employees.map((v, k) => (
                      <li key={k}>{v}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* <div className=" " style={{margin:'20px'}}> */}
        <div className="col-md-7 col-lg-7 col-sm-7">
          <div
            className="col-lg-12 col-md-12 col-sm-12"
            style={{ marginTop: "10px" }}
          >
            <div style={{ display: "flex" }}>
              <input
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                onChange={() => this.getLeaveCalendar('teamCalendar')}
                checked={this.state.calendar == 'teamCalendar'}
              ></input>
              <p
                class="form-check-label"
                for="flexRadioDefault1"
                style={{
                  marginLeft: "15px",
                  display: "inline-block",
                  color: "#1872ab",
                  fontSize: "14px",
                }}
              >
                Team
              </p>
            </div>
            <div style={{ display: "flex" }}>
              <input
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault2"
                onChange={() => this.getLeaveCalendar('allCalendar')}
                checked={this.state.calendar == 'allCalendar'}
              ></input>
              <p
                class="form-check-label"
                for="flexRadioDefault2"
                style={{
                  marginLeft: "15px",
                  display: "inline-block",
                  color: "#1872ab",
                }}
              >
                All
              </p>
            </div>
            <div style={{ display: "flex" }}>
              <input
                type="radio"
                name="flexRadioDefault"
                onChange={() => this.getLeaveCalendar('myCalendar')}
                checked={this.state.calendar == 'myCalendar'}
              ></input>
              <p
                className="form-check-label"
                style={{
                  marginLeft: "15px",
                  display: "inline-block",
                  color: "#1872ab",
                }}
              >
                My Calender
              </p>
            </div>
          </div>
          <div
            className="col-lg-12 col-md-12 col-sm-12"
            style={{ display: "flex", marginTop: 10 }}
          >
            <div>
              <i
                class="fa fa-calendar fa-2x"
                aria-hidden="true"
                style={{ marginRight: "10px", color: "#1872ab" }}
              ></i>
            </div>

            <div
              style={{
                position: "relative",
              }}
            >
              <div
                style={{
                  position: "absolute",
                }}
              >
                <DatePicker
                  className="leavedatepicker"
                  dateFormat="DD/MM/YYYY"
                  value={this.state.s_date}
                  onChange={this.handleStartDate}
                  timeFormat={false}
                ></DatePicker>
                <i
                  class="fa fa-search fa-1.5x"
                  aria-hidden="true"
                  style={{
                    color: "#1872ab",
                    position: "absolute",
                    right: "20px",
                    top: "10px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div bu9 className="col-md-5 col-lg-5 col-sm-5" id={'leave_calendar'}>
          <ReactDatePicker
            selected={this.state.startDate}
            onChange={(date) => this.setState({ startDate: date })}
            renderDayContents={this.renderDayContents}
            inline
            calendarClassName="custom-datePicker"
            style={{ width: "50%" }}
            calendarContainer={MyContainer}
            formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
            onMonthChange={(v) => this.getLeaveCalendar(this.state.calendar, v)}
          />
        </div>

        {/* </div> */}
      </div>
    );
  }
}
