import React, { Component } from "react";
import moment from "moment";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import { main_url } from "../../utils/CommonFunction";
import "jspdf-autotable";
import DatePicker from "react-datetime";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");

class SSCReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      date: new Date(),
    };
  }
  componentDidMount() {
    this.getSSCReport();
    this.$el = $(this.el);
    // this.setState({
    //     },() => {
    // this._setTableData(this.state.dataSource);
    // }
    //   );
  }

  handleSelectedDate = async (event) => {
    this.setState({
      date: event,
    });
  };
  getSSCReport(date) {
    let Date1 =
      date == undefined
        ? moment(new Date()).format("YYYY-MM")
        : moment(date).format("YYYY-MM");
    fetch(main_url + "payroll_report/get_ssc_report/" + Date1)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        this.setState({
          dataSource:list
        })
        // this._setTableData(list);
      });
  }
  // _setTableData = (data) => {
  //   var table;
  //   var l = [];
  //   if (data.length > 0) {
  //     for (var i = 0; i < data.length; i++) {
  //       let result = data[i];
  //       let obj = [];
  //       obj = {
  //         no: i + 1,
  //         year: data[i].dateName
  //           ? moment(data[i].dateName).format("YYYY")
  //           : "-",
  //         month: data[i].dateName
  //           ? moment(data[i].dateName).format("MMM")
  //           : "-",
  //         er_ssn: "-",
  //         er_name: "Alliance",
  //         ee_ssn: data[i].career_sub_level ? data[i].career_sub_level : "-",
  //         ee_name: data[i].fullname ? data[i].fullname : "-",
  //         ss1ee_rate: data[i].ss1Ee ? data[i].ss1Ee : "-",
  //         ss1er_rate: data[i].ss1Er ? data[i].ss1Er : "-",
  //         ss1ee_comamt: data[i].ss1EeConAmt ? data[i].ss1EeConAmt : "-",
  //         ss1er_comamt: data[i].ss1ErConAmt ? data[i].ss1ErConAmt : "-",
  //         ss2ee_rate: data[i].ss2Ee ? data[i].ss2Ee : "-",
  //         ss2er_rate: data[i].ss2Er ? data[i].ss2Er : "-",
  //         ss2ee_comamt: data[i].ss2EeConAmt ? data[i].ss2EeConAmt : "-",
  //         ss2er_comamt: data[i].ss2ErConAmt ? data[i].ss2ErConAmt : "",
  //         total: data[i].totalComAmt ? data[i].totalComAmt : "-",
  //       };
  //       l.push(obj);
  //     }
  //   }
  //   if ($.fn.dataTable.isDataTable("#dataTables-table")) {
  //     table = $("#dataTables-table").dataTable();
  //     table.fnClearTable();
  //     table.fnDestroy();
  //     $("#dataTables-table").empty();
  //   }
  //   var column = [
  //     { title: "No", data: "no" },
  //     { title: "Year", data: "year" },
  //     { title: "Month", data: "month" },
  //     { title: "Er SSN", data: "er_ssn" },
  //     { title: "Er Name", data: "er_name" },
  //     { title: "Ee SSN", data: "ee_ssn" },
  //     { title: "Ee Name", data: "ee_name" },
  //     { title: "SS1Ee Rate", data: "ss1ee_rate" },
  //     { title: "SS1Er Rate ", data: "ss1er_rate" },
  //     { title: "SS1Ee ComAmt", data: "ss1ee_comamt" },
  //     { title: "SS1Er ComAmt", data: "ss1er_comamt" },
  //     { title: "SS2Ee Rate", data: "ss2ee_rate" },
  //     { title: "SS2Er Rate", data: "ss2er_rate" },
  //     { title: "SS2Ee ComAmt", data: "ss2ee_comamt" },
  //     { title: "SS2Er ComAmt", data: "ss2er_comamt" },
  //     { title: "Total ComAmt", data: "total" },
  //   ];
  //   table = $("#dataTables-table").DataTable({
  //     autofill: true,
  //     bLengthChange: false,
  //     bInfo: false,
  //     responsive: true,
  //     pageLength: 50,
  //     paging: true,
  //     buttons: true,
  //     dom: "Bfrtip",
  //     buttons: [
  //       //     'copy', 'csv',
  //       "excel",
  //       //  , 'pdf'
  //     ],
  //     buttons: [
  //       // 'copy',
  //       // {
  //       //         extend: 'csvHtml5',
  //       //         title: 'Child Benefit',
  //       // },
  //       {
  //         extend: "excelHtml5",
  //         title: "SSC Report For Goverment",
  //       },
  //       // {
  //       //     extend: 'pdfHtml5',
  //       //     title: 'Child Benefit',
  //       // }
  //     ],
  //     data: l,
  //     columns: column,
  //   });
  // };
  render() {
    let filterDate = this.state.date;
    let FinalData=this.state.dataSource !=undefined && this.state.dataSource.length > 0 ? this.state.dataSource : [];
    let MaleTotal=FinalData.filter(v=>v.gender == 'Male')
    let FemaleTotal=FinalData.filter(v=>v.gender == 'Female')
    let ZeroTotal=FinalData.filter(v=>v.gender == '0')
    let NullTotal=FinalData.filter(v=>v.gender == 'null')
    console.log("total====>",ZeroTotal,NullTotal)
    let Total=MaleTotal.length+FemaleTotal.length
    return (
      <div>
        
        <h3>SSC Report For Goverment</h3>
        <div style={{overflow:'scroll'}}>
        <div className="row" style={{marignBottom:10}}>
          <div className="col-md-12">
          <div
          className="row"
          style={{
            display: "flex",
            alignItems: "end",
            marginBottom: 10,
            marginTop: 5,
          }}
        >
          <div className="col-md-2">
            <DatePicker
              dateFormat="YYYY-MM"
              value={filterDate}
              onChange={this.handleSelectedDate}
              timeFormat={false}
            />
          </div>
          <div className="col-md-2">
            <button
              className="btn btn-primary"
              onClick={() => this.getSSCReport(filterDate)}
            >
              Search
            </button>
          </div>
        </div>
          </div>
          <div className="col-md-12 btn-leftend"><ReactHTMLTableToExcel 
                    className="btn-excel"
                    table="ssc_report"
                    filename={"SSC Report For Goverment-"+moment(this.state.date).format('YYYY-MM')}
                    buttonText="Excel"
                    sheet="Sheet"
                    />
          </div>
        </div>
        <table id="ssc_report" style={{overflow:'scroll',marginTop:10}}>
        <table className="table table-bordered">
          <thead>
            <tr style={{textAlign:'center',overflow:'scroll'}}>
              <th style={{verticalAlign:'middle'}}>No</th>
              <th style={{verticalAlign:'middle'}}>Year</th>
              <th style={{verticalAlign:'middle'}}>Month</th>
              <th style={{verticalAlign:'middle'}}>Er SSN</th>
              <th style={{verticalAlign:'middle'}}>Er Name</th>
              <th style={{verticalAlign:'middle'}}>Ee SSN</th>
              <th style={{verticalAlign:'middle'}}>Ee Name</th>
              <th style={{verticalAlign:'middle'}}>Salary in SSC</th>
              <th style={{verticalAlign:'middle'}}>SS1Ee Rate</th>
              <th style={{verticalAlign:'middle'}}>SS1Er Rate</th>
              <th style={{verticalAlign:'middle'}}>SS1Ee ComAmt</th>
              <th style={{verticalAlign:'middle'}}>SS1Er ComAmt</th>
              <th style={{verticalAlign:'middle'}}>SS2Ee Rate</th>
              <th style={{verticalAlign:'middle'}}>SS2ERr Rate</th>
              <th style={{verticalAlign:'middle'}}>SS2Ee ComAmt</th>
              <th style={{verticalAlign:'middle'}}>SS2Er ComAmt</th>
              <th style={{verticalAlign:'middle'}}>TotalConAmt</th>


            </tr>
          </thead>
          <tbody>
            {
              this.state.dataSource.length > 0 && this.state.dataSource.map((v,i)=>{
                return(
                  <tr>
                    <td>{i+1}</td>
                    <td>{moment(v.dateName).format('YYYY')}</td>
                    <td>{moment(v.dataName).format('MMM')}</td>
                    <td>-</td>
                    <td>Alliance</td>
                    <td>-</td>
                    <td>{v.fullname}</td>
                    <td>{v.governmentAmount}</td>
                    <td>{v.ss1Ee}</td>
                    <td>{v.ss1Er}</td>
                    <td>{v.ss1EeConAmt}</td>
                    <td>{v.ss1ErConAmt}</td>
                    <td>{v.ss2Ee}</td>
                    <td>{v.ss2Er}</td>
                    <td>{v.ss2EeConAmt}</td>
                    <td>{v.ss2ErConAmt}</td>
                    <td>{v.totalComAmt}</td>
                  </tr>
                )
              })
            }

          </tbody>
        </table>
        {/* <table
          width="99%"
          className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
          id="dataTables-table"
        /> */}
        <div style={{ display: "flex", justifyContent: "center" }}>
          <table
            className="table table-bordered"
            style={{
              width: "20%",
              border: "1px solid black",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              <tr
                style={{
                  border: "1px solid black",
                  borderCollapse: "collapse",
                }}
              >
                <td>Total</td>
                <td>{Total}</td>
              </tr>
              <tr
                style={{
                  border: "1px solid black",
                  borderCollapse: "collapse",
                }}
              >
                <td>Male</td>
                <td>{MaleTotal.length}</td>
              </tr>
              <tr
                style={{
                  border: "1px solid black",
                  borderCollapse: "collapse",
                }}
              >
                <td>Femlae</td>
                <td>{FemaleTotal.length}</td>
              </tr>
            </tbody>
          </table>
        </div>
        </table>
        </div>
      </div>
    );
  }
}

export default SSCReport;
