import React, { Component } from "react";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import moment from "moment";
import * as jsPDF from "jspdf";
import { main_url } from "../../utils/CommonFunction";
import { toast } from "react-toastify";
// import { main_url, getUserId, getMainRole, getInformation, print, fno } from "../../../../utils/CommonFunction";
const $ = require("jquery");
const jzip = require("jzip");
window.JSZip = jzip;
$.DataTable = require("datatables.net-bs4");
$.DataTable = require("datatables.net-responsive-bs4");
$.DataTable = require("datatables.net");
require("datatables.net-buttons/js/dataTables.buttons.min");
require("datatables.net-buttons/js/buttons.html5.min");

export default class SSC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newDoc: [],
      dataSource: [],
      totalCount: 0,
      maleCount: 0,
      femaleCount: 0,
    };
  }

  async componentDidMount() {
    this.$el = $(this.el);

    // this.setState(
    //   {
    //     dataSource: tableTempData,
    //   },
    //   () => {
    //     this._setTableData(this.state.dataSource);
    //   }
    // );
    await this._setTableData(this.state.dataSource);
    await this.totalEmployeeDashboard();
  }

  async totalEmployeeDashboard() {
    fetch(`${main_url}dashboard/totalEmployee`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((res) => {
        console.log("total employee ===>", res);
        // let total = []
        // let male = []
        // let female = []
        // res.map((v, i) => {
        //   total.push(v.count);
        //   female.push(v.female);
        //   male.push(v.male);
        // })
        // this.setState({ total_count: total[0], male_count: male[2], female_count: female[1] });
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }

  checkFiles(e) {
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
    let status = 0;
    fetch(main_url + "sscCalculate/addSsc", {
      method: "POST",
      body: formdata,
    })
      .then((res) => {
        status = res.status;
        return res.json();
      })
      .then((text) => {
        if (status == 200) {
          this.setState({
            dataSource: text,
          });
          this._setTableData(text);
        }
      })
      .catch((err) => {
        console.log("error =====>", err);
      });
  }

  _setTableData = async (data) => {
    var table;
    var l = [];
    var status;
    for (var i = 0; i < data.length; i++) {
      //   let result = data[i];
      let obj = [];

      obj = {
        no: i + 1,
        year: moment(new Date()).format("YYYY"),
        dateName: data[i].dateName ? data[i].dateName : "-",
        erSSN: data[i].ErrssN ? data[i].ErrssN : "-",
        erName: data[i].ErName ? data[i].ErName : "-",
        eeSSN: data[i].ErrssN ? data[i].ErrssN : "-",
        eeName: data[i].fullname ? data[i].fullname : "-",
        salaryAmount: data[i].salaryAmount ? data[i].salaryAmount : 0,
        governmentAmount: data[i].governmentAmount
          ? data[i].governmentAmount
          : 0,
        ss1Ee: data[i].ss1Ee ? data[i].ss1Ee : 0,
        ss1Er: data[i].ss1Er ? data[i].ss1Er : 0,
        ss1EeConAmt: data[i].ss1EeConAmt,
        ss1ErConAmt: data[i].ss1ErConAmt ? data[i].ss1ErConAmt : 0,
        ss2Ee: data[i].ss2Ee ? data[i].ss2Ee : 0,
        ss2Er: data[i].ss2Er ? data[i].ss2Er : 0,
        ss2EeConAmt: data[i].ss2EeConAmt ? data[i].ss2EeConAmt : 0,
        ss2ErConAmt: data[i].ss2ErConAmt ? data[i].ss2ErConAmt : 0,
        totalConAmt: data[i].totalComAmt ? data[i].totalComAmt : 0,
        remark: "-",
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
      { title: "Year", data: "year" },
      { title: "Month", data: "dateName" },
      { title: "ErSSN", data: "erSSN" },
      { title: "ErName", data: "erName" },
      { title: "EeSSN", data: "eeSSN" },
      { title: "EeName", data: "eeName" },
      { title: "Actual Salary", data: "salaryAmount" },
      { title: "Salary in SSC (Send Government)", data: "governmentAmount" },
      { title: "SS1Ee Rate", data: "ss1Ee" },
      { title: "SS1Er Rate", data: "ss1Er" },
      { title: "SS1Ee ConAmt", data: "ss1EeConAmt" },
      { title: "SS1Er ConAmt", data: "ss1ErConAmt" },
      {
        title: "SS2Ee Rate",
        data: "ss2Ee",
      },
      {
        title: "SS2Er Rate",
        data: "ss2Er",
      },
      { title: "SS2Ee ConAmt", data: "ss2EeConAmt" },
      { title: "SS2Er ConAmt", data: "ss2ErConAmt" },
      { title: "Total ConAmt", data: "totalConAmt" },
      { title: "Remark", data: "remark" },
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
      buttons: [],
      data: l,
      columns: column,
      // createdRow: function (row, data, td, index) {
      //     if (data.leave === true) {
      //         $(row).css('background-color', 'Yellow');
      //     }
      //     if (data.extension != '-') {
      //         $(row).css('background-color', 'Orange');

      //     }
      // }
    });
  };

  render() {
    return (
      <div>
        {/* <div className="d-flex row justify-content-center align-item-center"> */}
        <div
          className="col-md-12 col-lg-12"
          style={{
            display: "flex",
            flexDirection: "row",
            // justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <div>
            <label style={{ fontSize: 16, marginRight: 20, color: "black" }}>
              Attachment file:
            </label>
          </div>

          <div style={{}}>
            <input
              //   className="dropZone"
              type="file"
              id="attachment"
              name="attachment"
              // multiple
              onChange={this.checkFiles.bind(this)}
            />
          </div>

          {/* <div>
              <label
                htmlFor="attachment"
                className="custom-file-label"
                style={{ marginTop: 50, marginRight: 20 }}
              >
                Attachment file
              </label>
            </div>
            <div className="">
              <input
                className="dropZone"
                type="file"
                id="attachment"
                name="attachment"
                // multiple
                // onChange={this.checkFiles.bind(this)}
              />
            </div> */}
        </div>
        {/* </div> */}
        <div>
          <table
            width="99%"
            className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
            id="dataTables-table"
          />
        </div>
        <div style={{width: '50%', margin: '0px auto'}}>
          <table width={'50%'} class="table table-bordered table-responsive">
            <tbody>
              <tr>
                <th scope="row">Total</th>
                <td></td>
                <td>1419</td>
              </tr>
              <tr>
              <th scope="row">Male</th>
                <td></td>
                <td>829</td>
              </tr>
              <tr>
              <th scope="row">Female</th>
                <td></td>
                <td>620</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

const tableTempData = [
  {
    id: 1,
    name: "hahhahahahaa",
    type: "1234",
  },
  {
    id: 2,
    name: "hahhahahahaa",
    type: "1234",
  },
  {
    id: 3,
    name: "hahhahahahaa",
    type: "1234",
  },
  {
    id: 4,
    name: "hahhahahahaa",
    type: "1234",
  },
  {
    id: 5,
    name: "hahhahahahaa",
    type: "1234",
  },
  {
    id: 6,
    name: "hahhahahahaa",
    type: "1234",
  },
  {
    id: 7,
    name: "hahhahahahaa",
    type: "1234",
  },
];
