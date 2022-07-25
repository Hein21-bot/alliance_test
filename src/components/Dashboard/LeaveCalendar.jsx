import React, { Component } from "react";
import ReactDatePicker, { CalendarContainer } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getDate, format } from "date-fns";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datetime";
import { getFirstDayOfMonth, main_url } from "../../utils/CommonFunction";
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
      toDate:new Date(),
      fromDate:  getFirstDayOfMonth(),
      modalData: {},
      data: [],
    };
  }

  componentDidMount() {
    this.getLeaveCalendar('myCalendar');
  }

  getLeaveCalendar = (title) => {
    const id = localStorage.getItem('user_id');
    if (title == 'myCalendar') {
      fetch(main_url + `dashboard/leaveMyCalendar/${id}/${moment('2021-12-01').format('YYYY-MM-DD')}/${moment('2021-12-31').format('YYYY-MM-DD')}`).then(response => {
        return response.json();
      }).then(res => {
        console.log('response ===>', res)
        this.setState({data: res})
      }).catch(err => {
        console.log('error ===>', err);
      })
    }
    
  }

  setModalData = (data) => {
    if (data.length > 0) {
      this.setState({ modalData: data[0] });
    }
  };

  renderDayContents = (day, date) => {
    const highlight = this.state.data.filter(
      (v) =>
        v.Date === moment(date).format("DD-MM-YYYY")
    );
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
    console.log("leave ModalData ===>", modalData);
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
        className="row col-lg-12 col-md-12 col-sm-12"
        style={{
          background: "#fff",
          color: "#222",
          WebkitBoxShadow: "0px 0px 3px 0px rgba(194,194,194,1)",
          boxShadow: "0px 0px 3px 0px rgba(194,194,194,1)",
          borderRadius: "0px 20px 20px 20px",
          padding: "5px",
          margin: "5px 0px",
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
            style={{ width: 200, float: "right" }}
          >
            {Object.keys(modalData).length > 0 && (
              <div className="modal-content">
                <div className="modal-header" style={{ padding: 5 }}>
                  <h5
                    className="modal-title"
                    id="exampleModalLabel1"
                    style={{ textAlign: "center" }}
                  >
                    {format(new Date(modalData.date), "dd-MMM-yyyy")}
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
                id="flexRadioDefault3"
                checked
                onChange={() => this.getLeaveCalendar('myCalendar')}
              ></input>
              <p
                className="form-check-label"
                for="flexRadioDefault3"
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
        <div bu9 className="col-md-5 col-lg-5 col-sm-5">
          <ReactDatePicker
            selected={this.state.startDate}
            onChange={(date) => this.setState({ startDate: date })}
            renderDayContents={this.renderDayContents}
            inline
            calendarClassName="custom-datePicker"
            style={{ width: "50%" }}
            calendarContainer={MyContainer}
            formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
            onMonthChange={(v) => console.log('on Month change ===>', v)}
          />
        </div>

        {/* </div> */}
      </div>
    );
  }
}
