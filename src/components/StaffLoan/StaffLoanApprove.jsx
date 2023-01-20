import React, { Component } from "react";
import { ToastContainer, toast } from "react-toastify";
import ReactHTMLTableToExcel from "react-html-table-to-excel"

import $ from "jquery";
import {
  main_url,
  getCookieData,
  validate,
  getUserId,
  alertText,
  stopSaving,
  startSaving,
  getBranch
} from "../../utils/CommonFunction";
import Select from "react-select";
import DatePicker from "react-datetime";
import moment from "moment";

var form_validate = true;
var saveBtn = false;


class StaffLoanApprove extends Component {
  constructor() {
    super();
    this.state = {
      attach1:[],
      attach2:[]
      
    };
  }

  componentDidUpdate() {
    if (!form_validate) validate("check_form");
  }

  async componentDidMount() {
      this.submit()
  }

  
  

  handleAttach1(e) {
    var files = document.getElementById("attachment_1").files;

    if (files.length > 1) {
      toast.warning("You can upload only one file");
    }else{
      let newDoc = this.state.attach1;
      var obj = document.querySelector("#attachment_1").files.length;
      for (var i = 0; i < obj; i++) {
        var getfile = document.querySelector("#attachment_1").files[i];
        newDoc.push(getfile);
      }
      document.getElementById("attachment_1").value = "";
      this.setState({
        // attachment: attachment
        attach1: newDoc,
      });
    }

    
  }

  handleAttach2(e) {
    var files = document.getElementById("attachment_2").files;

    if (files.length > 1) {
      toast.warning("You can only upload one file");
    }else{
      let newDoc = this.state.attach2;
      var obj = document.querySelector("#attachment_2").files.length;
      for (var i = 0; i < obj; i++) {
        var getfile = document.querySelector("#attachment_2").files[i];
        newDoc.push(getfile);
      }
      document.getElementById("attachment_2").value = "";
      this.setState({
        // attachment: attachment,
        attach2: newDoc,
      });
    }
  }
  removeAttachment1(index, event) {
    var array = this.state.attach1;

    array.splice(index, 1);
    this.setState({
      attach1: array,
    });
    console.log("family  income  doc", this.state.attach1);
  }
  removeAttachment2(index, event) {
    var array = this.state.attach2;

    array.splice(index, 1);
    this.setState({
      attach2: array,
    });
    console.log("other doc", this.state.attach2);
  }

  submit() { 
    console.log("submit");
    const formdata=new FormData()
    
    for (var i = 0; i < this.state.attach1.length; i++) {
      // var imagedata = document.querySelector("#attach_file").files[i];
      var imagedata = this.state.attach1[i]; // new doc HMH
      formdata.append("attach", imagedata);
    }
    for (var i = 0; i < this.state.attach2.length; i++) {
      // var imagedata = document.querySelector("#attach_file").files[i];
      var imagedata = this.state.attach2[i]; // new doc HMH
      formdata.append('img',imagedata);
    }
    
    fetch(`${main_url}staff_loan_new/approveWithExcel`,{
      method:'POST',
      body:formdata,
      
     
    })
      .then(res => { if (res.ok) return res.json() })
      .then(list => {
        this.setDataTable(list)
        
      })
    
  }
  setDataTable(data) {
    console.log("data===>",data)
    var table;
    if ($.fn.dataTable.isDataTable("#dataTables-Table")) {
      table = $("#dataTables-Table").dataTable();
      table.fnClearTable();
      table.fnDestroy();
      $("#dataTables-Table").empty();
    }
    var l = [];
    for (var i = 0; i < data.length; i++) {
      const index = i;
      console.log("other loan table",data[i])
      const result = data[i];
      const obj = {
        no: index + 1,
        form_no:data[i].form_no ? data[i].form_no : '-',
        employee_name:data[i].fullname ? data[i].fullname : '-',
        designations:data[i].designations ? data[i].designations : '-',
        region:data[i].state_name ? data[i].state_name : '-',
        branch:data[i].location_master_name ? data[i].location_master_name : '-',
        disbursement_date:data[i].disbursement_date ? moment(data[i].disbursement_date).format('YYYY-MM-DD') : '-',
        term_in_month:data[i].term_in_month ? data[i].term_in_month : '-',
        loan_committee_date:data[i].loan_committee_date ? moment(data[i].loan_committee_date).format('YYYY-MM-DD') : '-',
        installment_amount: data[i].approve_installment_amount ? data[i].approve_installment_amount : 0,
        approve_amount:data[i].approved_amount ? data[i].approved_amount : '-',
        comment:data[i].approved_comment ? data[i].approved_comment : '-',
        approve_amount_word:data[i].approved_amount_words ? data[i].approved_amount_words : '-',
        warning_letter_check:data[i].warning_letter_check == 0 ? 'No' : 'Yes'

        // action:
        //   '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toEdit" ><span id="edit" class="hidden">'+
        //   index +
        //   '</span>  <i className="fa fa-cogs"></i>&nbsp;Edit</button>' +
        //   '<button style="margin-right:10px" class="btn btn-primary btn-sm own-btn-edit" id="toRemove" ><span id="remove" class="hidden">'+
        //   index +
        //   '</span>  <i className="fa fa-cogs"></i>&nbsp;Remove</button>',
      };
      l.push(obj);
    }
    table = $("#dataTables-Table").DataTable({
      autofill: false,
      bLengthChange: false,
      bInfo: false,
      responsive: true,
      paging: false,
      buttons: false,
      data: l,
      columns: [
        { title: "No", data: "no" },
        { title: "Form No", data: "form_no" },
        { title: "Employee Name",data:"employee_name"},
        {title:"Designations",data:'designations'},
        {title:"Region",data:'region'},
        {title:"Branch",data:'branch'},

        { title: "Disbursement Date", data: "disbursement_date" },
        { title: "Terms in Month", data: "term_in_month" },
        // { title: "Installment Term", data: "installment_term" },
        { title: "Loan Committee Date",data:"loan_committee_date"},
        // { title: "Maturity Date",data:"maturity_date"},
        { title:'Installment Amount',data:'installment_amount'},
        { title:"Approve Amount",data:'approve_amount'},
        { title:"Comment",data:'comment'},
        { title:"Approve Amount In Words",data:'approve_amount_word'},
        { title:"Warning Letter Check",data:'warning_letter_check'}
      ],
    });
  }
  

  render() {
    console.log("info=======>",this.state.attach1,this.state.attach2)
    const{staffInfo,getGuarantorInfo}=this.state;
    return (
      <div className="">
        <ToastContainer />
        <div style={{marginBottom:20}}>
                    <ReactHTMLTableToExcel 
                    className="btn-excel"
                    table="Staff_loan_approve"
                    filename="Staff Loan Approve"
                    buttonText="Excel"
                    sheet="Sheet"
                    />
                <table className="table table-bordered" id="Staff_loan_approve" style={{display:'none'}}>
                    <thead>
                        
                        <tr style={{ backgroundColor: 'blue', color: 'white' }}>
                            <th style={{ width: 200, textAlign: 'center',borderColor:'white'}}>Disbursement Date</th>
                            <th style={{ width: 200, textAlign: 'center',borderCOlor:'white' }}>Term In Month</th>
                            <th style={{ width: 200, textAlign: 'center',borderColor:'white' }}>Loan Committee Date</th>
                            <th style={{ width: 200, textAlign: 'center',borderColor:'white' }}>Installment Amount</th>
                            <th style={{ width: 200, textAlign: 'center',borderColor:'white' }}>Approve Amount</th>
                            <th style={{ width: 200, textAlign: 'center',borderColor:'white' }}>Comment</th>
                            <th style={{ width: 200, textAlign: 'center',borderColor:'white' }}>Approve Amount (In Word)</th>
                           
                            <th style={{ width: 200, textAlign: 'center',borderColor:'white' }}>Warning Letter Check</th>
                            <th style={{ width: 200, textAlign: 'center',borderColor:'white' }}>Form No</th>
                        </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{textAlign:'center'}}>14-Mar-2021</td>
                        <td style={{textAlign:'center'}}>3.00</td>
                        <td style={{textAlign:'center'}}>14-Mar-2022</td>
                        <td style={{textAlign:'center'}}>1000</td>
                        <td style={{textAlign:'center'}}>1000</td>
                        <td style={{textAlign:'center'}}>Testing 1</td>
                        <td style={{textAlign:'center'}}>တစ်ထောင်</td>
                        <td style={{textAlign:'center'}}>TRUE</td>
                        <td style={{textAlign:'center'}}>52345</td>
                      </tr>
                      <tr>
                        <td style={{textAlign:'center'}}>12-Mar-2020</td>
                        <td style={{textAlign:'center'}}>2.00</td>
                        <td style={{textAlign:'center'}}>13-Mar-2021</td>
                        <td style={{textAlign:'center'}}>5000</td>
                        <td style={{textAlign:'center'}}>5000</td>
                        <td style={{textAlign:'center'}}>Testing 2</td>
                        <td style={{textAlign:'center'}}>ငါးထောင်</td>
                        <td style={{textAlign:'center'}}>FALSE</td>
                        <td style={{textAlign:'center'}}>345543</td>
                      </tr>
                    </tbody>
                </table>
                </div>
        <div className="row">
          <form className="form-group" id="check_form">
           
            
            
            
           

            <div className="col-md-12" style={{ marginBottom: 10 }}>
              <div
                className="col-md-12"
                style={{ backgroundColor: "#27568A", color: "white", paddingTop: 5 }}
              >
                <h3>Attachment</h3>
              </div>
            </div>
            <div className="row">
              <div className="form-group col-md-5">
                <div>
                  <label
                    htmlFor="attachment"
                    className="col-sm-12 custom-file-label"
                  >
                    Excel
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="attachment_1"
                    multiple
                    onChange={this.handleAttach1.bind(this)}
                  ></input>
                </div>
                <div>
                  {this.state.attach1.length > 0 && this.state.attach1.map((data, index) => (
                    <div className="fileuploader-items col-md-6">
                      <ul className="fileuploader-items-list">
                        <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                          <div className="columns">
                            <div className="column-thumbnail">
                              <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                <div
                                  className="fileuploader-item-icon"
                                  style={{ backgroundColor: "#3f4fd3" }}
                                >
                                  <i>{data.name.split(".")[1]}</i>
                                </div>
                              </div>
                              <span className="fileuploader-action-popup"></span>
                            </div>
                            <div className="column-title">
                              <span className="own-text">{data.name}</span>
                            </div>
                            <div className="column-actions">
                              <a
                                className="fileuploader-action fileuploader-action-remove"
                                onClick={(event) =>
                                  this.removeAttachment1(index, event)
                                }
                              >
                                {" "}
                                <i></i>
                              </a>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
              <div className="form-group col-md-5">
                <div>
                  <label
                    htmlFor="attachment"
                    className="col-sm-12 custom-file-label"
                  >
                    Image
                  </label>
                </div>
                <div className="col-sm-10">
                  <input
                    className="dropZone "
                    type="file"
                    id="attachment_2"
                    multiple
                    onChange={this.handleAttach2.bind(this)}
                  ></input>
                </div>
                  <div>
                    {this.state.attach2.length > 0 && this.state.attach2.map((data, index) => (
                      <div className="fileuploader-items col-md-6">
                        <ul className="fileuploader-items-list">
                          <li className="fileuploader-item file-has-popup file-type-application file-ext-odt">
                            <div className="columns">
                              <div className="column-thumbnail">
                                <div className="fileuploader-item-image fileuploader-no-thumbnail">
                                  <div
                                    className="fileuploader-item-icon"
                                    style={{ backgroundColor: "#3f4fd3" }}
                                  >
                                    <i>{data.name.split(".")[1]}</i>
                                  </div>
                                </div>
                                <span className="fileuploader-action-popup"></span>
                              </div>
                              <div className="column-title">
                                <span className="own-text">{data.name}</span>
                              </div>
                              <div className="column-actions">
                                <a
                                  className="fileuploader-action fileuploader-action-remove"
                                  onClick={(event) =>
                                    this.removeAttachment2(index, event)
                                  }
                                >
                                  {" "}
                                  <i></i>
                                </a>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    ))}
                  </div>
              </div>
              <div className="form-group col-md-2">
              <div className="">
            <div style={{marginTop:25}}>
              <button
                className="btn btn-primary"
                id="saving_button"
                type="button"
                onClick={() => this.submit()}
              >
                Submit
              </button>
            </div>
          </div>
              </div>
            </div>
          </form>
        </div>
        <div className="col-md-12">
                <table
                  width="99%"
                  className="table table-striped table-bordered table-hover responsive nowrap dt-responsive"
                  id="dataTables-Table"
                />
              </div>
        
      </div>
    );
  }
}

export default StaffLoanApprove;
