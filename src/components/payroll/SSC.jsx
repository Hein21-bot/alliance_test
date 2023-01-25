import React, { Component } from "react";
import "datatables.net-bs4/css/dataTables.bootstrap4.min.css";
import "datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-buttons-dt/css/buttons.dataTables.css";
import "jspdf-autotable";
import moment from "moment";
import * as jsPDF from "jspdf";
import { main_url } from "../../utils/CommonFunction";
import { toast, ToastContainer } from "react-toastify";
import Select from "react-select";
import DatePicker from "react-datetime";
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
      totalEmp: 0,
      regionList: [],
      departmentList: [],
      designationList: [],
      branchList: [],
      selectedRegion: { label: "All", value: 0 },
      selectedDept: { label: "All", value: 0 },
      selectedDesign: { label: "All", value: 0 },
      selectedBranch: { label: "All", value: 0 },
      month: new Date(),
      selectedBranchMain:null,
      selectedBranchMainList: [],
    };
  }

  async componentDidMount() {
    // this.$el = $(this.el);

    // this.setState(
    //   {
    //     dataSource: tableTempData,
    //   },
    //   () => {
    //     this._setTableData(this.state.dataSource);
    //   }
    // );
    await this.getBranchList();
    await this.getDepartmentList();
    await this.getDesignationList();
    await this.getRegionList();
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
        this.setState({ totalEmp: res });
      })
      .catch((error) => console.error(`Fetch Error =\n`, error));
  }

  async getRegionList() {
    fetch(`${main_url}benefit/getRegionList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        var obj = { state_id: 0, state_name: "All" };
        list.push(obj);
        // let lists = list.unshift({ value: 0, label: "All" });
        // console.log('region ===>', lists);
        this.setState({
          regionList: list.map((v) => ({
            label: v.state_name,
            value: v.state_id,
          })),
        });
      });
  }

  async getDepartmentList() {
    fetch(`${main_url}benefit/getDepartmentList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        var obj = { departments_id: 0, deptname: "All" };
        list.push(obj);
        // let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          departmentList: list.map((v) => ({
            label: v.deptname,
            value: v.departments_id,
          })),
        });
      });
  }

  async getDesignationList() {
    fetch(`${main_url}main/getDesignations`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        var obj = { value: 0, label: "All" };
        list.push(obj);
        // let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          designationList: list,
        });
      });
  }

  async getBranchList() {
    fetch(`${main_url}benefit/getBranchList`)
      .then((res) => {
        if (res.ok) return res.json();
      })
      .then((list) => {
        var obj = { value: 0, label: "All" };
        list.push(obj);
        // let lists = list.unshift({ value: 0, label: "All" });
        this.setState({
          branchList: list,
        });
      });
  }

  handleSelectRegion = (e) => {
    this.setState({
      selectedRegion: e,
    });
  };

  handleSelectDept = (e) => {
    this.setState({
      selectedDept: e,
    });
  };

  handleSelectDesign = (e) => {
    this.setState({
      selectedDesign: e,
    });
  };

  handleSelectBranch = (e) => {
    this.setState({
      selectedBranch: e,
    });
  };

  onMonthChange = (e) => {
    this.setState({
      month: e,
    });
  };
 

  // checkFiles(e) {
  //   var files = document.getElementById("attachment").files;
  //   var newDoc = this.state.newDoc;

  //   for (let i = 0; i < files.length; i++) {
  //     var getfile = document.querySelector("#attachment").files[i];
  //     newDoc.push(getfile);
  //   }
  //   // document.querySelector("#attachment").value = "";
  //   const formdata = new FormData();
  //   var imagedata = newDoc[0];
  //   formdata.append("uploadfile", imagedata);
  //   let status = 0;
  //   fetch(main_url + "sscCalculate/addSsc", {
  //     method: "POST",
  //     body: formdata,
  //   })
  //     .then((res) => {
  //       status = res.status;
  //       return res.json();
  //     })
  //     .then((text) => {
  //       if (status == 200) {
  //         this.setState({
  //           dataSource: text,
  //         });
  //         this._setTableData(text);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log("error =====>", err);
  //     });
  // }

  handleCalculate = () => {
    let month = moment(this.state.month).format("YYYY-MM");
    let status = 0;
    
    const branch = this.state.selectedBranchMain ? this.state.selectedBranchMain.value : 0;
    fetch(main_url + `sscCalculate/addSsc/${month}`,{
      
        // method: "POST",
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        // // body: `data=${JSON.stringify(this.state.selectedBranchMain.value)}`,
        // body: `data=${branch}`,
        method: "POST",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify(this.state.selectedBranchMainList),
    })
      .then((res) => {
        if(res.ok) return res.json();
        // status = res.status;
        // console.log(status)
        // return res.json();
      })
      .then((res1) => {
        
        if (res1) {
          this.setState({
            dataSource: res1,
          });
          this._setTableData(res1);
        }else{
          console.log('scc already calculate====>')
          toast.error(moment(this.state.month).format('YYYY-MM')+" ssc is already calculate", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      })
      // .catch((err) => {
        // console.log("error =====>", err);
      // });
  };
  handleSelectBranchMain = (event) => {
    if (event !== null) {
      this.setState({
        selectedBranchMain: event,
        selectedBranchMainList: event.map((v) => v.value),
      });
    } else {
      this.setState({
        selectedBranchMain: "",
      });
    }
  };

  handleSearch = () => {
    const {selectedBranch, selectedDept, selectedDesign, selectedRegion, month} = this.state;
    let month1 = moment(month).format('YYYY-MM');
    let region = selectedRegion.value;
    let dept = selectedDept.value;
    let design = selectedDesign.value;
    let branch = selectedBranch.value;

    let status = 0;
    fetch(main_url + `sscGetData/getSSC_data/${month1}/${region}/${dept}/${design}/${branch}`)
    .then(response => {
      status = response.status;
      return response.json();
    }).then(res => {
      if (status == 200) {
        this.setState({
          dataSource: res,
        });
        this._setTableData(res);
      }
    })
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
        year: moment(data[i].dateName).format("YYYY"),
        dateName: data[i].dateName ? moment(data[i].dateName).format('MMM') : "-",
        erSSN: data[i].ErrssN ? data[i].ErrssN : "-",
        erName: data[i].ErName ? data[i].ErName : "Alliance",
        eeSSN: data[i].ErrssN ? data[i].ErrssN : "-",
        eeName: data[i].fullname ? data[i].fullname : "-",
        salaryAmount: data[i].salaryAmount ? data[i].salaryAmount.toLocaleString('en-US',{maximumFractionDigits:2}) : 0,
        governmentAmount: data[i].governmentAmount
          ? data[i].governmentAmount.toLocaleString('en-US',{maximumFractionDigits:2})
          : 0,
        ss1Ee: data[i].ss1Ee ? data[i].ss1Ee : 0,
        ss1Er: data[i].ss1Er ? data[i].ss1Er : 0,
        ss1EeConAmt: data[i].ss1EeConAmt ? data[i].ss1EeConAmt.toLocaleString('en-US',{maximumFractionDigits:2}) :0,
        ss1ErConAmt: data[i].ss1ErConAmt ? data[i].ss1ErConAmt.toLocaleString('en-US',{maximumFractionDigits:2}) : 0,
        ss2Ee: data[i].ss2Ee ? data[i].ss2Ee : 0,
        ss2Er: data[i].ss2Er ? data[i].ss2Er : 0,
        ss2EeConAmt: data[i].ss2EeConAmt ? data[i].ss2EeConAmt.toLocaleString('en-US',{maximumFractionDigits:2}) : 0,
        ss2ErConAmt: data[i].ss2ErConAmt ? data[i].ss2ErConAmt.toLocaleString('en-US',{maximumFractionDigits:2}) : 0,
        totalConAmt: data[i].totalComAmt ? data[i].totalComAmt.toLocaleString('en-US',{maximumFractionDigits:2}) : 0,
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
      // buttons: [
      //   //     'copy', 'csv',
      //   "excel",
      //   //  , 'pdf'
      // ],
      // buttons: [],
      buttons:  [
        {
                extend: 'csvHtml5',
                title: 'SSC',
        },
        {
            extend: 'excelHtml5',
            title: 'SSC',
        },
        {
            extend: 'pdfHtml5',
            title: 'SSC',
        }],
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
    console.log("selected branch main",this.state.dataSource.reduce((r,c)=>{return r+c.governmentAmount},0))
    const {
      regionList,
      departmentList,
      designationList,
      branchList,
      selectedBranch,
      selectedRegion,
      selectedDept,
      selectedDesign,
      month,
      selectedBranchMain
    } = this.state;
    return (
      <div>
        <ToastContainer position={toast.POSITION.TOP_RIGHT} />

        {/* <div className="d-flex row justify-content-center align-item-center"> */}
        <div className="col-md-12 col-lg-12" style={{marginBottom:10}}>
          <div className="form-horizontal" name="demo-form">
            <div className="row" style={{display:'flex',justifyContent:'center',alignItems:'end'}}>
              <div className="col-md-4">
                <label>Month</label>
                <DatePicker
                  dateFormat="MM/YYYY"
                  value={month}
                  timeFormat={false}
                  onChange={this.onMonthChange.bind(this)}
                />
              </div>
              <div className="col-md-4">
                  <label>Remove Branch</label>
                  <Select
                    options={branchList}
                    name="selecttitle"
                    // isOptionDisabled={(workingDayOptions) => workingDayOptions.disabled}
                    onChange={this.handleSelectBranchMain}
                    value={selectedBranchMain}
                    isClearable={true}
                    isSearchable={true}
                    className="react-select-container checkValidate"
                    classNamePrefix="react-select"
                    isMulti
                    styles={{
                      control: (provided) => ({
                        ...provided,

                        cursor: "pointer",
                      }),
                    }}
                  />
                </div>
              <div className="col-md-4">
                <button
                  className="btn-primary btn"
                  onClick={this.handleCalculate}
                  style={{ marginTop: 20 }}
                >
                  Calculate
                </button>
              </div>
            </div>

            <div className="row" style={{marginTop:10}}>
              <div className="col-md-4">
                <label>Region</label>
                <Select
                  options={regionList}
                  value={selectedRegion}
                  onChange={this.handleSelectRegion}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="col-md-4">
                <label>Department</label>
                <Select
                  options={departmentList}
                  value={selectedDept}
                  onChange={this.handleSelectDept}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="col-md-4">
                <label>Designation</label>
                <Select
                  options={designationList}
                  value={selectedDesign}
                  onChange={this.handleSelectDesign}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
            </div>
            <div className="row" style={{marginTop:10}}>
              <div className="col-md-4">
                <label>Branch</label>
                <Select
                  options={branchList}
                  value={selectedBranch}
                  onChange={this.handleSelectBranch}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
              <div className="col-md-8">
                <div
                  className="row col-md-12"
                  // style={{ marginBottom: 10 }}
                >
                  <button
                    className="btn-primary btn"
                    onClick={this.handleSearch}
                    style={{ marginTop: 20, marginRight: 10 }}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
        <div style={{}}>
          <table
            width="99%"
            className="table table-striped table-bordered table-hover table-responsive nowrap dt-responsive"
            id="dataTables-table"
          />
        </div>
        {this.state.dataSource.length > 0 ? (
          <div style={{ width: "50%", margin: "0px auto" }}>
            <table width={"50%"} class="table table-bordered table-responsive">
              <tbody>
                <tr>
                  <th scope="row">Total</th>
                  <td></td>
                  <td>{this.state.totalEmp[0].count}</td>
                </tr>
                <tr>
                  <th scope="row">Male</th>
                  <td></td>
                  <td>{this.state.totalEmp[2].male}</td>
                </tr>
                <tr>
                  <th scope="row">Female</th>
                  <td></td>
                  <td>{this.state.totalEmp[1].female}</td>
                </tr>
                <tr>
                  <th scope="row">SSC Total</th>
                  <td></td>
                  <td>{this.state.dataSource.reduce((r,c)=>{return r+c.governmentAmount},0).toLocaleString('en-US',{maximumFractionDigits:2})}</td>
                </tr>
                <tr>
                  <th scope="row">SS2Ee Total</th>
                  <td></td>
                  <td>{this.state.dataSource.reduce((r,c)=>{return r+c.ss2EeConAmt},0).toLocaleString('en-US',{maximumFractionDigits:2})}</td>
                </tr>
                <tr>
                  <th scope="row">SS2Er Total</th>
                  <td></td>
                  <td>{this.state.dataSource.reduce((r,c)=>{return r+c.ss2ErConAmt},0).toLocaleString('en-US',{maximumFractionDigits:2})}</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          "-"
        )}
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
