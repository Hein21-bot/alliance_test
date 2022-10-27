import React, { Component } from "react";
import SettingHeader from "../SettingHeader";
import Select from "react-select";
import DatePicker from "react-datetime";
import moment from "moment";
import { components } from "react-select";
import {
  getAttendancePolicy,
  getDesignationData,
  stopSaving,
  main_url,
} from "../../../utils/CommonFunction";
import { toast, ToastContainer } from "react-toastify";
import { AttendancePolicyValidation } from "../SettingValidation";

var obj = {
  day_close_hour: "27-10-2022 17:00:00",
  day_id: 1,
  day_modified_date: "2022-10-27T06:30:00.000Z",
  day_name: "Sunday",
  day_open: false,
  day_open_hour: "27-10-2022 08:30:00",
  early_check_out_allow: "1",
  early_check_out_start: "27-10-2022 17:15:00",
  late_check_in_allow: "1",
  late_check_in_start: "27-10-2022 08:45:00",
  office_time: null,
  ot_allow: true,
  ot_allow_designation: [1],
  ot_end_time: "27-10-2022 00:00:00",
  ot_start_time: "27-10-2022 00:00:00",
  remark: "test",
  working_day_id: 1,
};

class AttendancePolicy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      office_time: 1, // default(1) = Same time
      all_data: [],
      current_data: {},
      working_days: [],
      attendance_policy_data: [],
      designation_options: [],
      validateErr: {},
      disable: true,
      day_modified_date: new Date(),
    };
  }
  async componentDidMount() {
    const attendance_policy_data = await getAttendancePolicy();
    const designation_data = await getDesignationData();
    const designation_options = designation_data.map((v) => ({
      label: v.designations,
      value: v.designations_id,
    }));
    this.setState(
      {
        designation_options,
        attendance_policy_data,
        day_modified_date: attendance_policy_data[0].day_modified_date,
      },
      () => this.getCurrentData(this.state.office_time, null)
    );
  }

  getCurrentData = (office_time, working_day) => {
    // const data = this.state.attendance_policy_data.filter((v) =>
    //   office_time === 1
    //     ? v.office_time === office_time
    //     : v.day_name === working_day
    // );

    const data = this.state.attendance_policy_data.filter((v) =>
      office_time === 1 ? v.day_open == true : working_day == v.day_name
    );

    // working day selector
    if (office_time === 1) {
      const working_days = workingDayOptions.filter((el) => {
        return data.some((f) => {
          return f.day_name === el.label && f.day_open;
        });
      });
      this.setState({ working_days });
    } else {
      const working_days = workingDayOptions.filter((el) => {
        return working_day === el.label;
      });
      this.setState({ working_days });
    }
    console.log('data is ===============>', data[0])
    const current_data = {
      id: data.length > 0 ? data[0].id : null,
      day_name: data.length > 0 ? data[0].day_name : null,
      day_open_hour: data.length > 0 ? data[0].day_open_hour : null,
      day_close_hour: data.length > 0 ? data[0].day_close_hour : null,
      office_time: office_time,
      day_modified_date: data.length > 0 ? data[0].day_modified_date : null,
      ot_start_time: data.length > 0 ? data[0].ot_start_time : null,
      ot_end_time: data.length > 0 ? data[0].ot_end_time : null,
      ot_allow: data.length > 0 ? data[0].ot_allow : 0,
      late_check_in_start: data.length > 0 ? data[0].late_check_in_start : null,
      early_check_out_start:
        data.length > 0 ? data[0].early_check_out_start : null,
      late_check_in_allow: data.length > 0 ? data[0].late_check_in_allow : 0,
      early_check_out_allow:
        data.length > 0 ? data[0].early_check_out_allow : 0,
      remark: data.length > 0 ? data[0].remark : null,
      ot_allow_designation: data.length > 0 ? data[0].ot_allow_designation : [],
      day_lunch_close_hour: data.length > 0 ? data[0].day_lunch_open_hour : [],
      day_lunch_close_hour: data.length > 0 ? data[0].day_lunch_close_hour : []
    };
    this.setState({ current_data });
    // }
  };
  handleChangeWorkingDays = (working_days) => {
    this.setState(
      {
        working_days,
      },
      () => {
        if (this.state.office_time === 2) {
          this.getCurrentData(this.state.office_time, working_days.label);
        }
      }
    );
  };
  handleChangeOfficeTime = (e) => {
    this.setState(
      {
        office_time: Number(e.target.value),
      },
      () => {
        this.getCurrentData(this.state.office_time, "Monday");
      }
    );
  };
  handleChangeTime = (date, key) => {
    const format_date = new Date(date);
    const newObj = { ...this.state.current_data };
    newObj[key] = format_date;
    this.setState({
      current_data: newObj,
    });
  };
  handleRadioChange = (val, key) => {
    const newObj = { ...this.state.current_data };
    newObj[key] = val;
    this.setState({
      current_data: newObj,
    });
  };
  handleInputChange = (e) => {
    const newObj = { ...this.state.current_data };
    newObj[e.target.id] = e.target.value;
    this.setState({
      current_data: newObj,
    });
  };
  handleSelectorChange = (val, key) => {
    const value = val.map((v) => v.value);
    const newObj = { ...this.state.current_data };
    newObj[key] = value;
    this.setState({
      current_data: newObj,
    });
  };
  handleEdit = () => {
    this.setState({ disable: false });
  };
  handleSubmit = () => {
    const { current_data, office_time, working_days } = this.state;
    const validateErr = AttendancePolicyValidation(current_data, working_days);
    this.setState({ validateErr });

    let status = 0;

    if (Object.keys(validateErr).length === 0) {
      const days = [
        { day_name: "Sunday", day_id: 1 },
        { day_name: "Monday", day_id: 2 },
        { day_name: "Tuesday", day_id: 3 },
        { day_name: "Wednesday", day_id: 4 },
        { day_name: "Thursday", day_id: 5 },
        { day_name: "Friday", day_id: 6 },
        { day_name: "Saturday", day_id: 7 },
      ];
      const body_data = days.reduce((r, c) => {
        const R = [...r];
        const index = working_days.findIndex((v) => v.label === c.day_name);
        if (index > -1) {
          R.push({
            day_id: c.day_id,
            day_name: c.day_name,
            day_open_hour: moment(current_data.day_open_hour).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            day_close_hour: moment(current_data.day_close_hour).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            day_lunch_open_hour: moment(
              current_data.day_lunch_open_hour
            ).format("YYYY-MM-DD HH:mm:ss"),
            day_lunch_close_hour: moment(
              current_data.day_lunch_close_hour
            ).format("YYYY-MM-DD HH:mm:ss"),
            office_time: office_time,
            day_modified_date: current_data.day_modified_date,
            ot_start_time: moment(current_data.ot_start_time).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            ot_end_time: moment(current_data.ot_end_time).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            ot_allow: current_data.ot_allow,
            late_check_in_start: moment(
              current_data.late_check_in_start
            ).format("YYYY-MM-DD HH:mm:ss"),
            early_check_out_start: moment(
              current_data.early_check_out_start
            ).format("YYYY-MM-DD HH:mm:ss"),
            late_check_in_allow: current_data.late_check_in_allow,
            early_check_out_allow: current_data.early_check_out_allow,
            remark: current_data.remark,
            ot_allow_designation: current_data.ot_allow_designation,
            day_open: true,
          });
        } else {
          //moment(v.end_time).format('YYYY-MM-DD HH:mm:ss')
          R.push({
            day_id: c.day_id,
            day_name: c.day_name,
            day_open_hour: moment(current_data.day_open_hour).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            day_close_hour: moment(current_data.day_close_hour).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            day_lunch_open_hour: moment(
              current_data.day_lunch_open_hour
            ).format("YYYY-MM-DD HH:mm:ss"),
            day_lunch_close_hour: moment(
              current_data.day_lunch_close_hour
            ).format("YYYY-MM-DD HH:mm:ss"),
            office_time: office_time,
            day_modified_date: current_data.day_modified_date,
            ot_start_time: moment(current_data.ot_start_time).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            ot_end_time: moment(current_data.ot_end_time).format(
              "YYYY-MM-DD HH:mm:ss"
            ),
            ot_allow: current_data.ot_allow,
            late_check_in_start: moment(
              current_data.late_check_in_start
            ).format("YYYY-MM-DD HH:mm:ss"),
            early_check_out_start: moment(
              current_data.early_check_out_start
            ).format("YYYY-MM-DD HH:mm:ss"),
            late_check_in_allow: current_data.late_check_in_allow,
            early_check_out_allow: current_data.early_check_out_allow,
            remark: current_data.remark,
            ot_allow_designation: current_data.ot_allow_designation,
            day_open: false,
          });
        }
        return R;
      }, []);
      fetch(`${main_url}attendancePolicy/editAttendancePolicy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `data=${JSON.stringify(body_data)}`,
      })
        .then((res) => {
          this.setState({ disable: true });
          status = res.status;
          return res.text();
        })
        .then((text) => {
          this.showToast(status, text);
        });
    } else {
      this.showToast(status, "Please Add Fully Information.");
    }
  };

  showToast = (status, text) => {
    if (status === 200) {
      toast.success(text);
      // window.location.reload();
    } else {
      toast.error(text);
    }
  };

  render() {
    const {
      office_time,
      working_days,
      current_data,
      designation_options,
      validateErr,
      disable,
    } = this.state;
    console.log('current data is =====>', current_data)
    const ot_allow_designation = current_data.ot_allow_designation
      ? designation_options.filter((el) => {
        return current_data.ot_allow_designation.some((f) => {
          return Number(f) === Number(el.value);
        });
      })
      : [];
    return (
      <div className="attendance-policy border-bottom white-bg dashboard-header">
        <div className="row save-btn">
          <div className="float-right">
            <button
              onClick={this.handleEdit}
              className="btn btn-primary"
              style={{ margin: "0px 2px" }}
              id="saving_button"
              type="button"
            >
              Edit
            </button>
          </div>
        </div>
        <ToastContainer position={toast.POSITION.TOP_RIGHT} />
        <SettingHeader
          pageTitle="Attendance Policy"
          isAddNew={false}
          isView={false}
          isEdit={false}
          permission={{ isAddNew: false }}
        />
        <div className="" style={{ marginTop: 15 }}>
          <div className="row">
            <div className="col-lg-12 margin-y" style={{}}>
              <div className="col-lg-12">
                <div
                  style={{
                    whiteSpace: "nowrap",
                    display: "flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                  }}
                >
                  <span className="span-style" style={{ fontWeight: "bold" }}>
                    Office Time
                  </span>
                  <div
                    className=""
                    style={{ width: "100%", alignItems: "center" }}
                  >
                    <input
                      id="sameTime"
                      value={1}
                      className="checkbox_"
                      style={{ margin: 0 }}
                      type="checkbox"
                      checked={office_time === 1 ? true : false}
                      onChange={this.handleChangeOfficeTime.bind(this)}
                      disabled={disable}
                    />
                    <span htmlFor="sameTime" style={{ margin: "0px 2px" }}>
                      Everyday Same Time
                    </span>
                    <span style={{ margin: 10 }}></span>
                    <input
                      id="diffTime"
                      value={2}
                      className="checkbox_"
                      style={{ margin: 0 }}
                      type="checkbox"
                      checked={office_time === 2 ? true : false}
                      onChange={this.handleChangeOfficeTime.bind(this)}
                      disabled={disable}
                    />
                    <span htmlFor="diffTime" style={{ margin: "0px 2px" }}>
                      Set Different Time
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div
              className="col-lg-12 margin-y"
              style={
                {
                  /*border: '1px solid red'*/
                }
              }
            >
              <div className="col-lg-12">
                <div
                  style={{
                    whiteSpace: "nowrap",
                    display: "flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                  }}
                >
                  <span className="span-style">
                    Working day<span className="text-danger">*</span>
                  </span>
                  <div style={{ width: "100%" }}>
                    <div style={{ maxWidth: 250 }}>
                      <Select
                        laceholder="Please Choose An Option"
                        options={workingDayOptions}
                        isDisabled={disable}
                        // isOptionDisabled={(workingDayOptions) => workingDayOptions.disabled}
                        onChange={this.handleChangeWorkingDays.bind(this)}
                        value={working_days}
                        className="react-select-container  checkValidate"
                        classNamePrefix="react-select"
                        isMulti={office_time === 1 ? true : false}
                        components={{
                          Option: checkOptions,
                        }}
                        hideSelectedOptions={false}
                        closeMenuOnSelect={office_time === 1 ? false : true}
                        disabled={office_time === 1 ? true : false}
                        styles={{
                          control: (provided) => ({
                            ...provided,
                            border: this.state.validateErr.workingDaysErr
                              ? "1px solid red"
                              : "1px solid #e5e5e5",
                            cursor: "pointer",
                          }),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div
              className="col-lg-12 margin-y"
              style={
                {
                  /*border: '1px solid red'*/
                }
              }
            >
              <div className="col-lg-6" style={{ paddingRight: "10%" }}>
                <div
                  style={{
                    whiteSpace: "nowrap",
                    display: "flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                  }}
                >
                  <span className="span-style">
                    Office Start Time<span className="text-danger">*</span>
                  </span>
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        maxWidth: 250,
                        border: validateErr.officeStErr
                          ? "1px solid red"
                          : null,
                      }}
                    >
                      <DatePicker
                        id={"day_open_hour"}
                        value={
                          current_data.day_open_hour
                            ? moment(current_data.day_open_hour, 'DD-MM-YYYY HH:mm:ss').format(
                              "hh:mm A"
                            )
                            : null
                        }
                        timeFormat="hh:mm A"
                        dateFormat={false}
                        onChange={(date) =>
                          this.handleChangeTime(date, "day_open_hour")
                        }
                        inputProps={{ disabled: disable }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div
                  style={{
                    whiteSpace: "nowrap",
                    display: "flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                  }}
                >
                  <span className="span-style">
                    Lunch Start Time<span className="text-danger">*</span>
                  </span>
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        maxWidth: 250,
                        border: validateErr.officeStErr
                          ? "1px solid red"
                          : null,
                      }}
                    >
                      <DatePicker
                        id={"day_lunch_open_hour"}
                        value={
                          current_data.day_lunch_open_hour
                            ? moment(current_data.day_lunch_open_hour, 'DD-MM-YYYY HH:mm:ss').format(
                              "hh:mm A"
                            )
                            : null
                        }
                        timeFormat="hh:mm A"
                        dateFormat={false}
                        onChange={(date) =>
                          this.handleChangeTime(date, "day_lunch_open_hour")
                        }
                        inputProps={{ disabled: disable }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div
              className="col-lg-12 margin-y"
              style={
                {
                  /*border: '1px solid red'*/
                }
              }
            >
              <div className="col-lg-6">
                <div
                  style={{
                    whiteSpace: "nowrap",
                    display: "flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                  }}
                >
                  <span className="span-style">
                    Office End Time<span className="text-danger">*</span>
                  </span>
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        maxWidth: 250,
                        border: validateErr.officeEtErr
                          ? "1px solid red"
                          : null,
                      }}
                    >
                      <DatePicker
                        id={"day_close_hour"}
                        value={
                          current_data.day_close_hour
                            ? moment(current_data.day_close_hour, 'DD-MM-YYYY HH:mm:ss').format(
                              "hh:mm A"
                            )
                            : null
                        }
                        timeFormat="hh:mm A"
                        dateFormat={false}
                        onChange={(date) =>
                          this.handleChangeTime(date, "day_close_hour")
                        }
                        inputProps={{ disabled: disable }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div
                  style={{
                    whiteSpace: "nowrap",
                    display: "flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                  }}
                >
                  <span className="span-style">
                    Lunch End Time<span className="text-danger">*</span>
                  </span>
                  <div style={{ width: "100%" }}>
                    <div
                      style={{
                        maxWidth: 250,
                        border: validateErr.officeEtErr
                          ? "1px solid red"
                          : null,
                      }}
                    >
                      <DatePicker
                        id={"day_lunch_close_hour"}
                        value={
                          current_data.day_lunch_close_hour
                            ? moment(current_data.day_lunch_close_hour, 'DD-MM-YYYY HH:mm:ss').format(
                              "hh:mm A"
                            )
                            : null
                        }
                        timeFormat="hh:mm A"
                        dateFormat={false}
                        onChange={(date) =>
                          this.handleChangeTime(date, "day_lunch_close_hour")
                        }
                        inputProps={{ disabled: disable }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 margin-y">
              <div className="row">
                <div className="col-lg-12">
                  <div
                    className="col-lg-11 margin-y"
                    style={{
                      border: "1px solid #d1d3d1",
                      padding: "10px 15px",
                    }}
                  >
                    <div
                      className="card-title-style"
                      style={{ fontWeight: "bold" }}
                    >
                      OT
                    </div>
                    <div
                      className="margin-y"
                      style={{
                        whiteSpace: "nowrap",
                        display: "flex",
                        flexWrap: "nowrap",
                        alignItems: "center",
                      }}
                    >
                      <span className="span-style">
                        OT Start Time<span className="text-danger">*</span>
                      </span>
                      <div style={{ width: "100%" }}>
                        <div
                          style={{
                            maxWidth: 250,
                            border: validateErr.otStErr
                              ? "1px solid red"
                              : null,
                          }}
                        >
                          <DatePicker
                            id={"ot_start_time"}
                            value={
                              current_data.ot_start_time
                                ? moment(current_data.ot_start_time).format(
                                  "hh:mm A"
                                )
                                : null
                            }
                            timeFormat="hh:mm A"
                            dateFormat={false}
                            onChange={(date) =>
                              this.handleChangeTime(date, "ot_start_time")
                            }
                            inputProps={{ disabled: disable }}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="margin-y"
                      style={{
                        whiteSpace: "nowrap",
                        display: "flex",
                        flexWrap: "nowrap",
                        alignItems: "center",
                      }}
                    >
                      <span className="span-style">
                        OT End Time<span className="text-danger">*</span>
                      </span>
                      <div style={{ width: "100%" }}>
                        <div
                          style={{
                            maxWidth: 250,
                            border: validateErr.otEtErr
                              ? "1px solid red"
                              : null,
                          }}
                        >
                          <DatePicker
                            id={"ot_end_time"}
                            value={
                              current_data.ot_end_time
                                ? moment(current_data.ot_end_time).format(
                                  "hh:mm A"
                                )
                                : null
                            }
                            timeFormat="hh:mm A"
                            dateFormat={false}
                            onChange={(date) =>
                              this.handleChangeTime(date, "ot_end_time")
                            }
                            inputProps={{ disabled: disable }}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="margin-y"
                      style={{
                        whiteSpace: "nowrap",
                        display: "flex",
                        flexWrap: "nowrap",
                        alignItems: "center",
                      }}
                    >
                      <span className="span-style">
                        OT Allow Designation
                        <span className="text-danger">*</span>
                      </span>
                      <div style={{ width: "100%" }}>
                        <div style={{ maxWidth: 250 }}>
                          <Select
                            data-name="withdraw_loction"
                            value={ot_allow_designation}
                            onChange={(val) =>
                              this.handleSelectorChange(
                                val,
                                "ot_allow_designation"
                              )
                            }
                            placeholder={""}
                            isDisabled={disable}
                            options={designation_options}
                            className="react-select-container checkValidate"
                            classNamePrefix="react-select"
                            isMulti
                            styles={{
                              control: (provided) => ({
                                ...provided,
                                border: this.state.validateErr
                                  .otAllowDesignationErr
                                  ? "1px solid red"
                                  : "1px solid #e5e5e5",
                                cursor: "pointer",
                              }),
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className="margin-y"
                      style={{
                        whiteSpace: "nowrap",
                        display: "flex",
                        flexWrap: "nowrap",
                        alignItems: "center",
                      }}
                    >
                      <span className="span-style">
                        OT Allow<span className="text-danger">*</span>
                      </span>
                      <div style={{ width: "100%" }}>
                        <div style={{ maxWidth: 250 }}>
                          <input
                            id="sameTime"
                            className="checkbox_"
                            style={{ margin: 0 }}
                            type="radio"
                            checked={
                              Number(current_data.ot_allow) === 1 ? true : false
                            }
                            onChange={() =>
                              this.handleRadioChange(1, "ot_allow")
                            }
                            disabled={disable}
                          />
                          <span
                            htmlFor="sameTime"
                            style={{ margin: "0px 2px" }}
                          >
                            Enable
                          </span>
                          <span style={{ margin: 10 }}></span>
                          <input
                            id="sameTime"
                            className="checkbox_"
                            style={{ margin: 0 }}
                            type="radio"
                            checked={
                              Number(current_data.ot_allow) === 0 ||
                                !current_data.ot_allow
                                ? true
                                : false
                            }
                            onChange={() =>
                              this.handleRadioChange(0, "ot_allow")
                            }
                            disabled={disable}
                          />
                          <span
                            htmlFor="sameTime"
                            style={{ margin: "0px 2px" }}
                          >
                            Disable
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-6 margin-y">
              <div className="row">
                <div
                  className="col-lg-11 margin-y"
                  style={{ border: "1px solid #d1d3d1", padding: "10px 15px" }}
                >
                  <div
                    className="card-title-style"
                    style={{ fontWeight: "bold" }}
                  >
                    Attendance
                  </div>
                  <div
                    className="margin-y"
                    style={{
                      whiteSpace: "nowrap",
                      display: "flex",
                      flexWrap: "nowrap",
                      alignItems: "center",
                    }}
                  >
                    <span className="span-style">
                      Late Check In Start<span className="text-danger">*</span>
                    </span>
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          maxWidth: 250,
                          border: validateErr.lateCheckInStErr
                            ? "1px solid red"
                            : null,
                        }}
                      >
                        <DatePicker
                          id={"late_check_in_start"}
                          value={
                            current_data.late_check_in_start
                              ? moment(current_data.late_check_in_start, 'DD-MM-YYYY HH:mm:ss').format(
                                "hh:mm A"
                              )
                              : null
                          }
                          timeFormat="hh:mm A"
                          dateFormat={false}
                          onChange={(date) =>
                            this.handleChangeTime(date, "late_check_in_start")
                          }
                          inputProps={{ disabled: disable }}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="margin-y"
                    style={{
                      whiteSpace: "nowrap",
                      display: "flex",
                      flexWrap: "nowrap",
                      alignItems: "center",
                    }}
                  >
                    <span className="span-style">
                      Early Check Out Start
                      <span className="text-danger">*</span>
                    </span>
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          maxWidth: 250,
                          border: validateErr.earlyCheckOutStStErr
                            ? "1px solid red"
                            : null,
                        }}
                      >
                        <DatePicker
                          id={"early_check_out_start"}
                          value={
                            current_data.early_check_out_start
                              ? moment(
                                current_data.early_check_out_start, 'DD-MM-YYYY HH:mm:ss'
                              ).format("hh:mm A")
                              : null
                          }
                          timeFormat="hh:mm A"
                          dateFormat={false}
                          onChange={(date) =>
                            this.handleChangeTime(date, "early_check_out_start")
                          }
                          inputProps={{ disabled: disable }}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className=""
                    style={{
                      margin: "11px 0px",
                      whiteSpace: "nowrap",
                      display: "flex",
                      flexWrap: "nowrap",
                      alignItems: "center",
                    }}
                  >
                    <span className="span-style">
                      Late Check In Allow<span className="text-danger">*</span>
                    </span>
                    <div style={{ width: "100%" }}>
                      <div style={{ maxWidth: 250 }}>
                        <input
                          id="sameTime"
                          className="checkbox_"
                          style={{ margin: 0 }}
                          type="radio"
                          checked={
                            Number(current_data.late_check_in_allow) === 1
                              ? true
                              : false
                          }
                          onChange={() =>
                            this.handleRadioChange(1, "late_check_in_allow")
                          }
                          disabled={disable}
                        />
                        <span htmlFor="sameTime" style={{ margin: "0px 2px" }}>
                          Enable
                        </span>
                        <span style={{ margin: 10 }}></span>
                        <input
                          id="sameTime"
                          className="checkbox_"
                          style={{ margin: 0 }}
                          type="radio"
                          checked={
                            Number(current_data.late_check_in_allow) === 0 ||
                              !current_data.late_check_in_allow
                              ? true
                              : false
                          }
                          onChange={() =>
                            this.handleRadioChange(0, "late_check_in_allow")
                          }
                          disabled={disable}
                        />
                        <span htmlFor="sameTime" style={{ margin: "0px 2px" }}>
                          Disable
                        </span>
                      </div>
                    </div>
                  </div>
                  <div
                    className=""
                    style={{
                      margin: "11px 0px",
                      whiteSpace: "nowrap",
                      display: "flex",
                      flexWrap: "nowrap",
                      alignItems: "center",
                    }}
                  >
                    <span className="span-style">
                      Early Check Out Allow
                      <span className="text-danger">*</span>
                    </span>
                    <div style={{ width: "100%" }}>
                      <div style={{ maxWidth: 250 }}>
                        <input
                          id="sameTime"
                          className="checkbox_"
                          style={{ margin: 0 }}
                          type="radio"
                          checked={
                            Number(current_data.early_check_out_allow) == 1
                              ? true
                              : false
                          }
                          onChange={() =>
                            this.handleRadioChange(1, "early_check_out_allow")
                          }
                          disabled={disable}
                        />
                        <span htmlFor="sameTime" style={{ margin: "0px 2px" }}>
                          Enable
                        </span>
                        <span style={{ margin: 10 }}></span>
                        <input
                          id="sameTime"
                          className="checkbox_"
                          style={{ margin: 0 }}
                          type="radio"
                          checked={
                            Number(current_data.early_check_out_allow) === 0 ||
                              !current_data.early_check_out_allow
                              ? true
                              : false
                          }
                          onChange={() =>
                            this.handleRadioChange(0, "early_check_out_allow")
                          }
                          disabled={disable}
                        />
                        <span htmlFor="sameTime" style={{ margin: "0px 2px" }}>
                          Disable
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div
              className="col-lg-12 margin-y"
              style={
                {
                  /*border: '1px solid red'*/
                }
              }
            >
              <div className="col-lg-12">
                <div
                  style={{
                    whiteSpace: "nowrap",
                    display: "flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                  }}
                >
                  <span className="span-style">Remark</span>
                  <div style={{ width: "100%" }}>
                    <div style={{ maxWidth: 250 }}>
                      <textarea
                        className="form-control"
                        id="remark"
                        cols="40"
                        rows="2"
                        value={current_data.remark ? current_data.remark : ""}
                        onChange={(e) => this.handleInputChange(e)}
                        disabled={disable}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-lg-12 margin-y"
              style={
                {
                  /*border: '1px solid red'*/
                }
              }
            >
              <div className="col-lg-12">
                <div
                  style={{
                    whiteSpace: "nowrap",
                    display: "flex",
                    flexWrap: "nowrap",
                    alignItems: "center",
                  }}
                >
                  <span className="span-style">Updated At</span>
                  <div style={{ width: "100%" }}>
                    <div style={{ maxWidth: 250 }}>
                      <input
                        className="form-control"
                        id="updated_at"
                        cols="40"
                        rows="2"
                        value={this.state.day_modified_date}
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row save-btn">
            <div className="float-right">
              <button
                onClick={() => window.location.reload()}
                className="btn btn-danger"
                style={{ margin: "0px 2px" }}
                id="saving_button"
                type="button"
                disabled={disable}
              >
                Cancel
              </button>
              <button
                onClick={this.handleSubmit}
                className="btn btn-primary"
                style={{ margin: "0px 2px" }}
                id="saving_button"
                type="button"
                disabled={disable}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AttendancePolicy;

const checkOptions = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <span>{props.label}</span>
      </components.Option>
    </div>
  );
};

const workingDayOptions = [
  { label: "Sunday", value: "Sunday" },
  { label: "Monday", value: "Monday" },
  { label: "Tuesday", value: "Tuesday" },
  { label: "Wednesday", value: "Wednesday" },
  { label: "Thursday", value: "Thursday" },
  { label: "Friday", value: "Friday" },
  { label: "Saturday", value: "Saturday" },
];
