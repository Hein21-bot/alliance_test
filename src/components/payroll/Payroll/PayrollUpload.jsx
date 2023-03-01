import React, { Component, ReactNode } from "react";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import "react-toastify/dist/ReactToastify.min.css";
import { CircleLoader } from "react-spinners";
import moment from "moment";
import { main_url } from "../../../utils/CommonFunction";
import { toast, ToastContainer } from "react-toastify";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");

export default class PayrollUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeStep: 0,
      completed: 0,
      steps: [],
      loading: false,
      step_name: null,
      newDoc: [],
      dataSource: [],
      loading: false,
    };
  }

  async componentDidMount() {
    this.handleReset();
    await this.getPayrollHeader();
  }

  // componentDidUpdate(prevProps, prevState) {
  //   if (prevState.activeStepi != this.state.activeStep ) {
  //     if (this.state.steps[this.state.activeStep] == 'SSC') {
  //       // console.log('activeSteps =====>')

  //       fetch(main_url+`payroll/getSSCdata/${moment(this.props.filterDate).format('YYYY-MM')}`)
  //       .then(response => {
  //         if (response.ok) return response.json();
  //       }).then(res => {
  //         if (res) {
  //           this.setState({
  //             dataSource: res,
  //           });
  //           this._setTableData(res);
  //         }
  //       })
  //     }
  //   }
  // }

  getPayrollHeader = async () => {
    await fetch(`${main_url}payroll/getPayrollHeader`)
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((res) => {
        var formatData = [];

        res.map((v) => {
          formatData.push(v.name);
        });

        if (res) {
          this.setState({ steps: formatData });
        }
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  };
  currencyFormat=(num)=> {
    if(num == 0 || num == '' || num == null){
      return num
    }else{
      let integer=parseInt(num)
      console.log("number====><",typeof(num),num)
      return integer.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    
 }

  handleNextSSC = () => {
    this._setTableData([]);
    this.setState({
      dataSource: [],
      activeStep:
        this.state.steps.length == this.state.activeStep + 1
          ? this.state.activeStep
          : this.state.activeStep + 1,
    });
  };

  handleNext = () => {
    const { steps, activeStep } = this.state;
    let status = 0;
    fetch(
      main_url +
        `payroll/btn_control/${steps[activeStep]}/${moment(
          this.props.filterDate
        ).format("YYYY-MM")}`
    )
      .then((response) => {
        status = response.status;
        return response.text();
      })
      .then((text) => {
        if (status == 400) {
          toast.error(text, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
        document.querySelector("#attachment").value = "";
        this.setState(
          {
            dataSource: [],
            newDoc: [],
            activeStep:
              this.state.steps.length == this.state.activeStep + 1
                ? this.state.activeStep
                : this.state.activeStep + 1,
          },
          () => {
            this._setTableData(this.state.dataSource);
          }
        );
      });
  };

  handleBackSSC = () => {
    this._setTableData([]);
    this.setState({
      dataSource: [],
      activeStep: this.state.activeStep == 0 ? 0 : this.state.activeStep - 1,
    });
  };

  handleBack = () => {
    document.querySelector("#attachment").value = "";
    console.log("document", document.querySelector("#attachment").value);
    this.setState(
      {
        dataSource: [],
        newDoc: [],
        activeStep: this.state.activeStep == 0 ? 0 : this.state.activeStep - 1,
      },
      () => {
        console.log(
          "back datasource",
          this.state.dataSource,
          this.state.newDoc
        );
        this._setTableData(this.state.dataSource);
      }
    );
  };

  handleFetchSSCData = () => {
    let status = 0;
    let statusText='';
    fetch(
      main_url +
        `payroll/getSSCdata/${moment(this.props.filterDate).format("YYYY-MM")}`
    )
      .then((response) => {
        status=response.status;
        statusText=response.statusText;
        if (response.ok){
          return response.json()
        }else{
          return response.text()
        }
         
         ;
      })
      .then((res) => {
        if (res) {
          this.setState({
            dataSource: res,
          });
          this._setTableData(res);
        }
        // else if(res.length == 0){
        //   console.log("data ma shi bu")
        //   toast.error("There is no data in Excel Sheet", {
        //     position: "top-right",
        //     autoClose: 5000,
        //     hideProgressBar: false,
        //     closeOnClick: true,
        //     pauseOnHover: true,
        //     draggable: true,
        //   });
        // }
        else{
          toast.error(res, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      });
  };

  handleFetchClick = () => {
    if(this.state.steps[this.state.activeStep] == "Leave Without Pay"){
      fetch(`${main_url}payroll/getLeaveWithoutPay/${moment(this.props.filterDate).format("YYYY-MM")}`)
      .then(response => {
          if (response.ok) return response.json()
      })
      .then(res => {
          if (res) {
              this.setState({ 
                dataSource: res,
                  
              }, () => this._setTableData(res))
          }else{
            toast.error("There is no data to fetch!", {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
          }
      })
      .catch(error => console.error(`Fetch Error =\n`, error));
    }
    
    
    
  };

  handleReset = () => {
    this.setState({ activeStep: 0 });
  };

  handleStep = () => {
    this.setState({ activeStep: 0 });
  };

  allStepsCompleted = () => {
    this.setState({ activeStep: 0 });
  };

  handleComplete = () => {
    this.setState({ activeStep: 0 });
  };

  CompletedSteps = () => {
    this.setState({ activeStep: 0 });
  };

  totalSteps = () => {
    this.setState({ activeStep: 0 });
  };

  checkFiles(e) {
    this.setState({
      loading: true,
    });
    var files = document.getElementById("attachment").files;

    var newDoc = this.state.newDoc;

    for (let i = 0; i < files.length; i++) {
      var getfile = document.querySelector("#attachment").files[i];
      newDoc.push(getfile);
    }
    // document.querySelector("#attachment").value = "";
    const formdata = new FormData();
    var imagedata = newDoc[0];
    formdata.append("uploadfile", imagedata);
    formdata.append("data", this.state.steps[this.state.activeStep]);
    let status = 0;
    let statusText='';
    fetch(
      main_url +
        "payrollCalculate/addPayroll/" +
        moment(this.props.filterDate).format("YYYY-MM"),
      {
        method: "POST",
        body: formdata,
      }
    )
      .then((res) => {
        status = res.status;
        statusText=res.statusText;
       
        // console.log("here ======>?", res.statusText)
        if(res.ok){
          return res.json()
        }else{
          return res.text();
        }
        
      })
      .then(async (response) => {
        console.log("response",response);
        if (status == 200) {
          console.log("status text",statusText);
          this.setState({ dataSource: response, loading: false });
          await this._setTableData(response);
        } else if(status == 400){
          console.log('error======>',statusText)
          // toast.error(moment(this.props.filterDate).format("YYYY-MM")+"payroll is already calculate!", {
          toast.error(response, {

            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          this.setState({
            loading: false,
          });
        }
      }).catch(err=>{
        console.log("error",err)
      });
      console.log("status", status);
    this.setState(
      {
        newDoc: [],
      },
      () => console.log("check new doc", this.state.newDoc)
    );
    // document.querySelector("#attachment").value = "";
    // console.log("check", document.getElementById("attachment").files);
  }

  _setTableData = async (data) => {
    // console.log("set table======>", data);
    var table;
    var l = [];
    var status;
    for (var i = 0; i < data.length; i++) {
      //   let result = data[i];
      let obj = [];

      obj = {
        no: i + 1,
        employee_id: data[i].employee_id ? data[i].employee_id : "-",
        fullname: data[i].fullname ? data[i].fullname : "-",
        designations: data[i].designations ? data[i].designations : "-",
        career_sub_level: data[i].career_sub_level
          ? data[i].career_sub_level
          : "-",
        location_master_name: data[i].location_master_name
          ? data[i].location_master_name
          : "-",
        state_name: data[i].state_name ? data[i].state_name : "-",
        deduction_amount: data[i].deduction_amount
          // ? data[i].deduction_amount.toLocaleString('en-US',{maximumFractionDigits:2})
          ? this.currencyFormat(data[i].deduction_amount)

          : data[i].allowance_amount
          ? this.currencyFormat(data[i].allowance_amount)
          : "-",
      };
      l.push(obj);
    }

    if ($.fn.dataTable.isDataTable("#dataTables-table")) {
      table = $("#dataTables-table").dataTable();
      table.fnClearTable();
      table.fnDestroy();
      $("#dataTables-table").empty();
    }

    var column = [
      { title: "No", data: "no" },
      { title: "Employee ID", data: "employee_id" },
      { title: "Employee Name", data: "fullname" },
      { title: "Designation", data: "designations" },
      { title: "Level", data: "career_sub_level" },
      { title: "Brance", data: "location_master_name" },
      { title: "Region", data: "state_name" },
      { title: "Amount", data: "deduction_amount" },
    ];

    table = $("#dataTables-table").DataTable({
      autofill: true,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      pageLength: 20,
      paging: true,
      buttons: true,
      dom: "Bfrtip",
      buttons: [
        //     'copy', 'csv',
        "excel",
        //  , 'pdf'
      ],
      buttons: [
        {
          extend: 'excelHtml5',
          title: this.state.steps[this.state.activeStep],
      },
      ],
      data: l,
      columns: column,
    });
  };

  render() {
    const { steps, activeStep } = this.state;
    let Deduction_total= this.state.dataSource.reduce((p,c)=>{return p+c.deduction_amount},0)
    let Allowance_total=this.state.dataSource.reduce((p,c)=>{return p+c.allowance_amount},0)
    console.log("total=====>",Deduction_total,Allowance_total)

    return (

      <div>
        
        <div className="stepperStyle col-md-12">
          <Box>
            <Stepper
              activeStep={activeStep}
              alternativeLabel
              sx={{ width: "100%", minHeight: "20%" }}
            >
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {this.state.steps[this.state.activeStep] == "SSC" ? (
              this.state.loading ? (
                <h1 style={{ textAlign: "center" }}>Loading...</h1>
              ) : (
                <div>
                  <div
                    className="col-md-12 col-lg-12"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    <div>
                      <label
                        htmlFor="attachment"
                        className="custom-file-label"
                        style={{ marginTop: 50, marginRight: 20 }}
                      >
                        {steps[activeStep]}
                      </label>
                    </div>
                    <div className="">
                      <input
                        className="dropZone"
                        type="file"
                        id="attachment"
                        name="attachment"
                        onChange={this.checkFiles.bind(this)}
                      ></input>
                    </div>
                  </div>
                  <div
                    className="col-md-12 col-lg-12"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    <button
                      className="btn btn-primary"
                      style={{ minWidth: "100px", margin: 5 }}
                      id="saving_button"
                      type="button"
                      onClick={this.handleBackSSC}
                    >
                      Back
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ minWidth: "100px", margin: 5 }}
                      id="saving_button"
                      type="button"
                      onClick={this.handleFetchSSCData}
                    >
                      Fetch SSC
                    </button>
                    <button
                      className="btn btn-primary"
                      style={{ minWidth: "100px", margin: 5 }}
                      id="saving_button"
                      type="button"
                      onClick={this.handleNext}
                    >
                      Next
                      {/* {this.state.steps.length == this.state.activeStep + 1 ? 'Preview Data' : 'Next'} */}
                    </button>
                  </div>
                </div>
              )
            ) : this.state.loading ? (
              <div style={{ display: "flex", justifyContent: "center" }}>
                <h2>Loading...</h2>
              </div>
            ) : (
              <div>
                <div
                  className="col-md-12 col-lg-12"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  <div>
                    <label
                      htmlFor="attachment"
                      className="custom-file-label"
                      style={{ marginTop: 50, marginRight: 20 }}
                    >
                      {steps[activeStep]}
                    </label>
                  </div>
                  <div className="">
                    <input
                      className="dropZone"
                      type="file"
                      id="attachment"
                      name="attachment"
                      onChange={this.checkFiles.bind(this)}
                    ></input>
                  </div>
                </div>
                <div
                  className="col-md-12 col-lg-12"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  <button
                    className="btn btn-primary"
                    style={{ minWidth: "100px", margin: 5 }}
                    id="saving_button"
                    type="button"
                    onClick={this.handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="btn btn-primary"
                    style={{ minWidth: "100px", margin: 5 }}
                    id="saving_button"
                    type="button"
                    onClick={this.handleFetchClick}
                  >
                    Fetch {steps[activeStep]}
                  </button>
                  {steps.length == activeStep + 1 ? (
                    <button
                      className="btn btn-primary"
                      style={{ minWidth: "100px", margin: 5 }}
                      id="saving_button"
                      type="button"
                      onClick={this.props.handleReview}
                    >
                      Check and Review
                      {/* {this.state.steps.length == this.state.activeStep + 1 ? 'Preview Data' : 'Next'} */}
                    </button>
                  ) : (
                    <button
                      className="btn btn-primary"
                      style={{ minWidth: "100px", margin: 5 }}
                      id="saving_button"
                      type="button"
                      onClick={this.handleNext}
                    >
                      Next
                      {/* {this.state.steps.length == this.state.activeStep + 1 ? 'Preview Data' : 'Next'} */}
                    </button>
                  )}
                </div>
              </div>
            )}
          </Box>
          {this.state.dataSource.length > 0 ? (
            <div>
              <table
                width="99%"
                className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
                id="dataTables-table"
              />
               <div className="col-md-12" style={{display:'flex',justifyContent:'end'}}>
                <div className="col-md-2">
                  <label htmlFor="" style={{textAlign:'right'}}>Total</label>
                  {
                    this.state.dataSource[0].deduction_amount ?  <input type="float" className="form-control" value={this.currencyFormat(Deduction_total)} disabled />: 
                    <input type="float" className="form-control" value={this.currencyFormat(Allowance_total)} disabled />
                  }
                 
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
