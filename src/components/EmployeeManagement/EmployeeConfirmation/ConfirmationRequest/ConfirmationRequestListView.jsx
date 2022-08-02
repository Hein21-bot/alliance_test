import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";

import Select from "react-select";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import moment from "moment";

const ConfirmationRequestListView = (props) => {
  const {
    handleSubmit,
    fullname,
    career_sub_level,
    branch_name,
    region_name,
    employment_id,
    designations,
    deptname,
    employ_date,
    current_level_service_year,
    current_sub_level_service_year,
    service_year,
    effective_date,
    last_promotion_date,
    performance_score,
    extension_comment,
    recommendation,
    status,
  } = props.item;
 
  const handleClickBack = () => {
    props.backToList(false);
  };

  return (
    <div>
      <div
        className="col-lg-12 mx-2"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "end",
          marginTop: 20,
        }}
      >
        <button
          onClick={handleClickBack}
          className="btn btn-primary"
          style={{ borderRadius: 5, width: 120 }}
        >
          Back To List
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div
          style={{
            padding: 10,
            justifyContent: "center",
            boxShadow: "5px 5px 5px lightgrey",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3 style={{ fontWeight: "bold" }}>Confirmation Request Form</h3>
          </div>
          <div className="row">
          <div className=" col-lg-6 col-md-10 col-sm-12">
          <div
            className="w-100"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 10,
              paddingTop: 20,
            }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Employee Id</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{employment_id}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Employee Name</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{fullname}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 10,
            }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Designation</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{designations}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Level</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">
                {career_sub_level}
              </div>
            </div>
          </div>
          <div
            className="w-100"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 10,
            }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Department</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{deptname}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Branch</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{branch_name}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 10,
            }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Region</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{region_name}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Employed Date</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{employ_date}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Performance Score</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{performance_score}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Target Achievement</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{employ_date}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Comment on Overall Performance</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{employ_date}</div>
            </div>
          </div>
          </div>
            <div  className="col-lg-6 col-md-10 col-sm-12">
            <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Letter Warning</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{employ_date}</div>
            </div>
          </div>
            <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Recommended Level</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{employ_date}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 10,
            }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">
                Last Promotion Date
              </div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{last_promotion_date}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Service Year</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{service_year}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5"> Service year by Current Level</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{current_level_service_year}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 10,
            }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">
                Service year by Current Sub Level
              </div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">
                {current_sub_level_service_year}
              </div>
            </div>
          </div>
          <div
            className="w-100"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 10,
            }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">
                Effective date
              </div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">
                {effective_date ? moment(effective_date).format('YYYY-MM-DD') : ''}
              </div>
            </div>
          </div>
          <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Confirm or Not</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{recommendation}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{ display: "flex", justifyContent: "center", padding: 10 }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "space-around",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Extension Comment</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">{extension_comment}</div>
            </div>
          </div>
          <div
            className="w-100"
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 10,
            }}
          >
            <div
              className="col-lg-10 col-md-10 col-sm-12"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div className="col-lg-5 col-md-5 col-sm-5">Status</div>
              <div className="col-lg-2 col-md-2 col-sm-2">:</div>
              <div className="col-lg-5 col-md-5 col-sm-5">
                {status == 0 ? (
                  <div
                    style={{
                      width: '50%',
                      paddingTop: 5,
                      borderRadius: 5,
                      display: 'flex',
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#509aed",
                    }}
                  >
                    <p style={{ color: "white" }}>Request</p>
                  </div>
                ) : status == 1 ? (
                  <div
                    style={{
                      width: '50%',
                      paddingTop: 5,
                      borderRadius: 5,
                      display: 'flex',
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#b33ce0",
                    }}
                  >
                    <p style={{ color: "white" }}>Check</p>
                  </div>
                ) : status == 2 ? (
                  <div
                    style={{
                      width: '50%',
                      paddingTop: 5,
                      borderRadius: 5,
                      display: 'flex',
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#0078FF",
                    }}
                  >
                    <p style={{ color: "white" }}>Confirm</p>
                  </div>
                ) : status == 3 ? (
                  <div
                    style={{
                      width: '50%',
                      paddingTop: 5,
                      borderRadius: 5,
                      display: 'flex',
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#f2a509",
                    }}
                  >
                    <p style={{ color: "white" }}>Verify</p>
                  </div>
                ) : status == 4 ? (
                  <div
                    style={{
                      width: '50%',
                      paddingTop: 5,
                      borderRadius: 5,
                      display: 'flex',
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#29a50a",
                    }}
                  >
                    <p style={{ color: "white" }}>Approve</p>
                  </div>
                ) : status == 5 ? (
                  <div
                    style={{
                      width: '50%',
                      paddingTop: 5,
                      borderRadius: 5,
                      display: 'flex',
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "#f60e2f",
                    }}
                  >
                    <p style={{ color: "white" }}>Extension</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
      </form>
    </div>
  );
};

export default ConfirmationRequestListView;
